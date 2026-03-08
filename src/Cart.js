import { reactive } from "vue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cart = reactive({
    id: null,
    products: [],
    total: 0,
    quantity: 0,

    async loadUserCart() {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        const token = localStorage.getItem('user_token');
        
        if (!token) return;

        try {
            fetch(`${BASE_URL}/v1/user-cart`, {
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
                this.id = data.data.id;
                this.products = data.data.items || [];
                this.total = data.data.total;
                this.quantity = data.data.items.length;
            });
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }
});