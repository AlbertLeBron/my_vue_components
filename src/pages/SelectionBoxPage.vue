<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">穿梭框</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap">
            <selection-box v-model="val"
              :originalListName="originalListName"
              :currentListName="currentListName"
              :originalList="originalList"
              :name="'name'">
            </selection-box>
          </div>
          <div class="resultWrap" title="当前值">
            <perfect-scrollbar ref="scrollbar">
              <div class="resultStyle" v-html="JSON.stringify(val).replace(/{/g, '{<br>&nbsp;&nbsp;').replace(/}/g, '<br>}')"></div>
            </perfect-scrollbar>
          </div>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SelectionBox from '../components/SelectionBox.vue';

@Component({
  components: {
    SelectionBox
  }
})
export default class SelectionBoxPage extends Vue {
  private val!: any[];
  private originalListName!: string;
  private currentListName!: string;
  private originalList!: any[];

  data() {
    this.val = [];
    this.originalList = [{id: 0, name: '三国演义'},
                         {id: 1, name: '西游记'},
                         {id: 2, name: '射雕英雄传'},
                         {id: 3, name: '四大名捕'},
                         {id: 4, name: '男生贾里全传'},
                         {id: 5, name: '霹雳贝贝'},
                         {id: 6, name: '欧亨利短篇小说集'},
                         {id: 7, name: '格林童话'},
                         {id: 8, name: '鲁宾逊漂流记'}];
    this.originalListName = '心愿清单';
    this.currentListName = '购物车';
    return{
      val: this.val,
      originalListName: this.originalListName,
      currentListName: this.currentListName,
      originalList: this.originalList
    }
  }

  mounted() {
    this.$watch('val', () => {
      this.$nextTick(() => {
        this.$emit('updateMainBodyScrollbar');
      });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
