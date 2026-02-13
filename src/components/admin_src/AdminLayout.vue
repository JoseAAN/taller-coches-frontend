<template>
    <div class="admin-layout">
        <sidenav></sidenav>

        <main class="main-content">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>
import sidenav from "./sidenav.vue";
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f1f5f9;
}

.main-content {
    flex: 1;
    margin-left: 70px;
    padding: 2rem;
    transition: margin-left 0.3s ease;
}


</style>
