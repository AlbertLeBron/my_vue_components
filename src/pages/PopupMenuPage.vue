<template>
  <div>
      <div class="content">
        <section>
          <h3 class="nav_start">弹出菜单</h3>
          <h4 class="nav_about">Demo案例</h4>
          <div>
            <button @click="$refs.popupmenu.showPopupMenu(datas);" @contextmenu.stop.prevent="$refs.popupmenu.showPopupMenu(datas);">显示菜单</button>
            <popup-menu ref="popupmenu"></popup-menu>
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

  data(){
    this.datas = {items: [
                    {
                      id: 'workflow',
                      title: 'Workflow',
                      hasSubMenuItems: true,
                      icon: 'icon-Workflow',
                      subMenuItems: [
                          {
                              id: 'pipe1',
                              title: 'Workflow pipeline1',
                              selectedCallback: () => {
                                  
                              }
                          },
                          {
                              id: 'pipe2',
                              title: 'Workflow pipeline2',
                              selectedCallback: () => {

                              }
                          },
                          {
                              id: 'pipe3',
                              title: 'Workflow pipeline3',
                              hasSubMenuItems: true,
                              subMenuItems: [
                                  {
                                      id: 'test1',
                                      title: 'TEST1',
                                      selectedCallback: () => {

                                      }
                                  },
                                  {
                                      id: 'test2',
                                      title: 'TEST2',
                                      selectedCallback: () => {

                                      }
                                  }
                              ]
                          },
                          {
                              id: 'pipe4',
                              title: 'Workflow pipeline4',
                              selectedCallback: () => {

                              }
                          }
                      ]
                  },
                  {
                      id: 'device',
                      title: 'Device',
                      icon: 'icon-device',
                      hasSubMenuItems: true,
                      subMenuItems: [
                          {
                              id: 'device1',
                              title: 'Device1',
                              selectedCallback: () => {
                                  
                              }
                          },
                          {
                              id: 'device2',
                              title: 'Device2',
                              selectedCallback: () => {

                              }
                          },
                          {
                              id: 'device3',
                              title: 'Device2',
                          }
                      ]
                  },
                  {
                      id: 'ctp',
                      title: 'CTP',
                      icon: 'icon-CTP',
                      disabled: true,
                      selectedCallback: () => {

                      }
                  }
              ]};
    return {
      datas: this.datas
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
