<template>
  <div id='app' style="height:100%">
  	<router-view></router-view>
  </div>
</template>
<script>
	export default {
	  data () {
	    return {

	    };
	 },
	created () {
		var user = sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")):{}
		var _this = this
		try{
			var _user = {"staffName":user.staffNumber,"staffNumber":user.staffPwd}
		}catch(e){
			this.$router.push("/login")
		} 
		this.$http.post('/staff/verfyLogin', _user).then((response) => {
  				if(response.data){
				    _this.$router.push("/index")
  				}else{
  					_this.$router.push("/login")
  				}
		    }); 
    },

  methods: {
  	
  },
}
</script>
<style>
</style>
