<template>
  <!--begin::Wrapper-->
  <div class="w-lg-600px bg-white rounded-4 shadow p-10 p-lg-15 mx-auto">
    <!--begin::Form-->
    <Form
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <div class="text-center mb-10">
        <h2 class="text-dark mb-2 fw-bolder">Yönetim Paneline Giriş</h2>
        <div class="text-muted">Hesabınızla oturum açın</div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bolder text-dark">Kullanıcı Adı</label>

        <div class="input-group input-group-lg">
          <span class="input-group-text bg-transparent">
            <i class="bi bi-person fs-3"></i>
          </span>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="text"
            name="username"
            autocomplete="off"
            placeholder="E-posta veya kullanıcı adı"
          />
        </div>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>

      <div class="fv-row mb-10">
        <div class="d-flex flex-stack mb-2">
          <label class="form-label fw-bolder text-dark fs-6 mb-0">Şifre</label>

          <!-- <router-link to="/password-reset" class="link-primary fs-6 fw-bolder">
            Forgot Password ?
          </router-link> -->
        </div>

        <div class="input-group input-group-lg">
          <span class="input-group-text bg-transparent">
            <i class="bi bi-lock fs-3"></i>
          </span>
          <Field
            class="form-control form-control-lg form-control-solid"
            type="password"
            name="password"
            autocomplete="off"
            placeholder="Şifre"
          />
        </div>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Giriş Yap </span>

          <span class="indicator-progress">
            Lütfen bekleyin...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <div class="text-center text-muted">
          Şifrenizi mi unuttunuz? Yakında eklenecek.
        </div>
      </div>
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { Actions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import * as Yup from "yup";
//import { LogService } from "@/services";
import JwtService from "@/core/services/JwtService";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);

    const login = Yup.object().shape({
      username: Yup.string()
        .required("Lütfen kullanıcı adınızı giriniz")
        .label("Kullanıcı Adı"),
      password: Yup.string()
        .required("Lütfen şifrenizi giriniz")
        .label("Şifre"),
    });

    const onSubmitLogin = async (values) => {
      store.dispatch(Actions.LOGOUT, false);

      if (submitButton.value) {
        // eslint-disable-next-line
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        await store.dispatch(Actions.LOGIN, {
          flow: "password",
          email: values.username, // username'i email olarak gönder (AuthenticationService'de dönüştürülüyor)
          password: values.password,
        });

        const [errorName] = Object.keys(store.getters.getErrors);
        const error = store.getters.getErrors[errorName];

        if (!error) {
          //await LogService.authlog({});
          // Başarılı giriş sonrası dashboard'a yönlendir
          router.push({ name: "dashboard" });
        } else {
          Swal.fire({
            text: error,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tekrar dene!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-danger",
            },
          });
        }
      } catch (error) {
        console.error("Giriş hatası:", error);
        Swal.fire({
          text: "Giriş sırasında hata oluştu",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Tekrar dene!",
          customClass: {
            confirmButton: "btn fw-bold btn-light-danger",
          },
        });
      } finally {
        submitButton.value?.removeAttribute("data-kt-indicator");
        // eslint-disable-next-line
        submitButton.value!.disabled = false;
      }
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
    };
  },
});
</script>
