class LanguageSwitcher {
  constructor() {
    this.currentLanguage = getCurrentLanguage();
    this.setupButton();
    this.initializePageLanguage();
  }

  initializePageLanguage() {
    // Set initial page language based on saved preference
    this.translatePage();
  }

  setupButton() {
    const button = document.getElementById('languageToggle');
    if (button) {
      button.addEventListener('click', () => this.toggleLanguage());
      this.updateButtonText();
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
    setLanguage(this.currentLanguage);
    this.updateButtonText();
    this.translatePage();
  }

  updateButtonText() {
    const button = document.getElementById('languageToggle');
    if (button) {
      button.textContent = this.currentLanguage === 'en' ? 'ES' : 'EN';
    }
  }

  translatePage() {
    // Translate fixed texts
    this.translateElement('heroTitle', 'myQueue');
    this.translateElement('heroDescription', 'currentPositions');
    this.translateElement('statLabel1', 'waitingFor');
    this.translateElement('statLabel2', 'newClientTime');
    this.translateElement('kofiTitle', 'skipQueue');
    this.translateElement('kofiDescription', 'priorityDescription');
    this.translateElement('kofiLink', 'kofiButton');
    this.translateElement('queueTitle', 'currentQueue');
    this.translateElement('postsTitle', 'news');
    this.translateElement('footerText', 'copyright');
    
    // Modal labels
    this.translateElement('descriptionLabel', 'description');
    this.translateElement('statusLabel', 'status');
    this.translateElement('estimatedLabel', 'estimatedTimeFor');
    this.translateElement('accumulatedLabel', 'accumulatedTime');
    this.translateElement('createdLabel', 'createdDate');
    this.translateElement('modalButton', 'passToQueue');

    // Re-render queue and posts with new translations
    if (typeof renderQueue === 'function' && currentQueue.length > 0) {
      renderQueue();
    }
    if (typeof renderPosts === 'function' && postsContainer.innerHTML) {
      // Reload posts
      loadPosts();
    }

    // Re-render empty states
    if (typeof calculateEstimatedTime === 'function') {
      calculateEstimatedTime();
    }
  }

  translateElement(elementId, translationKey) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = getTranslation(translationKey, this.currentLanguage);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('languageToggle')) {
    new LanguageSwitcher();
  }
});
