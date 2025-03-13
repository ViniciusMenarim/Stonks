const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para criptografar a senha (instale com "npm install bcrypt")

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Substitua pelo seu usuário do MySQL
    password: 'root',  // Substitua pela sua senha do MySQL
    database: 'stonks_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// ========================== USUÁRIOS ==========================
// Criar um novo usuário
app.post('/registrar', async (req, res) => {
    const { nome, email, senha, data_criacao } = req.body;

    // Verifica se o e-mail já está cadastrado
    const checkSql = 'SELECT * FROM USUARIO WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });

        if (results.length > 0) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        // Criptografa a senha antes de armazenar
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insere o usuário no banco de dados
        const insertSql = 'INSERT INTO USUARIO (nome, email, senha, data_criacao) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [nome, email, senhaHash, data_criacao], (err, result) => {
            if (err) return res.status(500).json({ message: "Erro ao registrar usuário" });
            res.json({ message: "Usuário registrado com sucesso!" });
        });
    });
});

// Login de usuário
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Busca o usuário pelo e-mail
    const sql = 'SELECT * FROM USUARIO WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Erro no servidor" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const usuario = results[0];

        // Verifica a senha com bcrypt
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        res.json({ message: "Login bem-sucedido", usuario });
    });
});

// ========================== RECEITAS ==========================
// Criar uma receita
app.post('/receitas', (req, res) => {
    const { id_usuario, descricao, valor, data_recebimento, categoria } = req.body;
    const sql = 'INSERT INTO RECEITA (id_usuario, descricao, valor, data_recebimento, categoria) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_usuario, descricao, valor, data_recebimento, categoria], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Receita cadastrada com sucesso!' });
    });
});

// Buscar todas as receitas de um usuário
app.get('/receitas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM RECEITA WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ========================== DESPESAS ==========================
// Criar uma despesa
app.post('/despesas', (req, res) => {
    const { id_usuario, descricao, valor, data_pagamento, categoria } = req.body;
    const sql = 'INSERT INTO DESPESA (id_usuario, descricao, valor, data_pagamento, categoria) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_usuario, descricao, valor, data_pagamento, categoria], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Despesa cadastrada com sucesso!' });
    });
});

// Buscar todas as despesas de um usuário
app.get('/despesas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM DESPESA WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ========================== METAS FINANCEIRAS ==========================
// Criar uma meta financeira
app.post('/metas', (req, res) => {
    const { id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim } = req.body;
    const sql = 'INSERT INTO META_FINANCEIRA (id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Meta financeira cadastrada com sucesso!' });
    });
});

// Buscar todas as metas financeiras de um usuário
app.get('/metas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM META_FINANCEIRA WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ========================== LEMBRETES ==========================
// Criar um lembrete
app.post('/lembretes', (req, res) => {
    const { id_usuario, descricao, data_lembrete, status } = req.body;
    const sql = 'INSERT INTO LEMBRETE (id_usuario, descricao, data_lembrete, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_usuario, descricao, data_lembrete, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Lembrete cadastrado com sucesso!' });
    });
});

// Buscar todos os lembretes de um usuário
app.get('/lembretes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM LEMBRETE WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ========================== INICIAR O SERVIDOR ==========================
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
