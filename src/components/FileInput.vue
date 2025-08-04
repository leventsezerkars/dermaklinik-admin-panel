<template>
  <el-upload
    action="#"
    :accept="accept"
    :limit="1"
    :on-change="handleChange"
    :auto-upload="false"
  >
    <template #trigger>
      <el-button type="primary">{{ buttonText }}</el-button>
    </template>
    <el-button
      class="mx-3"
      type="success"
      @click="$emit('submitUpload')"
      v-if="showSubmitButton"
    >
      Gönder
    </el-button>
    <template #tip v-if="tip">
      <div class="el-upload__tip text-red">{{ tip }}</div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "file-input",
  emits: ["onChange", "onSubmit"],
  props: {
    tip: {
      type: String,
      default: "",
    },
    accept: {
      type: String,
      default: "video/*",
    },
    buttonText: {
      type: String,
      default: "Dosya Seçiniz",
    },
    showSubmitButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleChange = async (uploadFile) => {
      uploadFile.extension = uploadFile.name.match(/\.([^\\.]+)$/)[1];
      emit("onChange", uploadFile);
    };
    return { handleChange };
  },
});
</script>
