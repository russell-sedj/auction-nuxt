# Enchères en ligne — Nuxt 4 / Vue 3

Plateforme d'enchères full-stack développée avec Nuxt 4 et Vue 3. Le projet couvre l'API REST, la logique métier de validation des offres et l'interface de consultation et de mise à l'enchère.

## Stack

- **Frontend** : Vue 3.5, Nuxt 4.5, TypeScript, vue-router
- **Backend** : API REST Nuxt (`server/api`), logique métier dans `server/service`
- **Stockage** : JSON en mémoire pour le prototype
- **Outils** : npm, VS Code REST Client (`api.http`)

## Fonctionnalités

- Liste des annonces avec prix de départ, meilleure enchère et statut
- Page de détail avec historique des offres
- Formulaire de mise à l'enchère avec affichage des erreurs API
- Validation métier centralisée :
  - pseudo obligatoire ;
  - montant positif ;
  - annonce existante ;
  - annonce non terminée ;
  - montant strictement supérieur à la meilleure enchère et respectant le pas d'enchère.
- Codes HTTP précis : `400` (entrée invalide), `404` (annonce introuvable), `409` (annonce terminée).
- Champs `meilleureEnchere` et `statut` calculés à la volée pour rester toujours cohérents.

## Lancer le projet

```bash
npm install
npm run dev
```

L'application et l'API tournent sur `http://localhost:3000`.

## API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/annonces` | Liste des annonces |
| `GET` | `/api/annonces/:id` | Détail d'une annonce + historique |
| `POST` | `/api/annonces/:id/encheres` | Placer une enchère |

Exemple de corps pour une enchère :

```json
{
  "pseudo": "russell",
  "montant": 3900
}
```

Des exemples de requêtes sont disponibles dans `api.http`.

## Architecture

```text
app/
  app.vue
  pages/
    index.vue              # liste des annonces
    annonces/[id].vue      # détail + formulaire d'enchère
server/
  api/
    annonces.get.ts
    annonces/[id].get.ts
    annonces/[id]/encheres.post.ts
  data/
    annonces.json          # jeu de données de démonstration
  service/
    annonces.ts            # règles métier et validation
```

La logique métier est isolée des routes HTTP. Les routes se contentent de lire les paramètres, appeler le service et traduire le résultat en code HTTP.

## Choix techniques

- **Logique métier dans un service dédié** : les règles de validation sont testables et réutilisables, indépendamment de Nuxt.
- **Statut et meilleure enchère calculés** : le statut ne peut pas devenir obsolète si la date de fin est dépassée.
- **Stockage en mémoire** : suffisant pour un prototype et pour garder le projet simple à lancer. Les données sont rechargées depuis `annonces.json` au démarrage.
- **Codes HTTP explicites** : le frontend peut afficher un message précis selon l'erreur renvoyée.

## Limites et pistes

- Pas de base de données : les enchères sont perdues au redémarrage. Une évolution naturelle serait PostgreSQL ou SQLite avec des transactions.
- Pas d'authentification : le pseudo est fourni librement. Une version production utiliserait des comptes et des JWT.
- Pas de temps réel : la page n'est pas rafraîchie automatiquement. On pourrait ajouter du polling ou des WebSockets.
- Pas de pagination ni de filtres avancés sur la liste.
- Pas de tests automatisés : la fonction de validation est isolée pour pouvoir en ajouter facilement.

## Auteur

Russell Dossou-Yovo — [GitHub](https://github.com/russell-sedj)
