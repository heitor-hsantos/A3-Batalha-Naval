import { Navio } from './navio.js';
import { Tabuleiro } from './tabuleiro.js';

let jogoTabuleiro; // Instância da classe Tabuleiro para o jogo atual
let jogoAtivo = false;

export function startGame() {
    console.log("Iniciando novo jogo...");
    jogoTabuleiro = new Tabuleiro(); // Cria nova instância, que também renderiza o DOM
    const naviosParaPosicionar = criarFrota();

    naviosParaPosicionar.forEach(navio => {
        let inseridoComSucesso = false;
        while (!inseridoComSucesso) {
            const orientacaoIndex = Math.floor(Math.random() * 2);
            navio.setOrientacao(["horizontal", "vertical"][orientacaoIndex]);

            const linhaInicial = Math.floor(Math.random() * 10);
            const colunaInicial = Math.floor(Math.random() * 10);

            if (verificarPosicaoValida(jogoTabuleiro, navio, linhaInicial, colunaInicial)) {
                posicionarNavioNoTabuleiro(jogoTabuleiro, navio, linhaInicial, colunaInicial);
                inseridoComSucesso = true;
            }
        }

    });
    // Limpa o campo de entrada e habilita o botão de atirar
   // Função utilitária para testar todas as células do grid (para debug)


    const entradaCoordenada = document.getElementById('coordenadaInput');
    if (entradaCoordenada) {
        entradaCoordenada.value = '';
        entradaCoordenada.disabled = false;
        entradaCoordenada.focus();
    }
    const botaoAtirar = document.querySelector('.input-container button');
    if (botaoAtirar) botaoAtirar.disabled = false;

    jogoAtivo = true;
    console.log("Jogo iniciado e pronto.");
}
// Uso exclusivo para debug, não deve ser usado em produção
export function debugGame(){
    function testarTodasCelulas() {
        if (!jogoTabuleiro) {
            console.error("Tabuleiro não inicializado.");
            return;
        }
        for (let linha = 0; linha < 10; linha++) {
            for (let coluna = 0; coluna < 10; coluna++) {
                jogoTabuleiro.processarTiro(linha, coluna);
            }
        }
        alert("Todas as células foram testadas!");}

    console.log("Iniciando novo jogo...");
    jogoTabuleiro = new Tabuleiro(); // Cria nova instância, que também renderiza o DOM
    const naviosParaPosicionar = criarFrota();

    naviosParaPosicionar.forEach(navio => {
        let inseridoComSucesso = false;
        while (!inseridoComSucesso) {
            const orientacaoIndex = Math.floor(Math.random() * 2);
            navio.setOrientacao(["horizontal", "vertical"][orientacaoIndex]);

            const linhaInicial = Math.floor(Math.random() * 10);
            const colunaInicial = Math.floor(Math.random() * 10);

            if (verificarPosicaoValida(jogoTabuleiro, navio, linhaInicial, colunaInicial)) {
                posicionarNavioNoTabuleiro(jogoTabuleiro, navio, linhaInicial, colunaInicial);
                inseridoComSucesso = true;
            }
        }

    });

    const entradaCoordenada = document.getElementById('coordenadaInput');
    if (entradaCoordenada) {
        entradaCoordenada.value = '';
        entradaCoordenada.disabled = false;
        entradaCoordenada.focus();
    }
    const botaoAtirar = document.querySelector('.input-container button');
    if (botaoAtirar) botaoAtirar.disabled = false;
    // Testa todas as células do grid
    testarTodasCelulas()
    jogoAtivo = true;
    // Testa todas as células do grid para debug
    console.log("Jogo iniciado e pronto.");
}
//

export function reiniciarJogo() {
    console.log("Reiniciando o jogo...");
    if (jogoTabuleiro) {
        jogoTabuleiro.reset(); // Limpa o tabuleiro lógico e visual, reseta navios
    }
    startGame(); // Configura um novo jogo
    alert("Novo jogo iniciado! Digite uma coordenada (ex: A1, J10) e clique em Atirar!");
}

function criarFrota() {
    return [
        new Navio("Porta-aviões", 5),
        new Navio("Encouraçado", 4),
        new Navio("Cruzador", 3),
        new Navio("Destróier", 2), // Destróier 1
        new Navio("Destróier", 2), // Destróier 2
        new Navio("Submarino", 3), // Submarino 1
        new Navio("Submarino", 3), // Submarino 2
    ];
}

function verificarPosicaoValida(tabuleiroInstance, navio, linha, coluna) {
    if (navio.orientacao === "horizontal") {
        if (coluna + navio.tamanho > 10) return false; // Fora do tabuleiro
        for (let i = 0; i < navio.tamanho; i++) {
            if (tabuleiroInstance.tabuleiro[linha][coluna + i] !== 0) return false; // Célula ocupada
        }
    } else { // Vertical
        if (linha + navio.tamanho > 10) return false; // Fora do tabuleiro
        for (let i = 0; i < navio.tamanho; i++) {
            if (tabuleiroInstance.tabuleiro[linha + i][coluna] !== 0) return false; // Célula ocupada
        }
    }
    return true;
}

function posicionarNavioNoTabuleiro(tabuleiroInstance, navio, linha, coluna) {
    navio.reset(); // Garante que o navio está limpo antes de posicionar
    navio.setOrientacao(navio.orientacao); // Reafirma a orientação (já deve estar setada)
    const posicoesNavio = [];

    if (navio.orientacao === "horizontal") {
        for (let i = 0; i < navio.tamanho; i++) {
            tabuleiroInstance.adicionarParteNavioNaMatriz(linha, coluna + i, navio);
            posicoesNavio.push([linha, coluna + i]);
        }
    } else { // Vertical
        for (let i = 0; i < navio.tamanho; i++) {
            tabuleiroInstance.adicionarParteNavioNaMatriz(linha + i, coluna, navio);
            posicoesNavio.push([linha + i, coluna]);
        }
    }
    navio.setTodasPosicoes(posicoesNavio); // Define todas as posições do navio de uma vez
}

function converterCoordenadaParaIndices(texto) {
    texto = texto.toUpperCase().trim();
    if (texto.length < 2 || texto.length > 3) return null;

    const letra = texto.charAt(0);
    const numeroStr = texto.substring(1);

    const coluna = letra.charCodeAt(0) - 'A'.charCodeAt(0);
    const linha = parseInt(numeroStr) - 1;

    if (coluna < 0 || coluna >= 10 || isNaN(linha) || linha < 0 || linha >= 10) {
        return null;
    }
    return { linha, coluna };
}

export function lidarComTiro() {
    if (!jogoAtivo) {
        alert("O jogo terminou. Por favor, inicie um novo jogo.");
        return;
    }

    const entradaCoordenada = document.getElementById('coordenadaInput');
    const textoCoordenada = entradaCoordenada.value;
    const coordenadas = converterCoordenadaParaIndices(textoCoordenada);

    if (coordenadas === null) {
        alert("Coordenada inválida! Use o formato LetraNúmero (ex: A1, B5, J10).");
        entradaCoordenada.value = '';
        entradaCoordenada.focus();
        return;
    }

    if (!jogoTabuleiro) {
        console.error("Erro: Tabuleiro não inicializado ao tentar atirar.");
        return;
    }

    const resultadoTiro = jogoTabuleiro.processarTiro(coordenadas.linha, coordenadas.coluna);

    if (resultadoTiro && resultadoTiro.status !== "repetido" && resultadoTiro.status !== "erro_interno") {
        if (jogoTabuleiro.verificarTodosNaviosAfundados()) {
            alert("Parabéns! Todos os navios inimigos foram afundados! Você venceu!");
            console.log("FIM DE JOGO! Jogador venceu!");
            jogoTabuleiro.desativarInteracaoVisual();
            if (entradaCoordenada) entradaCoordenada.disabled = true;
            const botaoAtirar = document.querySelector('.input-container button');
            if (botaoAtirar) botaoAtirar.disabled = true;
            jogoAtivo = false;
        }
    }

    entradaCoordenada.value = '';
    entradaCoordenada.focus();
}