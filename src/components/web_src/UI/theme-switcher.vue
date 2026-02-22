<template>
    <button @click="toggleTheme" class="theme-toggle-btn"
        :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
        <i v-if="!isDark" class="pi pi-moon"></i>
        <i v-else class="pi pi-sun"></i>
    </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        applyTheme(true);
    }
});

const toggleTheme = () => {
    applyTheme(!isDark.value);
};

const applyTheme = (dark) => {
    isDark.value = dark;

    if (dark) {
        document.documentElement.classList.add("p-dark");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.classList.remove("p-dark");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
};
</script>

<style scoped>
.theme-toggle-btn {
    background: transparent;
    border: 1px solid var(--nav-border);
    color: var(--nav-text);
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
    background-color: rgba(var(--nav-text-rgb), 0.1);
    transform: scale(1.05);
}

.pi {
    font-size: 1.2rem;
}
</style>
