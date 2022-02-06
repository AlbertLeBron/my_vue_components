<template>
    <div class="dotLine">
        <div>
            <div class="bar" ref="bar">
                <div class="barGradu"><span v-for="(item, index) in (close ? graduations.concat(graduations[0]) : graduations)" :key="'b_'+index" :style="{left: index*(barWidth ? barWidth/(unit-1) : 0) + 'px'}"><i :style="{width: (barWidth ? 2*barWidth/(unit-1) : 0) + 'px', marginLeft: (barWidth ? -1*barWidth/(unit-1) : 0) + 'px'}">{{item}}</i></span></div>
                <template v-for="(item, index) in valueSorted">
                    <div :key="'l_'+index" class="barTouch" :style="{left: index > 0 ? (emLeftPosition[index-1] + 'px') : 0, width: (emLeftPosition[index] - (index > 0 ? emLeftPosition[index-1] : 0)) + 'px', background: colorPool[index % 12]}"
                         @mouseenter="barInfo = {left: index > 0 ? (emLeftPosition[index-1]+emLeftPosition[index])/2 : emLeftPosition[index]/2, info: item.info}" @mouseleave="barInfo = null"></div>
                    <em :key="'d_'+index" :class="{disable: item.forzen}" :name="typeof item.name !='undefined' ? item.name : ''" :style="{left: emLeftPosition[index] + 'px', background: colorPool[index % 12], info: item.info}" @mousedown.stop="startDrag($event, item);" @touchstart.stop="startDrag($event, item);"></em>
                </template>
                <div :class="['barInfo', {show: !!barInfo && barInfo.info}]" :style="{ left: barInfo ? (barInfo.left + 'px') : 0 }" v-html="barInfo && barInfo.info"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class DotLine extends Vue {
        @Prop() protected graduations!: string[];
        @Prop() protected value!: any[];
        @Prop() protected close!: boolean;
        private min: number = 0;
        private barWidth!: number;
        private curDot!: any;
        private barInfo!: any;
        private colorPool = ['#0546ff', '#d0e92b','#fb9904', '#a8184b', '#0392ce', '#fffe32', 
                             '#ff5309', '#8703af','#3d03a5', '#66b132', '#fabc05', '#fe2512'];

        public data() {
            if (typeof this.value == 'undefined') {
                this.$emit('input', []);
            } else this.legalValue();
                
            return { barInfo: this.barInfo, barWidth: this.barWidth};
        }

        get max() {
            return this.graduations && this.graduations.length ? (this.close ? this.graduations.length : this.graduations.length - 1) : 0;
        }

        get unit() {
            return this.max + 1;
        }

        get valueSorted() {
            return this.value ? ([] as any).concat(this.value).sort((a: any, b: any) => a.val - b.val) : [];
        }

        get emLeftPosition() {
            let value = this.valueSorted, pos: any[] = [];
            value.forEach((item: any) => {
                pos.push((typeof item.val != 'undefined' && typeof this.max != 'undefined' && typeof this.min != 'undefined') && this.barWidth ?
                    ((item.val - this.min) / (this.max - this.min) * this.barWidth) : 0);
            })
            return pos;
        }

        public roundVal(val: any) {
            return Math.round(Number(val));
        }

        public valueDiffer(distance: number): number {
            return distance / this.barWidth * (this.max - this.min);
        }

        public startDrag(event: MouseEvent | TouchEvent, item: any) {
            this.curDot = { item: item};
            let value = this.valueSorted,
                lastDot = value.indexOf(this.curDot.item) > 0 ?
                    {
                        item: value[value.indexOf(this.curDot.item) - 1],
                        boundary: value[value.indexOf(this.curDot.item) - 1].val + this.valueDiffer((event.currentTarget as HTMLElement).clientWidth)
                    } : undefined,
                nextDot = value.indexOf(this.curDot.item) < value.length - 1 ?
                    {
                        item: value[value.indexOf(this.curDot.item) + 1],
                        boundary: value[value.indexOf(this.curDot.item) + 1].val - this.valueDiffer((event.currentTarget as HTMLElement).clientWidth)
                    } : undefined,
                ox: number = this.getX(event), _this = this,
                options = { capture: true, passive: false },
                moveFn = (e: MouseEvent | TouchEvent) => {
                    e.stopPropagation();
                    e.preventDefault();              
                    let cx = this.getX(e), distance = cx - ox;
                    if (distance == 0) return;
                    let currentValue;
                    this.curDot.nearVal = undefined;
                    if (distance > 0 && this.curDot.item.val + this.valueDiffer(distance) >= (nextDot ? nextDot.boundary : this.max)) {
                        if (nextDot) {
                            currentValue = nextDot.boundary;
                            this.curDot.nearVal = nextDot.item.val - 1;
                        } else currentValue = this.max;                    
                    } else if (distance < 0 && this.curDot.item.val + this.valueDiffer(distance) <= (lastDot ? lastDot.boundary : (this.close ? this.min + 1 : this.min))) {
                        if (lastDot) {
                            currentValue = lastDot.boundary;
                            this.curDot.nearVal = lastDot.item.val + 1;
                        } else currentValue = this.close ? this.min + 1 : this.min;
                    } else {
                        currentValue = this.curDot.item.val + this.valueDiffer(distance);
                        if (nextDot && Math.round(Number(currentValue)) == nextDot.item.val){
                            this.curDot.nearVal = nextDot.item.val - 1;
                        } else if (lastDot && Math.round(Number(currentValue)) == lastDot.item.val) {
                            this.curDot.nearVal = lastDot.item.val + 1;
                        }                    
                    }
                    this.curDot.item.val = Number(currentValue);
                    ox = cx;
                };

            document.addEventListener('mousemove', moveFn, options);
            document.addEventListener('touchmove', moveFn, options);
            document.addEventListener('mouseup', endDrag, options);
            document.addEventListener('touchend', endDrag, options);

            function endDrag(e: MouseEvent | TouchEvent) {
                e.stopPropagation();
                e.preventDefault();
                _this.curDot.item.val = _this.curDot.nearVal != undefined ? _this.curDot.nearVal : Math.round(Number(_this.curDot.item.val));
                _this.curDot = null;
                document.removeEventListener('mousemove', moveFn, options);
                document.removeEventListener('touchmove', moveFn, options);
                document.removeEventListener('mouseup', endDrag, options);
                document.removeEventListener('touchend', endDrag, options);
            }
        }

        public legalValue() {
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i].val - this.min < 0) {
                    this.value[i].val = this.min;
                } else if (this.value[i].val - this.max > 0) {
                    this.value[i].val = this.max;
                }
                if (this.value.find((p: any) => p.val == this.value[i].val) !== this.value[i]) {
                    this.value.splice(i, 1);
                    i--;
                }
            }
        }

        mounted() {
            this.$watch('value', () => {
                if (typeof this.value == 'undefined') {
                    this.$emit('input', []);
                } else this.legalValue();
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
    .dotLine{
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }

    .dotLine > div {
        min-width: 100px;
        width: 100%;
        padding: 30px 0 30px;
    }

    .bar {
        height: 6px;
        width: 100%;
        background: rgba(0,0,0,.15);
        position: relative;
        transition: all .3s;
        -webkit-transition: all .3s;
    }

        .bar > .barTouch {
            height: 100%;
            position: absolute;
            cursor: pointer;
        }

            .bar > .barTouch:before {
                content: '';
                display: block;
                height: 100%;
                background: transparent;
                transition: background .2s;
                -webkit-transition: background .2s;
            }

            .bar > .barTouch:hover:before {
                background: rgba(0,0,0,.1);
            }

        .barGradu > span {
            position: absolute;
            left: 0;
            height: 8px;
            width: 2px;
            margin-left: -1px;
            background: rgba(0,0,0,.1);
            text-align: center;
            z-index: 2;
            pointer-events: none;
        }

        .barGradu > span:nth-child(even){
            bottom: 6px;
        }

        .barGradu > span:nth-child(odd){
            top: 6px;
        }

            .barGradu > span > i {
                display: inline-block;;
                position:absolute;
                font-style:normal;
            }

            .barGradu > span:nth-child(even)>i {
                top: -20px;
            }

            .barGradu > span:nth-child(odd)>i {
                bottom: -20px;
            }

        .bar > em {
            position: absolute;
            left: 0;
            border-radius: 50%;
            background: #40A9FF;
            text-align: center;
            top: 50%;
            height: 32px;
            width: 32px;
            margin: -16px 0 0 -16px;
            cursor: pointer;
            z-index: 3;
            overflow: hidden;
            transition: background,transform .2s;
            -webkit-transition: background,-webkit-transform .2s;
            font-style: normal;
            font-size: 13px;
        }

            .bar > em.disable {
                pointer-events: none;
            }

            .bar > em:hover {
                transform: scale(1.1, 1.1);
                -webkit-transform: scale(1.1, 1.1);
            }

            .bar > em:before {
                content: '';
                display: block;
                height: 100%;
                background: transparent;
                transition: background .2s;
                -webkit-transition: background .2s;
            }

            .bar > em:hover:before {
                background: rgba(0,0,0,.1);
            }

            .bar > em:after {
                content: attr(name);
                display: block;
                height: 26px;
                width: 26px;
                top: 50%;
                left: 50%;
                margin: -13px 0 0 -13px;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                line-height: 26px;
            }

        .bar > .barInfo {
            position: absolute;
            width: 100px;
            top: 20px;
            word-wrap: break-word;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            white-space: pre-wrap;
            background-color: rgba(50, 50, 50, .9);
            padding: 8px 10px;
            box-shadow: 0 2px 6px 0 rgba(0,0,0,.5);
            color: #ffffff;
            display: inline-block;
            margin-left: -50px;
            pointer-events: none;
            transition: none;
            -webkit-transition: none;
        }

        .bar > .barInfo:before {
            content: '';
            display:block;
            position: absolute;
            top: -6px;
            left: 50%;
            margin-left: -6px;
            width: 0;
            height: 0;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-bottom: 6px solid rgba(50, 50, 50, .9);           
        }

            .bar > .barInfo.show {
                opacity: 1;
                pointer-events: auto;
                transition: opacity .5s;
                -webkit-transition: opacity .5s;
            }
</style>