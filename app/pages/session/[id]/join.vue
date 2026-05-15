<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { $fetch } from 'ofetch'

const route = useRoute()
const router = useRouter()
const sessionId = route.params.id as string

const name = ref('')
const loading = ref(false)
const error = ref('')

async function join() {
  const n = name.value.trim()
  if (!n) { error.value = 'Entre ton prénom pour continuer.'; return }
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ memberId: string; isHost: boolean }>(
      `/api/session/${sessionId}/join`,
      { method: 'POST', body: { name: n } },
    )
    localStorage.setItem(`member_${sessionId}`, res.memberId)
    localStorage.setItem(`isHost_${sessionId}`, String(res.isHost))
    router.push(`/session/${sessionId}`)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Session introuvable ou expirée.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    "
  >
    <!-- Header -->
    <div
      style="
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e8dfd4;
        gap: 12px;
      "
    >
      <NuxtLink
        to="/"
        style="color: #7a6a5a; font-size: 1.2rem; text-decoration: none; padding: 4px"
      >←</NuxtLink>
      <span style="font-size: 1rem; color: #c0392b; font-weight: 600">桜 Sakura Order</span>
    </div>

    <!-- Content -->
    <div
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 24px;
      "
    >
      <!-- Session badge -->
      <div style="text-align: center; margin-bottom: 36px">
        <div style="font-size: 0.8rem; color: #7a6a5a; margin-bottom: 6px; letter-spacing: 0.05em">
          TABLE
        </div>
        <div
          style="
            font-size: 2.2rem;
            font-weight: 700;
            color: #1c1410;
            letter-spacing: 0.15em;
            background: white;
            border: 2px solid #d4c4a0;
            border-radius: 12px;
            padding: 8px 24px;
          "
        >{{ sessionId }}</div>
      </div>

      <div style="width: 100%; max-width: 300px">
        <label style="display: block; font-size: 0.85rem; color: #7a6a5a; margin-bottom: 8px">
          Ton prénom
        </label>
        <input
          v-model="name"
          class="input-field"
          placeholder="ex: Matthieu"
          autofocus
          @keyup.enter="join"
        />

        <p v-if="error" style="color: #c0392b; font-size: 0.82rem; margin-top: 8px">{{ error }}</p>

        <button
          class="btn-aka"
          style="width: 100%; margin-top: 16px; font-size: 1.05rem"
          :disabled="loading || !name.trim()"
          @click="join"
        >
          {{ loading ? 'Connexion...' : 'Rejoindre la table' }}
        </button>
      </div>
    </div>
  </div>
</template>
