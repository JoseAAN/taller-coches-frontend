<template>
    <div class="filter-box">
        <div class="d-flex align-items-center justify-content-between mb-4">
            <h3 class="filter-title m-0">
                <i class="pi pi-filter-fill me-2"></i>Filtros
            </h3>
            <button class="text-reset-link" @click="resetFilters">Limpiar todo</button>
        </div>

        <div class="filter-group">
            <label class="filter-label">Categoría</label>
            <div class="select-wrapper">
                <select v-model="filters.category" class="custom-select">
                    <option value="">Todas las categorías</option>
                    <option v-for="cat in categories" :key="cat" :value="cat">
                        {{ cat.name }}
                    </option>
                </select>
                <i class="pi pi-chevron-down select-icon"></i>
            </div>
        </div>

        <div class="filter-group mb-4">
            <label class="filter-label">Rango de Precio</label>

            <div class="price-slider-container mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="range-type">Mínimo</span>
                    <span class="price-badge">{{ filters.minPrice }} €</span>
                </div>
                <div class="range-track-wrap">
                    <input
                        type="range"
                        class="custom-range"
                        min="0"
                        max="1000"
                        step="10"
                        v-model.number="filters.minPrice"
                        @input="validatePrices('min')"
                    />
                </div>
            </div>

            <div class="price-slider-container">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="range-type">Máximo</span>
                    <span class="price-badge">{{ filters.maxPrice }} €</span>
                </div>
                <div class="range-track-wrap">
                    <input
                        type="range"
                        class="custom-range"
                        min="0"
                        max="1000"
                        step="10"
                        v-model.number="filters.maxPrice"
                        @input="validatePrices('max')"
                    />
                </div>
            </div>

            <div class="range-limits mt-2">
                <span>0 €</span>
                <span>1.000 €</span>
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <button class="btn-apply-filters" @click="applyFilters">
                Aplicar filtros
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductFilter',
    data() {
        return {
            filters: {
                category: '',
                minPrice: 0,
                maxPrice: 1000
            },
            categories: []
        }
    },
    methods: {
        applyFilters() {
            this.$emit('filter-changed', { ...this.filters });
        },
        resetFilters() {
            this.filters.category = '';
            this.filters.minPrice = 0;
            this.filters.maxPrice = 1000;
            this.applyFilters();
        },
        getCategories() {
            fetch(`${this.$BASE_URL}/v1/categories`)
                .then(response => response.json())
                .then(data => {
                    this.categories = data;
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
        },
        validatePrices(slider) {
            if (slider === 'min' && this.filters.minPrice > this.filters.maxPrice) {
                this.filters.minPrice = this.filters.maxPrice;
            } else if (slider === 'max' && this.filters.maxPrice < this.filters.minPrice) {
                this.filters.maxPrice = this.filters.minPrice;
            }
        }
    },
    mounted() {
        this.getCategories();
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ─── CONTENEDOR ─────────────────────────────────────────── */
.filter-box {
    background: var(--nav-bg, #fff);
    padding: 1.8rem;
    border-radius: 20px;
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    color: var(--nav-text, #0a1f33);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
    font-family: 'DM Sans', sans-serif;
    transition: background 0.3s ease, border-color 0.3s ease;
}

/* ─── TÍTULO ─────────────────────────────────────────────── */
.filter-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--nav-text, #0a1f33);
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

/* ─── BOTÓN LIMPIAR ──────────────────────────────────────── */
.text-reset-link {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--nav-text, #0a1f33);
    opacity: 0.35;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 100px;
    transition: opacity 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.text-reset-link:hover {
    opacity: 1;
    color: #e63946;
    background: rgba(230, 57, 70, 0.07);
}

/* ─── GRUPOS ─────────────────────────────────────────────── */
.filter-group {
    margin-bottom: 1.6rem;
}

/* ─── LABELS ─────────────────────────────────────────────── */
.filter-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--nav-text, #0a1f33);
    opacity: 0.45;
    margin-bottom: 0.75rem;
}

/* ─── SELECT ─────────────────────────────────────────────── */
.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.custom-select {
    width: 100%;
    padding: 11px 40px 11px 18px;
    border-radius: 12px;
    border: 1.5px solid var(--nav-border, rgba(0, 0, 0, 0.11));
    background: var(--nav-bg, #fff);
    color: var(--nav-text, #0a1f33);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 400;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-select:focus {
    border-color: #52b155;
    box-shadow: 0 0 0 4px rgba(82, 177, 85, 0.12);
}

.select-icon {
    position: absolute;
    right: 14px;
    font-size: 0.75rem;
    pointer-events: none;
    color: var(--nav-text, #0a1f33);
    opacity: 0.45;
}

[data-theme='dark'] .custom-select option {
    background-color: var(--nav-bg);
    color: var(--nav-text);
}

/* ─── SLIDER CONTAINER ───────────────────────────────────── */
.price-slider-container {
    /* Contraste claro: gris neutro muy visible sobre el fondo del modal */
    background: rgba(0, 0, 0, 0.04);
    padding: 16px 18px;
    border-radius: 14px;
    border: 1.5px solid rgba(0, 0, 0, 0.09);
    transition: border-color 0.3s ease, background 0.3s ease;
}

/* Contraste dark: ligeramente más claro que el fondo oscuro */
[data-theme='dark'] .price-slider-container {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.09);
}

.price-slider-container:focus-within {
    border-color: rgba(82, 177, 85, 0.4);
    background: rgba(82, 177, 85, 0.04);
}

.range-type {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--nav-text, #0a1f33);
    opacity: 0.6;
}

/* ─── PRICE BADGE ────────────────────────────────────────── */
.price-badge {
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    /* Fondo verde sólido + texto blanco: contraste máximo dentro de la paleta */
    color: #fff;
    background: #52b155;
    padding: 3px 14px;
    border-radius: 100px;
    letter-spacing: 0.01em;
    min-width: 64px;
    text-align: center;
}

/* ─── RANGE TRACK WRAPPER ────────────────────────────────── */
/* Wrapper con altura fija para que el thumb siempre quede centrado */
.range-track-wrap {
    display: flex;
    align-items: center;
    height: 24px;       /* altura igual al thumb → centrado perfecto */
    width: 100%;
}

/* ─── RANGE SLIDER ───────────────────────────────────────── */
.custom-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.12);
    outline: none;
    cursor: pointer;
    display: block;
    margin: 0;          /* sin márgenes extra — el wrapper ya centra */
}

[data-theme='dark'] .custom-range {
    background: rgba(255, 255, 255, 0.15);
}

/* WebKit track */
.custom-range::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 100px;
}

/* WebKit thumb — margin-top centra el thumb (⌀24px) sobre el track (4px) */
.custom-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    margin-top: -9px;   /* (4px track - 22px thumb) / 2 = -9px */
    background: #52b155;
    border: 3px solid var(--nav-bg, #fff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(82, 177, 85, 0.4);
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.25s ease;
}

.custom-range::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 7px rgba(82, 177, 85, 0.15), 0 2px 8px rgba(82, 177, 85, 0.4);
}

.custom-range:active::-webkit-slider-thumb {
    transform: scale(1.3);
    box-shadow: 0 0 0 10px rgba(82, 177, 85, 0.1), 0 2px 8px rgba(82, 177, 85, 0.4);
}

/* Firefox */
.custom-range::-moz-range-track {
    height: 4px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.12);
}

.custom-range::-moz-range-thumb {
    width: 22px;
    height: 22px;
    background: #52b155;
    border: 3px solid var(--nav-bg, #fff);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(82, 177, 85, 0.4);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.custom-range::-moz-range-thumb:hover {
    transform: scale(1.2);
}

/* ─── LÍMITES ────────────────────────────────────────────── */
.range-limits {
    display: flex;
    justify-content: space-between;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 400;
    color: var(--nav-text, #0a1f33);
    opacity: 0.35;
    padding: 0 2px;
}

/* ─── BOTÓN APLICAR ──────────────────────────────────────── */
.btn-apply-filters {
    width: 100%;
    background: #52b155;
    color: #fff;
    border: none;
    padding: 13px 28px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        background 0.25s ease;
}

.btn-apply-filters:hover {
    background: #3d9640;
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(82, 177, 85, 0.4);
}

.btn-apply-filters:active {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(82, 177, 85, 0.3);
}
</style>