<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { $fetch } from 'ofetch'

const router = useRouter()
const code = ref('')
const loading = ref(false)
const error = ref('')

async function createTable() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ sessionId: string }>('/api/session/create', { method: 'POST' })
    router.push(`/session/${res.sessionId}/join`)
  } catch {
    error.value = 'Impossible de créer la session. Réessayez.'
  } finally {
    loading.value = false
  }
}

function joinTable() {
  const c = code.value.trim().toUpperCase()
  if (!c) return
  router.push(`/session/${c}/join`)
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 24px;
    "
  >
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 48px">
      <div style="font-size: 3.5rem; line-height: 1; margin-bottom: 8px">桜</div>
      <h1
        style="
          font-size: 2.2rem;
          font-weight: 700;
          color: #c0392b;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        "
      >Sakura Order</h1>
      <p style="font-size: 0.95rem; color: #7a6a5a; font-style: italic">
        Commander ensemble, savourer ensemble
      </p>
    </div>

    <!-- Create button -->
    <div style="width: 100%; max-width: 320px; margin-bottom: 8px">
      <button
        class="btn-aka"
        style="width: 100%; font-size: 1.05rem; letter-spacing: 0.04em"
        :disabled="loading"
        @click="createTable"
      >
        {{ loading ? 'Création...' : 'Créer une table' }}
      </button>
    </div>

    <p v-if="error" style="color: #c0392b; font-size: 0.85rem; margin-bottom: 8px">{{ error }}</p>

    <!-- Divider -->
    <div
      style="
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 320px;
        margin: 20px 0;
        gap: 12px;
      "
    >
      <div style="flex: 1; height: 1px; background: #d4c4a0" />
      <span style="color: #7a6a5a; font-size: 0.85rem; font-style: italic">ou</span>
      <div style="flex: 1; height: 1px; background: #d4c4a0" />
    </div>

    <!-- Join form -->
    <div style="width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px">
      <input
        v-model="code"
        class="input-field"
        placeholder="Code de session (ex: A3F9)"
        style="text-transform: uppercase; letter-spacing: 0.08em; text-align: center"
        @keyup.enter="joinTable"
      />
      <button class="btn-ghost" style="width: 100%" @click="joinTable">
        Rejoindre une table
      </button>
    </div>

    <!-- Footer -->
    <div style="position: absolute; bottom: 24px; font-size: 0.7rem; color: #b5a89a; text-align: center">
      Sessions de 6 heures · Buffet japonais à volonté
    </div>
  </div>
</template>
