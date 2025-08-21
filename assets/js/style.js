/* ------------------------- Navigation -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const navLinksDesktop = document.querySelector('.nav-links');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');
    const panelContainer = document.querySelector('.panel-container');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (!navLinksDesktop || !mobileMenuPanel || !menuToggle) return;

    // --- Create Main Mobile Menu Panel ---
    const mainPanel = document.createElement('div');
    mainPanel.id = 'main-menu-panel';
    mainPanel.className = 'panel-content active';
    const mainUl = document.createElement('ul');
    mainUl.className = 'mobile-main-menu';
    mainPanel.appendChild(mainUl);
    panelContainer.appendChild(mainPanel);

    // --- Dynamically Build Mobile Menu from Desktop Menu ---
    const navItems = navLinksDesktop.querySelectorAll('.nav-item');

    navItems.forEach((item, index) => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = link.textContent;
        
        if (dropdown) {
            const panelId = `sub-panel-${index}`;
            a.href = '#';
            a.dataset.targetPanel = panelId;
            a.innerHTML += '<span>›</span>';
            createSubPanel(dropdown, panelId, link.textContent);
        } else {
            a.href = link.href;
            a.classList.add('final-link');
        }
        
        li.appendChild(a);
        mainUl.appendChild(li);
    });

    function createSubPanel(dropdown, panelId, title) {
        const subPanel = document.createElement('div');
        subPanel.id = panelId;
        subPanel.className = 'panel-content';

        let contentHtml = `
            <div class="mobile-sub-panel-header">
                <button class="mobile-menu-back" aria-label="Go back">‹</button>
                <h3 class="mobile-sub-panel-title">${title}</h3>
            </div>
            <div class="mobile-sub-panel-content">
        `;
        
        const columns = dropdown.querySelectorAll('.mega-menu-column');
        if (columns.length > 0) {
            columns.forEach(col => {
                const heading = col.querySelector('h5');
                if (heading) contentHtml += `<h5>${heading.textContent}</h5>`;
                
                const links = col.querySelectorAll('ul a, a.standalone-link');
                contentHtml += '<ul>';
                links.forEach(link => {
                     contentHtml += `<li><a href="${link.href}" class="final-link">${link.textContent.replace('→', '').replace('↗', '')}</a></li>`;
                });
                contentHtml += '</ul>';
            });
        }
        
        contentHtml += `</div>`;
        subPanel.innerHTML = contentHtml;
        panelContainer.appendChild(subPanel);
    }

    // --- Event Listeners ---
    const closeMenu = () => {
        mobileMenuPanel.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        // Reset all panels
        panelContainer.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
        mainPanel.classList.add('active');
    };

    menuToggle.addEventListener('click', () => {
        const isActive = mobileMenuPanel.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.classList.toggle('no-scroll', isActive);
    });

    panelContainer.addEventListener('click', (e) => {
        // Open sub-panel
        if (e.target.matches('[data-target-panel]')) {
            e.preventDefault();
            const targetPanel = document.getElementById(e.target.dataset.targetPanel);
            if (targetPanel) {
                mainPanel.classList.remove('active');
                targetPanel.classList.add('active');
            }
        }
        // Go back
        if (e.target.matches('.mobile-menu-back')) {
            e.preventDefault();
            e.target.closest('.panel-content').classList.remove('active');
            mainPanel.classList.add('active');
        }
        // Close menu on final link click
        if (e.target.matches('.final-link')) {
            closeMenu();
        }
    });
});



document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements) {
        return;
    }

    // Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is visible in the viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing it after the animation has run once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe each element with the target class
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sliderTrack = document.querySelector('.slider-track');
    // Guard against cases where the slider is not on the page
    if (!sliderTrack) {
        return;
    }
    
    const cards = document.querySelectorAll('.profile-card');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    
    let currentIndex = 0;
    let cardWidth = 0;
    let gap = 0;
    let visibleCards = 0;

    function updateSliderDimensions() {
        if (cards.length === 0) return;

        // Calculate card width and gap based on the first card and the track
        cardWidth = cards[0].offsetWidth;
        gap = parseInt(window.getComputedStyle(sliderTrack).gap, 10);
        
        // Calculate how many cards are visible
        const containerWidth = sliderTrack.parentElement.offsetWidth;
        visibleCards = Math.floor((containerWidth + gap) / (cardWidth + gap));
        
        updateSliderPosition();
        updateButtonStates();
    }

    function updateSliderPosition() {
        const offset = -currentIndex * (cardWidth + gap);
        sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    function updateButtonStates() {
        // Disable prev button if at the start
        prevButton.disabled = currentIndex === 0;
        
        // Disable next button if at the end
        const maxIndex = cards.length - visibleCards;
        nextButton.disabled = currentIndex >= maxIndex;
    }

    nextButton.addEventListener('click', () => {
        const maxIndex = cards.length - visibleCards;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updateButtonStates();
        }
    });
    
    // Recalculate dimensions on window resize for responsiveness
    window.addEventListener('resize', updateSliderDimensions);

    // Initial setup
    updateSliderDimensions();
});

document.addEventListener('DOMContentLoaded', function () {
    const regionTabs = document.querySelectorAll('.region-card');
    const locationContents = document.querySelectorAll('.locations-content');

    // If there are no tabs on the page, do nothing
    if (regionTabs.length === 0) {
        return;
    }

    regionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const region = tab.dataset.region;

            // 1. Update the active state on tabs
            regionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. Show the corresponding location content
            locationContents.forEach(content => {
                // Hide all content blocks first
                content.classList.remove('active');
                
                // Show the one that matches the clicked tab's region
                if (content.id === `${region}-locations`) {
                    content.classList.add('active');
                }
            });
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.slider-track');
    // Guard against cases where the slider is not on the page
    if (!track) return;
    
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.prev-button');
    const viewport = document.querySelector('.slider-viewport');

    let currentIndex = cards.findIndex(card => card.classList.contains('active'));
    // If no card is active, default to the middle one
    if (currentIndex === -1) {
        currentIndex = Math.floor(cards.length / 2);
    }
    
    function updateSlider() {
        const viewportWidth = viewport.offsetWidth;
        const activeCard = cards[currentIndex];
        
        // Calculate the offset needed to center the active card
        const cardWidth = activeCard.offsetWidth;
        const cardLeft = activeCard.offsetLeft;
        const offset = cardLeft - (viewportWidth / 2) + (cardWidth / 2);

        // Apply the transform to the track
        track.style.transform = `translateX(-${offset}px)`;

        // Update active class
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === cards.length - 1;
    }

    // Add a transition to the track *after* the initial positioning
    function enableTransition() {
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
        }, 0);
    }

    // Event listeners
    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Update slider on window resize to maintain centering
    window.addEventListener('resize', updateSlider);

    // Initial setup
    updateSlider();
    enableTransition();
});


/* ------------------------- Careers -------------------------------------------------- */
  // Job details data
        const jobDetails = {
            1: {
                title: "Senior Software Engineer - .NET",
                location: "Lahore, Pakistan",
                category: "Technology",
                type: "Full-time",
                description: "We're looking for an experienced Senior .NET Software Engineer to join our development team. You'll be responsible for designing and developing high-performance enterprise applications.",
                requirements: [
                    "5+ years of .NET development experience",
                    "Proficient in C#, ASP.NET Core",
                    "Familiar with microservices architecture",
                    "Experience with Azure or AWS cloud services",
                    "Strong team collaboration skills"
                ],
                benefits: [
                    "Competitive salary package",
                    "Flexible working hours",
                    "Professional training opportunities",
                    "Health insurance",
                    "Paid annual leave"
                ]
            },
            2: {
                title: "Project Manager - Digital Transformation",
                location: "Remote",
                category: "Business",
                type: "Full-time",
                description: "Seeking an experienced Project Manager to lead digital transformation projects. You'll be responsible for project planning, execution, and delivery, ensuring projects are completed on time and within budget.",
                requirements: [
                    "8+ years of project management experience",
                    "PMP or related certification preferred",
                    "Digital transformation project experience",
                    "Excellent communication and leadership skills",
                    "Agile development methodology experience"
                ],
                benefits: [
                    "Fully remote work",
                    "International team collaboration",
                    "Career development opportunities",
                    "Performance bonuses",
                    "Technology equipment allowance"
                ]
            },
            3: {
                title: "UX/UI Designer",
                location: "Karachi, Pakistan",
                category: "Creative",
                type: "Full-time",
                description: "We're looking for a creative UX/UI Designer to design and optimize user interfaces, enhancing user experience across our products.",
                requirements: [
                    "3+ years of UX/UI design experience",
                    "Proficient in Figma, Sketch and other design tools",
                    "Knowledge of user research methods",
                    "Responsive design experience",
                    "Excellent visual design skills"
                ],
                benefits: [
                    "Creative work environment",
                    "Latest design tools",
                    "Design portfolio showcase opportunities",
                    "Industry conference attendance",
                    "Flexible working hours"
                ]
            }
        };

        function openJobModal(jobId) {
            const modal = document.getElementById('jobModal');
            const job = jobDetails[jobId];
            
            document.getElementById('modalJobTitle').textContent = job.title;
            
            const content = `
                <div class="modal-meta">
                    <span>${job.location}</span>
                    <span>${job.type}</span>
                    <span class="category-badge ${
                        job.category === 'Technology' ? 'badge-tech' :
                        job.category === 'Business' ? 'badge-business' :
                        'badge-creative'
                    }">${job.category}</span>
                </div>
                
                <div class="modal-section">
                    <h4>Job Description</h4>
                    <p>${job.description}</p>
                </div>
                
                <div class="modal-section">
                    <h4>Requirements</h4>
                    <ul class="modal-list">
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h4>We Offer</h4>
                    <ul class="modal-list">
                        ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            document.getElementById('modalContent').innerHTML = content;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeJobModal() {
            const modal = document.getElementById('jobModal');
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeJobModal();
            }
        });
  class CommunitySlider {
            constructor() {
                this.sliderWrapper = document.getElementById('sliderWrapper');
                this.slides = this.sliderWrapper.children;
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.indicators = document.querySelectorAll('.indicator');
                
                this.currentSlide = 0;
                this.slidesToShow = this.getSlidesToShow();
                this.totalSlides = this.slides.length;
                this.maxSlide = this.totalSlides - this.slidesToShow;
                
                this.init();
            }
            
            getSlidesToShow() {
                if (window.innerWidth >= 1024) return 3;
                if (window.innerWidth >= 768) return 2;
                return 1;
            }
            
            init() {
                this.updateSlider();
                this.bindEvents();
                this.updateIndicators();
                
                // Auto-play
                this.autoPlay = setInterval(() => {
                    this.nextSlide();
                }, 5000);
            }
            
            bindEvents() {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
                
                this.indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        this.currentSlide = index;
                        this.updateSlider();
                        this.updateIndicators();
                        this.resetAutoPlay();
                    });
                });
                
                window.addEventListener('resize', () => {
                    this.slidesToShow = this.getSlidesToShow();
                    this.maxSlide = this.totalSlides - this.slidesToShow;
                    if (this.currentSlide > this.maxSlide) {
                        this.currentSlide = this.maxSlide;
                    }
                    this.updateSlider();
                    this.updateIndicators();
                });
            }
            
            prevSlide() {
                if (this.currentSlide > 0) {
                    this.currentSlide--;
                } else {
                    this.currentSlide = this.maxSlide;
                }
                this.updateSlider();
                this.updateIndicators();
                this.resetAutoPlay();
            }
            
            nextSlide() {
                if (this.currentSlide < this.maxSlide) {
                    this.currentSlide++;
                } else {
                    this.currentSlide = 0;
                }
                this.updateSlider();
                this.updateIndicators();
                this.resetAutoPlay();
            }
            
            updateSlider() {
                const translateX = -(this.currentSlide * (100 / this.slidesToShow));
                this.sliderWrapper.style.transform = `translateX(${translateX}%)`;
            }
            
            updateIndicators() {
                const indicatorCount = this.maxSlide + 1;
                this.indicators.forEach((indicator, index) => {
                    if (index < indicatorCount) {
                        indicator.style.display = 'block';
                        if (index === this.currentSlide) {
                            indicator.classList.add('active');
                        } else {
                            indicator.classList.remove('active');
                        }
                    } else {
                        indicator.style.display = 'none';
                    }
                });
            }
            
            resetAutoPlay() {
                clearInterval(this.autoPlay);
                this.autoPlay = setInterval(() => {
                    this.nextSlide();
                }, 5000);
            }
        }
        
        // Initialize slider when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new CommunitySlider();
        });
        
   
// Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.card').forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });

        // Add interactive hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.card');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            cards.forEach((card, index) => {
                const speed = (index + 1) * 0.5;
                const xOffset = (x - 0.5) * speed * 20;
                const yOffset = (y - 0.5) * speed * 20;
                
                card.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
            });
        });

        // Reset transform on mouse leave
        document.addEventListener('mouseleave', () => {
            document.querySelectorAll('.card').forEach(card => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

/* ------------------------- About-page -------------------------------------------------- */
     
document.addEventListener('DOMContentLoaded', function () {
    const sliderTrack = document.querySelector('.About-slider-track');
    // Guard against cases where the slider is not on the page
    if (!sliderTrack) {
        return;
    }
    
    const cards = document.querySelectorAll('.About-profile-card');
    const prevButton = document.querySelector('.About2--prev-button');
    const nextButton = document.querySelector('.About2-next-button');
    
    let currentIndex = 0;
    let cardWidth = 0;
    let gap = 0;
    let visibleCards = 0;

    function updateSliderDimensions() {
        if (cards.length === 0) return;

        // Calculate card width and gap based on the first card and the track
        cardWidth = cards[0].offsetWidth;
        gap = parseInt(window.getComputedStyle(sliderTrack).gap, 10);
        
        // Calculate how many cards are visible
        const containerWidth = sliderTrack.parentElement.offsetWidth;
        visibleCards = Math.floor((containerWidth + gap) / (cardWidth + gap));
        
        updateSliderPosition();
        updateButtonStates();
    }

    function updateSliderPosition() {
        const offset = -currentIndex * (cardWidth + gap);
        sliderTrack.style.transform = `translateX(${offset}px)`;
    }

    function updateButtonStates() {
        // Disable prev button if at the start
        prevButton.disabled = currentIndex === 0;
        
        // Disable next button if at the end
        const maxIndex = cards.length - visibleCards;
        nextButton.disabled = currentIndex >= maxIndex;
    }

    nextButton.addEventListener('click', () => {
        const maxIndex = cards.length - visibleCards;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updateButtonStates();
        }
    });
    
    // Recalculate dimensions on window resize for responsiveness
    window.addEventListener('resize', updateSliderDimensions);

    // Initial setup
    updateSliderDimensions();
});


        document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.About-slider-track');
    // Guard against cases where the slider is not on the page
    if (!track) return;
    
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.prev-button');
    const viewport = document.querySelector('.About-slider-viewport');

    let currentIndex = cards.findIndex(card => card.classList.contains('active'));
    // If no card is active, default to the middle one
    if (currentIndex === -1) {
        currentIndex = Math.floor(cards.length / 2);
    }
    
    function updateSlider() {
        const viewportWidth = viewport.offsetWidth;
        const activeCard = cards[currentIndex];
        
        // Calculate the offset needed to center the active card
        const cardWidth = activeCard.offsetWidth;
        const cardLeft = activeCard.offsetLeft;
        const offset = cardLeft - (viewportWidth / 2) + (cardWidth / 2);

        // Apply the transform to the track
        track.style.transform = `translateX(-${offset}px)`;

        // Update active class
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === cards.length - 1;
    }

    // Add a transition to the track *after* the initial positioning
    function enableTransition() {
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
        }, 0);
    }

    // Event listeners
    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Update slider on window resize to maintain centering
    window.addEventListener('resize', updateSlider);

    // Initial setup
    updateSlider();
    enableTransition();
});




    document.addEventListener('DOMContentLoaded', () => {
            // Carousel functionality
            const carousel = document.querySelector('.indexcarousel-section');
            if (carousel) {
                const track = carousel.querySelector('.indexcarousel-track');
                const slides = carousel.querySelectorAll('.indexcarousel-slide');
                const nextButton = carousel.querySelector('.indexcarousel-btn.next');
                const prevButton = carousel.querySelector('.indexcarousel-btn.prev');
                const progressBar = carousel.querySelector('.indexprogress-bar');
                const slideCounter = carousel.querySelector('.indexslide-counter');
                let currentIndex = 0;

                const moveToSlide = (targetIndex) => {
                    const slideWidth = slides[0].getBoundingClientRect().width;
                    track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
                    slides[currentIndex].classList.remove('is-selected');
                    slides[targetIndex].classList.add('is-selected');
                    currentIndex = targetIndex;
                    updateControls();
                };

                const updateControls = () => {
                    progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
                    slideCounter.textContent = `${currentIndex + 1} / ${slides.length}`;
                    prevButton.disabled = currentIndex === 0;
                    nextButton.disabled = currentIndex === slides.length - 1;
                };

                if (slides.length > 0) {
                    slides[0].classList.add('is-selected');
                    updateControls();
                }

                nextButton.addEventListener('click', () => {
                    if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
                });

                prevButton.addEventListener('click', () => {
                    if (currentIndex > 0) moveToSlide(currentIndex - 1);
                });

                window.addEventListener('resize', () => {
                    if (slides.length > 0) {
                        const newWidth = slides[0].getBoundingClientRect().width;
                        track.style.transition = 'none';
                        track.style.transform = `translateX(-${newWidth * currentIndex}px)`;
                        setTimeout(() => {
                            track.style.transition = '';
                        }, 50);
                    }
                });
            }

            // FAQ accordion
            const faqItems = document.querySelectorAll('.indexfaq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.indexfaq-question');
                question.addEventListener('click', () => {
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            });
        });index

