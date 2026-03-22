<template>
  <div>
    <StepVehicle
      v-if="paso === 1"
      @select="seleccionarVehiculo"
    />
    
    <StepService
      v-if="paso === 2"
      @select="seleccionarServicio"
      @back="paso--"
    />

    <StepDateTime
      v-if="paso === 3"
      :serviceId="data.service_Id"
      @select="seleccionarSlot"
      @back="paso--"
    />

    <StepSummary
      v-if="paso === 4"
      :vehicle="data.vehicle"
      :service="data.service"
      :date="data.date"
      :startTime="data.start_time"
      @confirm="confirmar"
      @back="paso--"
    />
  </div>
</template>

<script>
import StepVehicle  from './step-vehicle.vue'
import StepService  from './step-service.vue'
import StepDateTime from './step-date-time.vue'
import StepSummary  from './step-summary.vue'

export default {
  components: { StepVehicle, StepService, StepDateTime, StepSummary },
  data() {
    return {
      paso: 1,
      data: {
        // IDs para enviar al backend
        vehicle_Id: null,
        service_Id: null,
        date: null,
        start_time: null,
        // Objetos completos para mostrar en el resumen
        vehicle: null,
        service: null,
      }
    }
  },
  methods: {
    seleccionarVehiculo(vehicle) {
      this.data.vehicle_Id = vehicle.id
      this.data.vehicle = vehicle       // guardamos el objeto completo
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
    },
    async confirmar() {
      const token = localStorage.getItem('user_token')
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicle_id: this.data.vehicle_Id,
          service_id: this.data.service_Id,
          date: this.data.date,
          start_time: this.data.start_time
        })
      })
      if (response.ok) {
        this.$router.push('/cart')
      }
    }
  }
}
</script>
