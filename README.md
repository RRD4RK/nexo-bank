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
* **Justificativa:** A escolha pelo Bootstrap deve-se à sua robustez na criação de dashboards financeiros e formulários complexos. Utilizamos o sistema de **Grid Flexbox** para garantir a responsividade em dispositivos móveis e componentes como **Cards** para exibição de saldo, **Tables** para o extrato e **Modals** para confirmações de transações, garantindo agilidade no desenvolvimento e fidelidade ao protótipo.

### **API Pública: HG Brasil Finance**
* **Justificativa:** Integrada para buscar dados reais de câmbio (Dólar, Euro e Bitcoin). Essa escolha agrega valor ao sistema bancário, permitindo que o usuário visualize cotações atualizadas diretamente em seu painel de controle, simulando a experiência de um banco digital moderno.

### **Outras Tecnologias:**
* **HTML5 & Sass (SCSS):** Estrutura e estilização customizada com variáveis e mixins.
* **JavaScript & jQuery:** Lógica de negócio e manipulação dinâmica do DOM.
* **jQuery Mask Plugin:** Para garantir a segurança e formatação de dados sensíveis como CPF e valores monetários.
* **JSON Server:** Utilizado para simular o banco de dados das transações e usuários (GET/POST).

---

## 🚀 Checklist de Requisitos

- [x] **ID 01** - Prototipação (Figma)
- [x] **ID 02** - Layout Responsivo com Framework (Bootstrap)
- [ ] **ID 03** - Layout Responsivo com CSS puro (Flexbox/Grid)
- [x] **ID 04** - Componentes de Framework (Cards, Modais)
- [ ] **ID 05** - Unidades Relativas (rem, em)
- [ ] **ID 06** - Design System consistente
- [x] **ID 07** - Uso de Sass (SCSS) com variáveis
- [ ] **ID 08** - Tipografia responsiva (clamp)
- [ ] **ID 09** - Responsividade de imagens (object-fit)
- [ ] **ID 10** - Otimização de imagens (WebP)
- [ ] **ID 11** - Validação HTML nativa
- [ ] **ID 12** - Validação com REGEX
- [ ] **ID 13** - Elementos de seleção (select)
- [ ] **ID 14** - Web Storage (localStorage)
- [x] **ID 15** - Configuração Node.js/NPM
- [x] **ID 16** - Versionamento Git/GitHub
- [x] **ID 17** - README padronizado
- [x] **ID 18** - Organização modular de arquivos
- [ ] **ID 19** - Linters e Formatadores (ESLint/Prettier)
- [ ] **ID 20** - jQuery para manipulação do DOM
- [ ] **ID 21** - Plugin jQuery (Mask)
- [ ] **ID 22** - Requisição POST (JSON Server)
- [ ] **ID 23** - Requisição GET (JSON Server)
- [x] **ID 24** - APIs Públicas (HG Brasil Finance)

---

## 🔧 Como executar o projeto

1.  Clone o repositório.
2.  Instale as dependências: `npm install`.
3.  Inicie o JSON Server: `npm run server` (ou o comando configurado).
4.  Abra o `index.html` com o Live Server.
