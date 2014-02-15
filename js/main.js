var auto_switch = false;

function onDeviceReady() {
    navigator.splashscreen.hide();

    $(document).ready(function () {


        $('.handle').show(500);

        display_ship();

        if ($.cookie('switch-theme') == '1') {
            console.log('cookie make click');
            auto_switch = true;
            setTimeout(function () {
                $('.ui-flipswitch').trigger('click');
            }, 501);

        }
        if($.cookie('handle')){
            $('#pseudo').val($.cookie('handle'));
            setTimeout(function(){
                $('#search_pseudo').trigger('click');
            },1000);

        }

        $("ul.ui-listview li a").click(function () {
            var page = $(this).attr('goto');
            if (!page) return false; //li a :close is not a page

            if($(this).attr('need_handle')=='1' && !$.cookie('handle')){
                page='error_need_handle';
            }

            $('.page').hide(300);
            $('.' + page).show(500);
            if (page == 'manage_ship') {
                setTimeout(function () {
                    $('.slide').trigger("resize");
                    $('.save_ship').button();
                    $('.save_ship').parent().width(175);
                }, 1000);
            }

            $('#close_left_menu').trigger('click');
            return false;
        });

        $('.ui-flipswitch').click(function () {
            console.log('switch auto:' + auto_switch + ' cookie' + $.cookie('switch-theme'));
            if ($('.ui-flipswitch-active').length) {
                $.cookie('switch-theme', 1);
                $('.ui-body-b').removeClass('ui-body-b').addClass('ui-body-a');
            }
            else {
                $('.ui-body-a').removeClass('ui-body-a').addClass('ui-body-b');
                if (!auto_switch) $.cookie('switch-theme', '');
            }
            auto_switch = false;
        });

        translate();

        $('body').delegate('.bouton-confirm', 'click', function () {
            if ($(this).attr('label') == 'yes') {
                $('.page').hide(300);
                $('.wip').show(500);
            }
            $('#confirm').hide();
        });


        $('body').delegate('.save_ship', 'click', function () {
            var name_ship = $(this).attr('ship');

            $('#confirm .ui-content').html(trad_confirm_nb_ship.replace('$0', $.cookie('handle')).replace('$1',$('#slider').val()).replace('$2',name_ship) + '? <input type="button" class="bouton-confirm" label="yes" value="' + trad_confirm_yes + '"> <input type="button"  class="bouton-confirm" label="no" value="' + trad_confirm_no + '" />');

            $('.bouton-confirm').button();
            $('#confirm').show();
            $(document).scrollTop(0);
            /*confirm(trad_confirm_nb_ship.replace('$1',
             $('#slider').val()).replace('$2',
             name_ship));*/
        });

        $("#lang :radio[value='" + lang + "']").attr('checked', 'checked');
        $("#lang :radio").checkboxradio("refresh");

        $('#lang :radio').change(
            function () {
                $('a[href="#add-form"]').trigger('click');
                setTimeout(function () {
                    location.href = location.protocol + '//'
                        + location.host + location.pathname
                        + '?lang=' + $("#lang :radio:checked").val();
                }, 100);

            });

        $('#search_pseudo').click(function () {
            $('#member_guilde').html('');
            $('#info_pseudo').html('');

            var handle = 'gourmand';
            if ($('#pseudo').val()) {
                handle = $('#pseudo').val();
                $.cookie('handle', handle);
            }



            $.ajax({
                type: 'GET',
                url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
                jsonpCallback: 'API_SC1',
                contentType: "application/json",
                dataType: 'jsonp',
                data: 'action=citizens&page='+ handle,
                async: true,
                beforeSend: function(){
                    $('#info_pseudo').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
                },
                success: function (data) {

                    if (data.join_date.year) {

                        info_orga(data.team.tag);
                        $('#info_pseudo').html(
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
                        $('#info_pseudo').html(
                            trad_error_handle);
                    }
                },
                error: function (e) {
                    console.log(e.message);
                }
            });

        });
        $(document).trigger("pagecreate");
    });

}
document.addEventListener("deviceready", onDeviceReady, false);




//switch theme end




function translate() {
    $('body').find("[trad]").each(function (index, value) {
        $(this).html(eval($(this).attr('trad')));
    });
}

function display_ship() {
    $('#member_ship')
        .html(
            '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-b"><h3 trad="trad_your_ships"></h3></div><div class="ui-body ui-body-b"><div class="slider"><ul class="slides"><li trad="trad_loading_your_ship"></li></ul></div></div></div>');
    $
        .ajax({
            type: 'GET',
            url: 'http://www.starpirates.fr/API/API.php',
            jsonpCallback: 'API_SC3',
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=ship',
            async: true,
            success: function (data) {
                $('#ship, .slides').html('');
                var html = '';
                for (var i = 0; i < data.ship.total; i++) {
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
                $('#nb_ship').show();

                $('.slider').glide({
                    autoplay: false
                });
                translate();

            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

function info_orga(flag_team) {

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.7.php',
            jsonpCallback: 'API_SC2',
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=org&team=' + flag_team + '&page=1',
            async: true,
            beforeSend: function(){
                $('#member_guilde').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
            },
            success: function (data) {
                var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-b"><h3 trad="trad_your_team"></h3></div><div class="ui-body ui-body-b">';
                $('#member_guilde').html();

                if (data.nb_membre > 0) {
                    for (var i = 0; i < data.nb_membre; i++) {
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
            error: function (e) {
                console.log(e.message);
            }
        });
}
