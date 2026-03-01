<template>
  <div v-if="open" class="sidebar-overlay" @click="closeSidebar"></div>

  <aside :class="['sidenav', { 'is-open': open }]">
    <div class="toggle-container">
      <button class="toggle-btn" @click="toggleSidebar">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>

    <nav class="menu-container">
      
      <ul v-if="loading" class="nav-list">
        <li v-for="i in 6" :key="i" class="skeleton-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-label" v-show="open"></div>
        </li>
      </ul>

      <ul v-else class="nav-list">
        <li v-for="parent in menu" :key="parent.id" class="nav-item">
          <div v-if="parent.is_active">
            <div class="nav-link parent-link"
              @click="parent.children.length ? toggleGroup(parent.id) : navigate(parent.route)">
              <span class="material-symbols-outlined icon">{{ parent.icon }}</span>
              <span class="label" v-show="open">{{ parent.label }}</span>
              <span v-if="open && parent.children.length" class="material-symbols-outlined arrow"
                :class="{ 'rotate': openGroups[parent.id] }"> expand_more </span>
            </div>
  
            <transition name="slide">
              <ul v-show="openGroups[parent.id]" class="submenu">
                <li v-for="child in parent.children" :key="child.id" class="submenu-item"
                  @click.stop="navigate(child.route)">
                  <span class="material-symbols-outlined sub-icon">{{ child.icon }}</span>
                  <span class="label" v-show="open">{{ child.label }}</span>
                </li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>

    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(true)
const router = useRouter()
const open = ref(false)
const menu = ref([])
const openGroups = ref({})

const toggleSidebar = () => {
  open.value = !open.value
  if (!open.value) {
    openGroups.value = {}
  }
}

const closeSidebar = () => {
  open.value = false
  openGroups.value = {}
}

const toggleGroup = (id) => {
  if (!open.value) {
    open.value = true;
  }
  openGroups.value[id] = !openGroups.value[id]
}

const navigate = (route) => {
  if (route) {
    router.push(route)
    if (window.innerWidth < 1024) closeSidebar();
    open.value = false;
    openGroups.value = {}
  }
}

const fetchSidebarItems = () => {
  fetch('http://127.0.0.1:8000/api/v1/admin-navigation')
    .then(res => res.json())
    .then(res => {
      menu.value = res.data

    })
    .catch(err => console.error('Error:', err))
    .finally(() => {
      setTimeout(() => { loading.value = false }, 300);
    })
}

onMounted(fetchSidebarItems)
</script>

<style scoped>
:host {
  --sidebar-bg: #0f172a;
  --sidebar-accent: #a3e635;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 76px;
  background: #0f172a;
  color: #f8fafc;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
}

.sidenav.is-open {
  width: 280px;
}

.toggle-container {
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: center;
}

.sidenav.is-open .toggle-container {
  justify-content: flex-start;
  padding-left: 1.5rem;
}

.toggle-btn {
  background: rgba(163, 230, 53, 0.1);
  border: 1px solid rgba(163, 230, 53, 0.2);
  color: #a3e635;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #a3e635;
  color: #0f172a;
  box-shadow: 0 0 15px rgba(163, 230, 53, 0.4);
}

.menu-container {
  flex: 1;
  padding: 0 0.85rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.4rem;
  color: #cbd5e1;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.icon {
  margin-right: 1.2rem;
  font-size: 22px;
  min-width: 24px;
  text-align: center;
}

.label {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.nav-list,
.submenu {
  list-style: none !important;
  padding: 0;
  margin: 0;
}

.submenu {
  margin: 0.25rem 0 0.75rem 1rem;
  padding-left: 0.5rem;
  border-left: 2px solid rgba(163, 230, 53, 0.2);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.65rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #94a3b8;
  transition: all 0.25s ease;
  position: relative;
}

.submenu-item:hover {
  color: #a3e635;
  background: rgba(163, 230, 53, 0.05);
  transform: translateX(4px);
}

.submenu-item::before {
  content: '';
  position: absolute;
  left: -0.4rem;
  height: 100%;
  width: 4px;
  background: transparent;
  border-radius: 2px;
  transition: background 0.3s ease;
}

.submenu-item:hover::before {
  background: #a3e635;
}

.sub-icon {
  font-size: 18px;
  margin-right: 1rem;
  transition: color 0.25s ease;
}


.submenu-item:hover .sub-icon {
  color: #a3e635;
}

.arrow {
  font-size: 18px;
  opacity: 0.6;
}

.sidenav:not(.is-open) .nav-link {
  justify-content: center;
  padding: 0.75rem 0;
}

.sidenav:not(.is-open) .icon {
  margin-right: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 400px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.arrow.rotate {
  transform: rotate(180deg);
  color: #a3e635;
}

.skeleton-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.4rem;
}

.skeleton-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.skeleton-label {
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  margin-left: 1.2rem;
  border-radius: 4px;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.skeleton-icon::after,
.skeleton-label::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.03) 20%,
    rgba(255, 255, 255, 0.06) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Alineación cuando el sidebar está cerrado */
.sidenav:not(.is-open) .skeleton-item {
  justify-content: center;
  padding: 0.75rem 0;
}
</style>