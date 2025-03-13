// Nome do arquivo: server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

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
        res.json({ message: "Login bem-sucedido", usuario });
    });
});

// ========================== REGISTRAR DESPESA ==========================
app.post('/despesa', (req, res) => {
    const { id_usuario, descricao, detalhes, valor, data_pagamento, categoria } = req.body;

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

// ========================== OUVIR REQUISIÇÕES NA PORTA 3000 ==========================
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
