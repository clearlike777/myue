<script lang="ts">
import {defineComponent} from 'vue';
// import {ElTable,ElTableColumn} from 'element-ui'

export default defineComponent({
  name: 'egrid',
  props: {
    //表头边框颜色
    headerBorderColor: {
      type: String,
      default: '#ddd'
    },

    //数据字典
    //表头边框颜色
    binding: {
      type: Object,
      default: () => {}
    },
    //默认高度
    tableHeight: {
      type: Number,
      default: 80
    },
    title: String,
    tableData: {
      type: Array,
      default: []
    },
    onSortChange:{ type: Function, default: null },
    onRowClick: {
      type: Function, default: null
    }, //用于自定义创建操作
    colSlots: {},
    // tableStyle:{
    //   // table样式
    //   type: Object,
    //   default: {}
    // },
    crud: {},
    height: Number,
    columns: {
      type: Array, default: [
        {props: {"label": "日期", "width": 300, "prop": "date"}},
        {props: {"label": "名称", "width": 300, "prop": "name"}},
        {props: {"label": "地址", "width": 300, "prop": "address"}}
      ]
    },


  },
  data() {
    return {
      bindingDict: {}

    }
  },
  methods: {
    createFormatter(field) {

      this.bindingDict[field] = {};
      let b = this.binding[field];
      b.forEach((v, i) => {
        this.bindingDict[field][v.value] = v.name
      })

    }
  },
  render(createElement) {
    //创建列
    // let scopedCol = this.$slots;
    let scopedCol = {...(this.colSlots || {}), ...this.$slots, ...this.$scopedSlots};
    let self = this
    let _createColumn = (col) => {
      // 非合并列
      if ((col.children || []).length == 0) {

        let set = {
          props: col.props, scopedSlots: col.scopedSlots || null
        };

        // formatter方法转换成作用域插槽，支持html代码。
        let scopedSlots = null;


        // 作用域插槽设置，直接调用gird组件可以使用template和插槽名的方式; 否则必须使用createElement方式。
        if (col.scoped) {

          // col.formatter = () => ""; //作用于插槽，取消formatter。
          if (typeof col.scoped == "function") {
            scopedSlots = (scope) => {
              return createElement("div",
                {"class": `scpcell--${col.props.prop}`},
                [col.scoped(createElement, scope)]);
            };
          }
          //模板插槽名方式渲染作用于插槽
          else if (scopedCol && scopedCol[col.scoped]) {
            // return createElement("el-table-column", {pros: col.props}, );
            scopedSlots = (scope) => {
              return createElement("div",
                {"class": `scpcell--${col.props.prop}`},
                [scopedCol[col.scoped](scope)]);
            };
            return createElement("el-table-column", set, [scopedSlots]);

          }
        }
        else if (col.binding) {


          if (this.binding[col.binding]) {
            self.createFormatter(col.binding)
            col.props.formatter = function (row){
              return   self.bindingDict[col.binding][row[col.props.prop]]
            }
          }
        }
        if (this.showSummary && col.source) {
          let tempScoped = scopedSlots;
          //开启合计，改写scopedSlots
          if (col.source.data == this.dataCols[0].data) {
            // 首列
            scopedSlots = (scope) => {
              if (scope.row.__summary) {
                return this.sumText;
              } else if (typeof tempScoped == "function") {
                return tempScoped(scope);
              } else {
                return this.getValue(scope.row, col.source.data)
              }
            };
          } else if (col.source.type != "number") {
            // 非数字列
            scopedSlots = (scope) => {
              if (scope.row.__summary) {
                return this.getValue(scope.row, col.source.data);
              } else if (typeof tempScoped == "function") {
                return tempScoped(scope);
              } else {
                return this.getValue(scope.row, col.source.data);
              }
            };
          }
        }
        // if(scopedSlots){
        //   set.scopedSlots = {default: scopedSlots};
        // }

        return createElement("el-table-column", set);
      }
      // 合并列
      return createElement("el-table-column", {pros: col.props},
        col.children.map(_createColumn)
      );
    };
    let _data = this.tableData || []
    let data = [..._data]
    let grid = createElement("el-table", {
      'class': 'mn-egrid',
      "ref":"mn-egrid",
      props: {
        data: data,
        "style": "width:100%;position;font-color:black",
        "border": true,
        "highlight-current-row": true,
        "height": "100%",
        "header-cell-style": {
          background: '#f1f1f1',
          "color":"black",
          height: '30px',
          'border-color': this.headerBorderColor,
          "&.el-table--border th": {"border-right-width": "1px"}
        },
      },
      ["onUpdate:data"]: (data) => {
        this.data = data;
      },
      on: {
        "row-click": this.onRowClick,
        "sort-change":this.onSortChange,
      },
      'empty-text': '暂无数据',
      'show-summary': false,

    }, this.columns.map(_createColumn));

    return grid;

  }
});
</script>
