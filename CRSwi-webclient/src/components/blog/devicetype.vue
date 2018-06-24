<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline">
          <el-button type="primary" icon="plus" @click="addDeviceType">添加新类型</el-button>
        </el-form>
        
        <!--表格-->
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          </el-table-column>

         <!--<el-table-column type="selection"/>-->

          <el-table-column
            prop="dicCode"
            label="字典编码"  v-if="show"
            sortable
            width="150">
          </el-table-column>

          <el-table-column
            prop="dicValueName"
            label="设备类型"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="dicValueCode"
            label="设备编码"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="dicValueComment"
            label="设备说明"
            sortable
            width="150">
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button type="primary" size="small" @click="editDeviceType(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="delDeviceType(scope.$index, scope.row)">删除</el-button>
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
      </el-col>
    </el-row>

    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
      <user-form 
        :dialog-type="dialogType"
        ref="deviceTypeForm" 
        v-on:close="cancelDeviceType">  
      </user-form>

      <el-form ref="deviceTypeForm" :model="deviceTypeForm" label-width="80px">

        <el-form-item label="设备类型">
          <el-input v-model="deviceTypeForm.dicValueName"></el-input>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="deviceTypeForm.dicValueCode" v-bind:readonly="deviceTypeForm.read_only"></el-input>
        </el-form-item>
        <el-form-item label="设备说明">
          <el-input v-model="deviceTypeForm.dicValueComment"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button @click="saveDeviceType">保 存</el-button>
            <el-button @click="cancelDeviceType">取 消</el-button>
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
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      show:false,
      dialogFormVisible: false,
      editLoading: false,
      deviceTypeForm: {
        dicCode: '3',
        dicValueName: '',
        dicValueCode: '',
        dicValueComment: '',
        read_only:false,
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      dialogTitle:'',
    };
  },
  created () {
    // var p = JSON.parse(JSON.stringify(this.params));
    // this.$http.post('/user/getAllUser.do', p).then((response) => {
    //   var pageUser = response.data;
    //   this.total = pageUser.total;
    //   this.params.pageNum = pageUser.pageNum;
    //   this.tableData = pageUser.list;
    // });
    this.searchDeviceType ();
  },
  methods: {

    
    //
    // 查询设备类型
    // 
    searchDeviceType () {
      var p = JSON.parse(JSON.stringify(this.params));
      var url ='/baseData/dic/deviceType/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;
      
      //this.$http.post('/driver/getDrivers.do', p).then((response) => {
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;

        this.tableData = pageUser.list;
      });
    },
    reset () {
      this.params.ygxm = '';
      this.params.gh = '';
      this.params.ssdw = '';
      this.params.czqx = '';
      this.searchDeviceType();
    },
    // deleteAll () {
    //   this.$message.error('还没做呢!');
    // },

    // 删除设备类型
    delDeviceType (index, row) {

          var url = '/baseData/dic/deviceType/?dicValueCode='+row['dicValueCode'];
          //this.$http.post('/driver/removeDriver.do', row['dicCode']).then((response) => {
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

    editDeviceType (index, row) {
      this.dialogType = 'edit'; 
      this.dialogTitle = '修改设备类型';  
      var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));

      this.deviceTypeForm = Object.assign({}, rowTmp[0]);
      this.dialogFormVisible = true;
      //this.deviceTypeForm.read_only=true;
      //如果不允许编辑就把read_only设置为true
      this.deviceTypeForm.read_only=false;
      this.table_index = index;
    },

    // 新增设备类型
    addDeviceType () {
      this.dialogType = 'add';      
      this.dialogTitle = '新增设备类型';  
      this.deviceTypeForm = Object.assign({}, );
      this.dialogFormVisible = true;
      this.deviceTypeForm.read_only=false;
      // this.form = Object.assign({}, row);
      // this.table_index = index;
    },
    // 取消驾驶员编辑对话框
    cancelDeviceType(){
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveDeviceType(){
          switch(this.dialogType){
             // 新增设备类型
            case 'add':
                {
                  this.deviceTypeForm.dicCode='3';
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceTypeForm)));

                  var p = JSON.parse(JSON.stringify(rowTmp[0]));

                  this.$http.post('/baseData/dic/deviceType', p).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message({
                          message: "添加成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchDeviceType();
                      }else{
                        this.$message.error('添加失败!'); 
                      }
                  });
                }
             break;
            // 编辑设备类型
            case 'edit':
                {
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceTypeForm)));

                  var p = JSON.parse(JSON.stringify(rowTmp[0]));

                  this.$http.put('/baseData/dic/deviceType', p).then((response) => {
                    // 判断更新数据是否成功
                      var isUpdatedOk = response.data;
                      if(isUpdatedOk){
                          this.$message({
                          message: "更新成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchDeviceType();
                      }else{
                        this.$message.error('更新失败!'); 
                      }
                  });
                } 
              break;
          }
    },

    
    sizeChange(val) {
      this.params.pageSize = val;
      this.searchDeviceType();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchDeviceType();
    },
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
