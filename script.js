

function startGame(){
	createTabuleiro()
	createPecas()
}

function createTabuleiro(){
	const tabuleiro = new Tabuleiro();
	tabuleiro.criaTabuleiro()

}

function createPecas(index){
	//index 0 ou 1
	// 0 = horizontal
	// 1 = vertical
	let orientacao = ["horizontal","vertical"];
	const porta_avioes = new Navio("Porta-aviões",5,orientacao[index]);
	const encouracado = new Navio("Encouraçado",4,orientacao[index]);
	const cruzador = new Navio("Cruzador",3,orientacao[index]);
	const destroier1 = new Navio("Destróier",2,orientacao[index]);
	const destroier2 = new Navio("Destróier",2,orientacao[index]);
	const submarino1 = new Navio("Submarino",3,orientacao[index])
	const submarino2 = new Navio("Submarino",3,orientacao[index]);
	const pecas = [porta_avioes,encouracado,cruzador,submarino1,submarino2,destroier1,destroier2];

}


class Navio {
	constructor(nome,tamanho){
		this.nome = nome;
		this.tamanho = tamanho;
		this.afundado = false;
		this.posicao = [];
		this.orientacao = "";
	}


	recebeAtaque() {
		this.acertos++
		if(this.acertos<=this.tamanho){
			this.afundado = true;
			console.log("Afundou navio "+this.nome +"na posição "+this.posicao);
			return true
		}
		return false;
	}

	setPosicao(linha,coluna){
		this.posicao.push(linha,coluna);
	}
	setOrientacao(orientacao){
		this.orientacao = orientacao;
	}
}

class Tabuleiro {
	constructor(){
		this.tabuleiro = [];
		this.criaTabuleiro();
	}

	criaTabuleiro(){
		for(let i=0;i<10;i++){
			this.tabuleiro[i] = [];
			for(let j=0;j<10;j++){
				this.tabuleiro[i][j] = 0;
			}
		}
	}

	inserirNavio(linha,coluna,navio){
		if(this.tabuleiro[linha][coluna] === 0){
			this.tabuleiro[linha][coluna] = navio;
			navio.setPosicao(linha,coluna);
			return true;
		}
		return false;
	}
}

