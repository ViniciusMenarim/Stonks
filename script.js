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
<<<<<<< Updated upstream
        window.location.href = "entrar.html"; // Corrigido de 'index.html' para 'entrar.html'
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
        window.location.href = "inicio.html"; // Corrigido de 'dashboard.html' para 'inicio.html'
    } else {
        alert(data.message);
    }
}
=======
        window.location.href = "login.html"; // Redireciona para a página de login
    }
}

function voltarLogin() {
    window.location.href = "login.html"; // Agora volta corretamente para a página de login
}

function editarNome() {
    let novoNome = prompt("Digite seu novo nome completo:");
    if (novoNome) {
        document.getElementById("profileName").innerText = novoNome;
        alert("Nome atualizado com sucesso!");
    }
}

function editarEmail() {
    let novoEmail = prompt("Digite seu novo e-mail:");
    if (novoEmail) {
        document.getElementById("profileEmail").innerText = novoEmail;
        alert("E-mail atualizado com sucesso!");
    }
}


>>>>>>> Stashed changes
