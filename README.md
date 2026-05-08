# NestJS Task Manager API

> API REST de gestion de tâches collaboratives — multi-utilisateurs, multi-projets, avec authentification JWT et permissions basées sur les rôles.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📋 À propos

Cette API permet à plusieurs utilisateurs de collaborer sur des projets en se partageant des tâches. Chaque utilisateur peut créer ses propres projets, y inviter d'autres membres, assigner des tâches et suivre leur progression.

Le projet a été conçu comme une base solide et réutilisable pour toute application de gestion de tâches type Trello, Asana ou Todoist.

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** — inscription, connexion, refresh token
- 👥 **Gestion multi-utilisateurs** — chaque user n'accède qu'à ses ressources
- 📁 **Projets** — création, modification, suppression, partage entre membres
- ✅ **Tâches** — CRUD complet avec statuts (à faire / en cours / terminé), priorités, dates d'échéance
- 🛡️ **Permissions par rôle** — owner, member, viewer
- 💬 **Commentaires** sur les tâches (collaboration)
- 📚 **Documentation Swagger** auto-générée et accessible en ligne
- 🧪 **Validation** des données entrantes via class-validator
- 🗄️ **ORM Prisma** pour des requêtes type-safe sur PostgreSQL

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | NestJS 10 |
| Langage | TypeScript |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Authentification | Passport + JWT |
| Documentation | Swagger / OpenAPI |
| Validation | class-validator, class-transformer |
| Tests | Jest |

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

### Installation

```bash
# Cloner le repo
git clone https://github.com/JeanJoelMetodjo/-nestjs-task-manager.git
cd -nestjs-task-manager

# Installer les dépendances
npm install

# Copier le fichier d'environnement et le configurer
cp .env.example .env
```

### Configuration

Éditez le fichier `.env` avec vos propres valeurs :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
JWT_SECRET="votre_secret_jwt_super_securise"
JWT_EXPIRATION="1d"
PORT=3000
```

### Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Visualiser la base avec Prisma Studio
npx prisma studio
```

### Lancement

```bash
# Mode développement (hot reload)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API est accessible sur `http://localhost:3000`.
La documentation Swagger est sur `http://localhost:3000/api/docs`.

## 📡 Endpoints principaux

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/auth/register` | Création d'un compte |
| `POST` | `/auth/login` | Connexion (retourne le JWT) |
| `POST` | `/auth/refresh` | Rafraîchir le token |

### Projets

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/projects` | Liste des projets de l'utilisateur |
| `POST` | `/projects` | Créer un projet |
| `GET` | `/projects/:id` | Détails d'un projet |
| `PATCH` | `/projects/:id` | Modifier un projet |
| `DELETE` | `/projects/:id` | Supprimer un projet |

### Tâches

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/projects/:id/tasks` | Tâches d'un projet |
| `POST` | `/projects/:id/tasks` | Créer une tâche |
| `PATCH` | `/tasks/:id` | Modifier une tâche |
| `DELETE` | `/tasks/:id` | Supprimer une tâche |

> 📖 La liste complète et le détail de chaque endpoint sont disponibles dans Swagger.

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

## 📂 Structure du projet

```
src/
├── auth/              # Authentification & JWT
├── users/             # Gestion des utilisateurs
├── projects/          # Module Projets
├── tasks/             # Module Tâches
├── common/            # Guards, pipes, decorators partagés
├── prisma/            # Service Prisma
├── app.module.ts
└── main.ts

prisma/
└── schema.prisma      # Schéma de la base de données
```

## 🗺️ Roadmap

- [ ] Notifications par email lors d'une assignation
- [ ] Système de tags / labels sur les tâches
- [ ] Pièces jointes (upload de fichiers)
- [ ] WebSocket pour les mises à jour en temps réel
- [ ] Tableau Kanban via une route dédiée
- [ ] Déploiement Docker + CI/CD

## 👤 Auteur

**Jean-Joël Metodjo**
Développeur back-end — Bénin

- GitHub : [@JeanJoelMetodjo](https://github.com/JeanJoelMetodjo)

## 📄 Licence

Ce projet est distribué sous licence MIT — voir le fichier `LICENSE` pour plus de détails.

---

⭐ Si ce projet vous a été utile, n'hésitez pas à laisser une étoile !