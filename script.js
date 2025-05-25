let tabuleiro;

function startGame() {
    tabuleiro = new Tabuleiro();
    const navios = createPecas();
    navios.forEach(navio => {
        let inserido = false;
        while (!inserido) {
            const orientacaoIndex = Math.floor(Math.random() * 2);
            navio.setOrientacao(["horizontal", "vertical"][orientacaoIndex]);

            const linhaInicial = Math.floor(Math.random() * 10);
            const colunaInicial = Math.floor(Math.random() * 10);

            if (podeInserir(tabuleiro, navio, linhaInicial, colunaInicial)) {
                inserirNoTabuleiro(tabuleiro, navio, linhaInicial, colunaInicial);
                inserido = true;
            }
        }
    });
    const entrada = document.getElementById('coordenadaInput');
    if (entrada) entrada.focus();
}

function reiniciarJogo() {
    console.log("Reiniciando o jogo...");

    const alertaOriginal = window.alert;
    window.alert = () => {
    };

    const corpo = document.querySelector('.tabuleiro tbody');
    if (corpo) corpo.innerHTML = '';

    const entrada = document.getElementById('coordenadaInput');
    if (entrada) {
        entrada.value = '';
        entrada.focus();
    }

    startGame();

    window.alert = alertaOriginal;
    alert("Novo jogo iniciado! Digite uma coordenada (ex: A1, J10) e clique em Atirar!");
}

function converterCoordenada(texto) {
    texto = texto.toUpperCase().trim();
    if (texto.length < 2 || texto.length > 3) return null;

    const letra = texto.charAt(0);
    const numeroStr = texto.substring(1);

    const coluna = letra.charCodeAt(0) - 'A'.charCodeAt(0);
    const linha = parseInt(numeroStr) - 1;

    if (coluna < 0 || coluna >= 10 || isNaN(linha) || linha < 0 || linha >= 10) {
        return null;
    }

    return {linha, coluna};
}

function atirar() {
    const entrada = document.getElementById('coordenadaInput');
    const texto = entrada.value;

    const coordenadas = converterCoordenada(texto);

    if (coordenadas === null) {
        alert("Coordenada inválida! Use o formato LetraNúmero (ex: A1, B5, J10).");
        entrada.value = '';
        entrada.focus();
        return;
    }

    tabuleiro.atirar(coordenadas.linha, coordenadas.coluna);
    entrada.value = '';
    entrada.focus();
}

class Navio {
    constructor(nome, tamanho) {
        this.nome = nome;
        this.tamanho = tamanho;
        this.afundado = false;
        this.posicao = [];
        this.orientacao = "";
        this.acertos = 0;
    }

    recebeAtaque() {
        this.acertos++;
        console.log(`Navio ${this.nome} atingido, na posição ${this.posicao}! ${this.acertos}/${this.tamanho}`);
        if (this.acertos >= this.tamanho) {
            this.afundado = true;
            console.log(`Afundou o ${this.nome}!`);
            return true;
        }
        return false;
    }

    setPosicao(linha, coluna) {
        this.posicao.push([linha, coluna]);
    }

    setOrientacao(orientacao) {
        this.orientacao = orientacao;
    }
}

class Tabuleiro {
    constructor() {
        this.tabuleiro = [];
        this.navios = [];
        this.criaTabuleiro();
        this.renderizar();
    }

    criaTabuleiro() {
        for (let i = 0; i < 10; i++) {
            this.tabuleiro[i] = [];
            for (let j = 0; j < 10; j++) {
                this.tabuleiro[i][j] = 0;
            }
        }
    }

    inserirNavio(linha, coluna, navio) {
        if (this.tabuleiro[linha][coluna] === 0) {
            this.tabuleiro[linha][coluna] = navio;
            navio.setPosicao(linha, coluna);
            if (!this.navios.includes(navio)) {
                this.navios.push(navio);
            }
            return true;
        }
        return false;
    }

    renderizar() {
        const tabela = document.querySelector('.tabuleiro');
        const corpo = tabela.querySelector('tbody');
        corpo.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const linha = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = i + 1;
            linha.appendChild(th);

            for (let j = 0; j < 10; j++) {
                const celula = document.createElement('td');
                celula.dataset.row = i;
                celula.dataset.col = j;
                linha.appendChild(celula);
            }
            corpo.appendChild(linha);
        }
    }

    atirar(linha, coluna) {
        const celula = document.querySelector(`td[data-row="${linha}"][data-col="${coluna}"]`);

        if (celula.classList.contains('acerto') || celula.classList.contains('erro')) {
            alert(`A coordenada ${String.fromCharCode(65 + coluna)}${linha + 1} já foi usada!`);
            return;
        }

        const alvo = this.tabuleiro[linha][coluna];

        if (alvo === 0) {
            console.log(`Água! Linha ${linha + 1}, Coluna ${String.fromCharCode(65 + coluna)}`);
            celula.classList.add('erro');
        } else if (alvo instanceof Navio) {
            console.log(`Acertou! Linha ${linha + 1}, Coluna ${String.fromCharCode(65 + coluna)}`);
            celula.classList.add('acerto');

            const acertado = alvo;
            const afundou = acertado.recebeAtaque();

            if (afundou) {
                alert(`Você afundou o ${acertado.nome}!`);
                this.verificarFim();
            }
        }
    }

    verificarFim() {
        const todosAfundados = this.navios.every(navio => navio.afundado);

        if (todosAfundados) {
            alert("Todos os navios foram afundados! Você venceu!");
            console.log("FIM DE JOGO!");
            this.desativar();
            reiniciarJogo();
        }
    }

    desativar() {
        const celulas = document.querySelectorAll('.tabuleiro td');
        celulas.forEach(celula => {
            celula.style.pointerEvents = 'none';
            celula.style.cursor = 'default';
        });
    }
}

function createPecas() {
    return [
        new Navio("Porta-aviões", 5),
        new Navio("Encouraçado", 4),
        new Navio("Cruzador", 3),
        new Navio("Destróier", 2),
        new Navio("Destróier", 2),
        new Navio("Submarino", 3),
        new Navio("Submarino", 3),
    ];
}

function podeInserir(tabuleiro, navio, linha, coluna) {
    if (navio.orientacao === "horizontal") {
        if (coluna + navio.tamanho > 10) return false;
        for (let i = 0; i < navio.tamanho; i++) {
            if (tabuleiro.tabuleiro[linha][coluna + i] !== 0) return false;
        }
    } else {
        if (linha + navio.tamanho > 10) return false;
        for (let i = 0; i < navio.tamanho; i++) {
            if (tabuleiro.tabuleiro[linha + i][coluna] !== 0) return false;
        }
    }
    return true;
}

function inserirNoTabuleiro(tabuleiro, navio, linha, coluna) {
    if (navio.orientacao === "horizontal") {
        for (let i = 0; i < navio.tamanho; i++) {
            tabuleiro.inserirNavio(linha, coluna + i, navio);
        }
    } else {
        for (let i = 0; i < navio.tamanho; i++) {
            tabuleiro.inserirNavio(linha + i, coluna, navio);
        }
    }
}

document.addEventListener('DOMContentLoaded', startGame);
