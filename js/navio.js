export class Navio {
    constructor(nome, tamanho) {
        this.nome = nome;
        this.tamanho = tamanho;
        this.afundado = false;
        this.posicao = []; // Array de coordenadas [linha, coluna] que o navio ocupa
        this.orientacao = ""; // "horizontal" ou "vertical"
        this.acertos = 0;
    }

    recebeAtaque() {
        this.acertos++;
        console.log(`Navio ${this.nome} atingido! ${this.acertos}/${this.tamanho} acertos.`);
        if (this.acertos >= this.tamanho) {
            this.afundado = true;
            console.log(`Afundou o ${this.nome}!`);
            return true; // Indica que o navio foi afundado
        }
        return false; // Indica que o navio foi atingido, mas não afundado
    }

    // Define uma parte da posição do navio
    setPosicaoParte(linha, coluna) {
        this.posicao.push([linha, coluna]);
    }

    // Define todas as posições do navio de uma vez
    setTodasPosicoes(posicoes) {
        this.posicao = posicoes;
    }

    setOrientacao(orientacao) {
        this.orientacao = orientacao;
    }

    reset() {
        this.acertos = 0;
        this.afundado = false;
        this.posicao = [];
    }
}