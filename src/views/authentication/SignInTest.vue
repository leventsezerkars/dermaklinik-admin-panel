<template>
  <div class="w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto">
    <div class="text-center mb-10">
      <h3 class="text-dark mb-3">Giriş Yap (Test)</h3>
    </div>

    <form @submit.prevent="onSubmitLogin">
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bolder text-dark">Kullanıcı Adı</label>
        <input
          v-model="form.username"
          type="text"
          class="form-control form-control-lg form-control-solid"
          placeholder="Kullanıcı adı giriniz"
          required
        />
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bolder text-dark fs-6 mb-0">Şifre</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control form-control-lg form-control-solid"
          placeholder="Şifre giriniz"
          required
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="btn btn-lg btn-primary w-100 mb-5"
          :disabled="loading"
        >
          <span v-if="!loading">Giriş Yap</span>
          <span v-else>
            Lütfen bekleyin...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </form>

    <!-- Debug Bilgileri -->
    <div v-if="debugInfo" class="mt-5 p-3 bg-light rounded">
      <h6>Debug Bilgileri:</h6>
      <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import Swal from "sweetalert2/dist/sweetalert2.min.js";
import AuthService from "@/services/AuthService";

const router = useRouter();
const store = useStore();
const loading = ref(false);
const debugInfo = ref<any>(null);

const form = reactive({
  username: "",
  password: "",
});

const onSubmitLogin = async () => {
  loading.value = true;
  debugInfo.value = null;

  try {
    console.log("Giriş denemesi:", {
      username: form.username,
      password: "***",
    });

    // Direkt AuthService ile test
    const response = await AuthService.login({
      username: form.username,
      password: form.password,
    });

    console.log("AuthService response:", response);
    debugInfo.value = response;

    if (response.result && response.data) {
      // Token'ı localStorage'a kaydet
      localStorage.setItem("access_token", response.data.token);

      // Store'a kullanıcı bilgilerini kaydet
      const user = {
        id: response.data.user.id || "",
        email: response.data.user.email || form.username,
        access_token: response.data.token,
        refresh_token: "",
        token_expires_date: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        nameSurname: response.data.user.username || form.username,
        type: "User",
      };

      store.commit("SET_AUTH", user);

      // Başarı mesajı göster ve dashboard'a yönlendir
      Swal.fire({
        text: "Giriş başarılı!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Tamam",
        customClass: {
          confirmButton: "btn fw-bold btn-light-primary",
        },
      });

      // Hemen dashboard'a yönlendir
      router.push({ name: "dashboard" });
    } else {
      Swal.fire({
        text: response.message || response.errorMessage || "Giriş başarısız",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Tekrar dene!",
        customClass: {
          confirmButton: "btn fw-bold btn-light-danger",
        },
      });
    }
  } catch (error: any) {
    console.error("Giriş hatası:", error);
    debugInfo.value = { error: error.message, stack: error.stack };

    Swal.fire({
      text: "Giriş sırasında hata oluştu: " + error.message,
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Tekrar dene!",
      customClass: {
        confirmButton: "btn fw-bold btn-light-danger",
      },
    });
  } finally {
    loading.value = false;
  }
};
</script>
