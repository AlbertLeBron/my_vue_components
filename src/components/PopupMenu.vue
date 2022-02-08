<template>
    <div class="popupMenuBox" ref="popupMenuBox">
        <div v-for="(item, index) in contextMenuBox" :key="'pm_'+index" v-show="item.showContextMenu" ref="contextMenu" class="popup-menu hide" :level="index" :style="computedStyle(item)" @mouseleave="dropLeave($event, index)" @click="$event.stopPropagation();$event.preventDefault();" @contextmenu="$event.stopPropagation();$event.preventDefault();">
            <ul v-if="item.contextMenuData && item.contextMenuData.items && item.contextMenuData.items.length">
                <perfect-scrollbar ref="scrollbar">
                    <div>
                        <li v-for="(subItem, subIndex) in item.contextMenuData.items" :key="'li_'+subIndex"
                            :class="{ seperator: subItem.isSeperator, disabled: subItem.disabled, hovered: subItem.hovered }"
                            @click="itemSelected(subItem)"
                            @mouseenter="itemEnter($event,subIndex,subItem,index)"
                            @mouseleave="itemLeave($event,subIndex,subItem,index)">
                            <span v-if="!subItem.isSeperator" :class="['iconfont', subItem.icon]"></span>
                            <span :class="[!subItem.disabled && subItem.red? 'error': '', 'text']">{{subItem.title}}</span>
                            <i v-if="subItem.hasSubMenuItems" class="icon-Chevron_r"></i>
                        </li>
                    </div>
                </perfect-scrollbar>
            </ul>
            <ul v-else-if="item.contextMenuData && item.contextMenuData.callback">
                <div class="loading">
                    <div class="loading-circle">
                        <div v-for="(item, index) in Array(9).fill(0)" :key="'sp_'+(item+index)"></div>
                    </div>
                </div>
            </ul>
            <ul v-else>
                <li class="disabled nodata">暂无数据</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Popup extends Vue {
        @Prop() protected useMode!: 'pinned' | 'free';
        private showProgressBar: boolean = false;
        private showToolTip: boolean = false;
        private depth!: number;
        private contextMenuBox!: any[];
        private toastList!: any[];
        private toolTipData!: any;
        private mousedownEvent!: MouseEvent;

        data() {
            this.contextMenuBox = [];
            return {
                contextMenuBox: this.contextMenuBox
            }
        }

        mounted() {
            document.addEventListener('mousedown', this.setMousedownEvent);
            document.addEventListener('mouseup', this.closeSelect);
        }

        beforeDestroy() {
            document.removeEventListener('mousedown', this.setMousedownEvent);
            document.removeEventListener('mouseup', this.closeSelect);
        }

        public computedStyle(item: any) {
            return "left:" + this.getMouseX(item.contextMenuData.event) + "px; top:" + this.getMouseY(item.contextMenuData.event) + "px;";
        }

        public itemSelected(item: any): void {
            if (!item.isSeperator && !item.disabled && item.selectedCallback) {
                item.selectedCallback(item);
                this.hideContextMenu();
            }
        }

        public setMousedownEvent(e: MouseEvent) {
            this.mousedownEvent = e;
        }

        public closeSelect(e: MouseEvent) {
            if (!this.mousedownEvent || (this.$refs.popupMenuBox as any).contains(this.mousedownEvent.target) || (this.$refs.popupMenuBox as any).contains(e.target)) return;
            this.hideContextMenu();
        }

        public hideContextMenu() {
            this.contextMenuBox.forEach((item: any, index: number) => {
                this.$set(this.contextMenuBox, index, { contextMenuData: item.contextMenuData, showContextMenu: false });
            });
        }

        public itemEnter(event: MouseEvent, subIndex: number, subItem: any, level: number): void {
            if (subItem.hasSubMenuItems && (subItem.subMenuItems || subItem.callback)) {
                let data = { level: level, item: subItem, index: subIndex },
                    index = data.level + 1,
                    item = this.contextMenuBox[index],
                contextMenu = (this.$refs['contextMenu'] as any)[data.level] as HTMLElement;
                data.item.hovered = true;
                item.contextMenuData.event.pageX = this.contextMenuBox[data.level].contextMenuData.event.pageX + contextMenu.getBoundingClientRect().width - 4;
                item.contextMenuData.event.pageY = this.contextMenuBox[data.level].contextMenuData.event.pageY + data.index * 30 + 6;
                item.contextMenuData.items = data.item.subMenuItems;
                item.showContextMenu = true;
                this.$set(this.contextMenuBox[data.level].contextMenuData.items, data.index, data.item);
                this.$set(this.contextMenuBox, index, item);
                this.$nextTick(() => {
                    this.setMenuPosition(event, index);
                    this.updateScrollbar(index);
                });
            }
        }

        public itemLeave(event: MouseEvent, subIndex: number, subItem: any, level: number): void {
            let dom = event.relatedTarget as any;
            if (subItem.hasSubMenuItems && (subItem.subMenuItems || subItem.callback) && !!dom && this.matchContextmenu(dom, (this.$refs.contextMenu as any)?.[level])) {
                let data = { level: level, item: subItem, index: subIndex },
                    index = data.level + 1,
                    item = this.contextMenuBox[index];
                data.item.hovered = false;
                item.showContextMenu = false;
                this.$set(this.contextMenuBox[data.level].contextMenuData.items, data.index, data.item);
                this.$set(this.contextMenuBox, index, item);
            }
        }

        public dropLeave(event: MouseEvent, level: number): void {
            let dom = event.relatedTarget as any;
            if (this.matchContextmenu(dom, (this.$refs.contextMenu as any)?.[level + 1])) {
                return;
            } else if (this.matchContextmenu(dom, (this.$refs.contextMenu as any)?.[level - 1])) {
                let data = { level: level };
                for (let i = data.level; i < this.depth; i++) {
                    this.contextMenuBox[i].showContextMenu = false;
                    this.$set(this.contextMenuBox, i, this.contextMenuBox[i]);
                    this.contextMenuBox[i-1].contextMenuData.items.forEach((item: any, index: number) => {
                        item.hovered = false;
                        this.$set(this.contextMenuBox[i-1].contextMenuData.items, index, item);
                    });
                }
            } else {
                let data = { level: 1 };
                for (let i = data.level; i < this.depth; i++) {
                    this.contextMenuBox[i].showContextMenu = false;
                    this.$set(this.contextMenuBox, i, this.contextMenuBox[i]);
                    this.contextMenuBox[i-1].contextMenuData.items.forEach((item: any, index: number) => {
                        item.hovered = false;
                        this.$set(this.contextMenuBox[i-1].contextMenuData.items, index, item);
                    });
                }
            }
        }

        public matchContextmenu(curDom: any, relDom: any) {
            return relDom && relDom.contains(curDom);
        }

        public updateScrollbar(index: number) {
            let scrollbar = (this.$refs.scrollbar as any)?.[index];
            if (scrollbar) scrollbar.update();
        }

        public getDepth(contextMenuData: any) {
            let depthArr: number[] = [],
                num = 0;
            this.ergodic(contextMenuData.items, depthArr, num);
            return Math.max.apply(null, depthArr);
        }

        public ergodic(contextMenuItems: any[], depthArr: number[], num: number) {
            contextMenuItems.forEach((item: any) => {
                if (!item.subMenuItems) {
                    depthArr.push(num + 1);
                } else if (!item.subMenuItems.length) {
                    depthArr.push(num + 2);
                } else {
                    this.ergodic(item.subMenuItems, depthArr, num + 1);
                }
            });
        }

        public setMenuPosition(event: MouseEvent, level: number) {
            let contextMenu = (this.$refs['contextMenu'] as any)[level] as HTMLElement;

            if (contextMenu) {
                let bodyRect = document.body.getBoundingClientRect(),
                    lastContextMenu = (this.$refs['contextMenu'] as any)[level - 1] as HTMLElement,
                    ptyh = lastContextMenu.getElementsByClassName('ps__thumb-y')[0].getBoundingClientRect().width;

                let xpos = this.getMouseX(this.contextMenuBox[level].contextMenuData.event),
                    ypos = this.getMouseY(this.contextMenuBox[level].contextMenuData.event),
                    xpagePos = contextMenu.getBoundingClientRect().left,
                    ypagePos = contextMenu.getBoundingClientRect().top;

                let ww = bodyRect.width + (window.pageXOffset || (document.documentElement as HTMLElement).scrollLeft || document.body.scrollLeft),
                    mw = contextMenu.getBoundingClientRect().width,
                    lmw = lastContextMenu.getBoundingClientRect().width;
                let x = xpagePos + mw > ww ? xpos - mw - lmw + 6 : xpos + 2 - ptyh;

                let wh = bodyRect.height + (window.pageYOffset || (document.documentElement as HTMLElement).scrollTop || document.body.scrollTop),
                    mh = contextMenu.getBoundingClientRect().height,
                    eh = (event.currentTarget as HTMLElement).getBoundingClientRect().height;
                let y = ypagePos + mh > wh ? ypos - mh + eh : ypos;

                this.contextMenuBox[level].contextMenuData.event.pageX = x;
                this.contextMenuBox[level].contextMenuData.event.pageY = y;

                contextMenu.style.left = x + 'px';
                contextMenu.style.top = y + 'px';
            }
        }

        public getMouseX(e: MouseEvent): number {
            if (e.pageX != undefined && e.pageX != null) {
                return e.pageX;
            } else if (e.clientX != undefined && e.clientX != null) {
                let scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
                return e.clientX + scrollLeft;
            }
            return 0;
        }

        public getMouseY(e: MouseEvent): number {
            if (e.pageY) {
                return e.pageY;
            } else if (e.clientY) {
                let scrollTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
                return e.clientX + scrollTop;
            }
            return 0;
        }

        public showPopupMenu(contextMenuData: any) {
            (contextMenuData as any).event = { pageX: 0, pageY: 1 } as MouseEvent;
            this.depth = this.getDepth(contextMenuData);
            this.contextMenuBox = [];
            this.contextMenuBox[0] = { contextMenuData: contextMenuData, showContextMenu: true };
            for (var i = 1; i < this.depth; i++) {
                this.contextMenuBox.push({ contextMenuData: { event: { pageX: 0, pageY: 0 }, items: []}, showContextMenu: false });
            }
            this.$nextTick(() => {
                if ((this.$refs['contextMenu'] as any).length) {
                    let contextMenu = (this.$refs['contextMenu'] as any)[0] as HTMLElement,
                        bodyRect = document.body.getBoundingClientRect(),
                        xpagePos = (contextMenu.parentNode as any).getBoundingClientRect().left,
                        lmw = (contextMenu.parentNode as any).getBoundingClientRect().width,
                        ww = bodyRect.width + (window.pageXOffset || (document.documentElement as HTMLElement).scrollLeft || document.body.scrollLeft),
                        mw = contextMenu.getBoundingClientRect().width;
                    if (xpagePos + mw > ww) this.contextMenuBox[0].contextMenuData.event.pageX = lmw - mw;
                }
            });
        }
    }
</script>

<style scoped>
    .popupMenuBox{
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        font-family: Helvetica Neue, helvetica, tahoma, arial, sans-serif;
        font-size: 14px;
    }

    .popup-menu {
        position: fixed;
        left: -100%;
        top: 0;
        z-index: 999;
        box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
        border: 1px solid rgba(0, 0, 0, 0.2);
        background: #fff;
        min-width: 200px;
    }

    .ps {
        height: auto;
        max-height: 55vh;
        max-width: 250px;
    }

    .ps > div{
        padding: 6px 0;
    }

    ul{
        margin: 0;
        padding: 0;
        list-style: none;
        width: 100%;
    }

    li{
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        position: relative;
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
    }

    li:not(.seperator) {
        cursor: pointer;
    }

    .disabled {
        cursor: default !important;
        color: rgba(0, 0, 0, 0.3) !important;
        pointer-events: none;
    }

    .popup-menu ul{
        padding: 0;
    }

    .popup-menu ul li{
        display: flex;
        width: 100%;
        overflow: hidden;
        align-items: center;
    }

    .popup-menu ul li.hovered,
    .popup-menu ul li:hover {
        background: rgba(93, 164, 241, 0.2);
    }

    .popup-menu ul li.hovered:active,
    .popup-menu ul li:active {
        background-color: #5da4f1;
        color:#fff;
    }

    .text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .nodata {
        font-style: italic;
        text-align: center;
    }

    .loading {
        height: 100px;
        position: relative;
    }

    .loading-circle {
        display: inline-block;
        width: 24px;
        height: 24px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

        .loading-circle div {
            transform-origin: 12px 12px;
            animation: loading 1.2s linear infinite;
        }

            .loading-circle div:after {
                content: " ";
                display: block;
                position: absolute;
                top: 10px;
                left: 20px;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.9);
            }

            .loading-circle div:nth-child(1) {
                transform: rotate(0deg);
                animation-delay: -0.8s;
            }

            .loading-circle div:nth-child(2) {
                transform: rotate(40deg);
                animation-delay: -0.7s;
            }

            .loading-circle div:nth-child(3) {
                transform: rotate(80deg);
                animation-delay: -0.6s;
            }

            .loading-circle div:nth-child(4) {
                transform: rotate(120deg);
                animation-delay: -0.5s;
            }

            .loading-circle div:nth-child(5) {
                transform: rotate(160deg);
                animation-delay: -0.4s;
            }

            .loading-circle div:nth-child(6) {
                transform: rotate(200deg);
                animation-delay: -0.3s;
            }

            .loading-circle div:nth-child(7) {
                transform: rotate(240deg);
                animation-delay: -0.2s;
            }

            .loading-circle div:nth-child(8) {
                transform: rotate(280deg);
                animation-delay: -0.1s;
            }

            .loading-circle div:nth-child(9) {
                transform: rotate(320deg);
                animation-delay: 0s;
            }

    .icon-Chevron_r {
        position: relative;
        pointer-events: none;
        display: inline-block;
        height: 4px;
        width: 8px;
        transform: rotate(-90deg);
        -webkit-transform: rotate(-90deg);
    }

    .icon-Chevron_r:after {
        content: '';
        border-top: 4px solid rgba(0,0,0,.75);
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
    }

    .popup-menu ul li.hovered:active  .icon-Chevron_r:after,
    .popup-menu ul li:active .icon-Chevron_r:after {
        border-top-color: #fff;
    }

    /* 整体 */
    .popupMenuBox{
        position: relative;
    }
    .popup-menu{
        position: absolute;
    }
    .popup-menu ul {
        width: auto;
    }
    /deep/ .ps__rail-y {
        width: 6px;
    }
    /deep/ .ps__thumb-y{
        right: 0;
    }
    /deep/ .ps__rail-y:hover > .ps__thumb-y,
    /deep/ .ps__rail-y:focus > .ps__thumb-y,
    /deep/ .ps__rail-y.ps--clicking .ps__thumb-y {
        background-color: #aaa;
        width: 6px;
    }
</style>