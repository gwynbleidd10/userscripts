// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       Frey10
// @match        *://esed.sakha.gov.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Константы------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

var tg_chatID = '-1001430448491'; //-1001430448491'; //ID группы пользователя Telegram.
var tg_userID = GM_getValue('tg_userID'); //ID пользователя Telegram.
var tg_name = GM_getValue('tg_name'); //Ваше имя, понятное для всех etc. 'Вадим Рудых'.
var chats = ['-1001430448491', '-393307044', '337277275']; //('-1001430448491' - Чат ЦТ, '-393307044' - Тестовый чат, )

/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Проверка-------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

var checked = false;
if (((typeof tg_chatID != 'undefined') && (tg_chatID != '')) && ((typeof tg_userID != 'undefined') && (tg_userID != '')) && ((typeof tg_name != 'undefined') && (tg_name != '')))
{
    checked = true;
    if (!(chats.includes(tg_chatID)))
    {
        checked = false;
        alert('Введен неверный ID группы.');
    }
}
else
{
    addSettings();

    $("#addBtn").click(function(){
        GM_setValue('tg_userID', document.getElementById('addUserid').value);
        GM_setValue('tg_name', document.getElementById('addName').value);
        location.reload();
        return false;
    });
}

 /*
------------------------------------------------------------------------------------------------------
------------------------------------------Начало-скрипта----------------------------------------------
------------------------------------------------------------------------------------------------------
*/

if (checked){
    $(document).ready(function() {

        var doc_rc = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/doc_rc\/doc_rc\.aspx.+$/i);
        var doc_rcpd = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/prj_rc\/prj_rc\.aspx.*/i);

        var reply = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/resolution\/reply\.aspx.+$/i);
        var visa = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/add_vs\.aspx.+$/i);
        var visa_send = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/send\.aspx.+$/i);
        var visa_podpis = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/visa_sign_edit\.aspx.+$/i);

        console.log('-------------------PAGE LOAD-------------------');

        /*
        *   Проверка текущей страницы
        */

        //Проверка страницы РК и РКПД
        if (doc_rc.test(document.location.href) || doc_rcpd.test(document.location.href)) {
            console.log('-------------------DOC START-------------------');
            var i_doc_rc = setInterval(function() {
                console.log('1-1');
                if (document.querySelector('div.currentFile') != null) {
                    clearInterval(i_doc_rc);
                    console.log('-------------------DOC LOAD-------------------');
                }
            }, (50));
        }

        /*
        *   Проверка всплывающих окон
        */

        // Проверка страницы отчёта
        if (reply.test(document.location.href)) {
            console.log('-------------------REPLY START-------------------');
            var i_reply = setInterval(function() {
                console.log('2-1');
                if (document.querySelector('div[data-action=".Save"') != null) {
                    clearInterval(i_reply);
                    var btn = document.querySelector('div[data-action=".Save"');
                    btn.setAttribute('id', 'Save-btn-reply');
                    btn.removeAttribute('data-action');
                    console.log('-------------------REPLY LOAD-------------------');
                }
            }, (50));
        }

        //Проверка страницы отправки визы и подписи
        if (visa.test(document.location.href) || visa_send.test(document.location.href)) {
            console.log('-------------------VISA_PODPIS_SEND START-------------------');
            var i_visa = setInterval(function() {
                console.log('2-2');
                if (document.querySelector('div[data-action=".APPLY 1"') != null) {
                    clearInterval(i_visa);
                    var btn = document.querySelector('div[data-action=".APPLY 1"');
                    btn.setAttribute('id', 'Send-btn-visa');
                    btn.removeAttribute('data-action');
                    console.log('-------------------VISA_PODPIS_SEND LOAD-------------------');
                }
            }, (50));
        }

        //Проверка страницы визы и подписи
        if (visa_podpis.test(document.location.href)) {
            console.log('-------------------VISA_PODPIS START-------------------');
            var i_visa_podpis = setInterval(function() {
                console.log('2-3');
                if (document.querySelector('div[data-action=".Save"') != null) {
                    clearInterval(i_visa_podpis);
                    var btn = document.querySelector('div[data-action=".Save"');
                    btn.setAttribute('id', 'Send-btn-visa-podpis');
                    btn.removeAttribute('data-action');
                    console.log('-------------------VISA_PODPIS LOAD-------------------');
                }
            }, (50));
        }

        /*
        *   Обработчик отчёта
        */

        // + Обработчик отчёта, получение отчёта
        $('body').on("click", '#Save-btn-reply', function () {
            pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), 'answer', document.getElementById('16_REPLY_List_REPLY_TEXT').value);
            var btn = document.getElementById('Save-btn-reply');
            btn.setAttribute('data-action', '.Save');
            btn.removeAttribute('id');
            setTimeout(function() {
                btn.click();
            }, (1200));
        });

        /*
        *   Обработчик отправки визы и подписи
        */

        // + Обработчик визы и подписи, направление на визу и подпись
        $('body').on("click", '#Send-btn-visa', function () {
            var str = '', btn, slc = '', txt = '', type = '';
            var podpis = new RegExp(/.*подпис.*/i);
            if (podpis.test(document.title))
            {
                type = 'podpis-send';
            }
            else
            {
                type = 'visa-send'
            }
            if (visa.test(document.location.href))
            {
                slc = document.querySelector('.simpleList.ui-sortable').textContent.trim().length > 0;
                txt = document.querySelector('.simpleList.ui-sortable').innerText.split('\n').map(Function.prototype.call, String.prototype.trim).toString();
            }
            else
            {
                slc = document.querySelector('div.content .row .clipped').textContent.trim().length > 0;
                txt = document.querySelector('div.content .row .clipped').textContent.trim().toString();
            }
            if (slc)
            {
                if (document.getElementById('3_undefined_PERIOD').value.length > 0)
                {
                    pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), type, txt);
                    btn = document.getElementById('Send-btn-visa');
                    btn.setAttribute('data-action', '.APPLY 1');
                    btn.removeAttribute('id');
                    setTimeout(function() {
                        btn.click();
                    }, (1200));
                }
                else
                {
                    alert('Необходимо указать срок.')
                }
            }
            else
            {
                alert('Необходимо добавить адресатов.')
            }
        });

        /*
        *   Обработчик визы и подписи
        */

        // + Обработчик визы и подписи, направление на визу и подпись
        $('body').on("click", '#Send-btn-visa-podpis', function () {
            var str = '', btn, slc = '', txt = '', type = '', state = '', com = '', sub = undefined;
            var podpis = new RegExp(/.*подпис.*/i);
            if (podpis.test(document.title))
            {
                type = 'podpis';
                txt += '<b>' + $('input[name=signType]:checked').prop('labels')[1].innerText.trim() + '</b>';
            }
            else
            {
                type = 'visa';
                var a = document.querySelector('.repStatus.ctrlHolder').getElementsByTagName('select');
                txt += '<b>' + a[0].options[a[0].selectedIndex].text + '</b>';
            }
            if (document.getElementById('13_PRJ_VISA_SIGN_List_REP_TEXT').value.length > 0)
            {
                txt += '<i> | комментарий</i>:';
                sub = document.getElementById('13_PRJ_VISA_SIGN_List_REP_TEXT').value.trim();
            }
            pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), type, txt, sub);
            btn = document.getElementById('Send-btn-visa-podpis');
            btn.setAttribute('data-action', '.Save');
            btn.removeAttribute('id');
            setTimeout(function() {
                btn.click();
            }, (1200));

        });
    });
}

function pullTg(rk, url, type, text, subtext){
    $.ajax({
        url: 'https://esedtotg.herokuapp.com/api?tg_chatid=' + tg_chatID + '&tg_userid=' + tg_userID + '&tg_name=' + tg_name + '&number=' + rk + '&type=' + type + '&text=' + text + '&subtext=' + subtext+ '&url=' + url,
        type: 'GET',
        dataType: 'html',
        success: function(res)
        {
            console.log('Отправлено');
        }
    });
}

function addSettings(){
    var html = '<style>body{padding: 10px;}</style>'+
        '<div style="background: white;border-radius: 10px;padding: 10px;margin: 0 auto; width: 400px;">'+
        '<h3 style="text-align:center;">Настройки</h3>'+
        '<hr>'+
        '<form id="addForm">'+
        'UserID: <input type="text" id="addUserid" style="width: 100%; margin-top: 5px;"/><br />'+
        'Отображаемое имя (прим. Вадим Рудых): <input type="text" id="addName" style="width: 100%; margin-top: 5px;"/><br />'+
        '<p style="padding-top: 5x;"><button type="button" style="padding: 2px;" id="addBtn">Сохранить</button></p>'+
        '</form>'+
        '<div style="padding: 10px; text-align: center;">Введите данные полученные командой /user от бота</div>'+
        '</div>';
    document.getElementsByTagName('body')[0].innerHTML = html;
    if (GM_getValue('tg_userID') != '' && typeof GM_getValue('tg_userID') != 'undefined'){
        document.getElementById('addUserid').value = GM_getValue('tg_userID');
    }
    if (GM_getValue('tg_name') != '' && typeof GM_getValue('tg_name') != 'undefined'){
        document.getElementById('addName').value = GM_getValue('tg_name');
    }
}