<script setup lang="ts">
defineProps<{ round: number }>()
</script>

<template>
  <span
    style="
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      background: #fdf0ee;
      color: #c0392b;
      border: 1px solid #c0392b;
    "
  >
    Tournée {{ round }}
  </span>
</template>
