<template>
  <editor
    :id="editorId"
    api-key="w52wlaxcrgfkp9oz9pp0ejhki1l0mcz123p6f4aamooh5vmk"
    :model-value="$props.modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
    :init="{
      height: sizeComp,
      menubar: 'insert format table',
      toolbar_mode: 'floating',
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
        'advlist autolink lists link image charmap',
        'searchreplace visualblocks code fullscreen',
        'print preview anchor insertdatetime media',
        'paste code help wordcount table',
      ],
      toolbar:
        'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify' +
        '| bullist numlist outdent indent | link image media | backcolor forecolor |' +
        customButtons +
        ' |fullscreen print' +
        '| preview code codesample help',
      selector: `#${editorId.value}`,
      relative_urls: false,
      remove_script_host: true,
      images_reuse_filename: true,
      // document_base_url: ,
      //images_upload_url: '',
      ...appendInit,
    }"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import Editor from "@tinymce/tinymce-vue";

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
        ? 250
        : props.size == "medium"
        ? 500
        : props.size == "large"
        ? 750
        : 500;
    });

    return { sizeComp, editorId };
  },
});
</script>
