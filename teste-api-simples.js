const http = require('http');

// Teste 1: Verificar se backend está rodando
console.log('=== TESTE 1: Backend Status ===');
const testBackend = http.get('http://localhost:3001/api/agendamentos', (res) => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('✓ Backend respondendo');
    } else {
        console.log('✗ Backend com problema');
    }
}).on('error', (err) => {
    console.log('✗ Backend não está rodando:', err.message);
});

// Teste 2: Login
setTimeout(() => {
    console.log('\n=== TESTE 2: Login Admin ===');
    const postData = JSON.stringify({
        username: 'admin',
        password: 'admin123'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`Status Login: ${res.statusCode}`);
            if (res.statusCode === 200) {
                const response = JSON.parse(data);
                console.log('✓ Login realizado');
                console.log('Token:', response.token ? response.token.substring(0, 20) + '...' : 'Não encontrado');
                
                // Teste 3: Atualizar Status
                if (response.token) {
                    testUpdateStatus(response.token);
                }
            } else {
                console.log('✗ Login falhou:', data);
            }
        });
    });
    
    req.on('error', (err) => console.log('✗ Erro no login:', err.message));
    req.write(postData);
    req.end();
}, 1000);

// Função para testar atualização de status
function testUpdateStatus(token) {
    setTimeout(() => {
        console.log('\n=== TESTE 3: Atualizar Status ===');
        const postData = JSON.stringify({
            status: 'concluído'
        });
        
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/agendamentos/1', // Usando ID 1 para teste
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Status Update: ${res.statusCode}`);
                console.log('Resposta:', data);
                if (res.statusCode === 200) {
                    console.log('✓ Atualização funcionou!');
                } else {
                    console.log('✗ Atualização falhou');
                }
            });
        });
        
        req.on('error', (err) => console.log('✗ Erro na atualização:', err.message));
        req.write(postData);
        req.end();
    }, 1000);
}
