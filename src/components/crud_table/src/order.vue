<template>
  <div class="dialog">
    <el-dialog
      title="过滤"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="525px"
      class="my-info-dialog"
      @closed="close"
    >

      <!-- 底部弹窗页脚 -->
      <template slot="footer">
        <el-button type="primary" @click="onsubmit()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </template>
      <el-scrollbar wrap-class="hd-form-dialog__wrap"
                    :wrap-style="[{'height': maxHeight + 'px'}]">
        <el-form class="mnue-form" ref="form">
          <egrid :tableData=tableData :colSlots=colSlots :columns=columns headerBorderColor="#ddd" :tableHeight="505" v-if="loading">
            <template slot="filterSelect" slot-scope="scope">
              <el-select v-model="scope.row.prop" @change="changeField(scope.row)">
                <el-option
                  v-for="item in labels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot="operatorSelect" slot-scope="scope">
              <el-select v-model="scope.row.operator" clearable
                         value>
                <el-option
                  v-for="item in operator"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot="actionButton" slot-scope="scope">
              <el-button size="mini"  @click="up(scope.row.num)" :disabled="scope.row.num===1" >
                <i class="el-icon-arrow-up"></i>
              </el-button>
              <el-button size="mini" @click="down(scope.row.num)"  :disabled="scope.row.num===(tableData.length) ">
                <i class="el-icon-arrow-down" ></i>
              </el-button>
            </template>
          </egrid>
        </el-form>
      </el-scrollbar>
    </el-dialog>

  </div>
</template>
<script>

import util from '@/utils/util'

export default {
  name: 'crudOrder',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    orderData: {
      type: Array,
      default: []
    }
  },

  methods: {
    up(i){
      let upDate = this.tableData[i - 1];
      upDate.num = i - 1;
      this.tableData.splice(i - 1, 1);
      this.tableData[i-2].num = i;
      this.tableData.splice(i - 2, 0, upDate);
    },
    down(i){
      let upDate = this.tableData[i - 1];
      upDate.num = i + 1;
      this.tableData.splice(i - 1, 1);
      this.tableData[i-1].num = i;
      this.tableData.splice(i, 0, upDate);
    },
    // 关闭弹窗触发
    close(){
      this.dialogVisible = false
      this.$parent.orderShow = false
      this.$emit('close')         // 通过 this.$emit() 向父组件传值
    },
    //提交筛选
    onsubmit(){
      let orders = this.tableData.filter((v)=>{return v.operator!=null&&v.operator!=""&&v.operator!=undefined})
      debugger
      if(orders.length>0){
        this.$parent.orderSelected = true
      }else{
        this.$parent.orderSelected = false
      }
      this.$parent.orders = orders
      this.close();
      this.$parent.query();
    },
    //切换字段
    changeField(row) {
      row.value = null
      $.extend(row, this.fieldDict[row.prop])
    },
  },
  data() {

    let colSlots = { ...(this.$slots | {}), ...(this.$scopedSlots || {}) }

    console.log(this.filterData)
    return {
      loading:true,
      maxHeight: 524,
      columns: [
        { props: { 'label': '#', 'width': '50px', 'prop': 'num', 'align': 'center' } },
        { props: { 'label': '字段', 'width': '200px', 'prop': 'label', 'align': 'center' }},
        {
          props: { 'label': '排序', 'width': '100px', 'prop': 'operator', 'align': 'center' }, 'scoped': 'operatorSelect'
        },
        { props: { 'label': '操作', 'width': '160px', 'prop': 'action', 'align': 'center' }, 'scoped': 'actionButton' }
      ],
      //条件字典
      fieldDict: {},
      colSlots: colSlots,
      operator:[
        { 'label': '正序', 'value': 'asc' },
        { 'label': '倒序', 'value': 'desc' }
      ],
      deleteData: [],
      labels: [],
      tableData: [],
      options: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      let labels = []
      this.orderData.forEach((v, i) => {
        this.fieldDict[v.prop] = {
          'DataType': v.DataType,
          'binding': v.binding ? v.binding : null
        }
        labels.push({ 'value': v.prop, 'label': v.label })
      })
      this.labels = labels

      this.tableData = util.deepClone(this.orderData)
      this.tableData.forEach((v, i) => {
        // v["value"] = "";
        v['num'] = i + 1
      })
    })
  }

}

</script>

