<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">下拉框</h3>
          <h4 class="nav_about">Demo案例</h4>
          <dropdown :options="list" :placeholder="placeholder"></dropdown>
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
  .select{
    width: 100%;
    max-width: 400px;
  }
</style>
