'use strict';
/**
 * The order data management controller.OrderAddController
 * @author sunqc@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('OrderDataManagementController',['$scope', '$location','$routeParams','$modal', '$rootScope',
        'FileUploader','$base64','SweetAlert','localStorageService','OrderService','CommonService','LeadsStudentService','AuthenticationService',
    function($scope,$location,$routeParams, $modal, $rootScope,FileUploader,$base64, SweetAlert,
             localStorageService,OrderService,CommonService,LeadsStudentService,AuthenticationService) {
        $scope.editDataOrder = editDataOrder;
        $scope.subjectIds = [{name:'语文',id:1},{name:'英语',id:2}];
        $scope.gradeIds = [{name:'小学一年级',id:1},{name:'小学二年级',id:2}];
        $scope.leadGradeIds = [{name:'小学一年级',id:1},{name:'小学二年级',id:2}];
        $scope.courseTypeIds = [{name:'全优课程',id:1},{name:'金牌课程',id:2}];
        $scope.orderTypeSelect = [{name:'新签',id:1},{name:'续费',id:2},{name:'返课',id:3}];
        $scope.orderStatusSelect =  [{name:'录入订单',id:1},{name:'支付定金',id:2},{name:'审核通过',id:3},{name:'审核未通过',id:4},{name:'已退单',id:5}];
        $scope.orderNo;
        $scope.order={};
        $scope.order.ratioInvalid=false;
        $scope.orderSearch={};
        $scope.studentId=0;
        $scope.studentName='';
        $scope.changePlanAvailable = changePlanAvailable;

        /**
         * 更改剩余课时的数量
         * @returns
         */
        function changePlanAvailable(orderCourse){
        	if(orderCourse.courseBuyUnit == 3){
        		orderCourse.originalNumActual = orderCourse.originalNum * orderCourse.regularTimes;
        		orderCourse.courseNum =  parseInt(orderCourse.originalNum,10) * orderCourse.regularTimes;
        	}else{
        		orderCourse.courseNum =  parseInt(orderCourse.originalNum,10) ;
        	}
        }
        
        function editDataOrder(obj) {
            obj.contractStartDate = new Date(obj.contractStartDate);
            obj.contractEndDate = new Date(obj.contractEndDate);
            $scope.order = angular.copy(obj);
            $scope.modalTitle = '修改';
            if($scope.order.orderCategory == 2 ){
            	$scope.editDataOrderModal = $modal({scope: $scope, templateUrl: 'partials/sos/order/updateDataO2O.html', show: true });
            }else{
                $scope.editDataOrderModal = $modal({scope: $scope, templateUrl: 'partials/sos/order/updateData.html', show: true });
            }
            $scope.getOrderCourses();
            $scope.getOrderAchievementRatios();//获取订单的业绩比例
            $scope.callServerOrderCourseSelect();
            $scope.getCustomerBelongersSelect();
        }

        $scope.studentFilter = {};
        $scope.studentList =  [];
        $scope.studentListTableState = {};
        $scope.studentListFirst = false;
        $scope.currentPagination = {};

        //初始化订单中包含的课程相关总计信息(总课时 总金额)
        $scope.initData = function initData(){
            $scope.order.totalOriginalNum=0;
            $scope.order.totalPrice=0;
            $scope.order.supplementaryFee=0;
            angular.forEach($scope.order.orderCourses, function(data,index,array){
                $scope.order.totalOriginalNum= $scope.order.totalOriginalNum+data.originalNum;
                $scope.order.totalPrice = $scope.order.totalPrice+(data.originalNum *data.actualPrice );
            });
        };

        //获取转课订单列表信息
        $scope.getCustomerOrderTransferOrders = function getCustomerOrderTransferOrders() {
            OrderService.getCustomerOrderTransferOrders($scope.order.agreementNo).then(function (result) {
                $scope.orderTransferOrders = result.data;
            });
        };
  　　

        //获取订单下的全部课程列表信息
        $scope.callServerOrderCourse = function callServerOrderCourse(tableState) {
            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            OrderService.getPageOfOrderCourse($scope.start, $scope.number,$scope.orderNo, tableState).then(function (result) {
                $scope.orderCourses = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        };

        /**
         * 获取订单的业绩分配比例
         */
        $scope.getOrderAchievementRatios = function getOrderAchievementRatios(){
        	OrderService.getOrderAchievementRatios($scope.order.id,0).then(function (result){
        		$scope.order.achievementRatios = result.data; 
        		if($scope.order.achievementRatios.length >　0){
        			for(var i = 0 ;i<$scope.order.achievementRatios.length;i++){     
        				$scope.order.achievementRatios[i].position = {};
        				$scope.order.achievementRatios[i].position.id = $scope.order.achievementRatios[i].positionId;
        				$scope.order.achievementRatios[i].position.postionName = $scope.order.achievementRatios[i].positionName;
        			}
        		}
        	})
        }

        $scope.getCustomerBelongersSelect = function getCustomerBelongersSelect() {
            OrderService.getCustomerBelongersSelect().then(function (result) {
                $scope.customerBelongers = result.data;
            });
        };

        //订单的课程信息列表
        $scope.getOrderCourses = function getOrderCourses() {
            OrderService.getOrderCourses($scope.start, $scope.number,$scope.order.orderNo,$scope.order.crmStudentId).then(function (result) {
                $scope.order.orderCourses = result.data;
                $scope.order.orderCoursesNew=[];
                angular.forEach($scope.order.orderCourses, function(data,index,array){
                    data.courseNumOld=data.courseNum;
                    data.planAvailableNumOld=data.planAvailableNum;
                    $scope.order.orderCoursesNew.push(data);
                });
                $scope.order.orderCourses = $scope.order.orderCoursesNew;

                //根据student 获取客户试听的教师列表
                OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                    $scope.Teachers = result.data;
                    $scope.initData();
                });

            });
        };

        $scope.getOrderCoursesUpdate = function getOrderCoursesUpdate() {
            OrderService.getOrderCourses($scope.start, $scope.number,$scope.order.orderNo,$scope.order.crmStudentId).then(function (result) {
                $scope.order.orderCourses = result.data;
                $scope.initData();
            });
        };

        //订单的缴费记录信息列表
        $scope.getOrderPayments = function getOrderPayments() {
            OrderService.getOrderPayments($scope.start, $scope.number,$scope.order.orderNo).then(function (result) {
                $scope.orderPayments = result.data;
            });
        };

        //获取课程类型 年级 科目 下拉菜单
        $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
            OrderService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
                $scope.leadGradeIds = result.data;
            });
            OrderService.getCourseTypeIdSelect().then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };

           　
            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
                $scope.order.orderCourses.pop(obj);
            };

            //刷新列表
            $scope.refreshTabs = function refreshTabs(){
                if(typeof($scope.tableState)!='undefined'){
                    $scope.callServerOneTab($scope.tableState);
                }

            }

            //普通订单
            $scope.callServerOneTab = function callServerOneTab(tableState) {
                var promise = OrderService.masterSlaveRelation();
                promise.then(function(result){
                    $scope.masterSlaveRelation=result;
                })
                $scope.isLoading = true;
                $scope.orderFlag = 1;
                if(!tableState){
                    tableState ={
                        pagination:{},
                        search:{
                            predicateObject:{}
                        }

                    }
                }
                $scope.tableState = tableState;
                $scope.pagination = tableState.pagination;
                $scope.predicateObject = tableState.search.predicateObject;
                $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
                OrderService.getDataPage($scope.start, $scope.number,$scope.orderFlag, $scope.predicateObject).then(function (result) {
                    $scope.oneOrders = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;
                });
            };

            CommonService.getMediaChannel(0).then(function (result) {
                //alert("getMediaChannel");
                $scope.mediaChannel1List = result.data;
            });

            $scope.orderMediaChannel1Change = function orderMediaChannel1Change(){
                if($scope.predicateObject && $scope.predicateObject.mediaChannelId2){
                    $scope.predicateObject.mediaChannelId2 = null;
                }

                if($scope.predicateObject && $scope.predicateObject.mediaChannelId1){
                    $scope.predicateObject.mediaChannelId1 = "number:"+$scope.order.mediaChannelId1;
                }
                //console.log($scope.mediaChannel1List);
                if($scope.order.mediaChannelId1){
                    CommonService.getMediaChannel($scope.order.mediaChannelId1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                        //alert("$scope.mediaChannel2List"+$scope.mediaChannel2List);
                    });
                }else{
                    $scope.mediaChannel2List = [];
                }
            }
            /** order management end **/
            ;(function init(){
                //$scope.leadsRepeatAlert = false;
                if(check_null($routeParams.type) && !$scope.modalForStudentList){
                    $scope.showStudentListModal();//打开 添加订单 medal
                }
            })();
            /**
    	     * 进行添加业绩计算比例的操作
    	     */
    	    $scope.showAddAchievementRatio = function showAddAchievementRatio(){
    	    	$scope.modalAchieveTitle = '选择员工和角色';
    	    	$scope.order.achievementRatio = {};
    	    	$scope.order.achievementRatio.departmentId = AuthenticationService.currentUser().school_id;
    	    	$scope.order.achievementRatio.departName = AuthenticationService.currentUser().department.name;
    	    	$scope.operateRatio = "add";
    	    	$scope.achieveRatioModal = $modal({
    	    		scope:$scope,
    	    		templateUrl:'partials/sos/order/modal.addAchievementRatio.html',
    	    		show:true        		
    	    	});
    	    }
    	    
    	   
    	    //编辑比例
    		$scope.showEditRatio  = function showEditRatio(row){
    			$scope.modalAchieveTitle = '更改员工和角色';
    			$scope.order.achievementRatio = angular.copy(row);
    			$scope.operateRatio = "update";
    	    	$scope.achieveRatioModal = $modal({
    	    		scope:$scope,
    	    		templateUrl:'partials/sos/order/modal.addAchievementRatio.html',
    	    		show:true     		
    	    	});
    		}
    		
    	    // 改变列表中的比例
    	    $scope.changeRatio = function changeRatio(row){
    	    	var totalRatio = 0;
    	    	var achievementRatios = angular.copy($scope.order.achievementRatios);
    	    	for(var i = 0; i<$scope.order.achievementRatios.length;i++){
    	    		if(row.userId != achievementRatios[i].userId){
    	    			totalRatio = Number(achievementRatios[i].achievementRatio) + Number(totalRatio);
    	    		}
    	    	}
    	    	var totalRatioNew = Number(row.achievementRatio) + Number(totalRatio);
    	    	if(totalRatioNew != 1){
    	    		SweetAlert.swal("所有员工业绩计算比例之和必须为100%");
    	    		$scope.order.ratioInvalid = true;
    	    	}else{
    	    		$scope.order.ratioInvalid = false;
    	    	}
    	    }
    	    /*$scope.$watch('order.achievementRatio',function(newValue,oldValue){
    	    	console.log(newValue,oldValue)
    	    })*/
    	    
    	    /**
    		 * 删除某条业绩比例表
    		 */
    	    $scope.removeRatio = function removeRatio(row) {
    			SweetAlert.swal({
    	              title: "确定要删除吗？",
    	              type: "warning",
    	              showCancelButton: true,
    	              confirmButtonText: '确定',
    	              cancelButtonText: '取消',
    	              closeOnConfirm: true
    	          }, function (confirm) {
    	              if (confirm) {
    	                  _deleteRatio(row);
    	              }
    	          }
    	       );
    	    }
    	
    	  /**
    	   * 删除业绩比例信息
    	   * @param list
    	   * @private
    	   */
    	  function _deleteRatio(row) {
    		  var userId = row.userId;
    		  var totalRatio = 0;
    	      var achievementRatios = angular.copy($scope.order.achievementRatios);
    	      
    	      // 删除当前排课列表
    	      for (var j = 0; j < achievementRatios.length; j++) {
    	          if (achievementRatios[j].userId == userId) {
    	              $scope.order.achievementRatios.splice(j, 1);
    	          }
    	      }
    	      // 删除后判断现有的 比例之和是否是1，不是1 不合法
    	      for(var i = 0;i < $scope.order.achievementRatios.length;i++){
    	    	  totalRatio = Number(achievementRatios[i].achievementRatio) + Number(totalRatio);
    	      }
    	      if(totalRatio != 1){
    	    	  $scope.order.ratioInvalid = true;
    	      }else{
    	    	  $scope.order.ratioInvalid = false;
    	      }
    	  }

        }
    ]).controller('OrderDataUpdateController', ['$scope', '$modal', '$rootScope', 'SweetAlert','OrderService','CommonService',
        function($scope, $modal, $rootScope, SweetAlert,OrderService,CommonService) {
            $scope.orderTypeSelect = [{name:'新签',id:1},{name:'续费',id:2},{name:'返课',id:3},{name:'推荐',id:5},{name:'线上O2O',id:7}];
            $scope.isCourseAuditionSelect = [{name:'是',id:1},{name:'否',id:0}];
            $scope.onIsAuditionSelect = function onIsAuditionSelect() {
                $scope.order.orderCoursesNew=[];
                angular.forEach($scope.order.orderCourses, function(data,index,array){
                    if($scope.order.isAudition == 1){
                        data.isAudition=1;
                    }else{
                        data.isAudition=0;
                    }
                    $scope.order.orderCoursesNew.push(data);
                });
                $scope.order.orderCourses=$scope.order.orderCoursesNew;
            };

            $scope.$on("arrangeCourse", function (event, rows) {
                    if (rows.length > 50) {
                        SweetAlert.swal("课程最多50条");
                        return;
                    }
                    if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                        if (rows.length + $scope.order.orderCourses.length > 50) {
                            SweetAlert.swal("课程最多50条");
                            return;
                        }
                    }

                    if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                        var temGradeId = $scope.order.orderCourses[0].gradeId;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].gradeId != temGradeId) {
                                SweetAlert.swal("课程年级不一致");
                                return;
                            }
                        }
                    }

                    if ($scope.order.orderCourses && $scope.order.orderCourses.length > 0) {
                        for (var i = 0; i < $scope.order.orderCourses.length; i++) {
                            for (var j = 0; j < rows.length; j++) {
                                if ($scope.order.orderCourses[i].courseId == rows[j].courseId && $scope.order.orderCourses[i].subjectId == rows[j].subjectId) {
                                    SweetAlert.swal($scope.order.orderCourses[i].courseTypeName + "已存在列表中");
                                    return;
                                }
                            }
                        }
                    }

                    for (var i = 0; i < rows.length; i++) {
                        $scope.order.orderCourses.push(rows[i]);
                    }
                }
            );

            //修改课时
            //修改课时
            $scope.conductOrderCourseId = [];
            $scope.changeCourseNum = function changeCourseNum(obj) {
                //console.log(obj.courseNumOld+":"+obj.courseNum+":"+obj.id+":"+obj.planAvailableNum);
                //;alert(obj.courseNum == obj.courseNumOld);
                if(obj.planAvailableNumOld){
                    obj.planAvailableNum = obj.planAvailableNumOld;
                }
                if(obj.courseNum == obj.courseNumOld){
                    return;
                }else{
                    obj.ext = '修改订单课程课时:id='+obj.id
                        +';'+obj.courseNumOld+'--->'+obj.courseNum;
                    if(obj.courseNum <  obj.courseNumOld - obj.planAvailableNum){
                       /* SweetAlert.swal({ title: "学管已经在系统中对该学员排了多于当前订单剩余课时的数量,点击保存确认修改该剩余课时，学员在该课程下的排课记录将会删除，学管可以按正确的课时重新排课。",
                                text: "", type: false, showCancelButton: true,
                                confirmButtonColor: "#DD6B55", confirmButtonText: "确认", cancelButtonText: "取消",
                                closeOnConfirm: true, closeOnCancel: true },
                            function(isConfirm){
                                if(isConfirm) {
                                    OrderService.deleteCoursePlanByOrderCourseId(obj.id).then(function (result) {
                                        obj.planAvailableNum =obj.courseNum;
                                    });

                                }else {
                                    obj.courseNum =obj.courseNumOld;
                                }
                            });*/
                    	$scope.conductOrderCourseId.push(obj.id);
                    	SweetAlert.swal("学管已经在系统中对该学员排了多于当前订单剩余课时的数量,点击保存确认修改该剩余课时，学员在该课程下的排课记录将会删除，学管可以按正确的课时重新排课。");
                    }else if(obj.courseNum >=  obj.courseNumOld - obj.planAvailableNum){
                        var changeNum = obj.courseNumOld - obj.courseNum;
                        obj.planAvailableNum = obj.planAvailableNum - (changeNum );
                    }

                }
            };

            $scope.getProductIdSelect = function getProductIdSelect() {
                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIds = result.data;
                });
                $scope.subjectIds = [];
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
            }();

            $scope.getSubjectIdSelect = function getProductIdSelect() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
            }();

            $scope.onProductIdSelect = function onProductIdSelect() {
                $scope.gradeIds = [];
                $scope.courseTypeIds = [];
                var params = {};
                params.productId = $scope.productId;
                //CommonService.getCourseTypeIdSelect(params).then(function (result) {
                //    $scope.courseTypeIds = result.data;
                //});
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
                $scope.gradeIds = [];
                var params = {};
                params.courseTypeId = $scope.courseTypeId;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIds = result.data;
                });
            };


            $scope.courseProperty=1;
            //订单新增课程信息
            $scope.addOrderCourse = function addOrderCourse() {
                //根据student 获取客户试听的教师列表
                OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                    $scope.Teachers = result.data;
                });

                if($scope.productId ==null ||$scope.gradeId ==null ||$scope.subjectId== null ||$scope.courseTypeId== null ||  $scope.originalNum ==null){
                    SweetAlert.swal('添加失败', '请选择全部条件重试');
                    return false;
                }

                if($scope.order && $scope.order.orderCourses && $scope.order.orderCourses.length >0  && $scope.order.orderCourses[0].gradeId && $scope.order.orderCourses[0].gradeId != $scope.gradeId){
                    SweetAlert.swal('添加失败', '订单中课程年级必须一致');
                    return false;
                }

                var originalNumNew = $scope.originalNum;
                OrderService.getOrderCourse($scope.productId,$scope.courseTypeId,$scope.gradeId,$scope.subjectId ).then(function (result) {
                    var subjectName = "";
                    angular.forEach($scope.subjectIds, function(data,index,array){
                        if($scope.subjectId == data.id){
                            subjectName =  data.name;
                        }
                    });

                    if($scope.subjectId == zengKeSubjectFlag){
                        $scope.courseProperty=2;
                    }else{
                        $scope.courseProperty=1;
                    }
                    var courseBuyUnit = null;
                    var course = result.data;
                    if(course.isRegularCharge){
                    	courseBuyUnit = 3;
                    }else if(!course.isRegularCharge && course.courseUnit == 1){
                    	courseBuyUnit = 1;
                    }else if(!course.isRegularCharge && course.courseUnit == 2){
                    	courseBuyUnit = 2;
                    }
                    var orderCourse ={'originalNum':Number(originalNumNew),'courseId':result.data.id,
                        'gradeId':result.data.gradeId,
                        'courseTypeId':result.data.courseTypeId,
                        'subjectId':$scope.subjectId,
                        'gradeName':result.data.gradeName,
                        'courseTypeName':result.data.courseTypeName,
                        'subjectName':subjectName,
                        'standardPrice':result.data.standardPrice,
                        'actualPrice':0,
                        'teacherId':result.data.teacherId,
                        'isAudition':$scope.order.isAudition,
                        'isCourseAudition':$scope.order.isAudition,
                        'courseNum':Number(originalNumNew),
                        'courseProperty':$scope.courseProperty,
                        'courseUnit':result.data.courseUnit,
                        'isRegularCharge':result.data.isRegularCharge,
                        'regularTimes':result.data.regularTimes,
                        'courseBuyUnit':courseBuyUnit
                        
                    };
                    $scope.order.orderCourses.push(orderCourse);
                    $scope.order.totalOriginalNum= (parseInt(originalNumNew)+parseInt($scope.order.totalOriginalNum));
                    $scope.order.totalPrice = $scope.order.totalPrice+(originalNumNew *0 );
                    orderCourse = null;
                    $scope.subjectId = null;
                });
                $scope.gradeId =null;
                $scope.courseTypeId = null;
                $scope.gradeName =null;
                $scope.subjectName = null;
                $scope.courseTypeName = null;
                $scope.productId = null;
                $scope.originalNum=null;
            };

            //获取课程类型 年级 科目 下拉菜单
            $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
                OrderService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });
                OrderService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                OrderService.getCourseTypeIdSelect().then(function (result) {
                    $scope.courseTypeIds = result.data;
                });
            };

            //订单删除课程信息
            $scope.delOrderCourse = function delOrderCourse(obj) {
                $scope.order.totalOriginalNum= $scope.order.totalOriginalNum-obj.originalNum;
                $scope.order.totalPrice = $scope.order.totalPrice-(obj.originalNum *obj.actualPrice );
                $scope.order.orderCoursesNew=[];
                angular.forEach($scope.order.orderCourses, function(data,index,array){
                    if(data.$$hashKey != obj.$$hashKey){
                        $scope.order.orderCoursesNew.push(data);
                    }
                });
                $scope.order.orderCourses=$scope.order.orderCoursesNew;
            };

            $scope.updateDataOrder = function updateDataOrder() {
                if($scope.order.orderNo == ''){
                    $scope.order.orderNo=null;
                }
                // $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                // if($scope.order.contractEndDate < $scope.order.contractStartDate){
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }

                if($scope.order.orderCourses.length == 0){
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                if($scope.order.payDueAmount<0){
                    $scope.order.payDueAmount=0;
                }
                
                //剩余课时不能大于总课时
                var courseHourOver = false;
                angular.forEach($scope.order.orderCourses, function(data,index,array){
                	if(data.courseNum>data.originalNumActual){
                		courseHourOver = true;
                	}
                });
                if(courseHourOver){
                	SweetAlert.swal('剩余课时不能大于原始课时!');
                    return false;
                }
             
                $scope.order.realTotalAmount=$scope.order.totalPrice-$scope.order.privilegeAmount;
                $scope.order.payDueAmount=$scope.order.totalPrice-$scope.order.privilegeAmount-$scope.order.realPayAmount - $scope.order.supplementaryFee;
                var promise = OrderService.editData($scope.order,$scope.conductOrderCourseId);
                promise.then(function(data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.editDataOrderModal.hide();
                    if( !($scope.modal === undefined ) ){
                        $scope.modal.hide();
                    }
                    $scope.refreshTabs();
                }, function(error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.editDataOrderModal.hide();
                });
                
            }
            
        }
    ])

;

