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
