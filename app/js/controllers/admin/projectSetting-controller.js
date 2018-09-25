'use strict';

/**
 * The projectSetting controller.
 * @version 1.0
 */
angular.module('ywsApp').controller('ProjectSettingController', [
	'$scope', '$mtModal','$modal', '$filter', '$rootScope', 'SweetAlert', 'ProjectSettingService','CommonService',
	function($scope, $mtModal,$modal, $filter, $rootScope, SweetAlert, ProjectSettingService,CommonService) {
		// 方法声明
		$scope.save = save;
		$scope.getProjectSettings = getProjectSettings;
		$scope.setSelectedProductSetting = setSelectedProductSetting;
		$scope.addProjectSetting = addProjectSetting;
		$scope.toggleSubject = toggleSubject;
		$scope.containsSubject = containsSubject;
		$scope.containsSubjectOnload = containsSubjectOnload;
		$scope.editProjectSetting = editProjectSetting;
		$scope.remove = remove;

		// 科目配置
		$scope.editSubject = editSubject;
		$scope.saveSubject = saveSubject;
		$scope.removeSubject = removeSubject;
		$scope.getSubjectList = getSubjectList;
		
		// 项目参数设置model
		$scope.projectSetting = {};
     	$scope.subject = {};
     	
		/**
		 * 添加项目配置 type：1：添加项目配置 2：添加科目配置
		 */
		function addProjectSetting(type){
			//添加项目
			if(type == 1){
				$scope.projectSetting = {};
				CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjects = result.data;
                    $scope.modalTitle = '添加项目';
                    $scope.addProjectSettingModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/admin/modal.projectSetting.html',
                        show: true,
                        backdrop: "static"
                    });
                });  
			}else if (type == 2){
				$scope.subject = {};
				$scope.modalTitle = '添加科目';
                $scope.addSubjectModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/admin/modal.subject.html',
                    show: true,
                    backdrop: "static"
                });
			}
		}
		/**
         * table选择
         * @param arg
         */
        $scope.isSelectedProductSetting = 1
        function setSelectedProductSetting(arg){
            $scope.isSelectedProductSetting = arg
        }
		/**
		 * 查询项目参数设置列表
		 */
		function getProjectSettings (tableState){
			$scope.projectSettingTableState = tableState;
			// 分页信息
			$scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            // 查询参数
            var searchModel = {};
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
          
            searchModel.isDeleted = 0;
            $scope.isProjectSettingLoading = true;
            var promise =ProjectSettingService.getProjectSettingByFilter(searchModel);
            promise.then(
                function (response) {
                	if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.projectSettingList = response.data.list;
                        //传分页参数
                        $scope.projectSettingTableState.pagination.numberOfPages = response.numberOfPages;
                        $scope.isProjectSettingLoading = false;
                    }
                }
            );
		}
		
		/**
		 * 保存项目参数设置
		 */
		function save(){
			var searchModel = {};
            searchModel.start = 1;
            searchModel.size = 1;
            searchModel.isDeleted = 0;
            searchModel.projectName = $scope.projectSetting.projectName;
            if($scope.projectSetting.id!=null){
            	searchModel.customCondition = ' AND id <> ' + $scope.projectSetting.id + '';
            }
            var promise =ProjectSettingService.getProjectSettingByFilter(searchModel);
            promise.then(function(response){
            	if(response.data.total>0){
            		SweetAlert.swal('已存在相同的项目名称');
            		return;
                }else{
                	// 若没有科目,请选择科目
                	if(!$scope.projectSetting.projectSubjects || $scope.projectSetting.projectSubjects.length == 0){
                		SweetAlert.swal('请选择关联的科目');
                		return ;
                	}
                	if($scope.projectSetting.id){
        				var promiseNew = ProjectSettingService.update($scope.projectSetting);		
        			}else{
        				var promiseNew = ProjectSettingService.create($scope.projectSetting);
        			}
        			promiseNew.then(function(result){
        				SweetAlert.swal('操作成功');
                        $scope.addProjectSettingModal.hide();
                        //刷新列表
                        getProjectSettings($scope.projectSettingTableState);
        			}, function (error) {
                        SweetAlert.swal('操作失败');
                        $scope.addProjectSettingModal.hide();
                   })
                }
            },function(error){
            	SweetAlert.swal('根据名称查询失败');
            })
			
		}
		/**
		 * 编辑项目参数配置
		 */
		function editProjectSetting(row){
			$scope.projectSetting = angular.copy(row);
			CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjects = result.data;
                $scope.modalTitle = '添加项目';
                $scope.addProjectSettingModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/admin/modal.projectSetting.html',
                    show: true,
                    backdrop: "static"
                });
            });
		}
		var modalObj = {
	            status:1,
	            text:'',
	            scope:$scope,
	    }
		/**
		 * 删除项目配置
		 */
		function remove(row){
			$scope.projectSetting = angular.copy(row);
       	 	$mtModal.moreModal({
       		  scope:$scope,
                 status:0, //状态参数1:成功，0：失败;
                 text:'确定要删除吗?',    //提示内容,默认为'操作成功';
                 hasNext:function(){
                	// 判断该项目是否已经被应用，若有关联，则无法进行删除
                	 
                	var promise = ProjectSettingService.deleteProjectSetting($scope.projectSetting);
         			promise.then(function(result){
         				
         				if(result.status == "SUCCESS"){
         					if(result.data == "cannotDelete"){
         						modalObj.text= '该项目已被应用,不允许被删除';
                                $mtModal.moreModal(modalObj) 
         					}else{
         						modalObj.text= '操作成功';
                                $mtModal.moreModal(modalObj) 
                                //刷新列表
                                getProjectSettings($scope.projectSettingTableState);
         					}
         				}else{
         					modalObj.text= '操作失败';
                            $mtModal.moreModal(modalObj) 
         				}
         		
         			}, function (error) {
         				modalObj.text= '操作失败';
                        $mtModal.moreModal(modalObj) 
                    })
               	 
                 },
            })
			
		}
		
		/**
		 * 选择科目
		 */
		function toggleSubject(subject) {
            if (containsSubject(subject)) {
                angular.forEach($scope.subjects.id, function(p, index) {
                    if (p == subject.id) {
                        $scope.subjects.id.splice(index, 1);
                        return;
                    }
                });
            }else{
                if(!$scope.subjects.id){
                    $scope.subjects.id = [];
                }
                $scope.subjects.id.push(subject.id);
            }
            $scope.projectSetting.projectSubjects = $scope.subjects.id.join(",");
            console.log($scope.projectSetting.projectSubjects);
        }
        /**
         * 判断是否包含
         */
		function containsSubject(subject) {
            var found = false;
            if ($scope.projectSetting.projectSubjects) {
                var idAll = $scope.projectSetting.projectSubjects;
                if(idAll != undefined){
                    $scope.subjects.id = idAll.split(",");
                    angular.forEach($scope.subjects.id, function(p) {
                        if (p == subject.id) {
                            found = true;
                        }
                    });
                }
            }
            return found;
        }
		
		function containsSubjectOnload(subject) {
            var found = false;
            $scope.subjects.id = [];
            if ($scope.projectSetting.projectSubjects) {
                var idAll = $scope.projectSetting.projectSubjects;
                if(idAll != undefined){
                    $scope.subjects.id = idAll.split(",");
                    angular.forEach($scope.subjects.id, function(p) {
                        if (p == subject.id) {
                            found = true;
                        }
                    });
                }
            }
            return found;
	    }
		//***************************************科目配置方法*****************************************//
		/**
		 * 查询科目列表
		 */
		function getSubjectList(tableState){
			$scope.subjectTableState = tableState;
			// 分页信息
			$scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            // 查询参数
            var searchModel = {};
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.isDelete = 0;
            
            $scope.isSubjectListLoading = true;
            var promise =ProjectSettingService.getSubjectsList(searchModel);
            promise.then(
                function (response) {
                	if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.subjectList = response.data.list;
                        //传分页参数
                        $scope.subjectTableState.pagination.numberOfPages = response.numberOfPages;
                        $scope.isSubjectListLoading = false;
                    }
                }
            );
		}
		
		/**
		 * 删除科目
		 */
		function removeSubject(row){
			$scope.subject = angular.copy(row);
       	 	$mtModal.moreModal({
       		  scope:$scope,
                 status:0, //状态参数1:成功，0：失败;
                 text:'确定要删除吗?',    //提示内容,默认为'操作成功';
                 hasNext:function(){
                	var promise = ProjectSettingService.deleteSubject($scope.subject);
         			promise.then(function(result){
         				if(result.status == "SUCCESS"){
         					if(result.data == "cannotDelete"){
         						modalObj.text= '该科目已被应用,不允许被删除';
                                $mtModal.moreModal(modalObj) 
         					}else{
         						modalObj.text= '操作成功';
                                $mtModal.moreModal(modalObj) 
                                //刷新列表
                                getSubjectList($scope.subjectTableState);
         					}
         				}else{
         					modalObj.text= '操作失败';
                            $mtModal.moreModal(modalObj) 
         				}
         			}, function (error) {
         				modalObj.text= '操作失败';
                        $mtModal.moreModal(modalObj) 
                    })
                 },
            })
		}
		/**
		 * 编辑科目
		 */
		function editSubject(row){
			$scope.subject = angular.copy(row);
			if($scope.subject.orderId == 999999999){
				$scope.subject.orderId = "";
			}
            $scope.modalTitle = '编辑科目';
            $scope.addSubjectModal = $modal({
                scope: $scope,
                templateUrl: 'partials/admin/modal.subject.html',
                show: true,
                backdrop: "static"
            });
            
		}
		/**
		 * 保存科目
		 */
		function saveSubject(){
			var searchModel = {};
            searchModel.start = 1;
            searchModel.size = 1;
            searchModel.isDeleted = 0;
            searchModel.name = $scope.subject.name;
            if($scope.subject.id!=null){
            	searchModel.customCondition = ' AND id <> ' + $scope.subject.id + '';
            }
            var promise =ProjectSettingService.getSubjectsList(searchModel);
            promise.then(
                function (response) {
                	if(response.data.total>0){
                		SweetAlert.swal('已存在相同的科目名称');
                		return;
                    }else{
                    	if($scope.subject.id){
            				var promise = ProjectSettingService.updateSubject($scope.subject);		
            			}else{
            				var promise = ProjectSettingService.createSubject($scope.subject);
            			}
            			promise.then(function(result){
            				SweetAlert.swal('操作成功');
                            $scope.addSubjectModal.hide();
                            //刷新列表
                            getSubjectList($scope.subjectTableState);
            			}, function (error) {
                            SweetAlert.swal('操作失败');
                            $scope.addSubjectModal.hide();
                        });
                    }
           });			
		}
		
	}
]);