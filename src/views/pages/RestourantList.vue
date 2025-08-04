<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title"></div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-warning btn-active-light-warning mx-5"
            @click="showhideFilterModal(true)"
          >
            <i class="fas fa-trash"></i>
            Test Siparişleri kontrol et
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-danger btn-active-light-danger mx-5"
            @click="insertAllOrder()"
          >
            <i class="fas fa-mail-bulk"></i>
            Siparişleri Güncelle
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-info btn-active-light-info mx-5"
            @click="insertRestourant()"
          >
            <i class="fas fa-mail-bulk"></i>
            Restoranları Güncelle
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
            <div class="mb-10">
              <label class="form-label fw-bold">Ön Ek:</label>
              <div>
                <el-select
                  placeholder="Ön Ek Filtresi"
                  no-data-text="Veri Yok"
                  style="margin-right: 10px"
                  v-model="filterData.prefix"
                >
                  <el-option label="Seçiniz.." :value="null"></el-option>
                  <el-option
                    v-for="(item, index) in constants.find(
                      (s) => s.name == 'Prefixes'
                    )?.items"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="mb-10">
              <label class="form-label fw-bold">Uygulama Tipi:</label>
              <div>
                <el-select
                  placeholder="Uygulama Tipi Filtresi"
                  no-data-text="Veri Yok"
                  style="margin-right: 10px"
                  v-model="filterData.appType"
                >
                  <el-option label="Seçiniz.." :value="null"></el-option>
                  <el-option
                    v-for="(item, index) in constants.find(
                      (s) => s.name == 'AppTypes'
                    )?.items"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="mb-10">
              <label class="form-label fw-bold">
                Sipariş Başlangıç Tarihi:
              </label>
              <div>
                <el-date-picker
                  v-model="filterData.startDate"
                  type="date"
                  placeholder="Tarih Seç"
                  format="DD.MM.YYYY"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="mb-10">
              <label class="form-label fw-bold">Sipariş Bitiş Tarihi:</label>
              <div>
                <el-date-picker
                  v-model="filterData.endDate"
                  type="date"
                  placeholder="Tarih Seç"
                  format="DD.MM.YYYY"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="mb-10">
              <div>
                <el-checkbox
                  v-model="filterData.hasCompany"
                  :checked="filterData.hasCompany"
                  label="Şirketi Olmayanları Göster"
                />
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
        :id="`Restourant`"
        :checkableColumn="true"
      >
        <template v-slot:checked-toolbar="{ items }">
          <div class="fv-row mx-2">
            <Multiselect
              v-model="selectedCompany"
              mode="single"
              placeholder="Şirket arayın"
              :filter-results="false"
              :min-chars="2"
              :resolve-on-load="false"
              :delay="300"
              :searchable="true"
              label="companyName"
              valueProp="id"
              :options="
                async function (query) {
                  return await searchCompany(query);
                }
              "
            />
          </div>
          <button
            type="button"
            class="btn btn-info"
            @click="addToCompany(items)"
          >
            Seçili{{ items.length > 1 ? "leri" : "yi" }} Şirkete Ekle
          </button>
        </template>
        <template v-slot:cell-name="{ row }">
          <router-link :to="`/order/${row.id}`">
            {{ row.name }}
          </router-link>
        </template>
        <template v-slot:cell-lastOrderDate="{ row }">
          {{ getFormattedValue(row.lastOrderDate, "datetime") }}
        </template>
        <template v-slot:cell-controlledDate="{ row }">
          {{ getFormattedValue(row.controlledDate, "datetime") }}
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
          <MenuComponent :menu-selector="'#kt-restourant-menu' + row.id">
            <template v-slot:toggle>
              <div
                class="btn btn-sm btn-light btn-active-light-primary"
                :data-kt-menu-target="'#kt-restourant-menu' + row.id"
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
                :id="'kt-restourant-menu' + row.id"
              >
                <div class="menu-item">
                  <span class="menu-link" @click="changeActive(row)">
                    Aktifliği Değiştir
                  </span>
                </div>
                <div class="menu-item">
                  <span class="menu-link" @click="updateRestourantModal(row)">
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
  <ModalUpdateRestourant
    v-model="selectedRestourant"
    @submitted="refresh"
  ></ModalUpdateRestourant>
  <ModalView
    ref="orderfiltermodal"
    header-text="Test Sipariş Listesi"
    id="orderfilters"
  >
    <template v-slot:body>
      <AsDataTable
        :items="testOrders"
        :header="testordertableHeader"
        ref="testOrderDataTableRef"
        :id="`TestOrder`"
        :exportable="false"
        :searchable="false"
        :checkableColumn="true"
      >
        <template v-slot:checked-toolbar="{ items }">
          <div class="fv-row mx-2">
            <button
              type="button"
              class="btn btn-info"
              @click="orderbulkupdate(items)"
            >
              Seçili{{ items.length > 1 ? "leri" : "yi" }} Sil
            </button>
          </div>
        </template>
        <template v-slot:cell-orderDate="{ row }">
          {{ getFormattedValue(row.orderDate, "datetime") }}
        </template>
        <template v-slot:cell-totalPrice="{ row }">
          {{ currencyFormat(row.totalPrice, true) }}
        </template>
      </AsDataTable>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-color-danger btn-active-light-danger mx-5"
          @click="showhideFilterModal(false)"
        >
          <i class="fas fa-times"></i>
          İptal
        </button>
      </div>
    </template>
  </ModalView>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
import SwalAlert from "@/core/helpers/swalalert";
import RestourantService, { IRestourant } from "@/services/RestourantService";
import AdminService from "@/services/AdminService";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { replaceUrl, toQueryString, isObjectEqual } from "@/core/helpers/dom";
import { Constants } from "@/core/models/SelectListItemModel";
import Multiselect from "@vueform/multiselect";
import CompanyService from "@/services/CompanyService";
import ModalUpdateRestourant from "./ModalUpdateRestourant.vue";
import { Modal } from "bootstrap";
import OrderService from "@/services/OrderService";
import ModalView from "@/components/Modal/Modal.vue";

const tableHeader = ref([
  {
    name: "Restoran Adı",
    key: "name",
    sortable: true,
  },
  {
    name: "Şirket",
    key: "companyName",
    sortable: false,
  },
  {
    name: "Uygulama Tipi",
    key: "appType",
    sortable: true,
  },
  {
    name: "Ön EK",
    key: "appPrefix",
    sortable: true,
  },
  {
    name: "Son Sipariş Zamanı",
    key: "lastOrderDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value) {
      return getFormattedValue(value.lastOrderDate, "datetime");
    },
  },
  {
    name: "Son Güncellenme Zamanı",
    key: "controlledDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value) {
      return getFormattedValue(value.controlledDate, "datetime");
    },
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
const testordertableHeader = ref([
  {
    name: "Müşteri Adı",
    key: "customerName",
    sortable: true,
  },
  {
    name: "Sipariş Tutarı",
    key: "totalPrice",
    sortable: true,
  },
  {
    name: "Ödeme Tipi",
    key: "paymentType",
    sortable: true,
  },
  {
    name: "Sipariş Tarihi",
    key: "orderDate",
    sortable: true,
  },
]);

const asDataTableRef = ref<null | typeof AsDataTable>(null);
const testOrderDataTableRef = ref<null | typeof AsDataTable>(null);
const orderfiltermodal = ref<null | typeof ModalView>(null);
const selectedRestourant = ref<IRestourant>({});
var route = useRoute();
const defaultFilterData = () => ({
  active: 1,
  prefix: null,
  appType: null,
  startDate: null,
  endDate: null,
  hasCompany: null,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
const showTestOrderModal = ref<boolean>(false);
const selectedCompany = ref<number>(0);
const constants = ref<Array<Constants>>([]);
onMounted(async () => {
  setCurrentPageBreadcrumbs("Restoran Listesi", ["Restoran"]);
  var constantlist = await RestourantService.getConstants();
  constants.value = constantlist.list;
});

const getData = async (data) => {
  if (filterData && filterData.startDate) {
    var date = new Date(filterData.startDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.startDate = fullDate;
  }

  if (filterData && filterData.endDate) {
    var date2 = new Date(filterData.endDate);
    let day = date2.getDate();
    let month = date2.getMonth() + 1;
    let year = date2.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.endDate = fullDate;
  }
  var list = await RestourantService.getRestourants(data, filterData);
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
    await updateRestourant(row);
  }
};

const insertRestourant = async () => {
  var result = await SwalAlert.confirm({
    title: "Restoran listesi güncellensin mi",
    type: "question",
  });
  if (result.isConfirmed) {
    SwalAlert.toast("Lütfen Bekleyiniz !");
    var data = await AdminService.InsertRestourants();
    if (data.result) {
      SwalAlert.toast(
        data.totalCount + " restoran başarıyla eklendi !",
        "success"
      );
      refresh();
    }
  }
};

const insertAllOrder = async () => {
  var result = await SwalAlert.confirm({
    title: "Sipariş listesi güncellensin mi? Bu işlem uzun sürecektir.",
    type: "question",
  });
  if (result.isConfirmed) {
    SwalAlert.toast("Lütfen Bekleyiniz ! Bu işlem uzun sürecektir.");
    var data = await AdminService.InsertOrders();
    if (data.result) {
      SwalAlert.toast(
        data.totalCount + " sipariş başarıyla eklendi !",
        "success"
      );
      refresh();
    } else {
      SwalAlert.toast(data.errorMessage!, "error");
    }
  }
};

const searchCompany = async (query) => {
  var list = await CompanyService.getCompanies({
    page: 0,
    take: 100,
    direction: "asc",
    orderBy: "companyName",
    search: query,
  });
  return list.list;
};

const showhideFilterModal = (state: boolean) => {
  showTestOrderModal.value = state;
  if (state) {
    orderfiltermodal.value?.show();
    if (testOrderDataTableRef.value) testOrderDataTableRef.value.refresh();
  } else {
    orderfiltermodal.value?.hide();
  }
};
const testOrders = async (data) => {
  if (showTestOrderModal.value) {
    var list = await OrderService.getTestOrders(data);
    return list;
  } else {
    return [];
  }
};

const orderbulkupdate = async (ids) => {
  var result = await SwalAlert.confirm({
    title: "Siparişler silinsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    var data = await OrderService.bulkUpdateOrder(ids);
    if (data.result) {
      SwalAlert.toast("Başarıyla Güncellendi !", "success");
      if (testOrderDataTableRef.value) testOrderDataTableRef.value.refresh();
    }
  }
};
const updateRestourant = async (row) => {
  await RestourantService.updateRestourant(row);
  SwalAlert.toast("Başarıyla Güncellendi !", "success");
  refresh();
};

const addToCompany = async (ids) => {
  var result = await SwalAlert.confirm({
    title: "Şirketler değiştirilsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    ids.forEach(async (id) => {
      var row = asDataTableRef.value.currentData().find((s) => s.id == id);
      row.companyId = selectedCompany.value;
      await updateRestourant(row);
    });
  }
};

const updateRestourantModal = (row) => {
  selectedRestourant.value = row;
  showModal();
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_restourant"));
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
