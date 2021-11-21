<template>
    <div class="combo">
        <div>
            <dropdown :class="['comboselect', selectClass]" ref="dropdown" v-model="dropdownVal" :options="comboOptions" :name="name" :val="name" @selOption="getOption" :showlabel="false" :noselected="true" :unidirection="true" :showTitle="showTitle" :widthPattern="widthPattern"></dropdown>
            <input type="text" v-model="inputChange" ref="input" @keydown="fixValue" @focus="inputFocus" @blur="showRealValue" @click="inputClick" :placeholder="curPlaceholder"/>
            <span v-if="isShowClear" @click="clearValue" class="iconfont icon-cancel_nc"></span>
            <span class="iconfont icon-Chevron_d"></span>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import dropdown from './Dropdown.vue';

    @Component({
        components: {
            dropdown
        }
    })
    export default class Combo extends Vue {
        @Prop() protected selectClass!: string;
        @Prop() protected options!: any;
        @Prop() protected value!: any;
        @Prop() protected val?: any;
        @Prop() protected name?: any;
        @Prop() protected placeholder?: string;
        @Prop() protected showTitle?: boolean;
        @Prop() protected widthPattern?: 'fixed' | 'auto';
        private option?: any;
        private curPlaceholder?: string;
        private comboOptions = this.options;
        private labelDom!: HTMLElement;
        private inputDom!: HTMLElement;
        private selValue!: any;
        private realValue!: any;

        data(){
            return{
                selValue : this.selValue,
                realValue : this.realValue,
                option : this.option,
                curPlaceholder : this.curPlaceholder
            }
        }

        mounted() {
            this.labelDom = (this.$refs.dropdown as any).$el.children[1];
            this.inputDom = this.$refs.input as HTMLElement;
            this.selValue = this.realValue = this.value || '';
            this.curPlaceholder = this.realValue ? this.realValue : this.placeholder;
            this.$watch('value', () => {
                this.selValue = this.realValue = this.value || '';
                this.curPlaceholder = this.realValue ? this.realValue : this.placeholder;
            });
        }


        get inputChange(){
            return this.selValue;
        }

        set inputChange(value: any){       
            this.selValue = value;
        }

        get dropdownVal() {
            return this.selValue;
        }

        set dropdownVal(value: any) {
            this.selValue = this.realValue = value;
            this.$emit("getValue", this.val && this.option ? this.option[this.val] : this.realValue);
            this.$emit("input", this.realValue);
            this.$emit("change", this.realValue);
            this.curPlaceholder = this.realValue;
        }

        public showRealValue(){
            (this.$refs.dropdown as any).hideDropdown = false;
            this.selValue = this.realValue;
        }

        public inputFocus() {
            this.selValue = '';          
        }

        public fixValue(event: any) {
            if(event.keyCode == 13){
                this.realValue = this.selValue;
                this.$emit("input", this.realValue);
                this.$emit("change", this.realValue);
                this.curPlaceholder = this.realValue ? this.realValue : this.placeholder;
                this.inputDom.blur();
            }
        }

        public clearValue() {
            this.selValue = this.realValue = '';
            this.$emit("input", this.realValue);
            this.$emit("change", this.realValue);
            this.curPlaceholder = this.placeholder;
        }

        public inputClick() {
            (this.$refs.dropdown as any).hideDropdown = true;
        }

        get isShowClear() {
            return this.realValue || this.selValue;
        }

        public getOption(option: any) {
            this.option = option;
        }
    }
</script>

<style scoped>
    .combo{
        height: 30px;
        width: 100%;
        max-width: 400px;
    }

    .combo>div{
        position: relative;
    }

    .combo>div, .comboselect{
        height: 100%;
        width: 100%;
    }
    input[type="text"]{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.04);
        padding: 0 46px 0 5px;
        outline: none;
        line-height: 24px;
        border: none;
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
    }
    ::-ms-clear{display: none;}
    ::-ms-reveal{display: none;}
    .combo>div>span{
        position: absolute;
        top: 0;
        right: 9px;
        height: 100%;
        width: 16px;
        pointer-events: none;
        display: inline-flex;
        align-items: center;
        overflow: hidden;
    }
    .combo>div>span.icon-cancel_nc{
        right: 26px;
        pointer-events: auto;
        cursor: pointer;
        color: rgba(60,60,60,.5);
    }
    .combo>div>span.icon-cancel_nc:before{
        content: "×";
        color: #fff;
        text-align: center;
        line-height: 14px;
        display: block;
        height: 14px;
        width: 14px;
        position: absolute;
        background: rgba(60,60,60,.5);
        border-radius: 50%;
    }
    .combo>div>span.icon-Chevron_d:after{
        content: "";
        display: block;
        width: 8px;
        height: 8px;
        border: solid rgba(0,0,0,.5);
        transform: rotate(45deg);
        position: absolute;
        top: 50%;
        left: 4px;
        margin-top: -8px;
        border-width: 0 1px 1px 0;
    }
    .comboselect{
        background-color: initial;
    }
    .comboselect>>>label{
        visibility: hidden;
    }
    ::-webkit-input-placeholder {
        font-style: italic;
    }

    :-moz-placeholder {
        font-style: italic;
    }

    ::-moz-placeholder {
        font-style: italic;
    }

    :-ms-input-placeholder {
        font-style: italic;
    }
</style>