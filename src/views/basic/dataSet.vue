<template>
  <crudTable :coldef="coldef"/>
</template>

<script>
export default {

  data () {

    return {
      coldef: [
        {props: {'label': '数据源名称', 'min-width': '10%', 'prop': 'title', 'align': 'center'}},
        {props: {'label': '数据库类型', 'min-width': '10%', 'prop': 'type', 'align': 'center'}},
        {props: {'label': '连接URL', 'min-width': '10%', 'prop': 'url', 'align': 'center'}},
        {props: {'label': '端口', 'min-width': '10%', 'prop': 'port', 'align': 'center'}},
        {props: {'label': '数据库名称', 'min-width': '10%', 'prop': 'name', 'align': 'center'}},
        {props: {'label': '数据库编码', 'min-width': '10%', 'prop': 'code', 'align': 'center'}},
        {props: {'label': '最大连接数', 'min-width': '10%', 'prop': 'max_link', 'align': 'center'}},
        {props: {'label': '用户名', 'min-width': '10%', 'prop': 'userName', 'align': 'center'}},
        {props: {'label': '密码', 'min-width': '10%', 'prop': 'password', 'align': 'center'}},
        {props: {'label': '状态', 'min-width': '5%', 'prop': 'state', 'align': 'center'}},
        {props: {'label': '排序', 'min-width': '5%', 'prop': 'sort', 'align': 'center'}}
      ]
    }
  },
  methods: {
    getTree () {

    }
  },
  computed () {
  },
  mounted () {

  }
}
</script>

<style lang="less">
.dataSet {
  height: 100%;
  width: 100%;

  .wrap-tree {
    margin: 5px 5px 5px 5px;
    width: 13%;
    height: calc(~'100% - 10px');
    float: left;

    .tools {
      padding-left: 10px;

      .my-filter {
        width: 100%;
      }

      .my-btn {
        float: right;
      }
    }

    .tree_btn {
      text-align: right;
      min-height: 30px;
      // padding-top: 6px;
    }

    .tree {
      height: calc(~'100% - 30px');
    }
  }
}
</style>
