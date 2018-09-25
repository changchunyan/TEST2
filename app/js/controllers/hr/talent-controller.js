'use strict';

/**
 * The talent manage controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('TalentManagementController', [
	'$scope', '$modal', '$filter', '$rootScope','$routeParams', 'SweetAlert', 'TalentService', 'RecruitmentManagementService', 'DepartmentService', 'PositionService', 'AuthenticationService','fileReader','config','EmployeeService',
	function($scope, $modal, $filter, $rootScope, $routeParams,SweetAlert, TalentService, RecruitmentManagementService, DepartmentService, PositionService, AuthenticationService, fileReader, config,EmployeeService) {

		//常规方法声明
		$scope.getAllDepartments = getAllDepartments;
		$scope.showSelectDepartment = showSelectDepartment;
		$scope.selectDepartment = selectDepartment;
		$scope.departmentSelected = departmentSelected;
		$scope.getPositions = getPositions;
		$scope.reset = reset;
		$scope.showAddView = showAddView;
		$scope.hideAddView = hideAddView;
		$scope.showEditView = showEditView;
		$scope.hideEditView = hideEditView;
		$scope.showDetailView = showDetailView;
		$scope.hideDetailView = hideDetailView;
		$scope.showTransferView = showTransferView;
		$scope.hideTransferView = hideTransferView;
		$scope.saveTalent = saveTalent;
		$scope.getTalentsByFilter = getTalentsByFilter;
		$scope.removeTalent = removeTalent;
		$scope.saveTransferTalent = saveTransferTalent;
		$scope.fileUpload = fileUpload;
		$scope.imageUpload = imageUpload;
		$scope.showTalentView = showTalentView;
		$scope.getTalentReserveList = getTalentReserveList;
		$scope.getTalentRequiredList = getTalentRequiredList;
		$scope.addNewTalent = addNewTalent;
		$scope.addWorkHistory = addWorkHistory;
		$scope.checkIsExit = checkIsExit;
		$scope.download = download;
		$scope.downloadHistory = downloadHistory;
		$scope.checkPermision = checkPermision;
		$scope.showInfoView = showInfoView;
		$scope.hideInfoView = hideInfoView;
		$scope.getTeachingCharacteristic = getTeachingCharacteristic;
		$scope.talentToEmployee = talentToEmployee;
		$scope.hideEmployeeEditView = hideEmployeeEditView;
		$scope.getAllProvince = getAllProvince;
		$scope.getCityByProvince= getCityByProvince;
		$scope.getAreaByCity = getAreaByCity;
		$scope.getGrade = getGrade;
		$scope.getIdentityType = getIdentityType;
		$scope.getRecruitmentPoints = getRecruitmentPoints;
		$scope.getAllDictData = getAllDictData;
		$scope.dateFormat = dateFormat;
		$scope.getRecruitmentNeed = getRecruitmentNeed;

		//时间轴方法声明
		$scope.addSchedule = addSchedule;
		$scope.deleteSchedule = deleteSchedule;
		$scope.updateSchedule = updateSchedule;

		//参数初始化
		$scope.hrTalent={};
		$scope.hrTalent.department={};
		$scope.hrTalent.department_needs={};
		$scope.searchTalent = {};
		$scope.reserve = {};
		$scope.required = {};
		$scope.visitFilter = {};
		$scope.hrTalent.historyTalents = {};
		$scope.hrTalent.newHistoryTalent = {};
		$scope.employee = {};
		$scope.filter = {};
		$scope.filter.department = {};

		//页面进来时调用的方法
		$scope.getAllDepartments();
		$scope.showTalentView();
		$scope.getTeachingCharacteristic();
		$scope.getAllProvince();
		$scope.getGrade();
		$scope.getIdentityType();
		$scope.getRecruitmentPoints();
		$scope.getAllDictData();
		
		/**
		 * 导出招聘汇总数据
		 */
		$scope.exportTeamDataToExcel = function(){
			var promise = TalentService.getTeamDataByFilter($scope.filter2, 0, 0);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    $scope.listModels = response.data;
                    angular.forEach($scope.listModels, function(p,index){
                    	p.index = index+1;
                    });
                    $scope.doExportTeamData();
                }
            });
		}
		
		$scope.doExportTeamData = function(){
			var titleName = "查询条件：";
			var exportTableStyle = {
					sheetid: titleName,
					headers: true,
					//caption: {title: titleName + searchCondition, style:'height:30px;'},
					column: {style:'font-size:16px; text-align:left;'},
					columns: [
					          {columnid:'index',title: '序号'},
					          {columnid:'deptName',title: '部门名称'},
					          {columnid:'parentDeptName',title: '上级部门名称'},
					          {columnid:'t_firstInterviewCount',title: '初试(教师)'},
					          {columnid:'nt_firstInterviewCount',title: '初试(非教师)'},
					          {columnid:'t_secondInterviewCount', title: '复试(教师)'},
					          {columnid:'nt_secondInterviewCount',title: '复试(非教师)'},
					          {columnid:'t_trainingCount',title: '参培(教师)'},
					          {columnid:'nt_trainingCount',title: '参培(非教师)'},
					          {columnid:'t_enrollingCount',title: '入职(教师)'},
					          {columnid:'nt_enrollingCount',title: '入职(非教师)'},
					          {columnid:'t_resignCount',title: '离职(教师)'},
					          {columnid:'nt_resignCount',title: '离职(教师)'},
					         ],
		          row: {
		        	  style: function(sheet, row, rowidx){
		        		  return 'background:'+(rowidx%2?'#FFFFFF':'#A1C1FB');
		        	  }
		          },
		          cells: {
		        	  style: 'font-size:13px; text-align:left;'
		          }
			};
			alasql('SELECT * INTO XLS("招聘数据汇总统计.xls", ?) FROM ?', [exportTableStyle, $scope.listModels]);
        }
		
		$scope.reset3 = function(){
			$scope.filter = {};
			$scope.filter.department = {};
		}
		
		$scope.getPersonalDataByFilter = function(){
			if($scope.filter.channel1 && $scope.filter.channel1.name == "其他"){
				$scope.filter.channel2 = undefined;
				$scope.filter.channel3 = undefined;
			}
			$scope.isLoading = true;
            $scope.pagination = $scope.personalTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            $scope.filter2 = angular.copy($scope.filter);
            if($scope.filter2.channel1){
            	$scope.filter2.channel1 = $scope.filter2.channel1.name; 
            }
            if($scope.filter2.channel2){
            	$scope.filter2.channel2 = $scope.filter2.channel2.name; 
            }
            if($scope.filter2.channel3){
            	$scope.filter2.channel3 = $scope.filter2.channel3.name; 
            }
            if($scope.filter2.department && $scope.filter2.department != ""){
            	$scope.filter2.department = $scope.filter2.department.id;
            }
            var promise = TalentService.getPersonalDataByFilter($scope.filter2,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    $scope.personalTableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.recruitmentPersonalData = data.data;
                }
            });
		}
		
		$scope.getTeamDataByFilter = function(){
			if($scope.filter.channel1 && $scope.filter.channel1.name == "其他"){
				$scope.filter.channel2 = undefined;
				$scope.filter.channel3 = undefined;
			}
            $scope.isLoading = true;
            $scope.pagination = $scope.teamTableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            $scope.filter2 = angular.copy($scope.filter);
            if($scope.filter2.channel1){
            	$scope.filter2.channel1 = $scope.filter2.channel1.name; 
            }
            if($scope.filter2.channel2){
            	$scope.filter2.channel2 = $scope.filter2.channel2.name; 
            }
            if($scope.filter2.channel3){
            	$scope.filter2.channel3 = $scope.filter2.channel3.name; 
            }
            if($scope.filter2.department && $scope.filter2.department != ""){
            	$scope.filter2.department = $scope.filter2.department.id;
            }
            var promise = TalentService.getTeamDataByFilter($scope.filter2,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    $scope.teamTableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.recruitmentTeamData = data.data;
                }
            });
		}
		
		$scope.getTeamData = function(tableState){
			$scope.teamTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            $scope.filter2 = {};
            var promise = TalentService.getTeamDataByFilter($scope.filter2 ,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.recruitmentTeamData = data.data;
                }
            });
		}
		
		$scope.getPersonalData = function(tableState){
			$scope.personalTableState = tableState;
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            $scope.filter2 = {};
            var promise = TalentService.getPersonalDataByFilter($scope.filter2 ,$scope.start,$scope.number);
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal(response.data,"请重试","error");
                }
                else{
                    var data = {};
                    data.data = response.data.list;
                    data.numberOfPages = response.data.pages;
                    tableState.pagination.numberOfPages = data.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                    $scope.recruitmentPersonalData = data.data;
                }
            });
		}

		$scope.showVisitModal = function(){
			$scope.visitModalTitle = '查看邀约诺访列表';
			$scope.visitModal = $modal({scope:$scope, templateUrl:'partials/hr/talent/modal.invitationVisitManagement.html', show:true, backdrop:"static"});
		}

		/**
		 * 根据人才应聘部门岗位，确定是否有对应的招聘需求
		 * @param departmentId
		 * @param positionId
		 */
		function getRecruitmentNeed(departmentId, positionId){
			$scope.hrTalent.showRecruitmentNeed = false;
			var promise = TalentService.getRecruitmentNeed(departmentId, positionId);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var data = response.data;
					if(data == null){
						$scope.hrTalent.showRecruitmentNeed = false;
						$scope.hrTalent.recruitment = undefined;
					}
					else{
						$scope.hrTalent.showRecruitmentNeed = true;
						$scope.hrTalent.recruitmentList = data;
						if($scope.hrTalent.recruitment_id){
							angular.forEach($scope.hrTalent.recruitmentList, function(p,index){
								if(p.id == $scope.hrTalent.recruitment_id){
									$scope.hrTalent.recruitment = p;
									return;
								}
							});
						}
					}
				}
			},function(error){

			});
		}

		/**
		 * 获取所有字典数据
		 */
		function getAllDictData(){
			var promise = EmployeeService.getAllDictData();
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
		 * 获取所有招聘流程节点
		 */
		function getRecruitmentPoints(){
			var promise = RecruitmentManagementService.getRecruitmentPoints()
				.then(function(response) {
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
					}
					else{
						$scope.allRecruitmentPoints = response.data;
						$scope.initRecruitmentPoints = [];
						$scope.initRecruitmentPointsRequired = [];
						angular.forEach($scope.allRecruitmentPoints,function(p,index){
							if(p.name != "简历初选" && p.name !="待入职" && p.name !="转让" && p.name !="已入职"){
								$scope.initRecruitmentPoints.push(p);
							}
							if(p.name != "简历初选" && p.name !="转让"  && p.name !="已入职"){
								$scope.initRecruitmentPointsRequired.push(p);
							}
						});
					}
				}, function(error) {
					SweetAlert.swal('获取招聘流程失败', '请重试', 'error');
				}
			);
		}

		/**
		 * 获取认证证件类型
		 */
		function getIdentityType(){
			var promise = TalentService.getIdentityType();
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.identityTypes = response.data;
				}
			},function(error){
				SweetAlert.swal("获取证件类型失败","请重试","error");
			});
		}

		/**
		 * 获取年级段信息
		 */
		function getGrade(){
			var promise = TalentService.getGrade();
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.grades = response.data;
				}
			},function(error){
				SweetAlert.swal("获取年级段失败","请重试","error");
			});
		}
		/**
		 * 获取所有省份
		 */
		function getAllProvince(){
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
		 * @param pcode province code
		 */
		function getCityByProvince(pcode){
			if(pcode == null){
				$scope.cities = null;
			}
			else{
				var promise = DepartmentService.getCityByProvince(pcode);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
						return false;
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
		 * 根据市code获取县
		 * @param ccode city code
		 */
		function getAreaByCity(ccode){
			if(ccode == null){
				$scope.areas = null;
			}
			else{
				var promise = DepartmentService.getAreaByCity(ccode);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
					}
					else{
						$scope.areas = response.data;
					}
				},function(error){
					SweetAlert.swal("获取地区列表失败","请重试","error");
				});
			}
		}

		/**
		 * 置当前人才信息为历史，增加新的人才信息
		 */
		function addNewTalent(){
			var arr = [];
			var obj = new Object();
			if ($scope.hrTalent.resume_resource == '1'){
				obj.resume_resource = "对方投递";
			}
			else if ($scope.hrTalent.resume_resource == '2'){
				obj.resume_resource = "主动搜索";
			}
			else if ($scope.hrTalent.resume_resource == '3'){
				obj.resume_resource = "直接到访";
			}
			obj.talent_id = $scope.hrTalent.id;
			angular.forEach($scope.hrTalent.recruitmentSchedule, function(p, index){
				$scope.hrTalent.recruitmentSchedule[index].talentId = $scope.hrTalent.id;
				$scope.hrTalent.recruitmentSchedule[index].status = 0;
			})
			obj.recruitmentSchedule = $scope.hrTalent.recruitmentSchedule;
			obj.historyDepartment = $scope.hrTalent.department;
			obj.historyPosition = $scope.hrTalent.position;
			obj.recruitment_channel_level_one = $scope.hrTalent.channel1.name;
			obj.recruitment_channel_level_two = $scope.hrTalent.channel2.name;
			if ($scope.hrTalent.channel3 != null) {
				obj.recruitment_channel_level_three = $scope.hrTalent.channel3.name;
			}
			obj.meet_degree = $scope.hrTalent.meet_degree;
			obj.resume_name = $scope.hrTalent.resume_name;
			obj.displayFileName = $scope.hrTalent.displayFileName;
			var newTalent = new Object();
			newTalent = angular.copy($scope.hrTalent);
			$scope.hrTalent = {};
			newTalent.resume_resource = $scope.hrTalent.resume_resource;
			newTalent.department = $scope.hrTalent.department;
			newTalent.position = $scope.hrTalent.position;
			newTalent.channel1 = null;
			newTalent.channel2 = null;
			newTalent.channel3 = null;
			newTalent.resume_name = $scope.hrTalent.resume_name;
			newTalent.displayFileName = $scope.hrTalent.displayFileName;
			newTalent.meet_degree = $scope.hrTalent.meet_degree;
			newTalent.recruitmentSchedule = $scope.hrTalent.recruitmentSchedule;
			//强制刷新
			$("#editStar2").raty({
				path: "img/hr",
				score: 0,
				click: function (score, evt) {
					$("#editStar2Value").val(score);
				}
			});
			$scope.hrTalent = newTalent;
			$scope.hrTalent.showRecruitmentNeed = null;
			$scope.hrTalent.newHistoryTalent = obj;
			addSchedule();
		}

		/**
		 * 得到当前用户的组织机构集合
		 */
		function getAllDepartments(){
			var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.departments = response.data;
				}
			}, function(error){
			});
		}

		/**
		 * 展示机构选择弹窗
		 */
		function showSelectDepartment(){
			$scope.modalTitle = '选择机构';
			$scope.modal = $modal({scope:$scope, templateUrl:'partials/hr/department/modal.department.html', show:true, backdrop:"static"});
			$scope.modalDepartments = angular.copy($scope.departments);
		}

		/**
		 * 选中部门
		 */
		function selectDepartment(node){
			$scope.newDepartment = findSelectedDepartment($scope.modalDepartments, node.id);
		}

		/**
		 * 确定选中的部门
		 */
		function departmentSelected(){
			$scope.hrTalent.department = $scope.newDepartment;
			$scope.filter.department = angular.copy($scope.newDepartment);
			$scope.getPositions($scope.newDepartment.id);
			$scope.modal.hide();
		}

		/**
		 * 在组织架构树上点击某一部门时，查找部门其他必要信息
		 * @param departments	all departments
		 * @param id	the selected department id
		 * @returns {boolean}	true if found, false if not found
		 */
		function findSelectedDepartment(departments, id){
			var found = false;
			angular.forEach(departments, function(department){
				if (found){
					return;
				}
				if (department.id == id){
					found = department;
					return;
				}
				found = findSelectedDepartment(department.children, id);
			});
			return found;
		}

		/**
		 * 根据选择的部门查询职位
		 */
		function getPositions(departmentId){
			var promise = PositionService.list(departmentId);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.positions = response.data;
				}
			}, function(error){
			});
		}

		/*
		 * 查询正在招聘的部门
		 */
		function getDepartmentNeeds() {
			var promise_need = RecruitmentManagementService.getDepartmentNeedList(AuthenticationService.currentUser().organization.id);
			promise_need.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.department_needs = response.data;
				}
			}, function(error){
			});
		}

		/**
		 * reset
		 */
		function reset(){
			$scope.hrTalent={};
			$scope.hrTalent.department={};
			$scope.required = {};
			$scope.reserve = {};
			$('#tableStars').raty('score', 0);
			$("#editStarValue").val("");
			$('#tableStarsReserve').raty('score', 0);
			/*			$("#editStarValue").val("");*/
		}

		$scope.reset2 = function(){
			$scope.visitFilter = {};
		}

		/**
		 * 添加人才弹窗
		 */
		function showAddView(){
			$scope.hrTalent={};
			$scope.hrTalent.part_full = 2;//默认全职
			$scope.hrTalent.teaching_achievement = [];
			addSchedule();
			angular.forEach($scope.characteristics, function(p,index){
				p.selected = false;
			})
			//新增人才时，默认的招聘渠道时【社招-招聘网站-自己选】
			$scope.hrTalent.channel1 = $scope.recruitmentChannel[1];
			$scope.hrTalent.channel2 = $scope.recruitmentChannel[1].child[0];		
			//判断当前登录用户所属部门是否为校区，如果是校区，那么添加的人才应聘部门直接填写为校区
			var cUser = AuthenticationService.currentUser();
			if(cUser.school_id && cUser.school_id != 0 && cUser.school_id != -1){
				$scope.newDepartment = findSelectedDepartment($scope.departments, cUser.department_id);
				$scope.hrTalent.department = $scope.newDepartment;
				$scope.getPositions($scope.newDepartment.id);
			}
			$scope.addTabs = [
				{id:1,title:'招聘信息', template: 'partials/hr/talent/recruit-info.html?'+getRandTime()},
				{id:2,title:'基本信息', template: 'partials/hr/talent/basic-info.html?'+getRandTime()},
				{id:3,title:'工作经历', template: 'partials/hr/talent/work-history.html?'+getRandTime()},
				{id:4,title:'应聘意向', template: 'partials/hr/talent/job-intention.html?'+getRandTime()},
				{id:5,title:'认证相关', template: 'partials/hr/talent/confirm.html?'+getRandTime()},
				{id:6,title:'其他', template: 'partials/hr/talent/other.html?'+getRandTime()}
			];
			$scope.addModalTitle = '添加人才';
			$scope.addModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.add.html', show: true,backdrop:"static"});
		}

		/**
		 * Hides the add view.
		 */
		function hideAddView() {
			$scope.addModal.hide();
		}

		/**
		 * 编辑弹窗
		 */
		function showEditView(hrTalent) {
			$scope.previewOperation(hrTalent);
			dateFormat(hrTalent);
			if(hrTalent.recruitment_id){
				//打开编辑页面时，需要去确定选中的需求
				getRecruitmentNeed(hrTalent.department.id, hrTalent.position.id);
			}
			if(hrTalent.province_code != undefined){
				var promise = DepartmentService.getCityByProvince(hrTalent.province_code);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
						return false;
					}
					else{
						$scope.cities = response.data;
					}
				},function(error){
				});
			}
			if(hrTalent.city_code != undefined){
				var promise = DepartmentService.getAreaByCity(hrTalent.city_code);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
						return false;
					}
					else{
						$scope.areas = response.data;
					}
				},function(error){
				});
			}
			var promise = PositionService.list(hrTalent.department_id);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.positions = response.data;
				}
			}, function(error){
			});

			$scope.hrTalent = angular.copy(hrTalent);
			if(!$scope.hrTalent.teaching_achievement){
				var obj = new Object();
				$scope.hrTalent.teaching_achievement = [];
				$scope.hrTalent.teaching_achievement.push(obj);
			}
			//每次要打开编辑界面时，都要判断一下之前配置的教学特点
			$scope.toggleCharacteristic();

			var temp = 'partials/hr/talent/recruit-info.html';
			if($scope.hrTalent.recruitment_status!= undefined && $scope.hrTalent.recruitment_status==0){
				//储备人才
				temp = 'partials/hr/talent/recruit-info-reserve.html';
			}
			$scope.editTabs = [
				{id:1,title:'招聘信息', template: temp},
				{id:2,title:'基本信息', template: 'partials/hr/talent/basic-info.html'},
				{id:3,title:'工作经历', template: 'partials/hr/talent/work-history.html'},
				{id:4,title:'应聘意向', template: 'partials/hr/talent/job-intention.html'},
				{id:5,title:'认证相关', template: 'partials/hr/talent/confirm.html'},
				{id:6,title:'其他', template: 'partials/hr/talent/other.html'},
			];
			$scope.editModalTitle = '修改人才信息';
			$scope.editModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.edit.html', show: true,backdrop:"static"});
		}

		/**
		 * 隐藏编辑弹窗
		 */
		function hideEditView(){
			$scope.hrTalent = {};
			$scope.editModal.hide();
		}

		function hideEmployeeEditView(){
			$scope.employee = {};
			$scope.employeeEditModal.hide();
		}
		/**
		 * 招聘流程弹窗
		 */
		function showDetailView(hrTalent){
			$scope.previewOperation(hrTalent);
			dateFormat(hrTalent);
			$scope.hrTalent = angular.copy(hrTalent);
			$scope.detailModalTitle = '查看招聘记录';
			$scope.detailModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.detail.html', show: true,backdrop:"static"});
		}
		/**
		 * 隐藏招聘流程弹窗
		 */
		function hideDetailView(){
			$scope.hrTalent = {};
			$scope.detailModal.hide();
		}

		$scope.showTransferDepartment = function(){
			//根据当前登录用户，查询所属部门，如果有上级，那么就列出上级的组织架构树，如果本身就是一级部门，就本部门
			var promise = DepartmentService.getParentDepartmentTree();
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.modalDepartments = angular.copy(response.data);
					$scope.modalTitle = '选择要转让的部门';
					$scope.modal = $modal({scope:$scope, templateUrl:'partials/hr/department/modal.department.html', show:true, backdrop:"static"});
				}
			});
		}
		
		/**
		 * 转让人才弹窗
		 */
		function showTransferView(hrTalent) {
			$scope.hrTalent = angular.copy(hrTalent);
			$scope.hrTalent.department = undefined;
			$scope.hrTalent.position = undefined;
			$scope.transferModalTitle = '转让人才';
			$scope.transferModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.transfer.html', show: true,backdrop:"static"});
			//todo
			//根据当前登录用户，查询所属部门，如果有上级，那么就列出上级的组织架构树，如果本身就是一级部门，就本部门
/*			var promise = DepartmentService.getParentDepartmentTree();
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.modalDepartments = angular.copy(response.data);
					$scope.hrTalent = angular.copy(hrTalent);
					$scope.transferModalTitle = '转让人才';
					$scope.transferModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.transfer.html', show: true,backdrop:"static"});
				}
			});*/
			
/*			//并不是当前人才应聘的部门下所有需求岗位，而是所有需求岗位
			var promise = PositionService.list(hrTalent.department_id);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.positions = response.data;
				}
			}, function(error){
			});
			getDepartmentNeeds();*/
			
		}
		/**
		 * 隐藏招聘流程弹窗
		 */
		function hideTransferView(){
			$scope.hrTalent = {};
			$scope.transferModal.hide();
		}

		/**
		 * 保存转让人才信息和招聘流程
		 */
		function saveTransferTalent(){
			if($scope.hrTalent.transferReason && $scope.hrTalent.transferReason.length >　1024){
				SweetAlert.swal("转让理由不能超过1024个字符","请重试","error");
				return false;
			}
			if($scope.hrTalent.showRecruitmentNeed == false){
				$scope.hrTalent.recruitment_id = undefined;
			}
			else if($scope.hrTalent.recruitment){
				$scope.hrTalent.recruitment_id = $scope.hrTalent.recruitment.id;
			}
			var promise = TalentService.update($scope.hrTalent);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					hideTransferView();
					updateSchedule(response.data);
					$scope.reserve = {};
					$scope.required = {};
					$scope.hrTalent = {};
					getTalentsByFilter(0);
					getTalentsByFilter(1);
					SweetAlert.swal('转让成功', '确定', 'success');
				}
			}, function(error) {
				SweetAlert.swal('转让失败', '请重试', 'error');
			});
		}

		/**
		 * 增加或保存人才信息
		 */
		function saveTalent(){
			if($scope.hrTalent.channel1.name == "其他"){
				$scope.hrTalent.channel2 = undefined;
				$scope.hrTalent.channel3 = undefined;
			}
			var reg_num = /^\d+(\.\d+)?$/;
			var reg = /^[\u4E00-\u9FA5]+$/;
			if(!reg.test($scope.hrTalent.name)) {
				SweetAlert.swal('人才姓名必须为汉字', '请重试', 'error');
				return false;
			}
			else if ($("#editStar2Value").val() == "" || $("#editStar2Value").val() == null) {
				SweetAlert.swal('请选择符合程度', '请重试', 'error');
				return false;
			}
			else if ($scope.hrTalent.name == null || $scope.hrTalent.name == "" ) {
				SweetAlert.swal('请填写姓名', '请重试', 'error');
				return false;
			}
			/*			else if ($scope.hrTalent.birthday == null || $scope.hrTalent.birthday == "") {
			 SweetAlert.swal('请选择出生日期', '请重试', 'error');
			 return false;
			 }
			 else if ($scope.hrTalent.gender == null) {
			 SweetAlert.swal('请选择性别', '请重试', 'error');
			 return false;
			 }
			 else if ($scope.hrTalent.mail == null || $scope.hrTalent.mail == "") {
			 SweetAlert.swal('请填写邮箱', '请重试', 'error');
			 return false;
			 }*/
			else if ($scope.hrTalent.tel == null || $scope.hrTalent.tel == "") {
				SweetAlert.swal('请填写手机号', '请重试', 'error');
				return false;
			}
			else if($scope.hrTalent.tel.length != 11 || !$scope.hrTalent.tel.match( $rootScope.reg_mobile )){
				SweetAlert.swal("请输入合法手机号",'请重试','error');
				return false;
			}
			else if ($scope.hrTalent.resume_name == null){
				SweetAlert.swal('请上传简历', '请重试', 'error');
				return false;
			}
			if($scope.hrTalent.hrWorkingExperiences){
				var legal = true;
				angular.forEach($scope.hrTalent.hrWorkingExperiences, function(p,index){
					if(!p.company || p.company.length > 10){
						SweetAlert.swal('工作经历中的公司名不能为空，且长度不超过10个字', '请重试', 'error');
						legal = false;
						return;
					}
					else if(!p.description || p.description.length > 140){
						SweetAlert.swal('工作经历中的工作描述不能为空，且长度不超过140个字', '请重试', 'error');
						legal = false;
						return;
					}
					else if(p.salary && !reg_num.test(p.salary)){
						SweetAlert.swal('工作经历中的工资只能为数字', '请重试', 'error');
						legal = false;
						return;
					}
					else if(!p.entrance_date){
						SweetAlert.swal('工作经历中的入职时间不能为空', '请重试', 'error');
						legal = false;
						return;
					}
					else if(p.up_to_now){
						p.departure_date = undefined;
					}
					else if(p.departure_date){
						var date1 = new Date(p.entrance_date);
						var date2 = new Date(p.departure_date);
						if(date1 > date2){
							SweetAlert.swal('工作经历中的入职时间不能比离职时间晚', '请重试', 'error');
							legal = false;
							return;
						}
					}
				});
				if(legal == false){
					return false;
				}
			}
			$scope.hrTalent.meet_degree = $("#editStar2Value").val();
			if ($scope.hrTalent.educationDegree != null){
				$scope.hrTalent.education_degree = $scope.hrTalent.educationDegree.id;
			}
			if ($scope.hrTalent.educationType != null){
				$scope.hrTalent.education_degree_type = $scope.hrTalent.educationType.id;
			}
			if ($scope.hrTalent.residenceDegree != null){
				$scope.hrTalent.registered_residence_type = $scope.hrTalent.residenceDegree.id;
			}
			if ($scope.hrTalent.resume_name != null && document.getElementById("file").files[0] != null){
				$scope.hrTalent.resume_name = $scope.hrTalent.resume_name.name;
			}
			var fileResume = document.getElementById("file").files[0];		//获取文件对象
			if(fileResume != null){
				$scope.hrTalent.resume_name = fileResume.name;
			}
			if($scope.hrTalent.recruitment != undefined){
				$scope.hrTalent.recruitment_id = $scope.hrTalent.recruitment.id;
			}
			else if($scope.hrTalent.recruitment == undefined){
				$scope.hrTalent.recruitment_id = undefined;
			}
			//身份证
			var imgIdentity = document.getElementById("identity").files[0];
			if(imgIdentity != null){
				$scope.hrTalent.image_identity = imgIdentity.name;
			}
			//教师资格证
			var imgTeacher = document.getElementById("teacher").files[0];
			if(imgTeacher != null){
				$scope.hrTalent.image_teacher = imgTeacher.name;
			}
			//学历认证
			var imgEducation = document.getElementById("education").files[0];
			if(imgEducation != null){
				$scope.hrTalent.image_education = imgEducation.name;
			}
			//专业资格证
			var imgProfessional = document.getElementById("professional").files[0];
			if(imgProfessional != null){
				$scope.hrTalent.image_professional = imgProfessional.name;
			}
			//头像
			var imgProfile = document.getElementById("profile").files[0];
			if(imgProfile != null){
				//var fname = $scope.GetFileNameNoExt(imgProfile.name);
				var fname = encodeURI(imgProfile.name);
				//fname = fname + $scope.getFileExt(imgProfile.name);
				$scope.hrTalent.profile = fname;
			}
			//用了mydate97插件，需要将流程节点时间、到访时间、工作经历中的起止时间转换一下
			angular.forEach($scope.hrTalent.recruitmentSchedule, function(p,index){
				p.scheduleDate = new Date(p.scheduleDate);
				if(p.visitTime != null){
					p.visitTime = new Date(p.visitTime);
				}
			});
			if($scope.hrTalent.historyTalents){
				angular.forEach($scope.hrTalent.historyTalents,function(p){
					angular.forEach(p.recruitmentSchedule,function(q){
						q.scheduleDate = new Date(q.scheduleDate);
						if(q.visitTime != null){
							q.visitTime = new Date(q.visitTime);
						}
					})
				});
			}
			if($scope.hrTalent.newHistoryTalent && $scope.hrTalent.newHistoryTalent.recruitmentSchedule){
				angular.forEach($scope.hrTalent.newHistoryTalent.recruitmentSchedule,function(p, index){
					p.scheduleDate = new Date(p.scheduleDate);
					if(p.visitTime != null){
						p.visitTime = new Date(p.visitTime);
					}
				});
			}
			if($scope.hrTalent.hrWorkingExperiences){
				angular.forEach($scope.hrTalent.hrWorkingExperiences,function(p){
					p.entrance_date = new Date(p.entrance_date);
					if(p.departure_date != null){
						p.departure_date = new Date(p.departure_date);
					}
				});
			}
			if($scope.hrTalent.id == null) {
				var promise = TalentService.add($scope.hrTalent);
				promise.then(function(response) {
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
					}
					else{
						var data = response.data;
						$scope.hrTalent.id = data.id;
						updateSchedule(data);
						fileUpload($scope.hrTalent.resume_name, fileResume, data);//简历
						imageUpload($scope.hrTalent.image_identity, imgIdentity, data);//身份证
						imageUpload($scope.hrTalent.image_teacher, imgTeacher, data);//教师证
						imageUpload($scope.hrTalent.image_education, imgEducation, data);//学位证
						imageUpload($scope.hrTalent.image_professional, imgProfessional, data);//专业资格证
						if(imgProfile){
							imageUpload(imgProfile.name, imgProfile, data);//头像
						}
						//imageUpload($scope.hrTalent.profile, imgProfile, data);//头像
						//在图片预览时候，已经将新增的图片封装在newImgList对象中了

						if($scope.hrTalent.teaching_achievement != undefined){
							angular.forEach($scope.hrTalent.teaching_achievement, function(q){
								if(q.newImgList != undefined){
									angular.forEach(q.newImgList, function(p,index){
										imageUpload(p.name, p, $scope.hrTalent);
									})
								}
							})
						}
						hideAddView();
						$scope.reserve = {};
						$scope.required = {};
						$scope.hrTalent = {};
						//getTalentsByFilter(0);
						//getTalentsByFilter(1);
						SweetAlert.swal('添加成功', 'success');
					}
				}, function(error) {
					SweetAlert.swal('添加失败', '请重试', 'error');
				});
			} else {
				//检查人才进度，是否包含入职节点，如果有入职节点，额外操作
				var isRecruited = false;
				if($scope.hrTalent.recruitmentSchedule){
					angular.forEach($scope.hrTalent.recruitmentSchedule,function(p,index){
						if(p.recruitmentNode.name == "待入职"){
							isRecruited = true;
							return;
						}
					});
				}
				if(isRecruited == true){
					SweetAlert.swal({
						title: "您已经将此人的招聘流程中添加了【待入职】节点，如果确认无误，请点击【保存】按钮。",
						type: "info",
						showCancelButton: true,
						confirmButtonColor: '#DD6B55',
						confirmButtonText: '保存',
						cancelButtonText: '取消',
						closeOnConfirm: true
					}, function(confirm) {
						if (confirm) {
							//先根据人才id去判断是否有对应员工，如果有，就提醒已存在
							//如果没有，就待入职
							var filter = {};
							filter.talentId = $scope.hrTalent.id;
							var promise = EmployeeService.getEmployeesByFilters(filter, 0 , 10);
							promise.then(function(response){
								if(response.status == "FAILURE"){
									hideEditView();
									SweetAlert.swal( response.data,"请重试","error");
									return false;
								}
								else{
									var list = response.data.list;
									if(list.length > 0){
										hideEditView();
										SweetAlert.swal("该人才已经是待入职员工了！", "请重试", "error");
										return false;
									}
									else{
										//将人才信息保存到员工信息表中，置该员工为待入职状态
										talentToEmployee($scope.hrTalent);
										$scope.hrTalent.recruitment_status  = 2;
										fileUpload($scope.hrTalent.resume_name, fileResume, $scope.hrTalent);
										imageUpload($scope.hrTalent.image_identity, imgIdentity, $scope.hrTalent);//身份证
										imageUpload($scope.hrTalent.image_teacher, imgTeacher, $scope.hrTalent);//教师证
										imageUpload($scope.hrTalent.image_education, imgEducation, $scope.hrTalent);//学位证
										imageUpload($scope.hrTalent.image_professional, imgProfessional, $scope.hrTalent);//专业资格证
										if(imgProfile){
											imageUpload(imgProfile.name, imgProfile, $scope.hrTalent);//头像
										}
										//imageUpload($scope.hrTalent.profile, imgProfile, $scope.hrTalent);//头像
										//在图片预览时候，已经将新增的图片封装在newImgList对象中了
										if($scope.hrTalent.teaching_achievement != undefined){
											angular.forEach($scope.hrTalent.teaching_achievement, function(q){
												if(q.newImgList != undefined){
													angular.forEach(q.newImgList, function(p,index){
														imageUpload(p.name, p, $scope.hrTalent);
													})
												}
											})
										}
										var promise = TalentService.update($scope.hrTalent);
										promise.then(function(response) {
											if(response.status == "FAILURE"){
												SweetAlert.swal( response.data,"请重试","error");
											}
											else{
												updateSchedule(response.data);
												$scope.reserve = {};
												$scope.required = {};
												$scope.hrTalent = {};
												//getTalentsByFilter(0);
												//getTalentsByFilter(1);
												SweetAlert.swal('修改成功', '确定','success');
											}
											hideEditView();
										}, function(error) {
											SweetAlert.swal('修改失败', '请重试', 'error');
											hideEditView();
										});
									}
								}
								
							},function(error){
								
							});
							
						}
					});
				}

				else{
					fileUpload($scope.hrTalent.resume_name, fileResume, $scope.hrTalent);
					imageUpload($scope.hrTalent.image_identity, imgIdentity, $scope.hrTalent);//身份证
					imageUpload($scope.hrTalent.image_teacher, imgTeacher, $scope.hrTalent);//教师证
					imageUpload($scope.hrTalent.image_education, imgEducation, $scope.hrTalent);//学位证
					imageUpload($scope.hrTalent.image_professional, imgProfessional, $scope.hrTalent);//专业资格证
					imageUpload($scope.hrTalent.profile, imgProfile, $scope.hrTalent);//头像
					//在图片预览时候，已经将新增的图片封装在newImgList对象中了
					if($scope.hrTalent.teaching_achievement != undefined){
						angular.forEach($scope.hrTalent.teaching_achievement, function(q){
							if(q.newImgList != undefined){
								angular.forEach(q.newImgList, function(p,index){
									imageUpload(p.name, p, $scope.hrTalent);
								})
							}
						})
					}
					var promise = TalentService.update($scope.hrTalent);
					promise.then(function(response) {
						if(response.status == "FAILURE"){
							SweetAlert.swal( response.data,"请重试","error");
						}
						else{
							updateSchedule(response.data);
							$scope.reserve = {};
							$scope.required = {};
							$scope.hrTalent = {};
							/*getTalentsByFilter(0);
							getTalentsByFilter(1);*/
							SweetAlert.swal('修改成功', '确定','success');
						}
						hideEditView();
					}, function(error) {
						SweetAlert.swal('修改失败', '请重试', 'error');
						hideEditView();
					});
				}
			}
		}

		function talentToEmployee(employee) {
			//人才弹框---最上方6个input框
			$scope.employee.user = {};
			$scope.employee.user.name = employee.name;
			$scope.employee.user.email = employee.mail;
			$scope.employee.idNumber = employee.id_number;
			$scope.employee.mobile = employee.tel;
			$scope.employee.birthDate = employee.birthday;
			$scope.employee.user.gender = employee.gender;

			//人才弹框---招聘信息tab
			$scope.employee.department = employee.department;
			$scope.employee.position = employee.position;

			//人才弹框---基本信息tab
			$scope.employee.ethnic = employee.ethnic;
			$scope.employee.teacherGrade = employee.teacher_grade;
			$scope.employee.age = employee.age;
			$scope.employee.highestEducationInstitute = employee.highest_education_institute;
			$scope.employee.major = employee.major;
			$scope.employee.latestEducationStartDate = employee.entrance_date;
			$scope.employee.graduationDate = employee.graduation_date;
			$scope.employee.educationDegree = employee.education_degree;//可能需要转换，这边是1-8
			$scope.employee.educationDegreeType = employee.education_degree_type;//可能需要转换，从1-2
			$scope.employee.registeredResidenceType = employee.registered_residence_type;//需要转换1-3
			$scope.employee.registeredResidence = employee.registered_residence;
			$scope.employee.provinceCode = employee.province_code;
			$scope.employee.cityCode = employee.city_code;
			$scope.employee.areaCode = employee.area_code;
			$scope.employee.address = employee.address;

			//人才弹框---工作经历tab
			$scope.employee.workingExperienceList = employee.hrWorkingExperiences;
			if($scope.employee.workingExperienceList){
				angular.forEach($scope.employee.workingExperienceList, function(p,index){
					p.entrance_date = new Date(p.entrance_date);
					if(p.departure_date != null){
						p.departure_date = new Date(p.departure_date);
					}
				});
			}

			//人才弹框---应聘意向tab，不用保存在员工信息中

			//人才弹框---认证相关tab
			//图片要重新上传。因为空间不一样了。HR-IMG{talentId}变为HR-IMG{employeeId}
			$scope.employee.identityType = employee.identity_type;
			$scope.employee.identityNumber = employee.identity_number;
			$scope.employee.imageIdentity = employee.image_identity;
			$scope.employee.imageTeacher = employee.image_teacher;
			$scope.employee.imageEducation = employee.image_education;
			$scope.employee.imageProfessional =employee.image_professional;

			//人才弹框---其他tab
			$scope.employee.characteristics = employee.talent_characteristic;
			if(employee.talent_characteristic){
				$scope.employee.characteristics = [];
				angular.forEach(employee.talent_characteristic,function(p,index){
					var temp = {};
					temp.id = p.teaching_characteristic_id;
					$scope.employee.characteristics.push(temp);
				});
			}
			$scope.employee.signature = employee.signature;
			$scope.employee.profile = employee.profile;
			$scope.employee.teachingAchievementList = employee.teaching_achievement;

			//信息拷贝完全后，添加一个状态为待入职（employee_status=2）的员工
			$scope.employee.employmentStatus = 2;
			$scope.employee.talentId = employee.id;
			//根据人才id去查询是否有已经对应的员工，如果有，不作处理。如果没有，则新增
			var promise = EmployeeService.add($scope.employee);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
					return false;
				}
				else{
					var data = response.data;
					$scope.employee.id = data.id;
					if(employee.image_identity){
						var newFileName = "HR-IMG" + data.id + "/" + employee.image_identity;
						var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_identity;
						TalentService.copy(newFileName,oldFileName);
					}
					if(employee.image_teacher){
						var newFileName = "HR-IMG" + data.id + "/" + employee.image_teacher;
						var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_teacher;
						TalentService.copy(newFileName,oldFileName);
					}
					if(employee.image_education){
						var newFileName = "HR-IMG" + data.id + "/" + employee.image_education;
						var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_education;
						TalentService.copy(newFileName,oldFileName);
					}
					if(employee.image_professional){
						var newFileName = "HR-IMG" + data.id + "/" + employee.image_professional;
						var oldFileName = "HR-IMG" + employee.id + "/" + employee.image_professional;
						TalentService.copy(newFileName,oldFileName);
					}
					if(employee.profile){
						var newFileName = "HR-IMG" + data.id + "/" + employee.profile;
						var oldFileName = "HR-IMG" + employee.id + "/" + employee.profile;
						TalentService.copy(newFileName,oldFileName);
					}
					//在图片预览时候，已经将新增的图片封装在newImgList对象中了
					if(employee.teaching_achievement != undefined){
						angular.forEach(employee.teaching_achievement, function(q){
							if(q.achievementImages != undefined){
								angular.forEach(q.achievementImages, function(p,index){
									var length = employee.id.toString().length
									var fileName = p.substring(p.indexOf("com/HR-IMG")+11+length);
									var newFileName = "HR-IMG" + data.id + "/" + fileName;
									var oldFileName = "HR-IMG" + employee.id + "/" + fileName;
									TalentService.copy(newFileName,oldFileName);
								})
							}
						})
					}
					$scope.employee = {};
					return true;
				}
			}, function(error) {
				$scope.employee = {};
				return false;
			});
		}

		/**
		 * 获取到访人才列表
		 * @param tableState
		 */
		$scope.getVisitTalentList = function(tableState){
			//$scope.required.recruitment_status = 1;
			//设置列表加载条件，即最新节点为【邀约诺访】的，同时
			$scope.talentVisitTableState = tableState;
			$scope.isLoading = true;
			$scope.pagination = tableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			//$scope.visitFilter.recruitment_status = 1;
			$scope.visitFilter.recruitmentScheduleName = "邀约诺访";
			var promise = TalentService.findByFilter($scope.visitFilter, $scope.start, $scope.number);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var result = {};
					result.data = response.data.list;
					result.numberOfPages = response.data.pages;
					$scope.visitTalentList = result.data;
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				}
			}, function(error) {
				SweetAlert.swal('获取诺访人才列表失败', 'error');
			});
		}

		/**
		 * 获取需求人才列表
		 * @param tableState
		 */
		function getTalentRequiredList(tableState){
			$scope.required.recruitment_status = 1;
			$scope.talentRequiredTableState = tableState;
			$scope.isLoading = true;
			$scope.pagination = tableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			if ($scope.required.recruitmentNode != undefined || $scope.required.recruitmentNode != null) {
				$scope.required.scheduleStatus = $scope.required.recruitmentNode.name;
			}
			if($scope.required.recruitmentScheduleNode != undefined){
				$scope.required.recruitmentScheduleName = $scope.required.recruitmentScheduleNode.name;
				$scope.tempNode = angular.copy($scope.required.recruitmentScheduleNode);
				$scope.required.recruitmentScheduleNode = undefined;
			}
			else if($scope.required.recruitmentScheduleNode == undefined){
				$scope.required.recruitmentScheduleName = undefined;
				$scope.required.recruitmentScheduleNode = undefined;
			}
			var promise = TalentService.findByFilter($scope.required, $scope.start, $scope.number);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var result = {};
					result.data = response.data.list;
					result.numberOfPages = response.data.pages;
					$scope.hrRequiredTalents = result.data;
					//angular.forEach($scope.hrRequiredTalents,function(p,index){
					//	dateFormat(p);
					//});
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				}
			}, function(error) {
				SweetAlert.swal('获取需求人才列表失败', 'error');
			});
		}

		$scope.previewOperation = function(p){
			if(p.channel1){
				angular.forEach($scope.recruitmentChannel,function(p1,index1){
					if(p1.name == p.channel1.name) {
						p.channel1.child = p1.child;
						if (p.channel2){
							angular.forEach(p1.child, function (p2, index2) {
								if (p2.name == p.channel2.name) {
									p.channel2.child = p2.child;
								}
							});
						}
					}
				});
			}
			$scope.generateImgPreviewSrc(p);
		}

		/**
		 * 获取储备人才列表
		 * @param tableState
		 */
		function getTalentReserveList(tableState){
			$scope.reserve.recruitment_status = 0;
			$scope.talentReserveTableState = tableState;
			$scope.isLoading = true;
			$scope.pagination = tableState.pagination;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			if ($scope.reserve.recruitmentNode != undefined || $scope.reserve.recruitmentNode != null) {
				$scope.reserve.scheduleStatus = $scope.reserve.recruitmentNode.name;
			}
			if($scope.reserve.recruitmentScheduleNode != undefined){
				$scope.reserve.recruitmentScheduleName = $scope.reserve.recruitmentScheduleNode.name;
				$scope.tempNode = angular.copy($scope.reserve.recruitmentScheduleNode);
				$scope.reserve.recruitmentScheduleNode = undefined;
			}
			else if($scope.reserve.recruitmentScheduleNode == undefined){
				$scope.reserve.recruitmentScheduleName = undefined;
				$scope.reserve.recruitmentScheduleNode = undefined;
			}
			var promise = TalentService.findByFilter($scope.reserve, $scope.start, $scope.number);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var result = {};
					result.data = response.data.list;
					result.numberOfPages = response.data.pages;
					$scope.hrReserveTalents = result.data;
					//angular.forEach($scope.hrReserveTalents,function(p,index){
					//	dateFormat(p);
					//});
					tableState.pagination.numberOfPages = result.numberOfPages;
					$scope.isLoading = false;
				}
			}, function(error) {
				SweetAlert.swal('获取储备人才列表失败', 'error');
			});
		}

		/**
		 * 根据条件获取人才信息列表
		 */
		function getTalentsByFilter(flag) {
			if(flag == 0){
				//储备人才tab页，需要转换输入框值
				$scope.reserve.recruitment_status = 0;
				var starVal = $("#editStarValue").val();
				if (starVal.length != 0) {
					$scope.reserve.meet_degree = starVal;
				}
				if ($scope.reserve.recruitmentNode != undefined || $scope.reserve.recruitmentNode != null) {
					$scope.reserve.scheduleStatus = $scope.reserve.recruitmentNode.name;
				}
				if($scope.reserve.recruitmentScheduleNode != undefined){
					$scope.reserve.recruitmentScheduleName = $scope.reserve.recruitmentScheduleNode.name;
					$scope.tempNode = angular.copy($scope.reserve.recruitmentScheduleNode);
					$scope.reserve.recruitmentScheduleNode = undefined;
				}
				else if($scope.reserve.recruitmentScheduleNode == undefined){
					$scope.reserve.recruitmentScheduleName = undefined;
					$scope.reserve.recruitmentScheduleNode = undefined;
				}
				$scope.temp = angular.copy($scope.reserve);
				if ($scope.reserve.created_at != undefined || $scope.reserve.created_at != null) {
					$scope.temp.created_at = DateToStr($scope.reserve.created_at);
				}
				if ($scope.reserve.created_at == null) {
					$scope.temp.created_at = '';
				}
				if ($scope.hrTalent.department != null) {
					$scope.temp.department_id = angular.copy($scope.hrTalent.department.id);
				}
				if ($scope.hrTalent.position != null ) {
					$scope.temp.position_id = angular.copy($scope.hrTalent.position.id);
				}
				$scope.talentReserveTableState.pagination.start=0;
				$scope.pagination = $scope.talentReserveTableState.pagination;
			}
			else if(flag == 1){
				//需求人才tab页，需要转换输入框值
				$scope.required.recruitment_status = 1;
				var starVal = $("#editStarValue").val();
				if (starVal.length != 0) {
					$scope.required.meet_degree = starVal;
				}
				if ($scope.required.recruitmentNode != undefined || $scope.required.recruitmentNode != null) {
					$scope.required.scheduleStatus = $scope.required.recruitmentNode.name;
				}
				if($scope.required.recruitmentScheduleNode != undefined){
					$scope.required.recruitmentScheduleName = $scope.required.recruitmentScheduleNode.name;
					//$scope.required.recruitmentScheduleNode = undefined;
					$scope.tempNode = angular.copy($scope.required.recruitmentScheduleNode);
					$scope.required.recruitmentScheduleNode = undefined;
				}
				else if($scope.required.recruitmentScheduleNode == undefined){
					$scope.required.recruitmentScheduleName = undefined;
					$scope.required.recruitmentScheduleNode == undefined
				}
				$scope.temp = angular.copy($scope.required);
				if ($scope.required.created_at != undefined || $scope.required.created_at != null) {
					$scope.temp.created_at = DateToStr($scope.required.created_at);
				}
				if ($scope.required.created_at == null) {
					$scope.temp.created_at = '';
				}
				if ($scope.hrTalent.department != null) {
					$scope.temp.department_id = angular.copy($scope.hrTalent.department.id);
				}
				if ($scope.hrTalent.position != null ) {
					$scope.temp.position_id = angular.copy($scope.hrTalent.position.id);
				}
				$scope.talentRequiredTableState.pagination.start=0;
				$scope.pagination = $scope.talentRequiredTableState.pagination;
			}
			else if(flag == 2){
				//$scope.visitFilter.recruitment_status = 1;
				$scope.visitFilter.recruitmentScheduleName = "邀约诺访";
				$scope.temp = angular.copy($scope.visitFilter);
				$scope.talentVisitTableState.pagination.start=0;
				$scope.pagination = $scope.talentVisitTableState.pagination;
			}
			//查询准备
			$scope.isLoading = true;
			$scope.start = $scope.pagination.start || 0;
			$scope.number = $scope.pagination.number || 10;
			if($scope.temp.recruitmentScheduleNode == null){
				$scope.temp.recruitmentScheduleNode = undefined;
			}
			var promise = TalentService.findByFilter($scope.temp, $scope.start, $scope.number);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var result = {};
					result.data = response.data.list;
					result.numberOfPages = response.data.pages;
					//接收返回list的同时，也要注意维护2个table
					if(flag == 0){
						$scope.hrReserveTalents = result.data;
						//angular.forEach($scope.hrReserveTalents,function(p,index){
						//	dateFormat(p);
						//});
						$scope.talentReserveTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						$scope.isLoading = false;
						$scope.reserve.recruitmentScheduleNode = angular.copy($scope.tempNode);
						$scope.tempNode = null;
					}
					else if(flag == 1){
						$scope.hrRequiredTalents = result.data;
						//angular.forEach($scope.hrRequiredTalents,function(p,index){
						//	dateFormat(p);
						//});
						$scope.talentRequiredTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						$scope.isLoading = false;
						$scope.required.recruitmentScheduleNode = angular.copy($scope.tempNode);
						$scope.tempNode = null;
					}
					else if(flag == 2){
						$scope.visitTalentList = result.data;
						$scope.talentVisitTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						$scope.isLoading = false;
					}
				}
			}, function(error) {
				SweetAlert.swal('查询人才信息失败', 'error');
			});
		}

		/**
		 * 将时间戳转化为yyyy-MM-dd hh:mm:ss格式
		 * @param p
		 */
		function dateFormat(p){
			if(p.birthday){
				p.birthday = new Date(p.birthday).Format("yyyy-MM-dd");
			}
			if(p.entrance_date){
				p.entrance_date = new Date(p.entrance_date).Format("yyyy-MM-dd");
			}
			if(p.graduation_date){
				p.graduation_date = new Date(p.graduation_date).Format("yyyy-MM-dd");
			}
			if(p.available_date){
				p.available_date = new Date(p.available_date).Format("yyyy-MM-dd");
			}
			if(p.last_company_departure_date){
				p.last_company_departure_date = new Date(p.last_company_departure_date).Format("yyyy-MM-dd");
			}
			if (p.recruitmentSchedule) {
				angular.forEach(p.recruitmentSchedule, function(q, index){
					p.recruitmentSchedule[index].scheduleDate = new Date(p.recruitmentSchedule[index].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
					if(p.recruitmentSchedule[index].visitTime != null){
						p.recruitmentSchedule[index].visitTime = new Date(p.recruitmentSchedule[index].visitTime).Format("yyyy-MM-dd hh:mm:ss");
					}
				})
			}
			if (p.historyTalents) {
				angular.forEach(p.historyTalents, function(q, index){
					angular.forEach(p.historyTalents[index].recruitmentSchedule, function(p1, index1){
						p.historyTalents[index].recruitmentSchedule[index1].scheduleDate = new Date(p.historyTalents[index].recruitmentSchedule[index1].scheduleDate).Format("yyyy-MM-dd hh:mm:ss");
						if(p.historyTalents[index].recruitmentSchedule[index1].visitTime != null){
							p.historyTalents[index].recruitmentSchedule[index1].visitTime = new Date(p.historyTalents[index].recruitmentSchedule[index1].visitTime).Format("yyyy-MM-dd hh:mm:ss");
						}
					});
				})
			}
			if(p.hrWorkingExperiences){
				angular.forEach(p.hrWorkingExperiences, function(q, index){
					q.entrance_date = new Date(q.entrance_date).Format("yyyy-MM");
					if(q.departure_date != null){
						q.departure_date = new Date(q.departure_date).Format("yyyy-MM");
					}
				})
			}
		}

		/**
		 * 删除人才
		 */
		function removeTalent(hrTalent) {
			SweetAlert.swal({
					title: "确定要删除吗？",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#DD6B55',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnConfirm: true
				}, function(confirm) {
					if (confirm) {
						var promise = TalentService.remove(hrTalent);
						promise.then(function(response) {
							if(response.status == "FAILURE"){
								SweetAlert.swal( response.data,"请重试","error");
							}
							else{
								$scope.talents = {};
								if(hrTalent.recruitment_id == null){
									$scope.temp = {};
									getTalentsByFilter(0);
								}else{
									$scope.temp = {};
									getTalentsByFilter(1);
								}
							}
						}, function(error) {
						});
					}
				}
			);
		}

		/**
		 * 增加招聘流程
		 * 向hrTalent.recruitmentSchedule中添加新节点,angularjs会调用$watch动态增加节点
		 */
		function addSchedule(){
			//如果还没有招聘流程并且没有历史招聘流程并且没有新增历史
			if (($scope.hrTalent.recruitmentSchedule == null || $scope.hrTalent.recruitmentSchedule.length == 0)
				&& $scope.hrTalent.historyTalents == null && $scope.hrTalent.newHistoryTalent == null) {
				var arr = [];
				var obj = new Object();
				obj.executor = AuthenticationService.currentUser().name;
				obj.groupId = 1;
				obj.talentId = $scope.hrTalent.id;
				obj.status = 1;
				obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
				obj.scheduleDescription = "简历初选";
				var obj2 = new Object();
				obj2.name = "简历初选";
				obj.recruitmentNode = obj2;
				obj.createdBy = AuthenticationService.currentUser().id;
				obj.createdAt = new Date();
				obj.isDeleted = 0;
				arr.push(obj);
				$scope.hrTalent.recruitmentSchedule = arr;
			}
			//如果还没有招聘流程并且有历史招聘流程并且没有新增历史
			else if (($scope.hrTalent.recruitmentSchedule == null || $scope.hrTalent.recruitmentSchedule.length == 0)
				&& $scope.hrTalent.historyTalents != null && $scope.hrTalent.newHistoryTalent == null){
				var arr = [];
				var obj = new Object();
				obj.executor = AuthenticationService.currentUser().name;
				obj.groupId = $scope.hrTalent.historyTalents[0].talent_schedule_group_id + 1;
				obj.talentId = $scope.hrTalent.id;
				obj.status = 1;
				obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
				obj.scheduleDescription = "简历初选";
				var obj2 = new Object();
				obj2.name = "简历初选";
				obj.recruitmentNode = obj2;
				obj.createdBy = AuthenticationService.currentUser().id;
				obj.createdAt = new Date();
				obj.isDeleted = 0;
				arr.push(obj);
				$scope.hrTalent.recruitmentSchedule = arr;
			}
			//如果还没有招聘流程并且有历史招聘流程并且有新增历史
			else if (($scope.hrTalent.recruitmentSchedule == null || $scope.hrTalent.recruitmentSchedule.length == 0)
				&& $scope.hrTalent.historyTalents != null && $scope.hrTalent.newHistoryTalent != null){
				var arr = [];
				var obj = new Object();
				obj.executor = AuthenticationService.currentUser().name;
				obj.groupId = $scope.hrTalent.newHistoryTalent.recruitmentSchedule[0].groupId + 1;
				obj.talentId = $scope.hrTalent.id;
				obj.status = 1;
				obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
				obj.scheduleDescription = "简历初选";
				var obj2 = new Object();
				obj2.name = "简历初选";
				obj.recruitmentNode = obj2;
				obj.createdBy = AuthenticationService.currentUser().id;
				obj.createdAt = new Date();
				obj.isDeleted = 0;
				arr.push(obj);
				$scope.hrTalent.recruitmentSchedule = arr;
			}
			//如果还没有招聘流程并且没有历史招聘流程并且有新增历史
			else if (($scope.hrTalent.recruitmentSchedule == null || $scope.hrTalent.recruitmentSchedule.length == 0)
				&& $scope.hrTalent.historyTalents == null && $scope.hrTalent.newHistoryTalent != null){
				var arr = [];
				var obj = new Object();
				obj.executor = AuthenticationService.currentUser().name;
				obj.groupId = $scope.hrTalent.newHistoryTalent.recruitmentSchedule[0].groupId + 1;
				obj.talentId = $scope.hrTalent.id;
				obj.status = 1;
				obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
				obj.scheduleDescription = "简历初选";
				var obj2 = new Object();
				obj2.name = "简历初选";
				obj.recruitmentNode = obj2;
				obj.createdBy = AuthenticationService.currentUser().id;
				obj.createdAt = new Date();
				obj.isDeleted = 0;
				arr.push(obj);
				$scope.hrTalent.recruitmentSchedule = arr;
			}
			//如果已经有招聘流程
			else {
				var obj = new Object();
				obj.executor = AuthenticationService.currentUser().name;
				obj.groupId = $scope.hrTalent.recruitmentSchedule[0].groupId;
				obj.talentId = $scope.hrTalent.recruitmentSchedule[0].talentId;
				obj.status = 1;
				obj.scheduleDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
				obj.createdBy = AuthenticationService.currentUser().id;
				obj.createdAt = new Date();
				obj.scheduleDescription = "";
				obj.scheduleName = "";
				obj.isDeleted = 0;
				$scope.hrTalent.recruitmentSchedule.unshift(obj);
			}
		}

		/**
		 * 删除招聘流程
		 */
		function deleteSchedule(index){
			//先判断有没有id，没有不通过数据库
			if ($scope.hrTalent.recruitmentSchedule[index].id == null) {
				$scope.hrTalent.recruitmentSchedule.splice(index, 1);
			}
			else {
				SweetAlert.swal({
					title: "请谨慎操作！",
					text: '确定要删除该流程节点吗？',
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#DD6B55',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnConfirm: true,
					showLoaderOnConfirm: true
				}, function(confirm) {
					if (confirm) {
						var promise = RecruitmentManagementService.deleteRecruitmentSchedule($scope.hrTalent.recruitmentSchedule[index])
							.then(function(response) {
								if(response.status == "FAILURE"){
									SweetAlert.swal( response.data,"请重试","error");
								}
								else{
									$scope.hrTalent.recruitmentSchedule.splice(index, 1);
									SweetAlert.swal('删除成功', 'success');
								}
							}, function(error) {
								SweetAlert.swal('删除失败', '请重试', 'error');
							}
						);
					}
				});
			}
		}

		/**
		 * 保存，针对节点的改动。
		 */
		function updateSchedule(hrTalent){
			if (hrTalent.recruitmentSchedule != null) {
				angular.forEach(hrTalent.recruitmentSchedule, function(p, index){
					hrTalent.recruitmentSchedule[index].talentId = hrTalent.id;
					if(hrTalent.recruitmentSchedule[index].recruitmentNode
							&& hrTalent.recruitmentSchedule[index].recruitmentNode.name != "首次到访前邀约诺访"
							&& hrTalent.recruitmentSchedule[index].recruitmentNode.name != "首次到访后邀约诺访"){
						hrTalent.recruitmentSchedule[index].visitTime = undefined;
					}
				})
			}
			var promise = RecruitmentManagementService.updateRecruitmentSchedule(hrTalent.recruitmentSchedule)
				.then(function(response) {
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
					}
					else{
						$scope.hrTalent.recruitmentSchedule = response.data;
						$scope.hrTalent = {};
						getTalentsByFilter(0);
						getTalentsByFilter(1);
					}
				}, function(error) {
					SweetAlert.swal('修改失败', '请重试', 'error');
				}
			);
		}

		/**
		 * 上传文件
		 * @param fileName 文件名称
		 * @param f		文件
		 * @param hrTalent	主要是为了获取人才id
		 */
		function fileUpload(fileName, f, hrTalent){
			if(f == null)
				return;
			var r = new FileReader();
			r.onloadend = function(e){
				var data = e.target.result;
				var uploadFileDir = "HR" + hrTalent.id + "/";
				TalentService.uploadFileToUrl(data, fileName, uploadFileDir);
			}
			r.readAsDataURL(f);
		}
		/**
		 * 上传图片
		 * @param imageName 图片名称名称
		 * @param f		图片
		 * @param hrTalent	主要是为了获取人才id
		 */
		function imageUpload(imageName, f, hrTalent){
			if(f == null)
				return;
			var r = new FileReader();
			r.onloadend = function(e){
				var data = e.target.result;
				var uploadFileDir = "HR-IMG" + hrTalent.id + "/";
				TalentService.uploadImageToUrl(data, imageName, uploadFileDir);
			}
			r.readAsDataURL(f);
		}

		/**
		 * 文件下载
		 */
		function download(hrTalent){
			//用了mydate97插件，需要将流程节点时间、到访时间、工作经历中的起止时间转换一下
			angular.forEach(hrTalent.recruitmentSchedule, function(p,index){
				p.scheduleDate = new Date(p.scheduleDate);
				if(p.visitTime != null){
					p.visitTime = new Date(p.visitTime);
				}
			});
			if(hrTalent.historyTalents){
				angular.forEach(hrTalent.historyTalents,function(p){
					angular.forEach(p.recruitmentSchedule,function(q){
						q.scheduleDate = new Date(q.scheduleDate);
						if(q.visitTime != null){
							q.visitTime = new Date(q.visitTime);
						}
					})
				});
			}
			if(hrTalent.newHistoryTalent && hrTalent.newHistoryTalent.recruitmentSchedule){
				angular.forEach(hrTalent.newHistoryTalent.recruitmentSchedule,function(p, index){
					p.scheduleDate = new Date(p.scheduleDate);
					if(p.visitTime != null){
						p.visitTime = new Date(p.visitTime);
					}
				});
			}
			if(hrTalent.hrWorkingExperiences){
				angular.forEach(hrTalent.hrWorkingExperiences,function(p){
					p.entrance_date = new Date(p.entrance_date);
					if(p.departure_date != null){
						p.departure_date = new Date(p.departure_date);
					}
				});
			}
			TalentService.download(hrTalent);
		}

		function downloadHistory(hrTalent){
			//用了mydate97插件，需要将流程节点时间、到访时间、工作经历中的起止时间转换一下
			angular.forEach(hrTalent.recruitmentSchedule, function(p,index){
				p.scheduleDate = new Date(p.scheduleDate);
				if(p.visitTime != null){
					p.visitTime = new Date(p.visitTime);
				}
			});
			if(hrTalent.historyTalents){
				angular.forEach(hrTalent.historyTalents,function(p){
					angular.forEach(p.recruitmentSchedule,function(q){
						q.scheduleDate = new Date(q.scheduleDate);
						if(q.visitTime != null){
							q.visitTime = new Date(q.visitTime);
						}
					})
				});
			}
			if(hrTalent.newHistoryTalent && hrTalent.newHistoryTalent.recruitmentSchedule){
				angular.forEach(hrTalent.newHistoryTalent.recruitmentSchedule,function(p, index){
					p.scheduleDate = new Date(p.scheduleDate);
					if(p.visitTime != null){
						p.visitTime = new Date(p.visitTime);
					}
				});
			}
			if(hrTalent.hrWorkingExperiences){
				angular.forEach(hrTalent.hrWorkingExperiences,function(p){
					p.entrance_date = new Date(p.entrance_date);
					if(p.departure_date != null){
						p.departure_date = new Date(p.departure_date);
					}
				});
			}
			TalentService.downloadHistory(hrTalent);
		}

		/**
		 * Shows the job and quit employee view
		 */
		function showTalentView() {
			$scope.isShow = true;
			$scope.talentTabs = [
				{title:'需求人才', template: 'partials/hr/talent/talent-required.html'},
				{title:'储备人才', template: 'partials/hr/talent/talent-reserve.html'}
			];
		}

		/**
		 * Add new work experience.
		 */
		function addWorkHistory(){
			if($scope.hrTalent.hrWorkingExperiences == undefined || $scope.hrTalent.hrWorkingExperiences == 0 ||
				$scope.hrTalent.hrWorkingExperiences[0].company != undefined){
				var obj = new Object();
				if($scope.hrTalent.hrWorkingExperiences == undefined){
					$scope.hrTalent.hrWorkingExperiences = [];
				}
				$scope.hrTalent.hrWorkingExperiences.unshift(obj);
			}
		}

		/**
		 * 检测是否存在人才
		 */
		function checkIsExit(){
			var reg_tel = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}|178\d{8}$/ ;
			if ($scope.hrTalent.tel == null || $scope.hrTalent.tel == "") {
				SweetAlert.swal('请填写手机号', '请重试', 'error');
				return false;
			}
			else if($scope.hrTalent.tel.length != 11 || !$scope.hrTalent.tel.match( $rootScope.reg_mobile )){
				SweetAlert.swal("请输入合法手机号",'请重试','error');
				return false;
			}
			$scope.temp = new Object();
			$scope.temp.tel = $scope.hrTalent.tel;
			var promise = TalentService.findSameTalent($scope.temp, 0, 10);
			promise.then(function(response) {
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					var result = {};
					result.data = response.data.list;
					result.numberOfPages = response.data.pages;
					if (result.data.length>0){
						//需要判断是否是同一个人才
						if(!$scope.hrTalent.id){
							//新增的情况，肯定是重复手机号。
							$scope.hrTalent.isExitLabel = "系统内已有此人才，请您再次确认。"
							$scope.hrTalent.tel = null;
						}
						else{
							var exist = false;
							angular.forEach(result.data, function(p,index){
								if(p.id != $scope.hrTalent.id){
									exist = true;
									return;
								}
							});
							if(exist == true){
								$scope.hrTalent.isExitLabel = "系统内已有此人才，请您再次确认。"
								$scope.hrTalent.tel = null;
							}
						}
					}
					else {
						$scope.hrTalent.isExitLabel = null;
					}
				}
			}, function(error) {
				SweetAlert.swal('确定人才唯一性失败', 'error');
			});
		}

		/**
		 * 检查操作人的操作权限
		 */
		function checkPermision(hrTalent){
			if (hrTalent.executors.indexOf(AuthenticationService.currentUser().name) == 0){
				return 1;
			}else if(hrTalent.executors.indexOf(AuthenticationService.currentUser().name) > 0){
				return 2;
			}else{
				return 3
			}
		}

		/**
		 * 查看人才弹窗
		 */
		function showInfoView(hrTalent){
			$scope.previewOperation(hrTalent);
			dateFormat(hrTalent);
			if(hrTalent.recruitment_id){
				//打开编辑页面时，需要去确定选中的需求
				getRecruitmentNeed(hrTalent.department.id, hrTalent.position.id);
			}
			if(hrTalent.province_code != undefined){
				var promise = DepartmentService.getCityByProvince(hrTalent.province_code);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
						return false;
					}
					else{
						$scope.cities = response.data;
					}
				},function(error){
				});
			}
			if(hrTalent.city_code != undefined){
				var promise = DepartmentService.getAreaByCity(hrTalent.city_code);
				promise.then(function(response){
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
						return false;
					}
					else{
						$scope.areas = response.data;
					}
				},function(error){
				});
			}
			var promise = PositionService.list(hrTalent.department_id);
			promise.then(function(response){
				if(response.status == "FAILURE"){
					SweetAlert.swal( response.data,"请重试","error");
				}
				else{
					$scope.positions = response.data;
				}
			}, function(error){
			});
			$scope.hrTalent = angular.copy(hrTalent);
			$scope.infoTabs = [
				{id:1,title:'招聘信息', template: 'partials/hr/talent/recruit-info-readonly.html'},
				{id:2,title:'基本信息', template: 'partials/hr/talent/basic-info-readonly.html'},
				{id:3,title:'工作经历', template: 'partials/hr/talent/work-history-readonly.html'},
				{id:4,title:'应聘意向', template: 'partials/hr/talent/job-intention-readonly.html'},
				{id:5,title:'认证相关', template: 'partials/hr/talent/confirm-readonly.html'},
				{id:6,title:'其他', template: 'partials/hr/talent/other-readonly.html'},
			];
			$scope.infoModalTitle = '查看人才';
			$scope.infoModal = $modal({scope: $scope, templateUrl: 'partials/hr/talent/modal.talent.info.html', show: true,backdrop:"static"});
		}

		function hideInfoView(){
			$scope.hrTalent = {};
			$scope.infoModal.hide();
		}

		/**
		 * 图片预览
		 * @param file
		 */
		$scope.getFile = function (file) {
			var imgIdentity = document.getElementById("identity").files[0];
			if(imgIdentity != null){
				fileReader.readAsDataUrl(imgIdentity, $scope)
					.then(function(result) {
						$scope.hrTalent.imageIdentitySrc = result;
					});
			}
			var imgTeacher = document.getElementById("teacher").files[0];
			if(imgTeacher != null){
				fileReader.readAsDataUrl(imgTeacher, $scope)
					.then(function(result) {
						$scope.hrTalent.imageTeacherSrc = result;
					});
			}
			var imgEducation = document.getElementById("education").files[0];
			if(imgEducation != null){
				fileReader.readAsDataUrl(imgEducation, $scope)
					.then(function(result) {
						$scope.hrTalent.imageEducationSrc = result;
					});
			}
			var imgProfessional = document.getElementById("professional").files[0];
			if(imgProfessional != null){
				fileReader.readAsDataUrl(imgProfessional, $scope)
					.then(function(result) {
						$scope.hrTalent.imageProfessionalSrc = result;
					});
			}
			var imgProfile = document.getElementById("profile").files[0];
			if(imgProfile != null){
				fileReader.readAsDataUrl(imgProfile, $scope)
					.then(function(result) {
						$scope.hrTalent.imageProfileSrc = result;
					});
			}
			//教学成果
			if($scope.hrTalent.teaching_achievement){
				angular.forEach($scope.hrTalent.teaching_achievement,function(p, index){
					if(p.newImgList == undefined){
						p.newImgList = [];
					}
					if(p.img1 != null){
						fileReader.readAsDataUrl(p.img1, $scope)
							.then(function(result) {
								p.img1Src = result;
								//var fname = $scope.GetFileNameNoExt(p.img1.name);
								var fname = encodeURI(p.img1.name);
								//fname = fname + $scope.getFileExt(p.img1.name);
								p.achievementImg1 = fname;
							});
						var exist = false;
						angular.forEach(p.newImgList, function(q,index){
							if(q == p.img1){
								exist = true;
								return;
							}
						});
						if(exist == false){
							p.newImgList.push(p.img1);
						}
					}
					if(p.img2 != null){
						fileReader.readAsDataUrl(p.img2, $scope)
							.then(function(result) {
								p.img2Src = result;
								//var fname = $scope.GetFileNameNoExt(p.img2.name);
								var fname = encodeURI(p.img2.name);
								//fname = fname + $scope.getFileExt(p.img2.name);
								p.achievementImg2 = fname;
							});
						var exist = false;
						angular.forEach(p.newImgList, function(q,index){
							if(q == p.img2){
								exist = true;
								return;
							}
						});
						if(exist == false){
							p.newImgList.push(p.img2);
						}
					}
					if(p.img3 != null){
						fileReader.readAsDataUrl(p.img3, $scope)
							.then(function(result) {
								p.img3Src = result;
								//var fname = $scope.GetFileNameNoExt(p.img3.name);
								var fname = encodeURI(p.img3.name);
								//fname = fname + $scope.getFileExt(p.img3.name);
								p.achievementImg3 = fname;
							});
						var exist = false;
						angular.forEach(p.newImgList, function(q,index){
							if(q == p.img3){
								exist = true;
								return;
							}
						});
						if(exist == false){
							p.newImgList.push(p.img3);
						}
					};
				});
			}
			//updated at 2016-03-12 17:07
			//存在相应人才,图片的ng-model存在hrTalent.teaching_achievement.picture中
			//if($scope.hrTalent.teaching_achievement){
			//	angular.forEach($scope.hrTalent.teaching_achievement,function(p, index){
			//		//p是每个教学成果，p.img是该教学成果的图片,每次只保留最近选择的
			//		//预览src放在achievementImages数组中
			//		//所有图片拼成的字符串存放在p.picture属性中，用 | 分割
			//		if(p.img != null){
			//			var isExist = false;
			//			if(p.newImgList == undefined){
			//				p.newImgList = [];
			//			}
			//
			//			angular.forEach(p.newImgList,function(q,index){
			//				if(q.imgSrc == p.img){
			//					isExist = true;
			//					return;
			//				}
			//			});
			//
			//			if(isExist == false){
			//				var tempImg = new Object();
			//				tempImg.imgSrc = p.img;
			//				fileReader.readAsDataUrl(tempImg.imgSrc, $scope)
			//					.then(function(result) {
			//						$scope.tempSrc = result;
			//						//读取完毕后，放入list中
			//						if(p.achievementImages == null){
			//							p.achievementImages = [];
			//						}
			//						p.achievementImages.push($scope.tempSrc);
			//						if(p.picture == undefined){
			//							var fname = $scope.GetFileNameNoExt(tempImg.imgSrc.name);
			//							fname = encodeURI(fname);
			//							fname = fname + $scope.getFileExt(tempImg.imgSrc.name);
			//							p.picture = fname;
			//							/*p.picture = $scope.GetFileNameNoExt(tempImg.imgSrc.name);*/
			//						}
			//						else{
			//							var fname = $scope.GetFileNameNoExt(tempImg.imgSrc.name);
			//							fname = encodeURI(fname);
			//							fname = fname + $scope.getFileExt(tempImg.imgSrc.name);
			//							p.picture = p.picture + "|" + fname;
			//							/*p.picture = p.picture + "|" + tempImg.imgSrc.name;*/
			//						}
			//						p.newImgList.push(tempImg);
			//					});
			//			}
			//		}
			//	})
			//}
		};

		//取文件名不带后缀
		$scope.GetFileNameNoExt = function(filepath) {
			if (filepath != "") {
				var names = filepath.split("\\");
				var pos = names[names.length - 1].lastIndexOf(".");
				return names[names.length - 1].substring(0, pos);
			}
			/*encodeURI();*/
		}

		$scope.getFileExt = function(file_name){
			var result =/\.[^\.]+/.exec(file_name);
			return result;
		}

		/**
		 * 图片放大缩小，但是最大只能是图片所在div大小
		 * @type {boolean}
		 */
		$scope.n = true;
		$scope.zoom = function(){
			if($scope.n){
				$scope.n = false;
			}
			else{
				$scope.n = true;
			}
		}

		//针对每一条人才记录，生成图片预览地址
		$scope.generateImgPreviewSrc = function(p){
			//angular.forEach(talents, function(p,index){
			if(p.image_identity){
				p.imageIdentitySrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_identity;
			}
			if(p.image_teacher){
				p.imageTeacherSrc = QINIU_HR_IMG_DOMAIN  + p.id + "/" + p.image_teacher;
			}
			if(p.image_education){
				p.imageEducationSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_education;
			}
			if(p.image_professional){
				p.imageProfessionalSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.image_professional;
			}
			if(p.profile){
				p.imageProfileSrc = QINIU_HR_IMG_DOMAIN + p.id + "/" + p.profile;
			}

			if(p.teaching_achievement){
				//教学成果可以有多个。
				angular.forEach(p.teaching_achievement, function(q,index){
					q.achievementImages = [];
					var str = angular.copy(q.picture);
					//多个图片拼接规则是用 | 分割
					while(true){
						if(str == null || str == ""){
							break;
						}
						else if(str.indexOf("|") == -1){
							q.achievementImages.push(QINIU_HR_IMG_DOMAIN + p.id + "/" + str);
							str = null;
							continue;
						}
						var temp = str.substring(0, str.indexOf("|"));
						temp = QINIU_HR_IMG_DOMAIN + p.id + "/" + temp;
						q.achievementImages.push(temp);
						str = str.substring(str.indexOf("|")+1, str.length);
					}
					if(q.achievementImages && q.achievementImages.length > 0){
						var length = (QINIU_HR_IMG_DOMAIN + p.id + "/").length;
						if(q.achievementImages[0]){
							q.img1Src = q.achievementImages[0];
							q.achievementImg1 = q.img1Src.substring(length, q.img1Src.length);
						}
						if(q.achievementImages[1]){
							q.img2Src = q.achievementImages[1];
							q.achievementImg2 = q.img2Src.substring(length, q.img2Src.length);
						}
						if(q.achievementImages[2]){
							q.img3Src = q.achievementImages[2];
							q.achievementImg3 = q.img3Src.substring(length, q.img3Src.length);
						}
					}
				})
			}
			//})
		}

		/**
		 * Delete achievement by index.
		 * @param index the index
		 */
		$scope.deleteAchievementImg = function(index, pos){
			var templist = $scope.hrTalent.teaching_achievement.slice(index,index+1);
			var temp = templist[0];
			if(pos == 1){
				temp.achievementImg1 = null;
				temp.img1Src = null;
			}
			else if(pos == 2){
				temp.achievementImg2 = null;
				temp.img2Src = null;
			}
			else if(pos == 3){
				temp.achievementImg3 = null;
				temp.img3Src = null;
			}
		}

		$scope.deleteAchievement = function(index){
			$scope.hrTalent.teaching_achievement.splice(index,1);
		}

		$scope.checkItem = function(para){
			//先判断之前是否选中
			//toggleCharacteristic(characteristic)
			if(para.selected){
				para.selected = false;
			}
			else{
				para.selected = true;
			}
			$scope.updateCharacteristic(para);
		}

		$scope.updateCharacteristic = function(para){
			if($scope.hrTalent.talent_characteristic == undefined){
				$scope.hrTalent.talent_characteristic = [];
			}
			if(para.selected){
				//如果是选中，那么要加入 该人才的特点集中
				if($scope.hrTalent.talent_characteristic.length >= 5){
					SweetAlert.swal("教学特点不能超过5个！");
					para.selected = false;
					return;
				}
				else{
					para.teaching_characteristic_id = para.id;
					$scope.hrTalent.talent_characteristic.push(para);
				}
			}
			else{
				//如果变成没有选中，那么需要从该人才的特点集中删除
				angular.forEach($scope.hrTalent.talent_characteristic,function(p,index){
					if(p.teaching_characteristic_id == para.id){
						$scope.hrTalent.talent_characteristic.splice(index, 1);
					}
				})
			}
		}

		$scope.toggleCharacteristic = function(){
			//优先将$scope.characteristics全置false
			angular.forEach($scope.characteristics, function(p,index){
				p.selected = false;
			})
			angular.forEach($scope.hrTalent.talent_characteristic, function(p,index){
				angular.forEach($scope.characteristics, function(q,index2){
					if(p.teaching_characteristic_id == q.id){
						q.selected = true;
						return;
					}
				})
			})
		}

		$scope.addTeachingAchievement = function(){
			var obj = new Object();
			$scope.hrTalent.teaching_achievement.push(obj);
		}

		function getTeachingCharacteristic(){
			var promise = TalentService.getTeachingCharacteristic()
				.then(function(response) {
					if(response.status == "FAILURE"){
						SweetAlert.swal( response.data,"请重试","error");
					}
					else{
						$scope.characteristics = response.data;
					}
				}, function(error) {
					SweetAlert.swal('获取教学特点失败', '请重试', 'error');
				}
			);
		}

		$scope.deleteWorkingExperience = function(index){
			if($scope.hrTalent.hrWorkingExperiences){
				$scope.hrTalent.hrWorkingExperiences.splice(index, 1);
			}
		}

		/****************工具方法***************/
		function DateToStr(date){
			date = new Date(date);
			var year = date.getFullYear();
			var month = pattern(date.getMonth()+1);
			var day = pattern(date.getDate());
			var dateStr = year + "-" + month + "-" + day;
			return dateStr
		}

		function pattern(str){
			str = new String(str);
			if(str.length < 2)
				return "0" + str;
			else
				return str;
		}

		/***************************招聘渠道参数设定******************************/
		/*	$scope.schedulePoints = [
		 {"name": "电话沟通"},
		 {"name": "邀约诺访"},
		 {"name": "邀约犹豫"},
		 {"name": "邀约拒绝"},
		 {"name": "首次到访未面试"},
		 {"name": "首次到访面试"},
		 {"name": "复试"},
		 {"name": "入职"},
		 {"name": "结束"}
		 ]*/

		$scope.educationDegrees = [
			{id: 1, name: "小学"},
			{id: 2, name: "初中"},
			{id: 3, name: "高中"},
			{id: 4, name: "职高"},
			{id: 5, name: "大专"},
			{id: 6, name: "本科"},
			{id: 7, name: "硕士"},
			{id: 8, name: "博士"}
		]

		$scope.educationDegreeTypes = [
			{id: 1, name: "统招"},
			{id: 2, name: "自考"},
			{id: 3, name: "函授"},
			{id: 4, name: "成考"}
		]

		$scope.registeredResidenceTypes = [
			{id: 1, name: "外埠城镇"},
			{id: 2, name: "外埠农业"},
			{id: 3, name: "本市城镇"},
			{id: 4, name: "本市农业"}
		]

		$scope.recruitmentChannel = [
			{
				"name": "校招",
				"child": [
					{
						"name": "校园大使",
						"child": []
					},
					{
						"name": "双选会",
						"child": []
					}
				]
			},
			{
				"name": "社招",
				"child": [
					{
						"name": "招聘网站",
						"child": [
							{"name": "智联招聘"},
							{"name": "前程无忧"},
							{"name": "58同城"},
							{"name": "赶集网"},
							{"name": "猎聘网"},
							{"name": "中华英才"},
							{"name": "大街网"},
							{"name": "脉脉"},
							{"name": "邮箱"},
							{"name": "后台400"}
						]
					},
					{
						"name": "人才市场招聘会",
						"child": []
					},
					{
						"name": "内部推荐",
						"child": []
					},
					{
						"name": "外部猎头",
						"child": []
					}
				]
			},
			{
				"name" : "其他",
				"child" : []
			}
		];

		;(function init(){
			//$scope.leadsRepeatAlert = false;
			if(check_null($routeParams.type)){
				$scope.showAddView();//打开 弹窗添加人才 medal
			}
		})();

	}

]);

