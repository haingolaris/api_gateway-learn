const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all RH
router.get('/', (req, res) => {
  db.query('SELECT * FROM RH', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

// CREATE new RH
router.post('/', (req, res) => {
  const { rh_grade } = req.body;
  db.query('INSERT INTO RH (rh_grade) VALUES (?)', [rh_grade], (err, result) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(201);
  });
});

// UPDATE RH
router.put('/:rh_id', (req, res) => {
  const rh_id = req.params.rh_id;
  const { rh_grade } = req.body;
  db.query('UPDATE RH SET rh_grade = ? WHERE id = ?', [rh_grade, rh_id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ message: 'RH mis à jour avec succès.' });
  });
});

// DELETE RH
router.delete('/:rh_id', (req, res) => {
  const rh_id = req.params.rh_id;
  db.query('DELETE FROM RH WHERE id = ?', [rh_id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ message: 'RH supprimé avec succès.' });
  });
});

module.exports = router;
