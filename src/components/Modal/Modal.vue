<template>
  <div
    class="modal fade"
    :id="id"
    ref="modalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" :class="'modal-' + size">
      <div class="modal-content rounded">
        <div class="modal-header">
          <h2>{{ headerText }}</h2>
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body py-10 px-lg-17">
          <slot name="body"></slot>
        </div>
        <div v-if="$slots[`footer`]" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "modal-dialog",

  props: {
    headerText: String,
    id: {
      type: String,
      required: true,
    },
    size: {
      type: String as () => "sm" | "md" | "lg" | "xl",
      default: "lg",
    },
  },
  setup(props, { expose }) {
    const modalRef = ref<Modal>(null);
    const hide = () => {
      const modal = Modal.getInstance(document.getElementById(props.id));
      modal.hide();
    };
    const show = () => {
      const modal = new Modal(document.getElementById(props.id));
      modal.show();
    };

    expose({ show, hide });

    return { modalRef };
  },
});
</script>
