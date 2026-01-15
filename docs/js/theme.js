/**
 * Toastly Theme Manager
 * 
 * Centralized theme management with localStorage persistence
 * and prefers-color-scheme fallback.
 * 
 * Usage:
 * - Theme is automatically applied on page load
 * - Call ThemeManager.toggle() to switch themes
 * - Call ThemeManager.set('dark') or ThemeManager.set('light') for explicit control
 */

const ThemeManager = (() => {
  // ============================================================================
  // CONSTANTS
  // ============================================================================
  
  const STORAGE_KEY = 'toastly-theme';
  const THEMES = Object.freeze({
    LIGHT: 'light',
    DARK: 'dark'
  });
  const DEFAULT_THEME = THEMES.LIGHT;

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Get the user's system preference for color scheme
   * @returns {'light' | 'dark'} The system preferred theme
   */
  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  }

  /**
   * Get the stored theme from localStorage
   * @returns {string | null} The stored theme or null
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage might be blocked
      return null;
    }
  }

  /**
   * Save theme to localStorage
   * @param {string} theme - The theme to save
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage might be blocked - fail silently
    }
  }

  /**
   * Apply theme to the document
   * @param {string} theme - The theme to apply
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButton(theme);
  }

  /**
   * Update the toggle button icon based on current theme
   * @param {string} theme - The current theme
   */
  function updateToggleButton(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const sunIcon = toggle.querySelector('.theme-icon-light');
    const moonIcon = toggle.querySelector('.theme-icon-dark');

    if (sunIcon && moonIcon) {
      if (theme === THEMES.DARK) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Initialize the theme manager
   * Called automatically when script loads
   */
  function init() {
    // Priority: localStorage > system preference > default
    const storedTheme = getStoredTheme();
    const currentTheme = storedTheme || getSystemPreference() || DEFAULT_THEME;
    
    applyTheme(currentTheme);

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply if user hasn't explicitly chosen a theme
        if (!getStoredTheme()) {
          applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        }
      });
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    
    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  /**
   * Set a specific theme
   * @param {'light' | 'dark'} theme - The theme to set
   */
  function set(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Use 'light' or 'dark'.`);
      return;
    }
    
    applyTheme(theme);
    saveTheme(theme);
  }

  /**
   * Get the current theme
   * @returns {'light' | 'dark'} The current theme
   */
  function get() {
    return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  // Initialize immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    init,
    toggle,
    set,
    get,
    THEMES
  };
})();

// Make toggle function globally available for onclick handlers
window.toggleTheme = () => ThemeManager.toggle();
