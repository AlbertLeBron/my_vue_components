<template>
  <div id="app">
    <Navigator :class="{open: open}" @openstatechange="openStateChange" />
    <MainBody :open="open" @openstatechange="openStateChange" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navigator from './Navigator.vue';
import MainBody from './MainBody.vue';

@Component({
  components: {
    Navigator,
    MainBody
  },
})
export default class App extends Vue {
  private open!: boolean;

  data(){
    return {
      open : this.open
    }
  }

  public openStateChange(state: boolean){
    this.open = state;
  }
}
</script>

<style>
  html, body{
      height: 100%;
      margin: 0;
  }
</style>
<style scoped lang="less">
    #app{
      height: 100%;
      display:  flex;
    }

    .navigator{
      width: 300px;
      border-right: 1px solid rgba(0,0,0,.07);
    }

    .mainBody{
      flex: 1;
      width: 0;
      min-width: 0;
    }

    ul li li:hover{
      text-decoration: underline;
    }

    ul li li a.active{
      color: #42b983;
    }

    /deep/ .ps{
      height: 100%;
    }

    @media screen and (max-width: 960px) {
      .navigator{
        width: 80px;
      }
      .navigator /deep/ .logo{
        height: 50px;
        line-height: 50px;
        width: 50px;
        +p{
          padding: 0 10px;
        }
      }
      .navigator /deep/ ul{
        margin: 0;
        li{
          p{
            display: none;
          }
          ul{
            li{
              margin: 0;
              a{
                display: block;
                padding: 6px 10px;
                span{
                  display: none;
                }
              }
            }
          }
        }
      }
      .navigator /deep/ .navigatorContent{
        padding: 30px 0;
      }
    }

    @media screen and (max-width: 730px){
      #app{
        display: block;
      }
      .navigator{
        width: 100%;
        height: 100%;
        position: fixed;
        box-shadow: 1px 0 10px rgba(0,0,0,.3);
        background: rgba(255, 255, 255, .9);
        z-index: 99;
        left: -100%;
        opacity: 0;
        transition: all .3s;
        -webkit-transition: all .3s;
      }
      .navigator.open{
        transform: translateX(100%);
        -webkit-transform: translateX(100%);
        opacity: 1;
      }    
      .navigator /deep/ ul li ul li a{
        text-align: center;
      }
      .mainBody{
        width: initial;
        min-width: initial;
        height: 100%;
        box-sizing: border-box;
         /deep/ .content{
           padding: 20px;
         }
         /deep/ .menuWrap{
          display: block;
        }
      }
    }
</style>
