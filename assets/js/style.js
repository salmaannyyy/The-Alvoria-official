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
document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('.jobs-nav a');
    const jobItems = document.querySelectorAll('.job-item');

    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();

            // Handle active class for filters
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            jobItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

 class InfiniteSlider {
            constructor() {
                this.wrapper = document.getElementById('sliderWrapper');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.indicatorsContainer = document.getElementById('indicators');
                this.speedSlider = document.getElementById('speedSlider');
                this.speedValue = document.getElementById('speedValue');
                
                this.slides = [];
                this.slideWidth = 330; // 300px + 30px margin
                this.currentIndex = 0;
                this.scrollSpeed = 5;
                this.isScrolling = true;
                this.animationId = null;
                this.lastTimestamp = 0;
                this.accumulatedDelta = 0;
                
                this.slideData = [
                    { title: "Mountain Vista", category: "Nature", seed: "mountain1" },
                    { title: "Ocean Waves", category: "Seascape", seed: "ocean1" },
                    { title: "Forest Path", category: "Wilderness", seed: "forest1" },
                    { title: "City Lights", category: "Urban", seed: "city1" },
                    { title: "Desert Dunes", category: "Landscape", seed: "desert1" },
                    { title: "Northern Lights", category: "Aurora", seed: "aurora1" },
                    { title: "Tropical Beach", category: "Paradise", seed: "beach1" },
                    { title: "Snowy Peaks", category: "Winter", seed: "snow1" },
                    { title: "Autumn Colors", category: "Seasons", seed: "autumn1" },
                    { title: "Starry Night", category: "Cosmos", seed: "stars1" }
                ];
                
                this.init();
            }
            
            init() {
                this.createSlides();
                this.createIndicators();
                this.setupEventListeners();
                this.startAutoScroll();
            }
            
            createSlides() {
                // Create enough slides to fill the viewport and beyond
                const slidesNeeded = Math.ceil(window.innerWidth / this.slideWidth) + 5;
                
                for (let i = 0; i < slidesNeeded; i++) {
                    const slideData = this.slideData[i % this.slideData.length];
                    const slide = this.createSlide(slideData, i);
                    this.wrapper.appendChild(slide);
                    this.slides.push(slide);
                }
            }
            
            createSlide(data, index) {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.innerHTML = `
                    <img src="https://picsum.photos/seed/${data.seed}/300/400.jpg" alt="${data.title}">
                    <div class="slide-overlay">
                        <h3 class="slide-title">${data.title}</h3>
                        <p class="slide-category">${data.category}</p>
                    </div>
                `;
                
                slide.addEventListener('click', () => {
                    this.pauseAutoScroll();
                    // Add your click handler here
                    console.log(`Clicked on ${data.title}`);
                });
                
                return slide;
            }
            
            createIndicators() {
                for (let i = 0; i < this.slideData.length; i++) {
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (i === 0) indicator.classList.add('active');
                    indicator.addEventListener('click', () => this.goToSlide(i));
                    this.indicatorsContainer.appendChild(indicator);
                }
            }
            
            setupEventListeners() {
                this.prevBtn.addEventListener('click', () => this.scrollPrev());
                this.nextBtn.addEventListener('click', () => this.scrollNext());
                
                this.speedSlider.addEventListener('input', (e) => {
                    this.scrollSpeed = parseInt(e.target.value);
                    this.speedValue.textContent = this.scrollSpeed;
                });
                
                // Pause on hover
                this.wrapper.addEventListener('mouseenter', () => this.pauseAutoScroll());
                this.wrapper.addEventListener('mouseleave', () => this.startAutoScroll());
                
                // Touch support
                let touchStartX = 0;
                let touchEndX = 0;
                
                this.wrapper.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                    this.pauseAutoScroll();
                });
                
                this.wrapper.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    this.handleSwipe(touchStartX, touchEndX);
                    this.startAutoScroll();
                });
                
                // Window resize
                window.addEventListener('resize', () => {
                    this.handleResize();
                });
            }
            
            handleSwipe(startX, endX) {
                if (endX < startX - 50) {
                    this.scrollNext();
                }
                if (endX > startX + 50) {
                    this.scrollPrev();
                }
            }
            
            handleResize() {
                // Recalculate slide width based on new window size
                this.slideWidth = this.slides[0].offsetWidth + 30;
            }
            
            startAutoScroll() {
                this.isScrolling = true;
                this.lastTimestamp = performance.now();
                this.animate();
            }
            
            pauseAutoScroll() {
                this.isScrolling = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            }
            
            animate(timestamp = 0) {
                if (!this.isScrolling) return;
                
                const deltaTime = timestamp - this.lastTimestamp;
                this.lastTimestamp = timestamp;
                
                // Calculate movement based on time and speed
                this.accumulatedDelta += (this.scrollSpeed * deltaTime) / 16;
                
                if (this.accumulatedDelta >= 1) {
                    const pixelsToMove = Math.floor(this.accumulatedDelta);
                    this.accumulatedDelta -= pixelsToMove;
                    
                    this.currentIndex += pixelsToMove;
                    this.updateSliderPosition();
                }
                
                this.animationId = requestAnimationFrame((ts) => this.animate(ts));
            }
            
            updateSliderPosition() {
                // Move slides that have gone off-screen to the end
                while (this.currentIndex >= this.slideWidth) {
                    this.currentIndex -= this.slideWidth;
                    const firstSlide = this.slides.shift();
                    this.wrapper.appendChild(firstSlide);
                    this.slides.push(firstSlide);
                }
                
                this.wrapper.style.transform = `translateX(-${this.currentIndex}px)`;
                this.updateIndicators();
            }
            
            scrollNext() {
                this.currentIndex += this.slideWidth;
                this.updateSliderPosition();
            }
            
            scrollPrev() {
                // Move last slide to beginning
                const lastSlide = this.slides.pop();
                this.wrapper.insertBefore(lastSlide, this.wrapper.firstChild);
                this.slides.unshift(lastSlide);
                
                this.currentIndex -= this.slideWidth;
                this.updateSliderPosition();
            }
            
            goToSlide(index) {
                // Calculate how many slides to move
                const currentDataIndex = Math.floor(this.currentIndex / this.slideWidth) % this.slideData.length;
                const slidesToMove = (index - currentDataIndex + this.slideData.length) % this.slideData.length;
                
                this.currentIndex += slidesToMove * this.slideWidth;
                this.updateSliderPosition();
            }
            
            updateIndicators() {
                const currentDataIndex = Math.floor(this.currentIndex / this.slideWidth) % this.slideData.length;
                const indicators = this.indicatorsContainer.children;
                
                for (let i = 0; i < indicators.length; i++) {
                    indicators[i].classList.toggle('active', i === currentDataIndex);
                }
            }
        }
        
        // Initialize the slider when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new InfiniteSlider();
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

