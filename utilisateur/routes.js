const express = require('express');
const router = express.Router();
const db = require('./db');

// Middleware pour logger les requêtes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// GET all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM Utilisateur', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message 
      });
    }
    res.set('Content-Type', 'application/json');
    res.json(results);
  });
});

// CREATE new user
router.post('/', (req, res) => {
  const { utilisateur_mail, utilisateur_mdp } = req.body;
  
  // Validation basique
  if (!utilisateur_mail || !utilisateur_mdp) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['utilisateur_mail', 'utilisateur_mdp']
    });
  }

  db.query(
    'INSERT INTO Utilisateur (utilisateur_mail, utilisateur_mdp) VALUES (?, ?)',
    [utilisateur_mail, utilisateur_mdp],
    (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({
          error: 'Insert failed',
          details: err.message,
          code: err.code
        });
      }
      
      res.status(201)
         .set('Content-Type', 'application/json')
         .json({
           id: result.insertId,
           message: 'User created'
         });
    }
  );
});

module.exports = router;