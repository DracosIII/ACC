-- MediMonitor Pro - MySQL schema + seed (acc_data)
-- Utilisation:
--   mysql -u root -p < server/db/schema.sql

CREATE DATABASE IF NOT EXISTS acc_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE acc_data;

-- Drop in dependency order
DROP TABLE IF EXISTS bnt;
DROP TABLE IF EXISTS chute;
DROP TABLE IF EXISTS bpm;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(120) NOT NULL,
  prenom VARCHAR(120) NOT NULL,
  telephone VARCHAR(30) NULL,
  adresse VARCHAR(255) NULL,
  age INT NULL,
  role ENUM('admin','employe','patient') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
  id_patient INT NOT NULL,
  id_employe INT NOT NULL,
  PRIMARY KEY (id_patient, id_employe),
  CONSTRAINT fk_assign_patient FOREIGN KEY (id_patient) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_assign_employee FOREIGN KEY (id_employe) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bpm (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_patient INT NOT NULL,
  valeur_bpm INT NOT NULL,
  date_mesure DATETIME NOT NULL,
  CONSTRAINT fk_bpm_patient FOREIGN KEY (id_patient) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_bpm_patient_date (id_patient, date_mesure)
);

CREATE TABLE chute (
  id_patient INT PRIMARY KEY,
  chute_detectee BOOLEAN NOT NULL DEFAULT FALSE,
  date_chute DATETIME NULL,
  CONSTRAINT fk_chute_patient FOREIGN KEY (id_patient) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bnt (
  id_patient INT PRIMARY KEY,
  appui_detecte BOOLEAN NOT NULL DEFAULT FALSE,
  date_appui DATETIME NULL,
  CONSTRAINT fk_bnt_patient FOREIGN KEY (id_patient) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Seed users
-- Mot de passe pour tous les comptes seed: "changeme"
-- Stocké en SHA-256 hex pour compatibilité avec le hash client.
-- ------------------------------------------------------------
INSERT INTO users (email, password, nom, prenom, telephone, adresse, age, role)
VALUES
  ('admin',   SHA2('changeme', 256), 'Administrateur', 'Système', '0102030405', 'Siège Social, Paris', NULL, 'admin'),
  ('nurse',   SHA2('changeme', 256), 'Infirmier',      'Thomas',  '0611223344', '12 Rue de la Paix',    NULL, 'employe'),
  ('patient', SHA2('changeme', 256), 'Jean',           'Dupont',  '0788996655', '15 Avenue des Champs', 72,   'patient'),
  ('patient2',SHA2('changeme', 256), 'Marie',          'Curie',   NULL,         NULL,                    84,   'patient'),
  ('patient3',SHA2('changeme', 256), 'Paul',           'Martin',  NULL,         NULL,                    65,   'patient'),
  ('patient4',SHA2('changeme', 256), 'Sophie',         'Germain', NULL,         NULL,                    91,   'patient');

-- Assignment: nurse -> patients patient, patient2, patient4
INSERT INTO assignments (id_patient, id_employe)
VALUES
  ((SELECT id FROM users WHERE email='patient'),  (SELECT id FROM users WHERE email='nurse')),
  ((SELECT id FROM users WHERE email='patient2'), (SELECT id FROM users WHERE email='nurse')),
  ((SELECT id FROM users WHERE email='patient4'), (SELECT id FROM users WHERE email='nurse'));

-- Alerts seed
INSERT INTO chute (id_patient, chute_detectee, date_chute)
VALUES
  ((SELECT id FROM users WHERE email='patient'),  FALSE, NULL),
  ((SELECT id FROM users WHERE email='patient2'), TRUE,  NOW()),
  ((SELECT id FROM users WHERE email='patient3'), FALSE, NULL),
  ((SELECT id FROM users WHERE email='patient4'), FALSE, NULL);

INSERT INTO bnt (id_patient, appui_detecte, date_appui)
VALUES
  ((SELECT id FROM users WHERE email='patient'),  FALSE, NULL),
  ((SELECT id FROM users WHERE email='patient2'), FALSE, NULL),
  ((SELECT id FROM users WHERE email='patient3'), FALSE, NULL),
  ((SELECT id FROM users WHERE email='patient4'), TRUE,  NOW());

-- Seed BPM readings: 20 points for each patient (1 minute apart)
INSERT INTO bpm (id_patient, valeur_bpm, date_mesure)
SELECT u.id,
       60 + FLOOR(RAND() * 40),
       DATE_SUB(NOW(), INTERVAL n.n MINUTE)
FROM users u
JOIN (
  SELECT 20 AS n UNION ALL SELECT 19 UNION ALL SELECT 18 UNION ALL SELECT 17 UNION ALL SELECT 16
  UNION ALL SELECT 15 UNION ALL SELECT 14 UNION ALL SELECT 13 UNION ALL SELECT 12 UNION ALL SELECT 11
  UNION ALL SELECT 10 UNION ALL SELECT 9 UNION ALL SELECT 8 UNION ALL SELECT 7 UNION ALL SELECT 6
  UNION ALL SELECT 5 UNION ALL SELECT 4 UNION ALL SELECT 3 UNION ALL SELECT 2 UNION ALL SELECT 1
) n
WHERE u.role = 'patient';

