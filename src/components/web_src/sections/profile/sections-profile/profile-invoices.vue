<template>
  <div v-if="!infoInvoices?.length" class="loading-state">
    <span class="material-symbols-outlined loading-icon">hourglass_empty</span>
    <p class="loading-text">No tienes facturas de carrito.</p>
  </div>

  <div v-else class="invoices-wrapper">

    <div class="page-header">
      <div class="d-flex align-items-center gap-2">
        <span class="material-symbols-outlined header-icon">shopping_bag</span>
        <h4 class="page-title">Mis Compras</h4>
      </div>
      <span class="invoice-count">{{ filteredInvoices.length }} de {{ infoInvoices.length }} factura{{ infoInvoices.length !== 1 ? 's' : '' }}</span>
    </div>

    <div class="controls-wrapper">

      <!-- Buscador -->
      <div class="search-row">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Buscar por número, fecha o importe…"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="btn-clear-search">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!--filtro por tipo -->
      <div class="filter-row">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          class="filter-chip"
          :class="{ active: activeFilter === chip.value, [`active--${chip.color}`]: activeFilter === chip.value }"
          @click="activeFilter = chip.value"
        >
          <span class="chip-dot" :class="`chip-dot--${chip.color}`"></span>
          {{ chip.label }}
        </button>
      </div>

    </div>

    <!-- Meta de resultados -->
    <p v-if="searchQuery || activeFilter !== 'all'" class="results-meta">
      {{ filteredInvoices.length }} resultado{{ filteredInvoices.length !== 1 ? 's' : '' }} encontrado{{ filteredInvoices.length !== 1 ? 's' : '' }}
    </p>

    <!-- Sin resultados -->
    <div v-if="!filteredInvoices.length" class="no-results">
      <span class="material-symbols-outlined">search_off</span>
      <p>No se encontraron facturas con los filtros aplicados.</p>
    </div>

    <!-- LISTADO FACTURAS -->
    <div v-else class="invoices-list">
      <div
        v-for="(invoice, index) in filteredInvoices"
        :key="invoice.id"
        class="invoice-card"
        :style="{ animationDelay: `${index * 55}ms` }"
      >
        <div class="invoice-card-left">
          <div class="invoice-icon-wrap">
            <span class="material-symbols-outlined">receipt</span>
          </div>
          <div>
            <p class="invoice-number"># {{ invoice.invoiceNumber }}</p>
            <p class="invoice-meta">{{ invoice.created_at }}</p>
            <!-- Tags de tipo de contenido -->
            <div class="type-tags">
              <span v-if="hasType(invoice, 'product')" class="type-tag type-tag--product">
                <span class="material-symbols-outlined">inventory_2</span>
                Productos
              </span>
              <span v-if="hasType(invoice, 'appointment')" class="type-tag type-tag--service">
                <span class="material-symbols-outlined">home_repair_service</span>
                Servicios
              </span>
            </div>
          </div>
        </div>

        <div class="invoice-card-right">
          <span class="invoice-total">{{ invoice.total }} €</span>
          <button @click="openInvoice(invoice)" class="btn-view">
            <span class="material-symbols-outlined">visibility</span>
            Ver detalle
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- MODAL DETALLE FACTURA -->
  <Transition name="modal">
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">

        <div class="modal-header">
          <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined" style="color: #52b155; font-size: 22px;">receipt</span>
            <div>
              <h5 class="modal-title">Factura # {{ selectedInvoice?.invoiceNumber }}</h5>
              <p class="modal-subtitle">{{ selectedInvoice?.created_at }}</p>
            </div>
          </div>
          <button @click="closeModal" class="btn-close-modal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">

          <!-- PRODUCTOS -->
          <template v-if="productItems.length">
            <p class="modal-section-title">
              <span class="material-symbols-outlined section-icon">inventory_2</span>
              Productos
            </p>
            <div class="product-list">
              <div
                v-for="(product, pIndex) in productItems"
                :key="pIndex"
                class="product-row"
              >
                <div class="product-row-left">
                  <div class="product-icon-wrap product-icon-wrap--product">
                    <span class="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div>
                    <p class="product-name">{{ product.name }}</p>
                    <div class="product-tags">
                      <span
                        v-for="(cat, cIndex) in product.categories"
                        :key="cIndex"
                        class="product-category"
                      >
                        {{ cat }}
                      </span>
                    </div>
                    <p class="product-qty">{{ product.price }} € × {{ product.quantity }} uds.</p>
                  </div>
                </div>
                <span class="product-price">{{ product.subtotal }} €</span>
              </div>
            </div>
          </template>

          <!-- CITAS -->
          <template v-if="appointmentItems.length">
            <p class="modal-section-title" :style="{ marginTop: productItems.length ? '1.5rem' : '0' }">
              <span class="material-symbols-outlined section-icon">calendar_month</span>
              Citas / Servicios
            </p>
            <div class="product-list">
              <div
                v-for="(appt, aIndex) in appointmentItems"
                :key="aIndex"
                class="product-row product-row--appointment"
              >
                <div class="product-row-left">
                  <div class="product-icon-wrap product-icon-wrap--appointment">
                    <span class="material-symbols-outlined">home_repair_service</span>
                  </div>
                  <div class="appt-info">
                    <p class="product-name">{{ appt.service }}</p>
                    <div class="appointment-detail">
                      <span class="material-symbols-outlined appt-icon">calendar_today</span>
                      <span>{{ appt.appointment_date }}</span>
                    </div>
                    <div class="appointment-detail">
                      <span class="material-symbols-outlined appt-icon">directions_car</span>
                      <span>{{ appt.vehicle }}</span>
                    </div>
                    <p class="product-qty">{{ appt.price }} € × {{ appt.quantity }}</p>
                  </div>
                </div>
                <span class="product-price">{{ appt.subtotal }} €</span>
              </div>
            </div>
          </template>

          <!-- TOTAL -->
          <div class="modal-total">
            <span class="modal-total-label">Total pagado</span>
            <span class="modal-total-value">{{ selectedInvoice?.total }} €</span>
          </div>

        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">
            <span class="material-symbols-outlined">close</span>
            Cerrar
          </button>
        </div>

      </div>
    </div>
  </Transition>

</template>

<script>
export default {
  props: {
    infoInvoices: { type: Array, default: () => [] }
  },
  emits: ['infoUser-update'],

  data() {
    return {
      showModal: false,
      selectedInvoice: null,
      searchQuery: '',
      activeFilter: 'all',
      filterChips: [
        { value: 'all',     label: 'Todas',          color: 'neutral' },
        { value: 'product', label: 'Con productos',   color: 'green'   },
        { value: 'service', label: 'Con servicios',   color: 'blue'    },
      ]
    }
  },

  computed: {
    filteredInvoices() {
      return this.infoInvoices.filter(invoice => {
        //Filtro texto
        const term = this.searchQuery.trim().toLowerCase()
        const matchesSearch = !term
          || invoice.invoiceNumber?.toLowerCase().includes(term)
          || invoice.created_at?.toLowerCase().includes(term)
          || invoice.total?.toString().includes(term)

        // Filtro por tipo 
        const matchesType =
          this.activeFilter === 'all'
          || (this.activeFilter === 'product'  && this.hasType(invoice, 'product'))
          || (this.activeFilter === 'service'  && this.hasType(invoice, 'appointment'))

        return matchesSearch && matchesType
      })
    },

    productItems() {
      if (!this.selectedInvoice) return []
      return (this.selectedInvoice.items || []).filter(item => item.type === 'product')
    },

    appointmentItems() {
      if (!this.selectedInvoice) return []
      return (this.selectedInvoice.items || []).filter(item => item.type === 'appointment')
    }
  },

  methods: {
    //Comprueba si una factura tiene items de un tipo dado
    hasType(invoice, type) {
      if (!invoice.items?.length) return false
      return invoice.items.some(item => item.type === type)
    },

    openInvoice(invoice) {
      this.selectedInvoice = invoice
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedInvoice = null
    }
  }
}
</script>

<style lang="scss" scoped>
.invoices-wrapper {
  padding: 2rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

/* ── HEADER ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.header-icon { font-size: 28px; color: #52b155; }

.page-title {
  font-size: 1.3rem;
  font-weight: 850;
  color: var(--nav-text);
  letter-spacing: -0.5px;
  margin: 0;
}

.invoice-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--nav-text);
  opacity: 0.5;
  background-color: var(--nav-border, #f0f0f0);
  padding: 4px 12px;
  border-radius: 20px;
}

/* ── CONTROLES ── */
.controls-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1.25rem;
}

.search-row {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 20px;
  color: var(--nav-text);
  opacity: 0.4;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 44px;
  border-radius: 10px;
  border: 1.5px solid var(--nav-border, #ddd);
  background-color: var(--nav-bg);
  color: var(--nav-text);
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { opacity: 0.4; }

  &:focus {
    outline: none;
    border-color: #52b155;
    box-shadow: 0 0 0 3px rgba(82, 177, 85, 0.12);
  }
}

.btn-clear-search {
  position: absolute;
  right: 10px;
  border: none;
  background: transparent;
  color: var(--nav-text);
  opacity: 0.4;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  .material-symbols-outlined { font-size: 18px; }
  &:hover { opacity: 1; }
}

/* ── CHIPS DE FILTRO ── */
.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--nav-border, #ddd);
  background: transparent;
  color: var(--nav-text);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;

  &:hover { opacity: 1; border-color: currentColor; }

  &.active {
    opacity: 1;

    &--neutral { border-color: var(--nav-text); }
    &--green   { border-color: #52b155; color: #52b155; background: rgba(82, 177, 85, 0.08); }
    &--blue    { border-color: #5b8fd4; color: #5b8fd4; background: rgba(91, 143, 212, 0.08); }
  }
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &--neutral { background: var(--nav-text); opacity: 0.5; }
  &--green   { background: #52b155; }
  &--blue    { background: #5b8fd4; }
}

/* ── META RESULTADOS ── */
.results-meta {
  font-size: 0.8rem;
  color: var(--nav-text);
  opacity: 0.45;
  margin-bottom: 1rem;
}

/* ── SIN RESULTADOS ── */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: var(--nav-text);
  opacity: 0.5;
  text-align: center;

  .material-symbols-outlined { font-size: 48px; color: #52b155; }
  p { font-size: 0.9rem; font-weight: 500; margin: 0; }
}

/* ── LISTA ── */
.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invoice-card {
  background-color: var(--nav-bg);
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  // Animación de entrada escalonada
  animation: cardSlideIn 0.22s ease both;
  transition: border-color 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    border-color: #52b155;
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.12);
    transform: translateY(-1px);
  }
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.invoice-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.invoice-icon-wrap {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background-color: rgba(82, 177, 85, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .material-symbols-outlined { font-size: 24px; color: #52b155; }
}

.invoice-number {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
  margin: 0 0 2px 0;
}

.invoice-meta {
  font-size: 0.78rem;
  color: var(--nav-text);
  opacity: 0.4;
  margin: 0 0 6px 0;
}

/* ── TAGS DE TIPO ── */
.type-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;

  .material-symbols-outlined { font-size: 13px; }

  &--product {
    background: rgba(82, 177, 85, 0.1);
    color: #3b6d11;
  }

  &--service {
    background: rgba(91, 143, 212, 0.12);
    color: #185fa5;
  }
}

.invoice-card-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.invoice-total {
  font-size: 1.1rem;
  font-weight: 850;
  color: #52b155;
  letter-spacing: -0.5px;
}

.btn-view {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 2px solid var(--nav-text);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 18px; }

  &:hover {
    background-color: var(--nav-text);
    color: var(--nav-bg);
  }
}

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background-color: var(--nav-bg);
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--nav-border, #ddd);
  position: sticky;
  top: 0;
  background-color: var(--nav-bg);
  z-index: 1;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--nav-text);
  margin: 0 0 2px 0;
}

.modal-subtitle {
  font-size: 0.78rem;
  color: var(--nav-text);
  opacity: 0.45;
  margin: 0;
}

.btn-close-modal {
  border: none;
  background: transparent;
  color: var(--nav-text);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;

  .material-symbols-outlined { font-size: 22px; }
  &:hover { opacity: 1; }
}

.modal-body { padding: 1.5rem; }

.modal-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--nav-text);
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
}

.section-icon { font-size: 16px; }

.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
}

.product-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--nav-border, #ddd);
  border-radius: 10px;
  transition: border-color 0.2s ease;

  &:hover { border-color: #52b155; }
  &--appointment:hover { border-color: #5b8fd4; }
}

.product-row-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.product-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  .material-symbols-outlined { font-size: 20px; }

  &--product {
    background-color: rgba(82, 177, 85, 0.1);
    .material-symbols-outlined { color: #52b155; }
  }

  &--appointment {
    background-color: rgba(91, 143, 212, 0.12);
    .material-symbols-outlined { color: #5b8fd4; }
  }
}

.product-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--nav-text);
  margin: 0 0 5px 0;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 5px;
}

.product-category {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background-color: var(--nav-border, #f0f0f0);
  color: var(--nav-text);
  opacity: 0.7;
}

.product-qty {
  font-size: 0.78rem;
  color: var(--nav-text);
  opacity: 0.45;
  margin: 0;
}

.appt-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.appointment-detail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--nav-text);
  opacity: 0.65;
  margin-bottom: 4px;
  line-height: 1.3;

  span:last-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.appt-icon {
  font-size: 15px;
  color: #5b8fd4;
  opacity: 1;
  flex-shrink: 0;
}

.product-price {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
  white-space: nowrap;
  padding-top: 2px;
}

.modal-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  margin-top: 1.2rem;
  background-color: rgba(82, 177, 85, 0.08);
  border: 1.5px solid #52b155;
  border-radius: 10px;
}

.modal-total-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--nav-text);
}

.modal-total-value {
  font-size: 1.2rem;
  font-weight: 850;
  color: #52b155;
  letter-spacing: -0.5px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--nav-border, #ddd);
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  border: 2px solid var(--nav-border, #ddd);
  background: transparent;
  color: var(--nav-text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  .material-symbols-outlined { font-size: 18px; }
  &:hover { background-color: var(--nav-border, #f0f0f0); }
}

/* ── LOADING ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: var(--nav-text);
  opacity: 0.5;
}

.loading-icon { font-size: 52px; color: #52b155; margin-bottom: 1rem; }
.loading-text { font-weight: 600; }

/* ── ANIMACIÓN MODAL ── */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* ── RESPONSIVE ── */
@media (max-width: 576px) {
  .invoices-wrapper { padding: 1rem; }
  .invoice-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .invoice-card-right { width: 100%; justify-content: space-between; }
}
</style>