'use strict';

/**
 * 教师不可排课时间
 *
 * @author chenzq
 * @version 1.0
 */

angular.module('ywsApp')
	.controller('TeacherUnavailableController', ['$scope', 'CoursePlanService', '$modal', '$rootScope', 'SweetAlert','$routeParams','CustomerStudentCourseService',
    function($scope, CoursePlanService, $modal, $rootScope, SweetAlert, $routeParams, CustomerStudentCourseService) {

	$scope.getTeacherUnavailableListByFilter = getTeacherUnavailableListByFilter;
	$scope.getAllDictData = getAllDictData;
	$scope.getAllSubject = getAllSubject;
	$scope.getSelectedTeacherList = getSelectedTeacherList;
	
	$scope.getAllDictData();
	$scope.getAllSubject();
	
	/**
	 * 加载教师列表
	 */
	$scope.teacherFilter = {};
	function getTeacherUnavailableListByFilter(tableState){
		$scope.isLoading = true;
        $scope.myTeacherTableState = tableState;
        var pagination = tableState.pagination;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10;  // Number of entries showed per page.
        if( tableState.search && tableState.search.predicateObject && tableState.search.predicateObject.start_time){
        	$scope.teacherFilter.start_time = tableState.search.predicateObject.start_time;
        }
        if(tableState.search && tableState.search.predicateObject && tableState.search.predicateObject.end_time){
        	$scope.teacherFilter.end_time = tableState.search.predicateObject.end_time;
        }
        CoursePlanService.getTeacherUnavailableListByFilter(start, number,tableState,$scope.teacherFilter).then(function (response) {
        	if(response.status == "FAILURE"){
        		SweetAlert.swal(response.data, "请重试", "error");
        	}
        	else{
        		 $scope.teacherList = response.data.list;
        		 $scope.myTeacherTableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
        	}
            $scope.isLoading = false;
        });
	}
	
	/**
     * 获取所有字典数据
     */
    function getAllDictData(){
        var promise = CoursePlanService.getAllDictData();
        promise.then(function(response){
            if(response.status == "FAILURE"){
                SweetAlert.swal( response.data,"请重试","error");
            }
            else{
                $scope.dictData = response.data;
            }
        },function(error){
            SweetAlert.swal("获取字典数据失败","请重试","error");
        });
    }
    
    /**
     * 得到所有的科目 查询条件
     */
    function getAllSubject(){
        // 获取科目信息
        CustomerStudentCourseService.getAllSubject().then(function(result){
        	$scope.allSubject = result;
        });
    }
    
    /**
     * 设置不可排课时间
     */
    $scope.setUnavailableTime = function(){
    	$scope.selectedTeacher = {};
    	$scope.utsmodalTitle = "设置本周不可排课时间(06:00-24:00)";
        $scope.utsModal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.unavailable.time.set.html', show: true,backdrop:'static'});
    }
    
    $scope.showTeacherList = function(){
    	$scope.teacherFilter2 = {};
    	$scope.tsmodalTitle = "查询要选择的老师";
        $scope.tsModal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.teacher.select.html', show: true,backdrop:'static'});
    }
    
    /**
     * 查询teacher列表
     * @param tableState
     */
    $scope.teacherFilter2 = {};
    function getSelectedTeacherList(tableState){
        $scope.taacherListsTableState = tableState;
        var pagination = tableState.pagination;
        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var  number = pagination.number || 10;  // Number of entries showed per page.
        CoursePlanService.getTeacherListByFilter(start,number,tableState,$scope.teacherFilter2).then(function(response){
                $scope.teacherLists = response.data.list;
                if($scope.teacherLists){
                	if(!$scope.school){
                		angular.forEach($scope.teacherLists, function(p, index){
                    		$scope.school = p.deptname;
                    		return;
                    	});
                	}
                }
                $scope.taacherListsTableState.pagination.numberOfPages = response.data.pages;//set the number of pages so the pagination can update
        });
    }
    
    /**
     * 选中老师
     */
    $scope.selectedTeacher = {};
    $scope.teacherSelected = function(){
    	var index = $("input[name='selectedTeacher']:checked").val();
    	if(!index){
    		SweetAlert.swal("请选择教师", "", "errors");
    		return false;
    	}
    	var list = angular.copy($scope.selectedTeacher.unavailableTimeList);
    	$scope.selectedTeacher = angular.copy($scope.teacherLists[index]);
    	$scope.selectedTeacher.unavailableTimeList = list;
    	$scope.tsModal.hide();
    }
    
    /**
     * 查询不可排课时间列表
     */
    $scope.getTeacherUnavailableTime = function(tableState){
    	
    }
    
    /**
     * 显示添加不可排课时间modal
     */
    $scope.showAddUnavaliableTimeView = function(){
    	$scope.selectTime = {};
    	$scope.selected = {};
    	$scope.autmodalTitle = "添加不可排课时间";
        $scope.autModal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.add.unavailable.time.html', show: true,backdrop:'static'});
    }
    
    /**
     * 将选择的时间点加入list中
     */
    $scope.addUnavailablePlan = function(){
    	if(!$scope.selectTime.startTime || !$scope.selectTime.endTime){
    		SweetAlert.swal("请选择开始时间和结束时间", "", "error");
    		return false;
    	}
    	if(!($scope.selected.dayShowOfWeek1 || $scope.selected.dayShowOfWeek2 || $scope.selected.dayShowOfWeek3
    			|| $scope.selected.dayShowOfWeek4 || $scope.selected.dayShowOfWeek5 || $scope.selected.dayShowOfWeek6
    			|| $scope.selected.dayShowOfWeek7)){
    		SweetAlert.swal("请选择日期", "", "error");
    		return false;
    	}
    	var startTime = new Date("2000-01-01 " + $scope.selectTime.startTime);
    	var endTime = new Date("2000-01-01 " + $scope.selectTime.endTime);
    	var beginTime = new Date("2000-01-01 06:00:00");//从6点开始
    	if(startTime < beginTime){
    		SweetAlert.swal("开始时间不能早于06:00", "", "error");
    		return false;
    	}
    	if(startTime >= endTime){
    		SweetAlert.swal("开始时间不能大于结束时间", "", "error");
    		return false;
    	}
    	if(!$scope.selectedTeacher.unavailableTimeList){
    		$scope.selectedTeacher.unavailableTimeList = [];
    	}
    	$scope.generateElement();
    	var isConflict = $scope.checkTimeConflict();
    	if(isConflict){
    		angular.forEach($scope.addList, function(p,index){
        		$scope.selectedTeacher.unavailableTimeList.unshift(p);
        	});
    		$scope.autModal.hide();
    	}
		
    }
    
    /**
     * 删除不可排课时间记录
     */
    $scope.remove = function(index){
    	$scope.selectedTeacher.unavailableTimeList.splice(index, 1);
    }
    
    /**
     * 选中全天
     */
    $scope.checkAllDay = function(){
    	if($scope.selectTime.allDay == true){
    		$scope.selectTime.startTime = "06:00";
    		$scope.selectTime.endTime = "23:59";
    	}
    	else{
    		$scope.selectTime.startTime = undefined;
    		$scope.selectTime.endTime = undefined;
    	}
    }
    
    /**
     * 生成list中的元素
     */
    $scope.generateElement = function(){
    	$scope.addList = [];
    	$scope.element = {};
    	$scope.element.startTime = $scope.selectTime.startTime;
    	$scope.element.endTime = $scope.selectTime.endTime;
    	if($scope.selected.dayShowOfWeek1){
    		$scope.element.dayOfWeek = "星期一";
    		$scope.element.startDate = _getTimestampByWeekAndTime(1, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(1, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek2){
    		$scope.element.dayOfWeek = "星期二";
    		$scope.element.startDate = _getTimestampByWeekAndTime(2, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(2, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek3){
    		$scope.element.dayOfWeek = "星期三";
    		$scope.element.startDate = _getTimestampByWeekAndTime(3, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(3, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek4){
    		$scope.element.dayOfWeek = "星期四";
    		$scope.element.startDate = _getTimestampByWeekAndTime(4, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(4, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek5){
    		$scope.element.dayOfWeek = "星期五";
    		$scope.element.startDate = _getTimestampByWeekAndTime(5, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(5, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek6){
    		$scope.element.dayOfWeek = "星期六";
    		$scope.element.startDate = _getTimestampByWeekAndTime(6, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(6, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    	if($scope.selected.dayShowOfWeek7){
    		$scope.element.dayOfWeek = "星期日";
    		$scope.element.startDate = _getTimestampByWeekAndTime(7, $scope.selectTime.startTime);
    		$scope.element.endDate = _getTimestampByWeekAndTime(7, $scope.selectTime.endTime);
    		$scope.addList.unshift(angular.copy($scope.element));
    	}
    }
    
    /**
     * 检查要添加的时间段是否和其他的有冲突
     */
    $scope.checkTimeConflict = function(){
    	var flag = true;
    	angular.forEach($scope.addList, function(p, p_index){
    		angular.forEach($scope.selectedTeacher.unavailableTimeList, function(q, q_index){
    			if(p.dayOfWeek == q.dayOfWeek){
    				var p_startTime = new Date("2000-01-01 " + p.startTime);
    		    	var p_endTime = new Date("2000-01-01 " + p.endTime);
    		    	var q_startTime = new Date("2000-01-01 " + q.startTime);
    		    	var q_endTime = new Date("2000-01-01 " + q.endTime);
    		    	if(!(p_endTime <= q_startTime || q_endTime <= p_startTime)){
    		    		//时间出现交集
    		    		flag = false;
    		    		SweetAlert.swal(p.dayOfWeek + "不可排课时间出现重叠，请确认", "", "error");
    		    		return;
    		    	}
    			}
    		});
    	});
    	return flag;
    }
    
    /**
     * 写入数据库
     */
	$scope.hkThisweek=false;
	$scope.hchooseThisWeek=function(){
		$scope.hkThisweek=!$scope.hkThisweek;
    };
	$scope.hkNextweek=false;
	$scope.hchooseNextWeek=function(){
		$scope.hkNextweek=!$scope.hkNextweek;
	};
    $scope.doAddUnavaliableTime = function(){
    	if(!$scope.selectedTeacher.userId){
    		SweetAlert.swal("请选择教师后再设置", "", "error");
    		return false;
    	}
    	var thisweek = $("input[name='thisweek']:checked").val();
    	var nextweek = $("input[name='nextweek']:checked").val();
    	if(!thisweek && !nextweek){
    		SweetAlert.swal("请选择要设置的周", "", "error");
    		return false;
    	}
    	else{
    		$scope.selectedBak = angular.copy($scope.selectedTeacher);
    		if(thisweek){//选择本周
    			if(nextweek){//选择下周
        			//需要再复制一份下周的数据
    				var nextList = [];
    				angular.forEach($scope.selectedTeacher.unavailableTimeList, function(p, index){
        				var q = {};
    					q.startDate = p.startDate + 1000*60*60*24*7;
        				q.endDate = p.endDate + 1000*60*60*24*7;
        				nextList.unshift(q);
        			});
    				angular.forEach(nextList, function(p,index){
    	        		$scope.selectedTeacher.unavailableTimeList.unshift(p);
    	        	});
        		}
    		}
    		else{//未选择本周
    			if(nextweek){//选择下周
    				angular.forEach($scope.selectedTeacher.unavailableTimeList, function(p, index){
        				p.startDate = p.startDate + 1000*60*60*24*7;
        				p.endDate = p.endDate + 1000*60*60*24*7;
        			});
        		}
    		}
    		//调用后台，更新记录
    		CoursePlanService.updateTeacherUnavailableTime($scope.selectedTeacher).then(function(response){
    			if(response.status == "FAILURE"){
    				if(response.data == "不可排与已排冲突"){
    					//查询一遍所有冲突的已排课记录，需要展示出来
    					CoursePlanService.getConflictPlanList($scope.selectedTeacher).then(function(response){
    						if(response.status == "FAILURE"){
    							SweetAlert.swal(response.data);
    						}
    						else{
    							$scope.warningStudentList = response.data;
    							$scope.utsModal.hide();
    							//打开新弹窗
    							$scope.showConfilctInfo();
    						}
    					});
    				}
    				else{
    					$scope.selectedTeacher = angular.copy($scope.selectedBak);
        				SweetAlert.swal(response.data);
    				}
    			}
    			else{
    				SweetAlert.swal("设置成功", "", "success");
    				$scope.selectedTeacher = {};
    				getTeacherUnavailableListByFilter($scope.myTeacherTableState);
    				$scope.utsModal.hide();
					$scope.hkThisweek=false;
					$scope.hkNextweek=false;
    			}
    		});
    	}
    }
    
    $scope.showConfilctInfo = function(){
    	$scope.confilctModalTitle = "时间冲突提醒";
        $scope.confilctModal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.conflict.student.html', show: true,backdrop:'static'});
    }
    
    
    /**
     * 关闭utsModal弹框，同时清空已选择教师
     */
    $scope.hideUTSModal = function(){
    	$scope.selectedTeacher = {};
    	$scope.utsModal.hide();
    }
    
    /**
     * 通过星期得到具体日期的零点 时间戳
     * @param week
     * @private
     */
    function _timestampByWeek(week){
        if(week ==7){//因为前台设星期天为7
            week = 0;
        }
        var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
        var cha = week-day;
        if(week == 0){
        	cha = cha+7;
        }
        /*if(cha<0){
            cha =0;
        }*/

        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        var oneday = 1000 * 60 * 60 * 24;
        return today.getTime() +oneday*cha;
    }

    /**
     * 通过实践得到毫秒数 eg:21:30
     * @param time
     * @returns {number}
     * @private
     */
    function _timestampByTime(time){
        if(time){
            var _arr = time.split(':');
            var hour = 1000*60*60 * _arr[0];
            var minute = 1000*60 * _arr[1];
            return hour + minute;
        }
    }

    /**
     * 通过周 和时间字符串 得到 时间戳
     * @param week eg:"1"
     * @param time eg:"21:30"
     * @private
     */
    function _getTimestampByWeekAndTime(week,time){
        var date0 = _timestampByWeek(week);
        var t = _timestampByTime(time);
        return date0+t;
    }
    
    /**
     * 删除某条记录
     */
    $scope._delete = function(id){
    	SweetAlert.swal({
            title: "请谨慎操作！",
            text: '确认要删除该条记录吗',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnConfirm: true,
            showLoaderOnConfirm: true
            }, function(confirm) {
              if (confirm) {
            	  CoursePlanService.deleteUnavaliableRecord(id).then(function(response){
          			if(response.status == "FAILURE"){
          				SweetAlert.swal(response.data);
          			}
          			else{
          				SweetAlert.swal("删除成功", "", "success");
          				getTeacherUnavailableListByFilter($scope.myTeacherTableState);
          			}
          		});
	          }
            }
          );
    }
    
    /**
     * 显示编辑单条记录弹框
     */
    $scope.showEditView = function(row){
    	$scope.teacherUnavaliable = angular.copy(row);
    	$scope.selectTime = {};
    	var date = new Date($scope.teacherUnavaliable.start_time);
    	$scope.selectTime.date = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    	$scope.selectTime.startTime = $scope.timeFormat(date);
    	date = new Date($scope.teacherUnavaliable.end_time);
    	$scope.selectTime.endTime = $scope.timeFormat(date);
    	$scope.editTitle = "修改教师不可排课时间";
        $scope.editModal = $modal({scope: $scope, templateUrl: 'partials/sos/coursePlan/modal.teacher.unavaliable.edit.html', show: true,backdrop:'static'});
    }
    
    $scope.timeFormat = function(date){
    	var str = "";
    	if(date.getHours() < 10){
    		str = "0" + date.getHours();
    	}
    	else{
    		str = date.getHours();
    	}
    	if(date.getMinutes() < 10){
    		str = str + ":0" + date.getMinutes();
    	}
    	else{
    		str = str + ":" + date.getMinutes();
    	}
    	return str;
    }
    
    /**
     * 修改某条不可排课记录
     */
    $scope.update = function(){
    	var now = new Date();
    	var strDate = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
    	var selectedDate = new Date($scope.selectTime.date);
    	var nowDate = new Date(strDate)
    	if(selectedDate < nowDate){
    		SweetAlert.swal("请选择选择的今天或之后的日期");
    		return false;
    	}
    	var startTime = new Date("2000-01-01 " + $scope.selectTime.startTime);
    	var endTime = new Date("2000-01-01 " + $scope.selectTime.endTime);
    	var beginTime = new Date("2000-01-01 06:00:00");//从6点开始
    	if(startTime < beginTime){
    		SweetAlert.swal("开始时间不能早于06:00", "", "error");
    		return false;
    	}
    	if(startTime >= endTime){
    		SweetAlert.swal("开始时间不能大于结束时间", "", "error");
    		return false;
    	}
    	else{
    		$scope.selectedTeacher = {};
    		$scope.selectedTeacher.id = $scope.teacherUnavaliable.id;
    		$scope.selectedTeacher.employId = $scope.teacherUnavaliable.employId;
    		$scope.selectedTeacher.userId = $scope.teacherUnavaliable.userId;
        	$scope.selectedTeacher.unavailableTimeList = [];
        	var p  = {};
        	p.startDate = (new Date($scope.selectTime.date + " " + $scope.selectTime.startTime)).getTime();
        	p.endDate = (new Date($scope.selectTime.date + " " + $scope.selectTime.endTime)).getTime();
        	$scope.selectedTeacher.unavailableTimeList.unshift(p);
    		CoursePlanService.updateTeacherUnavailableTime($scope.selectedTeacher).then(function(response){
    			if(response.status == "FAILURE"){
    				if(response.data == "不可排与已排冲突"){
    					//查询一遍所有冲突的已排课记录，需要展示出来
    					CoursePlanService.getConflictPlanList($scope.selectedTeacher).then(function(response){
    						if(response.status == "FAILURE"){
    							SweetAlert.swal(response.data);
    						}
    						else{
    							$scope.warningStudentList = response.data;
    							$scope.editModal.hide();
    							//打开新弹窗
    							$scope.showConfilctInfo();
    						}
    					});
    				}
    				else{
        				SweetAlert.swal(response.data);
    				}
    			}
    			else{
    				SweetAlert.swal("设置成功", "", "success");
    				$scope.selectedTeacher = {};
    				getTeacherUnavailableListByFilter($scope.myTeacherTableState);
    				$scope.editModal.hide();
    			}
    		});
    	}
    }
  }
]);
