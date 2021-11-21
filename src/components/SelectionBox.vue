<template>
    <div class="selectionBox">
        <div>
            <div class="listWrap">
                <div class="listHeader">
                    <span @mouseenter="showToolTip({ event: $event ,text: !!originalListName ? originalListName : '' })" @mouseleave="hideToolTip()">{{ !!originalListName ? originalListName : '' }}</span>
                    <slot name="originalListHeader"></slot>
                </div>
                <div class="listBody">
                    <perfect-scrollbar>
                        <ul v-if="!!name">
                            <li v-for="(item, index) in originalList" :key="'o_'+index"
                                :class="{selected: item === originalSelectedItem, added: currentList.indexOf(item) > -1}"
                                @mouseenter="showToolTip({ event: $event ,text: item[name]})" @mouseleave="hideToolTip()"
                                @click="selectOriginalItem(item)">{{item[name]}}</li>
                        </ul>
                    </perfect-scrollbar>
                </div>
            </div>
            <div class="operations">
                <div class="button" :disabled="!originalSelectedItem" @click="addItem">{{buttonNames && buttonNames.add ? buttonNames.add : '添 加'}} >></div>
                <div class="button" :disabled="!currentSelectedItem" @click="deleteItem">{{buttonNames && buttonNames.delete ? buttonNames.delete : '删 除'}}</div>
                <div class="button" :disabled="!(currentSelectedItem && currentList.indexOf(currentSelectedItem) > 0)" @click="upItem">{{buttonNames && buttonNames.up ? buttonNames.up : '上 移'}}</div>
                <div class="button" :disabled="!(currentSelectedItem && currentList.indexOf(currentSelectedItem) < currentList.length - 1)" @click="downItem">{{buttonNames && buttonNames.down ? buttonNames.down : '下 移'}}</div>
            </div>
            <div class="listWrap">
                <div class="listHeader">
                    <span @mouseenter="showToolTip({ event: $event ,text: !!currentListName ? currentListName : '' })" @mouseleave="hideToolTip()">{{ !!currentListName ? currentListName : '' }}</span>
                    <slot name="currentListHeader"></slot>
                </div>
                <div class="listBody">
                    <perfect-scrollbar>
                        <ul v-if="!!name">
                            <li v-for="(item, index) in currentList" :key="'c_'+index"
                                :class="{selected: item === currentSelectedItem}"
                                @mouseenter="showToolTip({ event: $event ,text: item[name]})" @mouseleave="hideToolTip()"
                                @click="selectCurrentItem(item)">{{item[name]}}</li>
                        </ul>
                    </perfect-scrollbar>
                </div>
            </div>
        </div>
        <div class="tooltip">
            <div></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class SelectionBox extends Vue {
        @Prop() protected value!: any;
        @Prop() protected originalListName!: string;
        @Prop() protected currentListName!: string;
        @Prop() protected originalList!: any[];
        @Prop() protected name!: string | undefined;
        @Prop() protected buttonNames!: any;
        private originalSelectedItem!: any;
        private currentList!: any[];
        private currentSelectedItem!: any;

        public data() {
            this.currentList = this.value ? this.value : [];
            this.$emit('input', this.currentList);
            return {
                originalSelectedItem: this.originalSelectedItem,
                currentSelectedItem: this.currentSelectedItem,
                currentList: this.currentList
            };
        }

        public selectOriginalItem(item: any) {
            this.originalSelectedItem = item;
        }

        public selectCurrentItem(item: any) {
            this.currentSelectedItem = item;
        }

        public addItem() {
            if (this.currentList.indexOf(this.originalSelectedItem) == -1)
                this.currentList.push(this.originalSelectedItem);
        }

        public deleteItem() {
            let index = this.currentList.indexOf(this.currentSelectedItem);
            if (index > -1) {
                this.currentList.splice(index, 1);
                this.currentSelectedItem = undefined;
            }
        }

        public upItem() {
            let index = this.currentList.indexOf(this.currentSelectedItem),
                upper = this.currentSelectedItem,
                downer = this.currentList[index - 1];
            this.currentList.splice(index - 1, 2, upper, downer);
        }

        public downItem() {
            let index = this.currentList.indexOf(this.currentSelectedItem),
                upper = this.currentList[index + 1],
                downer = this.currentSelectedItem;
            this.currentList.splice(index, 2, upper, downer);
        }

        public showToolTip(data: any) {
            console.log(data);
        }

        public hideToolTip() {
            
        }

        public refreshListData() {
            if (this.originalList.indexOf(this.originalSelectedItem) == -1)
                this.originalSelectedItem = undefined;
            this.currentList.filter((p: any) => this.originalList.indexOf(p) > 0);
            if (this.currentList.indexOf(this.currentSelectedItem) == -1)
                this.currentSelectedItem = undefined;
        }

        mounted() {
            this.$watch('originalList', () => {
                this.refreshListData();
            });
            this.$watch('value', () => {
                this.currentList = this.value ? this.value : [];
                //this.$emit('input', this.currentList);
            });
        }
    }
</script>
<style scoped>
    .selectionBox{
        padding: 12px 0;
        font-size: 13px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }

    ul{
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .button{
        min-width: 100px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        color: rgba(0,0,0,.75);
        font-size: 13px;
        letter-spacing: 0;
        background-color: rgba(0,0,0,.05);
        text-align: center;
        border: none;
        outline: none;
        padding: 0 8px;
    }

    .button:hover{
        background-color: rgba(0,0,0,.1);
    }

    .selectionBox > div {
        display: flex;
    }

    .operations {
        display: inline-flex;
        flex-direction: column;
        margin: 0 10px;
        justify-content: center;
        padding-top: 24px;
    }

    .operations .button {
        min-width: initial;
        font-family: Helvetica Neue, helvetica, tahoma, arial, sans-serif;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }

    .button[disabled]{
        pointer-events: none;
        color: rgba(0,0,0,.2);
    }

    .operations .button + .button {
        margin-top: 10px;
    }

    .listWrap{
        flex: 1;       
        width: 0;
        min-width: 0;       
    }

    .listHeader{
        height: 24px;
        line-height: 24px;
        display: flex;
    }

    .listHeader > span{
        color: #4A90E2;
        flex: 1;
        width: 0;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }

    .listBody {
        height: 160px;
        border: 1px solid rgba(0,0,0,.2);
        background: #f3f3f3;
    }

    .listWrap li{
        background: #fff;
        box-shadow: inset 0 -1px 0 0 rgba(0,0,0,.07);
        padding: 0 10px;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        position: relative;
    }

    .listWrap li.selected{
        background: #5da4f1;
        color: #fff;
    }

    .listWrap li.added{
        padding-right: 20px;
    }

    .listWrap li.added::after{
        content: '';
        position: absolute;
        width: 6px;
        height: 4px;
        background: transparent;
        top: 8px;
        right: 8px;
        border: 2px solid #1dbd1d;
        border-top: none;
        border-right: none;
        -webkit-transform: rotate(-55deg);
        -ms-transform: rotate(-55deg);
        transform: rotate(-55deg);
    }

    .listWrap li.added.selected::after{
       border-color: #fff;
    }

    .ps {
        height: 100%;
    }
</style>