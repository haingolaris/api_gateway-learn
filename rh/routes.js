const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM RH', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { rh_grade } = req.body;
  db.query('INSERT INTO RH (rh_grade) VALUES (?)',
    [rh_grade],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(201);
    });
});

module.exports = router;