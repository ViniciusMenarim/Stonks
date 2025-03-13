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
        window.location.href = "login.html";
    } else {
        alert(data.message);
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
        alert("Login realizado com sucesso!");
        window.location.href = "dashboard.html";
    } else {
        alert(data.message);
    }
}
