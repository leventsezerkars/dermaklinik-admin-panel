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
    const isInitialized = ref(false);

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
      ["blockquote"],
      ["clean"],
    ];

    const initQuill = () => {
      if (!editor.value || isInitialized.value) return;

      isInitialized.value = true;

      quillInstance = new Quill(editor.value, {
        theme: "snow",
        placeholder: props.placeholder,
        modules: {
          toolbar: toolbarOptions,
          clipboard: {
            matchVisual: true, // HTML'i görsel olarak match et
          },
        },
        formats: [
          "header",
          "blockquote",
          "align",
          "indent",
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "bullet",
          "color",
          "background",
        ],
      });

      // İlk değeri ayarla
      if (props.modelValue) {
        setHTMLContent(props.modelValue);
      }

      // Değişiklikleri dinle - sadece kullanıcı değişikliklerinde emit et
      quillInstance.on("text-change", (delta, oldDelta, source) => {
        if (quillInstance && source === "user") {
          const html = quillInstance.root.innerHTML;
          emit("update:modelValue", html);
        }
      });

      // HTML yapıştırmayı handle et - Quill'in kendi paste handler'ını kullan
      const editorElement = editor.value.querySelector(".ql-editor");
      if (editorElement) {
        editorElement.addEventListener("paste", function (e: Event) {
          const event = e as ClipboardEvent;
          const clipboardData =
            event.clipboardData || (window as any).clipboardData;
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          if (clipboardData && quillInstance) {
            const html = clipboardData.getData("text/html");
            const text = clipboardData.getData("text/plain");

            if (html || text) {
              try {
                // HTML varsa HTML'i kullan, yoksa text
                const contentToPaste = html || text;

                // Delta formatına dönüştür
                const delta = quillInstance.clipboard.convert(contentToPaste);

                // Selection'ı al
                const selection = quillInstance.getSelection(true);

                console.log("Selection:", selection);

                // Delta'yı doğru pozisyona ekle

                const index = selection
                  ? selection.index
                  : quillInstance.getLength();

                // Şimdi pozisyona ekle - finalIndex'i kullan (selection varsa selection.index, yoksa son)
                const insertDelta = new (Quill.import("delta"))();

                // Her ops'i tek tek ekle
                insertDelta.retain(index);
                for (const op of delta.ops) {
                  insertDelta.push(op);
                }

                quillInstance.updateContents(insertDelta, "user");
              } catch (err) {
                console.error("Paste hatası:", err);
              }
            }
          }
        });
      }
    };
    // HTML içeriğini Quill'e doğru şekilde ayarlama fonksiyonu
    function setHTMLContent(html: string): void {
      if (!quillInstance) return;
      try {
        // HTML'i Delta formatına dönüştür
        const delta = quillInstance.clipboard.convert(html);
        quillInstance.setContents(delta, "silent");
      } catch (error) {
        console.warn(
          "HTML içeriği işlenirken hata oluştu, fallback olarak dangerouslyPasteHTML kullanılıyor:",
          error
        );
        // Fallback olarak eski yöntemi kullan
        quillInstance.clipboard.dangerouslyPasteHTML(html);
      }
    }

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
      (newValue, oldValue) => {
        // Sadece gerçek değişiklik varsa ve Quill instance hazırsa güncelle
        if (
          quillInstance &&
          newValue !== oldValue &&
          newValue !== quillInstance.root.innerHTML
        ) {
          // setTimeout ile gecikme ekle - tab değişikliği sırasında önceki event'lerin tamamlanmasını bekle
          setTimeout(() => {
            if (quillInstance && newValue !== quillInstance.root.innerHTML) {
              setHTMLContent(newValue || "");
            }
          }, 100);
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

/* Başlık stilleri - daha iyi line-height */
.quill-editor :deep(.ql-editor h1) {
  line-height: 1.4 !important;
  margin: 1.2em 0 0.8em 0 !important;
}

.quill-editor :deep(.ql-editor h2) {
  line-height: 1.4 !important;
  margin: 1.1em 0 0.7em 0 !important;
}

.quill-editor :deep(.ql-editor h3) {
  line-height: 1.5 !important;
  margin: 1em 0 0.6em 0 !important;
}

.quill-editor :deep(.ql-editor h4) {
  line-height: 1.5 !important;
  margin: 0.9em 0 0.5em 0 !important;
}

.quill-editor :deep(.ql-editor h5) {
  line-height: 1.6 !important;
  margin: 0.8em 0 0.4em 0 !important;
}

.quill-editor :deep(.ql-editor h6) {
  line-height: 1.6 !important;
  margin: 0.7em 0 0.3em 0 !important;
}

/* Liste stilleri - daha basit ve etkili yaklaşım */
.quill-editor :deep(.ql-editor ul),
.quill-editor :deep(.ql-editor ol) {
  padding-left: 1.5em !important;
  margin: 0.5em 0 !important;
  list-style-position: outside !important;
}

.quill-editor :deep(.ql-editor ul li),
.quill-editor :deep(.ql-editor ol li) {
  margin: 0.3em 0 !important;
  padding: 0.2em 0 !important;
  line-height: 1.5 !important;
}

.quill-editor :deep(.ql-editor ul) {
  list-style-type: disc !important;
}

.quill-editor :deep(.ql-editor ol) {
  list-style-type: decimal !important;
}

/* Quill'in kendi liste sınıfları için de aynı stilleri uygula */
.quill-editor :deep(.ql-editor .ql-list) {
  padding-left: 1.5em !important;
  margin: 0.5em 0 !important;
}

.quill-editor :deep(.ql-editor .ql-list.ql-bullet) {
  list-style-type: disc !important;
}

.quill-editor :deep(.ql-editor .ql-list.ql-ordered) {
  list-style-type: decimal !important;
}

.quill-editor :deep(.ql-editor .ql-list li) {
  margin: 0.3em 0 !important;
  padding: 0.2em 0 !important;
  line-height: 1.5 !important;
}

/* İç içe listeler - basit tab sistemi */
.quill-editor :deep(.ql-editor .ql-indent-1) {
  padding-left: 2.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-2) {
  padding-left: 3.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-3) {
  padding-left: 4.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-4) {
  padding-left: 5.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-5) {
  padding-left: 6.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-6) {
  padding-left: 7.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-7) {
  padding-left: 8.5em !important;
}

.quill-editor :deep(.ql-editor .ql-indent-8) {
  padding-left: 9.5em !important;
}
</style>
