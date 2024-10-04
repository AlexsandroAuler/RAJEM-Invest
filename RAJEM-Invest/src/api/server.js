const express = require('express');
const cors = require('cors');
const { generateUniqueToken, validateToken, salvarUsuarioBanco } = require('./index');

const app = express();

// Middleware
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Para lidar com JSON no corpo das requisições

const hostname = '127.0.0.1';
const port = 3000;

//rota para salvar usuário
app.post('/enviar-informacoes', async (req, res) => {
  const {
    nome, sobrenome, rg, cpf, ddd, celular, cep, rua, bairro,
    cidade, numero, complemento, senha, confirmarSenha
  } = req.body;

  // Verificação se todos os campos estão preenchidos
  if (!nome || !sobrenome || !rg || !cpf || !ddd || !celular || !cep || !rua ||
    !bairro || !cidade || !numero || !senha || !confirmarSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Verificação se a senha e confirmação de senha são iguais
  if (senha !== confirmarSenha) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  var usuario = await salvarUsuarioBanco(nome, sobrenome, rg, cpf, ddd, celular, cep, rua, bairro, cidade, numero, complemento, senha);

  if(usuario){
    res.status(201).json({ message: 'Informações salvas com sucesso.' });
  }
  else{
    console.error('Erro ao salvar as informações:', error);
    res.status(500).json({ error: 'Erro ao salvar as informações no banco de dados.' });
  }
});

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

app.post('/validar-token', (req, res) => {
  const { email } = req.body;
  const { token } = req.body;

  if (!email && !token) {
    return res.status(400).json({ error: 'O campo email e token são obrigatórios' });
  }
  else if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório' });
  }
  else if (!token) {
    return res.status(400).json({ error: 'O campo token é obrigatório' });
  }

  try {
    const tokenValido = validateToken(email, token);
    if(tokenValido)
      res.status(200).json(true);
    else
      res.status(200).json(false);
  } catch (error) {
    console.error('Erro ao consultar token:', error);
    res.status(500).json({ error: 'Erro interno ao consultar o token' });
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
