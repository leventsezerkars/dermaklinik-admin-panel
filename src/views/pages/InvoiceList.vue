<template>
  <div class="card mb-5">
    <div class="card-header border-0 pt-6">
      <div class="card-title">Şirket Faturaları</div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <router-link
            class="btn btn-color-success btn-active-light-success"
            :to="'/invoice/' + companyId"
            active-class="active"
            target="_blank"
          >
            <i class="fas fa-file-invoice"></i>Yeni Fatura oluştur
          </router-link>
          <FilterDropDown
            v-if="false"
            @onSubmit="onFilter"
            @onReset="onFilterReset"
            :filterStatus="filtered"
          >
          </FilterDropDown>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <AsDataTable
        :items="getData"
        :header="tableHeader"
        ref="InvoiceDataTableRef"
        :id="`Invoice`"
      >
        <template v-slot:cell-invoiceNo="{ row }">
          <router-link
            :to="`/invoice/${companyId}?invoiceNo=${row.invoiceNo}`"
            target="_blank"
          >
            {{ row.invoiceNo }}
          </router-link>
        </template>
        <template v-slot:cell-invoiceDate="{ row }">
          {{ getFormattedValue(row.invoiceDate, "date") }}
        </template>
        <template v-slot:cell-createdDate="{ row }">
          {{ getFormattedValue(row.createdDate, "datetime") }}
        </template>
        <template v-slot:cell-total="{ row }">
          {{ currencyFormat(row.total, true) }}
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
                <!-- <div class="menu-item">
                      <span class="menu-link" @click="previewInvoice(row)">
                        Önizle
                      </span>
                    </div> -->
                <div class="menu-item">
                  <router-link
                    class="menu-link"
                    :to="
                      '/invoice/' + companyId + '?invoiceNo=' + row.invoiceNo
                    "
                    active-class="active"
                    target="_blank"
                  >
                    Düzenle
                  </router-link>
                </div>
                <div class="menu-item">
                  <span class="menu-link" @click="deleteInvoice(row)">
                    Sil
                  </span>
                </div>
              </div>
            </template>
          </MenuComponent>
        </template>
      </AsDataTable>
    </div>
  </div>
  <!-- <GeneratePdf ref="pdfRef" :fileName="pdffilename" :mode="'preview'">
    <InvoicePdfContent :invoice-no="invoiceModel" />
  </GeneratePdf> -->
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, watch } from "vue";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import CompanyService from "@/services/CompanyService";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";
import { useRoute } from "vue-router";
import { IPagination } from "@/core/models/PageModel";
import InvoicePdfContent from "@/views/pages/InvoicePdfContent.vue";
import GeneratePdf from "@/components/GeneratePdf.vue";

const selectedInvoiceNo = ref<number>();
const pdfRef = ref<null | typeof GeneratePdf>(null);
const pdffilename = ref("");

const tableHeader = ref([
  {
    name: "Fatura Tarihi",
    key: "invoiceDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value) {
      return getFormattedValue(value.invoiceDate, "datetime");
    },
  },

  {
    name: "Fatura No",
    key: "invoiceNo",
    sortable: false,
  },
  {
    name: "Toplam",
    key: "total",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.total);
    },
  },
  {
    name: "Kayıt Tarihi",
    key: "createdDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value) {
      return getFormattedValue(value.createdDate, "datetime");
    },
  },
  {
    name: "İşlemler",
    key: "actions",
    exportable: false,
  },
]);

var props = defineProps({ companyId: null });
watch(
  () => props.companyId,
  () => refresh()
);
var route = useRoute();
const InvoiceDataTableRef = ref<null | typeof AsDataTable>(null);
const defaultFilterData = () => ({});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);

const getData = async (data: IPagination | undefined) => {
  if (!props.companyId) {
    return;
  }
  var list = await CompanyService.getInvoices(
    data,
    props.companyId,
    filterData
  );
  filtered.value = isObjectEqual(filterData, defaultFilterData());
  if (filtered.value) {
    replaceUrl(route.path + "?" + toQueryString(filterData));
  }
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  return list;
};

const deleteInvoice = async (model) => {
  var result = await SwalAlert.confirm({
    title: "Fatura silinsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    await CompanyService.invoiceDelete(model);
    refresh();
  }
};

const previewInvoice = async (model) => {
  selectedInvoiceNo.value = model.invoiceNo;
  pdffilename.value = "invoice_pdf";
  if (pdfRef.value) pdfRef.value.generatePDF();
};

const onFilter = () => {
  refresh();
};
const onFilterReset = () => {
  Object.assign(filterData, defaultFilterData());
};

const refresh = () => {
  if (InvoiceDataTableRef.value) InvoiceDataTableRef.value.refresh();
};
</script>
