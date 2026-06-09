(function () {
  function navbar(basePath, hasSession) {
    return `
      <header class="app-topbar">
        <a class="brand-link" href="${basePath}index.html" aria-label="NexoBank - tela inicial">
          <picture>
            <source
              type="image/webp"
              srcset="${basePath}assets/img/logo-sem-fundo.webp 1280w"
              sizes="8.5rem"
            >
            <img
              src="${basePath}assets/img/logo-sem-fundo.png"
              srcset="${basePath}assets/img/logo-sem-fundo.png 1280w"
              sizes="8.5rem"
              alt="NexoBank"
              width="1280"
              height="698"
              loading="eager"
              decoding="async"
            >
          </picture>
        </a>
        <nav class="topbar-tools" aria-label="Navegação principal">
          <a class="btn btn-light btn-icon" href="${basePath}pages/locator.html" aria-label="Agências">
            <span class="material-symbols-outlined">location_on</span>
          </a>
          ${
            hasSession
              ? ""
              : `<a class="btn btn-outline-primary d-none d-sm-inline-flex align-items-center gap-2" href="${basePath}pages/login.html">
                  <span class="material-symbols-outlined">login</span>
                  Entrar
                </a>`
          }
          <a class="btn btn-primary align-items-center gap-2 ${hasSession ? "" : "session-only"}" href="${basePath}pages/dashboard.html">
            <span class="material-symbols-outlined">space_dashboard</span>
            Menu
          </a>
          <button class="btn btn-outline-secondary align-items-center gap-2 ${hasSession ? "" : "session-only"}" type="button" data-action="logout">
            <span class="material-symbols-outlined">logout</span>
            Sair
          </button>
        </nav>
      </header>
    `;
  }

  function footer(accountText) {
    return `
      <footer class="app-footer">
        <span>NexoBank ATM Digital</span>
        <span>${accountText}</span>
      </footer>
    `;
  }

  window.NexoComponents = {
    render(basePath, user) {
      const navRoot = document.querySelector('[data-component="navbar"]');
      const footerRoot = document.querySelector('[data-component="footer"]');
      if (navRoot) navRoot.innerHTML = navbar(basePath, Boolean(user));
      if (footerRoot) {
        const accountText = user ? `Conta ${String(user.id).padStart(4, "0")}` : "Bootstrap • jQuery • JSON Server";
        footerRoot.innerHTML = footer(accountText);
      }
    },
  };
})();
