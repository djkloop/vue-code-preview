import { reactive, toRefs } from "@vue/composition-api";
import { defineComponent } from "@vue/composition-api";
const compiler = require("vue-template-compiler");
import { isEmpty, extend } from "@/utils";
import { addStylesClient } from "@/utils/style-loader/addStylesClient";
import { genStyleInjectionCode } from "@/utils/style-loader/styleParser";
import { computed } from "@vue/composition-api";
import { onMounted } from "@vue/composition-api";
import { watch } from "@vue/composition-api";

export default defineComponent({
  name: "CodePreview",
  setup() {
    const state = reactive({
      code_example: ``,
      dynamicComponent: {
        component: {
          template: "<div>124</div>",
        },
      },
      hasError: false,
    });

    state.code_example = `<template>
    <div id="app">
    <!-- 动态组件 -->
        <div>11111</div>
        <t-button />
    </div>
    </template>
    <script>
    export default {
    data() {
      return {
        loading: false,
        iconLoading: false,
        version: '2.x'
      };
    },
    created() {
      this.enterLoading();
    },
    methods: {
      enterLoading() {
        this.loading = true;
        console.log('enterLoading');
      },
      enterIconLoading() {
        this.iconLoading = { delay: 1000 };
      },
    }
    };
    </script>
    <style>
    button {
      border: 2px solid #000;
    }
    </style>`;
    let sfcDescriptor = null;
    watch(
      () => state.code_example,
      () => {
        sfcDescriptor = compiler.parseComponent(state.code_example);
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const stylesUpdateHandler = addStylesClient("demo-999", {});

    const isCodeEmpty = computed(() => {
      return !(state.code_example && !isEmpty(state.code_example.trim()));
    });

    /// code ->  -> component
    const useGenComponent = async () => {
      const _genComponent = {};
      const { template, script, styles, errors } = sfcDescriptor;
      console.log(sfcDescriptor, errors);
      if (errors && errors.length) {
        console.error(
          `Error compiling template:\n\n` +
            errors.map((e) => `  - ${e}`).join("\n") +
            "\n\n"
        );
      }
      const templateCode = template ? template.content.trim() : ``;
      let scriptCode = script ? script.content.trim() : ``;
      const styleCodes = await genStyleInjectionCode(styles, "demo-999");

      // script
      if (!isEmpty(scriptCode)) {
        const componentScript = {};
        scriptCode = scriptCode.replace(
          /export\s+default/,
          "componentScript ="
        );
        eval(scriptCode);
        // update component's content
        extend(_genComponent, componentScript);
      }

      // template
      _genComponent.template = `<section id="demo-999" class="result-box" >
            ${templateCode}
          </section>`;

      /// style
      stylesUpdateHandler(styleCodes);

      console.log("_genComponent", _genComponent);

      extend(state.dynamicComponent, {
        name: "demo-999",
        component: _genComponent,
      });

      console.log(state.dynamicComponent);
    };

    onMounted(() => {
      useGenComponent();
    });

    /// code lint
    /// right -> gencode
    /// error -> return
    const useCodeLint = () => {
      // 校验代码是否为空
      state.hasError = isCodeEmpty;
      state.errorMessage = isCodeEmpty ? "代码不能为空" : null;
      // 代码为空 跳出检查
      if (isCodeEmpty) return;

      // 校验代码是否存在<template>
      const { template } = sfcDescriptor;
      const templateCode =
        template && template.content ? template.content.trim() : ``;
      const isTemplateEmpty = isEmpty(templateCode);

      state.hasError = isTemplateEmpty;
      state.errorMessage = isTemplateEmpty ? "代码中必须包含<template>" : null;
      // 代码为空 跳出检查
      if (isTemplateEmpty) return;
    };

    const useGen = (e) => {
      useCodeLint();
      state.code_example = e.target.value;
      !state.hasError && useGenComponent();
    };

    return {
      /// state
      ...toRefs(state),
      useGen,
    };
  },
  render() {
    const renderComponent = this.dynamicComponent.component;

    return (
      <div class="w-full h-full flex space-x-2 px-4">
        <div class="flex f-full justify-center items-center my-4">
          <textarea
            class="border p-2 border-black"
            rows="20"
            cols="60"
            vModel={this.code_example}
            vOn:change={this.useGen}
          />
        </div>
        <div class="flex f-full flex-1 justify-center items-center my-4 border border-black">
          <renderComponent></renderComponent>
        </div>
      </div>
    );
  },
});
