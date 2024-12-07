const { MongoClient, ServerApiVersion  } = require('mongodb');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { getAll } = require('./braviapi');

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

function hashPassword(password){
    const secret = 'RajemPassword';
    senhaHash = crypto.createHmac('sha256', secret).update(password).digest('hex');

    return senhaHash;
}

//"npm install mongodb" pra funcionar neh
async function saveTokenToDatabase(email, token) {
    //usuario padrao
    //const uri = 'mongodb+srv://RajemBase:Rajem$@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    //usuario admin de teste
    //const uri = 'mongodb+srv://alexauler:yafQr3lG6oQzh5lQ@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    
    try {
        //foi configurado pra conectar por qualquer IP
        await client.connect();
        console.log("Conectado ao MongoDB");

        const database = client.db('RajemBase');
        const collection = database.collection('tokens');

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
    await client.connect();
    console.log("Conectado ao MongoDB");

    const database = client.db('RajemBase');
    const collection = database.collection('tokens');

    const query = {token: token };
    const result = await collection.findOne(query);

    if (result) {
        return true;
      } else {
        return false;
      }
}

async function validateToken(email, token) {
    await client.connect();
    console.log("Conectado ao MongoDB");

    const database = client.db('RajemBase');
    const collection = database.collection('tokens');

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

async function validarEmailJaCadastrado(email) {
  await client.connect();
  console.log("Conectado ao MongoDB");

  const database = client.db('RajemBase');
  const collection = database.collection('usuarios');

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

  await client.connect();
  console.log("Conectado ao MongoDB");

  const database = client.db('RajemBase');
  const collection = database.collection('usuarios');
  const result = await collection.insertOne(newUser);

  return result;
}

async function login(email, senha){
    const senhaHash = hashPassword(senha);

    await client.connect();
    console.log("Conectado ao MongoDB");

    const database = client.db('RajemBase');
    const collection = database.collection('usuarios');

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

async function getAllActions(){
  var actions = await getAll();
}

module.exports = { generateUniqueToken, validateToken, salvarUsuarioBanco, login, validarEmailJaCadastrado };