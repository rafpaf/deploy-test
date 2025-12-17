const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (for the callback HTML page)
app.use(express.static('.'));
app.get('/', (req, res) => {
  res.send('hello');
}

// Auth0 callback endpoint - handles Authorization Code flow
// Auth0 redirects here with ?code=... or ?access_token=... etc.
app.get('/callback', (req, res) => {
  console.log('=== Auth0 Callback Received ===');
  console.log('Query params:', req.query);

  if (req.query.code) {
    console.log('Authorization Code:', req.query.code);
  }
  if (req.query.access_token) {
    console.log('Access Token:', req.query.access_token);
  }
  if (req.query.id_token) {
    console.log('ID Token:', req.query.id_token);
  }
  if (req.query.error) {
    console.log('Error:', req.query.error);
    console.log('Error Description:', req.query.error_description);
  }

  // Serve HTML that can also extract tokens from URL fragment (for implicit flow)
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Auth0 Callback</title></head>
    <body>
      <h1>Auth0 Callback Received</h1>
      <pre id="output">Processing...</pre>
      <script>
        const output = document.getElementById('output');
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const data = {
          queryParams: Object.fromEntries(params),
          hashParams: Object.fromEntries(hashParams)
        };

        // Log to console
        console.log('=== Auth0 Callback (Client-Side) ===');
        console.log('Query params:', data.queryParams);
        console.log('Hash params:', data.hashParams);

        if (hashParams.get('access_token')) {
          console.log('Access Token (from hash):', hashParams.get('access_token'));
        }
        if (hashParams.get('id_token')) {
          console.log('ID Token (from hash):', hashParams.get('id_token'));
        }

        output.textContent = JSON.stringify(data, null, 2);
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Auth0 callback URL: http://localhost:\${PORT}/callback\`);
});
