<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="table-responsive">
      <table
        :class="[loading && 'overlay overlay-block']"
        class="table align-middle fs-6 gy-5 dataTable no-footer table-hover"
        :id="`kt_${id}_table`"
        role="grid"
      >
        <!--begin::Table head-->
        <thead>
          <!--begin::Table row-->
          <tr
            class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0 border-bottom"
            role="row"
          >
            <template v-for="(cell, i) in tableHeader" :key="i">
              <th
                @click="
                  sort(
                    cell.sortingField ? cell.sortingField : cell.key,
                    cell.sortable
                  )
                "
                :class="[
                  cell.name && 'min-w-125px',
                  cell.sortable !== false && 'sorting',
                  tableHeader.length != 1 &&
                    tableHeader.length - 1 === i &&
                    !(
                      tableHeader.length == 2 &&
                      tableHeader.filter((s) => s.key == 'checkbox').length == 1
                    ) &&
                    'text-end',
                  currentSort ===
                    `${cell.sortingField ? cell.sortingField : cell.key}desc` &&
                    'sorting_desc',
                  currentSort ===
                    `${cell.sortingField ? cell.sortingField : cell.key}asc` &&
                    'sorting_asc',
                ]"
                v-if="cell.key != 'checkbox'"
                tabindex="0"
                rowspan="1"
                colspan="1"
                style="cursor: pointer"
              >
                {{ cell.name }}
              </th>
              <th v-else>
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    value="1"
                    v-model="clickCheckbox"
                    @change="allRowSelectedCheckbox()"
                  />
                </div>
              </th>
            </template>
          </tr>
          <!--end::Table row-->
        </thead>
        <!--end::Table head-->
        <!--begin::Table body-->
        <tbody class="fw-bold text-gray-600">
          <template v-if="getItems.length">
            <template v-for="(item, i) in getItems" :key="i">
              <tr
                class="odd"
                @click="rowClick(item, i)"
                :class="{ selected: selectedIndex == i }"
              >
                <template v-for="(cell, i) in tableHeader" :key="i">
                  <td
                    :class="{
                      'text-end':
                        tableHeader.length != 1 &&
                        tableHeader.length - 1 === i &&
                        !(
                          tableHeader.length == 2 &&
                          tableHeader.filter((s) => s.key == 'checkbox')
                            .length == 1
                        ),
                    }"
                  >
                    <slot :name="`cell-${cell.key}`" :row="item">
                      {{ item[prop] }}
                    </slot>
                    <span v-if="!$slots[`cell-${cell.key}`]">
                      {{ item[cell.key] }}
                    </span>
                  </td>
                </template>
                <!--end::Item=-->
              </tr>
            </template>
          </template>
          <template v-else>
            <tr class="odd">
              <td :colspan="tableHeader.length" class="dataTables_empty">
                Veri Bulunamadı !
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot
          v-if="Object.keys($slots).some((key) => key.startsWith('foot'))"
          class="fw-bold border-top"
        >
          <template v-for="(cell, i) in tableHeader" :key="i">
            <td
              :class="{
                'text-end':
                  tableHeader.length != 1 &&
                  tableHeader.length - 1 === i &&
                  !(
                    tableHeader.length == 2 &&
                    tableHeader.filter((s) => s.key == 'checkbox').length == 1
                  ),
              }"
            >
              <slot :name="`foot-${cell.key}`"> </slot>
            </td>
          </template>
        </tfoot>
        <div
          v-if="loading"
          class="overlay-layer card-rounded bg-dark bg-opacity-5"
        >
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
        <!--end::Table body-->
      </table>
    </div>

    <div class="row">
      <div
        class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
      >
        <div
          v-if="enableItemsPerPageDropdown"
          class="dataTables_length"
          :id="`kt_${id}_table_length`"
        >
          <label
            ><select
              :name="`kt_${id}_table_length`"
              class="form-select form-select-sm form-select-solid"
              @change="setItemsPerPage"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select></label
          >
        </div>
      </div>
      <div
        class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
      >
        <el-pagination
          v-model:current-page="pagination.page"
          @current-change="currentPageChange"
          :page-size="pagination.rowsPerPage"
          layout="total,prev, pager, next"
          :total="pagination.total"
          background
          hide-on-single-page
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  getCurrentInstance,
  reactive,
} from "vue";
import arraySort from "array-sort";

interface IPagination {
  page: number;
  total: number;
  rowsPerPage: number;
}

interface IHeaderConfiguration {
  name?: string;
  key: string;
  sortingField?: string;
  sortable?: boolean;
}

export default defineComponent({
  name: "kt-datatable",
  emit: [
    "current-change",
    "sort",
    "items-per-page-change",
    "row-click",
    "all-checked",
  ],
  props: {
    id: {
      type: String,
      default: "datatable",
    },
    tableHeader: {
      type: Array as () => Array<IHeaderConfiguration>,
      required: true,
    },
    tableData: { type: Array, required: true },
    total: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    enableItemsPerPageDropdown: { type: Boolean, default: true },
    selectedRowActive: { type: Boolean, default: true },
    currentPage: { type: Number, default: 1 },
    rowsPerPage: { type: Number, default: 10 },
    order: { type: String, default: "asc" },
    sortLabel: { type: String, default: "" },
  },
  components: {},
  setup(props, { emit }) {
    const data = ref(props.tableData);
    const currentSort = ref<string>(props.sortLabel + props.order);
    const order = ref(props.order);
    const label = ref(props.sortLabel);
    const selectedIndex = ref({});
    const clickCheckbox = ref("");
    const pagination = reactive<IPagination>({
      page: 1,
      total: props.total,
      rowsPerPage: props.rowsPerPage,
    });
    const vnodeProps = getCurrentInstance()?.vnode.props || {};
    watch(data.value, () => {
      if ("onCurrentChange" in vnodeProps) {
        currentSort.value = label.value + order.value;
      } else {
        pagination.total = data.value.length;
      }
    });

    watch(
      () => [props.total, props.rowsPerPage],
      () => {
        pagination.total = props.total ? props.total : data.value.length;
        pagination.rowsPerPage = props.rowsPerPage;
      }
    );

    const getItems = computed(() => {
      if ("onCurrentChange" in vnodeProps) {
        return data.value;
      } else {
        const clone = JSON.parse(JSON.stringify(data.value));
        const startFrom =
          pagination.page * pagination.rowsPerPage - pagination.rowsPerPage;
        return clone.splice(startFrom, pagination.rowsPerPage);
      }
    });

    const currentPageChange = (val) => {
      if ("onCurrentChange" in vnodeProps) {
        emit("current-change", val);
      } else {
        pagination.page = val;
      }
    };

    const sort = (columnName, sortable) => {
      if (sortable === false) {
        return;
      }

      if ("onSort" in vnodeProps) {
        if (order.value === "asc") {
          order.value = "desc";
          emit("sort", { columnName: columnName, order: "desc" });
        } else {
          order.value = "asc";
          emit("sort", { columnName: columnName, order: "asc" });
        }
      } else {
        if (order.value === "asc") {
          order.value = "desc";
          arraySort(data.value, columnName, { reverse: false });
        } else {
          order.value = "asc";
          arraySort(data.value, columnName, { reverse: true });
        }
      }
      currentSort.value = columnName + order.value;
    };

    const setItemsPerPage = (event) => {
      if ("onItemsPerPageChange" in vnodeProps) {
        emit("items-per-page-change", parseInt(event.target.value));
      } else {
        pagination.rowsPerPage = parseInt(event.target.value);
      }
    };

    const rowClick = (item, index) => {
      if ("onRowClick" in vnodeProps && props.selectedRowActive) {
        selectedIndex.value = index;
        emit("row-click", item);
      }
    };

    const allRowSelectedCheckbox = () => {
      if ("onAllChecked" in vnodeProps) {
        emit("all-checked", clickCheckbox.value);
      }
    };

    return {
      pagination,
      currentPageChange,
      getItems,
      sort,
      currentSort,
      setItemsPerPage,
      rowClick,
      clickCheckbox,
      allRowSelectedCheckbox,
      selectedIndex,
    };
  },
});
</script>

<style lang="scss">
table.dataTable {
  clear: both;
  margin-top: 6px !important;
  margin-bottom: 6px !important;
  max-width: none !important;
  border-collapse: separate !important;
  border-spacing: 0;
}
.odd {
  cursor: default;
}

table.dataTable > thead {
  th.sorting {
    position: relative;
  }
  .sorting:after {
    position: absolute;
  }
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: none;
  border-radius: 0.475rem;
  font-weight: 500;
  font-size: 1.075rem;
  font-family: Poppins, Helvetica, sans-serif;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #009ef7;
}

table.dataTable td.dataTables_empty,
table.dataTable th.dataTables_empty {
  text-align: center;
}

div.dataTables_wrapper div.dataTables_processing {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
