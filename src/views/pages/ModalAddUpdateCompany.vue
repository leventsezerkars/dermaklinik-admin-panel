<template>
  <div
    class="modal fade"
    id="kt_modal_add_company"
    ref="addcompanyModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-950px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_company_header">
          <h2>Yeni Şirket Oluştur</h2>
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <Form @submit="onSubmit" class="form" ref="formRef">
          <!-- v-slot="{ errors }"
          <template v-if="Object.keys(errors).length">
            <p>Lütfen hataları çözün</p>
            <ul>
              <li v-for="(message, field) in errors" :key="field">
                {{ message }}
              </li>
            </ul>
          </template> -->
          <div class="modal-body py-10 px-lg-17">
            <div class="me-n7 pe-7" id="kt_modal_add_company_scroll">
              <div class="row">
                <div class="col-6">
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
                    <label class="required fs-6 fw-bold mb-2">Eat Link</label>
                    <Field
                      name="eatLink"
                      v-model="companyModel.eatLink"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="eatLink" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Şirket Rapor Tipi</label
                    >
                    <Field
                      name="reportType"
                      v-model="companyModel.reportType"
                      v-slot="{ field, value, handleChange }"
                    >
                      <el-select
                        placeholder="Rapor tipi seçiniz"
                        no-data-text="Veri Yok"
                        v-bind="field"
                        :model-value="value"
                        @update:model-value="handleChange"
                      >
                        <el-option key="0" :label="'Aylık'" :value="'Aylık'" />
                        <el-option
                          key="1"
                          :label="'Yıllık'"
                          :value="'Yıllık'"
                        />
                      </el-select>
                    </Field>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="reportType" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="fs-6 fw-bold mb-2">Şirket Diğer Adları</label>
                    <Field
                      name="otherNames"
                      v-model="companyModel.otherNames"
                      type="textarea"
                      class="form-control"
                      v-slot="{ field, value, handleChange }"
                    >
                      <el-input
                        v-bind="field"
                        :model-value="value"
                        @update:model-value="handleChange"
                        maxlength="500"
                        placeholder="Virgüller ayırarak isimleri gir"
                        show-word-limit
                        type="textarea"
                      />
                    </Field>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="otherNames" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Fatura Şirket Adı</label
                    >
                    <Field
                      name="invoiceCompanyName"
                      v-model="companyModel.invoiceCompanyName"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="invoiceCompanyName" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Fatura Adresi</label
                    >
                    <Field
                      name="invoiceAddress"
                      v-model="companyModel.invoiceAddress"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="invoiceAddress" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Fatura Şehir</label
                    >
                    <Field
                      name="invoiceCity"
                      v-model="companyModel.invoiceCity"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="invoiceCity" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Fatura Kapı No</label
                    >
                    <Field
                      name="invoiceHouseNumber"
                      v-model="companyModel.invoiceHouseNumber"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="invoiceHouseNumber" />
                      </div>
                    </div>
                  </div>
                  <div class="fv-row mb-7">
                    <label class="required fs-6 fw-bold mb-2"
                      >Fatura Posta Kodu</label
                    >
                    <Field
                      name="invoicePostCode"
                      v-model="companyModel.invoicePostCode"
                      type="text"
                      class="form-control"
                    />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="invoicePostCode" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="paymentPlanActive" class="fv-row mb-7">
                <hr />
                <label class="fs-6 fw-bold mb-2">Ödeme Planı</label>
                <div class="row">
                  <div class="col-12">
                    <table v-if="paymentPlans.length" class="table table-sm">
                      <thead class="bg-light fw-bold">
                        <tr>
                          <th scope="col">Limit</th>
                          <th scope="col">Ödeme</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="payment in paymentPlans" :key="payment.id">
                          <td>{{ currencyFormat(payment.limit, true) }}</td>
                          <td>{{ currencyFormat(payment.price, true) }}</td>
                          <td>
                            <span
                              @click="addPaymentPlan(payment.id)"
                              class="cursor-pointer text-danger"
                              >Sil</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div v-else class="text-secondary text-center">
                      Eklenmemiş...
                    </div>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col-4">
                    <label class="form-label" for="limit">Limit</label>
                    <input
                      class="form-control form-control-sm"
                      v-model="limit"
                      name="limit"
                    />
                  </div>
                  <div class="col-4">
                    <label class="form-label" for="limit">Ücret</label>
                    <input
                      class="form-control form-control-sm"
                      v-model="pay"
                      name="pay"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      @click="addPaymentPlan(0)"
                      class="btn btn-sm btn-success mt-8"
                    >
                      Planı Kaydet
                    </button>
                  </div>
                </div>
                <p v-if="paymentControl" class="alert alert-danger mt-5">
                  {{ paymentControlMessage }}
                </p>
                <p class="alert alert-warning mt-5">
                  Not: Limit bilgisi girilen fiyat ve üstü için geçerlidir.
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer flex-center">
            <button type="button" class="btn btn-lg" data-bs-dismiss="modal">
              İptal
            </button>
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
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, computed, emit, defineEmits, watch } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import SwalAlert from "@/core/helpers/swalalert";
import { hideModal } from "@/core/helpers/dom";
import CompanyService, {
  ICompany,
  ICompanyPaymentPlan,
} from "@/services/CompanyService";
import { currencyFormat } from "@/core/helpers/momentUtil";

const addcompanyModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const paymentPlanActive = ref<boolean>(false);
const loading = ref<boolean>(false);
const paymentControl = ref<boolean>(false);
const paymentControlMessage = ref<string>("");
const limit = ref<number>(null);
const pay = ref<number>(null);
const paymentPlans = ref<Array<ICompanyPaymentPlan>>([]);
const emitted = defineEmits(["submitted"]);

const getPayments = async () => {
  paymentPlans.value = (
    await CompanyService.getCompanyPaymentPlans(companyModel.value.id)
  ).list;
};

const addPaymentPlan = async (id = 0) => {
  if (id == 0 && (limit.value == null || pay.value == null)) {
    paymentControlMessage.value = "Limit ve Ücret alanları boş olamaz";
    paymentControl.value = true;
    return;
  }
  var model: ICompanyPaymentPlan = {
    id: id,
    limit: limit.value ?? 0,
    price: pay.value ?? 0,
    companyId: companyModel.value.id,
  };
  var result = await CompanyService.createUpdatePaymentplan(model);

  if (result.errorMessage) {
    paymentControlMessage.value = result.errorMessage;
    paymentControl.value = true;
    return;
  }

  getPayments();
  paymentControl.value = false;
};

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

watch(
  () => props.modelValue,
  () => {
    if (!companyModel.value.id) {
      paymentPlans.value = [];
      paymentPlanActive.value = false;
      formRef.value.resetForm();
    } else {
      paymentPlanActive.value = true;
      getPayments();
    }
  }
);

const companyModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const onSubmit = async (values: ICompany) => {
  var apivalues = Object.assign(companyModel.value, values);
  apivalues.paymentDetail = null;
  loading.value = true;
  var data = await CompanyService.createUpdateCompany(apivalues);
  loading.value = false;

  if (data.result) {
    SwalAlert.toast("İşlem Başarılı");
    hideModal(addcompanyModalRef.value);
    emitted("submitted");
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};
</script>
