<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">可输入下拉框</h3>
          <h4 class="nav_about">Demo案例</h4>
          <combo :options="list" :placeholder="placeholder"></combo>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Combo from '../components/Combo.vue';

@Component({
  components: {
    Combo
  }
})
export default class ComboPage extends Vue {
  private list!: any[];
  private placeholder!: string;

  data(){
    this.list = ['边牧', '德牧', '金毛', '泰迪'];
    this.placeholder = '<请选择小动物>';
    return {
      list: this.list,
      placeholder: this.placeholder
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
