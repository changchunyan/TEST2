'use strict';

/**
 * The biClassHour controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiClassHourController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiClassHourService',
	'AuthenticationService', 'localStorageService', 'CoursePlanService', 'BiBaseService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiClassHourService,
			AuthenticationService, localStorageService, CoursePlanService, BiBaseService) {
		//方法声明
		$scope.exchangeTable = exchangeTable;
		$scope.getSummary = getSummary;
		$scope.getStatistics = getStatistics;
		$scope.getDataByFilter = getDataByFilter;
		$scope.exportAll = exportAll;
		
		//参数
		$scope.currentTable = '1';
		
		//判断
		isViewSummary();
		function isViewSummary(){
			if(localStorageService.get('position_id')===Constants.PositionID.TEACHER
					|| localStorageService.get('position_id')===Constants.PositionID.YSB_TEACHER
					|| localStorageService.get('position_id')===Constants.PositionID.YSP_TEACHER
					|| localStorageService.get('position_id')===Constants.PositionID.YSGJ_TEACHER){
				$scope.isViewSummary=false;
			}else{
				$scope.isViewSummary=true;
			}
		}
		
		//方法实现
		/**
		 * 切换汇总和明细
		 */
		function exchangeTable(obj){
			if($scope.currentTable === '1'){
				$scope.currentTable = '2';
			}else{
				$scope.currentTable = '1';
			}
		}
		/**
		 * 获取列表数据
		 */
		function getSummary(tableState){
			//设置表格状态和分页信息
			$scope.summaryTableState = tableState;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            //校区人员判断是不是老师
            if(!$scope.canQueryChildSchools){
            	if(localStorageService.get('position_id')===Constants.PositionID.TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSB_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSP_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSGJ_TEACHER){
            		$scope.searchModel.teacherId = localStorageService.get('user').id;
            	}
            }
            //页面逻辑
            if($scope.searchModel.schoolId!=null){
            	$scope.viewTeacher=true;
            }else{
            	$scope.viewTeacher=false;
            }
            //查询请求
            var promise=BiClassHourService.getPageList($scope.searchModel);
	        promise.then(function (result) {
                $scope.summaryModels = result.data.list;
                if ($scope.summaryModels.length===1&&$scope.summaryModels[0]===null) {
                	tableState.pagination.numberOfPages = 0
                	return;
                }
                //计算分页总计
                $scope.summaryModelForTotal = {};
                $scope.summaryModelForTotal.oneToOneClassHours=0.0;
                $scope.summaryModelForTotal.oneToOneTimeLong=0.0;
                $scope.summaryModelForTotal.experienceClassHours=0.0;
                $scope.summaryModelForTotal.experienceTimeLong=0.0;
                $scope.summaryModelForTotal.oneToMoreClassHours=0.0;
                $scope.summaryModelForTotal.oneToMoreTimeLong=0.0;
                $scope.summaryModelForTotal.classesClassHours=0.0;
                $scope.summaryModelForTotal.classesTimeLong=0.0;
                $scope.summaryModelForTotal.previewAlreadyTransmission=0;
                $scope.summaryModelForTotal.previewNoTransmission=0;
                $scope.summaryModelForTotal.handoutsAlreadyTransmission=0;
                $scope.summaryModelForTotal.handoutsNoTransmission=0;
                $scope.summaryModelForTotal.reviewAlreadyTransmission=0;
                $scope.summaryModelForTotal.reviewNoTransmission=0;
                angular.forEach($scope.summaryModels, function(data, index, array){
                	$scope.summaryModelForTotal.oneToOneClassHours=$scope.summaryModelForTotal.oneToOneClassHours+data.oneToOneClassHours;
                    $scope.summaryModelForTotal.oneToOneTimeLong=$scope.summaryModelForTotal.oneToOneTimeLong+data.oneToOneTimeLong;
                    $scope.summaryModelForTotal.experienceClassHours=$scope.summaryModelForTotal.experienceClassHours+data.experienceClassHours;
                    $scope.summaryModelForTotal.experienceTimeLong=$scope.summaryModelForTotal.experienceTimeLong+data.experienceTimeLong;
                    $scope.summaryModelForTotal.oneToMoreClassHours=$scope.summaryModelForTotal.oneToMoreClassHours+data.oneToMoreClassHours;
                    $scope.summaryModelForTotal.oneToMoreTimeLong=$scope.summaryModelForTotal.oneToMoreTimeLong+data.oneToMoreTimeLong;
                    $scope.summaryModelForTotal.classesClassHours=$scope.summaryModelForTotal.classesClassHours+data.classesClassHours;
                    $scope.summaryModelForTotal.classesTimeLong=$scope.summaryModelForTotal.classesTimeLong+data.classesTimeLong;
                    $scope.summaryModelForTotal.previewAlreadyTransmission=$scope.summaryModelForTotal.previewAlreadyTransmission+data.previewAlreadyTransmission;
                    $scope.summaryModelForTotal.previewNoTransmission=$scope.summaryModelForTotal.previewNoTransmission+data.previewNoTransmission;
                    $scope.summaryModelForTotal.handoutsAlreadyTransmission=$scope.summaryModelForTotal.handoutsAlreadyTransmission+data.handoutsAlreadyTransmission;
                    $scope.summaryModelForTotal.handoutsNoTransmission=$scope.summaryModelForTotal.handoutsNoTransmission+data.handoutsNoTransmission;
                    $scope.summaryModelForTotal.reviewAlreadyTransmission=$scope.summaryModelForTotal.reviewAlreadyTransmission+data.reviewAlreadyTransmission;
                    $scope.summaryModelForTotal.reviewNoTransmission=$scope.summaryModelForTotal.reviewNoTransmission+data.reviewNoTransmission;
                });
                tableState.pagination.numberOfPages = result.numberOfPages;
	        });
		}
		/**
		 * 获取列表数据
		 */
		function getStatistics(tableState){
			$scope.statisticsTableState = tableState;
            if (!check_null(tableState.search.predicateObject)) {
                tableState.search.predicateObject = {};
            }
            //校区人员判断是不是老师
            if(!$scope.canQueryChildSchools){
            	if(localStorageService.get('position_id')===Constants.PositionID.TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSB_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSP_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSGJ_TEACHER){
            		tableState.search.predicateObject.onlySeeMine = true;//教师只能看到自己的
            	}
            }
            tableState.search.predicateObject.school_id = localStorageService.get('department_id');
            tableState.search.predicateObject.isStatistics = true;
            tableState.search.predicateObject.searchStartTimeString=getFormatDate($scope.modelStartTime);
            tableState.search.predicateObject.searchEndTimeString=getFormatDate($scope.modelEndTime);
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            CoursePlanService.Studentlist(start, number, tableState).then(function (result) {
                $scope.statisticsModels = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            });
		}
		//获得某月的天数
        function getMonthDays(nowYear, myMonth){
        	var monthStartDate = new Date(nowYear, myMonth, 1);
        	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
        	return days;
        }
        function getFormatDate(obj) {
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
		/**
		 * 获取列表数据
		 */
		function getDataByFilter(){
			setTimeRange();
			if($scope.currentTable==='1'){
				$scope.summaryTableState.pagination.start=0;
				$scope.summaryTableState.pagination.number=10;
				getSummary($scope.summaryTableState);
			}else if($scope.currentTable==='2'){
				$scope.statisticsTableState.pagination.start=0;
				$scope.statisticsTableState.pagination.number=10;
				getStatistics($scope.statisticsTableState);
			}
		}
		/**
		 * 导出列表
		 */
		function exportAll(){
			if($scope.currentTable==='1'){
				exportSummary();
			}else if($scope.currentTable==='2'){
				exportStatistics();
			}
		}
		/**
		 * 导出汇总
		 */
		function exportSummary(){
            $scope.searchModel.start = 0;
            $scope.searchModel.size = 0;
            //校区人员判断是不是老师
            if(!$scope.canQueryChildSchools){
            	if(localStorageService.get('position_id')===Constants.PositionID.TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSB_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSP_TEACHER
            			|| localStorageService.get('position_id')===Constants.PositionID.YSGJ_TEACHER){
            		$scope.searchModel.teacherId = AuthenticationService.currentUser().id;
            	}
            }
            //查询请求
            var promise=BiClassHourService.getPageList($scope.searchModel);
	        promise.then(function (result) {
                $scope.exportSummaryModels = result.data.list;
                //导出
                var titleName = '课时统计汇总数据';
                var exportTableStyle = {
                		sheetid: titleName,
                		headers: true,
                		caption: {
                			title: titleName,
                		},
                		column: {style:'font-size:16px; text-align:left;'},
                		columns: [
                		          {columnid:'teacherName',title: '姓名',width: '100px'},
                		          {columnid:'positionName',title: '岗位'},
                		          {columnid:'oneToOneClassHours',title: '一对一课时数'},
                		          {columnid:'oneToOneTimeLong',title: '一对一时长'},
                		          {columnid:'experienceClassHours',title: '体验课时数'},
                		          {columnid:'experienceTimeLong',title: '体验时长'},
                		          {columnid:'oneToMoreClassHours',title: '一对多课时数'},
                		          {columnid:'oneToMoreTimeLong',title: '一对多时长'},
                		          {columnid:'classesClassHours',title: '班课课时数'},
                		          {columnid:'classesTimeLong',title: '班课时长'},
                		          {columnid:'previewAlreadyTransmission',title: '课前预习已发送'},
                		          {columnid:'previewNoTransmission',title: '课前预习未发送'},
                		          {columnid:'handoutsAlreadyTransmission',title: '备课笔记已发送'},
                		          {columnid:'handoutsNoTransmission',title: '备课笔记未发送'},
                		          {columnid:'reviewAlreadyTransmission',title: '课后作业已发送'},
                		          {columnid:'reviewNoTransmission',title: '课后作业未发送'}
                		          ],
                		          row: {
                		        	  style: function(sheet, row, rowidx){
                		        		  return 'background:'+(rowidx%2?'#E1FFFF':'#F0E68C');
                		        	  }
                		          },
                		          cells: {
                		        	  style: 'font-size:13px; text-align:left;'
                		          }
                };
                alasql('SELECT * INTO XLS("课时统计汇总数据.xls", ?) FROM ?', [exportTableStyle, $scope.exportSummaryModels]);
	        });
			
		}
		/**
		 * 导出明细
		 */
		function exportStatistics(){
            var start = 0; 
            var number = 0;
            CoursePlanService.Studentlist(start, number, $scope.statisticsTableState).then(function (result) {
                $scope.exportStatisticsModels = result.data;
                angular.forEach($scope.exportStatisticsModels, function(data, index, array){
                	if(data.type===7){
                		data.student_name = data.className;
                		data.name=data.name1;
                	}
                	if(data.type===2 || data.type===9){
                		data.student_name = data.groupName;
                	}
                	data.type = getCoursePlanType(data.type);
                	data.start_time = getNowFormatDate(new Date(data.start_time)) + " " + getNewStatisticsTime(new Date(data.start_time));
                	data.is_past = getCoursePlanPastStatus(data.is_past);
                	data.previewHomework = getCoursePlanWorkStatus(data.previewHomework);
                	data.teacherHandouts = getCoursePlanWorkStatus(data.teacherHandouts);
                	data.reviewHomework = getCoursePlanWorkStatus(data.reviewHomework);
                });
                var titleName = '课时统计明细数据';
                var exportTableStyle = {
                		sheetid: titleName,
                		headers: true,
                		caption: {
                			title: titleName,
                		},
                		column: {style:'font-size:16px; text-align:left;'},
                		columns: [
                		          {columnid:'type',title: '上课类型',width: '100px'},
                		          {columnid:'student_name',title: '上课对象'},
                		          {columnid:'start_time',title: '上课时间'},
                		          {columnid:'name',title: '所属校区'},
                		          {columnid:'is_past',title: '消课状态'},
                		          {columnid:'previewHomework',title: '课前预习'},
                		          {columnid:'teacherHandouts',title: '备课笔记'},
                		          {columnid:'reviewHomework',title: '课后作业'}
                		          ],
                		          row: {
                		        	  style: function(sheet, row, rowidx){
                		        		  return 'background:'+(rowidx%2?'#E1FFFF':'#F0E68C');
                		        	  }
                		          },
                		          cells: {
                		        	  style: 'font-size:13px; text-align:left;'
                		          }
                };
                alasql('SELECT * INTO XLS("课时统计明细数据.xls", ?) FROM ?', [exportTableStyle, $scope.exportStatisticsModels]);
            });
		}
		/**
		 * 展示统计前的时间范围
		 */
		function setTimeRange(){
			var now;
			if ($scope.searchModel.statTime == null) {
				now = new Date();
			} else {
				// var a = angular.copy(new Date($scope.searchModel.statTime));
				var a =new Date($("#statTime").val());
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
	    	$scope.maxDate = getNowFormatDate(todayDate);
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

		    $scope.searchModel.statTime = now;
		    
		    if($scope.searchModel.statTime.getDate() === new Date().getDate()
		    		&& $scope.searchModel.statTime.getMonth() === new Date().getMonth()
		    		&& $scope.searchModel.statTime.getYear() === new Date().getYear()
		    		&& $scope.timeScope == 'D'){
		    	now = new Date();
		    	$scope.presentTime = getNewStatisticsTime(now);
		    }else if($scope.searchModel.statTime.getDate() != new Date().getDate()){
		    	$scope.presentTime = null;
		    }else{
		    	$scope.presentTime = getNew12Time(new Date());
		    }
	        if ($scope.timeScope == 'D') {
	        	$scope.isDay = true;
	        	$scope.isMonth = false;
        		$scope.modelStartTime = now;
        		$scope.modelEndTime = now;
	        } else if ($scope.timeScope == 'W') {
	        	$scope.isDay = false;
	        	$scope.isMonth = false;
	        	if ($scope.searchModel.statTime == null) {
	        		$scope.modelStartTime = getUpWeekStartDate;
	        		$scope.modelEndTime = getUpWeekEndDate;
	        	} else {
	        		$scope.modelStartTime = getWeekStartDate;
	        		$scope.modelEndTime = getWeekEndDate;
	        	}
	        } else if ($scope.timeScope == 'M') {
	        	$scope.isDay = false;
	        	$scope.isMonth = true;
	        	if ($scope.searchModel.statTime == null) {
	        		$scope.modelStartTime = getUpMonthStartDate;
	        		$scope.modelEndTime = getUpMonthEndDate;
	        	} else {
	        		$scope.modelStartTime = getMonthStartDate;
	        		$scope.modelEndTime = getMonthEndDate;
	        	}

        	}
	        $scope.searchModel.statTime = new Date($scope.searchModel.statTime).Format("yyyy-MM-dd");
	        
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
	}
]);