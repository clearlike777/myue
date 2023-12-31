import myue_dialog from "./src/index.vue";
import myue_view from "./src/itemIndex";
let components = [myue_dialog, myue_view];

components.forEach((component) => {
    component.install = (Vue) => {
        Vue.component(component.name, component);
    };
});


export default {...components};
