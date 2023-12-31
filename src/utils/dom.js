import scrollIntoView from "element-ui/src/utils/scroll-into-view";

export const ScrollIntoView = (container, selected) => {
    if(!container){
        return;
    }
    scrollIntoView(container, selected);
};