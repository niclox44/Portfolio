'use strict';
const root = document.documentElement;
const stored = key => { try { return localStorage.getItem(key); } catch { return null; } };
const remember = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Browsing still works without storage. */ } };
const translated = [...document.querySelectorAll('[data-en]')];
translated.forEach(element => { element.dataset.es = element.textContent; });
document.querySelectorAll('[data-label-en]').forEach(element => { element.dataset.labelEs = element.getAttribute('aria-label'); });
document.querySelectorAll('[data-alt-en]').forEach(element => { element.dataset.altEs = element.alt; });
const requested = new URLSearchParams(location.search).get('lang');
let language = ['es', 'en'].includes(requested) ? requested : stored('portfolio-language') === 'en' ? 'en' : 'es';
const themeButton = document.querySelector('.theme-toggle');
const languageButton = document.querySelector('.language-toggle');
function updateTheme() {
  const dark = root.dataset.theme === 'dark';
  themeButton?.setAttribute('aria-pressed', String(dark));
  themeButton?.setAttribute('aria-label', language === 'es' ? `Activar modo ${dark ? 'claro' : 'oscuro'}` : `Switch to ${dark ? 'light' : 'dark'} mode`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#141413' : '#e4e2d7';
}
function setLanguage() {
  root.lang = language;
  translated.forEach(element => { element.textContent = element.dataset[language]; });
  document.querySelectorAll('[data-label-en]').forEach(element => { element.setAttribute('aria-label', element.dataset[language === 'en' ? 'labelEn' : 'labelEs']); });
  document.querySelectorAll('[data-alt-en]').forEach(element => { element.alt = element.dataset[language === 'en' ? 'altEn' : 'altEs']; });
  document.querySelectorAll('[data-lang]').forEach(element => { element.classList.toggle('selected', element.dataset.lang === language); });
  languageButton?.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
  document.title = document.body.dataset[language === 'en' ? 'titleEn' : 'titleEs'];
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.href);
    if (url.origin !== location.origin || link.hasAttribute('download') || url.hash) return;
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return;
    if (language === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    link.href = url.pathname + url.search;
  });
  const status = document.querySelector('.copy-status');
  if (status) status.textContent = '';
  updateTheme();
}
themeButton?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  remember('portfolio-theme', root.dataset.theme);
  updateTheme();
});
languageButton?.addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  remember('portfolio-language', language);
  const url = new URL(location.href);
  if (language === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
  history.replaceState(null, '', url);
  setLanguage();
});
document.querySelector('.copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('nicoberry008@gmail.es');
    status.textContent = language === 'es' ? 'Correo copiado.' : 'Email copied.';
  } catch {
    status.textContent = language === 'es' ? 'Puedes seleccionar el correo y copiarlo, o abrir su enlace.' : 'You can select and copy the email, or open its link.';
  }
});
setLanguage();
// Preserve bookmarks from the previous single-page portfolio.
if (document.body.dataset.page === 'index') {
  const oldPages = { '#proyectos': 'proyectos', '#trayectoria': 'experiencia', '#sobre-mi': 'sobre-mi', '#contacto': 'contacto' };
  const page = oldPages[location.hash];
  if (page) location.replace(`${page}.html${language === 'en' ? '?lang=en' : ''}`);
}
