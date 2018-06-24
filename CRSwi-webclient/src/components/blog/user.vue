<template>
  <section id="user_div">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 90px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 30px 0 0 50px">
          <el-form-item label="员工名称">
            <el-input v-model="params.staffName" placeholder="姓名"></el-input>
          </el-form-item>
          
          <el-form-item label="所属单位">
            <el-input v-model="params.orgnizationName" placeholder="所属单位"></el-input>
          </el-form-item>
          <!--<el-form-item label="所属单位">  
            <el-select v-model="params.orgnizationName" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.orgnizationCode"
                :label="item.orgnizationName"
                :value="item.orgnizationName">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-button type="primary" icon="search" @click="searchUser">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" icon="plus" @click="addUser">添加新员工</el-button>
        </div>
        </el-form>
        
        <!--表格-->
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">

         <!--<el-table-column type="selection"/>-->

          <el-table-column
            prop="staffCode"
            label="员工编码" v-if="show"
            sortable
            width="150">
          </el-table-column>

          <el-table-column
            prop="staffName"
            label="员工姓名"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="staffNumber"
            label="工号"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="organizationCode"
            label="所属单位"
            sortable
            :formatter="dwFormat"
            width="150">
          </el-table-column>
          <el-table-column
            prop="staffRole"
            label="操作权限"
            sortable
            :formatter="qxFormat"
            width="150">
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button type="primary" size="small" @click="editUser(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="currole!='ROLE-OP-02'" type="danger" size="small" @click="delUser(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="params.pageNum"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
       </div>
      </el-col>
    </el-row>

    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
      <user-form 
        :dialog-type="dialogType"
        ref="userForm" 
        v-on:close="cancelUser">  
      </user-form>

      <el-form ref="userForm" :model="userForm" label-width="80px">

        <el-form-item label="员工姓名">
          <el-input v-model="userForm.staffName"></el-input>
        </el-form-item>
        <el-form-item label="工号" style="color:#FF0000;">
          <el-input v-model="userForm.staffNumber" placeholder="工号作为登录名"></el-input>
        </el-form-item>

        <el-form-item label="所属单位">
          <el-select style="width: 100%" v-model="userForm.organizationCode" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.orgnizationCode"
                :label="item.orgnizationName"
                :value="item.orgnizationCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作权限">
          <el-select style="width: 100%" v-model="userForm.staffRole" placeholder="请选择">
            <el-option
                v-for="item in staffRoles"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.staffPwd"></el-input>
        </el-form-item>


        <el-form-item>
            <el-button @click="saveUser">保 存</el-button>
            <el-button @click="cancelUser">取 消</el-button>
        </el-form-item>       
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data () {
    return {
      params: {
        staffCode:'0',
        staffName: null,
        organizationCode: null,
        orgnizationName: null,
        pageNum: 1,
        pageSize: 10
      },
      params1: {
        orgnizationName: null,
        orgnizationDegree: null,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      
      dialogFormVisible: false,
      editLoading: false,
      userForm: {
        staffName: '',
        staffNumber: '',
        organizationCode: '',
        staffRole: '',
        staffPwd:'',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      dialogTitle:'',
      options: [],
      user_loading:"",
      currole:"",
      staffRoles: [{
          value: 'ROLE-SYS-01',
          label: '系统管理员'
        }, {
          value: 'ROLE-OP-02',
          label: '系统操作员'
        }, {
          value: 'ROLE-STAFF-03',
          label: '巡检员'
        },
      ],

    };
  },
  created () {

    var us = JSON.parse(sessionStorage.getItem("user"));     
    this.currole = us.staffRole;
    console.log(this.currole);


    this.user_loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('#user_div')
    });
    this.getAllOrgnization();
    this.searchUser ();
  },
  methods: {
    dwFormat(row, column) {
      var organizationCode = row['organizationCode'];

      for(var x in this.options){
       if(this.options[x].orgnizationCode==organizationCode)
       {
       return this.options[x].orgnizationName;
       }
     }
    },

    qxFormat(row, column) {
      var staffRole = row['staffRole'];
      if (staffRole === undefined) {
        return "";
      }

      if(staffRole=='ROLE-SYS-01')
      {
          return "系统管理员"  ;
      }
      else if(staffRole=='ROLE-OP-02')
      {
          return "系统操作员"  ;
      }
      else if(staffRole=='ROLE-STAFF-03')
      {
          return "巡检员"  ;
      }
    },
    
    getAllOrgnization(){
      this.params1.orgnizationDegree=null;
      this.params1.orgnizationName=null;
      var p = JSON.parse(JSON.stringify(this.params1));
      var url = '/orgnization/pages?pageNum=1&pageSize=1000';
      
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.options = pageUser.list;

      });
    },

    //
    // 查询员工
    // 
    searchUser () {
      if(this.params.staffName==''){
        this.params.staffName=null;
      }

      if(this.params.organizationCode==''){
        this.params.organizationCode=null;
      }
      if(this.params.orgnizationName==''){
        this.params.orgnizationName=null;
      }
      //console.log(this.params);
      var p = JSON.parse(JSON.stringify(this.params));
      var url = '/staff/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;
      //this.$http.post('/driver/getDrivers.do', p).then((response) => {
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;
        console.log("cao cao cao");
        console.log(pageUser.list);
        this.$store.state.indexstore.staff = pageUser.list;
        console.log(this.$store.state.indexstore.staff);
        this.tableData = pageUser.list;

        this.user_loading.close();//关闭loading效果
      });
    },
    reset () {
      this.params.staffName = '';
      this.params.staffNumber = '';
      this.params.organizationCode = '';
      this.params.orgnizationName = '';
      this.params.staffRole = '';
      this.searchUser();
    },
    // deleteAll () {
    //   this.$message.error('还没做呢!');
    // },

    // 删除员工
    delUser (index, row) {
          var url = '/staff/?staffCode='+row['staffCode'];
          //this.$http.post('/driver/removeDriver.do', row['gh']).then((response) => {
          this.$http.delete(url).then((response) => {
          // 判断新增数据是否成功
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "删除成功！",
                 type: 'success'
                 });
                this.tableData.splice(index, 1);
                }else{
                  this.$message.error('删除失败!'); 
                }
           });
    },

    editUser (index, row) {
      this.dialogType = 'edit'; 
      this.dialogTitle = '修改员工';  
      var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));

      

      this.userForm = Object.assign({}, rowTmp[0]);
      this.dialogFormVisible = true;
      this.table_index = index;
    },

    // 新增员工
    addUser () {
      this.dialogType = 'add';    
      this.dialogTitle = '新增员工';  
      this.userForm = Object.assign({}, );
      this.dialogFormVisible = true;
      // this.form = Object.assign({}, row);
      // this.table_index = index;
    },
    // 取消员工编辑对话框
    cancelUser(){
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveUser(){
          switch(this.dialogType){
             // 新增员工
            case 'add':
                {
                  if(!this.userForm.staffName||this.userForm.staffName==''){
                    this.$message.error('必须录入员工姓名!'); 
                    return;
                  }
                  
                  if(!this.userForm.organizationCode||this.userForm.organizationCode==''){
                    this.$message.error('必须录入所属单位!'); 
                    return;
                  }
                  if(!this.userForm.staffPwd||this.userForm.staffPwd==''){
                    this.$message.error('必须录入密码!'); 
                    return;
                  }
                  //检查名称是否重复
                  var url='/staff/check/number?staffNumber='+this.userForm.staffNumber;
                  this.$http.get(url).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message.error('已经存在工号为'+this.userForm.staffNumber+'的员工，添加失败!'); 
                          this.return;
                      }else{
                        var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.userForm)));

                        var p = JSON.parse(JSON.stringify(rowTmp[0]));

                        this.$http.post('/staff/', p).then((response) => {
                          // 判断新增数据是否成功
                            var isAddedOk = response.data;
                            if(isAddedOk){
                                this.$message({
                                message: "添加成功！",
                                type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.searchUser();
                            }else{
                              this.$message.error('添加失败!'); 
                            }
                        });
                      }
                   });
                }
             break;
            // 编辑员工
            case 'edit':
                {

                  if(!this.userForm.staffName||this.userForm.staffName==''){
                    this.$message.error('必须录入员工姓名!'); 
                    return;
                  }
                  console.log(this.userForm);
                  if(!this.userForm.organizationCode||this.userForm.organizationCode==''){
                    this.$message.error('必须录入所属单位!'); 
                    return;
                  }
                  //检查名称是否重复
                  var url='/staff/check/number/pk?staffNumber='+this.userForm.staffNumber+'&staffCode='+this.userForm.staffCode;
                  this.$http.get(url).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message.error('已经存在工号为'+this.userForm.staffNumber+'的员工，修改失败!'); 
                          this.return;
                      }else{
                        var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.userForm)));

                        var p = JSON.parse(JSON.stringify(rowTmp[0]));

                        this.$http.put('/staff/', p).then((response) => {
                          // 判断更新数据是否成功
                            var isUpdatedOk = response.data;
                            if(isUpdatedOk){
                                this.$message({
                                message: "更新成功！",
                                type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.searchUser();
                            }else{
                              this.$message.error('更新失败!'); 
                            }
                        });
                      }
                  });
                } 
              break;
          }


    },

    
    sizeChange(val) {
      this.params.pageSize = val;
      this.searchUser();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchUser();
    },
    show(){
      return false;
    }
  },
}

</script>
<style>
  .el-pagination {
    text-align: center;
    margin-top: 30px;
  }
  .el-message-box__btns .cancel {
    float: right;
    margin-left: 10px;
  }
</style>
