# Streaming de Câmera RTSP para Web com Node.js e React

Este projeto demonstra uma solução completa para capturar um stream de vídeo de uma câmera com protocolo RTSP, convertê-lo em tempo real em um servidor Node.js e exibi-lo em uma aplicação web moderna construída com React.

## Arquitetura e Fluxo de Funcionamento

O principal desafio é a incompatibilidade nativa do protocolo RTSP com os navegadores web. A solução implementada utiliza um servidor intermediário para atuar como uma "ponte de tradução" entre a câmera e o cliente web.

```mermaid
graph TD
    subgraph "Fonte do Vídeo"
        A(📹<br><b>Câmera IP</b><br>Gera o stream original)
    end

    subgraph "Servidor de Backend (Node.js)"
        B(⚙️<br><b>Processo Node.js</b><br>Gerencia a conversão)
        C(🎬<br><b>FFmpeg</b><br>Converte o vídeo)
    end

    subgraph "Cliente Frontend (Navegador)"
        D(⚛️<br><b>Aplicação React</b><br>Interface do Usuário)
        E(🖼️<br><b>Player JSMpeg</b><br>Decodifica o vídeo)
        F(🖥️<br><b>Tela do Usuário</b><br>Exibição no Canvas)
    end

    A -- "1. Stream de Vídeo<br><i>(Protocolo RTSP)</i>" --> B
    B -- "2. Inicia e controla o FFmpeg" --> C
    C -- "3. Puxa o stream RTSP<br>e converte para MPEG1" --> B
    B -- "4. Transmite o vídeo MPEG1<br><i>(Protocolo WebSocket)</i>" --> D
    D -- "5. Passa a URL WebSocket<br>para o Player" --> E
    E -- "6. Recebe os dados e<br>renderiza no Canvas" --> F

    style A fill:#cde,stroke:#333,stroke-width:2px
    style B fill:#fde,stroke:#333,stroke-width:2px
    style C fill:#fde,stroke:#333,stroke-width:2px
    style D fill:#dfd,stroke:#333,stroke-width:2px
    style E fill:#dfd,stroke:#333,stroke-width:2px
    style F fill:#dfd,stroke:#333,stroke-width:2px
```

## Tecnologias Utilizadas

### Backend (Servidor de Conversão):

Node.js: Ambiente de execução para o nosso servidor.

Express.js: (Opcional) Framework para criar rotas de API e verificar o status do servidor.

node-rtsp-stream: Biblioteca Node.js que simplifica a interação com o FFmpeg para streams RTSP.

FFmpeg: A ferramenta principal, executada em segundo plano, responsável pela transcodificação do vídeo.

### Frontend (Cliente Web):

React: Biblioteca para construir a interface do usuário.

JSMpeg: Player de vídeo em JavaScript especializado em decodificar streams MPEG1 enviados via WebSocket e renderizá-los em um elemento `<canvas>`.

### Ferramentas de Diagnóstico:

VLC Media Player: Utilizado para testar os streams de vídeo (RTSP e HLS) de forma independente, ajudando a isolar problemas no servidor.

## Como Funciona

Fonte do Vídeo: Uma câmera IP na rede disponibiliza um stream de vídeo via protocolo RTSP.

Servidor Intermediário: Um servidor Node.js se conecta a essa URL RTSP.

Transcodificação: Usando o FFmpeg, o servidor converte o stream de vídeo da câmera (que pode estar em formatos como MJPEG ou H.264) para o formato MPEG1.

Transmissão: O vídeo MPEG1 convertido é transmitido continuamente através de uma conexão WebSocket em uma porta específica (ex: 9999).

Cliente React: A aplicação React, rodando no navegador do usuário, não se conecta à câmera. Em vez disso, ela estabelece uma conexão WebSocket com o servidor Node.js.

Exibição: A biblioteca JSMpeg no lado do cliente recebe os dados do vídeo pelo WebSocket e os renderiza em tempo real em um elemento `<canvas>`, tornando o vídeo visível para o usuário.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

Node.js (versão 16 ou superior)

npm ou yarn

FFmpeg (deve estar instalado e acessível no PATH do seu sistema)

## Instalação e Execução

1. Backend (Servidor Node.js):

### Clone o repositório (ou crie a pasta do servidor)

```bash
cd pasta-do-servidor
```

### Instale as dependências

npm install express cors node-rtsp-stream

### Edite o arquivo server.js para configurar a URL da sua câmera RTSP

`const rtspStreamUrl = "rtsp://seu_usuario:sua_senha@seu_ip:554/seu_path";`

### Inicie o servidor

node server.js

O servidor estará aguardando conexões na porta WebSocket 9999.

2. Frontend (Aplicação React):

Clone o repositório (ou crie a pasta do cliente)

```bash
cd pasta-do-cliente
```

### Instale as dependências

```bash
npm install
```

### Certifique-se de que o componente VideoPlayer está usando a URL correta do WebSocket

`<VideoPlayer streamUrl="ws://localhost:9999" ... />`

### Inicie a aplicação React

```bash
npm run dev
```

Acesse a aplicação no seu navegador, geralmente em http://localhost:3000 ou outra porta especificada pelo seu setup React.
