/**
 * parallax.js - Parallax scrolling effect with IntersectionObserver
 * Performance optimized with single RAF loop and cached scroll position
 */

class ParallaxManager {
  constructor() {
    this.scrollY = 0;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isSaveData = navigator.connection?.saveData || false;
    this.layers = [];
    this.isAnimating = false;
    this.rafId = null;
    
    if (this.isReduced || this.isSaveData) {
      return; // Don't initialize if reduced motion or save data is enabled
    }
    
    this.init();
  }
  
  init() {
    this.cacheLayers();
    this.setupObserver();
    this.setupScrollListener();
  }
  
  cacheLayers() {
    // Cache all parallax layers
    const elements = document.querySelectorAll('[data-parallax]');
    elements.forEach(el => {
      const rate = parseFloat(el.dataset.parallax) || 0.5;
      this.layers.push({ el, rate, inView: false });
    });
  }
  
  setupObserver() {
    // Use IntersectionObserver to gate parallax work
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const layer = this.layers.find(l => l.el === entry.target);
          if (layer) {
            layer.inView = entry.isIntersecting;
            
            // Add/remove will-change based on visibility
            if (entry.isIntersecting) {
              layer.el.style.willChange = 'transform';
            } else {
              layer.el.style.willChange = 'auto';
            }
          }
        });
      },
      { threshold: 0 }
    );
    
    this.layers.forEach(layer => observer.observe(layer.el));
  }
  
  setupScrollListener() {
    // Cache scroll position
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.rafId = requestAnimationFrame(() => this.updateParallax());
      }
    }, { passive: true });
  }
  
  updateParallax() {
    this.layers.forEach(layer => {
      if (layer.inView) {
        const offset = this.scrollY * (1 - layer.rate);
        layer.el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    
    this.isAnimating = false;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParallaxManager();
  });
} else {
  new ParallaxManager();
}

/**
 * Header scroll detection for sticky header styling
 */
class StickyHeaderManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.scrollThreshold = 80; // pixels
    this.isScrolled = false;
    
    if (!this.header) return;
    
    window.addEventListener('scroll', () => this.updateHeader(), { passive: true });
  }
  
  updateHeader() {
    const scrolled = window.scrollY > this.scrollThreshold;
    
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      if (scrolled) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new StickyHeaderManager();
  });
} else {
  new StickyHeaderManager();
}
