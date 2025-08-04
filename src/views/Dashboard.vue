<template>
  <div class="d-flex flex-row-reverse">
    <div>
      <b
        >Son Sipariş Verisi Güncellenme Tarihi:
        {{ getFormattedValue(lastUpdateDate, "datetime") }}</b
      >
    </div>
  </div>
  <div class="d-flex flex-row-reverse">
    <div class="d-flex align-items-center py-5">
      <el-switch
        v-model="monthOrYear"
        class="mx-5"
        active-text="Yıllık"
        inactive-text="Aylık"
      />
    </div>
    <div v-if="!monthOrYear" class="d-flex align-items-center py-5">
      <el-date-picker
        v-model="filters.startDate"
        type="month"
        placeholder="Tarih Seç"
        format="MM.YYYY"
        @change="onChangeDate"
      >
      </el-date-picker>
    </div>
    <div v-if="monthOrYear" class="d-flex align-items-center py-5">
      <el-date-picker
        v-model="filters.startEndDate"
        type="monthrange"
        range-separator="To"
        start-placeholder="Başlangış Ay"
        end-placeholder="Bitiş Ay"
        @change="onChangeDate"
      />
    </div>
  </div>
  <div class="row g-5 g-xl-8">
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen032.svg"
        color="white"
        icon-color="primary"
        :title="datas.totalPayment"
        description="Aylık Toplam Satışlar"
      ></Widget>
    </div>
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen030.svg"
        color="info"
        icon-color="white"
        :title="datas.newRestourantCount"
        description="Yeni Restoran Sayısı"
      ></Widget>
    </div>
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen001.svg"
        color="secondary"
        icon-color="warning"
        :title="datas.totalRestourantCount"
        description="Toplam Restoran Sayısı"
      ></Widget>
    </div>
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen001.svg"
        color="warning"
        icon-color="white"
        :title="datas.totalOrderCount"
        description="Toplam Sipariş Sayısı"
      ></Widget>
    </div>
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen001.svg"
        color="danger"
        icon-color="white"
        :title="datas.totalIncome"
        description="Toplam Gelecek Para"
      ></Widget>
    </div>
    <div class="col-xl-2">
      <Widget
        widget-classes="card-xl-stretch mb-xl-8"
        svg-icon="media/icons/duotune/general/gen001.svg"
        color="success"
        icon-color="white"
        :title="datas.totalIncomePaid"
        description="Toplam Gelen Para"
      ></Widget>
    </div>
  </div>
  <div class="row g-5 g-xl-8">
    <div class="col-xl-3">
      <List
        id="totalPaymentListId"
        title="En Çok Sipariş Alan Şirketler"
        :scroll="true"
        :items="datas.totalPaymentList"
        @showAllClick="showAllClick"
        :modalItems="modalList.list"
        :modalHeader="modalHeader"
      ></List>
    </div>
    <div class="col-xl-3">
      <List
        id="notOrderCompanyId"
        title="Gün Bazında Sipariş Almayan Şirketler"
        :scroll="true"
        :items="datas.notOrderCompany"
        @showAllClick="showAllClick"
        :modalItems="modalList.list"
        :modalHeader="modalHeader"
      ></List>
    </div>
    <div class="col-xl-3">
      <List
        id="companyOrderAvgId"
        title="En Verimli Şirketler"
        :scroll="true"
        :items="datas.companyOrderAvg"
        @showAllClick="showAllClick"
        :modalItems="modalList.list"
        :modalHeader="modalHeader"
      ></List>
    </div>
    <div class="col-xl-3">
      <List
        v-if="!monthOrYear"
        id="companyPaymentsId"
        title="Ödemesi Olan Şirketler"
        :scroll="true"
        :items="datas.companyPayments"
        @showAllClick="showAllClick"
        :modalItems="modalList.list"
        :modalHeader="modalHeader"
        modalSubTitle="sum"
        :modalSubTitleSign="currencySymbol"
        :subtitle="
          'Toplam: ' +
          currencyFormat(
            datas.companyPayments
              .map((s) => s.rawValue)
              .reduce((a, b) => a + b, 0),
            true
          )
        "
      ></List>
    </div>
  </div>
  <div class="row g-5 g-xl-8 my-2">
    <div class="col-xl-6">
      <Chart
        title="Günlük Satışlar"
        :categories="datas.dailyPayment.categories"
        :series="datas.dailyPayment.series"
      >
        <template v-slot:toolbar>
          <a
            class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
            :class="{ active: filters.chartDateType == 3 }"
            id="kt_charts_widget_gun"
            v-if="monthOrYear"
            @click="chartDateTypeClick(3)"
            >Ay</a
          >
          <a
            class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
            :class="{ active: filters.chartDateType == 0 }"
            id="kt_charts_widget_gun"
            @click="chartDateTypeClick(0)"
            >Gün</a
          >
          <a
            class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1"
            :class="{ active: filters.chartDateType == 1 }"
            id="kt_charts_widget_hafta"
            @click="chartDateTypeClick(1)"
            >Hafta</a
          >
          <a
            class="btn btn-sm btn-color-muted btn-active btn-active-primary px-4"
            :class="{ active: filters.chartDateType == 2 }"
            id="kt_charts_widget_saat"
            @click="chartDateTypeClick(2)"
            >Saat</a
          >
        </template>
      </Chart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { setCurrentPageTitle } from "@/core/helpers/breadcrumb";
import Widget from "@/components/statsistics/Widget.vue";
import Chart from "@/components/report/Chart.vue";
import List from "@/components/report/List.vue";
import IstatistikService, {
  IIstatistikFilter,
} from "@/services/IstatistikService";
import RestourantService from "@/services/RestourantService";
import moment from "moment";
import { useStore } from "vuex";
import { getFormattedValue, currencyFormat } from "@/core/helpers/momentUtil";
export default defineComponent({
  name: "main-dashboard",
  components: {
    Widget,
    List,
    Chart,
  },
  setup() {
    const store = useStore();
    const currencySymbol = store.getters.currentCountryInfo.currencySymbol;

    const lastUpdateDate = ref<Date | undefined>();
    const monthOrYear = ref(false);
    const modalList = reactive({
      list: [] as any,
    });
    const modalHeader = ref([
      {
        name: "Şirket",
        key: "text",
        sortable: false,
      },
      {
        name: "Değer",
        key: "value",
        sortable: false,
      },
    ]);
    var datas = reactive({
      totalPayment: "0",
      newRestourantCount: "0",
      totalRestourantCount: "0",
      totalOrderCount: "0",
      totalIncome: "0",
      totalIncomePaid: "0",
      totalPaymentList: [] as any,
      notOrderCompany: [] as any,
      companyOrderAvg: [] as any,
      companyPayments: [] as any,
      dailyPayment: {
        categories: [],
        series: [],
      } as any,
    });
    var filters = ref<IIstatistikFilter>({
      startEndDate: [new Date(), new Date()],
      startDate: new Date().toString(),
      endDate: "",
      showAll: false,
      chartDateType: 0,
      companyId: null,
    });

    onMounted(async () => {
      setCurrentPageTitle("Dashboard");
      var updateVal = await RestourantService.getLastOrderUpdateTime();
      lastUpdateDate.value = updateVal.entity;
      await getDatas();
    });
    watch(monthOrYear, async (val) => {
      if (val) {
        await getDatasForYear();
      } else {
        await getDatas();
      }
    });
    async function showAllClick(clickStatus, id) {
      filters.value.showAll = clickStatus;
      if (id == "totalPaymentListId") {
        await totalPaymentList();
      } else if (id == "notOrderCompanyId") {
        await notOrderCompany();
      } else if (id == "companyOrderAvgId") {
        await companyOrderAvg();
      } else if (id == "companyPaymentsId") {
        await companyPayments();
      }
    }
    function chartDateTypeClick(val) {
      filters.value.chartDateType = val;
      dailyPayment();
    }
    async function onChangeDate(val) {
      if (!val) {
        return;
      }
      if (!monthOrYear.value) {
        // ay
        await getDatas();
      } else {
        await getDatasForYear();
      }
    }

    async function getDatasForYear() {
      var allfilters = filters.value;
      allfilters.startDate = moment(allfilters.startEndDate[0])
        .startOf("month")
        .format("MM-DD-YYYY");
      allfilters.endDate = moment(allfilters.startEndDate[1])
        .endOf("month")
        .format("MM-DD-YYYY");

      var totalPayment = await IstatistikService.getTotalPayments(allfilters);
      var newRestourantCount = await IstatistikService.getNewRestourantCount(
        allfilters
      );
      var totalRestourantCount =
        await IstatistikService.getTotalRestourantCount(allfilters);
      var totalOrderCount = await IstatistikService.getTotalOrderCount(
        allfilters
      );
      datas.totalPayment = currencyFormat(totalPayment.entity, true)!;
      datas.newRestourantCount = currencyFormat(newRestourantCount.entity)!;
      datas.totalOrderCount = currencyFormat(totalOrderCount.entity)!;
      datas.totalRestourantCount = currencyFormat(totalRestourantCount.entity)!;

      await totalPaymentList();
      await notOrderCompany();
      await companyOrderAvg();
      await dailyPayment();
    }

    //AYLIK DATALAR START
    async function companyPayments() {
      var companyPayments = await IstatistikService.getListCompanyPayments(
        filters.value
      );
      if (!filters.value.showAll) {
        datas.companyPayments = [];
      } else {
        modalList.list = [];
      }
      companyPayments.list?.forEach((s) => {
        var entity = {
          text: s.companyName,
          value: currencyFormat(s.total, true),
          rawValue: s.total,
        };
        if (!filters.value.showAll) {
          datas.companyPayments.push(entity);
        } else {
          modalList.list.push(entity);
        }
      });
    }

    async function dailyPayment() {
      var dailyPayment = await IstatistikService.getListDailyPayment(
        filters.value
      );

      datas.dailyPayment = [];
      datas.dailyPayment.categories = dailyPayment.list?.map((s) => {
        if (filters.value.chartDateType == 0) {
          //gün
          return moment(s.orderDate, "DD.MM.YYYY HH:mm:ss").format(
            "DD.MM.YYYY"
          );
        } else if (filters.value.chartDateType == 1) {
          //hafta
          return s.orderDate + ". Hafta";
        } else if (filters.value.chartDateType == 2) {
          //saat
          return s.orderDate.padStart(2, "0") + ":00";
        } else if (filters.value.chartDateType == 3) {
          //ay
          return s.orderDate + ". Ay";
        }
      });
      var serieData = dailyPayment.list?.map((s) => s.total);
      datas.dailyPayment.series = [{ name: "Günlük Satış", data: serieData }];
    }
    async function totalPaymentList() {
      var totalPaymentList = await IstatistikService.getListTotalPayments(
        filters.value
      );

      if (!filters.value.showAll) {
        datas.totalPaymentList = [];
      } else {
        modalList.list = [];
      }
      totalPaymentList.list?.forEach((s) => {
        var entity = {
          text: s.companyName,
          value: currencyFormat(s.total, true),
        };
        if (!filters.value.showAll) {
          datas.totalPaymentList.push(entity);
        } else {
          modalList.list.push(entity);
        }
      });
    }

    async function notOrderCompany() {
      var notOrderCompany = await IstatistikService.getListNotOrderCompany(
        filters.value
      );

      if (!filters.value.showAll) {
        datas.notOrderCompany = [];
      } else {
        modalList.list = [];
      }
      notOrderCompany.list?.forEach((s) => {
        var entity = {
          text: s.companyName,
          value: s.total + " Gün",
        };
        if (!filters.value.showAll) {
          datas.notOrderCompany.push(entity);
        } else {
          modalList.list.push(entity);
        }
      });
    }

    async function companyOrderAvg() {
      var companyOrderAvg = await IstatistikService.getListCompanyOrderAvg(
        filters.value
      );

      if (!filters.value.showAll) {
        datas.companyOrderAvg = [];
      } else {
        modalList.list = [];
      }
      companyOrderAvg.list?.forEach((s) => {
        var entity = {
          text: s.companyName,
          value: s.total + " %",
        };
        if (!filters.value.showAll) {
          datas.companyOrderAvg.push(entity);
        } else {
          modalList.list.push(entity);
        }
      });
    }
    async function getDatas() {
      var allfilters = filters.value;
      allfilters.startDate = moment(allfilters.startDate).format("MM-01-YYYY");
      allfilters.endDate = "";

      var totalPayment = await IstatistikService.getTotalPayments(allfilters);

      var newRestourantCount = await IstatistikService.getNewRestourantCount(
        allfilters
      );

      var totalRestourantCount =
        await IstatistikService.getTotalRestourantCount(allfilters);

      var totalOrderCount = await IstatistikService.getTotalOrderCount(
        allfilters
      );

      var totalIncome = await IstatistikService.getTotalIncome(allfilters);

      var totalIncomePaid = await IstatistikService.getTotalIncomePaid(
        allfilters
      );

      datas.totalPayment = currencyFormat(totalPayment.entity, true)!;
      datas.newRestourantCount = currencyFormat(newRestourantCount.entity)!;
      datas.totalOrderCount = currencyFormat(totalOrderCount.entity)!;
      datas.totalRestourantCount = currencyFormat(totalRestourantCount.entity)!;
      datas.totalIncome = currencyFormat(totalIncome.entity)!;
      datas.totalIncomePaid = currencyFormat(totalIncomePaid.entity)!;

      await totalPaymentList();
      await notOrderCompany();
      await companyOrderAvg();
      await companyPayments();
      await dailyPayment();
    }
    //AYLIK DATALAR END

    return {
      monthOrYear,
      lastUpdateDate,
      datas,
      onChangeDate,
      filters,
      showAllClick,
      chartDateTypeClick,
      modalList,
      modalHeader,
      currencySymbol,
      getFormattedValue,
      currencyFormat,
    };
  },
});
</script>
