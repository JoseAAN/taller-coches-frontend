import { loaderState } from "@/loaderState";
import { reactive } from "vue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cart = reactive({
    id: null,
    products: [],
    total: 0,
    quantity: 0,

    async loadUserCart() {
        const token = localStorage.getItem('user_token');
        
        if (!token) return;

        try {
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
                this.products = [];
                this.total = 0;
                this.quantity = 0;
                return;
            }

            this.id = data.data.id;
            this.products = data.data.items || [];
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

    async removeItem(cartProductId) {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        try {
            loaderState.show();
            const response = await fetch(`${BASE_URL}/v1/cart-products/${cartProductId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error eliminando producto del carrito');
            }

            await this.loadUserCart();
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            loaderState.hide();
        }
    },

    async updateQuantity(cartProductId, quantity, priceInTime) {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        try {
            loaderState.show();
            const response = await fetch(`${BASE_URL}/v1/cart-products/${cartProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quantity: quantity,
                    priceInTime: priceInTime
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

    getProductQuantityInCart(productId) {
        const item = this.products.find(p => p.id === productId);
        return item ? item.quantity : 0;
    },

    async addToCart(productId, quantity, priceInTime) {
        const token = localStorage.getItem('user_token');
        if (!token) return { success: false, message: 'No autenticado' };

        try {
            loaderState.show();
            // Asegurarnos de tener el cart.id
            if (!this.id) {
                await this.loadUserCart();
            }

            const response = await fetch(`${BASE_URL}/v1/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                    cart_id: this.id,
                    priceInTime: priceInTime
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // El backend devuelve 400 con un mensaje si no hay stock suficiente
                alert(data.message || 'Error al añadir al carrito');
                return { success: false, message: data.message };
            }

            // Recargar para tener el total/cantidades actualizadas
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
        this.products = [];
        this.total = 0;
        this.quantity = 0;
    }
});