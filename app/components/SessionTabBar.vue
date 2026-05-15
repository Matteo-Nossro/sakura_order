<script setup lang="ts">
defineProps<{ sessionId: string; active: 'commande' | 'recap' }>()
</script>

<template>
  <div
    style="
      display: flex;
      background: white;
      border-bottom: 1px solid #e8dfd4;
      flex-shrink: 0;
    "
  >
    <NuxtLink
      :to="`/session/${sessionId}`"
      :style="{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 0',
        fontSize: '0.88rem',
        fontWeight: '600',
        textDecoration: 'none',
        borderBottom: active === 'commande' ? '2px solid #c0392b' : '2px solid transparent',
        color: active === 'commande' ? '#c0392b' : '#7a6a5a',
      }"
    >
      🍱 Commande
    </NuxtLink>
    <NuxtLink
      :to="`/session/${sessionId}/recap`"
      :style="{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 0',
        fontSize: '0.88rem',
        fontWeight: '600',
        textDecoration: 'none',
        borderBottom: active === 'recap' ? '2px solid #c0392b' : '2px solid transparent',
        color: active === 'recap' ? '#c0392b' : '#7a6a5a',
      }"
    >
      📋 Récap
    </NuxtLink>
  </div>
</template>
