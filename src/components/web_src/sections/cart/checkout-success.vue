<template>
    <div class="checkout-success">

        <div class="success-card" v-if="invoice && cartDetails">
            <div class="success-badge">
                <div class="badge-ring"></div>
                <div class="badge-ring badge-ring--delay"></div>
                <span class="material-symbols-outlined success-icon">check_circle</span>
            </div>

            <h1 class="success-title">¡Compra completada!</h1>
            <p class="success-subtitle">Gracias por tu pedido. Aquí tienes el resumen de tu factura.</p>

            <div class="invoice-box" id="print-area">
                <div class="invoice-header">
                    <div class="invoice-header-left">
                        <span class="material-symbols-outlined invoice-icon">receipt_long</span>
                        <h2>Factura</h2>
                    </div>
                    <span class="invoice-number">{{ invoice.invoice_number }}</span>
                </div>

                <div class="invoice-details">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th class="text-center">Cant.</th>
                                <th class="text-right">Precio Unit.</th>
                                <th class="text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in cartDetails.items" :key="item.id">
                                <td class="product-name">{{ item.details.name }}</td>
                                <td class="text-center">{{ item.quantity }}</td>
                                <td class="text-right">{{ item.price_at_time }} €</td>
                                <td class="text-right">{{ item.subtotal }} €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="invoice-total-row">
                    <span class="total-label">Total</span>
                    <span class="total-amount">{{ invoice.total }} €</span>
                </div>

                <div class="invoice-meta">
                    <div class="meta-item">
                        <span class="material-symbols-outlined meta-icon">calendar_today</span>
                        <span>{{ invoice.created_at || new Date().toLocaleString() }}</span>
                    </div>
                </div>
            </div>

            <div class="actions">
                <button @click="printInvoice" class="btn-action btn-print">
                    <span class="material-symbols-outlined">print</span>
                    Imprimir factura
                </button>
                <router-link to="/products" class="btn-action btn-shop">
                    <span class="material-symbols-outlined">storefront</span>
                    Volver a la tienda
                </router-link>
            </div>
        </div>

        <div v-else class="state-card">
            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Cargando información de tu factura...</p>
            </div>
            <div v-else class="error-state">
                <div class="error-badge">
                    <span class="material-symbols-outlined error-icon">error</span>
                </div>
                <h2>{{ errorTitle }}</h2>
                <p>{{ errorMessage }}</p>
                <router-link to="/products" class="btn-action btn-shop">
                    <span class="material-symbols-outlined">storefront</span>
                    Ir a la tienda
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckoutSuccess',
    data() {
        return {
            invoice: null,
            cartDetails: null,
            isLoading: true,
            errorTitle: 'No se pudo cargar tu compra',
            errorMessage: 'Ha ocurrido un problema al recuperar la factura.'
        }
    },
    methods: {
        async fetchInvoice() {
            try {
                this.isLoading = true
                this.errorTitle = 'No se pudo cargar tu compra'
                this.errorMessage = 'Ha ocurrido un problema al recuperar la factura.'

                const cartId = this.$route.query.cart_id
                if (!cartId) {
                    this.setErrorState('Compra no identificada', 'Falta el identificador del carrito asociado al checkout.')
                    return
                }

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/invoices/by-cart/${cartId}`, {
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json'
                    }
                })

                if (!res.ok) {
                    this.setInvoiceError(res.status)
                    console.error('No se pudo obtener la factura del carrito')
                    return
                }

                const data = await res.json()
                this.invoice = data.data || data

                if (this.invoice && this.invoice.cart_id) {
                    await this.fetchCartDetails(this.invoice.cart_id)
                    return
                }

                this.setErrorState('No se encontro la factura', 'La compra no tiene una factura asociada todavia.')
            } catch (err) {
                this.setErrorState('Error de conexion', 'No se pudo contactar con el servidor para cargar la factura.')
                console.error('Error cargando factura', err)
            } finally {
                this.isLoading = false
            }
        },
        async fetchCartDetails(cartId) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/carts/${cartId}`, {
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json'
                    }
                })

                if (!res.ok) {
                    this.setCartError(res.status)
                    return
                }

                const data = await res.json()
                this.cartDetails = data.data || data
            } catch (err) {
                this.setErrorState('Error de conexion', 'No se pudieron cargar los detalles del carrito.')
                console.error('Error cargando detalles del carrito', err)
            }
        },
        setInvoiceError(status) {
            if (status === 401) {
                this.setErrorState('Sesion expirada', 'Inicia sesion de nuevo para ver la factura de tu compra.')
                return
            }

            if (status === 403) {
                this.setErrorState('Acceso denegado', 'No tienes permisos para ver esta factura.')
                return
            }

            if (status === 404) {
                this.setErrorState('Factura no encontrada', 'No se encontro una factura para este carrito.')
                return
            }

            this.setErrorState('No se pudo cargar la factura', 'Ha ocurrido un error al recuperar la factura de la compra.')
        },
        setCartError(status) {
            if (status === 401) {
                this.setErrorState('Sesion expirada', 'Inicia sesion de nuevo para ver los detalles del carrito.')
                return
            }

            if (status === 403) {
                this.setErrorState('Acceso denegado', 'No tienes permisos para ver este carrito.')
                return
            }

            if (status === 404) {
                this.setErrorState('Carrito no encontrado', 'No se encontraron los detalles del carrito asociado a la compra.')
                return
            }

            this.setErrorState('No se pudo cargar el carrito', 'Ha ocurrido un error al recuperar los detalles de la compra.')
        },
        setErrorState(title, message) {
            this.errorTitle = title
            this.errorMessage = message
        },
        printInvoice() {
            window.print()
        }
    },
    mounted() {
        this.fetchInvoice()
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

.checkout-success {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 1.5rem 5rem;
    background: var(--bg-color);
    min-height: 80vh;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
}


.success-card {
    position: relative;
    background: var(--nav-bg);
    border: 1px solid var(--nav-border);
    padding: 3rem 2.5rem;
    border-radius: 24px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 20px 50px -12px rgba(0, 0, 0, 0.15);
    max-width: 640px;
    width: 100%;
    text-align: center;
    color: var(--text-color);
    animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}

@keyframes cardSlideUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.success-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    margin-bottom: 1.5rem;
}

.badge-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(82, 177, 85, 0.25);
    animation: ringPulse 2.5s ease-out infinite;
}

.badge-ring--delay {
    animation-delay: 0.8s;
}

@keyframes ringPulse {
    0% {
        transform: scale(1);
        opacity: 0.6;
    }
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
}

.success-icon {
    font-size: 56px;
    color: #52b155;
    animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
    opacity: 0;
    transform: scale(0.5);
}

@keyframes iconPop {
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.success-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    font-weight: 800;
    color: var(--text-color);
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.success-subtitle {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text-color);
    opacity: 0.5;
    margin: 0 0 2.5rem;
    line-height: 1.6;
}

.invoice-box {
    text-align: left;
    background: var(--bg-color);
    padding: 1.75rem;
    border-radius: 16px;
    border: 1px solid var(--nav-border);
    margin-bottom: 2rem;
    transition: box-shadow 0.3s ease;
}

.invoice-box:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid var(--nav-border);
}

.invoice-header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.invoice-icon {
    font-size: 22px;
    color: #52b155;
}

.invoice-header h2 {
    margin: 0;
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.01em;
}

.invoice-number {
    font-family: 'DM Sans', monospace;
    font-size: 0.82rem;
    font-weight: 600;
    color: #52b155;
    background: rgba(82, 177, 85, 0.1);
    padding: 0.3em 0.75em;
    border-radius: 100px;
    letter-spacing: 0.02em;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
}

.invoice-table th {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-color);
    opacity: 0.4;
    padding: 0 0.5rem 0.75rem;
    border-bottom: 1px solid var(--nav-border);
}

.invoice-table td {
    padding: 0.85rem 0.5rem;
    font-size: 0.9rem;
    color: var(--text-color);
    border-bottom: 1px solid var(--nav-border);
    transition: background 0.2s ease;
}

.invoice-table tbody tr:last-child td {
    border-bottom: none;
}

.invoice-table tbody tr:hover td {
    background: rgba(82, 177, 85, 0.04);
}

.product-name {
    font-weight: 500;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.invoice-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 0.5rem 0.75rem;
    margin-top: 0.25rem;
    border-top: 2px solid var(--nav-border);
}

.total-label {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-color);
}

.total-amount {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #52b155;
}

.invoice-meta {
    display: flex;
    gap: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--nav-border);
    margin-top: 0.5rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: var(--text-color);
    opacity: 0.45;
    font-weight: 400;
}

.meta-icon {
    font-size: 16px;
}

.actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition:
        transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        box-shadow 0.25s ease,
        background 0.2s ease;
}

.btn-action .material-symbols-outlined {
    font-size: 20px;
}

.btn-action:hover {
    transform: translateY(-2px);
}

.btn-action:active {
    transform: translateY(0);
}

.btn-print {
    background: var(--nav-border);
    color: var(--text-color);
}

.btn-print:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.btn-shop {
    background: #52b155;
    color: #fff;
}

.btn-shop:hover {
    background: #469c49;
    box-shadow: 0 8px 24px rgba(82, 177, 85, 0.3);
    color: #fff;
}

.state-card {
    position: relative;
    background: var(--nav-bg);
    border: 1px solid var(--nav-border);
    padding: 4rem 2.5rem;
    border-radius: 24px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.05),
        0 20px 50px -12px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    width: 100%;
    text-align: center;
    animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(30px);
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.loading-state p {
    font-size: 0.95rem;
    color: var(--text-color);
    opacity: 0.5;
    font-weight: 300;
    margin: 0;
}

.spinner {
    width: 44px;
    height: 44px;
    border: 3px solid var(--nav-border);
    border-top-color: #52b155;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.error-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.08);
    margin-bottom: 0.5rem;
}

.error-icon {
    font-size: 40px;
    color: #ef4444;
}

.error-state h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
}

.error-state p {
    font-size: 0.9rem;
    color: var(--text-color);
    opacity: 0.45;
    font-weight: 300;
    margin: 0 0 0.5rem;
    max-width: 320px;
    line-height: 1.6;
}

@media (max-width: 640px) {
    .checkout-success {
        padding: 2rem 1rem 3rem;
    }

    .success-card {
        padding: 2rem 1.5rem;
        border-radius: 20px;
    }

    .invoice-box {
        padding: 1.25rem;
    }

    .actions {
        flex-direction: column;
    }

    .btn-action {
        justify-content: center;
        width: 100%;
    }

    .invoice-table th:nth-child(3),
    .invoice-table td:nth-child(3) {
        display: none;
    }
}

/* aqui se configura lo que se quiere ver de la impresión */
@media print {
    @page {
        margin: 15mm;
    }

    :global(footer),
    :global(header),
    :global(nav) {
        display: none !important;
    }

    body {
        background: white !important;
        color: black !important;
    }

    body * {
        visibility: hidden !important;
    }

    .checkout-success {
        padding: 0;
        background: white !important;
        min-height: auto;
        overflow: visible;
    }

    .success-card {
        padding: 0;
        margin: 0;
        border: none;
        box-shadow: none;
        background: white !important;
        animation: none;
        opacity: 1;
        transform: none;
        max-width: 100%;
    }

    .invoice-box,
    .invoice-box * {
        visibility: visible !important;
        color: black !important;
    }

    .invoice-box {
        position: relative;
        width: 100%;
        background: white !important;
        border: none;
        margin: 0;
        padding: 20mm;
        border-radius: 0;
        box-shadow: none;
    }

    .invoice-header {
        border-bottom-color: #333 !important;
    }

    .invoice-icon {
        color: #333 !important;
    }

    .invoice-number {
        background: none !important;
        color: #333 !important;
        border: 1px solid #999;
    }

    .invoice-table th,
    .invoice-table td {
        border-bottom-color: #ddd !important;
    }

    .invoice-table tbody tr:hover td {
        background: none !important;
    }

    .invoice-total-row {
        border-top-color: #333 !important;
    }

    .total-amount {
        color: #333 !important;
    }

    .invoice-meta {
        border-top-color: #ddd !important;
    }

    .actions,
    .success-badge,
    .success-title,
    .success-subtitle,
    .state-card {
        display: none !important;
    }
}
</style>
