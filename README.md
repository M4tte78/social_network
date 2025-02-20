# 🏋️ Gym Social Network

🚀 **Gym Social Network** est un réseau social dédié aux passionnés de sport et de musculation.  
Les utilisateurs peuvent partager leurs entraînements, discuter en privé et interagir avec la communauté en temps réel.

---

## 🌟 Fonctionnalités
✔️ **Authentification sécurisée** (JWT)  
✔️ **Création et affichage de posts**  
✔️ **Messagerie privée en temps réel** (Socket.IO)  
✔️ **Système de likes et commentaires**  
✔️ **Interface responsive avec Bootstrap et Material UI**  
✔️ **Page d’administration pour gérer les utilisateurs et les publications**  

---

## 🏗️ Technologies Utilisées

### 🖥️ **Frontend** (React + Vite)
- ⚛️ **React.js** (Framework Frontend)
- 💨 **Vite** (Environnement de développement rapide)
- 🎨 **Bootstrap / Material UI** (Design UI)
- 🔗 **Axios** (Gestion des requêtes API)
- 🌍 **React Router** (Navigation)

### 🖥️ **Backend** (Node.js + Express)
- 🚀 **Node.js** (Serveur backend)
- 🏗️ **Express.js** (Framework web)
- 🔐 **JWT (JSON Web Token)** (Sécurisation de l'authentification)
- 🛢️ **MySQL** (Base de données relationnelle)
- ⚡ **Socket.IO** (Messagerie en temps réel)
- 🏗 **Bcrypt.js** (Hachage des mots de passe)

---

## 🔧 Installation et Configuration

### 📦 **1. Cloner le projet**
```sh
git clone https://github.com/ton-utilisateur/gym-social-network.git
cd gym-social-network

🚀 2. Installation des dépendances
📂 Backend
sh
Copier
Modifier
cd backend
npm install
📂 Frontend
sh
Copier
Modifier
cd frontend
npm install
⚙️ 3. Configuration de la Base de Données
Crée une base de données MySQL et configure le fichier .env dans le dossier backend :
env
Copier
Modifier
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=gym_social
JWT_SECRET=ton_secret_jwt
Importer le fichier SQL si nécessaire :
sh
Copier
Modifier
mysql -u root -p gym_social < database.sql
🎯 4. Lancer le projet
🚀 Backend
sh
Copier
Modifier
cd backend
npm run dev
🚀 Frontend
sh
Copier
Modifier
cd frontend
npm run dev# reseau_social2
