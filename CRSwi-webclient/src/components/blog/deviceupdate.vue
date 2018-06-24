<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div style="width:800px;border:1px solid #D0D0D0;padding: 20px;margin:auto;">
            </br>
            <!--表单-->
        <el-form :inline="true" :model="params" class="demo-form-inline" style="margin-bottom: 20px">
          <el-card class="box-card" style="width: 500px;margin: auto;">
            <div slot="header" class="clearfix" style="display: flex;justify-content: space-around;">
              <span>当前固件信息</span>
            </div>
            <table id="firmwareTb">
               <tr v-for="(val,key) in tableData" :key="key">
                <td v-if="key == 'firmwareVersion'" style="border: 1px solid black">版本</td>
                <td v-if="key == 'firmwareSize'" style="border: 1px solid black">包大小</td>
                <td v-if="key == 'firmwareMd5'" style="border: 1px solid black">MD5</td>
                <td v-if="key == 'firmwareVersion'" style="border: 1px solid black">{{val}}</td>
                <td v-if="key == 'firmwareSize'" style="border: 1px solid black">{{val}}</td> 
                <td v-if="key == 'firmwareMd5'" style="border: 1px solid black">{{val}}</td> 
              </tr>
            </table>
          </el-card>
        </el-form>
            <el-card class="box-card" style="width: 500px;margin: auto;">
            <div slot="header" class="clearfix" style="display: flex;justify-content: space-around;">
              <span>新固件信息</span>
            </div>
            
            <table id="addfirmwareTb">
               <tr >
                <td>版本</td>
                <td><el-input v-model="addfirmwareTbData.firmwareVersion" style="width:220px;"></el-input></td>
              </tr>
               <tr >
                <td>包大小</td>
                <td><el-input disabled v-model="addfirmwareTbData.firmwareSize" style="width:220px;"></el-input></td>
              </tr>
               <tr >
                <td>MD5</td>
                <td><el-input disabled v-model="addfirmwareTbData.firmwareMd5" style="width:220px;"></el-input></td>
              </tr>
               <tr style="height: 80px">
                <td>新固件包</td>
                <td style="display: flex;justify-content: space-between;width:220px;"><el-upload
               ref="upload"     
               class='ensure ensureButt'
               :action="importFileUrl"
               :multiple="multiple"
               :limit="limit"
               :on-remove="uploadremoved"
               :on-change="addfirmwareTbcg"
               :on-exceed="uploadExceed"
               name="formData"
               :on-error="uploadError"
               :on-success="uploadSuccess"
               :before-upload="beforeAvatarUpload"
               :auto-upload="false"
               >
               <el-button style="height: 30px" multiple="false" size="small" type="primary">选取文件</el-button>
              
            </el-upload>
             <el-button style="margin-left: 10px;height: 30px" size="small" type="success" @click="submitUpload">上传文件</el-button>
             </td>
              </tr>
            </table>
          </el-card>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>是否上传新固件信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisiblec">确 定</el-button>
            </span>
          </el-dialog>
            <!-- <p>固件升级：</p></br> -->
           
            <!-- <el-button type="primary" icon="search" @click="deviceupdate">固件升级</el-button> -->
        </div>
        </br>
        
        
      </el-col>
    </el-row>


  </section>
</template>

<script>
  import browserMD5File from 'browser-md5-file';
  // import crypto from 'crypto'
export default {
  data () {
    return {
      dialogVisible:false,
      addfirmwareTbData:{
        firmwareCode:"",
        firmwareMd5:"",
        firmwarePath:"",
        firmwareSize:"",
        firmwareVersion:""
      },
      multiple:false,
      limit:1,
      importFileUrl: 'http://leng45.eicp.net:10000/device/FW/fileUpload',
      params: {
        
      },
      tableData:""
    };
  },
  created () {
    this.searchDeviceFW();
      
  },

  methods: {
    
    //
    // 查询当前设备的固件信息
    // 
    handleClose(){
      this.dialogVisible=false
    },
    dialogVisiblec(){
      this.$http.put('/device/FW',this.addfirmwareTbData).then((response) => {
        if(response.data) this.searchDeviceFW();
      });
      this.dialogVisible=false
    },
    searchDeviceFW(){
      this.$http.get('/device/FW').then((response) => {
        var result = response.data;
        console.log(result)
        this.tableData = result
        this.addfirmwareTbData.firmwareCode = result.firmwareCode;

        return result;
      });
    },
    uploadremoved(){
      this.addfirmwareTbData.firmwareSize = ""
      this.addfirmwareTbData.firmwareMd5 = ""
    },
    addfirmwareTbcg(file){
      console.log(file)
      var _this =this
      this.addfirmwareTbData.firmwareSize=parseInt(file.size/1024)
       browserMD5File(file.raw, function (err, md5) {
        _this.addfirmwareTbData.firmwareMd5 = md5
      });
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      var _this =this
      this.addfirmwareTbData.firmwareSize=parseInt(file.size/1024)
       browserMD5File(file.raw, function (err, md5) {
        _this.addfirmwareTbData.firmwareMd5 = md5
      });
       this.$refs.upload.clearFiles();
       this.addfirmwareTbData.firmwarePath = response
       this.dialogVisible = true
      console.log('上传文件', response)
    },
    // 上传错误
    uploadError (response, file, fileList) {
      console.log('上传失败，请重试！')
    },
    submitUpload() {
        this.$refs.upload.submit();
      },
      uploadExceed(files, fileList){
        console.log(files, fileList)
      },
    // 上传前对文件的大小的判断
    beforeAvatarUpload (file) {
     
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
    deviceupdate(){      
      var obj = new Object();
      obj.fwMD5="c9a5e8dce501cbad2d6da4a888bfb509";
      obj.fwSize="12";
      obj.fwVersion="100.005";
      obj.url="http://leng45.eicp.net:8080/DataShield/FW/newfw.zip";

      var p = JSON.parse(JSON.stringify(obj));

      this.$http.put('/device/FW', p).then((response) => {
          // 判断命令发送是否成功
          var isRemovedOk = response.data;
          if(isRemovedOk){
                this.$message({
                 message: "升级成功！",
                 type: 'success'
                 });
                this.tableData.splice(index, 1);
                }else{
                  this.$message.error('升级失败!'); 
                }
           });
    },


  },
}

</script>
<style>
#firmwareTb{
  width: 100%
}
#addfirmwareTb{
  width: 70%;
  margin: auto;
}
#addfirmwareTb td{
  margin-bottom: 10px
}
#addfirmwareTb tr{
  display: flex;
  justify-content: space-between;
}
#firmwareTb td{
  border: 1px solid black;
  padding: 5px;
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
