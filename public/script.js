    // Nome do arquivo: script.js

    function customAlert(message, type = "info") {
        return new Promise((resolve) => {
            // Remove o overlay antigo, se existir
            const oldOverlay = document.getElementById("customAlertOverlay");
            if (oldOverlay) oldOverlay.remove();
    
            // Cria o overlay que cobre toda a tela
            let overlay = document.createElement("div");
            overlay.id = "customAlertOverlay";
            overlay.classList.add("custom-alert-overlay");
    
            // Cria a caixa de alerta centralizada dentro do overlay
            let alertBox = document.createElement("div");
            alertBox.classList.add("custom-alert", `custom-alert-${type}`);
            alertBox.innerHTML = `
                <p>${message}</p>
                <button id="alertOkButton">OK</button>
            `;
    
            // Adiciona a caixa de alerta ao overlay e o overlay ao body
            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
    
            // Espera o clique no botão para fechar o alerta e continuar a execução
            document.getElementById("alertOkButton").addEventListener("click", () => {
                overlay.remove();
                resolve();
            });
        });
    }
    
    // Fechar o alerta e executar callback se necessário
    function closeCustomAlert() {
        const alertBox = document.getElementById("customAlert");
        if (alertBox) {
            alertBox.remove();
            if (alertBox.callback) alertBox.callback();
        }
    }
    
    async function criarNovaConta() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const data_criacao = new Date().toISOString().split('T')[0];

        if (!nome || !email || !senha || !confirmarSenha) {
           await customAlert("Preencha todos os campos!");
            return;
        }

        if (senha !== confirmarSenha) {
            await customAlert("As senhas não coincidem!");
            return;
        }

        const resposta = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, data_criacao })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            await customAlert("Conta criada com sucesso!");
            window.location.href = "entrar.html";
        } else {
            await customAlert(data.message || "Erro ao criar conta.");
        }
    }

    async function entrar() {
        const email = document.getElementById('login').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            await customAlert("Por favor, preencha todos os campos!");
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
            await customAlert("Login realizado com sucesso!");
            window.location.href = "inicio.html";
        } else {
            await customAlert(data.message || "Erro ao fazer login.");
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
            await customAlert("Preencha todos os campos!");
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
                await customAlert("Despesa adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar despesa.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
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
            await customAlert("Preencha todos os campos!");
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
                await customAlert("Receita adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar receita.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
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
            await customAlert("Preencha todos os campos!");
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
                await customAlert("Meta adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar meta.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
        }
    }

    // ===================== GERAR RELATÓRIO =====================
    async function gerarRelatorio() {
        const dataInicio = document.getElementById('data_inicio').value;
        const dataFim = document.getElementById('data_fim').value;
        const tabela = document.getElementById('tabela-relatorio');
        const corpoTabela = document.getElementById('corpo-relatorio');

        if (!dataInicio || !dataFim) {
            await customAlert("Por favor, selecione um período válido.");
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
                await customAlert("Nenhuma despesa encontrada no período selecionado.");
                tabela.style.display = "none";
            }

        } catch (error) {
            console.error("Erro ao buscar relatório:", error);
            await customAlert("Erro ao conectar com o servidor.");
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

    async function carregarCategorias() {
        try {
            // 🔹 Faz a requisição para obter as categorias do usuário
            const resposta = await fetch('http://localhost:3000/categorias-despesas');
            const categorias = await resposta.json();
    
            console.log("✅ Categorias carregadas:", categorias);
    
            const container = document.getElementById('categorias-container');
            container.innerHTML = ""; // Limpa antes de adicionar novos elementos
    
            if (categorias.length === 0) {
                console.warn("⚠️ Nenhuma categoria encontrada.");
                container.innerHTML = "<p style='color: white; text-align: center;'>Nenhuma categoria registrada.</p>";
                return;
            }
    
            // 🔹 Renderiza cada categoria no frontend, mesmo que o percentual seja 0%
            categorias.forEach(categoria => {
                const div = document.createElement('div');
                div.classList.add('category');
                div.style.backgroundColor = categoria.cor;
                div.innerHTML = `${categoria.nome}<br>${categoria.percentual}%`;
                container.appendChild(div);
            });
    
        } catch (error) {
            console.error("❌ Erro ao buscar categorias:", error);
        }
    }
    
    // 🔹 Chama a função ao carregar a página
    document.addEventListener("DOMContentLoaded", carregarCategorias);
    
    async function carregarGraficoPizza() {
        try {
            const resposta = await fetch('http://localhost:3000/dados-grafico');
            const dados = await resposta.json();
    
            console.log("✅ Dados do gráfico carregados:", dados);
    
            const saldo = dados.saldo.toFixed(2);
            const categorias = dados.categorias;
    
            // Se todas as categorias tiverem total_gasto = 0, exibir apenas o saldo
            if (categorias.every(c => c.total_gasto === 0)) {
                document.getElementById('financeChart').style.display = 'none';
                document.querySelector('.chart-center').innerText = `R$${saldo}`;
                return;
            }
    
            // Obtém os valores das categorias
            const labels = categorias.map(c => `${c.nome}: R$${c.total_gasto.toFixed(2)}`);
            const valores = categorias.map(c => c.total_gasto);
            const cores = categorias.map(c => c.cor);
    
            // Atualiza o valor central do gráfico
            document.querySelector('.chart-center').innerText = `R$${saldo}`;
    
            // 🔥 Verifica se já existe um gráfico criado e destrói antes de criar um novo
            const chartElement = document.getElementById('financeChart');
            if (chartElement.chart) {
                chartElement.chart.destroy();
            }
    
            // Criando gráfico sem legenda lateral
            const ctx = chartElement.getContext('2d');
            chartElement.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels, // 🔹 Remove os rótulos laterais
                    datasets: [{
                        data: valores,
                        backgroundColor: cores
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false // 🔹 Remove a legenda lateral
                        }
                    },
                    cutout: '60%'
                }
            });
    
        } catch (error) {
            console.error("❌ Erro ao carregar gráfico de pizza:", error);
        }
    }
    
    // 🔹 Chama a função ao carregar a página
    document.addEventListener("DOMContentLoaded", carregarGraficoPizza);
    