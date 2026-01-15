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
      'nav.advanced': 'Advanced',

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

      // Code Explanation
      'code.explanation.title': 'Understanding the code line by line:',
      'code.explanation.line': 'Line',
      'code.explanation.action': 'What it does',
      'code.explanation.inject': 'Gets an instance of the toast service. This is Angular\'s "dependency injection".',
      'code.explanation.private': '<strong>private:</strong> only this component can access it. <strong>readonly:</strong> cannot be changed after creation.',
      'code.explanation.success': 'Shows a "success" toast (with green check icon).',

      // Errors
      'errors.title': 'Common Errors',
      'errors.lead': 'Problems you might encounter and how to solve them.',
      'errors.q1': 'Toast does not appear on screen',
      'errors.a1.cause': '<strong>Common cause:</strong> Forgot to add <code>&lt;toastly-container /&gt;</code>',
      'errors.a1.solution': '<strong>Solution:</strong> Add the container to AppComponent template.',
      'errors.q2': 'Toast appears without styles',
      'errors.a2.cause': '<strong>Cause:</strong> CSS was not imported',
      'errors.a2.solution': '<strong>Solution:</strong> Add <code>@import \'toastly/styles/toastly.css\';</code> to your styles.css',
      'errors.q3': 'Error "Maximum number of toasts exceeded"',
      'errors.a3.cause': '<strong>Cause:</strong> You are creating toasts too fast',
      'errors.a3.solution': '<strong>Solution:</strong> Increase <code>maximumVisibleToasts</code> in global config or reduce creation frequency.',

      // Global Config Options
      'config.options.title': 'Global Configuration Options',
      'config.options.option': 'Option',
      'config.options.default': 'Default',
      'config.options.description': 'Description',
      'config.pos.desc': 'Position of toasts on screen',
      'config.theme.desc': 'Default theme for all toasts',
      'config.duration.desc': 'Default display time',
      'config.max.desc': 'Maximum toasts visible at once',
      'config.newest.desc': 'If new toasts appear on top of stack',
      'config.pause.desc': 'If timer pauses on hover',
      
      // Config Descriptions (Table)
      'config.desc.message': 'Main text of the toast (required)',
      'config.desc.title': 'Bold title above the message',
      'config.desc.type': 'Defines the color and icon',
      'config.desc.theme': 'Visual theme (light or dark)',
      'config.desc.duration': 'Time to close automatically (0 = never)',
      'config.desc.dismissible': 'Whether to show the close (x) button',
      'config.desc.styleClass': 'Custom CSS classes',
      'config.desc.progress': 'Progress bar value (0-100)',

      // Best Practices
      'best.do.title': '✅ Do',
      'best.do.1': 'Use short and direct messages',
      'best.do.2': 'Reserve success for important actions',
      'best.do.3': 'Use warning before destructive actions',
      'best.do.4': 'Allow user to dismiss manually',
      'best.do.5': 'Increase duration for long messages',
      'best.dont.title': '❌ Avoid',
      'best.dont.1': 'Toasts for every small action',
      'best.dont.2': 'Very long messages',
      'best.dont.3': 'More than 3 toasts at once',
      'best.dont.4': 'Toasts that cannot be dismissed',
      'best.dont.5': 'Using danger for simple validation errors',

      // Technical Decisions
      'tech.whySignals.title': 'Why Signals?',
      'tech.whySignals.p1': 'We use Angular\'s <strong>Signals</strong> API because:',
      'tech.whySignals.l1': '<strong>Performance:</strong> Signals are more efficient than BehaviorSubject',
      'tech.whySignals.l2': '<strong>Simplicity:</strong> No need for <code>.subscribe()</code> and <code>.unsubscribe()</code>',
      'tech.whySignals.l3': '<strong>Future:</strong> It\'s the direction Angular is heading',
      'tech.whySignals.l4': '<strong>Fewer bugs:</strong> No memory leaks from forgotten subscriptions',

      'tech.whyZeroDeps.title': 'Why zero dependencies?',
      'tech.whyZeroDeps.p1': 'We decided not to use any external library because:',
      'tech.whyZeroDeps.l1': '<strong>Fewer conflicts:</strong> No risk of incompatible versions',
      'tech.whyZeroDeps.l2': '<strong>Smaller bundle:</strong> You only include what you really need',
      'tech.whyZeroDeps.l3': '<strong>Maintenance:</strong> Fewer dependencies = fewer security updates',
      'tech.whyZeroDeps.l4': '<strong>Control:</strong> We know exactly what each line of code does',

      'tech.whySimple.title': 'Why "simple" code?',
      'tech.whySimple.p1': 'Toastly code is intentionally simple and verbose because:',
      'tech.whySimple.l1': '<strong>Readability:</strong> Any developer can understand and modify',
      'tech.whySimple.l2': '<strong>Debugging:</strong> Errors are easy to find and fix',
      'tech.whySimple.l3': '<strong>Learning:</strong> Interns and juniors can contribute with confidence',
      'tech.whySimple.l4': '<strong>Maintenance:</strong> Clear code is easier to maintain long term',
      'tech.whySimple.quote': '"Prefer code that an intern can debug at 2am over \'clever\' code that only the original author understands."',

      'tech.whyDestroy.title': 'Why DestroyRef for timers?',
      'tech.whyDestroy.p1': 'We use <code>DestroyRef</code> to ensure all <code>setTimeout</code> are cleaned up when the service is destroyed. This:',
      'tech.whyDestroy.l1': 'Prevents memory leaks',
      'tech.whyDestroy.l2': 'Avoids "component destroyed" errors in tests',
      'tech.whyDestroy.l3': 'Is the modern Angular standard (replacing <code>OnDestroy</code>)',

      // Custom Icons
      'icons.title': 'Custom Icons',
      'icons.lead': 'Use your own icons instead of the default ones. Works with any icon library, including <strong>Lucide Icons</strong>, <strong>FontAwesome</strong>, or custom SVGs.',
      'icons.how.title': 'How does it work?',
      'icons.how.desc': 'Toastly accepts a <code>TemplateRef</code> in the <code>iconTemplate</code> option. This allows you to pass any HTML/Angular content as an icon.',
      'icons.step1.title': '1. Install Lucide Angular',
      'icons.step2.title': '2. Create a template for the icon',
      'icons.step2.desc': 'In your component, define an <code>ng-template</code> with the desired icon:',
      'icons.why.title': '🤔 Why use TemplateRef?',
      'icons.why.desc': 'Using <code>TemplateRef</code>, you have <strong>total control</strong> over the icon. You can use any icon library, add animations, or even complex components. We are not "tied" to a specific library.',
      'icons.svg.title': 'Using direct SVG (no library)',
      'icons.svg.desc': 'If you do not want to install an icon library, you can use inline SVG:',
      'icons.diff.title': 'Different icons for each type',
      'icons.diff.desc': 'You can create a service that returns the correct icon based on context:',
      'icons.tip.title': '💡 Style Tip',
      'icons.tip.desc': 'Default icons use <code>width: 20px</code> and <code>height: 20px</code>. To maintain visual consistency, use the same size in your custom icons. Use <code>color: currentColor</code> to inherit the toast color.',

      // Themes
      'themes.title': 'Themes (Light / Dark)',
      'themes.lead': 'Each toast can have a light or dark theme, independent of the rest of the application.',
      'themes.compare': 'Comparison',
      'themes.tip.title': '💡 When to use dark theme?',
      'themes.tip.desc': 'Dark theme is great for important notifications that need to stand out, especially in applications with light backgrounds. It pairs well with toasts that have action buttons.',


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
      'nav.advanced': 'Avançado',

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

      // Code Explanation
      'code.explanation.title': 'Entendendo o código linha por linha:',
      'code.explanation.line': 'Linha',
      'code.explanation.action': 'O que faz',
      'code.explanation.inject': 'Obtém uma instância do serviço de toasts. Isso é a "injeção de dependência" do Angular.',
      'code.explanation.private': '<strong>private:</strong> só este componente pode acessar. <strong>readonly:</strong> não pode ser alterado depois de criado.',
      'code.explanation.success': 'Mostra um toast do tipo "sucesso" (com ícone verde de check).',

      // Errors
      'errors.title': 'Erros Comuns',
      'errors.lead': 'Problemas que você pode encontrar e como resolvê-los.',
      'errors.q1': 'Toast não aparece na tela',
      'errors.a1.cause': '<strong>Causa mais comum:</strong> Esqueceu de adicionar <code>&lt;toastly-container /&gt;</code>',
      'errors.a1.solution': '<strong>Solução:</strong> Adicione o container no template do AppComponent.',
      'errors.q2': 'Toast aparece sem estilos',
      'errors.a2.cause': '<strong>Causa:</strong> CSS não foi importado',
      'errors.a2.solution': '<strong>Solução:</strong> Adicione <code>@import \'toastly/styles/toastly.css\';</code> no seu styles.css',
      'errors.q3': 'Erro "Maximum number of toasts exceeded"',
      'errors.a3.cause': '<strong>Causa:</strong> Você está criando toasts muito rápido',
      'errors.a3.solution': '<strong>Solução:</strong> Aumente <code>maximumVisibleToasts</code> na config global ou reduza a frequência de criação.',

      // Global Config Options
      'config.options.title': 'Opções de Configuração Global',
      'config.options.option': 'Opção',
      'config.options.default': 'Padrão',
      'config.options.description': 'Descrição',
      'config.pos.desc': 'Posição dos toasts na tela',
      'config.theme.desc': 'Tema padrão para todos os toasts',
      'config.duration.desc': 'Tempo padrão de exibição',
      'config.max.desc': 'Máximo de toasts visíveis ao mesmo tempo',
      'config.newest.desc': 'Se novos toasts aparecem no topo da pilha',
      'config.pause.desc': 'Se pausa o timer ao passar o mouse',

      // Config Descriptions (Table)
      'config.desc.message': 'Texto principal do toast (obrigatório)',
      'config.desc.title': 'Título em negrito acima da mensagem',
      'config.desc.type': 'Define a cor e ícone do toast',
      'config.desc.theme': 'Tema visual (claro ou escuro)',
      'config.desc.duration': 'Tempo até fechar automaticamente (0 = nunca)',
      'config.desc.dismissible': 'Se mostra o botão (x) para fechar',
      'config.desc.styleClass': 'Classes CSS customizadas',
      'config.desc.progress': 'Valor da barra de progresso (0-100)',

      // Best Practices
      'best.do.title': '✅ Faça',
      'best.do.1': 'Use mensagens curtas e diretas',
      'best.do.2': 'Reserve success para ações importantes',
      'best.do.3': 'Use warning antes de ações destrutivas',
      'best.do.4': 'Permita que o usuário feche manualmente',
      'best.do.5': 'Aumente a duração para mensagens longas',
      'best.dont.title': '❌ Evite',
      'best.dont.1': 'Toasts para cada pequena ação',
      'best.dont.2': 'Mensagens muito longas',
      'best.dont.3': 'Mais de 3 toasts ao mesmo tempo',
      'best.dont.4': 'Toasts que não podem ser fechados',
      'best.dont.5': 'Usar danger para erros de validação simples',

      // Technical Decisions
      'tech.whySignals.title': 'Por que Signals?',
      'tech.whySignals.p1': 'Usamos a API de <strong>Signals</strong> do Angular porque:',
      'tech.whySignals.l1': '<strong>Performance:</strong> Signals são mais eficientes que BehaviorSubject',
      'tech.whySignals.l2': '<strong>Simplicidade:</strong> Não precisa de <code>.subscribe()</code> e <code>.unsubscribe()</code>',
      'tech.whySignals.l3': '<strong>Futuro:</strong> É a direção que o Angular está seguindo',
      'tech.whySignals.l4': '<strong>Menos bugs:</strong> Sem memory leaks de subscriptions esquecidas',

      'tech.whyZeroDeps.title': 'Por que zero dependências?',
      'tech.whyZeroDeps.p1': 'Decidimos não usar nenhuma biblioteca externa porque:',
      'tech.whyZeroDeps.l1': '<strong>Menos conflitos:</strong> Não há risco de versões incompatíveis',
      'tech.whyZeroDeps.l2': '<strong>Bundle menor:</strong> Você só inclui o que realmente precisa',
      'tech.whyZeroDeps.l3': '<strong>Manutenção:</strong> Menos dependências = menos atualizações de segurança',
      'tech.whyZeroDeps.l4': '<strong>Controle:</strong> Sabemos exatamente o que cada linha de código faz',

      'tech.whySimple.title': 'Por que código "simples"?',
      'tech.whySimple.p1': 'O código do Toastly é intencionalmente simples e verboso porque:',
      'tech.whySimple.l1': '<strong>Legibilidade:</strong> Qualquer desenvolvedor consegue entender e modificar',
      'tech.whySimple.l2': '<strong>Debugging:</strong> Erros são fáceis de encontrar e corrigir',
      'tech.whySimple.l3': '<strong>Aprendizado:</strong> Estagiários e juniors podem contribuir com confiança',
      'tech.whySimple.l4': '<strong>Manutenção:</strong> Código claro é mais fácil de manter a longo prazo',
      'tech.whySimple.quote': '"Prefira código que um estagiário consegue debugar às 2h da manhã do que código \'esperto\' que só o autor original entende."',

      'tech.whyDestroy.title': 'Por que DestroyRef para timers?',
      'tech.whyDestroy.p1': 'Usamos <code>DestroyRef</code> para garantir que todos os <code>setTimeout</code> são limpos quando o serviço é destruído. Isso:',
      'tech.whyDestroy.l1': 'Previne memory leaks',
      'tech.whyDestroy.l2': 'Evita erros de "component destroyed" em testes',
      'tech.whyDestroy.l3': 'É o padrão moderno do Angular (substituindo <code>OnDestroy</code>)',

      // Custom Icons
      'icons.title': 'Ícones Customizados',
      'icons.lead': 'Use seus próprios ícones em vez dos ícones padrão. Funciona com qualquer biblioteca de ícones, incluindo <strong>Lucide Icons</strong>, <strong>FontAwesome</strong>, ou SVGs customizados.',
      'icons.how.title': 'Como funciona?',
      'icons.how.desc': 'O Toastly aceita um <code>TemplateRef</code> na opção <code>iconTemplate</code>. Isso permite que você passe qualquer conteúdo HTML/Angular como ícone.',
      'icons.step1.title': '1. Instale o Lucide Angular',
      'icons.step2.title': '2. Crie um template para o ícone',
      'icons.step2.desc': 'No seu componente, defina um <code>ng-template</code> com o ícone desejado:',
      'icons.why.title': '🤔 Por que usar TemplateRef?',
      'icons.why.desc': 'Usando <code>TemplateRef</code>, você tem <strong>controle total</strong> sobre o ícone. Pode usar qualquer biblioteca de ícones, adicionar animações, ou até componentes complexos. Não ficamos "amarrados" a uma biblioteca específica.',
      'icons.svg.title': 'Usando SVG direto (sem biblioteca)',
      'icons.svg.desc': 'Se você não quer instalar uma biblioteca de ícones, pode usar SVG inline:',
      'icons.diff.title': 'Ícones diferentes para cada tipo',
      'icons.diff.desc': 'Você pode criar um serviço que retorna o ícone correto baseado no contexto:',
      'icons.tip.title': '💡 Dica de estilo',
      'icons.tip.desc': 'Os ícones padrão usam <code>width: 20px</code> e <code>height: 20px</code>. Para manter a consistência visual, use o mesmo tamanho nos seus ícones customizados. Use <code>color: currentColor</code> para herdar a cor do toast.',

      // Themes
      'themes.title': 'Temas (Light / Dark)',
      'themes.lead': 'Cada toast pode ter tema claro ou escuro, independente do resto da aplicação.',
      'themes.compare': 'Comparação',
      'themes.tip.title': '💡 Quando usar o tema dark?',
      'themes.tip.desc': 'O tema escuro é ótimo para notificações importantes que precisam se destacar, especialmente em aplicações com fundo claro. Combina bem com toasts que têm botões de ação.',


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
