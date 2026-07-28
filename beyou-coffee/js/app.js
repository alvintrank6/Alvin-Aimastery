/**
 * Be You Tea & Coffee - Main Application JavaScript
 * Handles: theme toggle, language switch, scroll animations, mobile menu
 */

(function() {
  'use strict';

  // DOM Elements
  const html = document.documentElement;
  const header = document.querySelector('.header');
  const themeToggle = document.querySelector('[data-action="theme"]');
  const langToggle = document.querySelector('[data-action="lang"]');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const newsletterForm = document.getElementById('newsletter-form');
  const formMessage = document.getElementById('form-message');
  const currentYearEl = document.getElementById('current-year');

  // State
  let currentLang = localStorage.getItem('beyou-lang') || 'vi';
  let currentTheme = localStorage.getItem('beyou-theme') || 'night';

  // Initialize
  function init() {
    setYear();
    setTheme(currentTheme);
    setLanguage(currentLang);
    bindEvents();
    initScrollSpy();
    initRevealAnimations();
    initHeroAnimations();
  }

  // Set current year in footer
  function setYear() {
    if (currentYearEl) {
      currentYearEl.textContent = new Date().getFullYear();
    }
  }

  // Theme Management
  function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('beyou-theme', theme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'night' ? '#14110F' : '#f5f5f5');
    }
    
    // Update icon visibility
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = theme === 'night' ? 'none' : 'block';
      moonIcon.style.display = theme === 'night' ? 'block' : 'none';
    }
    
    // Toggle neon hum based on theme
    const neonSign = document.querySelector('.neon-sign');
    if (neonSign) {
      if (theme === 'night') {
        neonSign.classList.add('neon-hum');
      } else {
        neonSign.classList.remove('neon-hum');
      }
    }
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'night' ? 'day' : 'night';
    
    // Fade transition
    document.body.style.transition = 'background-color 500ms ease, color 500ms ease';
    setTheme(newTheme);
    
    // Rotate icon animation
    const icon = themeToggle.querySelector('svg');
    if (icon) {
      icon.style.transform = 'rotate(180deg)';
      icon.style.transition = 'transform 500ms ease';
      setTimeout(() => {
        icon.style.transform = '';
      }, 500);
    }
  }

  // Language Management
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('beyou-lang', lang);
    html.setAttribute('lang', lang);
    
    // Update flag
    const flagSpan = langToggle.querySelector('span');
    if (flagSpan) {
      flagSpan.textContent = lang === 'vi' ? '🇻🇳' : '🇬🇧';
    }
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    
    // Translate all elements with data-lang attributes
    translatePage(lang);
  }

  function toggleLanguage() {
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    
    // Quick fade transition
    document.querySelectorAll('[data-lang-vi]').forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 150ms ease';
    });
    
    setTimeout(() => {
      setLanguage(newLang);
      
      document.querySelectorAll('[data-lang-vi]').forEach(el => {
        el.style.opacity = '1';
        el.style.transition = 'opacity 200ms ease';
      });
    }, 150);
  }

  function translatePage(lang) {
    const attr = lang === 'vi' ? 'data-lang-vi' : 'data-lang-en';
    
    document.querySelectorAll(`[${attr}]`).forEach(el => {
      const text = el.getAttribute(attr);
      if (text) {
        // Preserve HTML structure for elements with child nodes
        if (el.children.length === 0) {
          el.textContent = text;
        }
      }
    });
    
    // Update title
    const titleVi = document.querySelector('meta[property="og:title"]');
    if (titleVi) {
      const titleText = lang === 'vi' 
        ? 'Be You Tea & Coffee - Coffee & Workplace'
        : 'Be You Tea & Coffee - Coffee & Workplace';
      document.title = titleText;
    }
  }

  // Mobile Menu
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', !expanded);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Scroll Spy
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // Reveal Animations on Scroll
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -8% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // Hero Animations on Page Load
  function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Stagger animations after neon flicker
      setTimeout(() => {
        if (heroTitle) {
          heroTitle.style.transition = 'opacity 600ms cubic-bezier(.2,.7,.3,1), transform 600ms cubic-bezier(.2,.7,.3,1)';
          heroTitle.style.opacity = '1';
          heroTitle.style.transform = 'translateY(0)';
        }
      }, 300);
      
      setTimeout(() => {
        if (heroSubtitle) {
          heroSubtitle.style.transition = 'opacity 600ms cubic-bezier(.2,.7,.3,1), transform 600ms cubic-bezier(.2,.7,.3,1)';
          heroSubtitle.style.opacity = '1';
          heroSubtitle.style.transform = 'translateY(0)';
        }
      }, 500);
      
      setTimeout(() => {
        if (heroStats) {
          heroStats.style.transition = 'opacity 600ms cubic-bezier(.2,.7,.3,1), transform 600ms cubic-bezier(.2,.7,.3,1)';
          heroStats.style.opacity = '1';
          heroStats.style.transform = 'translateY(0)';
        }
      }, 700);
    } else {
      // Show immediately if reduced motion is preferred
      [heroTitle, heroSubtitle, heroStats].forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }
  }

  // Header Scroll Effect
  function handleScroll() {
    requestAnimationFrame(() => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Newsletter Form
  function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    // Simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      showMessage('Vui lòng nhập email hợp lệ', 'error');
      return;
    }
    
    // Simulate submission (in production, this would be an API call)
    showMessage('Cảm ơn bạn đã đăng ký!', 'success');
    emailInput.value = '';
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove('sr-only');
    formMessage.style.color = type === 'success' ? 'var(--ember)' : 'var(--text-secondary)';
    
    setTimeout(() => {
      formMessage.classList.add('sr-only');
    }, 3000);
  }

  // Smooth Scroll for Anchor Links
  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      }
    }
  }

  // Keyboard Navigation
  function handleKeyboard(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      menuToggle.focus();
    }
  }

  // Event Bindings
  function bindEvents() {
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Language toggle
    if (langToggle) {
      langToggle.addEventListener('click', toggleLanguage);
    }
    
    // Mobile menu toggle
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
    
    // Newsletter form
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang') || 'vi';
      if (lang !== currentLang) {
        setLanguage(lang);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
