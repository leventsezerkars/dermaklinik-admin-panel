<template>
  <div class="card mb-5">
    <div class="card-header border-0 pt-6">
      <div class="card-title">Ödemeler</div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-color-success btn-active-light-success"
            @click="createNewIncome()"
          >
            <i class="fas fa-mail-bulk"></i>
            Yeni Ödeme Ekle
          </button>
          <FileInput
            accept=".csv"
            button-text="Ödeme Dosyası Yükle"
            @onChange="uploadPaymentFile"
          ></FileInput>
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
        ref="incomeDataTableRef"
        :id="`income`"
      >
        <template v-slot:cell-createdDate="{ row }">
          {{ getFormattedValue(row.createdDate, "datetime") }}
        </template>
        <template v-slot:cell-incomeDate="{ row }">
          {{ getFormattedValue(row.incomeDate, "date") }}
        </template>
        <template v-slot:cell-price="{ row }">
          <span
            class="badge"
            :class="[
              { 'badge-success': row.incomeType },
              { 'badge-danger': !row.incomeType },
            ]"
          >
            {{ currencyFormat(row.price, true) }}
          </span>
        </template>
        <template v-slot:cell-paidStatus="{ row }">
          <label
            v-if="row.incomeType == 0"
            class="form-check form-switch form-check-custom form-check-success form-check-solid"
          >
            <input
              class="form-check-input"
              :name="'check_' + row.id"
              type="checkbox"
              :checked="row.paidStatus"
              @change="paidChange(row)"
            />
            <span class="form-check-label fw-semibold text-gray-500"></span>
          </label>
        </template>
        <template v-slot:foot-createdDate>
          <span>GENEL TOPLAM </span>
        </template>
        <template v-slot:foot-price>
          <span class="text-success">
            {{ currencyFormat(footdatas.gelen, true) }}
          </span>
        </template>
        <template v-slot:foot-incomeExplain>
          <span class="text-danger">
            {{ currencyFormat(footdatas.giden, true) }}
          </span>
        </template>
        <template v-slot:foot-actions>
          <span
            class="fs-3"
            :class="[
              { 'text-danger': footdatas.gelen - footdatas.giden < 0 },
              { 'text-success': footdatas.gelen - footdatas.giden > 0 },
            ]"
          >
            {{ currencyFormat(footdatas.gelen - footdatas.giden, true) }}
          </span>
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
                  <span @click="updateNewIncome(row)" class="menu-link"
                    >Düzenle</span
                  >
                </div>
                <div class="menu-item">
                  <span class="menu-link" @click="deleteIncome(row)">
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
  <ModalAddUpdateIncome
    v-model="selectedIncome"
    :companyId="companyId"
    @submitted="refresh"
  ></ModalAddUpdateIncome>
  <ModalView
    ref="importmodal"
    header-text="Ödemeler"
    id="paymentModal"
    size="xl"
  >
    <template v-slot:body>
      <div class="row">
        <div v-for="(item, index) in importDatas" :key="index" class="col-12">
          <div class="alert alert-secondary" role="alert">
            <p><b>Excel Detayı : </b>{{ item.explain }}</p>
            <p><b>Excel Şirket Adı : </b>{{ item.senderNameAddress }}</p>
            <hr />
            <p><b>Tarih : </b>{{ getFormattedValue(item.date, "date") }}</p>
            <p><b>Ücret : </b>{{ currencyFormat(item.price, true) }}</p>
            <p>
              <b>Ödeme Açıklaması : </b
              ><input
                type="text"
                class="form-control form-control-sm"
                style="width: 80%"
                v-model="item.senderExplain"
              />
            </p>
            <p>
              <b>Şirket : </b>
              <span>{{ item.companyName }} </span>
              <span
                v-if="item.companyId && !item.changeCompany"
                class="badge badge-info"
                v-on:click="importDataCompanyChange(item)"
              >
                Değiştir
              </span>
              <span
                v-if="!item.companyId && !item.changeCompany"
                class="badge badge-success"
                v-on:click="importDataCompanyChange(item)"
              >
                Ekle</span
              >
              <Multiselect
                v-if="item.changeCompany"
                size="sm"
                class="my-2"
                v-model="item.companyId"
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
            </p>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="d-flex justify-content-end">
        <LoadingButton
          :loading="loadingButtonStatus"
          title="Ödemeleri Kaydet"
          @click="importSubmit()"
          classes="btn btn-color-success btn-active-light-success mx-5"
        >
        </LoadingButton>
        <button
          type="button"
          class="btn btn-color-danger btn-active-light-danger mx-5"
          v-on:click="importmodal.hide()"
        >
          <i class="fas fa-times"></i>
          İptal
        </button>
      </div>
    </template>
  </ModalView>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, defineProps, watch } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import SwalAlert from "@/core/helpers/swalalert";
import CompanyService, { IIncome } from "@/services/CompanyService";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
import MenuComponent from "@/components/menu/MenuComponent.vue";
import { Modal } from "bootstrap";
import ModalAddUpdateIncome from "./ModalAddUpdateIncome.vue";
import FilterDropDown from "@/components/data-filter/FilterDropDown.vue";
import { isObjectEqual, replaceUrl, toQueryString } from "@/core/helpers/dom";
import { useRoute } from "vue-router";
import { IPagination } from "@/core/models/PageModel";
import FileInput from "@/components/FileInput.vue";
import ModalView from "@/components/Modal/Modal.vue";
import Multiselect from "@vueform/multiselect";
import LoadingButton from "@/components/buttons/LoadingButton.vue";

const tableHeader = ref([
  {
    name: "Şirket",
    key: "companyName",
    sortable: false,
    show: props.allDatas,
  },
  {
    name: "Ödeme Tarihi",
    key: "incomeDate",
    sortable: true,
    exportable: true,
    exportCallback: function (value) {
      return getFormattedValue(value.incomeDate, "datetime");
    },
  },
  {
    name: "Fiyat",
    key: "price",
    sortable: true,
    exportCallback: function (value) {
      return currencyFormat(value.price);
    },
  },
  {
    name: "Ödenme Durumu",
    key: "paidStatus",
    sortable: true,
    exportCallback: function (value) {
      return value.paidStatus == true ? "Ödendi" : "Ödenmedi";
    },
  },
  {
    name: "Açıklama",
    key: "incomeExplain",
    sortable: true,
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
var props = defineProps({
  companyId: { type: Number, default: null },
  allDatas: { type: Boolean, default: false },
});
const selectedIncome = ref<IIncome>({});
const loadingButtonStatus = ref(false);
const importDatas = ref([]);
const importmodal = ref<null | typeof ModalView>(null);

const incomeDataTableRef = ref<null | typeof AsDataTable>(null);
var route = useRoute();

watch(
  () => props.companyId,
  () => refresh()
);

const footdatas = ref({
  gelen: 0,
  giden: 0,
});
const defaultFilterData = () => ({
  active: 1,
  reportType: null,
  startDate: null,
  endDate: null,
  paymentDetail: true,
});
let filterData = reactive({ ...defaultFilterData(), ...route.query });
const filtered = ref<boolean>(false);
onMounted(async () => {
  setCurrentPageBreadcrumbs("Ödemeler");
});

const getData = async (data: IPagination | undefined) => {
  if (!props.allDatas && !props.companyId) {
    return;
  }

  var list = await CompanyService.getIncomes(data, props.companyId, filterData);
  filtered.value = isObjectEqual(filterData, defaultFilterData());
  if (filtered.value) {
    replaceUrl(route.path + "?" + toQueryString(filterData));
  }
  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  footdatas.value = list.toplam;
  return list.response;
};

const createNewIncome = () => {
  selectedIncome.value = {} as IIncome;
  showModal();
};
const updateNewIncome = (row) => {
  selectedIncome.value = row as IIncome;
  showModal();
};
const importDataCompanyChange = (item) => {
  if (item.changeCompany == undefined) {
    item.changeCompany = false;
  }
  item.changeCompany = !item.changeCompany;
};
const deleteIncome = async (model) => {
  var result = await SwalAlert.confirm({
    title: "Ödeme silinsin mi?",
    type: "question",
  });
  if (result.isConfirmed) {
    await CompanyService.incomeDelete(model);
    refresh();
  }
};
const paidChange = async (model) => {
  model.paidStatus = model.paidStatus == 1 ? 0 : 1;
  var result = await CompanyService.incomeCreateUpdate(model);
  if (result.result) {
    SwalAlert.toast(
      (model.paidStatus == 1 ? "Ödendi" : "Ödenmedi") + " olarak işaretlendi.",
      "info"
    );
  } else {
    SwalAlert.toast(result.errorMessage!, "error");
  }
};

const uploadPaymentFile = async (file) => {
  if (file.extension != "csv") {
    await SwalAlert.alert(
      "Yüklemek istediğiniz dosya .csv formatta değil",
      "warning"
    );
    return;
  }
  SwalAlert.toast("Bekleyiniz..", "info");
  const formData = new FormData();
  formData.append("file", file.raw);
  importDatas.value = await CompanyService.importExcel(formData);
  if (importDatas.value.length) {
    SwalAlert.toast(
      "Toplam " + importDatas.value.length + " tane kayıt bulundu."
    );
  }
  importmodal.value?.show();
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

const importSubmit = async () => {
  var control = true;
  importDatas.value.forEach((item) => {
    if (!item.companyId) {
      control = false;
    }
  });
  if (!control) {
    SwalAlert.toast("Şirket bilgilerini giriniz.", "error");
    return;
  }
  loadingButtonStatus.value = true;
  var response = await CompanyService.saveImport(importDatas.value);
  if (response.result) {
    SwalAlert.toast("Veriler Kaydedildi!");
    importmodal.value?.hide();
  }
  loadingButtonStatus.value = false;
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_income"));
  modal.show();
};

const onFilter = () => {
  refresh();
};
const onFilterReset = () => {
  Object.assign(filterData, defaultFilterData());
};

const refresh = () => {
  if (incomeDataTableRef.value) incomeDataTableRef.value.refresh();
};
</script>
