<template>
  <apexchart
    ref="chart"
    :type="type"
    :options="options"
    :series="series"
    :width="width"
    :height="height"
  ></apexchart>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { VueApexChartsComponent } from "vue3-apexcharts";
import { getCSSVariableValue } from "@/assets/ts/_utils";
export default defineComponent({
  name: "chart-2",
  props: {
    type: {
      type: String as () =>
        | "line"
        | "area"
        | "bar"
        | "histogram"
        | "pie"
        | "donut"
        | "radialBar"
        | "scatter"
        | "bubble"
        | "heatmap"
        | "candlestick"
        | "radar"
        | "polarArea"
        | "rangeBar"
        | "treemap",
      default: "area",
    },
    series: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    chartOptions: {
      type: Object,
      required: true,
    },
    width: Number,
    height: Number,
  },
  components: {},
  setup(props) {
    const chart = ref<VueApexChartsComponent>();
    const options = ref(props.chartOptions);
    // const successColor = getCSSVariableValue("--bs-success");
    // const dangerColor = getCSSVariableValue("--bs-danger");
    onMounted(() => {
      options.value.xaxis.categories = props.categories as any;

      // if (
      //   parseFloat(props.series[0].data[0]) <
      //   parseFloat(props.series[0].data[1])
      // ) {
      //   options.value.stroke.colors = [dangerColor];
      //   options.value.markers.colors = [dangerColor];
      //   options.value.colors = [dangerColor];
      // } else {
      //   options.value.stroke.colors = [successColor];
      //   options.value.markers.colors = [successColor];
      //   options.value.colors = [successColor];
      // }
    });

    return {
      chart,
      options,
    };
  },
});
</script>
