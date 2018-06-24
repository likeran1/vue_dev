<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div style="width:800px;height:120px;border:1px solid #D0D0D0;">
            </br>
            <p>操作指南：</p></br>
            <p>1、请确认与工单对应防篡改设备编号已经回库，并保持开机上网。</p></br>
            <p>【解绑】点击后设备会自动操作。等待“状态”变为“解绑入库”完成操作！</p>
        </div>
        </br>
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 100px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 30px 0 0 50px">
          <el-form-item label="单位名称">
            <el-input v-model="params.orgnizationName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="巡检员">
            <el-input v-model="params.inspectorName" placeholder=""></el-input>
          </el-form-item> 

          <el-button type="primary" icon="search" @click="searchWorkOrder">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
        </el-form>
        
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px">
        <!--表格-->
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="workDate"
            label="出工日期"
            :formatter="dateFormat"
            width="120">
          </el-table-column>

          <el-table-column
            prop="inspectionOrderNo"
            label="报检单号"
            width="140">
          </el-table-column>

          <el-table-column
            prop="orgnizationName"
            label="单位名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="inspectorName"
            label="巡检员"
            width="110">
          </el-table-column>
          <el-table-column
            prop="instrumentModel"
            label="仪表型号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="instrumentCode"
            label="仪表编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dsdeviceCode"
            label="防篡改设备编号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="dsdeviceSerialNo"
            label="设备串号"
            width="130">
          </el-table-column>
          
          <el-table-column
            prop="orderStatus"
            label="状态"
            :formatter="orderFormat"
            width="120">
          </el-table-column>
          
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-button type="primary" size="small" @click="unverifydevice(scope.$index, scope.row)">解绑</el-button>
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
        inspectorName: null,
        orgnizationName:null,
        orderStatus:"T-DAT-04",
        pageNum:1,
        pageSize:10,
      },
      tableData: [],
      dialogFormVisible: false,
      editLoading: false,
      driverForm: {
          workDate: '',
          inspectionOrderNo: '',
          orgnizationName: '',
          inspectorName: '',
          instrumentCode: '',
          instrumentModel: '',
          dsdeviceCode: '', 
          dsdeviceSerialNo:'',
          orderStatus: '',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
    };
  },  
  computed: {
      dics(){
        return this.$store.state.indexstore.dics
      }
  },
  created () {
    this.searchWorkOrder ();
  },
  methods: {

    orderFormat(row, column){
      var orderid = row['orderStatus'];

      return this.getDicText(orderid);      
    },

    getDicText(key){
      var dictemp = this.dics['6*工单状态'];
        var rolevalue={};
        rolevalue=dictemp[key];
        return rolevalue;
    },

    dateFormat (row, column) {
      var date = row['workDate'];
      if (date === undefined) {
        return "";
      }
      return this.$dateFormat(date);
    },

    //
    // 查询司机
    // 
    searchWorkOrder () {
      var url = '/workOrders/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;

      var p = JSON.parse(JSON.stringify(this.params));
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;

        this.tableData = pageUser.list;
      });
    },
    reset () {
      this.params.inspectorName = null;
      this.params.orgnizationName = null;
      this.searchWorkOrder();
    },

    //解除绑定
    unverifydevice(index, row){
        ///deviceC/verBinding
        var obj = new Object();
        obj.cmcSerialNum=null;
        obj.deviceID=row['dsdeviceCode'];
        obj.serialNum=row['dsdeviceSerialNo'];
        obj.ticketsNum = row['inspectionOrderNo'];

        var p = JSON.parse(JSON.stringify(obj));
        this.$http.post('/device/unBinding', p).then((response) => {
          // 判断新增数据是否成功
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "解绑成功！",
                 type: 'success'
                 });
                // this.tableData.splice(index, 1);
                }else{
                  this.$message.error('解绑失败!'); 
                }
           });
    },

    sizeChange(val) {
      this.params.pageSize = val;
      this.searchWorkOrder();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchWorkOrder();
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
