import { reactive } from "vue";
import { notify } from "@/JS/notify.js";

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

    getGuestCart() {
        try {
            const raw = localStorage.getItem('guest_cart');
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    },

    saveGuestCart(cartArray) {
        localStorage.setItem('guest_cart', JSON.stringify(cartArray));
    },

    async loadGuestCart() {
        const guestCart = this.getGuestCart();
        let formattedItems = [];
        let total = 0;

        for (const item of guestCart) {
            try {
                if (item.typeId === ITEM_TYPES.PRODUCT) {
                    const res = await fetch(`${BASE_URL}/v1/products/${item.targetId}`);
                    if (res.ok) {
                        const prodData = await res.json();
                        const product = prodData.data || prodData;

                        const subtotal = item.quantity * item.price;
                        total += subtotal;

                        formattedItems.push({
                            id: item.id,
                            type: 'PRODUCT',
                            quantity: item.quantity,
                            subtotal: subtotal,
                            details: product
                        });
                    }
                }
            } catch (e) {
                console.error('Error fetching guest item:', e);
            }
        }

        this.items = formattedItems;
        this.total = total;
        this.quantity = this.checkQuantity(formattedItems);
    },

    async syncGuestCart() {
        const token = localStorage.getItem('user');
        if (!token) return;

        const guestCart = this.getGuestCart();
        if (guestCart.length === 0) return;

        for (const item of guestCart) {
            await this.addToCart(item.typeId, item.targetId, item.quantity, item.price, true);
        }

        localStorage.removeItem('guest_cart');
        await this.loadUserCart();
    },

    async loadUserCart() {
        const token = localStorage.getItem('user');
        if (!token) {
            await this.loadGuestCart();
            return;
        }

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
                this.items = [];
                this.total = 0;
                this.quantity = 0;
                return;
            }

            this.id = data.data.id;
            this.items = data.data.items || [];
            this.total = data.data.price;
            this.quantity = this.checkQuantity(data.data.items || []);
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

    async removeItem(itemId, appointmentId = null) {
        const token = localStorage.getItem('user');

        if (!token) {
            let guestCart = this.getGuestCart();
            guestCart = guestCart.filter(i => i.id !== itemId);
            this.saveGuestCart(guestCart);
            await this.loadGuestCart();
            return;
        }

        try {
            if (appointmentId) {
                await fetch(`${BASE_URL}/v1/appointment/${appointmentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
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
        }
    },

    async updateQuantity(itemId, quantity) {
        const token = localStorage.getItem('user');

        if (!token) {
            let guestCart = this.getGuestCart();
            let item = guestCart.find(i => i.id === itemId);
            if (item) {
                item.quantity = quantity;
                this.saveGuestCart(guestCart);
                await this.loadGuestCart();
            }
            return;
        }

        try {
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
        }
    },

    /**
     * Añade un producto o servicio al carrito.
     * @param {number} typeId - ITEM_TYPES.PRODUCT o ITEM_TYPES.SERVICE
     * @param {number} targetId - ID del producto o ID del appointment
     * @param {number} quantity - Cantidad (siempre 1 para servicios)
     * @param {number} price - Precio unitario en el momento
     * @param {boolean} skipReload - Omitir reload para sincronización en bloque
     */
    async addToCart(typeId, targetId, quantity, price, skipReload = false) {
        const token = localStorage.getItem('user');

        if (!token) {
            if (typeId !== ITEM_TYPES.PRODUCT) {
                return { success: false, message: 'Inicia sesión para reservar servicios' };
            }

            let guestCart = this.getGuestCart();
            let existing = guestCart.find(i => i.typeId === typeId && i.targetId === targetId);

            if (existing) {
                existing.quantity += quantity;
            } else {
                guestCart.push({
                    id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
                    typeId,
                    targetId,
                    quantity,
                    price
                });
            }
            this.saveGuestCart(guestCart);
            if (!skipReload) await this.loadGuestCart();
            return { success: true };
        }

        try {
            if (!this.id) {
                const resCart = await fetch(`${BASE_URL}/v1/user-cart`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resCart.ok) {
                    const dataCart = await resCart.json();
                    if (dataCart.data) this.id = dataCart.data.id;
                }
            }

            const payload = {
                cart_id: this.id,
                item_type_id: typeId,
                quantity: quantity,
                price_at_time: price
            };

            if (typeId === ITEM_TYPES.PRODUCT) payload.product_id = targetId;
            else if (typeId === ITEM_TYPES.SERVICE) payload.appointment_id = targetId;

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
                if (!skipReload) notify.error(data.message || 'Error al añadir al carrito');
                return { success: false, message: data.message };
            }

            if (!skipReload) await this.loadUserCart();
            return { success: true };

        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, message: 'Error de conexión' };
        }
    },

    clearCart() {
        this.id = null;
        this.items = [];
        this.total = 0;
        this.quantity = 0;
        localStorage.removeItem('guest_cart');
    }
});