function onDeviceReady() {
    navigator.splashscreen.hide();
}
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(function (){
	
	$('#search_pseudo').click(function(){
		$('#member_guilde').html('');
		$('#info_pseudo').html('');
		
		var handle = 'gourmand';
		if($('#pseudo').val()){
			handle = $('#pseudo').val();
		}
				
		$.ajax({
			   type: 'GET',
			    url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
			    jsonpCallback: 'API_SC1',
			    contentType: "application/json",
			    dataType: 'jsonp',
			    data:'action=citizens&page='+handle,
			    async:false,
			    success: function(data) {
			       
			       if(data.join_date.year){
			    	   info_orga(data.team.tag);
			    	   $('#info_pseudo').html('<a href="'+data.url+
                               '" target="_blank"><img style="width:76px;height:76px;float:left" src="'+data.avatar+
                               '" /></a><div>Pseudo: '+data.title+' '+data.pseudo+' ('+data.handle+') at '+data.team.name+' ('+data.team.tag+') <img src="'+data.team.logo+'" style="float:right" /> '+data.team.nb_member+'</div><div>Inscription: '+data.join_date.month+
                               '  '+data.join_date.year+
                               '</div><div>Country: '+data.live.country+
                               '</div><div>Bio: '+data.bio+
                               '</div><div>Hour from Austin: '+data.date.Austin.hour+
                               ':'+data.date.Austin.min+
                               '</div><div>Fluent:'+data.fluent[0]+
                               '</div>');
			       }
			       else{
			    	   $('#info_pseudo').html('Citizen non reconnu, mettez bien le handle ( pseudo ) forum RSI');
			       }
			    },
			    error: function(e) {
			       console.log(e.message);
			    }
			});
		

	});



});

function info_orga(flag_team){
	$('#member_guilde').html('connection internet...');
	$.ajax({
		   type: 'GET',
		    url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
		    jsonpCallback: 'API_SC2',
		    contentType: "application/json",
		    dataType: 'jsonp',
		    data:'action=org&team='+flag_team+'&page=1',
		    async:false,
		    success: function(data) {
		    var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-a"><h3>Votre team</h3></div><div class="ui-body ui-body-a">';
		       $('#member_guilde').html();
		    	         
		       if(data.nb_membre>0){
				for(var i =0; i< data.nb_membre; i++){
					html+='<div><img src="http://robertsspaceindustries.com'
						+data[i].avatar+'" />'+data[i].title+' '+data[i].pseudo+'<h2> role :</h2><ul>'
						+data[i].role+'</ul></div><div style="clear:both"></div><hr />';
				}
				html+='</div></div>';
				$('#member_guilde').html(html);
		       }
		       else {
		    	   $('#member_guilde').html('cette organisation n’a aucun membre, êtes vous sur de son tag?');
		       }
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
}


