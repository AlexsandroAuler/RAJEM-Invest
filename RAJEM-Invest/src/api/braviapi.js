const https = require('https');

async function getAll() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'brapi.dev',
            path: '/api/quote/list',
            method: 'GET',
            headers: {
                'Authorization': 'rZao5JSE6AicHWss6vMMbf'
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

module.exports = { getAll };
