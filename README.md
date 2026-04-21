# 🏥 Projet ACC / MediMonitor Pro

![Security Status](https://img.shields.io/github/checks-status/DracosIII/ACC/main?label=security&logo=github)
![Dependabot](https://img.shields.io/badge/dependabot-enabled-blue?logo=dependabot)

### 🛠️ Technologies, Système & Réseau

**Infrastructure & Réseau**
> ![Cisco](https://img.shields.io/badge/Cisco-049fd9?style=flat&logo=cisco&logoColor=white) ![Proxmox](https://img.shields.io/badge/Proxmox-E74C3C?style=flat&logo=proxmox&logoColor=white) ![Ubuntu](https://img.shields.io/badge/Ubuntu_Server-E95420?style=flat&logo=ubuntu&logoColor=white) ![Windows Server](https://img.shields.io/badge/Windows_Server-0078D6?style=flat&logo=microsoft&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

**Développement & Bases de données**
> ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) ![phpMyAdmin](https://img.shields.io/badge/phpMyAdmin-6C78AF?style=flat&logo=phpmyadmin&logoColor=white) ![Azure](https://img.shields.io/badge/Azure-0089D6?style=flat&logo=microsoftazure&logoColor=white) ![Google Maps](https://img.shields.io/badge/Maps-4285F4?style=flat&logo=googlemaps&logoColor=white) ![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-C51A4A?style=flat&logo=raspberrypi&logoColor=white)
### 📊 Statistiques de contribution
![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=DracosIII&theme=tokyonight&hide_border=true)

<p align="left">
  <img src="https://github-readme-stats.vercel.app/api?username=DracosIII&show_icons=true&theme=tokyonight&hide_border=true" height="150" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=DracosIII&layout=compact&theme=tokyonight&hide_border=true" height="150" />
</p>

<div align="center">
  <p><strong>[ <a href="#en-english">EN</a> | <a href="#fr-français">FR</a> ]</strong></p>
</div>

---

## [EN] English

> **MediMonitor Pro (ACC Project)** is a comprehensive IoT health monitoring system designed for healthcare facilities. It encompasses a React-based monitoring dashboard, an Express/MySQL backend for data management, and a robust self-hosted infrastructure deployable via Docker (Netdata, Heimdall, Wireguard, Home Assistant, etc.).

### ✨ Key Features

**1. MediMonitor Dashboard (Web Application)**
*   **Real-time Monitoring:** Track patients' heart rates (BPM), fall detections (`chute`), and emergency physical button presses (`bnt`).
*   **Role-Based Access Control:** Configurable user roles (Super Admin, Admin, Caregiver) with secure authentication (bcrypt + Azure MSAL/Google OAuth support).
*   **Patient & Employee Management:** CRUD operations for patients and hospital staff, with assignment logic to link specific caregivers to specific patients.
*   **Interactive Visualizations:** Historical vital sign charts using Recharts.
*   **Location Tracking:** Integrated with Google Maps for patient tracking.

**2. Infrastructure & Server Stack**
*   **Server Environment:** Production-ready `docker-compose` setup featuring MySQL, PhpMyAdmin, Netdata (for host monitoring), and Heimdall (dashboard).
*   **Raspberry Pi Gateway:** Advanced networking configuration with Technitium DNS, Nginx Proxy Manager, NTopNG (network monitoring), Wireguard VPN, and Home Assistant for local IoT integration.

### 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Lucide React.
*   **Backend:** Node.js (Express), MySQL 8.
*   **Auth & Security:** bcryptjs, Microsoft MSAL, Google OAuth.
*   **Infrastructure & DevOps:** Docker, Docker Compose, Nginx Proxy Manager, Wireguard, Netdata.

### 🚀 Getting Started

**Starting the Infrastructure:**
1.  Clone this repository to your host server or Raspberry Pi.
2.  To spin up the databases and monitoring tools, navigate to `Serveur/web/` and run:
    ```sh
    docker-compose up -d
    ```
3.  *(Optional)* For the Raspberry Pi VPN/DNS gateway stack, navigate to `Raspberry/` and run `docker-compose up -d`.

**Starting the Application:**
1.  Navigate to the web app directory: `cd Serveur/web`.
2.  Copy `.env.example` to `.env` and fill in your DB credentials and API keys.
3.  Import the database schema and seed data located at `server/db/schema.sql` into MySQL.
4.  Install dependencies: `npm install`.
5.  Start the development server (Frontend + Backend concurrently): `npm run dev`.
6.  Access the web dashboard in your browser.

---

## [FR] Français

> **MediMonitor Pro (Projet ACC)** est un système IoT complet de télésurveillance médicale conçu pour les établissements de santé. Il comprend un tableau de bord React, une API Express/MySQL pour la gestion des données, et une infrastructure auto-hébergée robuste déployable via Docker (Netdata, Heimdall, Wireguard, Home Assistant, etc.).

### ✨ Fonctionnalités Principales

**1. Dashboard MediMonitor (Application Web)**
*   **Surveillance en temps réel :** Suivi du pouls des patients (BPM), détection de chutes (`chute`), et activation des boutons d'appel d'urgence (`bnt`).
*   **Contrôle d'accès par rôle (RBAC) :** Rôles configurables (Super Admin, Admin, Personnel soignant) avec authentification sécurisée (bcrypt + support Azure MSAL/Google OAuth).
*   **Gestion des patients et employés :** Opérations CRUD pour gérer le personnel et les patients, avec un système d'assignation pour lier un soignant à ses patients.
*   **Visualisations interactives :** Graphiques de l'historique des signes vitaux avec Recharts.
*   **Suivi géographique :** Intégration Google Maps pour le suivi d'adresses ou de positions.

**2. Infrastructure et Stack Serveur**
*   **Environnement Serveur :** Configuration `docker-compose` prête pour la production avec MySQL, PhpMyAdmin, Netdata (surveillance du serveur) et Heimdall (portail d'accueil).
*   **Passerelle Raspberry Pi :** Configuration réseau avancée comprenant Technitium DNS, Nginx Proxy Manager, NTopNG (surveillance réseau), Wireguard VPN et Home Assistant pour l'intégration IoT locale.

### 🛠️ Stack Technique

*   **Frontend :** React 19, Vite, Tailwind CSS, Recharts, Lucide React.
*   **Backend :** Node.js (Express), MySQL 8.
*   **Auth & Sécurité :** bcryptjs, Microsoft MSAL, Google OAuth.
*   **Infrastructure & DevOps :** Docker, Docker Compose, Nginx Proxy Manager, Wireguard, Netdata.

### 🚀 Démarrage rapide

**Démarrer l'infrastructure :**
1.  Clonez ce dépôt sur votre serveur hôte ou votre Raspberry Pi.
2.  Pour lancer les bases de données et outils de surveillance, naviguez vers `Serveur/web/` et exécutez :
    ```sh
    docker-compose up -d
    ```
3.  *(Optionnel)* Pour la passerelle Raspberry Pi (VPN, DNS), naviguez vers `Raspberry/` et lancez `docker-compose up -d`.

**Démarrer l'Application :**
1.  Naviguez vers le dossier de l'application web : `cd Serveur/web`.
2.  Copiez `.env.example` vers `.env` et remplissez vos accès DB et clés API.
3.  Importez le schéma de base de données situé dans `server/db/schema.sql` dans votre MySQL.
4.  Installez les dépendances : `npm install`.
5.  Lancez l'environnement de développement (Frontend + Backend en simultané) : `npm run dev`.
6.  Accédez à l'application web via votre navigateur.

---

## 📜 Licence / License

Ce projet est distribué sous la **Licence Apache 2.0**. Consultez le fichier `LICENSE` pour plus d'informations. / *This project is distributed under the Apache 2.0 License. See the `LICENSE` file for more information.*

---

## 👤 Auteur / Author

**Martin Stordeur**
*   **Website:** [stordeur-martin.be](https://stordeur-martin.be)
*   **GitHub:** [@DracosIII](https://github.com/DracosIII)
