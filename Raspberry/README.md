# 🍓 MediMonitor Pro - Raspberry Pi Gateway Environment

<div align="center">
  <p><strong>[ <a href="#en-english">EN</a> | <a href="#fr-français">FR</a> ]</strong></p>
</div>

---

## [EN] English

### Overview
This directory contains the necessary Docker configurations to run the local IoT gateway edge infrastructure for **MediMonitor Pro** on a Raspberry Pi. 

### 🔧 Services Setup
The provided `docker-compose.yml` configures essential IoT and networking tools for local health monitoring node operations:
- **Technitium DNS:** Local ad-blocking and DNS server.
- **Nginx Proxy Manager:** Reverse proxy and SSL management.
- **NTopNG & Redis:** Network traffic analysis and flow monitoring.
- **Wireguard (wg-easy):** Access infrastructure securely via OpenVPN/Wireguard.
- **Home Assistant:** Main local domotics platform for receiving IoT sensor data.

### 🚀 Getting Started
On your local Raspberry Pi, install Docker and Docker Compose. Once ready:
1. Ensure ports 80, 443, 51820 are available.
2. Edit `docker-compose.yml` properties if needed (IPs or specific domains).
3. Run the stack:
   ```bash
   docker-compose up -d
   ```

---

## [FR] Français

### Aperçu
Ce dossier contient la configuration Docker nécessaire au déploiement de l'infrastructure passerelle IoT locale pour **MediMonitor Pro** sur un Raspberry Pi.

### 🔧 Services Inclus
Le fichier `docker-compose.yml` déploie les outils de domotique et de réseau essentiels au bon fonctionnement des capteurs patients en local :
- **Technitium DNS :** Serveur DNS et blocage local de publicités.
- **Nginx Proxy Manager :** Reverse proxy et gestionnaire Let's Encrypt / SSL.
- **NTopNG & Redis :** Analyse de trafic et supervision du réseau.
- **Wireguard (wg-easy) :** Accès distant sécurisé à l'infrastructure via VPN.
- **Home Assistant :** La plateforme de domotique centrale pour intégrer, analyser et transmettre les remontées IoT locales.

### 🚀 Démarrage
Sur votre Raspberry Pi, installez préalablement Docker et Docker Compose. Une fois prêt :
1. Assurez-vous que les ports 80, 443, et 51820 sont libres.
2. Éditez le fichier `docker-compose.yml` si vous avez besoin de changer des variables système (IPs spécifiques).
3. Lancez la pile de conteneurs :
   ```bash
   docker-compose up -d
   ```

---
**License**: [Apache License 2.0](../LICENSE) 
**Security Policy**: Please review the [SECURITY.md](../SECURITY.md) at the root of the repository.
