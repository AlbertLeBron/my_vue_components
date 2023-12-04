import { h } from '@logicflow/core'
import RectNode from './rect'
// import { getShapeStyleFuction } from '../utilities/getShapeStyleUtil';

// 图片-基础节点
class ImageModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.isShowAnchor = true;
    this.setIsShowAnchor = () => {};
  }
  getData() {
    const data = super.getData();
    data.anchors = this.anchors;
    return data;
  }
}

class ImageNode extends RectNode.view {
  getImageHref () {
    return;
  }

  getAnchorShape(anchorData) {
    const { x, y } = anchorData;
    const { model } = this.props;
    return [h("circle", {
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
    })];
  }
}

export default {
  type: 'image-node',
  view: ImageNode,
  model: ImageModel
}