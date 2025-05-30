// Componentes aprimorados para versão premium
class PremiumInteractiveBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isAnimating = true;
        
        // Configurações aprimoradas
        this.particleCount = 80;
        this.particleColor = '#5e60ce';
        this.lineColor = 'rgba(94, 96, 206, 0.2)';
        this.particleRadius = 2;
        this.lineThreshold = 180;
        this.particleOpacity = 0.7;
        
        this.init();
    }
    
    init() {
        // Adicionar canvas ao container
        this.container.appendChild(this.canvas);
        
        // Configurar tamanho do canvas
        this.resizeCanvas();
        
        // Criar partículas
        this.createParticles();
        
        // Adicionar event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.trackMouse(e));
        
        // Iniciar animação
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recriar partículas quando o tamanho mudar
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: Math.random() * 1 - 0.5,
                vy: Math.random() * 1 - 0.5,
                radius: Math.random() * this.particleRadius + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    trackMouse(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar e desenhar partículas
        this.updateParticles();
        
        // Continuar animação
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Mover partícula
            p.x += p.vx;
            p.y += p.vy;
            
            // Verificar limites
            if (p.x < 0 || p.x > this.canvas.width) {
                p.vx = -p.vx;
            }
            
            if (p.y < 0 || p.y > this.canvas.height) {
                p.vy = -p.vy;
            }
            
            // Desenhar partícula com gradiente
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `rgba(94, 96, 206, ${p.opacity})`);
            gradient.addColorStop(1, `rgba(72, 191, 227, ${p.opacity * 0.5})`);
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Conectar partículas próximas com linhas gradientes
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.lineThreshold) {
                    const opacity = (1 - distance / this.lineThreshold) * 0.2;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    
                    const gradient = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                    gradient.addColorStop(0, `rgba(94, 96, 206, ${opacity})`);
                    gradient.addColorStop(1, `rgba(72, 191, 227, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = (1 - distance / this.lineThreshold) * 2;
                    this.ctx.stroke();
                }
            }
            
            // Conectar com o mouse com efeito especial
            if (this.mouseX && this.mouseY) {
                const dx = p.x - this.mouseX;
                const dy = p.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.lineThreshold * 1.5) {
                    const opacity = (1 - distance / (this.lineThreshold * 1.5)) * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouseX, this.mouseY);
                    
                    const gradient = this.ctx.createLinearGradient(p.x, p.y, this.mouseX, this.mouseY);
                    gradient.addColorStop(0, `rgba(94, 96, 206, ${opacity})`);
                    gradient.addColorStop(1, `rgba(128, 255, 219, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = (1 - distance / (this.lineThreshold * 1.5)) * 3;
                    this.ctx.stroke();
                    
                    // Adicionar atração ao mouse
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                }
            }
        }
    }
    
    stop() {
        this.isAnimating = false;
    }
    
    start() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }
}

// Bloco de Provas Sociais Premium
class PremiumTestimonialsCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.testimonials = [];
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        // Configurações
        this.autoplay = true;
        this.autoplayDelay = 5000; // 5 segundos
        this.visibleItems = 3; // Número de itens visíveis ao mesmo tempo
        
        // Elementos DOM
        this.wrapper = null;
        this.dotsContainer = null;
        
        // Responsividade
        this.breakpoints = {
            mobile: 576,
            tablet: 768,
            desktop: 992
        };
    }
    
    init(testimonials) {
        this.testimonials = testimonials;
        this.render();
        this.setupEventListeners();
        
        if (this.autoplay) {
            this.startAutoplay();
        }
        
        // Ajustar para responsividade
        this.adjustVisibleItems();
        window.addEventListener('resize', () => this.adjustVisibleItems());
    }
    
    render() {
        // Limpar container
        this.container.innerHTML = '';
        
        // Criar estrutura
        const containerDiv = document.createElement('div');
        containerDiv.className = 'testimonials-container';
        
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'testimonials-wrapper';
        
        // Adicionar cards de depoimentos
        this.testimonials.forEach((testimonial, index) => {
            const card = this.createTestimonialCard(testimonial, index);
            this.wrapper.appendChild(card);
        });
        
        // Adicionar navegação
        const navDiv = document.createElement('div');
        navDiv.className = 'testimonials-nav';
        
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&larr;';
        prevButton.setAttribute('aria-label', 'Anterior');
        prevButton.addEventListener('click', () => this.prev());
        
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&rarr;';
        nextButton.setAttribute('aria-label', 'Próximo');
        nextButton.addEventListener('click', () => this.next());
        
        navDiv.appendChild(prevButton);
        navDiv.appendChild(nextButton);
        
        // Adicionar indicadores (dots)
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'testimonials-dots';
        this.updateDots();
        
        // Montar estrutura
        containerDiv.appendChild(this.wrapper);
        containerDiv.appendChild(navDiv);
        containerDiv.appendChild(this.dotsContainer);
        this.container.appendChild(containerDiv);
        
        // Posicionar no slide atual
        this.goToSlide(this.currentIndex);
    }
    
    createTestimonialCard(testimonial, index) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.setAttribute('data-index', index);
        
        const header = document.createElement('div');
        header.className = 'testimonial-header';
        
        const avatar = document.createElement('div');
        avatar.className = 'testimonial-avatar';
        
        if (testimonial.avatar) {
            const img = document.createElement('img');
            img.src = testimonial.avatar;
            img.alt = testimonial.name;
            avatar.appendChild(img);
        } else {
            // Avatar placeholder com iniciais
            avatar.textContent = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.backgroundColor = this.getRandomColor();
            avatar.style.color = 'white';
            avatar.style.fontWeight = 'bold';
        }
        
        const info = document.createElement('div');
        info.className = 'testimonial-info';
        
        const name = document.createElement('div');
        name.className = 'testimonial-name';
        name.textContent = testimonial.name;
        
        const meta = document.createElement('div');
        meta.className = 'testimonial-meta';
        meta.textContent = testimonial.meta || '';
        
        info.appendChild(name);
        info.appendChild(meta);
        
        header.appendChild(avatar);
        header.appendChild(info);
        
        const content = document.createElement('div');
        content.className = 'testimonial-content';
        content.textContent = testimonial.content;
        
        const result = document.createElement('div');
        result.className = 'testimonial-result';
        result.textContent = testimonial.result || '';
        
        card.appendChild(header);
        card.appendChild(content);
        
        if (testimonial.result) {
            card.appendChild(result);
        }
        
        return card;
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(this.testimonials.length / this.visibleItems);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'testimonials-dot';
            if (Math.floor(this.currentIndex / this.visibleItems) === i) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                this.goToSlide(i * this.visibleItems);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        // Pausar autoplay ao passar o mouse
        this.container.addEventListener('mouseenter', () => {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        });
        
        // Retomar autoplay ao remover o mouse
        this.container.addEventListener('mouseleave', () => {
            if (this.autoplay && !this.autoplayInterval) {
                this.startAutoplay();
            }
        });
        
        // Adicionar suporte a gestos de toque
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Mínimo de pixels para considerar um swipe
        
        if (startX - endX > threshold) {
            // Swipe para a esquerda
            this.next();
        } else if (endX - startX > threshold) {
            // Swipe para a direita
            this.prev();
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.autoplayDelay);
    }
    
    adjustVisibleItems() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) {
            this.visibleItems = 1;
        } else if (width <= this.breakpoints.tablet) {
            this.visibleItems = 2;
        } else if (width <= this.breakpoints.desktop) {
            this.visibleItems = 2;
        } else {
            this.visibleItems = 3;
        }
        
        this.updateDots();
        this.goToSlide(this.currentIndex);
    }
    
    goToSlide(index) {
        // Garantir que o índice esteja dentro dos limites
        if (index < 0) {
            index = 0;
        } else if (index >= this.testimonials.length) {
            index = this.testimonials.length - this.visibleItems;
        }
        
        if (index > this.testimonials.length - this.visibleItems) {
            index = this.testimonials.length - this.visibleItems;
        }
        
        if (index < 0) index = 0;
        
        this.currentIndex = index;
        
        // Calcular a largura do card + margem
        const cardWidth = this.wrapper.querySelector('.testimonial-card').offsetWidth;
        const marginRight = 20; // Deve corresponder ao valor no CSS
        const offset = index * (cardWidth + marginRight);
        
        // Mover o wrapper com animação suave
        this.wrapper.style.transform = `translateX(-${offset}px)`;
        
        // Atualizar dots
        this.updateDots();
    }
    
    next() {
        this.goToSlide(this.currentIndex + this.visibleItems);
    }
    
    prev() {
        this.goToSlide(this.currentIndex - this.visibleItems);
    }
    
    getRandomColor() {
        const colors = [
            '#5e60ce', '#5390d9', '#4ecdc4', '#ffcb77', '#ff5a5f',
            '#6930c3', '#48bfe3', '#64dfdf', '#80ffdb', '#2b2d42'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addTestimonial(testimonial) {
        this.testimonials.push(testimonial);
        this.render();
    }
}

// Dados de exemplo para provas sociais
const premiumTestimonials = [
    {
        name: 'Ana Silva',
        meta: 'Perdeu 12kg em 90 dias',
        content: 'Este desafio mudou minha vida! Consegui criar hábitos saudáveis que nunca imaginei ser capaz. A parte de registrar diariamente me ajudou a manter o foco.',
        result: 'Resultado: -12kg e -15cm de cintura',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
        name: 'Carlos Oliveira',
        meta: 'Perdeu 8kg em 90 dias',
        content: 'Sempre tive dificuldade em manter a disciplina, mas o acompanhamento diário e os alertas de fim de semana fizeram toda a diferença!',
        result: 'Resultado: -8kg e ganho de massa muscular',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
        name: 'Juliana Costa',
        meta: 'Perdeu 15kg em 90 dias',
        content: 'Ver as fotos do meu progresso foi fundamental para me manter motivada. Recomendo tirar fotos semanalmente, faz toda a diferença!',
        result: 'Resultado: -15kg e muito mais disposição',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
        name: 'Roberto Almeida',
        meta: 'Perdeu 10kg em 90 dias',
        content: 'Os fins de semana sempre foram meu ponto fraco, mas os alertas me ajudaram a planejar melhor e não cair em tentações.',
        result: 'Resultado: -10kg e pressão arterial normalizada',
        avatar: 'https://randomuser.me/api/portraits/men/53.jpg'
    },
    {
        name: 'Fernanda Lima',
        meta: 'Perdeu 7kg em 90 dias',
        content: 'Mais do que perder peso, consegui melhorar minha relação com a comida e com a água. Beber 2L por dia fez uma diferença incrível na minha pele!',
        result: 'Resultado: -7kg e pele renovada',
        avatar: 'https://randomuser.me/api/portraits/women/89.jpg'
    },
    {
        name: 'Marcelo Santos',
        meta: 'Perdeu 14kg em 90 dias',
        content: 'Nunca pensei que conseguiria mudar tanto em apenas 90 dias. O registro diário me fez perceber padrões que eu nem sabia que tinha.',
        result: 'Resultado: -14kg e fim das dores nas costas',
        avatar: 'https://randomuser.me/api/portraits/men/76.jpg'
    }
];

// Função para inicializar os componentes premium
function initPremiumComponents() {
    // Verificar se os elementos existem
    const bgContainer = document.getElementById('background-container');
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    // Inicializar background interativo premium se o container existir
    if (bgContainer) {
        window.premiumBackground = new PremiumInteractiveBackground('background-container');
    }
    
    // Inicializar carrossel de depoimentos premium se o container existir
    if (testimonialsContainer) {
        window.premiumTestimonials = new PremiumTestimonialsCarousel('testimonials-container');
        window.premiumTestimonials.init(premiumTestimonials);
    }
    
    // Adicionar efeitos de animação aos elementos
    addScrollAnimations();
    addHoverEffects();
}

// Adicionar animações de scroll
function addScrollAnimations() {
    // Selecionar todos os elementos que devem ser animados
    const animatedElements = document.querySelectorAll('.card, .stat-item, .alert');
    
    // Criar um observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar cada elemento
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// Adicionar efeitos de hover
function addHoverEffects() {
    // Adicionar efeito de hover aos botões de navegação
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('hover-effect');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('hover-effect');
        });
    });
    
    // Adicionar efeito de hover aos dias do calendário
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('mouseenter', () => {
            day.classList.add('hover-effect');
        });
        
        day.addEventListener('mouseleave', () => {
            day.classList.remove('hover-effect');
        });
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes premium
    initPremiumComponents();
    
    // Adicionar classe para ativar animações CSS
    document.body.classList.add('premium-animations');
});
