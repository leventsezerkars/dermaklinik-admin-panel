<script setup lang="ts">
import { defineProps } from "vue";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
const props = defineProps({
  items: {
    type: Array,
  },
});
</script>

<template>
  <div class="container">
    <section class="row">
      <div class="col-auto me-auto">
        <h3>
          {{
            new Date(props.items[0]?.orderDate).toLocaleDateString("de", {
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
      {{ props.items[0]?.restourantName }}
    </h3>
    <section class="row">
      <div class="col">
        <table class="table table-sm table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th class="text-end" scope="col">Pos.</th>
              <th scope="col">Kunden Name</th>
              <th scope="col">Preis</th>
              <th scope="col">Zahlungsart</th>
              <th scope="col">Bestellungsdatum</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in props.items" :key="item.id">
              <div
                v-if="index + 1 > 31 && (index - 30) % 33 == 0"
                class="html2pdf__page-break"
              ></div>
              <tr>
                <td class="text-end">{{ index + 1 }}</td>
                <td>{{ item.customerName }}</td>
                <td>{{ currencyFormat(item.totalPrice, true) }}</td>
                <td>{{ item.paymentType }}</td>
                <td>{{ getFormattedValue(item.orderDate, "datetime") }}</td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr style="font-weight: 880; font-size: large">
              <td></td>
              <td>Total</td>
              <td>{{ currencyFormat(props.items[0]?.total, true) }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>
