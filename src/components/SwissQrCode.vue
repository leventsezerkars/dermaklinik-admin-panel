<template>
  <canvas ref="qrcode"></canvas>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import QRCode from "qrcode";

export default {
  name: "PostFinanceQRCode",
  props: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "CHF",
    },
    creditor: {
      type: Object,
      required: true,
    },
    debtor: {
      type: Object,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const qrcode = ref(null);
    const generateQRCode = () => {
      if (props.creditor.iban) {
        const data = buildQRCodeData();

        const swissLogo =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3QgeD0iMzUiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iODAiIGZpbGw9IiNGRkZGRkYiIC8+PHJlY3QgeD0iMTAiIHk9IjM1IiB3aWR0aD0iODAiIGhlaWdodD0iMzAiIGZpbGw9IiNGRkZGRkYiIC8+PC9zdmc+";
        QRCode.toCanvas(qrcode.value, data, { width: 200 }, (error) => {
          if (error) {
            console.error(error);
            return;
          }
          const canvas = qrcode.value;
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.src = swissLogo;
          img.onload = () => {
            const logoSize = 35;
            const borderThickness = 2;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            ctx.fillStyle = "white";
            ctx.fillRect(
              x - borderThickness,
              y - borderThickness,
              logoSize + borderThickness * 2,
              logoSize + borderThickness * 2
            );
            ctx.drawImage(img, x, y, logoSize, logoSize);
          };
        });
      }
    };
    const buildQRCodeData = () => {
      return `
SPC
0200
1
${props.creditor.iban}
S
${props.creditor.name}
${props.creditor.street}
${props.creditor.houseNumber}
${props.creditor.zipCode}
${props.creditor.city}
CH







${props.amount}
${props.currency}
S
${props.debtor.name}
${props.debtor.street}
${props.debtor.houseNumber}
${props.debtor.zipCode}
${props.debtor.city}
CH
NON


EPD
      `;
    };

    onMounted(() => {
      //generateQRCode();
    });

    watch(
      () => [props.creditor, props.debtor],
      () => {
        console.log("watch");
        console.log(props.creditor);
        console.log(props.debtor);
        generateQRCode();
      },
      { deep: true }
    );

    return {
      qrcode,
    };
  },
};
</script>

<style scoped>
canvas {
  margin: 0 auto;
  display: block;
}
</style>
