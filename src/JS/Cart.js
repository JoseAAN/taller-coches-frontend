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
            await fetch(`${BASE_URL}/v1/user-cart`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching cart');
                }
                return response.json();
            }).then(data => {
                if (!data.data) {
                    this.id = null;
                    this.products = [];
                    this.total = 0;
                    this.quantity = 0;
                    return;
                }

                this.id = data.data.id;
                this.products = data.data.items || [];
                this.total = data.data.total;
                this.quantity = this.checkQuantity(data.data.items || []);
                loaderState.hide();
                
            });
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
    }
});