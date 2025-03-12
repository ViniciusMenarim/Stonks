function entrar() {
    let login = document.getElementById('login').value;
    let senha = document.getElementById('senha').value;
    
    if (login === "" || senha === "") {
        alert("Preencha todos os campos!");
    } else {
        alert("Login realizado com sucesso!");
        // Aqui você pode adicionar a lógica para redirecionar ou autenticar o usuário
    }
}

function esqueceuSenha() {
    alert("Redirecionando para recuperação de senha...");
    // Aqui você pode adicionar a lógica para recuperação de senha
}

function criarConta() {
    alert("Redirecionando para criação de conta...");
    // Aqui você pode adicionar a lógica para criar uma nova conta
}

function criarConta() {
    window.location.href = "create_account.html";
}

function voltarLogin() {
    window.location.href = "login.html";
}

function entrar() {
    // Aqui você pode adicionar a lógica de autenticação
    alert("Função de login ainda não implementada.");
}

function esqueceuSenha() {
    alert("Redefinição de senha ainda não implementada.");
}

function criarNovaConta() {
    // Aqui você pode adicionar a lógica de criação de conta
    alert("Função de criação de conta ainda não implementada.");
}
