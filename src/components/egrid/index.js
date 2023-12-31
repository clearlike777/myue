import egrid from './src/index.vue';
/* istanbul ignore next */
egrid.install = function(Vue) {
  Vue.component(egrid.name, egrid);
};

export default egrid;
