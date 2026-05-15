<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MenuItem } from '~/utils/menu'
import { CATEGORY_EMOJI } from '~/utils/menu'

const props = defineProps<{
  dish: MenuItem | null
  quantity: number
}>()

const emit = defineEmits<{
  close: []
  update: [menuItemId: string, qty: number]
}>()

const localQty = ref(props.quantity)

watch(
  () => props.quantity,
  (v) => { localQty.value = v },
)
watch(
  () => props.dish,
  () => { localQty.value = props.quantity },
)

function confirm() {
  if (props.dish) {
    emit('update', props.dish.id, localQty.value)
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="dish"
        style="
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(0,0,0,0.55);
        "
        @click.self="emit('close')"
      >
        <div
          style="
            width: 100%;
            max-width: 430px;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
            background: #f5f0e8;
          "
          @click.stop
        >
          <!-- Image zone -->
          <div
            style="
              width: 100%;
              height: 220px;
              background: #e8dfd4;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 5rem;
              position: relative;
            "
          >
            <img
              v-if="dish.image"
              :src="dish.image"
              :alt="dish.name"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <span v-else>{{ CATEGORY_EMOJI[dish.category] || '🍱' }}</span>
            <!-- Close button -->
            <button
              @click="emit('close')"
              style="
                position: absolute;
                top: 14px;
                right: 14px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(0,0,0,0.3);
                color: white;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >✕</button>
          </div>

          <!-- Content -->
          <div style="padding: 20px 20px 28px">
            <!-- Meta -->
            <div style="font-size: 0.72rem; color: #7a6a5a; margin-bottom: 4px; letter-spacing: 0.03em">
              N°{{ dish.number }} &nbsp;·&nbsp; {{ dish.category }} &nbsp;·&nbsp;
              {{ dish.pieces }} pièce{{ dish.pieces > 1 ? 's' : '' }}
            </div>

            <!-- Name -->
            <h2
              style="
                font-size: 1.5rem;
                font-weight: 700;
                color: #1c1410;
                margin-bottom: 20px;
                letter-spacing: 0.01em;
              "
            >{{ dish.name }}</h2>

            <!-- Quantity controls -->
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 24px;
                margin-bottom: 24px;
              "
            >
              <button
                @click="localQty > 0 && localQty--"
                style="
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  background: #c0392b;
                  color: white;
                  font-size: 1.5rem;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                :style="localQty === 0 ? { background: '#e8dfd4', color: '#b5a89a' } : {}"
                :disabled="localQty === 0"
              >−</button>

              <span
                style="
                  font-size: 2.5rem;
                  font-weight: 700;
                  color: #1c1410;
                  min-width: 3rem;
                  text-align: center;
                "
              >{{ localQty }}</span>

              <button
                @click="localQty < 10 && localQty++"
                style="
                  width: 44px;
                  height: 44px;
                  border-radius: 50%;
                  background: #c0392b;
                  color: white;
                  font-size: 1.5rem;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                :style="localQty >= 10 ? { background: '#e8dfd4', color: '#b5a89a' } : {}"
                :disabled="localQty >= 10"
              >+</button>
            </div>

            <!-- Confirm button -->
            <button
              class="btn-aka"
              style="width: 100%; font-size: 1.05rem"
              @click="confirm"
            >
              {{ localQty === 0 ? 'Retirer du panier' : 'Ajouter / Mettre à jour' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(100%);
}
</style>
