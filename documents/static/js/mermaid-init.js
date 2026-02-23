(function() {
  var MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';

  function findMermaidContainers() {
    var seen = new Set();
    var out = [];
    var containers = document.querySelectorAll('div[class*="language-mermaid"]');
    containers.forEach(function(div) {
      if (div.getAttribute('data-mermaid-done')) return;
      var pre = div.querySelector('pre');
      var t = pre && pre.textContent && pre.textContent.trim();
      if (t && (t.indexOf('erDiagram') !== -1 || t.indexOf('graph') !== -1) && !seen.has(div)) {
        seen.add(div);
        out.push({ container: div, pre: pre });
      }
    });
    if (out.length > 0) return out;
    var pres = document.querySelectorAll('pre[class*="language-mermaid"]');
    pres.forEach(function(pre) {
      var container = pre.closest('[class*="language-mermaid"]');
      if (container && container.getAttribute('data-mermaid-done')) return;
      var t = pre.textContent && pre.textContent.trim();
      if (t && (t.indexOf('erDiagram') !== -1 || t.indexOf('graph') !== -1)) {
        var c = container || pre.parentElement || pre;
        if (!seen.has(c)) {
          seen.add(c);
          out.push({ container: c, pre: pre });
        }
      }
    });
    return out;
  }

  function getMermaidCode(pre) {
    var text = pre.textContent || pre.innerText || '';
    return text.replace(/\s*$/g, '').replace(/<br\s*\/?>/gi, '\n');
  }

  function transformCodeBlocksToMermaid() {
    var pairs = findMermaidContainers();
    if (pairs.length === 0) return false;

    if (typeof mermaid === 'undefined') return false;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });

    pairs.forEach(function(p) {
      if (p.container.getAttribute('data-mermaid-done')) return;
      var code = getMermaidCode(p.pre);
      if (!code.trim()) return;
      var div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code;
      p.container.setAttribute('data-mermaid-done', '1');
      if (p.container.parentNode) {
        p.container.parentNode.replaceChild(div, p.container);
      }
    });

    var toRun = document.querySelectorAll('.mermaid');
    if (toRun.length === 0) return true;

    mermaid.run({
      querySelector: '.mermaid',
      suppressErrors: true
    }).then(function() {
      loadDiagramJs();
    }).catch(function() {
      loadDiagramJs();
    });
    return true;
  }

  function loadDiagramJs() {
    if (window.__diagramJsLoaded) return;
    window.__diagramJsLoaded = true;
    var script = document.createElement('script');
    script.src = '/js/diagram.js';
    script.async = false;
    document.head.appendChild(script);
  }

  function runTransform() {
    if (transformCodeBlocksToMermaid()) return;
    loadDiagramJs();
  }

  function init() {
    if (typeof mermaid === 'undefined') {
      var script = document.createElement('script');
      script.src = MERMAID_CDN;
      script.async = false;
      script.onload = function() {
        runTransform();
      };
      script.onerror = function() {
        console.warn('Mermaid non caricato.');
        loadDiagramJs();
      };
      document.head.appendChild(script);
    } else {
      runTransform();
    }
  }

  function tryInit() {
    if (findMermaidContainers().length > 0) {
      init();
      return true;
    }
    loadDiagramJs();
    return false;
  }

  function scheduleInit() {
    tryInit();
    var attempts = [500, 1500, 3000];
    attempts.forEach(function(delay) {
      setTimeout(function() {
        if (document.querySelectorAll('.mermaid').length > 0) return;
        if (findMermaidContainers().length > 0) init();
      }, delay);
    });
    var observer = new MutationObserver(function() {
      if (document.querySelectorAll('.mermaid').length > 0) return;
      if (findMermaidContainers().length > 0) init();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function() {
      observer.disconnect();
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  } else {
    scheduleInit();
  }
})();
