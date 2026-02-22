(function() {
  function getSvgSize(svg) {
    var w = svg.getAttribute('width');
    var h = svg.getAttribute('height');
    if (w && h) {
      w = parseFloat(w);
      h = parseFloat(h);
      if (!isNaN(w) && !isNaN(h)) return { w: w, h: h };
    }
    var box = svg.getBBox && svg.getBBox();
    if (box) return { w: box.width, h: box.height };
    return { w: 800, h: 600 };
  }

  function openDiagramModal(sourceMermaidDiv) {
    var overlay = document.createElement('div');
    overlay.className = 'diagram-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Diagramma ingrandito');

    var svgEl = sourceMermaidDiv.querySelector('svg');
    if (!svgEl) return;

    var size = getSvgSize(svgEl);
    var svgW = size.w;
    var svgH = size.h;

    var modalHtml = [
      '<div class="diagram-modal">',
      '  <div class="diagram-modal-toolbar">',
      '    <button type="button" class="diagram-modal-btn diagram-modal-zoom-in" title="Zoom avanti" aria-label="Zoom avanti"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>',
      '    <button type="button" class="diagram-modal-btn diagram-modal-zoom-out" title="Zoom indietro" aria-label="Zoom indietro"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>',
      '    <button type="button" class="diagram-modal-btn diagram-modal-reset" title="Adatta alla finestra" aria-label="Adatta alla finestra"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></button>',
      '    <span class="diagram-modal-spacer"></span>',
      '    <button type="button" class="diagram-modal-btn diagram-modal-close" title="Chiudi" aria-label="Chiudi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>',
      '  </div>',
      '  <div class="diagram-modal-content">',
      '    <div class="diagram-modal-scalable">',
      '      <div class="diagram-modal-inner"></div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    overlay.innerHTML = modalHtml;

    var inner = overlay.querySelector('.diagram-modal-inner');
    var scalable = overlay.querySelector('.diagram-modal-scalable');
    var clone = sourceMermaidDiv.cloneNode(true);
    clone.classList.add('diagram-modal-clone');
    inner.appendChild(clone);

    var modalScale = 1;
    var scaleToFit = 1;
    var maxScale = 8;
    var minScale = 0.2;

    function getContentArea() {
      var content = overlay.querySelector('.diagram-modal-content');
      if (!content) return { w: 800, h: 600 };
      return { w: content.clientWidth, h: content.clientHeight };
    }

    function computeScaleToFit() {
      var area = getContentArea();
      if (area.w <= 0 || area.h <= 0) return 1;
      var sx = area.w / svgW;
      var sy = area.h / svgH;
      return Math.min(sx, sy);
    }

    function applyScale(scale) {
      modalScale = Math.max(minScale, Math.min(maxScale, scale));
      scaleToFit = computeScaleToFit();
      var w = svgW * modalScale;
      var h = svgH * modalScale;
      scalable.style.width = w + 'px';
      scalable.style.height = h + 'px';
      inner.style.width = svgW + 'px';
      inner.style.height = svgH + 'px';
      inner.style.transform = 'scale(' + modalScale + ')';
      inner.style.transformOrigin = '0 0';
    }

    function fitToView() {
      scaleToFit = computeScaleToFit();
      applyScale(scaleToFit);
    }

    overlay.querySelector('.diagram-modal-zoom-in').addEventListener('click', function() {
      applyScale(modalScale * 1.25);
    });
    overlay.querySelector('.diagram-modal-zoom-out').addEventListener('click', function() {
      applyScale(modalScale / 1.25);
    });
    overlay.querySelector('.diagram-modal-reset').addEventListener('click', fitToView);
    overlay.querySelector('.diagram-modal-close').addEventListener('click', closeModal);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    function closeModal() {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') closeModal();
    }

    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKeyDown);

    requestAnimationFrame(function() {
      fitToView();
    });

    window.addEventListener('resize', function onResize() {
      if (!document.body.contains(overlay)) {
        window.removeEventListener('resize', onResize);
        return;
      }
      fitToView();
    });
  }

  function wrapMermaidDiagrams() {
    document.querySelectorAll('div.mermaid').forEach(function(mermaidDiv) {
      var parent = mermaidDiv.parentElement;
      if (parent && !parent.classList.contains('diagram-viewer-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'diagram-viewer-wrapper';
        wrapper.innerHTML = [
          '<div class="diagram-viewer-container">',
          '  <div class="diagram-toolbar">',
          '    <button class="diagram-button" data-action="zoom-in" title="Zoom in">',
          '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>',
          '    </button>',
          '    <button class="diagram-button" data-action="zoom-out" title="Zoom out">',
          '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>',
          '    </button>',
          '    <button class="diagram-button" data-action="reset" title="Reset zoom">',
          '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>',
          '    </button>',
          '    <div class="diagram-spacer"></div>',
          '    <button class="diagram-button" data-action="fullscreen" title="Schermo intero">',
          '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>',
          '    </button>',
          '  </div>',
          '  <div class="diagram-content-wrapper" title="Doppio clic per aprire in finestra ingrandita">',
          '    ' + mermaidDiv.outerHTML,
          '  </div>',
          '</div>',
          '<p class="diagram-hint">Doppio clic sul diagramma per ingrandirlo in una finestra</p>'
        ].join('');
        parent.replaceChild(wrapper, mermaidDiv);

        var container = wrapper.querySelector('.diagram-viewer-container');
        var contentWrapper = wrapper.querySelector('.diagram-content-wrapper');
        var buttons = wrapper.querySelectorAll('.diagram-button');
        var currentScale = 1;

        contentWrapper.addEventListener('dblclick', function(e) {
          e.preventDefault();
          var mermaidInWrapper = contentWrapper.querySelector('.mermaid');
          if (mermaidInWrapper) openDiagramModal(mermaidInWrapper);
        });

        buttons.forEach(function(button) {
          button.addEventListener('click', function(e) {
            e.preventDefault();
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
            fullscreenBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
            fullscreenBtn.title = 'Esci da schermo intero';
          } else {
            container.classList.remove('fullscreen');
            var fullscreenBtn = wrapper.querySelector('[data-action="fullscreen"]');
            fullscreenBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
            fullscreenBtn.title = 'Schermo intero';
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(wrapMermaidDiagrams, 800);
    });
  } else {
    setTimeout(wrapMermaidDiagrams, 800);
  }
})();
