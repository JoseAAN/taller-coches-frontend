<template>
    <div class="checkout-success">
        <div class="success-card" v-if="invoice && cartDetails">
            <div class="success-icon material-symbols-outlined">
                task_alt
            </div>
            <h1 class="success-title">Compra completada</h1>
            <p class="success-subtitle">Gracias por tu pedido. Aqui tienes tu factura.</p>

            <div class="invoice-box" id="print-area">
                <div class="invoice-header">
                    <h2>Factura</h2>
                    <span class="invoice-number">{{ invoice.invoice_number }}</span>
                </div>

                <div class="invoice-details">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in cartDetails.items" :key="item.id">
                                <td>{{ item.details.name }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.price_at_time }} EUR</td>
                                <td>{{ item.subtotal }} EUR</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right font-bold">Total:</td>
                                <td class="font-bold">{{ invoice.total }} EUR</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="invoice-dates">
                    <p><strong>Fecha de compra:</strong> {{ invoice.created_at || new Date().toLocaleString() }}</p>
                </div>
            </div>

            <div class="actions">
                <button @click="printInvoice" class="btn-print">
                    <span class="material-symbols-outlined">print</span>
                    Imprimir factura
                </button>
                <router-link to="/products" class="btn-shop">
                    Volver a la tienda
                </router-link>
            </div>
        </div>
        <div v-else class="loading-state">
            <p v-if="isLoading">Cargando informacion de tu factura...</p>
            <div v-else class="error-state">
                <span class="material-symbols-outlined x-icon">error</span>
                <h2>{{ errorTitle }}</h2>
                <p>{{ errorMessage }}</p>
                <router-link to="/products" class="btn-shop">Ir a la tienda</router-link>
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
.checkout-success {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
    background: var(--bg-color);
    min-height: 70vh;
}

.success-card {
    background: var(--nav-bg, #ffffff);
    border: 1px solid var(--nav-border, #eee);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    max-width: 600px;
    width: 100%;
    text-align: center;
    color: var(--text-color, #000);
}

.success-icon {
    font-size: 64px;
    color: #4ade80;
    margin-bottom: 1rem;
}

.success-title {
    font-size: 1.8rem;
    color: var(--text-color, #333);
    margin: 0 0 0.5rem;
}

.success-subtitle {
    color: #9ca3af;
    margin-bottom: 2rem;
}

.invoice-box {
    text-align: left;
    background: var(--bg-color);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--nav-border, #ebebeb);
    margin-bottom: 2rem;
}

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--nav-border, #ddd);
    padding-bottom: 0.8rem;
    margin-bottom: 1rem;
}

.invoice-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-color, #333);
}

.invoice-number {
    font-weight: bold;
    color: #4ade80;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
}

.invoice-table th, .invoice-table td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--nav-border, #eee);
    color: var(--text-color, #333);
}

.invoice-table th {
    text-align: left;
    color: #9ca3af;
    font-weight: 600;
}

.text-right {
    text-align: right;
}

.font-bold {
    font-weight: bold;
}

.invoice-dates {
    font-size: 0.9rem;
    color: #9ca3af;
    margin-top: 1rem;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-print {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #374151;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
}

.btn-print:hover {
    background: #1f2937;
}

.btn-shop {
    display: flex;
    align-items: center;
    background: #4ade80;
    color: #051221;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.2s;
}

.btn-shop:hover {
    background: #22c55e;
}

.loading-state,
.error-state p {
    color: var(--text-color);
}

.loading-state {
    text-align: center;
    padding: 6rem;
}

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.x-icon {
    font-size: 48px;
    color: #ef4444;
}

@media print {
    @page {
        margin: 0;
    }

    :global(footer) {
        display: none !important;
    }

    body {
        background: white !important;
        color: black !important;
    }

    body * {
        visibility: hidden !important;
    }

    .checkout-success,
    .success-card {
        padding: 0;
        margin: 0;
        border: none;
        box-shadow: none;
        background: white !important;
    }

    .invoice-box,
    .invoice-box * {
        visibility: visible !important;
        color: black !important;
    }

    .invoice-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: white !important;
        border: none;
        margin: 0;
        padding: 20mm;
    }

    .actions,
    .success-title,
    .success-subtitle,
    .success-icon {
        display: none !important;
    }
}
</style>
