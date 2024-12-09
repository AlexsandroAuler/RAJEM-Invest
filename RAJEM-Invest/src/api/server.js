const express = require('express');
const cors = require('cors');
const { generateUniqueToken, validateToken, salvarUsuarioBanco, 
  login, validarEmailJaCadastrado, getAllActions, getUserIdByEmail, 
  saveNewWallet, GetListWallets, GetSingleWallet, saveNewActionsOnWallet, 
  removeActionsOnWallet, getWalletIdByName, getSpecificAction, 
  addBallanceToWallet, updateWallet, suggestQuantityToBuy, rebalanceWallet } = require('./index');

const app = express();

app.use(cors()); // Habilita o CORS para todas as rotas e origens
app.use(express.json()); // Para lidar com JSON no corpo das requisições

// const corsOptions = {
//   origin: 'http://app.rodrigoflores.esy.es',
//   credentials: true, // se você precisar enviar cookies
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
//   optionsSuccessStatus: 200
// };

// Middleware
// app.use(cors(corsOptions)); // Habilita o CORS para todas as rotas
// app.use(express.json()); // Para lidar com JSON no corpo das requisições

const hostname = '127.0.0.1';
const port = 3000;

//#region Rotas Usuário

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
    return res.status(400).json({ error: 'As senhas não coincidem' });
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

//#endregion

//#region Carteira

app.post('/criar-carteira', async(req, res) => {
  const { email, nomeCarteira, valorInvestimento, acoes } = req.body;
  const userIdByEmail = await getUserIdByEmail(email);
  
  if(userIdByEmail == null){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }
  if(nomeCarteira == null || nomeCarteira == ""){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }

  idCarteira = await saveNewWallet(userIdByEmail.toString(), nomeCarteira, 0);

  for (const acao of acoes) {
    await saveNewActionsOnWallet(
      userIdByEmail.toString(),
      idCarteira.toString(),
      acao.acaoID,
      acao.setorAcao,
      0,
      0,
      acao.percentualOriginal
    );
  }

  res.status(200).json({ result: idCarteira });
});

app.get('/get-carteira', async(req, res) => {
  const { email, carteiraId } = req.query;
  const userIdByEmail = await getUserIdByEmail(email);

  if(userIdByEmail == null){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }

  result = await GetSingleWallet(carteiraId, userIdByEmail);

  if(!result)
    return res.status(400).json({ error: 'Nenhum carteira encontrada' });

  return res.status(200).json({ result : result });
});

app.get('/listar-carteiras', async(req, res) => {
  const { email } = req.query;
  const userIdByEmail = await getUserIdByEmail(email);
  
  if(userIdByEmail == null){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }

  result = await GetListWallets(userIdByEmail.toString());

  return res.status(200).json({ result : result });
});

app.post('/adicionar-saldo-carteira', async(req, res) => {
  const { email, carteiraId, saldo} = req.body;
  const userId = await getUserIdByEmail(email);

  if(userId == null){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }
  try{
    result = await addBallanceToWallet(userId.toString(), carteiraId.toString(), saldo);
    return res.status(200).json({ success: true, novoSaldo : result.valorInvestimento, valorNaoInvestido: result.valorNaoInvestido});
  }catch(error){
    console.error('Erro ao adicionar saldo na carteira:', error);
    res.status(500).json({ success: false, error: 'Erro interno.' });
  }
});

//#endregion

//#region Ações/Ativos

app.post('/validar-quantidade-acoes', async(req, res) => {
  const { investimentoInicial, acoes  } = req.body;
  const retorno = await suggestQuantityToBuy(investimentoInicial, acoes);

  res.status(200).json({ result: retorno });
});

app.post('/rebalancear-carteira-acoes', async(req, res) => {
  const { valorNaoInvestido, acoes } = req.body;
  const retorno = await rebalanceWallet(valorNaoInvestido, acoes);
  if(!retorno){
    res.status(200).json({ saldoInsuficiente: true });
  }else{
    res.status(200).json({ result: retorno });
  }
});

app.post('/consultar-cotacoes', async(req, res) => {
  const { acoes } = req.body;
  let retorno = [];

  for (const acao of acoes) {
    const detalhesAcao = await getSpecificAction(acao.acaoID);
    const valorFechamentoAcao = parseFloat(detalhesAcao[0].close.toFixed(2));
    const valorVariacaoAcao = parseFloat(detalhesAcao[0].change.toFixed(2));
    //const valorAcao = parseFloat((valorFechamentoAcao + valorVariacaoAcao).toFixed(2));

    let acaoRetorno = {
      acaoID: acao.acaoID,
      setorAcao: detalhesAcao[0].sector,
      cotacaoAtual: valorFechamentoAcao
    };

    retorno.push(acaoRetorno);
  }

  res.status(200).json({ result: retorno });
});

app.get('/get-all-actions', async(req, res) => {

  result = await getAllActions();

  return res.status(200).json({ result : result.stocks });
});

app.get('/get-specific-action', async(req, res) => {
  const { acaoID } = req.query;
  try{
    result = await getSpecificAction(acaoID);
    return res.status(200).json({ result : result });
  }catch{
    return res.status(400).json({ error : 'Ocorreu um erro ao buscar pelo ID da ação' });
  }
 
});

app.get('/get-all-actions-names', async(req, res) => {
  result = await getAllActions();
  names = result.stocks.map(stock => stock.stock);

  return res.status(200).json({ result : names });
});

app.post('/adicionar-acao-carteira', async(req, res) => {
  const { email, nomeCarteira, acaoID, quantidadeAcao} = req.body;

  const userId = await getUserIdByEmail(email);
  const carteiraId = await getWalletIdByName(nomeCarteira);

  if(userId == null || carteiraId == null || quantidadeAcao <= 0){
    return res.status(400).json({ error: 'Ocorreu um erro com os dados enviado, por fazer revisar os seguintes dados => Email: ' +  email + " | Nome carteira: " + nomeCarteira + " | Quantidade Acoes: " + quantidadeAcao});
  }

  result = await saveNewActionsOnWallet(userId.toString(), carteiraId.toString(), acaoID, quantidadeAcao);

  return res.status(200).json({ result : result });
});

app.post('/salvar-carteira', async(req, res) => {
  const { email, carteiraInfo} = req.body;

  const userId = await getUserIdByEmail(email);

  if(userId == null || carteiraInfo == null ){
    return res.status(400).json({ error: 'Ocorreu um erro com os dados enviado, por fazer revisar os seguintes dados => Email: ' +  email + " | Carteira: " + carteiraInfo });
  }

  result = await updateWallet(userId.toString(), carteiraInfo);

  return res.status(200).json({ result : result });
});

app.post('/remover-acao-carteira', async(req, res) => {
  const { email, carteiraId, acaoID, quantidadeAcao} = req.body;
  const userId = await getUserIdByEmail(email);

  if(userId == null){
    return res.status(400).json({ error: 'Nenhum usuário vinculado ao e-mail' });
  }
  try{
    result = await removeActionsOnWallet(userId.toString(), carteiraId.toString(), acaoID, quantidadeAcao);
    return res.status(200).json({ result : true });
  }catch(error){
    console.error('Erro ao remover ações:', error);
    res.status(500).json({ error: 'Erro interno ao remover ações.' });
  }
});

//#endregion

// Rota para lidar com requisições desconhecidas (404)
app.use((req, res) => {
  res.status(404).send('Rota não encontrada');
});

//#region Inicia o servidor
app.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});

//#endregion

