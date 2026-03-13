import ProductCard from "./components/web_src/sections/products/product-card.vue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProfile = async () => {
    const token = localStorage.getItem('user_token');
    try {
      const response = await fetch(`${BASE_URL}/v1/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching profile: ${response.statusText}`);
        }
        
        const data = await response.json();

        const infoUser = {
            User: data.User,
            Role: data.User.userRole
        };

        const infoVehicles = {
            vehicle: data.vehicles,
            vehicleType: data.vehicle_type
        };

        const infoCartInvoices = data.CartInvoices;
        const infoServiceInvoices = data.ServiceInvoices;
        const infoAppointments = {
            appointments: data.Appointments
        };

        return { infoUser, infoVehicles, infoCartInvoices, infoServiceInvoices, infoAppointments, infoAppointments };
    } catch (error) {
        console.error('Error loading profile:', error);
        throw error; 
    }
};
