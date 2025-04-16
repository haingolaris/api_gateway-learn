const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Notification', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { assurance_id, employe_id, notification_title, notification_content } = req.body;
  db.query('INSERT INTO Notification (assurance_id, employe_id, notification_title, notification_content) VALUES (?, ?, ?, ?)',
    [assurance_id, employe_id, notification_title, notification_content],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(201);
    });
});

module.exports = router;