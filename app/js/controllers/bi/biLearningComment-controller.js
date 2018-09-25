'use strict';

/**
 * The learningComment controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('BiLearningCommentController', [
	'$scope', '$modal', '$filter', '$rootScope', 'SweetAlert', 
	'BiLearningCommentService', 'DepartmentService',
	'AuthenticationService', 'localStorageService', 'CommonService',
	'BiStudentTeacherCommunicationService',
	function($scope, $modal, $filter, $rootScope, SweetAlert, 
			BiLearningCommentService, DepartmentService,
			AuthenticationService, localStorageService, CommonService,
			BiStudentTeacherCommunicationService) {
		// 方法声明
		/**
		 * 共同方法
		 */
		$scope.openTextWindow = openTextWindow;
		$scope.changeCurrentTab = changeCurrentTab;
		$scope.getAllProvinces = getAllProvinces;
		$scope.getCitysByProvinceCode = getCitysByProvinceCode;
		$scope.getRegionByDistrict = getRegionByDistrict;
		$scope.getSchoolsByArea = getSchoolsByArea;
		$scope.getSchoolsByType = getSchoolsByType;
		$scope.getLoginUserInfo = getLoginUserInfo;
		$scope.resetSearch = resetSearch;
		$scope.getAllSubjects = getAllSubjects;
		$scope.getAllGrades = getAllGrades;
		$scope.getDistrictsByDivision = getDistrictsByDivision;
		$scope.showDistrictDetailView = showDistrictDetailView;
		$scope.showRegionDetailView = showRegionDetailView;
		$scope.showSchoolDetailView = showSchoolDetailView;
		$scope.showTeacherDetailView = showTeacherDetailView;
		$scope.backDivisionList = backDivisionList;
		$scope.backDistrictList = backDistrictList;
		$scope.backRegionList = backRegionList;
		$scope.backSchoolList = backSchoolList;
		/*
		 * 统计方法
		 */
		$scope.getStatistics = getStatistics;
		$scope.getStatisticsAll = getStatisticsAll;
		$scope.getStatisticsByFilter = getStatisticsByFilter;
		$scope.exportStatisticsToExcel = exportStatisticsToExcel;
		/*
		 * 汇总方法
		 */
		$scope.getSummary = getSummary;
		$scope.getSummaryAll = getSummaryAll;
		$scope.exportSummaryToExcel = exportSummaryToExcel;
		
		// 显示添加沟通记录的对话框,保存沟通记录
		$scope.showCommunicationDialog = showCommunicationDialog;
		$scope.updateCommuincation = updateCommuincation;
		$scope.judgeIsXueXiAndYunYing = judgeIsXueXiAndYunYing;
		$scope.viewCommunicationDialog = viewCommunicationDialog;
		$scope.cancle = cancle;
		
		// 参数初始化
		/**
		 * 公共参数
		 */
		$scope.departmentArea = {};
		$scope.selectedPageSize = {};
		$scope.selectedPageSize.size = "10";
		$scope.rowDetail = {}
		$scope.communicationVo = {}
		$scope.canQueryChildSchools = false;  //是否可以查看其它校区
		/**
		 * 统计参数
		 */
		$scope.statisticsModels = {};  //统计表格数据 
		$scope.searchModel = {};  //统计筛选条件数据
		$scope.timeScope = {};  //统计日期范围参数
		/**
		 * 汇总参数
		 */
		$scope.searchSummaryModel = {};
		$scope.exportSummaryData = [];
		
		// 方法初始化
		getAllProvinces();
		getLoginUserInfo();
		getAllSubjects();
		getAllGrades();
		
		//具体方法实现
		/***                                                                                        ***/
		/**********************************************公共部分*****************************************/
		/***                                                                                        ***/
		/**
		 * 建议的弹窗
		 */
		function openTextWindow(text){
			$scope.textContent = text;
			$scope.textTitle = '详情';
			SweetAlert.swal(text);
		}
		$scope.pageSizes = [
		    {size: 10},
		    {size: 25},
		    {size: 50}
		];
		/**
		 * 切换统计和汇总tab页
		 */
		function changeCurrentTab(obj){
			if(obj.title==='学管日评'){
				$scope.currentTab=1;
			}else if(obj.title==='学管月评'){
				$scope.currentTab=2;
			}else if(obj.title==='月评汇总'){
				$scope.currentTab=3;
			}
		}
		/**
		 * 变换日期格式为字符串
		 */
		function formatDate(date){
			var myyear = date.getFullYear();
	        var mymonth = date.getMonth() + 1;
	        var myweekday = date.getDate();

	        if(mymonth < 10){
	            mymonth = "0" + mymonth;
	        }
	        if(myweekday < 10){
	            myweekday = "0" + myweekday;
	        }
	        return (myyear + "-" + mymonth + "-" + myweekday + " 00:00:00");
		}
		/**
		 * 获取所有省份
		 */
		function getAllProvinces(){
			var promise = DepartmentService.getAllProvince();
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data, "请重试", "error");
				}
				else{
					$scope.provinces = response.data;
				}
			},function(error){
				SweetAlert.swal("获取省列表失败", "请重试", "error");
			});
		}
		/**
		 * 根据省份code获取市
		 * @param pcode province code
		 */
		function getCitysByProvinceCode(pcode){
			if(pcode == null){
				$scope.cities = null;
			}
			else{
				var promise = DepartmentService.getCityByProvince(pcode);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data, "请重试", "error");
					}
					else{
						$scope.cities = response.data;
					}
				},function(error){
					SweetAlert.swal("获取市列表失败", "请重试", "error");
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
					//如果是上级部门
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
						$scope.searchSummaryModel.schoolDivision = school.id;
						$scope.searchSummaryModel.divisionId = school.id;
						$scope.presentLabel = '事业部';
					}
					//如果是大区
					else if(school.isDistrict === true){
						$scope.departmentArea.id = school.id;
						$scope.searchSummaryModel.schoolArea = school.id;
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
									$scope.searchSummaryModel.schoolDivision = department.id;
									$scope.searchSummaryModel.divisionId = department.id;
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
						$scope.searchSummaryModel.schoolRegion = school.id;
						$scope.searchSummaryModel.regionId = school.id;
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
									$scope.searchSummaryModel.schoolArea = department.id;
									$scope.searchSummaryModel.districtId = department.id;
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
													$scope.searchSummaryModel.schoolDivision = department.id;
													$scope.searchSummaryModel.divisionId = department.id;
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
						$scope.searchSummaryModel.schoolId = school.id;
						$scope.searchModel.schoolType = new String(school.schoolNature).toString();
						$scope.departmentArea.id = school.district;
						$scope.searchSummaryModel.schoolArea = school.district;
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
									$scope.searchSummaryModel.divisionId = department.id;
									$scope.searchSummaryModel.schoolDivision = department.id;
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
									$scope.searchSummaryModel.schoolRegion = department.id;
									$scope.searchSummaryModel.regionId = department.id;
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
		 * 获取操作用户信息和大区信息
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
		 * 获取年级列表
		 */
		function getAllGrades(schoolId){
			var promise = CommonService.getGradeIdSelect();
            promise.then(function(result) {
                $scope.grades = result.data;
            });
		}
		/**
		 * 获取科目列表
		 */
		function getAllSubjects(schoolId){
			var promise = CommonService.getSubjectIdSelect();
            promise.then(function(result) {
                $scope.subjects = result.data;
            });
		}
		/**
		 * 重置统计筛选条件
		 */
		function resetSearch() {
			$scope.searchModel = {};
			$scope.departmentArea = {};
			getLoginUserInfo();
		}
		/**
         * 日期格式转换
         */
        function DateToStr(date){
            date = new Date(date);
            var year = date.getFullYear();
            var month = pattern(date.getMonth()+1);
            var day = pattern(date.getDate());
            var hour = pattern(date.getHours());
            var min = pattern(date.getMinutes());
            var sec = pattern(date.getSeconds());
            var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
            return dateStr;
            
            function pattern(str){
                str = new String(str);
                if(str.length < 2)
                    return "0" + str;
                else
                    return str;
            }
        }
		
		/***                                                                                        ***/
		/**********************************************统计部分*****************************************/
		/***                                                                                       ***/
		/**
		 * 根据列表状态获取教师日数据
		 */
		function getStatistics(tableState) {
			//设置表格状态和分页信息
			$scope.statisticsTableState = tableState;
			$scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchModel.start = $scope.start;
            $scope.searchModel.size = $scope.number;
            // 得到当前用户的岗位信息
            judgeIsXueXiAndYunYing();
            //传入校区信息
            if($scope.departmentArea.id != null){
            	$scope.searchModel.districtId = $scope.departmentArea.id;
            }else{
            	$scope.searchModel.districtId = null;
            }
            if($scope.departmentRegion.id != null){
            	$scope.searchModel.regionId = $scope.departmentRegion.id;
            }else{
            	$scope.searchModel.regionId = null;
            }
            //条件查询设置
            if(tableState.sort.predicate){
            	if(tableState.sort.reverse === true){
            		$scope.searchModel.customCondition = 'ORDER BY ' + tableState.sort.predicate + ' DESC';
            	}else{
            		$scope.searchModel.customCondition = 'ORDER BY ' + tableState.sort.predicate;
            	}
            }else{
            	$scope.searchModel.customCondition = 'ORDER BY a.created_at DESC';
            }
            if($scope.currentTab===1){
            	$scope.searchModel.commentType = 'D2';
            }else if($scope.currentTab===2){
            	$scope.searchModel.commentType = 'M2';
            }else if($scope.currentTab===3){
            	$scope.searchModel.commentType = 'D2';
            }
            BiLearningCommentService.getPageList($scope.searchModel)
	        	.then(function (result) {
	                $scope.statisticsModels = result.data.list;
	                tableState.pagination.numberOfPages = result.numberOfPages;
	                angular.forEach($scope.statisticsModels, function(data, index){
	                	data.createdAt = DateToStr(data.createdAt);
	                	if(data.knowledgeMasterGrade === 0){
	                		data.knowledgeMasterGrade = '否';
	                	}else{
	                		data.knowledgeMasterGrade = '是';
	                	}
	                	if(data.summaryPlanGrade === 0){
	                		data.summaryPlanGrade = '否';
	                	}else{
	                		data.summaryPlanGrade = '是';
	                	}
	                	if(data.lessonPreparationGrade <= 3){
	                		data.showOperate = true;
	                		if(data.state == 1){
	                		}else{
	                			data.state = 0;
	                		}
	                	}else{
	                		data.showOperate = false;
	                	}
	                });
	                $scope.isLoading = false;
	            });
		}
		/**
		 * 根据筛选条件获取统计数据
		 */
		function getStatisticsByFilter() {
			//设置表格状态和分页信息
			$scope.isLoading = true;
			$scope.statisticsTableState.pagination.start=0;
            $scope.pagination = $scope.statisticsTableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			$scope.searchModel.start = $scope.start;
	        $scope.searchModel.size = $scope.number;
	        //传入校区信息
	        if($scope.departmentArea.id != null){
            	$scope.searchModel.districtId = $scope.departmentArea.id;
            }else{
            	$scope.searchModel.districtId = null;
            }
            if($scope.departmentRegion.id != null){
            	$scope.searchModel.regionId = $scope.departmentRegion.id;
            }else{
            	$scope.searchModel.regionId = null;
            }
            //条件查询设置
            if($scope.statisticsTableState.sort.predicate){
            	if($scope.statisticsTableState.sort.reverse === true){
            		$scope.searchModel.customCondition = 'ORDER BY ' + $scope.statisticsTableState.sort.predicate + ' DESC';
            	}else{
            		$scope.searchModel.customCondition = 'ORDER BY ' + $scope.statisticsTableState.sort.predicate;
            	}
            }else{
            	$scope.searchModel.customCondition = 'ORDER BY a.created_at DESC';
            }
            if($scope.currentTab===1){
            	$scope.searchModel.commentType = 'D2';
            }else if($scope.currentTab===2){
            	$scope.searchModel.commentType = 'M2';
            }else if($scope.currentTab===3){
            	$scope.searchModel.commentType = 'D2';
            }
            BiLearningCommentService.getPageList($scope.searchModel)
	        	.then(function (result) {
	                $scope.statisticsModels = result.data.list;
	                $scope.statisticsTableState.pagination.numberOfPages = result.numberOfPages;
	                angular.forEach($scope.statisticsModels, function(data, index){
	                	data.createdAt = DateToStr(data.createdAt);
	                	if(data.knowledgeMasterGrade === 0){
	                		data.knowledgeMasterGrade = '否';
	                	}else{
	                		data.knowledgeMasterGrade = '是';
	                	}
	                	if(data.summaryPlanGrade === 0){
	                		data.summaryPlanGrade = '否';
	                	}else{
	                		data.summaryPlanGrade = '是';
	                	}
	                	if(data.lessonPreparationGrade <= 3){
	                		data.showOperate = true;
	                		if(data.state == 1){
	                		}else{
	                			data.state = 0;
	                		}
	                	}else{
	                		data.showOperate = false;
	                	}
	                });
	                $scope.isLoading = false;
	            });
		}
		/**
		 * 查询所有统计数据
		 */
		function getStatisticsAll() {
			$scope.canExportStatistics = false;  //数据准备好之前不可导出
			if ($scope.statisticsTableState.pagination.numberOfPages > 300) {
				SweetAlert.swal("导出数据大于3000条，请加入筛选条件！", "请重试", "error");
				$scope.canExportStatistics = true;
				return;
			}
			//传入校区信息
            if($scope.departmentArea.id != null){
            	$scope.searchModel.districtId = $scope.departmentArea.id;
            }
            if($scope.departmentRegion.id != null){
            	$scope.searchModel.regionId = $scope.departmentRegion.id;
            }
			if($scope.currentTab===1){
            	$scope.searchModel.commentType = 'D2';
            }else if($scope.currentTab===2){
            	$scope.searchModel.commentType = 'M2';
            }else if($scope.currentTab===3){
            	$scope.searchModel.commentType = 'D2';
            }
			BiLearningCommentService.getAllList($scope.searchModel)
				.then(function (result) {
					$scope.statisticsModelsAll = result.data;
					angular.forEach($scope.statisticsModelsAll, function(data, index){
						data.createdAt = DateToStr(data.createdAt);
						if(data.knowledgeMasterGrade === 0){
	                		data.knowledgeMasterGrade = '否';
	                	}else{
	                		data.knowledgeMasterGrade = '是';
	                	}
	                	if(data.summaryPlanGrade === 0){
	                		data.summaryPlanGrade = '否';
	                	}else{
	                		data.summaryPlanGrade = '是';
	                	}
	                	if(data.lessonPreparationGrade <= 3){
	                		data.showOperate = true;
	                		if(data.state == 1){
	                		}else{
	                			data.state = 0;
	                		}
	                	}else{
	                		data.showOperate = false;
	                	}
					});
					$scope.canExportStatistics = true;
					exportStatisticsToExcel();
				});
		}
		/**
		 * 导出明细excel
		 */
		function exportStatisticsToExcel(){
			var statisticsExportTableStyle = {
					sheetid: '评价明细',
					headers: true,
					caption: {
						title:'评价明细数据',
					},
					column: {style:'font-size:14px; text-align:left;'},
					columns: [
					          {columnid:'schoolDivision',title: '事业部',width: '100px'},
					          {columnid:'districtName',title: '大区',width: '100px'},
					          {columnid:'schoolRegion',title: '区域',width: '100px'},
					          {columnid:'schoolName',title: '校区',width: '100px'},
					          {columnid:'teacherName',title: '学管姓名'},
					          {columnid:'studentName', title: '学生姓名'},
					          {columnid:'lessonPreparationGrade',title: '综合评分'},
					          {columnid:'recommendation',title: '学员建议'},
					          {columnid:'createdAt',title: '评价时间'}
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
		    alasql('SELECT * INTO XLS("评价明细数据.xls", ?) FROM ?', [statisticsExportTableStyle, $scope.statisticsModelsAll]);
		}
		
		/***                                                                                        ***/
		/**********************************************汇总部分*****************************************/
		/***                                                                                       ***/
		/**
		 * 根据列表状态获取统计数据
		 */
		function getSummary(tableState) {
			//设置表格状态和分页信息
			$scope.summaryTableState = tableState;
			$scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            
            if($scope.canQueryChildDivisions && $scope.viewDivision){
            	$scope.searchSummaryModel.statType = 'National';
            }else if($scope.canQueryChildDistricts && $scope.viewDistrict){
            	$scope.searchSummaryModel.statType = 'District';
            }else if($scope.canQueryChildRegions && $scope.viewRegion){
            	$scope.searchSummaryModel.statType = 'Region';
            }else if($scope.canQueryChildSchools && $scope.viewSchool){
            	$scope.searchSummaryModel.statType = 'School';
            }else if($scope.viewTeacher){
            	$scope.searchSummaryModel.statType = 'Teacher';
            }
            BiLearningCommentService.getSummaryPageList($scope.searchSummaryModel)
	        	.then(function (result) {
	                $scope.summaryModels = result.data.list;
	                angular.forEach($scope.summaryModels, function(data, index){
	                	if(data.averageGrade != null){
	                		data.createdAt = DateToStr(data.createdAt);
	                		data.averageGrade = data.averageGrade.toFixed(2);
	                		data.satisfiedGrade = (data.satisfiedGrade*100).toFixed(2) + '%';
	                		data.improvementGrade = (data.improvementGrade*100).toFixed(2) + '%';
	                		data.feedBackGrade = (data.feedBackGrade*100).toFixed(2) + '%';
	                	}
	                });
	                $scope.summaryTableState.pagination.numberOfPages = result.numberOfPages;
	                $scope.isLoading = false;
	            });
			BiLearningCommentService.getComments($scope.searchSummaryModel)
	        	.then(function (result) {
	                $scope.presentTotal = {};
	                $scope.presentTotal.averageGrade = result.data.averageGrade.toFixed(2);
	                $scope.presentTotal.satisfiedGrade = (result.data.satisfiedGrade*100).toFixed(2) + '%';
	                $scope.presentTotal.improvementGrade = (result.data.improvementGrade*100).toFixed(2) + '%';
	                $scope.presentTotal.courseCount = result.data.courseCount;
	                $scope.presentTotal.commentCount = result.data.commentCount;
	                $scope.presentTotal.feedBackGrade = (result.data.feedBackGrade*100).toFixed(2) + '%';
	            });
		}
		/**
		 * 获取全部的汇总数据
		 */
		function getSummaryAll() {
			$scope.canExportStatistics = false;  //数据准备好之前不可导出
			if($scope.summaryTableState.pagination.numberOfPages > 300){
				SweetAlert.swal("导出数据大于3000条，请加入筛选条件！", "请重试", "error");
				$scope.canExportStatistics = true;
				return;
			}
			$scope.isLoading = true;
            if($scope.canQueryChildDivisions && $scope.viewDivision){
            	$scope.searchSummaryModel.statType = 'National';
            }else if($scope.canQueryChildDistricts && $scope.viewDistrict){
            	$scope.searchSummaryModel.statType = 'District';
            }else if($scope.canQueryChildRegions && $scope.viewRegion){
            	$scope.searchSummaryModel.statType = 'Region';
            }else if($scope.canQueryChildSchools && $scope.viewSchool){
            	$scope.searchSummaryModel.statType = 'School';
            }else if($scope.viewTeacher){
            	$scope.searchSummaryModel.statType = 'Teacher';
            }
            BiLearningCommentService.getSummaryAllList($scope.searchSummaryModel)
	        	.then(function (result){
	        		$scope.summaryModelsAll = result.data;
	                angular.forEach($scope.summaryModelsAll, function(data, index){
	                	if(data.averageGrade != null){
	                		data.averageGrade = data.averageGrade.toFixed(2);
	                		data.satisfiedGrade = (data.satisfiedGrade*100).toFixed(2) + '%';
	                		data.improvementGrade = (data.improvementGrade*100).toFixed(2) + '%';
	                		data.feedBackGrade = (data.feedBackGrade*100).toFixed(2) + '%';
	                	}
	                });
	                $scope.isLoading = false;
	                $scope.canExportStatistics = true;
	                exportSummaryToExcel();
	            });
		}
		/**
		 * 汇总数据的导出
		 */
		function exportSummaryToExcel(){
			var summaryExportTableStyle;
			if($scope.viewDivision){
				summaryExportTableStyle = {
			        sheetid: '评价汇总',
			        headers: true,
			        caption: {
			        	title:'评价汇总数据',
			        },
			        column: {style:'font-size:14px; text-align:left;'},
					columns: [{columnid:'schoolDivision',title: '事业部',width: '100px'},
					          {columnid:'averageGrade',title: '月均分'},
					          {columnid:'feedBackGrade',title: '反馈率'}
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
			}else if($scope.viewDistrict){
				summaryExportTableStyle = {
			        sheetid: '评价汇总',
			        headers: true,
			        caption: {
			        	title:'评价汇总数据',
			        },
			        column: {style:'font-size:14px; text-align:left;'},
					columns: [{columnid:'schoolArea',title: '大区',width: '100px'},
					          {columnid:'averageGrade',title: '月均分'},
					          {columnid:'feedBackGrade',title: '反馈率'}
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
			}else if($scope.viewRegion){
				summaryExportTableStyle = {
				        sheetid: '评价汇总',
				        headers: true,
				        caption: {
				        	title:'评价汇总数据',
				        },
				        column: {style:'font-size:14px; text-align:left;'},
						columns: [{columnid:'schoolRegion',title: '区域',width: '100px'},
						          {columnid:'averageGrade',title: '月均分'},
						          {columnid:'feedBackGrade',title: '反馈率'}
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
			}else if($scope.viewSchool){
				summaryExportTableStyle = {
			        sheetid: '评价汇总',
			        headers: true,
			        caption: {
			        	title:'评价汇总数据',
			        },
			        column: {style:'font-size:14px; text-align:left;'},
					columns: [{columnid:'schoolName',title: '校区',width: '100px'},
					          {columnid:'averageGrade',title: '月均分'},
					          {columnid:'feedBackGrade',title: '反馈率'}
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
			}else if($scope.viewTeacher){
				summaryExportTableStyle = {
				        sheetid: '评价汇总',
				        headers: true,
				        caption: {
				        	title:'评价汇总数据',
				        },
				        column: {style:'font-size:14px; text-align:left;'},
				        columns: [{columnid:'teacherName',title: '学管姓名'},
				                  {columnid:'averageGrade',title: '月均分'},
						          {columnid:'feedBackGrade',title: '反馈率'}
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
			}
			alasql('SELECT * INTO XLS("评价汇总数据.xls", ?) FROM ?', [summaryExportTableStyle, $scope.summaryModelsAll]);
		}
		/**
		 * 获取数据的方法
		 */
		function getData(obj){
			BiLearningCommentService.getSummaryPageList(obj)
	        	.then(function (result) {
	                $scope.summaryModels = result.data.list;
	                angular.forEach($scope.summaryModels, function(data, index){
	                	if(data.averageGrade != null){
	                		data.createdAt = DateToStr(data.createdAt);
	                		data.averageGrade = data.averageGrade.toFixed(2);
	                		data.satisfiedGrade = (data.satisfiedGrade*100).toFixed(2) + '%';
	                		data.improvementGrade = (data.improvementGrade*100).toFixed(2) + '%';
	                		data.feedBackGrade = (data.feedBackGrade*100).toFixed(2) + '%';
	                	}
	                });
	                $scope.summaryTableState.pagination.start = 0;
	                $scope.summaryTableState.pagination.numberOfPages = result.numberOfPages;
	                $scope.isLoading = false;
	            });
			BiLearningCommentService.getComments(obj)
	        	.then(function (result) {
	                $scope.presentTotal = {};
	                $scope.presentTotal.averageGrade = result.data.averageGrade.toFixed(2);
	                $scope.presentTotal.satisfiedGrade = (result.data.satisfiedGrade*100).toFixed(2) + '%';
	                $scope.presentTotal.improvementGrade = (result.data.improvementGrade*100).toFixed(2) + '%';
	                $scope.presentTotal.courseCount = result.data.courseCount;
	                $scope.presentTotal.commentCount = result.data.commentCount;
	                $scope.presentTotal.feedBackGrade = (result.data.feedBackGrade*100).toFixed(2) + '%';
	            });
		}
		/**
		 * 展示大区数据
		 */
		function showDistrictDetailView(row){
			$scope.presentLabel = '事业部';
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = true;
			$scope.viewRegion = false;
			$scope.viewSchool = false;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
			$scope.start = 0;
            $scope.number = 10;
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.divisionId = row.divisionId;
            getDistrictsByDivision(row.divisionId);
            $scope.searchSummaryModel.statType = 'District';
            //获取区域列表
            var filter = {};
			filter.parentId = row.districtId;
       	  	filter.pageSize = 0;
       	  	filter.pageNum = 0;
			var promise = DepartmentService.queryAll(filter);
			promise.then(function(response){
				if(response.status === "FAILURE"){
					SweetAlert.swal( response.data, "请重试", "error");
				}
				else{
					$scope.regions = response.data;
				}
			},function(error){
				SweetAlert.swal("获取区域列表失败", "请重试", "error");
			});
			//获取区域数据
			getData($scope.searchSummaryModel);
		}
		/**
		 * 展示区域数据
		 */
		function showRegionDetailView(row){
			$scope.presentLabel = '大区';
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = false;
			$scope.viewRegion = true;
			$scope.viewSchool = false;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
			$scope.start = 0;
            $scope.number = 10;
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.divisionId = row.divisionId;
            $scope.searchSummaryModel.districtId = row.districtId;
            getRegionByDistrict(row.districtId);
            $scope.searchSummaryModel.statType = 'Region';
            //根据区域获取校区列表
            var filter = {};
			filter.parentId = row.regionId;
       	  	filter.pageSize = 0;
       	  	filter.pageNum = 0;
			var promise = DepartmentService.queryAll(filter);
			promise.then(function(response){
				if(response.status === "FAILURE"){
					SweetAlert.swal( response.data, "请重试", "error");
				}
				else{
					$scope.departmentSchools = response.data;
				}
			},function(error){
				SweetAlert.swal("获取区域列表失败", "请重试", "error");
			});
			//获取校区数据
			getData($scope.searchSummaryModel);
		}
		/**
		 * 展示校区数据
		 */
		function showSchoolDetailView(row){
			$scope.presentLabel = '区域';
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = false;
			$scope.viewRegion = false;
			$scope.viewSchool = true;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
			$scope.start = 0;
            $scope.number = 10;
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.divisionId = row.divisionId;
            $scope.searchSummaryModel.districtId = row.districtId;
            $scope.searchSummaryModel.regionId = row.regionId;
            getSchoolsByArea(row.regionId);
            $scope.searchSummaryModel.statType = 'School';
			//获取校区老师数据
            getData($scope.searchSummaryModel);
		}
		/**
		 * 展示教师数据
		 */
		function showTeacherDetailView(row){
			$scope.presentLabel = '校区';
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = false;
			$scope.viewRegion = false;
			$scope.viewSchool = false;
			$scope.viewTeacher = true;
			$scope.isLoading = true;
			$scope.start = 0;
            $scope.number = 10;
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.divisionId = row.divisionId;
            $scope.searchSummaryModel.districtId = row.districtId;
            $scope.searchSummaryModel.regionId = row.regionId;
            $scope.searchSummaryModel.schoolId = row.schoolId;
            $scope.searchSummaryModel.statType = 'Teacher';
			//获取校区老师数据
            getData($scope.searchSummaryModel);
		}
		/**
		 * 返回全国列表
		 */
		function backDivisionList(){
			$scope.presentLabel = '全国';
			$scope.canExportStatistics = false;
			$scope.canExportStatistics = false;
			$scope.viewDivision = true;
			$scope.viewDistrict = false;
			$scope.viewRegion = false;
			$scope.viewSchool = false;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
            $scope.start = 0;
            $scope.number = 10;
            $scope.searchSummaryModel = {};
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.statType = 'National';
            getData($scope.searchSummaryModel);
		}
		/**
		 * 返回大区列表
		 */
		function backDistrictList(){
			$scope.presentLabel = '事业部';
			$scope.canExportStatistics = false;
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = true;
			$scope.viewRegion = false;
			$scope.viewSchool = false;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
            $scope.start = 0;
            $scope.number = 10;
            var divisionId = $scope.searchSummaryModel.divisionId;
            $scope.searchSummaryModel = {};
            $scope.searchSummaryModel.divisionId = divisionId;
            getDistrictsByDivision(divisionId);
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.statType = 'District';
            getData($scope.searchSummaryModel);
		}
		/**
		 * 返回区域列表
		 */
		function backRegionList(){
			$scope.presentLabel = '大区';
			$scope.canExportStatistics = false;
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = false;
			$scope.viewRegion = true;
			$scope.viewSchool = false;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
            $scope.start = 0;
            $scope.number = 10;
            var divisionId = $scope.searchSummaryModel.divisionId;
            var districtId = $scope.searchSummaryModel.districtId;
            $scope.searchSummaryModel = {};
            $scope.searchSummaryModel.divisionId = divisionId;
            $scope.searchSummaryModel.districtId = districtId;
            getRegionByDistrict(districtId);
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.statType = 'Region';
            getData($scope.searchSummaryModel);
		}
		/**
		 * 返回校区列表
		 */
		function backSchoolList(){
			$scope.presentLabel = '区域';
			$scope.canExportStatistics = false;
			$scope.canExportStatistics = false;
			$scope.viewDivision = false;
			$scope.viewDistrict = false;
			$scope.viewRegion = false;
			$scope.viewSchool = true;
			$scope.viewTeacher = false;
			$scope.isLoading = true;
            $scope.start = 0;
            $scope.number = 10;
            var divisionId = $scope.searchSummaryModel.divisionId;
            var districtId = $scope.searchSummaryModel.districtId;
            var regionId = $scope.searchSummaryModel.regionId;
            $scope.searchSummaryModel = {};
            $scope.searchSummaryModel.divisionId = divisionId;
            $scope.searchSummaryModel.districtId = districtId;
            $scope.searchSummaryModel.regionId = regionId;
            getSchoolsByArea(regionId);
            $scope.searchSummaryModel.start = $scope.start;
            $scope.searchSummaryModel.size = $scope.number;
            $scope.searchSummaryModel.statType = 'School';
            getData($scope.searchSummaryModel);
		}
		
		//判断当前用户是否为校长
		function judgeIsSchoolMaster(){
			var temp = localStorageService.get('position_id');
            if(temp === 79 || temp === 51){
            	$scope.isSchoolMaster = true;
            }else{
            	$scope.isSchoolMaster = false;
            }
        }
		// 判断当前用户是否为学习顾问或运营主管
		function judgeIsXueXiAndYunYing(){
			var temp = localStorageService.get('position_id');
			if(temp === 87 || temp === 86){
	            $scope.isXueXiAndYunYing = true;
            }else{
            	$scope.isXueXiAndYunYing = false;
            }
		}
		/**
		 * 显示添加沟通记录
		 */
		function showCommunicationDialog(row){
	    	var title = "添加沟通记录";
	    	$scope.modalTitle = title;
	    	$scope.rowDetail = row;
	    	// 记录该记录的旧的状态
	    	$scope.rowOldState = row.state 
	    	if(row.state == 1){
	    		$scope.rowDetail.isChecked = true;
	    		$scope.rowDetail.isDisabled = true;
	    	}else{
	    		$scope.rowDetail.isChecked = false;
	    		$scope.rowDetail.isDisabled = false;
	    	}
	        $scope.addModal = $modal({scope: $scope, templateUrl: 'partials/bi/biLearningComment/editCommunication.html', show: true,backdrop:'static'});
		}
		
		function cancle(row){
			//切回到原有的状态，将对话框关闭
			$scope.rowDetail.state = $scope.rowOldState;
			$scope.addModal.hide();
		}
		
		function viewCommunicationDialog(row){
			var title = "查看沟通记录";
	    	$scope.modalTitleView = title;
	    	$scope.rowView = row;
	    	if(row.state == 1){
	    		$scope.rowView.isChecked = true;
	    	}else{
	    		$scope.rowView.isChecked = false;
	    	}
	    	$scope.addModalView = $modal({scope: $scope, templateUrl: 'partials/bi/biLearningComment/viewCommunication.html', show: true,backdrop:'static'});
		}
		
		/**
		 * 更新沟通记录内容
		 */
		function updateCommuincation(row){
			$scope.communicationVo.id = row.id;
			if($scope.rowDetail.state){
				$scope.communicationVo.state = "1";
			}else{
				$scope.communicationVo.state = "0";
			}
			$scope.communicationVo.communicate_result = row.communicate_result;
			$scope.communicationVo.communicate_content = row.communicate_content;
			var promise = BiStudentTeacherCommunicationService.updateStudentTeacherCommunication($scope.communicationVo);
			promise.then(function(response){
				if(response.status === "FAILURE"){
					SweetAlert.swal( response.data, "请重试", "error");
				}else{
					SweetAlert.swal("更新成功");
					$scope.addModal.hide();
					// 重新执行下查询的方法
					getStatisticsByFilter();
				}
			},function(error){
				SweetAlert.swal("更新评价信息失败", "请重试", "error");
			});	
		}
	}
]);