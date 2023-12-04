<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">弹出菜单</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div class="demoWrap" @contextmenu.stop.prevent="$refs.popupmenu_areas.showPopupMenu($event, datas);">
            <span class="f_l">
                <button @click="$refs.popupmenu_left.showPopupMenu($event, datasCopy_left);" @contextmenu.stop.prevent="$refs.popupmenu_left.showPopupMenu($event, datasCopy_left);">单击/右击显示菜单</button>
                <popup-menu ref="popupmenu_left" :useMode="'pinned'"></popup-menu>
            </span>
            <span class="f_r" @click="$refs.popupmenu_right.showPopupMenu($event, deepCopy(datasCopy_right));" @mouseenter="$refs.popupmenu_right.showPopupMenu($event, deepCopy(datasCopy_right));" @mouseleave="leaveHidePopupMenu" @contextmenu.stop.prevent="">
                <button>移入显示菜单</button>
                <popup-menu ref="popupmenu_right" :useMode="'pinned'"></popup-menu>
            </span>
            <popup-menu ref="popupmenu_areas"></popup-menu>
          </div>
        </section>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PopupMenu from '../components/PopupMenu.vue';

@Component({
  components: {
    PopupMenu
  }
})
export default class PopupMenuPage extends Vue {
  private datas!: any;
  private datasCopy_left!: any;
  private datasCopy_right!: any;

  data(){
    this.datas = {items: [
                    {
                      title: '狗',
                      icon: 'iconfont icon-dog',
                      subMenuItems: [
                          {
                              title: '中华田园犬',
                              selectedCallback: () => {}
                          },
                          {
                              title: '边牧',
                              selectedCallback: () => {}
                          },
                          {
                              title: '德牧',
                              subMenuItems: [
                                  {
                                      title: '领养',
                                      selectedCallback: () => {}
                                  },
                                  {
                                      title: '投喂',
                                      selectedCallback: () => {}
                                  }
                              ]
                          },
                          {
                              title: '金毛',
                              selectedCallback: () => {}
                          },
                          {
                              title: '泰迪',
                              selectedCallback: () => {}
                          },
                          {
                              title: '阿拉斯加',
                              selectedCallback: () => {}
                          },
                          {
                              title: '萨摩耶',
                              selectedCallback: () => {}
                          },
                          {
                              title: '哈士奇',
                              selectedCallback: () => {}
                          },
                          {
                              title: '柴犬',
                              selectedCallback: () => {}
                          },
                          {
                              title: '柯基',
                              selectedCallback: () => {}
                          }
                      ]
                  },
                  {
                      title: '熊',
                      icon: 'iconfont icon-bear',
                      callback: (fn: Function, item: any) => {
                        console.log('异步加载函数 callback 可选参数:', item);
                        setTimeout(() => {
                          let testData = [
                                  {
                                      title: '上古神兽 —— 蚩尤坐骑 —— 食铁兽 —— 易危国宝 —— 萌萌的 —— 大熊猫',
                                      selectedCallback: () => {}
                                  }
                              ]
                          fn(testData);
                        }, 1000);
                      }
                  },
                  {
                      title: '鸟',
                      icon: 'iconfont icon-bird',
                      disabled: true,
                      selectedCallback: () => {}
                  },
                  {
                      title: '猫',
                      icon: 'iconfont icon-cat',
                      subMenuItems: [
                          {
                              title: '狸花猫',
                              selectedCallback: () => {}
                          },
                          {
                              title: '大橘',
                              selectedCallback: () => {}
                          },
                          {
                              title: '英短',
                              selectedCallback: () => {}
                          },
                          {
                              title: '蓝猫',
                              selectedCallback: () => {}
                          },
                          {
                              title: '金渐层',
                              selectedCallback: () => {}
                          }
                      ]
                  },
                  {
                      title: '其它',
                      icon: 'iconfont icon-rabbit',
                      callback: (fn: Function, item: any) => {
                        console.log('异步加载函数 callback 可选参数:', item);
                        setTimeout(() => {
                          let testData = [
                                            {
                                                title: '龙猫',
                                                subMenuItems: [
                                                    {
                                                        title: '喂草',
                                                        selectedCallback: () => {}
                                                    },
                                                    {
                                                        title: '玩耍',
                                                        selectedCallback: () => {}
                                                    }
                                                ]
                                            },
                                            {
                                                title: '小白兔',
                                                selectedCallback: () => {}
                                            },
                                            {
                                                title: '小松鼠',
                                                selectedCallback: () => {}
                                            }
                                        ]
                          fn(testData);
                        }, 1000);
                      }
                  }
              ]};
    this.datasCopy_left = this.deepCopy(this.datas);
    this.datasCopy_right = this.deepCopy(this.datas);
    return {
      datas: this.datas,
      datasCopy_left: this.datasCopy_left,
      datasCopy_right: this.datasCopy_right
    }
  }

  public leaveHidePopupMenu(event: MouseEvent) {
      let popupmenu_right = this.$refs.popupmenu_right as any
      if(!popupmenu_right.$el.contains(event.relatedTarget))
        popupmenu_right.hidePopupMenu();
  }

  public getElementType(element: any) {
    return Object.prototype.toString.call(element).slice(8, -1);
  }

  public deepCopy(element: any) {
    let type = this.getElementType(element);
    let result!: any;
    if (type === 'Object') {
        result = {};
    } else if (type === 'Array') {
        result = [];
    } else {
        result = element;
    }

    for (let i in element) {
        let value = element[i];
        let valueType = this.getElementType(value);
        if (valueType === 'Object' || valueType === 'Array') {
            result[i] = this.deepCopy(value);
        } else {
            result[i] = value;
        }
    }
    return result;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .demoWrap{
        box-shadow: inset 1px 1px 0 0 #ddd, inset -1px -1px 0 0 #ddd;
        height: 100px;
        background: #eee;
        padding: 5px;
        position: relative;
    }

    .demoWrap:before{
        content: '任意右击区域';
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        color: #aaa;
        font-style: italic;
        pointer-events: none;
    }

    .f_l{
        float: left;
    }

    .f_r{
        float: right;
    }

    .popupMenuBox >>> .icon{
        color: #5465cf;
    }
</style>
