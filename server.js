// Nome do arquivo: server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'stonks_secret_key', // Chave secreta para a sessão
    resave: false,
    saveUninitialized: false, // Agora só cria sessão após login
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 } // Sessão expira em 1 hora
}));

// 📌 Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// 📌 Direcionar para a página de login ao acessar "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'entrar.html'));
});

// Conexão com o banco de dados MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Usuário do MySQL
    password: 'root',  // Senha do MySQL
    database: 'stonks_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com pool de conexões');
    connection.release();
});

// ========================== SERVIR O FRONTEND ==========================
// 📌 Se o usuário acessar a raiz "/", redirecionamos para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// 📌 Rota para verificar autenticação
app.get('/verificar-sessao', (req, res) => {
    if (req.session && req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
});

// 📌 Rota para buscar dados da tela inicial
app.get('/dados-inicio', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const id_usuario = req.session.usuario.id_usuario;

    const sql = `
        SELECT 'despesa' AS tipo, categoria, SUM(valor) AS total FROM DESPESA WHERE id_usuario = ? GROUP BY categoria
        UNION
        SELECT 'receita' AS tipo, categoria, SUM(valor) AS total FROM RECEITA WHERE id_usuario = ? GROUP BY categoria
    `;

    db.query(sql, [id_usuario, id_usuario], (err, results) => {
        if (err) {
            console.error("Erro ao buscar dados:", err);
            return res.status(500).json({ message: "Erro ao buscar dados" });
        }
        res.json(results);
    });
});

// ========================== REGISTRO DE USUÁRIOS ==========================
app.post('/registrar', async (req, res) => {
    const { nome, email, senha, data_criacao } = req.body;

    const checkSql = 'SELECT * FROM USUARIO WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });

        if (results.length > 0) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const insertSql = 'INSERT INTO USUARIO (nome, email, senha, data_criacao) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [nome, email, senhaHash, data_criacao], (err, result) => {
            if (err) return res.status(500).json({ message: "Erro ao registrar usuário" });
            res.json({ message: "Usuário registrado com sucesso!" });
        });
    });
});

// ========================== LOGIN DE USUÁRIOS ==========================
// 📌 Rota para login (corrigida para armazenar sessão corretamente)
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM USUARIO WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        // 📌 Armazenar informações do usuário na sessão
        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({ message: "Login bem-sucedido", usuario: req.session.usuario });
    });
});

// ========================== REGISTRAR DESPESA ==========================
app.post('/despesa', (req, res) => {
    const { id_usuario, descricao, valor, data_pagamento, categoria } = req.body;

    if (!id_usuario || !descricao || !valor || !data_pagamento || !categoria) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
    }

    const insertSql = 'INSERT INTO DESPESA (id_usuario, descricao, valor, data_pagamento, categoria) VALUES (?, ?, ?, ?, ?)';
    
    db.query(insertSql, [id_usuario, descricao, valor, data_pagamento, categoria], (err, result) => {
        if (err) {
            console.error("Erro ao registrar despesa:", err);
            return res.status(500).json({ message: "Erro ao registrar despesa" });
        }
        res.json({ message: "Despesa registrada com sucesso!" });
    });
});

// ========================== REGISTRAR RECEITA ==========================
app.post('/receita', (req, res) => {
    const { id_usuario, descricao, valor, data_recebimento, categoria } = req.body;

    if (!id_usuario || !descricao || !valor || !data_recebimento || !categoria) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
    }

    const insertSql = 'INSERT INTO RECEITA (id_usuario, descricao, valor, data_recebimento, categoria) VALUES (?, ?, ?, ?, ?)';
    
    db.query(insertSql, [id_usuario, descricao, valor, data_recebimento, categoria], (err, result) => {
        if (err) {
            console.error("Erro ao registrar receita:", err);
            return res.status(500).json({ message: "Erro ao registrar receita" });
        }
        res.json({ message: "Receita registrada com sucesso!" });
    });
});

// ========================== REGISTRAR META ==========================
app.post('/meta', (req, res) => {
    const { id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim } = req.body;

    if (!id_usuario || !titulo || !valor_meta || !valor_acumulado || !data_inicio || !data_fim) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
    }

    const insertSql = 'INSERT INTO meta_financeira (id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(insertSql, [id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim], (err, result) => {
        if (err) {
            console.error("Erro ao registrar meta:", err);
            return res.status(500).json({ message: "Erro ao registrar meta" });
        }
        res.json({ message: "Meta registrada com sucesso!" });
    });
});

// ========================== GERAR RELATÓRIO DE GASTOS ==========================
app.get('/relatorio', (req, res) => {
    const { data_inicio, data_fim } = req.query;

    if (!data_inicio || !data_fim) {
        return res.status(400).json({ message: "Forneça um intervalo de datas válido." });
    }

    const sql = `
        SELECT data_pagamento AS data, descricao, valor, categoria 
        FROM DESPESA 
        WHERE data_pagamento BETWEEN ? AND ?
        ORDER BY data_pagamento ASC
    `;

    db.query(sql, [data_inicio, data_fim], (err, results) => {
        if (err) {
            console.error("Erro ao buscar relatório:", err);
            return res.status(500).json({ message: "Erro ao buscar relatório" });
        }
        res.json(results);
    });
});

// 📌 Rota para logout
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logout realizado com sucesso" });
    });
});

// ========================== OUVIR REQUISIÇÕES NA PORTA 3000 ==========================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
