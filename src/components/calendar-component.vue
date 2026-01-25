<template>
  <div class="card flex justify-center">
    <form class="flex flex-column gap-4">
      <FloatLabel>
        <InputText id="name" v-model="form.name" :class="{ 'p-invalid': errors.name }" />
        <label for="name">Nombre Completo</label>
      </FloatLabel>
      <small class="p-error" v-if="errors.name">{{ errors.name[0] }}</small>

      <FloatLabel>
        <InputText id="email" v-model="form.email" type="email" :class="{ 'p-invalid': errors.email }" />
        <label for="email">Email</label>
      </FloatLabel>
      <small class="p-error" v-if="errors.email">{{ errors.email[0] }}</small>

      <FloatLabel>
        <Password id="password" v-model="form.password" toggleMask :class="{ 'p-invalid': errors.password }" />
        <label for="password">Contraseña</label>
      </FloatLabel>
      <small class="p-error" v-if="errors.password">{{ errors.password[0] }}</small>

      <FloatLabel>
        <Password id="password_confirmation" v-model="form.password_confirmation" toggleMask :feedback="false" />
        <label for="password_confirmation">Confirmar Contraseña</label>
      </FloatLabel>

      <Button :label="loading ? 'Registrando...' : 'Registrarse'" 
              :disabled="loading" 
              @click.prevent="registrar" />
      
      <Message v-if="success" severity="success">Usuario creado correctamente</Message>
    </form>
  </div>
</template>

<script>
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

export default {
  name: 'RegistroComponent',
  components: { FloatLabel, InputText, Password, Button, Message },

  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      errors: {},
      success: false
    }
  },

  methods: {
    async registrar() {
      this.loading = true;
      this.errors = {};
      this.success = false;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (response.status === 422) {
          this.errors = data.errors;
        } else if (response.ok) {
          this.success = true;
          this.form = { name: '', email: '', password: '', password_confirmation: '' };
        } else {
          throw new Error('Algo salió mal en el servidor');
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.p-error {
  color: #e24c4c;
  font-size: 0.8rem;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}
</style>