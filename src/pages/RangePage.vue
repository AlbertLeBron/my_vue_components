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
            <dt>最小值</dt><dd><input class="inputtest" v-model="minFn" type="text" /><i>*不高于当前值，最多保留{{toFixed}}位小数</i></dd>
            <dt>最大值</dt><dd><input class="inputtest" v-model="maxFn" type="text" /><i>*不低于当前值，最多保留{{toFixed}}位小数</i></dd>
            <dt>当前值</dt><dd><input class="inputtest" v-model="valFn" type="text" /></dd>   
          </dl>
          <dl class="setup">
            <dt><label for="reversion">反向</label></dt><dd><input id="reversion" type="checkbox" :checked="reversion" @click="reversionChange" /></dd>
            <dt>保留位数</dt><dd><span @click="toFixed-1>=0?toFixed--:toFixed;">-</span><input class="toFixed" v-model="toFixed" type="text" readonly /><span @click="toFixed++;">+</span></dd>
          </dl>
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
  private toFixed!: number;
  private hack!: boolean;

  data(){
    this.min = 0;
    this.max = 100;
    this.toFixed = 1;
    this.hack = true;
    return {
      val: this.val,
      min: this.min,
      max: this.max,
      reversion: this.reversion,
      toFixed: this.toFixed,
      hack: this.hack
    }
  }

  mounted(){
    window.addEventListener('resize', this.updateRangeView);
    this.$watch('toFixed', (to: any)=>{
      this.min = this.dotFloor(this.min, to);
      this.max = this.dotCeil(this.max, to);
      this.val = Number(this.val.toFixed(to));
    });
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateRangeView);
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

  public dotFloor(num: number, digit: number){
    let numDigit = num.toString().split('.')[1] ? num.toString().split('.')[1].length : 0;
    return numDigit > digit ? Math.floor(num*Math.pow(10,digit))/Math.pow(10,digit) : num;
  }

  public dotCeil(num: number, digit: number){
    let numDigit = num.toString().split('.')[1] ? num.toString().split('.')[1].length : 0;
    return numDigit > digit ? Math.ceil(num*Math.pow(10,digit))/Math.pow(10,digit) : num;
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
  .setup dt{
    width: initial;
    padding-right: 5px;
  }
  .setup dd{
    width: initial;
    padding-right: 20px;
  }
  .setup span{
    display: inline-block;
    height: 21px;
    width: 21px;
    line-height: 21px;
    background: rgba(0,0,0,.06);
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }
  .setup span:hover{
    background: rgba(0,0,0,.1);
  }
  .setup .toFixed{
    vertical-align: middle;
    width: 30px;
    text-align: center;
    border: 1px solid #ccc;
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
  }
</style>
