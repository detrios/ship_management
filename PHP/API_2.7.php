<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: text/javascript; charset=UTF-8');
date_default_timezone_set('America/Denver');
$austin_date =	date("Y-m-d H:i:s"); 
$austin_day = date("d");
$austin_month = date("m");
$austin_hour = date("H");
$austin_min  =date("i");

date_default_timezone_set('America/Los_Angeles');
$la_date =	date("Y-m-d H:i:s"); 
$la_day = date("d");
$la_month = date("m");
$la_hour = date("H");
$la_min  =date("i");

function date_diff2($date1, $date2) { 
    $current = $date1; 
    $datetime2 = @date_create($date2); 
    $count = 0; 
    while(@date_create($current) < $datetime2){ 
        $current = gmdate("Y-m-d", @strtotime("+1 day", strtotime($current))); 
        $count++; 
    } 
    return $count; 
} 


$day_dogfight= $day_social = $day_shipboarding = $day_alpha = $day_beta =0;
$pubs ='{
"0":{"link":"http://www.starpirates.fr","img":"http://www.starpirates.fr/images/banieregadget.jpg"},
"1":{"link":"http://operationpitchfork.com/","img":"http://imageshack.us/a/img89/6898/ctff.jpg"},
"total":"2"
}';

$day_passed ='{
"0":{ "day":"'.date_diff2('2012-10-18', date('Y-m-d')).' day since kickstarter begin"},
"1":{ "day":"'.date_diff2('2013-08-29', date('Y-m-d')).' day since hangar module"}
}';
?>

<?php 
$auteur = 'Gourmand';
$version = '2.7';
$actions = '{"0" : "funding-goals", "1":"ship" ,"2":"home" ,"3":"citizens", "4":"org"}';
if(isset($_GET["action"])){
	$action = $_GET["action"];
}
else{
	$action='';
}
if(isset($_GET["page"])){
	$page = $_GET["page"];
}
else{
	$page='';
}
if(isset($_GET["callback"])){
	$callback = $_GET["callback"];
}
else{
	$callback='API_SC';
}

switch ($action){
	
	case 'trace': 
		$fp = file_get_contents('https://robertsspaceindustries.com/'.$page);
		$fp = str_replace(array("\n","\r","\t"),' ',$fp);
		
		echo $fp;
		break;
		
		
	case 'org':
		if(!isset($_GET['team'])){
			$team = "306THSP";
		}
		else{
			$team = $_GET['team'];
		}
		if(!$page) $page = 1;

		echo $callback.' ({';
		
		
		$url = 'https://robertsspaceindustries.com/api/orgs/getOrgMembers';
		$data = array ('page' => $page, 'pagesize' => 250, 'search' => '', 'symbol' =>$team);
		$options = array(
				'http' => array(
						'header' => "Content-type: application/x-www-form-urlencoded\r\n",
						'method' => 'POST',
						'content' => http_build_query($data),
				),
		);
		
		$context = stream_context_create($options);
		$result = file_get_contents($url, false, $context);
		$result = str_replace("\\",'',$result);
		
		$regexp_nb ='totalrows":"(.+)"';
		preg_match('#'.$regexp_nb.'#U',$result,$matches);
		$nb_membres = $matches[1];
		
		
		$pregmatch='data-member-id="(.+)" data-member-nickname=".+" data-member-displayname="(.+)" data-member-avatar=".*">ntt<div class="abs-overlay trans-03s illuminator"></div>ntt<a class="membercard js-edit-member" href="(.+)">nttt<span class="thumb">ntttt<img src="(.+)" />nttt</span>nttt<span class="right">ntttt<span class="abs-overlay trans-03s roles">nttttt<span class="title">ROLES:</span>nttttt<ul class="rolelist">(.+)</ul>ntttt</span>ntttt<span class="trans-03s frontinfo">nttttt<span class="name-wrap">ntttttt<span class="trans-03s name">.+</span>ntttttt<span class="trans-03s nick">.+</span>nttttt</span>nttttt<span class="ranking-stars">ntttttt<span class="stars" style=".+"></span>nttttt</span>nttttt<span class="rank">(.+)</span>';
		preg_match_all('#'.$pregmatch.'#U',$result,$ret);
		array_shift($ret);
		
		$nb_ret = count($ret[0]);
		for($i=0;$i<$nb_ret;$i++){
			$purge_role = preg_replace('#nt+#','',$ret[4][$i]);
			echo '"'.$i.'":{"id_user":'.$ret[0][$i].',"pseudo":"'.$ret[1][$i].'","card":"'.$ret[2][$i].'", "avatar":"'.$ret[3][$i].'","role":"'.str_replace('"','\"',$purge_role).'","title":"'.$ret[5][$i].'"},';
		}
		//print_r($ret);
		
		
		echo '"nb_membre":'.$nb_membres;
		echo '});';
		break;
		
		
	case 'citizens':	
		$fp = file_get_contents('https://robertsspaceindustries.com/citizens/'.$page);
		$fp = str_replace(array("\n","\r","\t"),' ',$fp);

		
		/*preg_match('#<div +id="account-profile"> +<div class="top-section"> +<p>UEE CITIZEN RECORD \#([0-9]+)</p> +</div> +<div class="content-section"> +<div class="left"> +<div class="avatar"> +<img src="(.+)" width="115" height="115" /> +</div> +</div> +<div class="right"> +<div class="basic-infos"> +<h2>(.+)</h2> +<p><span class="handle"><strong>.+</strong></span>.+<span class="enlisted"><strong>Enlisted:</strong>(.+)</span></p> +<div class="light"></div> +</div> +<div class="row clearfix"> +<h3 class="display-title"> +<span class="icon"></span>(.+)</h3> +</div> +<div class="row clearfix"> +<label>BIO</label> +<div class="text">(.*)</div> +</div> +<div class="row clearfix"> +<label>WEBSITE</label> +<div class="text"> +<a class="js-modal-outbound" href=\'(.*)\' target="_blank">(.*)</a> +</div> +</div> +<div class="row clearfix"> +<label>LOCATION</label> +<div class="text">(.+)</div> +</div> +<div class="row clearfix last"> +<label>FLUENCY</label> +<div class="text">(.+)</div>#U',$fp,$ret);*/
					
		preg_match('#<img src="(.+)" width="115" height="115" /> +</div> +</div> +<div class="right"> +<div class="basic-infos"> +<h2>.+</h2> +<p><span +class="handle"><strong>(.+)</strong></span>.+<span +class="enlisted"><strong>Enlisted:</strong>(.+)</span></p> +<div class="light"></div> +<div class="display-title"> +<span class="icon"> +<img src="(.+)"/> +</span> +<span class="title">.+</span> +</div> +</div> +<div class="rows"> +<div class="row clearfix"> +<label>BIO</label> +<div class="text">(.+)</div> +</div> +<div class="row clearfix"> +<label>WEBSITE</label> +<div class="text"> +<a class="js-modal-outbound" href=\'(.+)\' target="_blank">.+</a> +</div> +</div> +<div class="row clearfix"> +<label>LOCATION</label> +<div class="text">(.+)</div> +</div> +<div class="row clearfix"> +<label>FLUENCY</label> +<div class="text">(.+)</div> +</div> +</div><!-- rows --> +<div class="org"> +<div class="org-stamp js-org" data-org-name="" data-org-sid=""> +<div class="org-stamp-info"> +<span class="rank trans-02s">(.+)</span><br/> +<a href="(.+)"><img class="trans-02s" src="(.+)" /></a><br/> +<a class="name trans-02s" href="(.+)">(.+)</a> +<p class="clearfix"> +<span class="symbol">(.+)</span> +<span class="count">(.+)</span> +</p> +</div> +</div> +</div>#U',$fp,$ret);
		array_shift($ret);
		
		
		$fluents = explode(",",$ret[7]);
		$obj_fluent='';
		$tot_fluent =count($fluents);
		for($i=0;$i<$tot_fluent;$i++){
		$obj_fluent.='"'.$i.'":"'.trim($fluents[$i]).'",';
		}
		$obj_fluent .= '"total":"'.$tot_fluent.'"';
		
		$tab_country = explode(",",$ret[6]);
		
		list($month_day,$join_year) = explode(",",$ret[2]);
		list($join_month,$join_day) = explode(" ",trim($month_day));
		?>
		<?php echo $callback ?>({ 
	
    "Author" : "<?php echo $auteur; ?>",
    "version" : "<?php echo $version; ?>",
    "action" : <?php echo $actions; ?>,
	"pub" : <?php echo $pubs; ?>,
	"day_passed" : <?php echo $day_passed; ?> ,
	"date" : {"Austin":{"fulldate":"<?php echo $austin_date; ?>","day":"<?php echo $austin_day; ?>","month":"<?php echo $austin_month; ?>","hour":"<?php echo $austin_hour; ?>","min":"<?php echo $austin_min; ?>"},"Los_Angeles":{"fulldate":"<?php echo $la_date; ?>","day":"<?php echo $la_day; ?>","month":"<?php echo $la_month; ?>","hour":"<?php echo $la_hour; ?>","min":"<?php echo $la_min; ?>"}},
"avatar":"https://robertsspaceindustries.com/<?php echo trim($ret[0]); ?>",
"pseudo":"<?php echo str_replace('"','\"',trim($ret[1])); ?>",
"join_date":{"month":"<?php echo trim($join_month); ?>","day":"<?php echo trim($join_day); ?>","year":"<?php echo trim($join_year); ?>"}, 
"title":"<?php echo trim($ret[8]); ?>",
"bio":"<?php echo str_replace('"','\"',trim($ret[4])); ?>",
"url":"<?php echo trim($ret[5]); ?>",
"team" : {"logo":"https://robertsspaceindustries.com/<?php echo trim($ret[10]); ?>","name":"<?php echo trim($ret[12]); ?>","tag":"<?php echo trim($ret[13]); ?>","nb_member":"<?php echo trim($ret[14]); ?>"},
"live":{"country":"<?php echo trim($tab_country[0]); ?>","region":"<?php echo trim($tab_country[1]); ?>"},	
"fluent": {<?php echo $obj_fluent; ?>}					
		});
		
		<?php 
		break;	
		
		
	case 'ship':
		$fp = file_get_contents('https://robertsspaceindustries.com/cache/en/rsi-js.js?v=1.0.4.4');
		$fp = str_replace(array("\n","\r","\t","
","\r\n"),' ',$fp);
		
		preg_match('#this.shipData=\[{(.+)}\]#U',$fp,$ret);

		$list_obj = $ret[1];
		preg_match_all('#({.+})#U',$list_obj,$vaiss);
		$total = count($vaiss[1]);
		?>
<?php echo $callback ?>({ 
	
    "Author" : "<?php echo $auteur; ?>",
    "version" : "<?php echo $version; ?>",
    "action" : <?php echo $actions; ?>,
	"pub" : <?php echo $pubs; ?>,
	"day_passed" : <?php echo $day_passed; ?> ,
	"date" : {
				"Austin":{
							"fulldate":"<?php echo $austin_date; ?>",
							"day":"<?php echo $austin_day; ?>",
							"month":"<?php echo $austin_month; ?>",
							"hour":"<?php echo $austin_hour; ?>",
							"min":"<?php echo $austin_min; ?>"
				},
				"Los_Angeles":{
							"fulldate":"<?php echo $la_date; ?>",
							"day":"<?php echo $la_day; ?>",
							"month":"<?php echo $la_month; ?>",
							"hour":"<?php echo $la_hour; ?>",
							"min":"<?php echo $la_min; ?>"
				}
	},
    "ship" :
    <?php 
		echo '{'.PHP_EOL;
		for($i = 0; $i<$total; $i++){
			echo '"'.$i.'":'.$vaiss[1][$i].','.PHP_EOL;
		}
		echo '"total":"'.$total.'"'.PHP_EOL;
		echo '}';
		?>
});
		<?php 
		break;
	default:
	case 'funding-goals':
		$fp = file_get_contents('https://robertsspaceindustries.com/funding-goals');
		$fp = str_replace(array("\n","\r","\t"),' ',$fp);
		
		$url = 'https://robertsspaceindustries.com/api/stats/getCrowdfundStats';
$data = array ('fans' => true, 'funds' => true, 'alpha_slots' => true);

$options = array(
'http' => array(
'header' => "Content-type: application/x-www-form-urlencoded\r\n",
'method' => 'POST',
'content' => http_build_query($data),
),
);
$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);


		/*******/
		
		preg_match('#<div class="date">CURRENT</div> *<div class="amount">([^<]+)</div>#',$fp,$ret);
		$current_us =  trim($ret[1]);
		$current = (int) str_replace(array('$',','),'',trim($ret[1]));
		$current_frless = number_format ( $current , 0 ,  ',' , ' ' );
		$current_fr = $current_frless.'$';
		
		/*******/
		
		preg_match('#<div class="pourcentage">([^<]+)</div>#',$fp,$ret);
		$percent =  trim($ret[1]);
		$percent2 = trim(str_replace('%','',$percent));
		
		/*******/
		
		preg_match('#id="next_stretchgoal">([^<]+)#',$fp,$ret);
		$current_goal_us =  trim($ret[1]);
		$current_goal = (int) str_replace(array('$',','),'',trim($ret[1]));
		$current_goal_frless = number_format ( $current_goal , 0 ,  ',' , ' ' );		
		$current_goal_fr = $current_goal_frless.'$';
		
		/*******/
		
		preg_match('#<h2>UNLOCKS</h2>[^<]+</div>[^<]+<div class="[^"]+">[^<]+<ul>(.+)</ul>#U',$fp,$ret);
		$ul = trim($ret[1]);
		preg_match_all('#<li>(.+)</li>#U',$ul,$ret2);
		$li = $ret2[1];
		$current_goal_unlock="";
		for($i=0;$i<count($li);$i++) {
			$current_goal_unlock.= "\t\t".'"'.$i.'" : "'.trim(str_replace('"','',$li[$i])).'",'.PHP_EOL;
		}
		
		?>
<?php echo $callback ?>({ 

    "Author" : "<?php echo $auteur; ?>",
    "version" : "<?php echo $version; ?>",
    "action" : <?php echo $actions; ?>,
	"pub" : <?php echo $pubs; ?>,
	"day_passed" : <?php echo $day_passed; ?> ,
	"date" : {
				"Austin":{
							"fulldate":"<?php echo $austin_date; ?>",
							"day":"<?php echo $austin_day; ?>",
							"month":"<?php echo $austin_month; ?>",
							"hour":"<?php echo $austin_hour; ?>",
							"min":"<?php echo $austin_min; ?>"
				},
				"Los_Angeles":{
							"fulldate":"<?php echo $la_date; ?>",
							"day":"<?php echo $la_day; ?>",
							"month":"<?php echo $la_month; ?>",
							"hour":"<?php echo $la_hour; ?>",
							"min":"<?php echo $la_min; ?>"
				}
	},
	"stat":<?php echo $result;?>,
    "current_pledge" :
	{ 
		"number" : "<?php echo $current; ?>",
		"us" : "<?php echo $current_us; ?>" ,
		"fr" : "<?php echo $current_fr; ?>",
		"frless" : "<?php echo $current_frless; ?>",		
		"percent" :  "<?php echo $percent; ?>",
		"percentless" :  "<?php echo $percent2; ?>"
	},
	"current_pledge_goal" :
	{ 
		"number" : "<?php echo $current_goal; ?>",
		"us" : "<?php echo $current_goal_us; ?>" ,
		"fr" : "<?php echo $current_goal_fr; ?>",
		"frless" : "<?php echo $current_goal_frless; ?>"
	},
	"current_goal_unlock" : 
	{
		
<?php echo $current_goal_unlock ?>
		"total" : "<?php echo count($li); ?>"
	}
});
		<?php 
		
		
		break;
	
	case 'index':
	case 'home':
		$fp2 = file_get_contents('https://robertsspaceindustries.com/');
		$fp2 = str_replace(array("\n","\r","\t"),' ',$fp2);
		
		/********/
		$devtracker = array();
		$dt = "";
		preg_match_all('#<a href="([^"]+)" class="[^"]+">    <div class="top">      <div class="image-holder content-block3">        <div class="image" style="[^"]+"></div>        <div class="corner corner-top-left"></div>  <div class="corner corner-top-right"></div>  <div class="corner corner-bottom-left"></div>  <div class="corner corner-bottom-right"></div>      </div>      <div class="poster">        <div class="handle">([^<]+)</div>        <div class="title">[^<]+</div>        <div class="glow-box"></div>      </div>      <div class="clear"></div>    </div>      <div class="details">      <p class="trans-03s">([^<]+)</p>    </div>      <div class="bottom">      <div class="time">([^<]+)<span>in</span></div>      <div class="title trans-03s">([^<]+)</div>    </div>      <div class="corner corner-top-left"></div>  <div class="corner corner-top-right"></div>  <div class="corner corner-bottom-left"></div>  <div class="corner corner-bottom-right"></div>  </a>#',$fp2,$ret);
		$nb_find = count($ret[1]);
		
		
		for($i=0;$i<$nb_find;$i++){
			$devtracker[$i] = array("link" => trim($ret[1][$i]), "author" => trim($ret[2][$i]),"msg" => trim($ret[3][$i]),"hour" =>trim($ret[4][$i]),"thread" =>trim($ret[5][$i]));
			$dt.='"'.$i.'" :
		{
			"link" : "'.trim($ret[1][$i]).'",
			"author" : "'.str_replace('"','',trim($ret[2][$i])).'",
			"msg" :"'.str_replace('"','',trim($ret[3][$i])).'",
			"hour" :"'.trim($ret[4][$i]).'",
			"thread" :"'.str_replace('"','',trim($ret[5][$i])).'"
		},
		';
		}
		/********/
		
		?>
<?php echo $callback ?>({ 
	
    "Author" : "<?php echo $auteur; ?>",
    "version" : "<?php echo $version; ?>",
    "action" : <?php echo $actions; ?>,
	"pub" : <?php echo $pubs; ?>,
	"day_passed" : <?php echo $day_passed; ?> ,
	"date" : {
				"Austin":{
							"fulldate":"<?php echo $austin_date; ?>",
							"day":"<?php echo $austin_day; ?>",
							"month":"<?php echo $austin_month; ?>",
							"hour":"<?php echo $austin_hour; ?>",
							"min":"<?php echo $austin_min; ?>"
				},
				"Los_Angeles":{
							"fulldate":"<?php echo $la_date; ?>",
							"day":"<?php echo $la_day; ?>",
							"month":"<?php echo $la_month; ?>",
							"hour":"<?php echo $la_hour; ?>",
							"min":"<?php echo $la_min; ?>"
				}
	},
    "devtracker" :
	{		
		<?php echo $dt ?>
	"total" : "<?php echo $nb_find; ?>"	
	}
});
				<?php 
		break;
		
}

?>

