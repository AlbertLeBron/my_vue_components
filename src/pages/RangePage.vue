<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">滑块</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap">
            <span>{{reversion ? max : min}}</span>
            <range v-if="hack" v-model="val" :min="min" :max="max" :reversion="reversion" :toFixed="toFixed"></range>
            <span>{{reversion ? min : max}}</span>
          </div>
          <dl>
            <dt>最小值</dt><dd><input class="inputtest" v-model="minFn" type="text" /><i>*不高于当前值{{typeof toFixed != 'undefined' ? '，最多保留' + toFixed + '位小数' : ''}}</i></dd>
            <dt>最大值</dt><dd><input class="inputtest" v-model="maxFn" type="text" /><i>*不低于当前值{{typeof toFixed != 'undefined' ? '，最多保留' + toFixed + '位小数' : ''}}</i></dd>
            <dt>当前值</dt><dd><input class="inputtest" v-model="valFn" type="text" /></dd>   
          </dl>
          <div class="setup">
            <dl>
              <dt><label for="reversion">反向</label></dt><dd><input id="reversion" type="checkbox" :checked="reversion" @click="reversionChange" /></dd>             
            </dl>
            <dl>
              <dt>保留位数</dt>              
              <dd>
                <span><input id="default" type="radio" value="false" v-model="toFixedSwitch" /><label for="default">默认</label></span>
                <span><input id="set" type="radio" value="true" v-model="toFixedSwitch" />
                  <span :class="['childCon', {show: toFixedMode}]"><label for="set">设置</label>
                    <span v-if="toFixedMode" class="fixSet">
                      <span @click="toFixed-1>=0?toFixed--:toFixed;">-</span><input class="toFixed" v-model="toFixed" type="text" readonly /><span @click="toFixed++;">+</span>
                    </span>
                  </span>
                </span>
              </dd>
            </dl>
          </div>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Range from '../components/Range.vue';

@Component({
  components: {
    Range
  }
})
export default class RangePage extends Vue {
  private val!: number;
  private min!: number;
  private max!: number;
  private reversion!: boolean;
  private toFixed!: number | undefined;
  private toFixedMode!: boolean;
  private hack!: boolean;

  data(){
    this.min = 0;
    this.max = 100;
    this.toFixedMode = false;
    this.hack = true;
    return {
      val: this.val,
      min: this.min,
      max: this.max,
      reversion: this.reversion,
      toFixed: this.toFixed,
      toFixedMode: this.toFixedMode,
      hack: this.hack
    }
  }

  mounted(){
    window.addEventListener('resize', this.updateRangeView);
    this.$watch('toFixed', (to: any)=>{
      this.min = this.dotFloor(this.min, to);
      this.max = this.dotCeil(this.max, to);
      this.val = Number(typeof to != 'undefined' ? this.val.toFixed(to) : this.val);
    });
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateRangeView);
  }

  get toFixedSwitch(){
    return JSON.stringify(this.toFixedMode);
  }

  set toFixedSwitch(value: string){
    this.toFixedMode = JSON.parse(value);
    this.toFixed = this.toFixedMode ? 1 : undefined;
  }

  get minFn(){
    return this.min;
  }

  set minFn(value: any){
    if(this.testNumber(value)){
      value = this.dotFloor(value, this.toFixed);
      this.min = Number(value) <= this.val ? Number(value) : this.val;
      this.$forceUpdate();
      this.updateRangeView();
    }
  }

  get maxFn(){
    return this.max;
  }

  set maxFn(value: any){
    if(this.testNumber(value)){
      value = this.dotFloor(value, this.toFixed);
      this.max = Number(value) >= this.val ? Number(value) : this.val;
      this.$forceUpdate();
      this.updateRangeView();
    }
  }

  get valFn(){
    return this.val;
  }

  set valFn(value: any){
    this.val = Number(value);
  }

  public reversionChange(){
    this.reversion = !this.reversion;
  }

  public testNumber(str: any): boolean{
    return /^(-|\+)?\d+(\.\d+)?$/.test(str);
  }

  public dotFloor(num: number, digit: number | undefined){
    let numDigit = num.toString().split('.')[1] ? num.toString().split('.')[1].length : 0;
    return typeof digit != 'undefined' && numDigit > digit ? Math.floor(num*Math.pow(10,digit))/Math.pow(10,digit) : num;
  }

  public dotCeil(num: number, digit: number | undefined){
    let numDigit = num.toString().split('.')[1] ? num.toString().split('.')[1].length : 0;
    return typeof digit != 'undefined' && numDigit > digit ? Math.ceil(num*Math.pow(10,digit))/Math.pow(10,digit) : num;
  }

  public updateRangeView(){
    this.hack = false;
    this.$nextTick(() => {
      this.hack = true;
    });
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>  
  dt{
    width: 70px;
  }
  dd{
    width: calc(100% - 70px);
  }
  dd i{
    padding: 1px 0 0 5px;
    font-size: 13px;
    color: red;
  }
  dt label{
    display: block;
  }
  .setup dl{
    display: inline-block;
    margin: 0;
  }
  .setup dt{
    width: initial;
    padding-right: 5px;
  }
  .setup dd{
    width: initial;
    padding-right: 20px;
  }
  .setup dd > span{
    padding-right: 20px;
  }
  .fixSet span{
    display: inline-block;
    height: 21px;
    width: 21px;
    line-height: 21px;
    background: rgba(0,0,0,.06);
    text-align: center;
    vertical-align: top;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }
  .fixSet span:hover{
    background: rgba(0,0,0,.1);
  }
  .fixSet .toFixed{
    vertical-align: top;
    width: 30px;
    text-align: center;
    border: 1px solid #ccc;
    margin-top: 1px;
  }
  input[type='text']{
    outline: none;
  }
  .range{
    width: 300px;
    display: inline-block;
    vertical-align: middle;
  }
  .demoWrap span{
    display: inline-block;
    font-size: 13px;
    color: rgba(0,0,0,.5);
    vertical-align: middle;
    padding: 0 15px;
  }
  .childCon{
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    height: 27px;
  }
  .childCon.show{
    background: rgba(248, 255, 137, .4);
    border: 1px solid rgba(0, 128, 0, .35);
    padding: 2px 6px;
    box-sizing: border-box;
  }
  .childCon > label{
    padding-right: 10px;
  }
  @media screen and (max-width: 730px){
      .content dd{
          display: inline-flex!important;
      }

      .content dd .inputtest{
          flex: 1;
          width: 0;
          min-width: 0;
      }

      .demoWrap{
        display: flex;
      }

      .range {
        flex: 1;
        width: 0;
        min-width: 0;
      }

      .setup dl{
        display: block;
      }
  }
</style>
