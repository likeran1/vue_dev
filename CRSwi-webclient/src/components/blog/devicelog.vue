<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div style="width:800px;height:100px;border:1px solid #D0D0D0;">
            </br>
            <p>操作指南：</p></br>
            <p>1、请将防篡改设备开机上网，系统会自动探测在线设备。</p></br>
            <p>2、在【设备列表】中选中与设备铭牌上设备号对应的项，完成操作。</p></br>
        </div>
        </br>
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline">
          <el-button type="primary" icon="search" @click="searchDeviceLog">刷新设备列表</el-button>
        </el-form>
        
        <!--表格-->
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          </el-table-column>
          <el-table-column
            prop="dsdeviceCode"
            label="防篡改设备编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="dsdeviceSerialNo"
            label="防篡改设备串号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="orgnizationName"
            label="单位名称"
            width="100">
          </el-table-column>

          <el-table-column
            prop="deviceStatusCode"
            label="设备状态"
            :formatter="devstatusFormat"
            width="120">
          </el-table-column>
          <el-table-column
            prop="logTransPortStatus"
            label="传输状态"
            width="120">
          </el-table-column>

          <el-table-column label="操作" width="120">
            <template scope="scope">
              <el-button type="primary" size="small" @click="getdevicelog(scope.$index, scope.row)">收取设备日志</el-button>
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


  </section>
</template>

<script>
export default {
  data () {
    return {
      params: {

      },
      tableData: [],
      dialogFormVisible: false,
      editLoading: false,
      driverForm: {
        dsdeviceCode: '',       //防篡改设备编号
        dsdeviceSerialNo: '',     //防篡改设备串号
        orgnizationName: '',     //所属单位
        deviceStatusCode: '',     //设备状态
        logTransPortStatus: '',  //传输状态
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      myInterval:'',
    };
  },
  computed: {
      dics(){
        return this.$store.state.indexstore.dics
      }
  },
  created () {
      this.searchDeviceLog ();
      
  },
  mounted(){
    //console.log(this.dics,this.orgn);
    this.myInterval = setInterval(this.intervalSearch,3000);
  },
  beforeDestroy() {
      
      clearInterval(this.myInterval);
  },
  destroyed(){
        
  },
  methods: {

     intervalSearch(){
      this.searchDeviceLog ();
    },

    devstatusFormat(row, column){
      var statusid = row['deviceStatusCode'];

      return this.getDicText(statusid);
    },

    getDicText(key){
      var dictemp = this.dics['4*设备状态'];
        var rolevalue={};
        rolevalue=dictemp[key];
        return rolevalue;
    },
    //
    // 查询
    // 
    searchDeviceLog () {

      console.log(this.myInterval);

      this.$http.get('/device/log').then((response) => {
        var pageUser = response.data;

        this.tableData = pageUser;
      });
    },

    //防篡改设备日志采集
    getdevicelog(index, row){
        var obj = new Object();
        obj.deviceID=row['dsdeviceCode'];
        obj.serialNum=row['dsdeviceSerialNo'];

        var p = JSON.parse(JSON.stringify(obj));
        this.$http.post('/device/upLog', p).then((response) => {

          var isRemovedOk = response.data;

          if(isRemovedOk){
                this.$message({
                 message: "日志采集成功！",
                 type: 'success'
                 });
                // this.tableData.splice(index, 1);
                }else{
                  this.$message.error('日志采集失败!'); 
                }
           });
    },
    
    sizeChange(val) {
      this.params.pageSize = val;
      this.searchDeviceLog();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchDeviceLog();
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
</style>
