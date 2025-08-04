<template>
  <Vue3Html2pdf
    :show-layout="showLayout"
    :float-layout="floatLayout"
    :enable-download="enableDownload"
    :preview-modal="previewModal"
    :pdf-quality="2"
    :manual-pagination="true"
    :paginate-elements-by-height="1100"
    pdf-format="a4"
    pdf-orientation="portrait"
    pdf-content-width="800px"
    ref="html2Pdf"
    @beforeDownload="onBeforeDownload"
    @hasDownloaded="onhasDownloaded"
    :html-to-pdf-options="options"
  >
    <template v-slot:pdf-content>
      <slot></slot>
    </template>
  </Vue3Html2pdf>
</template>

<script setup lang="ts">
import {
  ref,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
  watch,
} from "vue";
import Vue3Html2pdf from "vue3-html2pdf";
const html2Pdf = ref<null | typeof Vue3Html2pdf>(null);
const emitted = defineEmits(["beforeDownload", "hasDownloaded"]);
const showLayout = ref(false);
const floatLayout = ref(false);
const enableDownload = ref(false);
const previewModal = ref(false);
const options = {
  margin: [5, 0, 5, 0], // Üst ve alt marginleri kontrol edin
  filename: props.fileName,
  jsPDF: {
    format: "a4",
    unit: "mm",
  },
  html2canvas: {
    useCORS: true,
    dpi: 192,
    letterRendering: true,
    scale: 4,
  },
};
const props = defineProps({
  fileName: {
    type: String,
    default: "data",
  },
  mode: {
    type: String as () => "download" | "preview" | "show",
    default: "preview",
  },
});
watch(
  () => props.mode,
  (value) => {
    generateMode(value);
  }
);

watch(
  () => props.fileName,
  (value) => {
    options.filename = value;
  }
);

onMounted(() => {
  generateMode(props.mode);
});

const generateMode = (value) => {
  if (value == "download") {
    showLayout.value = false;
    floatLayout.value = true;
    enableDownload.value = true;
    previewModal.value = false;
  } else if (value == "preview") {
    showLayout.value = false;
    floatLayout.value = true;
    enableDownload.value = false;
    previewModal.value = true;
  } else if (value == "show") {
    showLayout.value = true;
    floatLayout.value = true;
    enableDownload.value = false;
    previewModal.value = true;
  }
};

const generatePDF = () => {
  if (html2Pdf.value) html2Pdf.value.generatePdf();
};
const onBeforeDownload = (data) => {
  emitted("beforeDownload", data);
};
const onhasDownloaded = (data) => {
  emitted("hasDownloaded", data);
};
defineExpose({ generatePDF });
</script>
