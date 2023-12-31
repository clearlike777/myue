import Vue from "vue";

const Handler = {
    value: 0,
    calc: () => {
        if(Vue.prototype.$isServer){
            return 0;
        }
        if(Handler.value){
            return Handler.value;
        }

        const outer = document.createElement("div");
        outer.className = "el-scrollbar__wrap";
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.position = "absolute";
        outer.style.top = "-9999px";
        document.body.appendChild(outer);

        const widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";

        const inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        const widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        Handler.value = widthNoScroll - widthWithScroll;

        return Handler.value;
    }
};

export default Handler;