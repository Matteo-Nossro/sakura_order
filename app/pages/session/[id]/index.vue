<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from 'ofetch'
import { MENU, CATEGORIES, CATEGORY_EMOJI } from '~/utils/menu'
import type { MenuItem } from '~/utils/menu'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id as string

// Auth
const memberId = ref<string | null>(null)
const isHost = ref(false)

// Session state
const session = ref<any | null>(null)
const fetchError = ref(false)

// Local order state
const quantities = ref<Record<string, number>>({})
const initialized = ref(false)

// UI
const activeDish = ref<MenuItem | null>(null)
const activeCategory = ref(CATEGORIES[0])
const categoryRefs = ref<Record<string, Element | null>>({})
function setCategoryRef(cat: string, el: Element | null) { categoryRefs.value[cat] = el }
const listEl = ref<HTMLElement | null>(null)
const viewMode = ref<'grid' | 'list'>('grid')

// Polling + debounce
let pollTimer: ReturnType<typeof setInterval> | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null

// ── Computed ──────────────────────────────────────────────────────────────────

const currentRound = computed(() => {
  if (!session.value) return null
  return session.value.rounds[session.value.currentRoundIndex]
})

const myOrder = computed(() => {
  if (!currentRound.value || !memberId.value) return null
  return currentRound.value.orders[memberId.value]
})

const myConfirmed = computed(() => myOrder.value?.confirmed ?? false)

const allConfirmed = computed(() => {
  if (!session.value || session.value.members.length === 0) return false
  return session.value.members.every(
    (m: any) => currentRound.value?.orders[m.id]?.confirmed === true,
  )
})

const totalItems = computed(() =>
  Object.values(quantities.value).reduce((a: number, b) => a + (b as number), 0),
)

const confirmedCount = computed(() => {
  if (!session.value || !currentRound.value) return 0
  return session.value.members.filter((m: any) => currentRound.value?.orders[m.id]?.confirmed).length
})

const roundNumber = computed(() => (session.value?.currentRoundIndex ?? 0) + 1)

// ── Methods ───────────────────────────────────────────────────────────────────

async function fetchState() {
  try {
    const data = await $fetch<any>(`/api/session/${sessionId}/state`)
    session.value = data
    // Init quantities on first load only
    if (!initialized.value && memberId.value) {
      const order = data.rounds[data.currentRoundIndex]?.orders[memberId.value]
      if (order) {
        for (const item of order.items) {
          quantities.value[item.menuItemId] = item.quantity
        }
      }
      initialized.value = true
    }
  } catch {
    fetchError.value = true
  }
}

function setQty(menuItemId: string, qty: number) {
  quantities.value[menuItemId] = qty
  if (!myConfirmed.value) scheduleAutoSave()
}

function scheduleAutoSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(saveOrder, 500)
}

async function saveOrder() {
  if (!memberId.value || myConfirmed.value) return
  const items = Object.entries(quantities.value)
    .filter(([, qty]) => (qty as number) > 0)
    .map(([menuItemId, quantity]) => ({ menuItemId, quantity: quantity as number }))
  try {
    await $fetch(`/api/session/${sessionId}/order`, {
      method: 'POST',
      body: { memberId: memberId.value, items },
    })
  } catch {}
}

async function confirm() {
  if (!memberId.value) return
  await saveOrder()
  try {
    await $fetch(`/api/session/${sessionId}/confirm`, {
      method: 'POST',
      body: { memberId: memberId.value },
    })
    await fetchState()
  } catch {}
}

async function unconfirm() {
  if (!memberId.value) return
  try {
    await $fetch(`/api/session/${sessionId}/unconfirm`, {
      method: 'POST',
      body: { memberId: memberId.value },
    })
    await fetchState()
  } catch {}
}

async function startNewRound() {
  if (!memberId.value) return
  try {
    await $fetch(`/api/session/${sessionId}/next-round`, {
      method: 'POST',
      body: { memberId: memberId.value },
    })
    quantities.value = {}
    initialized.value = false
    await fetchState()
  } catch {}
}

function scrollToCategory(cat: string) {
  activeCategory.value = cat
  const el = categoryRefs.value[cat] as HTMLElement | null
  if (el && listEl.value) {
    const top = el.offsetTop - 4
    listEl.value.scrollTo({ top, behavior: 'smooth' })
  }
}

function openModal(dish: MenuItem) {
  activeDish.value = dish
}

function handleModalUpdate(menuItemId: string, qty: number) {
  setQty(menuItemId, qty)
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  memberId.value = localStorage.getItem(`member_${sessionId}`)
  isHost.value = localStorage.getItem(`isHost_${sessionId}`) === 'true'

  if (!memberId.value) {
    router.push(`/session/${sessionId}/join`)
    return
  }

  await fetchState()
  pollTimer = setInterval(fetchState, 2000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (saveTimer) clearTimeout(saveTimer)
})

// Group menu by category for display
const menuByCategory = computed(() => {
  const map: Record<string, MenuItem[]> = {}
  for (const cat of CATEGORIES) {
    map[cat] = MENU.filter((d) => d.category === cat)
  }
  return map
})
</script>

<template>
  <div style="height: 100dvh; display: flex; flex-direction: column; overflow: hidden">

    <!-- ── Header ── -->
    <header
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: white;
        border-bottom: 1px solid #e8dfd4;
        flex-shrink: 0;
        gap: 8px;
      "
    >
      <div style="display: flex; align-items: center; gap: 8px; min-width: 0">
        <span style="font-size: 1.1rem; color: #c0392b">桜</span>
        <span
          style="font-size: 0.82rem; color: #7a6a5a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
        >Session <strong style="color: #1c1410; letter-spacing: 0.05em">{{ sessionId }}</strong></span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0">
        <RoundBadge v-if="session" :round="roundNumber" />
        <div
          v-if="session"
          style="
            font-size: 0.75rem;
            color: #7a6a5a;
            background: #f0ebe0;
            border-radius: 999px;
            padding: 2px 10px;
            white-space: nowrap;
          "
        >
          {{ confirmedCount }}/{{ session.members.length }} ✓
        </div>
        <NuxtLink
          :to="`/session/${sessionId}/share`"
          style="font-size: 1rem; color: #7a6a5a; text-decoration: none; padding: 4px"
        >⬡</NuxtLink>
      </div>
    </header>

    <!-- ── Tab bar ── -->
    <SessionTabBar :session-id="sessionId" active="commande" />

    <!-- ── Avatars ── -->
    <div
      v-if="session"
      style="
        display: flex;
        gap: 12px;
        padding: 10px 16px;
        background: white;
        border-bottom: 1px solid #e8dfd4;
        overflow-x: auto;
        flex-shrink: 0;
      "
    >
      <MemberAvatar
        v-for="m in session.members"
        :key="m.id"
        :name="m.name"
        :confirmed="currentRound?.orders[m.id]?.confirmed ?? false"
        :selected="m.id === memberId"
      />
    </div>

    <!-- ── All-confirmed banner ── -->
    <div
      v-if="allConfirmed"
      style="
        background: #fff8e1;
        border-bottom: 2px solid #b8860b;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-shrink: 0;
      "
    >
      <span style="font-size: 0.9rem; color: #1c1410; font-weight: 600">
        🎉 Toute la table a confirmé !
      </span>
      <div style="display: flex; gap: 8px">
        <NuxtLink
          :to="`/session/${sessionId}/recap`"
          style="
            font-size: 0.78rem;
            padding: 6px 12px;
            border-radius: 8px;
            background: #b8860b;
            color: white;
            text-decoration: none;
            font-weight: 600;
          "
        >Voir le récap</NuxtLink>
        <button
          v-if="isHost"
          style="
            font-size: 0.78rem;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1.5px solid #b8860b;
            color: #b8860b;
            background: transparent;
            font-weight: 600;
          "
          @click="startNewRound"
        >Nouvelle tournée</button>
      </div>
    </div>

    <!-- ── Category tabs + view toggle ── -->
    <div
      style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: white;
        border-bottom: 1px solid #e8dfd4;
        flex-shrink: 0;
      "
    >
      <div style="flex: 1; display: flex; gap: 6px; overflow-x: auto; min-width: 0">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          :style="{
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            flexShrink: '0',
            border: '1.5px solid',
            borderColor: activeCategory === cat ? '#c0392b' : '#d4c4a0',
            background: activeCategory === cat ? '#c0392b' : 'transparent',
            color: activeCategory === cat ? 'white' : '#7a6a5a',
            transition: 'all 0.15s',
            cursor: 'pointer',
          }"
          @click="scrollToCategory(cat)"
        >
          {{ CATEGORY_EMOJI[cat] }} {{ cat }}
        </button>
      </div>

      <!-- View mode toggle -->
      <div
        style="
          display: flex;
          flex-shrink: 0;
          border: 1.5px solid #d4c4a0;
          border-radius: 8px;
          overflow: hidden;
        "
      >
        <button
          :style="{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: viewMode === 'grid' ? '#c0392b' : 'transparent',
            color: viewMode === 'grid' ? 'white' : '#7a6a5a',
            fontSize: '0.85rem',
            transition: 'all 0.15s',
            cursor: 'pointer',
          }"
          @click="viewMode = 'grid'"
          title="Mosaïque"
        >⊞</button>
        <button
          :style="{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: viewMode === 'list' ? '#c0392b' : 'transparent',
            color: viewMode === 'list' ? 'white' : '#7a6a5a',
            fontSize: '0.85rem',
            borderLeft: '1.5px solid #d4c4a0',
            transition: 'all 0.15s',
            cursor: 'pointer',
          }"
          @click="viewMode = 'list'"
          title="Liste"
        >☰</button>
      </div>
    </div>

    <!-- ── Dish list (scrollable) ── -->
    <div
      ref="listEl"
      style="flex: 1; overflow-y: auto; padding-bottom: 80px"
    >
      <div
        v-for="cat in CATEGORIES"
        :key="cat"
        :ref="el => setCategoryRef(cat, el)"
      >
        <!-- Category header -->
        <div
          style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 16px 8px;
            position: sticky;
            top: 0;
            background: #f5f0e8;
            z-index: 10;
          "
        >
          <span style="font-size: 1rem">{{ CATEGORY_EMOJI[cat] }}</span>
          <span
            style="
              font-size: 0.95rem;
              font-weight: 700;
              color: #1c1410;
              letter-spacing: 0.03em;
            "
          >{{ cat }}</span>
          <div style="flex: 1; height: 1px; background: #d4c4a0; margin-left: 4px" />
          <span style="font-size: 0.7rem; color: #b5a89a">{{ menuByCategory[cat]?.length ?? 0 }} plats</span>
        </div>

        <!-- Dish grid -->
        <div
          v-if="viewMode === 'grid'"
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 4px 12px 12px;
          "
        >
          <DishCard
            v-for="dish in menuByCategory[cat]"
            :key="dish.id"
            :dish="dish"
            :quantity="quantities[dish.id] ?? 0"
            :disabled="myConfirmed"
            @update:quantity="(qty) => setQty(dish.id, qty)"
            @click="openModal(dish)"
          />
        </div>

        <!-- Dish list -->
        <div v-else style="padding: 0 12px 8px; display: flex; flex-direction: column; gap: 4px">
          <div
            v-for="dish in menuByCategory[cat]"
            :key="dish.id"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '10px',
              border: (quantities[dish.id] ?? 0) > 0 ? '1.5px solid #c0392b' : '1.5px solid #e8dfd4',
              background: (quantities[dish.id] ?? 0) > 0 ? '#fdf0ee' : '#fffdf9',
              cursor: !myConfirmed ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }"
            @click="!myConfirmed && openModal(dish)"
          >
            <!-- Number -->
            <span style="font-size: 0.65rem; color: #b5a89a; min-width: 28px; flex-shrink: 0">N°{{ dish.number }}</span>

            <!-- Name + pieces -->
            <div style="flex: 1; min-width: 0">
              <div style="font-size: 0.85rem; font-weight: 600; color: #1c1410; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ dish.name }}
              </div>
              <div style="font-size: 0.68rem; color: #b5a89a; font-style: italic">
                {{ dish.pieces }} pièce{{ dish.pieces > 1 ? 's' : '' }}
              </div>
            </div>

            <!-- Quantity controls -->
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0" @click.stop>
              <button
                :disabled="(quantities[dish.id] ?? 0) === 0 || myConfirmed"
                :style="{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: (quantities[dish.id] ?? 0) > 0 ? '#c0392b' : '#e8dfd4',
                  color: (quantities[dish.id] ?? 0) > 0 ? 'white' : '#b5a89a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  lineHeight: '1',
                  transition: 'all 0.15s',
                  cursor: (quantities[dish.id] ?? 0) > 0 && !myConfirmed ? 'pointer' : 'default',
                }"
                @click.stop="setQty(dish.id, Math.max(0, (quantities[dish.id] ?? 0) - 1))"
              >−</button>

              <span style="min-width: 18px; text-align: center; font-size: 0.9rem; font-weight: 700; color: #1c1410">
                {{ quantities[dish.id] ?? 0 }}
              </span>

              <button
                :disabled="(quantities[dish.id] ?? 0) >= 10 || myConfirmed"
                :style="{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: (quantities[dish.id] ?? 0) < 10 ? '#c0392b' : '#e8dfd4',
                  color: (quantities[dish.id] ?? 0) < 10 ? 'white' : '#b5a89a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: '700',
                  lineHeight: '1',
                  transition: 'all 0.15s',
                  cursor: (quantities[dish.id] ?? 0) < 10 && !myConfirmed ? 'pointer' : 'default',
                }"
                @click.stop="setQty(dish.id, Math.min(10, (quantities[dish.id] ?? 0) + 1))"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom bar ── -->
    <div
      style="
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 430px;
        padding: 12px 16px;
        background: white;
        border-top: 1px solid #e8dfd4;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 20;
      "
    >
      <div style="flex: 1; min-width: 0">
        <div style="font-size: 0.95rem; font-weight: 700; color: #1c1410">
          {{ totalItems }} plat{{ totalItems !== 1 ? 's' : '' }} sélectionné{{ totalItems !== 1 ? 's' : '' }}
        </div>
        <div v-if="myConfirmed" style="font-size: 0.72rem; color: #27ae60; font-weight: 600">
          ✓ Commande confirmée
        </div>
      </div>

      <button
        v-if="!myConfirmed"
        class="btn-aka"
        style="flex-shrink: 0; padding: 12px 20px; font-size: 0.9rem"
        :disabled="totalItems === 0"
        @click="confirm"
      >Confirmer ma commande</button>

      <button
        v-else
        class="btn-ghost"
        style="flex-shrink: 0; padding: 12px 20px; font-size: 0.9rem"
        @click="unconfirm"
      >Modifier</button>
    </div>

    <!-- ── Dish modal ── -->
    <DishModal
      :dish="activeDish"
      :quantity="activeDish ? (quantities[activeDish.id] ?? 0) : 0"
      @close="activeDish = null"
      @update="handleModalUpdate"
    />
  </div>
</template>
