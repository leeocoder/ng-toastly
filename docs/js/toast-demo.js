
// Toast Demo Functionality - Updated to match Library Styles
let toastId = 0;

// SVG Paths from Library
const ICON_PATHS = {
  info: 'M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
};
const CLOSE_ICON_PATH = 'M18 6L6 18M6 6l12 12';

// Configuração dos tipos de Toast
const toastConfig = {
  info: { type: 'info', title: 'toast.update.title', message: 'toast.update.message', color: '#7c3aed' },
  success: { type: 'success', title: 'toast.success.title', message: 'toast.success.message', color: '#16a34a' },
  warning: { type: 'warning', title: 'playground.btn.warning', message: 'features.description', color: '#f59e0b' },
  danger: { type: 'danger', title: 'playground.btn.danger', message: 'features.zeroDeps.description', color: '#dc2626' },
};

const DEFAULT_POSITION = 'bottom-right';

// Inicializa container por posição
function getOrCreateContainer(position = DEFAULT_POSITION) {
  const containerId = `toast-container-${position}`;
  let container = document.getElementById(containerId);
  
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    // Base styles from CSS + Position modifier
    container.className = `toast-container-demo toast-container--${position}`;
    document.body.appendChild(container);
  }
  return container;
}

function showToast(typeKey, overrides = {}, position = DEFAULT_POSITION) {
  const container = getOrCreateContainer(position);
  const baseConfig = toastConfig[typeKey] || toastConfig['info'];
  const config = { ...baseConfig, ...overrides };
  
  const id = ++toastId;
  const isDocDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const isDark = config.theme === 'dark' || isDocDark; 

  const toast = document.createElement('div');
  
  let classes = `toastly-item toastly-item--${config.type}`;
  if (isDark) classes += ' toastly-item--dark';
  
  toast.className = classes;
  toast.id = `toast-${id}`;
  
  const titleText = (config.title && I18n.t(config.title)) || config.title || '';
  const messageText = (config.message && I18n.t(config.message)) || config.message || '';
  
  const iconPath = ICON_PATHS[config.type] || ICON_PATHS['info'];

  toast.innerHTML = `
    <div class="toastly-item__content">
      <div class="toastly-item__icon toastly-item__icon--${config.type}" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="${iconPath}" />
        </svg>
      </div>

      <div class="toastly-item__text">
        ${titleText ? `<div class="toastly-item__title">${titleText}</div>` : ''}
        <div class="toastly-item__message">${messageText}</div>
      </div>

      <button type="button" class="toastly-item__close" aria-label="Dismiss notification" onclick="dismissToast(${id})">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="${CLOSE_ICON_PATH}" />
        </svg>
      </button>
    </div>
  `;

  // Adiciona ao container específico
  container.appendChild(toast);
  
  setTimeout(() => dismissToast(id), 5000);
}

function dismissToast(id) {
  const toast = document.getElementById(`toast-${id}`);
  if (toast) {
    toast.classList.add('toastly-item--exiting');
    setTimeout(() => {
        // Remove toast
        if(toast.parentElement && toast.parentElement.children.length === 1) {
            // Se for o último filho, talvez devêssemos remover o container também?
            // Não necessariamente, mas ajuda a limpar o DOM.
            // Por enquanto, apenas remove o toast.
        }
        toast.remove();
    }, 300);
  }
}

// Position Demo
function showPositionToast(position) {
  // Update UI Cards Visual State
  document.querySelectorAll('.position-option').forEach(el => {
    el.classList.remove('active');
  });
  
  const activeCard = document.querySelector(`.position-option[onclick*="'${position}'"]`);
  if (activeCard) activeCard.classList.add('active');

  // Convert key logic
  const camelPosition = position.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  // Show Toast in specific position
  showToast('success', {
    title: 'pos.demoTitle',
    message: `pos.${camelPosition}Msg`
  }, position);
}
