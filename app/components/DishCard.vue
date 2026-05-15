<script setup lang="ts">
import type { MenuItem } from '~/utils/menu'

const props = defineProps<{
  dish: MenuItem
  quantity: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:quantity': [value: number]
  click: []
}>()

function inc() {
  if (props.quantity < 10) emit('update:quantity', props.quantity + 1)
}
function dec() {
  if (props.quantity > 0) emit('update:quantity', props.quantity - 1)
}
</script>

<template>
  <div
    class="relative flex flex-col cursor-pointer"
    :style="{
      borderRadius: '12px',
      padding: '10px',
      border: quantity > 0 ? '1.5px solid #c0392b' : '1.5px solid #e8dfd4',
      background: quantity > 0 ? '#fdf0ee' : '#fffdf9',
      transition: 'all 0.15s',
    }"
    @click="!disabled && emit('click')"
  >
    <!-- Image -->
    <div
      style="
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        background: #f0ebe0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 8px;
        overflow: hidden;
      "
    >
      <img
        v-if="dish.image"
        :src="dish.image"
        :alt="dish.name"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
      <span v-else>🍱</span>
    </div>

    <!-- Number -->
    <div style="font-size: 0.65rem; color: #7a6a5a; line-height: 1">N°{{ dish.number }}</div>

    <!-- Name -->
    <div
      style="
        font-size: 0.82rem;
        font-weight: 600;
        color: #1c1410;
        line-height: 1.25;
        margin: 3px 0;
        flex: 1;
      "
    >
      {{ dish.name }}
    </div>

    <!-- Pieces -->
    <div style="font-size: 0.7rem; color: #7a6a5a; font-style: italic; margin-bottom: 8px">
      {{ dish.pieces }} pièce{{ dish.pieces > 1 ? 's' : '' }}
    </div>

    <!-- Quantity controls -->
    <div class="flex items-center justify-center gap-2" @click.stop>
      <button
        :disabled="quantity === 0 || disabled"
        :style="{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: quantity > 0 ? '#c0392b' : '#e8dfd4',
          color: quantity > 0 ? 'white' : '#b5a89a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          fontWeight: '700',
          lineHeight: '1',
          transition: 'all 0.15s',
          cursor: quantity > 0 && !disabled ? 'pointer' : 'default',
        }"
        @click.stop="dec"
      >−</button>

      <span
        style="
          min-width: 20px;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1c1410;
        "
      >{{ quantity }}</span>

      <button
        :disabled="quantity >= 10 || disabled"
        :style="{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: quantity < 10 ? '#c0392b' : '#e8dfd4',
          color: quantity < 10 ? 'white' : '#b5a89a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          fontWeight: '700',
          lineHeight: '1',
          transition: 'all 0.15s',
          cursor: quantity < 10 && !disabled ? 'pointer' : 'default',
        }"
        @click.stop="inc"
      >+</button>
    </div>
  </div>
</template>
