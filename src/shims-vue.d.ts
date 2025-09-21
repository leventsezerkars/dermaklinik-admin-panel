/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VUE_APP_API_URL: string;
  // Diğer env değişkenlerini buraya ekleyebilirsiniz
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
