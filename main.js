var first_check=0;
var first_check2=0;
var percent_max = 0;
var percent_max2 = 0;
var current_anim = true;
var current_anim2 = true;
var nb_bars = 33;


function onDeviceReady() {
    navigator.splashscreen.hide();
}
document.addEventListener("deviceready", onDeviceReady, false);


function progress() {

    var val = parseInt($("#percent").html());
    val ++;

    $( "#percent" ).text(val);

	// 39 bar = 100%  => 1 bar = 2,5%
	//nb_bar allumÃ© = 39 * percent / 100
	nb_bar = Math.floor(nb_bars*val / 100);

 
 		for (var i=1; i<=nb_bar; i++){
		 $('#bar_'+i).attr('src','on.png');
		}

		//console.log('val '+val+' percent '+percent_max);
    if ( val < percent_max ) {
        setTimeout( progress, 30 );
    }
    else{
        current_anim = false;
    }

}
function progress2() {


	var val2 = parseInt($("#percent2").html());
    val2 ++;

 
	$( "#percent2" ).text(val2);

	nb_bar2 = Math.floor(nb_bars*val2 / 100);
 

		
		for (var i=1; i<=nb_bar2; i++){
		 $('#bar2_'+i).attr('src','on.png');
		}

	if ( val2 < percent_max2 ) {
        setTimeout( progress2, 30 );
    }
    else{
        current_anim2 = false;
    }
}

function check_pledge(){
 
    $.ajax({
       type: 'GET',
        url: 'http://www.starpirates.fr/API/API.php',
        jsonpCallback: 'API_SC',
        contentType: "application/json",
        dataType: 'jsonp',
        data:'action=funding-goals',
        success: function(data) {
            $('#ret').html(data.current_pledge.us);
            $('#citizens').html(number_format(data.stat.data.fans,0,'.',','));
			$('#citizens_max').html(number_format(parseInt(data.stat.data.fans)+parseInt(data.stat.data.alpha_slots_left),0,'.',','));
			$('#day_passed').html(data.day_passed[0].day+'<br />');
			$('#day_passed').append(data.day_passed[1].day);
            first_check++;
			first_check2++;
            percent_max = data.current_pledge.percentless;
			percent_max2 = data.stat.data.alpha_slots_percentage;

			
            
            if(first_check==1){
            	$('.bars img').attr('src','off.png');

                if(percent_max>0){        
                    setTimeout( progress, 3000 );                 
                }
				else{
				 current_anim = false;
				}
                
            }
            else{
                
                if( !current_anim){
                   $( "#percent" ).text( percent_max );
					nb_bar = Math.floor(nb_bars*percent_max / 100);	
					//console.log('percent :'+percent_max+' nb_bar: '+nb_bar);
					for (var i=1; i<=nb_bar; i++){
					  $('#bar_'+i).attr('src','on.png');
					}					
                }
				else{
					//console.log('anim in progress...');
				}
				
            }
			
			
			if(first_check2==1){
				$('.bars2 img').attr('src','off.png');

				if(percent_max2>0){    				
                    setTimeout( progress2, 3000 );                 
                }
				else{
				 current_anim2 = false;
				}
                
            }
            else{		
				if( !current_anim2){
				   $( "#percent2" ).text( percent_max2 );
					nb_bar2 = Math.floor(nb_bars*percent_max2 / 100);	
					for (var i=1; i<=nb_bar2; i++){
					  $('#bar2_'+i).attr('src','on.png');
					}					
                }
				else{
					//console.log('anim2 in progress...');
				}
            }
                 
        },
        error: function(e) {
          
        }
    });
}


function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


$(document).ready(function (){
 var bar_gen = '';
 var bar_gen2 = '';
 for (var i=1; i<=nb_bars; i++){
 	bar_gen+='<img src="off.png" alt="|" id="bar_'+i+'"/>';
 }
 for (var i=1; i<=nb_bars; i++){
 	bar_gen2+='<img src="off.png" alt="|" id="bar2_'+i+'"/>';
 }
 $('#bar').html(bar_gen);
 $('#bar2').html(bar_gen2);
 check_pledge();
setInterval(check_pledge,60000); //refresh all minutes


$.ajax({
   type: 'GET',
    url: 'http://www.starpirates.fr/API/API.php',
    jsonpCallback: 'API_SC2',
    contentType: "application/json",
    dataType: 'jsonp',
    data:'action=ship',
    async:true,
    success: function(data) {
       $('#ship').html('');
		for(var i =0; i< data.ship.total; i++){
			$('#ship').append('<img width="90" onclick="location.href=this.src" src="https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'+data.ship[i].imageurl+'" style="float:left" />'+data.ship[i].manufacturer+' : '+data.ship[i].title+'<br style="clear:both" />');
		}
    },
    error: function(e) {
       console.log(e.message);
    }
});

});


