<template>
  <div class="card flex justify-center">
    <form class="flex flex-column gap-5">
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

      <Button :label="loading ? 'Iniciando sesión...' : 'Inicio de sesión'" 
              :disabled="loading" 
              @click.prevent="iniciarSesion" />
      
      <Message v-if="success" severity="success">Usuario logeado correctamente</Message>
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
    name: 'login-component',
    components: {FloatLabel, InputText, Password, Button, Message},

    data: {
        form: {
            email: '',
            password: '',
        },
        loading: false,
        errors: {},
        success: false
    },

    methods: {
        async iniciarSesion() {
            const response = await fetch ('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(this.form)
            });
            const data = await response.json();
        }
    },



}



</script>

<style></style>