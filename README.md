# JOSM Ground Guide - VATSIM Brasil Operações

O **JOSM Ground Guide** é uma plataforma desenvolvida para o Departamento de Operações da VATSIM Brasil, voltada para instruir e capacitar colaboradores e controladores no processo de criação de **Ground Layouts** (desenhos de solo de aeroportos) utilizando o OpenStreetMap e JOSM.

## 🚀 Funcionalidades

- **Mapeamento de Status**: Uma listagem e mapa interativo que exibe, em tempo real, quais aeroportos brasileiros já possuem vetorização de solo pronta, quais estão em andamento, e quais estão na fila.
- **Tutorial Interativo**: Um passo a passo para configuração do JOSM, com uma interface que facilita copiar as classificações de polígonos (tags OSM) com um clique e templates para download.
- **Guia Visual de Polígonos**: Cartões dinâmicos exibindo os principais elementos de infraestrutura aeroportuária com suas respectivas cores e códigos `aeroway` e `landuse`.
- **Renderização Dinâmica de Mapas 3D**: Uma experiência visual imersiva que mostra aeroportos do Brasil gerados dinamicamente em 3D sobrepostos à imagem de satélite através de requisições ao Overpass API.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído para ter a maior performance e portabilidade possível, utilizando apenas tecnologias web nativas sem necessidade de builds complexos:

- **HTML5 & CSS3 Vanilla** para estrutura, interatividade visual (Glassmorphism, gradientes e animações) e total responsividade.
- **JavaScript Vanilla** para lógica de manipulação de DOM, requisições de API e interação do usuário (ex: botão de cópia de código em um clique).
- **Leaflet.js** para renderização do Mapa Interativo.

## 📦 Deploy / Hospedagem

Este site é **100% estático**, não utiliza bundlers e está completamente otimizado.  
**O projeto está pronto para a Vercel**:

1. Conecte o repositório à Vercel.
2. Não é necessário configurar nenhum _Framework Preset_ ou _Build Command_.
3. O _Output Directory_ já é a raiz do projeto (onde está o `index.html`).
4. Clique em Deploy e seu site estará no ar instantaneamente.

## 🗂️ Estrutura de Arquivos

- `index.html`, `style.css`, `script.js` - Base principal visual e interativa da aplicação.
- `project_airports.js` - Arquivo onde constam o banco de dados e os status (`done`, `in_progress`, `pending`) de cada um dos aeroportos da VATSIM Brasil.
- `airports.js` - Biblioteca auxiliar de dados estáticos para as coordenadas base dos aeroportos.
- `runway_v2.kml` - Template para auxiliar colaboradores a marcar a posição real da pista no satélite.
- `data/airports_geometry.json` - Payload vetorizado (em GeoJSON) dos aeroportos processados, usado para abastecer a demonstração visual 3D na tela do laptop.
- `scripts/fetch_all_airports.js` - Script de automação Node.js (`node scripts/fetch_all_airports.js`) utilizado esporadicamente para varrer a API pública Overpass e baixar as novas construções de aeroportos que passarem para o status `done`.
