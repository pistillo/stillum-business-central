document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('div.mermaid').forEach(function(mermaidDiv) {
      var parent = mermaidDiv.parentElement;
      if (parent && !parent.classList.contains('diagram-viewer-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'diagram-viewer-wrapper';
        wrapper.innerHTML = `
          <div class="diagram-viewer-container">
            <div class="diagram-toolbar">
              <button class="diagram-button" data-action="zoom-in" title="Zoom in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button class="diagram-button" data-action="zoom-out" title="Zoom out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button class="diagram-button" data-action="reset" title="Reset zoom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
              <div class="diagram-spacer"></div>
              <button class="diagram-button" data-action="fullscreen" title="Fullscreen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
            <div class="diagram-content-wrapper">
              ${mermaidDiv.outerHTML}
            </div>
          </div>
        `;
        parent.replaceChild(wrapper, mermaidDiv);

        var container = wrapper.querySelector('.diagram-viewer-container');
        var contentWrapper = wrapper.querySelector('.diagram-content-wrapper');
        var buttons = wrapper.querySelectorAll('.diagram-button');
        var currentScale = 1;

        buttons.forEach(function(button) {
          button.addEventListener('click', function(e) {
            var action = this.getAttribute('data-action');
            
            if (action === 'zoom-in') {
              currentScale = Math.min(10, currentScale * 1.2);
              contentWrapper.style.transform = 'scale(' + currentScale + ')';
            } else if (action === 'zoom-out') {
              currentScale = Math.max(0.1, currentScale * 0.8);
              contentWrapper.style.transform = 'scale(' + currentScale + ')';
            } else if (action === 'reset') {
              currentScale = 1;
              contentWrapper.style.transform = 'scale(1)';
            } else if (action === 'fullscreen') {
              if (!document.fullscreenElement) {
                container.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }
          });
        });

        document.addEventListener('fullscreenchange', function() {
          if (document.fullscreenElement) {
            container.classList.add('fullscreen');
            var fullscreenBtn = wrapper.querySelector('[data-action="fullscreen"]');
            fullscreenBtn.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            `;
          } else {
            container.classList.remove('fullscreen');
            var fullscreenBtn = wrapper.querySelector('[data-action="fullscreen"]');
            fullscreenBtn.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            `;
          }
        });
      }
    });
  }, 1000);
});
