

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProfile = async () => {
    const token = localStorage.getItem('user');
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

        const infoInvoices = data.Invoices;

        const infoAppointments = {
            appointments: data.Appointments
        };

        return { infoUser, infoVehicles, infoInvoices,infoAppointments };

    } catch (error) {
        console.error('Error loading profile:', error);
        throw error; 
    }
};
