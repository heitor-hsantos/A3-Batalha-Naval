// js/webSocket.js
import { io } from "socket.io-client";

let socket;

export function conectarAoServidor(url) {
    if (socket && socket.connected) {
        console.log("Já conectado ao servidor Socket.IO.");
        return socket;
    }

    // Certifique-se de que a URL aponta para o seu servidor Socket.IO
    // Exemplo: "http://localhost:3000" se o servidor estiver rodando localmente na porta 3000
    socket = io(url);

    socket.on("connect", () => {
        console.log("Conectado ao servidor Socket.IO! ID:", socket.id);
        // Você pode emitir um evento personalizado para notificar outras partes da aplicação
        // document.dispatchEvent(new CustomEvent('socketConnected', { detail: socket }));
    });

    socket.on("disconnect", (reason) => {
        console.log("Desconectado do servidor Socket.IO. Razão:", reason);
        // document.dispatchEvent(new CustomEvent('socketDisconnected', { detail: reason }));
    });

    // Adicione aqui outros listeners para eventos vindos do servidor
    // Exemplo:
    // socket.on("atualizacaoGameState", (data) => {
    //   console.log("Estado do jogo atualizado pelo servidor:", data);
    //   // Chame uma função para atualizar a UI ou a lógica do jogo
    // });

    return socket;
}

export function enviarMensagem(evento, dados) {
    if (socket && socket.connected) {
        socket.emit(evento, dados);
    } else {
        console.error("Socket não está conectado. Não é possível enviar a mensagem:", evento, dados);
    }
}

// Opcional: exportar a instância do socket diretamente se precisar de acesso mais direto em alguns casos,
// mas geralmente é melhor usar funções wrapper como conectarAoServidor e enviarMensagem.
// export { socket };