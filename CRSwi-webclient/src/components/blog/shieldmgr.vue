<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 90px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 25px 0 0 50px">
          <el-form-item label="设备名称">
            <el-input v-model="params.dsdeviceName" placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="单位名称">
            <el-input v-model="params.orgnizationName" placeholder=""></el-input>
          </el-form-item>
          <el-button type="primary" icon="search" @click="searchDevice">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" icon="plus" @click="addDevice">新增设备</el-button>
        </div>
        </el-form>
        
        <!--表格-->
        <div id="shieldmgr_div" style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px 0px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">

          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-button :disabled="scope.row.dsdeviceSerialNo != 'N/A'" type="primary" size="small" @click="devicecomm(scope.$index, scope.row)">配对</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="deviceTypeCode"
            label="设备类型"
            :formatter="devtypeFormat"
            width="150">
          </el-table-column>
          <el-table-column
            prop="dsdeviceName"
            label="设备名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="dsdeviceModel"
            label="设备型号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="dsdeviceSerialNo"
            label="设备串号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="dsdeviceCode"
            label="资产编号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="orgnizationName"
            label="单位名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="deviceStatusCode"
            :formatter="devstatusFormat"
            label="设备状态"
            width="130">
          </el-table-column>
          
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button type="primary" size="small" @click="editShield(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="delShield(scope.$index, scope.row)">删除</el-button>
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

    <el-dialog @close="cancelDevice" :title="dialogType =='edit'?'修改设备':'新增设备'" v-model="dialogFormVisible" size="tiny">
      <user-form 
        :dialog-type="dialogType"
        ref="deviceForm">  
      </user-form>

      <el-form ref="deviceForm" :model="deviceForm" label-width="80px">

        <el-form-item label="设备类型">
          <!-- <el-input v-model="deviceForm.deviceTypeCode"></el-input> -->
          <el-select disabled="true" v-model="deviceForm.deviceTypeCode" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(val,key) in dics['3*设备类型']"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="设备名称">
          <el-input v-model="deviceForm.dsdeviceName"></el-input>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input v-model="deviceForm.dsdeviceModel"></el-input>
        </el-form-item>
        <el-form-item label="设备串号">
          <el-input disabled="true" v-model="deviceForm.dsdeviceSerialNo" placeholder="新设备为【N/A】"></el-input>
        </el-form-item>
        <el-form-item label="资产编号">
          <el-input clearable="true" @change="dsdeviceCodeyz" v-model="deviceForm.dsdeviceCode"></el-input>
        </el-form-item> 
        <el-form-item label="所属单位">
          <!-- <el-input v-model="deviceForm.organizationCode"></el-input> -->
            <el-select v-model="deviceForm.organizationCode" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(object,i) in orgn"
                :key= "i"
                :label="object.orgnizationName"
                :value="object.orgnizationCode">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
            <el-select v-model="deviceForm.deviceStatusCode" placeholder="请选择" style="width:100%">
              <el-option
                v-for="(val,key) in dics['4*设备状态']"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
        </el-form-item> 

        <el-form-item>
            <el-button @click="saveDevice">保 存</el-button>
            <el-button @click="cancelDevice">取 消</el-button>
        </el-form-item>       
      </el-form>
    </el-dialog>

    <el-dialog title="防篡改设备配对" v-model="dialogFormVisiblex"  style="height:700px; width:1500px">
      <!-- <user-form 
        :dialog-type="dialogType"
        ref="WorkOrderForm" 
        v-on:close="cancelWorkOrder">  
      </user-form> -->
      <div>
        <h2>操作指南：</h2>
        <ul>
          <li>1、将新设备开机，确保网络正常。</li>
          <li>2、确认该设备状态：没有配对注册(红灯每2秒闪烁)</li>
          <li>3、在下表中选取新出现的设备编号，点击【发送配对码】按钮。</li>
          <li>3.1、观察设备，红灯常亮5秒后绿灯常亮：配对成功。该设备编码自动填写到管理页面。</li>
          <li>3.2、观察设备，如果没有反应说明该设备没有上网或者是应对应列表中的其他编号。请重新选择配对。</li>
        </ul>
        <!-- <div>
          <h3>新设备串号：</h3>
          <el-button type="primary">发送配对码</el-button>
          <el-button type="danger">关闭</el-button>
        </div> -->
        <el-card class="box-card" style="margin-top: 30px">
        <div slot="header" class="clearfix">
          <span>新设备串号：</span>
          <el-button style="float: right; padding: 5px 5px;margin: 0 20px" @click="devicecommex()" type="primary">发送配对码</el-button>
           <el-button  style="float: right; padding: 5px 5px"  type="danger">关闭</el-button>
        </div>
        <div  ref="o" style="width: 100%;cursor:pointer" @click="radioss(o,index)" v-for="(o,index) in newArr" :key="o" >
           {{o}}
        </div>
      </el-card>

      </div>
      
    </el-dialog>
  </section>
</template>

<script>
export default {
  data () {
    return {
      params: {
        deviceTypeCode: null,
        dsdeviceName: null,
        orgnizationName: null,
        pageNum:1,
        pageSize:10,
      },
      tableData: [],
      dialogFormVisiblex:false,    
      dialogFormVisible: false,
      editLoading: false,
      deviceForm: {
        deviceStatusCode: '',
        deviceTypeCode: '',
        dsdeviceCode: '',
        dsdeviceModel: '',
        dsdeviceName: '',
        dsdeviceSerialNo: 'N/A',        
        organizationCode: '', 
        orgnizationName : '',      
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      newArr:[],
      radios:"",
      radio_index:0,
      deviceID:"",
      shieldmgr_loading:""
    };
    
  },

computed: {
      dsdeviceCode() {
          return this.$store.state.indexstore.dsdeviceCode
      },
      arr(){
         return this.$store.state.indexstore.arr
      },
      dics(){
        return this.$store.state.indexstore.dics
      },
      orgn(){
          return this.$store.state.indexstore.orgn
      },
  },
  beforeMount(){

    console.log(this.dsdeviceCode,this.arr,this.dics['3*设备类型'])
    // if(!this.$store.state.indexstore.user){
    //     this.$router.push("/login")
    // }
    // this.$store.state.indexstore.dsdeviceCode = 5
  },

  created () {
    this.shieldmgr_loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('#shieldmgr_div')
    });
    /*setTimeout(() => {
      this.shieldmgr_loading.close();
    }, 2000);*/
    this.searchDevice ();
  },
  methods: {

     devtypeFormat(row, column){
        var statusid = row['deviceTypeCode'];

        return this.getDicDevTText(statusid);
     },

    devstatusFormat(row, column){
      var statusid = row['deviceStatusCode'];

      return this.getDicDevSText(statusid);
    },

    getDicDevSText(key){
      var dictemp = this.dics['4*设备状态'];
        var rolevalue={};
        rolevalue=dictemp[key];
        return rolevalue;
    },

    getDicDevTText(key){
      var dictemp = this.dics['3*设备类型'];
        var rolevalue={};
        rolevalue=dictemp[key];
        return rolevalue;
    },
    //
    // 查询
    // 
    searchDevice () {

      var url = '/dsdeviceM/dsdevice/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;
      var p = JSON.parse(JSON.stringify(this.params));
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;
        console.log(pageUser.list)
        this.tableData = pageUser.list;
        this.shieldmgr_loading.close();
      });
    },
    dsdeviceCodeyz(e){
      this.$nextTick(() => {
        this.deviceForm.dsdeviceCode = e.replace(/[^a-zA-Z0-9_-]/g,'')
      })
      console.log(e.replace(/[^a-zA-Z0-9_-]/g,''))
      // this.deviceForm.dsdeviceCode = e.replace(/[^a-zA-Z0-9_-]/g,'')
      console.log(this.deviceForm.dsdeviceCode)
    },
    reset () {
      this.params.dsdeviceName = null;
      this.params.orgnizationName = null;
      this.searchDevice();
    },

    // 设备配对
    devicecomm (index, row) {

      this.deviceID = row.dsdeviceCode
        this.dialogFormVisiblex = true
        this.$http.get('/dsdeviceM/dsdevice/unpaired_serialNos').then((response) => {
        // 判断是否有新设备串号
          var isRemovedOk = response.data;
          if(isRemovedOk){
             this.newArr = isRemovedOk
          }
        });
    },
    //控制新设备串号选中状态
    radioss(o,i){
      this.radios = o
      var num = this.$refs["o"].length
      this.$refs["o"][this.radio_index].style.background="#ffffff"
      this.$refs["o"][this.radio_index].style.color="#48576a"
      this.radio_index = i
      this.$refs["o"][i].style.background="#055476"
      this.$refs["o"][i].style.color="#ffffff"
    },
    //发送配对码
    devicecommex (index, row) {
      var _this = this
        if(this.radios == ""){
          this.$message({
            message: '请选择一个新设备串号',
            type: 'warning'
          });
          return false
        }

        //存储设备串号到全状态机
        this.$store.state.indexstore.dsdeviceSerialNo = this.radios;
        console.log(this.$store.state.indexstore.dsdeviceSerialNo);

        var str = {};
        str.deviceID=this.deviceID;
        str.serialNum=this.radios;
        this.$http.post('/dsdeviceM/dsdevice/register_cmd',str).then((response) => {
          // 判断配对是否成功
          var isRemovedOk = response.data;
          var tableData_i = ""
          if(isRemovedOk){
            this.$message({
              message: '成功配对',
              type: 'success'
            });
            //模拟表格刷新
            this.dialogFormVisiblex = false
            var tableData = this.tableData
            var tableData_i_new = tableData.filter(function(item,i){
              if(item.dsdeviceCode == str.deviceID){
                tableData_i = i
                return  item.dsdeviceSerialNo = _this.radios
              }
            })
            this.tableData[tableData_i] = tableData_i_new[0]

                }else{
                  this.$message.error('删除失败!'); 
                }
           });
    },


    // 新增
    addDevice () {
      var _this = this
      this.deviceForm.dsdeviceSerialNo='N/A'
      
      for(let key in this.dics['3*设备类型']){
         if(_this.dics['3*设备类型'][key] == "防篡改设备"){
            _this.deviceForm.deviceTypeCode = key
         }
      }        
      console.log(this.dics['3*设备类型'])
      this.dialogType = 'add';      
      this.WorkOrderForm = Object.assign({}, );
      this.dialogFormVisible = true;
    },
    
    cancelDevice(){
      this.ClearDeviceForm();
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveDevice(){

          var _this = this
          switch(this.dialogType){
             // 新增
            case 'add':
                {
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceForm)));
                  var p = JSON.parse(JSON.stringify(rowTmp[0]));
                  this.$http.post('/dsdeviceM/dsdevice', p).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      
                      if(isAddedOk){
                          this.$message({
                          message: "添加成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchDevice();
                          this.ClearDeviceForm();

                      }else{
                        this.$message.error('添加失败!'); 
                      }
                  });
                }
             break;
            // 编辑
            case 'edit':
                {
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.deviceForm)));
                  var p = JSON.parse(JSON.stringify(rowTmp[0]));

                  this.$http.put('/dsdeviceM/dsdevice', p).then((response) => {
                    // 判断更新数据是否成功
                      var isUpdatedOk = response.data;
                      if(isUpdatedOk){
                          this.$message({
                          message: "更新成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchDevice();
                      }else{
                        this.$message.error('更新失败!'); 
                      }
                  });
                } 
              break;
          }
    },

    ClearDeviceForm(){
        this.deviceForm={
                deviceStatusCode: '',
                deviceTypeCode: '',
                dsdeviceCode: '',
                dsdeviceModel: '',
                dsdeviceName: '',
                // dsdeviceSerialNo: '',        
                organizationCode: '',        
              }

    },

    editShield(index, row){

        if(row['deviceStatusCode'] == "DS-OUT-01"){
            this.$message.info("设备已出库在用！"); 
            return;
        }

        this.dialogType = 'edit'; 
        var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));

        this.deviceForm = Object.assign({}, rowTmp[0]);
        this.dialogFormVisible = true;
        this.table_index = index;
    },

    delShield(index, row){
        if(row['deviceStatusCode'] == "DS-OUT-01"){
            this.$message.info("设备已出库在用！"); 
            return;
        }
        
        var p = JSON.parse(JSON.stringify(row['dsdeviceCode']))
        var parm = '/dsdeviceM/dsdevice?dsdeviceCode='+row['dsdeviceCode'];
        this.$http.delete(parm).then((response) => {
          // 判断删除数据是否成功
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

    sizeChange(val) {
      this.params.pageSize = val;
      this.searchDevice();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchDevice();
    },
  },
}

</script>
<style>
  .el-pagination {
    background-color: rgb(249, 249, 249);
    text-align: center;
    margin-top: 30px;
  }
  .el-message-box__btns .cancel {
    float: right;
    margin-left: 10px;
  }
  .active{
    background: #055476;
  }
  .el-dialog__header{
    background: #006086 !important;
    padding: 10px 10px 10px 20px !important;
  }
  .el-dialog__title{
    color: #ffffff !important;
  }
</style>
