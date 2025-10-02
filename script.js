// ===== SYSTÈME MULTILINGUE =====
let currentLanguage = localStorage.getItem('liora-language') || 'fr';

// Fonction pour traduire la page
function translatePage(lang) {
    currentLanguage = lang;
    localStorage.setItem('liora-language', lang);
    
    // Traduire tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let translation = translations[lang];
        
        for (const key of keys) {
            translation = translation[key];
        }
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Mettre à jour le sélecteur de langue
    updateLanguageSelector(lang);
    
    // Mettre à jour l'attribut lang du HTML
    document.documentElement.lang = lang;
    
    // Afficher une notification
    showNotification(translations[lang].notifications.languageChanged);
}

// Mettre à jour l'affichage du sélecteur de langue
function updateLanguageSelector(lang) {
    const currentLang = document.getElementById('currentLang');
    if (currentLang) {
        currentLang.querySelector('.flag').textContent = languageFlags[lang];
        currentLang.querySelector('.lang-code').textContent = lang.toUpperCase();
    }
    
    // Marquer la langue active dans le dropdown
    document.querySelectorAll('.language-dropdown li').forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('data-lang') === lang) {
            li.classList.add('active');
        }
    });
}

// Initialiser la langue au chargement
translatePage(currentLanguage);

// ===== GESTION DU SÉLECTEUR DE LANGUE =====
const currentLangBtn = document.getElementById('currentLang');
const languageDropdown = document.getElementById('languageDropdown');
const languageSelector = document.querySelector('.language-selector');

if (currentLangBtn && languageDropdown) {
    currentLangBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageSelector.classList.toggle('active');
        languageDropdown.classList.toggle('active');
    });
    
    // Sélection d'une langue
    languageDropdown.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            translatePage(lang);
            languageSelector.classList.remove('active');
            languageDropdown.classList.remove('active');
        });
    });
    
    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!languageSelector.contains(e.target)) {
            languageSelector.classList.remove('active');
            languageDropdown.classList.remove('active');
        }
    });
}

// ===== MENU MOBILE =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        const spans = this.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(45deg) translate(5px, 5px)' 
            : 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(-45deg) translate(7px, -6px)' 
            : 'rotate(0) translate(0, 0)';
    });
}

// Fermer le menu mobile en cliquant sur un lien
const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER POUR ANIMATIONS =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les cartes de fonctionnalités
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    observer.observe(card);
});

// Observer les items de valeurs
const valueItems = document.querySelectorAll('.value-item');
valueItems.forEach(item => {
    observer.observe(item);
});

// ===== EFFET PARALLAX SUR HERO =====
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ===== GESTION DES BOUTONS CTA =====
const ctaButtons = document.querySelectorAll('.cta-button, .cta-white-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Animation de clic
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Afficher notification dans la langue actuelle
        showNotification(translations[currentLanguage].notifications.comingSoon);
    });
});

// ===== SYSTÈME DE NOTIFICATIONS =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--pink-accent), #FF6B9D);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 5px 25px rgba(255, 143, 171, 0.4);
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ===== STYLES POUR LES ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== LOGO - RETOUR EN HAUT =====
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== EASTER EGG - KONAMI CODE =====
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const messages = {
        fr: '🎉 Code secret activé ! Vous avez découvert le mode licorne ! 🦄',
        en: '🎉 Secret code activated! You discovered unicorn mode! 🦄',
        es: '🎉 ¡Código secreto activado! ¡Has descubierto el modo unicornio! 🦄',
        de: '🎉 Geheimcode aktiviert! Du hast den Einhorn-Modus entdeckt! 🦄',
        it: '🎉 Codice segreto attivato! Hai scoperto la modalità unicorno! 🦄',
        pt: '🎉 Código secreto ativado! Você descobriu o modo unicórnio! 🦄',
        nl: '🎉 Geheime code geactiveerd! Je hebt de eenhoornmodus ontdekt! 🦄'
    };
    
    showNotification(messages[currentLanguage] || messages['en']);
    document.body.style.animation = 'rainbow 3s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ===== DÉTECTION DE LA LANGUE DU NAVIGATEUR =====
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    // Si la langue du navigateur est supportée et qu'aucune langue n'est sauvegardée
    if (translations[langCode] && !localStorage.getItem('liora-language')) {
        translatePage(langCode);
    }
}

// Détecter la langue au chargement si première visite
if (!localStorage.getItem('liora-language')) {
    detectBrowserLanguage();
}

// ===== CONSOLE MESSAGES POUR DÉVELOPPEURS =====
const consoleMessages = {
    fr: {
        welcome: '🌟 Bienvenue sur Liora! 🌟',
        recruiting: 'Vous êtes développeur ? Nous recrutons ! 💝',
        contact: 'Contactez-nous: dev@liora.app'
    },
    en: {
        welcome: '🌟 Welcome to Liora! 🌟',
        recruiting: 'Are you a developer? We\'re hiring! 💝',
        contact: 'Contact us: dev@liora.app'
    }
};

const msg = consoleMessages[currentLanguage] || consoleMessages['en'];
console.log(`%c${msg.welcome}`, 'color: #FF8FAB; font-size: 20px; font-weight: bold;');
console.log(`%c${msg.recruiting}`, 'color: #FFB3C6; font-size: 14px;');
console.log(`%c${msg.contact}`, 'color: #E8D5F2; font-size: 12px;');

// ===== GESTION DES PERFORMANCES =====
// Lazy loading des images (si vous en ajoutez)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PRÉCHARGEMENT DES POLICES ET RESSOURCES =====
window.addEventListener('load', function() {
    // Précharger les ressources critiques
    const preloadLinks = [
        // Ajoutez ici vos ressources à précharger
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
});

// ===== ANALYTICS - Prêt pour Google Analytics ou autre =====
function trackEvent(category, action, label) {
    // Placeholder pour l'intégration analytics
    console.log('Event tracked:', { category, action, label, language: currentLanguage });
    
    // Si vous utilisez Google Analytics:
    // gtag('event', action, {
    //     'event_category': category,
    //     'event_label': label,
    //     'language': currentLanguage
    // });
}

// Tracker les changements de langue
const originalTranslatePage = translatePage;
translatePage = function(lang) {
    originalTranslatePage(lang);
    trackEvent('Language', 'change', lang);
};

// ===== ACCESSIBILITÉ =====
// Gestion du focus pour le clavier
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Style pour la navigation au clavier
const a11yStyle = document.createElement('style');
a11yStyle.textContent = `
    body.keyboard-navigation *:focus {
        outline: 3px solid var(--pink-accent);
        outline-offset: 2px;
    }
`;
document.head.appendChild(a11yStyle);

// ===== DÉTECTION DE CONNEXION =====
window.addEventListener('online', function() {
    const messages = {
        fr: '✅ Connexion rétablie',
        en: '✅ Connection restored',
        es: '✅ Conexión restablecida',
        de: '✅ Verbindung wiederhergestellt',
        it: '✅ Connessione ripristinata',
        pt: '✅ Conexão restabelecida',
        nl: '✅ Verbinding hersteld'
    };
    showNotification(messages[currentLanguage] || messages['en']);
});

window.addEventListener('offline', function() {
    const messages = {
        fr: '⚠️ Connexion perdue',
        en: '⚠️ Connection lost',
        es: '⚠️ Conexión perdida',
        de: '⚠️ Verbindung verloren',
        it: '⚠️ Connessione persa',
        pt: '⚠️ Conexão perdida',
        nl: '⚠️ Verbinding verloren'
    };
    showNotification(messages[currentLanguage] || messages['en']);
});
