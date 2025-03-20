    // Nome do arquivo: script.js

    function customAlert(message, type = "info") {
        return new Promise((resolve) => {
            // Remove qualquer alerta anterior
            let oldAlert = document.getElementById("customAlertOverlay");
            if (oldAlert) oldAlert.remove();
    
            // Criar o container de sobreposição (opcional)
            let overlay = document.createElement("div");
            overlay.id = "customAlertOverlay";
            overlay.classList.add("custom-alert-overlay");
    
            // Criar a caixa do alerta
            let alertBox = document.createElement("div");
            alertBox.classList.add("custom-alert", `custom-alert-${type}`);
            alertBox.innerHTML = `
                <p>${message}</p>
                <button id="alertOkButton">OK</button>
            `;
    
            // Adicionar alerta na tela
            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
    
            // Evento para fechar alerta e continuar a execução
            document.getElementById("alertOkButton").addEventListener("click", () => {
                overlay.remove();
                resolve(); // Continua a execução após clicar no botão
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

    async function savePassword() {
        const novaSenha = document.getElementById('password').value.trim();
    
        if (novaSenha.length < 6) {
            await customAlert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/alterar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha: novaSenha })
            });
    
            const data = await response.json();
            await customAlert(data.message);
            
            document.getElementById('password').value = ""; // Limpa o campo após salvar
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            await customAlert("Erro ao alterar senha. Tente novamente.");
        }
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
                            display: false // Remove a legenda lateral
                        },
                        tooltip: {
                            displayColors: false, // Remove o quadrado colorido
                            backgroundColor: 'rgba(0, 0, 0, 0.95)', // Fundo preto semi-transparente
                            titleFont: { size: 15, weight: 'bold' }, // Título do tooltip maior e em negrito
                            bodyFont: { size: 20 }, // Tamanho do texto do corpo
                            bodyColor: '#fff', // Cor do texto branca
                            borderWidth: 2, // Borda do tooltip
                            borderColor: '#fff', // Cor da borda do tooltip
                            cornerRadius: 6, // Cantos arredondados
                            padding: 10, // Espaçamento interno
                            callbacks: {
                                label: function(tooltipItem) {
                                    const index = tooltipItem.dataIndex;
                                    return `${categorias[index].nome}: R$${categorias[index].total_gasto.toFixed(2)}`;
                                },
                                title: () => '' // Remove o título extra do tooltip
                            }
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
    
    async function gerarRelatorio() {
        const dataInicio = document.getElementById('data_inicio').value;
        const dataFim = document.getElementById('data_fim').value;
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
        if (!dataInicio || !dataFim) {
            await customAlert("Por favor, selecione um período válido.");
            return;
        }
    
        if (!usuarioLogado || !usuarioLogado.id) {
            await customAlert("Usuário não autenticado.");
            return;
        }
    
        // Redireciona para a página `relatorio_gerado.html` passando os parâmetros na URL
        const urlParams = new URLSearchParams({
            id_usuario: usuarioLogado.id,
            data_inicio: dataInicio,
            data_fim: dataFim
        });
    
        window.location.href = `relatorio_gerado.html?${urlParams.toString()}`;
    }
    
    async function carregarMetas() {
        try {
            const resposta = await fetch('http://localhost:3000/metas', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Garante que os cookies de sessão sejam enviados
            });
    
            if (!resposta.ok) {
                throw new Error("Erro ao carregar metas.");
            }
    
            const metas = await resposta.json();
            
            const tabela = document.getElementById('tabela-metas');
            const corpoTabela = document.getElementById('corpo-metas');
            corpoTabela.innerHTML = "";
    
            if (metas.length === 0) {
                corpoTabela.innerHTML = "<tr><td colspan='6'>Nenhuma meta cadastrada.</td></tr>";
                return;
            }
    
            metas.forEach(meta => {
                let row = `<tr>
                    <td>${meta.titulo}</td>
                    <td>R$ ${meta.valor_meta.toFixed(2)}</td>
                    <td>R$ ${meta.valor_acumulado.toFixed(2)}</td>
                    <td>${meta.data_inicio}</td>
                    <td>${meta.data_fim}</td>
                    <td><button onclick="editarMeta(${meta.id_meta})">Editar</button></td>
                </tr>`;
                corpoTabela.innerHTML += row;
            });
    
        } catch (error) {
            console.error("Erro ao carregar metas:", error);
        }
    }
    
    async function salvarEdicaoMeta() {
        const id_meta = document.getElementById('id_meta').value;
        const valor_meta = document.getElementById('valor_meta').value.trim();
        const valor_acumulado = document.getElementById('valor_acumulado').value.trim();
        const data_fim = document.getElementById('data_fim').value;
    
        if (!valor_meta || !valor_acumulado || !data_fim) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }
    
        try {
            const resposta = await fetch(`http://localhost:3000/meta/${id_meta}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ valor_meta, valor_acumulado, data_fim })
            });
    
            if (!resposta.ok) {
                throw new Error("Erro ao salvar meta.");
            }
    
            alert("Meta atualizada com sucesso!");
            window.location.href = "gerenciar_metas.html";
        } catch (error) {
            console.error("Erro ao atualizar meta:", error);
        }
    }
    