import { BezierEdge, BezierEdgeModel } from "@logicflow/core";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'sequence';

class SequenceModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle(),
          properties = this.getProperties();
    style.strokeWidth = Constant.elements[type].style.strokeWidth;
    return getShapeStyleFuction(style, properties);
  }
  getTextStyle() {
    const style = super.getTextStyle(),
          properties = this.getProperties();
    style.color = "#fff";
    style.fontSize = 12;
    style.background.radius = 4;
    style.background.fill = "#000";
    style.lineHeight = Constant.elements[type].style.lineHeight;
    return getTextStyleFunction(style, properties);
  }
}

export default {
  type,
  view: BezierEdge,
  model: SequenceModel
};