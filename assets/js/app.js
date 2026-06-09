(function ($) {
  const STORAGE_KEY = 'nexobank-atm-state-v3';
  const API_BASE = 'http://localhost:3000';
  const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const CEP_REGEX = /^\d{5}-\d{3}$/;
  const MONEY_REGEX = /^\d{1,3}(\.\d{3})*,\d{2}$/;
  const ACCOUNT_OR_CPF_REGEX = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{1,20})$/;

  const DEFAULT_STATE = {
    currentUserId: null,
    lastReceipt: null,
    users: [
      {
        id: '1',
        nome: 'Usuário Teste',
        cpf: '123.456.789-00',
        senha: '123',
        saldo_atual: 0,
        tipo: 'corrente',
      },
    ],
    transactions: [],
    agencies: [
      {
        cep: '01001-000',
        logradouro: 'Praça da Sé, 100',
        bairro: 'Sé',
        localidade: 'São Paulo - SP',
      },
      {
        cep: '30140-071',
        logradouro: 'Av. Afonso Pena, 750',
        bairro: 'Centro',
        localidade: 'Belo Horizonte - MG',
      },
      {
        cep: '20040-020',
        logradouro: 'Av. Rio Branco, 156',
        bairro: 'Centro',
        localidade: 'Rio de Janeiro - RJ',
      },
    ],
  };

  const state = loadState();
  let withdrawDigits = '';
  let depositDigits = '';
  let pendingOperation = null;
  let confirmModal;
  let toast;

  $(init);

  function init() {
    injectComponents();
    setupBootstrap();
    setupMasks();
    setupEvents();
    hydrateData();
    refreshAgencies();
    updateSessionView();
    dispatchPage();
  }

  function basePath() {
    return $('body').data('base') || '';
  }

  function pageName() {
    return $('body').data('page') || 'home';
  }

  function pathTo(file) {
    return `${basePath()}${file}`;
  }

  function injectComponents() {
    const base = basePath();
    const user = currentUser();
    if (window.NexoComponents) window.NexoComponents.render(base, user);
  }

  function setupBootstrap() {
    const confirmModalEl = document.getElementById('confirmModal');
    const toastEl = document.getElementById('appToast');
    if (window.bootstrap && confirmModalEl) confirmModal = new bootstrap.Modal(confirmModalEl);
    if (window.bootstrap && toastEl) toast = new bootstrap.Toast(toastEl, { delay: 2600 });
  }

  function setupMasks() {
    if (!$.fn.mask) return;
    $('.cpf-mask').mask('000.000.000-00');
    $('.cep-mask').mask('00000-000');
    $('.money-mask').mask('000.000.000.000.000,00', { reverse: true });
  }

  function setupEvents() {
    $(document).on('click', "[data-action='logout']", logout);
    $("[data-action='refresh-quotes']").on('click', fetchQuotes);
    $("[data-action='print']").on('click', () => window.print());
    $('#confirmModalButton').on('click', executePendingOperation);

    $('#loginForm').on('submit', login);
    $('#registerForm').on('submit', registerUser);
    $('#depositForm').on('submit', requestDeposit);
    $('#transferForm').on('submit', requestTransfer);
    $('#withdrawForm').on('submit', requestWithdraw);
    $('#locatorForm').on('submit', findAgency);
    $('#statementFilter').on('change', renderStatement);

    $("[data-keypad='withdraw']").on('click', 'button', function () {
      handleAmountKey('withdraw', $(this).data('key'));
    });

    $("[data-keypad='deposit']").on('click', 'button', function () {
      handleAmountKey('deposit', $(this).data('key'));
    });

    $(document).on('keydown', function (event) {
      if (!['withdraw', 'deposit'].includes(pageName())) return;
      if ($(event.target).is('input, textarea, select')) return;

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        handleAmountKey(pageName(), event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleAmountKey(pageName(), 'back');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleAmountKey(pageName(), 'clear');
      } else if (event.key === 'Enter' && pageName() === 'withdraw') {
        event.preventDefault();
        $('#withdrawForm').trigger('submit');
      }
    });
  }

  function dispatchPage() {
    const protectedPages = ['dashboard', 'withdraw', 'deposit', 'transfer', 'statement', 'receipt'];
    if (protectedPages.includes(pageName()) && !currentUser()) {
      go('pages/login.html');
      return;
    }

    if (pageName() === 'dashboard') renderDashboard();
    if (pageName() === 'withdraw') renderWithdrawAmount();
    if (pageName() === 'deposit') renderDepositAmount();
    if (pageName() === 'statement') renderStatement();
    if (pageName() === 'locator') renderAgencyStart();
    if (pageName() === 'receipt') renderReceipt();
  }

  function hydrateData() {
    if (localStorage.getItem(STORAGE_KEY)) return;

    Promise.all([
      fetch(`${API_BASE}/usuarios`).then((response) => response.json()),
      fetch(`${API_BASE}/transacoes`).then((response) => response.json()),
      fetch(`${API_BASE}/agencias`).then((response) => response.json()),
    ])
      .then(([usuarios, transacoes, agencias]) => {
        if (Array.isArray(usuarios)) {
          state.users = usuarios.map((user) => ({ ...user, saldo_atual: 0 }));
        }
        if (Array.isArray(transacoes)) state.transactions = [];
        if (Array.isArray(agencias)) state.agencies = agencias;
        saveState();
        updateSessionView();
      })
      .catch(hydrateFromJsonFile);
  }

  function refreshAgencies() {
    fetch(`${API_BASE}/agencias`)
      .then((response) => {
        if (!response.ok) throw new Error('JSON Server indisponível');
        return response.json();
      })
      .then((agencies) => {
        if (Array.isArray(agencies) && agencies.length) {
          state.agencies = agencies;
          saveState();
        }
      })
      .catch(() => {
        fetch(pathTo('db.json'))
          .then((response) => {
            if (!response.ok) throw new Error('db.json indisponível');
            return response.json();
          })
          .then((db) => {
            if (Array.isArray(db.agencias) && db.agencias.length) {
              state.agencies = db.agencias;
              saveState();
            }
          })
          .catch(() => {});
      });
  }

  function hydrateFromJsonFile() {
    fetch(pathTo('db.json'))
      .then((response) => {
        if (!response.ok) throw new Error('db.json indisponível');
        return response.json();
      })
      .then((db) => {
        if (Array.isArray(db.usuarios)) {
          state.users = db.usuarios.map((user) => ({ ...user, saldo_atual: 0 }));
        }
        if (Array.isArray(db.agencias)) state.agencies = db.agencias;
        state.transactions = [];
        saveState();
        updateSessionView();
      })
      .catch(saveState);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.users)) return { ...DEFAULT_STATE, ...saved };
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentUser() {
    return state.users.find((user) => user.id === state.currentUserId) || null;
  }

  function updateSessionView() {
    const user = currentUser();
    $('body').toggleClass('has-session', Boolean(user));
    if (!user) return;
    $('[data-user-name]').text(firstName(user.nome));
    $('[data-account-id]').text(user.id.padStart(4, '0'));
    $('[data-current-balance]').text(formatMoney(user.saldo_atual));
    injectComponents();
  }

  function renderDashboard() {
    updateSessionView();
    renderQuotes();
  }

  function renderQuotes(quotes) {
    const data = quotes || [
      { code: 'USD', name: 'Dólar', value: 5.24 },
      { code: 'EUR', name: 'Euro', value: 5.72 },
      { code: 'BTC', name: 'Bitcoin', value: 342850.12 },
    ];
    $('#quoteList').html(
      data
        .map(
          (quote) => `
            <div class="quote-row">
              <div><strong>${quote.code}</strong><span class="d-block">${quote.name}</span></div>
              <b>${formatMoney(quote.value)}</b>
            </div>
          `
        )
        .join('')
    );
  }

  function fetchQuotes() {
    $('#quoteList').html(`<div class="text-muted">Atualizando cotações...</div>`);
    fetch('https://api.hgbrasil.com/finance?format=json-cors&key=demo')
      .then((response) => {
        if (!response.ok) throw new Error('API indisponível');
        return response.json();
      })
      .then((payload) => {
        const currencies = payload.results && payload.results.currencies;
        if (!currencies) throw new Error('Resposta inválida');
        renderQuotes([
          { code: 'USD', name: 'Dólar', value: currencies.USD.buy },
          { code: 'EUR', name: 'Euro', value: currencies.EUR.buy },
          { code: 'BTC', name: 'Bitcoin', value: currencies.BTC.buy },
        ]);
        notify('Cotações atualizadas pela HG Brasil Finance.');
      })
      .catch(() => {
        renderQuotes();
        notify('Sem conexão com a API. Exibindo cotações demonstrativas.');
      });
  }

  function login(event) {
    event.preventDefault();
    const cpf = $('#loginCpf').val().trim();
    const senha = $('#loginPassword').val();

    if (!matchesRegex(cpf, CPF_REGEX)) {
      showFeedback('#loginFeedback', 'Digite o CPF no formato 000.000.000-00.');
      return;
    }

    const user = state.users.find((item) => item.cpf === cpf && item.senha === senha);

    if (!user) {
      showFeedback('#loginFeedback', 'CPF ou senha inválidos.');
      return;
    }

    state.currentUserId = user.id;
    saveState();
    go('pages/dashboard.html');
  }

  function registerUser(event) {
    event.preventDefault();
    const cpf = $('#registerCpf').val().trim();

    if (!matchesRegex(cpf, CPF_REGEX)) {
      showFeedback('#registerFeedback', 'Digite o CPF no formato 000.000.000-00.');
      return;
    }

    if (state.users.some((user) => user.cpf === cpf)) {
      showFeedback('#registerFeedback', 'Já existe uma conta com este CPF.');
      return;
    }

    const user = {
      id: String(Date.now()),
      nome: $('#registerName').val().trim(),
      cpf,
      senha: $('#registerPassword').val(),
      saldo_atual: 0,
      tipo: $('#registerProfile').val(),
    };

    state.users.push(user);
    state.currentUserId = user.id;
    saveState();
    syncToServer('usuarios', user);
    go('pages/dashboard.html');
  }

  function handleAmountKey(mode, key) {
    if (!key) return;
    const isDeposit = mode === 'deposit';
    let digits = isDeposit ? depositDigits : withdrawDigits;

    if (key === 'clear') digits = '';
    else if (key === 'back') digits = digits.slice(0, -1);
    else if (/^\d$/.test(String(key)) && digits.length < 9) digits += String(key);

    if (isDeposit) {
      depositDigits = digits;
      renderDepositAmount();
    } else {
      withdrawDigits = digits;
      renderWithdrawAmount();
    }
  }

  function renderWithdrawAmount() {
    $('#withdrawAmount').text(formatMoney(digitsToMoney(withdrawDigits)));
    const user = currentUser();
    const amount = digitsToMoney(withdrawDigits);
    const $feedback = $('#withdrawFeedback');
    $feedback.addClass('d-none').removeClass('alert-danger alert-warning');

    if (user && amount > user.saldo_atual) {
      $feedback
        .text('Saldo insuficiente para realizar esta operação.')
        .removeClass('d-none')
        .addClass('alert-danger');
    } else if (amount > 1000) {
      $feedback
        .text('Saques acima de R$ 1.000,00 exigem atenção extra.')
        .removeClass('d-none')
        .addClass('alert-warning');
    }
  }

  function renderDepositAmount() {
    $('#depositAmount').text(formatMoney(digitsToMoney(depositDigits)));
    const amount = digitsToMoney(depositDigits);
    const $feedback = $('#depositFeedback');
    $feedback.addClass('d-none').removeClass('alert-danger alert-warning');

    if (amount > 5000) {
      $feedback
        .text('Depósitos acima de R$ 5.000,00 não são permitidos por operação.')
        .removeClass('d-none')
        .addClass('alert-danger');
    }
  }

  function requestWithdraw(event) {
    event.preventDefault();
    const user = currentUser();
    const amount = digitsToMoney(withdrawDigits);

    if (!amount) return showFeedback('#withdrawFeedback', 'Digite um valor para saque.');
    if (amount > user.saldo_atual) return showFeedback('#withdrawFeedback', 'Saldo insuficiente.');

    requestConfirmation('Saque', amount, () => {
      user.saldo_atual -= amount;
      addTransaction('Saque', amount, 'Saque no terminal #8824-A');
      finishOperation('SAQUE', amount);
    });
  }

  function requestDeposit(event) {
    event.preventDefault();
    const user = currentUser();
    const amount = digitsToMoney(depositDigits);
    const password = $('#depositPassword').val();

    if (password !== user.senha) return showFeedback('#depositFeedback', 'Senha incorreta.');
    if (!amount || amount > 5000)
      return showFeedback('#depositFeedback', 'Informe um valor entre R$ 0,01 e R$ 5.000,00.');

    requestConfirmation('Depósito', amount, () => {
      user.saldo_atual += amount;
      addTransaction('Depósito', amount, 'Depósito em envelope');
      finishOperation('DEPÓSITO', amount);
    });
  }

  function requestTransfer(event) {
    event.preventDefault();
    const user = currentUser();
    const transferValue = $('#transferValue').val().trim();
    const amount = parseMoney(transferValue);
    const password = $('#transferPassword').val();
    const targetText = $('#transferTarget').val().trim();

    if (!matchesRegex(targetText, ACCOUNT_OR_CPF_REGEX)) {
      return showFeedback(
        '#transferFeedback',
        'Digite CPF com máscara ou apenas números da conta de destino.'
      );
    }
    if (!matchesRegex(transferValue, MONEY_REGEX)) {
      return showFeedback('#transferFeedback', 'Digite o valor no formato 0,00.');
    }
    if (password !== user.senha) return showFeedback('#transferFeedback', 'Senha incorreta.');
    if (!amount) return showFeedback('#transferFeedback', 'Informe um valor válido.');
    if (amount > user.saldo_atual) return showFeedback('#transferFeedback', 'Saldo insuficiente.');

    requestConfirmation('Transferência', amount, () => {
      const target = state.users.find((item) => item.cpf === targetText || item.id === targetText);
      user.saldo_atual -= amount;
      if (target) {
        target.saldo_atual += amount;
        addTransaction(
          'Depósito',
          amount,
          `Transferência recebida de ${firstName(user.nome)}`,
          target.id
        );
      }
      addTransaction(
        'Transferência',
        amount,
        target ? `Destino: ${target.nome}` : `Destino externo: ${targetText}`
      );
      finishOperation('TRANSFERÊNCIA', amount);
    });
  }

  function requestConfirmation(type, amount, callback) {
    pendingOperation = callback;
    $('#confirmModalBody').html(`
      <p class="mb-1">Operação: <strong>${type}</strong></p>
      <p class="mb-0">Valor: <strong>${formatMoney(amount)}</strong></p>
    `);
    if (confirmModal) confirmModal.show();
    else executePendingOperation();
  }

  function executePendingOperation() {
    if (typeof pendingOperation !== 'function') return;
    const operation = pendingOperation;
    pendingOperation = null;
    if (confirmModal) confirmModal.hide();
    operation();
  }

  function finishOperation(type, amount) {
    const user = currentUser();
    state.lastReceipt = {
      type,
      amount,
      balance: user.saldo_atual,
      date: new Date().toISOString(),
      auth: `${Math.random().toString(36).slice(2, 5).toUpperCase()}.${Math.floor(100000 + Math.random() * 900000)}`,
    };
    saveState();
    go('pages/receipt.html');
  }

  function renderReceipt() {
    const receipt = state.lastReceipt;
    if (!receipt) {
      go('pages/dashboard.html');
      return;
    }
    $('#receiptType').text(receipt.type);
    $('#receiptDate').text(formatDate(receipt.date));
    $('#receiptAuth').text(receipt.auth);
    $('#receiptAmount').text(formatMoney(receipt.amount));
    $('#receiptBalance').text(formatMoney(receipt.balance));
  }

  function renderStatement() {
    const user = currentUser();
    const filter = $('#statementFilter').val() || 'Todos';
    const $rows = $('#statementRows');
    $rows.empty();

    const rows = state.transactions
      .filter((item) => item.usuarioId === user.id)
      .filter((item) => filter === 'Todos' || item.tipo === filter)
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    if (!rows.length) {
      $rows.append(
        `<tr><td colspan="3" class="text-center text-muted">Nenhuma movimentação encontrada.</td></tr>`
      );
      return;
    }

    rows.forEach((item) => {
      const isPositive = item.tipo === 'Depósito';
      const sign = isPositive ? '+' : '-';
      const valueClass = isPositive ? 'transaction-positive' : 'transaction-negative';
      $rows.append(`
        <tr>
          <td>${formatDate(item.data)}</td>
          <td>
            <strong>${item.tipo}</strong>
            ${item.descricao ? `<small class="d-block text-muted">${escapeHtml(item.descricao)}</small>` : ''}
          </td>
          <td class="text-end ${valueClass} fw-bold">${sign} ${formatMoney(item.valor)}</td>
        </tr>
      `);
    });
  }

  function renderAgencyStart() {
    $('#agencyResult').html(`
      <span class="material-symbols-outlined">location_on</span>
      <strong>Digite um CEP para iniciar a busca.</strong>
    `);
  }

  async function findAgency(event) {
    event.preventDefault();
    const cep = $('#locatorCep').val().trim();

    if (!matchesRegex(cep, CEP_REGEX)) {
      renderAgencyResult(
        {
          logradouro: 'CEP inválido',
          bairro: 'Use o formato 00000-000',
          localidade: 'NexoBank',
        },
        'Formato de CEP inválido',
        'A busca só é enviada quando o CEP passa pela validação REGEX'
      );
      return;
    }

    const agency = state.agencies.find((item) => normalizeCep(item.cep) === normalizeCep(cep));

    $('#agencyResult').html(`
      <span class="material-symbols-outlined">sync</span>
      <strong>Consultando CEP...</strong>
    `);

    if (agency) {
      renderAgencyResult(agency, 'Agência encontrada', 'CEP cadastrado no NexoBank');
      return;
    }

    try {
      const address = await fetchViaCep(cep);
      const result = findClosestAgency(address);
      renderAgencyResult(result.agency, result.title, result.reason, address);
    } catch (error) {
      const result = nearestAgency(cep);
      renderAgencyResult(
        result,
        'Agência mais próxima',
        'ViaCEP indisponível; usando fallback local'
      );
    }
  }

  function fetchViaCep(cep) {
    const cleanCep = normalizeCep(cep);

    if (cleanCep.length !== 8) {
      return Promise.reject(new Error('CEP inválido'));
    }

    return fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      .then((response) => {
        if (!response.ok) throw new Error('ViaCEP indisponível');
        return response.json();
      })
      .then((data) => {
        if (data.erro) throw new Error('CEP não encontrado');
        return data;
      });
  }

  function findClosestAgency(address) {
    const exactCity = state.agencies.find((agency) => {
      const parsed = parseLocation(agency.localidade);
      return normalize(parsed.city) === normalize(address.localidade) && parsed.uf === address.uf;
    });

    if (exactCity) {
      return {
        agency: exactCity,
        title: 'Agência na mesma cidade',
        reason: `${address.localidade} - ${address.uf}`,
      };
    }

    const sameState = state.agencies.find(
      (agency) => parseLocation(agency.localidade).uf === address.uf
    );

    if (sameState) {
      return {
        agency: sameState,
        title: 'Agência no mesmo estado',
        reason: `CEP consultado em ${address.localidade} - ${address.uf}`,
      };
    }

    return {
      agency: nearestAgency(address.cep),
      title: 'Agência mais próxima',
      reason: `Sem agência no estado ${address.uf}; usando fallback local`,
    };
  }

  function renderAgencyResult(agency, title, reason, address) {
    $('#agencyResult').html(`
      <span class="material-symbols-outlined">account_balance</span>
      <strong>${title}</strong>
      <span>${agency.logradouro}</span>
      <span>${agency.bairro} • ${agency.localidade}</span>
      <small class="text-muted">${reason}</small>
      ${address ? `<small class="text-muted">CEP digitado: ${address.logradouro || 'logradouro não informado'} • ${address.bairro || 'bairro não informado'}</small>` : ''}
    `);
  }

  function nearestAgency(cep) {
    const numeric = Number(normalizeCep(cep)) || 0;
    return state.agencies[numeric % state.agencies.length];
  }

  function normalizeCep(cep) {
    return String(cep || '').replace(/\D/g, '');
  }

  function parseLocation(localidade) {
    const [city = '', uf = ''] = String(localidade || '').split(' - ');
    return { city: city.trim(), uf: uf.trim() };
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function addTransaction(tipo, valor, descricao, userId) {
    const transaction = {
      id: String(Date.now() + Math.floor(Math.random() * 1000)),
      usuarioId: userId || state.currentUserId,
      tipo,
      valor,
      descricao,
      data: new Date().toISOString(),
    };
    state.transactions.push(transaction);
    syncToServer('transacoes', transaction);
  }

  function syncToServer(resource, payload) {
    fetch(`${API_BASE}/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  function logout() {
    state.currentUserId = null;
    saveState();
    go('index.html');
  }

  function go(relativePath) {
    window.location.href = pathTo(relativePath);
  }

  function showFeedback(selector, message) {
    $(selector).removeClass('d-none alert-warning').addClass('alert-danger').text(message);
  }

  function matchesRegex(value, regex) {
    return regex.test(String(value || '').trim());
  }

  function notify(message) {
    $('#toastMessage').text(message);
    if (toast) toast.show();
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function parseMoney(value) {
    const normalized = String(value || '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    return Number.parseFloat(normalized) || 0;
  }

  function digitsToMoney(digits) {
    return Number.parseInt(digits || '0', 10) / 100;
  }

  function formatDate(value) {
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function firstName(name) {
    return String(name || 'Cliente').split(' ')[0];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})(jQuery);
