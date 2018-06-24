<template>
<div id="menu" style="height: 100%;">
  <!-- <el-row :gutter="20" style="height: 100%"> -->
    <!-- <el-col :span="20" style="height: 100%"> -->
      <div ref="menu_test" class="demo-block"  style="height: 100%;">
      <div class="el-row tac"  style="overflow: auto;color: #fff;height: 100%;margin: 0">
      <!-- <el-col :span="8">
        <el-col :span="24"> -->
          
          <el-menu :default-active="$router.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>

            <el-menu-item index="/home">主页</el-menu-item>
            <!-- 任务管理 -->
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>任务管理</template>
              <el-menu-item-group>
                <template v-for="(item,index) in taskmanager_item" v-if="item.hidden">
                  <el-menu-item :index="item.path" ><i class="fa" ></i>{{item.title}}</el-menu-item>
                </template>
              </el-menu-item-group>              
            </el-submenu>

            <!-- 运维设备 -->
            <el-submenu  index="2" @open="handleOpen">
              <template slot="title"><i class="el-icon-menu"></i>运维设备</template>
              <el-menu-item-group>
                <template v-for="(item,index) in equipment_item" v-if="item.hidden">
                  <el-menu-item :index="item.path" ><i class="fa" :class="item.class"></i>{{item.title}}</el-menu-item>
                </template>
              </el-menu-item-group>              
            </el-submenu>

            <!-- 基础数据管理 -->
            <el-submenu  v-if="user.role!='ROLE-STAFF-03'" index="3" @open="handleOpen"> 
              <template slot="title" :disabled="basedatamanager_item.count<=0"><i class="el-icon-setting"></i>基础数据管理</template>
              <el-menu-item-group>
                <template v-for="(item,index) in basedatamanager_item" v-if="item.hidden">
                  <el-menu-item :index="item.path" ><i class="fa" :class="item.class"></i>{{item.title}}</el-menu-item>
                </template>
              </el-menu-item-group>              
            </el-submenu>

          </el-menu>
        <!-- </el-col>
              </el-col> -->
      </div>
      </div>
    <!-- </el-col> -->
  <!-- </el-row> -->
</div>
</template>
<script>
  export default {
    data() {
      return {
        height_list:{
          height:0
        },
        user: {
          role: ""
        },
        taskmanager_item: [
          {
            title: '工单签发',
            path: '/index/workorder',
            class: 'fa-user1',
            hidden:true
          }
        ],

         equipment_item: [
          {
            title: '设备绑定',
            path: '/index/devicebind',
            class: 'fa-tag1',
            hidden:true
          },{
            title: '设备解绑',
            path: '/index/deviceunbind',
            class: 'fa-bars1',
            hidden:true
          },{
            title: '数据一致性检查',
            path: '/index/datacompare',
            class: 'fa-step-forward1',
            hidden:true
          },{
            title: '设备日志',
            path: '/index/devicelog',
            class: 'fa-dolla1r',
            hidden:true
          },{
            title: '设备固件升级',
            path: '/index/deviceupdate',
            class: 'fa-dollar1',
            hidden:true
          },
        ],

         basedatamanager_item: [
          {
            title: '组织机构管理',
            path: '/index/orgmanag',
            class: 'fa-orgmanag',
            hidden:true
          },{
            title: '人员管理',
            path: '/index/user',
            class: 'fa-user1',
            hidden:true
          },{
            title: '设备类型维护',
            path: '/index/devicetype',
            class: 'fa-devicetype',
            hidden:true
          },{
            title: '受控仪表管理',
            path: '/index/device',
            class: 'fa-device',
            hidden:true
          },{
            title: '防篡改设备管理',
            path: '/index/shieldmgr',
            class: 'fa-newspaper-o1',
            hidden:true
          },
        ],      
      };
    },
    created () {
      var us = JSON.parse(sessionStorage.getItem("user"));
      var username = us.staffNumber;
      var password = us.staffPwd;      
      var staffrole = us.staffRole;

      if(staffrole == 'ROLE-SYS-01'){//系统管理员

      }else if(staffrole == 'ROLE-OP-02'){//系统操作员
          /*for(var obj in this.basedatamanager_item){

            if(this.basedatamanager_item[obj].title =='组织机构管理' || this.basedatamanager_item[obj].title =='人员管理'){
              this.basedatamanager_item[obj].hidden=false;
            }
          }*/
      }else if(staffrole == 'ROLE-STAFF-03'){//巡检员
          for(var obj in this.basedatamanager_item){            
              this.basedatamanager_item[obj].hidden=false;            
          }
      }

      this.user.role = staffrole;
    },
    mounted(){
      // this.height_list.height=window.getComputedStyle(this.$refs.menu_test).height
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style>



html,body{
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
