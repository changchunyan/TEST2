/**
 * Created by 毅 on 2015/12/2
 */
function check_null(st){
    if(typeof(st)!='undefined' && st!=null && st!=''){
        return true;
    }else{
    }
    return false;
}
function check_email(email) {
    if(null==email)
        return false;
    return email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
}
function check_mobile(mobile){
    if(null==mobile)
        return false;
    return mobile.match(/^1\d{10}$/);
}
function url_jointParameters(predicate){
    var parameters ='';
    if(!check_null(predicate)){
        return parameters;
    }
    for(i in predicate){
        parameters +='&'+i;
        parameters +='='+predicate[i];
    }
    return parameters;

}
function url_timestamp(url){
    if(check_null(url)){
        return url+'?'+ new Date().getTime();
    }
    return '';
}
function img_url(path){
    url_timestamp(QINIU_O2O_DOMIAN+path);
}
function del_null_attr(obj){
    for( a in obj){
        if(!check_null(obj[a])){
            console.log(a);
            delete obj[a];
        }
    }
    return obj;
}

function getRandTime(){
    return Date.parse(new Date())+getRand(0,1000);
}
function getRand(begin,end){
    return Math.floor(Math.random()*(end-begin))+begin;
}

// Array.prototype.delete=function(n) {　//n表示第几项，从0开始算起。
// //prototype为对象原型，注意这里为对象增加自定义方法的方法。
//     if(n<0)　//如果n<0，则不进行任何操作。
//         return this;
//     else
//         return this.slice(0,n).concat(this.slice(n+1,this.length));
//     /*
//      　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
//      　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
//      　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
//      　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
//      　　*/
// };

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
//计算当前整30
var Hours30 = function(date){
    var y = date.getFullYear();
    var M = date.getMonth()+1;
    var d = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
    var h = date.getHours()<10 ? '0'+date.getHours() : date.getHours();
    var m = date.getMinutes();
    if( m >= 30 ){
        m = 30+'';
    }else if( m<30){
        m = '00';
    }
    var str = y+'-'+M+'-'+d+' '+h+':'+m;
    return str;
};
//整12点
var Date12 = function(date){
    var y = date.getFullYear();
    var M = date.getMonth()+1;
    var d = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
    var h = date.getHours()>= 12 ? '12' : '00';
    var m = '00';
    var str = y+'-'+M+'-'+d+' '+h+':'+m;
    return str;
};
/**
 * 得到当前周数
 * @returns {number}
 */
function getWeek() {
    var totalDays = 0;
    now = new Date();
    years = now.getYear();
    if (years < 1000)
        years += 1900;
    var days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    //判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29
    } else {
        days[1] = 28
    }

    if (now.getMonth() == 0) {
        totalDays = totalDays + now.getDate();
    } else {
        var curMonth = now.getMonth();
        for (var count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
        }
        totalDays = totalDays + now.getDate();
    }
    //得到第几周
    var week = Math.round(totalDays / 7);
    return week;
}
/**
 * 阿拉伯数字转大写
 * @param n
 * @returns {*}
 * @constructor
 */
function DX(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    var unit = "千百拾亿千百拾万千百拾元角分", str = "";
    if(n==0){
        return '零';
    }
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p+1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}
/**
 * 得到当前 月的天数
 * @returns {number}
 */
function getMonthDayNumber(){
    var d = new Date();
//d.getMonth()+1代表下个月，月份索引从0开始，即当前月为6月时，getMonth()返回值为5，创建日期时同理
//此处构造的日期为下个月的第0天，天数索引从1开始，第0天即代表上个月的最后一天
    var curMonthDays = new Date(d.getFullYear(), (d.getMonth()+1), 0).getDate();
   return curMonthDays;
}

/**
 * js Map
 */
function Map(){   
    /** 存放键的数组(遍历用到) */  
    this.keys = new Array();   
    /** 存放数据 */  
    this.data = new Object();   
       
    /**  
     * 放入一个键值对  
     * @param {String} key  
     * @param {Object} value  
     */  
    this.put = function(key, value) {   
        if(this.data[key] == null){   
            this.keys.push(key);   
        }   
        this.data[key] = value;   
    };   
       
    /**  
     * 获取某键对应的值  
     * @param {String} key  
     * @return {Object} value  
     */  
    this.get = function(key) {   
        return this.data[key];   
    };   
       
    /**  
     * 删除一个键值对  
     * @param {String} key  
     */  
    this.remove = function(key) {   
        this.keys.remove(key);   
        this.data[key] = null;   
    };   
       
    /**  
     * 遍历Map,执行处理函数  
     *   
     * @param {Function} 回调函数 function(key,value,index){..}  
     */  
    this.each = function(fn){   
        if(typeof fn != 'function'){   
            return;   
        }   
        var len = this.keys.length;   
        for(var i=0;i<len;i++){   
            var k = this.keys[i];   
            fn(k,this.data[k],i);   
        }   
    };   
       
    /**  
     * 获取键值数组(类似Java的entrySet())  
     * @return 键值对象{key,value}的数组  
     */  
    this.entrys = function() {   
        var len = this.keys.length;   
        var entrys = new Array(len);   
        for (var i = 0; i < len; i++) {   
            entrys[i] = {   
                key : this.keys[i],   
                value : this.data[i]   
            };   
        }   
        return entrys;   
    };   
       
    /**  
     * 判断Map是否为空  
     */  
    this.isEmpty = function() {   
        return this.keys.length == 0;   
    };   
       
    /**  
     * 获取键值对数量  
     */  
    this.size = function(){   
        return this.keys.length;   
    };   
       
    /**  
     * 重写toString   
     */  
    this.toString = function(){   
        var s = "{";   
        for(var i=0;i<this.keys.length;i++,s+=','){   
            var k = this.keys[i];   
            s += k+"="+this.data[k];   
        }   
        s+="}";   
        return s;   
    };   
}

/**
 * 判断一个对象是否为空
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}