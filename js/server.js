// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, restrinja para o seu domínio frontend
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Um usuário conectou:', socket.id);

    socket.on('disconnect', () => {
        console.log('Usuário desconectou:', socket.id);
    });

    socket.on('realizarTiro', (dadosTiro) => {
        console.log(`Tiro recebido de ${socket.id}:`, dadosTiro);
        // Lógica para processar o tiro no servidor
        // Por exemplo, verificar se atingiu um navio do oponente,
        // atualizar o estado do jogo e notificar ambos os jogadores.

        // Exemplo de resposta (você precisará de uma lógica mais complexa para um jogo real):
        // socket.emit("resultadoTiro", { coordenadas: dadosTiro, status: "agua" });
        // Para enviar para o outro jogador (se houver):
        // socket.broadcast.emit("oponenteJogou", dadosTiro);
    });

    socket.on('reiniciarJogo', () => {
        console.log(`Pedido de reinício de jogo de ${socket.id}`);
        // Lógica para reiniciar o jogo para este socket ou para todos os envolvidos
    });

    // Outros eventos do jogo
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});