# 🌐 MediMonitor Pro - Web Application

<div align="center">
  <p><strong>[ <a href="#en-english">EN</a> | <a href="#fr-français">FR</a> ]</strong></p>
</div>

---

## [EN] English

### Overview
This directory contains the web application for **MediMonitor Pro**. It comprises the frontend React application and the Express backend API, which interact with a MySQL database to display real-time vital signs of patients.

### 🛠️ Technologies
- **Frontend**: React 19, Vite, TailwindCSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MySQL 8.
- **Tools**: bcryptjs for hashing, Google OAuth & Microsoft MSAL for authentication.

### ⚙️ Setup & Development
1. Navigate to this directory: `cd Serveur/web`
2. Install dependencies: `npm install`
3. Duplicate the `.env.example` to `.env` and configure your localized environment variables.
4. Run the development environment: `npm run dev` (runs both frontend and backend concurrently).

### 🚀 Production Deployment
Use the included `docker-compose.yml` to spin up the required stack (Database, Dashboard, Netdata):
```bash
docker-compose up -d
```

---

## [FR] Français

### Aperçu
Ce dossier contient l'application web pour **MediMonitor Pro**. Il comprend l'application frontend React et l'API backend Express, qui interagissent avec une base de données MySQL pour afficher les signes vitaux des patients en temps réel.

### 🛠️ Technologies
- **Frontend** : React 19, Vite, TailwindCSS, Recharts, Lucide Icons.
- **Backend** : Node.js, Express.
- **Base de données** : MySQL 8.
- **Outils** : bcryptjs pour le hachage, Google OAuth et Microsoft MSAL pour l'authentification.

### ⚙️ Installation & Développement
1. Accédez à ce dossier : `cd Serveur/web`
2. Installez les dépendances : `npm install`
3. Dupliquez le fichier `.env.example` en `.env` et configurez vos variables d'environnement locales.
4. Lancez l'environnement de développement : `npm run dev` (exécute le frontend et le backend en simultané).

### 🚀 Déploiement en Production
Utilisez le `docker-compose.yml` inclus pour lancer la stack nécessaire (Base de données, Dashboard, Netdata) :
```bash
docker-compose up -d
```

---
**License**: [Apache License 2.0](../../LICENSE) 
**Security Policy**: Please review the [SECURITY.md](../../SECURITY.md) at the root of the repository.
