import { defineComponent, onMounted } from "@vue/composition-api";
import CodePreview from "@/components/preview/preview";

export default defineComponent({
  name: "vue-code-preview",
  setup() {
    onMounted(() => {
      console.log("mounted");
    });
  },
  render() {
    return (
      <div class="flex">
        <CodePreview />
      </div>
    );
  },
});
