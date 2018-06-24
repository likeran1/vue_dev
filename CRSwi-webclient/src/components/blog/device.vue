<template>
  <section id="device_div">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 90px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 25px 0 0 0px">
          <el-form-item label="仪表名称">
            <el-input v-model="params.instrumentName" placeholder="仪表名称"></el-input>
          </el-form-item>
          
          <el-form-item label="仪表类型">  
            <el-select v-model="params.deviceTypeCode" placeholder="请选择">
              <el-option
                v-for="item in sblxs"
                :key="item.dicValueCode"
                :label="item.dicValueName"
                :value="item.dicValueCode">
              </el-option>
            </el-select>
          </el-form-item>
  
          <el-form-item label="所属单位">
            <el-input v-model="params.orgnizationName" placeholder="所属单位"></el-input>
          </el-form-item>

          <!--<el-form-item label="所属单位" >  
            <el-select v-model="params.orgnizationName" placeholder="请选择" width=150>
              <el-option
                v-for="item in options"
                :key="item.orgnizationCode"
                :label="item.orgnizationName"
                :value="item.orgnizationName">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-button type="primary" icon="search" @click="searchDevice">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" icon="plus" @click="addDevice">添加新仪表</el-button>
        </div>
        </el-form>
        
        <!--表格-->
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px 0px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          </el-table-column>

         <!--<el-table-column type="selection"/>-->


          <el-table-column
            prop="instrumentName"
            label="仪表名称"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="deviceTypeCode"
            label="仪表类型"
            sortable
            :formatter="yblxFormat"
            width="150">
          </el-table-column>
          <el-table-column
            prop="instrumentModel"
            label="仪表型号"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="instrumentCode"
            label="资产编号"
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
            prop="deviceStatusCode"
            label="设备状态" :formatter="sbztFormat"
            sortable
            width="150">
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button type="primary" size="small" @click="editDevice(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="delDevice(scope.$index, scope.row)">删除</el-button>
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
      <device-form 
        :dialog-type="dialogType"

        ref="deviceForm" 
        v-on:close="cancelDevice">  
      </device-form>

      <el-form ref="deviceForm" :model="deviceForm" label-width="80px">

        <el-form-item label="仪表名称">
          <el-input v-model="deviceForm.instrumentName"></el-input>
        </el-form-item>
        <el-form-item label="仪表类型">
        <el-select style="width: 100%" v-model="deviceForm.deviceTypeCode" placeholder="请选择">
              <el-option
                v-for="item in sblxs_mod"
                :key="item.dicValueCode"
                :label="item.dicValueName"
                :value="item.dicValueCode">
              </el-option>
        </el-select>
        </el-form-item>

        <el-form-item label="仪表型号">
          <el-input v-model="deviceForm.instrumentModel"></el-input>
        </el-form-item>

        <el-form-item label="资产编号">
          <el-input v-model="deviceForm.instrumentCode" @change="check" ></el-input>
        </el-form-item>
        
        <el-form-item label="所属单位">
          <el-select style="width: 100%" v-model="deviceForm.organizationCode" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.orgnizationCode"
                :label="item.orgnizationName"
                :value="item.orgnizationCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备状态">
          <el-select style="width: 100%" v-model="deviceForm.deviceStatusCode" placeholder="请选择">
            <el-option
                v-for="item in sbzts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
            <el-button @click="saveDevice">保 存</el-button>
            <el-button @click="cancelDevice">取 消</el-button>
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
        instrumentName: null,
        deviceTypeCode: null,
        organizationCode: null,
        pageNum: 1,
        pageSize: 10
      },
      params1: {
        orgnizationName: null,
        orgnizationDegree: null,
        pageNum: 1,
        pageSize: 10
      },
      params2: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      
      dialogFormVisible: false,
      editLoading: false,
      deviceForm: {
        instrumentName: '',
        deviceTypeCode: '',
        instrumentModel: '',
        instrumentCode: '',
        organizationCode: '',
        deviceStatusCode: '',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      dialogTitle:'',
      show:false,
      device_loading:"",
      options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '单位一'
        }, {
          value: '2',
          label: '单位二'
        }, {
          value: '3',
          label: '单位三'
        },
      ],
      sblxs:[],
      sblxs_mod:[],

      sbzts: [{
          value: 'DS-IN-01',
          label: '在库可用'
        }, {
          value: 'DS-REPAIRE-02',
          label: '在库维修'
        }, {
          value: 'DS-OUT-01',
          label: '出库在用'
        }, {
          value: 'DS-OFF-01',
          label: '报废注销'
        },
      ],

    };
  },
  created () {
    
    this.device_loading = this.$loading({
      lock:true,
      text:'loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('#device_div')
    });

    this.getAllOrgnization();
    this.getAllDeviceType();
    this.searchDevice ();
  },
  methods: {
    yblxFormat(row, column) {
      var deviceTypeCode = row['deviceTypeCode'];

      for(var x in this.sblxs){
       if(this.sblxs[x].dicValueCode==deviceTypeCode)
       {
       return this.sblxs[x].dicValueName;
       }
     }
    },
    dwFormat(row, column) {
      var organizationCode = row['organizationCode'];

      for(var x in this.options){
       if(this.options[x].orgnizationCode==organizationCode)
       {
       return this.options[x].orgnizationName;
       }
     }
    },
    sbztFormat(row, column) {
      var deviceStatusCode = row['deviceStatusCode'];
      if (deviceStatusCode === undefined) {
        return "";
      }

      if(deviceStatusCode=='DS-IN-01')
      {
          return "在库可用"  ;
      }
      else if(deviceStatusCode=='DS-REPAIRE-02')
      {
          return "在库维修"  ;
      }
      else if(deviceStatusCode=='DS-OUT-01')
      {
          return "出库在用"  ;
      }
      else if(deviceStatusCode=='DS-OFF-01')
      {
          return "报废注销"  ;
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
    getAllDeviceType(){
      var p = JSON.parse(JSON.stringify(this.params2));
      var url ='/baseData/dic/deviceType/pages?pageNum=1&pageSize=1000';
      
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.sblxs = pageUser.list;
        this.sblxs_mod.splice(0,this.sblxs_mod.length);
        //去除编码为【DT-SHIELD-01】的防篡改设备
        for(var i in pageUser.list){
          var x = pageUser.list[i];
          if(x.dicValueCode!='DT-SHIELD-01'){
          //console.log(x);
          this.sblxs_mod.push(x);
          }
        }
      });
    },
    //
    // 查询设备
    // 
    searchDevice () {
      if(this.params.instrumentName==''){
        this.params.instrumentName=null;
      }
      if(this.params.deviceTypeCode==''){
        this.params.deviceTypeCode=null;
      }
      if(this.params.organizationCode==''){
        this.params.organizationCode=null;
      }
      if(this.params.orgnizationName==''){
        this.params.organizationCode=null;
      }
      console.log(this.params);
      var url = '/instrument/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;
      var p = JSON.parse(JSON.stringify(this.params));
      //this.$http.post('/driver/getDrivers.do', p).then((response) => {
        this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;

        this.tableData = pageUser.list;

        this.device_loading.close();
      });
    },
    reset () {
      this.params.instrumentName = '';
      this.params.deviceTypeCode = '';
      this.params.organizationCode = '';
      this.params.orgnizationName = '';
      this.searchDevice();
    },
    // deleteAll () {
    //   this.$message.error('还没做呢!');
    // },

    // 删除设备
    delDevice (index, row) {
      if(row.deviceStatusCode=='DS-OUT-01'){
        alert('仪表处于【出库在用】状态，禁止删除！');
        return;
      }
      
          var url = '/instrument/dsdevice/?instrumentCode='+row['instrumentCode'];
          this.$http.delete(url).then((response) => {
          //this.$http.post('/driver/removeDriver.do', row['gh']).then((response) => {
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

    editDevice (index, row) {
      this.dialogType = 'edit'; 
      this.dialogTitle = '修改设备';

      if(row.deviceStatusCode=='DS-OUT-01'){
        alert('仪表处于【出库在用】状态，禁止修改！');
        return;
      }
      var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));

      this.deviceForm = Object.assign({}, rowTmp[0]);
      this.dialogFormVisible = true;
      this.dialogFormTitle="123";
      this.table_index = index;
    },

    // 新增设备
    addDevice () {
      this.dialogType = 'add';   
      this.dialogTitle = '新增设备';   
      this.deviceForm = Object.assign({}, );
      this.dialogFormVisible = true;
      // this.form = Object.assign({}, row);
      // this.table_index = index;
    },
    // 取消设备编辑对话框
    cancelDevice(){
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveDevice(){
      var _this= this
          switch(this.dialogType){
             // 新增设备
            case 'add':
                {
                  if(!this.deviceForm.instrumentName||this.deviceForm.instrumentName==''){
                    this.$message.error('必须录入仪表名称!'); 
                    return;
                  }
                  if(!this.deviceForm.deviceTypeCode||this.deviceForm.deviceTypeCode==''){
                    this.$message.error('必须录入仪表类型!'); 
                    return;
                  }
                  if(!this.deviceForm.instrumentCode||this.deviceForm.instrumentCode==''){
                    this.$message.error('必须录入资产编号!'); 
                    return;
                  }
                  if(!this.deviceForm.organizationCode||this.deviceForm.organizationCode==''){
                    this.$message.error('必须录入所属单位!'); 
                    return;
                  }
                  if(!this.deviceForm.deviceStatusCode||this.deviceForm.deviceStatusCode==''){
                    this.$message.error('必须录入设备状态!'); 
                    return;
                  }
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceForm)));
                  var p = JSON.parse(JSON.stringify(rowTmp[0]));

                  this.$http.post('/instrument/', p).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message({
                          message: "添加成功！",
                          type: 'success'
                          });
                          
                          this.dialogFormVisible = false;
                          _this.searchDevice();
                      }else{
                        this.$message.error('添加失败!'); 
                      }
                  });
                }
             break;
            // 编辑设备
            case 'edit':
                {
                  if(!this.deviceForm.instrumentName||this.deviceForm.instrumentName==''){
                    this.$message.error('必须录入仪表名称!'); 
                    return;
                  }
                  if(!this.deviceForm.deviceTypeCode||this.deviceForm.deviceTypeCode==''){
                    this.$message.error('必须录入仪表类型!'); 
                    return;
                  }
                  if(!this.deviceForm.instrumentCode||this.deviceForm.instrumentCode==''){
                    this.$message.error('必须录入资产编号!'); 
                    return;
                  }
                  if(!this.deviceForm.organizationCode||this.deviceForm.organizationCode==''){
                    this.$message.error('必须录入所属单位!'); 
                    return;
                  }
                  if(!this.deviceForm.deviceStatusCode||this.deviceForm.deviceStatusCode==''){
                    this.$message.error('必须录入设备状态!'); 
                    return;
                  }
                  
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceForm)));

                  var p = JSON.parse(JSON.stringify(rowTmp[0]));

                  this.$http.put('/instrument/dsdevice', p).then((response) => {
                    // 判断更新数据是否成功
                      var isUpdatedOk = response.data;
                      if(isUpdatedOk){
                          this.$message({
                          message: "更新成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          _this.searchDevice();
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
      this.searchDevice();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchDevice();
    },
    check(e) {
      this.$nextTick(() => {
        this.deviceForm.instrumentCode = e.replace(/[^a-zA-Z0-9_-]/g,'')
      })
      
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
