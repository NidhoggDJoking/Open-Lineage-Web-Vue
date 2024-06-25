<template>
  <div>
    <div ref="canvasWrapper" class="canvas-wrapper" id="canvasWrapper">
      <div class="g6-component-topbar">
        <!-- 字段级血缘关系、完整血缘链路 -->
        <Topbar :ref="topBarRef" @handleFieldLineage="onFieldLineage" @handleWholeLineage="onWholeLineage" />
      </div>
      <div ref="toolbarRef" class="g6-component-toolbar">
        <!-- 右边悬浮工具 -->
        <Toolbar :layout="layout" :handleChangeSize="handleChangeSize" @handleZoomOut="handleZoomOut(graphRef)"
          @handleZoomIn="handleZoomIn(graphRef)" @handleRealZoom="handleRealZoom(graphRef)"
          @handleAutoZoom="handleAutoZoom(graphRef)" @handleRefreshLayout="handleRefreshLayout(graphRef)"
          @handleDownloadImage="handleDownloadImage(graphRef)"
          @handleEnterFullscreen="handleEnterFullscreen($refs.toolbarRef.canvasWrapper)"
          @handleExitFullscreen="handleExitFullscreen" />
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar/index.vue";
import Topbar from "./components/Topbar/index.vue";
import G6 from "@antv/g6";
import "./index.css";
import "./registerShape";
import "./registerLayout";
import {
  collapseData,
  getLeftRelation,
  getRightRelation,
  transformData,
} from "../../utils/common";
import {
  clearAllStats,
  handleAutoZoom,
  handleDownloadImage,
  handleEnterFullscreen,
  handleExitFullscreen,
  handleHighlightColor,
  handleRealZoom,
  handleRefreshLayout,
  handleTextWaterMarker,
  handleZoomIn,
  handleZoomOut,
  renderGraph,
  setLeftStats,
  setRightStats,
} from "../../utils/graphUtil";

export default {
  name: "LineageGraph",
  components: {
    Toolbar,
    Topbar,
  },
  props: {
    /**
 * 布局
 */
    layout: String,
    /**
     * 血缘数据
     */
    lineageData: Object,
    /**
     * 水印文字
     */
    textWaterMarker: String,
    /**
     * 高亮颜色
     */
    highlightColor: String,
  },
  mounted() {
    if (!this.graphRef) {
      // 实例化 Minimap
      const minimap = new G6.Minimap();
      // TODO 报错
      // 工具栏
      const toolbar = new G6.ToolBar({
        getContent: () => {
          return this.$refs.toolbarRef || ''
        },
      });
      //网格画布
      const grid = new G6.Grid();
      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = document.documentElement.clientHeight;
      const width = this.layout === "preview" ? windowWidth : windowWidth - 340;
      const height = window.outerHeight - 141 || windowHeight;
      // 实例化 Graph
      this.graphRef = new G6.Graph({
        container: document.getElementById('canvasWrapper'),
        width: width,
        height: height,
        plugins: [grid, minimap, toolbar],
        fitView: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas", "drag-node"],
        },
        // 布局配置
        layout: {
          type: "lineageLayout",
          controlPoints: true,
          nodesep: 200,
          ranksep: 600,
          begin: [1000, 1000],
        },
        defaultNode: {
          // size: [300, 800],
          type: "dice-er-box",
          color: "#096DD9",
          boxStyle: {
            stroke: "#096DD9",
            lineWidth: 6,
            radius: 4,
          },
          style: {
            fill: "#096DD9",
          },
          labelCfg: {
            style: {
              fill: "#ffffff",
              fontSize: 20,
            },
          },
        },
        defaultEdge: {
          type: "dice-er-edge",
          style: {
            stroke: "#6C6B6B",
            lineWidth: 2,
            endArrow: true,
          },
        },
      });
    }
    this.currentHighlightColorRef = this.highlightColor;
    if (this.graphRef) {
      const graph = this.graphRef;
      // 设置文字水印
      graph.setTextWaterMarker(this.textWaterMarker);
      this.bindEvents(graph);
    }
  },
  data() {
    return {
      graphRef: null,
      fieldCheckedRef: true,
      wholeCheckedRef: true,
      nodeSize: 0,
      nodeLevel: 0,
      lineageWholeData: null,
      lineagePartData: null,
      currentHighlightColorRef: null
    }
  },
  watch: {
    'lineageData'(lineageData) {
      this.fieldCheckedRef = true;
      this.wholeCheckedRef = true;
      // topBarRef?.value?.setFieldChecked(true);
      // topBarRef?.value?.setWholeChecked(true);
      // v3 不能这样搞
      // this.$refs.topBarRef.fieldChecked = true;
      // this.$refs.topBarRef.wholeChecked = true;
      if (lineageData) {
        const wholeData = lineageData.withProcessData;
        const partData = lineageData.noProcessData;
        this.lineageWholeData = wholeData;
        this.lineagePartData = partData;
        this.nodeSize = wholeData.size;
        this.nodeLevel = wholeData.level;

        const data = transformData(wholeData.data);
        renderGraph(this.graphRef, data);
      }
    },
    'textWaterMarker'(newValue) {
      handleTextWaterMarker(this.graphRef, newValue)
    },
    'highlightColor'(newValue) {
      this.currentHighlightColorRef = newValue;
      handleHighlightColor(this.graphRef, newValue);
    },
    'layout'(val) {
      if (this.graphRef) {
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        const height = window.outerHeight - 141 || windowHeight;
        const width = val === "preview" ? windowWidth : windowWidth - 340;
        this.graphRef.changeSize(width, height);
        this.graphRef.fitView();
      }
    }
  },
  methods: {
    handleChangeSize(width, height) {
      this.graphRef.changeSize(width, height);
      this.graphRef.fitView();
    },
    bindEvents(graph) {
      // 监听节点点击事件
      graph.off("node:click").on("node:click", (evt) => {
        const { item, target } = evt;
        const currentAnchor = target.get("name");
        if (!currentAnchor) return;

        if (this.fieldCheckedRef) {
          this.handleNodeClick(graph, item, currentAnchor, "highlight");
        } else {
          this.handleNodeClick(graph, item, currentAnchor, "tableHighlight");
        }
      });

      // 监听连线点击事件
      graph.off("edge:click").on("edge:click", (evt) => {
        const { item } = evt;
        if (this.fieldCheckedRef) {
          this.handleEdgeClick(graph, item, "highlight");
        } else {
          this.handleEdgeClick(graph, item, "tableHighlight");
        }
      });

      //监听只在 canvas 空白处点击事件
      graph.off("canvas:click").on("canvas:click", (ev) => {
        // 清除状态
        clearAllStats(graph);
      });
    },
    handleNodeClick(graph, item, currentAnchor, name) {
      const model = item.getModel();
      const edges = item.getEdges();

      const leftActiveEdges = [];

      getLeftRelation(edges, model, currentAnchor, leftActiveEdges);

      const rightActiveEdges = [];

      getRightRelation(edges, model, currentAnchor, rightActiveEdges);

      // 清除状态
      clearAllStats(graph);

      // 设置当前节点状态
      graph.setItemState(item, name + "-" + currentAnchor, true);

      // 设置左关联边及节点状态
      setLeftStats(graph, leftActiveEdges, this.currentHighlightColorRef, name);

      // 设置右关联边及节点状态
      setRightStats(graph, rightActiveEdges, this.currentHighlightColorRef, name);
    },
    handleEdgeClick(graph, item, name) {
      const sourceNode = item.getSource();
      const sourceModel = sourceNode.getModel();
      const sourceEdges = sourceNode.getInEdges();

      // 获取当前连线的 source 节点
      const sourceAnchor = item.getModel()["sourceAnchor"];

      const leftActiveEdges = [];
      leftActiveEdges.push(item);

      getLeftRelation(sourceEdges, sourceModel, sourceAnchor, leftActiveEdges);

      const targetNode = item.getTarget();
      const targetModel = targetNode.getModel();
      const targetEdges = targetNode.getOutEdges();

      // 获取当前连线的 target 节点
      const targetAnchor = item.getModel()["targetAnchor"];

      const rightActiveEdges = [];
      rightActiveEdges.push(item);

      getRightRelation(targetEdges, targetModel, targetAnchor, rightActiveEdges);

      // 清除状态
      clearAllStats(graph);

      // 设置左关联边及节点状态
      setLeftStats(graph, leftActiveEdges, this.currentHighlightColorRef, name);

      // 设置右关联边及节点状态
      setRightStats(graph, rightActiveEdges, this.currentHighlightColorRef, name);
    },
    onFieldLineage(checked) {
      this.fieldCheckedRef = checked;
      if (!this.lineageWholeData || !this.lineagePartData) {
        return;
      }
      let data;
      let size;
      let level;

      if (this.wholeCheckedRef) {
        size = this.lineageWholeData.size;
        level = this.lineageWholeData.level;
      } else {
        size = this.lineagePartData.size;
        level = this.lineagePartData.level;
      }

      if (checked) {
        if (this.wholeCheckedRef) {
          data = transformData(this.lineageWholeData.data);
        } else {
          data = transformData(this.lineagePartData.data);
        }
      } else {
        if (this.wholeCheckedRef) {
          data = collapseData(this.lineageWholeData.data);
        } else {
          data = collapseData(this.lineagePartData.data);
        }
      }
      this.$emit("update:nodeLevel", level);
      this.$emit("update:nodeSize", size);
      renderGraph(this.graphRef, data);
    },
    onWholeLineage(checked) {
      this.wholeCheckedRef = checked;
      if (!this.lineageWholeData || !this.lineagePartData) {
        return;
      }
      let data;
      let size;
      let level;
      if (checked) {
        size = this.lineageWholeData.size;
        level = this.lineageWholeData.level;
        if (this.fieldCheckedRef) {
          data = transformData(this.lineageWholeData.data);
        } else {
          data = collapseData(this.lineageWholeData.data);
        }
      } else {
        size = this.lineagePartData.size;
        level = this.lineagePartData.level;
        if (this.fieldCheckedRef) {
          data = transformData(this.lineagePartData.data);
        } else {
          data = collapseData(this.lineagePartData.data);
        }
      }
      this.$emit("update:nodeLevel", level);
      this.$emit("update:nodeSize", size);
      renderGraph(this.graphRef, data);
    },
    handleAutoZoom(e) {
      handleAutoZoom(e)
    },
    handleDownloadImage(e) {
      handleDownloadImage(e)
    },
    handleEnterFullscreen(e) {
      handleEnterFullscreen(e)
    },
    handleExitFullscreen(e) {
      handleExitFullscreen(e)
    },
    handleRealZoom(e) {
      handleRealZoom(e)
    },
    handleRefreshLayout(e) {
      handleRefreshLayout(e)
    },
    handleZoomIn(e) {
      handleZoomIn(e)
    },
    handleZoomOut(e) {
      handleZoomOut(e)
    },
  }
}

</script>

<style scoped>
@import url("./index.css");

:-webkit-full-screen {
  background-color: #ffffff !important;
}

:-moz-full-screen {
  background-color: #ffffff !important;
}

:-ms-fullscreen {
  background-color: #ffffff !important;
}

:fullscreen {
  background-color: #ffffff !important;
}
</style>
