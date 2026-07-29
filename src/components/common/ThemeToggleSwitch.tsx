import React, { useState, useEffect } from 'react';

export const ThemeToggleSwitch: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const checkDark = document.documentElement.classList.contains('dark');
    setIsDark(checkDark);

    // Observer to detect dark class changes on <html>
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none pointer-events-auto">
      {/* Minimalist Pill Switch Button (Fixed Bottom-Center, matching mahendrar.com) */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
        className={`relative w-12 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center cursor-pointer shadow-2xl hover:scale-110 active:scale-95 ${
          isDark
            ? 'bg-[#9B2A4C] border border-[#9B2A4C] shadow-[0_0_15px_rgba(155,42,76,0.5)]'
            : 'bg-gray-300 border border-gray-300 shadow-lg'
        }`}
      >
        {/* Solid Circular Knob */}
        <div
          className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark
              ? 'translate-x-6 bg-white'
              : 'translate-x-0 bg-[#1C2526]'
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeToggleSwitch;
