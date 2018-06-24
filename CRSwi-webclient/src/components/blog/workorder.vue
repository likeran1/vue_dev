<template>
  <section  style="">
    <el-row>
      <el-col :span="24">
        <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="height: 100px;background: #ffffff;margin-bottom: 15px;box-shadow:0px 0px 18px #d6d6d6;">
          <div style="padding: 30px 0 0 50px">
          <el-form-item label="单位名称">
            <el-input v-model="params.orgnizationName" placeholder=""></el-input>
            <!-- <el-select v-model="WorkOrderForm.organizationCode" placeholder="请选择" style="width:210px">
              <el-option
                v-for="(object,i) in orgn"
                :key= "i"
                :label="object.orgnizationName"
                :value="object.orgnizationCode">
              </el-option>
            </el-select>
             -->
          </el-form-item>

          <el-form-item label="巡检员">
            <el-input v-model="params.inspectorName" placeholder=""></el-input>
          </el-form-item>                   
          
          <el-button type="primary" icon="search" @click="searchWorkOrder">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" icon="plus" @click="addWorkOrder">新增工单</el-button>
        </div>
        </el-form>
        <div id="workOrder_div" style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px 0">
        <!--表格-->
        <el-table
          :data="tableData"
          border
          style="width: 100%">

          <el-table-column label="选择" width="70">
            <template scope="scope">
              <el-button :disabled="scope.row.orderStatus != 'T-NEW-01'" type="primary" size="small" @click="signWorkOrder(scope.$index, scope.row)">签发</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="workDate"
            label="出工日期"
            :formatter="dateFormat"
            width="110">
          </el-table-column>
          <el-table-column
            prop="inspectionOrderNo"
            label="报检单号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orderStatus"
            label="工单状态"
            :formatter="orderFormat"
            width="120">
          </el-table-column>
          <el-table-column
            prop="orgnizationName"
            label="单位名称"
            width="100">
          </el-table-column>
          <el-table-column
            prop="orgnizationCode"
            label="单位编码"
            width="0" v-if="show">
          </el-table-column>
          <el-table-column
            prop="inspectorCode"
            label="巡检员"
            width="0" v-if="show">
          </el-table-column>
          <el-table-column
            prop="inspectorName"
            label="巡检员"
            width="100">
          </el-table-column>
          <el-table-column
            prop="instrumentCode"
            label="仪表编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="instrumentModel"
            label="仪表型号"
            width="120">
          </el-table-column>
          
          <el-table-column
            prop="dsdeviceCode"
            label="防篡改设备编号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="dsdeviceSerialNo"
            label="设备串号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="lineName"
            label="巡检线路名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="direction"
            label="方向标识"
            width="100">
          </el-table-column>
          <el-table-column
            prop="inspectionPointName"
            label="巡检点名称"
            width="110">
          </el-table-column>
          <el-table-column
            prop="orderCode"
            label="工单编码"
            width="0" v-if="show">
          </el-table-column>
          
          <el-table-column label="操作" width="140" header-align="center">
            <template scope="scope">
              <el-button :disabled="scope.row.orderStatus != 'T-NEW-01'" type="primary" size="small" @click="editWorkOrder(scope.$index, scope.row)">编辑</el-button>
              
              <el-button v-if="currole!='ROLE-STAFF-03'" :disabled="scope.row.orderStatus == 'T-SIGHED-02' || scope.row.orderStatus == 'T-OUT-03' || scope.row.orderStatus == 'T-DAT-04'" type="danger" size="small" @click="deleteWorkOrder(scope.$index, scope.row)">删除</el-button>
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

    <el-dialog @close="cancelWorkOrder" :title="dialogType =='edit'?'修改工单':'新增工单'" v-model="dialogFormVisible"  style="height:700px; width:1500px">
      <user-form 
        :dialog-type="dialogType"
        ref="WorkOrderForm" 
        >  
      </user-form>

      <el-form style="display: flex;flex-wrap: wrap;justify-content: space-between;" ref="WorkOrderForm" :model="WorkOrderForm" label-width="120px">
        <div>
          <el-form-item label="出工日期">
             <!-- <el-date-picker type="date" placeholder="出工日期" v-model="WorkOrderForm.workDate" style="width: 210px;" ></el-date-picker> -->
            <el-date-picker v-model="WorkOrderForm.workDate" type="date"  @change="dateChangebirthday"  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  placeholder="出工日期">
            </el-date-picker>

          </el-form-item>
        </div>

        <div style="50%">
          <el-form-item label="报检单号">
            <el-input v-model="WorkOrderForm.inspectionOrderNo" @change="ordernoVerfy" style="width:210px;"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="单位名称"> 
           <el-select v-model="WorkOrderForm.organizationCode" placeholder="请选择" v-on:change="getOrgan($event)" style="width:210px">
              <el-option
                v-for="(object,i) in orgn"
                :key= "i"
                :label="object.orgnizationName"
                :value="object.orgnizationCode">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="巡检员">
          <el-select v-model="WorkOrderForm.inspectorCode" placeholder="请先选择单位" style="width:210px">
              <!-- <el-option
                v-if="dialogType =='edit'?'selstaff=staff':'selstaff'"
                v-for="(object,i) in selstaff"
                :key= "i"
                :label="object.staffName"
                :value="object.staffCode">
              </el-option> -->

              <el-option
                v-if="dialogType =='edit'"
                v-for="(object,i) in staff"
                :key= "i"
                :label="object.staffName"
                :value="object.staffCode">
              </el-option>
              <el-option
                v-if="dialogType =='add'"                
                v-for="(object,i) in selstaff"
                :key= "i"
                :label="object.staffName"
                :value="object.staffCode">
              </el-option>

            </el-select>
          <!-- <el-input v-model="WorkOrderForm.inspectorCode" style="width:210px;"></el-input> -->
        </el-form-item>
        <el-form-item label="仪表编号">
          <!-- <el-input v-model="WorkOrderForm.instrumentCode" style="width:210px;"></el-input> -->
          <el-select v-model="WorkOrderForm.instrumentCode" placeholder="请选择" style="width:210px">
              <el-option
                v-for="(object,i) in instrumentCodeList"
                v-if="object.deviceStatusCode =='DS-IN-01'"
                :key= "i"
                :label="object.instrumentCode"
                :value="object.instrumentCode">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="防篡改设备编号">
          <el-select v-model="WorkOrderForm.dsdeviceCode" placeholder="请选择" style="width:210px">
              <el-option
                v-for="(object,i) in dsdeviceCodeList"
                v-if="object.deviceStatusCode == 'DS-IN-01' && object.dsdeviceSerialNo!='N/A'"
                :key= "i"
                :label="object.dsdeviceCode"
                :value="object.dsdeviceCode">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="巡检线路名称">
          <el-input v-model="WorkOrderForm.lineName" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="方向标识">
          <el-input v-model="WorkOrderForm.direction" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="巡检点名称">
          <el-input v-model="WorkOrderForm.inspectionPointName" style="width:210px;"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogType=='edit'" label="工单编码">
          <el-input disabled="true" v-model="WorkOrderForm.orderCode" style="width:210px;"></el-input>
        </el-form-item>
        <br/>
        <el-form-item style="margin-right:80px;width:100%;display:flex;justify-content:space-around;">
            <el-button @click="saveWorkOrder">保 存</el-button>
            <el-button @click="cancelWorkOrder">取 消</el-button>
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
        inspectorName: null,
        orgnizationName:null,
        pageNum:1,
        pageSize:10,
      },
      tableData: [],
      dialogFormVisible: false,
      editLoading: false,
      WorkOrderForm: {
        workDate: '',
        inspectionOrderNo: '',
        organizationCode: '',
        orgnizationCode: '',
        orgnizationName: '',
        inspectorCode: '',
        inspectorName: '',
        instrumentCode: '',
        instrumentModel:'',
        dsdeviceCode: '',
        dsdeviceSerialNo:'',
        lineName: '',
        direction: '',
        inspectionPointName: '',
        orderCode:'',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      show:false,
      instrumentCodeList:[],
      dsdeviceCodeList:[],
      selstaff:"",
      currole:"",
      curorgn:"",
      workorder_loading:""
    };
  },
  computed: {
      dics(){
        return this.$store.state.indexstore.dics
      },
      orgn(){
          return this.$store.state.indexstore.orgn
      },
      staff(){
        return this.$store.state.indexstore.staff
      }
  },
  created () {
    var us = JSON.parse(sessionStorage.getItem("user")); 
    console.log(us);
    this.currole = us.staffRole;
    console.log(this.currole);
    this.curorgn=us.organizationCode;

    this.workorder_loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('#workOrder_div')
    });

    var _this = this
    this.searchWorkOrder();

      //获取本单位的仪表
      var url = '/instrument/pages?pageNum='+this.params.pageNum+'&pageSize='+1000;
      var p = JSON.parse(JSON.stringify(this.params));
        this.$http.post(url, p).then((response) => {
          for(var ins in response.data.list){
            if(response.data.list[ins].organizationCode == this.curorgn){
                _this.instrumentCodeList.push(response.data.list[ins])
            }
          }
          //_this.instrumentCodeList = response.data.list;        
      });

      //获取本单位的防篡改设备
      var urla = '/dsdeviceM/dsdevice/pages?pageNum='+this.params.pageNum+'&pageSize='+1000;
      var pa = JSON.parse(JSON.stringify(this.params));
      this.$http.post(urla, pa).then((response) => {
        for(var dev in response.data.list){
            if(response.data.list[dev].organizationCode == this.curorgn){
                _this.dsdeviceCodeList.push(response.data.list[dev]);
            }
        }
        //_this.dsdeviceCodeList = response.data.list;
      }); 
  },
  mounted(){
    console.log(this.dics,this.orgn)
  },

  methods: {

    //只允许输入字母和数字
    ordernoVerfy(e){
      this.$nextTick(() => {
        this.WorkOrderForm.inspectionOrderNo = e.replace(/[^a-zA-Z0-9]/g,'')
      })
    },
    
    dateChangebirthday(val){
      this.WorkOrderForm.workDate =val;
    },

    dateFormat (row, column) {
      var date = row['workDate'];
      if (date === undefined) {
        return "";
      }
      return this.$dateFormat(date);
    },
    
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

    getOrgan:function(selorg){
      let tempstaff=[];
      for(var val of this.staff){
        if(selorg == val.organizationCode){
            tempstaff.push(val);
        }
      }

      console.log(tempstaff);
      this.selstaff = tempstaff;
    },
    //
    // 查询
    // 
    searchWorkOrder () {
      var url = '/workOrders/pages?pageNum='+this.params.pageNum+'&pageSize='+this.params.pageSize;

      var p = JSON.parse(JSON.stringify(this.params));
      this.$http.post(url, p).then((response) => {
        var pageUser = response.data;
        this.total = pageUser.total;
        this.params.pageNum = pageUser.pageNum;
        
        for(var or in pageUser.list){
            if(this.curorgn == pageUser.list[or].orgnizationCode && this.currole!='ROLE-SYS-01'){
                this.tableData.push(pageUser.list[or]);
            }
        }

        //this.tableData = pageUser.list;
        this.workorder_loading.close();//关闭loading效果
      });

    },
    reset () {
      this.params.inspectorName = null;
      this.params.orgnizationName = null;
      this.searchWorkOrder();
    },

    // 删除
    deleteWorkOrder (index, row) {
          console.log(row['orderCode'])
          this.$http.delete('/workOrders/?orderCode='+row['orderCode']).then((response) => {
          // 判断删除数据是否成功
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "删除成功！",
                 type: 'success'
                 });
                this.tableData.splice(index, 1);
                }else{
                  this.$message.error('设备出库在用，不能删除!'); 
                }
           });
    },

    editWorkOrder(index, row) {
      this.dialogType = 'edit'; 
      var rowTmp =  [].concat(JSON.parse(JSON.stringify(row)));

      this.WorkOrderForm = Object.assign({}, rowTmp[0]);
      this.WorkOrderForm.organizationCode = row.orgnizationCode
      this.dialogFormVisible = true;
      this.table_index = index;
    },

    //签发
    signWorkOrder(index,row){
        // console.log(JSON.parse(sessionStorage.getItem("user")).staffName)
        var obj = new Object();
        obj.bandStatus = "Banded";
        obj.deviceID = row['dsdeviceCode'];
        obj.serialNum = row['dsdeviceSerialNo'];
        obj.staffID = row['inspectorCode'];
        obj.userID = JSON.parse(sessionStorage.getItem("user")).staffNumber;

        var todvobj1 = new Object();
        todvobj1.instrumentID = row['instrumentCode'];//受控仪表编码
        todvobj1.instrumentName =row['instrumentModel'];//受控仪表型号 
        todvobj1.lineDirection = row['direction'];    //线路名 
        todvobj1.lineID = row['lineName'];            //线路编号 ,
        todvobj1.mileNum = row['inspectionPointName'];        //工作区段编号(里程点) ,

        var tDate = new Date(row['workDate']);
        var tyear = tDate.getFullYear();
        var tmonth = tDate.getMonth()+1;
        var tday = tDate.getDate();
        var rDate = [tyear,tmonth,tday].join('-');

        todvobj1.ticketDate = rDate;  //单实施日期(出现场日期) ,
        todvobj1.ticketID = row['inspectionOrderNo']; //报检单号

        var arylst = Array();
        arylst.push(todvobj1);

        obj.ticketList = arylst;
        
        var p = JSON.parse(JSON.stringify(obj));
        console.log(p)
        this.$http.post('/device/Binding',p).then((response) => {
            
          // 判断新增数据是否成功
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "签发成功!",
                 type: 'success'
                 });

                this.searchWorkOrder();

                }else{
                  this.$message.error('签发失败!'); 
                }
           });
    },

    // 新增工单
    addWorkOrder () {
      this.dialogType = 'add';      
      this.WorkOrderForm = Object.assign({}, );
      this.dialogFormVisible = true;
    },
    // 取消驾驶员编辑对话框
    cancelWorkOrder(){
      this.dialogFormVisible = false;    //隐藏el-dialog
    },

    saveWorkOrder(){
          switch(this.dialogType){
             // 新增
            case 'add':
                {
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.WorkOrderForm)));
                  console.log(rowTmp[0]);
                  // console.log(JSON.stringify(rowTmp[0]))
                  var p = JSON.parse(JSON.stringify(rowTmp[0]));
                  this.$http.post('/workOrders/', p).then((response) => {
                    // 判断新增数据是否成功
                      var isAddedOk = response.data;
                      if(isAddedOk){
                          this.$message({
                          message: "添加成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchWorkOrder();
                      }else{
                        this.$message.error('添加失败!'); 
                      }
                  });
                }
             break;
            // 编辑
            case 'edit':
                {
                  var rowTmp =  [].concat(JSON.parse(JSON.stringify(this.WorkOrderForm)));
                  var p = JSON.parse(JSON.stringify(rowTmp[0]));
                  console.log(rowTmp[0]);
                  this.$http.put('/workOrders/', p).then((response) => {
                    // 判断更新数据是否成功
                      var isUpdatedOk = response.data;
                      if(isUpdatedOk){
                          this.$message({
                          message: "更新成功！",
                          type: 'success'
                          });
                          this.dialogFormVisible = false;
                          this.searchWorkOrder();
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
  .el-dialog__header{
    background: #006086 !important;
    padding: 10px 10px 10px 20px !important;
  }
  .el-dialog__title{
    color: #ffffff !important;
  }
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
