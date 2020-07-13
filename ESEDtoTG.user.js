// ==UserScript==
// @name         ESEDtoTG
// @namespace    http://tampermonkey.net/
// @version      2.5
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

const userid = GM_getValue('tg_userID'); //ID пользователя Telegram.
const scriptUrl = 'https://github.com/gwynbleidd10/userscripts/raw/master/ESEDtoTG.user.js';
const mode = 'prod' //prod, debug

/*
------------------------------------------------------------------------------------------------------
---------------------------------------------Проверка-------------------------------------------------
------------------------------------------------------------------------------------------------------
*/

let checked = false;
let outdated = false;
let apiPath = '';
if ((typeof userid != 'undefined') && (userid != ''))
{
    checked = true;
}
else
{
    addSettings();
}

if (mode == 'debug')
{
    apiPath = 'http://localhost:3000/api/esed';
}
else
{
    apiPath = 'https://botsnode.herokuapp.com/api/esed';
}



 /*
------------------------------------------------------------------------------------------------------
------------------------------------------Начало-скрипта----------------------------------------------
------------------------------------------------------------------------------------------------------
*/

if (checked){
    $(document).ready(function() {
        let btn = '';

        let doc_rc = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/doc_rc\/doc_rc\.aspx.+$/i);
        let doc_rcpd = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/prj_rc\/prj_rc\.aspx.*/i);

        let reply = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/resolution\/reply\.aspx.+$/i);
        let visa = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/add_vs\.aspx.+$/i);
        let visa_send = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/send\.aspx.+$/i);
        let visa_podpis = new RegExp(/^https?:\/\/esed\.sakha\.gov\.ru\/esed\/webrc\/visa_sign\/visa_sign_edit\.aspx.+$/i);

        console.log('-------------------PAGE LOAD-------------------');

        getVersion();

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
            let i_doc_rc = setInterval(function() {
                console.log('1-1');
                if (document.querySelector('div.currentFile') != null) {
                    let author = [];
                    for (let i = 0; i < document.querySelectorAll('div.lstItem a').length; i++)
                    {
                        author.push(document.querySelectorAll('div.lstItem a')[i].text.trim());
                    }
                    addHiddenElem(author.toString(),);
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
            let i_reply = setInterval(function() {
                console.log('2-1');
                if (document.querySelector('div[data-action=".Save"') != null) {
                    clearInterval(i_reply);

                    /*
                    let node = document.createElement('div');
                    node.innerHTML = 'Не оповещать (Ознакомление)    <input type="checkbox" id="test" style="all:initial">';
                    //node.innerHTML = 'Не оповещать (Ознакомление)    <select><option>Нет</option><option>Да</option></select><input type="radio"><style></style>';
                    //node.innerHTML = '<input type="radio" id="contactChoice1" name="contact" value="email"><label for="contactChoice1">Email</label><input type="radio" id="contactChoice2" name="contact" value="phone"><label for="contactChoice2">Phone</label>';
                    document.querySelector('.repStatus.ctrlHolder').appendChild(node);
                    //document.querySelector('body').appendChild(node);
                    */
                    
                    let btn = document.querySelector('div[data-action=".Save"');
                    btn.setAttribute('id', 'Save-btn-reply');
                    btn.removeAttribute('data-action');
                    console.log('-------------------REPLY LOAD-------------------');
                }
            }, (50));
        }

        //Проверка страницы отправки визы и подписи
        if (visa.test(document.location.href) || visa_send.test(document.location.href)) {
            console.log('-------------------VISA_PODPIS_SEND START-------------------');
            let i_visa = setInterval(function() {
                console.log('2-2');
                if (document.querySelector('div[data-action=".APPLY 1"') != null) {
                    clearInterval(i_visa);
                    let btn = document.querySelector('div[data-action=".APPLY 1"');
                    btn.setAttribute('id', 'Send-btn-visa');
                    btn.removeAttribute('data-action');
                    console.log('-------------------VISA_PODPIS_SEND LOAD-------------------');
                }
            }, (50));
        }

        //Проверка страницы визы и подписи
        if (visa_podpis.test(document.location.href)) {
            console.log('-------------------VISA_PODPIS START-------------------');
            let i_visa_podpis = setInterval(function() {
                console.log('2-3');
                if (document.querySelector('div[data-action=".Save"') != null) {
                    clearInterval(i_visa_podpis);
                    let btn = document.querySelector('div[data-action=".Save"');
                    btn.setAttribute('id', 'Send-btn-visa-sign');
                    btn.removeAttribute('data-action');
                    console.log('-------------------VISA_PODPIS LOAD-------------------');
                }
            }, (50));
        }

        /*
        *   Обработчик отчёта
        *   {title, url, type, status, text, author, from}
        */

        //  Обработчик отчёта, получение отчёта
        $('body').on("click", '#Save-btn-reply', async function () {
            //Из РК
            if (doc_rc.test(window.opener.location.href) || doc_rcpd.test(window.opener.location.href))
            {
                let data = {};
                data.title = window.opener.document.title;
                data.url = window.opener.location.href;
                data.type = "answer";
                let a = document.querySelector('.repStatus.ctrlHolder').getElementsByTagName('select');
                if (a[0].selectedIndex == '-1' || a[0].selectedIndex == '0' )
                {
                    data.status = 'Не выбран';
                }
                else
                {
                    data.status = a[0].options[a[0].selectedIndex].text;
                }
                if (document.querySelector('[id$=_REPLY_List_REPLY_TEXT').value.length > 0)
                {
                    data.text = document.querySelector('[id$=_REPLY_List_REPLY_TEXT').value.trim();
                }
                data.author = document.querySelector('.cl.DEPARTMENT.cab').innerText;
                data.from = userid;
                if (!outdated){
                    await pullTg(data);
                }
            }
            if (mode == 'prod')
            {
                btn = document.getElementById('Save-btn-reply');
                btn.setAttribute('data-action', '.Save');
                btn.removeAttribute('id');
                btn.click();
            }
        });

        /*
        *   Обработчик отправки визы и подписи
        *   {title, url, type, list, from}
        */

        //  Обработчик визы и подписи, направление на визу и подпись
        $('body').on("click", '#Send-btn-visa', async function () {
            let list, data = {};
            let podpis = new RegExp(/.*подпис.*/i);
            data.title = window.opener.document.title;
            data.url = window.opener.location.href;
            //Определение типа
            if (podpis.test(document.title))
            {
                data.type = 'sign-send';
            }
            else
            {
                data.type = 'visa-send'
            }
            //Адресаты
            if (visa.test(document.location.href))
            {
                list = document.querySelector('.simpleList.ui-sortable').textContent.trim().length > 0;
                data.list = document.querySelector('.simpleList.ui-sortable').innerText.split('\n').map(Function.prototype.call, String.prototype.trim).toString();
            }
            else
            {
                list = document.querySelector('div.content div.row p.clipped').textContent.trim().length > 0;
                data.list = document.querySelector('div.content div.row p.clipped').textContent.trim().toString();
            }
            if (list)
            {
                //Срок
                if (document.getElementById('3_undefined_PERIOD').value.length > 0)
                {
                    data.from = userid;
                    if (!outdated){
                        await pullTg(data);
                    }
                    if (mode == 'prod')
                    {
                        btn = document.getElementById('Send-btn-visa');
                        btn.setAttribute('data-action', '.APPLY 1');
                        btn.removeAttribute('id');
                        btn.click();
                    }
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
        *   {title, url, author, type, status, [comment], from}
        */

        //  Обработчик визы и подписи
        $('body').on("click", '#Send-btn-visa-sign', async function () {
            let data = {};
            let podpis = new RegExp(/.*подпис.*/i);
            data.title = window.opener.document.title;
            data.url = window.opener.location.href;
            data.author = window.opener.document.getElementById('HiddenElement').attributes['author'].value;
            if (podpis.test(document.title))
            {
                data.type = 'sign';
                data.status = $('input[name=signType]:checked').prop('labels')[1].innerText.trim();
            }
            else
            {
                data.type = 'visa';
                let a = document.querySelector('.repStatus.ctrlHolder').getElementsByTagName('select');
                data.status = a[0].options[a[0].selectedIndex].text;
            }
            if (document.querySelector('[id$=_PRJ_VISA_SIGN_List_REP_TEXT').value.length > 0)
            {
                data.comment = document.querySelector('[id$=_PRJ_VISA_SIGN_List_REP_TEXT').value.trim();
            }
            data.from = userid;
            if (!outdated){
                await pullTg(data);
            }
            if (mode == 'prod')
            {
                btn = document.getElementById('Send-btn-visa-sign');
                btn.setAttribute('data-action', '.Save');
                btn.removeAttribute('id');
                btn.click();
            }
        });
    });
}

async function pullTg(data){
    await $.ajax({
        url: apiPath,
        type: 'POST',
        data: data,
        success: function(res)
        {
            console.log('Ответ: ' + res.status);
        }
    });
}

function addHiddenElem(author){
    var node = document.createElement('div');
    node.setAttribute('style', 'display:none;');
    node.setAttribute('id', 'HiddenElement');
    node.setAttribute('author', author);
    document.getElementById('aspnetForm').appendChild(node);
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

function addUpdate(current, actual){
    let html = '<form id="addFormUpdate">Версия скрипта устарела. Текущая версия: <b>' + current + '</b>. Актуальная верся: <b>' + actual + '</b>. Уведомления не будут уходить пока не обновите скрипт!</form>';
    let node = document.createElement('div');
    node.setAttribute('style', 'display:none;');
    node.setAttribute('id', 'updateBlock');
    node.setAttribute('title', 'Устаревшая версия');
    node.innerHTML = html;
    document.getElementById('aspnetForm').appendChild(node);
    $("#updateBlock").dialog({
        buttons:{
            "Закрыть":function(){
                $(this).dialog("close");
            },
            "Обновить":function(){
                //$(this).dialog("close");
                let win = window.open(scriptUrl);
                win.focus();
            }
        }},{
        modal:true,
        width:400,
        height:220
    });
}

function getVersion(){
    $.ajax({
        url: apiPath,
        type: 'get',
        success: function(res)
        {
            console.log('Версия: ' + res.version);
            if ( GM_info.script.version != res.version){
                outdated = true;
                addUpdate(GM_info.script.version, res.version)
            }
        },
        error: function(err){alert(err)}
    });
}
