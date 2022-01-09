<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">分段滑块</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap">
            <dot-line v-if="hack" v-model="workLine" :close="close" :graduations="graduations"></dot-line>
          </div>
          <dl class="setup">
            <dd><input id="demo1" type="radio" value="kongfu" v-model="demoSwitch" /><label for="demo1">Demo1（流水线）</label></dd>
            <dd><input id="demo2" type="radio" value="time" v-model="demoSwitch" /><label for="demo2">Demo2（闭合线）</label></dd>
            <dd><button @click="add" :disabled="workLine.length >= graduations.length">添加节点</button><button @click="deleteDot" :disabled="!workLine.length">移除节点</button></dd>
          </dl>
          <div class="resultWrap" title="当前值">
            <perfect-scrollbar ref="scrollbar">
              <div class="resultStyle" v-html="JSON.stringify(workLine).replace(/{/g, '{<br>&nbsp;&nbsp;').replace(/}/g, '<br>}')"></div>
            </perfect-scrollbar>
          </div>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DotLine from '../components/DotLine.vue';

@Component({
  components: {
    DotLine
  }
})
export default class DotLinePage extends Vue {
  private workLine!: any[];
  private graduations!: string[];
  private close!: boolean;
  private demo!: 'kongfu' | 'time';
  private hack!: boolean;
  private names: string[] = ['赵','钱','孙','李','周','吴','郑','王','冯','陈','楚','魏',
                             '蒋','沈','韩','杨','朱','秦','尤','许','何','吕','施','张','孔'];

  data() {
    this.hack = true;
    this.workLine = [];
    this.graduations = [];
    this.close = false;
    return {
      workLine: this.workLine,
      graduations: this.graduations,
      close: this.close,
      hack: this.hack,
      demo: this.demo
    }
  }

  beforeMount() {
    this.demo = 'kongfu';
  }

  mounted() {
    window.addEventListener('resize', this.updateDotLineView);
    this.$watch('workLineLen', () => {
      this.$nextTick(() => {
        this.$emit('updateMainBodyScrollbar');
      });
    });
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.updateDotLineView);
  }

  get workLineLen() {
    return this.workLine ? this.workLine.length : undefined;
  }

  get demoSwitch(){
    this.close = this.demo == 'time';
    this.workLine = [];
    this.graduations = this.demo == 'kongfu' ? 
                       ['小厮', '门徒', '拳师', '游侠', '义士', '豪杰', '大侠', '宗师', '传说', '神话']:
                       Array(12).fill(0).map((p: any, i: number) => (i*2<10 ? ('0'+i*2):i*2)+':00');
    return this.demo;
  }

  set demoSwitch(value: 'kongfu' | 'time'){
    this.demo = value;    
  }

  public add(){
    if(this.demo == 'kongfu'){
      this.addDemo1();
    }else if(this.demo == 'time'){
      this.addDemo2();
    }   
  }

  public addDemo1() {
    let len = this.workLine.length, gLen = this.graduations.length;
    if (len == 0) {
        this.workLine.push({ val: gLen-1, name: this.names[len]});
    } else if (this.workLine[len - 1].val < gLen - 1) {
        this.workLine.push({ val: this.workLine[len - 1].val + 1, name: this.names[len]});
    } else {
        let lastIndex!: number;
        for (let i = len - 1; i >= 0; i--) {
            if ((i > 0 && this.workLine[i].val - this.workLine[i - 1].val > 1) || (i == 0 && this.workLine[i].val > 0)) {
                lastIndex = i;
                break;
            }
        }
        if (typeof lastIndex != 'undefined') {
            for (let i = len - 1; i >= lastIndex; i--) {
                Vue.set(this.workLine[i], 'val', this.workLine[i].val - 1);
            }
            this.workLine.push({ val: this.workLine[len - 1].val + 1, name: this.names[len]});
        }
    }
  }

  public addDemo2() {
    let len = this.workLine.length, gLen = this.graduations.length;
    if (len == 0) {
        this.workLine.push({ val: gLen, name: this.names[len]});
    } else if (this.workLine[len - 1].val < gLen) {
        this.workLine.push({ val: this.workLine[len - 1].val + 1, name: this.names[len]});
    } else {
        let lastIndex!: number;
        for (let i = len - 1; i >= 0; i--) {
            if ((i > 0 && this.workLine[i].val - this.workLine[i - 1].val > 1) || (i == 0 && this.workLine[i].val > 1)) {
                lastIndex = i;
                break;
            }
        }
        if (typeof lastIndex != 'undefined') {
            for (let i = len - 1; i >= lastIndex; i--) {
                Vue.set(this.workLine[i], 'val', this.workLine[i].val - 1);
            }
            this.workLine.push({ val: this.workLine[len - 1].val + 1, name: this.names[len]});
        }
    }
  }

  public deleteDot() {
      if (!!this.workLine && this.workLine.length) {
        this.workLine.pop();   
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
  .setup dt{
    width: initial;
    padding-right: 5px;
  }
  .setup dd{
    padding-right: 20px;
  }
</style>
