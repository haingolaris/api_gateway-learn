const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all Assurance
router.get('/', (req, res) => {
  db.query('SELECT * FROM Assurance', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

// CREATE new Assurance
router.post('/', (req, res) => {
  const { assurance_nom } = req.body;
  db.query('INSERT INTO Assurance (assurance_nom) VALUES (?)', [assurance_nom], (err, result) => {
    if (err) return res.sendStatus(500);
    return res.status(200).json({ message: 'Assurance ajoutée avec succès.' });
  });
});

// UPDATE Assurance
router.put('/:assurance_id', (req, res) => {
  const assurance_id = req.params.assurance_id;
  const { assurance_nom } = req.body;
  db.query('UPDATE Assurance SET assurance_nom = ? WHERE id = ?', [assurance_nom, assurance_id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ message: 'Assurance mise à jour avec succès.' });
  });
});

// DELETE Assurance
router.delete('/:assurance_id', (req, res) => {
  const assurance_id = req.params.assurance_id;
  db.query('DELETE FROM Assurance WHERE id = ?', [assurance_id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ message: 'Assurance supprimée avec succès.' });
  });
});

module.exports = router;
