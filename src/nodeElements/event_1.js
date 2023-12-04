import { h } from '@logicflow/core'
import ImageNode from './baseImage';
import Constant from '../utilities/Constant';
import { getShapeStyleFuction } from '../utilities/getShapeStyleUtil';

const type = 'event1';

// 图片-设置节点
class SettingModel extends ImageNode.model {
  initNodeData(data) {
    data.text = {
      value: Constant.elements[type].text.value,
      x: data.x,
      y: data.y + data.properties.height/2 + 16,
      editable: false
    };
    super.initNodeData(data);
    this.width = Constant.elements[type].style.width;
    this.height = Constant.elements[type].style.height;

    this.targetRules.push({
      message: "只允许连接左边的锚点",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === "left";
      }
    });
  }

  getDefaultAnchor() {
    const { width, x, y, id } = this;
    return [
      {
        x: x + width / 2 + 5,
        y,
        type: "right",
        id: `${id}_0`,
      },
    ];
  }
}

class SettingNode extends ImageNode.view {
  getImageHref () {
    return 'images/event_1.png';
  }

  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height } = model
    const href = this.getImageHref()
    const style = this.props.model.getNodeStyle(),
          properties = this.props.model.getProperties();
    
    model.text.x = model.x;
    model.text.y = model.y + model.height/2 + 16;
    return h('g', {}, [
       h('image', { 
        ...getShapeStyleFuction(style, properties),
        x: x- 1/2 * width * 0.8,
        y: y - 1/2 * height * 0.8,
        width: width * 0.8,
        height: height * 0.8,
        href,
        preserveAspectRatio: 'none meet'
      })
    ]
    );
  }
}


export default {
  type,
  view: SettingNode,
  model: SettingModel,
}
