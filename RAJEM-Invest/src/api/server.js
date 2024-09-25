const http = require('http');
const { generateUniqueToken } = require('./index');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilita o CORS para todas as rotas e origens
app.use(express.json()); // Para lidar com JSON no corpo das requisições

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/createToken') {
    handlePostRequest(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

function handlePostRequest(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });
    req.on('end', () => {
      if(body){
        const parsedData = JSON.parse(body);
        const { email } = parsedData;
        const token = generateUniqueToken(email);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: `${token}` }));
      }else {
        throw new Error('Corpo da requisição vazio');
      }
    });
  }

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
