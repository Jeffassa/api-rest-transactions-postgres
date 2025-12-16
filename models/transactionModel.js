const db = require('../config/db');

//crée nouvelle transaction
exports.create = async (userId, montant, statut, date) => {
    try {
        if (montant <= 0) {
            throw new Error("Le montant doit être supérieur à zéro");
        }
        
        const result = await db.query(
            `INSERT INTO transactions (user_id, montant, statut, date)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, montant, statut, date]
        );

        return result.rows[0];

    } catch (error) {
        if (error.code === '23503') { 
            throw new Error("L'utilisateur spécifié (user_id) n'existe pas.");
        }
        if (error.message.includes('enum')) { 
            throw new Error("Statut invalide (pending, completed ou failed uniquement)");
        }
        throw error;
    }
};
//récupérer tout
exports.findAll = async () => {
    try {
        const result = await db.query(
            `SELECT
                t.id, t.montant, t.statut, t.date, t.created_at,
                u.nom AS user_nom, u.email AS user_email
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             ORDER BY t.created_at DESC`
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

exports.findById = async (id) => {
    try {
         const result = await db.query(
            `SELECT t.*, u.nom AS user_nom
             FROM transactions t
             JOIN users u ON t.user_id = u.id
             WHERE t.id = $1`, [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};
exports.update = async (id, montant, statut, date) => {
    try {
        const result = await db.query(
            `UPDATE transactions
             SET montant = $1, statut = $2, date = $3
             WHERE id = $4
             RETURNING id, montant, statut, date, user_id`,
            [montant, statut, date, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};

exports.delete = async (id) => {
     try {
        const result = await db.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING id",
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
};