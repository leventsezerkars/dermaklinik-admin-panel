<template>
  <div class="card" :class="customClasses">
    <div
      v-if="title"
      class="card-header border-0"
      :id="`list_card_header_${random}`"
    >
      <h3 class="card-title fw-bolder text-dark">{{ title }}</h3>
      <div class="card-toolbar">{{ subtitle }}</div>
    </div>
    <div class="card-body pt-2" :id="`list_card_body_${random}`">
      <ScrollableContent
        :scroll="scrollStatus"
        :header="`#list_card_header_${random}`"
        :body="`#list_card_body_${random}`"
        :height="scrollH"
      >
        <template v-for="(item, index) in items" :key="index">
          <div
            :class="{ 'mb-7': items.length - 1 !== index }"
            class="d-flex align-items-center"
          >
            <Symbol
              v-if="item.avatar"
              :text="item.avatar"
              size="small"
              customClass="me-5"
            />

            <div class="flex-grow-1">
              <a
                :href="item.textLink ?? '#'"
                :target="item.textLink ? '_blank' : '_self'"
                :alt="item.text"
                class="text-dark fw-bolder text-hover-primary fs-6"
              >
                {{ item.text }}
              </a>

              <span v-if="item.description" class="text-muted d-block fw-bold">
                {{ item.description }}
              </span>
            </div>
            <div v-if="item.value" class="flex-grow-1">
              <span class="badge badge-success fw-bold" style="float: right">
                {{ item.value }}
              </span>
            </div>
          </div>
        </template>
      </ScrollableContent>
    </div>
    <div class="text-center">
      <button class="btn btn-sm" type="button" v-on:click="showAll()">
        {{ showAllText }}
      </button>
    </div>
  </div>
  <ModalView
    ref="showAllmodal"
    :header-text="title"
    :id="'showAllId_' + random"
  >
    <template v-slot:body>
      <AsDataTable
        :items="modalItems"
        :header="modalHeader"
        ref="showAllDatatableRef"
        :id="`showAllDatatable`"
        :exportable="false"
        :searchable="false"
        :no-pagination="true"
      >
      </AsDataTable>
      <div class="text-end">
        <b>{{ modalSubTitleText }}</b>
      </div>
    </template>
  </ModalView>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from "vue";
import Symbol from "../Symbol.vue";
import ScrollableContent from "@/components/ScrollableContent.vue";
import AsDataTable from "@/components/AsDataTable.vue";
import ModalView from "@/components/Modal/Modal.vue";
import { currencyFormat } from "@/core/helpers/momentUtil";
export type ListModel = {
  avatar?: string;
  text: string;
  textLink?: string;
  description?: string;
  value?: string;
  rawValue?: string;
};
export default defineComponent({
  components: { Symbol, ScrollableContent, AsDataTable, ModalView },
  name: "list-widget",
  emits: ["showAllClick"],
  props: {
    id: String,
    customClasses: String,
    title: String,
    subtitle: String,
    modalSubTitle: String,
    modalSubTitleSign: String,
    scroll: {
      type: Boolean,
      default: false,
    },
    scrollHeight: {
      type: String,
      default: "500px",
    },
    items: {
      type: Array as PropType<Array<ListModel>>,
      default: () => [],
    },
    modalItems: {
      type: Array,
      default: () => [],
    },
    modalHeader: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const showAllmodal = ref<null | typeof ModalView>(null);
    const random = Math.floor(Math.random() * 100000);
    var showAllText = ref("Tümünü Göster");
    var modalSubTitleText = ref("");
    var showAllStatus = ref(false);
    var scrollStatus = ref(props.scroll);
    var scrollH = ref(props.scrollHeight);
    onMounted(() => {
      getModalSubTitle();
    });
    watch(
      () => props.modalItems,
      () => {
        getModalSubTitle();
      }
    );
    function getModalSubTitle() {
      if (props.modalSubTitle) {
        if (props.modalSubTitle == "sum") {
          modalSubTitleText.value =
            "Toplam: " +
            currencyFormat(
              props.modalItems
                .map((s) => parseFloat((s as any).rawValue!))
                .reduce((a, b) => a + b, 0),
              true
            );
        }
      }
    }

    function showAll() {
      showAllStatus.value = true;
      if (showAllStatus.value) {
        showAllmodal.value?.show();
      }

      context.emit("showAllClick", showAllStatus.value, props.id);
    }

    return {
      random,
      showAll,
      showAllText,
      scrollStatus,
      scrollH,
      showAllmodal,
      modalSubTitleText,
    };
  },
});
</script>
