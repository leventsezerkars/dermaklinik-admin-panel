<template>
  <div class="menu-tree-node" :style="{ marginLeft: level * 24 + 'px' }">
    <div class="menu-item-content">
      <div class="menu-item-header">
        <div class="menu-item-left">
          <!-- Expand/Collapse Icon -->
          <button
            v-if="menu.children && menu.children.length > 0"
            type="button"
            class="expand-btn"
            @click="toggleExpanded"
          >
            <span class="expand-icon" :class="{ expanded: isExpanded }">
              <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
            </span>
          </button>

          <!-- Menu Icon -->
          <div class="menu-icon-wrapper">
            <span class="menu-icon">
              <inline-svg :src="getMenuIcon(menu.type)" />
            </span>
          </div>

          <!-- Menu Info -->
          <div class="menu-info">
            <div class="menu-title">{{ getMenuTitle(menu) }}</div>
            <div class="menu-meta">
              <span class="menu-type-badge">{{
                getMenuTypeName(menu.type)
              }}</span>
              <span
                class="menu-status-badge"
                :class="menu.isActive ? 'active' : 'inactive'"
              >
                {{ menu.isActive ? "Aktif" : "Pasif" }}
              </span>
              <span class="menu-order">#{{ menu.sortOrder }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="menu-actions">
          <button
            type="button"
            class="action-btn edit-btn"
            @click="$emit('edit', menu)"
            title="Düzenle"
          >
            <inline-svg src="media/icons/duotune/art/art005.svg" />
          </button>
          <button
            v-if="menu.isDeletable"
            type="button"
            class="action-btn delete-btn"
            @click="$emit('delete', menu)"
            title="Sil"
          >
            <inline-svg src="media/icons/duotune/general/gen027.svg" />
          </button>
        </div>
      </div>
    </div>

    <!-- Children -->
    <div
      v-if="menu.children && menu.children.length > 0 && isExpanded"
      class="menu-children"
    >
      <div class="children-connector"></div>
      <MenuTreeNode
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
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
}>();

const isExpanded = ref(true);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getMenuTitle = (menu: MenuDto): string => {
  const translations = menu.translations;
  const translation = translations?.[0];
  return translation?.title || "Başlıksız";
};

const getMenuTypeName = (type: number): string => {
  switch (type) {
    case 0:
      return "Sayfa";
    case 1:
      return "Link";
    case 2:
      return "Content";
    case 3:
      return "Kapça";
    default:
      return "Bilinmiyor";
  }
};

const getMenuIcon = (type: number): string => {
  switch (type) {
    case 0:
      return "media/icons/duotune/general/gen025.svg";
    case 1:
      return "media/icons/duotune/general/gen024.svg";
    case 2:
      return "media/icons/duotune/files/fil024.svg";
    case 3:
      return "media/icons/duotune/general/gen026.svg";
    default:
      return "media/icons/duotune/general/gen025.svg";
  }
};
</script>

<style scoped>
.menu-tree-node {
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.menu-item-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.menu-item-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.menu-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  min-height: 40px;
}

.menu-item-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.expand-btn {
  background: none;
  border: none;
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
}

.expand-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 14px;
  height: 14px;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.menu-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: white;
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-title {
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
  margin-bottom: 2px;
  line-height: 1.3;
}

.menu-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.menu-type-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.menu-status-badge {
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.menu-status-badge.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.menu-status-badge.inactive {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.menu-order {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  padding: 1px 6px;
  border-radius: 8px;
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
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.action-btn:hover {
  transform: scale(1.1);
}

.edit-btn {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.edit-btn:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.delete-btn {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.menu-children {
  position: relative;
  margin-top: 8px;
  padding-left: 16px;
}

.children-connector {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    #e5e7eb 0%,
    #d1d5db 50%,
    transparent 100%
  );
  border-radius: 1px;
}

.children-connector::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 0;
  width: 10px;
  height: 2px;
  background: #d1d5db;
  border-radius: 1px;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-item-header {
    padding: 12px 16px;
    min-height: 50px;
  }

  .menu-icon-wrapper {
    width: 32px;
    height: 32px;
  }

  .menu-icon {
    width: 16px;
    height: 16px;
  }

  .menu-title {
    font-size: 13px;
  }

  .menu-meta {
    gap: 6px;
  }

  .menu-type-badge,
  .menu-status-badge,
  .menu-order {
    font-size: 10px;
    padding: 1px 6px;
  }
}
</style>
