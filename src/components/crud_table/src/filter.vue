<template>
  <div class="mnue_dialog">
    <el-dialog
      title="过滤"
      class="my-info-dialog"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="640px"
      @closed="close"
    >

      <!-- 底部弹窗页脚 -->
      <template slot="footer">
        <el-button type="primary" @click="onsubmit()">确定</el-button>
        <el-button @click="addConditions()">新增条件</el-button>
        <el-button @click="close()">取消</el-button>
      </template>
      <el-scrollbar wrap-class="hd-form-dialog__wrap"
                    :wrap-style="[{'height': maxHeight + 'px'}]">
        <el-form class="mnue-form" ref="form">
          <egrid :tableData=tableData :colSlots=colSlots :columns=columns headerBorderColor="#ddd">
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
              <el-select v-model="scope.row.operator">
                <el-option
                  v-for="item in operator[scope.row.DataType]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template slot="actionButton" slot-scope="scope">
              <span class="deleteSpan" @click="deleteItem(scope.row)">删除</span>
            </template>
            <template slot="filterValue" slot-scope="scope">
              <template v-if="scope.row.binding">
                <el-select
                  v-model="scope.row.value"
                  placeholder="请选择"
                  clearable
                  value
                >
                  <el-option
                    v-for="item in bindings[scope.row.binding]"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </template>
              <template v-else-if="scope.row.DataType == 'date'">
                <el-date-picker
                  v-model="scope.row.value"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </template>
              <template v-else>
                <el-input v-model="scope.row.value"></el-input>
              </template>
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
  name: 'crudFilter',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    filterData: {
      type: Array,
      default: []
    },
    bindings: {
      type: Object,
      default: {}
    }
  },

  methods: {
    resetData(){
      debugger
      this.searchData = this.tableData = util.deepClone(this.filterData)
    },
    // 关闭弹窗触发
    close(value){
      debugger

      //this.dialogVisible = false
      if( this.$parent.filterShow){
        this.$parent.filterShow = false
        if(!value){
          this.tableData = util.deepClone(this.searchData);
        }
      }

    },
    //提交筛选
    onsubmit(){

      let conditions = this.tableData.filter((v)=>{return v.value!=null&&v.value!=""&&v.value!=undefined})
      if(conditions.length>0){
        this.$parent.filterSelected = true
      }else{
        this.$parent.filterSelected = false
      }
      this.$parent.conditions = conditions
      this.searchData = util.deepClone(this.tableData);
      this.close(true);

      this.$parent.query();

    },
    //切换字段
    changeField(row) {
      row.value = null
      $.extend(row, this.fieldDict[row.prop])
    },
    //添加条件
    addConditions() {
      if (this.deleteData.length > 0) {
        let current = this.deleteData[0]
        current.num = this.tableData.length + 1
        this.tableData.push(current)
        this.deleteData.splice(0, 1)

      } else {
        let current = util.deepClone(this.tableData[0])
        current.num = this.tableData.length + 1
        this.tableData.push(current)
      }
    },
    //删除条件
    deleteItem(row) {
      this.deleteData = this.deleteData.concat(...this.tableData.filter(item => item.num == row.num))
      console.log(this.deleteData)
      this.tableData = this.tableData.filter(item => item.num != row.num)
      this.tableData.forEach((v, i) => {
        if (v.num > row.num) {
          v.num = v.num - 1
        }
      })
    }
  },
  data() {

    let colSlots = { ...(this.$slots | {}), ...(this.$scopedSlots || {}) }

    console.log(this.filterData)
    return {
      searchData:[],
      maxHeight: 524,
      columns: [
        { props: { 'label': '#', 'width': '50px', 'prop': 'num', 'align': 'center' } },
        { props: { 'label': '字段', 'width': '200px', 'prop': 'label', 'align': 'center' }, 'scoped': 'filterSelect' },
        {
          props: { 'label': '关系', 'width': '100px', 'prop': 'operator', 'align': 'center' },
          'scoped': 'operatorSelect'
        },
        { props: { 'label': '值', 'width': '226px', 'prop': 'value', 'align': 'center' }, 'scoped': 'filterValue' },
        { props: { 'label': '操作', 'width': '50px', 'prop': 'action', 'align': 'center' }, 'scoped': 'actionButton' }
      ],
      //条件字典
      fieldDict: {},
      colSlots: colSlots,
      operator: {
        string: [
          { 'label': '等于', 'value': '=' },
          { 'label': '包含', 'value': 'like' }
        ],
        number: [
          { 'label': '等于', 'value': '=' },
          { 'label': '大于', 'value': '>' },
          { 'label': '大于等于', 'value': '>=' },
          { 'label': '小于', 'value': '<' },
          { 'label': '小于等于', 'value': '<=' }
        ],
        date: [
          { 'label': '等于', 'value': '=' },
          { 'label': '大于', 'value': '>' },
          { 'label': '大于等于', 'value': '>=' },
          { 'label': '小于', 'value': '<' },
          { 'label': '小于等于', 'value': '<=' }
        ],
        map: [
          { 'label': '等于', 'value': '=' }
        ]
      },
      deleteData: [],
      labels: [],
      tableData: [],
      options: []
    }
  },
  mounted() {
    this.$nextTick(() => {

      let labels = []
      this.filterData.forEach((v, i) => {
        this.fieldDict[v.prop] = {
          'DataType': v.DataType,
          'binding': v.binding ? v.binding : null
        }
        labels.push({ 'value': v.prop, 'label': v.label })
      })
      this.labels = labels
      this.filterData.forEach((v, i) => {
        // v["value"] = "";
        v['num'] = i + 1
      })
      this.searchData = this.tableData = util.deepClone(this.filterData)

    })
  }

}

</script>

<style >


</style>
