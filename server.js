// const express = require("express");
// const Stream = require("node-rtsp-stream");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// // Mapeamento das suas câmeras RTSP
// const cameraStreams = {
//   camera1: new Stream({
//     name: "Camera 1",
//     streamUrl:
//       "rtsp://vsoft:Vsoft@123@45.238.45.139:555/cam/realmonitor?channel=1&subtype=0", // Substitua pelo link da sua câmera
//     wsPort: 9999,
//     ffmpegOptions: {
//       "-stats": "",
//       "-r": 30,
//     },
//   }),
//   // Adicione mais câmeras conforme necessário
//   // camera2: new Stream({
//   //   name: 'Camera 2',
//   //   streamUrl: 'SEU_LINK_RTSP_AQUI_2',
//   //   wsPort: 9998,
//   //   ffmpegOptions: {
//   //     '-stats': '',
//   //     '-r': 30,
//   //   },
//   // }),
// };

// app.get("/streams", (req, res) => {
//   const streamKeys = Object.keys(cameraStreams);
//   const streams = streamKeys.map((key) => ({
//     name: cameraStreams[key].name,
//     url: `ws://localhost:${cameraStreams[key].wsPort}`,
//   }));
//   res.json(streams);
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Servidor de mídia rodando na porta ${PORT}`);
// });

// Tentativa 2
// const NodeMediaServer = require("node-media-server");

// const rtspStreamUrl = "rtsp://klayton:km1010@192.168.0.5:554/stream8";

// const config = {
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60,
//   },
//   http: {
//     port: 8000,
//     mediaroot: "./media",
//     allow_origin: "*",
//   },
//   trans: {
//     tasks: [
//       {
//         app: "live",
//         vc: "libx264",
//         vcParams: ["-preset", "ultrafast", "-tune", "zerolatency"],
//         hls: true,
//         hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
//         name: "camera1",
//         pull: {
//           url: rtspStreamUrl,
//           reconnect: true,
//           ffmpeg_ops: [
//             "-rtsp_transport",
//             "tcp",
//             "-fflags",
//             "+genpts",
//             // CORREÇÃO: Mapeia apenas o stream de vídeo (0:v) da câmera,
//             // ignorando completamente o stream de áudio, que pode estar corrompido.
//             "-map",
//             "0:v",
//           ],
//         },
//       },
//     ],
//   },
// };

// const nms = new NodeMediaServer(config);
// nms.run();

// console.log("Node Media Server is running...");
// console.log("Acesse o stream HLS em: http://localhost:8000/live/camera1.m3u8");

// // Listeners de depuração
// nms.on("postPublish", (id, StreamPath, args) => {
//   console.log(
//     "✅ SUCESSO: Stream publicado!",
//     `id=${id} StreamPath=${StreamPath}`
//   );
// });

// nms.on("donePublish", (id, StreamPath, args) => {
//   console.log("❌ Stream encerrado.", `id=${id} StreamPath=${StreamPath}`);
// });

// Tentativa 3
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
