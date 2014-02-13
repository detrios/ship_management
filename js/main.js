function onDeviceReady() {
    navigator.splashscreen.hide();
}
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function (){
	
	$('#search_orga').click(function(){
		var team = '306THSP';
		$('#member_guilde').html('<img src="css/themes/images/icons-png/clock-white.png" />');
		if($('#orga_name').val()){
			team = $('#orga_name').val();
		}
		$.ajax({
			   type: 'GET',
			    url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
			    jsonpCallback: 'API_SC',
			    contentType: "application/json",
			    dataType: 'jsonp',
			    data:'action=org&team='+team+'&page=1',
			    async:true,
			    success: function(data) {
			       $('#member_guilde').html('');
			       if(data.nb_membre>0){
					for(var i =0; i< data.nb_membre; i++){
						$('#member_guilde').append('<img src="http://robertsspaceindustries.com'+data[i].avatar+'" />'+data[i].pseudo+'<br style="clear:both" />');
					}
			       }
			       else {
			    	   $('#member_guilde').append('cette organisation na aucun membre, etes vous sur de son tag?');
			       }
			    },
			    error: function(e) {
			       console.log(e.message);
			    }
			});
	});



});


