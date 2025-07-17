
const urlViaCep = "https://viacep.com.br/ws/[[CEP]]/json/";
 

function limparCep() {
    document.getElementsByName("BuscarCep")[0].value = "";
    document.getElementsByName("endereco")[0].value = "";
    document.getElementsByName("Complemento")[0].value = "";
    document.getElementsByName("numero")[0].value = "";
    document.getElementsByName("bairro")[0].value = "";
    document.getElementsByName("cidade")[0].value = "";
    document.getElementsByName("estado")[0].value = "";

    document.getElementsByName("numero")[0].focus();
}

function BuscarCep() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    let cep = document.getElementsByName("BuscarCep")[0].value;

    let url = urlViaCep.replace("[[CEP]]", cep);


    fetch(url,requestOptions)
         .then((response) =>{
            if(response.ok){
                return response.json(); //convertendo o a resposta em JSON
            }

            throw new Error(`ERRO: HTTP ${response.status}`);


         })
         .then((result) =>{
            document.getElementsByName("endereco")[0].value = result.logradouro || "";
            document.getElementsByName("complemento")[0].value = result.complemento || "";
            document.getElementsByName("bairro")[0].value = result.bairro || "";
            document.getElementsByName("cidade")[0].value = result.localidade || "";
            document.getElementsByName("estado")[0].value = result.uf || "";   
            
            document.getElementsByName("endereco")[0].disabled = true
            document.getElementsByName("complemento")[0].disabled = true
            document.getElementsByName("bairro")[0].disabled = true
            document.getElementsByName("cidade")[0].disabled = true
            document.getElementsByName("estado")[0].disabled = true

            document.getElementsByName("numero")[0].focus();

         })
         .catch((erro) =>{
            alert(`ERRO ao buscar o cep\n${erro}`)
         });
}

function BuscarCEPFecth(){

}

function BuscarCEP(){

    let cep = document.getElementsByName("BuscaCep")[0].value;
    let url = urlViaCep.replace("[[cep]]", cep);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 || xhr.status === 200){
            const result = JSON.parse(xhr.responseText); // converter JSON
            
            document.getElementsByName("endereco")[0].value = result.logradouro || "";
            document.getElementsByName("complemento")[0].value = result.complemento || "";
            document.getElementsByName("bairro")[0].value = result.bairro || "";
            document.getElementsByName("cidade")[0].value = result.localidade || "";
            document.getElementsByName("estado")[0].value = result.uf || "";   
            
            document.getElementsByName("endereco")[0].disabled = true
            document.getElementsByName("complemento")[0].disabled = true
            document.getElementsByName("bairro")[0].disabled = true
            document.getElementsByName("cidade")[0].disabled = true
            document.getElementsByName("estado")[0].disabled = true

            document.getElementsByName("numero")[0].focus();

        } else {
            alert("ERRO ao buscar CEP. Status HTTP: ", xhr.status);
        }
    }

}