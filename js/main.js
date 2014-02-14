function onDeviceReady() {
	navigator.splashscreen.hide();
}
document.addEventListener("deviceready", onDeviceReady, false);

$(document).on("pagecreate", "#demo-page", function() {
	$(document).on("swipeleft swiperight", "#demo-page", function(e) {
		// We check if there is no open panel on the page because otherwise
		// a swipe to close the left panel would also open the right panel (and
		// v.v.).
		// We do this by checking the data that the framework stores on the page
		// element (panel: open).
		if ($(".ui-page-active").jqmData("panel") !== "open") {
			if (e.type === "swipeleft") {
				$("#right-panel").panel("open");
			} else if (e.type === "swiperight") {
				$("#left-panel").panel("open");
			}
		}
	});
});

$(document)
		.ready(
				function() {

					translate();
					if ($.cookie('lang')) {
						$('#lang_select-button').hide();
					}

					$('body').delegate(
							'.save_ship',
							'click',
							function() {
								var name_ship = $(this).attr('ship');
								confirm(trad_confirm_nb_ship.replace('$1',
										$('#slider').val()).replace('$2',
										name_ship));
							});

					$('#lang_select').change(
							function() {
								location.href = location.protocol + '//'
										+ location.host + location.pathname
										+ '?lang=' + $(this).val();
							});

					$('#search_pseudo')
							.click(
									function() {
										$('#member_guilde').html('');
										$('#info_pseudo').html('');

										var handle = 'gourmand';
										if ($('#pseudo').val()) {
											handle = $('#pseudo').val();
										}

										$
												.ajax({
													type : 'GET',
													url : 'http://vps36292.ovh.net/mordu/API_2.7.php',
													jsonpCallback : 'API_SC1',
													contentType : "application/json",
													dataType : 'jsonp',
													data : 'action=citizens&page='
															+ handle,
													async : true,
													success : function(data) {

														if (data.join_date.year) {
															display_ship();
															info_orga(data.team.tag);
															$('#info_pseudo')
																	.html(
																			'<a href="'
																					+ data.url
																					+ '" target="_blank"><img style="width:76px;height:76px;float:left" src="'
																					+ data.avatar
																					+ '" /></a><div>Pseudo: '
																					+ data.title
																					+ ' '
																					+ data.pseudo
																					+ ' ('
																					+ data.handle
																					+ ') at '
																					+ data.team.name
																					+ ' ('
																					+ data.team.tag
																					+ ') <img src="'
																					+ data.team.logo
																					+ '" style="float:right" /> '
																					+ data.team.nb_member
																					+ '</div><div>Inscription: '
																					+ data.join_date.month
																					+ '  '
																					+ data.join_date.year
																					+ '</div><div><span trad="trad_country"></span>: '
																					+ data.live.country
																					+ '</div><div>Bio: '
																					+ data.bio
																					+ '</div><div>Hour from Austin: '
																					+ data.date.Austin.hour
																					+ ':'
																					+ data.date.Austin.min
																					+ '</div><div>Fluent:'
																					+ data.fluent[0]
																					+ '</div>');
															translate();
														} else {
															$('#info_pseudo')
																	.html(
																			trad_error_handle);
														}
													},
													error : function(e) {
														console.log(e.message);
													}
												});

									});

				});

function translate() {
	$('body').find("[trad]").each(function(index, value) {
		console.log('trad: ' + index + ' ' + $(this).attr('trad'));
		$(this).html(eval($(this).attr('trad')));
	});
}

function display_ship() {
	$('#member_ship')
			.html(
					'<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-b"><h3 trad="trad_your_ships"></h3></div><div class="ui-body ui-body-b"><div class="slider"><ul class="slides"><li trad="trad_loading_your_ship"></li></ul></div></div></div>');
	$
			.ajax({
				type : 'GET',
				url : 'http://www.starpirates.fr/API/API.php',
				jsonpCallback : 'API_SC3',
				contentType : "application/json",
				dataType : 'jsonp',
				data : 'action=ship',
				async : true,
				success : function(data) {
					$('#ship, .slides').html('');
					var html = '';
					for ( var i = 0; i < data.ship.total; i++) {
						html += ' <li class="slide"><img src="https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'
								+ data.ship[i].imageurl
								+ '" /><br />'
								+ data.ship[i].title
								+ ' ('
								+ data.ship[i].manufacturer
								+ ')<br />'
								+ trad_max_crew
								+ ':'
								+ data.ship[i].maxcrew
								+ '<br />'
								+ trad_role
								+ data.ship[i].role
								+ '<br /><input type="button" class="save_ship" ship="'
								+ data.ship[i].title
								+ '" value="'
								+ trad_save_nb_ship + '" />' + '</li>';
					}
					$('.slides').html(html);

					$('.slider').glide({
						autoplay : false
					});
					translate();
					$('#nb_ship').show(500);
				},
				error : function(e) {
					console.log(e.message);
				}
			});
}

function info_orga(flag_team) {
	$('#member_guilde').html('connection internet...');
	$
			.ajax({
				type : 'GET',
				url : 'http://vps36292.ovh.net/mordu/API_2.7.php',
				jsonpCallback : 'API_SC2',
				contentType : "application/json",
				dataType : 'jsonp',
				data : 'action=org&team=' + flag_team + '&page=1',
				async : true,
				success : function(data) {
					var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-b"><h3 trad="trad_your_team"></h3></div><div class="ui-body ui-body-b">';
					$('#member_guilde').html();

					if (data.nb_membre > 0) {
						for ( var i = 0; i < data.nb_membre; i++) {
							html += '<div><img src="http://robertsspaceindustries.com'
									+ data[i].avatar
									+ '" />'
									+ data[i].title
									+ ' '
									+ data[i].pseudo
									+ '<h2 trad="trad_role"></h2><ul>'
									+ data[i].role
									+ '</ul></div><div style="clear:both"></div><hr />';
						}
						html += '</div></div>';
						$('#member_guilde').html(html);
						translate();
					} else {
						$('#member_guilde').html(trad_error_info_org);
					}
				},
				error : function(e) {
					console.log(e.message);
				}
			});
}
