'use strict';

/**
 * The biConsumeAnalysis controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiConsumeAnalysisController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 'BiConsumeAnalysisService', 'DepartmentService',
	'AuthenticationService', 'localStorageService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, BiConsumeAnalysisService, DepartmentService,
			AuthenticationService, localStorageService) {


        /**
    		 * 共同方法
    		 */
    		$scope.getAllProvinces = getAllProvinces;
    		$scope.getCitysByProvinceCode = getCitysByProvinceCode;
    		$scope.getSchoolsByArea = getSchoolsByArea;
    		$scope.getSchoolsByType = getSchoolsByType;
    		$scope.querySchoolById = querySchoolById;
    		$scope.queryDistrictById = queryDistrictById;
    		$scope.getLoginUserInfo = getLoginUserInfo;
    		$scope.getDistrictsByDivision = getDistrictsByDivision;
    		$scope.getRegionByDistrict = getRegionByDistrict;
    		$scope.getDistrictName = getDistrictName;
    		$scope.getProvinceName = getProvinceName;
    		$scope.getCityName = getCityName;
    		$scope.getSchoolName = getSchoolName;
    		$scope.setTimeRange = setTimeRange;
    		$scope.resetSearch = resetSearch;
    		$scope.setTimeScope = setTimeScope;
    		$scope.isSelected = isSelected;
    		$scope.getTabIndex = getTabIndex;

    		//具体方法实现
    		/***                                                                                        ***/
    		/**********************************************公共部分*****************************************/
    		/***                                                                                        ***/
    		/**
    		 * tab切换
    		 */
    		function getTabIndex(obj){
    			if(obj.title==='数据明细表'){
    				$scope.channelTab='0';
    			}else if(obj.title==='数据汇总表'){
    				$scope.channelTab='1';
    			}
    		}
    		/**
    		 * 获取所有省份
    		 */
    		function getAllProvinces(){
    			var promise = DepartmentService.getAllProvince();
    			promise.then(function(response){
    				if(response.status == "FAILURE"){
    					SweetAlert.swal( response.data,"请重试","error");
    				}
    				else{
    					$scope.provinces = response.data;
    				}
    			},function(error){
    				SweetAlert.swal("获取省列表失败","请重试","error");
    			});
    		}
    		/**
    		 * 根据省份code获取市
    		 */
    		function getCitysByProvinceCode(pcode){
    			if(pcode == null){
    				$scope.cities = null;
    			}
    			else{
    				var promise = DepartmentService.getCityByProvince(pcode);
    				promise.then(function(response){
    					if(response.status == "FAILURE"){
    						SweetAlert.swal( response.data,"请重试","error");
    					}
    					else{
    						$scope.cities = response.data;
    					}
    				},function(error){
    					SweetAlert.swal("获取市列表失败","请重试","error");
    				});
    			}
    		}
    		/**
    		 * 获取大区
    		 */
    		function getDistrictsByDivision(divisionId){
    			if(divisionId == null){
    				$scope.departmentAreas = {};
    			}else{
    				var filter = {};
    				filter.parentId = divisionId;
    				filter.pageSize = 0;
    				filter.pageNum = 0;
    				filter.isDeleted = 0;
    				var promise = DepartmentService.queryAll(filter);
    				promise.then(function(response){
    					if(response.status == "FAILURE"){
    						SweetAlert.swal( response.data, "请重试", "error");
    					}
    					else{
    						$scope.departmentAreas = response.data;
    					}
    				},function(error){
    					SweetAlert.swal("获取区域列表失败", "请重试", "error");
    				});
    			}
    		}
    		/**
    		 * 获取区域
    		 */
    		function getRegionByDistrict(departmentDistrictId){
    			if(departmentDistrictId == null){
    				$scope.regions = {};
    			}else{
    				var filter = {};
    				filter.district = departmentDistrictId;
    				filter.isRegion = '1';
    				filter.pageSize = 0;
    				filter.pageNum = 0;
    				filter.isDeleted = 0;
    				var promise = DepartmentService.queryAll(filter);
    				promise.then(function(response){
    					if(response.status == "FAILURE"){
    						SweetAlert.swal( response.data, "请重试", "error");
    					}
    					else{
    						$scope.regions = response.data;
    						getSchoolsByDistrict(departmentDistrictId);
    					}
    				},function(error){
    					SweetAlert.swal("获取区域列表失败", "请重试", "error");
    				});
    			}
    		}
    		/**
    		 * 根据大区获取校区
    		 */
    		function getSchoolsByDistrict(districtId) {
    			if (districtId == null) {
    				$scope.departmentSchools = {};
    			}
    			else {
    				var filter = {};
    				filter.district = districtId;
    	       	  	filter.isSchool = '1';
    	       	  	filter.pageSize = 0;
    	       	  	filter.pageNum = 0;
    	       	  	filter.isDeleted = 0;
    				var promise = DepartmentService.queryAll(filter);
    				promise.then(function(response){
    					if(response.status === "FAILURE"){
    						SweetAlert.swal( response.data, "请重试", "error");
    					}
    					else{
    						$scope.departmentSchools = response.data;
    					}
    				},function(error){
    					SweetAlert.swal("获取校区失败", "请重试", "error");
    				});
    			}
    		}
    		/**
    		 * 根据区域获取校区
    		 */
    		function getSchoolsByArea(departmentAreaId) {
    			if (departmentAreaId == null) {
    				$scope.departmentSchools = {};
    			}
    			else {
    				var filter = {};
    				filter.parentId = departmentAreaId;
    	       	  	filter.isSchool = '1';
    	       	  	filter.pageSize = 0;
    	       	  	filter.pageNum = 0;
    	       	  	filter.isDeleted = 0;
    				var promise = DepartmentService.queryAll(filter);
    				promise.then(function(response){
    					if(response.status === "FAILURE"){
    						SweetAlert.swal( response.data, "请重试", "error");
    					}
    					else{
    						$scope.departmentSchools = response.data;
    					}
    				},function(error){
    					SweetAlert.swal("获取校区失败", "请重试", "error");
    				});
    			}
    		}
    		/**
    		 * 根据校区类型获取校区
    		 */
    		function getSchoolsByType(schoolNature){
    			if ($scope.departmentRegion.id == null) {
    				return;
    			}
    			var filter = {};
    			filter.parentId = $scope.departmentRegion.id;
    			if(schoolNature!=''){
    				filter.schoolNature = schoolNature;
    			}
           	  	filter.isSchool = '1';
           	  	filter.pageSize = 0;
           	  	filter.pageNum = 0;
           	  	filter.isDeleted = 0;
    			var promise = DepartmentService.queryAll(filter);
    			promise.then(function(response){
    				if(response.status === "FAILURE"){
    					SweetAlert.swal( response.data, "请重试", "error");
    				}
    				else{
    					$scope.departmentSchools = response.data;
    				}
    			},function(error){
    				SweetAlert.swal("获取校区失败", "请重试", "error");
    			});
    		}
    		/**
    		 * 根据校区id获取校区信息
    		 */
    		function querySchoolById(schoolId) {
    			if (schoolId == null) return;
    			var promise = DepartmentService.getDeparmentById(AuthenticationService.currentUser().organization.id, schoolId);
    			promise.then(function(response){
    				if(response.status === "FAILURE"){
    					SweetAlert.swal(response.data, "请重试", "error");
    				}else{
    					var school = response.data;
    					$scope.departmentArea = new Object();
    					$scope.departmentRegion = new Object();
    					if(school.district === null && school.isDistrict === false
    							&& school.id!=429 && school.id!=430
    							&& school.id!=421 && school.id!=422){
    						$scope.canQueryChildDivisions = true;
    						$scope.canQueryChildDistricts = true;
    						$scope.canQueryChildRegions = true;
    						$scope.canQueryChildSchools = true;
    						$scope.extraQueryFinish = true;
    						$scope.viewDivision = true;
    						$scope.viewDistrict = false;
    						$scope.viewRegion = false;
    						$scope.viewSchool = false;
    						$scope.viewTeacher = false;
    						$scope.presentLabel = '全国';
    					}
    					//如果是事业部
    					else if(school.id===429 || school.id===430 || school.id===421 || school.id===422){
    						$scope.canQueryChildDivisions = false;
    						$scope.canQueryChildDistricts = true;
    						$scope.canQueryChildRegions = true;
    						$scope.canQueryChildSchools = true;
    						$scope.extraQueryFinish = true;
    						$scope.viewDivision = false;
    						$scope.viewDistrict = true;
    						$scope.viewRegion = false;
    						$scope.viewSchool = false;
    						$scope.viewTeacher = false;
    						$scope.searchModel.divisionId = school.id;
    						$scope.presentLabel = '事业部';
    					}
    					//如果是大区
    					else if(school.isDistrict === true){
    						$scope.departmentArea.id = school.id;
    						$scope.canQueryChildDivisions = false;
    						$scope.canQueryChildDistricts = false;
    						$scope.canQueryChildRegions = true;
    						$scope.canQueryChildSchools = true;
    						$scope.viewDivision = false;
    						$scope.viewDistrict = false;
    						$scope.viewRegion = true;
    						$scope.viewSchool = false;
    						$scope.viewTeacher = false;
    						$scope.extraQueryFinish = false;
    						//查询事业部信息
    						var filter = {};
    						filter.childId = school.id;
    						var promise = DepartmentService.getDepartmentByFilter(filter);
    						promise.then(function(response){
    							$scope.extraQueryFinish = true;
    							if(response.status == "FAILURE"){
    								SweetAlert.swal(response.data,"请重试","error");
    								return false;
    							}
    							else{
    								var list = response.data;
    								if(list != null){
    									var department = list[0];
    									$scope.searchModel.divisionId = department.id;
    									getDistrictsByDivision($scope.searchModel.divisionId);
    								}
    							}
    							$scope.dataPrepareReady = true;
    						});
    						$scope.presentLabel = '大区';
    					}
    					//如果是区域
    					else if(school.isRegion === true){
    						$scope.departmentRegion.id = school.id;
    						$scope.extraQueryFinish = false;
    						//查询大区信息
    						var filter = {};
    						filter.childId = school.id;
    						var promise = DepartmentService.getDepartmentByFilter(filter);
    						promise.then(function(response){
    							$scope.extraQueryFinish = true;
    							if(response.status == "FAILURE"){
    								SweetAlert.swal(response.data,"请重试","error");
    								return false;
    							}
    							else{
    								var list = response.data;
    								if(list != null){
    									var department = list[0];
    									$scope.departmentArea.id = department.id;
    									if($scope.departmentArea.id){
    										//查询事业部信息
    										var filter = {};
    										filter.childId = $scope.departmentArea.id;
    										var promise = DepartmentService.getDepartmentByFilter(filter);
    										promise.then(function(response){
    											$scope.extraQueryFinish = true;
    											if(response.status == "FAILURE"){
    												SweetAlert.swal(response.data,"请重试","error");
    												return false;
    											}
    											else{
    												var list = response.data;
    												if(list != null){
    													var department = list[0];
    													$scope.searchModel.divisionId = department.id;
    													getDistrictsByDivision($scope.searchModel.divisionId);
    												}
    											}
    											$scope.dataPrepareReady = true;
    										});
    										getRegionByDistrict($scope.departmentArea.id);
    									}
    								}
    							}
    						});
    						$scope.canQueryChildDivisions = false;
    						$scope.canQueryChildDistricts = false;
    						$scope.canQueryChildRegions = false;
    						$scope.canQueryChildSchools = true;
    						$scope.viewDivision = false;
    						$scope.viewDistrict = false;
    						$scope.viewRegion = false;
    						$scope.viewSchool = true;
    						$scope.viewTeacher = false;
    						$scope.presentLabel = '区域';
    					}
    					//如果是校区
    					else if(school.isSchool === 1){
    						$scope.searchModel.schoolId = school.id;
    						$scope.searchModel.schoolType = new String(school.schoolNature).toString();
    						$scope.departmentArea.id = school.district;
    						$scope.extraQueryFinish = false;
    						//查询事业部信息
    						var filter = {};
    						filter.childId = $scope.departmentArea.id;
    						var promise = DepartmentService.getDepartmentByFilter(filter);
    						promise.then(function(response){
    							if(response.status == "FAILURE"){
    								SweetAlert.swal(response.data,"请重试","error");
    								return false;
    							}
    							else{
    								var list = response.data;
    								if(list != null){
    									var department = list[0];
    									$scope.searchModel.divisionId = department.id;
    									getDistrictsByDivision($scope.searchModel.divisionId);
    								}
    							}
    						});
    						//查询区域信息
    						var filter = {};
    						filter.childId = school.id;
    						var promise = DepartmentService.getDepartmentByFilter(filter);
    						promise.then(function(response){
    							$scope.extraQueryFinish = true;
    							if(response.status == "FAILURE"){
    								SweetAlert.swal(response.data,"请重试","error");
    								return false;
    							}
    							else{
    								var list = response.data;
    								if(list != null){
    									var department = list[0];
    									$scope.departmentRegion.id = department.id;
    									if($scope.departmentRegion.id){
    										getSchoolsByArea($scope.departmentRegion.id);
    									}
    								}
    							}
    							$scope.dataPrepareReady = true;
    						});
    						$scope.searchModel.schoolProvince = school.provinceCode;
    						$scope.searchModel.schoolCity = school.cityCode;
    						getCitysByProvinceCode($scope.searchModel.schoolProvince);
    						$scope.canQueryChildDivisions = false;
    						$scope.canQueryChildDistricts = false;
    						$scope.canQueryChildRegions = false;
    						$scope.canQueryChildSchools = false;
    						$scope.viewDivision = false;
    						$scope.viewDistrict = false;
    						$scope.viewRegion = false;
    						$scope.viewSchool = false;
    						$scope.viewTeacher = true;
    						$scope.presentLabel = '校区';
    					}
    					if($scope.searchModel.divisionId){
    						getDistrictsByDivision($scope.searchModel.divisionId);
    					}
    					if($scope.departmentArea.id){
    						getRegionByDistrict($scope.departmentArea.id);
    					}
    					if($scope.departmentRegion.id){
    						getSchoolsByArea($scope.departmentRegion.id);
    					}
    					if($scope.extraQueryFinish != false){
    						$scope.dataPrepareReady = true;
    					}
    				}
    			},function(error){
    				SweetAlert.swal("获取登录用户校区失败","请重试","error");
    			});
    		}
    		/**
    		 * 根据大区id获取大区信息
    		 */
    		function queryDistrictById(districyId) {
    			if (districyId == null) return;
    			var promise = DepartmentService.getDeparmentById(AuthenticationService.currentUser().organization.id, districyId);
    			promise.then(function(response){
    				if(response.status == "FAILURE"){
    					SweetAlert.swal( response.data,"请重试","error");
    				}
    				else{
    					var district = response.data;
    					$scope.departmentAreasArray = angular.copy($scope.provinces);
    					$scope.departmentAreasArray = [];
    					$scope.departmentAreasArray.push(district);
    					$scope.departmentAreas = $scope.departmentAreasArray;
    				}
    			},function(error){
    				SweetAlert.swal("获取登录用户大区失败","请重试","error");
    			});
    		}
    		/**
    		 * 获取操作用户信息
    		 */
    		function getLoginUserInfo() {
    			var department=localStorageService.get('department');
    			var filter = {};
    			//一对一教育子公司420  优胜派子公司419 素质教育事业部集群416 学科教育事业部集群417
    			if(department.id===419||department.id===416){
    				filter.parentId=419;
    			}else if(department.id===420||department.id===417){
    				filter.parentId=420;
    			}else{
    				filter.customCondition = ' AND parent_id IN (419, 420)';
    			}
           	  	filter.pageSize = 0;
           	  	filter.pageNum = 0;
    			var promise = DepartmentService.queryAll(filter);
    			promise.then(function(response){
    				if(response.status === "FAILURE"){
    					SweetAlert.swal( response.data, "请重试", "error");
    				}
    				else{
    					$scope.divisions = response.data;
    				}
    			},function(error){
    				SweetAlert.swal("获取校区失败", "请重试", "error");
    			});
    			querySchoolById(department.id);
    		}
    		/**
    		 * 获取事业部名称
    		 */
    		function getDivisionName(divisionId){
    			var obj;
    			angular.forEach($scope.divisions, function(data, index){
    				if (data.id == divisionId) {
    					obj = data.name;
    				}
    			});
    			return obj;
    		}
    		/**
    		 * 获取大区名称
    		 */
    		function getDistrictName(districtId){
    			var obj;
    			angular.forEach($scope.departmentAreas, function(data, index){
    				if (data.id == districtId) {
    					obj = data.name;
    				}
    			});
    			return obj;
    		}
    		/**
    		 * 获取省份名称
    		 */
    		function getProvinceName(provinceId){
    			var obj;
    			angular.forEach($scope.provinces, function(data, index){
    				if (data.id == provinceId) {
    					var obj = data.name;
    				}
    			});
    			return obj;
    		}
    		/**
    		 * 获取城市名称
    		 */
    		function getCityName(cityId){
    			var obj;
    			angular.forEach($scope.cities, function(data, index){
    				if (data.id == cityId) {
    					obj = data.name;
    				}
    			});
    			return obj;
    		}
    		/**
    		 * 获取校区名称
    		 */
    		function getSchoolName(schoolId){
    			var obj;
    			angular.forEach($scope.departmentSchools, function(data, index){
    				if (data.id == schoolId) {
    					obj = data.name;
    				}
    			});
    			return obj;
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
    				// 回车查询的代码
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

    	    	if(nowDayOfWeek==0){
    	    		nowDayOfWeek = 7;
    	    	}
    	    	//获取昨天
    	    	var calNow = new Date();
    	    	var calNowDay = calNow.getDate();
    	    	var calNowYear = calNow.getYear();
    	    	var calNowMonth = calNow.getMonth();
    	    	calNowYear += (calNowYear < 2000) ? 1900 : 0;
    	    	var getYesterdayDate = new Date(calNowYear, calNowMonth, calNowDay - 1);
    	    	//获取时间控件最大时间
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
            		$scope.statisticsStartTime = now;
            		$scope.statisticsEndTime = now;
    	        } else if ($scope.timeScope == 'W') {
    	        	$scope.isDay = false;
    	        	if ($scope.searchModel.statTime == undefined) {
    	        		$scope.statisticsStartTime = getUpWeekStartDate;
    	        		$scope.statisticsEndTime = getUpWeekEndDate;
    	        	} else {
    	        		$scope.statisticsStartTime = getWeekStartDate;
    	        		$scope.statisticsEndTime = getWeekEndDate;
    	        	}
    	        } else if ($scope.timeScope == 'M') {
    	        	$scope.isDay = false;
    	        	if ($scope.searchModel.statTime == undefined) {
    	        		$scope.statisticsStartTime = getUpMonthStartDate;
    	        		$scope.statisticsEndTime = getUpMonthEndDate;
    	        	} else {
    	        		$scope.statisticsStartTime = getMonthStartDate;
    	        		$scope.statisticsEndTime = getMonthEndDate;
    	        	}
            	}
    	        //获得某月的天数
    	        function getMonthDays(myMonth){
    	        	var monthStartDate = new Date(nowYear, myMonth, 1);
    	        	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    	        	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    	        	return days;
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
    			$scope.searchModel.statTime = new Date($scope.searchModel.statTime).Format("yyyy-MM-dd");
    		}
    		/**
    		 * 重置筛选条件
    		 */
    		function resetSearch() {
    			$scope.searchModel = {};
    			setTimeScope(0);
    			$scope.departmentArea = {};
    			getLoginUserInfo();
    		}
    		/**
    		 * 设置统计时间范围
    		 */
    		function setTimeScope(type){
    			if(type == 0){
    				$scope.timeScope = 'D';
    				$scope.searchModel.timeScope = '单日';
    			}else if(type == 1){
    				$scope.timeScope = 'W';
    				$scope.searchModel.timeScope = '单周';
    			}else if(type == 2){
    				$scope.timeScope = 'M';
    				$scope.searchModel.timeScope = '单月';
    			}
    			setTimeRange();
    		}
    		/**
    		 * 封装model，加入合计
    		 */
    		function packageModel(obj){
    			obj.totalVisitCount = obj.renewVisitCount + obj.recommendVisitCount;
    			obj.totalVisitTimes = obj.renewVisitTimes + obj.recommendVisitTimes;
    			obj.totalOrderCount = obj.renewOrderCount + obj.recommendOrderCount;
    			obj.totalOrderAmount = obj.renewOrderAmount + obj.recommendOrderAmount;
    			return obj;
    		}
    		/**
    		 * 判断当前选择的时间类型
    		 */
    		function isSelected(type){
    			if(type==$scope.timeScope) {
    				return true;
    			} else {
    				return false;
    			}
    		}


        $scope.getStudentClassHour = getStudentClassHour;
        $scope.setViewType = setViewType;
        $scope.isViewType = isViewType;
        $scope.setDrillDownType = setDrillDownType;
        $scope.isDrillDownType = isDrillDownType;

        function summaryByDate(consumeList) {
          var summary = [];
          var lastDate = null;
          var lastSummary = null;
          for (var i = 0; i < consumeList.length; i++) {
            var consume = consumeList[i];
            if (lastDate != consume.consumeDate) {
              lastSummary = consume;
              lastDate = consume.consumeDate;
              summary.push(lastSummary);
            } else {
              lastSummary.classHourCount += consume.classHourCount;
              lastSummary.numberOfStudents += consume.numberOfStudents;
            }
          }
          return summary;
        }

        function showAllDrillDown(response) {
          var summary = summaryByDate(response.data);

          $scope.labelsSummary = [];
          $scope.seriesSummary = ['总消课小时数'];
          $scope.dataSummary = [[]];
          $scope.labelsAverage = [];
          $scope.seriesAverage = ['生均消课小时数'];
          $scope.dataAverage = [[]];
          $scope.numberOfStudentsDataLabels = [];
          $scope.numberOfStudentsDataSeries = ['上课学生数'];
          $scope.numberOfStudentsData = [[]];
          for (var i = 0; i < summary.length; i++) {
            $scope.labelsSummary.push(formatDate(new Date(summary[i].consumeDate)));
            $scope.dataSummary[0].push(summary[i].classHourCount);
            $scope.labelsAverage.push(formatDate(new Date(summary[i].consumeDate)));
            $scope.dataAverage[0].push(summary[i].classHourCount / summary[i].numberOfStudents);
            $scope.numberOfStudentsDataLabels.push(formatDate(new Date(summary[i].consumeDate)));
            $scope.numberOfStudentsData[0].push(summary[i].numberOfStudents);
          }
          analyzeAll(summary);
          analyzeAllAverage(summary);
          analyzeAllStudents(summary);
        }

        function findByDate(summary, date) {
          for (var i = 0; i < summary.length; i++) {
            if (formatDate(new Date(summary[i].consumeDate)) == date) {
              return summary[i];
            }
          }
          return null;
        }

        function analyzeAll(summary) {
          if (summary.length == 0) {
            $scope.analysis = '';
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysis = '';
            return;
          }
          var increaseRate = {};
          for (var i = 1; i < summary.length; i++) {
            var current = summary[i];
            var last = summary[i - 1];
            increaseRate[formatDate(new Date(summary[i].consumeDate))] = (current.classHourCount - last.classHourCount) / last.classHourCount;
          }

          var max = -999999;
          var min = 999999;
          var maxDay = null;
          var minDay = null;
          for (var i = 0; i < Object.keys(increaseRate).length; i++) {
            var rate = increaseRate[Object.keys(increaseRate)[i]];
            if (rate > max) {
              max = rate;
              maxDay = findByDate(summary, Object.keys(increaseRate)[i]);
            } else if (rate < min) {
              min = rate;
              minDay = findByDate(summary, Object.keys(increaseRate)[i]);
            }
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          $scope.analysis = [];
          $scope.suggestions = [];
          if (min < -0.2) {
            $scope.analysis.push(formatDate(new Date(minDay.consumeDate)) + ' 所在' +  period + '消课量较上' + period + '有较大幅度(' + (min * 100).toFixed(2) + '%) 下滑。');
            $scope.suggestions.push('建议从上课学生数和生均消课两个维度来分析。');
          }
          if (max > 0.2) {
            $scope.analysis.push(formatDate(new Date(maxDay.consumeDate)) + ' 所在' +  period + '消课量较上' + period + '有较大幅度(' + (max * 100).toFixed(2) + '%) 上升。');
          }
        }

        function analyzeAllAverage(summary) {
          if (summary.length == 0) {
            $scope.analysis = '';
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysis = '';
            return;
          }

          for (var i = 0; i < summary.length; i++) {
            if (summary[i].numberOfStudents > 0) {
              summary[i].averageClassHourCountPerStudent = summary[i].classHourCount / summary[i].numberOfStudents;
            } else {
              summary[i].averageClassHourCountPerStudent = 0;
            }
          }

          var increaseRate = {};
          for (var i = 1; i < summary.length; i++) {
            var current = summary[i];
            var last = summary[i - 1];
            increaseRate[formatDate(new Date(summary[i].consumeDate))] = (current.averageClassHourCountPerStudent - last.averageClassHourCountPerStudent) / last.averageClassHourCountPerStudent;
          }

          var max = -999999;
          var min = 999999;
          var maxDay = null;
          var minDay = null;
          for (var i = 0; i < Object.keys(increaseRate).length; i++) {
            var rate = increaseRate[Object.keys(increaseRate)[i]];
            if (rate > max) {
              max = rate;
              maxDay = findByDate(summary, Object.keys(increaseRate)[i]);
            }
            if (rate < min) {
              min = rate;
              minDay = findByDate(summary, Object.keys(increaseRate)[i]);
            }
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          $scope.analysisAverage = [];
          $scope.suggestionsAverage = [];
          if (min < -0.2) {
            $scope.analysisAverage.push(formatDate(new Date(minDay.consumeDate)) + ' 所在' +  period + '生均消课量较上' + period + '有较大幅度(' + (min * 100).toFixed(2) + '%) 下滑。');
          }
          if (max > 0.2) {
            $scope.analysisAverage.push(formatDate(new Date(maxDay.consumeDate)) + ' 所在' +  period + '生均消课量较上' + period + '有较大幅度(' + (max * 100).toFixed(2) + '%) 上升。');
          }
          if ($scope.viewType == 'W') {
            $scope.suggestionsAverage.push('一对一生均周消课在2-3为合理数值。');
          } else if ($scope.viewType == 'M') {
            $scope.suggestionsAverage.push('一对一生均月消课在8-12为合理数值。');
          }
          $scope.suggestionsAverage.push('建议按学科或年级细分，分析具体的生均消课情况。');
        }

        function analyzeAllStudents(summary) {
          if (summary.length == 0) {
            $scope.analysis = '';
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysis = '';
            return;
          }

          var increaseRate = {};
          for (var i = 1; i < summary.length; i++) {
            var current = summary[i];
            var last = summary[i - 1];
            increaseRate[formatDate(new Date(summary[i].consumeDate))] = (current.numberOfStudents - last.numberOfStudents) / last.numberOfStudents;
          }

          var max = -999999;
          var min = 999999;
          var maxDay = null;
          var minDay = null;
          for (var i = 0; i < Object.keys(increaseRate).length; i++) {
            var rate = increaseRate[Object.keys(increaseRate)[i]];
            if (rate > max) {
              max = rate;
              maxDay = findByDate(summary, Object.keys(increaseRate)[i]);
            }
            if (rate < min) {
              min = rate;
              minDay = findByDate(summary, Object.keys(increaseRate)[i]);
            }
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          $scope.analysisStudent = [];
          $scope.suggestionsStudent = [];
          if (min < -0.2) {
            $scope.analysisStudent.push(formatDate(new Date(minDay.consumeDate)) + ' 所在' +  period + '上课学生数较上' + period + '有较大幅度(' + (min * 100).toFixed(2) + '%) 下滑。');
            $scope.suggestionsStudent.push('建议按学科或年级细分，分析具体的流失情况。');
            $scope.suggestionsStudent.push('建议开展流失调研访谈工作，针对不同流失原因设计防流失产品或政策。');
          }
          if (max > 0.2) {
            $scope.analysisStudent.push(formatDate(new Date(maxDay.consumeDate)) + ' 所在' +  period + '上课学生数较上' + period + '有较大幅度(' + (max * 100).toFixed(2) + '%) 上升。');
          }
        }

        function summaryByDateAndSubject(consumeList) {
          var summaryBySubject = {};
          var dates = allDates(consumeList);

          for (var i = 0; i < consumeList.length; i++) {
            var consume = consumeList[i];
            if (consume.subject == '赠课') {
              continue;
            }
            var summaries = summaryBySubject[consume.subject];
            if (summaries == null) {
              summaries = [];
              for (var j = 0; j < dates.length; j++) {
                summaries.push({consumeDate: dates[j], classHourCount: 0, numberOfStudents: 0});
              }
              summaryBySubject[consume.subject] = summaries;
            }
            for (var j = 0; j < summaries.length; j++) {
              if (summaries[j].consumeDate == consume.consumeDate) {
                summaries[j].classHourCount = summaries[j].classHourCount + consume.classHourCount;
                summaries[j].numberOfStudents = summaries[j].numberOfStudents + consume.numberOfStudents;
                break;
              }
            }
          }
          var subjects = Object.keys(summaryBySubject);
          for (var i = 0; i < subjects.length; i++) {
            var summaries = summaryBySubject[subjects[i]];
            for (var j = 0; j < summaries.length; j++) {
              summaries[j].averageClassHourCountPerStudent = summaries[j].classHourCount / summaries[j].numberOfStudents;
            }
          }
          return summaryBySubject;
        }

        function allDates(consumeList) {
          var dates = [];
          for (var i = 0; i < consumeList.length; i++) {
            var found = false;
            for (var j = 0; j < dates.length; j++) {
              if (dates[j] == consumeList[i].consumeDate) {
                found = true;
                break;
              }
            }
            if (!found) {
              dates.push(consumeList[i].consumeDate);
            }
          }
          return dates;
        }

        function showSubjectDrillDown(response) {
          var summary = summaryByDateAndSubject(response.data);
          var dates = allDates(response.data);

          $scope.labelsSummary = [];
          $scope.seriesSummary = [];
          $scope.dataSummary = [];
          $scope.labelsAverage = [];
          $scope.seriesAverage = [];
          $scope.dataAverage = [];
          $scope.numberOfStudentsDataLabels = [];
          $scope.numberOfStudentsDataSeries = [];
          $scope.numberOfStudentsData = [];

          for (var i = 0; i < dates.length; i++) {
            $scope.labelsSummary.push(formatDate(new Date(dates[i])));
            $scope.labelsAverage.push(formatDate(new Date(dates[i])));
            $scope.numberOfStudentsDataLabels.push(formatDate(new Date(dates[i])));
          }

          var subjects = Object.keys(summary);
          for (var i = 0; i < subjects.length; i++) {
            $scope.seriesSummary.push(subjects[i]);
            $scope.seriesAverage.push(subjects[i]);
            $scope.numberOfStudentsDataSeries.push(subjects[i]);
            var consumes = summary[subjects[i]];
            var lineData = [];
            var lineDataAverage = [];
            var lineStudentsData = [];
            for (var j = 0; j < consumes.length; j++) {
              lineData.push(consumes[j].classHourCount);
              if (consumes[j].numberOfStudents == 0) {
                lineDataAverage.push(0);
              } else {
                lineDataAverage.push(consumes[j].classHourCount / consumes[j].numberOfStudents);
              }
              lineStudentsData.push(consumes[j].numberOfStudents);
            }
            $scope.dataSummary.push(lineData);
            $scope.dataAverage.push(lineDataAverage);
            $scope.numberOfStudentsData.push(lineStudentsData);
          }
          analyzeSubject(summary, dates);
          analyzeSubjectAverage(summary, dates);
          analyzeSubjectStudents(summary, dates);
        }

        function analyzeSubject(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysis = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysis = [];
            return;
          }

          var increaseRate = {};
          var subjects = Object.keys(summary);
          for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var subjectSummary = summary[subject];
            var subjectIncreaseRate = {};
            for (var j = 1; j < subjectSummary.length; j++) {
              var current = subjectSummary[j];
              var last = subjectSummary[j - 1];
              if (last.classHourCount > 0) {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = (current.classHourCount - last.classHourCount) / last.classHourCount;
              } else {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[subject] = subjectIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              total += increaseRate[subject][date];
            }
            var average = total / (subjects.length - 4);
            var outlierSubjects = [];
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              if (average > 0 && increaseRate[subject][date] < 0) {
                outlierSubjects.push(subject);
              }
            }
            if (outlierSubjects.length > 0 && outlierSubjects.length < 3) {
              var subjectsStr = '';
              for (var j = 0; j < outlierSubjects.length; j++) {
                subjectsStr += outlierSubjects[j] + ' ';
              }
              $scope.analysis.push(date + ' 所在' + period + ' ' + subjectsStr + '消课量相对下滑。')
            }
          }
        }

        function ignoreSubject(subject) {
          if (subject == '政治' || subject == '历史' || subject == '地理' || subject == '其他') {
            return true;
          }
          return false;
        }

        function analyzeSubjectAverage(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysisAverage = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysisAverage = [];
            return;
          }

          var increaseRate = {};
          var subjects = Object.keys(summary);
          for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var subjectSummary = summary[subject];
            var subjectIncreaseRate = {};
            for (var j = 1; j < subjectSummary.length; j++) {
              var current = subjectSummary[j];
              var last = subjectSummary[j - 1];
              if (last.averageClassHourCountPerStudent > 0) {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = (current.averageClassHourCountPerStudent - last.averageClassHourCountPerStudent) / last.averageClassHourCountPerStudent;
              } else {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[subject] = subjectIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              total += increaseRate[subject][date];
            }
            var average = total / (subjects.length - 4);
            var outlierSubjects = [];
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              if (average > 0 && increaseRate[subject][date] < 0) {
                outlierSubjects.push(subject);
              }
            }
            if (outlierSubjects.length > 0 && outlierSubjects.length < 3) {
              if (average.toFixed(2) > 0.009 || average.toFixed(2) < -0.009) {
                var subjectsStr = '';
                for (var j = 0; j < outlierSubjects.length; j++) {
                  subjectsStr += outlierSubjects[j] + ' ';
                }
                $scope.analysisAverage.push(date + ' 所在' + period + ' ' + subjectsStr + '生均消课量相对下滑。')
              }
            }
          }
        }

        function analyzeSubjectStudents(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysisStudent = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysisStudent = [];
            return;
          }

          var increaseRate = {};
          var subjects = Object.keys(summary);
          for (var i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            var subjectSummary = summary[subject];
            var subjectIncreaseRate = {};
            for (var j = 1; j < subjectSummary.length; j++) {
              var current = subjectSummary[j];
              var last = subjectSummary[j - 1];
              if (last.numberOfStudents > 0) {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = (current.numberOfStudents - last.numberOfStudents) / last.numberOfStudents;
              } else {
                subjectIncreaseRate[formatDate(new Date(subjectSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[subject] = subjectIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              total += increaseRate[subject][date];
            }
            var average = total / (subjects.length - 4);
            var outlierSubjects = [];
            for (var j = 0; j < subjects.length; j++) {
              var subject = subjects[j];
              if (ignoreSubject(subject)) {
                continue;
              }
              if (average > 0 && increaseRate[subject][date] < 0) {
                outlierSubjects.push(subject);
              }
            }
            if (outlierSubjects.length > 0) {
              var subjectsStr = '';
              for (var j = 0; j < outlierSubjects.length; j++) {
                subjectsStr += outlierSubjects[j] + ' ';
              }
              $scope.analysisStudent.push(date + ' 所在' + period + ' ' + subjectsStr + '上课学生数量相对下滑。')
            }
          }
        }

        function summaryByDateAndGrade(consumeList) {
          var summaryBySubject = {};
          var dates = allDates(consumeList);

          for (var i = 0; i < consumeList.length; i++) {
            var consume = consumeList[i];
            if (consume.grade == '赠送' || consume.grade == '全年级') {
              continue;
            }
            var summaries = summaryBySubject[consume.grade];
            if (summaries == null) {
              summaries = [];
              for (var j = 0; j < dates.length; j++) {
                summaries.push({consumeDate: dates[j], classHourCount: 0, numberOfStudents: 0});
              }
              summaryBySubject[consume.grade] = summaries;
            }
            for (var j = 0; j < summaries.length; j++) {
              if (summaries[j].consumeDate == consume.consumeDate) {
                summaries[j].classHourCount = summaries[j].classHourCount + consume.classHourCount;
                summaries[j].numberOfStudents = summaries[j].numberOfStudents + consume.numberOfStudents;
                break;
              }
            }

          }
          var subjects = Object.keys(summaryBySubject);
          for (var i = 0; i < subjects.length; i++) {
            var summaries = summaryBySubject[subjects[i]];
            for (var j = 0; j < summaries.length; j++) {
              summaries[j].averageClassHourCountPerStudent = summaries[j].classHourCount / summaries[j].numberOfStudents;
            }
          }
          return summaryBySubject;
        }

        function showGradeDrillDown(response) {
          var summary = summaryByDateAndGrade(response.data);
          var dates = allDates(response.data);

          $scope.labelsSummary = [];
          $scope.seriesSummary = [];
          $scope.dataSummary = [];
          $scope.labelsAverage = [];
          $scope.seriesAverage = [];
          $scope.dataAverage = [];
          $scope.numberOfStudentsDataLabels = [];
          $scope.numberOfStudentsDataSeries = [];
          $scope.numberOfStudentsData = [];

          for (var i = 0; i < dates.length; i++) {
            $scope.labelsSummary.push(formatDate(new Date(dates[i])));
            $scope.labelsAverage.push(formatDate(new Date(dates[i])));
            $scope.numberOfStudentsDataLabels.push(formatDate(new Date(dates[i])));
          }

          var grades = Object.keys(summary);
          for (var i = 0; i < grades.length; i++) {
            $scope.seriesSummary.push(grades[i]);
            $scope.seriesAverage.push(grades[i]);
            $scope.numberOfStudentsDataSeries.push(grades[i]);
            var consumes = summary[grades[i]];
            var lineData = [];
            var lineDataAverage = [];
            var lineStudentsData = [];
            for (var j = 0; j < consumes.length; j++) {
              lineData.push(consumes[j].classHourCount);
              if (consumes[j].numberOfStudents == 0) {
                lineDataAverage.push(0);
              } else {
                lineDataAverage.push(consumes[j].classHourCount / consumes[j].numberOfStudents);
              }
              lineStudentsData.push(consumes[j].numberOfStudents);
            }
            $scope.dataSummary.push(lineData);
            $scope.dataAverage.push(lineDataAverage);
            $scope.numberOfStudentsData.push(lineStudentsData);
          }
          analyzeGrade(summary, dates);
          analyzeGradeAverage(summary, dates);
          analyzeGradeStudents(summary, dates);
        }

        function analyzeGrade(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysis = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysis = [];
            return;
          }

          var increaseRate = {};
          var grades = Object.keys(summary);
          for (var i = 0; i < grades.length; i++) {
            var grade = grades[i];
            var gradeSummary = summary[grade];
            var gradeIncreaseRate = {};
            for (var j = 1; j < gradeSummary.length; j++) {
              var current = gradeSummary[j];
              var last = gradeSummary[j - 1];
              if (last.classHourCount > 0) {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = (current.classHourCount - last.classHourCount) / last.classHourCount;
              } else {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[grade] = gradeIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreGrade(grade)) {
                continue;
              }
              total += increaseRate[grade][date];
            }
            var average = total / (grades.length - 4);
            var outlierGrades = [];
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreGrade(grade)) {
                continue;
              }
              if (average > 0 && increaseRate[grade][date] < 0) {
                outlierGrades.push(grade);
              }
            }
            if (outlierGrades.length > 0 && outlierGrades.length < 3) {
              var gradesStr = '';
              for (var j = 0; j < outlierGrades.length; j++) {
                gradesStr += outlierGrades[j] + ' ';
              }
              $scope.analysis.push(date + ' 所在' + period + ' ' + gradesStr + '消课量相对下滑。')
            }
          }
        }

        function analyzeGradeStudents(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysisStudent = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysisStudent = [];
            return;
          }

          var increaseRate = {};
          var grades = Object.keys(summary);
          for (var i = 0; i < grades.length; i++) {
            var grade = grades[i];
            var gradeSummary = summary[grade];
            var gradeIncreaseRate = {};
            for (var j = 1; j < gradeSummary.length; j++) {
              var current = gradeSummary[j];
              var last = gradeSummary[j - 1];
              if (last.numberOfStudents > 0) {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = (current.numberOfStudents - last.numberOfStudents) / last.numberOfStudents;
              } else {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[grade] = gradeIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreGrade(grade)) {
                continue;
              }
              total += increaseRate[grade][date];
            }
            var average = total / (grades.length - 4);
            var outlierGrades = [];
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreSubject(grade)) {
                continue;
              }
              if (average > 0 && increaseRate[grade][date] < 0) {
                outlierGrades.push(grade);
              }
            }
            if (outlierGrades.length > 0 && outlierGrades.length < 3) {
              var gradesStr = '';
              for (var j = 0; j < outlierGrades.length; j++) {
                gradesStr += outlierGrades[j] + ' ';
              }
              $scope.analysisStudent.push(date + ' 所在' + period + ' ' + gradesStr + '上课学生数量在其他年级增长时下滑。')
            }
          }
        }

        function analyzeGradeAverage(summary, dates) {
          if (Object.keys(summary).length == 0) {
            $scope.analysisAverage = [];
            return;
          }
          if ($scope.viewType == 'D') {
            $scope.analysisAverage = [];
            return;
          }

          var increaseRate = {};
          var grades = Object.keys(summary);
          for (var i = 0; i < grades.length; i++) {
            var grade = grades[i];
            var gradeSummary = summary[grade];
            var gradeIncreaseRate = {};
            for (var j = 1; j < gradeSummary.length; j++) {
              var current = gradeSummary[j];
              var last = gradeSummary[j - 1];
              if (last.averageClassHourCountPerStudent > 0) {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = (current.averageClassHourCountPerStudent - last.averageClassHourCountPerStudent) / last.averageClassHourCountPerStudent;
              } else {
                gradeIncreaseRate[formatDate(new Date(gradeSummary[j].consumeDate))] = null;
              }
            }
            increaseRate[grade] = gradeIncreaseRate;
          }

          var period = ($scope.viewType == 'W' ? '周' : '月');
          for (var i = 0; i < dates.length; i++) {
            var date = formatDate(new Date(dates[i]));
            var total = 0.0;
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreGrade(grade)) {
                continue;
              }
              total += increaseRate[grade][date];
            }
            var average = total / (grades.length - 4);
            var outlierGrades = [];
            for (var j = 0; j < grades.length; j++) {
              var grade = grades[j];
              if (ignoreGrade(grade)) {
                continue;
              }
              if (average > 0 && increaseRate[grade][date] < 0) {
                outlierGrades.push(grade);
              }
            }
            if (outlierGrades.length > 0 && outlierGrades.length < 3) {
              if (average.toFixed(2) > 0.009 || average.toFixed(2) < -0.009) {
                var gradesStr = '';
                for (var j = 0; j < outlierGrades.length; j++) {
                  gradesStr += outlierGrades[j] + ' ';
                }
                $scope.analysisAverage.push(date + ' 所在' + period + ' ' + gradesStr + '生均消课量相对下滑。')
              }
            }
          }
        }

        function ignoreGrade(grade) {
          if (grade == '小学一年级' || grade == '小学二年级' || grade == '小学三年级' || grade == '小学四年级') {
            return true;
          }
          return false;
        }

        function getStudentClassHour() {
          $scope.analysis = [];
          $scope.suggestions = [];
          $scope.analysisAverage = [];
          $scope.suggestionsAverage = [];
          $scope.analysisStudent = [];
          $scope.suggestionsStudent = [];
          BiConsumeAnalysisService.getStudentClassHour($scope.startDate, $scope.endDate, $scope.viewType, $scope.searchModel.schoolId || $scope.searchModel.divisionId || localStorageService.get('department').id)
          .then(function(response) {
            if ($scope.drillDownType == 'A') {
              showAllDrillDown(response);
            } else if ($scope.drillDownType == 'S') {
              showSubjectDrillDown(response);
            } else if ($scope.drillDownType == 'G') {
              showGradeDrillDown(response);
            } else {
              showAllDrillDown(response);
            }
          });
        }

        function setViewType(viewType) {
          $scope.viewType = viewType;
        }

        function isViewType(viewType) {
          return $scope.viewType == viewType;
        }

        function setDrillDownType(drillDownType) {
          $scope.drillDownType = drillDownType;
        }

        function isDrillDownType(drillDownType) {
          return $scope.drillDownType == drillDownType;
        }

        function formatDate(obj) {
          var date = obj;
          var seperator1 = "-";
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          return year + seperator1 + month + seperator1 + strDate;
        }

    		$scope.timeScope = 'D';
    		$scope.searchModel = {};
    		$scope.searchModel.timeScope = '单日';
        $scope.endDate = formatDate(new Date());
        $scope.startDate = formatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
        $scope.setViewType('D');
        $scope.setDrillDownType('A');

    		$scope.statisticsModels = {};
    		$scope.statisticsModelsAll = {};
    		$scope.summaryModel = {};

        $scope.options = {
          layout: {
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 20,
              fontSize: 9,
              padding: 10
            }
          },
          tooltips: {
            mode: 'point',
            position: 'nearest'
          },
          };

    		setTimeScope(0);
    		getAllProvinces();
    		getLoginUserInfo();

	}
]);
