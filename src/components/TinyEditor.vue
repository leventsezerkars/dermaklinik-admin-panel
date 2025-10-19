<template>
  <editor
    :id="editorId"
    api-key="5tashobmywd6ipxxscn088jllulcof5dwwiu4e1pdlq1j28a"
    :model-value="$props.modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
    :init="{
      height: sizeComp,
      //menubar: 'insert format table',
      toolbar_mode: 'floating',
      //branding: false,
      //elementpath: false,
      //resize: true,
      //statusbar: true,
      //menubar: false,
      //auto_focus: false,
      //focus: false,
      //toolbar_mode: 'sliding',
      //toolbar_sticky: true,
      //toolbar_sticky_offset: 60,
      language: 'tr',
      visualblocks_default_state: true,
      end_container_on_empty_block: true,
      paste_data_images: true,
      smart_paste: true,
      image_advtab: true,
      image_title: true,
      fix_list_elements: true,
      entity_encoding: 'raw',
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
      ],
      toolbar:
        'undo redo | formatselect | h1 h2 h3 h4 h5 h6 | bold italic underline strikethrough | forecolor backcolor |' +
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | blockquote |' +
        ' removeformat |' +
        'link image media | table | insertdatetime |' +
        'code codesample | visualblocks | searchreplace |' +
        customButtons +
        ' | fullscreen | preview | help',
      selector: `#${editorId}`,
      relative_urls: false,
      remove_script_host: true,
      images_reuse_filename: true,
      automatic_uploads: true,
      file_picker_types: 'image',
      file_picker_callback: (cb, _value, meta) => {
        if (meta.filetype !== 'image') {
          return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
          try {
            const file = input.files && input.files[0];
            if (!file) return;
            const created = await GalleryImageService.createImage({
              ImageFile: file,
              Title: file.name,
              AltText: file.name,
              IsActive: true,
            });
            const url = (created as any)?.imageUrl || (created as any)?.data?.imageUrl;
            if (!url) throw new Error('Resim URL alınamadı');
            cb(url, { title: file.name });
          } catch (err) {
            console.error('Dosya seçerek yükleme başarısız:', err);
          }
        };
        input.click();
      },
      images_upload_handler: async (blobInfo, success, failure, _progress) => {
        try {
          const blob = blobInfo.blob();
          const filename = blobInfo.filename();
          const file = new File([blob], filename, { type: blob.type });
          const created = await GalleryImageService.createImage({
            ImageFile: file,
            Title: filename,
            AltText: filename,
            IsActive: true,
          });
          const url = (created as any)?.imageUrl || (created as any)?.data?.imageUrl;
          if (!url) throw new Error('Resim URL alınamadı');
          success(url);
        } catch (err) {
          console.error('Sürükle-bırak/yapıştır ile yükleme başarısız:', err);
          failure('Yükleme başarısız');
        }
      },
      // document_base_url: ,
      //images_upload_url: '',
      ...appendInit,
    }"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Editor from "@tinymce/tinymce-vue";
import GalleryImageService from "@/services/GalleryImageService";

export default defineComponent({
  name: "tiny-editor",
  components: {
    Editor,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    size: {
      type: String as () => "small" | "medium" | "large",
      default: "medium",
    },
    customButtons: {
      type: String,
      default: "",
    },
    appendInit: {
      type: Object,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const editorId = ref(`tinymce-${Math.random().toString(36).substr(2, 9)}`);

    const sizeComp = computed<number>(() => {
      return props.size == "small"
        ? 300
        : props.size == "medium"
        ? 500
        : props.size == "large"
        ? 700
        : 500;
    });

    return { sizeComp, editorId };
  },
});
</script>
