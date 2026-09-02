/**
 * hero.js - Hero section animation and reviews loading
 */

class HeroManager {
  constructor() {
    this.video = document.querySelector('.hero-video');
    this.reviewsSection = document.getElementById('reviews-section');
    
    // Disable video if reduced motion or save data
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = navigator.connection?.saveData || false;
    
    if (isReduced || isSaveData) {
      this.video.style.display = 'none';
    }
    
    this.loadReviews();
  }
  
  loadReviews() {
    // Load reviews from content/reviews.json
    fetch('/content/reviews.json')
      .then(response => response.json())
      .then(reviews => {
        if (Array.isArray(reviews) && reviews.length > 0) {
          this.renderReviews(reviews);
        }
      })
      .catch(error => {
        console.warn('Could not load reviews:', error);
        // Silently fail - reviews section stays hidden
      });
  }
  
  renderReviews(reviews) {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    reviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';
      
      let html = `<blockquote class="review-quote">"${this.escapeHtml(review.quote)}"</blockquote>`;
      html += `<div class="review-author">— ${this.escapeHtml(review.author)}</div>`;
      
      if (review.source) {
        html += `<div class="review-source">${this.escapeHtml(review.source)}`;
        if (review.date) {
          html += ` • ${this.escapeHtml(review.date)}`;
        }
        html += '</div>';
      }
      
      card.innerHTML = html;
      grid.appendChild(card);
    });
    
    // Show the reviews section
    this.reviewsSection.classList.remove('hidden');
  }
  
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeroManager();
  });
} else {
  new HeroManager();
}
