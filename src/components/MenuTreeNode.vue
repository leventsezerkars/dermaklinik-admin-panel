<template>
  <div class="menu-tree-node" :class="{ 'is-selected': isSelected }">
    <div
      class="menu-item-content"
      :class="{ 'level-0': level === 0 }"
      :style="{ paddingLeft: level > 0 ? level * 20 + 'px' : '12px' }"
    >
      <!-- Expand/Collapse Icon -->
      <button
        v-if="menu.children && menu.children.length > 0"
        type="button"
        class="expand-btn"
        @click="toggleExpanded"
      >
        <i class="fas fa-chevron-right" :class="{ expanded: isExpanded }"></i>
      </button>

      <!-- Menu Icon -->
      <div class="menu-icon" :class="getMenuIconWrapperClass(menu)">
        <i :class="getMenuIconClass(menu)"></i>
      </div>

      <!-- Menu Title -->
      <div class="menu-title" @click="selectNode">
        <span class="title-text">{{ getMenuTitle(menu) }}</span>
        <span class="type-badge">{{ getMenuTypeName(menu.type) }}</span>
        <span class="sort-badge">#{{ menu.sortOrder }}</span>
      </div>

      <!-- Actions -->
      <div class="menu-actions">
        <button
          type="button"
          class="action-btn add-child-btn"
          @click="$emit('addChild', menu)"
          title="Alt Menü Ekle"
        >
          <i class="fas fa-plus"></i>
        </button>
        <button
          type="button"
          class="action-btn edit-btn"
          @click="$emit('edit', menu)"
          title="Düzenle"
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          v-if="menu.isDeletable"
          type="button"
          class="action-btn delete-btn"
          @click="$emit('delete', menu)"
          title="Sil"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- Children -->
    <div
      v-if="menu.children && menu.children.length > 0 && isExpanded"
      class="menu-children"
    >
      <MenuTreeNode
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @addChild="$emit('addChild', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { MenuDto } from "@/services/MenuService";

interface Props {
  menu: MenuDto;
  level: number;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [menu: MenuDto];
  delete: [menu: MenuDto];
  addChild: [menu: MenuDto];
}>();

const isExpanded = ref(true);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getMenuTitle = (menu: MenuDto): string => {
  const translations = menu.translations;
  const translation = translations?.find((t) => t.language?.code === "tr");
  return translation?.title || "Başlıksız";
};

const getMenuTypeName = (type: number): string => {
  switch (type) {
    case 0:
      return "Sayfa";
    case 1:
      return "Link";
    case 2:
      return "Kapça";
    default:
      return "Bilinmiyor";
  }
};

const getMenuIconClass = (menu: MenuDto): string => {
  // Alt menüsü varsa folder ikonu
  if (menu.children && menu.children.length > 0) {
    return "fas fa-folder";
  }

  // Alt menüsü yoksa type'a göre ikon
  switch (menu.type) {
    case 0:
      return "fas fa-file-alt";
    case 1:
      return "fas fa-share";
    case 2:
      return "fas fa-link";
    default:
      return "fas fa-file-alt";
  }
};

const getMenuIconWrapperClass = (menu: MenuDto): string => {
  // Alt menüsü varsa folder wrapper class'ı
  if (menu.children && menu.children.length > 0) {
    return "icon-folder";
  }

  // Alt menüsü yoksa type'a göre wrapper class
  switch (menu.type) {
    case 0:
      return "icon-page";
    case 1:
      return "icon-link";
    case 2:
      return "icon-anchor";
    default:
      return "icon-page";
  }
};

const isSelected = ref(false);

const selectNode = () => {
  isSelected.value = !isSelected.value;
};
</script>

<style scoped>
.menu-tree-node {
  position: relative;
  margin-bottom: 2px;
}

.menu-tree-node.is-selected .menu-item-content {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 36px;
  margin-left: 0;
}

/* Level 0 için özel stil */
.menu-item-content.level-0 {
  margin-left: 0;
  border-left: 3px solid #e0e0e0;
}

.menu-item-content.level-0:hover {
  border-left-color: #2196f3;
}

.menu-item-content:hover {
  background-color: #f5f5f5;
  border-color: #bdbdbd;
}

.menu-item-content:hover .menu-icon {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.expand-btn {
  background: none;
  border: none;
  padding: 4px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

.expand-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.expand-btn i {
  font-size: 12px;
  color: #666;
  transition: transform 0.2s ease;
}

.expand-btn i.expanded {
  transform: rotate(90deg);
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.menu-icon i {
  font-size: 14px;
  color: white;
}

/* Icon renkleri */
.menu-icon.icon-page {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.menu-icon.icon-link {
  background: linear-gradient(135deg, #2196f3, #1976d2);
}

.menu-icon.icon-content {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.menu-icon.icon-folder {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
}

.menu-icon.icon-anchor {
  background: linear-gradient(135deg, #ff5722, #d84315);
}

.menu-title {
  flex: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.title-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}

.type-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sort-badge {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  font-family: "Courier New", monospace;
}

.menu-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.menu-item-content:hover .menu-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.add-child-btn {
  color: #4caf50;
}

.add-child-btn:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.edit-btn {
  color: #2196f3;
}

.edit-btn:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.delete-btn {
  color: #f44336;
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.menu-children {
  margin-left: 20px;
  border-left: 1px dotted #ccc;
  padding-left: 8px;
  margin-top: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-item-content {
    padding: 10px 8px;
    min-height: 40px;
  }

  .title-text {
    font-size: 13px;
  }

  .menu-icon {
    width: 20px;
    height: 20px;
  }

  .menu-icon i {
    font-size: 12px;
  }

  .title-meta {
    gap: 4px;
  }

  .type-badge,
  .sort-badge {
    font-size: 9px;
    padding: 1px 4px;
  }
}
</style>
