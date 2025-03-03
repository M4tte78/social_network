# 🏋️ Gym Social Network

### 🚀 **Le réseau social pour les passionnés de sport et de musculation**  
Gym Social Network est une plateforme dédiée aux athlètes, amateurs de fitness et passionnés de musculation. Partagez vos entraînements, interagissez avec la communauté, envoyez des messages privés en temps réel et bien plus encore !

---

## 🌟 **Fonctionnalités Clés**
- 🔒 **Authentification sécurisée** avec JWT (JSON Web Token)
- 📝 **Création et affichage de posts** avec images et descriptions
- 💬 **Messagerie privée en temps réel** grâce à Socket.IO
- ❤️ **Système de likes et de commentaires** sur les publications
- 📱 **Interface responsive** élégante et moderne avec Bootstrap et Material UI
- ⚙️ **Panneau d’administration** pour gérer les utilisateurs et les publications

---

## 🛠️ **Technologies Utilisées**

### 🖥️ **Frontend** (React + Vite)
- ⚛️ **React.js** — Bibliothèque JavaScript pour construire des interfaces utilisateur interactives
- ⚡ **Vite** — Environnement de développement ultra rapide
- 🎨 **Bootstrap / Material UI** — Styles modernes et réactifs
- 🔗 **Axios** — Gestion des requêtes API
- 🌍 **React Router** — Navigation rapide et fluide

### 🌐 **Backend** (Node.js + Express)
- 🚀 **Node.js** — Serveur backend asynchrone et rapide
- 🏗️ **Express.js** — Framework minimaliste pour construire des API
- 🔐 **JWT (JSON Web Token)** — Sécurisation de l'authentification utilisateur
- 🛢️ **MySQL** — Base de données relationnelle robuste
- ⚡ **Socket.IO** — Communication en temps réel pour la messagerie privée
- 🔑 **Bcrypt.js** — Hachage sécurisé des mots de passe

---

## ⚙️ **Installation et Configuration**

### 📥 **1. Cloner le projet**
```sh
git clone https://github.com/M4tte78/social_network.git
cd social_network
📦 2. Installation des dépendances
📂 Backend

cd backend
npm install

📂 Frontend

cd frontend
npm install

🗄️ 3. Configuration de la Base de Données
Créez une base de données MySQL et configurez le fichier .env dans le dossier backend :

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

mysql -u root -p gym_social < database.sql

🚀 4. Lancer le projet
🔧 Backend

cd backend
npm run dev
🌐 Frontend

cd frontend
npm run dev

🤝 Contribuer au projet
Les contributions sont les bienvenues ! Si vous souhaitez ajouter des fonctionnalités, corriger des bugs ou améliorer le design, n'hésitez pas à forker le projet et à soumettre une Pull Request.

📄 Licence
Ce projet est sous licence MIT. Vous pouvez librement l'utiliser, le modifier et le distribuer.

💬 Contact
Pour toute question ou suggestion, n'hésitez pas à me contacter via LinkedIn ou Twitter.

⭐ N’oubliez pas de donner une étoile sur GitHub si vous aimez ce projet ! ⭐