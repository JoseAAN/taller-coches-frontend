<template>
    <div class="web-layout min-h-screen">
        <HomeNavComponent />

        <main class="content-grow">
            <router-view :key="$route.fullPath"></router-view>
        </main>

        <FooterComponent />
    </div>
</template>

<script setup>
import HomeNavComponent from '../shared/nav-component.vue';
import FooterComponent from '../shared/main-footer.vue';
</script>

<style scoped>
.web-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
}

.content-grow {
    flex: 1;
}
</style>