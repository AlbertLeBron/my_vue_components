<template>
  <div class="mainBody">
    <em class="menuWrap" @click="toggle"><i :class="['menu', {open: open}]"><span></span></i></em>
    <perfect-scrollbar ref="scrollbar">
      <router-view @updateMainBodyScrollbar="updateScrollbar"></router-view>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MainBody extends Vue {
  @Prop() private msg!: string;
  @Prop() private open!: boolean;

  mounted() {
    window.addEventListener('resize', this.updateScrollbar);
  }

  beforeDestroy(){
    window.removeEventListener('resize', this.updateScrollbar);
  }

  public updateScrollbar(): void {
    (this.$refs.scrollbar as any).update();
  }

  public toggle(){
    this.$emit('openstatechange', !this.open);
  }
}
</script>

<style lang="less" scoped>
  /deep/ .content{
    min-height: 100%;
    overflow-x: hidden;
    padding: 20px 50px;
    box-sizing: border-box;
    .nav_start{
      font-size: 25px;
    }
    
    .nav_about{
      padding: 20px 0 10px 0;
      margin-bottom: 10px;
      border-bottom: dashed 1px rgba(0,0,0,.07);
      &::before {
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border: solid rgba(0,0,0,.3);
          border-width: 2px 0 0 2px;
          transform: rotate(135deg);
          margin-right: 10px;
      }
    }

    dl + dl{
      padding-top: 5px;
    }
    dd, dt{
      display:  inline-block;
    }
    dd{
      margin: 0;
      padding-bottom: 5px;
    }
    .resultWrap{
      background: #eee;
      padding: 30px 20px 5px;
      position: relative;
      border: 1px solid #ddd;
    }
    .resultWrap > div{
      padding: 10px 0;
      box-sizing: border-box;
      .resultStyle{
        white-space: nowrap;
      }
    }
    .resultWrap::before{
      content: attr(title);
      font-size: 15px;
      position: absolute;
      display: inline-block;
      padding: 5px 10px;
      top: 0;
      left: 0;
      background: #fafafa;
      color: #8e8e8e;
    }    
  }
  .menuWrap{
    position: fixed;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    transition: all .2s;
    text-align: center;
    display: none;
    z-index: 100;
    border-radius: 4px;
    cursor: pointer;
    background: rgba(255,255,255,.9);
  }
  .menu{
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }

  .menu span{
    transition: opacity .3s;
    -webkit-transition: opacity .3s;
  }

  .menu.open span{
    opacity: 0;
  }

  .menu::before{
    transform-origin: 10% 190%;
    -webkit-transform-origin: 10% 190%;
  }

  .menu.open::before{
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);   
  }

  .menu::after{
    transform-origin: 10% -60%;
    -webkit-transform-origin: 10% -60%;
  }

  .menu.open::after{
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .menu::after, .menu::before {
    content: ' ';
    transition: transform .3s;
    -webkit-transition: -webkit-transform .3s;
  }

  .menu span, .menu::before, .menu::after {
    height: 3px;
    width: 24px;
    display: block;
    background-color: #42b983;
    transform: rotate(0);
    border: none;
    position: static;
  }

  .menu span, .menu::after {
    margin-top: 5px;
  }

  .ps > div {
    height: 100%;
  } 
</style>
