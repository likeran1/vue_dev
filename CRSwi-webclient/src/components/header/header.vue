<template>
  <div style="height: 100%">
    <header  style="box-shadow: #d8d8d8 3px 3px 5px 1px ;">
      <img class="header-img" src="static/img/logo.png">
      <ul class="header-operations" style="display: flex;align-items: center;">
        <li>
          <span  style="color:#025e85;">当前用户:{{user.name}}</span>
        </li>
        <li>
          <el-button type="text" @click="revpassword = true">修改密码</el-button>
        </li>
        <li>
          <img @click="clearUser" style="width:30px;height:30px" src="static/img/exit.png">
        </li>
        
        <!-- <li style="color:#AFF;">退出系统</li> -->
        </ul>
        <el-dialog
          @close="clearData"
          style="z-index: 10000"
          append-to-body="true"
          title="修改密码"
          :visible.sync="revpassword"
          width="30%">
          <ul class="revpassword" style="width: 80%;margin: auto;">
            <li><label>原密码：</label><el-input @change="passwordyz1" v-model="oldpassword" placeholder=""></el-input></li>
            <li><label>新密码：</label><el-input @change="passwordyz2" v-model="newpassword" placeholder=""></el-input></li>
            <li><label>确认密码：</label><el-input @change="passwordyz3" v-model="newtwopassword" placeholder=""></el-input></li>
          </ul>
          <span slot="footer" class="dialog-footer">
            <el-button @click="revpasswordClose">取 消</el-button>
            <el-button type="primary" @click="revpasswordConfirm">确 定</el-button>
          </span>
        </el-dialog>
        
    </header>
  </div>
</template>
<script>
  export default {
    props: {
      user: {
      }
    },
    data () {
      return {
        revpassword:false,
        oldpassword:"",
        newpassword:"",
        newtwopassword:""
      };
    },
    methods: {
      clearData(){
        this.oldpassword=""
        this.newpassword=""
        this.newtwopassword=""
      },
      revpasswordClose(){
        this.revpassword = false
      },
      passwordyz1(e){
        this.$nextTick(() => {
          this.oldpassword = e.replace(/[^a-zA-Z0-9_-]/g,'')
        })
      },
      passwordyz2(e){
        this.$nextTick(() => {
          this.newpassword = e.replace(/[^a-zA-Z0-9_-]/g,'')
        })
      },
      passwordyz3(e){
        this.$nextTick(() => {
          this.newtwopassword = e.replace(/[^a-zA-Z0-9_-]/g,'')
        })
      },
      //修改密码保存事件
      revpasswordConfirm(){

        var us = JSON.parse(sessionStorage.getItem("user"));
        console.log(us);

        var password = us.staffPwd;
        var code = us.staffCode;
        var _this = this
        if(password == this.oldpassword){
          // this.revpassword = false
          if(this.newpassword == this.newtwopassword){
            console.log({"staffCode":code,"staffPwd":this.newtwopassword})
                this.$http.put('/staff/', {"staffCode":code,"staffPwd":this.newtwopassword}).then((response) => {
                    console.log(response.data)
              if(response.data){
                _this.$message.success('修改成功!');
                sessionStorage.removeItem("user")
                _this.$router.push("/login")
              }else{
                _this.$message.error('修改失败!');
              }
            });
          }else{
            this.$message.error('两次密码输入不一致!');
          }
        }else{
          this.$message.error('原密码错误!');
        }
        
      },
      
      clearUser(){
        this.$alert('是否退出登录', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            if(action == "confirm"){
              sessionStorage.removeItem("user")
              this.$router.push("/login")
            }
          }
        });
      }
    }
  };
</script>
<style>
  .revpassword li{
    margin-top: 20px
  }
  .revpassword li label{
    display: inline-block;
    margin-bottom: 10px
  }
  header {

    background-image: url(/static/img/headbg.png);
    background-repeat: repeat-x;
    height: 100%;
    position: relative;
    width: 100%;
    top: 0;
    left: 0;

    /*z-index: 999;*/
    box-sizing: border-box;
    /*position: fixed;*/
  }
  .header-img{
    /*position: absolute;*/
    width: 70px;
    height: 70px;
    
    margin-left: 10px;
    
  }
  .header-logo {
    display: inline-block;
    vertical-align: middle;
  }
  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 30px;
    padding-top: 0;
    height: 100%;
  }
  .header-operations li {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    /*padding: 0 10px;*/
    margin: 0 10px;
    /*line-height: 80px;*/
    cursor: pointer;
  }
  .header-operations li:first-child{
    cursor: default
  }
  .header-opacity{
    opacity: .7;
  }
  .header-operations:after, header:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
</style>
