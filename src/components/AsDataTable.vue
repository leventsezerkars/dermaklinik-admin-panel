<template>
  <div class="d-flex">
    <div class="d-flex align-items-center" v-if="searchable">
      <span class="svg-icon svg-icon-1 position-absolute ms-6">
        <inline-svg src="media/icons/duotune/general/gen021.svg" />
      </span>
      <input
        type="text"
        v-debounce:400ms="search"
        class="form-control form-control-solid w-250px ps-15"
        v-model="pagination.search"
        placeholder="Ara"
      />
    </div>
    <div class="d-flex align-items-center" v-if="exportable">
      <MenuComponent menu-selector="#kt-export-menu">
        <template v-slot:toggle>
          <div
            class="btn btn-sm btn-light-info btn-active-light-info mx-1"
            data-kt-menu-target="#kt-export-menu"
            data-kt-menu-trigger="click"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="bottom"
          >
            <i class="fas fa-download mb-1"></i> Dışa Aktar
          </div>
        </template>
        <template v-slot:content>
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px p-3"
            data-kt-menu="true"
            id="kt-export-menu"
          >
            <div class="menu-item">
              <JsonExcel
                :fetch="async () => await getData('export')"
                :fields="exportFields"
                class="menu-link"
              >
                <i class="fas fa-file-excel text-success mb-1 mx-1"></i>
                Excel
              </JsonExcel>
            </div>
            <div class="menu-item">
              <JsonExcel
                :fetch="async () => await getData('export-all')"
                :fields="exportFields"
                class="menu-link"
              >
                <i class="fas fa-file-excel text-success mb-1 mx-1"></i>
                Excel (Tüm veri)
              </JsonExcel>
            </div>
          </div></template
        >
      </MenuComponent>
    </div>
    <div
      v-if="checkedItems.length !== 0"
      class="d-flex align-items-center"
      style="margin-left:auto; !important"
    >
      <div class="fw-bolder me-5">
        <span class="me-2">{{ checkedItems.length }}</span
        >Seçili
      </div>
      <slot
        name="checked-toolbar"
        :items="checkedItems"
        :rows="checkedRows"
      ></slot>
    </div>
  </div>

  <Datatable
    :id="props.id"
    :loading="loading"
    :tableHeader="tableHeader"
    :tableData="tableData"
    :total="pagination.total"
    @current-change="setPage"
    @items-per-page-change="setItemsPerPage"
    :rowsPerPage="pagination.take"
    :enableItemsPerPageDropdown="enablePerPageDropdown"
    @sort="onSort"
    @row-click="rowClick"
    @all-checked="allChecked"
    :selectedRowActive="props.selectedRowActive"
  >
    <template v-if="props.checkableColumn" v-slot:cell-checkbox="{ row }">
      <div class="form-check form-check-sm form-check-custom form-check-solid">
        <input
          class="form-check-input"
          type="checkbox"
          :value="row[props.checkColumnValue]"
          v-model="checkedItems"
        />
      </div>
    </template>
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </Datatable>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineExpose,
  defineEmits,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import Datatable from "@/components/kt-datatable/KTDatatable.vue";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import JsonExcel from "vue-json-excel3";
import MenuComponent from "@/components/menu/MenuComponent.vue";
const props = defineProps({
  id: {
    type: String,
    default: "datatable",
  },
  items: {
    type: [Array, Function],
    default: () => [],
  },
  header: {
    type: Array,
    default: () => [],
    required: true,
  },
  checkableColumn: {
    type: Boolean,
    default: () => false,
  },
  selectedRowActive: {
    type: Boolean,
    default: () => false,
  },
  checkColumnValue: {
    type: String,
    default: () => "id",
  },
  enableItemsPerPageDropdown: {
    type: Boolean,
    default: () => true,
  },
  noPagination: {
    type: Boolean,
    default: () => false,
  },
  searchable: {
    type: Boolean,
    default: () => true,
  },
  exportable: {
    type: Boolean,
    default: () => true,
  },
});

var emits = defineEmits(["row-click"]);

let tableData = ref([]);
let tableHeader = ref(props.header);
const loading = ref<boolean>(false);
const enablePerPageDropdown = ref<boolean>(props.enableItemsPerPageDropdown);
const pagination = ref<IPagination>({ ...defaultPagination });
const checkedItems = ref([]);
const checkedRows = ref([]);
const exportFields = ref({});
onMounted(() => {
  tableHeader.value = tableHeader.value.filter((s) => s.show != false);

  tableHeader.value.forEach((s) => {
    if (s.exportable == undefined || s.exportable == true) {
      if (
        s.exportCallback != undefined &&
        typeof s.exportCallback === "function"
      ) {
        exportFields.value = Object.assign(exportFields.value, {
          [s.name]: { callback: s.exportCallback },
        });
      } else {
        exportFields.value = Object.assign(exportFields.value, {
          [s.name]: s.key,
        });
      }
    }
  });
  if (props.noPagination) {
    pagination.value.take = 99999;
    enablePerPageDropdown.value = false;
  }
  if (
    props.checkableColumn &&
    tableHeader.value.map((s) => s.key).indexOf("checkbox") == -1
  ) {
    var checkedheader = {
      key: "checkbox",
      sortable: false,
    };
    tableHeader.value.splice(0, 0, checkedheader);
  }
});

const getData = async (type = "default") => {
  try {
    loading.value = true;
    if (typeof props.items === "function") {
      if (type.startsWith("export")) {
        const exportData = await props.items({
          take: type == "export-all" ? 1000000 : pagination.value.take,
          page: type == "export-all" ? 0 : pagination.value.page,
          search: pagination.value.search,
          total: 0,
        });

        return exportData.data;
      } else {
        let items = await props.items(pagination.value);
        if (items == undefined || items.length == 0) {
          items = { data: [] };
        }
        tableData.value.splice(0, tableData.value.length, ...items.data);
        if (!props.noPagination) {
          pagination.value.total = items.totalCount;
        }
      }
    } else {
      tableData.value.splice(0, tableData.value.length, ...props.items);

      if (type != "default") {
        return tableData.value;
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const refresh = () => {
  getData();
  checkedClear();
};
const setPage = (data) => {
  pagination.value.page = data == 0 ? data : data - 1;
  getData();
};
const setItemsPerPage = (data) => {
  pagination.value.take = data;
  getData();
};
const search = (data) => {
  pagination.value.search = data;
  pagination.value.page = 0;
  getData();
};
const checkedClear = () => {
  checkedItems.value.length = 0;
};
const getcheckedRow = () => {
  var newchecked = checkedItems.value.filter(
    (i) => !checkedRows.value.find((s) => s[props.checkColumnValue] == i)
  );
  for (var i = 0; i < newchecked.length; i++) {
    checkedRows.value.push(
      tableData.value.find((s) => s[props.checkColumnValue] == newchecked[i])
    );
  }
};
const currentData = () => {
  return tableData.value;
};

const onSort = (data) => {
  pagination.value.orderBy = data.columnName;
  pagination.value.direction = data.order;
  getData();
};

const rowClick = (data) => {
  emits("row-click", data);
};

const allChecked = (data) => {
  if (data) {
    checkedItems.value = tableData.value.map((s) => s[props.checkColumnValue]);
  } else {
    checkedClear();
  }
};
watchEffect(() => props.items, getData());
watch(
  () => props.items,
  () => {
    getData();
  }
);
watch(
  () => checkedItems.value,
  () => getcheckedRow()
);
defineExpose({ refresh, checkedClear, currentData });
</script>
