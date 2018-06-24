<template>
    <div id="login">
      <img :src="imgurl" style="width:100%;height:100%;">
      <!-- <div id="loginbox">
        <img :src="imgurl" style="margin-left: 250px;margin-top: 80px">
        <h2 style="color: #1d90e6;font-size: 24px;margin-left: 120px;margin-top: 30px;margin-bottom: 40px">{{company}}</h2>
      
        <h2 style="color: #1d90e6;font-size: 24px;margin-left: 120px;margin-top: 30px;margin-bottom: 40px">{{project}}</h2>
        
      </div> -->
    </div>
</template>
<script>
	export default {
	  data () {
	    return {
        imgurl:'static/img/home.png',
        company:'中铁西南科学研究院有限公司',
        project:'防篡改设备管理系统'
	    };

	 },



  methods: {

  },
}
</script>
<style>
  html,body{
    height:100% !important;
    width:100% !important;
  }
	#login{
		width: 100%;
		height: 100%;
    position: relative;
    
	}
  
</style>
