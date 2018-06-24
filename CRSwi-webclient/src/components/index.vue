<template>
  <div id='index' style="height: 100%;display: flex;flex-direction: column;">
  <el-row class="container" style="min-height: 70px;height: 10%;background: #f9f9f9;flex: 1;">
    <el-col :span="24" class="main" style="height: 100%" >
      <v-header :user="user"></v-header>
    </el-col>
    </el-row>
    <el-row class="container" style="min-height: 500px;height: 90%;flex: 9;">
      <el-col :span="4" class="main" style="height:100%;overflow: auto;background: #006086">
          <v-menu></v-menu>
      </el-col>
      <el-col :span="20"  style="height: 100%;overflow: auto;padding: 10px">
            <router-view></router-view>
      </el-col>
  </el-row>
  </div>
</template>
<script>
  import header from '../components/header/header.vue';
  import menu from '../components/menu/menu.vue';
  export default {
    data () {
      return {
        user: {
          name: "Administrator"
        }
      };
    },
   async created () {
      var us = JSON.parse(sessionStorage.getItem("user"));
      console.log(us);
      var password = us.staffPwd;
      console.log(password)
      var username = us.staffNumber;
      console.log(username)

      var parm = new Object();
      parm.staffName = username;
      parm.staffNumber = password;
      var p1 = JSON.parse(JSON.stringify(parm));

      console.log(p1);
      var _this = this 
      try{
          us.staffName
      }catch(e){
        this.$router.push("/login")
      }
    
      this.user.name = us.staffName

    //登录验证
    await this.$http.post('/staff/verfyLogin', p1).then((response) => {
    console.log(response.data)
          if(response.data){
            _this.$router.push("/index")
          }else{
            _this.$router.push("/login")
          }
        }); 

      //所有基础字典
      this.$http.get('/baseData/dics', {}).then((response) => {
          var pageUser = response.data;
          _this.$store.state.indexstore.dics = pageUser
      });

      //所有单位(组织机构)
      var parm = new Object();
      parm.orgnizationDegree = null;
      parm.orgnizationName = null;
      var p = JSON.parse(JSON.stringify(parm));
      this.$http.post('/orgnization/pages?pageNum=1&pageSize=1000', p).then((response) => {
          var pageUser = response.data;
          _this.$store.state.indexstore.orgn = pageUser.list;

          /*for(var i in pageUser.list){
            var obj = pageUser.list[i].orgnizationCode;
            this.dicorgn[obj] = pageUser.list[i].orgnizationName;
          }*/


      });

       //所有人员(组织机构)
      var parma = new Object();
      parma.orgnizationDegree = null;
      parma.orgnizationName = null;
      var pa = JSON.parse(JSON.stringify(parm));
      this.$http.post('/staff/pages?pageNum=1&pageSize=1000', pa).then((response) => {
          var pageUser = response.data;
          console.log(pageUser)
          _this.$store.state.indexstore.staff = pageUser.list;
      });
    },
    beforeCreate () {
    },
    components: {
      'v-header': header,
      'v-menu': menu
    }
  };
</script>
<style>
 
  body {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    background-color: #fff;
    min-width: 1140px;
    overflow: auto;
  }
  .el-menu{
    padding-top: 0
  }
  .container {
    /*padding-top: 80px;*/
    margin: 0 !important;;
    height: 100%;
  }

  .container .main {
    padding: 0;
  }

  .container ul li.el-menu-item {
    font-size: 100%;
  }

  .container .mar-l {
    padding: 0;
  }

 /* .container .content-wrapper {
    padding: 20px;
    position: absolute;
    float: right;
    top:8px;
  }*/

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .list{
    height: 100%
  }
  #menu .el-menu {
   height: 100%;
   /*width:199px;*/
   background:  #006086;
} 
  #menu .submenu {
   color: #fff !important;
    background-color: #006086;
    position: absolute;
    /*float: left;*/
    border-right: solid 1px #ccc;
    overflow: auto;

  }
  .el-submenu__title{
    font-size: 16px !important;
    color: #7fb6d2 !important;
  }
  .el-submenu__title:hover{
    color: #fff!important;
    background:#055476!important;
  }
  .el-menu-item{
    font-size: 14px !important;
    color: #7fb6d2 !important;
  }
  .el-menu-item:hover{
     color: #fff;
    background:#055476!important;
  }
  .el-menu-vertical-demo{
    background:  linear-gradient(#005e84,#006b95);
    color: #fff;
  }
  .is-active{
    color: #fff!important;
    background:#055476!important;
  }
  .is-active .el-submenu__title{
    color: #fff!important;
    background:#006086!important;
  }
  i.fa {
    vertical-align: baseline;
    /*margin-right: 10px;*/
  }

  .el-menu-item-group__title {
    padding-top: 0px;
    line-height: normal;
    font-size: 14px;
    padding-left: 20px;
    color: #97a8be;
  }
</style>

