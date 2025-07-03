// Event Tracker Class
class EventTracker {
    static log(event, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = data ? `[${timestamp}] ${event}: ${JSON.stringify(data)}` : `[${timestamp}] ${event}`;
        console.log(logMessage);
    }
}

// Scene Manager Class
class SceneManager {
    constructor() {
        this.currentScene = 'intro';
        this.scenes = {
            intro: document.getElementById('introScene'),
            gallery: document.getElementById('galleryScene'),
            video: document.getElementById('videoScene')
        };
        this.init();
    }

    init() {
        console.log('SceneManager initialized');
        this.startIntroTimer();
    }

    startIntroTimer() {
        const progressBar = document.getElementById('loadingProgress');
        let progress = 0;
        const duration = 8000; // 8 seconds
        const interval = 25; // Update every 25ms
        const increment = (100 / duration) * interval;

        console.log('Starting intro timer');
        
        const timer = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                clearInterval(timer);
                console.log('Intro timer complete, switching to gallery');
                setTimeout(() => this.switchScene('gallery'), 500);
            }
        }, interval);
    }

    switchScene(sceneName) {
        console.log(`Switching from ${this.currentScene} to ${sceneName}`);
        
        // Hide current scene
        this.scenes[this.currentScene].classList.remove('active');
        
        // Show new scene with delay
        setTimeout(() => {
            this.scenes[sceneName].classList.add('active');
            this.currentScene = sceneName;
            EventTracker.log(`scene_change:${sceneName}`);
        }, 300);
    }
}

// Gallery Manager Class
class GalleryManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.swiper = null;
        this.init();
    }

    init() {
        console.log('Initializing Gallery Manager');
        
        // Wait for DOM to be ready
        setTimeout(() => {
            this.initSwiper();
            this.setupSlideHandlers();
        }, 100);
    }

    initSwiper() {
        try {
            this.swiper = new Swiper('#productSwiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                breakpoints: {
                    480: {
                        slidesPerView: 1.2,
                    },
                    768: {
                        slidesPerView: 1.5,
                    }
                }
            });
            console.log('Swiper initialized successfully');
        } catch (error) {
            console.error('Error initializing Swiper:', error);
        }
    }

    setupSlideHandlers() {
        // Add click event listeners to slides
        const slides = document.querySelectorAll('.swiper-slide');
        console.log(`Setting up handlers for ${slides.length} slides`);
        
        slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = parseInt(slide.getAttribute('data-slide'));
                console.log(`Slide ${slideIndex} clicked`);
                EventTracker.log(`user_interaction:slide_click:${slideIndex}`);
                this.handleSlideClick(slideIndex);
            });
        });
    }

    handleSlideClick(slideIndex) {
        console.log(`Handling slide click: ${slideIndex}`);
        
        const videoContainer = document.getElementById('videoContainer');
        const video = document.getElementById('productVideo');
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        // Remove all position classes
        videoContainer.className = 'video-container';
        
        // Add the appropriate position class
        const position = positions[slideIndex - 1];
        videoContainer.classList.add(position);
        
        console.log(`Video positioned: ${position}`);
        
        // Switch to video scene
        this.sceneManager.switchScene('video');
        
        // Show video container with animation and play video
        setTimeout(() => {
            videoContainer.classList.add('show');
            
            // Try to play the video
            if (video) {
                video.currentTime = 0; // Reset video to start
                video.play().then(() => {
                    console.log('Video started playing');
                }).catch(error => {
                    console.log('Video autoplay failed (this is normal):', error);
                    // Show placeholder if video fails to load
                    const placeholder = document.getElementById('videoPlaceholder');
                    if (placeholder) {
                        placeholder.style.display = 'flex';
                        placeholder.innerHTML = `Video positioned: ${position}<br>Click to play`;
                        placeholder.onclick = () => {
                            video.play();
                            placeholder.style.display = 'none';
                        };
                    }
                });
            }
        }, 400);
    }
}

// Orientation Manager Class
class OrientationManager {
    constructor() {
        this.overlay = document.getElementById('orientationOverlay');
        this.appContainer = document.getElementById('appContainer');
        this.init();
    }

    init() {
        console.log('Orientation Manager initialized');
        this.checkOrientation();
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.checkOrientation(), 100);
        });
        
        window.addEventListener('resize', () => {
            this.checkOrientation();
        });
    }

    checkOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        
        if (isMobile && isLandscape) {
            this.overlay.style.display = 'flex';
            this.appContainer.style.display = 'none';
            console.log('Landscape orientation detected - showing overlay');
        } else {
            this.overlay.style.display = 'none';
            this.appContainer.style.display = 'block';
            console.log('Portrait orientation - hiding overlay');
        }
    }
}

// App Class
class InteractiveAdApp {
    constructor() {
        this.sceneManager = null;
        this.galleryManager = null;
        this.orientationManager = null;
        this.init();
    }

    init() {
        console.log('Initializing Interactive Ad App');
        
        // Initialize managers
        this.orientationManager = new OrientationManager();
        this.sceneManager = new SceneManager();
        this.galleryManager = new GalleryManager(this.sceneManager);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Log initial load
        EventTracker.log('ad_load');
        console.log('App initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // CTA Button
        const ctaButton = document.getElementById('ctaButton');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                console.log('CTA button clicked');
                EventTracker.log('user_interaction:cta_click');
                alert('CTA Clicked!');
            });
        }

        // Back button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                console.log('Back button clicked');
                this.sceneManager.switchScene('gallery');
                
                // Hide video container and pause video
                const videoContainer = document.getElementById('videoContainer');
                const video = document.getElementById('productVideo');
                videoContainer.classList.remove('show');
                
                if (video) {
                    video.pause();
                }
            });
        }

        // Window resize tracking
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                EventTracker.log('window_resize', {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, 250);
        });

        // Page visibility tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                EventTracker.log('page_hide');
            }
        });

        // Beforeunload event
        window.addEventListener('beforeunload', () => {
            EventTracker.log('page_hide');
        });

        console.log('Event listeners setup complete');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting app');
    try {
        new InteractiveAdApp();
    } catch (error) {
        console.error('Error starting app:', error);
    }
});

// Fallback initialization
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, starting app immediately');
    try {
        new InteractiveAdApp();
    } catch (error) {
        console.error('Error starting app:', error);
    }
}