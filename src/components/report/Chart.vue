<template>
  <!--begin::Charts Widget 3-->
  <div :class="widgetClasses" class="card">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">{{ title }}</span>
        <!-- 
        <span class="text-muted fw-bold fs-7">More than 1000 new records</span> -->
      </h3>

      <!--begin::Toolbar-->
      <div class="card-toolbar" data-kt-buttons="true">
        <slot name="toolbar"></slot>
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body chart">
      <!--begin::Chart-->
      <apexchart
        ref="chart"
        type="area"
        :options="options"
        :series="series"
      ></apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Charts Widget 3-->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { VueApexChartsComponent } from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
export default defineComponent({
  name: "chart-1",
  props: {
    widgetClasses: String,
    categories: {
      type: Array,
      default: () => [],
    },
    series: {
      type: Array,
      default: () => [],
    },
    title: String,
  },
  components: {},
  setup(props) {
    const chart = ref<VueApexChartsComponent>();
    const labelColor = getCSSVariableValue("--bs-gray-500");
    const borderColor = getCSSVariableValue("--bs-gray-200");
    const baseColor = getCSSVariableValue("--bs-info");
    const lightColor = getCSSVariableValue("--bs-light-info");

    var options: ApexOptions = {
      chart: {
        fontFamily: "inherit",
        type: "area",
        height: 350,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "solid",
        opacity: 1,
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        categories: props.categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
        crosshairs: {
          position: "front",
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (val) {
            return val.toString();
          },
        },
        x: {
          formatter: function (val, opts) {
            return opts.w.globals.categoryLabels[opts.dataPointIndex];
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColors: baseColor,
        strokeWidth: 3,
      },
    };

    watch(
      () => props.categories,
      () => {
        if (options.xaxis != undefined)
          options.xaxis.categories = props.categories as any;
        chart.value?.updateOptions(options);
      },
      { deep: true }
    );

    return {
      options,
      chart,
    };
  },
});
</script>
