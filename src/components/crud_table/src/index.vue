<template>
  <div class="mnue-report" >
    <div class="mnue-table-header">
      <div class="mnue-table-header-title">{{title}}</div>
      <div class="mnue-table-head-left">
       <div class="mnue-table-head-condition">
         <div class="mnue-table-head-content">
           <slot name="condition">
           </slot>
         </div>
         <el-button type="primary"   v-if="$slots.condition" @click="query" style="margin-left: 10px">查询</el-button>
         <a class="mnue-header-more" v-if="$slots.condition && $slots['more-condition']" @click="showMoreCondition()">
           展开更多搜索 <i   :class="{'el-dropdown__icon el-icon-arrow-down':!moreCondition , 'el-dropdown__icon el-icon-arrow-up': moreCondition}"/>
         </a>
       </div>




      </div>
      <div class='mnue-table-head-right' v-if="windowWidth>1200">
        <div class="head-icon">
          <el-button @click="reset()" style="font-size:15px" v-if="buttonShow['reset']" >
            重置<i class="iconfont icon-shuaxin1" aria-hidden="true"></i>
          </el-button>
          <el-button @click="showFilterPage()" :type="filterSelected?'primary':'default'" style="font-size:15px" v-if="buttonShow['filter']">
            筛选<i class="iconfont icon-shaixuan2" aria-hidden="true"></i>
          </el-button>
          <el-button @click="showOrderPage()" :type="orderSelected?'primary':'default'" style="font-size:15px" v-if="buttonShow['order']">
            排序<i class="iconfont icon-paixu" aria-hidden="true"></i>
          </el-button>
          <el-button @click="addData()" style="font-size:15px" v-if="buttonShow['insert']">
            新增 <i class="fa fa-plus" aria-hidden="true"></i>
          </el-button>
          <el-button @click="updateData()" style="font-size:15px" v-if="buttonShow['update']" :disabled="!isSelected">
            修改 <i class="fa fa-pencil" aria-hidden="true"></i>
          </el-button>
          <el-button @click="deleteData()" style="font-size:15px" v-if="buttonShow['delete']" :disabled="!isSelected">
            删除 <i class="fa fa-trash" aria-hidden="true"></i>
          </el-button>
          <el-button @click="exportAll()" style="font-size:15px" v-if="buttonShow['export']">
            导出 <i class="fa fa-download" aria-hidden="true"></i>
          </el-button>

        </div>
      </div>
      <div class='mnue-table-head-right' v-if="windowWidth<=1200">
        <div class="head-icon">
          <el-button @click="reset()" style="font-size:15px" v-if="buttonShow['reset']"  title="重置">
            <i class="iconfont icon-shuaxin1" aria-hidden="true"></i>
          </el-button>
          <el-button @click="showFilterPage()" :type="filterSelected?'primary':'default'" style="font-size:15px" v-if="buttonShow['filter']" title="筛选">
            <i class="iconfont icon-shaixuan2" aria-hidden="true"></i>
          </el-button>
          <el-button @click="showOrderPage()" :type="orderSelected?'primary':'default'" style="font-size:15px" v-if="buttonShow['order']" title="排序">
            <i class="iconfont icon-paixu" aria-hidden="true"></i>
          </el-button>
          <el-button @click="addData()" style="font-size:15px" v-if="buttonShow['insert']" title="新增">
             <i class="fa fa-plus" aria-hidden="true"></i>
          </el-button>
          <el-button @click="updateData()" style="font-size:15px" v-if="buttonShow['update']" :disabled="!isSelected" title="修改">
             <i class="fa fa-pencil" aria-hidden="true"></i>
          </el-button>
          <el-button @click="deleteData()" style="font-size:15px" v-if="buttonShow['delete']" :disabled="!isSelected" title="删除">
             <i class="fa fa-trash" aria-hidden="true"></i>
          </el-button>
          <el-button @click="exportAll()" style="font-size:15px" v-if="buttonShow['export']" title="导出">
             <i class="fa fa-download" aria-hidden="true"></i>
          </el-button>

        </div>
      </div>
    </div>
    <div class="mnue-table-search-more" v-if = "moreCondition">
      <slot name="more-condition" >
      </slot>
    </div>
    <div class="mnue_body">
      <div class = "mnue_table">
        <egrid   :tableData=rows :columns=columns :colSlots=colSlots :binding="bindings"  :tableHeight="tableHeight" v-loading="querying" :on-row-click="getCurrentRow" :on-sort-change = "sortChange"> </egrid>
      </div>
    </div>

    <div class="mnue_footer"
         v-show="!showAllData">
      <div class="mnue_footer-pager">
        <page-footer
          :page-style="style"
          slot="footer"
          :current=index
          :size=size
          :total=total
          @change="handlePaginationChange"
        ></page-footer>
      </div>
    </div>

    <myue_dialog :visible="form_show" @close="closeDialog" :title="dialogTitle" :dialogWidth="dialogWidth" :model="formModel" :crud="crud" :isNew="isNew" :params="params">
      <slot name="form" slot="form" :model="formModel" :isNew = "isNew" ></slot>
    </myue_dialog>

    <crud-filter  ref= "filter" :dialog-visible="filterShow" :filter-data="filterData" :bindings="bindings">

    </crud-filter>
    <crud-order :dialog-visible="orderShow" :order-data="orderData">

    </crud-order>
  </div>

</template>

<script>

import Egrid from '../../egrid/src/index.vue'
import Myue_dialog from '../../Dialog/src/index.vue'
import request from '@/utils/request'
import { computed } from 'vue'
import { getMerchantList } from '@/api/qiyema/merchant'
import util from '@/utils/util'
// import CrudFilter from '@/components/crud_table/src/filter'
import VueTableExport from 'smart-table-export'


export default {
  created() {
    const getWindowInfo = () => {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    };
    const debounce = (fn, delay) => {
      let timer;
      return function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn();
        }, delay);
      }
    };
    const cancalDebounce = debounce(getWindowInfo, 500);

    window.addEventListener('resize', cancalDebounce);
  },
  name: 'crudTable',
  components: {Myue_dialog, Egrid,PageFooter: () => import('@/layout/header-aside/components/footer')},


  props: {
    power:{
      //权限
      type: Array,
      default:()=>["insert","update","delete","filter","order","export","reset"]
    },
    dialogWidth: {
      // 弹窗的宽度
      type: String,
      default: '60%'
    },
    sizeName:{
      type:String,
      default:"size"
    },
    indexName:{
      type:String,
      default:"index"
    },
    // tableStyle: {
    //   type: Object, default: {}
    // },
    footLoading:{
      type: Boolean, default: false
    },
    url:{
      type: String, default: ""
    },
    updateUrl:{
      type: String, default: ""
    },
    deleteUrl:{
      type: String, default: ""
    },
    insertUrl:{
      type: String, default: ""
    },
    queryUrl:{
      type: String, default: ""
    },
    title:{
  type: String, default: ""
    },
    columns: {
      type: Array, default: []
    },
    rowno: {//是否显示行号
      type: Boolean, default: false
    },
    rownoTitle: {
      type: String, default: '#'
    },
    checkable: {
      type: [Boolean, Function], default: false
    },
    stripe: {//是否为斑马纹 table
      type: Boolean, default: true
    },
    showAllData: {//不分页 展示全部数据
      type: Boolean, default: false
    },
    border: {//是否带有纵向边框
      type: Boolean, default: true
    },
    fit: {//列的宽度是否自撑开
      type: Boolean, default: true
    },
    showHeader: {//是否显示表头
      type: Boolean, default: true
    },
    currentRowKey: {//当前行的 key，只写属性
      type: String, default: '_id'
    },
    crud: {//
      type: Object, default: {}
    },
    rowClassName: [Object, Function],//行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
    rowStyle: Object,//行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
    rowKey: {//row-key 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的
      type: String, default: '_id'
    },
    beforeQuery: {type: Function, default: null}, // 主要作用查询参数的修改
    afterQuery: {type: Function, default: null}, // 主要作用查询结果的修改

    beforeSave: {type: Function, default: null},
    afterSave: {type: Function, default: null},

    beforeDelete: {type: Function, default: null},
    afterDelete: {type: Function, default: null},
    defaultSort: {
      default: function() {
        return { prop: null, order: null }
      }
    },//排序
    index: {//页码(仅用作行号计算)
      type: Number, default: 1
    },
    size: {//每页行数(仅用作行号计算)
      type: Number, default: 50
    },
    showSummary: { type: Boolean, default: false }, //是否在表尾显示合计行
    sumText: { type: String, default: '合计' }, //合计行第一列的文本
    summaryMethod: Object, //自定义的合计计算方法, 参数{columns,data}
    footer: Object, //后台计算的合计行
    bindings: { type: Object, default: {} }, //数据字典

  },


  methods: {
    showMoreCondition(){
      this.moreCondition = !this.moreCondition
    },
    sortChange(order) {
      debugger

      this.orders = [{"prop":order.prop,"operator":order.order=='ascending' ? 'asc' : 'desc'}]
      this.query()
    },
    exportAll(){
      let params = {
        conditions: util.deepClone(this.conditions || []),orders: util.deepClone(this.orders || [])
      };
      //this.clear();
      params.index = 1
      params.size = 9999
      let self = this
      this.loadData(params, this.isLoading).then(({rows, total}) => {
        rows.forEach((row,i)=>{
          for (let key in self.bindingDict){
            row[key] =  self.bindingDict[key][row[key]]
          }

        })
        VueTableExport.excel({
          columns: this.exportColumn,
          data: rows,
          title: this.title,
        })
      });
    },
    showFilterPage(){
      this.filterShow = true;
    },
    reset(){
      this.filterSelected = false;
      this.orderSelected = false;
      this.conditions = []
      this.orders = []
      this.$refs.filter.resetData() //修改子组件data
      this.query();
    },
    showOrderPage(){
      this.orderShow = true;
    },

    onRowClick(row, event){
      this.$parent.getCurrentRow(row)
     // this.$emit("row-click", row, event);
    },
    deleteData(){
      this.$confirm("确定要删除选中的记录吗?", "提示", {
        type: "warning",
        showClose: false,
      }).then(() => {
        this.crud.delete(this.formModel).then(res=>{
          if(res.status!=200||res.status!=200){
            this.$message.error("删除失败：" + res.message);
          }else{
            this.query();
            this.$message.success("删除成功");
          }


        });
      }).catch(() => {
      });
    },
    updateData(){
      this.formModel = util.deepClone(this.rowCopy)
      this.dialogTitle = '修改'
      this.form_show = true
      this.isNew = false;
    },
    GetFormData() {
      return new Promise((resolve, reject) => {
        this.saving = true;
        let model = util.deepClone(this.formModel);
        this.$refs.form.Validate(model).then(() => {
          this.saving = false;
          resolve({model, isNew});
        }).catch((error) => {
          this.saving = false;
          this.$refs.form.ShowError(error);
          reject({model, isNew, error});
        });
      });
    },
    onConfirm() {

    },
    getCurrentRow(row){
      this.isSelected = true
      this.rowCopy = util.deepClone(row)
      this.formModel = row;
    },
    clearCurentRow(){

      this.formModel = {}
    },
    close(){
      this.formModel = {}
      this.form_show = false;
    },
    clear(){
      this.formModel = {};
      // this.conditions = {};
      // this.index = 1;
      // this.size = 50;
    },
    // 分页变化改动
    handlePaginationChange(val) {
      this.index = val.current;
      this.size = val.size;
      this.query()
    },
    query(){
      this.formModel = {}
      this.isSelected = false
      let params = {
        conditions: util.deepClone(this.conditions || []),orders: util.deepClone(this.orders || [])
      };
      if(typeof this.beforeQuery === "function"){
        params = this.beforeQuery(params);
      }
      params.index = this.index
      params.size = this.size
      //this.clear();
      this.loadData(params, this.isLoading).then(({rows, total}) => {
        this.params = params;
        this.rows = rows;
        this.total = total;
      });
    },
    loadData(params){
      return new Promise((resolve,reject)=>{

        this.querying = true;
        let success =(json)=>{
          this.querying = false;
          if(typeof this.afterQuery == "function"){
            json = this.afterQuery(json);
          }
          if(json === false){
            return
          }
          resolve(json)
        };
        let fail = (msg)=>{
          this.querying = false;
          this.$message({message: `${t("查询报错")}：${msg}`, type: "error", showClose: true});
          reject(msg);
        };
        params[this.indexName] = params.index
        params[this.sizeName]  = params.size
        params["condition"] = this.conditions;
        params["order"] = this.order;
        let  result = this.crud.query(params)
        if(result instanceof Promise){
          result.then(
            success
          ).catch(
            fail
          )
        }else{
          result.done(success).fail(fail);
        }

      });
    },
    addData() {
      this.dialogTitle = '新增'
      this.formModel = {}
      this.form_show = true
      this.isNew = true;
    },
    closeDialog() {
      this.form_show = false
    },
    createFormatter(field,binding) {
      this.bindingDict[field] = {};
      let self = this;
      let b = this.bindings[binding];
      b.forEach((v, i) => {

        self.bindingDict[field][v.value] = v.name
      })
    }
  },
  data() {
    let colSlots = {...(this.colSlots||{}),...(this.$scopedSlots||{})};
    debugger
    return {
      windowHeight:null,
      windowWidth:window.innerWidth,
      //更多
      moreCondition:false,
      //是否被选中
      isSelected:false,
      //数据转化
      bindingDict:{},
      //导出行
      exportColumn:[],
      //筛选按钮类型
      filterSelected:false,
      //顺序
      orders:[],
      //条件
      conditions:[],
      //选中行拷贝
      rowCopy:{},
      //params入参
      params:{},
      //是否新增
      isNew:false,
      //表单数据
      formModel:{},
      //是否展示筛选框
      filterShow:false,
      //是否展排序选框
      orderShow:false,
      //筛选条件
      filterData:[],
      //排序条件
      orderData:[],
      //是否排序
      orderSelected:false,
      rows:[],
      total:0,
      querying: false, // 查询遮罩
      style:{margin: "0px 0px"},
      dialogTitle: '',
      colSlots: colSlots,
      form_show: false,
      tableHeight:0,
      buttonShow:{}
    }
  },
  mounted(){



    this.power.forEach((v,i) =>{
      this.buttonShow[v] = true
    })
    this.columns.forEach((v,i)=>{
      if(v.binding){
        debugger
        this.createFormatter(
           v.props.prop,v.binding
        );
      }

      this.exportColumn.push(util.deepClone(v.props))
      if(v.FilterEnabled){
        let fd = util.deepClone(v.props);
        fd.operator = "="

        if(v.binding){
          fd.DataType = "map"
        }else{
          if(v.DataType){
            fd.DataType = v.DataType
          }else{
            fd.DataType = "string"
          }
        }



        if(v.binding){

          fd.binding = v.binding
        }

        this.filterData.push(fd);
      }
      if(v.OrderEnabled){
        let fd = util.deepClone(v.props);
        this.orderData.push(fd);
      }
    })


    this.$nextTick(() => {
      this.tableHeight = $('.mnue-report').parent().height() - 85
    })
    this.query()
  }

}

</script>
