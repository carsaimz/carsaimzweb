document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const loginItem = document.getElementById("login-item");
    const contaItem = document.getElementById("conta-item");
    const searchBar = document.getElementById("search-bar");

    // ======================
    // 🔍 Alternar Campo de Pesquisa
    // ======================
    searchBtn.addEventListener("click", function () {
        if (searchBar.style.display === "none" || searchBar.style.display === "") {
            searchBar.style.display = "block"; // Exibe o campo de pesquisa abaixo da navbar
            searchInput.focus();
            searchBtn.setAttribute("aria-expanded", "true"); // Define o estado como expandido
        } else {
            searchBar.style.display = "none"; // Esconde o campo de pesquisa
            searchBtn.setAttribute("aria-expanded", "false"); // Define o estado como fechado
        }
    });

    // ======================
    // 🌙 Alternar Modo Escuro
    // ======================
    function toggleDarkMode() {
        body.classList.toggle("dark-mode");

        // Armazena a escolha no localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Ícone de Sol para modo claro
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Ícone de Lua para modo escuro
        }
    }

    darkModeToggle.addEventListener("click", toggleDarkMode);

    // Verificar e aplicar o modo escuro salvo no localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Ícone de Sol para modo claro
    }

    // ======================
    // 🔐 Verificar Autenticação no Firebase
    // ======================
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Se estiver logado, exibe 'Minha Conta' e oculta 'Iniciar Sessão'
            loginItem.classList.add("d-none");
            contaItem.classList.remove("d-none");

            // Exemplo de adição de recurso Firebase: Perfil do usuário
            const userName = user.displayName || "Usuário";
            const userEmail = user.email || "Sem email";
            console.log("Usuário logado:", userName, userEmail);
        } else {
            // Se não estiver logado, exibe 'Iniciar Sessão' e oculta 'Minha Conta'
            loginItem.classList.remove("d-none");
            contaItem.classList.add("d-none");
        }
    });

    // ======================
    // 📜 Registra um novo usuário no Firebase (Exemplo de Registro)
    // ======================
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email-register").value;
            const password = document.getElementById("password-register").value;

            // Validação de formulário
            if (!email.includes("@")) {
                alert("Por favor, insira um email válido.");
                return;
            }

            if (password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            // Desabilitar botão durante o processo
            const registerBtn = document.getElementById("register-btn");
            registerBtn.disabled = true;
            registerBtn.innerText = "Carregando...";

            // Criação de novo usuário
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (userCredential) {
                    const user = userCredential.user;
                    console.log("Novo usuário registrado:", user);

                    // Redireciona para a página de login após o registro
                    window.location.href = "login.html";
                })
                .catch(function (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Erro no registro:", errorCode, errorMessage);

                    // Reabilitar o botão e exibir erro
                    registerBtn.disabled = false;
                    registerBtn.innerText = "Registrar";
                    alert("Erro: " + errorMessage);
                });
        });
    }

    // ======================
    // 🔐 Login de Usuário
    // ======================
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email-login").value;
            const password = document.getElementById("password-login").value;

            // Validação de formulário
            if (!email.includes("@")) {
                alert("Por favor, insira um email válido.");
                return;
            }

            if (password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            // Desabilitar botão durante o processo
            const loginBtn = document.getElementById("login-btn");
            loginBtn.disabled = true;
            loginBtn.innerText = "Carregando...";

            // Realiza o login do usuário
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (userCredential) {
                    const user = userCredential.user;
                    console.log("Usuário logado:", user);

                    // Redireciona para a página principal após o login
                    window.location.href = "index.html";
                })
                .catch(function (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Erro no login:", errorCode, errorMessage);

                    // Reabilitar o botão e exibir erro
                    loginBtn.disabled = false;
                    loginBtn.innerText = "Entrar";
                    alert("Erro: " + errorMessage);
                });
        });
    }

    // ======================
    // 🔐 Logout de Usuário
    // ======================
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            firebase.auth().signOut().then(function () {
                console.log("Usuário deslogado");
                window.location.href = "index.html"; // Redireciona para a página principal após o logout
            }).catch(function (error) {
                console.error("Erro ao deslogar:", error);
            });
        });
    }

    // ======================
    // 🛠 Monitoramento do modo escuro entre abas
    // ======================
    window.addEventListener("storage", function(event) {
        if (event.key === "darkMode") {
            if (event.newValue === "enabled") {
                body.classList.add("dark-mode");
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.remove("dark-mode");
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    });

});