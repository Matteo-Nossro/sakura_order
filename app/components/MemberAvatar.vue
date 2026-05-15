<script setup lang="ts">
defineProps<{
  name: string
  confirmed: boolean
  selected?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-1" style="min-width:44px">
    <div
      class="relative flex items-center justify-center font-bold"
      :style="{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        fontSize: '1rem',
        background: confirmed ? '#c0392b' : '#e8dfd4',
        color: confirmed ? 'white' : '#7a6a5a',
        boxShadow: selected ? '0 0 0 2.5px #b8860b' : 'none',
        transition: 'all 0.2s',
      }"
    >
      {{ name.charAt(0).toUpperCase() }}
      <span
        v-if="confirmed"
        style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #27ae60;
          color: white;
          font-size: 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #f5f0e8;
        "
      >✓</span>
    </div>
    <span
      style="
        font-size: 0.62rem;
        color: #7a6a5a;
        max-width: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      "
    >{{ name }}</span>
  </div>
</template>
