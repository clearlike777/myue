<template>
<div>
  <div class="head">
    <div class="head-left" ><div class="title">数据库链接</div></div>
    <div class="head-icon">
      <el-button size="mini" class="el-icon-plus"></el-button>
      <el-button size="mini" class="el-icon-edit"></el-button>
      <el-button size="mini"  class="el-icon-delete"></el-button>
    </div>

  </div>
  <el-tabs type="border-card"  tab-position="bottom" style="margin-top: 15px">
    <el-tab-pane label="数据库链接">  <el-table
      :data="tableData"
      style="width: 100%;height:710px;">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table></el-tab-pane>
    <el-tab-pane label="接口链接"> <el-table
      :data="tableData"
      style="width: 100%;height:750px">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table></el-tab-pane>
  </el-tabs>
</div>
</template>


<script>
export default {
  name: "dataSource",
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}

</script>

<style lang="less">
  .head{
    height: 40px;
    display:inline;
    .head-left{
      height: 10px;
      border-left:3px solid blue;
      .title{
        font-size: 15px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 5px;

        display:inline;

      }
      display:inline;
    }
    .head-icon{
      float: right;
    }
    .head-right{
      display:inline;
    }
  }
</style>
