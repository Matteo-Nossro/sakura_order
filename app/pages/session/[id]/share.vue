<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'

const route = useRoute()
const sessionId = route.params.id as string
const copied = ref(false)
const qrDataUrl = ref<string | null>(null)

const joinUrl = computed(() =>
  typeof window !== 'undefined'
    ? `${window.location.origin}/session/${sessionId}/join`
    : ''
)

onMounted(async () => {
  const url = `${window.location.origin}/session/${sessionId}/join`
  qrDataUrl.value = await QRCode.toDataURL(url, {
    width: 240,
    margin: 2,
    color: { dark: '#1c1410', light: '#f5f0e8' },
  })
})

function copyLink() {
  navigator.clipboard.writeText(joinUrl.value).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}

function copyCode() {
  navigator.clipboard.writeText(sessionId).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>

<template>
  <div
    style="
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    "
  >
    <!-- Header -->
    <header
      style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: white;
        border-bottom: 1px solid #e8dfd4;
      "
    >
      <NuxtLink
        :to="`/session/${sessionId}`"
        style="color: #7a6a5a; font-size: 1.2rem; text-decoration: none; padding: 4px"
      >←</NuxtLink>
      <span style="font-size: 1rem; font-weight: 700; color: #1c1410">Inviter des amis</span>
    </header>

    <!-- Content -->
    <div
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 24px;
        gap: 28px;
      "
    >
      <!-- Decorative -->
      <div style="font-size: 2.5rem; opacity: 0.6">桜</div>

      <!-- QR Code -->
      <div
        style="
          background: #f5f0e8;
          border: 2px solid #d4c4a0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        "
      >
        <img
          v-if="qrDataUrl"
          :src="qrDataUrl"
          alt="QR code d'invitation"
          style="width: 200px; height: 200px; border-radius: 8px"
        />
        <div
          v-else
          style="width: 200px; height: 200px; background: #e8dfd4; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #b5a89a; font-size: 0.8rem"
        >Génération…</div>
        <p style="font-size: 0.72rem; color: #7a6a5a; font-style: italic; margin: 0">Scanner pour rejoindre</p>
      </div>

      <div style="text-align: center">
        <div style="font-size: 0.85rem; color: #7a6a5a; margin-bottom: 12px; letter-spacing: 0.05em">
          CODE DE SESSION
        </div>
        <div
          style="
            font-size: 3rem;
            font-weight: 700;
            color: #1c1410;
            letter-spacing: 0.2em;
            background: white;
            border: 2px solid #d4c4a0;
            border-radius: 16px;
            padding: 16px 32px;
            margin-bottom: 12px;
          "
        >{{ sessionId }}</div>
        <p style="font-size: 0.8rem; color: #7a6a5a; font-style: italic">
          Partagez ce code à vos convives
        </p>
      </div>

      <!-- Buttons -->
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px">
        <button
          class="btn-aka"
          style="width: 100%"
          @click="copyLink"
        >
          {{ copied ? '✓ Lien copié !' : 'Copier le lien d\'invitation' }}
        </button>
        <button
          class="btn-ghost"
          style="width: 100%"
          @click="copyCode"
        >Copier le code</button>
      </div>

      <!-- Instructions -->
      <div
        style="
          background: white;
          border-radius: 12px;
          padding: 16px;
          max-width: 280px;
          width: 100%;
          border: 1px solid #e8dfd4;
        "
      >
        <p style="font-size: 0.82rem; color: #7a6a5a; line-height: 1.6">
          Vos amis doivent :
        </p>
        <ol style="font-size: 0.82rem; color: #1c1410; line-height: 1.8; margin-top: 8px; padding-left: 16px">
          <li>Ouvrir le lien ou aller sur l'application</li>
          <li>Entrer le code <strong>{{ sessionId }}</strong></li>
          <li>Saisir leur prénom</li>
          <li>Commander !</li>
        </ol>
      </div>
    </div>
  </div>
</template>
