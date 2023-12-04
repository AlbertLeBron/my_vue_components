import { BezierEdge, BezierEdgeModel } from "@logicflow/core";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'bezier';

class BezierModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle(),
          properties = this.getProperties();
    style.strokeWidth = Constant.elements[type].style.strokeWidth;
    return getShapeStyleFuction(style, properties);
  }
  getTextStyle() {
    const style = super.getTextStyle(),
          properties = this.getProperties();
    style.lineHeight = Constant.elements[type].style.lineHeight;
    return getTextStyleFunction(style, properties);
  }
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}

class BezierCustomEdge extends BezierEdge {
  getEndArrow() {
    return ;
  }
}

export default {
  type,
  view: BezierCustomEdge,
  model: BezierModel
};