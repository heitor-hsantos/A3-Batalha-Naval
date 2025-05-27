import { startGame, reiniciarJogo, lidarComTiro } from './logicaDoJogo.js';

// Expor funções para serem chamadas pelo HTML (via onclick)
window.atirar = lidarComTiro; // O HTML chama atirar(), que agora executa lidarComTiro()
window.reiniciarJogo = reiniciarJogo;

// Iniciar o jogo quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});