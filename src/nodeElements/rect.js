import { h } from "@logicflow/core";
import { RectResize } from "@logicflow/extension";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'resizable-rect';

class ResizableRectView  extends RectResize.view {
    getResizeShape() {
        const { model } = this.props;
        const { x, y, width, height, radius } = model;
        const style = model.getNodeStyle(),
              properties = model.getProperties();
        style.strokeWidth = Constant.elements[type].style.strokeWidth;
        return h("g", {}, [
            h("rect", {
            ...getShapeStyleFuction(style, properties),
            x: x - width / 2,
            y: y - height / 2,
            rx: radius,
            ry: radius,
            width,
            height,
            }),
        ]);
    }
}

class ResizableRectModel extends RectResize.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.width = Constant.elements[type].style.width;
        this.height = Constant.elements[type].style.height;
    }
    getTextStyle () {
    const style = super.getTextStyle(),
          properties = this.getProperties();
    style.lineHeight = Constant.elements[type].style.lineHeight;
    return getTextStyleFunction(style, properties);
    }
}

export default {
  type,
  model: ResizableRectModel,
  view: ResizableRectView ,
};