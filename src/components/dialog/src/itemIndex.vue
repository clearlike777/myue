<template>
  <div class="mnue-form-item"
       :class="{'is-error': isError,
         'is-label-hidden': labelHidden, 'label-align-left': labelAlign === 'left',
         'label-align-right': labelAlign === 'right'}">
    <div class="mnue-form-item__label">
      <slot name="label-container">
        <span class="mnue-form-item__label-required" v-if="isRequired">*</span>
        <span class="mnue-form-item__label-text">
                <slot name="label">{{label}}</slot>
            </span>
      </slot>
    </div>
    <div class="mnue-form-item__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MnueFormItem",
  componentName: "MnueFormItem",
  inject: ["FORM"],
  components: {},
  props: {
    label: {type: String, default: ""},
    field: {type: String, default: ""},
    labelWidth: {type: Number, default: 0},
    labelAlign: {type: String, default: ""},
    labelLine: {type: [Boolean, Number, String], default: null},
    labelHidden: {type: Boolean, default: false},
    required: {type: Boolean, default: false},
    rules: {
      type: Array, default() {
        return [];
      }
    }
  },
  data() {
    return {
      isError: false
    };
  },
  computed: {
    isRequired() {
      return this.required || this.rules.filter((r) => {
        return !!r.required;
      }).length > 0;
    },
  },
  methods: {},
  mounted() {
    if (this.FORM) {
      this.FORM.addItem(this);
    }
  },
  beforeDestroy() {
    if (this.FORM) {
      this.FORM.removeItem(this);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
