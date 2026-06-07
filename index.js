const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir les fichiers statiques (CSS, images, scripts)
// Cela permet à votre HTML de trouver "/res/css/styles.css" et "logo.png"
app.use(express.static(path.join(__dirname, 'public')));
app.use('/res', express.static(path.join(__dirname, 'res')));

// 2. Route principale : afficher le fichier index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Gestion du "Catch-all" (Redirige toutes les autres routes vers index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur BitView est en ligne sur : http://localhost:${PORT}`);
});
