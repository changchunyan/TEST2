/**
 * The biBase service.
 * @author JeanZhang
 * @version 1.0
 */
angular.module('ywsApp').factory('BiBaseService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.setTimeScope = setTimeScope;
		service.setTimeRange = setTimeRange;
		service.getNowFormatDate = getNowFormatDate;
		service.getNewStatisticsTime = getNewStatisticsTime;
		service.getNew12Time = getNew12Time;
		service.getMonthDays = getMonthDays;
		service.getQuarterStartDate = getQuarterStartDate;
		service.getQuarterEndDate = getQuarterEndDate;
		service.getQuarterStartMonth = getQuarterStartMonth;
		service.formatDate = formatDate;
		
		/**
		 * 设置统计时间范围
		 */
		function setTimeScope(scope,type){
			if(type == 0){
				scope.timeScope = 'D';
				scope.searchModel.timeScope = '单日';
			}else if(type == 1){
				scope.timeScope = 'W';
				scope.searchModel.timeScope = '单周';
			}else if(type == 2){
				scope.timeScope = 'M';
				scope.searchModel.timeScope = '单月';
			}else if(type == 3){
				scope.timeScope = 'Q';
				scope.searchModel.timeScope = '单季';
			}else if(type == 4){
				scope.timeScope = 'Y';
				scope.searchModel.timeScope = '单年';
			}
			setTimeRange(scope);
		}
		
		 var now = new Date();
		var nowDayOfWeek = now.getDay();         //今天本周的第几天
	    var nowDay = now.getDate();              //当前日
	    var nowMonth = now.getMonth();           //当前月
	    var nowYear = now.getYear();             //当前年
	    nowYear += (nowYear < 2000) ? 1900 : 0;  
	
		/**
		 * 设定时间范围
		 */
		function setTimeRange(scope){ 
			var now;
			if (scope.searchModel.statTime == null) {
				now = new Date();
			} else {
				var a = angular.copy(new Date(scope.searchModel.statTime));
				now = a;
			}
			var nowDayOfWeek = now.getDay();         //今天本周的第几天
		    var nowDay = now.getDate();              //当前日
		    var nowMonth = now.getMonth();           //当前月
		    var nowYear = now.getYear();             //当前年
		    nowYear += (nowYear < 2000) ? 1900 : 0;
			

		    var lastMonthDate = new Date();  //上月日期
		    var lastYear, lastMonth;
		    lastMonthDate.setDate(1);
		    lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
	    	lastYear = lastMonthDate.getFullYear();
	    	lastMonth = lastMonthDate.getMonth();
	    	
	    	if (nowDayOfWeek == 0) {
	    		nowDayOfWeek = 7;
	    	}
	    	//获取昨天
	    	var calNow = new Date();
	    	var calNowDay = calNow.getDate();
	    	var calNowYear = calNow.getYear();
	    	var calNowMonth = calNow.getMonth();
	    	calNowYear += (calNowYear < 2000) ? 1900 : 0;
	    	var getYesterdayDate = new Date(calNowYear, calNowMonth, calNowDay - 1);
	    	//时间控件最大选择时间
	    	var todayDate = new Date();
	    	scope.maxDate = getNowFormatDate(todayDate);
		    //获得上周的开始日期
		    var getUpWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6);
		    //获得上周的结束日期
		    var getUpWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek - 6));
		    //获得本周的开始日期
		    var getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		    //获得本周的结束日期
		    var getWeekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek + 1));
		    //获得本月的开始日期
		    var getMonthStartDate = new Date(nowYear, nowMonth, 1);
		    //获得本月的结束日期
		    var getMonthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
		    //获得上月的开始日期
		    var getUpMonthStartDate = new Date(lastYear, lastMonth, 1);
		    //获得上月的结束日期
		    var getUpMonthEndDate = new Date(lastYear, lastMonth, getMonthDays(lastMonth));

		    scope.searchModel.statTime = now;
		    
		    if(scope.searchModel.statTime.getDate() === new Date().getDate()
		    		&& scope.searchModel.statTime.getMonth() === new Date().getMonth()
		    		&& scope.searchModel.statTime.getYear() === new Date().getYear()
		    		&& scope.timeScope == 'D'){
		    	now = new Date();
		    	scope.presentTime = getNewStatisticsTime(now);
		    }else if(scope.searchModel.statTime.getDate() != new Date().getDate()){
		    	scope.presentTime = null;
		    }else{
		    	scope.presentTime = getNew12Time(new Date());
		    }
	        if (scope.timeScope == 'D') {
	        	scope.isDay = true;
	        	scope.isMonth = false;
        		scope.modelStartTime = now;
        		scope.modelEndTime = now;
	        } else if (scope.timeScope == 'W') {
	        	scope.isDay = false;
	        	scope.isMonth = true;
	        	if (scope.searchModel.statTime == null) {
	        		scope.modelStartTime = getUpWeekStartDate;
	        		scope.modelEndTime = getUpWeekEndDate;
	        	} else {
	        		scope.modelStartTime = getWeekStartDate;
	        		scope.modelEndTime = getWeekEndDate;
	        	}
	        } else if (scope.timeScope == 'M') {
	        	scope.isDay = false;
	        	scope.isMonth = true;
	        	if (scope.searchModel.statTime == null) {
	        		scope.modelStartTime = getUpMonthStartDate;
	        		scope.modelEndTime = getUpMonthEndDate;
	        	} else {
	        		scope.modelStartTime = getMonthStartDate;
	        		scope.modelEndTime = getMonthEndDate;
	        	}

        	}else if (scope.timeScope == 'Q') {
	        	scope.isDay = false;
	        	scope.isMonth = true; 
	        	var quarterStartDate=getQuarterStartDate();
        		var quarterEndDate= getQuarterEndDate();
        		scope.modelStartTime = quarterStartDate;
        		scope.modelEndTime = quarterEndDate;
               
        	}else if (scope.timeScope == 'Y') {
				scope.isDay = false;
				scope.isMonth = true;
				var yearStartDate=getYearStartDate();
				var yearEndDate= getYearEndDate();
				scope.modelStartTime = yearStartDate;
				scope.modelEndTime = yearEndDate;

			}
	        scope.searchModel.statTime = new Date(scope.searchModel.statTime).Format("yyyy-MM-dd");
			scope.searchModel.startTime = scope.modelStartTime;
			scope.searchModel.endTime = scope.modelEndTime;
	        //获得某月的天数
	        function getMonthDays(myMonth){
	        	var monthStartDate = new Date(nowYear, myMonth, 1);
	        	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	        	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
	        	return days;
	        } 
		}
		
		//获取当前日期
        function getNowFormatDate(obj) {
            var date = obj;
            var seperator1 = "-";
            var seperator2 = ":";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        
        //获取显示的最新跑批时间
        function getNewStatisticsTime(obj) {
        	var date = obj;
        	var seperator2 = ":";
        	var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        	var minute = date.getMinutes() < 30 ? "00" : "30";
        	var second = "00";
        	var currentdate = hour + seperator2 + minute + seperator2 + second;
        	return currentdate;
        }
        //获取显示的最新12小时跑批时间
        function getNew12Time(obj) {
        	var date = obj;
        	var seperator2 = ":";
        	var hour = date.getHours() < 12 ? "00" : "12";
        	var minute = "00";
        	var second = "00";
        	var currentdate = hour + seperator2 + minute + seperator2 + second;
        	return currentdate;
        }
        
        
      //获得本季度的开端日期 
        function getQuarterStartDate(){   
        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1); 
        return  formatDate(quarterStartDate);  
        } 

        //或的本季度的停止日期 
        function getQuarterEndDate(){ 
        var quarterEndMonth = getQuarterStartMonth() + 2; 
        var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)); 
        return formatDate(quarterStartDate); 
        }

		//获得本年的开端日期
		function getYearStartDate(){
			var yearStartDate = new Date(nowYear, 0, 1);
			return  formatDate(yearStartDate);
		}

		//或的本年的停止日期
		function getYearEndDate(){
			var yearEndDate = new Date(nowYear, 11, 31);
			return formatDate(yearEndDate);
		}

		//获得本季度的开端月份
        function getQuarterStartMonth(){ 
        var quarterStartMonth = 0; 
        if(nowMonth<3){ 
        quarterStartMonth = 0; 
        } 
        if(2<nowMonth && nowMonth<6){ 
        quarterStartMonth = 3; 
        } 
        if(5<nowMonth && nowMonth<9){ 
        quarterStartMonth = 6; 
        } 
        if(nowMonth>8){ 
        quarterStartMonth = 9; 
        } 
        return quarterStartMonth; 
        } 
        
     
        
      //格局化日期：yyyy-MM-dd 
        function formatDate(date) { 
        var myyear = date.getFullYear(); 
        var mymonth = date.getMonth()+1; 
        var myweekday = date.getDate(); 

        if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
        } 
        if(myweekday < 10){ 
        myweekday = "0" + myweekday; 
        } 
        return (myyear+"-"+mymonth + "-" + myweekday); 
        } 

        //获得某月的天数
        function getMonthDays(myMonth){
        	var monthStartDate = new Date(nowYear, myMonth, 1);
        	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
        	return days;
        } 
        
		return service;
	}

]);