const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Config des services
const services = {
  utilisateur: 'http://localhost:3001',
  employe: 'http://localhost:3002',
  rh: 'http://localhost:3003',
  notification: 'http://localhost:3004',
  assurance: 'http://localhost:3005',
};

// Route générale pour gérer tous les services
for (const [route, target] of Object.entries(services)) {
  app.all(`/${route}`, async (req, res) => {
    console.log(`[Gateway] Received ${req.method} ${req.originalUrl}`);

    // Préparer la configuration de la requête pour Axios
    const config = {
      method: req.method,
      url: `${target}${req.url}`,
      headers: { ...req.headers, host: undefined },
      timeout: 3000,
      validateStatus: () => true,
    };

    // Si la méthode est POST, PUT ou PATCH, nous ajoutons le body
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log(`[Gateway] Payload:`, req.body);
      config.data = req.body;
    }

    try {
      // Faire la requête vers le service
      const response = await axios(config);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error(`[Gateway] Error in ${route} service:`, error.code, error.message);
      res.status(500).send({ error: 'Gateway Error', details: error.message });
    }
  });
}

// Lancer le serveur Gateway
app.listen(3005, () => console.log('🚪 API Gateway running on port 3000'));
