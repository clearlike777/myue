import crud_table from './src/index.vue';
import crud_filter from "./src/filter";
import crud_order from "./src/order";

let components = [crud_table, crud_filter,crud_order];

components.forEach((component) => {
  component.install = (Vue) => {
    Vue.component(component.name, component);
  };
});


export default {...components};
