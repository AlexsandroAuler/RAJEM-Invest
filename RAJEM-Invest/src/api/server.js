const express = require('express');
const cors = require('cors');
const { generateUniqueToken, validateToken, salvarUsuarioBanco, login, validarEmailJaCadastrado } = require('./index');

const app = express();

const corsOptions = {
  origin: 'http://app.rodrigoflores.esy.es',
  credentials: true, // se você precisar enviar cookies
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Habilita o CORS para todas as rotas
app.use(express.json()); // Para lidar com JSON no corpo das requisições

const hostname = '127.0.0.1';
const port = 3000;

// Rota para lidar com a criação de token
app.get('/teste', async(req, res) => {
  try {
    return res.status(200).json({ nome : 'rodrigo' });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

//rota para salvar usuário
app.post('/dados-primeiro-login', async (req, res) => {
  const { emailRecuperacao, senha, confirmarSenha, email } = req.body;

  // Verificação se todos os campos estão preenchidos
  if (!emailRecuperacao || !email ||!senha || !confirmarSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Verificação se a senha e confirmação de senha são iguais
  if (senha !== confirmarSenha) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  var usuario = await salvarUsuarioBanco(email, emailRecuperacao, senha);

  if(usuario){
    res.status(201).json({ message: 'Informações salvas com sucesso.' });
  }
  else{
    console.error('Erro ao salvar as informações:', error);
    res.status(500).json({ error: 'Erro ao salvar as informações no banco de dados.' });
  }
});

// Rota para lidar com a criação de token
app.post('/createToken', async(req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório' });
  }

  try {
    const token = await generateUniqueToken(email);

    if(!token)
      return res.status(200).json(false);

    res.status(200).json({ token: token });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ error: 'Erro interno ao gerar o token' });
  }
});

app.post('/validar-token', async(req, res) => {
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
    const tokenValido = await validateToken(email, token);
    if(tokenValido)
      res.status(200).json(true);
    else
      res.status(200).json(false);
  } catch (error) {
    console.error('Erro ao consultar token:', error);
    res.status(500).json({ error: 'Erro interno ao consultar o token' });
  }
});

// Rota para lidar com a criação de token
app.post('/login', async(req, res) => {
  const { email, senha } = req.body;

  if (!email && !senha) {
    return res.status(400).json({ error: 'O campo email e senha são obrigatórios' });
  }
  else if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório' });
  }
  else if (!senha) {
    return res.status(400).json({ error: 'O campo senha é obrigatório' });
  }

  try {
    var usuarioBanco = await login(email, senha);

    if(!usuarioBanco)
      return res.status(200).json(false);
    
    return res.status(200).json({ usuarioBanco });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

app.post('/validar-token', async(req, res) => {
  const { email, token } = req.body;

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
    // debugger;
    // const emailJaCadastrado = await validarEmailJaCadastrado(email);
    // console.log("emailJaCadastrado: " + emailJaCadastrado);

    // if(emailJaCadastrado)
    //   return res.status(400).json(false);

    const tokenValido = await validateToken(email, token);
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

