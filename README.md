## [EN]
# Accounting Management Application (TFE)

> An accounting management web application developed as a final year project (TFE). It allows users to manage clients, quotes, invoices, and visualize data through a dashboard.


---

## ✨ Features

* **User Management:** Secure user registration and login system.
* **Dashboard:** Interactive dashboard with key metrics and charts (powered by Chart.js).
* **Client Management:** CRUD operations for clients.
* **Quote & Invoice Management:** Create, read, update, and delete quotes and invoices.
* **PDF Generation:** Generate PDF documents for invoices and quotes using Dompdf.
* **Email Functionality:** Send documents and notifications via email using PHPMailer.

---

## 🛠️ Tech Stack

* **Frontend:** HTML, JavaScript, TailwindCSS
* **Backend:** PHP / NodeJS
* **Database:** MySQL 
* **PHP Libraries:**
    * `vlucas/phpdotenv`: For environment variable management.
    * `phpmailer/phpmailer`: For sending emails.
    * `dompdf/dompdf`: For generating PDFs from HTML.
* **JS Libraries:**
    * `chart.js`: For creating interactive charts.
    * `apexcharts`: Another charting library available.

---

## 🚀 Getting Started

To set up a local copy of this project, you will need a local server environment like XAMPP, WAMP, or MAMP.

### Prerequisites

* A PHP server environment (e.g., Apache)
* PHP 8.0 or higher
* Composer (for PHP dependencies)
* Node.js and npm (for frontend dependencies)
* A MySQL/MariaDB database server

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/DracosIII/ACC.git](https://github.com/DracosIII/ACC.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd ACC
    ```

3.  **Install PHP dependencies:**
    ```sh
    composer install
    ```

4.  **Install frontend dependencies:**
    ```sh
    npm install
    ```

5.  **Set up the database:**
    * Create a new database in your MySQL/MariaDB server (e.g., via phpMyAdmin).
    * Import the `comptabilite.sql` file into your newly created database.

6.  **Configure environment variables:**
    * Rename the `.env.example` file to `.env`.
    * Update the `.env` file with your database credentials (DB_HOST, DB_NAME, DB_USER, DB_PASS).

7.  **Build the CSS:**
    The project uses TailwindCSS. To compile the CSS file, run the following command:
    ```sh
    npm run build-css
    ```
    *Note: During development, you can use `npm run watch-css` to automatically recompile the CSS on changes.*

8.  **Run the project:**
    Place the project folder in your local server's web directory (e.g., `htdocs` for XAMPP) and access it via your browser (e.g., `http://localhost/ACC`).

---

## 📜 License

This project is distributed under the Apache 2.0 License. See the `LICENSE` file for more information.

---

## 👤 Author

**Martin Stordeur**

* **Website:** [stordeur-martin.be](https://stordeur-martin.be)
* **GitHub:** [@DracosIII](https://github.com/DracosIII)


## [FR] 
# Application de Gestion Comptable (TFE)

> Une application web de gestion comptable développée dans le cadre d'un Travail de Fin d'Études (TFE). Elle permet de gérer des clients, des devis, des factures et de visualiser des données via un tableau de bord.



---

## ✨ Fonctionnalités

* **Gestion des utilisateurs :** Système d'inscription et de connexion sécurisé.
* **Tableau de bord :** Dashboard interactif avec graphiques et indicateurs clés (propulsé par Chart.js).
* **Gestion des clients :** Opérations CRUD pour les clients.
* **Gestion des devis et factures :** Créer, lire, mettre à jour et supprimer des devis et factures.
* **Génération de PDF :** Générer des documents PDF pour les factures et devis avec Dompdf.
* **Envoi d'e-mails :** Envoyer des documents et notifications par e-mail avec PHPMailer.

---

## 🛠️ Stack Technique

* **Frontend :** HTML, JavaScript, TailwindCSS
* **Backend :** PHP/NodeJS
* **Base de données :** MySQL
* **Librairies PHP :**
    * `vlucas/phpdotenv` : Pour la gestion des variables d'environnement.
    * `phpmailer/phpmailer` : Pour l'envoi d'e-mails.
    * `dompdf/dompdf` : Pour la génération de PDF à partir de HTML.
* **Librairies JS :**
    * `chart.js` : Pour créer des graphiques interactifs.
    * `apexcharts` : Autre librairie de graphiques disponible.

---

## 🚀 Démarrage

Pour installer une copie locale de ce projet, vous aurez besoin d'un environnement de serveur local comme XAMPP, WAMP ou MAMP.

### Prérequis

* Un environnement de serveur PHP (ex: Apache)
* PHP 8.0 ou supérieur
* Composer (pour les dépendances PHP)
* Node.js et npm (pour les dépendances frontend)
* Un serveur de base de données MySQL/MariaDB

### Installation

1.  **Clonez le dépôt :**
    ```sh
    git clone [https://github.com/DracosIII/ACC.git](https://github.com/DracosIII/ACC.git)
    ```

2.  **Naviguez vers le dossier du projet :**
    ```sh
    cd ACC
    ```

3.  **Installez les dépendances PHP :**
    ```sh
    composer install
    ```

4.  **Installez les dépendances frontend :**
    ```sh
    npm install
    ```

5.  **Configurez la base de données :**
    * Créez une nouvelle base de données dans votre serveur MySQL/MariaDB (ex: via phpMyAdmin).
    * Importez le fichier `comptabilite.sql` dans la base de données que vous venez de créer.

6.  **Configurez les variables d'environnement :**
    * Renommez le fichier `.env.example` en `.env`.
    * Mettez à jour le fichier `.env` avec vos informations de connexion à la base de données (DB_HOST, DB_NAME, DB_USER, DB_PASS).

7.  **Compilez le CSS :**
    Le projet utilise TailwindCSS. Pour compiler le fichier CSS, exécutez la commande suivante :
    ```sh
    npm run build-css
    ```
    *Note : Pendant le développement, vous pouvez utiliser `npm run watch-css` pour recompiler automatiquement le CSS lors de chaque modification.*

8.  **Lancez le projet :**
    Placez le dossier du projet dans le répertoire web de votre serveur local (ex: `htdocs` pour XAMPP) et accédez-y via votre navigateur (ex: `http://localhost/ACC`).

---

## 📜 Licence

Ce projet est distribué sous la licence Apache 2.0. Consultez le fichier `LICENSE` pour plus d'informations.

---

## 👤 Auteur

**Martin Stordeur**

* **Site web :** [stordeur-martin.be](https://stordeur-martin.be)
* **GitHub :** [@DracosIII](https://github.com/DracosIII)
