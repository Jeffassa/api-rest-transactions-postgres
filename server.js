const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/db'); 
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

db.connect()
    .then(() => {
        console.log('connecté à la base de données PostgreSQL.');
    })
    .catch((err) => {
        console.error('crreur de connexion à la base de données PostgreSQL:', err.message);
        process.exit(1); 
    });

app.use(express.json()); 
app.get('/', (req, res) => {
    res.json({ message: "L'API REST des utilisateurs et transactions est opérationnelle." });
});

app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`serveur démarré sur http://localhost:${PORT}`);
});