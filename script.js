function entrar() {
    let login = document.getElementById('login').value.trim();
    let senha = document.getElementById('senha').value.trim();
    
    if (login === "" || senha === "") {
        alert("Por favor, preencha todos os campos!");
    } else {
        alert("Login realizado com sucesso!");
        // Aqui pode ser adicionado o redirecionamento para o dashboard
    }
}

function esqueceuSenha() {
    alert("Redirecionando para recuperação de senha...");
    // Aqui pode ser implementado um sistema de recuperação de senha
}

function criarConta() {
    window.location.href = "create_account.html";
    // Redireciona para a tela de criação de conta
}

function criarNovaConta() {
    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let senha = document.getElementById('senha').value.trim();
    let confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    
    if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
        alert("Preencha todos os campos!");
    } else if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
    } else {
        alert("Conta criada com sucesso!");
        window.location.href = "index.html"; // Redireciona para a tela de login
    }
}

function voltarLogin() {
    window.location.href = "login.html";
}

function entrar() {
    // Aqui você pode adicionar a lógica de autenticação antes de redirecionar
    window.location.href = "inicio.html";
}

