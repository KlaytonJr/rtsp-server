Documentação da Solução: Exibição de Câmeras RTSP em Aplicação Web React
Este documento detalha a arquitetura e o fluxo técnico implementado para exibir, em tempo real, o vídeo de uma câmera com protocolo RTSP (Real-Time Streaming Protocol) dentro de uma aplicação web moderna construída em React.

1. O Desafio Central: A Incompatibilidade do RTSP com a Web
   O ponto de partida do projeto é entender que navegadores web (Chrome, Firefox, etc.) não conseguem interpretar o protocolo RTSP nativamente. Este protocolo é padrão em sistemas de CFTV e câmeras IP profissionais, mas não foi projetado para ser consumido diretamente por aplicações web.

Tentar passar uma URL rtsp://... para um componente de vídeo no React resultará em falha, pois o navegador não sabe como processar essa requisição. Portanto, uma camada intermediária de "tradução" é indispensável.

2. A Arquitetura da Solução: O Fluxo de Conversão
   Para resolver o desafio, implementamos uma arquitetura de três etapas que converte o stream da câmera em um formato compatível com a web em tempo real.

Etapa 1: A Fonte (Câmera RTSP)

A câmera IP na rede local atua como a fonte original do vídeo.

Ela disponibiliza o stream de vídeo através de uma URL no protocolo RTSP, que inclui o endereço IP da câmera, a porta (geralmente 554) e as credenciais de acesso (usuário e senha).

Exemplo da nossa URL: rtsp://klayton:km1010@192.168.0.5:554/stream8

Etapa 2: O Servidor Intermediário (Middleware)

Esta é a peça mais importante da arquitetura. Criamos um servidor Node.js que atua como um tradutor em tempo real.

Biblioteca Principal: Utilizamos a biblioteca node-rtsp-stream. Esta biblioteca serve como um "invólucro" (wrapper) que facilita o uso da ferramenta principal.

Motor de Conversão: A ferramenta que faz todo o trabalho pesado é o FFmpeg. É um software de código aberto extremamente poderoso para manipulação de áudio e vídeo. O nosso servidor Node.js simplesmente executa comandos do FFmpeg em segundo plano.

O Processo de Conversão (Transcodificação):

O servidor Node.js inicia um processo FFmpeg.

O FFmpeg se conecta à URL RTSP da câmera.

Ele recebe o stream de vídeo (que descobrimos ser no formato MJPEG com timestamps defeituosos).

Em tempo real, ele converte (transcodifica) o vídeo para o formato MPEG1.

O vídeo convertido é então transmitido através de um WebSocket em uma porta específica (no nosso caso, a porta 9999).

Etapa 3: O Cliente (Aplicação React)

O nosso componente React é o consumidor final do vídeo. Ele não se conecta diretamente à câmera.

Biblioteca de Exibição: Utilizamos a biblioteca JSMpeg. É um player de vídeo escrito em JavaScript, especificamente projetado para decodificar streams de vídeo MPEG1 enviados via WebSocket e renderizá-los em um elemento <canvas> do HTML.

O Processo de Exibição:

O componente VideoPlayer no React primeiro carrega dinamicamente a biblioteca JSMpeg a partir de um link externo (CDN).

Após o carregamento, ele se conecta à URL do WebSocket exposta pelo nosso servidor Node.js (ws://localhost:9999).

O JSMpeg recebe os dados do vídeo através da conexão WebSocket e os "desenha" em tempo real dentro do elemento <canvas>, permitindo que o usuário veja a imagem da câmera.

3. O Processo de Diagnóstico e Validação
   Para chegar à solução final, seguimos um processo de depuração lógico e incremental que foi crucial para identificar os problemas.

Teste com VLC Media Player: A primeira tentativa de depuração foi usar o VLC para tentar abrir o stream HLS que a primeira versão do servidor gerava. O VLC é uma ferramenta de diagnóstico universal para vídeo. Como o VLC também falhou, isso nos deu 100% de certeza de que o problema estava no servidor, e não no React. Isso nos poupou muito tempo de investigação no front-end.

Teste Direto com FFmpeg no Terminal: Este foi o passo decisivo. Ao executar o comando do FFmpeg diretamente no terminal, nós removemos o "invólucro" do Node.js e vimos as mensagens de erro puras do motor de conversão. Foi através desse log que descobrimos as duas causas raiz do problema:

O formato do vídeo era MJPEG.

A câmera enviava timestamps defeituosos (Non-increasing DTS).

Com essas informações, conseguimos montar a configuração final e correta para o FFmpeg dentro do nosso servidor Node.js.

4. Resumo das Tecnologias e Ferramentas
   Protocolo da Câmera: RTSP

Ambiente do Servidor: Node.js

Biblioteca do Servidor: node-rtsp-stream

Ferramenta de Transcodificação: FFmpeg

Protocolo de Comunicação (Servidor -> Cliente): WebSocket

Formato do Vídeo Transmitido: MPEG1

Ambiente do Cliente: React

Biblioteca do Player (Cliente): JSMpeg

Ferramenta de Diagnóstico: VLC Media Player

5. Conclusão
   A solução implementada é uma arquitetura robusta e padrão de mercado para integrar sistemas de câmeras profissionais com aplicações web. O uso de um servidor intermediário para transcodificar o stream RTSP para um formato web-compatível (neste caso, MPEG1 sobre WebSocket) é a abordagem correta e escalável, garantindo que a aplicação final seja compatível com todos os navegadores modernos sem a necessidade de plugins ou tecnologias obsoletas como ActiveX.

Testar conexão com a camera

```bash
ffmpeg -loglevel debug -rtsp_transport tcp -fflags +genpts -i "rtsp://klayton:km1010@192.168.0.5:554/stream8" -an -f null -
```

Instalei o I spy para poder visuarlizar a camera via RTSP localmente no navegador, acessando via:
http://localhost:8090/?viewIndex=0#Live

```bash
curl -sL "https://www.ispyconnect.com/install" | bash
```

Instalei o AgentDVR para poder visualizar a camera via RTSP
