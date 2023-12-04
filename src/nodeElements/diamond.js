import { DiamondResize } from "@logicflow/extension";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'resizable-diamond';

class ResizableDiamondModel extends DiamondResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = Constant.elements[type].style.rx;
    this.ry = Constant.elements[type].style.ry;
    this.text.draggable = true;
  }
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
}
class ResizableDiamondView extends DiamondResize.view {}

export default {
  type,
  view: ResizableDiamondView,
  model: ResizableDiamondModel
};
