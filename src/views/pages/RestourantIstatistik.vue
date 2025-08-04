<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">Restoran İstatistik</div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <FilterDropDown
            @onSubmit="onFilter"
            @onReset="onFilterReset"
            :filterStatus="filtered"
          >
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
          </FilterDropDown>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <AsDataTable
        :items="getData"
        :header="tableHeader"
        ref="asDataTableRef"
        :id="`istatistik`"
        :searchable="false"
      >
        <template v-slot:cell-orderTotal="{ row }">
          {{ currencyFormat(row.orderTotal, true) }}
        </template>
        <template v-slot:cell-orderAvg="{ row }">
          {{ currencyFormat(row.orderAvg, true) }}
        </template>
      </AsDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import RestourantService from "@/services/RestourantService";
import { currencyFormat, dateShortcut } from "@/core/helpers/momentUtil";
import { useRoute } from "vue-router";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";
import { Constants } from "@/core/models/SelectListItemModel";
import OrderService from "@/services/OrderService";

const constants = ref<Array<Constants>>([]);
const asDataTableRef = ref<null | typeof AsDataTable>(null);
var route = useRoute();
const defaultFilterData = () => ({
  appType: null,
  prefix: null,
  paymentType: null,
  startDate: null,
  endDate: null,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
const tableHeader = ref([
  {
    name: "Restoran",
    key: "name",
    sortable: true,
  },
  {
    name: "Uygulama Tipi",
    key: "appType",
    sortable: true,
  },
  {
    name: "Ön Ek",
    key: "appPrefix",
    sortable: true,
  },
  {
    name: "Sipariş Sayısı",
    key: "orderCount",
    sortable: true,
  },
  {
    name: "Sipariş Başına Ücret Sayısı",
    key: "orderAvg",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.orderAvg);
    },
  },
  {
    name: "Toplam Sipariş Ücreti",
    key: "orderTotal",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.orderTotal);
    },
  },
]);

onMounted(async () => {
  setCurrentPageBreadcrumbs("Restoran Istatistik", ["Istatistik"]);
  var constantlist = await OrderService.getConstants();
  var restconstantlist = await RestourantService.getConstants();
  constants.value = restconstantlist.list;
  constants.value.push(constantlist.list[0]);
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

  filterData.paymentType = !filterData.paymentType?.length
    ? null
    : filterData.paymentType;
  var list = await RestourantService.getRestourantIstatistik(data, filterData);

  filtered.value = isObjectEqual(filterData, defaultFilterData());
  replaceUrl(route.path + "?" + toQueryString(filterData));

  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  return list;
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
</script>
