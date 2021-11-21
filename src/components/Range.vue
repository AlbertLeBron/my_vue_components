<template>
    <div class="range">
        <div>
            <div class="bar" ref="bar" @click="choosePoint">
                <template v-if="reversion">
                    <span v-bind:style="{width: emLeftPosition_reversion + 'px'}"></span>
                    <em v-bind:style="{left: emLeftPosition_reversion + 'px'}" @mousedown="startDrag_reversion" @touchstart="startDrag_reversion" @click="$event.stopPropagation();"></em>
                </template>
                <template v-else>
                    <span v-bind:style="{width: emLeftPosition + 'px'}"></span>
                    <em v-bind:style="{left: emLeftPosition + 'px'}" @mousedown="startDrag" @touchstart="startDrag" @click="$event.stopPropagation();"></em>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* Start Header ------------------------------------------------------------

    Kodak Inc.
    Shanghai PDC China
    V5G 4M1

    Copyright(C) 2020 Kodak Inc.

    Reproduction or disclosure of this file or its contents without the
    prior written consent of Kodak is prohibited.

    File Name: Range.vue

    Purpose:

    Project: Kodak On Demand

* End Header--------------------------------------------------------------
*/
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Range extends Vue {
        @Prop() protected min!: number;
        @Prop() protected max!: number;
        @Prop() protected value!: number;
        @Prop() protected reversion!: boolean;
        @Prop() protected toFixed!: number;
        private barWidth!: number;

        public data() {
            if (typeof this.value == 'undefined') {
                this.$emit('input', this.getAverage());
            } else this.$emit('input', this.legalValue());
                
            return { barWidth: this.barWidth};
        }

        get emLeftPosition() {
            return (typeof this.value != 'undefined' && typeof this.max != 'undefined' && typeof this.min != 'undefined') && this.barWidth ?
                   ((this.value - this.min) / (this.max - this.min) * this.barWidth) : 0;
        }

        get emLeftPosition_reversion() {
            return (typeof this.value != 'undefined' && typeof this.max != 'undefined' && typeof this.min != 'undefined') && this.barWidth ?
                ((this.max - this.value) / (this.max - this.min) * this.barWidth) : 0;
        }

        public getAverage(): number {
            return Number(this.countToFixed((this.min + this.max) / 2));
        }

        public valueDiffer(distance: number): number {
            return distance / this.barWidth * (this.max - this.min);
        }

        public countToFixed(value: number): any {
            return this.toFixed ? value.toFixed(this.toFixed) : value;
        }

        public startDrag(event: MouseEvent | TouchEvent) {
            let ox: number = this.getX(event);
            document.onmousemove = this.moveFn(ox);
            document.ontouchmove = this.moveFn(ox);
            document.addEventListener('mouseup', this.endDrag);
            document.addEventListener('touchend', this.endDrag);
        }

        public moveFn(ox: number) {
            return (e: MouseEvent | TouchEvent) => {
                e.preventDefault();
                let cx: number = this.getX(e), distance = cx - ox, currentValue;
                if (distance > 0 && this.value + this.valueDiffer(distance) >= this.max) {
                    currentValue = this.max;
                } else if (distance < 0 && this.value + this.valueDiffer(distance) <= this.min) {
                    currentValue = this.min;
                } else {
                    currentValue = this.value + this.valueDiffer(distance);
                }
                this.$emit('input', Number(this.countToFixed(Number(currentValue))));
                ox = cx;
            };
        }

        public startDrag_reversion(event: MouseEvent | TouchEvent) {
            let ox: number = this.getX(event);
            document.onmousemove = this.moveFn_reversion(ox);
            document.ontouchmove = this.moveFn_reversion(ox);
            document.addEventListener('mouseup', this.endDrag);
            document.addEventListener('touchend', this.endDrag);
        }

        public moveFn_reversion(ox: number) {
            return (e: MouseEvent | TouchEvent) => {
                e.preventDefault();
                let cx = this.getX(e), distance = cx - ox, currentValue;
                if (distance > 0 && this.value - this.valueDiffer(distance) <= this.min) {
                    currentValue = this.min;
                } else if (distance < 0 && this.value - this.valueDiffer(distance) >= this.max) {
                    currentValue = this.max;
                } else {
                    currentValue = this.value - this.valueDiffer(distance);
                }
                this.$emit('input', Number(this.countToFixed(Number(currentValue))));
                ox = cx;
            };
        }

        public endDrag() {
            this.$emit('input', Number((this.value)));
            document.onmousemove = null;
            document.ontouchmove = null;
            document.removeEventListener('mouseup', this.endDrag);
            document.removeEventListener('touchend', this.endDrag);
        }

        public choosePoint(event: MouseEvent) {
            let pointX: number = event.offsetX,
                currentValue = this.reversion ? Number(this.countToFixed(this.max - this.valueDiffer(pointX))) :
                               Number(this.countToFixed(this.min + this.valueDiffer(pointX)));
            this.$emit('input', currentValue);
        }

        public legalValue() {
            let val = this.value;
            if (val - this.min < 0) {
                val = this.min;
            } else if (val - this.max > 0) {
                val = this.max;
            }
            return val;
        }

        mounted() {
            this.$watch('value', () => {
                this.$emit('input', this.legalValue());
            });
            if (this.$refs.bar) this.barWidth = (this.$refs.bar as any).clientWidth;
        }

        public getX (e: MouseEvent | TouchEvent){
            if(e.type.indexOf('mouse')>-1){
               return this.getMouseX(e as MouseEvent);
            }else if(e.type.indexOf('touch')>-1){
               return this.getTouchX(e as TouchEvent);
            }else return 0;
        }
        
        public getMouseX (e: MouseEvent): number {
            if (e.pageX) {
                return e.pageX;
            } else if (e.clientX) {
                let scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
                return e.clientX + scrollLeft;
            }
            return 0;
        }

        public getTouchX (e: TouchEvent): number {
            if (e.touches[0].pageX) {
                return e.touches[0].pageX;
            } else if (e.touches[0].clientX) {
                let scrollLeft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
                return e.touches[0].clientX + scrollLeft;
            }
            return 0;
        }
    }
</script>
<style scoped>
    .range > div {
        min-width: 100px;
        width: 100%;
        padding: 5px 0;
    }

    .bar {
        height: 6px;
        width: 100%;
        background: rgba(0,0,0,.15);
        border-radius: 6px;
        position: relative;
        cursor: pointer;
        transition: all .3s;
        -webkit-transition: all .3s;
    }

        .bar > em {
            position: absolute;
            left: 0;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            background: #40A9FF;
            line-height: initial;
            text-align: center;
            padding: 3px;
            top: 50%;
            margin: -7px 0 0 -7px;
            box-sizing: border-box;
            transition: background,transform .3s;
            -webkit-transition: background,-webkit-transform .3s;
        }

            .bar > span{
                display: block;
                width: 0;
                height: 100%;
                background: #40A9FF;
                border-radius: 6px;
                transition: background .3s;
                -webkit-transition: background .3s;
            }

            .bar > em:before {
                content: '';
                display: block;
                height: 8px;
                width: 8px;
                border-radius: 50%;
                background: #fff;
            }

        .bar:hover {
            background: rgba(0,0,0,.2);
        }

            .bar:hover > span {
                background: rgba(0,0,0,.2);
                background: #2094f3;
            }

        .bar > em:hover {
            transform: scale(1.1, 1.1);
            -webkit-transform: scale(1.1, 1.1);
            background: #2094f3;
        }
</style>