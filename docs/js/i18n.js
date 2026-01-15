/**
 * Toastly Internationalization (i18n) Manager
 * 
 * Simple, declarative i18n system with:
 * - localStorage persistence
 * - Easy translation file structure
 * - Support for nested keys
 * 
 * Usage:
 * - Add data-i18n="key.path" to any translatable element
 * - Call I18n.setLanguage('pt-br') to switch languages
 */

const I18n = (() => {
  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const STORAGE_KEY = 'toastly-lang';
  const LANGUAGES = Object.freeze({
    EN: 'en',
    PT_BR: 'pt-br'
  });
  const DEFAULT_LANGUAGE = LANGUAGES.EN;
  const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

  // ============================================================================
  // TRANSLATION DATA
  // Inline for faster loading (no fetch required)
  // ============================================================================

  const TRANSLATIONS = {
    'en': {
      // Navigation
      'nav.home': 'Home',
      'nav.features': 'Features',
      'nav.getStarted': 'Get Started',
      'nav.docs': 'Documentation',
      'nav.github': 'GitHub',
      'nav.startNow': 'Start Now',

      // Hero
      'hero.badge': 'Angular 17 - 21',
      'hero.title.line1': 'Toast notifications',
      'hero.title.line2': 'simple and elegant',
      'hero.description': 'A toast notification library for Angular, built with focus on <strong>simplicity</strong>, <strong>accessibility</strong>, and <strong>zero external dependencies</strong>.',
      'hero.cta.start': 'Get Started',
      'hero.cta.docs': 'View Documentation',

      // Toast Examples
      'toast.success.title': 'Changes saved',
      'toast.success.message': 'Your profile has been updated successfully.',
      'toast.update.title': 'New update available',
      'toast.update.message': 'Version 4.2 includes performance improvements.',
      'toast.update.skip': 'Skip',
      'toast.update.install': 'Install',

      // Features
      'features.badge': 'Why Toastly?',
      'features.title': 'Everything you need,<br/>nothing you don\'t',
      'features.description': 'Built with focus on simplicity and code clarity.',
      
      'features.zeroDeps.title': 'Zero Dependencies',
      'features.zeroDeps.description': 'Only Angular as peer dependency. No external libraries, no version conflicts, no surprises.',
      
      'features.signals.title': 'Native Signals',
      'features.signals.description': 'Built with Angular\'s Signals API. Reactive, performant state without unnecessary RxJS.',
      
      'features.memory.title': 'Memory Safe',
      'features.memory.description': 'All timers are automatically cleaned up. No memory leaks, no side effects, no surprises.',
      
      'features.accessible.title': 'Accessible',
      'features.accessible.description': 'ARIA live regions for screen readers. Respects reduced motion preferences automatically.',
      
      'features.customizable.title': 'Fully Customizable',
      'features.customizable.description': 'CSS variables for everything. Works with Tailwind, PrimeFlex, or pure CSS. You decide the look.',
      
      'features.readable.title': 'Readable Code',
      'features.readable.description': 'Written to be understood by any developer. No tricks, no magic, no abbreviations.',

      // Playground
      'playground.badge': 'Try it!',
      'playground.title': 'Test the toasts now',
      'playground.description': 'Click the buttons below to see toasts in action.',
      'playground.types.title': 'Toast Types',
      'playground.types.description': 'Choose a type to preview',
      'playground.variations.title': 'Variations',
      'playground.variations.description': 'Try different configurations',
      
      'playground.btn.info': 'Info',
      'playground.btn.success': 'Success',
      'playground.btn.warning': 'Warning',
      'playground.btn.danger': 'Danger',
      'playground.btn.dark': 'Dark Theme',
      'playground.btn.actions': 'With Actions',
      'playground.btn.progress': 'With Progress',
      'playground.btn.avatar': 'With Avatar',

      // Getting Started
      'start.badge': 'Getting Started',
      'start.title': 'Start in 3 minutes',
      'start.description': 'Simple installation, intuitive usage.',
      
      'start.step1.title': 'Install the library',
      'start.step1.description': 'Run this command in your terminal, inside your Angular project:',
      'start.step1.note': '<strong>💡 What does this do?</strong> Downloads the Toastly library and adds it as a dependency in your <code>package.json</code>.',
      
      'start.step2.title': 'Add the container',
      'start.step2.description': 'The container is where toasts appear. Add it to your main component:',
      'start.step2.note': '<strong>💡 Why in the main component?</strong> This way toasts appear on any page of your application.',
      
      'start.step3.title': 'Show your first toast!',
      'start.step3.description': 'Use the <code>ToastService</code> in any component to show notifications:',
      'start.step3.note': '<strong>🎉 Done!</strong> Your toast is now working. Continue reading the documentation for customizations.',
      
      'start.cta.title': 'Want to learn more?',
      'start.cta.description': 'The full documentation has examples, customizations, and best practices.',
      'start.cta.button': 'View Full Documentation',

      // FAQ
      'faq.badge': 'Questions?',
      'faq.title': 'Frequently Asked Questions',
      
      'faq.q1': 'Does it work with Angular 17, 18, 19, 20, and 21?',
      'faq.a1': 'Yes! The library is compiled with <code>compilationMode: "partial"</code>, which allows it to work on any Angular version between 17 and 21. You don\'t need to worry about compatibility.',
      
      'faq.q2': 'Do I need to install any other dependency?',
      'faq.a2': 'No! Toastly has <strong>zero external dependencies</strong>. Only Angular as peer dependency. This means fewer conflicts, smaller builds, and easier maintenance.',
      
      'faq.q3': 'Does it work with Tailwind CSS?',
      'faq.a3': 'Yes! You can pass custom CSS classes through the <code>styleClass</code> parameter. Works with Tailwind, PrimeFlex, Bootstrap, or any CSS framework.',
      
      'faq.q4': 'Are timers cleaned up automatically?',
      'faq.a4': 'Yes! All auto-dismiss timers are stored in a Map and cleaned up automatically when the toast is removed or when the service is destroyed. This prevents memory leaks.',
      
      'faq.q5': 'Is it accessible for screen readers?',
      'faq.a5': 'Yes! The container uses <code>aria-live="polite"</code> to announce new toasts to screen readers. Warning and danger toasts use <code>role="alert"</code>. Animations are automatically disabled when the user has <code>prefers-reduced-motion</code> enabled.',

      // Code
      'code.comment.addLine': '<!-- Add this line -->',
      'code.comment.inject': '// Inject toast service',
      'code.comment.show': '// Show a success toast!',
      'code.string.success': "'Data saved successfully!'",
      'code.step1.inject': '// Step 1: Inject the service',
      'code.step2.show': '// Step 2: Use service to show a toast',
      'code.string.worked': "'It worked! 🎉'",
      'code.comment.required': '// Required',
      'code.comment.optional': '// Optional',
      'code.comment.duration': '// Time in milliseconds (0 = manual dismiss)',
      'code.comment.dismissible': '// Show close button',
      'code.string.yourMessage': "'Your message here'",
      'code.string.toastTitle': "'Toast Title'",
      'code.comment.noAutoClose': '// Does not close automatically',
      'code.comment.cssGlobal': '/* Customize global look */',
      'code.comment.cssColors': '/* Colors by type */',
      'code.comment.iconTemplate': '<!-- Custom icon template -->',
      'code.comment.lucideRef': '// Reference to Lucide icons',
      'code.comment.accessTemplate': '// Access icon template',
      'code.comment.useTemplate': '// Use template as toast icon',
      'code.string.deploySuccess': "'Deploy started successfully!'",
      'code.string.deployTitle': "'New Deploy'",
      'code.comment.uploadToast': '// Upload toast with Download icon',
      'code.comment.notificationToast': '// Notification toast with Bell icon',
      'code.string.uploadTitle': "'Upload complete'",
      'code.string.uploadMessage': "'file.pdf has been sent'",
      'code.string.msgTitle': "'New message'",
      'code.string.msgContent': "'John sent a message'",
      'code.comment.lightTheme': '// Light theme (default)',
      'code.comment.darkTheme': '// Dark theme',

      // Position Demo
      'pos.topLeft': '↖️ Top Left',
      'pos.topCenter': '⬆️ Top Center',
      'pos.topRight': '↗️ Top Right',
      'pos.bottomLeft': '↙️ Bottom Left',
      'pos.bottomCenter': '⬇️ Bottom Center',
      'pos.bottomRight': '↘️ Bottom Right (default)',
      
      'pos.demoTitle': 'Position Demo',
      'pos.topLeftMsg': 'Toast displayed at Top Left',
      'pos.topCenterMsg': 'Toast displayed at Top Center',
      'pos.topRightMsg': 'Toast displayed at Top Right',
      'pos.bottomLeftMsg': 'Toast displayed at Bottom Left',
      'pos.bottomCenterMsg': 'Toast displayed at Bottom Center',
      'pos.bottomRightMsg': 'Toast displayed at Bottom Right',

      // Footer
      'footer.tagline': 'Toast notifications for Angular, done right.',
      'footer.docs': 'Documentation',
      'footer.installation': 'Installation',
      'footer.toastTypes': 'Toast Types',
      'footer.customization': 'Customization',
      'footer.bestPractices': 'Best Practices',
      'footer.resources': 'Resources',
      'footer.technicalDecisions': 'Technical Decisions',
      'footer.madeWith': 'Made with ❤️ for the Angular community',

      // Common
      'common.copy': 'Copy',
      'common.copied': 'Copied!'
    },

    'pt-br': {
      // Navigation
      'nav.home': 'Início',
      'nav.features': 'Recursos',
      'nav.getStarted': 'Começar',
      'nav.docs': 'Documentação',
      'nav.github': 'GitHub',
      'nav.startNow': 'Começar Agora',

      // Hero
      'hero.badge': 'Angular 17 - 21',
      'hero.title.line1': 'Notificações toast',
      'hero.title.line2': 'simples e elegantes',
      'hero.description': 'Uma biblioteca de toast notifications para Angular, construída com foco em <strong>simplicidade</strong>, <strong>acessibilidade</strong> e <strong>zero dependências externas</strong>.',
      'hero.cta.start': 'Começar Agora',
      'hero.cta.docs': 'Ver Documentação',

      // Toast Examples
      'toast.success.title': 'Alterações salvas',
      'toast.success.message': 'Seu perfil foi atualizado com sucesso.',
      'toast.update.title': 'Nova atualização disponível',
      'toast.update.message': 'Versão 4.2 inclui melhorias de performance.',
      'toast.update.skip': 'Pular',
      'toast.update.install': 'Instalar',

      // Features
      'features.badge': 'Por que Toastly?',
      'features.title': 'Tudo que você precisa,<br/>nada que você não precisa',
      'features.description': 'Desenvolvida com foco em simplicidade e clareza de código.',
      
      'features.zeroDeps.title': 'Zero Dependências',
      'features.zeroDeps.description': 'Apenas Angular como peer dependency. Sem bibliotecas externas, sem conflitos de versão, sem surpresas.',
      
      'features.signals.title': 'Signals Nativos',
      'features.signals.description': 'Construída com a API de Signals do Angular. Estado reativo, performático e sem RxJS desnecessário.',
      
      'features.memory.title': 'Memory Safe',
      'features.memory.description': 'Todos os timers são limpos automaticamente. Sem memory leaks, sem efeitos colaterais, sem surpresas.',
      
      'features.accessible.title': 'Acessível',
      'features.accessible.description': 'ARIA live regions para leitores de tela. Respeita preferências de movimento reduzido automaticamente.',
      
      'features.customizable.title': 'Totalmente Customizável',
      'features.customizable.description': 'CSS variables para tudo. Funciona com Tailwind, PrimeFlex ou CSS puro. Você decide o visual.',
      
      'features.readable.title': 'Código Legível',
      'features.readable.description': 'Escrita para ser entendida por qualquer desenvolvedor. Sem truques, sem mágica, sem abreviações.',

      // Playground
      'playground.badge': 'Experimente!',
      'playground.title': 'Teste os toasts agora',
      'playground.description': 'Clique nos botões abaixo para ver os toasts em ação.',
      'playground.types.title': 'Tipos de Toast',
      'playground.types.description': 'Escolha um tipo para visualizar',
      'playground.variations.title': 'Variações',
      'playground.variations.description': 'Experimente diferentes configurações',
      
      'playground.btn.info': 'Info',
      'playground.btn.success': 'Success',
      'playground.btn.warning': 'Warning',
      'playground.btn.danger': 'Danger',
      'playground.btn.dark': 'Tema Dark',
      'playground.btn.actions': 'Com Ações',
      'playground.btn.progress': 'Com Progresso',
      'playground.btn.avatar': 'Com Avatar',

      // Getting Started
      'start.badge': 'Primeiros Passos',
      'start.title': 'Comece em 3 minutos',
      'start.description': 'Instalação simples, uso intuitivo.',
      
      'start.step1.title': 'Instale a biblioteca',
      'start.step1.description': 'Execute este comando no terminal, dentro do seu projeto Angular:',
      'start.step1.note': '<strong>💡 O que isso faz?</strong> Baixa a biblioteca Toastly e adiciona como dependência no seu <code>package.json</code>.',
      
      'start.step2.title': 'Adicione o container',
      'start.step2.description': 'O container é onde os toasts aparecem. Adicione no seu componente principal:',
      'start.step2.note': '<strong>💡 Por que no componente principal?</strong> Assim os toasts aparecem em qualquer página da sua aplicação.',
      
      'start.step3.title': 'Mostre seu primeiro toast!',
      'start.step3.description': 'Use o <code>ToastService</code> em qualquer componente para mostrar notificações:',
      'start.step3.note': '<strong>🎉 Pronto!</strong> Seu toast já está funcionando. Continue lendo a documentação para customizações.',
      
      'start.cta.title': 'Quer aprender mais?',
      'start.cta.description': 'A documentação completa tem exemplos, customizações e boas práticas.',
      'start.cta.button': 'Ver Documentação Completa',

      // FAQ
      'faq.badge': 'Dúvidas?',
      'faq.title': 'Perguntas Frequentes',
      
      'faq.q1': 'Funciona com Angular 17, 18, 19, 20 e 21?',
      'faq.a1': 'Sim! A biblioteca é compilada com <code>compilationMode: "partial"</code>, o que permite que funcione em qualquer versão do Angular entre 17 e 21. Você não precisa se preocupar com compatibilidade.',
      
      'faq.q2': 'Preciso instalar alguma outra dependência?',
      'faq.a2': 'Não! Toastly tem <strong>zero dependências externas</strong>. Apenas Angular como peer dependency. Isso significa menos conflitos, builds menores e manutenção mais fácil.',
      
      'faq.q3': 'Funciona com Tailwind CSS?',
      'faq.a3': 'Sim! Você pode passar classes CSS personalizadas através do parâmetro <code>styleClass</code>. Funciona com Tailwind, PrimeFlex, Bootstrap ou qualquer framework CSS.',
      
      'faq.q4': 'Os timers são limpos automaticamente?',
      'faq.a4': 'Sim! Todos os timers de auto-dismiss são armazenados em um Map e limpos automaticamente quando o toast é removido ou quando o serviço é destruído. Isso previne memory leaks.',
      
      'faq.q5': 'É acessível para leitores de tela?',
      'faq.a5': 'Sim! O container usa <code>aria-live="polite"</code> para anunciar novos toasts para leitores de tela. Toasts de warning e danger usam <code>role="alert"</code>. Animações são desabilitadas automaticamente quando o usuário tem <code>prefers-reduced-motion</code> ativado.',
      'code.comment.addLine': '<!-- Adicione esta linha -->',
      'code.comment.inject': '// Injeta o serviço de toasts',
      'code.comment.show': '// Mostra um toast de sucesso!',
      'code.string.success': "'Dados salvos com sucesso!'",
      'code.step1.inject': '// Passo 1: Injeta o serviço',
      'code.step2.show': '// Passo 2: Usa o serviço para mostrar um toast',
      'code.string.worked': "'Funcionou! 🎉'",
      'code.comment.required': '// Obrigatório',
      'code.comment.optional': '// Opcionais',
      'code.comment.duration': '// Tempo em milissegundos (0 = não fecha sozinho)',
      'code.comment.dismissible': '// Mostra botão de fechar',
      'code.string.yourMessage': "'Sua mensagem aqui'",
      'code.string.toastTitle': "'Título do Toast'",
      'code.comment.noAutoClose': '// Não fecha sozinho',
      'code.comment.cssGlobal': '/* Customize o visual global */',
      'code.comment.cssColors': '/* Cores por tipo */',
      'code.comment.iconTemplate': '<!-- Template do ícone customizado -->',
      'code.comment.lucideRef': '// Referência para os ícones do Lucide',
      'code.comment.accessTemplate': '// Acessa o template do ícone',
      'code.comment.useTemplate': '// Usa o template como ícone do toast',
      'code.string.deploySuccess': "'Deploy iniciado com sucesso!'",
      'code.string.deployTitle': "'Novo Deploy'",
      'code.comment.uploadToast': '// Toast de upload com ícone de Download',
      'code.comment.notificationToast': '// Toast de notificação com ícone de Sino',
      'code.string.uploadTitle': "'Upload concluído'",
      'code.string.uploadMessage': "'arquivo.pdf foi enviado'",
      'code.string.msgTitle': "'Nova mensagem'",
      'code.string.msgContent': "'João enviou uma mensagem'",
      'code.comment.lightTheme': '// Tema claro (padrão)',
      'code.comment.darkTheme': '// Tema escuro',

      // Position Demo
      'pos.topLeft': '↖️ Superior esquerdo',
      'pos.topCenter': '⬆️ Superior centro',
      'pos.topRight': '↗️ Superior direito',
      'pos.bottomLeft': '↙️ Inferior esquerdo',
      'pos.bottomCenter': '⬇️ Inferior centro',
      'pos.bottomRight': '↘️ Inferior direito (padrão)',

      'pos.demoTitle': 'Demonstração de Posição',
      'pos.topLeftMsg': 'Toast exibido no Superior Esquerdo',
      'pos.topCenterMsg': 'Toast exibido no Superior Centro',
      'pos.topRightMsg': 'Toast exibido no Superior Direito',
      'pos.bottomLeftMsg': 'Toast exibido no Inferior Esquerdo',
      'pos.bottomCenterMsg': 'Toast exibido no Inferior Centro',
      'pos.bottomRightMsg': 'Toast exibido no Inferior Direito',

      // Footer
      'footer.tagline': 'Toast notifications para Angular, do jeito certo.',
      'footer.docs': 'Documentação',
      'footer.installation': 'Instalação',
      'footer.toastTypes': 'Tipos de Toast',
      'footer.customization': 'Customização',
      'footer.bestPractices': 'Boas Práticas',
      'footer.resources': 'Recursos',
      'footer.technicalDecisions': 'Decisões Técnicas',
      'footer.madeWith': 'Feito com ❤️ para a comunidade Angular',

      // Common
      'common.copy': 'Copiar',
      'common.copied': 'Copiado!'
    }
  };

  // ============================================================================
  // STATE
  // ============================================================================

  let currentLanguage = DEFAULT_LANGUAGE;

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Get stored language from localStorage
   * @returns {string | null}
   */
  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Save language to localStorage
   * @param {string} lang
   */
  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Fail silently
    }
  }

  /**
   * Get browser's preferred language
   * @returns {string}
   */
  function getBrowserLanguage() {
    const browserLang = navigator.language.toLowerCase();
    
    // Check for exact match
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }
    
    // Check for partial match (e.g., 'pt' matches 'pt-br')
    const shortLang = browserLang.split('-')[0];
    if (shortLang === 'pt') return LANGUAGES.PT_BR;
    if (shortLang === 'en') return LANGUAGES.EN;
    
    return DEFAULT_LANGUAGE;
  }

  /**
   * Get translation for a key
   * @param {string} key - The translation key (e.g., 'nav.home')
   * @param {string} [lang] - Language code (uses current if not specified)
   * @returns {string} The translation or the key if not found
   */
  function translate(key, lang = currentLanguage) {
    const translations = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANGUAGE];
    return translations[key] || key;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translate(key);
      
      // Check if we should set innerHTML (for keys containing HTML)
      // BUT if it's a code block (key starts with 'code.'), usually we want raw text content to preserve code formatting
      // unless we explicitly want HTML inside code (rare for this use case)
      if (translation.includes('<') && !key.startsWith('code.')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    });

    // Update lang attribute on html element
    document.documentElement.lang = currentLanguage === LANGUAGES.PT_BR ? 'pt-BR' : 'en';
    
    // Update language switcher buttons
    updateLanguageButtons();
  }

  /**
   * Update the active state of language buttons
   */
  function updateLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      btn.classList.toggle('lang-btn--active', lang === currentLanguage);
    });
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Initialize the i18n system
   */
  function init() {
    // Priority: localStorage > browser preference > default
    const storedLang = getStoredLanguage();
    currentLanguage = storedLang || getBrowserLanguage() || DEFAULT_LANGUAGE;
    
    applyTranslations();
  }

  /**
   * Set the current language
   * @param {string} lang - Language code ('en' or 'pt-br')
   */
  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
      return;
    }
    
    currentLanguage = lang;
    saveLanguage(lang);
    applyTranslations();
  }

  /**
   * Get the current language
   * @returns {string}
   */
  function getLanguage() {
    return currentLanguage;
  }

  /**
   * Get a translation by key
   * @param {string} key
   * @returns {string}
   */
  function t(key) {
    return translate(key);
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    setLanguage,
    getLanguage,
    t,
    LANGUAGES,
    SUPPORTED_LANGUAGES
  };
})();

// Global function for onclick handlers
window.setLanguage = (lang) => I18n.setLanguage(lang);
