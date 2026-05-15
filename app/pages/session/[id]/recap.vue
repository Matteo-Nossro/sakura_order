<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from 'ofetch'
import { MENU } from '~/utils/menu'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id as string

const memberId = ref<string | null>(null)
const isHost = ref(false)
const session = ref<any | null>(null)
const fetchError = ref(false)
const openMemberId = ref<string | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null

// ── Helpers ───────────────────────────────────────────────────────────────────

function getRoundOrders(roundIdx: number, mId: string) {
  const round = session.value?.rounds[roundIdx]
  if (!round) return []
  const order = round.orders[mId]
  if (!order?.items?.length) return []
  return order.items
    .filter((i: any) => i.quantity > 0)
    .map((i: any) => {
      const dish = MENU.find((d) => d.id === i.menuItemId)
      return { dish, quantity: i.quantity }
    })
    .filter((i: any) => i.dish)
}

function getRoundTotal(roundIdx: number, mId: string) {
  return getRoundOrders(roundIdx, mId).reduce((sum: number, i: any) => sum + i.quantity, 0)
}

function getTotalForMember(mId: string) {
  if (!session.value) return []
  const totals: Record<string, number> = {}
  for (let i = 0; i < session.value.rounds.length; i++) {
    for (const item of getRoundOrders(i, mId)) {
      totals[item.dish!.id] = (totals[item.dish!.id] ?? 0) + item.quantity
    }
  }
  return Object.entries(totals)
    .map(([id, qty]) => ({ dish: MENU.find((d) => d.id === id)!, quantity: qty }))
    .filter((i) => i.dish)
}

function getTableRoundOrders(roundIdx: number) {
  if (!session.value) return []
  const totals: Record<string, number> = {}
  for (const m of session.value.members) {
    for (const item of getRoundOrders(roundIdx, m.id)) {
      totals[item.dish!.id] = (totals[item.dish!.id] ?? 0) + item.quantity
    }
  }
  return Object.entries(totals)
    .map(([id, qty]) => ({ dish: MENU.find((d) => d.id === id)!, quantity: qty }))
    .filter((i) => i.dish)
}

const tableGrandTotal = computed(() => {
  if (!session.value) return []
  const totals: Record<string, number> = {}
  for (let i = 0; i < session.value.rounds.length; i++) {
    for (const item of getTableRoundOrders(i)) {
      totals[item.dish!.id] = (totals[item.dish!.id] ?? 0) + item.quantity
    }
  }
  return Object.entries(totals)
    .map(([id, qty]) => ({ dish: MENU.find((d) => d.id === id)!, quantity: qty }))
    .filter((i) => i.dish)
})

function getTableRoundTotal(roundIdx: number) {
  return getTableRoundOrders(roundIdx).reduce((s, i) => s + i.quantity, 0)
}

function toggleMember(mId: string) {
  openMemberId.value = openMemberId.value === mId ? null : mId
}

// ── Methods ───────────────────────────────────────────────────────────────────

async function fetchState() {
  try {
    const data = await $fetch<any>(`/api/session/${sessionId}/state`)
    session.value = data
  } catch {
    fetchError.value = true
  }
}

async function startNewRound() {
  if (!memberId.value) return
  try {
    await $fetch(`/api/session/${sessionId}/next-round`, {
      method: 'POST',
      body: { memberId: memberId.value },
    })
    router.push(`/session/${sessionId}`)
  } catch {}
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
  openMemberId.value = memberId.value
  pollTimer = setInterval(fetchState, 2000)
})

onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
</script>

<template>
  <div style="height: 100dvh; display: flex; flex-direction: column; overflow: hidden">

    <!-- Header -->
    <header
      style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: white;
        border-bottom: 1px solid #e8dfd4;
        flex-shrink: 0;
      "
    >
      <div style="flex: 1">
        <div style="font-size: 1rem; font-weight: 700; color: #1c1410">Récapitulatif</div>
        <div style="font-size: 0.75rem; color: #7a6a5a">Session {{ sessionId }}</div>
      </div>
      <NuxtLink
        :to="`/session/${sessionId}/share`"
        style="font-size: 0.78rem; color: #7a6a5a; text-decoration: none"
      >Partager</NuxtLink>
    </header>

    <!-- Tab bar -->
    <SessionTabBar :session-id="sessionId" active="recap" />

    <!-- Accordion list -->
    <div style="flex: 1; overflow-y: auto; padding: 12px 12px 100px">

      <div v-if="!session" style="text-align: center; padding: 40px; color: #7a6a5a">
        Chargement...
      </div>

      <div
        v-for="m in session?.members"
        :key="m.id"
        style="margin-bottom: 8px; border-radius: 10px; background: white; overflow: hidden; border: 1px solid #e8dfd4"
      >
        <!-- Accordion header -->
        <button
          style="
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
          "
          @click="toggleMember(m.id)"
        >
          <span
            :style="{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#c0392b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: '700',
              flexShrink: '0',
            }"
          >{{ m.name.charAt(0).toUpperCase() }}</span>

          <span style="flex: 1; font-size: 1rem; font-weight: 700; color: #1c1410">
            {{ m.name }}
            <span v-if="m.id === memberId" style="font-size: 0.72rem; color: #7a6a5a; font-weight: 400"> (vous)</span>
          </span>

          <span style="font-size: 0.8rem; color: #7a6a5a">
            {{ openMemberId === m.id ? '▲' : '▼' }}
          </span>
        </button>

        <!-- Accordion body -->
        <div v-if="openMemberId === m.id" style="padding: 0 14px 14px">

          <!-- Per-round -->
          <div
            v-for="(round, idx) in session.rounds"
            :key="round.id"
            style="margin-bottom: 14px"
          >
            <!-- Round header -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px">
              <RoundBadge :round="Number(idx) + 1" />
              <div style="flex: 1; height: 1px; background: #e8dfd4" />
              <span
                v-if="getRoundTotal(Number(idx), m.id) > 0"
                style="font-size: 0.78rem; color: #7a6a5a; white-space: nowrap"
              >{{ getRoundTotal(Number(idx), m.id) }} plat{{ getRoundTotal(Number(idx), m.id) > 1 ? 's' : '' }}</span>
            </div>

            <div
              v-if="getRoundOrders(Number(idx), m.id).length === 0"
              style="font-size: 0.85rem; color: #b5a89a; font-style: italic; padding: 2px 0"
            >Aucune commande</div>

            <div v-else>
              <div
                v-for="item in getRoundOrders(Number(idx), m.id)"
                :key="item.dish?.id"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
                  padding: 5px 0;
                  border-bottom: 1px solid #f0ebe0;
                  font-size: 1rem;
                  color: #1c1410;
                "
              >
                <span>
                  <span style="color: #b5a89a; font-size: 0.82rem; margin-right: 8px">N°{{ item.dish?.number }}</span>{{ item.dish?.name }}
                </span>
                <span style="color: #c0392b; font-weight: 700; margin-left: 12px">×{{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <!-- Grand total -->
          <div v-if="getTotalForMember(m.id).length > 0" style="margin-top: 4px">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px">
              <span style="font-size: 0.75rem; font-weight: 700; color: #b8860b; text-transform: uppercase; letter-spacing: 0.04em">Total</span>
              <div style="flex: 1; height: 1px; background: #b8860b; opacity: 0.4" />
            </div>
            <div>
              <div
                v-for="item in getTotalForMember(m.id)"
                :key="item.dish?.id"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
                  padding: 5px 0;
                  border-bottom: 1px solid #f0e8c0;
                  font-size: 1rem;
                  color: #1c1410;
                "
              >
                <span>
                  <span style="color: #b5a89a; font-size: 0.82rem; margin-right: 8px">N°{{ item.dish?.number }}</span>{{ item.dish?.name }}
                </span>
                <span style="color: #b8860b; font-weight: 700; margin-left: 12px">×{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Table totals ── -->
      <div v-if="session && tableGrandTotal.length > 0" style="margin-top: 16px">

        <!-- Separator -->
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 0 2px">
          <div style="flex: 1; height: 1px; background: #d4c4a0" />
          <span style="font-size: 0.75rem; color: #7a6a5a; white-space: nowrap">Toute la table</span>
          <div style="flex: 1; height: 1px; background: #d4c4a0" />
        </div>

        <!-- Par tournée -->
        <div
          v-for="(round, idx) in session.rounds"
          :key="round.id"
          style="margin-bottom: 8px; border-radius: 10px; background: white; overflow: hidden; border: 1px solid #e8dfd4"
        >
          <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #f0ebe0">
            <RoundBadge :round="Number(idx) + 1" />
            <div style="flex: 1; height: 1px; background: #e8dfd4" />
            <span
              v-if="getTableRoundTotal(Number(idx)) > 0"
              style="font-size: 0.78rem; color: #7a6a5a"
            >{{ getTableRoundTotal(Number(idx)) }} plats</span>
          </div>
          <div style="padding: 4px 14px 10px">
            <div
              v-if="getTableRoundOrders(Number(idx)).length === 0"
              style="font-size: 0.85rem; color: #b5a89a; font-style: italic; padding: 6px 0"
            >Aucune commande</div>
            <div
              v-for="item in getTableRoundOrders(Number(idx))"
              v-else
              :key="item.dish?.id"
              style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                padding: 5px 0;
                border-bottom: 1px solid #f0ebe0;
                font-size: 1rem;
                color: #1c1410;
              "
            >
              <span>
                <span style="color: #b5a89a; font-size: 0.82rem; margin-right: 8px">N°{{ item.dish?.number }}</span>{{ item.dish?.name }}
              </span>
              <span style="color: #c0392b; font-weight: 700; margin-left: 12px">×{{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- Grand total table -->
        <div style="border-radius: 10px; background: #fffbf0; overflow: hidden; border: 1px solid #d4aa40">
          <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid #e8d99a">
            <span style="font-size: 0.78rem; font-weight: 700; color: #b8860b; text-transform: uppercase; letter-spacing: 0.05em">Total général</span>
            <div style="flex: 1; height: 1px; background: #b8860b; opacity: 0.3" />
            <span style="font-size: 0.78rem; color: #b8860b">
              {{ tableGrandTotal.reduce((s, i) => s + i.quantity, 0) }} plats
            </span>
          </div>
          <div style="padding: 4px 14px 10px">
            <div
              v-for="item in tableGrandTotal"
              :key="item.dish?.id"
              style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                padding: 5px 0;
                border-bottom: 1px solid #f0e8c0;
                font-size: 1rem;
                color: #1c1410;
              "
            >
              <span>
                <span style="color: #b5a89a; font-size: 0.82rem; margin-right: 8px">N°{{ item.dish?.number }}</span>{{ item.dish?.name }}
              </span>
              <span style="color: #b8860b; font-weight: 700; margin-left: 12px">×{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Host: new round button -->
    <div
      v-if="isHost"
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
        z-index: 20;
      "
    >
      <button
        class="btn-aka"
        style="width: 100%"
        @click="startNewRound"
      >Lancer la tournée suivante</button>
    </div>
  </div>
</template>
