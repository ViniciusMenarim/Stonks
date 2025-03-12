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
