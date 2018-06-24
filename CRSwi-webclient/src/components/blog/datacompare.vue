<template>
  <section>
    <el-row>
      <el-col :span="24">

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
        
        <!--表格-->
        <div style="background: #ffffff;box-shadow:0px 0px 18px #d8d8d8;padding: 30px">
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
            width="100">
          </el-table-column>
          <el-table-column
            prop="inspectorName" 
            label="巡检员"
            width="100">
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
            width="88">
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
          
          <el-table-column label="数据备案" width="180">
            <template scope="scope" style="display: flex;">
              <el-button style="display: inline-block;" type="primary" size="small" @click="verifydevice(scope.$index, scope.row)">上传比对数据</el-button>
              <el-upload
               :ref="scope.$index"
               @click.native="uploadclick(scope.$index)"     
               class='ensure ensureButt'
               show-file-list="sdada"
               :action="importFileUrl"
               :auto-upload="false"
               :on-change="uploadchange"
               :show-file-list="multiple"
               :on-exceed="uploadExceed"
               name="formData"
               :on-remove="uploadremove"
               :on-error="uploadError"
               :on-success="uploadSuccess"
               :before-upload="beforeAvatarUpload"
                style="display: inline-block;">
               <el-button style="height: 30px" multiple="false" size="small" type="primary">浏览</el-button>
              
            </el-upload>
            </template>
            
          </el-table-column>

          <el-table-column
            prop="dataConsistency"
            label="数据一致性"
            :formatter="compareFormat"
            width="90">
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
  import browserMD5File from 'browser-md5-file';
export default {
  data () {
    return {
      sdada:false,
      tabindex:"",
      multiple:true,
      limit:1,
      importFileUrl: 'http://leng45.eicp.net:10000/device/FW/fileUpload',
      params: {
        inspectorCode: null,
        organizationCode:null,
        orderStatus:null,
        pageNum:1,
        pageSize:10,
      },
      tableData: [],
      dialogFormVisible: false,
      editLoading: false,
      driverForm: {
        workDate: '',
        inspectionOrderNo: '',
        organizationCode: '',
        inspectorCode: '',
        instrumentCode: '',
        instrumentModel:'',
        dsdeviceCode: '',
        dsdeviceSerialNo:'',
        lineName: '',
        direction: '',
        inspectionPointName: '',
        orderCode:'',
        dataConsistency:'',
      },
      total: 0,
      table_index: 999,
      dialogType:'',
      show:false,
      md5_fileName:{}
    };
  },
  created () {
    this.searchWorkOrder ();
  },
  methods: {
    compareFormat(row,column){
        var comval = row['dataConsistency'];
        if(comval==0){
            return "不一致";
        }else if(comval==1){
            return "一致";
        }else{
            return "N/A";
        }
        return "N/A";
      },

    uploadclick(i){
      console.log(i)
      this.tabindex = i
    },
    dateFormat (row, column) {
      var date = row['workDate'];
      if (date === undefined) {
        return "";
      }
      return this.$dateFormat(date);
    },
     // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
    },
    uploadremove(file){
      var _this = this
       browserMD5File(file.raw, function (err, md5) {
        delete _this.tableData[_this.tabindex].md5_fileName[md5]
      });
    },
    uploadchange(file){

      var _this = this
      // this.addfirmwareTbData.firmwareSize=parseInt(file.size/1024)
       browserMD5File(file.raw, function (err, md5) {
        _this.tableData[_this.tabindex].md5_fileName[md5] = file.name
      });
    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },
      uploadExceed(files, fileList){
        console.log(files, fileList)
      },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
      var _this =this
      browserMD5File(file, function (err, md5) {
        _this.md5_fileName[md5] = file.name
        _this.$refs.uploada.abort();
      });
      // console.log(file.name.split('.')[0])
      // console.log(md5(file.name))
      // console.log(md5("25d902c24283ab8cfbac54dfa101ad31"))
      // md5('中文')
      // const extension = file.name.split('.')[1] === 'xls'
      // const extension2 = file.name.split('.')[1] === 'xlsx'
      // const extension3 = file.name.split('.')[1] === 'doc'
      // const extension4 = file.name.split('.')[1] === 'docx'
      // const extension5 = file.name.split('.')[1] === 'zip'
      const isLt2M = file.size / 1024 / 1024 < 10
      // if (!extension && !extension2 && !extension3 && !extension4&& !extension5) {
      //   console.log('上传模板只能是 xls、xlsx、doc、docx、zip 格式!')
      // }
      if (!isLt2M) {
        console.log('上传模板大小不能超过 10MB!')
      }
      // return extension || extension2 || extension3 || extension4 || extension5 && isLt2M
      return  isLt2M
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
        pageUser.list.map(function(item){
          item.md5_fileName = {}
        })
        this.tableData = pageUser.list;
        console.log(this.tableData)
      });
    },
    reset () {
      this.params.inspectorName = null;
      this.params.orgnizationName = null;
      this.searchWorkOrder();
    },
    
    // 数据比对
    verifydevice (index, row) {

        var obj = new Object();
        // obj.dataUrl = "http://leng45.eicp.net:8080/DataShield/FW";
        obj.dsdeviceCode  = row['dsdeviceCode'];  //防篡改设备编码
        obj.inspectionOrderNo  = row['inspectionOrderNo'];// 报检单号
        obj.inspector_code  = row['inspectorCode']; 
        obj.orderCode   = row['orderCode']; 
        obj.md5_fileName = this.tableData[index].md5_fileName
        console.log(JSON.parse(JSON.stringify(obj)))
        var p = JSON.parse(JSON.stringify(obj));
        // console.log(p,row)
          this.$http.post('/device/dataConsistency',p).then((response) => {
          // 判断数据比对是否成功
          // this.tableData[index].md5_fileName = {}
          // console.log(this.$refs['scope.$index'])
          // this.$refs.index.clearFiles();
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "数据比对成功！",
                 type: 'success'
                 });
                // this.tableData.splice(index, 1);
                }else{
                  this.$message.error('数据比对失败!'); 
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
