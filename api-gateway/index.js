const http = require('http');
const { URL } = require('url');
const cors = require('cors')(); // Pour gérer CORS manuellement

// Configuration des services
const services = {
  '/utilisateur': 'http://localhost:3001',
  '/employe': 'http://localhost:3002',
  '/rh': 'http://localhost:3003',
  '/notification': 'http://localhost:3004',
  '/assurance': 'http://localhost:3005'
};

// Création du serveur HTTP
const server = http.createServer(async (clientReq, clientRes) => {
  // Gestion manuelle de CORS
  cors(clientReq, clientRes, async () => {
    try {
      const [_, servicePath] = clientReq.url.split('/');
      const target = services[`/${servicePath}`];

      if (!target) {
        clientRes.writeHead(404, { 'Content-Type': 'application/json' });
        return clientRes.end(JSON.stringify({ error: 'Service non trouvé' }));
      }

      const targetUrl = new URL(clientReq.url, target);
      console.log(`[Gateway] ${clientReq.method} ${clientReq.url} → ${targetUrl}`);

      // Options pour la requête forward
      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: targetUrl.pathname,
        method: clientReq.method,
        headers: { ...clientReq.headers, host: targetUrl.host }
      };

      // Forward de la requête
      const proxyReq = http.request(options, proxyRes => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
      });

      // Gestion des erreurs
      proxyReq.on('error', err => {
        console.error('[Proxy Error]', err);
        clientRes.writeHead(500, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: 'Erreur de gateway' }));
      });

      // Pipe du body si nécessaire
      if (['POST', 'PUT', 'PATCH','DELETE'].includes(clientReq.method)) {
        clientReq.pipe(proxyReq, { end: true });
      } else {
        proxyReq.end();
      }

    } catch (err) {
      console.error('[Gateway Error]', err);
      clientRes.writeHead(500, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({ error: 'Erreur interne' }));
    }
  });
});

// Démarrer le serveur
server.listen(3000, () => {
  console.log('🚀 Gateway HTTP native sur http://localhost:3000');
});