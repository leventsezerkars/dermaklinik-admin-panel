<template>
  <div
    class="modal fade"
    id="kt_modal_add_restourant"
    ref="addrestourantModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_restourant_header">
          <h2>Restoran Güncelle</h2>
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
            <div class="me-n7 pe-7" id="kt_modal_add_restourant_scroll">
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Restoran Adı</label>
                <Field
                  name="name"
                  v-model="restourantModel.name"
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
                <label class="required fs-6 fw-bold mb-2">Web Domain</label>
                <Field
                  name="domain"
                  v-model="restourantModel.domain"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="domain" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Adres</label>
                <Field
                  name="address"
                  v-model="restourantModel.address"
                  type="textarea"
                  disabled="disabled"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="address" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Telefon</label>
                <Field
                  name="telephone"
                  v-model="restourantModel.telephone"
                  disabled="disabled"
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
                <label class="required fs-6 fw-bold mb-2"
                  >Android App Link</label
                >
                <Field
                  name="androidAppLink"
                  v-model="restourantModel.androidAppLink"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="androidAppLink" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">IOS App Link</label>
                <Field
                  name="iOSAppLink"
                  v-model="restourantModel.iOSAppLink"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="iOSAppLink" />
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
import RestourantService, { IRestourant } from "@/services/RestourantService";
import { ApiResponse } from "@/core/services/ApiService";

const addrestourantModalRef = ref<null | HTMLElement>(null);
const formRef = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);

const emitted = defineEmits(["submitted"]);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

watch(
  () => props.modelValue,
  () => {
    if (!restourantModel.value.id) {
      formRef.value.resetForm();
    }
  }
);

const restourantModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const onSubmit = async (values: IRestourant) => {
  var data: ApiResponse<unknown>;
  var apivalues = Object.assign(restourantModel.value, values);
  loading.value = true;
  data = await RestourantService.updateRestourant(apivalues);
  loading.value = false;

  if (data.result) {
    SwalAlert.toast("İşlem Başarılı");
    hideModal(addrestourantModalRef.value);
    emitted("submitted");
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};
</script>
