import { EllipseResize } from "@logicflow/extension";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'resizable-circle';

class ResizableCircleModel extends EllipseResize.model {
  // setAttributes() {
  //   this.text.editable = false;
  // }
  getNodeStyle() {
    const style = super.getNodeStyle(),
          properties = this.getProperties();
    style.strokeWidth = Constant.elements[type].style.strokeWidth;
    return getShapeStyleFuction(style, properties);
  }

  getTextStyle () {
    const style = super.getTextStyle(),
          properties = this.getProperties();
    style.lineHeight = Constant.elements[type].style.lineHeight;
    return getTextStyleFunction(style, properties);
  }

  initNodeData(data) {
    super.initNodeData(data);
    this.rx = Constant.elements[type].style.rx;
    this.ry = Constant.elements[type].style.ry;
  }
}
class ResizableCircleView extends EllipseResize.view {}

export default {
  type,
  view: ResizableCircleView,
  model: ResizableCircleModel
};
