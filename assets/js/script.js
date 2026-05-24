// ==========================================
// INTERATIVIDADE DA LANDING PAGE COMPARE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Hamburguer Mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Fechar o menu ao clicar em qualquer link de navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // 2. Funcionalidade de Copiar Chave PIX
    const copyPixBtn = document.getElementById('copyPixBtn');
    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', () => {
            const pixKey = copyPixBtn.getAttribute('data-pix');
            
            // Copiar para a área de transferência
            navigator.clipboard.writeText(pixKey).then(() => {
                const originalText = copyPixBtn.innerText;
                copyPixBtn.innerText = 'Copiado!';
                
                // Feedback visual de sucesso (muda de cor temporariamente)
                copyPixBtn.style.backgroundColor = '#faf8f5';
                copyPixBtn.style.color = '#767043';
                copyPixBtn.style.borderColor = '#767043';
                
                setTimeout(() => {
                    copyPixBtn.innerText = originalText;
                    copyPixBtn.style.backgroundColor = '';
                    copyPixBtn.style.color = '';
                    copyPixBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar chave PIX: ', err);
                alert('Chave PIX: ' + pixKey);
            });
        });
    }

    // 3. Carrossel de Imagens da Galeria
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (track && prevBtn && nextBtn && indicatorsContainer) {
        const slides = Array.from(track.children);
        let currentIndex = 0;

        // Determina a quantidade de slides visíveis com base na largura da tela
        const getVisibleSlides = () => {
            const width = window.innerWidth;
            if (width <= 600) return 1;
            if (width <= 1024) return 2;
            return 3;
        };

        // Cria os pontinhos indicadores dinamicamente baseados na quantidade de páginas possíveis
        const createIndicators = () => {
            indicatorsContainer.innerHTML = '';
            const visibleSlides = getVisibleSlides();
            const maxIndex = slides.length - visibleSlides;

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
                
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                
                indicatorsContainer.appendChild(dot);
            }
        };

        // Atualiza a posição do carrossel e o estado dos controles
        const updateSlider = () => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = slides.length - visibleSlides;

            // Garante que o índice atual esteja dentro dos limites válidos
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            // Obtém a largura de um slide
            let slideWidth = slides[0].offsetWidth;
            
            // Failsafe / Fallback caso o navegador ainda esteja carregando e meça a largura como 0
            if (slideWidth === 0) {
                const containerWidth = track.parentElement.offsetWidth;
                slideWidth = (containerWidth - (visibleSlides - 1) * 30) / visibleSlides;
            }
            
            // Obtém o gap configurado no CSS (padrão 30px)
            const computedStyle = getComputedStyle(document.documentElement);
            const gap = parseInt(computedStyle.getPropertyValue('--slide-gap') || '30');

            // Calcula o deslocamento total
            const offset = currentIndex * (slideWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;

            // Atualiza os estados ativos das setas controladoras
            prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';

            // Atualiza a classe ativa dos pontinhos indicadores
            const dots = Array.from(indicatorsContainer.children);
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Listeners das setas
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const visibleSlides = getVisibleSlides();
            const maxIndex = slides.length - visibleSlides;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        // Inicializa o carrossel
        const initCarousel = () => {
            createIndicators();
            updateSlider();
        };

        // Executa imediatamente e garante a sincronização no carregamento total de imagens
        initCarousel();
        window.addEventListener('load', initCarousel);

        // Recalcula e reposiciona em caso de redimensionamento da janela
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initCarousel();
            }, 100);
        });

        // Suporte a gestos de arrastar no celular (Touch events)
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // Se arrastou mais de 50px de distância
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Arrastou para a esquerda (próximo slide)
                    nextBtn.click();
                } else {
                    // Arrastou para a direita (slide anterior)
                    prevBtn.click();
                }
            }
            isDragging = false;
        });
    }
});
