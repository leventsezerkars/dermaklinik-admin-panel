<template>
  <div class="row">
    <div class="col-5">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Şirketler</div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-color-success btn-active-light-success"
                @click="createNewCompany()"
              >
                <i class="fas fa-mail-bulk"></i>
                Yeni Şirket Ekle
              </button>
              <MenuComponent menu-selector="#kt-company-menu">
                <template v-slot:toggle>
                  <div
                    class="btn btn-color-warning btn-active-light-warning"
                    data-kt-menu-target="#kt-company-menu"
                    data-kt-menu-trigger="click"
                    data-kt-menu-attach="parent"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="bottom"
                  >
                    Toplu Pdf Hazırla ve İndir
                  </div>
                </template>
                <template v-slot:content>
                  <div
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px p-3"
                    data-kt-menu="true"
                    id="kt-company-menu"
                  >
                    <div class="menu-item">
                      <span
                        @click="showhideFilterModal(true, 'multi', 'aylık')"
                        class="menu-link"
                        >Aylık Sipariş Pdf</span
                      >
                    </div>
                    <div class="menu-item">
                      <span
                        @click="showhideFilterModal(true, 'multi', 'yıllık')"
                        class="menu-link"
                        >Yıllık Sipariş Pdf</span
                      >
                    </div>
                    <div class="menu-item">
                      <span
                        @click="
                          showhideFilterModal(true, 'multi-istatistik', 'aylık')
                        "
                        class="menu-link"
                        >Aylık İstatistik Pdf</span
                      >
                    </div>
                    <div class="menu-item">
                      <span
                        @click="
                          showhideFilterModal(
                            true,
                            'multi-istatistik',
                            'yıllık'
                          )
                        "
                        class="menu-link"
                        >Yıllık İstatistik Pdf</span
                      >
                    </div>
                  </div>
                </template>
              </MenuComponent>
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
                      v-model="companyfilterData.active"
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
                      placeholder="Ödeme Tipi Filtresi"
                      no-data-text="Veri Yok"
                      style="margin-right: 10px"
                      v-model="companyfilterData.reportType"
                    >
                      <el-option label="Seçiniz.." :value="null"></el-option>
                      <el-option key="0" :label="'Aylık'" :value="'Aylık'" />
                      <el-option key="1" :label="'Yıllık'" :value="'Yıllık'" />
                    </el-select>
                  </div>
                </div>
                <div class="mb-10">
                  <label class="form-label fw-bold">Borç Alacak Durumu:</label>
                  <div>
                    <el-select
                      placeholder="Ödeme Tipi Filtresi"
                      no-data-text="Veri Yok"
                      style="margin-right: 10px"
                      v-model="companyfilterData.borcAlacakDurum"
                    >
                      <el-option label="Seçiniz.." :value="null"></el-option>
                      <el-option
                        key="0"
                        :label="'Borçluları Göster'"
                        :value="'0'"
                      />
                      <el-option
                        key="1"
                        :label="'Alacaklıları Göster'"
                        :value="'1'"
                      />
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
            :header="comptableHeader"
            ref="companyDataTableRef"
            :id="`Company`"
            :exportable="false"
            @row-click="rowClick"
            selectedRowActive
          >
            <template v-slot:cell-chart="{ row }">
              <BaseChart
                :key="row.id"
                :chartOptions="chartOptions"
                type="area"
                :categories="defaultCategories"
                :series="[
                  { name: 'Toplam Sipariş', data: row.paymentDetail.series },
                ]"
                :width="100"
                :height="50"
              ></BaseChart>
            </template>
            <template v-slot:cell-incomeTotal="{ row }">
              <span v-if="row.incomeTotal >= 0" class="badge badge-success">{{
                currencyFormat(row.incomeTotal, true)
              }}</span>
              <span v-if="row.incomeTotal < 0" class="badge badge-danger">{{
                currencyFormat(row.incomeTotal, true)
              }}</span>
            </template>
            <template v-slot:cell-actions="{ row }">
              <MenuComponent :menu-selector="'#kt-rest-menu' + row.id">
                <template v-slot:toggle>
                  <div
                    class="btn btn-sm btn-light btn-active-light-primary"
                    :data-kt-menu-target="'#kt-rest-menu' + row.id"
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
                    :id="'kt-rest-menu' + row.id"
                  >
                    <div class="menu-item">
                      <span @click="showModal()" class="menu-link"
                        >Düzenle</span
                      >
                    </div>
                    <div class="menu-item">
                      <span class="menu-link" @click="deleteCompany(row)">
                        Aktiflik Değiştir
                      </span>
                    </div>
                  </div>
                </template>
              </MenuComponent>
            </template>
          </AsDataTable>
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="card mb-5">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Restoranlar</div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-color-success btn-active-light-success mx-5"
                @click="showhideFilterModal(true, 'single')"
              >
                <i class="fas fa-shopping-cart"></i>
                Sipariş Pdf Önizle
              </button>
              <button
                type="button"
                class="btn btn-color-info btn-active-light-info mx-5"
                @click="showhideFilterModal(true, 'single-istatistik')"
              >
                <i class="fas fa-chart-line"></i>
                İstatistik Pdf Önizle
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
          </div>
        </div>
        <div class="card-body pt-0">
          <AsDataTable
            :items="getRestourantData"
            :header="resttableHeader"
            ref="restourantDataTableRef"
            :id="`Restourant`"
            :exportable="false"
            :no-pagination="true"
          >
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
            <template v-slot:cell-actions="{ row }">
              <button
                type="button"
                class="btn btn-color-danger btn-active-light-danger mx-5"
                @click="deleteRestourant(row)"
              >
                <i class="fas fa-times"></i>
                Şirketten Çıkart
              </button>
            </template>
          </AsDataTable>
        </div>
      </div>
      <IncomeList
        :companyId="selectedCompany.id"
        :allDatas="false"
      ></IncomeList>
      <InvoiceList :companyId="selectedCompany.id"></InvoiceList>
    </div>
  </div>
  <ModalAddUpdateCompany
    v-model="selectedCompany"
    @submitted="companyrefresh"
  ></ModalAddUpdateCompany>
  <GeneratePdf ref="pdfRef" :fileName="pdffilename" :mode="pdfMode">
    <OrderPdfContent :items="pdfexportlist" />
  </GeneratePdf>
  <GeneratePdf ref="istatistikPdfRef" :fileName="pdffilename" :mode="pdfMode">
    <IstatistikPdfContent :items="pdfexportlist" />
  </GeneratePdf>
  <ModalView ref="orderfiltermodal" header-text="Filtreler" id="orderfilters">
    <template v-slot:body>
      <div class="mb-10">
        <label class="form-label fw-bold"> Sipariş Tarihleri Kısayol: </label>
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
            class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary me-3"
            @click="setFilterDate('thisyear')"
          >
            Bu Yıl
          </button>
          <button
            class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary"
            @click="setFilterDate('lastyear')"
          >
            Geçen Yıl
          </button>
        </div>
      </div>
      <div v-if="selectedPdfType.indexOf('istatistik') == -1" class="mb-10">
        <label class="form-label fw-bold">Ödeme Tipi:</label>
        <div>
          <el-select
            multiple
            placeholder="Ödeme Tipi Filtresi"
            no-data-text="Veri Yok"
            style="margin-right: 10px"
            v-model="filterData.paymentType"
          >
            <el-option label="Seçiniz.." :value="null"></el-option>
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
        <label class="form-label fw-bold"> Sipariş Başlangıç Tarihi: </label>
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
      <div v-if="selectedPdfType.indexOf('istatistik') == -1" class="mb-10">
        <div>
          <el-checkbox
            v-model="filterData.hideDoubleRecords"
            :checked="filterData.hideDoubleRecords"
            label="Çift Kayıtları Gizle"
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-color-success btn-active-light-success mx-5"
          @click="prepareGenerate()"
        >
          <i class="fas fa-upload"></i>
          Pdf Hazırla
        </button>
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
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import CompanyService, { ICompany } from "@/services/CompanyService";
import {
  getFormattedValue,
  currencyFormat,
  dateShortcut,
} from "@/core/helpers/momentUtil";
import InvoiceList from "./InvoiceList.vue";
import IncomeList from "./IncomeList.vue";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import { Modal } from "bootstrap";
import ModalAddUpdateCompany from "./ModalAddUpdateCompany.vue";
import AdminService from "@/services/AdminService";
import GeneratePdf from "@/components/GeneratePdf.vue";
import OrderPdfContent from "@/views/pages/OrderPdfContent.vue";
import IstatistikPdfContent from "@/views/pages/IstatistikPdfContent.vue";
import OrderService, { IOrder } from "@/services/OrderService";
import ModalView from "@/components/Modal/Modal.vue";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";
import { useRoute } from "vue-router";
import { IPagination } from "@/core/models/PageModel";
import RestourantService from "@/services/RestourantService";
import IstatistikService, {
  IIstatistikFilter,
} from "@/services/IstatistikService";
import { Constants } from "@/core/models/SelectListItemModel";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { ApexOptions } from "apexcharts";
import BaseChart from "@/components/report/BaseChart.vue";
const baseColor = getCSSVariableValue("--bs-success");

const chartOptions: ApexOptions = {
  chart: {
    fontFamily: "inherit",
    type: "area",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {},
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    show: true,
    width: 3,
    colors: [baseColor],
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    fixed: {
      enabled: true,
      position: "topRight",
      offsetX: 50,
      offsetY: -80,
    },
    style: {
      fontSize: "12px",
    },
    y: {
      formatter: function (val) {
        return currencyFormat(val, true);
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      stops: [0, 100],
    },
  },
  colors: [baseColor],
  markers: {
    colors: [baseColor],
    strokeWidth: 3,
  },
};

const comptableHeader = ref([
  {
    name: "Şirket Adı",
    key: "companyName",
    sortable: true,
  },
  {
    name: "Rapor Tipi",
    key: "reportType",
    sortable: true,
  },
  {
    name: "Borç/Alacak Durumu",
    key: "incomeTotal",
    sortable: true,
  },
  {
    name: "Aylık Satış Grafiği",
    key: "chart",
    sortable: false,
  },
  {
    name: "İşlemler",
    key: "actions",
    exportable: false,
  },
]);

const resttableHeader = ref([
  {
    name: "Restoran Adı",
    key: "name",
    sortable: true,
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
    exportCallback: function (value: { lastOrderDate: Date }) {
      return getFormattedValue(value.lastOrderDate, "datetime");
    },
  },
  {
    name: "Son Güncellenme Zamanı",
    key: "controlledDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value: { controlledDate: Date }) {
      return getFormattedValue(value.controlledDate, "datetime");
    },
  },
  {
    name: "İşlemler",
    key: "actions",
    exportable: false,
  },
]);

const companyDataTableRef = ref<null | typeof AsDataTable>(null);
const restourantDataTableRef = ref<null | typeof AsDataTable>(null);
const orderfiltermodal = ref<null | typeof ModalView>(null);
const pdfRef = ref<null | typeof GeneratePdf>(null);
const istatistikPdfRef = ref<null | typeof GeneratePdf>(null);
const pdfexportlist = ref<Array<IOrder>>([]);
const selectedCompany = ref<ICompany>({});
const filterData = ref({
  hideDoubleRecords: true,
  paymentType: "",
  startDate: "",
  endDate: "",
});
const pdfMode = ref("preview");
const selectedPdfType = ref("single");
const pdffilename = ref("");
const defaultCategories = ref([] as any);
const constants = ref<Array<Constants>>([]);
const selectedCompanyReportType = ref("");
var route = useRoute();
const defaultFilterData = () => ({
  active: 1,
  reportType: "",
  startDate: "",
  endDate: "",
  paymentDetail: true,
  borcAlacakDurum: null,
});
let companyfilterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
onMounted(async () => {
  setCurrentPageBreadcrumbs("Şirket Listesi", ["Şirket"]);
  var constantlist = await OrderService.getConstants();
  constants.value = constantlist.list;
  var currentMonth = new Date().getMonth() + 1;
  for (let i = currentMonth - 5; i <= currentMonth; i++) {
    defaultCategories.value.push(i + ". Ay");
  }
});

const getData = async (data: IPagination | undefined) => {
  var list = await CompanyService.getCompanies(data, companyfilterData);
  filtered.value = isObjectEqual(companyfilterData, defaultFilterData());
  if (filtered.value) {
    replaceUrl(route.path + "?" + toQueryString(companyfilterData));
  }
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  if (selectedCompany.value.id == undefined && list.list?.length > 0) {
    rowClick(list.list[0]);
  }
  return list;
};

const getRestourantData = async () => {
  var id = selectedCompany.value.id;
  if (id == undefined) {
    id = 0;
  }
  var list = await CompanyService.getRestourants(id);
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  return list;
};

const getOrderData = async (companyId: number) => {
  if (filterData.value && filterData.value.startDate) {
    var date = new Date(filterData.value.startDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.value.startDate = fullDate;
  }

  if (filterData.value && filterData.value.endDate) {
    var date2 = new Date(filterData.value.endDate);
    let day = date2.getDate();
    let month = date2.getMonth() + 1;
    let year = date2.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.value.endDate = fullDate;
  }
  filterData.value.paymentType = !filterData.value.paymentType?.length
    ? null
    : filterData.value.paymentType;
  var data = {
    take: 999999,
    page: 0,
    search: "",
    orderBy: "orderDate",
    direction: "asc",
  };
  var list = await OrderService.getCompanyOrders(
    data,
    companyId,
    filterData.value
  );

  return list.list;
};

const createNewCompany = () => {
  selectedCompany.value = {} as ICompany;
  showModal();
};

const rowClick = (item) => {
  if (selectedCompany.value.id != item.id) {
    selectedCompany.value = item;
    refresh();
  }
};

const insertRestourantOrder = async () => {
  var result = await SwalAlert.confirm({
    title: "Sipariş listesi güncellensin mi",
    type: "question",
  });
  if (result.isConfirmed) {
    SwalAlert.toast("Lütfen Bekleyiniz !");
    var data = await AdminService.InsertSelectedCompanyOrders(
      selectedCompany.value.id
    );
    if (data.totalCount == undefined) return;
    SwalAlert.toast(
      data.totalCount + " sipariş başarıyla eklendi !",
      "success"
    );
    refresh();
  }
};

const deleteRestourant = async (model) => {
  var result = await SwalAlert.confirm({
    title: "Şirketten çıkarılsın mı?",
    type: "question",
  });
  if (result.isConfirmed) {
    model.companyId = null;
    await RestourantService.updateRestourant(model);
    refresh();
  }
};

const deleteCompany = async (model) => {
  var result = await SwalAlert.confirm({
    title: "Şirket aktiflik değiştirilsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    model.active = model.active == 0 ? 1 : 0;
    await CompanyService.createUpdateCompany(model);
    companyrefresh();
  }
};

const showhideFilterModal = (state: boolean, type = "", season = "") => {
  selectedPdfType.value = type;
  selectedCompanyReportType.value = season;
  if (state) {
    orderfiltermodal.value?.show();
  } else {
    orderfiltermodal.value?.hide();
  }
};

const getPaymentsCompany = async () => {
  if (companyfilterData && companyfilterData.startDate) {
    var date = new Date(companyfilterData.startDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    companyfilterData.startDate = fullDate;
  }

  if (companyfilterData && companyfilterData.endDate) {
    var date2 = new Date(companyfilterData.endDate);
    let day = date2.getDate();
    let month = date2.getMonth() + 1;
    let year = date2.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    companyfilterData.endDate = fullDate;
  }

  var list = await CompanyService.getCompanyPayments(companyfilterData);
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  return list;
};

const getIstatistikPdfContent = async (companyId: number) => {
  if (filterData.value && filterData.value.startDate) {
    var date = new Date(filterData.value.startDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.value.startDate = fullDate;
  }

  if (filterData.value && filterData.value.endDate) {
    var date2 = new Date(filterData.value.endDate);
    let day = date2.getDate();
    let month = date2.getMonth() + 1;
    let year = date2.getFullYear();

    let fullDate = `${month}-${day}-${year}`;
    filterData.value.endDate = fullDate;
  }
  var filterModel: IIstatistikFilter = {
    startDate: filterData.value.startDate,
    endDate: filterData.value.endDate,
    companyId,
  };

  var list = await IstatistikService.getIstatistikPdfContent(filterModel);

  return list.entity;
};

const prepareGenerate = async () => {
  if (selectedPdfType.value == "single") {
    pdfMode.value = "preview";
    await generate(selectedCompany.value);
  } else if (selectedPdfType.value == "multi") {
    pdfMode.value = "download";
    await generateBulkPdf(selectedPdfType.value);
  }

  if (selectedPdfType.value == "single-istatistik") {
    pdfMode.value = "preview";
    await generateIstatistik(selectedCompany.value);
  } else if (selectedPdfType.value == "multi-istatistik") {
    pdfMode.value = "download";
    await generateIstatistikBulkPdf(selectedPdfType.value);
  }

  showhideFilterModal(false);
};

const generateBulkPdf = async (type: string) => {
  companyfilterData.reportType = selectedCompanyReportType.value;
  companyfilterData.startDate = filterData.value.startDate;
  companyfilterData.endDate = filterData.value.endDate;

  var companylist = (await getPaymentsCompany())?.list;

  companyfilterData.reportType = null;
  replaceUrl(route.path + "?" + toQueryString(companyfilterData));

  SwalAlert.toast(
    "Toplam " + companylist?.length + " şirketin pdfleri hazırlanıyor.."
  );

  for await (const company of companylist) {
    await generate({ id: company.id, companyName: company.companyName });
  }
};

const generate = async (company: ICompany) => {
  pdfexportlist.value = await getOrderData(company.id);
  pdffilename.value = company.companyName + " Order Pdf";
  if (pdfRef.value) pdfRef.value.generatePDF();
};

const generateIstatistik = async (company: ICompany) => {
  pdfexportlist.value = await getIstatistikPdfContent(company.id);
  pdffilename.value = company.companyName + " Istatistik Pdf";
  if (istatistikPdfRef.value) istatistikPdfRef.value.generatePDF();
};

const generateIstatistikBulkPdf = async (type: string) => {
  companyfilterData.reportType = selectedCompanyReportType.value;
  companyfilterData.startDate = filterData.value.startDate;
  companyfilterData.endDate = filterData.value.endDate;

  var companylist = (await getPaymentsCompany())?.list;

  companyfilterData.reportType = null;
  replaceUrl(route.path + "?" + toQueryString(companyfilterData));

  SwalAlert.toast(
    "Toplam " + companylist?.length + " şirketin pdfleri hazırlanıyor.."
  );

  for await (const company of companylist) {
    await generateIstatistik({
      id: company.id,
      companyName: company.companyName,
    });
  }
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_company"));
  modal.show();
};

const setFilterDate = (
  type: "thismonth" | "lastmonth" | "thisyear" | "lastyear"
) => {
  const dates = dateShortcut(type);
  filterData.value.startDate = dates.firstDate;
  filterData.value.endDate = dates.lastDate;
};

const onFilter = () => {
  companyrefresh();
};
const onFilterReset = () => {
  Object.assign(companyfilterData, defaultFilterData());
};

const refresh = () => {
  if (restourantDataTableRef.value) restourantDataTableRef.value.refresh();
};
const companyrefresh = () => {
  if (companyDataTableRef.value) companyDataTableRef.value.refresh();
};
</script>
