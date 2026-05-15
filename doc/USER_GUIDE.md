# Sakura Order — Guide utilisateur

Application de commande collective pour buffet japonais à volonté.

---

## Comment ça marche ?

Sakura Order permet à un groupe de commander ensemble depuis leurs téléphones.
Chaque personne consulte le menu, ajoute ses plats, puis confirme sa commande.
Une fois tout le monde prêt, la tournée (round) est clôturée et une nouvelle peut démarrer.

---

## Démarrer une session (l'organisateur)

1. Ouvrir l'application sur votre téléphone
2. Appuyer sur **Créer une session**
3. Sur la page suivante, entrer votre **prénom**
4. Vous êtes maintenant l'**hôte** de la session
5. Aller sur la page de partage (icône partage) et transmettre le **code** ou le **lien** à vos invités

> L'hôte est toujours la première personne à rejoindre la session.

---

## Rejoindre une session (les invités)

1. Ouvrir le lien reçu, **ou** ouvrir l'application et entrer le code manuellement
2. Entrer votre **prénom**
3. Vous êtes maintenant dans la session, prêt à commander

---

## Commander

### Naviguer dans le menu

Le menu est divisé en 7 catégories :

| Emoji | Catégorie | Contenu |
|-------|-----------|---------|
| 🥟 | Entrée | Amuse-bouches, entrées froides/chaudes |
| 🍡 | Yakitori | Brochettes grillées |
| 🍣 | Sushi | Nigiri |
| 🌿 | Maki | Rouleaux classiques |
| 🌮 | Temaki | Cônes à la main |
| 🍱 | California | Rouleaux spéciaux |
| 🌙 | Soir uniquement | Plats disponibles le soir seulement |

Appuyez sur une catégorie en haut de l'écran pour y accéder directement.

### Ajouter un plat

- Appuyer sur **+** sur une carte pour ajouter une portion
- Appuyer sur **−** pour en retirer
- Maximum **10 portions** par plat
- Appuyer sur la carte pour voir les détails du plat (nombre de pièces, etc.)

### Confirmer votre commande

Quand vous avez fini de choisir, appuyer sur **Confirmer ma commande**.
Votre commande est verrouillée — vous ne pouvez plus la modifier.

Si vous voulez faire des changements, appuyer sur **Modifier** pour déverrouiller.

---

## Le système de rounds (tournées)

Le buffet fonctionne par **tournées successives** :

1. Chaque participant commande et confirme sa sélection
2. Les avatars en haut de l'écran indiquent qui a confirmé ✓
3. Quand **tout le monde a confirmé**, l'hôte peut lancer le round suivant
4. Un nouveau round démarre avec un menu vide pour tout le monde

Il n'y a pas de limite de rounds.

---

## Récapitulatif des commandes

La page **Récap** montre :
- Les commandes de chaque participant, round par round
- Le total de chaque personne sur tous les rounds

Accessible depuis le bouton récap dans l'interface principale.

---

## Partager la session

Sur la page de partage :
- **Copier le lien** — envoie un lien direct à partager
- **Copier le code** — code court à taper manuellement sur l'application

---

## Informations importantes

- La session **expire automatiquement après 6 heures**
- Si vous fermez puis rouvrez l'application, vous retrouvez votre session en rouvrant le même lien
- Si vous videz les données de votre navigateur, vous perdrez votre place dans la session (vous devrez rejoindre à nouveau)
- L'application est optimisée pour **mobile** (portrait)

---

## Démarrer l'application (développeur)

```bash
# Installation des dépendances (première fois)
npm install

# Lancer en développement
npm run dev

# Ouvrir http://localhost:3000
```

Pour la production :
```bash
npm run build
npm run preview
```
