// routes/transactions.js

const express = require('express');
const router = express.Router();
const transactionModel = require('../models/transactionModel'); 

// ------------------------------------
// 🎯 1. POST /api/transactions (CRÉATION)
// ------------------------------------
router.post('/', async (req, res) => {
    try {
        const { user_id, montant, statut, date } = req.body;

        if (!user_id || !montant || !statut || !date) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const transaction = await transactionModel.create(user_id, montant, statut, date);

        res.status(201).json({ message: "Transaction créée avec succès.", transaction });

    } catch (error) {
        console.error("Erreur création transaction :", error.message);

        if (error.message.includes('Statut invalide') || error.message.includes('L\'utilisateur spécifié')) {
             return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Erreur serveur inattendue lors de la création de la transaction." });
    }
});

// ------------------------------------
// 🎯 2. GET /api/transactions (LIRE TOUT)
// ------------------------------------
router.get('/', async (req, res) => {
    try {
        const transactions = await transactionModel.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Erreur liste transactions :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des transactions." });
    }
});

// ------------------------------------
// 🎯 3. GET /api/transactions/:id (LIRE PAR ID)
// ------------------------------------
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID de transaction invalide." });
        }

        const transaction = await transactionModel.findById(id);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction non trouvée." });
        }

        res.status(200).json(transaction);

    } catch (error) {
        console.error("Erreur récupération transaction par ID :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la transaction." });
    }
});

// ------------------------------------
// 🎯 4. PUT /api/transactions/:id (MODIFIER)
// ------------------------------------
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { montant, statut, date } = req.body;
        
        if (!montant || !statut || !date || isNaN(id)) {
            return res.status(400).json({ error: "Données de mise à jour ou ID invalides." });
        }

        const updatedTransaction = await transactionModel.update(id, montant, statut, date);

        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction non trouvée pour la mise à jour." });
        }

        res.status(200).json({ 
            message: "Transaction mise à jour avec succès.",
            transaction: updatedTransaction
        });

    } catch (error) {
        console.error("Erreur mise à jour transaction :", error.message);
        if (error.message.includes('Statut invalide')) {
             return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la transaction." });
    }
});

// ------------------------------------
// 🎯 5. DELETE /api/transactions/:id (SUPPRESSION)
// ------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID de transaction invalide." });
        }

        const deletedTransaction = await transactionModel.delete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction non trouvée pour la suppression." });
        }

        res.status(200).json({ message: `Transaction avec ID ${id} supprimée avec succès.` });

    } catch (error) {
        console.error("Erreur suppression transaction :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de la transaction." });
    }
});

module.exports = router;