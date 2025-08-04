<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ restourantName }}
      </div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-success btn-active-light-success mx-5"
            @click="generate()"
          >
            <i class="fas fa-upload"></i>
            Pdf Hazırla
          </button>
          <button
            type="button"
            class="btn btn-color-danger btn-active-light-danger mx-5"
            @click="insertRestourantOrder()"
          >
            <i class="fas fa-mail-bulk"></i>
            Siparişleri Güncelle
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
              <label class="form-label fw-bold">Ödeme Tipi:</label>
              <div>
                <el-select
                  multiple
                  collapse-tags
                  placeholder="Ödeme Tipi Filtresi"
                  no-data-text="Veri Yok"
                  style="margin-right: 10px"
                  v-model="filterData.paymentType"
                >
                  <el-option
                    v-for="(item, index) in constants.find(
                      (s) => s.name == 'PaymentTypes'
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
                Sipariş Tarihleri Kısayol:
              </label>
              <div>
                <button
                  class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary me-3"
                  @click="setFilterDate('thismonth')"
                >
                  Bu Ay
                </button>
                <button
                  class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary me-3"
                  @click="setFilterDate('lastmonth')"
                >
                  Geçen Ay
                </button>
                <button
                  class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary me-3 my-2"
                  @click="setFilterDate('thisyear')"
                >
                  Bu Yıl
                </button>
                <button
                  class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary my-2"
                  @click="setFilterDate('lastyear')"
                >
                  Geçen Yıl
                </button>
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
            <div class="mb-5">
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
                  v-model="filterData.onlyDoubleRecords"
                  :checked="filterData.onlyDoubleRecords"
                  label="Sadece Çift Kayıtları Göster"
                />
                <el-checkbox
                  v-model="filterData.hideDoubleRecords"
                  :checked="filterData.hideDoubleRecords"
                  label="Çift Kayıtları Gizle"
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
        :id="`Order`"
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
          <MenuComponent :menu-selector="'#kt-order-menu' + row.id">
            <template v-slot:toggle>
              <div
                class="btn btn-sm btn-light btn-active-light-primary"
                :data-kt-menu-target="'#kt-order-menu' + row.id"
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
                :id="'kt-order-menu' + row.id"
              >
                <div class="menu-item">
                  <span class="menu-link" @click="changeActive(row)">
                    Aktifliği Değiştir
                  </span>
                </div>
              </div></template
            >
          </MenuComponent>
          <!--end::Menu-->
        </template>
      </AsDataTable>
      <GeneratePdf ref="pdfRef" mode="preview">
        <OrderPdfContent :items="pdfexportlist" />
      </GeneratePdf>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import {
  getFormattedValue,
  currencyFormat,
  dateShortcut,
} from "@/core/helpers/momentUtil";
import SwalAlert, { SwalConfirmBoxProps } from "@/core/helpers/swalalert";
import OrderService from "@/services/OrderService";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import { useRoute } from "vue-router";
import { Constants } from "@/core/models/SelectListItemModel";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";
import AdminService from "@/services/AdminService";
import GeneratePdf from "@/components/GeneratePdf";
import OrderPdfContent from "@/views/pages/OrderPdfContent.vue";
import { IOrder } from "@/services/OrderService";

const asDataTableRef = ref<null | typeof AsDataTable>(null);
const pdfRef = ref<null | typeof GeneratePdf>(null);
const pdfexportlist = ref<Array<IOrder>>([]);
var route = useRoute();
const defaultFilterData = () => ({
  active: 1,
  paymentType: null,
  startDate: null,
  endDate: null,
  onlyDoubleRecords: false,
  hideDoubleRecords: true,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
const constants = ref<Array<Constants>>([]);
const restId = route.params.id as string;
const restourantName = ref<string>("");
const tableHeader = ref([
  {
    name: "Müşteri Adı",
    key: "customerName",
    sortable: true,
  },
  {
    name: "Sipariş Tutarı",
    key: "totalPrice",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.totalPrice);
    },
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
    exportCallback: function (value) {
      return getFormattedValue(value.orderDate, "datetime");
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
    exportable: false,
  },
]);

onMounted(async () => {
  setCurrentPageBreadcrumbs("Sipariş Listesi", ["Sipariş"]);
  var constantlist = await OrderService.getConstants();
  constants.value = constantlist.list;
});

const getData = async (data, type) => {
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
  if (type != undefined && type == "export") {
    data = {
      take: 999999,
      page: 0,
      search: "",
    };
  }
  filterData.paymentType = !filterData.paymentType?.length
    ? null
    : filterData.paymentType;
  var list = await OrderService.getOrders(data, restId, filterData);
  if (type != undefined && type == "export") {
    return list.list;
  }
  filtered.value = isObjectEqual(filterData, defaultFilterData());
  if (filtered.value) {
    replaceUrl(route.path + "?" + toQueryString(filterData));
  }
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  restourantName.value = list.list[0]?.restourantName;
  return list;
};

const changeActive = async (row) => {
  var result = await SwalAlert.confirm({
    title: "Aktiflik değiştirilsin mi?",
    type: "question",
  } as SwalConfirmBoxProps);
  if (result.isConfirmed) {
    row.active = row.active == 1 ? 0 : 1;
    await OrderService.updateOrder(row);
    SwalAlert.toast("Başarıyla Güncellendi !", "success");
    refresh();
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
      refresh();
    }
  }
};

const insertRestourantOrder = async () => {
  var result = await SwalAlert.confirm({
    title: "Sipariş listesi güncellensin mi",
    type: "question",
  } as SwalConfirmBoxProps);
  if (result.isConfirmed) {
    SwalAlert.toast("Lütfen Bekleyiniz !");
    var data = await AdminService.InsertSelectedRestourantOrders(restId);
    if (data.totalCount == undefined) return;
    SwalAlert.toast(
      data.totalCount + " sipariş başarıyla eklendi !",
      "success"
    );
    refresh();
  }
};

const setFilterDate = (
  type: "thismonth" | "lastmonth" | "thisyear" | "lastyear"
) => {
  const dates = dateShortcut(type);
  filterData.startDate = dates.firstDate;
  filterData.endDate = dates.lastDate;
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

const generate = async () => {
  pdfexportlist.value = await getData(null, "export");
  if (pdfRef.value) pdfRef.value.generatePDF();
};
</script>
