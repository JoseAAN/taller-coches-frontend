<template>
  <div class="ba-wrapper">
    <div class="ba-container" ref="container" @mousedown="startDrag" @touchstart="startDrag">
      <img :src="before" class="ba-img" />

      <!-- Etiqueta ANTES -->
      <span class="ba-label ba-label--before">ANTES</span>

      <div class="ba-overlay" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
        <img :src="after" class="ba-img" />
        <!-- Etiqueta DESPUÉS (se revela con el slider) -->
        <span class="ba-label ba-label--after">DESPUÉS</span>
      </div>

      <div class="ba-divider" :style="{ left: sliderPosition + '%' }">
        <div class="ba-handle d-flex align-items-center justify-content-center">
          <div class="ba-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "BeforeAfterSlider",

    props: {
        before: String,
        after: String
    },

    data() {
        return {
            sliderPosition: 50,
            dragging: false
        };
    },

    methods: {
        startDrag(e) {
            this.dragging = true;
            window.addEventListener("mousemove", this.onDrag);
            window.addEventListener("touchmove", this.onDrag);
            window.addEventListener("mouseup", this.stopDrag);
            window.addEventListener("touchend", this.stopDrag);
            this.onDrag(e);
        },

        onDrag(e) {
            if (!this.dragging) return;

            const rect = this.$refs.container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;

            let percent = ((clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));

            this.sliderPosition = percent;
        },

        stopDrag() {
            this.dragging = false;
            window.removeEventListener("mousemove", this.onDrag);
            window.removeEventListener("touchmove", this.onDrag);
            window.removeEventListener("mouseup", this.stopDrag);
            window.removeEventListener("touchend", this.stopDrag);
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

.ba-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.ba-container {
  position: relative;
  width: 100%;
  max-width: 760px;
  cursor: ew-resize;
  overflow: hidden;
  border-radius: 20px;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.12),
    0 24px 48px rgba(0, 0, 0, 0.22),
    0 2px 4px rgba(0, 0, 0, 0.08);
  background: #0a0a0a;
  /* Borde sutil premium */
  outline: 1px solid rgba(255, 255, 255, 0.08);
}

.ba-img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}

.ba-overlay {
  position: absolute;
  inset: 0;
}

/* ── Etiquetas flotantes ── */
.ba-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: absolute;
  bottom: 16px;
  pointer-events: none;
  user-select: none;
  z-index: 5;
}

.ba-label--before {
  left: 14px;
}

.ba-label--after {
  right: 14px;
}

/* ── Línea divisoria ── */
.ba-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ffffff;
  transform: translateX(-1px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.7),
    0 0 24px rgba(255, 255, 255, 0.35);
  z-index: 10;
}

/* ── Tirador glassmorphism ── */
.ba-handle {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ba-handle:hover {
  transform: scale(1.08);
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Flechas < > con pseudoelementos (reemplaza .ba-dot visualmente) */
.ba-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Flecha izquierda */
.ba-dot::before {
  content: '';
  position: absolute;
  left: 10px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid rgba(20, 20, 20, 0.85);
}

/* Flecha derecha */
.ba-dot::after {
  content: '';
  position: absolute;
  right: 10px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid rgba(20, 20, 20, 0.85);
}
</style>