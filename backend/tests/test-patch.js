const https = require('https');

const data = JSON.stringify({
  status: 'concluído'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/agendamentos/7',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = require('http').request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`headers:`, res.headers);

  res.on('data', (d) => {
    console.log('Response:', d.toString());
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
