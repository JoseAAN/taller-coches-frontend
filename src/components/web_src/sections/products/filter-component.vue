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
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="range-type">Mínimo</span>
                    <span class="price-badge">{{ filters.minPrice }} €</span>
                </div>
                <input 
                    type="range" 
                    class="custom-range" 
                    min="0" 
                    :max="filters.maxPrice" 
                    step="10" 
                    v-model="filters.minPrice"
                />
            </div>

            <div class="price-slider-container">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="range-type">Máximo</span>
                    <span class="price-badge">{{ filters.maxPrice }} €</span>
                </div>
                <input 
                    type="range" 
                    class="custom-range" 
                    :min="filters.minPrice" 
                    max="1000" 
                    step="10" 
                    v-model="filters.maxPrice"
                />
            </div>
            
            <div class="range-limits mt-2">
                <span>0€</span>
                <span>1000€</span>
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <button class="btn-apply-filters" @click="applyFilters">
                APLICAR FILTROS
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
                    console.log(this.categories);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
        },

    },
    mounted() {
        this.getCategories();
    }
}
</script>

<style scoped>
.filter-box {
    background: var(--nav-bg);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--nav-border);
    color: var(--nav-text);
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.filter-title { 
    color: var(--nav-text); 
    font-weight: 700; 
}

.filter-label { 
    display: block; 
    font-size: 0.85rem; 
    font-weight: 600; 
    text-transform: uppercase; 
    margin-bottom: 1rem; 
    color: var(--nav-text);
}

.range-type {
    font-size: 0.75rem;
    color: var(--nav-text);
    opacity: 0.8;
}

.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.custom-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--nav-border);
    background: var(--bg-color);
    color: var(--nav-text);
    appearance: none;
    outline: none;
}

.select-icon {
    position: absolute;
    right: 1rem;
    pointer-events: none;
    color: var(--nav-text);
}

.price-slider-container {
    background: rgba(128, 128, 128, 0.1); 
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--nav-border);
}

.price-badge {
    background: #52b155;
    color: white;
    padding: 2px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
}

.custom-range {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    background: var(--nav-border);
    border-radius: 5px;
    outline: none;
}

.custom-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #52b155;
    border: 3px solid var(--nav-bg);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.range-limits {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--nav-text);
    opacity: 0.6;
}

.btn-apply-filters {
    width: 100%;
    background-color: #52b155;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 10px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-apply-filters:hover {
    background-color: #469c49;
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.3);
}

.text-reset-link {
    background: none;
    border: none;
    color: #ff5c5c;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
}


[data-theme='dark'] .custom-select option {
    background-color: var(--nav-bg);
    color: var(--nav-text);
}
</style>