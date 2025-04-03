function login() {
    let login = document.getElementsByName("login")[0].value;
    let senha = document.getElementsByName("senha")[0].value;

    if (login == "" || senha == "") {
        alert("Preencha todos os campos!");
    } else if (login == "admin" && senha == "123456") {
        console.log("ir para pagina principal.html");
        window.location.href = "../paginas/principal.html";
       
    } else {
        alert("Login e/ou senha incorretos");
    }
}

function LimparLogin() {
    document.getElementsByName("login")[0].value = "";
    document.getElementsByName("senha")[0].value = "";
    document.getElementsByName("login")[0].focus();
}

function Buscar() {
    let login = document.getElementsByName("login")[0].value;
    let senha = document.getElementsByName("senha")[0].value;

    if (login == "" || senha == "") {
        alert("Preencha todos os campos!");
    } else if (login == "admin" && senha == "123456") {
        console.log("ir para pagina principal.html");
        window.location.href = "../paginas/principal.html";
       
    } else {
        alert("Login e/ou senha incorretos");
    }
}

function LimparBuscar() {
    document.getElementsByName("login")[0].value = "";
    document.getElementsByName("senha")[0].value = "";
    document.getElementsByName("login")[0].focus();
}
