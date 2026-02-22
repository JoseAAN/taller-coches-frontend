<template>
    <div class="web-layout">
        <HomeNavComponent />

        <main>
            <router-view></router-view>
        </main>

    </div>
</template>

<script setup>
import HomeNavComponent from '../shared/nav-component.vue';
</script>