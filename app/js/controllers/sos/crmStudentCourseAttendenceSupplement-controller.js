'use strict';

/**
 * The crmStudentCourseAttendenceSupplement controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('CrmStudentCourseAttendenceSupplementController', [
	'$scope', '$mtModal', '$filter', '$rootScope', 'SweetAlert', 'CrmStudentCourseAttendenceSupplementService',
	'LeadsStudentService', 'localStorageService', 'ClassManagementService', 'AuthenticationService', 'CommonService',
	'CoursePlanService',
	function($scope, $mtModal, $filter, $rootScope, SweetAlert, CrmStudentCourseAttendenceSupplementService,
			LeadsStudentService, localStorageService, ClassManagementService, AuthenticationService, CommonService,
			CoursePlanService) {
        $scope.nextCourseDatas = [{"name": "今日", "id": 1}, {"name": "明日", "id": 9}, {"name": "本周", "id": 10}, {"name": "下周", "id": 11},{"name": "本月", "id": 13}, {"name": "下月", "id": 15}, {"name": "自定义", "id": 8}];
		//年级
        CommonService.getGradeIdSelect().then(function (result) {
            $scope.grades=result.data;
        });

		/**
		 * 查询体验课列表
		 */
        $scope.searchModel={};
		$scope.getExperiencePageList=function(tableState){
			$scope.classExperienceTableState=tableState;
			var searchModel={};
			var start=tableState.pagination.start;
			var size=tableState.pagination.number;
			searchModel.start=start;
			searchModel.size=size;
			searchModel.schoolId=localStorageService.get('department').id;
			searchModel.type=3;
			searchModel.isDeleted=0;
			//筛选条件
			if(!positionInfo()){
				searchModel.userId=localStorageService.get('user').id;
			}
			if($scope.searchModel.studentName){
				searchModel.studentName=$scope.searchModel.studentName;
			}
			if($scope.searchModel.userName){
				searchModel.userName=$scope.searchModel.userName;
			}
			if($scope.searchModel.className){
				searchModel.className=$scope.searchModel.className;
			}
			if($scope.searchModel.teacherName){
				searchModel.teacherName=$scope.searchModel.teacherName;
			}
			if($scope.searchModel.subjectName){
				searchModel.subjectName=$scope.searchModel.subjectName;
			}
			if($scope.searchModel.searchStartTime){
				searchModel.searchStartTime=new Date($scope.searchModel.searchStartTime);
			}
			if($scope.searchModel.searchEndTime){
				searchModel.searchEndTime=new Date($scope.searchModel.searchEndTime);
			}
			if($scope.searchModel.state){
				searchModel.state=$scope.searchModel.state;
			}
			if($scope.searchModel.gradeId){
				searchModel.gradeId=$scope.searchModel.gradeId;
			}
			var promise=CrmStudentCourseAttendenceSupplementService.getPageList(searchModel);
			promise.then(function(response){
				$scope.classExperienceList=response.data.list;
				tableState.pagination.numberOfPages=response.numberOfPages;
			});
		}
		
		/**
		 * 排体验课弹窗
		 */
		$scope.showSelectModal=function(){
			$scope.searchModel={};
			$scope.selectedClassCoursePlan={};
			$scope.modalTitle='跟班体验';
			$scope.selectModal=$mtModal.modal('partials/sos/class/experience/modal.studentListen.html?'+new Date().getTime(),$scope);
		}
		
		/**
		 * 获取学生客户信息
		 */
		$scope.getStudents=function(tableState){
			$scope.studentTableState=tableState;
			var start=tableState.pagination.start;
			var number=tableState.pagination.number;
			var searchModel={};
			searchModel.queryLeadsAndStudent=true;
			var currentUserId=localStorageService.get('user').id;
			//筛选条件
			if($scope.searchModel.name){
				searchModel.name=$scope.searchModel.name;
			}
			if($scope.searchModel.phone){
				searchModel.phone=$scope.searchModel.phone;
			}
			//判断岗位查询范围
			if(currentUserId!=null){
				if(positionInfo()){
					var promise=LeadsStudentService.schoolList(start, number, tableState, searchModel)
					promise.then(function(response){
						$scope.studentsList=response.data;
						tableState.pagination.numberOfPages=response.numberOfPages;
					});
				}else{
					searchModel.currentUserId=currentUserId;
					var promise=LeadsStudentService.list(start, number, tableState, searchModel)
					promise.then(function(response){
						$scope.studentsList=response.data;
						tableState.pagination.numberOfPages=response.numberOfPages;
					});
				}
			}else{
				$scope.studentsList=[];
			}
		}
		
		function positionInfo(){
			if(localStorageService.get('positionName')==='优胜派校长'
				||localStorageService.get('positionName')==='科学派校长'
				||localStorageService.get('positionName')==='成长顾问主管'){
				return true;
			}else{
				return false;
			}
		}
		
		/**
		 * 根据筛选条件获取学生客户信息
		 */
		$scope.getStudentsByFilter=function(){
			$scope.getStudents($scope.studentTableState);
		}
		
		/**
		 * 获取所选学生或客户
		 */
		$scope.forwardExperience=function(){
            // 得到学生的id
            var index=''
            if(arguments.length==2){
                index=arguments[1]
                for (var i=0,max=$scope[arguments[0]].length;i<max;i++){
                    $scope[arguments[0]][i].selectTrue = i==index?true:false
                }
            }else{
                index=$("input[name='studentRadio']:checked").val();
            }
            if (index==undefined) {
                SweetAlert.swal('请选择要排课的学生');
                return;
            }
            //选择的学生或客户
            $scope.selectedStudent={};
            $scope.selectedStudent=$scope.studentsList[index];
            $scope.selectedStudent.courseName='体验课程';
            //弹窗创建体验课
            $scope.operationType=1;
            $scope.createModal=$mtModal.modal('partials/sos/class/experience/modal.classExperienceInfo.html?'+new Date().getTime(),$scope);
		}
		
		/**
		 * 展示选择班级弹窗
		 */
		$scope.showSelectClassView=function(){
			$scope.selectedClass={};
			$scope.selectClassModal=$mtModal.modal('partials/sos/class/experience/modal.selectClass.html',$scope);
		}
		
		/**
		 * 获取班级信息
		 */
		$scope.getClasses=function(tableState){
			$scope.pagination=tableState.pagination;
            $scope.start=$scope.pagination.start || 1;
            $scope.number=$scope.pagination.number || 10;
            var searchModel={};
            searchModel.start=$scope.start;
            searchModel.size=$scope.number;
            searchModel.schoolId=AuthenticationService.currentUser().school_id;
            searchModel.status=0;
            searchModel.classType=2;
            searchModel.isDeleted=0;
            searchModel.customCondition=" ORDER BY csc.start_time ASC ";
			var promise=ClassManagementService.getClassesByFilter(searchModel);
			promise.then(function(response){
				$scope.classesList=response.data.list;
				if($scope.selectedStudent.selectClassId){
					angular.forEach($scope.classesList, function(data, index, array){
						if(data.id===$scope.selectedStudent.selectClassId){
							data.selectTrue=true;
						}
					});
				}
				tableState.pagination.numberOfPages=response.data.pages;
			});
		}
		
		/**
		 * 获取所选班级
		 */
		$scope.backExperience=function(){
			//得到班级的id
			var index=''
				if(arguments.length==2){
					index=arguments[1]
					for (var i=0,max=$scope[arguments[0]].length;i<max;i++){
						$scope[arguments[0]][i].selectTrue = i==index?true:false
					}
				}else{
					index=$("input[name='classRadio']:checked").val();
				}
			if (index==undefined) {
				SweetAlert.swal('请选择要体验的班级');
				return;
			}
			//选择的学生或客户
			$scope.selectedClass=$scope.classesList[index];
			$scope.selectedStudent.selectClassName=$scope.selectedClass.name;
			$scope.selectedStudent.teacherName=$scope.selectedClass.teacherName;
			$scope.selectedStudent.selectClassId=$scope.selectedClass.id;
		}
		
		/**
		 * 选择班级
		 */
		$scope.submitSelectedClass=function(){
			if (!$scope.selectedStudent.selectClassId) {
				SweetAlert.swal('请选择要体验的班级');
				return;
			}
			$scope.selectClassModal.hide();
			$scope.getClassCoursePlans($scope.classCoursePlanTableState);
		}
		
		/**
		 * 获取班级的排课记录
		 */
		$scope.getClassCoursePlans=function(tableState){
			$scope.classCoursePlanTableState=tableState;
            var pagination=tableState.pagination;
            var start=pagination.start || 0;
            var number=pagination.number || 10;
            if($scope.selectedStudent.selectClassId){
            	if(!tableState.search.predicateObject){
            		tableState.search.predicateObject={};
            	}
            	tableState.search.predicateObject.class_id=$scope.selectedStudent.selectClassId;
            	if($scope.searchModel.start_time){
            		tableState.search.predicateObject.start_time=$scope.searchModel.start_time;
            	}
            	if($scope.searchModel.end_time){
            		tableState.search.predicateObject.end_time=$scope.searchModel.end_time;
            	}
            	var promise=CoursePlanService.Classrecordlist(start, number, tableState);
            	promise.then(function(response){
            		$scope.classCoursePlans=response.data;
        			if($scope.selectedStudent.supplementCoursePlanId){
        				angular.forEach($scope.classCoursePlans, function(data, index, array){
        					if(data.id===$scope.selectedStudent.supplementCoursePlanId){
        						data.selectTrue=true;
        					}
        				});
        			}
        			angular.forEach($scope.classCoursePlans, function(data, index, array){
    					//查询班级体验人数和体验点名人数
    					var searchModel={};
    					searchModel.isDeleted=0;
    					searchModel.supplementCrmStudentClassId=$scope.selectedStudent.selectClassId;
    					searchModel.supplementCoursePlanId=data.id;
    					searchModel.customCondition=' AND state<>3';
    					var promise = CrmStudentCourseAttendenceSupplementService.countStudents(searchModel);
    					promise.then(function(response){
    						data.experienceCount=response.data;
    					});
    					var searchModel2={};
    					searchModel2.isDeleted=0;
    					searchModel2.supplementCrmStudentClassId=$scope.selectedStudent.selectClassId;
    					searchModel2.supplementCoursePlanId=data.id;
    					searchModel2.state=1;
    					var promise = CrmStudentCourseAttendenceSupplementService.countStudents(searchModel2);
    					promise.then(function(response){
    						data.experiencedCount=response.data;
    					});
    				});
            		tableState.pagination.numberOfPages=response.numberOfPages;
            	});
            }else{
            	$scope.classCoursePlans=[];
            }
		}
		
		$scope.selectClassCoursePlan=function(){
			//得到班级的id
			var index=''
			if(arguments.length==2){
				index=arguments[1]
				for (var i=0,max=$scope[arguments[0]].length;i<max;i++){
					$scope[arguments[0]][i].selectTrue = i==index?true:false
				}
			}else{
				index=$("input[name='classCoursePlanRadio']:checked").val();
			}
			if (index==undefined) {
				SweetAlert.swal('请选择要的班级排课记录');
				return;
			}
			//选择的排课记录
			$scope.selectedClassCoursePlan=$scope.classCoursePlans[index];
		}

		/**
		 * 生成班级体验记录
		 */
		$scope.createClassExerience=function(student){
			if(student.classExperienceCount>=2){
				SweetAlert.swal('没有可排课次！');
				return;
			}
			if(student.classExperiencedCount>=2){
				SweetAlert.swal('没有剩余课次！');
				return;
			}
			if(!$scope.selectedClass){
				SweetAlert.swal('请选择班级');
				return;
			}
			if(!$scope.selectedClassCoursePlan||!$scope.selectedClassCoursePlan.id){
				SweetAlert.swal('请选择要的班级排课记录');
				return;
			}
			var addModel={};
			addModel.crmStudentId=student.crm_student_id;
			addModel.schoolId=student.school_id;
			addModel.absenceCrmStudentClassId=student.selectClassId;
			addModel.absenceCoursePlanId=$scope.selectedClassCoursePlan.id;
			addModel.supplementCrmStudentClassId=student.selectClassId;
			addModel.supplementCoursePlanId=$scope.selectedClassCoursePlan.id;
			var searchModel=angular.copy(addModel);
			searchModel.start=0;
			searchModel.size=1;
			searchModel.isDeleted=0;
			searchModel.customCondition=' AND a.state<>3';
			//查询是否已有当前班级的体验课程
			var promise=CrmStudentCourseAttendenceSupplementService.getPageList(searchModel);
			promise.then(function(response){
				if(response.data.total>0){
					SweetAlert.swal('已有相关班级的课程体验！', 'warn');
					return;
				}else{
					addModel.type=3;
					addModel.state=2; //待体验
					addModel.isCharging=0;
					var promise=CrmStudentCourseAttendenceSupplementService.create(addModel);
					promise.then(function(response){
						if(response.status==='SUCCESS'){
							$scope.createModal.hide();
							$scope.selectModal.hide();
							SweetAlert.swal('操作成功', 'success');
							$scope.getExperiencePageList($scope.classExperienceTableState);
						}else if(response.status==='FAILURE'){
							SweetAlert.swal('操作失败，请重试！', 'error');
							return;
						}
					});
				}
			});
		}
		
		/**
		 * 编辑弹窗
		 */
		$scope.showEditModal=function(row){
            $scope.selectedStudent=row;
            $scope.selectedStudent.selectClassName=row.className;
            $scope.selectedStudent.name=row.studentName;
            $scope.selectedStudent.belong_user_name=row.userName;
            $scope.selectedStudent.courseName='体验课程';
            $scope.selectedStudent.selectClassId=row.classId;
            //查询所选排课记录
            var tableState={};
            tableState.search={};
            var start=0;
            var number=1;
            if($scope.selectedStudent.selectClassId){
            	if(!tableState.search.predicateObject){
            		tableState.search.predicateObject={};
            	}
            	tableState.search.predicateObject.class_id=$scope.selectedStudent.selectClassId;
            	tableState.search.predicateObject.omsCoursePlanId=$scope.selectedStudent.supplementCoursePlanId;
            	if(tableState.search.predicateObject.omsCoursePlanId){
            		var promise=CoursePlanService.Classrecordlist(start, number, tableState);
            		promise.then(function(response){
            			$scope.selectedStudent.classCoursePlan=response.data[0];
            			//弹窗编辑体验课
            			$scope.operationType=2;
            			$scope.editModal=$mtModal.modal('partials/sos/class/experience/modal.classExperienceInfo.html?'+new Date().getTime(),$scope);
            		});
            	}
            }else{
            	SweetAlert.swal('班级信息有误！', 'error');
            	return;
            }
		}
		
		/**
		 * 编辑
		 */
		$scope.editClassExperience=function(student){
			if(!$scope.selectedStudent.selectClassName){
				SweetAlert.swal('请选择班级');
				return;
			}
			if(!$scope.selectedClassCoursePlan||!$scope.selectedClassCoursePlan.id){
				SweetAlert.swal('请选择要的班级排课记录');
				return;
			}
			student.absenceCrmStudentClassId=student.selectClassId;
			student.absenceCoursePlanId=$scope.selectedClassCoursePlan.id;
			student.supplementCrmStudentClassId=student.selectClassId;
			student.supplementCoursePlanId=$scope.selectedClassCoursePlan.id;
			var searchModel=angular.copy(student);
			searchModel.start=0;
			searchModel.size=1;
			//查询是否已有当前班级的体验课程
			var promise=CrmStudentCourseAttendenceSupplementService.getPageList(searchModel);
			promise.then(function(response){
				if(response.data.total>0){
					SweetAlert.swal('已有相关班级的课程体验！', 'warn');
					return;
				}else{
					var promise=CrmStudentCourseAttendenceSupplementService.update(student);
					promise.then(function(response){
						if(response.status==='SUCCESS'){
							$scope.editModal.hide();
							SweetAlert.swal('操作成功', 'success');
							$scope.getExperiencePageList($scope.classExperienceTableState);
						}else if(response.status==='FAILURE'){
							SweetAlert.swal('操作失败，请重试！', 'error');
							return;
						}
					});
				}
			});
		}
		
		/**
		 * 取消体验
		 */
		$scope.cancelClassExperience=function(row){
			SweetAlert.swal({
                title: "是否确认取消体验课？",
                type: null,
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: true
            },function (confirm){
                if(confirm){
                	row.state=3;
                	var promise=CrmStudentCourseAttendenceSupplementService.update(row);
        			promise.then(function(response){
	        			if(response.status==='SUCCESS'){
	        				$scope.getExperiencePageList($scope.classExperienceTableState);
	        			}else if(response.status==='FAILURE'){
	    					SweetAlert.swal('操作失败，请重试！', 'error');
	    					return;
	    				}
        			});
                }
            });
		}
		
		$scope.resetSelect=function(){
			$scope.searchModel={};
		}

        /**
         * 改变查询更多按钮
         */
        $scope.selectMoreText = '更多查询条件'
        $scope.changeSelectMore = function(flag) {
            if(arguments[1]){
                $scope.selectMore = !$scope.selectMore
                $scope.selectMoreText = $scope.selectMore?'收起查询条件':'更多查询条件'
            }else {
                $scope.selectMore = flag
                $scope.selectMoreText = flag?'收起查询条件':'更多查询条件'
            }
            // angular.element('#body').scroll()
            setTimeout(function () {
                resatList()
            },100)
        }

    }
]);