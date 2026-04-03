import { useToast } from 'vue-toastification';

// Módulo centralizado de notificaciones.
// Permite usar toasts tanto desde componentes Vue como desde ficheros JS puros (Cart.js, Auth.js, etc.)

const getToast = () => useToast();

export const notify = {
    success(message) {
        getToast()(message, { type: 'success' });
    },
    error(message) {
        getToast()(message, { type: 'error' });
    },
    info(message) {
        getToast()(message, { type: 'info' });
    },
    warning(message) {
        getToast()(message, { type: 'warning' });
    }
};
