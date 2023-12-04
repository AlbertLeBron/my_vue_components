import { h } from '@logicflow/core'
import ImageNode from './baseImage';
import Constant from '../utilities/Constant';
import { getShapeStyleFuction } from '../utilities/getShapeStyleUtil';

const type = 'action4';

// 图片-设置节点
class SettingModel extends ImageNode.model {
  initNodeData(data) {
    data.text.x = data.x;
    data.text.y = data.y + data.properties.height/2 + 10;
    super.initNodeData(data)
    this.width = Constant.elements[type].style.width;
    this.height = Constant.elements[type].style.height;

    const circleOnlyAsTarget = {
      message: "只允许从右边的锚点连出",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return (sourceAnchor.type === "right" && targetAnchor.type === 'left') || (sourceAnchor.type === "left" && targetAnchor.type === 'right');
      }
    };
    this.sourceRules.push(circleOnlyAsTarget);
    this.targetRules.push({
      message: "只允许连接左边的锚点",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return (sourceAnchor.type === "right" && targetAnchor.type === 'left') || (sourceAnchor.type === "left" && targetAnchor.type === 'right');
      }
    });
  }

  getDefaultAnchor() {
    const { width, x, y, id } = this;
    const anchors = [];

    anchors.push({
      x: x - width / 2,
      y: y,
      type: "left",
      id: `${id}_0`
    });

    anchors.push({
      x: x + width / 2 + 3,
      y: y - 5,
      type: "right",
      id: `${id}_1`,
    });
    anchors.push({
      x: x + width / 2 + 3,
      y: y + 5,
      type: "right",
      id: `${id}_2`,
    });

    return anchors;
  }
}

class SettingNode extends ImageNode.view {

  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height, radius } = model;
    const style = this.props.model.getNodeStyle(),
          properties = this.props.model.getProperties();
    style.strokeWidth = Constant.elements[type].style.strokeWidth;
    model.text.x = model.x;
    model.text.y = model.y + model.height/2 + 10;
    return [
      h("image", {
        ...getShapeStyleFuction(style, properties),
        x: x - width / 2 * 0.8,
        y: y - height / 2 * 0.8,
        rx: radius,
        ry: radius,
        width: width * 0.8,
        height: height * 0.8,
        preserveAspectRatio: 'none meet',
        href: 'images/action_4.png'
      })
    ];
  }

  getAnchorShape(anchorData) {
    const { x, y, id } = anchorData;
    const { model } = this.props;
    const { properties: {anchorText} } = model;
    return  [h("circle", {
      cx: x,
      cy: y,
      r: 7,
      className: `lf-basic-shape custom-wrap-anchor lf-node-anchor-hover`
    }),h("image", {
      x: x - 3,
      y: y - 3,
      width: 6,
      height: 6,
      anchorNodeId: model.id,
      href: 'images/anchor.png',
      className: `custom-anchor`
    })].concat(
      {'_0': [], 
       '_1': [h("image", {
          x: x + 10,
          y: y - 4,
          width: 8,
          height: 8,
          anchorNodeId: model.id,
          anchorId: id,
          href: 'images/success.png'
        }),
        h("text", {
          x: x + 24,
          y: y + 3,
          fontSize: 10,
          fill: 'currentColor',
          anchorNodeId: model.id,
          anchorId: id
        }, [anchorText?.[0]])],
       '_2': [h("image", {
          x: x + 10,
          y: y - 4,
          width: 8,
          height: 8,
          anchorNodeId: model.id,
          anchorId: id,
          href: 'images/success.png'
        }),
        h("text", {
          x: x + 24,
          y: y + 4,
          fontSize: 10,
          fill: 'currentColor',
          anchorNodeId: model.id,
          anchorId: id
        }, [anchorText?.[1]])
      ]}[id.replace(model.id, '')]);
  }
}


export default {
  type,
  view: SettingNode,
  model: SettingModel,
}
