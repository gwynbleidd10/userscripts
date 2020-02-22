// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  try to take over the world!
// @author       Frey10
// @match        *://esed.sakha.gov.ru/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-idle
// ==/UserScript==

//Настройки
var userID = '337277275'; //ID пользователя Telegram.
var username = 'Вадим Рудых'; //Username пользователя Telegram. Заполняется без @
var chatID = '337277275'; //ID группы пользователя Telegram.
//

//var $ = window.jQuery;

function pullTg(rk, url, chat, type, text){
    /*if (chat == 'tak')
    {
        text = '@MinaRe0 ' + type;
    }
    else if (chat == 'kma')
    {
        text = '@MinaRe0 ' + type;
    }
    else
    {
        text = type;
    }*/
    console.log(text);
    $.ajax({
        url: 'http://esedtotg.herokuapp.com?chat=' + chat + '&number=' + rk + '&userid=' + userID + '&username=' + username + '&type=' + type + '&text=' + text + '&url=' + url,
//https://api.telegram.org/bot961112179:AAHjVaEbvUP7RHi_Pw4hIPtICfbaTzycT7c/sendMessage?chat_id=' + chatId + '&text=' + text + '&number=' + rk + '&url=' + url ,
        type: 'GET',
        dataType: 'html',
        success: function(res)
        {
            alert('Отправлено');
        }
    });
}

$(document).ready(function() {
    var doc_rc = new RegExp("^http:\/\/esed\.sakha\.gov\.ru\/esed\/WebRC\/DOC_RC\/DOC_RC\.aspx.+$");
    var reply = new RegExp("^http:\/\/esed\.sakha\.gov\.ru\/esed\/WebRc\/RESOLUTION\/Reply\.aspx.+$");

    var doc_rcpd = new RegExp("^http:\/\/esed\.sakha\.gov\.ru\/esed\/WebRc\/PRJ_RC\/PRJ_RC\.aspx.+$");
    var visa = new RegExp("^http:\/\/esed\.sakha\.gov\.ru\/esed\/WebRc\/VISA_SIGN\/ADD_VS\.aspx.+$");
    var visa_send = new RegExp("^http:\/\/esed\.sakha\.gov\.ru\/esed\/WebRc\/VISA_SIGN\/SEND\.aspx.+$");




    var rk, url;

    console.log('-------------------PAGE LOAD-------------------');
    console.log(document.location.href);

    /*
    *   Проверка текущей страницы
    */

    //Проверка страницы РК
    if (doc_rc.test(document.location.href)) {
        console.log('-------------------DOC_RC START-------------------');
        var i_doc_rc = setInterval(function() {
            console.log('1-1');
            if (document.querySelector('div.currentFile') != null) {
                setValue();
                clearInterval(i_doc_rc);
                addElem();
                console.log('-------------------DOC_RC LOAD-------------------');
            }
        }, (50));
    }

    //Проверка страницы РКПД
    if (doc_rcpd.test(document.location.href)) {
        console.log('-------------------DOC_RCPD START-------------------');
        var i_doc_rcpd = setInterval(function() {
            console.log('1-2');
            if (document.querySelector('div.currentFile') != null) {
                setValue();
                clearInterval(i_doc_rcpd);
                addElem();
                console.log('-------------------DOC_RCPD LOAD-------------------');
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

    //Проверка страницы визы
    if (visa.test(document.location.href) || visa_send.test(document.location.href)) {
        console.log('-------------------VISA START-------------------');
        var i_visa = setInterval(function() {
            console.log('2-2');
            if (document.querySelector('div[data-action=".APPLY 1"') != null) {
                clearInterval(i_visa);
                var btn = document.querySelector('div[data-action=".APPLY 1"');
                btn.setAttribute('id', 'Send-btn-visa');
                btn.removeAttribute('data-action');
                console.log('-------------------VISA LOAD-------------------');
            }
        }, (50));
    }

    /*
    *   Обработчик отчёта
    */

    // + Обработчик отчёта, получение отчёта
    $('body').on("click", '#Save-btn-reply', function () {
        pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), chatID, 'answer', document.getElementById('16_REPLY_List_REPLY_TEXT').value);
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

    //Обработчик визы, направление на визу
    $('body').on("click", '#Send-btn-visa', function () {
        var str = '', btn;
        var slc = '', txt = '';
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
                pullTg(window.opener.document.title, window.opener.location.href.replace(/#/gi, '%23'), chatID, 'visa-send', txt);
                btn = document.getElementById('Send-btn-visa');
                btn.setAttribute('data-action', '.APPLY 1');
                btn.removeAttribute('id');
                setTimeout(function() {
                    btn.click();
                }, (500));
            }
            else
            {
                alert('Необходимо указать срок визирования.')
            }
        }
        else
        {
            alert('Необходимо добавить визирующих.')
        }
    });

    /*var iter = document.querySelector('.simpleList.ui-sortable').querySelectorAll('.simpleItem');
    var str = '';
    for(var i = 0; i < iter.length; i++){
    str += iter[i].querySelector('.singleline').querySelector('.singleline').textContent.trim() + '\n';
    }
    console.log(str);
    */

            //document.getElementById('3_undefined_PERIOD').value.length > 0

            //Обработчики РК


            /*$("div#Title-Place").on("click", "#tg-self-visa", function () {
         var btn = document.getElementById('tg-self-visa');
        btn.setAttribute('data-action', '.Ввести_отчёт');
        btn.removeAttribute('id');
    });*/
    $("div#Title-Place").on("click", "#tg-self-podpis", function () {
        pullTg(getRk(), 'group', 'подписал(а)');
    });
    $("div#Title-Place").on("click", "#tg-visa-tak", function () {
        pullTg(getRk(), 'tak', 'направил(а) на визу');
    });
    $("div#Title-Place").on("click", "#tg-visa-kma", function () {
        pullTg(getRk(), 'kma', 'направил(а) на визу кма');
    });
    $("div#Title-Place").on("click", "#tg-podpis-tak", function () {
        pullTg(getRk(), 'tak', 'направил(а) на подпись');
    });
    $("div#Title-Place").on("click", "#tg-podpis-kma", function () {
        pullTg(getRk(), 'kma', 'направил(а) на подпись кма');
    });
});

function addElem(){
    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element);
    };
    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    };

    var tgBlock = document.getElementById('titleInfo');
    tgBlock.innerHTML = '';

    //Контейнер
    var tgRes = document.createElement('div');
    tgRes.id = 'tg-block';
    tgRes.class = 'narrow';
    tgRes.setAttribute("style", "display: inline; float: left;");
    tgBlock.appendChild(tgRes);

    //2 вида
    var sv = document.createElement('div');
    sv.id = 'tg-self-visa';
    sv.innerHTML = 'asd';
    sv.class = 'ribbonItem';
    sv.setAttribute('data-action', '.Ввести_отчёт');
    tgRes.appendChild(sv);

    /*var sp = document.createElement('input');
    sp.id = 'tg-self-podpis';
    sp.class = 'ribbonItem';
    sp.setAttribute("type", "button");
    sp.setAttribute("style", "padding: 0; margin-right: 5px; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #505050; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #aab0b1;");
    sp.setAttribute("value", 'Подписал(а)');
    sp.appendAfter(document.getElementById('tg-self-visa'));

    //2 визы
    var tak = document.createElement('input');
    tak.id = 'tg-visa-tak';
    tak.class = 'ribbonItem';
    tak.setAttribute("type", "button");
    tak.setAttribute("style", "margin: 0; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #ffffff; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #00b0ff;");
    tak.setAttribute("value", "Татаринов А.К.");
    tgRes.appendChild(tak);

    var kma = document.createElement('input');
    kma.id = 'tg-visa-kma';
    kma.class = 'ribbonItem';
    kma.setAttribute("type", "button");
    kma.setAttribute("style", "padding: 0; margin-right: 5px; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #ffffff; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #00b0ff;");
    kma.setAttribute("value", 'Карамзина М.А.');
    kma.appendAfter(document.getElementById('tg-visa-tak'));

    //2 подписи
    tak = document.createElement('input');
    tak.id = 'tg-podpis-tak';
    tak.class = 'ribbonItem';
    tak.setAttribute("type", "button");
    tak.setAttribute("style", "margin: 0; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #ffffff; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #d95757;");
    tak.setAttribute("value", "Татаринов А.К.");
    tgRes.appendChild(tak);

    kma = document.createElement('input');
    kma.id = 'tg-podpis-kma';
    kma.class = 'ribbonItem';
    kma.setAttribute("type", "button");
    kma.setAttribute("style", "margin: 0; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #ffffff; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #d95757;");
    kma.setAttribute("value", 'Карамзина М.А.');
    kma.appendAfter(document.getElementById('tg-podpis-tak'));*/
}

function getRk(){
    return document.getElementsByTagName('title')[0].innerText;
}

function setValue(){
    GM_setValue('RK', getRk());
    GM_setValue('URL', document.location.href);
}