/**
 * Dua Arah Media - Main Application Logic
 * 
 * Features:
 * - Theme Toggle (Dark/Light) - ganti tema terang/gelap
 * - Scroll Animations - animasi smooth pas scroll
 * - Contact Form Validation - validasi form kontak dengan error message
 * - Message Persistence - pesan tersimpan permanen di localStorage browser
 */

// ==================================
// FORM VALIDATION SYSTEM
// System validasi form yang reusable buat semua form di aplikasi
// ==================================

/**
 * FormValidator Class
 * 
 * Generic form validator - bisa dipake buat semua form
 * Usage: const validator = new FormValidator('form-id', validationRules);
 */
class FormValidator {
    constructor(formId, rules) {
        this.form = document.getElementById(formId);
        this.rules = rules;
        this.errors = [];
    }
    
    validate() {
        this.errors = [];
        let firstErrorField = null;
        
        Object.keys(this.rules).forEach(fieldName => {
            const result = this.validateSingleField(fieldName, false);
            if (!result.valid) {
                this.errors.push(result);
                if (!firstErrorField) firstErrorField = fieldName;
            }
        });
        
        if (firstErrorField) {
            document.getElementById(firstErrorField)?.focus();
        }
        
        return this.errors.length === 0;
    }
    
    validateSingleField(fieldName, showToastNotif = true) {
        let field = document.getElementById(fieldName);
        const rule = this.rules[fieldName];
        
        if (!rule) return { valid: true };
        
        // Special handling for radio buttons (gender)
        // Handling khusus buat radio button gender
        let value;
        if (fieldName === 'gender') {
            // Get checked radio value - ambil value radio yang dipilih
            const checkedRadio = document.querySelector('input[name="gender"]:checked');
            value = checkedRadio ? checkedRadio.value : '';
            // Use first radio for error positioning - pake radio pertama untuk posisi error
            field = document.querySelector('input[name="gender"]');
        } else {
            if (!field) return { valid: true };
            value = field.value.trim();
        }
        
        let result = { valid: true, field: fieldName };
        
        // Required - field wajib diisi
        if (rule.required && !value) {
            result = { valid: false, message: rule.messages.required, field: fieldName };
        }
        // Min length - panjang minimal
        else if (rule.minLength && value.length < rule.minLength) {
            result = { valid: false, message: rule.messages.minLength, field: fieldName };
        }
        // Max length - panjang maksimal
        else if (rule.maxLength && value.length > rule.maxLength) {
            result = { valid: false, message: rule.messages.maxLength, field: fieldName };
        }
        // Custom validator - validasi khusus custom
        else if (rule.validator && value && !rule.validator(value)) {
            result = { valid: false, message: rule.messages.custom, field: fieldName };
        }
        
        // Visual feedback - highlight merah/hijau
        if (!result.valid) {
            this.highlightField(field, 'error');
            this.showFieldError(field, result.message);
            if (showToastNotif) showToast('error', result.message);
        } else {
            this.highlightField(field, 'success');
            this.clearFieldError(field);
        }
        
        return result;
    }
    
    highlightField(field, state) {
        field.classList.remove('border-red-500', 'border-green-500', 'border-gray-300', 'dark:border-gray-600');
        
        if (state === 'error') {
            field.classList.add('border-red-500');
        } else if (state === 'success') {
            field.classList.add('border-green-500');
        } else {
            field.classList.add('border-gray-300', 'dark:border-gray-600');
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-xs text-red-500 mt-1 flex items-center gap-1';
        errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><span>${message}</span>`;
        
        // Smart positioning based on field type
        // Posisi error message otomatis sesuai tipe field
        let targetContainer;
        
        if (field.type === 'radio') {
            // Radio buttons: find parent of the radio container
            // Radio: cari parent dari container radio button
            const radioContainer = field.closest('label').parentElement; // Gets <div class="flex space-x-2">
            targetContainer = radioContainer.parentElement; // Gets outer wrapper
        } else if (field.closest('.input-addon-group')) {
            // Input with addon: go up 1 level
            // Input dengan icon: naik 1 level dari grup
            targetContainer = field.closest('.input-addon-group').parentElement;
        } else {
            // Regular input/textarea: go up 1 level
            // Input biasa: naik 1 level dari parent
            targetContainer = field.parentElement;
        }
        
        if (targetContainer) {
            targetContainer.appendChild(errorDiv);
        }
    }
    
    clearFieldError(field) {
        // Smart positioning for clearing errors
        // Posisi pintar untuk hapus error message
        let targetContainer;
        
        if (field.type === 'radio') {
            const radioContainer = field.closest('label').parentElement;
            targetContainer = radioContainer.parentElement;
        } else if (field.closest('.input-addon-group')) {
            targetContainer = field.closest('.input-addon-group').parentElement;
        } else {
            targetContainer = field.parentElement;
        }
        
        if (!targetContainer) return;
        
        // Remove ALL field-error elements (prevents duplicates)
        // Hapus SEMUA element error (cegah duplikat)
        const existingErrors = targetContainer.querySelectorAll('.field-error');
        existingErrors.forEach(error => error.remove());
    }
    
    clearAllValidation() {
        Object.keys(this.rules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                this.highlightField(field, 'default');
                this.clearFieldError(field);
            }
        });
    }
}

// ==================================
// TOAST NOTIFICATION SYSTEM
// ==================================

const TOAST_TYPES = {
    success: { icon: 'fa-check-circle', bgColor: 'bg-green-500', textColor: 'text-white', duration: 3000 },
    error: { icon: 'fa-exclamation-circle', bgColor: 'bg-red-500', textColor: 'text-white', duration: 4000 },
    warning: { icon: 'fa-exclamation-triangle', bgColor: 'bg-yellow-500', textColor: 'text-gray-900', duration: 3500 },
    info: { icon: 'fa-info-circle', bgColor: 'bg-blue-500', textColor: 'text-white', duration: 3000 }
};

const TOAST_CONFIG = {
    desktop: { containerClass: 'fixed bottom-5 right-5 z-50 flex flex-col gap-2', toastMaxWidth: 'max-w-md' },
    mobile: { containerClass: 'fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full px-4', toastMaxWidth: 'max-w-full' }
};

const MAX_TOASTS = 3; // Maximum toasts visible,

function getToastContainer() {
    let container = document.getElementById('toast-container');
    const isMobile = window.innerWidth < 768;
    const config = isMobile ? TOAST_CONFIG.mobile : TOAST_CONFIG.desktop;
    
    if (container) {
        container.className = config.containerClass;
    } else {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = config.containerClass;
        document.body.appendChild(container);
    }
    return container;
}

function showToast(type, message, options = {}) {
    const config = { ...TOAST_TYPES[type], ...options };
    const container = getToastContainer();
    
    // Enforce max toast limit - batasi maksimal 3 toast
    while (container.children.length >= MAX_TOASTS) {
        container.firstChild?.remove();
    }
    
    const isMobile = window.innerWidth < 768;
    const maxWidthClass = isMobile ? TOAST_CONFIG.mobile.toastMaxWidth : TOAST_CONFIG.desktop.toastMaxWidth;
    
    const toast = document.createElement('div');
    toast.className = `${maxWidthClass} ${config.bgColor} ${config.textColor} px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all duration-300 opacity-0 translate-y-2`;
    toast.innerHTML = `
        <i class="fa-solid ${config.icon} text-xl flex-shrink-0"></i>
        <span class="flex-1 font-medium">${message}</span>
        <button onclick="this.parentElement.remove()" class="hover:opacity-70 transition-opacity">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('opacity-0', 'translate-y-2'));
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, config.duration);
}

// ===================================
// CONSTANTS & CONFIGURATION
// ===================================

const THEME = {
    colors: {
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        primaryLight: '#a78bfa',
        primaryRing: '#c4b5fd',
        
        avatars: {
            testimonial: ['bg-purple-600', 'bg-blue-500', 'bg-pink-500'],
            message: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
        },
        
        gender: {
            female: 'pink-400',
            male: 'blue-400'
        }
    }
};

const TIMINGS = {
    modal: 300,           // Modal animation duration
    refresh: 800,         // Refresh button animation
    testimonials: 5000,   // Testimonial auto-slide
    partners: 4000,       // Partners auto-slide
    toast: 3000          // Toast notification duration
};

const ICONS = {
    gender: {
        female: {
            html: '<i class="fa-solid fa-venus text-pink-400"></i>',
            class: 'fa-solid fa-venus text-pink-400'
        },
        male: {
            html: '<i class="fa-solid fa-mars text-blue-400"></i>',
            class: 'fa-solid fa-mars text-blue-400'
        }
    },
    
    quote: {
        left: '<i class="fa-solid fa-quote-left absolute top-2 left-2 text-gray-200 dark:text-gray-600 text-xl"></i>',
        right: '<i class="fa-solid fa-quote-right absolute bottom-2 right-2 text-gray-200 dark:text-gray-600 text-xl"></i>'
    },
    
    star: {
        filled: '<i class="fa-solid fa-star"></i>',
        empty: '<i class="fa-regular fa-star text-gray-300"></i>'
    },
    
    ui: {
        calendar: 'fa-solid fa-calendar'
    }
};

const CONSTANTS = {
    STORAGE_KEY: 'messages',
    CHAR_LIMIT: 250,
    
    MONTHS_ID: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
};

const UTILS = {
    getInitials: (name, maxChars = 2) => {
        return name.split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, maxChars)
            .toUpperCase();
    },
    
    getAvatarColor: (name, type = 'message') => {
        const colors = THEME.colors.avatars[type];
        return colors[name.length % colors.length];
    },
    
    getGenderIcon: (gender) => {
        return gender === 'Perempuan' 
            ? ICONS.gender.female
            : ICONS.gender.male;
    }
};

// ==================================
// CHARACTER COUNTER CONFIGURATION
// ==================================

const CHAR_LIMITS = {
    safe: 200,      // 0-200: Green ✅
    warning: 240,   // 201-240: Yellow ⚠️
    danger: 250,    // 241-250: Red 🔴
    max: 250
};

/**
 * Update character counter with color coding
 * @param {number} length - Current character count
 */
function updateCharCounter(length) {
    const counter = document.getElementById('char-count');
    if (!counter) return;
    
    if (length <= CHAR_LIMITS.safe) {
        counter.className = 'text-xs font-semibold text-green-500';
    } else if (length <= CHAR_LIMITS.warning) {
        counter.className = 'text-xs font-semibold text-yellow-500';
    } else if (length <= CHAR_LIMITS.max) {
        counter.className = 'text-xs font-semibold text-red-500';
    } else {
        counter.className = 'text-xs font-semibold text-red-600 animate-pulse';
    }
    
    counter.textContent = `${length}/${CHAR_LIMITS.max}`;
}

// ==================================
// CONTACT FORM VALIDATION RULES
// ==================================

const CONTACT_FORM_RULES = {
    name: {
        required: true,
        minLength: 3,
        messages: {
            required: 'Silakan isi nama lengkap Anda',
            minLength: 'Nama minimal 3 karakter'
        }
    },
    dob: {
        required: true,
        messages: {
            required: 'Silakan pilih tanggal lahir Anda'
        }
    },
    gender: {
        required: true,
        messages: {
            required: 'Silakan pilih jenis kelamin'
        }
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 250,
        messages: {
            required: 'Silakan tulis pesan Anda',
            minLength: 'Pesan minimal 10 karakter',
            maxLength: 'Pesan maksimal 250 karakter'
        }
    }
};

// ==================================
// INITIALIZATION
// Init semua features pas DOM ready
// ==================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Features
    initTheme();              // Dark/Light mode toggle - ganti tema
    initScrollAnimations();   // Scroll animations - animasi pas scroll
    initActiveNavLinks();     // Active navbar link detection - auto-update menu aktif
    initBackToTop();          // Back to top button - tombol kembali ke atas
    
    // Initialize Data & UI
    initDummyData();          // Generate dummy messages - buat data dummy
    renderMessages();         // Render messages to DOM - tampilkan pesan
    
    // Initialize Form
    setupContactForm();       // Form validation & message persistence - setup form
    
    // Initialize Sliders
    initTestimonials();       // Testimonial carousel - slider testimoni
    initPartnersSlider();     // Partners logo slider - slider partner
});

// --- Theme Management ---
function initTheme() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Change the icons inside the button based on previous settings
    // Ganti icon button sesuai setting sebelumnya (sun/moon)
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
        document.documentElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', function() {
        // Toggle icons - toggle icon sun/moon
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // If is set via local storage - kalo udah ada di localStorage
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            // if NOT set via local storage previously - kalo belum ada di localStorage
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

// ==================================
// ACTIVE NAVBAR LINK DETECTION
// Auto-update navbar active link berdasarkan section yang terlihat
// ==================================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-active');
    
    // Intersection Observer options - trigger saat 50% section visible
    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Center detection
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Remove active from all links
                navLinks.forEach(link => {
                    link.classList.remove('nav-link-active');
                    link.classList.add('nav-link');
                    link.removeAttribute('aria-current');
                });
                
                // Add active to current section link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('nav-link');
                    activeLink.classList.add('nav-link-active');
                    activeLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }, options);
    
    // Observe all sections
    sections.forEach(section => observer.observe(section));
}

// ==================================
// BACK TO TOP BUTTON
// Auto show/hide button on scroll + smooth scroll to top
// ==================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });
    
    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}



// --- Dummy Data & Init ---

// Helper: Create timestamp for X days ago
// Bikin timestamp buat dummy data, misalnya "4 hari yang lalu"
const daysAgo = (days) => Date.now() - (days * 24 * 60 * 60 * 1000);

function initDummyData() {
    // Initialize dummy data only if localStorage is empty
    // Cek dulu, kalo kosong baru diisi. Ini biar pesan user yang udah submit ga ke-overwrite
    if (!localStorage.getItem(CONSTANTS.STORAGE_KEY)) {
        const dummyMessages = [
            { id: 1, name: "Dewi Anggraini", dob: "1994-04-08", gender: "Perempuan", message: "Mau tanya untuk jasa dokumentasi video event. Portfolio video production ada?", timestamp: daysAgo(4) },
            { id: 2, name: "Rudi Hartono", dob: "1989-11-20", gender: "Laki-laki", message: "Perlu vendor untuk annual gathering perusahaan. Ada paket all-in untuk 1000 peserta?", timestamp: daysAgo(6) },
            { id: 3, name: "Lina Marlina", dob: "1998-02-14", gender: "Perempuan", message: "Apakah bisa request custom stage design untuk konser musik outdoor?", timestamp: daysAgo(14) }
        ];
        localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(dummyMessages));
    }
    // Data already exists, don't overwrite
    // Kalo udah ada data (misalnya user submit pesan), jangan ditimpa biar ga ilang
}

// --- Testimonials Slider Logic ---
function initTestimonials() {
    const testimonials = [
        {
            quote: "Profesionalisme tim Dua Arah Media luar biasa! Dari konsep awal hingga eksekusi, semuanya berjalan mulus. Video dokumentasi event kami mendapat pujian dari seluruh stakeholder. Worth every penny!",
            name: "Diana Kusuma",
            role: "Head of Corporate Communication, BRI",
            rating: 5
        },
        {
            quote: "Setup multimedia mereka bikin acara peluncuran produk kami terasa seperti Apple Keynote! Lighting, sound system, dan LED wall semua top-notch. Audience sampai standing ovation!",
            name: "Fikri Ramadhan",
            role: "Brand Manager, Tokopedia",
            rating: 5
        },
        {
            quote: "Saya sudah kerja sama dengan 5+ vendor EO, tapi Dua Arah Media yang paling responsif dan detail-oriented. Mereka dengar kebutuhan klien dan kasih solusi kreatif yang unexpected. Highly recommended!",
            name: "Melissa Tan",
            role: "Wedding Planner & Coordinator",
            rating: 5
        }
    ];

    let currentIndex = 0;
    const container = document.getElementById('testimonial-container');
    const quoteEl = document.getElementById('testimonial-quote');
    const nameEl = document.getElementById('testimonial-name');
    const roleEl = document.getElementById('testimonial-role');
    const avatarEl = document.getElementById('testimonial-avatar');
    const starsEl = document.getElementById('testimonial-stars');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    // Consistent colors for specific indices to avoid flickering random colors
    // Warna konsisten per index biar ga kedip-kedip random
    const colors = ['bg-purple-600', 'bg-blue-600', 'bg-pink-600', 'bg-indigo-600', 'bg-violet-600'];
    const colorIndex = currentIndex % colors.length;
    
    const showTestimonial = (index) => {
        // Fade Out - fade keluar dulu
        container.classList.add('opacity-0');
        
        setTimeout(() => {
            // Update Data - update data testimonial
            const data = testimonials[index];
            quoteEl.textContent = `"${data.quote}"`;
            nameEl.textContent = data.name;
            roleEl.textContent = data.role;
            
            // Initials & Color
            const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            // Use fixed color based on index for stability, or hash
            const colorClass = colors[index % colors.length];
            
            avatarEl.className = `w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3 shadow-md ${colorClass}`;
            avatarEl.textContent = initials;

            // Stars
            starsEl.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < data.rating) {
                    starsEl.innerHTML += ICONS.star.filled;
                } else {
                    starsEl.innerHTML += '<i class="fa-regular fa-star text-gray-300"></i>';
                }
            }
            
            currentIndex = index;

            // Fade In
            container.classList.remove('opacity-0');
        }, 300); // Faster transition
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    };

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Initial render
    showTestimonial(0);

    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
}

// --- Partners Slider Logic ---
function initPartnersSlider() {
    const partners = [
        { icon: 'fa-google', name: 'Google', color: '#4285F4' },
        { icon: 'fa-microsoft', name: 'Microsoft', color: '#00A4EF' },
        { icon: 'fa-spotify', name: 'Spotify', color: '#1DB954' },
        { icon: 'fa-youtube', name: 'YouTube', color: '#FF0000' },
        { icon: 'fa-meta', name: 'Meta', color: '#0668E1' },
        { icon: 'fa-twitter', name: 'Twitter', color: '#1DA1F2' },
        { icon: 'fa-linkedin', name: 'LinkedIn', color: '#0A66C2' },
        { icon: 'fa-amazon', name: 'Amazon', color: '#FF9900' }
    ];

    let currentSet = 0;
    const container = document.getElementById('partner-slider');
    const partnersPerPage = 4;

    const renderPartners = (startIndex) => {
        container.classList.add('opacity-0');
        
        setTimeout(() => {
            container.innerHTML = '';
            
            for (let i = 0; i < partnersPerPage; i++) {
                const partnerIndex = (startIndex + i) % partners.length;
                const partner = partners[partnerIndex];
                
                const card = document.createElement('div');
                card.className = 'flex flex-col items-center justify-center p-6 bg-slate-800/50 dark:bg-slate-900/50 rounded-xl hover:bg-slate-800 transition-all group cursor-pointer border border-slate-700/50';
                card.innerHTML = `
                    <i class="fa-brands ${partner.icon} text-5xl text-gray-400 transition-colors mb-3 group-hover-icon" style="--brand-color: ${partner.color}"></i>
                    <span class="text-gray-300 group-hover:text-white font-medium transition-colors">${partner.name}</span>
                `;
                
                // Add hover effect for brand color
                card.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.group-hover-icon');
                    icon.style.color = partner.color;
                });
                
                card.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.group-hover-icon');
                    icon.style.color = '';
                });
                
                container.appendChild(card);
            }
            
            container.classList.remove('opacity-0');
        }, 300);
    };

    const nextSet = () => {
        currentSet = (currentSet + partnersPerPage) % partners.length;
        renderPartners(currentSet);
    };

    // Initial render
    renderPartners(0);

    // Auto slide every 4 seconds
    setInterval(nextSet, TIMINGS.partners);
}

// --- Branch Modal Logic (Reusable) ---
const branchData = {
    jakarta: {
        title: "Jakarta Office",
        subtitle: "Kantor Pusat",
        image: "assets/images/jakarta-office.webp",
        address: "Jl. Dago No. 85, Bandung 40135",
        phone: "(022) 8785-4321",
        email: "jakarta@duaarahmedia.com",
        description: "Cabang Jakarta berlokasi di jantung kota metropolitan, dilengkapi dengan studio production state-of-the-art dan ruang meeting modern, menjadi pusat operasional utama yang menghubungkan seluruh wilayahLayanan."
    },
    bandung: {
        title: "Bandung Office",
        subtitle: "Cabang Regional Jawa Barat",
        image: "assets/images/bandung-office.webp",
        address: "Jl. Dago No. 85, Bandung 40135",
        phone: "(022) 8785-4321",
        email: "bandung@duaarahmedia.com",
        description: "Cabang Bandung melayani wilayah Jawa Barat dengan fokus pada creative event dan multimedia production. Office kami yang modern dilengkapi fasilitas editing suite dan creative workspace yang mendukung kolaborasi tim yang menghasilkan karya terbaik."
    },
    surabaya: {
        title: "Surabaya Office",
        subtitle: "Cabang Regional Jawa Timur",
        image: "assets/images/surabaya-office.webp",
        address: "Jl. Pemuda No. 120, Surabaya 60271",
        phone: "(031) 5432-8765",
        email: "surabaya@duaarahmedia.com",
        description: "Cabang Surabaya sebagai hub regional Jawa Timur, menangani event-event berskala besar dengan dukungan teknologi multimedia terkini. Tim profesional kami siap membantu mewujudkan event impian Anda dengan hasil yang memukau."
    }
};

function openBranchModal(branchId) {
    const branch = branchData[branchId];
    if (!branch) return;
    
    // Populate modal content
    document.getElementById('modal-title').textContent = branch.title;
    document.getElementById('modal-subtitle').textContent = branch.subtitle;
    document.getElementById('modal-image').src = branch.image;
    document.getElementById('modal-address').textContent = branch.address;
    document.getElementById('modal-phone').textContent = branch.phone;
    document.getElementById('modal-email').textContent = branch.email;
    document.getElementById('modal-description').textContent = branch.description;
    
    // Show modal
    const modal = document.getElementById('branch-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeBranchModal() {
    const modal = document.getElementById('branch-modal');
    const content = modal.querySelector('.scale-in');
    
    // Trigger out animation
    if (content) {
        content.classList.remove('scale-in');
        content.classList.add('scale-out');
    }
    
    // Wait for animation to complete, then hide
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        
        // Reset animation class for next open
        if (content) {
            content.classList.remove('scale-out');
            content.classList.add('scale-in');
        }
    }, TIMINGS.modal); // Match animation duration
}

// Init modal close button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('modal-close');
    const modal = document.getElementById('branch-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBranchModal);
    }
    
    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBranchModal ();
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBranchModal();
        }
    });
});

// --- Form & Messages ---
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    
    // Initialize Form Validator
    const contactValidator = new FormValidator('contact-form', CONTACT_FORM_RULES);
    
    // Character Counter with Color Coding
    messageInput.addEventListener('input', () => {
        const currentLength = messageInput.value.length;
        updateCharCounter(currentLength);
        
        // Revalidate message field to clear errors when valid
        if (currentLength <= CHAR_LIMITS.max) {
            contactValidator.validateSingleField('message', false);
        }
        
        // Show toast if over limit
        if (currentLength > CHAR_LIMITS.max) {
            showToast('error', 'Pesan terlalu panjang! Maksimal 250 karakter.');
        }
    });

    // Form Submission (ONLY validation point)
    let isSubmitting = false; // Debounce flag
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Prevent spam submissions - CHECK FIRST!
        if (isSubmitting) {
            return; // Block everything including validation
        }
        
        // Set flag immediately
        isSubmitting = true;
        setTimeout(() => isSubmitting = false, 1000);
        
        // Validate all fields
        if (!contactValidator.validate()) {
            // Shake form
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            
            // Show first error as toast
            showToast('error', contactValidator.errors[0].message);
            return;
        }
        
        // Check character limit (prevent submit if over)
        const messageLength = messageInput.value.trim().length;
        if (messageLength > CHAR_LIMITS.max) {
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            showToast('error', 'Tidak bisa mengirim! Pesan terlalu panjang.');
            return;
        }
        
        // Get form data
        const name = nameInput.value.trim();
        const dob = dobInput.value.trim();
        const message = messageInput.value.trim();
        const genderElement = document.querySelector('input[name="gender"]:checked');
        
        if (!genderElement) {
            showToast('error', 'Silakan pilih jenis kelamin');
            return;
        }
        
        const gender = genderElement.value;
        
        // Show Confirmation Modal
        showConfirmModal({ name, dob, gender, message });
    });
}

function showConfirmModal(data) {
    const modalEl = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('confirm-submit-btn');
    const cancelBtn = document.getElementById('confirm-cancel-btn');
    
    // Format DOB - use Flowbite datepicker text directly (dd/mm/yyyy)
    const formattedDob = data.dob || 'Tidak diisi';
    
    // Get gender icon HTML
    const genderIconHtml = data.gender === 'Laki-laki' 
        ? '<i class="fa-solid fa-mars text-blue-400 mr-2"></i>' 
        : '<i class="fa-solid fa-venus text-pink-400 mr-2"></i>';
    
    // Populate modal with data
    document.getElementById('confirm-name').textContent = data.name;
    document.getElementById('confirm-dob').textContent = formattedDob;
    document.getElementById('confirm-gender').innerHTML = `${genderIconHtml}${data.gender}`;
    
    // Message with word-wrap and whitespace handling
    const messageEl = document.getElementById('confirm-message');
    messageEl.textContent = data.message;
    messageEl.className = 'text-gray-300 leading-relaxed break-words whitespace-pre-wrap';
    
    // Show modal
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Confirm button - Send message
    confirmBtn.onclick = () => {
        saveMessage(data);
        closeConfirmModal();
        
        // Clear form
        document.getElementById('contact-form').reset();
        document.getElementById('char-count').textContent = "0/250";
        showToast('success', 'Pesan berhasil dikirim!');
    };
    
    // Cancel button
    cancelBtn.onclick = () => {
        closeConfirmModal();
    };
    
    // Close on backdrop click
    modalEl.onclick = (e) => {
        if (e.target === modalEl) {
            closeConfirmModal();
        }
    };
}

function closeConfirmModal() {
    const modalEl = document.getElementById('confirm-modal');
    const content = modalEl.querySelector('.scale-in');
    
    // Trigger out animation
    if (content) {
        content.classList.remove('scale-in');
        content.classList.add('scale-out');
    }
    
    // Wait for animation, then hide
    setTimeout(() => {
        modalEl.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset animation class for next open
        if (content) {
            content.classList.remove('scale-out');
            content.classList.add('scale-in');
        }
    }, TIMINGS.modal);
}

function saveMessage(data) {
    const messages = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEY) || '[]');
    const newMessage = {
        id: Date.now(),
        name: data.name,
        dob: data.dob,
        gender: data.gender,
        message: data.message,
        timestamp: Date.now()
    };
    messages.unshift(newMessage); // Add to top
    localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(messages));
    renderMessages();
}

function renderMessages() {
    const listContainer = document.getElementById('message-list');
    const messages = JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEY) || '[]');
    
    listContainer.innerHTML = '';
    
    if (messages.length === 0) {
        listContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 italic py-8">Belum ada pesan.</p>';
        return;
    }
    
    messages.forEach((msg, index) => {
        try {
            const timeAgo = getTimeAgo(msg.timestamp);
            const initials = sanitize(msg.name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const color = UTILS.getAvatarColor(msg.name);
            const formattedDate = formatDate(msg.dob);
            const genderIcon = UTILS.getGenderIcon(msg.gender).html;

            const html = `
                <div class="message-card fade-in-up relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-1 h-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center space-x-3">
                            <div class="${color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                ${initials}
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 dark:text-white text-base">${sanitize(msg.name)}</h4>
                                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5 space-x-3">
                                    <span><i class="fa-solid fa-calendar mr-1"></i> ${formattedDate}</span>
                                    <span>${genderIcon} ${msg.gender}</span>
                                </div>
                            </div>
                        </div>
                        <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">${timeAgo}</span>
                    </div>
                    <div class="relative bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        ${ICONS.quote.left}
                        <p class="text-sm text-gray-700 dark:text-gray-300 italic relative z-10 pl-6 pr-6">
                            ${sanitize(msg.message)}
                        </p>
                        ${ICONS.quote.right}
                    </div>
                </div>
            `;
            listContainer.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error(`ERROR rendering message ${index}:`, error);
        }
    });
}

// Format date to "8 April 1994" style
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const months = CONSTANTS.MONTHS_ID;
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Get messages from localStorage
function getMessages() {
    return JSON.parse(localStorage.getItem(CONSTANTS.STORAGE_KEY) || '[]');
}

// Refresh with spinner animation
function refreshMessages() {
    const btn = document.getElementById('refresh-icon');
    const previousCount = getMessages().length;
    
    // Show loading toast
    showToast('info', 'Memuat pesan terbaru...');
    
    // Rotate icon
    btn.classList.add('fa-spin');
    
    setTimeout(() => {
        // Stop rotation
        btn.classList.remove('fa-spin');
        
        // Re-render messages (simulates refresh)
        renderMessages();
        
        // Calculate messages
        const currentCount = getMessages().length;
        const newMessages = currentCount - previousCount;
        
        // Show result toast
        if (newMessages > 0) {
            showToast('success', `${newMessages} pesan baru dimuat`);
        } else if (newMessages < 0) {
            showToast('info', 'Pesan diperbarui');
        } else {
            showToast('info', 'Pesan sudah terbaru');
        }
    }, TIMINGS.refresh);
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    
    return "Baru saja";
}

function sanitize(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// --- Utilities ---
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const colorClass = type === 'success' ? 'bg-green-500' : type === 'info' ? 'bg-blue-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fa-check' : type === 'info' ? 'fa-info-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle';
    
    const toast = document.createElement('div');
    toast.className = `${colorClass} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-y-10 opacity-0 min-w-[300px]`;
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span class="font-medium">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
