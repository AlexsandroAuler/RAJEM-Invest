const express = require('express');
const cors = require('cors');
const { generateUniqueToken } = require('./index');

const app = express();

// Middleware
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Para lidar com JSON no corpo das requisições

const hostname = '127.0.0.1';
const port = 3000;

// Rota para lidar com a criação de token
app.post('/createToken', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório' });
  }

  try {
    const token = generateUniqueToken(email);
    res.status(200).json({ token: token });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ error: 'Erro interno ao gerar o token' });
  }
});

// Rota para lidar com requisições desconhecidas (404)
app.use((req, res) => {
  res.status(404).send('Rota não encontrada');
});

// Inicia o servidor
app.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
