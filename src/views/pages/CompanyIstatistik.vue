<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">Şirket İstatistik</div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <FilterDropDown
            @onSubmit="onFilter"
            @onReset="onFilterReset"
            :filterStatus="filtered"
          >
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
        <template v-slot:cell-total="{ row }">
          {{ currencyFormat(row.total, true) }}
        </template>
        <template v-slot:cell-price="{ row }">
          {{ currencyFormat(row.price, true) }}
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
import CompanyService from "@/services/CompanyService";
import { currencyFormat, dateShortcut } from "@/core/helpers/momentUtil";
import { useRoute } from "vue-router";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";

const asDataTableRef = ref<null | typeof AsDataTable>(null);
var route = useRoute();
const defaultFilterData = () => ({
  startDate: null,
  endDate: null,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
const tableHeader = ref([
  {
    name: "Şirket",
    key: "companyName",
    sortable: true,
  },
  {
    name: "Rapor Tipi",
    key: "reportType",
    sortable: true,
  },
  {
    name: "Toplam Sipariş",
    key: "total",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.total);
    },
  },
  {
    name: "Ödeme",
    key: "price",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.price);
    },
  },
]);

onMounted(async () => {
  setCurrentPageBreadcrumbs("Şirket Istatistik", ["Istatistik"]);
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
  var list = await CompanyService.getCompanyIstatistik(data, filterData);

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
