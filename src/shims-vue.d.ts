declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $refs: {
      [key: string]: Vue | Element | (Vue | Element)[] | undefined;
    };
  }
} 