<template>
  <div
    class="modal fade"
    id="kt_modal_add_database"
    ref="adddatabaseModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content rounded">
        <div class="modal-header" id="kt_modal_add_database_header">
          <h2>Veritabanı Oluştur/Güncelle</h2>
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
            <div class="me-n7 pe-7" id="kt_modal_add_database_scroll">
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Tag</label>
                <Field
                  name="tagName"
                  v-model="databasemodel.tagName"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="tagName" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Server Adı</label>
                <Field
                  name="serverName"
                  v-model="databasemodel.serverName"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="serverName" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Veritabanı Adı</label>
                <Field
                  name="dbName"
                  v-model="databasemodel.dbName"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="dbName" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Kullanıcı Adı</label>
                <Field
                  name="userName"
                  v-model="databasemodel.userName"
                  type="text"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="userName" />
                  </div>
                </div>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-bold mb-2">Şifre</label>
                <Field
                  name="password"
                  v-model="databasemodel.password"
                  type="password"
                  class="form-control"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="password" />
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
import DatabaseService, { IDatabase } from "@/services/DatabaseService";
import { ApiResponse } from "@/core/services/ApiService";

const adddatabaseModalRef = ref<null | HTMLElement>(null);
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
    if (!databasemodel.value.id) {
      formRef.value.resetForm();
    }
  }
);

const databasemodel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const onSubmit = async (values: IDatabase) => {
  var data: ApiResponse<unknown>;
  var apivalues = Object.assign(databasemodel.value, values);
  loading.value = true;
  data = await DatabaseService.addUpdateDatabase(apivalues);
  loading.value = false;

  if (data.result) {
    SwalAlert.toast(data.message!);
    hideModal(adddatabaseModalRef.value);
    emitted("submitted");
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};
</script>
