// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  try to take over the world!
// @author       Frey10
// @match        *://esed.sakha.gov.ru/esed/WebRC*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

//Настройки
var username = ''; //username пользователя Telegram. Заполняется без @
var time = 3; //Время в мс от начала загрузки страницы до появления панельки телеги
//

(function() {
    'use strict';
    var i = setTimeout(function() {
        addElem();
    }, (time * 1000));
})();


function getRk(){
    return document.getElementsByTagName('title')[0].innerText;
}

function pullTg(rk, chat, type){
    var text = '', chatId = '337277275', url = 'рсмэв.рф';
    if (chat == 'tak')
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
    }
    $.ajax({
        url: 'http://esedtotg.herokuapp.com?chat=' + chatId + '&text=' + text + '&number=' + rk + '&url=' + url,
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


    $("div#Title-Place").on("click", "#tg-self-otchet", function () {
        pullTg(getRk(), 'group', 'ввел(а) отчет');
    });
    $("div#Title-Place").on("click", "#tg-self-visa", function () {
        pullTg(getRk(), 'group', 'завизировал(а)');
    });
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
    }, false;
    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    }, false;

    var tgBlock = document.getElementById('titleInfo');
    tgBlock.innerHTML = '';

    //Контейнер
    var tgRes = document.createElement('div');
    tgRes.id = 'tg-block';
    tgRes.class = 'narrow';
    tgRes.setAttribute("style", "display: inline; float: left;");
    tgBlock.appendChild(tgRes);

    //3 вида
    var so = document.createElement('input');
    so.id = 'tg-self-otchet';
    so.class = 'ribbonItem';
    so.setAttribute("type", "button");
    so.setAttribute("style", "margin: 0; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #505050; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #aab0b1;");
    so.setAttribute("value", "Ввел(а) отчет");
    tgRes.appendChild(so);

    var sv = document.createElement('input');
    sv.id = 'tg-self-visa';
    sv.class = 'ribbonItem';
    sv.setAttribute("type", "button");
    sv.setAttribute("style", "margin: 0; border-right: 1px solid #d7d7d2; border-top: 1px solid #d7d7d2; border-bottom: 1px solid blue; height: 45px; box-sizing: border-box; color: #505050; cursor: pointer; line-height: 13px; vertical-align: middle; width: 120px; background-color: #aab0b1;");
    sv.setAttribute("value", 'Завизировал(а)');
    sv.appendAfter(document.getElementById('tg-self-otchet'));

    var sp = document.createElement('input');
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
    kma.appendAfter(document.getElementById('tg-podpis-tak'));
}
