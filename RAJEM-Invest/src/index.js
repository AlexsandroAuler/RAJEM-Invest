const { MongoClient, ServerApiVersion  } = require('mongodb');
const crypto = require('crypto');

function generateUniqueToken(email) {
    const secret = 'RajemSecretKey';
    return crypto.createHmac('sha256', secret).update(email).digest('hex');
}

//"npm install mongodb" pra funcionar neh
async function saveTokenToDatabase(email, token) {
    //usuario padrao
    const uri = 'mongodb+srv://RajemBase:Rajem$@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    //usuario admin de teste
    //const uri = 'mongodb+srv://alexauler:yafQr3lG6oQzh5lQ@baserajem.dxyth.mongodb.net/?retryWrites=true&w=majority&appName=BaseRAJEM';
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
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

const email = 'user@teste.com';
const token = generateUniqueToken(email);

console.log('Token gerado:', token);

saveTokenToDatabase(email, token);