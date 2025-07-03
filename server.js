const express = require("express");
const cors = require("cors");
const Stream = require("node-rtsp-stream");

const app = express();
app.use(cors());

// --- Configuração do Stream ---

// A URL da sua câmera com as credenciais
// const rtspStreamUrl = "rtsp://klayton:km1010@192.168.0.5:554/stream8"; // 360p
// const rtspStreamUrl = "rtsp://klayton:km1010@192.168.0.5:554/stream3"; // 720p
const rtspStreamUrl = "rtsp://klayton:km1010@192.168.0.5:554/stream2"; // 1080p

// Opções do FFmpeg que descobrimos serem necessárias
const ffmpegOptions = {
  // Usa TCP para uma conexão mais estável
  "-rtsp_transport": "tcp",
  // Corrige os timestamps defeituosos enviados pela câmera
  "-fflags": "+genpts",
  // Mapeia apenas o stream de vídeo, ignorando o áudio problemático
  "-map": "0:v",
  // Converte o vídeo para um formato que o JSMpeg entende
  "-codec:v": "mpeg1video",
  // Parâmetros de qualidade e performance
  "-b:v": "2M",
  "-maxrate": "2M",
  "-bufsize": "1M",
  "-r": "25", // Limita a 25 frames por segundo
};

// Inicializa o stream na porta WebSocket 9999
const stream = new Stream({
  name: "camera1",
  streamUrl: rtspStreamUrl,
  wsPort: 9999,
  ffmpegOptions: ffmpegOptions,
});

console.log("Servidor de Stream iniciado.");
console.log("Aguardando conexão do player na porta WebSocket 9999.");

// Opcional: Uma rota simples para verificar se o servidor está no ar
app.get("/", (req, res) => {
  res.send(
    "Servidor de stream está no ar. Conecte-se via WebSocket na porta 9999."
  );
});

// Inicia o servidor Express (não é essencial para o stream, mas bom para teste)
const expressPort = 3001;
app.listen(expressPort, () => {
  console.log(`Servidor Express rodando na porta ${expressPort}.`);
});
