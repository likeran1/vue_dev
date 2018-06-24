<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 90px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 30px 0 0 50px">
          <el-form-item label="单位名称">
            <el-input v-model="params.orgnizationName" placeholder="单位名称"></el-input>
          </el-form-item>
          <el-form-item label="单位类型">  
            <el-select v-model="params.orgnizationDegree" placeholder="请选择">
              <el-option label="全部" value="" key=""></el-option>
              <el-option label="本院" value="S-01" key="S-01"></el-option>
              <el-option label="外委公司" value="S-02" key="S-02"></el-option>
              <el-option label="科室/班组" value="S-03" key="S-03"></el-option>
            </el-select>
          </el-form-item>


          <el-button type="primary" icon="search" @click="searchOrg">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" icon="plus" @click="addOrg">新单位</el-button>
          </div>
        </el-form>
        
        <!--表格-->
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          </el-table-column>

         <!--<el-table-column type="selection"/>-->

          <el-table-column
            prop="orgnizationCode"
            label="单位编码" v-if="show"
            sortable
            width="150">
          </el-table-column>

          <el-table-column
            prop="orgnizationName"
            label="单位名称"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="orgnizationDirector"
            label="单位主管"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="orgnizationDegree"
            label="单位级别"
            sortable
            :formatter="jbFormat"
            width="150">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button type="primary" size="small" @click="editOrg(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="currole!='ROLE-OP-02'" type="danger" size="small" @click="delOrg(scope.$index, scope.row)">删除</el-button>
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
        ref="orgForm" 
        v-on:close="cancelOrg">  
      </user-form>

      <el-form ref="orgForm" :model="orgForm" label-width="80px">

        <el-form-item label="单位名称">
          <el-input v-model="orgForm.orgnizationName"></el-input>
        </el-form-item>
        <el-form-item label="单位主管">
          <el-input v-model="orgForm.orgnizationDirector"></el-input>
        </el-form-item>

        <el-form-item label="单位级别">
                  <el-select style="width: 100%" v-model= "orgForm.orgnizationDegree" value-key="S-01">
                    <el-option label="本院" value="S-01" key="S-01"></el-option>
                    <el-option label="外委公司" value="S-02" key="S-02"></el-option>
                    <el-option label="科室/班组" value="S-03" key="S-03"></el-option>
                  </el-select>
          </el-form-item>

        <el-form-item>
            <el-button @click="saveOrg">保 存</el-button>
            <el-button @click="cancelOrg">取 消</el-button>
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
        orgnizationName: null,
        orgnizationDegree: null,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      
      dialogFormVisible: false,
      editLoading: false,
      orgForm: {
        orgnizationCode:'0',
        orgnizationName: '',
        orgnizationDirector: '',
        orgnizationDegree: '',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      dialogTitle:'',
      currole:"",
    };
  },
  created () {
    var us = JSON.parse(sessionStorage.getItem("user"));     
    this.currole = us.staffRole;
    console.log(this.currole);

    this.searchOrg ();
  },
  methods: {
    dateFormat (row, column) {
      var date = row['csny'];
      if (date === undefined) {
        return "";
      }
      return this.$dateFormat(date);
    },


    jbFormat(row, column) {
      var orgnizationDegree = row['orgnizationDegree'];
      if (orgnizationDegree === undefined) {
        return "";
      }

      if(orgnizationDegree=='S-01')
      {
          return "本院"  ;
      }
      else if(orgnizationDegree=='S-02')
      {
          return "外委公司"  ;
      }
      else if(orgnizationDegree=='S-03')
      {
          return "科室/班组"  ;
      }
    },

    //
    // 查询组织机构
    // 
    searchOrg () {

      if(this.params.orgnizationName==''){
        this.params.orgnizationName=null;
      }
      if(this.params.orgnizationDegree==''){
        this.params.orgnizationDegree=null;
      }

      var p = JSON.parse(JSON.stringify(this.params));
      var url = '/orgnization/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;
      //this.$http.post(url, p).then((response) => {
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;
        console.log(pageUser.list);
        this.tableData = pageUser.list;
      });
    },
    reset () {
      this.params.orgnizationName = '';
      this.params.orgnizationDegree = '';
      this.searchOrg();
    },
    // deleteAll () {
    //   this.$message.error('还没做呢!');
    // },

    // 删除组织机构
    delOrg (index, row) {
          var url = '/orgnization/?orgnizationCode='+row['orgnizationCode'];

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

    editOrg (index, row) {
      this.dialogType = 'edit'; 
      this.dialogTitle = '修改单位';
      var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));
      this.orgForm = Object.assign({}, rowTmp[0]);

      this.dialogFormVisible = true;
      this.table_index = index;
    },

    // 新增组织机构
    addOrg () {
      this.dialogType = 'add';      
      this.dialogTitle = '新增单位';
      this.orgForm = Object.assign({}, );
      this.dialogFormVisible = true;
      // this.form = Object.assign({}, row);
      // this.table_index = index;
    },
    // 取消驾驶员编辑对话框
    cancelOrg(){
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveOrg(){
          switch(this.dialogType){
             // 新增组织机构
            case 'add':
                {
                  //检查名称和单位级别是否为空
                  console.log(this.orgForm.orgnizationName);
                  if(!this.orgForm.orgnizationName||this.orgForm.orgnizationName==''){
                    this.$message.error('必须录入名称!'); 
                    return;
                  }
                  if(!this.orgForm.orgnizationDegree||this.orgForm.orgnizationDegree==''){
                    this.$message.error('必须录入单位级别!'); 
                    return;
                  }
                  //检查名称是否重复
                  var url='orgnization/check/name?orgnization_name='+this.orgForm.orgnizationName;
                  this.$http.get(url).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message.error('已经存在名称为'+this.orgForm.orgnizationName+'的组织机构，添加失败!'); 
                          this.return;
                      }else{
                        //名称不存在，可以添加
                        var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.orgForm)));
                        var p = JSON.parse(JSON.stringify(rowTmp[0]));
                        this.$http.post('/orgnization/', p).then((response) => {
                          // 判断新增数据是否成功
                            var isAddedOk = response.data;
                            if(isAddedOk){
                                this.$message({
                                message: "添加成功！",
                                type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.searchOrg();
                            }else{
                              this.$message.error('添加失败!'); 
                            }
                        });
                      }
                  });

                  
                }
             break;
            // 编辑组织机构
            case 'edit':
                {
                  //检查名称和单位级别是否为空
                  console.log(this.orgForm.orgnizationName);
                  if(!this.orgForm.orgnizationName||this.orgForm.orgnizationName==''){
                    this.$message.error('必须录入名称!'); 
                    return;
                  }
                  if(!this.orgForm.orgnizationDegree||this.orgForm.orgnizationDegree==''){
                    this.$message.error('必须录入单位级别!'); 
                    return;
                  }

                  //检查名称是否重复
                  var url='orgnization/check/name/pk?orgnizationName='+this.orgForm.orgnizationName+'&orgnizationCode='+this.orgForm.orgnizationCode;
                  console.log(url);
                  this.$http.get(url).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message.error('已经存在名称为'+this.orgForm.orgnizationName+'的组织机构，修改失败!'); 
                          this.return;
                      }else{
                        var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.orgForm)));

                        var p = JSON.parse(JSON.stringify(rowTmp[0]));

                        this.$http.put('/orgnization/', p).then((response) => {
                          // 判断更新数据是否成功
                            var isUpdatedOk = response.data;
                            if(isUpdatedOk){
                                this.$message({
                                message: "更新成功！",
                                type: 'success'
                                });
                                this.dialogFormVisible = false;
                                this.searchOrg();
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
      this.searchOrg();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchOrg();
    },
    show(){

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
