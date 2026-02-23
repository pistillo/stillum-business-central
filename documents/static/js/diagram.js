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
      '    <div class="diagram-modal-scroll-area">',
      '      <div class="diagram-modal-scalable">',
      '        <div class="diagram-modal-inner"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    overlay.innerHTML = modalHtml;

    var inner = overlay.querySelector('.diagram-modal-inner');
    var scalable = overlay.querySelector('.diagram-modal-scalable');
    var scrollArea = overlay.querySelector('.diagram-modal-scroll-area');
    var modalContent = overlay.querySelector('.diagram-modal-content');
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

    var modalTranslateX = 0;
    var modalTranslateY = 0;

    function applyScale(scale) {
      modalScale = Math.max(minScale, Math.min(maxScale, scale));
      scaleToFit = computeScaleToFit();
      var w = svgW * modalScale;
      var h = svgH * modalScale;
      scrollArea.style.width = w + 'px';
      scrollArea.style.height = h + 'px';
      scrollArea.style.minWidth = w + 'px';
      scrollArea.style.minHeight = h + 'px';
      scalable.style.transform = 'translate(' + modalTranslateX + 'px, ' + modalTranslateY + 'px)';
      inner.style.width = svgW + 'px';
      inner.style.height = svgH + 'px';
      inner.style.transform = 'scale(' + modalScale + ')';
      inner.style.transformOrigin = '0 0';
    }

    function applyModalPan() {
      scalable.style.transform = 'translate(' + modalTranslateX + 'px, ' + modalTranslateY + 'px)';
    }

    function fitToView() {
      scaleToFit = computeScaleToFit();
      modalTranslateX = 0;
      modalTranslateY = 0;
      applyScale(scaleToFit);
    }

    var modalDragging = false;
    var modalStartX = 0, modalStartY = 0, modalStartTx = 0, modalStartTy = 0;

    function onModalMove(e) {
      if (!modalDragging) return;
      e.preventDefault();
      modalTranslateX = modalStartTx + (e.clientX - modalStartX);
      modalTranslateY = modalStartTy + (e.clientY - modalStartY);
      applyModalPan();
    }
    function onModalUp() {
      if (!modalDragging) return;
      modalDragging = false;
      modalContent.style.cursor = '';
      document.removeEventListener('mousemove', onModalMove);
      document.removeEventListener('mouseup', onModalUp);
    }

    modalContent.addEventListener('mousedown', function(e) {
      if (e.button !== 0 || e.target.closest('button')) return;
      e.preventDefault();
      modalDragging = true;
      modalStartX = e.clientX;
      modalStartY = e.clientY;
      modalStartTx = modalTranslateX;
      modalStartTy = modalTranslateY;
      modalContent.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onModalMove);
      document.addEventListener('mouseup', onModalUp);
    });

    overlay.querySelector('.diagram-modal-zoom-in').addEventListener('click', function() {
      applyScale(modalScale * 1.25);
    });
    overlay.querySelector('.diagram-modal-zoom-out').addEventListener('click', function() {
      applyScale(modalScale / 1.25);
    });
    overlay.querySelector('.diagram-modal-reset').addEventListener('click', fitToView);
    overlay.querySelector('.diagram-modal-close').addEventListener('click', closeModal);

    function onModalWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      var delta = e.deltaY > 0 ? -1 : 1;
      var factor = 1.2;
      applyScale(modalScale * (delta > 0 ? factor : 1 / factor));
    }
    modalContent.addEventListener('wheel', onModalWheel, { passive: false, capture: true });

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
    if (!window.__diagramPreviewWheelRegistered) {
      window.__diagramPreviewWheelRegistered = true;
      document.addEventListener('wheel', function(e) {
        if (!e.ctrlKey && !e.metaKey) return;
        var container = e.target.closest('.diagram-viewer-container');
        if (!container || !container._previewZoom) return;
        if (document.getElementById('diagram-modal') && document.getElementById('diagram-modal').classList.contains('open')) return;
        e.preventDefault();
        e.stopPropagation();
        var factor = 1.2;
        var state = container._previewZoom.state;
        if (e.deltaY < 0) {
          state.currentScale = Math.min(10, state.currentScale * factor);
        } else {
          state.currentScale = Math.max(0.1, state.currentScale / factor);
        }
        container._previewZoom.applyTransform();
      }, { passive: false, capture: true });
    }

    document.querySelectorAll('div.mermaid').forEach(function(mermaidDiv) {
      var parent = mermaidDiv.parentElement;
      if (parent && !parent.classList.contains('diagram-viewer-wrapper') && !mermaidDiv.closest('.diagram-viewer-container')) {
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
          '  <div class="diagram-content-wrapper" title="Trascina per spostare. Ctrl+rotellina per zoom. Doppio clic per finestra ingrandita">',
          '    ' + mermaidDiv.outerHTML,
          '  </div>',
          '</div>',
          '<p class="diagram-hint">Trascina per spostare · Ctrl+rotellina per zoom · Doppio clic per aprire in finestra</p>'
        ].join('');
        parent.replaceChild(wrapper, mermaidDiv);

        var container = wrapper.querySelector('.diagram-viewer-container');
        var contentWrapper = wrapper.querySelector('.diagram-content-wrapper');
        var buttons = wrapper.querySelectorAll('.diagram-button');
        var state = { currentScale: 1, translateX: 0, translateY: 0 };

        function applyTransform() {
          contentWrapper.style.transform = 'translate(' + state.translateX + 'px, ' + state.translateY + 'px) scale(' + state.currentScale + ')';
        }

        container._previewZoom = { state: state, applyTransform: applyTransform };

        var isDragging = false;
        var startX = 0, startY = 0, startTranslateX = 0, startTranslateY = 0;

        function onPointerDown(e) {
          if (e.button !== 0 && e.type !== 'touchstart') return;
          e.preventDefault();
          isDragging = true;
          contentWrapper.classList.add('diagram-dragging');
          startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
          startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
          startTranslateX = state.translateX;
          startTranslateY = state.translateY;
        }

        function onPointerMove(e) {
          if (!isDragging) return;
          e.preventDefault();
          var x = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
          var y = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
          state.translateX = startTranslateX + (x - startX);
          state.translateY = startTranslateY + (y - startY);
          applyTransform();
        }

        function onPointerUp() {
          if (!isDragging) return;
          isDragging = false;
          contentWrapper.classList.remove('diagram-dragging');
          document.removeEventListener('mousemove', onPointerMove);
          document.removeEventListener('mouseup', onPointerUp);
          document.removeEventListener('touchmove', onPointerMove, { passive: false });
          document.removeEventListener('touchend', onPointerUp);
        }

        contentWrapper.addEventListener('mousedown', function(e) {
          if (e.target.closest('.diagram-button')) return;
          onPointerDown(e);
          document.addEventListener('mousemove', onPointerMove);
          document.addEventListener('mouseup', onPointerUp);
        });

        contentWrapper.addEventListener('touchstart', function(e) {
          if (e.touches.length !== 1) return;
          onPointerDown(e);
          document.addEventListener('touchmove', onPointerMove, { passive: false });
          document.addEventListener('touchend', onPointerUp);
        }, { passive: true });


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
              state.currentScale = Math.min(10, state.currentScale * 1.2);
              applyTransform();
            } else if (action === 'zoom-out') {
              state.currentScale = Math.max(0.1, state.currentScale * 0.8);
              applyTransform();
            } else if (action === 'reset') {
              state.currentScale = 1;
              state.translateX = 0;
              state.translateY = 0;
              applyTransform();
            } else if (action === 'fullscreen') {
              if (!document.fullscreenElement) {
                container.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }
          });
        });

        applyTransform();

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

  // Esposto globalmente per richiami esterni (es. dopo render Mermaid nativo)
  window.__wrapMermaidDiagrams = wrapMermaidDiagrams;

  function scheduleWrap() {
    wrapMermaidDiagrams();
    setTimeout(wrapMermaidDiagrams, 400);
    setTimeout(wrapMermaidDiagrams, 1000);
  }

  // Con modalità nativa Mermaid i diagrammi sono renderizzati da React dopo l'hydration.
  // MutationObserver applica il wrap anche dopo navigazione SPA quando compaiono nuovi .mermaid.
  function startMermaidObserver() {
    var debounceTimer = 0;
    function scheduleWrapDebounced() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        debounceTimer = 0;
        wrapMermaidDiagrams();
      }, 150);
    }
    var observer = new MutationObserver(function(mutations) {
      var hasAddedNodes = mutations.some(function(m) { return m.addedNodes.length > 0; });
      if (hasAddedNodes) scheduleWrapDebounced();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      scheduleWrap();
      startMermaidObserver();
    });
  } else {
    scheduleWrap();
    startMermaidObserver();
  }
})();
