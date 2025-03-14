// Nome do arquivo: script.js

async function criarNovaConta() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    const data_criacao = new Date().toISOString().split('T')[0];

    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos!");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const resposta = await fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, data_criacao })
    });

    const data = await resposta.json();

    if (resposta.ok) {
        alert("Conta criada com sucesso!");
        window.location.href = "entrar.html";
    } else {
        alert(data.message || "Erro ao criar conta.");
    }
}

async function entrar() {
    const email = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const resposta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await resposta.json();

    if (resposta.ok) {
        // Salvar sessão no LocalStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
        alert("Login realizado com sucesso!");
        window.location.href = "inicio.html";
    } else {
        alert(data.message || "Erro ao fazer login.");
    }
}

function voltarLogin() {
    window.location.href = "entrar.html";
}

// ===================== SALVAR DESPESA =====================
async function salvarDespesa() {
    const descricao = document.getElementById('descricao').value.trim();
    const valor = document.getElementById('valor').value.trim();
    const data_pagamento = document.getElementById('data_despesa').value;
    const categoria = document.getElementById('categoria').value;
    const id_usuario = 1; // Trocar pelo ID do usuário autenticado

    if (!descricao || !valor || !data_pagamento || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }

    console.log("Enviando requisição para salvar despesa...");

    try {
        const resposta = await fetch('http://localhost:3000/despesa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, descricao, valor, data_pagamento, categoria })
        });

        const data = await resposta.json();
        console.log("Resposta do servidor:", data);

        if (resposta.ok) {
            alert("Despesa adicionada com sucesso!");
            window.location.href = "inicio.html";
        } else {
            alert(data.message || "Erro ao adicionar despesa.");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao conectar com o servidor. Verifique a conexão.");
    }
}

// ===================== SALVAR RECEITA =====================
async function salvarReceita() {
    const descricao = document.getElementById('descricao').value.trim();
    const valor = document.getElementById('valor').value.trim();
    const data_recebimento = document.getElementById('data_receita').value;
    const categoria = document.getElementById('categoria').value;
    const id_usuario = 1; // Substituir pelo ID do usuário autenticado

    if (!descricao || !valor || !data_recebimento || !categoria) {
        alert("Preencha todos os campos!");
        return;
    }

    console.log("Enviando requisição para salvar receita...");

    try {
        const resposta = await fetch('http://localhost:3000/receita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, descricao, valor, data_recebimento, categoria })
        });

        const data = await resposta.json();
        console.log("Resposta do servidor:", data);

        if (resposta.ok) {
            alert("Receita adicionada com sucesso!");
            window.location.href = "inicio.html";
        } else {
            alert(data.message || "Erro ao adicionar receita.");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao conectar com o servidor. Verifique a conexão.");
    }
}

// ===================== SALVAR META =====================
async function salvarMeta() {
    const titulo = document.getElementById('titulo').value.trim();
    const valor_meta = document.getElementById('valor_meta').value.trim();
    const valor_acumulado = document.getElementById('valor_acumulado').value.trim();
    const data_inicio = document.getElementById('data_inicio').value;
    const data_fim = document.getElementById('data_fim').value;
    const id_usuario = 1; // Trocar pelo ID do usuário autenticado

    if (!titulo || !valor_meta || !valor_acumulado || !data_inicio || !data_fim) {
        alert("Preencha todos os campos!");
        return;
    }

    console.log("Enviando requisição para salvar meta...");

    try {
        const resposta = await fetch('http://localhost:3000/meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim })
        });

        const data = await resposta.json();
        console.log("Resposta do servidor:", data);

        if (resposta.ok) {
            alert("Meta adicionada com sucesso!");
            window.location.href = "inicio.html";
        } else {
            alert(data.message || "Erro ao adicionar meta.");
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        alert("Erro ao conectar com o servidor. Verifique a conexão.");
    }
}

// ===================== GERAR RELATÓRIO =====================
async function gerarRelatorio() {
    const dataInicio = document.getElementById('data_inicio').value;
    const dataFim = document.getElementById('data_fim').value;
    const tabela = document.getElementById('tabela-relatorio');
    const corpoTabela = document.getElementById('corpo-relatorio');

    if (!dataInicio || !dataFim) {
        alert("Por favor, selecione um período válido.");
        return;
    }

    console.log("Consultando relatório...");

    try {
        const resposta = await fetch(`http://localhost:3000/relatorio?data_inicio=${dataInicio}&data_fim=${dataFim}`);
        const dados = await resposta.json();

        corpoTabela.innerHTML = "";

        if (dados.length > 0) {
            dados.forEach(d => {
                let row = `<tr>
                    <td>${d.data}</td>
                    <td>${d.descricao}</td>
                    <td>R$ ${d.valor}</td>
                    <td>${d.categoria}</td>
                </tr>`;
                corpoTabela.innerHTML += row;
            });

            tabela.style.display = "table";
        } else {
            alert("Nenhuma despesa encontrada no período selecionado.");
            tabela.style.display = "none";
        }

    } catch (error) {
        console.error("Erro ao buscar relatório:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

async function carregarUsuario() {
    try {
        const resposta = await fetch('http://localhost:3000/usuario-logado');
        const data = await resposta.json();

        if (resposta.ok) {
            document.getElementById('profile-btn').textContent = data.nome;
        } else {
            document.getElementById('profile-btn').textContent = "Usuário";
        }
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
    }
}

// Chamada para carregar o nome do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", carregarUsuario);
