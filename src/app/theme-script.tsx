/**
 * Theme Script
 * Prevents flash of wrong theme on page load
 */

export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const themeOverride = localStorage.getItem('themeOverride');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = themeOverride ? themeOverride === 'dark' : prefersDark;

        document.documentElement.classList.toggle('dark', isDark);
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}

