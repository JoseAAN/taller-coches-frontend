<template>
    <div class="checkout-success">
        <div class="success-card" v-if="invoice && cartDetails">
            <div class="success-icon material-symbols-outlined">
                task_alt
            </div>
            <h1 class="success-title">¡Compra Completada!</h1>
            <p class="success-subtitle">Gracias por tu pedido. Aquí tienes tu factura.</p>
            
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
                                <td>{{ item.name }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.priceInTime }} €</td>
                                <td>{{ item.totalPerProduct }} €</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right font-bold">Total:</td>
                                <td class="font-bold">{{ invoice.total }} €</td>
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
                    Imprimir Factura
                </button>
                <router-link to="/products" class="btn-shop">
                    Volver a la tienda
                </router-link>
            </div>
        </div>
        <div v-else class="loading-state">
            <p v-if="isLoading">Cargando información de tu factura...</p>
            <div v-else class="error-state">
                <span class="material-symbols-outlined x-icon">error</span>
                <h2>No tienes facturas recientes</h2>
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
            isLoading: true
        }
    },
    methods: {
        async fetchInvoice() {
            try {
                this.isLoading = true;
                const cartId = this.$route.query.cart_id;
                
                if (!cartId) {
                    this.isLoading = false;
                    return;
                }

                const token = localStorage.getItem('user_token');
                
                // Fetch the user's invoice by cart ID
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/product-invoices/by-cart/${cartId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    this.invoice = data.data || data;

                    if (this.invoice && this.invoice.cart_id) {
                        await this.fetchCartDetails(this.invoice.cart_id);
                    }
                } else {
                    console.error("No se pudo obtener la factura más reciente");
                }
            } catch (err) {
                console.error("Error cargando factura", err);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCartDetails(cartId) {
            try {
                const token = localStorage.getItem('user_token');
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/carts/${cartId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    this.cartDetails = data.data || data;
                }
            } catch (err) {
                console.error("Error cargando detalles del carrito", err);
            }
        },
        printInvoice() {
            window.print();
        }
    },
    mounted() {
        this.fetchInvoice();
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
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
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

.loading-state, .error-state p {
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
        margin: 0; /* This removes the browser headers and footers (URL, date, pages) */
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
    .checkout-success, .success-card {
        padding: 0;
        margin: 0;
        border: none;
        box-shadow: none;
        background: white !important;
    }
    .invoice-box, .invoice-box * {
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
        padding: 20mm; /* Extra padding to prevent cutting off text since we removed the page margin */
    }
    .actions, .success-title, .success-subtitle, .success-icon {
        display: none !important;
    }
}
</style>
