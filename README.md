![GitHub last commit](https://img.shields.io/github/last-commit/RRD4RK/nexo-bank)
![GitHub repo size](https://img.shields.io/github/repo-size/RRD4RK/nexo-bank)
![License MIT](https://img.shields.io/badge/license-MIT-green)

# 🏦 NexoBank - ATM Digital

O **NexoBank** é um sistema de Caixa Eletrônico Digital (ATM) desenvolvido para facilitar operações bancárias essenciais como saques, depósitos, transferências e consulta de extratos. O projeto foca em uma interface limpa, segura e totalmente responsiva.

## 🎨 Protótipo do Projeto

Você pode visualizar o design planejado para este sistema através do link abaixo:
[Visualizar no Figma](https://www.figma.com/site/vj0CmvOvUrkGv59xQ6yLG3/Sem-t%C3%ADtulo?node-id=0-1&t=h17UklrxgjtXf45W-1)

---

## 🛠️ Tecnologias e Dependências

### **Framework CSS: Bootstrap 5.3**

- **Justificativa:** A escolha pelo Bootstrap deve-se à sua robustez na criação de dashboards financeiros e formulários complexos. No deploy do GitHub Pages, o Bootstrap é carregado por CDN para não depender da pasta `node_modules`. Utilizamos o sistema de **Grid Flexbox** para garantir a responsividade em dispositivos móveis e componentes como **Cards** para exibição de saldo, **Tables** para o extrato, **Toasts** para mensagens e **Modals** para confirmações de transações.

### **API Pública: HG Brasil Finance**

- **Justificativa:** Integrada para buscar dados reais de câmbio (Dólar, Euro e Bitcoin). Essa escolha agrega valor ao sistema bancário, permitindo que o usuário visualize cotações atualizadas diretamente em seu painel de controle, simulando a experiência de um banco digital moderno.

### **Outras Tecnologias:**

- **HTML5 & Sass (SCSS):** Estrutura e estilização customizada com variáveis e mixins.
- **JavaScript & jQuery:** Lógica de negócio e manipulação dinâmica do DOM.
- **jQuery Mask Plugin:** Para garantir a segurança e formatação de dados sensíveis como CPF e valores monetários.
- **JSON Server:** Utilizado para simular o banco de dados das transações e usuários (GET/POST).

---

## 🚀 Checklist de Requisitos da 2ª Avaliação

- [x] **ID 01** - Prototipação (Figma)
- [x] **ID 02** - Layout Responsivo com Framework (Bootstrap)
- [x] **ID 03** - Layout Responsivo com CSS puro (Flexbox/Grid)
- [x] **ID 04** - Componentes de Framework (Cards, Botões, Toasts, Modais)
- [x] **ID 05** - Unidades Relativas (rem, %, vh, vw e clamp)
- [x] **ID 06** - Design System consistente
- [x] **ID 07** - Uso de Sass (SCSS) com variáveis e mixins
- [x] **ID 08** - Tipografia responsiva com `clamp()`
- [x] **ID 09** - Responsividade de imagens com containers relativos e `object-fit`
- [x] **ID 10** - Otimização de imagens com WebP, `srcset`, `sizes` e fallback PNG
- [ ] **ID 11** - Validação HTML nativa
- [ ] **ID 12** - Validação com REGEX
- [ ] **ID 13** - Elementos de seleção (select)
- [ ] **ID 14** - Web Storage (localStorage)
- [x] **ID 15** - Configuração Node.js/NPM
- [x] **ID 16** - Versionamento Git/GitHub
- [x] **ID 17** - README padronizado
- [x] **ID 18** - Organização modular de arquivos
- [x] **ID 19** - Linters e Formatadores (ESLint/Prettier)
- [ ] **ID 20** - jQuery para manipulação do DOM
- [ ] **ID 21** - Plugin jQuery (Mask)
- [ ] **ID 22** - Requisição POST (JSON Server)
- [ ] **ID 23** - Requisição GET (JSON Server)
- [x] **ID 24** - APIs Públicas (HG Brasil Finance)

---

## 🔧 Como executar o projeto

1.  Clone o repositório.
2.  Instale as dependências: `npm install`.
3.  Compile o Sass usado pelas páginas: `npm run build:css`.
4.  Inicie o JSON Server: `npm run server`.
5.  Abra o `index.html` com o Live Server.

## 🧪 Qualidade de código

- `npm run lint` valida os arquivos JavaScript com ESLint.
- `npm run format` padroniza HTML, JS, SCSS, JSON e Markdown com Prettier.

## 🎥 Guia curto para o vídeo

Para cada ID, mostre o código no VS Code e o efeito no navegador/DevTools:

- **ID 02:** Grid e utilitários Bootstrap em `pages/deposit.html`, `pages/withdraw.html`, `pages/register.html` e `pages/locator.html`.
- **ID 03:** `.dashboard-layout`, `.operation-menu`, `.hero-home`, `.keypad` e media queries em `assets/css/style.css`.
- **ID 04:** `card`, `btn`, `modal`, `toast`, `table` e `form-control` nas páginas internas.
- **ID 05:** `min()`, `%`, `rem`, `vh`, `vw` e `clamp()` em `assets/css/style.css` e `assets/scss/main.scss`.
- **ID 07:** variáveis em `assets/scss/_variable.scss`, mixins em `assets/scss/_mixins.scss` e uso em `assets/scss/main.scss`, compilado para `assets/css/scss-demo.css`.
- **ID 08:** tipografia fluida com `clamp()` no hero, saldo e displays do ATM.
- **ID 09:** `object-fit`, `aspect-ratio`, `max-width` e containers relativos nos logos e hero.
- **ID 10:** `<picture>`, WebP, `srcset`, `sizes` e fallback PNG no logo da home/navbar.
- **ID 15:** `package.json`, `package-lock.json` e scripts NPM.
- **ID 16:** `.gitignore`, branch principal e histórico no GitHub.
- **ID 17:** checklist e instruções neste `README.md`.
- **ID 18:** organização por `pages/`, `assets/css/`, `assets/scss/`, `assets/js/`, `assets/img/` e `docs/`.
- **ID 19:** `.eslintrc.json`, `.prettierrc`, `npm run lint` e `npm run format`.
