document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('heroScreen');
    const cta = document.getElementById('ctaExplore');
    const stage = document.getElementById('stage');
    const mainContent = document.getElementById('mainContent');

    const pages = Array.from(document.querySelectorAll('.page-item'));
    let currentPage = 0;

    function showPage(i) {
        pages.forEach((p, idx) => p.classList.toggle('active', idx === i));
        currentPage = i;
    }

    cta.addEventListener('click', () => {
        hero.classList.add('hidden');
        stage.classList.add('visible');
        mainContent.style.opacity = '1';
        showPage(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const nextBtn = document.getElementById('nextPage');
    const prevBtn = document.getElementById('prevPage');

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) showPage(currentPage + 1);
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) showPage(currentPage - 1);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' && currentPage < pages.length - 1) showPage(currentPage + 1);
        if (e.key === 'ArrowLeft' && currentPage > 0) showPage(currentPage - 1);
    });

    const layers = Array.from(document.querySelectorAll('.layer'));
    const speeds = [0.06, 0.14, 0.28, 0.48, 0.6, 0.78];
    let latestScroll = 0, ticking = false;

    window.addEventListener('scroll', () => {
        latestScroll = window.scrollY;
        requestTick();
    }, { passive: true });

    function requestTick() {
        if (!ticking) requestAnimationFrame(updateParallax);
        ticking = true;
    }

    function updateParallax() {
        const st = latestScroll;
        layers.forEach((layer, i) => {
            layer.style.transform = `translate3d(0, ${-st * speeds[i]}px, 0)`;
        });
        ticking = false;
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateObjects() {
        const t = performance.now() / 1000;
        
        interactiveEls.forEach((el, idx) => {
            const parentPage = el.closest('.page-item');
            if (!parentPage || !parentPage.classList.contains('active')) return;

            const s = state.get(el);
            const fx = Math.sin(t * s.floatSpeed + idx) * s.floatOffsetX;
            const fy = Math.cos(t * s.floatSpeed * 0.8 + idx) * s.floatOffsetY;
            
            const nx = (mouseX / window.innerWidth) - 0.5;
            const ny = (mouseY / window.innerHeight) - 0.5;
            
            const influence = 10 + (parseFloat(getComputedStyle(el).width) || 100) * 0.03;
            const mx = nx * influence * (0.6 + (idx % 3) * 0.3);
            const my = ny * influence * (0.6 + (idx % 2) * 0.25);
            
            const tx = (fx + mx).toFixed(2) + 'px';
            const ty = (fy + my).toFixed(2) + 'px';
            
            el.style.setProperty('--tx', tx);
            el.style.setProperty('--ty', ty);
        });
        requestAnimationFrame(animateObjects);
    }
    animateObjects();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.interactive-object')) {
            interactiveEls.forEach(el => el.classList.remove('active'));
        }
    });

    window.addEventListener('resize', () => {
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    });
});