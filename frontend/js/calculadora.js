
var valor1 = 0;
var valor2 = 0;
var operacao ="";

function soma(){
    valor1 = parseFloat(document.getElementsByClassName
        ("inputVisorCalculadora")[0].value);
carregar();
operacao = "soma";



}

function subtracao(){
    valor1 = parseFloat(document.getElementsByClassName
        ("inputVisorCalculadora")[0].value);
carregar();
operacao = "subtracao";

}    

function multiplicaca(){
    valor1 = parseFloat(document.getElementsByClassName
        ("inputVisorCalculadora")[0].value);
carregar();
operacao = "multiplicacao";


}
   

function divisao(){
    valor1 = parseFloat(document.getElementsByClassName
        ("inputVisorCalculadora")[0].value);
carregar();
operacao = "divisao";


}
    

function carregarTudo(){
    document.getElementsByClassName("inputVisorCalculadora")[0].value = 0;
    valor1 = 0;
    valor2 = 0;
    operacao = "";

}

function carregar(){
    document.getElementsByClassName("inputVisorCalculadora")[0].value = 0;

}


function numero0(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 0;
}

function numero1(){
   let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
   visor.value += 1;

}

function numero2(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 2;

}

function numero3(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 3;
}

function numero4(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 4;
}

function numero5(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 5;
}

function numero6(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 6;
}

function numero7(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 7;
}

function numero8(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 8;
}

function numero9(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    visor.value += 9;
}

function calcular(){
    let visor = document.getElementsByClassName("inputVisorCalculadora")[0];
    valor2 = parseFloat(visor.value);

    let resultado = 0;

    switch(operacao){
        case "soma":
        resultado = valor1 + valor2;
        break;

        case "subtracao":
        resultado = valor1 - valor2;
        break;

        case "multiplicacao":
        resultado = valor1 * valor2;
        break;

        case "divisao":
        resultado = valor1 / valor2;
        break;
        
    }

    visor.value = resultado;

}
