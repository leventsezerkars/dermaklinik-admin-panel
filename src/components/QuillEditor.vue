<template>
  <div class="quill-editor">
    <div ref="editor" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default defineComponent({
  name: "QuillEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    size: {
      type: String as () => "small" | "medium" | "large",
      default: "medium",
    },
    placeholder: {
      type: String,
      default: "İçerik yazın...",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const editor = ref<HTMLElement | null>(null);
    let quillInstance: Quill | null = null;

    const height = computed<number>(() => {
      return props.size === "small" ? 300 : props.size === "medium" ? 500 : 700;
    });

    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["blockquote", "code-block"],
      ["clean"],
    ];

    const initQuill = () => {
      if (!editor.value) return;

      quillInstance = new Quill(editor.value, {
        theme: "snow",
        placeholder: props.placeholder,
        modules: {
          toolbar: toolbarOptions,
        },
      });

      // İlk değeri ayarla
      if (props.modelValue) {
        quillInstance.root.innerHTML = props.modelValue;
      }

      // Değişiklikleri dinle
      quillInstance.on("text-change", () => {
        if (quillInstance) {
          const html = quillInstance.root.innerHTML;
          emit("update:modelValue", html);
        }
      });
    };

    onMounted(() => {
      initQuill();
    });

    onBeforeUnmount(() => {
      if (quillInstance) {
        quillInstance = null;
      }
    });

    // modelValue değiştiğinde editörü güncelle
    watch(
      () => props.modelValue,
      (newValue) => {
        if (quillInstance && newValue !== quillInstance.root.innerHTML) {
          quillInstance.root.innerHTML = newValue || "";
        }
      }
    );

    return {
      editor,
      height,
    };
  },
});
</script>

<style scoped>
.quill-editor {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
}

.quill-editor :deep(.ql-editor) {
  min-height: 200px;
  font-size: 14px;
  line-height: 1.5;
}

.quill-editor :deep(.ql-toolbar) {
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
}

.quill-editor :deep(.ql-container) {
  border: none;
  font-family: inherit;
}
</style>
