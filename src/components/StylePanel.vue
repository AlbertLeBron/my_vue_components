<template>
  <div class="stylePanel">
    <object type="text/html" class="resizingObject" ref="resizingObject" data="about:blank" @load="resizeScrollbar($refs, 'resizingObject', 'scrollbar', updateDropdownSize);" />
    <perfect-scrollbar ref="scrollbar">
      <div class="sec-outer-wrap">
        <!-- <section>
          <div class="style-sec-wrap">
            <h5>Border</h5>
            <div>
              <dl>
                <dt>Width</dt>
                <dd><div class="inputWrap"><input type="text" v-model="styles.borderWidth" @input="setStyle({borderWidth: styles.borderWidth})"></div></dd>
                <span>px</span>
              </dl>
              <dl>
                <dt>Style</dt>
                <dd><vue-dropdown ref="borderStyleTarget" v-model="styles.borderStyle" :datas="borderStyles" :afterClick="(borderStyle) => { setStyle({borderStyle}) }" /></dd>
              </dl>
              <dl>
                <dt>Color</dt>
                <dd>
                  <div ref="borderColorWrap">
                    <span class="colorOpener" ref="borderColorTarget" :style="{backgroundColor: styles.borderColor}" @click="openColor('borderColor')"></span>
                    <div class="sketch-picker-wrap">
                      <sketch-picker v-if="borderColorOpen" ref="borderColorDom" class="sketch-picker" :value="styles.borderColor" @input="(c) => { setStyle({borderColor: `rgba(${c.rgba.r},${c.rgba.g},${c.rgba.b},${c.rgba.a})`}) }" />
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <section>
          <div class="style-sec-wrap">
            <h5>Fill</h5>
            <div>
              <dl>
                <dt>Color</dt>
                <dd>
                  <div ref="backgroundColorWrap">
                    <span class="colorOpener" ref="backgroundColorTarget" :style="{backgroundColor: styles.backgroundColor}" @click="openColor('backgroundColor')"></span>
                    <div class="sketch-picker-wrap">
                      <sketch-picker v-if="backgroundColorOpen" ref="backgroundColorDom" class="sketch-picker" :value="styles.backgroundColor" @input="(c) => { setStyle({backgroundColor: `rgba(${c.rgba.r},${c.rgba.g},${c.rgba.b},${c.rgba.a})`}) }" />
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </section> -->
        <section>
          <div class="style-sec-wrap">
            <h5>Text</h5>
            <div>
              <!-- <dl>
                <dt>Size</dt>
                <dd><div class="inputWrap"><input type="text" v-model="styles.fontSize" @input="setStyle({fontSize: styles.fontSize})"></div></dd>
                <span>px</span>
              </dl> -->
              <dl>
                <dt>Family</dt>
                <dd><vue-dropdown ref="fontFamilyTarget" v-model="styles.fontFamily" :datas="fontFamilies" :valKey="'value'" :nameKey="'name'" :afterClick="(option) => { setStyle({fontFamily: option.value}) }" /></dd>
              </dl>
              <dl>
                <dt>Color</dt>
                <dd>
                  <div ref="fontColorWrap">
                    <span class="colorOpener" ref="fontColorTarget" :style="{backgroundColor: styles.fontColor}" @click="openColor('fontColor')"></span>
                    <div class="sketch-picker-wrap">
                      <sketch-picker v-if="fontColorOpen" ref="fontColorDom" class="sketch-picker" :value="styles.fontColor" @input="(c) => { setStyle({fontColor: `rgba(${c.rgba.r},${c.rgba.g},${c.rgba.b},${c.rgba.a})`}) }" />
                    </div>
                  </div>
                </dd>
              </dl>
              <dl>
                <dt>Style</dt>
                <dd>
                  <div class="styleOperatorsWrap">
                    <span class="bold" :selected="styles.fontWeight === 'bold'" @click="() => { setStyle({fontWeight: styles.fontWeight !== 'bold' ? 'bold' : 'normal'}) }">B</span>
                    <span class="underline" :selected="styles.textDecoration === 'underline'" @click="() => { setStyle({textDecoration: styles.textDecoration !== 'underline' ? 'underline' : 'none'}) }">U</span>
                    <span class="italic" :selected="styles.fontStyle === 'italic'" @click="() => { setStyle({fontStyle: styles.fontStyle !== 'italic' ? 'italic' : 'normal'}) }">/</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <section v-if="styles.anchorText && styles.anchorText.length">
          <div class="style-sec-wrap">
            <h5>AnchorText</h5>
            <div>
              <!-- <dl>
                <dt>Size</dt>
                <dd><div class="inputWrap"><input type="text" v-model="styles.fontSize" @input="setStyle({fontSize: styles.fontSize})"></div></dd>
                <span>px</span>
              </dl> -->
              <dl v-for="(item, index) in styles.anchorText" :key="'anchorText_'+index">
                <dt>{{'text ' + (index + 1)}}</dt>
                <dd><div class="inputWrap"><input type="text" v-model="styles.anchorText[index]" @input="setStyle({anchorText: styles.anchorText})"></div></dd>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { throttle, setFixedPosition } from '../utilities/Helper';

@Component
export default class StylePanel extends Vue {
  @Prop() private elementsStyle!: any;
  private stylesData!: any;
  private borderStyles!: any[];
  private borderColorOpen!: boolean;
  private backgroundColorOpen!: boolean;
  private fontColorOpen!: boolean;
  private fontFamilies!: any[];
  private throttleFn = throttle(() => {
      this.updateFixedDomPos();
  }, 100, this);

  data() {
    this.stylesData = {
        backgroundColor: '',
        borderType: '',
        borderColor: '',
        borderWidth: '',
        borderStyle: '',
        fontSize: '',
        fontColor: '',
        fontWeight: '',
        fontFamily: '',
        lineHeight: '',
        textAlign: '',
        textDecoration: '',
        fontStyle: '',
        anchorText: []
      };
    
    this.borderStyles = [
      'solid',
      'dashed',
      'dotted'
    ];

    this.fontFamilies = [
      {value: 'initial', name: '-- initial --'},
      {value: 'Arial', name: 'Arial'},
      {value: 'Verdana', name: 'Verdana'},
      {value: 'Georgia', name: 'Georgia'},
      {value: 'Times New Roman', name: 'Times New Roman'}
    ];

    return {
      stylesData: this.stylesData,
      borderStyles: this.borderStyles,
      borderColorOpen: this.borderColorOpen,
      backgroundColorOpen: this.backgroundColorOpen,
      fontColorOpen: this.fontColorOpen,
      fontFamilies: this.fontFamilies,
      resizeScrollbar: (window as any).resizeScrollbar
    }
  }

  get styles() {
    for(var key in this.stylesData) {
      this.stylesData[key] = this.elementsStyle[key];
      if((key === 'borderColor' || key === 'backgroundColor' || key === 'fontColor') && !this.stylesData[key])
        this.stylesData[key] = '#fff';
    }

    return this.stylesData;
  }

  mounted() {
    document.addEventListener('mouseup', this.closeColor);
    window.addEventListener('resize', this.throttleFn);
    window.addEventListener('scroll', this.throttleFn);
    (this.$refs.scrollbar as any).$el.addEventListener('ps-scroll-y', this.throttleFn);
    this.updateDropdownSize();
  }

  beforeDestroy(){
    document.removeEventListener('mouseup', this.closeColor);
    window.removeEventListener('resize', this.throttleFn);
    window.removeEventListener('scroll', this.throttleFn);
    (this.$refs.scrollbar as any).$el.removeEventListener('ps-scroll-y', this.throttleFn);
  }

  setStyle (item: any) {
    this.$emit('setStyle', item);
  }

  openColor(type: string) {
    switch(type) {
      case 'borderColor':
        this.borderColorOpen = true;
        break;
      case 'backgroundColor':
        this.backgroundColorOpen = true;
        break;
      case 'fontColor':
        this.fontColorOpen = true
        break;
      default:
        break;
    }
    this.$nextTick(() => {
      this.updateFixedDomPos();
    });
  }

  closeColor(event: any) {
    // if (!(this.$refs.borderColorWrap as HTMLElement).contains(event.target)) {
    //   this.borderColorOpen = false;
    // }
    // if (!(this.$refs.backgroundColorWrap as HTMLElement).contains(event.target)) {
    //   this.backgroundColorOpen = false;
    // }
    if (!(this.$refs.fontColorWrap as HTMLElement).contains(event.target)) {
      this.fontColorOpen = false;
    }
  }

  updateFixedDomPos() {
    // let borderColorTarget = this.$refs.borderColorTarget as HTMLElement,
    //     borderColorDom = (this.$refs.borderColorDom as any)?.$el,
    //     backgroundColorTarget = this.$refs.backgroundColorTarget as HTMLElement,
    //     backgroundColorDom = (this.$refs.backgroundColorDom as any)?.$el,
    let fontColorTarget = this.$refs.fontColorTarget as HTMLElement,
        fontColorDom = (this.$refs.fontColorDom as any)?.$el,
        
        // borderStyleTarget = (this.$refs.borderStyleTarget as any).$el,
        // borderStyleDom = borderStyleTarget.getElementsByClassName('dropdown-container')[0],
        fontFamilyTarget = (this.$refs.fontFamilyTarget as any).$el,
        fontFamilyDom = fontFamilyTarget.getElementsByClassName('dropdown-container')[0];

    // if(borderColorDom)
    //   this.setVueColorPos(borderColorTarget, borderColorDom, {x: 'right', y: 'bottom'});
    // if(backgroundColorDom)
    //   this.setVueColorPos(backgroundColorTarget, backgroundColorDom, {x: 'right', y: 'bottom'});
    if(fontColorDom)
      this.setVueColorPos(fontColorTarget, fontColorDom, {x: 'right', y: 'bottom'});
    // if(borderStyleDom) 
    //   this.setVueColorPos(borderStyleTarget, borderStyleDom, {x: 'left', y: 'bottom'});
    if(fontFamilyDom) 
      this.setVueColorPos(fontFamilyTarget, fontFamilyDom, {x: 'left', y: 'bottom'});
  }

  updateDropdownSize() {
    // let borderStyleTarget = (this.$refs.borderStyleTarget as any).$el,
    //     borderStyleDom = borderStyleTarget.getElementsByClassName('dropdown-container')[0],
    let fontFamilyTarget = (this.$refs.fontFamilyTarget as any).$el,
        fontFamilyDom = fontFamilyTarget.getElementsByClassName('dropdown-container')[0]

    // borderStyleDom.style.width = borderStyleTarget.getBoundingClientRect().width + 'px';
    fontFamilyDom.style.width = fontFamilyTarget.getBoundingClientRect().width + 'px';
  }

  public setVueColorPos(target: any, dom: any, direction: any) {
      let rect = target?.getBoundingClientRect();
      setFixedPosition(dom, { clientX: rect ? rect.left : 0 , clientY: rect ? rect.top : 0 } as MouseEvent, target, direction);
  }

}
</script>

<style lang="less" scoped>
  .stylePanel {
    width: 250px;
    padding: 10px 0;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    position: relative;
  }

  .ps {
    height: 100%;
  }

  .sec-outer-wrap {
    padding: 0 10px;
  }

  .style-sec-wrap > h5 {
    padding: 6px 0 2px;
    margin: 0 0 3px;
    color: #8b8c8f;
    box-shadow: inset 0 -1px 0 0 rgba(0,0,0,.1);
  }

  dl {
    display: flex;
    align-items: center;
  }

  dt {
    width: 50px;
    text-align: right;
    word-break: break-word;
  }

  dd {
    margin: 0;
    flex: 1;
    width: 0;
    min-width: 0;
  }

  dl > *:nth-child(n+2) {
    margin-left: 10px;
  }

  .colorOpener {
    display: inline-block;
    width: 100%;
    height: 30px;
    border: 1px solid #aaa;
    vertical-align: top;
  }

  .sketch-picker-wrap {
    position: relative;
  }
  .sketch-picker {
    position: fixed;
    margin-top: 5px;
    z-index: 1;
    transition: all .3s;
    -webkit-transition: all .2s;
  }

  .styleOperatorsWrap {
    display: flex;
  }

  .styleOperatorsWrap > span {
    height: 30px;
    flex: 1;
    width: 0;
    min-width: 0;
    border: 1px solid #dcdfe6;
    border-right: none;
    vertical-align: top;
    line-height: 30px;
    text-align: center;
  }

  .styleOperatorsWrap > span[selected] {
      background: rgba(0, 0, 0, 0.2);
    }

  .styleOperatorsWrap > span:not([selected]):hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .styleOperatorsWrap > span:first-child {
    border-radius: 4px 0 0 4px;
  }
  .styleOperatorsWrap > span:last-child {
    border-right: 1px solid #dcdfe6;
    border-radius: 0 4px 4px 0;
  }
  
  /deep/ .dropdown-ui > .dropdown-container {
    position: fixed;
    transition: all .3s;
    -webkit-transition: all .2s;
  }
</style>
