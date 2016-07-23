'use strict';

$(document).ready(function () {

    $(window).load(function () {
        $('#preloader').fadeOut('slow', function () { $(this).remove(); });
    });

    function getTenants() {

        $('#main').empty();

        $.ajax({
            method: 'GET',
            url: '/oxseedint/cs/tenants',
            dataType: 'json',
            success: function (response) {
                var tenants = response;
                var i = 0;

                for (i = 0; i < tenants.length; i++) {
                    $('#main').append('<div class="col-xs-6" data-tenant="' +
                        tenants[i] + '">' + '<p>' + tenants[i] + '</p>' +
                        '<button class="btn btn-default delete-client-tokens"' + 'data-client="' + tenants[i] + '"' + '>' + 'Delete ' +
                        tenants[i] + ' tokens' + '</button>' + '</div>');
                }

                var counter = tenants.length;

                for (i = 0; i < tenants.length; i++) {
                    $.ajax({
                        method: 'GET',
                        url: '/oxseedint/cs/authenticated-users/?client=' + tenants[i],
                        dataType: 'json',
                        success: function (fullinfo) {
                            var clientinfo = fullinfo;

                            for (var j = 0; j < clientinfo.length; j++) {

                                var expireDate = clientinfo[j].expireAt;
                                var loggedDate = clientinfo[j].loggedInAt;
                                var lastActionDate = clientinfo[j].lastActionAt;

                                var expire = new Date();
                                var logged = new Date();
                                var lastAction = new Date();

                                expire.setTime(expireDate);
                                logged.setTime(loggedDate);
                                lastAction.setTime(lastActionDate);


                                if (clientinfo[j].expireAt === null) {
                                    expire = 'Never';
                                }

                                $('#main div[data-tenant="' + clientinfo[j].client + '"]').append(
                                    '<ul class="list-group" data-id="' + j + '" id="' + i + '_' + j + '">' +
                                        '<li class="list-group-item">' +
                                            '<h4 class="list-group-item-heading"><strong>ID :</strong> ' + clientinfo[j].user + '</h4>' +
                                            '<button type="button" class="btn btn-default pull-right delete-token"' +
                                                'data-client="' + clientinfo[j].client + '"' +
                                                'data-user="' + clientinfo[j].user + '"' +
                                                'data-token="' + clientinfo[j].token + '"' +
                                                '>' + 'Delete token' + '</button>' +
                                                '<div class="well">' + '<div><strong>Client :</strong> ' +
                                                clientinfo[j].client + '</div>' + '<div><strong>Token :</strong> ' +
                                                clientinfo[j].token + '</div>' + '<div><strong>Expire at :</strong> ' +
                                                expire + '</div>' + '<div><strong>Logged at :</strong> ' + logged +
                                                '</div>' + '<div><strong>Last activity at :</strong> ' + lastAction +
                                                '</div>' + '</div>' + '</li>' + '</ul>');
                            }

                            counter--;
                            if (counter === 0) {
                                $('#content').html($('#main').html());
                            }
                        },
                        error: function (a, b, c) {
                            console.log(a);
                            console.log(b);
                            console.log(c);
                        }
                    });
                }
            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    };

    setInterval(getTenants, 10000);
    getTenants();

    $('body').on('click', '#content button.delete-token', function () {

        $(this).parent().parent().addClass('hidden');

        $.ajax({
            method: 'POST',
            url: '/oxseedint/auth-server/session-manager/del-token',
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                client: $(this).attr('data-client'),
                token: $(this).attr('data-token'),
                user_id: $(this).attr('data-user')
            }),
            success: function (delToken) {
            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    });

    $('body').on('click', '#content button.delete-client-tokens', function () {

        $(this).parent().children('ul').addClass('hidden');

        $.ajax({
            method: 'POST',
            url: '/oxseedint/auth-server/session-manager/del-client-tokens',
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                client: $(this).attr('data-client'),
            }),
            success: function (delClientTokens) {
            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    });

    $('body').on('click', '#delAllTokens', function () {

        $('ul').addClass('hidden');

        $.ajax({
            method: 'POST',
            url: '/oxseedint/auth-server/session-manager/del-all-tokens',
            processData: false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                delAll: true
            }),
            success: function (delAll) {
            },
            error: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    });

});