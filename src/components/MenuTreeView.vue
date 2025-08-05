<template>
  <div class="menu-tree-view">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="svg-icon svg-icon-2 me-2">
            <inline-svg src="media/icons/duotune/general/gen025.svg" />
          </span>
          Menü Ağaç Yapısı
        </h3>
      </div>
      <div class="card-body">
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>

        <div
          v-else-if="treeData.length === 0"
          class="text-center text-muted py-5"
        >
          <span class="svg-icon svg-icon-3x text-muted mb-3">
            <inline-svg src="media/icons/duotune/general/gen025.svg" />
          </span>
          <p>Henüz menü bulunmuyor</p>
        </div>

        <div v-else class="menu-tree">
          <div v-for="menu in treeData" :key="menu.id" class="menu-item">
            <MenuTreeNode
              :menu="menu"
              :level="0"
              @edit="$emit('edit', $event)"
              @delete="$emit('delete', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  watch,
  defineProps,
  defineEmits,
  withDefaults,
} from "vue";
import MenuService, { MenuDto } from "@/services/MenuService";
import MenuTreeNode from "./MenuTreeNode.vue";

interface Props {
  refreshTrigger?: number;
}

const props = withDefaults(defineProps<Props>(), {
  refreshTrigger: 0,
});

const emit = defineEmits<{
  edit: [menu: MenuDto];
  delete: [menu: MenuDto];
}>();

const loading = ref(false);
const menuData = ref<MenuDto[]>([]);

// Ağaç yapısını oluştur
const treeData = computed(() => {
  return buildMenuTree(menuData.value);
});

// Menüleri yükle
const loadMenus = async () => {
  loading.value = true;
  try {
    const result = await MenuService.getAll();
    if (result.result && result.data) {
      menuData.value = result.data;
    }
  } catch (error) {
    console.error("Menüler yüklenirken hata:", error);
  } finally {
    loading.value = false;
  }
};

// Ağaç yapısını oluştur
const buildMenuTree = (menus: MenuDto[]): MenuDto[] => {
  const menuMap = new Map<string, MenuDto>();
  const rootMenus: MenuDto[] = [];

  // Tüm menüleri map'e ekle
  menus.forEach((menu) => {
    menuMap.set(menu.id || "", { ...menu, children: [] });
  });

  // Parent-child ilişkilerini kur
  menus.forEach((menu) => {
    const menuWithChildren = menuMap.get(menu.id || "");
    if (menuWithChildren) {
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuWithChildren);
        }
      } else {
        rootMenus.push(menuWithChildren);
      }
    }
  });

  // sortOrder'a göre sırala
  const sortMenus = (menus: MenuDto[]): MenuDto[] => {
    return menus
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((menu) => ({
        ...menu,
        children: menu.children ? sortMenus(menu.children) : [],
      }));
  };

  return sortMenus(rootMenus);
};

// Props değiştiğinde yeniden yükle
watch(
  () => props.refreshTrigger,
  () => {
    loadMenus();
  }
);

onMounted(() => {
  loadMenus();
});
</script>

<style scoped>
.menu-tree-view {
  margin-bottom: 2rem;
}

.menu-tree-view .card {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.menu-tree-view .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 20px 24px;
}

.menu-tree-view .card-title {
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
}

.menu-tree-view .card-title .svg-icon {
  color: white;
  margin-right: 12px;
}

.menu-tree-view .card-body {
  padding: 24px;
  background: #fafbfc;
}

.menu-tree {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.menu-tree::-webkit-scrollbar {
  width: 6px;
}

.menu-tree::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.menu-tree::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 3px;
}

.menu-tree::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
}

.menu-item {
  margin-bottom: 0;
}

/* Loading spinner */
.spinner-border {
  width: 2rem;
  height: 2rem;
  border-width: 0.2em;
}

/* Empty state */
.text-muted {
  color: #6b7280 !important;
}

.text-muted .svg-icon {
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-tree-view .card-header {
    padding: 16px 20px;
  }

  .menu-tree-view .card-title {
    font-size: 16px;
  }

  .menu-tree-view .card-body {
    padding: 20px;
  }

  .menu-tree {
    max-height: 400px;
  }
}
</style>
