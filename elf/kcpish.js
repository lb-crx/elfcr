/*
 * A JavaScript implementation of the Pishing check base
 * http://code.ijinshan.com/api/devmore4.html
 * Version 1.1 Copyright (C) ijinshan.com 2010-2011
 * Distributed under the Apache License v2
 * See http://elffic.bitbucket.org/ for more info.
 */

/* Usgae chrome.tabs.executeScript recovered crt page:
*/
function showAlertMsg() {
    msg ="<h1>Alert!报警!</h1>\
        <h2>由<a href=http://code.ijinshan.com/api/devmore4.html>金山云安全网址查询</a>得知</h2>\
        <h2>当前地址包含严重的钓鱼隐患!</h2>\
        <h3>已由elf 插件自动屏蔽内容 请尝试其它同类网站...</h3>\
        <h4>详细参考: <a href=https://bitbucket.org/elffic/elf/wiki/Home>https://bitbucket.org/elffic/elf/wiki/Home</a></h4>\
        "
    chrome.tabs.executeScript(null,
               {code:"document.body.style.backgroundColor='red'"})
    chrome.tabs.executeScript(null,
               {code:"document.body.innerHTML='"+msg+"'"})
}
/*
    base http://code.ijinshan.com/api/devmore4.html
    check URL base Kingsoft Cloud API for URI antiPishing
*/
var APPKEY = "k-60666"
var SECRET = "99fc9fdbc6761f7d898ad25762407373"
var ASKHOST = "http://open.pc120.com"
var ASKTYPE = "/phish/?"

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the letter 'g' is found in the tab's URL...
    if ("loading"==tab.status) {
        var crtURI = window.btoa (tab.url)
        var timestamp = Date.parse(new Date())/1000+".512"
        var signbase = ASKTYPE+"appkey="+APPKEY+"&q="+crtURI+"&timestamp="+ timestamp
        var sign = hex_md5(signbase+SECRET)
        var askuri = ASKHOST+signbase+"&sign="+sign
        checKcPishing(askuri,tabId)
    }
}

function checKcPishing(URI,tabId) {
    //console.log(URI)
    var req = new XMLHttpRequest()
    req.open("GET"
        ,URI
        ,true)
    req.onreadystatechange = function() {
    if (req.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(req.responseText)
        console.log(req.responseText)
        if(1==resp.phish){
            chrome.pageAction.show(tabId)
            showAlertMsg()
            }
        }
    }
    req.send(null)
}


