# Product Requirements Document (PRD) - NexoBank

**Autor:** Raphael Ramos  
**Projeto:** NexoBank ATM Digital

## 📝 Descrição
O NexoBank é um simulador de Caixa Eletrônico (ATM) focado em acessibilidade e rapidez. O sistema resolve o problema de usuários que precisam gerenciar transações básicas (saques, depósitos) e consultar informações financeiras (extrato e câmbio) em uma interface intuitiva que funciona tanto em totens de autoatendimento quanto em dispositivos móveis.

## 👥 Atores do Sistema
1. **Visitante:** Pode visualizar a tela de login e consultar a localização de agências próximas.
2. **Cliente Autenticado:** Pode realizar saques, depósitos, visualizar o extrato e consultar cotações de moedas.

## 📖 Histórias de Usuário
1. **Login Seguro:** Como Cliente, quero acessar minha conta usando CPF e senha para garantir que apenas eu tenha acesso aos meus fundos.
2. **Depósito Ágil:** Como Cliente, quero realizar depósitos informando o valor e confirmando com senha para atualizar meu saldo instantaneamente.
3. **Saque Controlado:** Como Cliente, quero sacar valores da minha conta, validando se possuo saldo suficiente para evitar cheque especial.
4. **Consulta de Extrato:** Como Cliente, quero visualizar meu histórico de transações para conferir meus gastos recentes.
5. **Localizador de Agências:** Como Visitante/Cliente, quero informar meu CEP para encontrar a agência física mais próxima em caso de necessidade de suporte.