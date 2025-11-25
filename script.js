// ========================================
// PARTICLE CANVAS ANIMATION
// ========================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = 1 - (distance / 150);
                    const lineWidth = Math.max(0.5, opacity * 2);
                    
                    // Create gradient stroke
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 245, 255, ${opacity * 0.6})`);
                    gradient.addColorStop(0.5, `rgba(0, 102, 255, ${opacity * 0.8})`);
                    gradient.addColorStop(1, `rgba(138, 43, 226, ${opacity * 0.6})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.lineCap = 'round';
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    
    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.2;
            this.vy -= Math.sin(angle) * force * 0.2;
        }
        
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary check
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
        
        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw(ctx) {
        // Create gradient particle
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `rgba(0, 245, 255, 0.8)`);
        gradient.addColorStop(0.5, `rgba(0, 102, 255, 0.5)`);
        gradient.addColorStop(1, `rgba(138, 43, 226, 0.2)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Initialize particle system
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    new ParticleSystem(canvas);
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    const svg = mobileMenuBtn.querySelector('svg');
    if (mobileMenu.classList.contains('active')) {
        svg.style.transform = 'rotate(90deg)';
    } else {
        svg.style.transform = 'rotate(0deg)';
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const svg = mobileMenuBtn.querySelector('svg');
        svg.style.transform = 'rotate(0deg)';
    });
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        const svg = mobileMenuBtn.querySelector('svg');
        svg.style.transform = 'rotate(0deg)';
    }
});

// ========================================
// SMOOTH SCROLL ENHANCEMENT
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// SCROLL ANIMATION - INTERSECTION OBSERVER
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
const animateElements = document.querySelectorAll('.section, .glass-card');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// SKILL BAR ANIMATION
// ========================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress');
            if (progressBar) {
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-item').forEach(item => {
    skillObserver.observe(item);
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 10) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// PARALLAX EFFECT DISABLED FOR BETTER UX
// ========================================
// Removed parallax effect to prevent layout issues

// ========================================
// COPY EMAIL ON CLICK
// ========================================
const emailCard = document.querySelector('a[href^="mailto:"]');
if (emailCard) {
    emailCard.addEventListener('click', (e) => {
        const email = 'najmiddinhamroqulov44001@gmail.com';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                const originalText = emailCard.querySelector('.contact-value').textContent;
                emailCard.querySelector('.contact-value').textContent = 'Email copied! ✓';
                
                setTimeout(() => {
                    emailCard.querySelector('.contact-value').textContent = originalText;
                }, 2000);
            }).catch(() => {
                // Fallback: just open email client
            });
        }
    });
}

// ========================================
// GRADIENT TEXT ANIMATION
// ========================================
const gradientTexts = document.querySelectorAll('.gradient-text');
gradientTexts.forEach(text => {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        // Animation is already in CSS
    }, 50);
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Disable animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ========================================
// PREVENT LAYOUT SHIFT
// ========================================
window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
    console.log('Portfolio loaded successfully! 🚀');
});

// ========================================
// CURSOR EFFECTS REMOVED FOR CLEAN EXPERIENCE
// ========================================

// ========================================
// MOUSE INTERACTION EFFECTS REMOVED
// ========================================

// ========================================
// ENHANCED HOVER EFFECTS
// ========================================
// ========================================
// HOVER EFFECTS REMOVED FOR CLEAN EXPERIENCE
// ========================================

// ========================================
// FLOATING PARTICLE ON SCROLL
// ========================================
const createFloatingElements = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    for (let i = 0; i < 3; i++) {
        const floatElement = document.createElement('div');
        floatElement.className = 'floating-element';
        floatElement.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 3}px;
            height: ${Math.random() * 6 + 3}px;
            background: linear-gradient(45deg, #00F5FF, #0066FF, #8A2BE2);
            border-radius: 50%;
            opacity: 0.4;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatUp ${4 + Math.random() * 3}s ease-in-out infinite alternate;
            filter: blur(1px);
            box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
        `;
        
        heroSection.appendChild(floatElement);
    }
    
    // Add floating animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes floatUp {
            0% { 
                transform: translateY(0px) translateX(0px) scale(1);
                opacity: 0.4;
                filter: blur(1px);
            }
            25% { 
                transform: translateY(-15px) translateX(5px) scale(1.1);
                opacity: 0.8;
                filter: blur(0.5px);
            }
            75% { 
                transform: translateY(-30px) translateX(-3px) scale(1.2);
                opacity: 0.9;
                filter: blur(0px);
            }
            100% { 
                transform: translateY(-45px) translateX(-8px) scale(1);
                opacity: 0.4;
                filter: blur(1px);
            }
        }
    `;
    document.head.appendChild(floatStyle);
};

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    // Cursor effects removed - minimal and clean
    createFloatingElements();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
});
