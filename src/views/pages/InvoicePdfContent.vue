<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import SwalAlert from "@/core/helpers/swalalert";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
import CompanyService, { IInvoice } from "@/services/CompanyService";
import ClientCompanyService, {
  IClientCompany,
} from "@/services/ClientCompanyService";
import PostFinanceQRCode from "@/components/SwissQrCode.vue";
const companyModel = ref<IClientCompany>({});
const invoiceModel = ref<IInvoice>({});
const qrModel = ref({ creditor: {}, debtor: {} });
const props = defineProps({
  invoiceNo: {
    type: Number,
  },
});

watch(
  () => invoiceModel.value,
  () => {
    if (invoiceModel.value.items.length) {
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

onMounted(async () => {
  await getCompanyData();
  await getInvoice(props.invoiceNo);
});

const getInvoice = async (invoiceNo) => {
  if (invoiceNo == undefined || invoiceNo == null) {
    invoiceNo = 0;
  }
  var list = await CompanyService.getInvoice(invoiceNo, 0);

  if (list.result == false) {
    SwalAlert.toast(list.errorMessage!, "error");
    return;
  }
  invoiceModel.value = list.entity;

  if (invoiceModel.value.items.length == 0) {
    return;
  }

  qrModel.value = {
    pdfFileName: null,
    qrReferenceInput: null,
    downloadUrl: null,
    qrIban: false,
    creditor: {
      // alacaklı
      name: companyModel.value.companyName,
      iban: companyModel.value.iban.replace(/ /g, ""),
      street: companyModel.value.address,
      houseNumber: companyModel.value.houseNumber,
      zipCode: companyModel.value.postCode.trim(),
      city: companyModel.value.city,
      country: "756",
    },
    paymentInformation: {
      amount: invoiceModel.value.total.toFixed(2),
      currency: "756",
      message: null,
      qrReference: null,
      billInformation: "",
      alternativeSchemeEBill: "",
      alternativeSchemeTwint: "",
      addAlternativeSchemes: [],
    },
    debtor: {
      //borçlu
      addInformation: "1",
      name: invoiceModel.value.toCompanyName,
      street: invoiceModel.value.toAddress ?? "",
      houseNumber: invoiceModel.value.toHouseNumber,
      zipCode: invoiceModel.value.toPostCode,
      city: invoiceModel.value.toCity,
      country: "756",
      postOfficeBox: "0",
    },
    step: {
      stepName: "pdf",
      stepIndex: 4,
    },
  };

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

  // var qrCode = await CompanyService.getInvoiceBill(
  //   qrModel.value,
  //   props.invoiceNo
  // );
  // invoiceModel.value.qrCodeUrl =
  //   "data:image/png;base64, " + qrCode.entity.result.downloadUrl;
};

const getCompanyData = async () => {
  var data = await ClientCompanyService.getClientCompany();

  if (data.result == false) {
    SwalAlert.toast(data.errorMessage!, "error");
    return;
  }
  if (data.entity) {
    companyModel.value = data.entity!;
    companyModel.value.fullName =
      companyModel.value.name + " " + companyModel.value.surname;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="card-body py-10">
        <div class="mw-lg-950px mx-auto w-100">
          <div
            class="pdf-item d-flex justify-content-between flex-column flex-sm-row"
          >
            <div class="fw-bold pe-5 pb-7">
              <p>{{ companyModel.companyName }}, {{ companyModel.fullName }}</p>
              <span>{{ invoiceModel.toCompanyName }}</span>
              <br />
              <span
                >{{ invoiceModel.toHouseNumber }}
                {{ invoiceModel.toAddress }}</span
              >
              <br />
              <span
                >{{ invoiceModel.toPostCode }} {{ invoiceModel.toCity }}</span
              >
            </div>
            <div class="">
              <a href="#" class="d-block mw-150px ms-sm-auto">
                <img
                  alt="Logo"
                  src="media/logos/apps24-logo.png"
                  class="w-100"
                />
              </a>
              <div
                class="d-flex justify-content-between flex-column flex-sm-row mt-7"
              >
                <div>
                  <ul style="list-style-type: none">
                    <li>Rechnung Nr</li>
                    <li>Rechnungsdatum</li>
                    <li>Lieferdatum</li>
                    <li>Ihre Kundennummer</li>
                    <li>Ihr Ansprechpartner</li>
                  </ul>
                </div>
                <div>
                  <ul style="list-style-type: none">
                    <li>{{ invoiceModel.invoiceNo }}</li>
                    <li>
                      {{ getFormattedValue(invoiceModel.invoiceDate, "date") }}
                    </li>
                    <li>
                      {{ getFormattedValue(invoiceModel.invoiceDate, "date") }}
                    </li>
                    <li>{{ invoiceModel.companyId }}</li>
                    <li>{{ companyModel.fullName }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="pdf-item">
            <div class="d-flex flex-column gap-3">
              <div class="fw-bold fs-2">
                Rechnung Nr. {{ invoiceModel.invoiceNo }}
              </div>
              <div class="separator"></div>
              <div class="d-flex flex-column flex-sm-row">
                <div class="flex-root d-flex flex-column">
                  <span
                    >Vielen Dank für Ihr Vertrauen in die Apps24. Wir stellen
                    Ihnen hiermit folgende Leistungen in Rechnung:</span
                  >
                </div>
              </div>
              <div class="d-flex justify-content-between flex-column">
                <div class="table-responsive">
                  <table
                    class="table table-sm align-middle table-row-dashed mb-0"
                  >
                    <thead>
                      <tr class="border-bottom fw-bold">
                        <th class="min-w-70px pb-2">Pos.</th>
                        <th class="min-w-300px pb-2">Bezeichnung</th>
                        <th class="min-w-70px text-end pb-2">Menge</th>
                        <th class="min-w-80px text-end pb-2">Einzelpreis</th>
                        <th class="min-w-100px text-end pb-2">Gesamtpreis</th>
                      </tr>
                    </thead>
                    <tbody class="fw-semibold">
                      <tr
                        v-for="(item, index) in invoiceModel.items"
                        :key="item.id"
                      >
                        <td>{{ index + 1 }}.</td>
                        <td>{{ item.explain }}</td>
                        <td class="text-end">{{ item.piece }}</td>
                        <td class="text-end">
                          {{ currencyFormat(item.price, true) }}
                        </td>
                        <td class="text-end">
                          {{ currencyFormat(item.total, true) }}
                        </td>
                      </tr>

                      <tr>
                        <td colspan="4" class="text-end fw-bold">
                          Summe Positionen
                        </td>
                        <td class="text-end">
                          {{ currencyFormat(invoiceModel.price, true) }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" class="text-end fw-bold">
                          zzgl. Mehrwertsteuer ({{ invoiceModel.mwst }}%)
                        </td>
                        <td class="text-end">
                          {{ currencyFormat(invoiceModel.mwstPrice, true) }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" class="text-dark fw-bold text-end">
                          Rechnungsbetrag
                        </td>
                        <td class="text-dark fw-bolder text-end">
                          {{ currencyFormat(invoiceModel.total, true) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <small class="my-2"
                  >Zahlungsbedingungen: Zahlung innerhalb von 14 Tagen ab
                  Rechnungseingang ohne Abzüge.</small
                >
                <small class="my-2">Mit freundlichen Grüßen</small>
                <small class="my-2">Can Ahmet</small>
                <small class="fw-bold my-2">RECHNUNG BEZAHLT!</small>
              </div>
            </div>
          </div>
          <div class="pdf-item">
            <div
              class="d-flex justify-content-between flex-column flex-sm-row mt-7"
            >
              <div>
                <h4>
                  {{ companyModel.companyName + ", " + companyModel.fullName }}
                </h4>
                <ul style="list-style-type: none; margin: 0; padding: 0">
                  <li>
                    {{ companyModel.address + " " + companyModel.houseNumber }}
                  </li>
                  <li>{{ companyModel.postCode + " " + companyModel.city }}</li>
                  <li>Schweiz</li>
                  <li>{{ companyModel.telephone }}</li>
                  <li>{{ companyModel.email }}</li>
                </ul>
              </div>
              <div>
                <ul style="list-style-type: none; margin: 0; padding: 0">
                  <li>{{ companyModel.bankName }}</li>
                  <li>{{ companyModel.iban }}</li>
                </ul>
              </div>
              <div>
                <ul style="list-style-type: none; margin: 0; padding: 0">
                  <li>{{ companyModel.taxNumber }}</li>
                  <li>Geschäftsführer:</li>
                  <li>{{ companyModel.fullName }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="html2pdf__page-break"></div>
        <div class="mw-lg-950px mx-auto w-100">
          <div class="pdf-item" style="margin: 0; padding: 0">
            <div
              class="d-flex justify-content-between flex-column flex-sm-row mt-7 border-top border-1 border-dark pt-5"
              style="--bs-gutter-x: 0"
            >
              <div
                class="col-4 border-end border-1 border-dark"
                style="font-size: 12px"
              >
                <h5>Beleg</h5>
                <p style="font-size: 11px">
                  <strong>Konto / Zahlbar an:</strong>
                </p>
                <p style="line-height: 0%">{{ qrModel.creditor.iban }}</p>
                <p style="line-height: 0%">{{ qrModel.creditor.name }}</p>
                <p style="line-height: 0%">
                  {{ qrModel.creditor.street }}
                  {{ qrModel.creditor.houseNumber }}
                </p>
                <p style="line-height: 0%">
                  {{ qrModel.creditor.zipCode }} {{ qrModel.creditor.city }}
                </p>
                <p style="font-size: 11px">
                  <strong>Zahlbar durch:</strong>
                </p>
                <p style="line-height: 0%">{{ qrModel.debtor.name }}</p>
                <p style="line-height: 0%">
                  {{ qrModel.debtor.street }}
                  {{ qrModel.debtor.houseNumber }}
                </p>
                <p style="line-height: 0%">
                  {{ qrModel.debtor.zipCode }} {{ qrModel.debtor.city }}
                </p>
              </div>
              <div class="col-8">
                <div class="row">
                  <div class="col-6">
                    <div class="mb-4">
                      <h5 class="ms-5">Zahlung</h5>
                      <PostFinanceQRCode
                        :amount="invoiceModel.total"
                        currency="CHF"
                        :creditor="qrModel.creditor"
                        :debtor="qrModel.debtor"
                      />
                      <p class="ms-5 mb-5" style="line-height: 0%">
                        <strong>Währung:</strong> CHF
                      </p>
                      <p class="ms-5" style="line-height: 0%">
                        <strong>Menge:</strong>
                        {{
                          currencyFormat(invoiceModel.total, true)?.replace(
                            "CHF",
                            ""
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="col-6">
                    <p style="font-size: 11px">
                      <strong>Konto / Zahlbar an:</strong>
                    </p>
                    <p style="line-height: 0%">{{ qrModel.creditor.iban }}</p>
                    <p style="line-height: 0%">{{ qrModel.creditor.name }}</p>
                    <p style="line-height: 0%">
                      {{ qrModel.creditor.street }}
                      {{ qrModel.creditor.houseNumber }}
                    </p>
                    <p style="line-height: 0%">
                      {{ qrModel.creditor.zipCode }} {{ qrModel.creditor.city }}
                    </p>
                    <p style="font-size: 11px">
                      <strong>Zahlbar durch:</strong>
                    </p>
                    <p style="line-height: 0%">{{ qrModel.debtor.name }}</p>
                    <p style="line-height: 0%">
                      {{ qrModel.debtor.street }}
                      {{ qrModel.debtor.houseNumber }}
                    </p>
                    <p style="line-height: 0%">
                      {{ qrModel.debtor.zipCode }} {{ qrModel.debtor.city }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
