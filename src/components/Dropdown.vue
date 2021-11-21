<template>
    <div ref="select" :class="['select', selectClass, widthPattern == 'auto' ? 'widthPatternAuto' : 'widthPatternFixed']">
        <span type="checkbox" :checked="hideDropdown"></span>
        <label @click="labelClick"><span v-if="typeof(selName) != 'undefined'">{{selName}}</span><i v-else-if="placeholder">{{placeholder}}</i></label>
        <div class="dropdown" ref="dropdown">
            <ul v-if="val && name">
                <perfect-scrollbar ref="scrollbar">
                    <div v-if="typeof(currentOption) == 'undefined'" class="loading"></div>
                    <div v-else-if="!currentOption.length" class="nodata">{{$t('Dropdown.noDataTips')}}</div>
                    <div v-else class="">
                        <div v-if="multipleMode">
                            <li ref="li" :unique="item[val]" @mousedown="setSelection($event)" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item[name]});" @mouseleave="itemMouseLeave();">
                                <input type="checkbox" v-bind:checked="selOption && selOption.find(p => p[val]==item[val])" />
                                <em></em>
                                {{item[name]}}
                            </li>
                        </div>
                        <div v-else>
                            <li @mousedown="setValue(item, item[val], item[name])" :class="{'selected': !noselected && selOption && selOption[val]==item[val]}" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item[name]});" @mouseleave="itemMouseLeave();">{{item[name]}}</li>
                        </div>
                    </div>
                </perfect-scrollbar>
            </ul>
            <ul v-else-if="!val && !name">
                <perfect-scrollbar ref="scrollbar">
                    <div v-if="typeof(currentOption) == 'undefined'" class="loading">
                        <div class="spinner">
                            <div v-for="(item, index) in Array(9).fill(0)" :key="index"></div>
                        </div>
                    </div>
                    <div v-else-if="!currentOption.length" class="nodata">{{$t('Dropdown.noDataTips')}}</div>
                    <div v-else class="">
                        <div v-if="multipleMode">
                            <li ref="li" :unique="item" @mousedown="setSelection($event)" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item});" @mouseleave="itemMouseLeave();">
                                <input type="checkbox" v-bind:checked="selOption && selOption.find(p => p==item)" />
                                <em></em>
                                {{item}}
                            </li>
                        </div>
                        <div v-else>
                            <li @mousedown="setValue(item, item, item)" :class="{'selected':  !noselected && selOption && selOption==item}" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item});" @mouseleave="itemMouseLeave();">{{item}}</li>
                        </div>
                    </div>
                </perfect-scrollbar>
            </ul>
            <ul v-else-if="!val && name">
                <perfect-scrollbar ref="scrollbar">
                    <div v-if="typeof(currentOption) == 'undefined'" class="loading"></div>
                    <div v-else-if="!currentOption.length" class="nodata">{{$t('Dropdown.noDataTips')}}</div>
                    <div v-else class="">
                        <div v-if="multipleMode">
                            <li ref="li" :unique="item[name]" @mousedown="setSelection($event)" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item[name]});" @mouseleave="itemMouseLeave();">
                                <input type="checkbox" v-bind:checked="selOption && selOption.find(p => p[name]==item[name])" />
                                <em></em>
                                {{item[name]}}
                            </li>
                        </div>
                        <div v-else>
                            <li @mousedown="setValue(item, item, item[name])" :class="{'selected':  !noselected && selOption && selOption[name]==item[name]}" v-for="(item, index) in currentOption" :key="index" @mouseenter="itemMouseEnter({event: $event, text: item[name]});" @mouseleave="itemMouseLeave();">{{item[name]}}</li>
                        </div>
                    </div>
                </perfect-scrollbar>
            </ul>
            <ul v-else></ul>
        </div>
        <input class="hide" type="text" ref="input" @click="$emit('change', $event)" />
        <div class="tooltip">
            <div></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Dropdown extends Vue {
        @Prop() protected selectClass!: string;
        @Prop() protected options!: any;
        @Prop() protected value!: any | any[];
        @Prop() protected val?: any;
        @Prop() protected name?: any;
        @Prop() protected noselected?: boolean;
        @Prop() protected unidirection?: boolean;
        @Prop() protected defaultObj?: any;
        @Prop() protected placeholder?: string;
        @Prop() protected showTitle?: boolean;
        @Prop() protected multipleMode?: boolean;
        @Prop() protected widthPattern?: 'fixed' | 'auto';
        @Prop() protected multipleSelNameMode?: 'count' | 'string';
        @Prop() protected triggerClicked?: Function;
        private originOption!: any;
        private currentOption!: any;
        private selOption!: any;
        private selName!: any;
        private selValue!: any | any[];
        private hideDropdown: boolean = false;
        private firstLoaded: boolean = false;
        private inputDom!: any;

        data(){
            return{
                selName: this.selName,
                selOption: this.selOption,
                currentOption: this.currentOption
            }
        }
        
        mounted() {
            if (this.multipleMode) {
                if (this.multipleSelNameMode != 'string') this.selName = this.defaultObj;
            } else this.selName = this.defaultObj ? (this.name ? this.defaultObj[this.name] : this.defaultObj) : this.selName;
            this.inputDom = this.$refs.input as any;
            if (typeof (this.options) === 'object') {
                this.currentOption = this.originOption = this.options;
                this.initData();
            }
            this.$watch('value', () => {
                if(typeof(this.currentOption) != 'undefined'){
                    this.currentOption = this.originOption;
                    this.dropdownFilter(this.value);
                }
            });
            this.$watch('options', () => {
                if(typeof (this.options) === 'object'){
                    this.currentOption = this.originOption = this.options;
                    this.initData();
                }
            });
            this.$watch('defaultObj', () => {
                if (this.multipleMode) {
                    if (this.multipleSelNameMode != 'string') this.selName = this.defaultObj;
                } else this.selName = this.defaultObj ? (this.name ? this.defaultObj[this.name] : this.defaultObj) : this.selName;
            }, {deep: true});
            document.addEventListener('click', this.hideDropdownEvent, true);
            document.addEventListener('contextmenu', this.hideDropdownEvent, true);
            window.addEventListener('resize', this.updateScrollbar);
        }

        beforeDestroy(){
            document.removeEventListener('click', this.hideDropdownEvent, true);
            document.removeEventListener('contextmenu', this.hideDropdownEvent, true);
            window.removeEventListener('resize', this.updateScrollbar);
        }

        public updateScrollbar(): void {
            if(this.$refs.scrollbar){
                (this.$refs.scrollbar as any).update();
            }
        }


        hideDropdownEvent(event: MouseEvent){
            if(!(this.$refs.select as HTMLElement).contains(event.target as any)){
                this.hideDropdown = false;
            }
        }

        public labelClick() {
            this.hideDropdown = !this.hideDropdown;
            this.refreshData();
        }

        public setValue(item: any, value: any, name: any): void {
            this.selOption = item;
            this.selValue = value;
            this.selName = name;
            this.$emit("selOption", item);
            this.$emit("input", this.selValue);
            this.inputDom.value = this.selValue;
            this.inputDom.click();
            this.hideDropdown = false;
            if (this.showTitle) {
                this.hideToolTip();
            }
        }

        public setSelection(event: MouseEvent): void {
            let dom = (event.currentTarget as any).children[0] as HTMLInputElement,
                li = this.$refs.li as any,
                selOption: any[] = [], selValue: any[] = [], selName: any = [];
            dom.checked = !dom.checked;       
            if (this.val && this.name) {
                li.forEach((liItem: any) => {
                    if ((liItem.children[0] as HTMLInputElement).checked) {
                        let item = this.currentOption.find((p: any) => p[this.val] == liItem.getAttribute('unique'));
                        selOption.push(item);
                        selValue.push(item[this.val]);
                        selName.push(item[this.name]);
                    }
                }); 
            } else if (!this.val && !this.name) {
                li.forEach((liItem: any) => {
                    if ((liItem.children[0] as HTMLInputElement).checked) {
                        let item = this.currentOption.find((p: any) => p[this.val] == liItem.getAttribute('unique'));
                        selOption.push(item);
                        selValue.push(item);
                        selName.push(item);
                    }
                });
            } else if (!this.val && this.name) {
                li.forEach((liItem: any) => {
                    if ((liItem.children[0] as HTMLInputElement).checked) {
                        let item = this.currentOption.find((p: any) => p[this.val] == liItem.getAttribute('unique'));
                        selOption.push(item);
                        selValue.push(item);
                        selName.push(item[this.name]);
                    }
                });
            }
            this.selOption = selOption;
            this.selValue = selValue;
            this.selName = this.multipleSelNameMode == 'string' ? selName.join(', ') : selName.length + 'selected';
            this.$emit("selOption", this.selOption);
            this.$emit("input", this.selValue);
            this.inputDom.value = this.selValue;
            this.inputDom.click();
            if (this.showTitle) {
                this.hideToolTip();
            }
        }

        public refreshData() {
            if (!this.hideDropdown || this.options == undefined) {
                return;
            }
            this.currentOption = undefined;
            if (typeof (this.options) === 'object') {
                this.currentOption = this.originOption = this.options;
                this.dropdownFilter(this.value);
                this.initData();
            }
            else {
                this.options(this.setData());
            }
        }

        public setData() {
            return (items: any[]) => {
                this.currentOption = this.originOption = items;
                this.dropdownFilter(this.value);
                this.initData();
            };
        }

        public initData() {
            if(this.firstLoaded){
                return;
            }

            this.firstLoaded = true;
            this.selValue = this.value;  
                     
            if (this.multipleMode) {
                this.initMuitiple();
            } else this.initSingle();
        }

        public initSingle() {
            if (this.val && this.name) {
                let item = this.currentOption.find((p: any) => p[this.val] == this.selValue);
                if (typeof(item) != 'undefined') {
                    this.selOption = item;
                    this.selName = item[this.name];
                    return;
                }
            } else if (!this.val && !this.name) {
                let item = this.currentOption.find((p: any) => p == this.selValue);
                if (typeof (item) != 'undefined') {
                    this.selOption = this.selName = this.selValue;
                    return;
                }
            } else if (!this.val && this.name) {
                let item = this.currentOption.find((p: any) => this.selValue && p[this.name] == this.selValue[this.name]);
                if (typeof (item) != 'undefined') {
                    this.selOption = item;
                    this.selName = item[this.name];
                    return;
                }
            } else {
                this.selName = this.selValue = '';
            }
        }

        public initMuitiple() {
            let selOption = [], selName: any = [];
            if (this.val && this.name) {
                if (!Array.isArray(this.selValue)) return;
                for (var i = 0; i < this.selValue.length; i++) {
                    let item = this.currentOption.find((p: any) => p[this.val] == this.selValue[i]);
                    if (typeof (item) != 'undefined') {
                        selOption.push(item);
                        selName.push(item[this.name]);
                    }
                }
            } else if (!this.val && !this.name) {
                if (!Array.isArray(this.selValue)) return;
                for (let i = 0; i < this.selValue.length; i++) {
                    let item = this.currentOption.find((p: any) => p == this.selValue[i]);
                    if (typeof (item) != 'undefined') {
                        selOption.push(this.selValue[i]);
                        selName.push(this.selValue[i]);
                    }
                }
            } else if (!this.val && this.name) {
                if (!Array.isArray(this.selValue)) return;
                for (let i = 0; i < this.selValue.length; i++) {
                    let item = this.currentOption.find((p: any) => this.selValue[i] && p[this.name] == this.selValue[i][this.name]);
                    if (typeof (item) != 'undefined') {
                        selOption.push(item);
                        selName.push(item[this.name]);
                    }
                }
            } else {
                this.selValue = [];
            }
            this.selOption = selOption;
            this.selName = this.multipleSelNameMode == 'string' ? selName.join(', ') : selName.length + 'selected';
        }

        public dropdownFilter(value: any | any[]){
            if(!this.unidirection) return;
            let emptyOptions: any[] = [];
            if(this.val) {
                let isExist = false;
                this.originOption.forEach((item: any) => {
                    if(item[this.val].toUpperCase().indexOf(value.toUpperCase())>-1) {
                        emptyOptions.push(item);
                    }
                    if (item[this.val] == value) isExist = true;
                });
                if (value != undefined && value != '' && !isExist) {
                    let opt: any = {};
                    opt[this.val] = value;
                    emptyOptions.unshift(opt);
                }
            }else if(!this.val){
                this.originOption.forEach((item: any) => {
                    if(item.toUpperCase().indexOf(value.toUpperCase())>-1) {
                        emptyOptions.push(item);
                    }
                });
                if (value != undefined && value !='' && emptyOptions.indexOf(value) == -1) {
                    emptyOptions.unshift(value);
                }
            }
            this.currentOption = emptyOptions;
        }

        public itemMouseEnter(data: any){
            if (this.showTitle) {
                this.showToolTip(data);
            }
        }

        public itemMouseLeave() {
            if (this.showTitle) {
                this.hideToolTip();
            }
        }

        public hideToolTip() {

        }

        public showToolTip(data: any) {
            console.log(data);
        }
    }
</script>
<style scoped>
    .select{
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: rgba(0, 0, 0, 0.04);
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        width: 340px;
        height: 30px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
    }

    .select span[type=checkbox] + label{
        height: 100%;
        padding: 0 5px;
        display: flex;
        align-items: center;
        line-height: initial;
        position: relative;
    }

    .select > span[type=checkbox] + label>span{
        display: block;
        white-space: nowrap;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px;
    }

    .select .dropdown {
        display: none;
    }

    .select span[type=checkbox][checked] + label + .dropdown{
        display: block;
    }

    .select span[type=checkbox] + label:after{
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        border: solid rgba(0,0,0,.5);
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 50%;
        right: 12px;
        margin-top: -8px;
        border-width: 0 1px 1px 0;
    }

    .select span[type=checkbox] + label > i {
        color: rgba(0,0,0,0.50);
    }

    .select span[type=checkbox] + label:hover {
        background-color: rgba(0,0,0,.1);
    }

    .dropdown {
        position: relative;
    }

    .dropdown > ul{       
        padding: 0;
        overflow-y: auto;
        background-color: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
        box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%);
        min-width: 180px;
        margin: 0;
    }

    .dropdown ul li{
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        position: relative;
    }

    .dropdown ul li:hover {
        background: rgba(93, 164, 241, 0.2);
    }

    .dropdown ul li.selected {
        background-color: #5da4f1;
        color: #fff;
    }

    .ps {
        max-height: 30vh;
    }

    .ps > div{
        padding: 6px 0;
    }

    .ps > div.nodata{
        text-align: center;
        font-size: 13px;
        font-style: italic;
        color: #bbb;
    }

    .widthPatternFixed .dropdown > ul li{
        white-space: nowrap;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow:hidden;
    }

    .loading {
        height: 100px;
        position: relative;
    }

    input.hide{
        display: none;
    }

    .widthPatternAuto.select span[type=checkbox][checked] + label + .dropdown {
        position: absolute;
    }

    .widthPatternAuto .dropdown > ul {
        display: inline-block;
    }

    .widthPatternAuto .dropdown > ul li {
        white-space: nowrap;
    }

    .select input[type=checkbox] + em {
        position: relative;
    }

    .select input[type=checkbox] + em:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        width: 16px;
        height: 16px;
        outline: none;
        background-color: rgba(0, 0, 0, 0.2);
        margin-right: 5px;
        margin-top: -2px;
    }

    .select input[type=checkbox]:checked + em:before {
        background-color: #5da4f1;
    }

    .select input[type=checkbox]:checked + em:after {
        content: '';
        display: block;
        width: 5px;
        height: 9px;
        border: solid #ffffff;
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 4px;
        left: 5px;
    }

    .spinner{
        color: official;
        display: inline-block;
        width: 44px;
        height: 44px;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }
    .spinner div {
        transform-origin: 22px 22px;
        animation: spinner 1.2s linear infinite;
    }
    .spinner div:after {
        content: " ";
        display: block;
        position: absolute;
        top: 30px;
        left: 25px;
        width: 3px;
        height: 3px;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.3);
    }
    .spinner div:nth-child(1) {
        transform: rotate(0deg);
        animation-delay: -0.8s;
    }
    .spinner div:nth-child(2) {
        transform: rotate(40deg);
        animation-delay: -0.7s;
    }
    .spinner div:nth-child(3) {
        transform: rotate(80deg);
        animation-delay: -0.6s;
    }
    .spinner div:nth-child(4) {
        transform: rotate(120deg);
        animation-delay: -0.5s;
    }
    .spinner div:nth-child(5) {
    transform: rotate(160deg);
    animation-delay: -0.4s;
    }
    .spinner div:nth-child(6) {
        transform: rotate(200deg);
        animation-delay: -0.3s;
    }
    .spinner div:nth-child(7) {
        transform: rotate(240deg);
        animation-delay: -0.2s;
    }
    .spinner div:nth-child(8) {
        transform: rotate(280deg);
        animation-delay: -0.1s;
    }
    .spinner div:nth-child(9) {
        transform: rotate(320deg);
        animation-delay: 0s;
    }
    @keyframes spinner {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @-webkit-keyframes spinner {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>