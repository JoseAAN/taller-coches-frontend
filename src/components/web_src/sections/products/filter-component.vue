<template>
    <div class="filter-box">
        <h3>Filtros</h3>

        <div class="filter-group">
            <label>Buscar</label>
            <div class="searchBox">
                <input class="searchInput" type="text" v-model="filters.search" placeholder="Producto..."
                    @keyup.enter="applyFilters" />
                <button class="searchButton" @click="applyFilters">
                    <i class="material-symbols-outlined">search</i>
                </button>
            </div>
        </div>

        <div class="filter-group">
            <label>Categoría</label>
            <select v-model="filters.category" @change="applyFilters" class="form-select">
                <option value="">Todas las categorías</option>
                <option value="ropa">Ropa</option>
                <option value="tecnologia">Tecnología</option>
                <option value="hogar">Hogar</option>
            </select>
        </div>

        <div class="filter-group">
            <label>Precio Máximo</label>
            <input type="range" class="form-range" min="0" max="1000" step="10" v-model="filters.maxPrice" @input="applyFilters" />
            <span class="price-display">{{ filters.maxPrice }} €</span>
        </div>

        <button class="reset-btn" @click="resetFilters">Limpiar Filtros</button>
    </div>
</template>

<script>
export default {
    name: 'ProductFilter',
    data() {
        return {
            filters: {
                search: '',
                category: '',
                maxPrice: 1000
            }
        }
    },
    methods: {
        applyFilters() {
            this.$emit('filter-changed', { ...this.filters });
        },
        resetFilters() {
            this.filters.search = '';
            this.filters.category = '';
            this.filters.maxPrice = 1000;
            this.applyFilters();
        }
    }
}
</script>

<style scoped>
.filter-box {
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #eaeaea;
}

.filter-box h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #003366;
    font-size: 1.2rem;
}

.filter-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #003366;
}

.searchBox {
    position: relative;
    height: 40px;
    border-radius: 40px;
    background: #003366;
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.searchButton {
    color: white;
    width: 30px;
    height: 30px;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
}

.searchInput {
    border: none;
    background: none;
    outline: none;
    color: white;
    font-size: 0.9rem;
    width: 100%;
}

.price-display {
    font-size: 0.85rem;
    font-weight: bold;
    color: #003366;
    text-align: right;
}

.reset-btn {
    width: 100%;
    padding: 0.6rem;
    background: transparent;
    border: 1px solid #003366;
    color: #003366;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
}

.reset-btn:hover {
    background: #003366;
    color: white;
}
</style>