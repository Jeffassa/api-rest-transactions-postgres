const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel'); 

const isValidEmail = (email) => {
    return /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

router.post('/', async (req, res) => {
    try {
        const { nom, email, telephone } = req.body;

        if (!nom || !email || !isValidEmail(email)) {
            return res.status(400).json({ error: "Nom et email valide sont obligatoires." });
        }

        const user = await userModel.create(nom, email, telephone || null);

        res.status(201).json({ message: "Utilisateur créé avec succès.", user });

    } catch (error) {
        console.error("Erreur création utilisateur :", error.message); 

        if (error.message.includes('Erreur: L\'email')) {
             return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ error: "Erreur serveur inattendue lors de la création." });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Erreur liste utilisateurs :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des utilisateurs." });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID utilisateur invalide." });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Erreur récupération utilisateur par ID :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'utilisateur." });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nom, email, telephone } = req.body;
        
        if (!nom || !email || !isValidEmail(email) || isNaN(id)) {
            return res.status(400).json({ error: "Données de mise à jour ou ID invalides." });
        }

        const updatedUser = await userModel.update(id, nom, email, telephone || null);

        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé pour la mise à jour." });
        }

        res.status(200).json({ 
            message: "Utilisateur mis à jour avec succès.",
            user: updatedUser
        });

    } catch (error) {
        console.error("Erreur mise à jour utilisateur :", error.message);
        if (error.message.includes('déjà utilisé')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID utilisateur invalide." });
        }

        const deletedUser = await userModel.delete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé pour la suppression." });
        }

        res.status(200).json({ message: `Utilisateur avec ID ${id} et ses transactions associées supprimés avec succès.` });

    } catch (error) {
        console.error("Erreur suppression utilisateur :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur." });
    }
});

module.exports = router;