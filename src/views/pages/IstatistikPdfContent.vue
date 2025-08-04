<script setup lang="ts">
import { defineProps } from "vue";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
import { IIstatistikPdfContent } from "@/services/IstatistikService";

const props = defineProps({
  items: {
    type: Object as () => IIstatistikPdfContent,
  },
});
</script>
<style>
h6 {
  text-transform: uppercase;
}
</style>
<template>
  <div class="container">
    <section class="pdf-item row">
      <div class="col-auto me-auto">
        <h3>
          {{
            new Date(props.items?.StartDate).toLocaleDateString("de", {
              month: "long",
            })
          }}
          Bestellung Details
        </h3>
      </div>
      <div class="col-auto">
        <h6>
          {{ new Date(Date.now()).toLocaleDateString("tr") }}
        </h6>
      </div>
    </section>
    <hr />
    <h3 class="text-center bg-secondary">
      {{ props.items?.CompanyName }}
    </h3>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Kategorien</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Kategoriename</th>
                <th style="width: 40%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.Categories" :key="item.id">
                <td>{{ item.categoryName }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top Regionen</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Orts name</th>
                <th style="width: 40%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.Cities" :key="item.id">
                <td>{{ item.text }}</td>
                <td>{{ item.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Kunden</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Kundenname</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.Customers" :key="item.id">
                <td>{{ item.text }}</td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Zahlungsmethoden</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Zahlungsart</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.PaymentTypes" :key="item.id">
                <td>{{ item.text }}</td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Produkte</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 40%" scope="col">Kategoriename</th>
                <th style="width: 40%" scope="col">Produkt</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.OrderItems" :key="item.id">
                <td>{{ item.categoryName }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Meistbestellte Tage</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">TAG</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.DayPayment" :key="item.id">
                <td>{{ item.orderDate + ". Tag" }}</td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Beliebteste Bestellzeit</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Bestellzeit</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.HourPayment" :key="item.id">
                <td>
                  {{ item.orderDate + ":00" + " - " + item.orderDate + ":59" }}
                </td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Wochen</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Woche</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.WeekPayment" :key="item.id">
                <td>{{ item.orderDate + " Woche" }}</td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="pdf-item">
      <div class="row">
        <div class="col-12">
          <h4>Top-Monaten</h4>
          <table class="table table-sm table-striped align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 60%" scope="col">Monat</th>
                <th style="width: 20%" scope="col">Bestellmenge</th>
                <th style="width: 20%" scope="col">Bestellanzahl</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in props.items?.MonthPayment" :key="item.id">
                <td>{{ item.orderDate + ". Monat" }}</td>
                <td>{{ currencyFormat(item.total, true) }}</td>
                <td>{{ item.orderCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
