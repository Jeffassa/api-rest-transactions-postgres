# Mini API REST - Gestion des Utilisateurs et Transactions (Express/PostgreSQL)

## Objectif

Cette API permet la gestion de base des utilisateurs et l'enregistrement de transactions financières, conformément aux exigences du Test 1.

## Prérequis

* Node.js (version 16+)
* PostgreSQL (version 12+)
* Un client HTTP pour les tests (ex: Postman, Thunder Client)

## Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://www.wordreference.com/fren/d%C3%A9p%C3%B4t](https://www.wordreference.com/fren/d%C3%A9p%C3%B4t)
    cd mon-api-rest-utilisateurs
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configuration de la base de données :**
    * Créez une base de données PostgreSQL.
    * Créez un fichier `.env` à la racine et renseignez vos identifiants (voir la structure dans le code).

4.  **Création des tables SQL :**
    Exécutez les scripts SQL suivants dans votre base de données :

    ```sql
    -- 1. Table Utilisateurs
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telephone VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Type ENUM pour les statuts de transaction
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

    -- 3. Table Transactions
    CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        montant DECIMAL(10, 2) NOT NULL,
        statut transaction_status NOT NULL,
        date DATE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```

## Utilisation

Démarrez le serveur :

```bash
npm start