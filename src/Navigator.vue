<template>
  <div class="navigator">
    <perfect-scrollbar ref="scrollbar">
      <div class="navigatorContent">
        <div class="logo">VueUI</div>
        <p>简单的vue组件</p>
        <ul>
          <li>
            <p>组件库</p>
            <ul>
              <li v-for="item in category" :key="item.path" @click="$emit('openstatechange', false)" :class="{active: item.path == $route.path}"><router-link :to="item.path" >{{item.title}}<span> - {{item.name}}</span></router-link></li>
            </ul>
          </li>
        </ul>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Navigator extends Vue {
  private category!: any[];
  @Prop() private open!: boolean;

  data(){
    this.category = [{path: '/dropdown', title: '下拉框', name: 'Dropdown'},
                     {path: '/combo', title: '可输入下拉框', name: 'Combo'},
                     {path: '/range', title: '滑块', name: 'Range'},
                     {path: '/dotLine', title: '分段滑块', name: 'DotLine'},
                     {path: '/selectionbox', title: '选择框', name: 'SelectionBox'}];
    return {
      category: this.category
    }
  }

  mounted() {
    window.addEventListener('resize', this.updateScrollbar);
  }

  beforeDestroy(){
    window.removeEventListener('resize', this.updateScrollbar);
  }

  public updateScrollbar(): void {
    (this.$refs.scrollbar as any).update();
  }
}
</script>

<style scoped>
  .navigatorContent{
    padding: 30px 10px;
  }

  .logo{
    height: 80px;
    line-height: 80px;
    width: 80px;
    text-align: center;
    border-radius: 50%;
    color: rgba(78, 110, 242, .8);
    box-shadow: 0 0 0 4px rgba(78, 110, 242, .8);
    margin: 0 auto;
  }

  .logo+p{
    text-align: center;
    font-size: 13px;
  }

  ul{
    margin: 0 0 0 15px;
    padding: 0;
    list-style: none;
    font-size: 13px;
  }

  ul li {
    margin: 10px 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  ul li p {
    font-weight: 800;
  }

  ul li li.active a{
    color: #42b983;
  }
</style>
