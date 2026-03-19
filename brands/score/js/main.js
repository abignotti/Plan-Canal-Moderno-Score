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
    labels: ["Walmart", "Unimarc", "Santa Isabel", "Jumbo"],
    "2025": [34946, 14591, 12243, 12180],
    "2026": [43683, 16051, 13467, 12545]
  },
  ventasUN: {
    labels: ["Walmart", "Unimarc", "Santa Isabel", "Jumbo"],
    "2025": [23411610, 8832215, 7897360, 7519738],
    "2026": [29264512, 9715437, 8687096, 7745330]
  },
  marketShareCadenas: {
    labels: ["Walmart", "Unimarc", "Santa Isabel", "Jumbo", "Tottus"],
    values: [48, 18, 16, 14, 5],
    latas2026: [5355312, 919000, 1248000, 1041500, 660000]
  },
  planesCadena: [
    { nombre: "Walmart", key: "walmart", proyeccionUN: 5355312, crecimiento: 53, ms: 21, msDelta: 3, precioNeto: 395, skus: 7, iniciativas: ["Grip Lista 1 / Tráfico 2 / Lista 4", "Buen espacio en góndola y frío", "7 SKUs de línea activos"] },
    { nombre: "Unimarc", key: "unimarc", proyeccionUN: 919000, crecimiento: 69, ms: 12, msDelta: 5, precioNeto: 361, skus: 5, iniciativas: ["8/12 meses con grip activo", "Objetivo Share Fair en espacios", "Expansión de surtido"] },
    { nombre: "Santa Isabel", key: "santaisabel", proyeccionUN: 1248000, crecimiento: 76, ms: 14, msDelta: 5, precioNeto: 361, skus: 5, iniciativas: ["Circuitos 40 islas Sep-Dic", "Aumento dotación 50 salas top", "Activaciones focalizadas"] },
    { nombre: "Jumbo", key: "jumbo", proyeccionUN: 1041500, crecimiento: 232, ms: 11, msDelta: 7, precioNeto: 381, skus: 3, iniciativas: ["Inclusión radical de surtido", "Reposición externa en 50 salas", "Supervisor dedicado por cadena"] },
    { nombre: "Tottus", key: "tottus", proyeccionUN: 660000, crecimiento: 90, ms: 21, msDelta: 3, precioNeto: 436, skus: 5, iniciativas: ["Incluir Bubble en línea", "Plan inversión trimestral", "Islas / Pantallas / Ecommerce / Degustaciones"] },
    { nombre: "Cabeceras Jumbo", key: "cabeceras", proyeccionUN: null, crecimiento: null, ms: null, msDelta: null, precioNeto: null, skus: null, iniciativas: ["8 salas anuales con agencia externa", "Activación imagen de marca", "Cabeceras premium en salas clave"] }
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
  unimarc:    '#CE2029',
  santaisabel:'#C41230',
  jumbo:      '#009A44',
  tottus:     '#66A40B'
};

var PIE_COLORS = ['#0071CE', '#CE2029', '#C41230', '#009A44', '#66A40B'];

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
    var latas2026 = d.marketShareCadenas.latas2026 || null;
    labels.forEach(function(label, i) {
      var item = document.createElement('div');
      item.className = 'pie-legend-item';
      var latasHtml = '';
      if (latas2026 && latas2026[i]) {
        var latasVal = latas2026[i];
        var latasStr = latasVal >= 1000000
          ? (latasVal / 1000000).toFixed(1) + 'M latas'
          : Math.round(latasVal / 1000) + 'K latas';
        latasHtml = '<span class="pie-legend-latas">' + latasStr + '</span>';
      }
      item.innerHTML =
        '<div class="pie-legend-dot" style="background:' + PIE_COLORS[i] + '"></div>' +
        '<div class="pie-legend-info">' +
          '<span class="pie-legend-name">' + label + '</span>' +
          latasHtml +
        '</div>' +
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
   PLANES POR CADENA — SLIDESHOW
   --------------------------------------------------------------- */
function renderPlanes(d) {
  var track = document.getElementById('planesTrack');
  var indicators = document.getElementById('planesIndicators');
  if (!track) return;

  track.innerHTML = '';
  if (indicators) indicators.innerHTML = '';

  var colorMap = {
    walmart:    'var(--color-walmart)',
    unimarc:    'var(--color-unimarc)',
    santaisabel:'var(--color-santaisabel)',
    jumbo:      'var(--color-jumbo)',
    tottus:     'var(--color-tottus)',
    cabeceras:  'var(--color-jumbo)'
  };

  d.planesCadena.forEach(function(plan, i) {
    var slide = document.createElement('div');
    slide.className = 'planes-slide' + (i === 0 ? ' active' : '');

    var color = colorMap[plan.key] || 'var(--color-accent)';
    slide.style.setProperty('--chain-color', color);

    var isCabeceras = plan.key === 'cabeceras';

    var kpisHtml = '';
    if (!isCabeceras && plan.proyeccionUN !== null) {
      var isJumbo = plan.crecimiento >= 200;
      kpisHtml =
        '<div class="slide-kpis">' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value">' + ScoreCore.formatNumber(plan.proyeccionUN) + '</span>' +
            '<span class="slide-kpi__label">UN Proyectadas 2026</span>' +
          '</div>' +
          '<div class="slide-kpi slide-kpi--accent' + (isJumbo ? ' slide-kpi--big' : '') + '">' +
            '<span class="slide-kpi__value">+' + plan.crecimiento + '%</span>' +
            '<span class="slide-kpi__label">Crecimiento vs AA</span>' +
          '</div>' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value">' + plan.ms + '%</span>' +
            '<span class="slide-kpi__label">Market Share <span class="delta">+' + plan.msDelta + 'pp</span></span>' +
          '</div>' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value">$' + plan.precioNeto + '</span>' +
            '<span class="slide-kpi__label">Precio neto</span>' +
          '</div>' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value">' + plan.skus + '</span>' +
            '<span class="slide-kpi__label">SKUs de línea</span>' +
          '</div>' +
        '</div>';
    } else if (isCabeceras) {
      kpisHtml =
        '<div class="slide-cabeceras-image">' +
          '<img src="../../Assets/Exhibiciones Supermercados/Imagen Cabeceras.png" alt="Cabeceras Jumbo" />' +
        '</div>' +
        '<div class="slide-kpis slide-kpis--cabeceras">' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value" style="color:var(--chain-color)">8</span>' +
            '<span class="slide-kpi__label">Salas anuales</span>' +
          '</div>' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value">Agencia</span>' +
            '<span class="slide-kpi__label">Gestión externa</span>' +
          '</div>' +
          '<div class="slide-kpi">' +
            '<span class="slide-kpi__value" style="color:var(--chain-color)">Imagen</span>' +
            '<span class="slide-kpi__label">Activación de marca</span>' +
          '</div>' +
        '</div>';
    }

    var initiativesHtml = plan.iniciativas.map(function(ini) {
      return '<li class="slide-initiative">' + ini + '</li>';
    }).join('');

    slide.innerHTML =
      '<div class="slide-inner">' +
        '<div class="slide-header">' +
          '<span class="chain-badge chain-badge--' + plan.key + ' chain-badge--lg">' + plan.nombre + '</span>' +
          (plan.skus ? '<span class="slide-skus-badge">' + plan.skus + ' SKUs</span>' : '') +
        '</div>' +
        kpisHtml +
        '<ul class="slide-initiatives"><h4 class="slide-initiatives__title">Iniciativas clave</h4>' + initiativesHtml + '</ul>' +
      '</div>';

    track.appendChild(slide);

    // Indicator dot
    if (indicators) {
      var dot = document.createElement('button');
      dot.className = 'planes-indicator' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir a ' + plan.nombre);
      dot.addEventListener('click', function() { goToSlide(i); });
      indicators.appendChild(dot);
    }
  });

  initPlanesSlideshow(d.planesCadena.length);
}

function goToSlide(index) {
  var slides = document.querySelectorAll('.planes-slide');
  var dots = document.querySelectorAll('.planes-indicator');
  var total = slides.length;
  if (index < 0) index = total - 1;
  if (index >= total) index = 0;

  slides.forEach(function(s, i) { s.classList.toggle('active', i === index); });
  dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
  window._planesCurrentSlide = index;
}

function initPlanesSlideshow(total) {
  window._planesCurrentSlide = 0;

  var prevBtn = document.getElementById('planesPrev');
  var nextBtn = document.getElementById('planesNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      goToSlide((window._planesCurrentSlide - 1 + total) % total);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      goToSlide((window._planesCurrentSlide + 1) % total);
    });
  }

  // Keyboard navigation when in section
  document.addEventListener('keydown', function(e) {
    var section = document.getElementById('planes');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowRight') goToSlide((window._planesCurrentSlide + 1) % total);
    if (e.key === 'ArrowLeft')  goToSlide((window._planesCurrentSlide - 1 + total) % total);
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
      var newBadge = s.nuevo ? ' <span class="badge badge--new" style="font-size:0.55rem;vertical-align:middle;margin-left:4px">(Nuevo)</span>' : '';
      row.innerHTML =
        '<span class="supervisor-name">' + s.nombre + newBadge + '</span>' +
        '<span class="supervisor-salas">' + s.salas + ' salas</span>' +
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
   CANAL IMAGEN — PHOTO CAROUSEL + LIGHTBOX
   --------------------------------------------------------------- */
function initImagenCards() {
  var cards = document.querySelectorAll('.imagen-card[data-chain]');
  var allPhotos = []; // flat list of {url, chain} for lightbox navigation
  var lightboxOpen = false;
  var lightboxIndex = 0;

  // Build flat photo list
  cards.forEach(function(card) {
    var chain = card.getAttribute('data-chain');
    var chainLabel = card.querySelector('.chain-badge') ? card.querySelector('.chain-badge').textContent : chain;
    var photos = card.querySelectorAll('.imagen-photo');
    photos.forEach(function(p) {
      var url = p.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      if (url) allPhotos.push({ url: url, chain: chainLabel });
    });

    // Carousel on hover
    var currentIndex = 0;
    var timer = null;

    function showPhoto(index) {
      photos.forEach(function(p, i) { p.classList.toggle('active', i === index); });
      var dots = card.querySelectorAll('.imagen-dot');
      dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
      currentIndex = index;
    }

    card.addEventListener('mouseenter', function() {
      if (photos.length > 1) timer = setInterval(function() {
        showPhoto((currentIndex + 1) % photos.length);
      }, 1800);
    });
    card.addEventListener('mouseleave', function() {
      clearInterval(timer);
      showPhoto(0);
    });

    var dots = card.querySelectorAll('.imagen-dot');
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        clearInterval(timer);
        showPhoto(i);
      });
    });

    // Click → open lightbox
    card.addEventListener('click', function() {
      // Find index of current photo in allPhotos
      var chainLabel2 = card.querySelector('.chain-badge') ? card.querySelector('.chain-badge').textContent : chain;
      var activePhoto = card.querySelector('.imagen-photo.active');
      var url = activePhoto ? activePhoto.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : '';
      var idx = allPhotos.findIndex(function(p) { return p.url === url; });
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  function openLightbox(index) {
    var lb = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    if (!lb || !allPhotos.length) return;
    lightboxIndex = index;
    lightboxOpen = true;
    img.style.backgroundImage = 'url("' + allPhotos[index].url + '")';
    if (cap) cap.textContent = allPhotos[index].chain;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    lightboxOpen = false;
    document.body.style.overflow = '';
  }

  function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + allPhotos.length) % allPhotos.length;
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    if (img) img.style.backgroundImage = 'url("' + allPhotos[lightboxIndex].url + '")';
    if (cap) cap.textContent = allPhotos[lightboxIndex].chain;
  }

  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn  = document.getElementById('lightboxPrev');
  var nextBtn  = document.getElementById('lightboxNext');
  var lb       = document.getElementById('lightbox');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', function() { lightboxNav(-1); });
  if (nextBtn)  nextBtn.addEventListener('click', function() { lightboxNav(1); });
  if (lb) lb.addEventListener('click', function(e) { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', function(e) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
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
