<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-info btn-active-light-info mx-5"
            @click="addDatabaseModal()"
          >
            <i class="fas fa-mail-bulk"></i>
            Veritabanı Ekle
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <FilterDropDown
            @onSubmit="onFilter"
            @onReset="onFilterReset"
            :filterStatus="filtered"
          >
            <div class="mb-10">
              <label class="form-label fw-bold">Aktif:</label>
              <div>
                <el-select
                  placeholder="Aktiflik Filtresi"
                  no-data-text="Veri Yok"
                  style="margin-right: 10px"
                  v-model="filterData.active"
                >
                  <el-option label="Seçiniz.." :value="null"></el-option>
                  <el-option key="0" :label="'Aktif'" value="1" />
                  <el-option key="1" :label="'Pasif'" value="0" />
                </el-select>
              </div>
            </div>
          </FilterDropDown>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <AsDataTable
        :items="getData"
        :header="tableHeader"
        ref="asDataTableRef"
        :id="`Database`"
      >
        <template v-slot:cell-password>
          <span>**********</span>
        </template>
        <template v-slot:cell-active="{ row }">
          <i
            class="fa"
            :class="[
              { 'fa-check text-success': row.active },
              { 'fa-times text-danger': !row.active },
            ]"
          />
        </template>
        <template v-slot:cell-actions="{ row }">
          <MenuComponent :menu-selector="'#kt-database-menu' + row.id">
            <template v-slot:toggle>
              <div
                class="btn btn-sm btn-light btn-active-light-primary"
                :data-kt-menu-target="'#kt-database-menu' + row.id"
                data-kt-menu-trigger="click"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="bottom"
              >
                <i class="fas fa-ellipsis-v"></i>
              </div>
            </template>
            <template v-slot:content>
              <div
                class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px p-3"
                data-kt-menu="true"
                :id="'kt-database-menu' + row.id"
              >
                <div class="menu-item">
                  <span class="menu-link" @click="changeActive(row)">
                    Aktifliği Değiştir
                  </span>
                </div>
                <div class="menu-item">
                  <span class="menu-link" @click="updateDatabaseModal(row)">
                    Düzenle
                  </span>
                </div>
              </div></template
            >
          </MenuComponent>

          <!--end::Menu-->
        </template>
      </AsDataTable>
    </div>
  </div>
  <ModalAddUpdateDatabase
    v-model="selectedDatabase"
    @submitted="refresh"
  ></ModalAddUpdateDatabase>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { replaceUrl, toQueryString, isObjectEqual } from "@/core/helpers/dom";
import DatabaseService, { IDatabase } from "@/services/DatabaseService";
import ModalAddUpdateDatabase from "./ModalAddUpdateDatabase.vue";
import { Modal } from "bootstrap";

const tableHeader = ref([
  {
    name: "Tag",
    key: "tagName",
    sortable: true,
  },
  {
    name: "Server Name",
    key: "serverName",
    sortable: false,
  },
  {
    name: "Db Name",
    key: "dbName",
    sortable: false,
  },
  {
    name: "Kullanıcı Adı",
    key: "userName",
    sortable: false,
  },
  {
    name: "Şifre",
    key: "password",
    sortable: false,
  },
  {
    name: "Aktiflik",
    key: "active",
    sortable: true,
    exportable: false,
  },
  {
    name: "İşlemler",
    key: "actions",
    sortable: false,
    exportable: false,
  },
]);

const asDataTableRef = ref<null | typeof AsDataTable>(null);
const selectedDatabase = ref<IDatabase>({});
var route = useRoute();
const defaultFilterData = () => ({
  active: 1,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
onMounted(async () => {
  setCurrentPageBreadcrumbs("Veritabanı Listesi", ["Veritabanı"]);
});

const getData = async (data) => {
  var list = await DatabaseService.getDatabases(data, filterData);
  replaceUrl(route.path + "?" + toQueryString(filterData));
  filtered.value = isObjectEqual(filterData, defaultFilterData());
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  return list;
};

const changeActive = async (row) => {
  var result = await SwalAlert.confirm({
    title: "Aktiflik değiştirilsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    row.active = row.active == 1 ? 0 : 1;
    await updateDatabase(row);
  }
};

const updateDatabase = async (row) => {
  await DatabaseService.addUpdateDatabase(row);
  SwalAlert.toast("Başarıyla Güncellendi !", "success");
  refresh();
};

const updateDatabaseModal = (row) => {
  selectedDatabase.value = row;
  showModal();
};

const addDatabaseModal = () => {
  selectedDatabase.value = {};
  showModal();
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_database"));
  modal.show();
};

const onFilter = () => {
  refresh();
};
const onFilterReset = () => {
  Object.assign(filterData, defaultFilterData());
};

const refresh = () => {
  if (asDataTableRef.value) asDataTableRef.value.refresh();
};
</script>
