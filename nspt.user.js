// ==UserScript==
// @name         ニコニコ静画・春画のページめくり
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ニコニコ静画・春画のページめくり機能を追加します。
// @author       Kouhei Ioroi(https://ioroi.org)
// @match        https://seiga.nicovideo.jp/seiga/im*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    データ検索(document.querySelector("li.user_link").querySelector("a").href,0);
})();

function データ検索(uri,pager){
    if(pager == 0){
        let menu = document.createElement("div");
        menu.id = "illust_switcher";
        let before = document.createElement("a");
        before.innerText = "前";
        before.id = "illust_switcher_before";
        menu.appendChild(before);
        let mid_slash = document.createElement("text");
        mid_slash.innerText = " / ";
        menu.appendChild(mid_slash);
        let mid = document.createElement("a");
        mid.id = "illust_switcher_mid";
        mid.innerText = "イラスト一覧";
        mid.href = document.querySelector("li.user_link").querySelector("a").href;
        menu.appendChild(mid);
        let mid_slash_2 = document.createElement("text");
        mid_slash_2.innerText = " / ";
        menu.appendChild(mid_slash_2);
        let after = document.createElement("a");
        after.innerText = "次";
        after.id = "illust_switcher_after";
        menu.appendChild(after);
        document.querySelector("p.discription").childNodes[0].before(menu);
    }
    if(pager == 0){pager =+1}
    let searchuri = ""
    if(location.search.length != 0){
        searchuri = uri + "&page=" + pager
    }else{
        searchuri = uri + "?page=" + pager
    }
    fetch(searchuri, {
        method: "GET",
    }).then(response => response.text())
        .then(text => {
        let flag = false;
        let before_illust = ""
        let after_illust = ""
        new DOMParser().parseFromString(text, "text/html").querySelectorAll(".illust_list a").forEach((i)=>{
            if(location.pathname == i.pathname){
                flag = true;

                if (i.parentNode.nextElementSibling != null){
                    after_illust = i.parentNode.nextElementSibling.childNodes[0].href;
                    document.querySelector("#illust_switcher_after").href = after_illust;
                }else{
                    let searchuri = ""
                    if(location.search.length != 0){
                        searchuri = uri + "&page=" + (Number(pager) + 1)
                    }else{
                        searchuri = uri + "?page=" + (Number(pager) + 1)
                    }
                    fetch(searchuri ,{
                        method: "GET",
                    }).then(response => response.text())
                        .then(text => {
                        let dom = new DOMParser().parseFromString(text, "text/html").querySelectorAll(".illust_list a");
                        if (dom.length > 0){
                            after_illust = dom[0].href;
                            document.querySelector("#illust_switcher_after").href = after_illust;
                        }else{
                            document.querySelector("#illust_switcher_after").href = "";
                            document.querySelector("#illust_switcher_after").onclick = ()=>{alert("次のイラストは見つかりませんでした。"); return false;};
                        }
                    });
                }
                if (i.parentNode.previousElementSibling != null){
                    before_illust = i.parentNode.previousElementSibling.childNodes[0].href;
                    document.querySelector("#illust_switcher_before").href = before_illust;
                }else if(pager > 1){
                    let searchuri = ""
                    if(location.search.length != 0){
                        searchuri = uri + "&page=" + (Number(pager) - 1)
                    }else{
                        searchuri = uri + "?page=" + (Number(pager) - 1)
                    }
                    fetch(searchuri, {
                        method: "GET",
                    }).then(response => response.text())
                        .then(text => {
                        let dom = new DOMParser().parseFromString(text, "text/html").querySelectorAll(".illust_list a");
                        console.log(dom);
                        if (dom.length > 0){
                            before_illust = dom[dom.length -1].href;
                            document.querySelector("#illust_switcher_before").href = before_illust;
                        }else{
                            document.querySelector("#illust_switcher_before").href = "";
                            document.querySelector("#illust_switcher_before").onclick = ()=>{alert("前のイラストは見つかりませんでした。"); return false;};
                        }
                    });
                }else{
                    document.querySelector("#illust_switcher_before").href = "";
                    document.querySelector("#illust_switcher_before").onclick = ()=>{alert("前のイラストは見つかりませんでした。"); return false;};
                }
            }
        })
        if(flag == false){
            データ検索(uri,pager+1)
        }
    });
}
