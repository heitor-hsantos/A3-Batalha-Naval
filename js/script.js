// Em js/script.js (seu ponto de entrada principal)
import { startGame, reiniciarJogo, lidarComTiro } from './logicaDoJogo.js'; // Ajuste o caminho se necessário

// Expor funções para serem chamadas pelo HTML (via onclick)
window.atirar = lidarComTiro;
window.reiniciarJogo = reiniciarJogo;

// Iniciar o jogo quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    startGame();
});


