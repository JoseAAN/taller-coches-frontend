<script setup>
import WelcomeItem from './WelcomeItem.vue'
import SupportIcon from './icons/IconSupport.vue'
import calendarComponent from './calendar-component.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>

  <calendar-component></calendar-component>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem>
</template>
