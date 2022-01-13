<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">下拉框</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap">
            <dropdown v-if="hack" v-model="mypet" :datas="datas" :valKey="valKey" :nameKey="nameKey" :placeholder="placeholder" :showTitle="showTitle" :multiMode="multiMode" :multiNameMode="multiNameMode" :filterMode="filterMode" :openFlexible="openFlexible"></dropdown>
          </div>
          <dl class="setup">
            <div>
              <dt>控件模式</dt>
              <dd><input id="selectMode" type="radio" value="false" v-model="filterModeSwitch" /><label for="selectMode">选择框</label></dd>
              <dd><input id="filterMode" type="radio" value="true" v-model="filterModeSwitch" />
                <span :class="['childCon', {show: filterMode}]"><label for="filterMode">输入框</label>
                  <span v-if="filterMode">
                    <span class="nameModeText"> （ 未匹配到选项</span>
                    <span><input id="filterItem" type="radio" value="false" v-model="flexibleSwitch" /><label for="filterItem">过滤</label></span>
                    <span><input id="attachItem" type="radio" value="true" v-model="flexibleSwitch" /><label for="attachItem">添加 ）</label></span>
                  </span>
                </span>
              </dd>
            </div>
            <div>
              <dt>选值模式</dt>
              <dd><input id="single" type="radio" value="false" v-model="patternSwitch" /><label for="single">单选</label></dd>
              <dd><input id="multi" type="radio" value="true" v-model="patternSwitch" />
                <span :class="['childCon', {show: multiMode}]"><label for="multi">多选</label>
                  <span v-if="multiMode">
                    <span class="nameModeText"> （ 显示方式</span>
                    <span><input id="count" type="radio" value="count" v-model="nameModeSwitch" /><label for="count">计数</label></span>
                    <span><input id="string" type="radio" value="string" v-model="nameModeSwitch" /><label for="string">罗列 ）</label></span>
                  </span>
                </span>
              </dd>
            </div>
            <div>
              <dt>悬停文字</dt>
              <dd><input id="closeTooltip" type="radio" value="" v-model="tooltipSwitch" /><label for="closeTooltip">不显示</label></dd><dd><input id="all" type="radio" value="all" v-model="tooltipSwitch" /><label for="all">始终显示</label></dd>
              <dd><input id="ellipsis" type="radio" value="ellipsis" v-model="tooltipSwitch" /><label for="ellipsis">截断显示</label></dd>
            </div>
            <div>
              <dt>加载方式</dt>
              <dd><input id="synchronous" type="radio" value="false" v-model="loadSwitch" /><label for="synchronous">同步</label></dd>
              <dd><input id="asynchronous" type="radio" value="true" v-model="loadSwitch" /><label for="asynchronous">异步</label></dd>
            </div>
            <div :class="['testCon', {show: testValType}]">
              <dt>返回值类型 <button @click="testSwitch">{{testValType ? '关闭测试' : '开始测试' }}</button></dt>
              <div v-if="testValType" class="testWrap">
                <div class="dropdownGroup">
                  <span><small>valKey值：</small><dropdown v-model="valKeySetting" :datas="valKeyList" :nameKey="'name'"></dropdown></span>
                  <span><small>nameKey值：</small><dropdown v-model="nameKeySetting" :datas="nameKeyList" :nameKey="'name'"></dropdown></span>
                </div>
                <div class="resultWrapCon">
                  <div class="resultWrap" title="初始列表">
                    <perfect-scrollbar ref="scrollbarOL">
                      <div class="resultStyle" v-html="typeof datasList != 'undefined' ? JSON.stringify(datasList).replace(/{/g, '{<br>&nbsp;&nbsp;').replace(/}/g, '<br>}'):`<i>${datasList}</i>`"></div>
                    </perfect-scrollbar>                    
                  </div>
                  <big class="arrow"><span>&#10144;</span></big>
                  <div class="resultWrap" title="当前值">
                    <perfect-scrollbar ref="scrollbarRV">
                      <div class="resultStyle" v-html="typeof mypet != 'undefined' ? JSON.stringify(mypet).replace(/{/g, '{<br>&nbsp;&nbsp;').replace(/}/g, '<br>}'):`<i>${mypet}</i>`"></div>
                    </perfect-scrollbar>                    
                  </div>
                </div>
              </div>
            </div>
          </dl>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dropdown from '../components/Dropdown.vue';

@Component({
  components: {
    Dropdown
  }
})
export default class DropdownPage extends Vue {
  private mypet!: string | string[] | undefined;
  private datas!: any[] | Function;
  private datasList!: any[] | undefined;
  private placeholder!: string;
  private multiMode!: boolean;
  private showTitle!: 'all' | 'ellipsis' | undefined;
  private multiNameMode!: 'count' | 'string';
  private asyncMode!: boolean;
  private valKey!: string | undefined;
  private nameKey!: string | undefined;
  private testValType!: boolean;
  private filterMode!: boolean;
  private openFlexible!: boolean;
  private hack!: boolean;
  private valKeyList: any[] = [{name: '-- 无 --'}, {name: 'val', val: 'val'}, {name: 'name', val: 'name'}];
  private nameKeyList: any[] = [{name: '-- 无 --'}, {name: 'val', val: 'val'}, {name: 'name', val: 'name'}];
  private list!: any[];
  private t!: any;

  data(){
    this.hack = true;    
    this.datas = this.datasList = this.list = ['中华田园犬', '边牧', '德牧', '上古神兽 —— 蚩尤坐骑 —— 食铁兽 —— 易危国宝 —— 萌萌的 —— 大熊猫', '金毛', '泰迪', '阿拉斯加', '萨摩耶', '哈士奇', '柴犬',
                                               '柯基', '狸花猫', '大橘', '英短', '蓝猫', '金渐层', '龙猫', '小白兔', '小松鼠'];
    this.placeholder = '<请选择小动物>';
    return {
      mypet: this.mypet,
      datas: this.datas,
      datasList: this.datasList,
      placeholder: this.placeholder,
      multiMode: this.multiMode,
      multiNameMode: this.multiNameMode,
      showTitle: this.showTitle,
      asyncMode: this.asyncMode,
      valKey: this.valKey,
      nameKey: this.nameKey,
      testValType: this.testValType,
      filterMode: this.filterMode,
      openFlexible: this.openFlexible,
      hack: this.hack
    }
  }

  beforeMount() {
    this.multiMode = false;
    this.multiNameMode = 'count';
    this.asyncMode = false;
    this.filterMode = false;
    this.openFlexible = false;
  }

  mounted() {
    window.addEventListener('resize', this.updateResultScrollber);
    this.$watch('testValType', () => {
      this.$nextTick(() => {
        this.$emit('updateMainBodyScrollbar');
      });
    });
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateResultScrollber);
  }

  public updateResultScrollber() {
    if(this.$refs.scrollbarOL) (this.$refs.scrollbarOL as any).update();
    if(this.$refs.scrollbarRV) (this.$refs.scrollbarRV as any).update();
  }

  public testSwitch() {
    this.testValType = !this.testValType;
    this.mypet = undefined;
    if (this.testValType) {
      this.list = [{val: 0, name: '中华田园犬'}, {val: 1, name: '边牧'}, {val: 2, name: 999}, {val: 3, name: true}, 
                   {val: 4, name: {firstName: 'Grey', lastName: 'Little', nikeyName: 'spot'}},
                   {val: 5, name: 'Big Yellow', animal: 'dog', type: '金毛巡回猎犬', age: 3, price: '1000'},
                   {val: 6, name: [1, 2, 3, 4]}];
    } else {
      this.valKey = undefined;
      this.nameKey = undefined;
      this.list = ['中华田园犬', '边牧', '德牧', '上古神兽 —— 蚩尤坐骑 —— 食铁兽 —— 易危国宝 —— 萌萌的 —— 大熊猫', '金毛', '泰迪', '阿拉斯加', '萨摩耶', '哈士奇', '柴犬',
                    '柯基', '狸花猫', '大橘', '英短', '蓝猫', '金渐层', '龙猫', '小白兔', '小松鼠'];     
    }
    this.updateDatas();
    this.updateDotLineView();
  }

  get filterModeSwitch(){
    return JSON.stringify(this.filterMode);
  }

  set filterModeSwitch(value: string){
    this.mypet = undefined;
    this.filterMode = JSON.parse(value);
    this.updateDotLineView();
  }

  get flexibleSwitch(){
    return JSON.stringify(this.openFlexible);
  }

    set flexibleSwitch
        (value: string) {
    this.mypet = undefined;
    this.openFlexible = JSON.parse(value);
    this.updateDotLineView();
  }

  get patternSwitch(){
    return JSON.stringify(this.multiMode);
  }

  set patternSwitch(value: string){
    this.mypet = undefined;
    this.multiMode = JSON.parse(value);
    this.updateDotLineView();
  }

  get tooltipSwitch(){
    return this.showTitle ? this.showTitle : '';
  }

  set tooltipSwitch(value: any){
    this.showTitle = value ? value : undefined;
    this.updateDotLineView();
  }

  get nameModeSwitch(){
    return this.multiNameMode;
  }

  set nameModeSwitch(value: 'count' | 'string'){
    this.multiNameMode = value;
    this.updateDotLineView();
  }

  get loadSwitch(){
    return JSON.stringify(this.asyncMode);
  }

  set loadSwitch(value: string){
    this.mypet = undefined;
    this.asyncMode = JSON.parse(value);
    this.updateDatas();
    this.updateDotLineView();
  }

  get valKeySetting(){
    return this.valKeyList.find((p: any) => p.val == this.valKey);
  }

  set valKeySetting(value: any){
    this.mypet = undefined;
    this.valKey = value.val;    
    this.updateDotLineView();
  }

  get nameKeySetting(){
    return this.nameKeyList.find((p: any) => p.val == this.nameKey);
  }

  set nameKeySetting(value: any){
    this.mypet = undefined;
    this.nameKey = value.val;    
    this.updateDotLineView();
  }
  
  public updateDatas(){
    if (this.t) clearTimeout(this.t);
    if (this.asyncMode) {      
      this.datasList = undefined;
      this.datas = (fn: Function) => {
        this.t = setTimeout(() => {  
          this.datasList = this.list;
          fn(this.datasList);
        }, 1000);
      }
    } else{
      this.datas = this.datasList = this.list;
    }
  }
  
  public updateDotLineView(){
    this.hack = false;
    this.$nextTick(() => {
      this.hack = true;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .dropdown-ui{
    width: 100%;
    max-width: 400px;
  }
  .setup>div{
    padding-bottom: 2px;
  }
  .setup dt{
    width: initial;
    padding-right: 5px;
  }
  .setup dd{
    padding-right: 20px;
  }
  .childCon{
    padding: 2px 0;
    border-radius: 2px;
  }
  .childCon.show,
  .testCon.show{
    background: rgba(248, 255, 137, .4);
    border: 1px solid rgba(0, 128, 0, .35);
    padding: 2px 6px;
  }
  .testCon.show{
    padding: 10px 16px;
  }
  .nameModeText{
    padding-right: 5px;
  }
  .nameModeText + span{
    padding-right: 10px;
  }
  .testWrap{
    padding-top: 10px;
  }
  .dropdownGroup{
    border-top: 1px solid rgba(0, 128, 0, .35);
    padding: 10px 0;
  }
  .dropdownGroup > span{
    display: inline-block;
  }
  .dropdownGroup .dropdown-ui{
    display: inline-block;
    width: 90px;
    vertical-align: top;
    margin-right: 10px;
  }
  .dropdownGroup .dropdown-ui /deep/ > label{
    background: #f2f2f2;
  }
  .dropdownGroup .dropdown-ui:hover /deep/ > label{
    background: #e8e8e8;
  }
  .resultWrapCon{
    display: flex;
    align-items: center;
    font-size: 13px;
  }
  .resultWrapCon > .resultWrap{
    flex: 1;
    width: 0;
    min-width: 0;
    height: 320px;
  }
  .arrow{
    padding: 0 10px;
    font-size: 30px;
  }
  @media screen and (max-width: 730px){
    .content dt, .content dd{
      display: block!important;
    }
    .content dt{
      margin-bottom: 5px;
    }
    .setup>div{
      padding-bottom: 8px;
    }
    .dropdownGroup > span{
      display: block;
      padding-bottom: 5px;
    }
    .dropdownGroup small{
      display: inline-block;
      text-align: right;
      width: 100px;
    }
    .resultWrapCon {
      display: block;
    }
    .resultWrapCon > .resultWrap{
      width: auto;
      height: auto;
    }
    .arrow{
      display: block;
      text-align: center;
    }
    .arrow > span{
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      display: inline-block;
    }
  }
</style>
