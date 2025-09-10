<template>
  <div class="menu-tree-view">
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="card-title">
            <span class="svg-icon svg-icon-2 me-2">
              <inline-svg src="media/icons/duotune/general/gen025.svg" />
            </span>
            Menü Ağaç Yapısı
          </h3>
          <button
            type="button"
            class="btn btn-color-success btn-active-light-success"
            @click="$emit('add')"
          >
            <i class="fas fa-plus"></i>
            Yeni Menü Ekle
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="treeData.length === 0" class="text-center text-muted py-5">
          <span class="svg-icon svg-icon-3x text-muted mb-3">
            <inline-svg src="media/icons/duotune/general/gen025.svg" />
          </span>
          <p>Henüz menü bulunmuyor</p>
        </div>

        <div v-else class="menu-tree">
          <MenuTreeNode
            v-for="menu in treeData"
            :key="menu.id"
            :menu="menu"
            :level="0"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @addChild="$emit('addChild', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, defineProps, defineEmits, withDefaults } from "vue";
import { MenuDto } from "@/services/MenuService";
import MenuTreeNode from "./MenuTreeNode.vue";

interface Props {
  refreshTrigger?: number;
  menuData?: MenuDto[];
}

const props = withDefaults(defineProps<Props>(), {
  refreshTrigger: 0,
  menuData: () => [],
});

const emit = defineEmits<{
  edit: [menu: MenuDto];
  delete: [menu: MenuDto];
  add: [];
  addChild: [menu: MenuDto];
}>();

// Ağaç yapısını oluştur
const treeData = computed(() => {
  return buildMenuTree(props.menuData);
});

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

// Props değiştiğinde yeniden yükle (sadece refresh trigger için)
watch(
  () => props.refreshTrigger,
  () => {
    // Parent component'ten refresh geldiğinde bu component otomatik güncellenecek
    // çünkü props.menuData değişecek
  }
);
</script>

<style scoped>
.menu-tree-view {
  margin-bottom: 2rem;
}

.menu-tree-view .card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.menu-tree-view .card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.menu-tree-view .card-title {
  color: #333;
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  display: flex;
  align-items: center;
}

.menu-tree-view .card-title .svg-icon {
  color: #666;
  margin-right: 8px;
}

.menu-tree-view .card-body {
  padding: 20px;
  background: #ffffff;
}

.menu-tree {
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}

.menu-tree::-webkit-scrollbar {
  width: 6px;
}

.menu-tree::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.menu-tree::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.menu-tree::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
    padding: 12px 16px;
  }

  .menu-tree-view .card-title {
    font-size: 14px;
  }

  .menu-tree-view .card-body {
    padding: 16px;
  }

  .menu-tree {
    max-height: 300px;
    padding: 4px;
  }
}
</style>
