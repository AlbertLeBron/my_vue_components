export const setFixedPosition = (ele: HTMLElement, event: MouseEvent, referenceDom?: any, direction?: any) => {
    if (ele) {
        const xpos = event.clientX;
        const ypos = event.clientY;

        const ww = (document.documentElement as HTMLElement).clientWidth || document.body.clientWidth,
              mw = ele.getBoundingClientRect().width;
        const x = direction?.x ? direction.x === 'left' ? xpos : xpos - (mw - (referenceDom?.getBoundingClientRect().width || 0)) : xpos + mw > ww ? xpos - (mw - (referenceDom?.getBoundingClientRect().width || 0)) : xpos;

        const wh = (document.documentElement as HTMLElement).clientHeight || document.body.clientHeight,
              mh = ele.getBoundingClientRect().height;
        const y = direction?.y ? direction.y === 'top' ? ypos : ypos + (referenceDom?.getBoundingClientRect().height || 0) : ypos + mh + (referenceDom?.getBoundingClientRect().height || 0) > wh ? ypos - mh : ypos + (referenceDom?.getBoundingClientRect().height || 0);

        ele.style.left = x + 'px';
        ele.style.top = y + 'px';
    }
}

export const throttle = (func: any, wait: number, context: any) => {
    let timeHandler!: any;
    return function (...args: any[]) {
        if (timeHandler) {
            return;
        }
        timeHandler = setTimeout(() => {
            func.apply(context, args);
            timeHandler = null;
        }, wait);
    };
};

export const guid = (): string => {
    return ('' + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, ch => {
        const c = Number(ch);
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    });
}