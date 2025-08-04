<template>
  <div class="d-flex flex-column flex-lg-row">
    <div class="flex-lg-row-fluid mb-10 mb-lg-0 me-lg-7 me-xl-10">
      <div class="card">
        <div class="card-body p-12">
          <div class="d-flex flex-column align-items-start flex-xxl-row">
            <div
              class="d-flex align-items-center flex-equal fw-row me-4 order-2"
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              title="Specify invoice date"
            >
              <div class="fs-6 fw-bolder text-gray-700 text-nowrap">
                Tarih:&nbsp;&nbsp;
              </div>
              <div class="position-relative d-flex align-items-center w-150px">
                <el-date-picker
                  v-model="invoiceModel.invoiceDate"
                  type="date"
                  placeholder="Tarih Seç"
                  format="DD.MM.YYYY"
                  class="fw-bolder pe-5"
                >
                </el-date-picker>
              </div>
              <!--end::Input-->
            </div>
            <!--end::Input group-->
            <!--begin::Input group-->
            <div
              class="d-flex flex-center flex-equal fw-row text-nowrap order-1 order-xxl-2 me-4"
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              title="Enter invoice number"
            >
              <span class="fs-2x fw-bolder text-gray-800">Fatura #</span>
              <input
                type="text"
                class="form-control form-control-flush fw-bolder text-muted fs-3 w-125px"
                v-model="invoiceModel.invoiceNo"
                readonly
              />
            </div>
            <!--end::Input group-->
            <!--begin::Input group-->
            <div
              class="d-flex align-items-center justify-content-end flex-equal order-3 fw-row"
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              title="Specify invoice due date"
            ></div>
            <!--end::Input group-->
          </div>
          <div class="separator separator-dashed my-10"></div>
          <div class="mb-0">
            <!--begin::Row-->
            <div class="row gx-10 mb-5">
              <div class="col-lg-12">
                <label class="form-label fs-6 fw-bolder text-gray-700 mb-3"
                  >Kime</label
                >
                <div class="mb-5">
                  <Multiselect
                    v-model="selectedCompany"
                    :clearOnSearch="true"
                    mode="single"
                    placeholder="Şirket arayın"
                    :filter-results="false"
                    :min-chars="2"
                    :resolve-on-load="false"
                    :delay="300"
                    :searchable="true"
                    label="companyName"
                    valueProp="id"
                    :object="true"
                    class="form-control form-control-solid"
                    :options="
                      async function (query) {
                        return await searchCompany(query);
                      }
                    "
                    @select="onCompanySelect"
                  />
                </div>
                <div class="mb-5">
                  <label class="required fs-6 fw-bold mb-2">Şirket Adı</label>

                  <input
                    name="toCompanyName"
                    v-model="invoiceModel.toCompanyName"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <div class="mb-5">
                  <div class="row">
                    <div class="col">
                      <label class="required fs-6 fw-bold mb-2">Şehir</label>
                      <input
                        name="toCity"
                        v-model="invoiceModel.toCity"
                        type="text"
                        class="form-control form-control-solid"
                      />
                    </div>
                    <div class="col">
                      <label class="required fs-6 fw-bold mb-2">Kapı No</label>
                      <input
                        name="toCity"
                        v-model="invoiceModel.toHouseNumber"
                        type="text"
                        class="form-control form-control-solid"
                      />
                    </div>
                    <div class="col">
                      <label class="required fs-6 fw-bold mb-2"
                        >Posta Kodu</label
                      >
                      <input
                        name="toCity"
                        v-model="invoiceModel.toPostCode"
                        type="text"
                        class="form-control form-control-solid"
                      />
                    </div>
                  </div>
                </div>
                <div class="mb-5">
                  <label class="fs-6 fw-bold mb-2">Adres</label>
                  <textarea
                    name="toAddress"
                    v-model="invoiceModel.toAddress"
                    class="form-control"
                  >
                  </textarea>
                </div>
              </div>
              <!--end::Col-->
            </div>
            <!--end::Row-->
            <!--begin::Table wrapper-->
            <div class="table-responsive mb-10">
              <!--begin::Table-->
              <table
                class="table g-5 gs-0 mb-0 fw-bolder text-gray-700"
                data-kt-element="items"
              >
                <!--begin::Table head-->
                <thead>
                  <tr
                    class="border-bottom fs-7 fw-bolder text-gray-700 text-uppercase"
                  >
                    <th class="min-w-300px w-475px">Açıklama</th>
                    <th class="min-w-100px w-100px">Adet</th>
                    <th class="min-w-150px w-150px">Fiyat</th>
                    <th class="min-w-100px w-150px text-end">Toplam</th>
                    <th class="min-w-75px w-75px text-end">Aksiyon</th>
                  </tr>
                </thead>
                <!--end::Table head-->
                <!--begin::Table body-->
                <tbody v-for="(item, index) in invoiceModel.items" :key="index">
                  <tr
                    class="border-bottom border-bottom-dashed"
                    data-kt-element="item"
                  >
                    <td class="pe-7">
                      <input
                        type="text"
                        class="form-control form-control-solid mb-2"
                        v-model="item.explain"
                        placeholder="Açıklama"
                      />
                    </td>
                    <td class="ps-0">
                      <input
                        class="form-control form-control-solid"
                        type="number"
                        min="1"
                        v-model="item.piece"
                        placeholder="1"
                        data-kt-element="Adet"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control form-control-solid text-end"
                        v-model="item.price"
                        placeholder="0.00"
                        data-kt-element="Fiyat"
                      />
                    </td>
                    <td class="pt-8 text-end text-nowrap">
                      <span data-kt-element="total">{{
                        currencyFormat(item.total, true)
                      }}</span>
                    </td>
                    <td class="pt-5 text-end">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon btn-active-color-primary"
                        data-kt-element="remove-item"
                        @click="removeRow(index)"
                      >
                        <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->
                        <span class="svg-icon svg-icon-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                              fill="black"
                            />
                            <path
                              opacity="0.5"
                              d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                              fill="black"
                            />
                            <path
                              opacity="0.5"
                              d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                              fill="black"
                            />
                          </svg>
                        </span>
                        <!--end::Svg Icon-->
                      </button>
                    </td>
                  </tr>
                </tbody>
                <!--end::Table body-->
                <!--begin::Table foot-->
                <tfoot>
                  <tr
                    class="border-top border-top-dashed align-top fs-6 fw-bolder text-gray-700"
                  >
                    <th class="text-primary">
                      <button
                        class="btn btn-link py-1"
                        data-kt-element="add-item"
                        @click="addRow"
                      >
                        Satır Ekle
                      </button>
                    </th>
                    <th
                      colspan="2"
                      class="border-bottom border-bottom-dashed ps-0"
                    >
                      <div class="d-flex flex-column align-items-start">
                        <div class="fs-5">Ara Toplam</div>
                        <div class="fs-5">
                          <div class="d-flex flex-row">
                            <div class="align-self-center me-4">Vergi</div>
                            <div>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                class="form-control form-control-sm"
                                v-model="invoiceModel.mwst"
                                placeholder="0.00 %"
                                data-kt-element="tax"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th
                      colspan="2"
                      class="border-bottom border-bottom-dashed text-end"
                    >
                      <div class="d-flex flex-column align-items-center">
                        <div class="fs-5">
                          <span data-kt-element="price">{{
                            currencyFormat(invoiceModel.price, true)
                          }}</span>
                        </div>
                        <div class="mt-3 fs-5">
                          <span data-kt-element="tax">{{
                            currencyFormat(invoiceModel.mwstPrice, true)
                          }}</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                  <tr class="align-top fw-bolder text-gray-700">
                    <th></th>
                    <th colspan="2" class="fs-4 ps-0">Genel Toplam</th>
                    <th colspan="2" class="text-center fs-4 text-nowrap">
                      <span data-kt-element="grand-total">{{
                        currencyFormat(invoiceModel.total, true)
                      }}</span>
                    </th>
                  </tr>
                </tfoot>
                <!--end::Table foot-->
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-lg-auto min-w-lg-300px">
      <div
        class="card mb-10"
        data-kt-sticky="true"
        data-kt-sticky-name="invoice"
        data-kt-sticky-offset="{default: false, lg: '200px'}"
        data-kt-sticky-width="{lg: '250px', lg: '300px'}"
        data-kt-sticky-left="auto"
        data-kt-sticky-top="150px"
        data-kt-sticky-animation="false"
        data-kt-sticky-zindex="95"
      >
        <div class="card-body p-10">
          <div class="mb-0">
            <!--begin::Row-->
            <div class="row mb-5">
              <!--begin::Col-->
              <div class="col">
                <a
                  class="btn btn-light btn-active-light-primary w-100"
                  v-on:click="prepareGenerate('preview')"
                  >Önizle</a
                >
              </div>
              <!--end::Col-->
              <!--begin::Col-->
              <div class="col">
                <button
                  class="btn btn-light btn-active-light-primary w-100"
                  v-on:click="prepareGenerate('download')"
                >
                  İndir
                </button>
              </div>
              <!--end::Col-->
            </div>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-primary w-100"
              type="submit"
              :disabled="loading"
              @click="onSubmit"
            >
              <span v-if="!loading" class="indicator-label">
                Faturayı Kaydet
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z"
                      fill="black"
                    />
                    <path
                      opacity="0.3"
                      d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z"
                      fill="black"
                    />
                  </svg>
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
          <!--end::Actions-->
        </div>
      </div>
      <div
        class="card"
        data-kt-sticky="true"
        data-kt-sticky-name="invoiceCalc"
        data-kt-sticky-offset="{default: false, lg: '200px'}"
        data-kt-sticky-width="{lg: '250px', lg: '300px'}"
        data-kt-sticky-left="auto"
        data-kt-sticky-top="150px"
        data-kt-sticky-animation="false"
        data-kt-sticky-zindex="95"
      >
        <div class="card-body p-10">
          <h6>Fiyat Hesaplama</h6>
          <div class="mb-2">
            <div class="row mb-5">
              <div class="col">
                <input
                  type="number"
                  min="0"
                  max="100"
                  class="form-control form-control-sm"
                  v-model="calculateModel.total"
                  placeholder="Genel Toplam"
                  data-kt-element="grandTotal"
                />
              </div>
            </div>
            <div class="row mb-5">
              <div class="col">
                <input
                  type="number"
                  min="0"
                  max="100"
                  class="form-control form-control-sm"
                  v-model="calculateModel.mwst"
                  placeholder="Vergi Oranı"
                  data-kt-element="tax"
                />
              </div>
            </div>
          </div>
          <div class="text-center">
            <b>Ara Toplam: </b>
            <span>{{ calculateModel.subTotal?.toFixed(2) }} </span>
          </div>
          <!--end::Actions-->
        </div>
      </div>
    </div>
  </div>
  <GeneratePdf ref="pdfRef" :fileName="pdffilename" :mode="pdfMode">
    <InvoicePdfContent :invoice-no="invoiceNo" />
  </GeneratePdf>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import SwalAlert from "@/core/helpers/swalalert";
import CompanyService, { IInvoice } from "@/services/CompanyService";
import { currencyFormat } from "@/core/helpers/momentUtil";
import { useRoute } from "vue-router";
import InvoicePdfContent from "@/views/pages/InvoicePdfContent.vue";
import GeneratePdf from "@/components/GeneratePdf.vue";
import Multiselect from "@vueform/multiselect";
import ClientCompanyService from "@/services/ClientCompanyService";
import { replaceUrl, toQueryString } from "@/core/helpers/dom";

var route = useRoute();
const companyId = route.params.id;
const selectedCompany = ref({});
const pdfRef = ref<null | typeof GeneratePdf>(null);
const pdfMode = ref("preview");
const pdffilename = ref("");
var invoiceNo = parseFloat(route.query.invoiceNo! ?? 0);
const invoiceModel = ref<IInvoice>({});
const loading = ref<boolean>(false);
const calculateModel = ref({
  total: null,
  mwst: null,
  subTotal: null,
});
onMounted(async () => {
  await getInvoice();
  await getCompany();
  await getCompanyData();
});

watch(
  () => invoiceModel.value,
  () => {
    if (invoiceModel.value.items && invoiceModel.value.items.length) {
      invoiceModel.value.items.forEach((item) => {
        item.total = item.piece * item.price;
      });
      invoiceModel.value.price = invoiceModel.value.items
        .map((s) => s.total)
        .reduce((prev, next) => prev + next);

      if (invoiceModel.value.mwst == undefined) {
        invoiceModel.value.mwst = 0;
      }
      invoiceModel.value.mwstPrice =
        (invoiceModel.value.price * invoiceModel.value.mwst) / 100;

      invoiceModel.value.total =
        invoiceModel.value.price + invoiceModel.value.mwstPrice;
    }
  },
  { deep: true }
);

watch(
  () => calculateModel.value,
  () => {
    if (calculateModel.value.total) {
      if (calculateModel.value.mwst == undefined) {
        calculateModel.value.mwst = 0;
      }
      calculateModel.value.subTotal =
        (calculateModel.value.total * 100) / (100 + calculateModel.value.mwst);
    }
  },
  { deep: true }
);

const addRow = () => {
  invoiceModel.value.items.push({
    explain: "",
    id: 0,
    invoiceId: 0,
    piece: 1,
    price: 0,
    total: 0,
  });
};

const removeRow = (index) => {
  invoiceModel.value.items.splice(index, 1);
};

const getCompanyData = async () => {
  var data = await ClientCompanyService.getClientCompany();

  if (data.result == false) {
    SwalAlert.toast(data.errorMessage!, "error");
    return;
  }
  console.log(invoiceNo);
  calculateModel.value.mwst = data.entity.defaultTaxRate;
  if (invoiceNo == 0) {
    invoiceModel.value.mwst = data.entity.defaultTaxRate;
  }
};

const getCompany = async () => {
  var data = await CompanyService.getCompany(companyId);
  onCompanySelect(data.entity);
};

const getInvoice = async () => {
  if (invoiceNo == undefined || invoiceNo == null) {
    invoiceNo = 0;
  }
  var list = await CompanyService.getInvoice(invoiceNo, 0);

  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  invoiceModel.value = list.entity;
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
const prepareGenerate = async (mode) => {
  pdfMode.value = mode;
  pdffilename.value =
    invoiceModel.value.toCompanyName +
    "_invoice_" +
    invoiceModel.value.invoiceNo +
    "_pdf";
  if (pdfRef.value) pdfRef.value.generatePDF();
};

const onCompanySelect = (option) => {
  selectedCompany.value = option;
  invoiceModel.value.companyId = option.id;
  invoiceModel.value.toCompanyName = option.invoiceCompanyName;
  invoiceModel.value.toCity = option.invoiceCity;
  invoiceModel.value.toAddress = option.invoiceAddress;
  invoiceModel.value.toHouseNumber = option.invoiceHouseNumber;
  invoiceModel.value.toPostCode = option.invoicePostCode;
};

const onSubmit = async () => {
  if (!selectedCompany.value) {
    SwalAlert.alert("Şirket seçilmelidir.", "error");
    return;
  }
  if (invoiceModel.value.invoiceDate == undefined) {
    SwalAlert.alert("Tarih boş olamaz.", "error");
    return;
  }

  if (invoiceModel.value.items.length == 0) {
    SwalAlert.alert("Fatura satırı en az 1 tane olmalıdır.", "error");
    return;
  }

  if (!invoiceModel.value.total) {
    SwalAlert.alert("Tutarlar doğru girilmelidir.", "error");
    return;
  }

  loading.value = true;
  var data = await CompanyService.invoiceCreateUpdate(invoiceModel.value);
  invoiceModel.value.id = data.entity.id;
  loading.value = false;
  if (data.result) {
    SwalAlert.toast("İşlem Başarılı");
    for await (const item of invoiceModel.value.items) {
      item.invoiceId = invoiceModel.value.id;
      var saveResult = await CompanyService.invoiceItemsCreateUpdate(item);
      if (saveResult.result) {
        replaceUrl(
          route.path +
            "?" +
            toQueryString({ invoiceNo: invoiceModel.value.invoiceNo })
        );
      }
    }
  } else {
    SwalAlert.toast("Hata Oluştu! " + data.errorMessage, "error");
  }
};
</script>
