const THEME_KEY = 'themeMode'
const LANGUAGE_KEY = 'appLanguage'
const DEFAULT_THEME = 'light'
const DEFAULT_LANGUAGE = 'zh-CN'
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0'

let mediaQuery

const getPreferenceScope = () => {
  if (typeof localStorage === 'undefined') return ''
  return (localStorage.getItem('username') || '').trim().toLowerCase()
}

const getScopedKey = (baseKey) => {
  const scope = getPreferenceScope()
  return scope ? `${baseKey}:${scope}` : ''
}

const getSystemTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const watchSystemTheme = (enabled) => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  }
  mediaQuery.onchange = enabled ? () => applyThemeMode('system', false) : null
}

/**
 * 应用色彩模式
 * @param {'light' | 'dark' | 'system'} mode
 * @param {boolean} persist 是否写入 localStorage
 * @returns {string} 实际应用的主题（light/dark）
 */
export const applyThemeMode = (mode, persist = true) => {
  const effectiveMode = mode === 'system' ? getSystemTheme() : mode || DEFAULT_THEME
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', effectiveMode)
  }
  if (persist) {
    const scopedThemeKey = getScopedKey(THEME_KEY)
    if (scopedThemeKey) {
      localStorage.setItem(scopedThemeKey, mode || DEFAULT_THEME)
    }
  }
  watchSystemTheme(mode === 'system')
  return effectiveMode
}

/**
 * 应用语言（仅设置 lang 属性，留出未来多语言的扩展空间）
 * @param {string} lang
 */
export const applyLanguage = (lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang || DEFAULT_LANGUAGE)
  }
  const scopedLanguageKey = getScopedKey(LANGUAGE_KEY)
  if (scopedLanguageKey) {
    localStorage.setItem(scopedLanguageKey, lang || DEFAULT_LANGUAGE)
  }
  return lang || DEFAULT_LANGUAGE
}

export const loadPreferences = () => {
  const scopedThemeKey = getScopedKey(THEME_KEY)
  const scopedLanguageKey = getScopedKey(LANGUAGE_KEY)
  return {
    themeMode: scopedThemeKey ? (localStorage.getItem(scopedThemeKey) || DEFAULT_THEME) : DEFAULT_THEME,
    language: scopedLanguageKey ? (localStorage.getItem(scopedLanguageKey) || DEFAULT_LANGUAGE) : DEFAULT_LANGUAGE
  }
}

/**
 * 初始化主题与语言
 */
export const initPreferences = () => {
  const { themeMode, language } = loadPreferences()
  const resolvedTheme = applyThemeMode(themeMode, false)
  applyLanguage(language)
  return { themeMode, language, resolvedTheme }
}

export const getAppVersion = () => APP_VERSION
