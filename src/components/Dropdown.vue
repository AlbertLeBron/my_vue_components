<template>
    <div class="dropdown-ui" ref="dropdown">
        <label @click="labelToggle">
            <span v-if="labelText" @mouseenter="enterLT($event, labelText)" @mouseleave="leaveLT"><span class="dropdown-textWrap">{{labelText}}</span></span>
            <i v-else class="placeholder">{{placeholder}}</i>
        </label>
        <div v-show="open" class="dropdown-container">
            <div class="dropdown-wrap">
                <div v-if="loading" class="loading">
                    <div class="loading-circle">
                        <div v-for="(item, index) in Array(9).fill(0)" :key="'sp_'+(item+index)"></div>
                    </div>
                </div>
                <ul v-else-if="list && list.length">
                    <li v-for="(item, index) in list"
                        :key="'it_'+index"
                        :class="{selected: typeof value != 'undefined' && (typeof valKey != 'undefined' ? value === item[valKey] : value === item)}"
                        @click="selectLi(item)"
                        @mouseenter="enterLi($event, item)"
                        @mouseleave="leaveLi">
                        <span class="dropdown-textWrap">{{typeof nameKey != 'undefined' ? item[nameKey] : item}}</span>
                    </li>
                </ul>
                <div v-else class="nodata">暂无数据</div>
            </div>
        </div>
        <div class="dropdown-tooltip-wrap">
            <transition-group name="fade">
                <template v-if="tooltipList">
                    <div v-for="item in tooltipList" :ref="item.id" :key="item.id" :class="['dropdown-tooltip']" :style="{left: (item.pageX | 0)+'px', top: (item.pageY | 0)+'px'}">{{item.text}}</div>
                </template>                
            </transition-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Dropdown extends Vue {
        @Prop() protected datas!: any;
        @Prop() protected value!: any;
        @Prop() protected valKey!: string;
        @Prop() protected nameKey!: string;
        @Prop() protected defaultText!: string;
        @Prop() protected placeholder!: string;
        @Prop() protected beforeClick!: Function;
        @Prop() protected afterClick!: Function;
        @Prop() protected showTitle!: 'all' | 'ellipsis' | undefined;
        private open!: boolean;
        private list!: any[] | undefined;
        private tooltipList!: any[] | undefined;
        private tooltipIdCounter: number = 0;
        private loading!: boolean;

        data() {
            return{
                open: this.open,
                list: this.list,
                loading: this.loading,
                tooltipList: this.tooltipList
            }
        }
        
        mounted() {
            document.addEventListener('click', this.closeSelect, true);
            if (Array.isArray(this.datas)) {
                this.list = this.datas;
            }
            this.$watch('datas', () => {
                this.list = Array.isArray(this.datas) ? this.datas : undefined;
            });
        }

        beforeDestroy() {
            document.removeEventListener('click', this.closeSelect, true);
        }

        //update text of the selected item.
        get labelText() {
            let text!: any;
            if (typeof this.value != 'undefined') {
                let selectedItem!: any;
                if (typeof this.valKey != 'undefined') {
                    selectedItem = this.list ? this.list.find(p => p[this.valKey] === this.value) : undefined;
                } else {
                    selectedItem = this.list ? this.list.find(p => p === this.value) : undefined;
                }
                if (selectedItem) text = typeof this.nameKey != 'undefined' ? selectedItem[this.nameKey] : selectedItem;
            }
            return typeof text != 'undefined' ? text : this.defaultText;
        }

        //Show the selectionbox or hide it.
        public labelToggle() {
            this.open = !this.open;
            if (this.open && typeof this.datas == 'function') {
                this.loading = true;
                this.datas((list: any[]) => {
                    this.list = list;
                    this.loading = false;
                });
            } else if (this.loading) this.loading = false;
        }

        //Hide the selectionbox after clicking the entire document except the component itself.
        public closeSelect(e: MouseEvent) {
            if ((this.$refs.dropdown as any).contains(e.target)) return;
            this.open = false;
        }

        //Select an item, and update the value of the component.
        public selectLi(item: any) {
            let beforeClick = typeof item.beforeClick == 'function' ? item.beforeClick : this.beforeClick;
            beforeClick && beforeClick(item);

            if (typeof this.valKey != 'undefined') {
                this.$emit('input', item[this.valKey]);
            } else this.$emit('input', item);
            this.open = false;

            let afterClick = typeof item.afterClick == 'function' ? item.afterClick : this.afterClick;
            afterClick && afterClick(item);
        }

        //Mouseenter text label
        public enterLT(event: MouseEvent, labelText: string) {
            if (this.showTitle == 'all' ||
                (this.showTitle == 'ellipsis' && (event.target as HTMLElement).getBoundingClientRect().width == (event.target as HTMLElement).getElementsByClassName('dropdown-textWrap')[0].getBoundingClientRect().width))
                this.addTooltip(event, labelText);
        }

        //Mouseleave text label
        public leaveLT(event: MouseEvent) {
            if (this.showTitle == 'all' ||
                (this.showTitle == 'ellipsis' && (event.target as HTMLElement).getBoundingClientRect().width == (event.target as HTMLElement).getElementsByClassName('dropdown-textWrap')[0].getBoundingClientRect().width))
                this.removeTooltip(event);
        }

        //Mouse enter li
        public enterLi(event: MouseEvent, item: any) {
            if (this.showTitle == 'all' ||
                (this.showTitle == 'ellipsis' && (event.target as HTMLElement).getBoundingClientRect().width == (event.target as HTMLElement).getElementsByClassName('dropdown-textWrap')[0].getBoundingClientRect().width))
                this.addTooltip(event, typeof this.nameKey != 'undefined' ? item[this.nameKey] : item);
        }

        //Mouse leave li
        public leaveLi(event: MouseEvent) {
            if (this.showTitle == 'all' ||
                (this.showTitle == 'ellipsis' && (event.target as HTMLElement).getBoundingClientRect().width == (event.target as HTMLElement).getElementsByClassName('dropdown-textWrap')[0].getBoundingClientRect().width))
                this.removeTooltip(event);
        }

        //add a tooltip element to tooltipList when an item is mouseentered
        public addTooltip(event: MouseEvent, text: string) {
            if (typeof this.tooltipList == 'undefined') this.tooltipList = [];
            let tooltip = { id: `tooltip_${this.tooltipIdCounter++}`, text: text};
            this.tooltipList.push(tooltip);
            this.$nextTick(() => {
                this.setPosition(tooltip, event);
            });
            (event.target as HTMLElement).onmousemove = (ev: MouseEvent) => {
                this.setPosition(tooltip, ev);
            }
        }

        //remove a tooltip element to tooltipList when an item is mouseleft
        public removeTooltip(event: MouseEvent) {
            if (this.tooltipList) {
                let tooltip = this.tooltipList[this.tooltipList.length - 1];
                this.tooltipList.splice(this.tooltipList.indexOf(tooltip), 1);
                (event.target as HTMLElement).onmousemove = null;
            }
        }

        //set position of tooltip 
        public setPosition(item: any, event: MouseEvent) {
            let dom = (this.$refs[item.id] as HTMLElement[])[0] as HTMLElement;
            if (dom) {
                let bodyRect = document.body.getBoundingClientRect(),
                    xpos = this.getMouseX(event),
                    ypos = this.getMouseY(event),
                    ww = bodyRect.width + (window.pageXOffset || (document.documentElement as HTMLElement).scrollLeft || document.body.scrollLeft),
                    mw = dom.getBoundingClientRect().width,
                    wh = bodyRect.height + (window.pageYOffset || (document.documentElement as HTMLElement).scrollTop || document.body.scrollTop),
                    mh = dom.getBoundingClientRect().height,
                    x = xpos + mw + 10 > ww ? xpos - mw - 10 : xpos + 10,
                    y = ypos + mh + 10 > wh ? ypos - mh : ypos + 10;

                console.log(mw);

                Vue.set(item, 'pageX', x);
                Vue.set(item, 'pageY', y);
            }
        }

        public getMouseX(e: MouseEvent): number {
            if (e.pageX != undefined && e.pageX != null) {
                return e.pageX;
            } else if (e.clientX != undefined && e.clientX != null) {
                let scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
                return e.clientX + scrollLeft;
            }
            return 0
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
    }
</script>
<style scoped>
    .dropdown-ui {
        font-size: 14px;
        height: 30px;
        color: rgba(0, 0, 0, 0.75);
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }

        .dropdown-ui > label {
            background: rgba(0, 0, 0, 0.05);
            height: 100%;
            border: 0;
            padding: 0 30px 0 10px;
            outline: none;
            display: block;
            margin: 0;
            position: relative;
            cursor: pointer;
            transition: all .3s ease-in-out;
            -webkit-transition: all .3s ease-in-out;
            line-height: 30px;
        }

        .dropdown-ui:hover > label {
            background: rgba(0, 0, 0, 0.09);
        }

        .dropdown-ui > label::after {
            content: '';
            border-top: 4px solid rgba(0,0,0,.75);
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
            position: absolute;
            right: 12px;
            top: 12px;
        }

        .dropdown-ui > label > * {
            display: block;            
        }

        .dropdown-ui > label > .placeholder,
        .dropdown-ui > label .dropdown-textWrap {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .dropdown-ui > label .dropdown-textWrap {
            display: inline-block;
            vertical-align: top;
            max-width: 100%;
        }

        .placeholder {
            color: rgba(0,0,0,0.50);
        }

        .dropdown-ui > .dropdown-container {
            position: relative;
            z-index: 1;
        }

        .dropdown-wrap > .dropdown-wrap{
            position: absolute;
        }

        .dropdown-ui ul, .loading, .nodata {
            margin: 0;
            padding: 5px 0;
            list-style: none;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
            border: 1px solid rgba(0, 0, 0, 0.2);
            background: #fff;
            width: 100%;
        }

        .loading {
            height: 100px;
            position: relative;
        }

        .nodata{
            text-align: center;
            font-size: 13px;
            font-style: italic;
            color: #bbb;
        }

            .dropdown-ui ul > li {                
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                position: relative;               
            }

                .dropdown-ui ul > li.selected {
                    background: #5da4f1;
                    color: #fff;
                }

                .dropdown-ui ul > li:not(.selected):hover {
                    background: rgba(93,164,241,.2);
                }

                .dropdown-ui ul > li span {
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                    vertical-align: top;
                    padding: 0 10px;
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

    @keyframes loading {
        0% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }

    /*dropdown-tooltip*/
    .dropdown-tooltip {
        position: fixed;
        padding: 6px 10px;
        background: rgba(50,50,50,.6);
        border-radius: 2px;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.50);
        color: #fff;
        max-width: 300px;
        word-wrap: break-word;
        pointer-events: none;
        z-index: 9999;
        white-space: pre-wrap;
        line-height: 18px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s ease;
    }

    .fade-enter,
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>