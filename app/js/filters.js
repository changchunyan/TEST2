'use strict';

//公共方法
function getCoursePlanType(type) {
	var text = ''
		switch (type){
		case 1:
			text = '一对一'
				break;
		case 2:
			text = '一对多'
				break;
		case 3:
			text = '试听'
				break;
		case 4:
			text = '少年派'
				break;
		case 5:
			text = 'O2O试听课'
				break;
		case 6:
			text = 'O2O一对一'
				break;
		case 7:
			text = '班课'
				break;
		case 8:
			text = '一对一储值'
				break;
		case 9:
			text = '一对多储值'
				break;
		}
	return text;
}

function getCoursePlanWorkStatus(work) {
	var text = ''
	if(work==null){
		text = '未发送';
		return text;
	}
	switch (work.packState){
	case 2:
		text = '已发送';
		break;
	default:
		text = '未发送';
	}
	return text;
}

function getCoursePlanPastStatus(isPast) {
	var text = ''
		switch (isPast){
		case true:
			text = '已消课'
				break;
		case false:
			text = '未消课'
				break;
		}
	return text;
}

/* Filters */

angular.module('ywsFilters', []).filter('numParseInt', function () {
    return function (input) {
        return parseInt(input, 0);
    }
})
    .filter('nameList', function () {
        return function (input) {
            if (angular.isArray(input)) {
                var names = [];
                angular.forEach(input, function (value) {
                    names.push(value.displayName);
                });
                return names.join(', ')
            }
            return '';
        };
    })
    .filter('showDate', function () {
        return function (date) {

            return new Date(date);
        };
    })
    .filter('sex', function () {
        return function (data) {
            if (data == 1) {//不能使用“===”,因为可能后台返回值为 boolean
                return '男'
            } else if (data == 0) {
                return '女'
            } else {
                return '未知'
            }
        }
    })
    .filter('dataNumFilter', function () {
        return function (data) {
            return data.toFixed(2);
        };
    })
    .filter('getZhou', function () {
        return function (time) {
            var xingqi = ''
            switch (new Date(time).getDay()){
                case 0:xingqi="星期日";break;
                case 1:xingqi="星期一";break;
                case 2:xingqi="星期二";break;
                case 3:xingqi="星期三";break;
                case 4:xingqi="星期四";break;
                case 5:xingqi="星期五";break;
                case 6:xingqi="星期六";break;
            }
            return xingqi;
        };
    })
    .filter('omitted', function () {
        return function (str,num) {
            num = num||15
            return str.length>num?(str.substr(0,num)+'...'):str;
        };
    })
    .filter('omittedList', function () {
        return function (list) {
            var str = ''
            if(list){
                for(var i = 0 , len = list.length ; i<len ; i++){
                    str += (i+1==len)?list[i].name:(list[i].name+',')
                }
                str = str.length>40?(str.substr(0,40)+'...'):str
            }
            return str
        };
    })
    .filter('orderStatusF', function () {
        return function (num) {
            switch (num){
                case 1:return '录入订单';
                case 2:return '支付定金';
                case 3:return '审核通过';
                case 5:return '已退单';
                case 6:return '已转课';
                case 7:return '已生成合同';
                case 8:return '已结课';
                case 9:return '已退费';
                case 10:return '退费中';
                case 11:return '转课中';
                case 12:return '已关闭';
                case 13:return '拆订单转课中';
                case 14:return '未签约';
                case 15:return '结转中';
            }
        };
    })
    .filter('categoryF', function () {
        return function (num) {
            switch (num){
                case 1:return '买课';
                case 2:return 'app';
                case 3:return '充值';
            }
        };
    })
    .filter('userStatus', function () {
        return function (number) {
            var text = ''
            switch (number){
                case 1:
                    text = '在读'
                    break;
                case 2:
                    text = '结课'
                    break;
                case 3:
                    text = '停课'
                    break;
                case 4:
                    text = '退费'
                    break;
                case 5:
                    text = '转课'
                    break;
            }
            return text;
        }
    })
    .filter('classStatus', function () {
        return function (number,b) {
            var text = ''
            number = +number
            // console.log(number)
            switch (number){
                case 1:
                    // console.log(arguments[1])
                    if(arguments[1]){
                        text = '未消课'
                    }
                    break;
                case 2:
                    // console.log(arguments[1])
                    if(arguments[1]){
                        text = '已消课'
                    }
                    break;
                case 5:
                    text = '未消课'
                case 7:
                    text = '未消课'
                    break;
                case 6:
                    text = '已消课';
                case 8:
                    text = '已消课';
                    break;
            }
            return text;
        }
    })
    .filter('difficulty', function () {
        return function (number) {
            switch (number){
                case 1:
                   return '易'
                case 2:
                    return '中'
                case 3:
                    return '难'
                case 4:
                    return '极难'
            }
        }
    })
    .filter('paperState', function () {
        return function (str) {
            switch (str){
                case 'UNEVALED':
                   return '待审核'
                case 'EVALING':
                    return '审核中'
                case 'EVALED':
                    return '已审核'
                case 'ENABLED':
                    return '启用'
                case 'DISABLED':
                    return '停用'
                case 'RAW':
                    return '已上传'
            }
        }
    })
    .filter('mtPart',function () {
        /**
         * number:正常参数
         * flag:1，全职/兼职；0：	消课状态
         */
        return function (number,flag) {
            flag = parseInt(flag,10)
            if(flag){
                return number==1?'兼职':'全职'
            }else{
                return number==1?'已消课':'未消课'
            }
            return ' '
        }
    })
    .filter('mtPart1',function () {
        /**
         * number:正常参数
         * flag:1，全职/兼职；0：	消课状态
         */
        return function (number,flag) {
            flag = parseInt(flag,10)
            if(flag){
                return number==1?'兼职':'全职'
            }else{
                return ' '
            }
            return ' '
        }
    })
    .filter('getDays',function () {
        return function (num) {
            if(!num&&num!=0){
                return '无沟通'
            }
            switch (num){
                case 0:
                    return '今天'
                case 1:
                    return '昨天'
                case 2:
                    return '前天'
                default:
                    return num+'天前'
            }
        }
        /*return function (data) {
            if(!data){
                return '无沟通'
            }
            var day = getToDay() - getToDay(new Date(data))
            return day/(24*60*60*1000)+'天前'
            function getToDay(data) {
                var today = data||new Date(),
                    arr = [today.getFullYear(),(today.getMonth()+1)<10?('0'+(today.getMonth()+1)):(today.getMonth()+1),today.getDate()].join('-')
                console.log(today.getFullYear(),today.getMonth(),today.getDate())
                return new Date(arr).getTime()
            }
        }*/
    })
    .filter('orderRule',function () {
        var text = function (number,text1,text2) {
            if(number==1){
                return text1
            }else if(number==2){
                return text2
            }else{
                return ' '
            }
        }
        return text
    })
    .filter('joinOrExitAction', function () {
        return function (number) {
            var text = ''
            switch (number){
                case 0:
                    text = '入班'
                    break;
                case 1:
                    text = '移出班级'
                    break;
            }
            return text;
        }
    })
    .filter('schemeStatusText', function () {
        return function (number) {
            return number?'启用':'停用';
        }
    })
    .filter('setDesp',function () {
        return function (one,two) {
            console.log(one,two)
            // return text.replace(/Num/,num).replace(/value/,value)
        }
    })
    .filter('trueOrFalseText', function () {
    	return function (number) {
    		return number==true?'是':'否';
    	}
    })
    .filter('courseRuleText', function () {
    	return function (number) {
    		return number==1?'1小时':'40分钟';
    	}
    })
    .filter('userExceptionStatus', function () {
        return function (number) {
            var text = ''
            switch (number){
                case 2:
                    text = '早已结课'
                    break;
                case 3:
                    text = '早已退费'
                    break;
                case 4:
                    text = '早已转课'
                    break;
                case 5:
                    text = '未知异常'
                    break;
            }
            return text;
        }
    })
    .filter('teachingStyleShow', function () {
        return function (number) {
            var text = ''
            switch (number){
                case 1:
                    text = '一对一'
                    break;
                case 2:
                    text = '一对二'
                    break;
                case 3:
                    text = '一对三'
                    break;
                case 4:
                    text = '班课'
                    break;
                case 5:
                    text = '其他'
                    break;
            }
            return text;
        }
    })
    .filter('orderType',function () {
        return function (num) {
            var text = ''
            switch (num){
                case 1:
                    text = '新签'
                    break;
                case 2:
                    text = '续费'
                    break;
                case 3:
                    text = '返课'
                    break;
                case 4:
                    text = '转课'
                    break;
                case 5:
                    text = '推荐'
                    break;
                case 6:
                    text = '试听'
                    break;
                case 7:
                    text = '线上O2O'
                    break;
                case 8:
                    text = '赠课'
                    break;
                case 9:
                	text = "结转"
                	break;
            }
            return text;
        }
    })
    .filter('attendenceState',function () {
        return function (num) {
            var text = ''
            switch (num){
                case 0:
                    text = '未出勤'
                    break;
                case 1:
                    text = '已出勤'
                    break;
                default:
                    text = ''
            }
            return text;
        }
    })
    .filter('chargingState',function () {
        return function (num) {
            var text = ''
            switch (num){
                case 0:
                    text = '未计费'
                    break;
                case 1:
                    text = '已计费'
                    break;
                default:
                    text = ''
            }
            return text;
        }
    })
    .filter('supplementState',function () {
        return function (num) {
            var text = ''
            switch (num){
                case 1:
                    text = '已安排'
                    break;
                case 2:
                    text = '已补课'
                    break;
                case 3:
                    text = '未安排'
                    break;
                default:
                    text = ''
            }
            return text;
        }
    })
    .filter('absenceReason',function () {
        return function (num) {
            var text = ''
            switch (num){
                case "0":
                    text = '出游'
                    break;
                case "1":
                    text = '天气恶劣'
                    break;
                case "2":
                    text = '个人原因'
                    break;
                case "3":
                    text = '老师请假'
                    break;
                case "4":
                    text = '临时调课'
                    break;
                case "5":
                    text = '生病'
                    break;
            }
            return text;
        }
    })
    .filter('coursePlanType',function () {
    	return function (type) {
    		return getCoursePlanType(type);
    	}
    })
    .filter('coursePlanPastStatus',function () {
    	return function (isPast) {
    		return getCoursePlanPastStatus(isPast);
    	}
    })
    .filter('coursePlanWorkStatus',function () {
    	return function (work) {
    		return getCoursePlanWorkStatus(work);
    	}
    })
    .filter("trustUrl", ['$sce', function ($sce) {//html5 audio解决无法双向绑问题定 <audio  src="{{recordingPath | trustUrl}}" audioplayer controls></audio>
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }])
    .filter('productType',function () {
    	return function (type) {
    		var text = ''
            switch (type){
                case 1:
                    text = '一对一'
                    break;
                case 2:
                    text = '一对二'
                    break;
                case 3:
                    text = '一对三'
                    break;
                case 4:
                    text = '班课'
                    break;
                case 5:
                    text = '其他'
                    break;
            }
    		return text;
    	}
    })
    .filter('platformStatus',function () {
    	return function (type) {
    		var text = ''
            switch (type){
                case 1:
                    text = '转出'
                    break;
                case 2:
                    text = '转入'
                    break;
            }
    		return text;
    	}
    })
    .filter('classStatus',function () {
    	return function (type) {
    		var text = ''
            switch (type){
                case 0:
                    text = '未结业'
                    break;
                case 1:
                    text = '已结业'
                    break;
            }
    		return text;
    	}
    })
    .filter('classExperienceStatus',function () {
    	return function (type) {
    		var text = ''
    			switch (type){
    			case 1:
    				text = '已体验'
    					break;
    			case 2:
    				text = '待体验'
    					break;
    			case 3:
    				text = '取消体验'
    					break;
    			}
    		return text;
    	}
    })
    .filter('carryForwardStatus',function(){
    	return function (type){
    		var text = ''
    			switch(type){
    			case 1:
    				text = "未转入"
    					break;
    			case 2:
    				text = "已转入"
    					break;
    			case 3:
    				text = "审核通过"
    					break;
    			case 4:
    				text = "已撤销"
    					break;
    			case 5:
    				text = "已退单"
    					break;
    			}
    		return text;
    	}
    })
    .filter('memberFilter',function () {
        return function (data) {
            switch (data) {
                case 1: return '非会员'
                case 2: return '普通会员'
                case 3: return '优享会员'
                case 4: return '尊享会员'
            }
        }
    })
    .filter('inClassFilter',function () {
        return function (typeO2o) {
            switch (typeO2o) {
                case 0:
                    return '校区上课'
                case 1:
                    return '到家上课'
                case 2:
                    return '在线上课'
            }
        }
    })
;

angular.module('ywsFilters2', []).filter(
    'handlerList', function () {
        return function (input) {
            if (angular.isArray(input)) {//input��handler
                var names = [];
                angular.forEach(input, function (value) {//forEach��ȡUser
                    names.push(value.user.name);
                });
                return names.join(', ')
            }
            return '';
        };
    });


