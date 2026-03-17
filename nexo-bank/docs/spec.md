# Especificação Técnica - NexoBank

## 🏗️ Arquitetura de Software
A aplicação seguirá o padrão de Single Page Application (SPA) para a área logada, utilizando **jQuery** para trocas de estado e **Tailwind CSS** para a interface.

## 📊 Modelo de Dados (Diagrama Mermaid)

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
    }