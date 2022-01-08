<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">下拉框</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap">
            <dropdown v-if="hack" v-model="mypet" :datas="list" :placeholder="placeholder" :showTitle="showTitle" :multiMode="multiMode" :multiNameMode="multiNameMode"></dropdown>
          </div>
          <dl class="setup">
            <div>
              <dt>选值模式</dt>
              <dd><input id="single" type="radio" value="false" v-model="patternSwitch" /><label for="single">单选</label></dd>
              <dd><input id="multi" type="radio" value="true" v-model="patternSwitch" />
                <span :class="['multiNameSelection', {show: multiMode}]"><label for="multi">多选</label>
                  <span v-if="multiMode">
                    <span class="nameModeText"> （ 显示方式</span>
                    <span><input id="count" type="radio" value="count" v-model="nameModeSwitch" /><label for="count">计数</label></span>
                    <span><input id="string" type="radio" value="string" v-model="nameModeSwitch" /><label for="string">罗列 ）</label></span>
                  </span>
                </span>
              </dd>
            </div>
            <div><dt>悬停文字</dt><dd><input id="closeTooltip" type="radio" value="" v-model="tooltipSwitch" /><label for="closeTooltip">不显示</label></dd><dd><input id="all" type="radio" value="all" v-model="tooltipSwitch" /><label for="all">始终显示</label></dd>
            <dd><input id="ellipsis" type="radio" value="ellipsis" v-model="tooltipSwitch" /><label for="ellipsis">截断显示</label></dd></div>

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
  private list!: any[];
  private placeholder!: string;
  private multiMode!: boolean;
  private showTitle!: 'all' | 'ellipsis' | undefined;
  private multiNameMode!: 'count' | 'string';
  private hack!: boolean;

  data(){
    this.hack = true;
    this.list = ['中华田园犬', '边牧', '德牧', '上古神兽 —— 蚩尤坐骑 —— 食铁兽 —— 易危国宝 —— 萌萌的 —— 大熊猫', '金毛', '泰迪', '阿拉斯加', '萨摩耶', '哈士奇', '柴犬',
                 '柯基', '狸花猫', '大橘', '英短', '蓝猫', '金渐层', '龙猫', '小白兔', '小松鼠'];
    this.placeholder = '<请选择小动物>';
    return {
      mypet: this.mypet,
      list: this.list,
      placeholder: this.placeholder,
      multiMode: this.multiMode,
      multiNameMode: this.multiNameMode,
      showTitle: this.showTitle,
      hack: this.hack
    }
  }

  beforeMount() {
    this.multiMode = false;
    this.multiNameMode = 'count';
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
  .multiNameSelection{
    padding: 2px 0;
    border-radius: 2px;
  }
  .multiNameSelection.show{
    background: #f8ff89;
    border: 1px solid green;
    padding: 2px 6px;
  }
  .nameModeText{
    padding-right: 5px;
  }
  .nameModeText + span{
    padding-right: 10px;
  }
</style>
