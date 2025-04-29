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
      return res.status(200).json({ 
        message: `L'employé ${employe_nom} a été ajouté avec succès.` 
      });
    });
});

router.put('/:employe_id', (req, res) => {
  const employe_id = req.params.employe_id;
  const { employe_nom, employe_adresse, salaire } = req.body;

  if (!employe_nom || !employe_adresse || !salaire) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  // D'abord récupérer les anciennes données de l'employé
  db.query('SELECT * FROM db_employe.employe WHERE id = ?', [employe_id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employé non trouvé dans db_employe' });
    }

    const ancienEmploye = rows[0]; // les anciennes données

    // Mettre à jour les informations de l'employé
    db.query(
      'UPDATE db_employe.employe SET employe_nom = ?, employe_adresse = ?, salaire = ? WHERE id = ?',
      [employe_nom, employe_adresse, salaire, employe_id],
      (err, result) => {
        if (err) {
          console.error('Erreur lors de la mise à jour de l\'employé :', err);
          return res.status(500).json({ message: 'Erreur mise à jour employé' });
        }

        // Construire le titre et le contenu de la notification
        const notification_title = `Modification d'information de ${ancienEmploye.employe_nom}`;
        const notification_content = `Les informations de ${ancienEmploye.employe_nom} sont devenues:
        - Nom: ${employe_nom} (ancien nom: ${ancienEmploye.employe_nom})
        - Adresse: ${employe_adresse} (ancienne adresse: ${ancienEmploye.employe_adresse})
        - Salaire: ${salaire} Ar (ancien salaire: ${ancienEmploye.salaire} Ar)`;

        // Insérer la notification
        db_notif.query(
          'INSERT INTO Notification (employe_id, notification_title, notification_content) VALUES (?, ?, ?)',
          [employe_id, notification_title, notification_content],
          (err, result) => {
            if (err) {
              console.error('Erreur lors de l\'insertion de la notification :', err);
              return res.status(500).json({ message: 'Mise à jour réussie, mais échec notification' });
            }

            return res.status(200).json({ 
              message: `L'employé ${employe_nom} a été mis à jour avec succès et une notification a été envoyée.` 
            });
                      }
        );
      }
    );
  });
});

router.delete('/:employe_id', (req, res) => {
  const employe_id = req.params.employe_id;

  // Vérifier si l'employé existe
  db.query('SELECT * FROM db_employe.employe WHERE id = ?', [employe_id], (err, rows) => {
    if (err) {
      console.error('Erreur serveur :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    const employe = rows[0]; // infos de l'employé avant suppression
    const notification_title = `Suppression de ${employe.employe_nom}`;
    const notification_content = `L'employé ${employe.employe_nom} (ID: ${employe_id}) a été supprimé.`;


    // Supprimer l'employé
    db.query('DELETE FROM db_employe.employe WHERE id = ?', [employe_id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression de l\'employé :', err);
        return res.status(500).json({ message: 'Erreur lors de la suppression' });
      }

      // Ensuite, enregistrer une notification
      db_notif.query(
        'INSERT INTO Notification (employe_id, notification_title, notification_content) VALUES (?, ?, ?)',
        [employe_id, notification_title, notification_content],
        (err, notifResult) => {
          if (err) {
            console.error('Erreur lors de l\'insertion de la notification :', err);
            // On peut ignorer l'erreur de notification, l'employé est déjà supprimé
            return res.status(200).json({ message: `Employé supprimé, mais échec notification.` });
          }

          return res.status(200).json({ message: `Employé supprimé et notification créée.` });
        }
      );
    });
  });
});



module.exports = router;