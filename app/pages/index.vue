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

function onCodeInput(e: Event) {
  code.value = (e.target as HTMLInputElement).value.toUpperCase()
}
</script>

<template>
  <div class="home">
    <!-- Washi horizontal rules -->
    <div class="washi-rules" aria-hidden="true">
      <div class="washi-line" style="top: 18%" />
      <div class="washi-line" style="top: 82%" />
    </div>

    <!-- Centered content -->
    <div class="home-inner">
      <!-- Kana mark -->
      <p class="kana-mark">── 桜 ──</p>

      <!-- Logo circle -->
      <div class="logo-circle" aria-hidden="true">
        <span class="logo-emoji">🌸</span>
      </div>

      <!-- Title block -->
      <div class="title-block">
        <h1 class="title-main">Sakura Order</h1>
        <p class="title-sub">
          Commandez ensemble, à volonté<br>
          <span class="kana-sub">たべほ</span>
        </p>
      </div>

      <!-- Horizontal rule -->
      <div class="title-rule" />

      <!-- Create table button -->
      <button class="btn-create" :disabled="loading" @click="createTable">
        {{ loading ? 'Création…' : 'Créer une table' }}
      </button>

      <!-- Error -->
      <p v-if="error" class="error-msg">{{ error }}</p>

      <!-- Separator -->
      <div class="separator">
        <div class="sep-line" />
        <span class="sep-label">ou</span>
        <div class="sep-line" />
      </div>

      <!-- Code input -->
      <input
        :value="code"
        class="code-input"
        placeholder="Code de table  ·  ex: SAKURA42"
        maxlength="10"
        @input="onCodeInput"
        @keyup.enter="joinTable"
      />

      <!-- Join button -->
      <button class="btn-join" @click="joinTable">
        Rejoindre la table
      </button>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 32px 32px;
  position: relative;
  overflow: hidden;
}

/* Washi rules */
.washi-rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.washi-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 0.5px;
  background: linear-gradient(90deg, transparent, #d5cfc5 30%, #d5cfc5 70%, transparent);
}

/* Content wrapper */
.home-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 326px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Kana mark */
.kana-mark {
  font-size: 11px;
  color: #b5952a;
  letter-spacing: 0.22em;
  margin-bottom: 20px;
  font-family: var(--ff);
}

/* Logo */
.logo-circle {
  width: 82px;
  height: 82px;
  background: radial-gradient(circle at 40% 35%, rgba(192, 57, 43, 0.18), rgba(192, 57, 43, 0.10));
  border: 1.5px solid rgba(192, 57, 43, 0.30);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  margin-bottom: 18px;
  box-shadow: 0 4px 24px rgba(192, 57, 43, 0.15);
}
.logo-emoji {
  line-height: 1;
  user-select: none;
}

/* Title */
.title-block {
  text-align: center;
  margin-bottom: 36px;
}
.title-main {
  font-size: 40px;
  font-weight: 600;
  color: #1a0d08;
  font-family: var(--ff);
  line-height: 1;
  letter-spacing: -0.015em;
}
.title-sub {
  font-size: 12px;
  color: #8a7e74;
  font-family: var(--ff);
  margin-top: 10px;
  line-height: 1.7;
  letter-spacing: 0.04em;
}
.kana-sub {
  letter-spacing: 0.18em;
  color: #b5952a;
  font-size: 13px;
}

/* Horizontal rule */
.title-rule {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, #d5cfc5, transparent);
  margin-bottom: 28px;
}

/* Buttons */
.btn-create {
  width: 100%;
  height: 52px;
  background: var(--aka);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--ff);
  cursor: pointer;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(192, 57, 43, 0.45);
  letter-spacing: 0.01em;
  transition: opacity 0.15s;
}
.btn-create:hover { opacity: 0.88; }
.btn-create:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-join {
  width: 100%;
  height: 48px;
  background: transparent;
  color: var(--aka);
  border: 1.5px solid var(--aka);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--ff);
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.15s;
}
.btn-join:hover { background: rgba(192, 57, 43, 0.05); }

/* Error */
.error-msg {
  color: var(--aka);
  font-size: 13px;
  text-align: center;
  margin-top: -12px;
  margin-bottom: 8px;
}

/* Separator */
.separator {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-bottom: 18px;
}
.sep-line {
  flex: 1;
  height: 1px;
  background: #e0d8cc;
}
.sep-label {
  font-size: 12px;
  color: #8a7e74;
  font-family: var(--ff);
}

/* Input */
.code-input {
  width: 100%;
  height: 48px;
  background: #fff;
  border: 1px solid #e0d8cc;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 13.5px;
  font-family: var(--ff);
  color: #1a0d08;
  margin-bottom: 10px;
  outline: none;
  letter-spacing: 0.05em;
  text-align: center;
  transition: border-color 0.15s;
}
.code-input:focus { border-color: var(--aka); }
.code-input::placeholder { color: #b5a89a; font-style: italic; letter-spacing: 0.02em; }
</style>
