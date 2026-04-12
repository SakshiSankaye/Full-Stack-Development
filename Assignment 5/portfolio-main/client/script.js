// Portfolio Data Configuration
const portfolioData = {
    profile: {
        name: "Sakshi Sankaye",
        role: "Software Developer",
        typingTexts: [
            "Full Stack Developer",
            "AI Enthusiast", 
            "Problem Solver",
            "Software Developer",
            "UI/UX Designer"
        ]
    },
    skills: [
        { name: "Java", category: "Programming", icon: "fab fa-java" },
        { name: "C++", category: "Programming", icon: "fas fa-code" },
        { name: "C", category: "Programming", icon: "fas fa-code" },
        { name: "HTML", category: "Web", icon: "fab fa-html5" },
        { name: "CSS", category: "Web", icon: "fab fa-css3-alt" },
        { name: "JavaScript", category: "Web", icon: "fab fa-js-square" },
        { name: "PHP", category: "Web", icon: "fab fa-php" },
        //{ name: "React.js", category: "Web", icon: "fab fa-react" },
        // { name: "Next.js", category: "Web", icon: "fas fa-rocket" },
        { name: "MySQL", category: "Database", icon: "fas fa-database" },
        { name: "MongoDB", category: "Database", icon: "fas fa-fire" },
        { name: "Android Dev", category: "Mobile", icon: "fab fa-android" },
        //{ name: "Full Stack", category: "Web", icon: "fas fa-layer-group" }
    ],
    projects: [
// {
//     title: "Find My Hostel Application",
//     category: "Web",
//     description: "Developed a web application that helps students and travelers find affordable hostels based on location, budget, and available facilities.",
//     technologies: ["Java", "HTML", "CSS", "JavaScript", "MySQL"],
//     image: "hostel.jpg",
//     featured: true
// },

// {
//     title: "IoT Based Anti-Sleep Alarm for Drivers",
//     category: "Mobile",
//     description: "Developed an IoT-based system to detect driver drowsiness and trigger an alarm to prevent accidents and improve road safety.",
//     technologies: ["Arduino", "IoT", "Embedded C"],
//     image: "iot.jpg",
//     featured: false
// },

{
    title: "Library Management System",
    category: "Web",
    description: "Built a system to automate book inventory management, member registration, and borrowing/return processes for libraries.",
    technologies: ["Java", "HTML", "CSS", "MySQL"],
    image: "images/library.jpeg",
    featured: false
},

{
    title: "Heart Disease Prediction using Machine Learning",
    category: "Web",
    description: "Developed a machine learning model to predict the likelihood of heart disease using patient health data.",
    technologies: ["Python", "Machine Learning", "Pandas", "Scikit-Learn"],
    image: "images/heart.jpeg",
    featured: false
}
],
    experience: [

{
    dateRange: "May 2025 – June 2025",
    title: "Android Development Intern",
    company: "Inter-College Internship",
    location: "PCCOE, Pune",
    type: "experience",
    details: [
        "Developed an Android application using Kotlin.",
        "Designed user interfaces and implemented application features.",
        "Gained practical experience in Android application development."
    ]
},

{
    dateRange: "June 2023 – July 2023",
    title: "Web Development Intern",
    company: "Bright Career Infotech",
    location: "Latur, Maharashtra",
    type: "experience",
    details: [
        "Developed responsive websites using HTML, CSS and PHP.",
        "Implemented database connectivity and backend functionality.",
        "Enhanced UI design and improved website performance."
    ]
}

]
};

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const typedText = document.getElementById('typed-text');
const contactForm = document.getElementById('contact-form');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
}


// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Typing Animation
function initTypingAnimation() {
    const texts = portfolioData.profile.typingTexts;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function typeText() {
        const fullText = texts[textIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }

        typedText.innerHTML = currentText + '<span class="typing-cursor"></span>';

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === fullText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// Skills Section


function setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.skill-filter');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter skills
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Projects Section
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = portfolioData.projects;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card hover-lift fade-in" data-category="${project.category}">
            <div class="relative overflow-hidden">
                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                ${project.featured ? '<div class="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</div>' : ''}
            </div>

            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${project.title}</h3>

                <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    ${project.description}
                </p>

                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech =>
                        `<span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">${tech}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Timeline Section
function renderTimeline() {
    const timeline = document.getElementById('timeline');
    const experiences = portfolioData.experience;

    timeline.innerHTML = experiences.map((item, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 200}ms">
            <div class="glass-card p-6 ml-6">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white">${item.title}</h3>
                        <h4 class="text-lg font-semibold text-blue-600 dark:text-blue-400">${item.company}</h4>
                        <p class="text-gray-600 dark:text-gray-400">${item.location}</p>
                    </div>
                    <div class="mt-2 md:mt-0">
                        <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            ${item.dateRange}
                        </span>
                        <span class="inline-block px-3 py-1 ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            ${item.type === 'experience' ? 'Work' : 'Education'}
                        </span>
                    </div>
                </div>
                <ul class="space-y-2">
                    ${item.details.map(detail => 
                        `<li class="flex items-start text-gray-600 dark:text-gray-300">
                            <i class="fas fa-check-circle text-green-500 mr-3 mt-1 flex-shrink-0"></i>
                            <span class="text-sm leading-relaxed">${detail}</span>
                        </li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

// Testimonial Slider
// function initTestimonialSlider() {
//     const track = document.querySelector('.testimonial-track');
//     const prevBtn = document.querySelector('.testimonial-prev');
//     const nextBtn = document.querySelector('.testimonial-next');
    
//     if (!track || !prevBtn || !nextBtn) return;
    
//     let currentSlide = 0;
//     const totalSlides = document.querySelectorAll('.testimonial-item').length;

//     function updateSlider() {
//         const translateX = -currentSlide * 100;
//         track.style.transform = `translateX(${translateX}%)`;
//     }

//     nextBtn.addEventListener('click', () => {
//         currentSlide = (currentSlide + 1) % totalSlides;
//         updateSlider();
//     });

//     prevBtn.addEventListener('click', () => {
//         currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
//         updateSlider();
//     });

//     // Auto-play
//     setInterval(() => {
//         currentSlide = (currentSlide + 1) % totalSlides;
//         updateSlider();
//     }, 5000);
// }

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        alert("Saved to database ✅");
        contactForm.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-medium transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Particle Effect
function createParticleEffect() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 15000);
    }

    setInterval(createParticle, 300);
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Parallax Effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// Preloader
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div class="text-center">
                <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-xl font-semibold text-gray-800 dark:text-white">Loading Portfolio...</p>
            </div>
        </div>
    `;
    preloader.className = 'fixed inset-0 z-50 bg-white dark:bg-gray-900';
    
    document.body.prepend(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 1000);
    });
}

// Initialize cursor effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Add hover effects
    document.querySelectorAll('a, button, .hover-effect').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Easter Egg - Konami Code
function initEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
            triggerEasterEgg();
            userInput = [];
        }
    });
}

function triggerEasterEgg() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const originalBg = document.body.style.background;
    
    let colorIndex = 0;
    const colorInterval = setInterval(() => {
        document.body.style.background = colors[colorIndex % colors.length];
        colorIndex++;
    }, 200);
    
    showNotification('🎉 Konami Code Activated! You found the easter egg!', 'success');
    
    setTimeout(() => {
        clearInterval(colorInterval);
        document.body.style.background = originalBg;
    }, 3000);
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('Page load time is slower than expected');
            }
        });
    }
}

// Accessibility improvements
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
    document.body.prepend(skipLink);

    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });

    // ARIA labels and roles
    document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
            img.alt = 'Decorative image';
        }
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initTheme();
    initTypingAnimation();
   renderSkills();
    setupSkillFilters();
    renderProjects();
    setupProjectFilters();
    renderTimeline();
    
    // Enhanced features
    // initTestimonialSlider();
    initScrollAnimations();
    initSmoothScrolling();
    initContactForm();
    initNavbarScroll();
    initParallaxEffect();
    initAccessibility();
    initEasterEgg();
    initPerformanceMonitoring();
    
    // Visual enhancements (comment out if not needed for performance)
    createParticleEffect();
    // initCursorEffects(); // Uncomment if you want custom cursor
    // initPreloader(); // Uncomment if you want loading screen
    
    // Event Listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    console.log('Portfolio initialized successfully! 🚀');
});

// Add CSS for custom cursor (optional)
const cursorStyles = `
    .custom-cursor {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
    }
    
    .cursor-dot {
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
    }
    
    .cursor-ring {
        width: 40px;
        height: 40px;
        border: 2px solid white;
        border-radius: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
    }
    
    .custom-cursor.cursor-hover .cursor-ring {
        width: 60px;
        height: 60px;
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;

// Inject cursor styles if cursor effects are enabled
function injectCursorStyles() {
    const style = document.createElement('style');
    style.textContent = cursorStyles;
    document.head.appendChild(style);
}

// Export functions for potential external use
window.portfolioApp = {
    toggleTheme,
    showNotification,
    portfolioData
};
// Add to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Function to update active nav link
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-nav');
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update active link on page load
    updateActiveNavLink();
});


/* -----------------------------
   Custom Cursor Effect
----------------------------- */
const cursor = document.getElementById("custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Click scale effect
document.addEventListener("mousedown", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
});
document.addEventListener("mouseup", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

function renderSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    const skills = portfolioData.skills;

    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card" data-category="${skill.category}">
            <div class="text-center">
                <i class="${skill.icon} text-4xl text-blue-600 dark:text-blue-400 mb-4"></i>
                <h3 class="font-semibold text-gray-800 dark:text-white">${skill.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${skill.category}</p>
            </div>
        </div>
    `).join('');
}