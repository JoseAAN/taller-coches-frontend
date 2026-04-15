<template>
  <div>
    <StepVehicle v-if="paso === 1" @select="seleccionarVehiculo" />

    <StepService v-if="paso === 2" :preselectedId="data.service_Id" @select="seleccionarServicio" @back="paso--" />

    <StepDateTime v-if="paso === 3" :serviceId="data.service_Id" @select="seleccionarSlot" @back="paso--" />

    <StepSummary v-if="paso === 4" :vehicle="data.vehicle" :service="data.service" :date="data.date"
      :startTime="data.start_time" @confirm="confirmar" @back="paso--" />
  </div>
</template>

<script>
import StepVehicle from './step-vehicle.vue'
import StepService from './step-service.vue'
import StepDateTime from './step-date-time.vue'
import StepSummary from './step-summary.vue'

export default {
  components: { StepVehicle, StepService, StepDateTime, StepSummary },
  data() {
    return {
      paso: 1,
      data: {
        vehicle_Id: null,
        service_Id: null,
        date: null,
        start_time: null,
        // Objetos para el resumen
        vehicle: null,
        service: null,
      }
    }
  },
  mounted() {
    const serviceId = this.$route.query.service_id
    if (serviceId) {
      this.data.service_Id = parseInt(serviceId)
    }
    document.title = "Cita | Vehículo"
  },
  methods: {
    seleccionarVehiculo(vehicle) {
      this.data.vehicle_Id = vehicle.id
      this.data.vehicle = vehicle
      this.paso = 2
    },
    seleccionarServicio(service) {
      this.data.service_Id = service.id
      this.data.service = service       // guardamos el objeto completo
      this.paso = 3
    },
    seleccionarSlot({ date, start_time }) {
      this.data.date = date
      this.data.start_time = start_time
      this.paso = 4
    }
  },
}
</script>
