// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      0.8.5
// @description  try to take over the world!
// @author       Frey10
// @match        *://esed.sakha.gov.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

 /*
------------------------------------------------------------------------------------------------------
---------------------------------------------Настройки------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

//Для заполнения пункта настроек напишите команду /user в группе Telegram. Полученные данные ввести в поля ниже.

var tg_chatID = '-1001430448491'; //ID группы пользователя Telegram.
var tg_userID = ''; //ID пользователя Telegram.
var tg_username = ''; //Username пользователя Telegram. Вводитеся без @ etc. 'MinaRe0'
var tg_name = ''; //Ваше имя, понятное для всех etc. 'Вадим Рудых'.


/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Константы------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

//('-1001430448491' - Чат ЦТ, '-393307044' - Тестовый чат, )
const chats = ['-1001430448491', '-393307044', '337277275'];

/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Проверка-------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

var checked = false;
if ((tg_chatID != '') && (tg_userID != '') && (tg_username != '') && (tg_name != ''))
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
    alert('Перед работой скрипта необходимо заполнить все настройки!');
}

 /*
------------------------------------------------------------------------------------------------------
------------------------------------------Начало-скрипта----------------------------------------------
------------------------------------------------------------------------------------------------------
*/

if (checked){
    $(document).ready(function() {
        var doc_rc = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/doc_rc\/doc_rc\.aspx.+$/i);
        var reply = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/resolution\/reply\.aspx.+$/i);

        var doc_rcpd = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/prj_rc\/prj_rc\.aspx.*/i);
        var visa = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/add_vs\.aspx.+$/i);
        var visa_send = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/send\.aspx.+$/i);

        console.log('-------------------PAGE LOAD-------------------');

        /*
        *   Проверка текущей страницы
        */

        //Проверка страницы РК
        if (doc_rc.test(document.location.href) || doc_rcpd.test(document.location.href)) {
            console.log('-------------------DOC START-------------------');
            var i_doc_rc = setInterval(function() {
                console.log('1-1');
                if (document.querySelector('div.currentFile') != null) {
                    setValue();
                    clearInterval(i_doc_rc);
                    console.log('-------------------DOC LOAD-------------------');
                }
            }, (50));
        }

        /*
        *   Проверка всплывающих окон
        */

        // + Проверка страницы отчёта
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

        //Проверка страницы визы и подписи
        if (visa.test(document.location.href) || visa_send.test(document.location.href)) {
            console.log('-------------------VISA_PODPIS START-------------------');
            var i_visa = setInterval(function() {
                console.log('2-2');
                if (document.querySelector('div[data-action=".APPLY 1"') != null) {
                    clearInterval(i_visa);
                    var btn = document.querySelector('div[data-action=".APPLY 1"');
                    btn.setAttribute('id', 'Send-btn-visa');
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
            }, (500));
        });

        /*
        *   Обработчик визы
        */

        // + Обработчик визы и подписи, направление на визу и подпись
        $('body').on("click", '#Send-btn-visa', function () {
            var str = '', btn, slc = '', txt = '', type = '';
            var podpis = new RegExp(".подпис.");
            if (podpis.test(document.title))
            {
                type = 'podpis';
            }
            else
            {
                type = 'visa'
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
                    }, (500));
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
    });
};

function pullTg(rk, url, type, text){
    $.ajax({
        url: 'http://esedtotg.herokuapp.com?tg_chatid=' + tg_chatID + '&tg_userid=' + tg_userID + '&tg_username=' + tg_username + '&tg_name=' + tg_name + '&number=' + rk + '&type=' + type + '&text=' + text + '&url=' + url,
        type: 'GET',
        dataType: 'html',
        success: function(res)
        {
            console.log('Отправлено');
        }
    });
}

function getRk(){
    return document.getElementsByTagName('title')[0].innerText;
}

function setValue(){
    GM_setValue('RK', getRk());
    GM_setValue('URL', document.location.href);
}
