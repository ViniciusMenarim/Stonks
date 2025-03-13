function entrar() {
    let login = document.getElementById('login').value.trim();
    let senha = document.getElementById('senha').value.trim();
    
    if (!login || !senha) {
        alert("Por favor, preencha todos os campos!");
    } else {
        alert("Login realizado com sucesso!");
        window.location.href = "inicio.html"; // Redireciona para a página inicial
    }
}

function criarConta() {
    window.location.href = "create_account.html"; // Redireciona para criar conta
}

function criarNovaConta() {
    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let senha = document.getElementById('senha').value.trim();
    let confirmarSenha = document.getElementById('confirmarSenha').value.trim();
    
    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos!");
    } else if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
    } else {
        alert("Conta criada com sucesso!");
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

function togglePassword() {
    let passwordField = document.getElementById("passwordField");
    if (passwordField.innerText === "************") {
        passwordField.innerText = "MinhaSenha123"; // Aqui deve ser integrada com backend
    } else {
        passwordField.innerText = "************";
    }
    passwordField.classList.toggle("password-visible");
}
