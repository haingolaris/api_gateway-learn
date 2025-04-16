const express = require('express');

const axios = require('axios');

const cors = require('cors');



const app = express();

app.use(cors());



const services = {

  utilisateur: 'http://localhost:3001',

  employe: 'http://localhost:3002',

  rh: 'http://localhost:3003',

  notification: 'http://localhost:3004',

  assurance: 'http://localhost:3005',

};



for (const [route, target] of Object.entries(services)) {

  app.all(`/${route}`, async (req, res) => {

    console.log(`[Gateway] Received ${req.method} ${req.originalUrl}`);

    

    try {

      const config = {

        method: req.method,

        url: `${target}${req.url}`,

        headers: { ...req.headers, host: undefined },

        timeout: 3000,

        validateStatus: () => true,

      };



      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {

        // Lire le body comme stream et le forwarder brut (optionnel)

        config.data = req;

      }



      const response = await axios(config);

      res.status(response.status).send(response.data);

    } catch (error) {

      console.error(`Error in ${route} service:, error.code, error.message`);

      res.status(500).send({ error: 'Gateway Error', details: error.message });

    }

  });

}



app.listen(3000, () => console.log('🚪 API Gateway running on port 3000'));
