const express = require('express');
const router = express.Router();
const db = require('./db');

// GET all notifications
router.get('/', (req, res) => {
  db.query('SELECT * FROM Notification', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

// CREATE new notification
router.post('/', (req, res) => {
  const { employe_id, notification_title, notification_content } = req.body;
  db.query(
    'INSERT INTO Notification (employe_id, notification_title, notification_content) VALUES (?, ?, ?, ?)',
    [employe_id, notification_title, notification_content],
    (err, result) => {
      if (err) return res.sendStatus(500);
      return res.status(200).json({ message: 'Notification ajoutée avec succès.' });
    }
  );
});

// UPDATE notification
router.put('/:notification_id', (req, res) => {
  const notification_id = req.params.notification_id;
  const { notification_title, notification_content } = req.body;
  db.query(
    'UPDATE Notification SET notification_title = ?, notification_content = ? WHERE id = ?',
    [notification_title, notification_content, notification_id],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.json({ message: 'Notification mise à jour avec succès.' });
    }
  );
});

// DELETE notification
router.delete('/:notification_id', (req, res) => {
  const notification_id = req.params.notification_id;
  db.query('DELETE FROM Notification WHERE id = ?', [notification_id], (err, result) => {
    if (err) return res.sendStatus(500);
    res.json({ message: 'Notification supprimée avec succès.' });
  });
});

module.exports = router;
