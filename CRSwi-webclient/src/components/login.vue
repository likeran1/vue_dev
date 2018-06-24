<template>
    <div id="login">
      <div id="loginbox">
        <img :src="imgurl" style="margin-top: 60px;display: block;margin:80px auto 20px auto;display: block;width: 80px;height: 80px">
        <h2 style="color: #015083;font-size: 20px;margin: auto;margin-bottom: 30px;text-align: center;font-weight: bold;">{{name}}</h2>
        <ul>
          <li style="background: #fbfbfb;display: flex;justify-content: space-around;border-bottom: 1px solid #e4e4e4;width: 250px;padding: 5px;margin: 0 auto 30px auto"><img :src="user" style="width: 26px;height: 26px"><input @keyup.enter="searchEnterFun" value="" ref="user" type="text" id="user" name="" style="border: none;outline: 0px;width: 250px;background:#fbfbfb;margin-left: 2px" /></li>
          <li style="background:#fbfbfb;display: flex;justify-content: space-around;margin: 0 auto 30px auto;border-bottom: 1px solid #e4e4e4;width: 250px;padding: 5px"><img :src="pass" style="width: 26px;height: 26px"><input @keyup.enter="searchEnterFun" value="" ref="password" type="password" id="password" name="" style="border: none;width: 250px;background: #fbfbfb;outline: 0px;margin-left: 2px" /></li>
          <li style="display: flex;justify-content: space-around;"><el-button id="imgbtn" @click="login" type="primary" style="width: 250px;margin:auto;height: 30px;outline: 0px;border: none;color: #fffffc;font-weight: bold;">登 录</el-button></li>
        </ul>
      </div>
    </div>
</template>
<script>
	export default {
	  data () {
	    return {
        imgurl:'static/img/logo.png',
        user:'static/img/user.png',
        pass:"static/img/password.png",
        name:"西南设计院防篡改设备管理系统"
	    };

	 },



  methods: {
  	searchEnterFun(){
  		var _this = this
      var tmp = {"staffName":this.$refs.user.value,"staffNumber":this.$refs.password.value};
      console.log(tmp)

  		if(this.$refs.user.value&&this.$refs.password.value){
  			this.$http.post('/staff/verfyLogin', {"staffName":this.$refs.user.value,"staffNumber":this.$refs.password.value}).then((response) => {
  				console.log(response.data)
  				if(response.data){
  					_this.$message.success("登录成功!")
				    _this.$router.push("/index")
				    sessionStorage.setItem("user",JSON.stringify(response.data))
  				}else{

  					_this.$message.error('登录失败!');
  				}
		    });
  		}else{
  			if(this.$refs.user.value){
  				_this.$message.error('请输入密码!');
  			}else{
  				_this.$message.error('请输入用户名!');
  			}
  			
  		}
  	},
  	login(){
  		var _this = this

  		if(this.$refs.user.value&&this.$refs.password.value){
  			this.$http.post('/staff/verfyLogin', {"staffName":this.$refs.user.value,"staffNumber":this.$refs.password.value}).then((response) => {
  				console.log(response.data)
  				if(response.data){
				    _this.$router.push("/index")
				    sessionStorage.setItem("user",JSON.stringify(response.data))
  				}else{
  					_this.$message.error('登录失败!');
  				}
		    });
  		}else{
  			if(this.$refs.user.value){
  				_this.$message.error('请输入密码!');
  			}else{
  				_this.$message.error('请输入用户名!');
  			}
  			
  		}
  	}
  },
}
</script>
<style>
  html,body{
    height:100% !important;
    width:100% !important;
  }
	#login{
		min-height: 500px;
		width: 100%;
		height: 100%;
	    position: relative;
	    background: url(../../static/img/bg.jpg) no-repeat;
	    background-size: 100%;
	    overflow: auto;
	    min-width: 1140px;
	    overflow: auto;
	}
  #loginbox{
    width: 400px;
    height: 600px;
    right: 20%;
    position:absolute;
    top:80px;
    background: url(../../static/img/login_bg.png) no-repeat;
    background-size: 100%
  }
	input{
		border: 1px solid black;
	}
	label{
		display: inline-block;
		width: 80px !important;
	}
	ul{
		margin: auto;
		padding-top: 30px
	}
  #imgbtn{
    background:url('../../static/img/btn_bg.png') no-repeat;
  }
</style>
