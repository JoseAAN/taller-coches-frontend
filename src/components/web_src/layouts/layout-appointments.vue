<template>
        <appointmentNavComponent />
        <router-view />
</template>

<script>
import { Password } from 'primevue';
import appointmentNavComponent from '../sections/appointment/appointmentNavComponent.vue';
export default {
    components: { appointmentNavComponent },
    data() {
        return {
            pasoActual: 0,
            AppointmentData:{
                vehicle_Id: null,
                service_Id: null,
                date: null,
                start_time: null,
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>