<template>
  <div class="min-h-screen flex justify-center" style="background:#160a04">
    <div class="w-full max-w-[430px] min-h-screen relative isolate" style="background:#f5f0e8">
      <SakuraBg />
      <NuxtPage />
    </div>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --aka: #c0392b;
  --washi: #f5f0e8;
  --ink: #1c1410;
  --gold: #b8860b;
  --muted: #7a6a5a;
  --border: #d4c4a0;
  --card: #fffdf9;
  --ff: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
}

body {
  font-family: var(--ff);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

input, button, select, textarea {
  font-family: var(--ff);
}

input::placeholder {
  color: var(--muted);
  font-style: italic;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

.btn-aka {
  background: var(--aka);
  color: white;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: opacity 0.15s;
}
.btn-aka:hover { opacity: 0.88; }
.btn-aka:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-ghost {
  border: 1.5px solid var(--border);
  color: var(--muted);
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  background: transparent;
  transition: border-color 0.15s;
}
.btn-ghost:hover { border-color: var(--aka); color: var(--aka); }

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s;
}
.input-field:focus { border-color: var(--aka); }
</style>
