var Proxy = {
    Json:
        {
            /* Json格式的字符串转换为对象
            * Str：Json格式的字符串
            */
            ToObject: function (Str) {
                try {
                    return eval('(' + Str + ')');
                }
                catch (ex) {
                    return Str;
                }
            },
            /* 对象转换为Json格式的字符串
            * Obj：对象
            */
            ToString: function (Obj) {
                if (!!JSON && !!JSON.stringify) return JSON.stringify(Obj);

                var THIS = this;
                switch (typeof (Obj)) {
                    case 'string':
                        return '"' + Obj.replace(/(["\\])/g, '\\$1') + '"';
                    case 'array':
                        return '[' + Obj.map(THIS.ToString).join(',') + ']';
                    case 'object':
                        if (Obj instanceof Array) {
                            var Arr = [];
                            var len = Obj.length;
                            for (var i = 0; i < len; i++) {
                                Arr.push(THIS.ToString(Obj[i]));
                            }
                            return '[' + Arr.join(',') + ']';
                        }
                        else if (Obj == null) {
                            return 'null';
                        }
                        else {
                            var Arr = [];
                            for (var property in Obj) {
                                Arr.push(THIS.ToString(property) + ':' + THIS.ToString(Obj[property]));
                            }
                            return '{' + Arr.join(',') + '}';
                        }
                    case 'number':
                        return Obj;
                    case false:
                        return Obj;
                }
            }
        }
};

var LocalStorage = {
    Get: function (Key, Default) {
        if (Key.length > 0 && window["localStorage"]) {
            var Result = Proxy.Json.ToObject(window["localStorage"].getItem(Key));
            if (Result && Result.Expiress > (new Date().getTime())) {
                return Result.Data;
            }
            else if (jQuery.isFunction(Default)) {
                return Default();
            }
            else {
                return Default;
            }
        }
        else {
            return null;
        }
    },
    Set: function (Key, Value, Expiress) {
        if (Key && window["localStorage"]) {
            if (!Expiress) Expiress = 86400 * 365 * 30;
            this.Remove(Key);
            window["localStorage"].setItem(Key, Proxy.Json.ToString({ Data: Value, Expiress: (new Date().getTime() + Expiress * 1000) }));
        }
    },
    Remove: function (Key) {
        if (Key && window["localStorage"]) {
            window["localStorage"].removeItem(Key);
        }
    },
    Clear: function () {
        if (window["localStorage"]) {
            window["localStorage"].clear();
        }
    }
};

var charMap = 'NjCG7lX9WbVtnaA1TxzEY5OpuJ8Pr4oZF3s-SKdkchv2mqyLiD0efwRIBH_=6UgMQ';

function enc(input) {
    var str = String(input);
    var map = charMap;
    var block = 0,
        output = '';
    var prx = [2, 4, 6, 8];
    for (var code, idx = 3 / 4, uarr;
        // 能取到字符时、block未处理完时、长度不足时
        !isNaN(code = str.charCodeAt(idx)) || 63 & block || (map = 'Q', (idx - 3 / 4) % 1); idx += 3 / 4) {
        if (code > 0x7F) {
            // utf8字符处理
            (uarr = encodeURI(str.charAt(idx)).split('%')).shift();
            for (var hex, idx2 = idx % 1; hex = uarr[idx2 | 0]; idx2 += 3 / 4) {
                block = block << 8 | parseInt(hex, 16);
                output += map.charAt(63 & block >> 8 - idx2 % 1 * 8);
            }
            idx = idx === 3 / 4 ? 0 : idx; // 修复首字符为utf8字符时出错的BUG
            idx += 3 / 4 * uarr.length % 1; // idx补偿
        } else {
            block = block << 8 | code;
            output += map.charAt(63 & block >> 8 - idx % 1 * 8);
        }
    }
    return output;
}

function dec(input) {
    var str = String(input),
        prx = [6, 4, 2, 0],
        block = 0,
        code,
        buffer = 0;

    var map = {};
    for (var i = 0; i < charMap.length - 1; i++) {
        map[charMap[i]] = i
    }

    var arr = new Array(Math.ceil(str.length / 4 * 3));
    try {
        for (var i = 0, j = 0; i < str.length && (code = map[str[i]]) >= 0; i++) {
            block = block << 6 | code;
            if (i % 4) {
                buffer = 255 & block >> prx[i % 4];
                if (buffer < 128) {
                    arr[j++] = String.fromCharCode(buffer)
                } else {
                    arr[j++] = '%' + ('0' + buffer.toString(16)).slice(-2);
                }
            }
        }
        return decodeURI(arr.join(""));
    } catch (err) {
        if(err.message == "URI malformed"){
            return decodeURI(arr.join("").replace(/%/g, '%25'))
        }else{
            Array.isArray(arr) && console.log("要解析的字符串:"+arr.join(""));
            console.log("错误信息:"+err.message);
            return null;
        }
    }
}

function getCookie(name) {
    var start = document.cookie.indexOf(name + "=");
    if (start != -1) {
        start = start + name.length + 1;
        var end = document.cookie.indexOf(";", start);
        if (end == -1)
            end = document.cookie.length;
        return document.cookie.substring(start, end);
    }
    return "";
}

function setCookie(name, value, expdays) {
    var expdate = new Date();
    expdate.setDate(expdate.getDate() + expdays);
    document.cookie = name + "=" + value + ";expires=" + expdate.toUTCString();
}

window.HD = {
    LocalStorage: LocalStorage,
    base64: {
        encode: enc,
        decode: dec
    },
    Cookie:{
        Get:getCookie,
        Set:setCookie,
        Del:function(key){
            setCookie(key,null,-1);
        }
    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return (r[2]); return null;
    }
};

window.POST=function (url, params, opts) {
    var _opts = {
        type: 'POST',
        headers: {},
        data: JSON.stringify(params||{}),
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    };
    var signature = HD.Cookie.Get("signature") || "";
    if (signature){
        signature = JSON.parse(signature);
        _opts.headers.Authorization=signature ? signature.access_token : '';
    }
    return $.ajax($.extend({}, _opts, opts || {}));
}

/************************** 跨域解决方案 ************************************/

function CrossDomain() {
    try {
        window.top.location.href;
        window.TOP = window.top;
        window.PARENT = window.parent;
        return;
    } catch(e) {

    }

    var top = window;
    while(window.TOP !== top) {
        try {
            top.parent.location.href;
            top = top.parent;
        } catch(e) {
            break;
        }
    }

    window.TOP = top;
    window.PARENT = window === top ? window : window.parent;

    // 全局接口数据window.top => window.TOP
    $.ajaxSetup({
        beforeSend: function(xhr, params) {
            var uniwater_utoken = window.HD.getUrlParam("uniwater_utoken");
            if (uniwater_utoken) {
                sessionStorage.setItem("uniwater_utoken", uniwater_utoken);
            } else {
                uniwater_utoken = sessionStorage.getItem("uniwater_utoken");
            }
            if (uniwater_utoken) {
                if (params.url.indexOf('?') > -1) {
                    params.url = params.url + '&uniwater_utoken=' + uniwater_utoken;
                } else {
                    params.url = params.url + '?uniwater_utoken=' + uniwater_utoken;
                }
            }
        }
    });
}

CrossDomain();

/************************** 跨域解决方案 ************************************/