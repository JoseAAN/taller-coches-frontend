import { reactive } from 'vue';

export const loaderState = reactive({
    isVisible: false,
    message: 'Cargando',

    show(msg = 'Cargando...') {
        this.message = msg;
        this.isVisible = true;
    },
    hide() {
        this.isVisible = false;
    }
});