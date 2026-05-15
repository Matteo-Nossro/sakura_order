# Sakura Order — Contexte technique (AI context)

> Document destiné à être chargé dans les futures conversations pour éviter de tout re-lire.
> Dernière mise à jour : 2026-05-15

---

## Vue d'ensemble

**Sakura Order** est une PWA de commande de groupe pour buffet japonais à volonté.
Chaque session regroupe plusieurs participants qui commandent des plats par tournées (rounds).
L'hôte (premier à rejoindre) contrôle le passage au round suivant.

Stack : **Nuxt 4** (client) + **Nitro** (serveur intégré) + **TailwindCSS 6** + **TypeScript**.
Pas de base de données : stockage **en mémoire** (Map Node.js), TTL 6 heures.

---

## Structure des fichiers

```
sakura_order/
├── app/
│   ├── app.vue                         # Root layout, viewport max-width 430px
│   ├── pages/
│   │   ├── index.vue                   # Accueil : créer ou rejoindre une session
│   │   └── session/[id]/
│   │       ├── index.vue               # Commande (polling 2s, debounce 500ms)
│   │       ├── join.vue                # Saisie du prénom
│   │       ├── share.vue               # Partage du code/lien
│   │       └── recap.vue              # Récap des commandes par membre/round
│   ├── components/
│   │   ├── RoundBadge.vue             # Badge numéro de round
│   │   ├── MemberAvatar.vue           # Avatar initiale + icône confirmation
│   │   ├── DishCard.vue               # Carte plat + contrôles quantité
│   │   └── DishModal.vue              # Modal détail plat
│   └── utils/
│       └── menu.ts                     # 69 items, 7 catégories, interface MenuItem
├── server/
│   ├── api/session/
│   │   ├── create.post.ts             # POST /api/session/create
│   │   └── [id]/
│   │       ├── join.post.ts           # POST /api/session/:id/join
│   │       ├── state.get.ts           # GET  /api/session/:id/state
│   │       ├── order.post.ts          # POST /api/session/:id/order
│   │       ├── confirm.post.ts        # POST /api/session/:id/confirm
│   │       ├── unconfirm.post.ts      # POST /api/session/:id/unconfirm
│   │       └── next-round.post.ts     # POST /api/session/:id/next-round
│   └── utils/
│       ├── store.ts                   # Logique état session (in-memory Map)
│       └── menu.ts                    # Copie serveur du menu
├── public/
│   └── manifest.json                  # PWA manifest
├── nuxt.config.ts                     # Config Tailwind custom + Google Fonts
├── package.json
└── tsconfig.json
```

---

## Modèle de données (store.ts)

```typescript
Session {
  id: string              // 8 chars hex
  createdAt: number
  expiresAt: number       // +6h
  hostId: string          // premier membre
  members: Member[]       // { id: string, name: string }
  rounds: Round[]
  currentRoundIndex: number
}

Round {
  id: string
  orders: Record<memberId, RoundOrder>
}

RoundOrder {
  items: { menuItemId: string; quantity: number }[]
  confirmed: boolean
}

MenuItem {
  id: string
  number: string          // ex: "8A"
  name: string            // en français
  category: string
  pieces: number
}
```

---

## API — Endpoints

| Méthode | Route | Corps | Réponse |
|---------|-------|-------|---------|
| POST | `/api/session/create` | — | `{ sessionId }` |
| POST | `/api/session/:id/join` | `{ name }` | `{ memberId, isHost }` |
| GET  | `/api/session/:id/state` | — | objet Session complet |
| POST | `/api/session/:id/order` | `{ memberId, items[] }` | `{ ok }` |
| POST | `/api/session/:id/confirm` | `{ memberId }` | `{ allConfirmed }` |
| POST | `/api/session/:id/unconfirm` | `{ memberId }` | `{ ok }` |
| POST | `/api/session/:id/next-round` | `{ memberId }` | `{ roundIndex }` |

Règle : seul l'hôte peut appeler `next-round`. Le premier `join` reçoit `isHost: true`.

---

## Flux utilisateur

```
index.vue
  ├─ [créer] → API create → redirect /session/:id/join
  └─ [rejoindre] → saisie code → redirect /session/:id/join

join.vue
  └─ saisie prénom → API join → localStorage(memberId, isHost) → redirect /session/:id

session/:id/index.vue
  ├─ polling GET state (2s)
  ├─ catégories : Entrée 🥟 / Yakitori 🍡 / Sushi 🍣 / Maki 🌿 / Temaki 🌮 / California 🍱 / Soir 🌙
  ├─ DishCard → quantité 0–10 → debounce 500ms → POST order
  ├─ DishModal → vue détaillée + quantité
  ├─ bouton Confirmer → POST confirm → UI grisée (disabled)
  ├─ bouton Modifier → POST unconfirm → UI réactivée
  └─ quand allConfirmed (hôte seulement) → bouton Prochain round → POST next-round

recap.vue
  └─ navigation par membre, tableau commandes par round + totaux
```

---

## Persistance côté client

`localStorage` (clé par sessionId) :
- `memberId` — UUID du membre
- `isHost` — booléen

---

## Design system

**Couleurs (custom Tailwind) :**
| Token | Hex | Usage |
|-------|-----|-------|
| `aka` | `#c0392b` | Rouge primaire, CTA |
| `washi` | `#f5f0e8` | Fond crème |
| `ink` | `#1c1410` | Texte principal |
| `gold` | `#b8860b` | Accents, éléments dorés |
| `muted` | `#7a6a5a` | Texte secondaire |
| `border` | `#d4c4a0` | Bordures légères |
| `card` | `#fffdf9` | Fond des cartes |

**Typographie :** Cormorant Garamond (Google Fonts, serif élégant)

**Layout :** mobile-first, `max-width: 430px`, header/footer fixes, contenu scrollable.

---

## Points techniques à retenir

- **Pas de SSR** : données session entièrement côté serveur Nitro, client en polling — pas de WebSocket.
- **Menu dupliqué** : `app/utils/menu.ts` et `server/utils/menu.ts` sont identiques. Si le menu change, modifier les deux.
- **TTL sessions** : 6h, nettoyage via `sweep()` appelé à chaque accès. Pas de tâche cron.
- **isHost** stocké en localStorage : si l'utilisateur vide son localStorage, il perd le statut hôte (pas de récupération côté serveur).
- **Quantité max** : 10 par plat, contrôlée côté client uniquement.
- **Compatibilité Nuxt 4** : dossier `app/` obligatoire (pas `src/`), composables auto-importés.

---

## Commandes

```bash
npm run dev      # Démarrage dev (http://localhost:3000)
npm run build    # Build production
npm run preview  # Preview du build
```
