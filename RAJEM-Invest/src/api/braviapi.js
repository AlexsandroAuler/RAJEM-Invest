const https = require('https');
const token = 'rZao5JSE6AicHWss6vMMbf';

async function getAll() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'brapi.dev',
            path: '/api/quote/list?type=stock',
            method: 'GET',
            headers: {
                'Authorization': token
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Erro ao analisar JSON'));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error('Erro na requisição: ' + error.message));
        });

        req.end();
    });
}

async function getSpecificStock(stockID) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'brapi.dev',
            path: '/api/quote/list?type=stock&search=' + stockID,
            method: 'GET',
            headers: {
                'Authorization': token
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error('Erro ao analisar JSON'));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error('Erro na requisição: ' + error.message));
        });

        req.end();
    });
}

module.exports = { getAll, getSpecificStock };
