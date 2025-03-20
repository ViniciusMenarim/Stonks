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

app.use(session({
    secret: 'stonks_secret',  // Escolha uma chave secreta segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Se estiver rodando em HTTPS, mude para true
}));

app.get('/verificar-sessao', (req, res) => {
    if (req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
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

        // 🔹 Armazena o usuário na sessão
        req.session.usuario = {
            id: usuario.id_usuario,
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

app.get('/perfil', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const sql = 'SELECT nome, email FROM USUARIO WHERE id_usuario = ?';
    
    db.query(sql, [req.session.usuario.id], (err, results) => {
        if (err) {
            console.error("Erro ao buscar perfil:", err);
            return res.status(500).json({ message: "Erro ao buscar dados do usuário." });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json(results[0]); // Retorna apenas nome e email, sem a senha
    });
});

app.post('/alterar-senha', async (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const { senha } = req.body;
    if (!senha || senha.length < 6) {
        return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const sql = 'UPDATE USUARIO SET senha = ? WHERE id_usuario = ?';

        db.query(sql, [senhaHash, req.session.usuario.id], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar senha:", err);
                return res.status(500).json({ message: "Erro ao atualizar senha." });
            }
            res.json({ message: "Senha alterada com sucesso!" });
        });
    } catch (error) {
        console.error("Erro ao criptografar senha:", error);
        res.status(500).json({ message: "Erro ao processar senha." });
    }
});

app.get('/usuario-logado', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const sql = 'SELECT id_usuario AS id, nome, email FROM USUARIO WHERE id_usuario = ?';

    db.query(sql, [req.session.usuario.id], (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar dados do usuário:", err);
            return res.status(500).json({ message: "Erro ao buscar usuário." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json({
            id: results[0].id,
            nome: results[0].nome,
            email: results[0].email
        });
    });
});


// ========================== OUVIR REQUISIÇÕES NA PORTA 3000 ==========================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});

app.get('/categorias-despesas', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const id_usuario = req.session.usuario.id;

    // Lista de categorias padrão para garantir que todas sejam exibidas
    const categoriasPadrao = [
        { nome: "Casa", cor: "#4CAF50" },
        { nome: "Outros", cor: "#E53935" },
        { nome: "Viagem", cor: "#1E88E5" },
        { nome: "Lazer", cor: "#bba800" },
        { nome: "Comida", cor: "#FF9800" },
        { nome: "Saúde", cor: "#9C27B0" }
    ];

    // Consulta despesas reais do usuário
    const sql = `
        SELECT categoria AS nome, 
               ROUND(SUM(valor) * 100 / (SELECT SUM(valor) FROM DESPESA WHERE id_usuario = ?), 2) AS percentual
        FROM DESPESA
        WHERE id_usuario = ?
        GROUP BY categoria;
    `;

    db.query(sql, [id_usuario, id_usuario], (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar categorias:", err);
            return res.status(500).json({ message: "Erro ao carregar categorias" });
        }

        // Cria um mapa das categorias existentes com valores reais
        const categoriasMap = {};
        results.forEach(row => {
            categoriasMap[row.nome] = { percentual: row.percentual };
        });

        // Adiciona todas as categorias padrões e, se não existirem despesas, coloca 0%
        const categoriasFinal = categoriasPadrao.map(cat => ({
            nome: cat.nome,
            percentual: categoriasMap[cat.nome] ? categoriasMap[cat.nome].percentual : 0,
            cor: cat.cor
        }));

        res.json(categoriasFinal);
    });
});

app.get('/dados-grafico', (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const id_usuario = req.session.usuario.id;

    // Lista de categorias padrão com cores
    const categoriasPadrao = [
        { nome: "Casa", cor: "#4CAF50" },
        { nome: "Outros", cor: "#E53935" },
        { nome: "Viagem", cor: "#1E88E5" },
        { nome: "Lazer", cor: "#bba800" },
        { nome: "Comida", cor: "#FF9800" },
        { nome: "Saúde", cor: "#9C27B0" }
    ];

    // Consulta SQL para obter o saldo e os gastos por categoria
    const sql = `
        SELECT 
            (SELECT COALESCE(SUM(valor), 0) FROM RECEITA WHERE id_usuario = ?) -
            (SELECT COALESCE(SUM(valor), 0) FROM DESPESA WHERE id_usuario = ?) AS saldo,
            COALESCE(SUM(D.valor), 0) AS total_gasto,
            D.categoria AS nome
        FROM DESPESA D
        WHERE D.id_usuario = ?
        GROUP BY D.categoria;
    `;

    db.query(sql, [id_usuario, id_usuario, id_usuario], (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar dados do gráfico:", err);
            return res.status(500).json({ message: "Erro ao carregar dados do gráfico" });
        }

        // Captura o saldo total
        const saldo = results.length > 0 ? results[0].saldo : 0;

        // Criar um mapa das despesas reais por categoria
        const categoriasMap = {};
        results.forEach(row => {
            if (row.nome) {
                categoriasMap[row.nome] = row.total_gasto;
            }
        });

        // Adicionar categorias padrão com 0 caso não existam despesas
        const categoriasFinal = categoriasPadrao.map(cat => ({
            nome: cat.nome,
            total_gasto: categoriasMap[cat.nome] || 0, // Garante 0 caso não tenha despesas
            cor: cat.cor
        }));

        res.json({ saldo, categorias: categoriasFinal });
    });
});

app.get('/relatorio-gerado', (req, res) => {
    const { id_usuario, data_inicio, data_fim } = req.query;

    if (!id_usuario || !data_inicio || !data_fim) {
        return res.status(400).json({ message: "Forneça um intervalo de datas válido e um usuário." });
    }

    const sqlDespesas = `
        SELECT id_despesa AS id, descricao, valor, data_pagamento AS data, categoria, 'Despesa' AS movimentacao
        FROM DESPESA
        WHERE id_usuario = ? AND data_pagamento BETWEEN ? AND ?
    `;

    const sqlReceitas = `
        SELECT id_receita AS id, descricao, valor, data_recebimento AS data, categoria, 'Receita' AS movimentacao
        FROM RECEITA
        WHERE id_usuario = ? AND data_recebimento BETWEEN ? AND ?
    `;

    db.query(sqlDespesas, [id_usuario, data_inicio, data_fim], (err, despesas) => {
        if (err) {
            console.error("Erro ao buscar despesas:", err);
            return res.status(500).json({ message: "Erro ao buscar despesas." });
        }

        db.query(sqlReceitas, [id_usuario, data_inicio, data_fim], (err, receitas) => {
            if (err) {
                console.error("Erro ao buscar receitas:", err);
                return res.status(500).json({ message: "Erro ao buscar receitas." });
            }

            // Junta os resultados e ordena por data
            const resultados = [...despesas, ...receitas].sort((a, b) => new Date(a.data) - new Date(b.data));

            res.json(resultados);
        });
    });
});

// ========================== LISTAR TODAS AS METAS ==========================
app.get('/metas', (req, res) => {
    const sql = `SELECT id_meta, titulo, valor_meta, valor_acumulado, data_inicio, data_fim FROM META_FINANCEIRA`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar metas:", err);
            return res.status(500).json({ message: "Erro ao buscar metas no banco de dados." });
        }

        res.json(results); // Retorna todas as metas cadastradas
    });
});


app.get('/metas/detalhes/:id', (req, res) => {
    const id_meta = parseInt(req.params.id, 10);

    if (isNaN(id_meta)) {
        return res.status(400).json({ message: "ID inválido." });
    }

    const sql = `SELECT id_meta, titulo, valor_meta, valor_acumulado, data_inicio, data_fim 
                 FROM meta_financeira WHERE id_meta = ?`;

    db.query(sql, [id_meta], (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar meta:", err);
            return res.status(500).json({ message: "Erro interno ao buscar meta." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }

        res.json(results[0]); // Retorna a meta encontrada
    });
});

app.put('/metas/atualizar/:id', (req, res) => {
    const id_meta = parseInt(req.params.id, 10);
    const { valor_meta, valor_acumulado, data_fim } = req.body;

    if (!valor_meta || !valor_acumulado || !data_fim) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    const sql = `UPDATE meta_financeira 
                 SET valor_meta = ?, valor_acumulado = ?, data_fim = ? 
                 WHERE id_meta = ?`;

    db.query(sql, [valor_meta, valor_acumulado, data_fim, id_meta], (err, result) => {
        if (err) {
            console.error("❌ Erro ao atualizar meta:", err);
            return res.status(500).json({ message: "Erro ao atualizar meta." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Meta não encontrada." });
        }

        res.json({ message: "Meta atualizada com sucesso!" });
    });
});

