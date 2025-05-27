import { Navio } from './navio.js';

export class Tabuleiro {
    constructor() {
        this.tabuleiro = []; // Matriz lógica 10x10, 0 para água, objeto Navio para navio
        this.naviosNoTabuleiro = []; // Lista de objetos Navio presentes no tabuleiro
        this.criaMatrizLogica();
        this.renderizarTabuleiroDOM();
    }


    criaMatrizLogica() {
        this.tabuleiro = [];
        for (let i = 0; i < 10; i++) {
            this.tabuleiro[i] = [];
            for (let j = 0; j < 10; j++) {
                this.tabuleiro[i][j] = 0; // 0 representa água
            }
        }
    }

    // Adiciona uma referência ao objeto Navio em uma célula específica da matriz lógica
    // e registra a posição no objeto Navio.
    adicionarParteNavioNaMatriz(linha, coluna, navio) {
        if (this.tabuleiro[linha][coluna] === 0) {
            this.tabuleiro[linha][coluna] = navio;
            navio.setPosicaoParte(linha, coluna); // Informa ao navio sobre esta parte de sua posição

            if (!this.naviosNoTabuleiro.includes(navio)) {
                this.naviosNoTabuleiro.push(navio);
            }
            return true;
        }
        return false; // Célula já ocupada
    }

    renderizarTabuleiroDOM() {
        const tabelaElement = document.querySelector('.tabuleiro');
        if (!tabelaElement) {
            console.error("Elemento .tabuleiro não encontrado no DOM.");
            return;
        }
        const corpoTabela = tabelaElement.querySelector('tbody');
        if (!corpoTabela) {
            console.error("Elemento tbody não encontrado dentro de .tabuleiro.");
            return;
        }
        corpoTabela.innerHTML = ''; // Limpa o tabuleiro existente

        for (let i = 0; i < 10; i++) {
            const linhaTr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = i + 1; // Números das linhas (1-10)
            linhaTr.appendChild(th);

            for (let j = 0; j < 10; j++) {
                const celulaTd = document.createElement('td');
                celulaTd.dataset.row = i;
                celulaTd.dataset.col = j;
                // A lógica de clique será gerenciada centralmente (em gameLogic.js ou main.js)
                // ou através do evento no botão "Atirar"
                linhaTr.appendChild(celulaTd);
            }
            corpoTabela.appendChild(linhaTr);
        }
    }

    processarTiro(linha, coluna) {
        const celulaUI = document.querySelector(`td[data-row="${linha}"][data-col="${coluna}"]`);
        if (!celulaUI) {
            console.error(`Célula UI não encontrada para ${linha},${coluna}`);
            return { status: "erro_interno" };
        }

        if (celulaUI.classList.contains('acerto') || celulaUI.classList.contains('erro')) {
            alert(`A coordenada ${String.fromCharCode(65 + coluna)}${linha + 1} já foi usada!`);
            return { status: "repetido" };
        }

        const alvo = this.tabuleiro[linha][coluna];

        if (alvo === 0) { // Água
            console.log(`Água! Linha ${linha + 1}, Coluna ${String.fromCharCode(65 + coluna)}`);
            celulaUI.classList.add('erro');
            return { status: "agua" };
        } else if (alvo instanceof Navio) { // Acertou um navio
            console.log(`Acertou o navio ${alvo.nome}! Linha ${linha + 1}, Coluna ${String.fromCharCode(65 + coluna)}`);
            celulaUI.classList.add('acerto');

            const navioAtingido = alvo;
            const afundou = navioAtingido.recebeAtaque();

            if (afundou) {
                alert(`Você afundou o ${navioAtingido.nome}!`);
            }
            return { status: "acerto", navio: navioAtingido, afundou: afundou };
        }
        return { status: "erro_inesperado" }; // Caso não previsto
    }

    verificarTodosNaviosAfundados() {
        if (this.naviosNoTabuleiro.length === 0) return false; // Nenhum navio foi colocado
        return this.naviosNoTabuleiro.every(navio => navio.afundado);
    }

    desativarInteracaoVisual() {
        const celulas = document.querySelectorAll('.tabuleiro td');
        celulas.forEach(celula => {
            const celulaClone = celula.cloneNode(true);
            celula.parentNode.replaceChild(celulaClone, celula); // Remove event listeners antigos
            celulaClone.style.cursor = 'default';
        });
        // Desabilitar input e botão é feito em gameLogic
    }

    reset() {
        this.criaMatrizLogica();
        this.naviosNoTabuleiro.forEach(navio => navio.reset()); // Reseta cada navio individualmente
        this.naviosNoTabuleiro = [];
        this.renderizarTabuleiroDOM(); // Re-renderiza o tabuleiro visualmente limpo
    }
}