const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Assurance', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { assurance_nom } = req.body;
  db.query('INSERT INTO Assurance (assurance_nom) VALUES (?)',
    [assurance_nom],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(201);
    });
});

module.exports = router;
