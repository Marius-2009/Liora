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
    // Créer un overlay avec animation
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 143, 171, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: fadeIn 0.5s;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 80px; margin-bottom: 20px;">🦄✨</div>
            <h2 style="font-size: 36px; margin-bottom: 10px;">Mode Licorne Activé !</h2>
            <p style="font-size: 20px;">Vous avez découvert le secret de Liora 🎉</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.animation = 'rainbow 3s linear infinite';
    
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
            overlay.remove();
            document.body.style.animation = '';
        }, 500);
    }, 3000);
}

// ===== STYLES POUR LES ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== CONSOLE MESSAGES POUR DÉVELOPPEURS =====
console.log('%c🌟 Bienvenue sur Liora! 🌟', 'color: #FF8FAB; font-size: 20px; font-weight: bold;');
console.log('%cVous êtes développeur ? Nous recrutons ! 💝', 'color: #FFB3C6; font-size: 14px;');
console.log('%cContactez-nous: dev@liora.app', 'color: #E8D5F2; font-size: 12px;');

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
