function onDeviceReady() {
    navigator.splashscreen.hide();
}
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function (){

$.ajax({
   type: 'GET',
    url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
    jsonpCallback: 'API_SC',
    contentType: "application/json",
    dataType: 'jsonp',
    data:'action=org&team=306THSP&page=1',
    async:true,
    success: function(data) {
       $('#member_guilde').html('');
		for(var i =0; i< data.nb_membre; i++){
			$('#member_guilde').append('<img src="http://robertsspaceindustries.com'+data[i].avatar+'" />'+data[i].pseudo+'<br style="clear:both" />');
		}
    },
    error: function(e) {
       console.log(e.message);
    }
});

});


