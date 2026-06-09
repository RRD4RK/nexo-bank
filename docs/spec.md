# 📑 Especificação Técnica - NexoBank

## 🏗️ Arquitetura de Software
A aplicação seguirá o padrão de **Single Page Application (SPA)** para a área logada, utilizando **jQuery v3.7.1** para manipulação dinâmica do DOM e trocas de estado. A interface será construída com **Bootstrap v5.3.3**, utilizando seu sistema de Grid e componentes prontos para garantir responsividade e padronização visual.

## 📊 Modelo de Dados

O sistema utiliza um banco de dados simulado via **JSON Server**, estruturado conforme o diagrama abaixo:

```mermaid
erDiagram
    USUARIO ||--o{ TRANSACAO : realiza
    USUARIO {
        string id PK
        string nome
        string cpf
        string senha
        float saldo_atual
    }
    TRANSACAO {
        string id PK
        string tipo
        float valor
        datetime data
        string usuarioId FK
    }
    AGENCIA {
        string cep PK
        string logradouro
        string bairro
        string localidade
    }
