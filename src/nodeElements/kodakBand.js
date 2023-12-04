import { HtmlResize } from "@logicflow/extension";
import { getShapeStyleFuction, getTextStyleFunction } from '../utilities/getShapeStyleUtil';
import Constant from '../utilities/Constant';

const type = 'resizable-kodak';

class ResizableHtmlModel extends HtmlResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = Constant.elements[type].style.width;
    this.height = Constant.elements[type].style.height;
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
class ResizableHtmlView extends HtmlResize.view {
  setHtml(rootEl) {
    rootEl.innerHTML = "";
    const container = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    container.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    container.setAttribute('class', 'icon');
    container.setAttribute('aria-hidden', 'true');
    container.setAttribute('fill', 'currentColor');
    container.setAttribute('width', '100%');
    container.setAttribute('height', '100%');

    const use = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
    );
    use.setAttribute('href', '#icon-shape-kodak');
    container.appendChild(use);

    rootEl.appendChild(container);
  }
}

export default {
  type,
  view: ResizableHtmlView,
  model: ResizableHtmlModel
};
