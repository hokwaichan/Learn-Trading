import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { loadLocale } from './i18n';
import { useSettings } from './stores/settings';

// The language's dictionary loads before anything else runs, so every screen
// renders in one language from the first frame.
//
// Everything except this file, src/i18n and the settings store is imported
// only after that, which is what lets any module call t() at its top level
// (menus, option lists, instrument names). Keep it that way: a new static
// import here would freeze that module's text in English.
async function start() {
  const { locale } = useSettings.getState();
  try {
    await loadLocale(locale);
  } catch {
    // The dictionary could not be downloaded (offline on first visit): carry on in English.
  }
  if (locale !== 'en') {
    const { localizeContent } = await import('./i18n/contentStrings');
    localizeContent();
  }
  const { App } = await import('./app/App');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void start();
