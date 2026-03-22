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
      <span class="invoice-count">{{ infoInvoices.length }} factura{{ infoInvoices.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- LISTADO FACTURAS -->
    <div class="invoices-list">
      <div
        v-for="(invoice, index) in infoInvoices"
        :key="index"
        class="invoice-card"
      >
        <div class="invoice-card-left">
          <div class="invoice-icon-wrap">
            <span class="material-symbols-outlined">receipt</span>
          </div>
          <div>
            <p class="invoice-number"># {{ invoice.invoiceNumber }}</p>
            <p class="invoice-meta">{{ invoice.created_at }}</p>
            <p class="invoice-products-count">{{ invoice.items.length }} item{{ invoice.items.length !== 1 ? 's' : '' }}</p>
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
      selectedInvoice: null
    }
  },
  computed: {
    // Filtra solo los items de tipo "product" de la factura seleccionada
    productItems() {
      if (!this.selectedInvoice) return []
      return this.selectedInvoice.items.filter(item => item.type === 'product')
    },
    // Filtra solo los items de tipo "appointment" de la factura seleccionada
    appointmentItems() {
      if (!this.selectedInvoice) return []
      return this.selectedInvoice.items.filter(item => item.type === 'appointment')
    }
  },
  methods: {
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
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #52b155;
    box-shadow: 0 4px 12px rgba(82, 177, 85, 0.12);
  }
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
  margin: 0 0 2px 0;
}

.invoice-products-count {
  font-size: 0.82rem;
  color: var(--nav-text);
  opacity: 0.5;
  margin: 0;
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

/* ── ITEMS EN MODAL ── */
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

  // Las citas tienen un toque azulado al hover
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

/* Detalles de cita (fecha, matrícula) */
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

/* ── TOTAL ── */
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