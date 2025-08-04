<template>
  <div
    class="modal fade"
    id="kt_modal_add_income"
    ref="addincomeModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_income_header">
          <h2>Yeni Hareket Oluştur</h2>
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
            <div class="me-n7 pe-7" id="kt_modal_add_income_scroll">
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Hareket Tipi</label>
                <Field
                  name="incomeType"
                  v-model="model.incomeType"
                  v-slot="{ field, value, handleChange }"
                >
                  <el-select
                    placeholder="Hareket tipi seçiniz"
                    no-data-text="Veri Yok"
                    v-bind="field"
                    :model-value="value"
                    @update:model-value="handleChange"
                  >
                    <el-option label="Seçiniz.." :value="null"></el-option>
                    <el-option
                      v-for="(item, index) in incomeTypes"
                      :key="index"
                      :label="item.text"
                      :value="item.value"
                    />
                  </el-select>
                </Field>
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="incomeType" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Hareket Tarihi</label>
                <Field
                  name="incomeDate"
                  v-model="model.incomeDate"
                  v-slot="{ field, value, handleChange }"
                >
                  <el-date-picker
                    type="date"
                    placeholder="Tarih Seç"
                    format="DD.MM.YYYY"
                    v-bind="field"
                    :model-value="value"
                    @update:model-value="handleChange"
                  >
                  </el-date-picker>
                </Field>
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="incomeDate" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Fiyat</label>
                <Field
                  name="price"
                  v-model="model.price"
                  type="number"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="price" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Açıklama</label>
                <Field
                  name="incomeExplain"
                  v-model="model.incomeExplain"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="incomeExplain" />
                  </div>
                </div>
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
import CompanyService, { IIncome } from "@/services/CompanyService";

const addincomeModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const emitted = defineEmits(["submitted"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  companyId: {
    type: Number,
    required: true,
  },
});

const incomeTypes = [
  { text: "Müşteri Borcu", value: 0 },
  { text: "Müşteri Ödemesi", value: 1 },
];

watch(
  () => props.modelValue,
  () => {
    if (!model.value.id) {
      formRef.value.resetForm();
    }
  }
);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const onSubmit = async (values: IIncome) => {
  var apivalues = Object.assign(model.value, values);
  loading.value = true;
  apivalues.companyId = props.companyId;
  var data = await CompanyService.incomeCreateUpdate(apivalues);
  loading.value = false;

  if (data.result) {
    SwalAlert.toast("İşlem Başarılı");
    hideModal(addincomeModalRef.value);
    emitted("submitted");
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};
</script>
