<template>
 <div>
    <div class="logicflow-custom-panel" >
        <section>
          <div class="square-sec-wrap">
            <h5>Events</h5>
            <div>
              <object type="text/html" class="resizingObject" ref="resizingDndObject" data="about:blank" @load="resizeScrollbar($refs, 'resizingDndObject', 'dndScrollbar');" />
              <perfect-scrollbar ref="dndScrollbar">
                <div class="square-wrap js_custom-dnd" ref="js_custom-dnd">
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="event1" data-mode="actionDefault" etype="event" style="background:url(images/event_1.png)no-repeat center/80%"></svg>
                  </span>
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="event2" data-mode="actionDefault" etype="event" style="background:url(images/event_2.png)no-repeat center/95%"></svg>
                  </span>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </section>
        <section>
          <div class="square-sec-wrap">
            <h5>Flow</h5>
            <div>
              <object type="text/html" class="resizingObject" ref="resizingFlowObject" data="about:blank" @load="resizeScrollbar($refs, 'resizingFlowObject', 'flowScrollbar');" />
              <perfect-scrollbar ref="flowScrollbar">
                <div class="square-wrap js_custom-dnd" ref="js_custom-flow">
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="eventDefault" data-mode="action1" style="background:url(images/action_1.png)no-repeat center/80%"></svg>
                  </span>
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="eventDefault" data-mode="action2" style="background:url(images/action_2.png)no-repeat center/80%"></svg>
                  </span>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </section>
        <section>
          <div class="square-sec-wrap">
            <h5>Actions</h5>
            <div>
              <object type="text/html" class="resizingObject" ref="resizingEventsObject" data="about:blank" @load="resizeScrollbar($refs, 'resizingEventsObject', 'eventsScrollbar');" />
              <perfect-scrollbar ref="eventsScrollbar">
                <div class="square-wrap js_custom-dnd" ref="js_custom-events">
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="eventDefault" data-mode="action3" style="background:url(images/action_3.png)no-repeat center/80%"></svg>
                  </span>
                  <span @mousedown="checkDragNode"> 
                    <svg class="small_6" data-type="eventDefault" data-mode="action4" style="background:url(images/action_4.png)no-repeat center/80%"></svg>
                  </span>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </section>
        <section>
          <div class="square-sec-wrap">
            <h5>Control</h5>
            <div>
               <object type="text/html" class="resizingObject" ref="resizingToolObject" data="about:blank" @load="resizeScrollbar($refs, 'resizingToolObject', 'toolScrollbar');" />
              <perfect-scrollbar ref="toolScrollbar">
                <div class="square-wrap">
                  <span @mousedown="switchSelection" :selected="selectionMode">
                    <svg class="small_4"><use xlink:href="#icon-tool-select" fill=""></use></svg>
                  </span>
                  <span @mousedown="lf.zoom(false)">
                    <svg class="small_8"><use xlink:href="#icon-map-zoom-out" fill=""></use></svg>
                  </span>
                  <span @mousedown="lf.zoom(true)">
                    <svg class="small_8"><use xlink:href="#icon-map-zoom-in" fill=""></use></svg>
                  </span>
                  <span @mousedown="lf.undo()" :disabled="!historyOptions.undoAble">
                    <svg class="small_8"><use xlink:href="#icon-tool-undo" fill=""></use></svg>
                  </span>
                  <span @mousedown="lf.redo()" :disabled="!historyOptions.redoAble">  
                    <svg class="small_8"><use xlink:href="#icon-tool-redo" fill=""></use></svg>
                  </span>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </section>
        <div class="panel-footer">
          <div class="btn" @click="showData">Show Data</div>
          <div class="btn" @click="importData">Import Data</div>
        </div>
    </div>
    <stylePanel v-if="activeNodes.length > 0 || activeEdges.length > 0" class="node-style-panel" :elementsStyle="elementsStyle" @setStyle="setStyle" />
    <div id="app" :class="{isDndDragging: isDndDragging}" ref="app">
      <div id="container"></div>
      <div class="dragIconWrap" ref="dragIconWrap"></div>
    </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LogicFlow from "@logicflow/core";
import { SelectionSelect } from "@logicflow/extension";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import bezier from "./nodeElements/bezier";
import resizableRect from "./nodeElements/rect";
import eventDefault from "./nodeElements/event_default";
import event1 from "./nodeElements/event_1";
import event2 from "./nodeElements/event_2";
import actionDefault from "./nodeElements/action_default";
import action1 from "./nodeElements/action_1";
import action2 from "./nodeElements/action_2";
import action3 from "./nodeElements/action_3";
import action4 from "./nodeElements/action_4";
import stylePanel from "./components/StylePanel.vue";
import Constant from './utilities/Constant';
import { guid } from './utilities/Helper';
import { testData } from './testData';

@Component({
  components: {
    stylePanel
  }
})
export default class App extends Vue {
  private lf!: any;
  private historyOptions!: any;
  private selectionMode!: boolean;
  private activeNodes!: any;
  private activeEdges!: any;
  private elementsStyle!: any;
  private isDndDragging!: boolean;
  private dragIconSize: any = {};
  private dragDom!: any;
  private onAnchorId!: any;

  data(){
    this.historyOptions = {};
    this.activeNodes = [];
    this.activeEdges = [];
    this.elementsStyle = {};
    return {
      lf : this.lf,
      historyOptions: this.historyOptions,
      selectionMode: this.selectionMode,
      resizeScrollbar: (window as any).resizeScrollbar,
      activeNodes: this.activeNodes,
      activeEdges: this.activeEdges,
      elementsStyle: this.elementsStyle,
      isDndDragging: this.isDndDragging,
      onAnchorId: this.onAnchorId
    }
  }

  mounted() {
    LogicFlow.use(SelectionSelect);

    this.lf = new LogicFlow({
      container: document.querySelector("#container") as any,
      animation: true,
      adjustEdgeStartAndEnd: true,
      nodeTextDraggable: false,
      edgeTextDraggable: false,
      edgeTextEdit: false,
      grid: {
        type: 'mesh',
        size: 10,
        config: {
            color: 'rgba(0,0,0,.1)'
        }
      },
      keyboard: {
        enabled: true,
      }
    });

    this.lf.register(resizableRect);
    this.lf.register(eventDefault);
    this.lf.register(event1);
    this.lf.register(event2);
    this.lf.register(actionDefault);
    this.lf.register(action1);
    this.lf.register(action2);
    this.lf.register(action3);
    this.lf.register(action4);
    this.lf.register(bezier);

    this.lf.render();

    (this.$refs.app as HTMLElement).addEventListener('click', this.appClick, true);

    this.lf.on('anchor:dragstart', (options: any) => {
      if(options.nodeModel.type === 'resizable-diamond') {
        options.nodeModel.graphModel.edgeType = 'sequence';
      } else options.nodeModel.graphModel.edgeType = 'bezier';
    });

    this.lf.on('history:change', (options: any) => {
      this.historyOptions = options.data;
    });

    this.lf.on('selection:selected, node:click, blank:click, edge:click, node:delete, history:change, graph:rendered', () => {
      this.$nextTick(() => {
        const { nodes, edges } = this.lf.getSelectElements();
        this.activeNodes = nodes;
        this.activeEdges = edges;
        this.getElementsStyle();
      })
    })

    this.lf.on('node:dnd-add', (options: any) => {
      const lapNode = this.isOverlap(options.data),
            actionId = this.uniqueId(),
            actionType = this.dragDom.children[0].getAttribute("data-mode"),
            dragEType = this.dragDom.children[0].getAttribute("etype"),
            eventType = this.dragDom.children[0].getAttribute("data-type"),
            newNodeOffsetX = 100,
            newNodeOffsetY = 28;
      let data = this.lf.getGraphData(),
          defaultNo = data.nodes.filter((p: any) => p.type === actionType).length,
          actionNode = {
            type: actionType,
            x: options.data.x + newNodeOffsetX,
            y: options.data.y,
            properties: (Constant as any).elements[actionType].properties,
            text: {
              value: (Constant as any).elements[actionType].text.value + (defaultNo ? ' ' + (defaultNo + 1) : ''),
              x: 0,
              y: 0,
            },
            id: actionId
          };

      let curId = options.data.id;

      const checkValidation = this.checkValidation(options, lapNode);
      //判断：操作是否合法？是：做处理。否：不处理。
      if(!checkValidation) {
        //判断：1.拖拽元素是否在锚点上。2.拖拽元素是否重叠在已有元素上？是：做处理。都否：直接新建。
        if(this.onAnchorId) {
          let sourceNode = this.lf.getNodeDataById(this.onAnchorId.split('_')[0]);
          if(eventType !== 'event') {
            this.lf.addNode(actionNode);
            this.lf.graphModel.addEdge({
              type: "bezier",
              sourceNodeId: sourceNode.id,
              targetNodeId: actionId,
              sourceAnchorId: this.onAnchorId
            });
            data = this.lf.getGraphData();

            let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
            data.nodes.splice(nodeIndex, 1)[0];
            
            data = this.resetOutgoingPos({data, sourceNode, newNodeOffsetX, newNodeOffsetY});
            this.lf.graphModel.graphDataToModel(data);
          }
        } else if(lapNode) {
          const id = lapNode.id;
          let index = data.nodes.findIndex((item: any) => item.id === id);
          if(index > -1) {
            let oldNode = data.nodes.splice(index, 1)[0],
                node!: any;

            let lapNodeEType = (Constant as any).elements[oldNode.type].properties.eType;

            //判断：被重叠元素是否与现有元素为同类型（事件/行为）？
            if(lapNodeEType == dragEType) {
              node = data.nodes.find((p: any) => p.id !== curId && p.type === eventType);

              //判断：全流程图中是否存在事件与拖拽事件类型相同？是：直接连接。否：替换处理。
              if(lapNodeEType === 'event' && node) {
                this.lf.getNodeOutgoingEdge(oldNode.id)?.forEach((e: any) => {
                  e.sourceAnchorId = node.anchors[0]?.id;
                  const {x, y} = node.anchors.find((a: any) => a.id === e.sourceAnchorId),
                        curE = data.edges.find((p: any) => p.id === e.id);
                  curE.sourceNodeId = node.id;
                  curE.sourceAnchorId = e.sourceAnchorId;
                  curE.startPoint = {x, y};
                  curE.pointsList[0] = {x, y};
                });

                let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
                data.nodes.splice(nodeIndex, 1)[0];
              } else {
                if(lapNodeEType === 'event') {
                  node = data.nodes.find((item: any) => item.id === curId);
                } else {
                  this.lf.addNode(actionNode);
                  data = this.lf.getGraphData();
                  index = data.nodes.findIndex((item: any) => item.id === id);
                  oldNode = data.nodes.splice(index, 1)[0];

                  let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
                  data.nodes.splice(nodeIndex, 1)[0];

                  node = data.nodes.find((item: any) => item.id === actionId);
                }

                curId = node.id = oldNode.id;
                node.x = oldNode.x;
                node.y = oldNode.y;
                const oldNodeSize = this.getAvailableSize(oldNode),
                      nodeSize: any = {};
                if((Constant as any).elements[node.type].style.width) nodeSize.width = oldNodeSize.width;
                if((Constant as any).elements[node.type].style.height) nodeSize.height = oldNodeSize.height;
                if((Constant as any).elements[node.type].style.rx) nodeSize.rx = oldNodeSize.width/2;
                if((Constant as any).elements[node.type].style.ry) nodeSize.ry = oldNodeSize.height/2;
                Object.assign(node.properties, {nodeSize});

                this.lf.graphModel.graphDataToModel(data);
                data = this.lf.getGraphData();

                if(lapNodeEType !== 'event') {
                  const curNode = data.nodes.find((p: any) => p.id === curId);
                  this.lf.getNodeOutgoingEdge(node.id)?.forEach((e: any) => {
                    e.sourceAnchorId = curNode.anchors[1]?.id;
                    const {x, y} = curNode.anchors.find((a: any) => a.id === e.sourceAnchorId),
                          curE = data.edges.find((p: any) => p.id === e.id);
                    curE.sourceAnchorId = e.sourceAnchorId;
                    curE.startPoint = {x, y};
                    curE.pointsList[0] = {x, y};
                  });
                }
              }
            } else {

              //判断：当前情况下（拖拽与被重叠元素类型不同），被重叠元素是否为事件类型？是：添加拖拽行为事件。否：其他处理。
              if(lapNodeEType === 'event') {
                this.lf.addNode(actionNode);
                this.lf.graphModel.addEdge({
                  type: "bezier",
                  sourceNodeId: oldNode.id,
                  targetNodeId: actionId,
                });
                data = this.lf.getGraphData();

                let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
                data.nodes.splice(nodeIndex, 1)[0];

                data = this.resetOutgoingPos({data, sourceNode: oldNode, newNodeOffsetX, newNodeOffsetY});
                
              } else {
                const eventNode = data.nodes.find((item: any) => curId !== item.id && item.type === eventType);

                //判断：当前情况下（拖拽元素为事件类型，被重叠元素为行为类型），全流程图中是否已存在拖拽的相同事件？
                if(!eventNode) {
                  const defaultEventNode = this.lf.getNodeIncomingNode(oldNode.id).find((p: any) => p.type === 'eventDefault');

                  //判断：若全流程图中不存在拖拽的相同事件，则需新建拖拽事件类型。此时判断被重叠元素是否连接在默认事件上？是：替换默认事件。否：新建拖拽事件。
                  if(defaultEventNode) {
                    data = this.lf.getGraphData();
                    node = data.nodes.find((item: any) => item.id === curId);

                    index = data.nodes.findIndex((item: any) => item.id === defaultEventNode.id);
                    oldNode = data.nodes.splice(index, 1)[0];
                    
                    curId = node.id = oldNode.id;
                    node.x = oldNode.x;
                    node.y = oldNode.y;
                    const oldNodeSize = this.getAvailableSize(oldNode),
                          nodeSize: any = {};
                    if((Constant as any).elements[node.type].style.width) nodeSize.width = oldNodeSize.width;
                    if((Constant as any).elements[node.type].style.height) nodeSize.height = oldNodeSize.height;
                    if((Constant as any).elements[node.type].style.rx) nodeSize.rx = oldNodeSize.width/2;
                    if((Constant as any).elements[node.type].style.ry) nodeSize.ry = oldNodeSize.height/2;
                    Object.assign(node.properties, {nodeSize});
                  } else {
                    const leftAnchor = lapNode.anchors.find((p: any) => p.id.endsWith('_0'));
                    this.lf.graphModel.addEdge({
                      type: "bezier",
                      sourceNodeId: curId,
                      targetNodeId: oldNode.id,
                      endPoint: {x: leftAnchor.x, y: leftAnchor.y},
                      targetAnchorId: leftAnchor.id
                    });
                    data = this.lf.getGraphData();

                    data = this.resetIncomingPos({data, targetNode: oldNode, newNodeOffsetX, newNodeOffsetY});
                  }
                } else {
                  const sourceEventId = this.getAncestorById(oldNode.id, eventType);

                  //判断：若全流程图中存在拖拽的相同事件。该事件元素是否在被重叠元素的祖先节点上？是：不作处理。否：直接连线。
                  if(!sourceEventId) {
                    const leftAnchor = lapNode.anchors.find((p: any) => p.id.endsWith('_0'));
                    this.lf.graphModel.addEdge({
                      type: "bezier",
                      sourceNodeId: eventNode.id,
                      targetNodeId: oldNode.id,
                      endPoint: {x: leftAnchor.x, y: leftAnchor.y},
                      targetAnchorId: leftAnchor.id
                    });
                  }

                  data = this.lf.getGraphData();

                  let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
                      data.nodes.splice(nodeIndex, 1)[0];

                  if(sourceEventId) {
                    this.lf.clearSelectElements(); 
                    this.lf.emit('selection:selected', []);
                  }
                }
                
              }
            }

            this.lf.graphModel.graphDataToModel(data);
          }
        } else {

          const node = data.nodes.find((p: any) => p.id !== curId && p.type === eventType);
          //判断：是否已存在相同事件类型？是：不新建元素。否：新建元素。
          if(dragEType === 'event' && node) {
            this.lf.addNode(actionNode);
            this.lf.graphModel.addEdge({
              type: "bezier",
              sourceNodeId: node.id,
              targetNodeId: actionId,
            });
            data = this.lf.getGraphData();

            let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
            data.nodes.splice(nodeIndex, 1)[0];

            data = this.resetOutgoingPos({data, sourceNode: node, newNodeOffsetX, newNodeOffsetY});

            this.lf.graphModel.graphDataToModel(data);
          } else {
            this.lf.addNode(actionNode);
            this.lf.graphModel.addEdge({
              type: "bezier",
              sourceNodeId: curId,
              targetNodeId: actionId,
            });
          }
        }
      } else {
        let nodeIndex = data.nodes.findIndex((item: any) => item.id === curId);
        data.nodes.splice(nodeIndex, 1)[0];

        this.lf.graphModel.graphDataToModel(data);

        this.lf.clearSelectElements(); 
        this.lf.emit('selection:selected', []);
        alert(checkValidation?.message);
      }
      
      this.onAnchorId = undefined;

    })

    this.lf.on('node:dnd-drag', (options: any) => {
      const lapNode = this.isOverlap(options.data);
      if(lapNode) {
        const id = lapNode.id;
        let data = this.lf.getGraphData();
        let index = data.nodes.findIndex((item: any) => item.id === id);
        if(index > -1) {
          this.lf.selectElementById(id); 
          this.lf.emit('selection:selected', [lapNode]);
        }
      }else {
        this.lf.clearSelectElements(); 
        this.lf.emit('selection:selected', []);
      }
    })

    this.lf.on('edge:add', (options: any) => {
      this.lf.setProperties(options.data.id, (Constant as any).elements[options.data.type].properties);
    })

    this.lf.on('edge:delete', (options: any) => {
      this.$nextTick(() => {
        try {
        let isNotOnly = this.lf.getGraphData().edges.some((p: any) => p.sourceNodeId === options.data.sourceNodeId || p.targetNodeId === options.data.sourceNodeId);
        if(!isNotOnly) {
          this.lf.deleteNode(options.data.sourceNodeId);
        }
      } catch (e) {
        console.log(e)
      }

      try {
        let isNotOnly = this.lf.getGraphData().edges.some((p: any) => p.sourceNodeId === options.data.targetNodeId || p.targetNodeId === options.data.targetNodeId);
        if(!isNotOnly) {
          this.lf.deleteNode(options.data.targetNodeId);
        }
      } catch(e) {
        console.log(e)
      }
      });
    })
  }

  beforeDestroy() {
    (this.$refs.app as HTMLElement).removeEventListener('click', this.appClick, true);
  }

  resetIncomingPos(options: any) {
    let {data, targetNode, newNodeOffsetX, newNodeOffsetY} = options;
    let incoming = this.lf.getNodeIncomingNode(targetNode.id),
        ilen = incoming?.length;
    incoming?.forEach((item: any, idx: number) => {
      let n = data.nodes.find((n: any) => n.id === item.id);
      n.x = targetNode.x - newNodeOffsetX;
      n.y = targetNode.y + (idx*2 + 1 - ilen) * newNodeOffsetY;
    });

    this.lf.graphModel.graphDataToModel(data);
    data = this.lf.getGraphData();

    incoming?.forEach((item: any) => {
      let n = data.nodes.find((n: any) => n.id === item.id);
      this.lf.getNodeIncomingEdge(n.id)?.forEach((e: any) => {
        const {x, y} = n.anchors.find((a: any) => a.id === e.targetAnchorId),
              curE = data.edges.find((p: any) => p.id === e.id);
        curE.endPoint = {x, y};
        curE.pointsList = [
          curE.pointsList[0],
          {x: curE.pointsList[0].x + 10, y: curE.pointsList[0].y + 10},
          {x: x - 10, y: y - 10},
          {x, y}
        ];
      });

      this.lf.getNodeOutgoingEdge(n.id)?.forEach((e: any) => {
        const {x, y} = n.anchors.find((a: any) => a.id === e.sourceAnchorId),
              curE = data.edges.find((p: any) => p.id === e.id);
        curE.startPoint = {x, y};
        curE.pointsList = [
          {x, y},
          {x: x + 10, y: y + 10},
          {x: curE.pointsList[3].x - 10, y: curE.pointsList[3].y - 10},
          curE.pointsList[3]
        ];
      });
    });

    return data;
  }

  resetOutgoingPos(options: any) {
    let {data, sourceNode, newNodeOffsetX, newNodeOffsetY} = options;
    let outgoing = this.lf.getNodeOutgoingNode(sourceNode.id),
        olen = outgoing?.length;
    outgoing?.forEach((item: any, idx: number) => {
      let n = data.nodes.find((n: any) => n.id === item.id);
      n.x = sourceNode.x + newNodeOffsetX;
      n.y = sourceNode.y + (idx*2 + 1 - olen) * newNodeOffsetY;
    });

    this.lf.graphModel.graphDataToModel(data);
    data = this.lf.getGraphData();

    outgoing?.forEach((item: any) => {
      let n = data.nodes.find((n: any) => n.id === item.id);
      this.lf.getNodeIncomingEdge(n.id)?.forEach((e: any) => {
        const {x, y} = n.anchors.find((a: any) => a.id === e.targetAnchorId),
              curE = data.edges.find((p: any) => p.id === e.id);
        curE.endPoint = {x, y};
        curE.pointsList = [
          curE.pointsList[0],
          {x: curE.pointsList[0].x + 10, y: curE.pointsList[0].y + 10},
          {x: x - 10, y: y - 10},
          {x, y}
        ];
      });

      this.lf.getNodeOutgoingEdge(n.id)?.forEach((e: any) => {
        const {x, y} = n.anchors.find((a: any) => a.id === e.sourceAnchorId),
              curE = data.edges.find((p: any) => p.id === e.id);
        curE.startPoint = {x, y};
        curE.pointsList = [
          {x, y},
          {x: x + 10, y: y + 10},
          {x: curE.pointsList[3].x - 10, y: curE.pointsList[3].y - 10},
          curE.pointsList[3]
        ];
      });
    });

    return data;
  }

  getAncestorById(id: string, type: string): any {
    const incomingNodes = this.lf.getNodeIncomingNode(id);
    if(incomingNodes?.length) {
      let node = incomingNodes.find((p: any) => p.type === type);
      if(node) {
        return node.id;
      } else {
        let followingNode = incomingNodes.find((p: any) => this.getAncestorById(p.id, type));
        if (followingNode) {
          return this.getAncestorById(followingNode.id, type);
        } else return;
      }
    }
    return;
  }

  checkValidation(options?: any, lapNode?: any): any {
    if(lapNode) {
      //示例
      if(this.dragDom.children[0].getAttribute("data-mode") === 'action2' && lapNode.type === 'action3') {
        return {message: `警告：'action2' 无法替换 'action3'！`};
      }
    }
    return;
  }

  appClick(event: any) {
    if(event.target.hasAttribute('anchorNodeId')) {
      let id = event.target.getAttribute('anchorNodeId');
      this.lf.selectElementById(id); 
      this.lf.emit('selection:selected', this.lf.getGraphData().nodes.find((node: any) => node.id === id));
    }
  }

  uniqueId() {
    let data = this.lf.getGraphData(),
        id = guid();
    do {
      id = guid();
    } while (data.nodes.find((item: any) => item.id === id) || data.edges.find((item: any) => item.id === id));
    return id;
  }

  checkDragNode(e: any) {
    const dom = e.currentTarget,
          rect = dom.getBoundingClientRect(),
          type = dom.children[0].getAttribute("data-type");
    if(!type) return;

    this.dragDom = dom;

    e.currentTarget.setAttribute('focus', '');
    (this.$refs.dragIconWrap as HTMLElement).innerHTML = `<span style="left: ${e.clientX - (rect.width/2)}px; top: ${e.clientY - (rect.height/2)}px; width: ${rect.width}px; height: ${rect.height}px;">${e.currentTarget.innerHTML}</span>`;
    const dragIconRect = (this.$refs.dragIconWrap as HTMLElement).children[0].getBoundingClientRect();
    this.dragIconSize = {width: dragIconRect.width, height: dragIconRect.height};
    this.isDndDragging = true;
    
    if (type) {
      this.lf.dnd.startDrag({
        type,
        properties: (Constant as any).elements[type].properties
      });
    }
    document.addEventListener('mousemove', this.dndDragging, true);
    document.addEventListener('mouseup', this.dndDraggingUp, true);
  }

  dndDragging(e: any) {
    const dom: any = (this.$refs.dragIconWrap as HTMLElement).children[0],
          rect = dom.getBoundingClientRect();
    
    dom.style.top = e.clientY - rect.height/2 + 'px';
    dom.style.left = e.clientX - rect.width/2 + 'px';
  }

  dndDraggingUp(event: any) {
    Array.prototype.forEach.call((this.$refs['js_custom-dnd'] as any).children, (dom: any) => {
      dom.removeAttribute('focus');
    });
    Array.prototype.forEach.call((this.$refs['js_custom-flow'] as any).children, (dom: any) => {
      dom.removeAttribute('focus');
    });
    Array.prototype.forEach.call((this.$refs['js_custom-events'] as any).children, (dom: any) => {
      dom.removeAttribute('focus');
    });
    document.removeEventListener('mousemove', this.dndDragging, true);
    document.removeEventListener('mouseup', this.dndDraggingUp, true);
    (this.$refs.dragIconWrap as HTMLElement).innerHTML = '';
    this.isDndDragging = false;
    this.onAnchorId = event.target.getAttribute('anchorId');
  }

  showData() {
    console.log(this.lf.getGraphData(), this.lf.history);
  }

  importData() {
    this.lf.graphModel.graphDataToModel(JSON.parse(testData));
  }

  switchSelection() {
    if(this.selectionMode) {
      this.lf.extension.selectionSelect.closeSelectionSelect();
    } else this.lf.extension.selectionSelect.openSelectionSelect();

    this.selectionMode = !this.selectionMode;
  }

  getElementsStyle() {
    let elementsStyle = {};
    const { nodes, edges } = this.lf.getSelectElements();

    if(nodes.length)
      nodes.reduce((style: any, nextNode: any) => {
        for(var key in style) {
          if(style[key] != nextNode.properties[key])
            delete style[key];
        }
        return style;
      }, Object.assign(elementsStyle, nodes[0].properties));

    if(edges.length)
      edges.reduce((style: any, nextEdge: any) => {
        for(var key in style) {
          if(style[key] != nextEdge.properties[key])
            delete style[key];
        }
        return style;
      }, nodes.length ? elementsStyle : Object.assign(elementsStyle, edges[0].properties));

    this.elementsStyle = elementsStyle;
  }

  setStyle(item: any) {
    this.activeNodes.forEach((node: any) => {
      this.lf.setProperties(node.id, item)
    })
    delete item.backgroundColor;
    this.activeEdges.forEach((edge: any) => {
      this.lf.setProperties(edge.id, item)
    })
    this.getElementsStyle();
    this.$forceUpdate();
  }

  isOverlap(node: any) {
    // 获取元素的位置和大小信息
    const rectSize = this.dragIconSize, 
          rect = {left: node.x - rectSize.width/2, right: node.x + rectSize.width/2, top: node.y - rectSize.height/2, bottom: node.y + rectSize.height/2};

    let overlapArr: any[] = [];

    [].concat(this.lf.getGraphData().nodes).reverse().forEach((item: any) => {
      if(item.id === node.id) return;
      const curRect = {left: item.x - rectSize.width/2, right: item.x + rectSize.width/2, top: item.y - rectSize.height/2, bottom: item.y + rectSize.height/2},
            overlapX = Math.max(0, Math.min(rect.right, curRect.right) - Math.max(rect.left, curRect.left)),
            overlapY = Math.max(0, Math.min(rect.bottom, curRect.bottom) - Math.max(rect.top, curRect.top)),
            overlapArea = overlapX * overlapY;
      if(overlapArea > 0) overlapArr.push({node: item, area: overlapArea});
    });

    const largestOverlap = overlapArr.sort((a: any, b: any) => b.area - a.area)?.[0];
    return largestOverlap?.node;
  }

  getAvailableSize(node: any) {
    return {width: node.properties?.nodeSize?.width || (node.properties?.nodeSize?.rx && node.properties.nodeSize.rx * 2) || 
            (Constant as any).elements[node.type].style.width || ((Constant as any).elements[node.type].style.rx && (Constant as any).elements[node.type].style.rx * 2),
            height: node.properties?.nodeSize?.height || (node.properties?.nodeSize?.ry && node.properties.nodeSize.ry * 2) || 
            (Constant as any).elements[node.type].style.height || ((Constant as any).elements[node.type].style.ry && (Constant as any).elements[node.type].style.ry * 2)
           }
  }

}
</script>

<style>
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body{
        height: 100%;
        margin: 0;
        padding: 0;
        user-select: none;
        -moz-user-select: none;
        font-size: 12px;
        font-family: Helvetica, Arial, sans-serif;
    }

    h5 {
      margin: 0;
      font-size: 12px;
    }

    .bold {
      font-weight: bold;
    }

    .underline {
      text-decoration: underline;
    }

    .italic{
      font-style: italic;
    }

    .small_6 {
      height: 60%!important;
      width: 60%!important;
    }

    .small_8 {
      height: 80%!important;
      width: 80%!important;
    }

    .small_4 {
      height: 40%!important;
      width: 40%!important;
    }

    .btn {
      border-radius: 6px;
      color: rgb(120, 86, 255, .64);
      border: 1px solid rgb(120, 86, 255, .64);
      font-weight: 600;
      text-align: center;
      font-size: 12px;
      padding: 5px;
      transition: all .3s;
      -webkit-transition: all .3s;
      cursor: pointer;
    }

    .btn:hover {
      background: rgb(120, 86, 255, .64);
      color: #fff;
    }

    .resizingObject {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: -1;
      opacity: 0;
    }

    .inputWrap > input{
      background: rgba(0,0,0,.04);
      box-shadow: none;
      height: 30px;
      width: 100%;
      text-overflow: ellipsis;
      padding: 0 5px;
      outline: none;
      line-height: 24px;
      border: none;
    }
</style>
<style scoped lang="less">
    .ps {
      height: 100%;
    }
    #app {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      padding: 0 0 5px 5px;
    }
    #container {
      height: 100%;
      width: 100%;
    }
    .logicflow-custom-panel {
      position: absolute;
      width: 250px;
      top: 10px;
      bottom: 10px;
      left: 10px;
      padding: 10px;
      z-index: 1;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      border-radius: 6px;
      display: flex;
      flex-direction: column;
    }
    .logicflow-custom-panel > section {
      flex: 1;
      height: 0;
      min-height: 0;
    }
    .square-wrap > span, /deep/ .dragIconWrap > span {
      display: inline-flex;
      vertical-align: top;
      margin: 0;
      padding: 0;
      width: 43px;
      height: 43px;
      cursor: pointer;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
    }
    .square-wrap > span[disabled] {
      opacity: .5;
      pointer-events: none;
    }
    .square-wrap > span[selected] {
      background: rgba(0, 0, 0, 0.2);
    }
    .square-wrap > span:not([disabled],[selected]):hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .js_custom-dnd > span[focus] {
      border: 1px solid #1296db;
      background: rgba(0, 0, 0, 0.05);
    }
    .square-wrap > span > svg {
      height: 100%;
      width: 100%;
    }

    .square-sec-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .square-sec-wrap > h5 {
      padding: 6px 0 2px;
      margin: 0 0 3px;
      color: #8b8c8f;
      box-shadow: inset 0 -1px 0 0 rgba(0,0,0,.1);
    }
    .square-sec-wrap > div {
      flex: 1;
      min-height: 0;
      height: 0;
      position: relative;
    }
    .panel-footer {
      padding: 10px;
      display: flex;
    }

    .panel-footer > div {
      flex: 1;
      width: 0;
      min-width: 0;
    }

    .panel-footer > div + div {
      margin-left: 10px;
    }

    .node-style-panel {
      position: absolute;
      max-height: calc(100% - 20px);
      top: 10px;
      right: 10px;
      z-index: 1;
      display: flex;
      flex-direction: column;
    }

    /deep/ .dragIconWrap > span {
      position: fixed;
      pointer-events: none;
      z-index: 1;
    }

    /deep/ .dragIconWrap > span > svg {
      height: 100%;
      width: 100%;
      opacity: 0.5;
    }

    /deep/ .custom-anchor {
      fill: rgb(255, 255, 255);
      fill-opacity: 1;
      stroke-width: 1;
      stroke: rgb(0, 0, 0);
      stroke-opacity: 1;
      cursor: crosshair;
    }

    /deep/ .custom-wrap-anchor {
      fill: rgb(148, 148, 148);
      fill-opacity: 0.5;
      stroke-width: 1;
      stroke: rgb(148, 148, 148);
      stroke-opacity: 1;
    }

    /deep/ .lf-newNode-isDragging {
      opacity: 0.5;
      pointer-events: none;
    }

    .isDndDragging /deep/ g.lf-base + g.lf-node {
      opacity: 0;
      pointer-events: none;
    }

    /deep/ .lf-text-disabled {
      pointer-events: initial;
    }

    /deep/ .lf-resize-control {
      // pointer-events: none;
    }
</style>
