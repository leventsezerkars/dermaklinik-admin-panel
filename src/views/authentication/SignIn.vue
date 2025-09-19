<template>
  <!--begin::Wrapper-->
  <div
    class="w-lg-600px bg-transparent rounded-4 shadow-lg p-10 p-lg-15 mx-auto glass-card"
  >
    <!--begin::Form-->
    <Form
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
    >
      <div class="text-center mb-10">
        <div class="d-inline-flex align-items-center gap-4">
          <img
            v-if="brandLogo"
            :src="brandLogo"
            alt="Logo"
            class="h-80px rounded-circle bg-white p-3 shadow-sm"
          />
          <div class="text-start">
            <div class="fs-1 fw-bolder text-white">{{ brandName }}</div>
            <div class="text-white-50">Yönetim Paneli</div>
          </div>
        </div>
      </div>

      <div class="fv-row mb-8">
        <label class="form-label fs-6 fw-bolder text-white"
          >Kullanıcı Adı</label
        >
        <div class="fg-wrap">
          <span class="fg-icon" v-html="icons.user" aria-hidden="true"></span>
          <Field
            class="form-control form-control-lg glass-input ps-6"
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
          <label class="form-label fw-bolder text-white fs-6 mb-0">Şifre</label>

          <!-- <router-link to="/password-reset" class="link-primary fs-6 fw-bolder">
            Forgot Password ?
          </router-link> -->
        </div>

        <div class="fg-wrap">
          <span class="fg-icon" v-html="icons.lock" aria-hidden="true"></span>
          <Field
            class="form-control form-control-lg glass-input ps-6 pe-12"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            autocomplete="off"
            placeholder="Şifre"
          />
          <button
            type="button"
            class="fg-action"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Gizle' : 'Göster'"
          >
            <span v-html="showPassword ? icons.eyeOff : icons.eye"></span>
          </button>
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
          class="btn btn-lg btn-primary w-100 mb-5 shadow-sm btn-cta"
          @mousemove="onGlow"
        >
          <span class="indicator-label"> Giriş Yap </span>

          <span class="indicator-progress">
            Lütfen bekleyin...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </Form>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { ErrorMessage, Field, Form } from "vee-validate";
import { Actions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import * as Yup from "yup";
//import { LogService } from "@/services";
import JwtService from "@/core/services/JwtService";
import CompanyInfoService from "@/services/CompanyInfoService";

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
    const showPassword = ref(false);
    const brandName = ref("Dermatoloji Kliniği");
    const brandLogo = ref<string | null>(null);

    const login = Yup.object().shape({
      username: Yup.string()
        .required("Lütfen kullanıcı adınızı giriniz")
        .label("Kullanıcı Adı"),
      password: Yup.string()
        .required("Lütfen şifrenizi giriniz")
        .label("Şifre"),
    });

    const icons = {
      user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/></svg>',
      lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9h-1V7a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2Zm-6 6.732V17a1 1 0 002 0v-1.268a2 2 0 10-2 0ZM9 7a3 3 0 116 0v2H9V7Z" fill="currentColor"/></svg>',
      eye: '<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11a4 4 0 110-8 4 4 0 010 8Z" fill="currentColor"/></svg>',
      eyeOff:
        '<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M3 3l18 18-1.5 1.5L15.6 18.6A10.9 10.9 0 0112 19c-5 0-9-4.5-10-7a17.1 17.1 0 014.6-5.6L1.5 4.5 3 3Zm7.4 7.4a4 4 0 005.2 5.2l-5.2-5.2ZM12 5c5 0 9 4.5 10 7a17.1 17.1 0 01-3.1 3.8l-1.4-1.4A8.9 8.9 0 0021 12c-1-2.5-5-7-9-7-1.1 0-2.1.2-3 .5L7 4.5C8.5 4 10.2 5 12 5Z" fill="currentColor"/></svg>',
    } as const;

    const onGlow = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };

    onMounted(async () => {
      try {
        const res = await CompanyInfoService.getActiveSingle();
        const data: any = res?.data || {};
        if (data?.logoUrl) brandLogo.value = data.logoUrl;
        if (data?.name) brandName.value = data.name;
      } catch {
        console.log("CompanyInfoService.getActiveSingle hatası");
      }
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
      showPassword,
      icons,
      onGlow,
      brandName,
      brandLogo,
    };
  },
});
</script>
<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(125%);
  -webkit-backdrop-filter: blur(12px) saturate(125%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.fg-wrap {
  position: relative;
}
.glass-input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  transition: box-shadow 0.15s ease, border-color 0.15s ease,
    background 0.15s ease;
}
.glass-input:focus {
  background: #fff;
  border-color: rgba(13, 110, 253, 0.6);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}
.fg-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}
.glass-input.ps-6 {
  padding-left: 2.5rem !important;
}
.glass-input.pe-12 {
  padding-right: 3rem !important;
}
.fg-action {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #6c757d;
}
.fg-action:hover {
  color: #0d6efd;
}
.btn-cta {
  position: relative;
  overflow: hidden;
}
.btn-cta::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    120px 120px at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.25),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.2s;
}
.btn-cta:hover::after {
  opacity: 1;
}
</style>
