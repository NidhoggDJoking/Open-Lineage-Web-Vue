<template>
  <div>
    <Header
      :model="model"
      :theme="theme"
      :layout="layout"
      @themeChange="(newTheme) => (theme = newTheme)"
      @layoutChange="(newLayout) => (layout = newLayout)"
      @nodeSizeChange="(newTestSize) => (testSize = newTestSize)"
      @handleParseSql="handleParseSql"
      @modelChange="handleChangeModel"
      :highlightColor="highlightColor"
      :textWaterMarker="textWaterMarker"
      @highlightColorChange="(newHighlightColor) => (highlightColor = newHighlightColor)"
      @textWaterMarkerChange="(newTextWaterMarker) => (textWaterMarker = newTextWaterMarker)"
    />
    <main class="flex-auto overflow-hidden border-t border-gray-200">
      <div class="splitPane">
        <div class="pane1">
          <div
            class="flex flex-auto"
            ref="ref1"
          >
            <MonacoEditor
              :width="size.current"
              :height="'100vh'"
              :language="'sql'"
              :theme="theme"
              v-model="code"
            />
          </div>
        </div>
        <div class="pane2">
          <div
            class="absolute inset-0 w-full overflow-auto md:h-full"
            ref="ref2"
          >
            <Spin :spinning="loading">
              <template v-if="model === 'test'">
                <LineageGraphTest
                  :layout="layout"
                  :lineageData="lineageData"
                  :highlightColor="highlightColor"
                  :textWaterMarker="textWaterMarker"
                />
              </template>
              <template v-else>
                <LineageGraph
                  :layout="layout"
                  :lineageData="lineageData"
                  v-model:nodeSize="nodeSize"
                  v-model:nodeLevel="nodeLevel"
                  @nodeLevel="(newNodeLevel) => (nodeLevel = newNodeLevel)"
                  :highlightColor="highlightColor"
                  :textWaterMarker="textWaterMarker"
                />
              </template>
            </Spin>
          </div>
        </div>
      </div>
    </main>
    <Footer
      :nodeSize="nodeSize"
      :nodeLevel="nodeLevel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from '../components/Header/index.vue';
import Footer from '../components/Footer/index.vue';
import sourceData from '../test/data.json';
import MonacoEditor from '../components/MonacoEditor/index.vue';
import LineageGraph from '../components/LineageGraph/index_v2.vue';
import LineageGraphTest from '../components/LineageGraphTest/index.vue';
import { Spin } from 'ant-design-vue';
import { sql } from '../test/sql';
import { initData } from '../test/test';

const props = defineProps();
const size = ref({ percentage: 0.25 });
const layout = ref('vertical');
const theme = ref('vs-light');
const model = ref('default');
const testSize = ref(0);
const code = ref(sql());
const loading = ref(false);
const lineageData = ref();
const highlightColor = ref('red');
const textWaterMarker = ref(' '); // 水印
const ref1 = ref(null);
const ref2 = ref(null);
const nodeSize = ref(0);
const nodeLevel = ref(0);


// 点击解析血缘
const handleParseSql = () => {
  if (model.value === 'test') {
    nodeSize.value = testSize.value;
    nodeLevel.value = testSize.value;
    lineageData.value = initData(testSize.value);
  } else {
    lineageData.value = sourceData.data;
  }

};
function updateSize() {
  size.value = {
    ...size.value,
    current:
      layout.value !== 'preview' ? document.documentElement.clientWidth : 0,
    min: layout.value !== 'preview' ? 340 : 0,
    max:
      layout.value !== 'preview'
        ? document.documentElement.clientWidth - 340
        : 0,
  };
}

onMounted(() => {
  updateSize();
  window.addEventListener('resize', updateSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});

const handleChangeModel = (newModel) => {
  model.value = newModel;
  lineageData.value = null;
  nodeSize.value = 0;
  nodeLevel.value = 0;
  testSize.value = 0;
};
</script>

<style scoped>
.splitPane {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  user-select: text;
  flex-direction: row;
  left: 0px;
  right: 0px;
}

.pane1 {
  flex: 0 0 auto;
  position: relative;
  outline: none;
  width: 340px;
}

.pane2 {
  flex: 1 1 0%;
  position: relative;
  outline: none;
}
</style>