try {
  const theme = localStorage.getItem('portfolio-theme');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch { /* The default paper theme also works without local storage. */ }
