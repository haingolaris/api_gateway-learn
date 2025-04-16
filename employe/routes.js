const express = require('express');
const router = express.Router();
const db = require('./db');
const db_notif = require('./db_notif');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Employe', (err, result) => {
    if (err) return res.sendStatus(500);
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const { employe_nom, employe_adresse, salaire } = req.body;
  db.query('INSERT INTO Employe (employe_nom, employe_adresse, salaire) VALUES (?, ?, ?)',
    [employe_nom, employe_adresse, salaire],
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(201);
    });
});

router.put('/:employe_id', (req, res) => {
  const employe_id = req.params.employe_id;
  const { employe_nom, employe_adresse, salaire } = req.body;

  if (!employe_nom || !employe_adresse || !salaire) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  const notification_title = `Modification ${employe_id} ${employe_nom}`;
  const notification_content = 'Modifié';

  // Vérifier si l'employé existe dans la base de données de notification
  db.query('SELECT * FROM db_employe.employe WHERE id = ?', [employe_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employé non trouvé dans db_employe' });
    }

    // Mise à jour
    db.query(
      'UPDATE Employe SET employe_nom = ?, employe_adresse = ?, salaire = ? WHERE id = ?',
      [employe_nom, employe_adresse, salaire, employe_id],
      (err, result) => {
        if (err) {
          console.error('Erreur lors de la mise à jour de l\'employé :', err);
          return res.status(500).json({ message: 'Erreur mise à jour employé' });
        }

        // Insertion de la notification
        db_notif.query(
          'INSERT INTO Notification (employe_id, notification_title, notification_content) VALUES (?, ?, ?)',
          [employe_id, notification_title, notification_content],
          (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'insertion de la notification :', err);
              return res.status(500).json({ message: 'Mise à jour réussie, mais échec notification' });
            }

            return res.status(200).json({ message: 'Employé mis à jour et notification créée' });
          }
        );
      }
    );
  });
});


module.exports = router;