<template>
  <div class="mnue_dialog">
    <el-dialog
        :title="title"
        class="my-info-dialog"
        :showClose="showClose"
        :visible.sync="dialogVisible"
        :center="center"
        :append-to-body="true"
        :width="dialogWidth"
        :close-on-click-modal="clickModalClose"
        @closed="close"
    >
      <!-- 底部弹窗页脚 -->
      <template slot="footer">
        <el-button type="primary" @click="submit()" >确定</el-button>
        <el-button  @click="close()" >取消</el-button>
      </template>
      <el-scrollbar wrap-class="hd-form-dialog__wrap"
                    :wrap-style="[{'max-height': maxHeight + 'px'}]">
        <el-form class="hd-form hd-form-group" ref="form">
            <slot name="form"></slot>
        </el-form>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';

export default defineComponent({
  name: "MnueDialog",
  componentName: "MnueDialog",
  components: {},
  provide(){
    return {
      FORM: this
    };
  },
  props: {
    params:{
      type:Object,
      default:{}
    },
    //是否新增
    isNew:{
      type:Boolean,
      default:false
    },
    crud:{
      //crud方法
      type:Object,
      default:{}
    },
    model:{
      //表单数据
      type:Object,
      default:{}
    },
    title: {
      // 弹窗标题
      type: String,
      default: ''
    },
    content: {
      // 弹窗内容
      type: String,
      default: ''
    },
    confirmButtonText: {
      // 确认按钮内容
      type: [String, Boolean],
      default: '确定'
    },
    cancelButtonText: {
      // 取消按钮内容
      type: [String, Boolean],
      default: '取消'
    },
    showClose:{
      // 展示右上角关闭按钮
      type: Boolean,
      default: true
    },
    dialogWidth: {
      // 弹窗的宽度
      type: String,
      default: '20%'
    },
    visible:{
      type:Boolean,
      default:false
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false
    },
    async: {
      // 是否开启异步关闭
      type: Boolean,
      default: false
    },
    clickModalClose: {
      // 点击遮罩层关闭对话窗口
      type: Boolean,
      default: false
    },
    center: {
      // 是否居中布局
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      dialogVisible:false,
      maxHeight:300,
      items: []
    }

  },
  watch:{
    visible(val){
      console.log(val);
      this.dialogVisible = val
      if(!val){
        return;
      }
      this.$nextTick(() => {
        this.maxHeight = this.$el.parentElement.clientHeight - 240;
      });
    },
  },
  mounted(){
    if(this.isNew){
      this.form = {}
    }
  },
  methods: {
    //验证
    validate(model){
      return new Promise((resolve, reject)=>{
        let error = [];
        let requiredMessage = ""
        let state = "success"
        this.items.forEach((item,i)=>{
          if(item.field){
            let value = model[item.field];
            if(item.required&&!value){
              requiredMessage = requiredMessage + item.label + ",";
               state =  "false"

                item.isError = true
            }

          }


        });
        if(requiredMessage){
          requiredMessage =  requiredMessage.substr(0,requiredMessage.length -1 ) + "是必填项目";
          error.push(requiredMessage);
        }
        if(error.length > 0){
          reject({"msg":error,"state":state});
        }else{
          resolve({"msg":error,"state":state});
        }
      })

    },

    //提交
    submit(){
      this.validate(this.model).then(res =>{
        if(this.isNew){
          this.crud.insert(this.model).then(res=>{
            if(res.status!=200||res.status!=200){
              this.$message.error("新增失败：" + res.message);
            }else{
              // that.$emit('close');
              this.$emit('close');
              this.$parent.query();
              this.$parent.clear();
              this.$message.success("新增成功");
            }


          });

        }else{
          this.crud.update(this.model).then(res=>{
            if(res.status!=200||res.status!=200){
              this.$message.error("修改失败：" + res.message);
            }else{
              // that.$emit('close');
              this.$emit('close');
              this.$parent.query();
              this.$parent.clear();
              this.$message.success("修改成功");
            }


          });
        }
      }).catch((res)=>{
        this.$message.error(res.msg[0])
      })
    },
    // 关闭弹窗触发
    close(){
      this.items.forEach((item,i)=>{
        if(item.field){
          item.isError = false

        }


      });
      this.$parent.clearCurentRow()
      this.$emit('close')         // 通过 this.$emit() 向父组件传值
    },
    addItem(item){
      this.items.push(item);
    },
    removeItem(item){
      let i = this.items.indexOf(item);
      this.items.splice(i, 1);
    },
  },
  emits: ['close']
})
</script>

<style lang="less" scoped>

</style>
