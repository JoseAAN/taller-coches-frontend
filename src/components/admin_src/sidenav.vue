<template>
  <div v-if="open" class="sidebar-overlay" @click="closeSidebar"></div>

  <aside :class="['sidenav', { 'is-open': open }]">
    <div class="toggle-container">
      <button class="toggle-btn" @click="toggleSidebar">
        <span class="material-icons">menu</span>
      </button>
    </div>
    
    <nav class="menu-container">
      <ul class="nav-list">
        <li v-for="parent in menu" :key="parent.id" class="nav-item">
          <div class="nav-link parent-link"
            @click="parent.children.length ? toggleGroup(parent.id) : navigate(parent.route)">
            <span class="material-icons icon">{{ parent.icon }}</span>
            <span class="label" v-show="open">{{ parent.label }}</span>
            <span v-if="open && parent.children.length" class="material-icons arrow"
              :class="{ 'rotate': openGroups[parent.id] }"> expand_more </span>
          </div>

          <transition name="slide">
            <ul v-show="openGroups[parent.id]" class="submenu">
              <li v-for="child in parent.children" :key="child.id" class="submenu-item"
                @click.stop="navigate(child.route)">
                <span class="material-icons sub-icon">{{ child.icon }}</span>
                <span class="label" v-show="open">{{ child.label }}</span>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </aside>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
  }
}

const fetchSidebarItems = () => {
  fetch('http://127.0.0.1:8000/api/v1/admin-navigation')
    .then(res => res.json())
    .then(res => {
      menu.value = res.data
      console.log(res.data);
      
    })
    .catch(err => console.error('Error:', err))
}

onMounted(fetchSidebarItems)
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 70px;
  background: #0f172a;
  color: #f8fafc;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1000;
}

.sidenav.is-open {
  width: 260px;
}

.toggle-container {
  padding: 1.5rem 1.2rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: #a3e635;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu-container {
  flex: 1;
  padding: 0 0.75rem;
}

.nav-list,
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 0.25rem;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(163, 230, 53, 0.1);
}

.icon {
  margin-right: 1.5rem;
  font-size: 24px;
}

.label {
  flex: 1;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submenu {
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  margin: 0.2rem 0;
  border-radius: 8px;
  padding: 0.25rem 0;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.88rem;
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  color: #a3e635;
  background: rgba(163, 230, 53, 0.05);
  padding-left: 1.25rem;
}

.sub-icon {
  font-size: 20px;
  margin-right: 1.2rem;
  min-width: 24px;
}

.sidenav:not(.is-open) .submenu {
  margin: 0;
  background: transparent;
}

.sidenav:not(.is-open) .submenu-item .label {
  display: none;
}

.sidenav:not(.is-open) .submenu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.2s;
  max-height: 500px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.rotate {
  transform: rotate(180deg);
}
</style>
