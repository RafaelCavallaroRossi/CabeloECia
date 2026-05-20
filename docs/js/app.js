document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('#carousel img');
    if (slides.length) {
        let sIndex = 0;
        slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
        setInterval(() => {
            slides[sIndex].style.opacity = 0;
            sIndex = (sIndex + 1) % slides.length;
            requestAnimationFrame(() => slides[sIndex].style.opacity = 1);
        }, 4000);
    }
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    const onMenuKeydown = (e) => { if (e.key === 'Escape') closeMenuFunc(); };
    function openMenu() {
        mobileMenu?.classList.remove('translate-x-full');
        mobileMenu?.classList.add('is-open');
        overlay?.classList.remove('hidden');
        menuBtn?.setAttribute('aria-expanded', 'true');
        mobileMenu?.setAttribute('aria-hidden', 'false');
        const firstLink = mobileMenu?.querySelector('nav a');
        firstLink?.focus();
        document.addEventListener('keydown', onMenuKeydown);
    }
    function closeMenuFunc() {
        mobileMenu?.classList.add('translate-x-full');
        mobileMenu?.classList.remove('is-open');
        overlay?.classList.add('hidden');
        menuBtn?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-hidden', 'true');
        menuBtn?.focus();
        document.removeEventListener('keydown', onMenuKeydown);
    }
    menuBtn?.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenuFunc(); else openMenu();
    });
    closeMenu?.addEventListener('click', closeMenuFunc);
    overlay?.addEventListener('click', closeMenuFunc);
    const serviceToggles = document.querySelectorAll('[data-service-toggle]');
    serviceToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-target');
            const contentElement = document.getElementById(targetId);
            const card = toggle.closest('.service-card');
            const isOpen = card.classList.contains('open');
            
            document.querySelectorAll('.service-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('open');
                    const otherToggle = c.querySelector('[data-service-toggle]');
                    if (otherToggle) {
                        otherToggle.classList.remove('open');
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                    const otherContent = c.querySelector('.service-card__content');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                        otherContent.setAttribute('aria-hidden', 'true');
                    }
                }
            });
            
            if (!isOpen) {
                card.classList.add('open');
                contentElement.style.maxHeight = contentElement.scrollHeight + "px";
                contentElement.setAttribute('aria-hidden', 'false');
                toggle.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                card.classList.remove('open');
                contentElement.style.maxHeight = null;
                contentElement.setAttribute('aria-hidden', 'true');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentIndex = 0;
    let prevActiveElement = null;
    let removeLightboxTrap = null;
    function trapFocus(container) {
        const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return () => {};
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const handler = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }
    if (galleryImages.length) {
        const showImage = () => { if (lightboxImg) lightboxImg.src = galleryImages[currentIndex].src; };
        const openModal = () => {
            if (!lightbox) return;
            prevActiveElement = document.activeElement;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            document.body.style.overflow = 'hidden';
            lightbox.setAttribute('aria-hidden', 'false');
            removeLightboxTrap = trapFocus(lightbox);
            closeLightbox?.focus();
        };
        const closeModal = () => {
            if (!lightbox) return;
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            document.body.style.overflow = 'auto';
            lightbox.setAttribute('aria-hidden', 'true');
            if (removeLightboxTrap) removeLightboxTrap();
            if (prevActiveElement?.focus) prevActiveElement.focus();
        };
        const nextImage = () => { currentIndex = (currentIndex + 1) % galleryImages.length; showImage(); };
        const prevImage = () => { currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; showImage(); };
        galleryImages.forEach((img, idx) => img.addEventListener('click', () => { currentIndex = idx; showImage(); openModal(); }));
        nextBtn?.addEventListener('click', nextImage);
        prevBtn?.addEventListener('click', prevImage);
        closeLightbox?.addEventListener('click', closeModal);
        lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox || lightbox.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeModal();
        });
    }
    const revealElements = document.querySelectorAll('.fade-up');
    if (revealElements.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => observer.observe(el));
    }

    const formModal = document.getElementById('formModal');
    const closeFormModalBtn = document.getElementById('closeFormModal');
    const formAgendamento = document.getElementById('formAgendamento');
    let removeFormTrap = null;
    let prevActiveElementModal = null;

    const defaultProfessionalByService = {
        'Corte': 'Glaucia Cavallaro',
        'Coloração': 'Glaucia Cavallaro',
        'Hidratação': 'Marta',
        'Depilação com Cera': 'Cristiane Domingues Cavallaro',
        'Manicure': 'Cristiane Domingues Cavallaro',
        'Pedicure': 'Cristiane Domingues Cavallaro'
    };

    function openFormModal(servico) {
        if (!formModal) return;
        prevActiveElementModal = document.activeElement;
        formModal.classList.remove('hidden');
        formModal.classList.add('flex', 'items-center', 'justify-center');
        document.body.style.overflow = 'hidden';
        formModal.setAttribute('aria-hidden', 'false');
        removeFormTrap = trapFocus(formModal);
        const servicoInput = document.getElementById('servicoSelecionado');
        const mensagemInput = document.getElementById('mensagem');
        if (servicoInput) servicoInput.value = servico || '';
        if (mensagemInput) mensagemInput.value = `Olá! Gostaria de agendar um horário para: ${servico || ''}`;
        const nomeInput = document.getElementById('nome');
        const profissionalSelect = document.getElementById('profissional');
        const defaultProf = defaultProfessionalByService[servico] || 'Qualquer profissional';
        if (profissionalSelect) {
            const opt = Array.from(profissionalSelect.options).find(o => o.value === defaultProf || o.text === defaultProf);
            if (opt) profissionalSelect.value = opt.value; else profissionalSelect.selectedIndex = 0;
        }
        nomeInput?.focus();
    }

    function closeFormModal() {
        if (!formModal) return;
        formModal.classList.add('hidden');
        formModal.classList.remove('flex', 'items-center', 'justify-center');
        document.body.style.overflow = 'auto';
        formModal.setAttribute('aria-hidden', 'true');
        if (removeFormTrap) removeFormTrap();
        prevActiveElementModal?.focus();
    }

    window.selecionarServico = (servico) => { openFormModal(servico); };

    closeFormModalBtn?.addEventListener('click', closeFormModal);
    formModal?.addEventListener('click', (e) => { if (e.target === formModal) closeFormModal(); });
    document.addEventListener('keydown', (e) => { if (!formModal || formModal.classList.contains('hidden')) return; if (e.key === 'Escape') closeFormModal(); });

    formAgendamento?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const profissionalSelect = document.getElementById('profissional');
        const profissional = profissionalSelect?.value || '';
        const servico = document.getElementById('servicoSelecionado').value;
        const erro = document.getElementById('erro');
        erro.classList.add('hidden');
        if (!nome || !profissional) {
            erro.textContent = 'Preencha seu nome.';
            erro.classList.remove('hidden');
            return;
        } else {
            if (!nome.match(/^[a-zA-Z\s]+$/)) {
            erro.textContent = 'Nome deve conter apenas letras e espaços.';
            erro.classList.remove('hidden');
            return;
        } else{
            if (!nome.length || nome.length > 50 || nome.length < 2) {
            erro.textContent = 'Nome deve ter entre 2 e 50 caracteres.';
            erro.classList.remove('hidden');
            return;
                }
            }
        }

        const telefoneData = profissionalSelect?.selectedOptions?.[0]?.dataset?.phone || '';
        const telefoneLimpo = telefoneData.replace(/\D/g, '');
        if (telefoneLimpo.length < 10) {
            erro.textContent = 'Número do profissional não configurado.';
            erro.classList.remove('hidden');
            return;
        }
        const mensagem = encodeURIComponent(
            `Nome: ${nome}\nServiço: ${servico}\nMensagem: ${document.getElementById('mensagem').value}`
        );
        let waNumber = telefoneLimpo;
        if (!waNumber.startsWith('55')) waNumber = '55' + waNumber;
        const waUrl = `https://wa.me/${waNumber}?text=${mensagem}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        closeFormModal();
        formAgendamento.reset();
    });

    (function() {
        const tabela = document.getElementById('horarioTabela');
        if (!tabela) return;
        const normalize = (s = '') => s.normalize ? s.normalize('NFD').replace(/[nul-\u036f]/g, '').replace(/\s+/g,' ').trim().toLowerCase() : s.toLowerCase();
        const removeDiacritics = (s = '') => s.normalize ? s.normalize('NFD').replace(/[nul-\u036f]/g, '') : s;
        const normDay = (s = '') => removeDiacritics(s).toLowerCase().replace(/[^a-z\-\s]/g,'').split(/\s|-/)[0];
        const dayMap = { domingo:0, segunda:1, terca:2, quarta:3, quinta:4, sexta:5, sabado:6 };
        function parseTimeToMinutes(str) {
            if (!str) return null;
            const m = str.match(/(\d{1,2}):(\d{2})/);
            if (!m) return null;
            const hh = parseInt(m[1], 10);
            const mm = parseInt(m[2], 10);
            return hh * 60 + mm;
        }
        function parseSchedule() {
            const schedule = new Array(7).fill(null);
            const rows = tabela.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (!tds || tds.length < 2) return;
                const dayText = cleanDay(tds[0].textContent || '');
                const dayIndex = dayMap[dayText];
                if (typeof dayIndex === 'undefined') return;
                const timesText = (tds[1].textContent || '').trim();
                if (/fech/i.test(timesText)) { schedule[dayIndex] = null; return; }
                const normalized = timesText.replace(/[–—−]/g, '-');
                const parts = normalized.split('-').map(s => s.trim());
                const open = parseTimeToMinutes(parts[0]);
                const close = parseTimeToMinutes(parts[1]);
                if (open === null || close === null) { schedule[dayIndex] = null; return; }
                schedule[dayIndex] = { open, close, openStr: parts[0], closeStr: parts[1] };
            });
            return schedule;
        }
        function cleanDay(s = '') {
            const base = (s && s.normalize) ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : (s || '');
            return base.toLowerCase().replace(/[^a-z\s-]/g, '').split(/\s|-/)[0];
        }
        function clearRowHighlights() {
            const rows = tabela.querySelectorAll('tbody tr');
            rows.forEach(r => {
                r.classList.remove('bg-green-50','bg-yellow-50','bg-red-50');
                const first = r.querySelector('td:nth-child(1)');
                const second = r.querySelector('td:nth-child(2)');
                if (first) first.classList.remove('text-green-600','text-yellow-500','text-red-600','font-semibold');
                if (second) second.classList.remove('text-green-600','text-yellow-500','text-red-600','font-semibold');
            });
        }
        function updateStatus() {
            const schedule = parseSchedule();
            let day;
            let minutes;
            try {
                const timeZone = 'America/Sao_Paulo';
                const dtf = new Intl.DateTimeFormat('pt-BR', { timeZone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false });
                const parts = dtf.formatToParts(new Date());
                let weekdayPart = '', hourPart = '', minutePart = '';
                parts.forEach(p => {
                    if (p.type === 'weekday') weekdayPart = p.value;
                    if (p.type === 'hour') hourPart = p.value;
                    if (p.type === 'minute') minutePart = p.value;
                });
                const tzDay = (typeof dayMap[cleanDay(weekdayPart)] !== 'undefined') ? dayMap[cleanDay(weekdayPart)] : null;
                if (tzDay === null || hourPart === '' || minutePart === '') throw new Error('timezone parts missing');
                day = tzDay;
                minutes = (parseInt(hourPart, 10) || 0) * 60 + (parseInt(minutePart, 10) || 0);
            } catch (err) {
                const nowLocal = new Date();
                day = nowLocal.getDay();
                minutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();
            }
            const today = schedule[day];
            let state = 'closed';
            let text = 'Fechado';
            if (today) {
                const open = today.open;
                const close = today.close;
                if (minutes >= open && minutes < close) {
                    const minsToClose = close - minutes;
                    if (minsToClose <= 10) { state = 'pre'; text = `Fechando em ${minsToClose} min`; }
                    else { state = 'open'; text = `Aberto agora — fecha às ${today.closeStr}`; }
                } else if (minutes < open && (open - minutes) <= 10) {
                    state = 'pre';
                    text = `Abrindo em ${open - minutes} min`;
                } else {
                    state = 'closed';
                    text = `Fechado — abre às ${today.openStr}`;
                }
            } else {
                state = 'closed';
                text = 'Fechado';
            }
            clearRowHighlights();
            const rows = tabela.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (!tds || tds.length < 2) return;
                const dayText = cleanDay(tds[0].textContent || '');
                const idx = dayMap[dayText];
                if (idx === day) {
                    const first = row.querySelector('td:nth-child(1)');
                    const second = row.querySelector('td:nth-child(2)');
                    if (state === 'open') {
                        row.classList.add('bg-green-50');
                        if (first) first.classList.add('text-green-600','font-semibold');
                        if (second) second.classList.add('text-green-600','font-semibold');
                    } else if (state === 'pre') {
                        row.classList.add('bg-yellow-50');
                        if (first) first.classList.add('text-yellow-500','font-semibold');
                        if (second) second.classList.add('text-yellow-500','font-semibold');
                    } else {
                        row.classList.add('bg-red-50');
                        if (first) first.classList.add('text-red-600','font-semibold');
                        if (second) second.classList.add('text-red-600','font-semibold');
                    }
                }
            });
        }
        updateStatus();
        setInterval(updateStatus, 30 * 1000);
    })();
});
