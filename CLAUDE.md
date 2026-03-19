# CLAUDE.md — Plan Canal Moderno SCORE 2026

## Contexto del proyecto

Presentación interactiva para el directorio de **SCORE Energy** (marca de bebidas energéticas, Chile) sobre el **Plan de Canal Moderno 2026**.
El output final es una **página web estática** desplegada en Vercel.

---

## Stack Técnico

- **HTML + CSS + JavaScript vanilla** (sin npm, sin build step)
- **GSAP + ScrollTrigger** (CDN) para animaciones y transiciones basadas en scroll
- **Chart.js** (CDN) para gráficos interactivos
- **Google Fonts** para tipografía
- **Deploy:** Vercel (sitio estático)

---

## Arquitectura de archivos

```
/index.html                          → landing minimalista (portada/cover)
/brands/score/index.html             → la presentación completa
/brands/score/css/theme.css          → estilos específicos de SCORE
/brands/score/js/main.js             → lógica específica
/brands/score/assets/                → imágenes y videos
/shared/css/base.css                 → estilos compartidos (reset, layout, utilidades)
/shared/js/core.js                   → funciones compartidas (contadores, progreso)
/data/score.json                     → todos los datos numéricos separados del HTML
/vercel.json                         → rewrites para URLs limpias
```

---

## Reglas de diseño

- **Landing page:** Sí, pero minimalista y limpia — funciona como portada/cover. Fondo oscuro, logo SCORE grande, tagline, un botón CTA para entrar a la presentación. Sin exceso de elementos.
- Estilo scroll continuo con secciones `min-height: 100vh`, animaciones GSAP basadas en scroll (ScrollTrigger + scrub)
- Diseño oscuro / premium, coherente con la estética de una marca de bebidas energéticas
- Gráficos interactivos (hover, tooltips) con Chart.js
- Responsive: funciona tanto en pantalla grande (directorio) como en móvil
- Referencia visual: https://test-presentacion-brasil.vercel.app/ (misma plataforma)

---

## Paleta de colores (confirmada desde logos)

```css
:root {
  --color-bg:           #080808;       /* negro profundo */
  --color-surface:      #111111;       /* superficies/cards */
  --color-border:       rgba(255,255,255,0.08);
  --color-accent:       #F4FF00;       /* amarillo eléctrico SCORE — color principal del logo */
  --color-accent-dim:   rgba(244,255,0,0.12);
  --color-text:         #ffffff;
  --color-text-muted:   #888888;
  --font-display:       'Bebas Neue', sans-serif;   /* títulos grandes */
  --font-primary:       'Inter', sans-serif;         /* cuerpo y datos */
}
```

---

## Identidad visual SCORE (confirmada desde assets)

- **Logo principal:** Wordmark "SCORE" en amarillo eléctrico (#F4FF00), bold, con flecha ↑ integrada en la "O"
- **Logo extendido:** "SCORE" amarillo + "ENERGY DRINK" en blanco ghost/outline a la derecha
- **Isotipo:** Cápsula/píldora vertical con flecha ↑ adentro, todo en amarillo
- **Estilo:** Bold, energético, high-contrast — negro + amarillo es el ADN visual
- **Productos en Assets:** Original (negro/amarillo), Gorilla (negro/morado), Mango, Mojito, Bubble Gum, Fruit Punch, Radical White, Zero Gorilla, Score Water (variantes)

---

## Inventario de Assets disponibles

### Logos e Isotipos
- `Logo SCORE Original (sin fondo).png` ✅ — wordmark amarillo sin fondo
- `Logo SCORE Extendido (sin fondo).png` ✅ — wordmark + "ENERGY DRINK"
- `Isotipo.png` ✅ — cápsula con flecha, sin fondo
- `logo score 2.png` ✅
- `Logo_SCORE_alta.webp` ✅
- `Brand-score.ai`, `Isotipo Score amarillo ok.ai`, `LOGOTIPO_SCORE Amarillo Blanco.ai` (vectores, no usables directamente en web)

### Imágenes de Productos (fondo transparente, 2000x2000)
- Original, Gorilla, Zero Gorilla, Mango, Mojito, Bubble Gum, Fruit Punch, Radical White ✅
- Score Water (Sin Gas, Con Gas, Limón, Aloe Vera) ✅

### Etiquetas Hero
- Versiones planas de etiquetas de varios sabores ✅

### Exhibiciones Supermercados (fotos in-store)
| Cadena | Imágenes disponibles |
|--------|---------------------|
| Walmart | 3 ✅ |
| Jumbo | 2 ✅ |
| Tottus | 3 ✅ |
| Unimarc | 3 ✅ |
| Santa Isabel | ❌ pendiente |
| Easy | ❌ pendiente |

### Logos de cadenas
- No subidos aún — ver decisión de diseño abajo

---

## Decisiones de diseño web

| Elemento | Decisión |
|----------|----------|
| Landing page | Sí — minimalista, tipo portada/cover, fondo oscuro, logo SCORE + CTA |
| Easy en Plan Cadenas | NO incluir KPIs/datos — solo aparece en Canal Imagen como card con foto |
| Easy en Canal Imagen | Card con foto placeholder hasta recibir imagen |
| Santa Isabel en Canal Imagen | Card con foto placeholder hasta recibir imagen |
| Logos cadenas | Usar CSS styled badges como fallback — confirmar si usuario sube logos |
| Slide 21 (Easy incompleta) | Excluida de la sección de planes — solo aparece en Canal Imagen |
| KAS 3 y KAS 4 | Marcados como "contrataciones propuestas" con highlight especial |
| Datos en JSON | Todos los números vienen de `/data/score.json`, no hardcodeados |

---

## Fases de trabajo

### Fase 1 — Lectura y extracción ✅ COMPLETADA
- Leer el PPTX base con la skill `anthropic-skills:pptx`
- Extraer toda la información: textos, datos, estructura, gráficos
- Documentar los hallazgos en el CLAUDE.md

### Fase 2 — Descripción y prompt base ✅ COMPLETADA
- Claude entregó párrafo detallado con toda la descripción
- Prompt técnico base recibido del usuario y refinado en conjunto
- Estructura de secciones validada
- Assets revisados y colores confirmados

### Fase 3 — Construcción base HTML/CSS ← PRÓXIMA
- Armar estructura completa (landing + presentación)
- Tipografía, colores, layout de todas las secciones
- Sin gráficos Chart.js aún — layout y contenido estático

### Fase 4 — Gráficos e interactividad
- Implementar gráficos con Chart.js
- Animaciones GSAP + ScrollTrigger
- Efecto hover Canal Imagen
- Afinar detalles de diseño

### Fase 5 — QA y deploy
- Revisión visual completa
- Responsive check
- Integrar assets faltantes (Santa Isabel, Easy)
- Deploy en Vercel

---

## Reglas de trabajo con archivos

- **NUNCA modificar** el archivo original: `PLAN CANAL MODERNO SCORE 2026.pptx`
- Todos los archivos nuevos (HTML, CSS, JS, assets) van en el directorio del proyecto
- Mantener un checklist de progreso en cada respuesta

---

## Contenido de la presentación — Estructura de secciones web

### 0. Landing page (index.html)
- Fondo negro, logo SCORE centrado, animación de entrada sutil
- Tagline: "Plan Canal Moderno 2026"
- Botón CTA: "Ver Presentación →" → navega a /brands/score/

### 1. Hero / Cover
- Título: "PLAN CANAL MODERNO 2026"
- Subtítulo: "SCORE Energy Drink"
- Logo + animación de entrada al cargar (GSAP)
- Fondo oscuro con efecto visual energético

### 2. Resumen 2025 — El punto de partida
- 3 KPIs con contadores animados: **5,9M latas · 12% MS · 3er player**
- Contexto: "Cerramos 2025 como el tercer jugador del mercado energético chileno"

### 3. Proyección 2026 — La meta
- 3 KPIs con contadores animados: **9,3M latas · 17% MS · +55% crecimiento**
- Comparación visual 2025 → 2026

### 4. Mercado Canal Moderno — Ventas por cadena
Gráfico barras agrupadas (Chart.js) — 2025 vs 2026:

**En CLP (millones):**
| Cadena | 2025 | 2026 |
|--------|------|------|
| Walmart+Tottus | $34.946M | $43.683M |
| Unimarc | $14.591M | $16.051M |
| Santa Isabel | $12.243M | $13.467M |
| Jumbo | $12.180M | $12.545M |

**En Unidades:**
| Cadena | 2025 | 2026 |
|--------|------|------|
| Walmart+Tottus | 23.411.610 | 29.264.512 |
| Unimarc | 8.832.215 | 9.715.437 |
| Santa Isabel | 7.897.360 | 8.687.096 |
| Jumbo | 7.519.738 | 7.745.330 |

### 5. Distribución del mercado — Pie chart
| Cadena | Share |
|--------|-------|
| Walmart+Tottus | 48% |
| Unimarc | 18% |
| Santa Isabel | 16% |
| Jumbo | 14% |
| Tottus | 5% |

### 6. Plan por Cadena — Cards individuales
(6 cards activas + 1 "Próximamente" para Easy)

| Cadena | Proy. UN | Crec. | MS | Precio neto | SKUs | Iniciativas clave |
|--------|----------|-------|----|-------------|------|-------------------|
| Walmart+Tottus | 5.355.312 | +53% | 21% (+3pp) | $395 | 7 | Grip Lista 1/Tráfico 2/Lista 4, buen espacio góndola y frío |
| Unimarc | 919.000 | +69% | 12% (+5pp) | $361 | 5 | 8/12 meses con grip, objetivo Share Fair en espacios |
| Santa Isabel | 1.248.000 | +76% | 14% (+5pp) | $361 | 5 | Circuitos 40 islas Sep-Dic, aumento dotación 50 salas top |
| Jumbo | 1.041.500 | +232% | 11% (+7pp) | $381 | 3 | Inclusión radical, reposición externa 50 salas, supervisor dedicado |
| Tottus | 660.000 | +90% | 21% (+3pp) | $436 | 5 | Incluir Bubble en línea, plan inversión trimestral |
| Cabeceras Walmart | — | — | — | — | — | 8 salas anuales, agencia externa, imagen de marca |
| Easy | — | — | — | — | — | 🔒 Próximamente |

### 7. Equipo Canal Moderno — Organigrama
- GTE Supermercados → Negociación, Promocionalidad, Crecimiento, GTM, Surtido
- CPFR/KAM → Forecasting, DOH/In-Stock/FR, Abastecimientos
- KAS 1 · KAS 2 · KAS 3 · KAS 4 → Gestión en sala, Reposición, POP, Espacios
- Practicante → Pedidos, Sell-In, Logística, Automatización con IA

### 8. Supervisores — Actual vs Buscado
**ACTUAL:**
| Supervisor | Q Salas | Q Venta | % Vol |
|------------|---------|---------|-------|
| ELIO | 64 | 219.814 | 50,0% |
| ALVARO | 52 | 219.782 | 50,0% |
Cadenas: LIDER 66 · JUMBO 20 · SISA 10 · TOTTUS 10 · UNIMARC 10
→ 439.569 UN supervisadas · 26% RM · 12% Chile

**BUSCADO:**
| Supervisor | Q Salas | Q Venta | % Vol |
|------------|---------|---------|-------|
| ELIO | 54 | 205.441 | 14,7% |
| ALVARO | 50 | 221.122 | 15,8% |
| KAS 3 (nuevo) | 50 | 79.813 | 5,7% |
| KAS 4 (nuevo) | 50 | 889.399 | 63,7% |
Cadenas: LIDER 76 · JUMBO 20 · SISA 20 · TOTTUS 30 · UNIMARC 10 · ALVI 24 · CENTRAL MAYORISTA 5 · ACUENTA 21
→ 1.395.775 UN supervisadas · 84% RM · 39% Chile

### 9. Canal Imagen — Exhibiciones en punto de venta
Cards interactivas con hover para revelar foto:
- Walmart ✅ (3 fotos)
- Unimarc ✅ (3 fotos)
- Santa Isabel ❌ (placeholder)
- Jumbo ✅ (2 fotos)
- Tottus ✅ (3 fotos)
- Easy ❌ (placeholder)

### 10. Cierre
- Sección pinneada
- KPIs finales animados: 9,3M latas · 17% MS · +55% crecimiento
- Logo SCORE grande centrado
- Tagline: "SCORE 2026 — Cerrando la brecha"

---

## Assets pendientes del usuario

- [ ] Foto exhibición Santa Isabel
- [ ] Foto exhibición Easy
- [ ] Logos de cadenas (Walmart/Lider, Unimarc, Santa Isabel, Jumbo, Tottus, Easy) — opcional, se puede usar CSS styled badges como fallback
