const { MongoClient, ServerApiVersion  } = require('mongodb');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { getAll, getSpecificStock } = require('./braviapi');

const uri = 'mongodb+srv://RajemBase:Rajem$@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const userSchema = new mongoose.Schema({
    nome: String,
    sobrenome: String,
    rg: String,
    cpf: String,
    ddd: String,
    celular: String,
    cep: String,
    rua: String,
    bairro: String,
    cidade: String,
    numero: String,
    complemento: String,
    senha: String
  });
  
const User = mongoose.model('User', userSchema);

//#region Token

async function generateUniqueToken(email) {
    const secret = 'RajemSecretKey';
    token = crypto.createHmac('sha256', secret).update(email).digest('hex');

    const tokenJaGerado = await tokenExiste(token);

    if(tokenJaGerado)
        return;
    
    console.log('Token gerado:', token);
    await saveTokenToDatabase(email, token);

    return token;
}

//"npm install mongodb" pra funcionar neh
async function saveTokenToDatabase(email, token) {
    //usuario padrao
    //const uri = 'mongodb+srv://RajemBase:Rajem$@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    //usuario admin de teste
    //const uri = 'mongodb+srv://alexauler:yafQr3lG6oQzh5lQ@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    
    try {      
        const collection = await dataBaseCollectionConnection('tokens');

        const tokenDocument = {
            email: email,
            token: token,
            createdAt: new Date() 
        };

        const result = await collection.insertOne(tokenDocument);

        console.log(`Token salvo com sucesso. ID do documento: ${result.insertedId}`);
    } catch (error) {
        console.error("Erro ao conectar ou inserir no MongoDB:", error);
    } finally {
        // Fecha a conexão com o MongoDB
        await client.close();
    }
}
async function tokenExiste(token){
    const collection = await dataBaseCollectionConnection('tokens');

    const query = {token: token };
    const result = await collection.findOne(query);

    if (result) {
        return true;
      } else {
        return false;
      }
}

async function validateToken(email, token) {
    const collection = await dataBaseCollectionConnection('tokens');

    const query = { email: email, token: token };
    const result = await collection.findOne(query);
    if (result) {
      console.log('Token válido');
      return true;
    } else {
      console.log('Token inválido');
      return false;
    }
}

//#endregion

async function validarEmailJaCadastrado(email) {
  const collection = await dataBaseCollectionConnection('usuarios');

  const query = { email: email };
  const result = await collection.findOne(query);

  if (result) {
    console.log('Usuário já cadastrado');
    return true;
  } else {
    console.log('Usuário não cadastrado');
    return false;
  }
}

async function salvarUsuarioBanco(email, emailRecuperacao, senha) {

    const senhaHash = hashPassword(senha);

  // Criando o novo usuário
  const newUser = {
      email,
      emailRecuperacao,
      senhaHash
  };

  const collection = await dataBaseCollectionConnection('usuarios');
  const result = await collection.insertOne(newUser);

  return result;
}

async function login(email, senha){
    const senhaHash = hashPassword(senha);
    const collection = await dataBaseCollectionConnection('usuarios');

    const query = { email: email, senhaHash: senhaHash };

    const result = await collection.findOne(query);

    if (result) {
      console.log('Usuário válido');
      return result;
    } else {
      console.log('Usuário inválido');
      return false;
    }
}

function hashPassword(password){
  const secret = 'RajemPassword';
  senhaHash = crypto.createHmac('sha256', secret).update(password).digest('hex');

  return senhaHash;
}

async function getUserIdByEmail(email){
  const collection = await dataBaseCollectionConnection('usuarios');
  const query = { email: email };
  const result = await collection.findOne(query);

  return result?._id;
}

async function saveNewWallet(usuarioID, nomeCarteira, valorInvestimento) {
  const collection = await dataBaseCollectionConnection('carteiras');

  const newWallet = {
    usuarioID,
    nomeCarteira,
    valorInvestimento
  };

  const result = await collection.insertOne(newWallet);
  return result?.insertedId;
}

async function GetListWallets(usuarioID) {
  const collection = await dataBaseCollectionConnection('carteiras');
  const query = { usuarioID: usuarioID };
  const result = await collection.find(query).toArray();

  return result;
}

async function GetSingleWallet(carteiraID, userId) {
  if (!ObjectId.isValid(carteiraID)) {
    return null;
  }

  const collectionCarteira = await dataBaseCollectionConnection('carteiras');
  const queryCarteira = { _id: new ObjectId(carteiraID)};
  const resultCarteira = await collectionCarteira.findOne(queryCarteira);

  const collectionAcoesCarteira = await dataBaseCollectionConnection('carteiraAcoes');
  const queryAcoesCarteira = { carteiraID: carteiraID};
  const acoesCarteira = await collectionAcoesCarteira.find(queryAcoesCarteira).toArray();


  const carteiraInfo = {
    carteira: resultCarteira,
    acoesCarteira: acoesCarteira
  };

  return carteiraInfo;
}

async function saveNewActionsOnWallet(userID, carteiraID, acaoID, quantidadeAcao, cotacaoMomentoCompra, percentualDefinidoParaCarteira) {
  const collection = await dataBaseCollectionConnection('carteiraAcoes');
  const carteiraAcao = {
    userID,
    carteiraID,
    acaoID,
    quantidadeAcao,
    cotacaoMomentoCompra,
    percentualDefinidoParaCarteira
  };

  var wallet = await existActionOnWallet(userID, carteiraID, acaoID);

  if(wallet == null){
    var result = await collection.insertOne(carteiraAcao);
    return result?.insertedId;
  }else{
    const filtro = {
      userID,
      carteiraID,
      acaoID
    };
    const update = {
      $inc: { quantidadeAcao: + quantidadeAcao }
    };
    const result = await collection.updateOne(filtro, update);
    return wallet._id;
  }
}

async function removeActionsOnWallet(userID, carteiraID, acaoID, quantidadeAcaoRemover) {
  var quantity = await validateQuantityActionsOnWallet(userID, carteiraID, acaoID, quantidadeAcaoRemover);
  const collection = await dataBaseCollectionConnection('carteiraAcoes');

  const filtro = {
    userID,
    carteiraID,
    acaoID
  };

  if(quantity == quantidadeAcaoRemover){
    var result = await collection.deleteOne(filtro);
  }else{
    const update = {
      $inc: { quantidadeAcao: - quantidadeAcaoRemover }
    };
    const result = await collection.updateOne(filtro, update);
  }

  return true;
}

async function validateQuantityActionsOnWallet(userID, carteiraID, acaoID, quantidadeAcao) {
  const wallet = await existActionOnWallet(userID, carteiraID, acaoID);

  if(wallet == null)
    throw new Error('Combinação de ação e carteira não encontrada.');

  return wallet.quantidadeAcao;
}

async function existActionOnWallet(userID, carteiraID, acaoID) {
  const carteiraAcao = {
    userID,
    carteiraID,
    acaoID
  };

  const collection = await dataBaseCollectionConnection('carteiraAcoes');
  const result = await collection.findOne(carteiraAcao);

  return result;
}

async function dataBaseCollectionConnection(collection){
  //foi configurado pra conectar por qualquer IP
  await client.connect();
  const database = client.db('RajemBase');

  return database.collection(collection);
}

async function getAllActions(){
  var actions = await getAll();
  return actions;
}

async function getSpecificAction(stockID){
  var actions = await getSpecificStock(stockID);
  result = actions.stocks.filter(stock => stock.stock == stockID);
  return result;
}

async function getWalletIdByName(nomeCarteira) {
  const collection = await dataBaseCollectionConnection('carteiras');
  const query = { nomeCarteira: nomeCarteira };
  const result = await collection.findOne(query);

  return result?._id;
}

module.exports = { 
  generateUniqueToken,
  validateToken,
  salvarUsuarioBanco,
  login,
  validarEmailJaCadastrado,
  getAllActions,
  getSpecificAction,
  getUserIdByEmail,
  saveNewWallet,
  GetListWallets,
  GetSingleWallet,
  saveNewActionsOnWallet,
  removeActionsOnWallet,
  getWalletIdByName
};