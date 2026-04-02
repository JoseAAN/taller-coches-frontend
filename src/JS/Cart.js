import { loaderState } from "@/loaderState";
import { reactive } from "vue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ITEM_TYPES = {
    PRODUCT: 1,
    SERVICE: 2
};

export const cart = reactive({
    id: null,
    items: [],
    total: 0,
    quantity: 0,

    async loadUserCart() {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        try {
            loaderState.show();
            const response = await fetch(`${BASE_URL}/v1/user-cart`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching cart');
            }

            const data = await response.json();
            
            
            if (!data.data) {
                this.id = null;
                this.items = [];
                this.total = 0;
                this.quantity = 0;
                return;
            }

            this.id = data.data.id;
            this.items = data.data.items || [];
            this.total = data.data.price;
            this.quantity = this.checkQuantity(data.data.items || []);
            loaderState.hide();
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    },

    checkQuantity(items) {
        let total = 0;
        items.forEach(item => {
            total += item.quantity;
        });
        return total;
    },

    async removeItem(itemId,  appointmentId = null) {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        try {
            loaderState.show();

              if (appointmentId) {
            await fetch(`${BASE_URL}/v1/appointment/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        }

            const response = await fetch(`${BASE_URL}/v1/cart-items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error eliminando item del carrito');
            }

            await this.loadUserCart();
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            loaderState.hide();
        }
    },

    async updateQuantity(itemId, quantity) {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        try {
            loaderState.show();
            const response = await fetch(`${BASE_URL}/v1/cart-items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quantity: quantity
                })
            });

            if (!response.ok) {
                throw new Error('Error actualizando cantidad');
            }

            await this.loadUserCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            loaderState.hide();
        }
    },

    /**
     * Añade un producto o servicio al carrito.
     * @param {number} typeId - ITEM_TYPES.PRODUCT o ITEM_TYPES.SERVICE
     * @param {number} targetId - ID del producto o ID del appointment
     * @param {number} quantity - Cantidad (siempre 1 para servicios)
     * @param {number} price - Precio unitario en el momento
     */
    async addToCart(typeId, targetId, quantity, price) {
        const token = localStorage.getItem('user_token');
        if (!token) return { success: false, message: 'No autenticado' };

        try {
            loaderState.show();
            
            if (!this.id) {
                await this.loadUserCart();
            }

            const payload = {
                cart_id: this.id,
                item_type_id: typeId,
                quantity: quantity,
                price_at_time: price
            };

            // Según el tipo, asignamos el campo correspondiente
            if (typeId === ITEM_TYPES.PRODUCT) {
                payload.product_id = targetId;
            } else if (typeId === ITEM_TYPES.SERVICE) {
                payload.appointment_id = targetId;
            }

            const response = await fetch(`${BASE_URL}/v1/cart-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Error al añadir al carrito');
                return { success: false, message: data.message };
            }

            await this.loadUserCart();
            return { success: true };
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, message: 'Error de conexión' };
        } finally {
            loaderState.hide();
        }
    },

    clearCart() {
        this.id = null;
        this.items = [];
        this.total = 0;
        this.quantity = 0;
    }
});