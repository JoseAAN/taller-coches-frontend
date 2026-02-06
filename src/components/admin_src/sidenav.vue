<template>
  <aside :class="['sidenav', { open }]">
    <!-- Toggle -->
    <button class="toggle" @click="toggleSidebar">
      <span class="material-icons">menu</span>
    </button>

    <!-- PrimeVue PanelMenu -->
    <PanelMenu
      v-if="open"
      :model="panelMenuItems"
      class="panel-menu"
    />

    <!-- Solo iconos cuando está cerrado -->
    <div v-else class="icons-only">
      <div
        v-for="parent in menu"
        :key="parent.id"
        class="icon-item"
      >
        <span class="material-icons">{{ parent.icon }}</span>
      </div>
    </div>
  </aside>
</template>



<script setup>
import { ref, computed } from 'vue'
import PanelMenu from 'primevue/panelmenu'
import { useRouter } from 'vue-router'

const router = useRouter()

const open = ref(false)

const toggleSidebar = () => {
  open.value = !open.value
}

/* JSON recibido */
const menu = ref([
  {
    id: 4,
    label: 'Test',
    icon: 'inventory_2',
    route: null,
    children: [
      {
        id: 5,
        label: 'Product',
        icon: 'fragrance',
        route: '/admin/products'
      }
    ]
  }
])

/* Adaptación al modelo de PrimeVue */
const panelMenuItems = computed(() =>
  menu.value.map(parent => ({
    label: parent.label,
    icon: `material-icons ${parent.icon}`,
    items: parent.children.map(child => ({
      label: child.label,
      icon: `material-icons ${child.icon}`,
      command: () => router.push(child.route)
    }))
  }))
)
</script>

<style scoped>
.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 64px;
  background: #1f2937;
  color: white;
  transition: width 0.3s ease;
  padding: 1rem 0.5rem;
}

.sidenav.open {
  width: 240px;
}

.toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.panel-menu {
  background: transparent;
  border: none;
}

:deep(.p-panelmenu-header),
:deep(.p-panelmenu-content) {
  background: transparent;
  border: none;
  color: white;
}

:deep(.p-menuitem-link) {
  color: white;
}

.icons-only {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}

.icon-item {
  cursor: pointer;
}

.icon-item span {
  font-size: 24px;
}
</style>

