/* =============================================================
   MAIN.JS — SCORE Energy Drink Plan Canal Moderno 2026
   Main presentation JavaScript
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   INLINE FALLBACK DATA (used when fetch fails on file:// protocol)
   --------------------------------------------------------------- */
var FALLBACK_DATA = {
  kpis2025: { latas: 5.9, marketShare: 12, posicion: 3 },
  kpis2026: { latas: 9.3, marketShare: 17, crecimiento: 55 },
  ventasCLP: {
    labels: ["Walmart+Tottus", "Unimarc", "Santa Isabel", "Jumbo"],
    "2025": [34946, 14591, 12243, 12180],
    "2026": [43683, 16051, 13467, 12545]
  },
  ventasUN: {
    labels: ["Walmart+Tottus", "Unimarc", "Santa Isabel", "Jumbo"],
    "2025": [23411610, 8832215, 7897360, 7519738],
    "2026": [29264512, 9715437, 8687096, 7745330]
  },
  marketShareCadenas: {
    labels: ["Walmart+Tottus", "Unimarc", "Santa Isabel", "Jumbo", "Tottus"],
    values: [48, 18, 16, 14, 5]
  },
  planesCadena: [
    { nombre: "Walmart+Tottus", key: "walmart", proyeccionUN: 5355312, crecimiento: 53, ms: 21, msDelta: 3, precioNeto: 395, skus: 7, iniciativas: ["Grip Lista 1 / Tráfico 2 / Lista 4", "Buen espacio en góndola y frío", "7 SKUs de línea activos"] },
    { nombre: "Unimarc", key: "unimarc", proyeccionUN: 919000, crecimiento: 69, ms: 12, msDelta: 5, precioNeto: 361, skus: 5, iniciativas: ["8/12 meses con grip activo", "Objetivo Share Fair en espacios", "Expansión de surtido"] },
    { nombre: "Santa Isabel", key: "santaisabel", proyeccionUN: 1248000, crecimiento: 76, ms: 14, msDelta: 5, precioNeto: 361, skus: 5, iniciativas: ["Circuitos 40 islas Sep-Dic", "Aumento dotación 50 salas top", "Activaciones focalizadas"] },
    { nombre: "Jumbo", key: "jumbo", proyeccionUN: 1041500, crecimiento: 232, ms: 11, msDelta: 7, precioNeto: 381, skus: 3, iniciativas: ["Inclusión radical de surtido", "Reposición externa en 50 salas", "Supervisor dedicado por cadena"] },
    { nombre: "Tottus", key: "tottus", proyeccionUN: 660000, crecimiento: 90, ms: 21, msDelta: 3, precioNeto: 436, skus: 5, iniciativas: ["Incluir Bubble en línea", "Plan inversión trimestral", "Islas / Pantallas / Ecommerce / Degustaciones"] },
    { nombre: "Cabeceras Walmart", key: "cabeceras", proyeccionUN: null, crecimiento: null, ms: null, msDelta: null, precioNeto: null, skus: null, iniciativas: ["8 salas anuales con agencia externa", "Activación imagen de marca", "Cabeceras premium en salas clave"] }
  ],
  supervisorActual: {
    supervisores: [
      { nombre: "ELIO", salas: 64, venta: 219814, volPct: 50.0, nuevo: false },
      { nombre: "ÁLVARO", salas: 52, venta: 219782, volPct: 50.0, nuevo: false }
    ],
    cadenas: [
      { nombre: "Lider", salas: 66 }, { nombre: "Jumbo", salas: 20 },
      { nombre: "Sta. Isabel", salas: 10 }, { nombre: "Tottus", salas: 10 }, { nombre: "Unimarc", salas: 10 }
    ],
    volSupervisado: 439569, pctRM: 26, pctChile: 12
  },
  supervisorBuscado: {
    supervisores: [
      { nombre: "ELIO", salas: 54, venta: 205441, volPct: 14.7, nuevo: false },
      { nombre: "ÁLVARO", salas: 50, venta: 221122, volPct: 15.8, nuevo: false },
      { nombre: "KAS 3", salas: 50, venta: 79813, volPct: 5.7, nuevo: true },
      { nombre: "KAS 4", salas: 50, venta: 889399, volPct: 63.7, nuevo: true }
    ],
    cadenas: [
      { nombre: "Lider", salas: 76 }, { nombre: "Jumbo", salas: 20 },
      { nombre: "Sta. Isabel", salas: 20 }, { nombre: "Tottus", salas: 30 },
      { nombre: "Unimarc", salas: 10 }, { nombre: "Alvi", salas: 24 },
      { nombre: "Central Mayorista", salas: 5 }, { nombre: "Acuenta", salas: 21 }
    ],
    volSupervisado: 1395775, pctRM: 84, pctChile: 39
  }
};

/* ---------------------------------------------------------------
   CHART DEFAULTS
   --------------------------------------------------------------- */
var CHART_COLORS = {
  walmart:    '#0071CE',
  unimarc:    '#003087',
  santaisabel:'#CC0000',
  jumbo:      '#F47920',
  tottus:     '#E30613'
};

var PIE_COLORS = ['#F4FF00', '#4A90E2', '#E24A4A', '#E28A4A', '#E24A7A'];

/* ---------------------------------------------------------------
   STATE
   --------------------------------------------------------------- */
var data = null;
var chartsInitialized = { clp: false, un: false, pie: false };
var chartInstances = {};

/* ---------------------------------------------------------------
   LOAD DATA
   --------------------------------------------------------------- */
function loadData() {
  // Determine base path for JSON
  var jsonPath = '/data/score.json';

  // For file:// protocol, use relative path
  if (window.location.protocol === 'file:') {
    jsonPath = '../../data/score.json';
  }

  return fetch(jsonPath)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .catch(function() {
      console.warn('SCORE: Using fallback data (fetch unavailable or failed)');
      return FALLBACK_DATA;
    });
}

/* ---------------------------------------------------------------
   HERO ENTRANCE ANIMATION
   --------------------------------------------------------------- */
function initHeroAnimation() {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof gsap === 'undefined') return;

  var logo = document.getElementById('heroLogo');
  var headline = document.getElementById('heroHeadline');
  var subtitle = document.getElementById('heroSubtitle');

  if (!logo || !headline) return;

  gsap.set([logo, headline, subtitle], { opacity: 0 });
  gsap.set(logo, { y: -40 });
  gsap.set(headline, { y: 50 });
  gsap.set(subtitle, { y: 20 });

  var tl = gsap.timeline({ delay: 0.3 });
  tl.to(logo,     { opacity: 1, y: 0, duration: 1,    ease: 'power3.out' })
    .to(headline,  { opacity: 1, y: 0, duration: 0.9,  ease: 'power2.out' }, '-=0.5')
    .to(subtitle,  { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.4');
}

/* ---------------------------------------------------------------
   KPI COUNTERS
   --------------------------------------------------------------- */
function initKPICounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var counterEls = document.querySelectorAll('[data-counter]');
  counterEls.forEach(function(el) {
    var target   = parseFloat(el.dataset.counter);
    var prefix   = el.dataset.prefix  || '';
    var suffix   = el.dataset.suffix  || '';
    var decimals = target % 1 !== 0 ? 1 : 0;
    var triggered = false;

    ScrollTrigger.create({
      trigger: el.closest('.section') || el,
      start: 'top 80%',
      onEnter: function() {
        if (triggered) return;
        triggered = true;
        ScoreCore.animateCounter(el, target, 1.5, prefix, suffix, decimals);
      }
    });
  });
}

/* ---------------------------------------------------------------
   CHART: BAR — CLP
   --------------------------------------------------------------- */
function initChartCLP(d) {
  var ctx = document.getElementById('chartCLP');
  if (!ctx || chartsInitialized.clp) return;
  chartsInitialized.clp = true;

  var isDark = true;
  Chart.defaults.color = '#888888';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

  chartInstances.clp = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.ventasCLP.labels,
      datasets: [
        {
          label: '2025',
          data: d.ventasCLP['2025'],
          backgroundColor: 'rgba(255,255,255,0.18)',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: '2026',
          data: d.ventasCLP['2026'],
          backgroundColor: '#F4FF00',
          borderColor: '#F4FF00',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#888888',
            font: { family: 'Inter', size: 12 },
            boxWidth: 12,
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17,17,17,0.95)',
          borderColor: 'rgba(244,255,0,0.3)',
          borderWidth: 1,
          titleColor: '#ffffff',
          bodyColor: '#888888',
          padding: 12,
          callbacks: {
            label: function(ctx) {
              return ' ' + ctx.dataset.label + ': $' + ScoreCore.formatNumber(ctx.raw) + 'M';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666666',
            font: { family: 'Inter', size: 11 },
            maxRotation: 30
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: {
            color: '#666666',
            font: { family: 'Inter', size: 11 },
            callback: function(v) { return '$' + ScoreCore.formatNumber(v) + 'M'; }
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

/* ---------------------------------------------------------------
   CHART: BAR — Unidades
   --------------------------------------------------------------- */
function initChartUN(d) {
  var ctx = document.getElementById('chartUN');
  if (!ctx || chartsInitialized.un) return;
  chartsInitialized.un = true;

  chartInstances.un = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.ventasUN.labels,
      datasets: [
        {
          label: '2025',
          data: d.ventasUN['2025'],
          backgroundColor: 'rgba(255,255,255,0.18)',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: '2026',
          data: d.ventasUN['2026'],
          backgroundColor: '#F4FF00',
          borderColor: '#F4FF00',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#888888',
            font: { family: 'Inter', size: 12 },
            boxWidth: 12,
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17,17,17,0.95)',
          borderColor: 'rgba(244,255,0,0.3)',
          borderWidth: 1,
          titleColor: '#ffffff',
          bodyColor: '#888888',
          padding: 12,
          callbacks: {
            label: function(ctx) {
              return ' ' + ctx.dataset.label + ': ' + ScoreCore.formatNumber(ctx.raw) + ' UN';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666666',
            font: { family: 'Inter', size: 11 },
            maxRotation: 30
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: {
            color: '#666666',
            font: { family: 'Inter', size: 11 },
            callback: function(v) {
              if (v >= 1000000) return (v/1000000).toFixed(0) + 'M';
              if (v >= 1000) return (v/1000).toFixed(0) + 'K';
              return v;
            }
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

/* ---------------------------------------------------------------
   CHART: PIE — Distribución por Cadena
   --------------------------------------------------------------- */
function initChartPie(d) {
  var ctx = document.getElementById('chartPie');
  if (!ctx || chartsInitialized.pie) return;
  chartsInitialized.pie = true;

  var labels = d.marketShareCadenas.labels;
  var values = d.marketShareCadenas.values;

  chartInstances.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: PIE_COLORS,
        borderColor: '#080808',
        borderWidth: 3,
        hoverBorderColor: 'rgba(244,255,0,0.5)',
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      animation: {
        animateRotate: true,
        duration: 1200,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17,17,17,0.95)',
          borderColor: 'rgba(244,255,0,0.3)',
          borderWidth: 1,
          titleColor: '#ffffff',
          bodyColor: '#888888',
          padding: 12,
          callbacks: {
            label: function(ctx) {
              return ' ' + ctx.label + ': ' + ctx.raw + '%';
            }
          }
        }
      }
    }
  });

  // Build custom legend
  var legend = document.getElementById('pieLegend');
  if (legend) {
    legend.innerHTML = '';
    labels.forEach(function(label, i) {
      var item = document.createElement('div');
      item.className = 'pie-legend-item';
      item.innerHTML =
        '<div class="pie-legend-dot" style="background:' + PIE_COLORS[i] + '"></div>' +
        '<span class="pie-legend-name">' + label + '</span>' +
        '<span class="pie-legend-pct">' + values[i] + '%</span>';
      legend.appendChild(item);
    });
  }
}

/* ---------------------------------------------------------------
   CHARTS SCROLL OBSERVER
   --------------------------------------------------------------- */
function initChartObservers(d) {
  ScoreCore.observeOnce(document.getElementById('mercado'), function() {
    initChartCLP(d);
    initChartUN(d);
  }, 0.15);

  ScoreCore.observeOnce(document.getElementById('distribucion'), function() {
    initChartPie(d);
  }, 0.15);
}

/* ---------------------------------------------------------------
   PLANES POR CADENA
   --------------------------------------------------------------- */
function renderPlanes(d) {
  var grid = document.getElementById('planesGrid');
  if (!grid) return;

  grid.innerHTML = '';

  d.planesCadena.forEach(function(plan) {
    var card = document.createElement('div');
    var isCabeceras = plan.key === 'cabeceras';
    card.className = 'chain-card' + (isCabeceras ? ' chain-card--cabeceras' : '');

    // Chain color for top border
    var colorMap = {
      walmart:    'var(--color-walmart)',
      unimarc:    'var(--color-unimarc)',
      santaisabel:'var(--color-santaisabel)',
      jumbo:      'var(--color-jumbo)',
      tottus:     'var(--color-tottus)',
      cabeceras:  'var(--color-cabeceras)'
    };
    card.style.setProperty('--chain-color', colorMap[plan.key] || 'var(--color-accent)');

    var kpisHtml = '';
    if (!isCabeceras && plan.proyeccionUN !== null) {
      var isJumbo = plan.crecimiento >= 200;
      kpisHtml = '<div class="chain-card__kpis">' +
        '<div class="chain-kpi">' +
          '<span class="chain-kpi__value">' + ScoreCore.formatNumber(plan.proyeccionUN) + '</span>' +
          '<span class="chain-kpi__label">UN proyectadas</span>' +
        '</div>' +
        '<div class="chain-kpi chain-kpi--highlight' + (isJumbo ? ' chain-kpi--jumbo' : '') + '">' +
          '<span class="chain-kpi__value">+' + plan.crecimiento + '%</span>' +
          '<span class="chain-kpi__label">vs año anterior</span>' +
        '</div>' +
        '<div class="chain-kpi">' +
          '<span class="chain-kpi__value">' + plan.ms + '%</span>' +
          '<span class="chain-kpi__label">Market Share <span class="delta">+' + plan.msDelta + 'pp</span></span>' +
        '</div>' +
        '<div class="chain-kpi">' +
          '<span class="chain-kpi__value">$' + plan.precioNeto + '</span>' +
          '<span class="chain-kpi__label">precio neto</span>' +
        '</div>' +
      '</div>';
    } else if (isCabeceras) {
      kpisHtml = '<div class="chain-card__kpis" style="grid-template-columns:1fr">' +
        '<div class="chain-kpi">' +
          '<span class="chain-kpi__value" style="font-size:var(--text-lg)">Imagen de Marca</span>' +
          '<span class="chain-kpi__label">8 salas anuales · Agencia externa</span>' +
        '</div>' +
      '</div>';
    }

    var initiativesHtml = plan.iniciativas.map(function(ini) {
      return '<li class="chain-card__initiative">' + ini + '</li>';
    }).join('');

    card.innerHTML =
      '<div class="chain-card__header">' +
        '<span class="chain-badge chain-badge--' + plan.key + '">' + plan.nombre + '</span>' +
      '</div>' +
      kpisHtml +
      '<ul class="chain-card__initiatives">' + initiativesHtml + '</ul>';

    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------------
   SUPERVISORES
   --------------------------------------------------------------- */
function renderSupervisores(d) {
  // Actual
  var actualContainer = document.getElementById('supActualRows');
  if (actualContainer) {
    actualContainer.innerHTML = '';
    d.supervisorActual.supervisores.forEach(function(s) {
      var row = document.createElement('div');
      row.className = 'supervisor-row';
      row.innerHTML =
        '<span class="supervisor-name">' + s.nombre + '</span>' +
        '<span class="supervisor-salas">' + s.salas + ' salas</span>' +
        '<span class="supervisor-vol">' + ScoreCore.formatNumber(s.venta) + '</span>' +
        '<span class="supervisor-pct">' + s.volPct + '%</span>';
      actualContainer.appendChild(row);
    });
  }

  // Buscado
  var buscadoContainer = document.getElementById('supBuscadoRows');
  if (buscadoContainer) {
    buscadoContainer.innerHTML = '';
    d.supervisorBuscado.supervisores.forEach(function(s) {
      var row = document.createElement('div');
      row.className = 'supervisor-row';
      var newBadge = s.nuevo ? '<span class="badge badge--new" style="margin-left:auto;margin-right:var(--space-2)">Nuevo</span>' : '';
      row.innerHTML =
        '<span class="supervisor-name">' + s.nombre + '</span>' +
        '<span class="supervisor-salas">' + s.salas + ' salas</span>' +
        newBadge +
        '<span class="supervisor-vol">' + ScoreCore.formatNumber(s.venta) + '</span>' +
        '<span class="supervisor-pct" style="' + (s.nuevo ? 'color:var(--color-success)' : '') + '">' + s.volPct + '%</span>';
      buscadoContainer.appendChild(row);
    });
  }
}

/* ---------------------------------------------------------------
   SUPERVISORES COVERAGE BAR ANIMATION
   --------------------------------------------------------------- */
function initCoverageAnimation(d) {
  var barActual  = document.getElementById('coverageActual');
  var barBuscado = document.getElementById('coverageBuscado');
  var section    = document.getElementById('supervisores');

  if (!section) return;

  ScoreCore.observeOnce(section, function() {
    if (barActual) {
      setTimeout(function() {
        barActual.style.width = d.supervisorActual.pctRM + '%';
      }, 300);
    }
    if (barBuscado) {
      setTimeout(function() {
        barBuscado.style.width = d.supervisorBuscado.pctRM + '%';
      }, 600);
    }
  }, 0.2);
}

/* ---------------------------------------------------------------
   ORG CHART ANIMATION
   --------------------------------------------------------------- */
function initOrgChartAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var section = document.getElementById('equipo');
  if (!section) return;

  var nodes = section.querySelectorAll('.org-node');
  if (!nodes.length) return;

  gsap.set(nodes, { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    onEnter: function() {
      gsap.to(nodes, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  });
}

/* ---------------------------------------------------------------
   CANAL IMAGEN — PHOTO CAROUSEL
   --------------------------------------------------------------- */
function initImagenCards() {
  var cards = document.querySelectorAll('.imagen-card[data-chain]');

  cards.forEach(function(card) {
    var photos = card.querySelectorAll('.imagen-photo');
    var dots   = card.querySelectorAll('.imagen-dot');
    if (!photos.length) return;

    var currentIndex = 0;
    var timer = null;

    function showPhoto(index) {
      photos.forEach(function(p, i) {
        p.classList.toggle('active', i === index);
      });
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function nextPhoto() {
      showPhoto((currentIndex + 1) % photos.length);
    }

    // Auto-rotate on hover
    card.addEventListener('mouseenter', function() {
      if (photos.length > 1) {
        timer = setInterval(nextPhoto, 1800);
      }
    });

    card.addEventListener('mouseleave', function() {
      clearInterval(timer);
      showPhoto(0);
    });

    // Dot click
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        clearInterval(timer);
        showPhoto(i);
      });
    });

    // Keyboard
    card.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        clearInterval(timer);
        showPhoto((currentIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        clearInterval(timer);
        var prev = (currentIndex - 1 + photos.length) % photos.length;
        showPhoto(prev);
      }
    });
  });
}

/* ---------------------------------------------------------------
   NAV DOTS
   --------------------------------------------------------------- */
function initNavDots() {
  var dots    = document.querySelectorAll('.nav-dot');
  var sections = document.querySelectorAll('.section[id]');

  // Click handler
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var targetId = dot.dataset.target;
      var el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll handler — update active dot
  if (typeof IntersectionObserver === 'undefined') return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        dots.forEach(function(dot) {
          dot.classList.toggle('active', dot.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function(section) {
    observer.observe(section);
  });
}

/* ---------------------------------------------------------------
   CIERRE SECTION PIN (ScrollTrigger)
   --------------------------------------------------------------- */
function initCierre() {
  if (typeof ScrollTrigger === 'undefined') return;
  // Cierre is purely declarative with scroll reveal; no additional pin needed
  // KPI counters in cierre section are handled by initKPICounters
}

/* ---------------------------------------------------------------
   MAIN INITIALIZATION
   --------------------------------------------------------------- */
function init(d) {
  data = d;

  // Register ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Progress bar
  ScoreCore.initProgressBar();

  // Hero
  initHeroAnimation();

  // Scroll reveal for data-reveal elements
  ScoreCore.initScrollReveal();

  // KPI counters
  initKPICounters();

  // Nav section label updater
  var sections = document.querySelectorAll('.section[data-section-title]');
  var navLabel = document.getElementById('navSectionLabel');
  ScoreCore.initNavSectionUpdater(sections, navLabel);

  // Nav dots
  initNavDots();

  // Planes
  renderPlanes(d);

  // Supervisores
  renderSupervisores(d);
  initCoverageAnimation(d);

  // Org chart
  initOrgChartAnimation();

  // Charts (deferred until scroll)
  initChartObservers(d);

  // Canal Imagen
  initImagenCards();

  // Cierre
  initCierre();
}

/* ---------------------------------------------------------------
   BOOTSTRAP
   --------------------------------------------------------------- */
loadData().then(init);
