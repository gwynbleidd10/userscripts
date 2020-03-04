// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  try to take over the world!
// @author       Frey10
// @match        *://esed.sakha.gov.ru/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==
/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Константы------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

var userid = GM_getValue('tg_userID'); //ID пользователя Telegram.

/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Проверка-------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

var checked = false;
if ((typeof userid != 'undefined') && (userid != ''))
{
    checked = true;
}
else
{
    addSettings();
}

 /*
------------------------------------------------------------------------------------------------------
------------------------------------------Начало-скрипта----------------------------------------------
------------------------------------------------------------------------------------------------------
*/

if (checked){
    $(document).ready(function() {
        var btn = '';

        var doc_rc = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/doc_rc\/doc_rc\.aspx.+$/i);
        var doc_rcpd = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/prj_rc\/prj_rc\.aspx.*/i);

        var reply = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/resolution\/reply\.aspx.+$/i);
        var visa = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/add_vs\.aspx.+$/i);
        var visa_send = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/send\.aspx.+$/i);
        var visa_podpis = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/visa_sign_edit\.aspx.+$/i);

        console.log('-------------------PAGE LOAD-------------------');

        /*var node = document.createElement('span');
        node.setAttribute('style', 'float: right; margin-right: 2em; cursor: pointer;');
        node.innerText = 'версия скрипта ' + GM_info.script.version;
        document.querySelector('.copyright').appendChild(node);*/

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
                    if (window.opener.document.querySelector('.tabItem.current').text.trim() != 'Краткие сведения')
                    {
                        alert('Перейдите на "Визу/Подпись" со вкладки "Краткие сведения" на странице "РК/РКПД", иначе уведомление в Telegram не уйдет!')
                    };
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
                    if (window.opener.document.querySelector('.tabItem.current').text.trim() != 'Краткие сведения')
                    {
                        alert('Перейдите на "Визу/Подпись" со вкладки "Краткие сведения" на странице "РК/РКПД", иначе уведомление в Telegram не уйдет!')
                    };
                    console.log('-------------------VISA_PODPIS LOAD-------------------');
                }
            }, (50));
        }

        /*
        *   Обработчик отчёта
        */

        // + Обработчик отчёта, получение отчёта
        $('body').on("click", '#Save-btn-reply', function () {
            //Из РК
            if (doc_rc.test(window.opener.location.href) || doc_rcpd.test(window.opener.location.href))
            {
                //Кто назначил
                var from = window.opener.$('#resСontainer a.cl.DEPARTMENT').last().text().split(' ');
                from = from[1] + ' ' + from[0];
                var a = document.querySelector('.repStatus.ctrlHolder').getElementsByTagName('select');
                var sub;
                if (a[0].selectedIndex == '-1')
                {
                    sub = '<b>Не выбран</b>';
                }
                else
                {
                    sub = '<b>' + a[0].options[a[0].selectedIndex].text + '</b>';
                }
                pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), 'answer', document.getElementById('16_REPLY_List_REPLY_TEXT').value, from, sub);
            }
            //Из списка
            else
            {
                //var a = window.opener.document.getElementById('test').parentNode.parentNode.parentNode
                //var tRk = a.childNodes[4].textContent + ' от ' + a.childNodes[5].textContent
                //var tUrl = window.location.protocol + '//esed.sakha.gov.ru/esed/Pages' + a.childNodes[4].children[0].children[0].attributes['href'].textContent.replace(/^.{2}/, '')
                //pullTg(tRk, tUrl, 'answer', document.getElementById('16_REPLY_List_REPLY_TEXT').value, $('div.resolutionRoute-item a.cl.DEPARTMENT').last().text());
            }
            btn = document.getElementById('Save-btn-reply');
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
            //Определение типа
            if (podpis.test(document.title))
            {
                type = 'podpis-send';
            }
            else
            {
                type = 'visa-send'
            }
            //Адресаты
            if (visa.test(document.location.href))
            {
                slc = document.querySelector('.simpleList.ui-sortable').textContent.trim().length > 0;
                txt = document.querySelector('.simpleList.ui-sortable').innerText.split('\n').map(Function.prototype.call, String.prototype.trim).toString();
            }
            else
            {
                slc = document.querySelector('div.content div.row p.clipped').textContent.trim().length > 0;
                txt = document.querySelector('div.content div.row p.clipped').textContent.trim().toString();
            }
            if (slc)
            {
                //Срок
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

        // + Обработчик визы и подписи
        $('body').on("click", '#Send-btn-visa-podpis', function () {
            var str = '', btn, slc = '', txt = '', type = '', state = '', com = '', sub = undefined;
            var podpis = new RegExp(/.*подпис.*/i);
            var to = [];
            for (var i = 0; i < window.opener.document.querySelectorAll('div.lstItem a').length; i++)
            {
                to.push(window.opener.document.querySelectorAll('div.lstItem a')[i].text.trim());
            }
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
                txt += '<i> | Комментарий</i>:';
                sub = document.getElementById('13_PRJ_VISA_SIGN_List_REP_TEXT').value.trim();
            }
            pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), type, txt, to.toString(), sub);
            btn = document.getElementById('Send-btn-visa-podpis');
            btn.setAttribute('data-action', '.Save');
            btn.removeAttribute('id');
            setTimeout(function() {
                btn.click();
            }, (1200));

        });
    });
}

function pullTg(rk, url, type, text, to, subtext){
    //var path = 'http://127.0.0.1:8080/api?app=esed&version='+ GM_info.script.version + '&userid=' + userid + '&to=' + to +'&number=' + rk + '&type=' + type + '&text=' + text + '&subtext=' + subtext+ '&url=' + url;
    var path = 'https://esedtotg.herokuapp.com/api?app=esed&version='+ GM_info.script.version + '&userid=' + userid + '&to=' + to +'&number=' + rk + '&type=' + type + '&text=' + text + '&subtext=' + subtext+ '&url=' + url;
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'html',
        success: function(res)
        {
            console.log('Отправлено');
        }
    });
}

function addSettings(){
    var html = '<form id="addForm">Введите UserID полученный от бота: <input type="text" id="addUserid" style="width: 100%;"/></form>';
    var node = document.createElement('div');
    node.setAttribute('style', 'display:none;');
    node.setAttribute('id', 'elementId');
    node.setAttribute('title', 'Настройка');
    node.innerHTML = html;
    document.getElementById('aspnetForm').appendChild(node);
    $("#elementId").dialog({buttons:{"Сохранить":function(){
        if (document.getElementById('addUserid').value != ''){
            GM_setValue('tg_userID', document.getElementById('addUserid').value);
            $(this).dialog("close");
        }
    }}},{
        modal:true,
        width:400,
        height:220
    });
    if (GM_getValue('tg_userID') != '' && typeof GM_getValue('tg_userID') != 'undefined'){
        document.getElementById('addUserid').value = GM_getValue('tg_userID');
    }
}
