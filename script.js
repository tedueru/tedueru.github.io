document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Nav Toggle --- */
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            const ico = toggle.querySelector('i');
            ico.setAttribute('data-lucide', links.classList.contains('open') ? 'x' : 'menu');
            lucide.createIcons();
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    /* --- Navbar scroll --- */
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    /* --- Scroll-reveal --- */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.classList.contains('stagger')) {
                    Array.from(e.target.children).forEach((c, i) => {
                        c.style.transitionDelay = `${i * .12}s`;
                    });
                }
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .12 });

    document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

    /* --- Active nav link --- */
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === current || (current === 'index.html' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    /* --- Contact form mailto fallback --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const status = document.getElementById('contact-form-status');
        contactForm.addEventListener('submit', event => {
            event.preventDefault();

            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            const subject = `TEDU ERU Website Inquiry from ${name || 'Website Visitor'}`;
            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                '',
                message
            ].join('\n');

            if (status) {
                status.textContent = 'Opening your email app with a pre-filled draft.';
            }

            window.location.href = `mailto:eru@tedu.edu.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    /* --- Year --- */
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
});
