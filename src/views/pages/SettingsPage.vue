<template>
  <div class="row">
    <div class="col-4">
      <div class="card mb-5">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Tanımlanmayan Ödeme Tip Listesi</div>
        </div>
        <div class="card-body pt-0">
          <AsDataTable
            :items="getTypes"
            :header="paymentTypetableHeader"
            ref="paymentTypeDataTableRef"
            :id="`PaymentType`"
            :exportable="false"
            :searchable="false"
            :no-pagination="true"
            :checkableColumn="true"
            :checkColumnValue="'value'"
          >
            <template v-slot:checked-toolbar="{ items }">
              <button
                type="button"
                class="btn btn-info btn-sm"
                @click="addToPaymentType(items)"
              >
                Seçili{{ items.length > 1 ? "leri" : "yi" }} Başlığa Ekle
              </button>
            </template>
          </AsDataTable>
        </div>
      </div>
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Ödeme Tip Listesi</div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-color-success btn-active-light-success"
                @click="createNewTitle()"
              >
                <i class="fas fa-mail-bulk"></i>
                Yeni Ödeme Tip Başlığı Ekle
              </button>
            </div>
            <div class="d-flex justify-content-end"></div>
          </div>
        </div>
        <div class="card-body pt-0">
          <AsDataTable
            :items="getData"
            :header="paymentTypeTitletableHeader"
            ref="paymentTypeTitleDataTableRef"
            :id="`PaymentTypeTitle`"
            :exportable="false"
            @row-click="rowClickTitle"
            :searchable="false"
            :no-pagination="true"
            selectedRowActive
          >
            <template v-slot:cell-titleName="{ row }">
              <i
                @click="deletePaymentType(row)"
                class="cursor-pointer text-danger fas fa-times mx-1"
              ></i>
              <span>{{ row.titleName }}</span>
            </template>
            <template v-slot:cell-types="{ row }">
              <span v-if="row.paymentTypes.length == 0">-</span>
              <p v-for="item in row.paymentTypes" :key="item">
                {{ item }}
                <i
                  @click="removeType(row, item)"
                  class="cursor-pointer text-danger fas fa-times"
                ></i>
              </p>
            </template>
          </AsDataTable>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="card mb-5">
        <div class="card-header border-0 pt-6">
          <div class="card-title">Şirket Bilgileri</div>
        </div>
        <div class="card-body pt-0">
          <Form @submit="onSubmit" class="form" ref="formRef">
            <div class="row">
              <div class="col-6">
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2"
                    >Şirket Sahibi Adı</label
                  >
                  <Field
                    name="name"
                    v-model="companyModel.name"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2"
                    >Şirket Sahibi Soyadı</label
                  >
                  <Field
                    name="surname"
                    v-model="companyModel.surname"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="surname" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Şirket Adı</label>
                  <Field
                    name="companyName"
                    v-model="companyModel.companyName"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="companyName" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Email</label>
                  <Field
                    name="email"
                    v-model="companyModel.email"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="email" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Telefon</label>
                  <Field
                    name="telephone"
                    v-model="companyModel.telephone"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="telephone" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Vergi No</label>
                  <Field
                    name="taxNumber"
                    v-model="companyModel.taxNumber"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="taxNumber" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Banka Adı</label>
                  <Field
                    name="bankName"
                    v-model="companyModel.bankName"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="bankName" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">IBAN</label>
                  <Field
                    name="iban"
                    v-model="companyModel.iban"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="iban" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div class="fv-row mb-7">
                      <label class="required fs-6 fw-bold mb-2">Ülke</label>
                      <Field
                        name="country"
                        v-model="companyModel.country"
                        type="text"
                        class="form-control"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="country" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="fv-row mb-7">
                      <label class="required fs-6 fw-bold mb-2"
                        >Posta Kodu</label
                      >
                      <Field
                        name="postCode"
                        v-model="companyModel.postCode"
                        type="text"
                        class="form-control"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="postCode" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <div class="fv-row mb-7">
                      <label class="required fs-6 fw-bold mb-2">Şehir</label>
                      <Field
                        name="city"
                        v-model="companyModel.city"
                        type="text"
                        class="form-control"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="city" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="fv-row mb-7">
                      <label class="required fs-6 fw-bold mb-2">Kapı No:</label>
                      <Field
                        name="houseNumber"
                        v-model="companyModel.houseNumber"
                        type="text"
                        class="form-control"
                      />
                      <div class="fv-plugins-message-container">
                        <div class="fv-help-block">
                          <ErrorMessage name="houseNumber" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Adres</label>
                  <Field
                    name="address"
                    v-model="companyModel.address"
                    type="text"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="address" />
                    </div>
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label class="required fs-6 fw-bold mb-2">Vergi Oranı</label>
                  <Field
                    name="defaultTaxRate"
                    v-model="companyModel.defaultTaxRate"
                    type="number"
                    step="0.01"
                    class="form-control"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="defaultTaxRate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
              :disabled="loading"
            >
              <span v-if="!loading" class="indicator-label">
                Kaydet
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                </span>
              </span>
              <span v-if="loading" class="indicator-progress">
                Bekleyiniz...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
  <ModalAddUpdatePaymentType
    v-model="selectedTitle"
    @submitted="paymentTypeTitleRefresh"
  ></ModalAddUpdatePaymentType>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import AsDataTable from "@/components/AsDataTable.vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import SwalAlert from "@/core/helpers/swalalert";
import { Modal } from "bootstrap";
import ModalAddUpdatePaymentType from "./ModalAddUpdatePaymentType.vue";
import PaymentTypeService, {
  IPaymentType,
} from "@/services/PaymentTypeService";
import ClientCompanyService, {
  IClientCompany,
} from "@/services/ClientCompanyService";
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const selectedTitle = ref<IPaymentType>({});
const companyModel = ref<IClientCompany>({});
const paymentTypeTitletableHeader = ref([
  {
    name: "Ödeme Tip Başlığı",
    key: "titleName",
    sortable: true,
  },
  {
    name: "Ödeme Tipleri",
    key: "types",
    sortable: true,
  },
]);

const paymentTypetableHeader = ref([
  {
    name: "Ödeme Tipleri",
    key: "text",
    sortable: true,
  },
]);

const paymentTypeTitleDataTableRef = ref<null | typeof AsDataTable>(null);
const paymentTypeDataTableRef = ref<null | typeof AsDataTable>(null);

onMounted(async () => {
  setCurrentPageBreadcrumbs("Ayarlar", []);
  await getCompanyData();
});

const getData = async () => {
  var list = await PaymentTypeService.getPaymentTypes();

  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }

  return list;
};

const getCompanyData = async () => {
  var data = await ClientCompanyService.getClientCompany();

  if (data.result == false) {
    SwalAlert.toast(data.errorMessage!, "error");
    return;
  }
  if (data.entity) {
    companyModel.value = data.entity!;
  }
};

const getTypes = async () => {
  var list = await PaymentTypeService.getTypes();

  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }

  return list;
};

const createNewTitle = () => {
  selectedTitle.value = {} as IPaymentType;
  showModal();
};

const rowClickTitle = (item) => {
  selectedTitle.value = item;
};

const deletePaymentType = async (model) => {
  var result = await SwalAlert.confirm({
    title:
      "Ödeme tip başlığı silinsin mi? Eğer silerseniz tanımlanan ödeme tipleri tanımlanmayanlar listesine aktarılacaktır.",
    type: "question",
  });
  if (result.isConfirmed) {
    await PaymentTypeService.titleDelete({
      id: model.titleId,
      title: model.titleName,
    });
    paymentTypeTitleRefresh();
    paymentTypeRefresh();
  }
};

const removeType = async (model, selected) => {
  var result = await SwalAlert.confirm({
    title:
      "Ödeme tipi silinsin mi? Eğer silerseniz tanımlanmayanlar listesine aktarılacaktır.",
    type: "question",
  });
  if (result.isConfirmed) {
    await PaymentTypeService.delete({
      id: model.titleId,
      typeName: selected,
      titleId: model.titleId,
      titleName: "",
    });
    paymentTypeTitleRefresh();
    paymentTypeRefresh();
  }
};

const addToPaymentType = async (checkedTypes) => {
  var title = selectedTitle.value;
  if (title == null || title == undefined || title.titleId == undefined) {
    SwalAlert.toast("Başlık seçiniz..");
    return;
  }

  var result = await SwalAlert.confirm({
    title: "Ödeme tipleri seçili başlığa eklensin mi?",
    type: "question",
  });

  if (result.isConfirmed) {
    for await (const paytype of checkedTypes) {
      await PaymentTypeService.createUpdate({
        titleId: title.titleId,
        typeName: paytype,
        id: "0",
        titleName: "",
      });
    }

    paymentTypeTitleRefresh();
    paymentTypeRefresh();
  }
};

const onSubmit = async (values: IClientCompany) => {
  var apivalues = Object.assign(companyModel.value, values);
  loading.value = true;
  var data = await ClientCompanyService.createUpdate(apivalues);
  loading.value = false;

  if (data.result) {
    SwalAlert.toast("İşlem Başarılı");
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};

const showModal = () => {
  const modal = new Modal(document.getElementById("kt_modal_add_paymentType"));
  modal.show();
};

const paymentTypeTitleRefresh = () => {
  selectedTitle.value = {} as IPaymentType;
  if (paymentTypeTitleDataTableRef.value)
    paymentTypeTitleDataTableRef.value.refresh();
};

const paymentTypeRefresh = () => {
  if (paymentTypeDataTableRef.value) paymentTypeDataTableRef.value.refresh();
};
</script>
