a.controller('OrderAddTopupController', ['$scope', '$mtModal', '$timeout', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'AuthenticationService',
    'CrmChargingSchemeService', 'CustomerStudentService', 'CoursePlanService', 'LeadsStudentService', 'CustomerStudentCourseService', 'localStorageService',
    function ($scope, $mtModal, $timeout, $modal, $rootScope, SweetAlert, OrderService, CommonService, AuthenticationService, CrmChargingSchemeService, CustomerStudentService
        , CoursePlanService, LeadsStudentService, CustomerStudentCourseService, localStorageService) {
        $scope.orderTypeSelect = [{ name: '新签', id: 1 }, { name: '续费', id: 2 }, { name: '返课', id: 3 }, { name: '推荐', id: 5 }, { name: '赠课', id: 8 }];
        $scope.isCourseAuditionSelect = [{ name: '是', id: 1 }, { name: '否', id: 0 }];
        if ($scope.order.recharge == undefined) {
            $scope.order.recharge = {};
        }
        $scope.order.recharge.orderCourses = [];
        // 定义业绩的对象
        $scope.order.recharge.achievementRatios = [];
        $scope.order.recharge.achievementRatio = {};
        // 定义交费记录数组
        $scope.order.recharge.crmorderPayments = [];
        $scope.order.ratioInvalid = false;
        $scope.order.recharge.totalOriginalNum = 0;
        $scope.order.recharge.totalPrice = 0;
        $scope.order.recharge.originalNum = 0;
        $scope.order.rechargeNoExist = false;
        $scope.order.recharge.name = $scope.order.name;
        $scope.order.recharge.accountBalance = $scope.order.accountBalance;
        $scope.order.recharge.totalPrice = $scope.order.totalPrice;
        $scope.order.recharge.gradeId = $scope.order.gradeId;
        $scope.order.recharge.crmStudentId = $scope.order.crmStudentId;

        //获取课程类型 年级 科目 下拉菜单
        $scope.callServerOrderCourseSelect2 = function callServerOrderCourseSelect2() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.leadGradeIds = result.data;
            });
        }();


        $scope.clearOrderNo = function clearOrderNo() {
            if ($scope.order.nakedContract) {
                $scope.order.orderNo = null;
                $scope.order.recharge.orderNo = null;
            }
        }

        $scope.mediaChannel2List = [];
        $scope.mediaChannel1Change = function () {
            if ($scope.order.recharge.leadMediaChannelId1) {
                CommonService.getMediaChannel($scope.order.recharge.leadMediaChannelId1).then(function (result) {
                    $scope.mediaChannel2List = result.data;
                });
            } else {
                $scope.mediaChannel2List = [];
            }
            $scope.order.recharge.leadMediaChannelId2 = null;
        }


        $scope.rechargeNoExistCheck = function orderNoExistCheck() {
            if ($scope.order.recharge.orderStatus == 14 || $scope.order.recharge.orderStatus == 15) {
                if ($scope.order.recharge.orderNo == $scope.order.recharge.originalOrderNo) {
                    $scope.order.recharge.orderNo = $scope.order.recharge.orderNoNew;
                }
            }
            if ($scope.order.recharge.orderNo == '') {
                return false;
            }
            var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
            promiseExist.then(function (data) {
                if (data.data) {
                    $scope.order.rechargeNoExist = data;
                    SweetAlert.swal('该合同编号已存在');
                    return false;
                } else {
                    $scope.order.rechargeNoExist = null;
                    return true;
                }
            });
        };
        //获取当前校区的归属人
        $scope.getCustomerBelongersSelect = function getCustomerBelongersSelect() {
            OrderService.getCustomerBelongersSelect().then(function (result) {
                $scope.customerBelongers = result.data;
            });
        }();

        //获取当前校区的签约人岗位
        $scope.getContractorPositionsSelect = function getContractorPositionsSelect() {
            OrderService.getContractorPositionsSelect().then(function (result) {
                $scope.contractorPositions = result.data;
            });
        }();

        $scope.onContractorPositionSelect = function onContractorPositionSelect() {
            //alert('onContractorPositionSelect'+$scope.order.recharge.contractorPosition);
            OrderService.getContractorsSelect($scope.order.recharge.contractorPosition).then(function (result) {
                $scope.contractors = result.data;
            });
        };


        $scope.onIsAuditionSelect = function onIsAuditionSelect() {
            $scope.order.recharge.orderCoursesNew = [];
            angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                if ($scope.order.recharge.isAudition == 1) {
                    data.isAudition = 1;
                } else {
                    data.isAudition = 0;
                }
                $scope.order.recharge.orderCoursesNew.push(data);
            });
            $scope.order.recharge.orderCourses = $scope.order.recharge.orderCoursesNew;
        };

        $scope.onIsCourseAuditionSelect = function onIsCourseAuditionSelect() {
            OrderService.getStudentAuditionTeachingList($scope.order.recharge.crmStudentId).then(function (result) {
                $scope.Teachers = result.data;
            });
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
        var _contractEndDate = '',
            _contractStartDate = ''
        /**
         * 返回并重置签约时间和到期时间
         * @returns {*}
         * @private
         */

        function _getOrderCopy() {
            var data = angular.copy($scope.order)
            $scope.order.recharge.contractEndDate = _contractEndDate
            $scope.order.recharge.contractStartDate = _contractStartDate
            $('[ng-model="order.recharge.contractEndDate"]').val(_contractEndDate)
            $('[ng-model="order.recharge.contractStartDate"]').val(_contractStartDate)
            return data
        }

        $scope.orderRecharge = [];
        $scope.beforeSaveOrder = function beforeSaveOrder() {
            $scope.addProtocolEntrence = 'chuzhi';

            var orderElement = angular.copy($scope.order.recharge);

            if (orderElement.orderType == 1 || orderElement.orderType == 2 || orderElement.orderType == 5) {
                orderElement.masterSlaveRelation = 1;
                $scope.orderRecharge.push(orderElement);
                SweetAlert.swal({
                    title: "是否有附加的优惠或赠课协议？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '有, 继续添加',
                    cancelButtonText: '没有，确认提交',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        $scope.modal.hide();
                        resetOrderRechargeProtocol();
                        if ($scope.addProtocolModal) {
                            $scope.addProtocolModal.hide();
                        }
                        $scope.addProtocolModal = $modal({ scope: $scope, templateUrl: mtModal.addProtocol, show: true });//partials/sos/order/addFromList.html
                    } else {
                        $scope.saveOrder($scope.orders);
                    }
                });
            } else if (orderElement.orderType == 8) {
                $scope.order.masterSlaveRelation = 1;
                $scope.orders.push($scope.order);
                $scope.saveOrder($scope.orders);
            }

        }


        $scope.saveOrder = function saveOrder() {
            _contractEndDate = $scope.order.recharge.contractEndDate
            _contractStartDate = $scope.order.recharge.contractStartDate
            $scope.order.recharge.achievementRatios = $scope.order.achievementRatios;
            $scope.order.recharge.orderRelationTeachers = $scope.order.orderRelationTeachers;
            $scope.order.recharge.crmorderPayments = $scope.order.crmorderPayments;
            $scope.order.recharge.payDate = $scope.order.payDate;
            if ($scope.createLead) {
                $scope.order.createLead = true;
            }
            $scope.order.recharge.orderCourses = [];
            $scope.order.recharge.totalPrice = Number($scope.order.recharge.totalPrice.toFixed(2));
            // 将金额字符串转为数字
            //$scope.order.recharge.accountBalance = Number($scope.order.recharge.accountBalance.toFixed(2));
            //$scope.order.recharge.consumeAccountBalance = Number($scope.order.recharge.consumeAccountBalance.toFixed(2));
            $scope.order.recharge.privilegeAmount = Number(Number($scope.order.recharge.privilegeAmount).toFixed(2));
            $scope.order.recharge.realPayAmount = Number(Number($scope.order.recharge.realPayAmount).toFixed(2));
            // 充值类订单封装orderCourse信息
            var orderCourse = {
                'additionalAmount': $scope.order.recharge.totalPrice,
                'avaliableAmount': $scope.order.recharge.totalPrice
            };
            $scope.order.recharge.orderCourses.push(orderCourse);
            $scope.order.recharge.nakedContract = $scope.order.nakedContract;
            if ($scope.order.recharge.orderNo == undefined && ($scope.order.recharge.nakedContract == undefined || !$scope.order.recharge.nakedContract)) {
                SweetAlert.swal({
                    title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                    text: "", type: false, showCancelButton: false,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                    closeOnConfirm: false, closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            // if ($scope.order.recharge.contractEndDate < $scope.order.recharge.contractStartDate) {
                            //     SweetAlert.swal('到期时间不能小于签约时间!');
                            //     $scope.order = _getOrderCopy()
                            //     return false;
                            // }

                            if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                                SweetAlert.swal('优惠金额过大!');
                                $scope.order = _getOrderCopy()
                                return false;
                            }

                            var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                            if (sfje < 0) {
                                SweetAlert.swal('实付金额填写错误', '请重试');
                                $scope.order = _getOrderCopy()
                                return false;
                            }

                            // // 日期处理
                            // if($scope.order.recharge.contractEndDate.length <=　10){
                            //     $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate + " 00:00 ");
                            //     $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate + " 00:00 ");
                            // }else{
                            //     $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);
                            //     $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                            // }

                            var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                            promiseExist.then(function (data) {
                                if (data.data) {
                                    $scope.order.rechargeNoExist = data;
                                    SweetAlert.swal('订单号已存在');
                                    $scope.order = _getOrderCopy()
                                    return false;
                                } else {
                                    $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                                    $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                                    if (!$scope.order.recharge.orderNo) {
                                        $scope.order.recharge.orderNo = "";
                                    }
                                    if ($scope.order.recharge.nakedContract) {
                                        $scope.order.recharge.nakedContract = 1;
                                    } else {
                                        $scope.order.recharge.nakedContract = 0;
                                    }
                                    if ($scope.orderOperating == 2) {//充值订单 --新增意向客户
                                        var crmLeadsStudentVo = {};
                                        crmLeadsStudentVo.phone = $scope.order.recharge.leadPhone;
                                        crmLeadsStudentVo.name = $scope.order.recharge.name;
                                        crmLeadsStudentVo.grade_id = $scope.order.recharge.gradeId;
                                        crmLeadsStudentVo.media_channel_id_1 = $scope.order.recharge.leadMediaChannelId1;
                                        crmLeadsStudentVo.media_channel_id_2 = $scope.order.recharge.leadMediaChannelId2;
                                        LeadsStudentService.create(crmLeadsStudentVo).then(function (data) {
                                            $scope.order.recharge.crmStudentId = data.data.id;
                                            OrderService.addTopup($scope.order.recharge).then(function (data) {
                                                SweetAlert.swal('操作成功');
                                                $scope.modal.hide();
                                                $scope.schoolCrmLeadsStudentListTableState = {};
                                                if ($scope.getList) {//刷新lead列表
                                                    $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                                                }
                                                if ($scope.refreshCustomerOrderDetail) {
                                                    $scope.refreshCustomerOrderDetail()
                                                }
                                                if ($scope.order.createLead) {
                                                    //OrderManagementController.callServerOneTab(OrderManagementController.tableState);
                                                    $scope.$emit("refreshList", "刷新list");
                                                    $scope.$emit("refreshOrder", "刷新order");
                                                }
                                                $scope.studentId = 0;
                                            }, function (error) {
                                                // $scope.dataLoading = false;
                                                SweetAlert.swal('操作失败');
                                                $scope.modal.hide();
                                            });
                                        });
                                    } else {
                                        var promise = OrderService.addTopup($scope.order.recharge);
                                        promise.then(function (data) {
                                            SweetAlert.swal('操作成功');
                                            $scope.modal.hide();
                                            $scope.schoolCrmLeadsStudentListTableState = {};
                                            if ($scope.getList) {//刷新lead列表
                                                $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                                            }
                                            if ($scope.refreshCustomerOrderDetail) {
                                                $scope.refreshCustomerOrderDetail()
                                            }
                                            if ($scope.order.createLead) {
                                                //OrderManagementController.callServerOneTab(OrderManagementController.tableState);
                                                $scope.$emit("refreshList", "刷新list");
                                                $scope.$emit("refreshOrder", "刷新order");
                                            }
                                            $scope.studentId = 0;
                                        }, function (error) {
                                            // $scope.dataLoading = false;
                                            SweetAlert.swal('操作失败');
                                            $scope.modal.hide();
                                        });
                                    }
                                }
                            }, function (error) {
                                SweetAlert.swal('网络异常');
                                return false;
                            });

                        } else {
                            return false;
                        }
                    });
            } else {
                if ($scope.order.recharge.orderNo == '') {
                    $scope.order.recharge.orderNo = null;
                }

                // if ($scope.order.recharge.contractEndDate < $scope.order.recharge.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     $scope.order = _getOrderCopy()
                //     return false;
                // }

                if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    $scope.order = _getOrderCopy()
                    return false;
                }

                var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                if (sfje < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    $scope.order = _getOrderCopy()
                    return false;
                }

                // 日期处理
                // if($scope.order.recharge.contractEndDate.length <=　10){
                //     $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate + " 00:00 ");
                //     $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate + " 00:00 ");
                // }else{
                //     $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);
                //     $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                // }

                var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                promiseExist.then(function (data) {
                    if (data.data) {
                        $scope.order = _getOrderCopy()
                        $scope.order.rechargeNoExist = data;
                        SweetAlert.swal('订单号已存在');
                        return false;
                    } else {
                        $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                        $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                        if (!$scope.order.recharge.orderNo) {
                            $scope.order.recharge.orderNo = "";
                        }
                        if ($scope.order.recharge.nakedContract) {
                            $scope.order.recharge.nakedContract = 1;
                        } else {
                            $scope.order.recharge.nakedContract = 0;
                        }
                        if ($scope.orderOperating == 2) {//充值订单 --新增意向客户
                            var crmLeadsStudentVo = {};
                            crmLeadsStudentVo.phone = $scope.order.recharge.leadPhone;
                            crmLeadsStudentVo.name = $scope.order.recharge.name;
                            crmLeadsStudentVo.grade_id = $scope.order.recharge.gradeId;
                            crmLeadsStudentVo.media_channel_id_1 = $scope.order.recharge.leadMediaChannelId1;
                            crmLeadsStudentVo.media_channel_id_2 = $scope.order.recharge.leadMediaChannelId2;
                            LeadsStudentService.create(crmLeadsStudentVo).then(function (data) {
                                $scope.order.recharge.crmStudentId = data.data.id;
                                OrderService.addTopup($scope.order.recharge).then(function (data) {
                                    SweetAlert.swal('操作成功');
                                    $scope.modal.hide();
                                    $scope.schoolCrmLeadsStudentListTableState = {};
                                    if ($scope.getList) {//刷新lead列表
                                        $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                                    }
                                    if ($scope.refreshCustomerOrderDetail) {
                                        $scope.refreshCustomerOrderDetail()
                                    }
                                    if ($scope.order.createLead) {
                                        //OrderManagementController.callServerOneTab(OrderManagementController.tableState);
                                        $scope.$emit("refreshList", "刷新list");
                                        $scope.$emit("refreshOrder", "刷新order");
                                    }
                                    $scope.studentId = 0;
                                }, function (error) {
                                    // $scope.dataLoading = false;
                                    SweetAlert.swal('操作失败');
                                    $scope.modal.hide();
                                });
                            });
                        } else {
                            var promise = OrderService.addTopup($scope.order.recharge);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.modal.hide();
                                $scope.schoolCrmLeadsStudentListTableState = {};
                                if ($scope.getList) {//刷新lead列表
                                    $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                                }
                                if ($scope.refreshCustomerOrderDetail) {
                                    $scope.refreshCustomerOrderDetail()
                                }
                                if ($scope.order.createLead) {
                                    //OrderManagementController.callServerOneTab(OrderManagementController.tableState);
                                    $scope.$emit("refreshList", "刷新list");
                                    $scope.$emit("refreshOrder", "刷新order");
                                }
                                $scope.studentId = 0;
                            }, function (error) {
                                // $scope.dataLoading = false;
                                SweetAlert.swal('操作失败');
                                $scope.modal.hide();
                            });
                        }
                    }
                }, function (error) {
                    SweetAlert.swal('网络异常');
                    return false;
                });

            }
        }

        $scope.saveNewOrderClear = function saveNewOrderClear() {
            $scope.order = {};
            $scope.order.recharge = {};
            $scope.gradeId = null;
            $scope.courseTypeId = null;
            $scope.gradeName = null;
            $scope.subjectName = null;
            $scope.courseTypeName = null;
            $scope.productId = null;
            $scope.originalNum = null;
        };

        $scope.saveNewOrder = function saveNewOrder() {
            $scope.order.recharge.totalPrice = Number($scope.order.recharge.totalPrice.toFixed(2));
            // 将金额字符串转为数字
            //$scope.order.recharge.accountBalance = Number($scope.order.recharge.accountBalance.toFixed(2));
            //$scope.order.recharge.consumeAccountBalance = Number($scope.order.recharge.consumeAccountBalance.toFixed(2));
            $scope.order.recharge.privilegeAmount = Number(Number($scope.order.recharge.privilegeAmount).toFixed(2));
            $scope.order.recharge.realPayAmount = Number(Number($scope.order.recharge.realPayAmount).toFixed(2));
            $scope.order.recharge.nakedContract = $scope.order.nakedContract;
            if ($scope.order.recharge.orderNo == undefined && ($scope.order.recharge.nakedContract == undefined || !$scope.order.recharge.nakedContract)) {
                SweetAlert.swal({
                    title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                    text: "", type: false, showCancelButton: false,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                    closeOnConfirm: true, closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            // if ($scope.order.recharge.contractEndDate < $scope.order.recharge.contractStartDate) {
                            //     SweetAlert.swal('到期时间不能小于签约时间!');
                            //     return false;
                            // }
                            if ($scope.order.recharge.orderCourses.length == 0) {
                                SweetAlert.swal('请选择课程!');
                                return false;
                            }
                            if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                                SweetAlert.swal('优惠金额过大!');
                                return false;
                            }

                            var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                            if (sfje < 0) {
                                SweetAlert.swal('实付金额填写错误', '请重试');
                                return false;
                            }

                            $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                            $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);

                            var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                            promiseExist.then(function (data) {
                                if (data.data) {
                                    $scope.order.rechargeNoExist = data;
                                    SweetAlert.swal('订单号已存在');
                                    订单号已存在
                                    return false;
                                } else {
                                    $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                                    $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                                    if (!$scope.order.recharge.orderNo) {
                                        $scope.order.recharge.orderNo = "";
                                    }
                                    if ($scope.order.recharge.nakedContract) {
                                        $scope.order.recharge.nakedContract = 1;
                                    } else {
                                        $scope.order.recharge.nakedContract = 0;
                                    }
                                    var promise = OrderService.add($scope.order.recharge);
                                    var promise = OrderService.addAndNewLead($scope.order.recharge);
                                    promise.then(function (data) {
                                        SweetAlert.swal('操作成功');
                                        $scope.modalNewCustomerAndOrder.hide();
                                        $scope.order.recharge = {};
                                        $scope.queryStudent();
                                        $scope.callServerOneTab($scope.tableState);
                                    }, function (error) {
                                        // $scope.dataLoading = false;
                                        SweetAlert.swal('操作失败');
                                        $scope.modalNewCustomerAndOrder.hide();
                                    });
                                }
                            }, function (error) {
                                SweetAlert.swal('网络异常');
                                return false;
                            });
                        } else {
                            return false;
                        }
                    });
            } else {
                if ($scope.order.recharge.orderNo == '') {
                    $scope.order.recharge.orderNo = null;
                }
                // if ($scope.order.recharge.contractEndDate < $scope.order.recharge.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }
                if ($scope.order.recharge.orderCourses.length == 0) {
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                if ($scope.order.recharge.privilegeAmount - $scope.order.recharge.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    return false;
                }

                var sfje = Number((Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount).toFixed(2)) - $scope.order.recharge.realPayAmount).toFixed(2));
                if (sfje < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    return false;
                }

                $scope.order.recharge.contractStartDate = new Date($scope.order.recharge.contractStartDate);
                $scope.order.recharge.contractEndDate = new Date($scope.order.recharge.contractEndDate);

                var promiseExist = OrderService.orderNoExist($scope.order.recharge.orderNo);
                promiseExist.then(function (data) {
                    if (data.data) {
                        $scope.order.rechargeNoExist = data;
                        SweetAlert.swal('订单号已存在');
                        return false;
                    } else {
                        $scope.order.recharge.realTotalAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount;
                        $scope.order.recharge.payDueAmount = $scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmount - $scope.order.recharge.realPayAmount;
                        if (!$scope.order.recharge.orderNo) {
                            $scope.order.recharge.orderNo = "";
                        }
                        if ($scope.order.recharge.nakedContract) {
                            $scope.order.recharge.nakedContract = 1;
                        } else {
                            $scope.order.recharge.nakedContract = 0;
                        }
                        var promise = OrderService.addAndNewLead($scope.order.recharge);
                        promise.then(function (data) {
                            SweetAlert.swal('操作成功');
                            $scope.modalNewCustomerAndOrder.hide();
                            $scope.order.recharge = {};
                            $scope.queryStudent();
                            $scope.callServerOneTab($scope.tableState);
                        }, function (error) {
                            // $scope.dataLoading = false;
                            SweetAlert.swal('操作失败');
                            $scope.modalNewCustomerAndOrder.hide();
                        });
                    }
                }, function (error) {
                    SweetAlert.swal('网络异常');
                    return false;
                });
            }
        };

        $scope.changeStandardPrice = function changeStandardPrice() {
            $scope.order.recharge.totalOriginalNum = 0;
            $scope.order.recharge.totalPrice = 0;
            angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                //data等价于array[index]
                //console.log(data.a+'='+array[index].a);
                $scope.order.recharge.totalOriginalNum = $scope.order.recharge.totalOriginalNum + data.originalNum;
                $scope.order.recharge.totalPrice = $scope.order.recharge.totalPrice + (data.originalNum * data.actualPrice);
            });
            // 判断时长
            if ($scope.order.recharge.orderRule == 1) {
                $scope.order.recharge.hours = $scope.order.recharge.totalOriginalNum;
                $scope.order.recharge.minite = 0;
            } else {
                $scope.order.recharge.hours = parseInt($scope.order.recharge.totalOriginalNum * 40 / 60);
                $scope.order.recharge.minite = parseInt(($scope.order.recharge.totalOriginalNum * 40) % 60);
            }
        };

        //订单删除课程信息
        $scope.delOrderCourse = function delOrderCourse(obj) {
            $scope.order.recharge.totalOriginalNum = $scope.order.recharge.totalOriginalNum - obj.originalNum;
            $scope.order.recharge.totalPrice = $scope.order.recharge.totalPrice - (obj.originalNum * obj.actualPrice);
            $scope.order.recharge.orderCoursesNew = [];
            angular.forEach($scope.order.recharge.orderCourses, function (data, index, array) {
                if (data.$$hashKey != obj.$$hashKey) {
                    $scope.order.recharge.orderCoursesNew.push(data);
                }
            });
            // 判断时长
            if ($scope.order.recharge.orderRule == 1) {
                $scope.order.recharge.hours = $scope.order.recharge.totalOriginalNum;
                $scope.order.recharge.minite = 0;
            } else {
                $scope.order.recharge.hours = parseInt($scope.order.recharge.totalOriginalNum * 40 / 60);
                $scope.order.recharge.minite = parseInt(($scope.order.recharge.totalOriginalNum * 40) % 60);
            }
            $scope.order.recharge.orderCourses = $scope.order.recharge.orderCoursesNew;
        };

        /**
         * 弹窗计费方案
         */
        $scope.selectChargingScheme = function selectChargingScheme() {
            $scope.modalChargingTitle = '选择方案';
            $scope.chargingModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/order/modal.ChargingSchemesList.html',
                show: true
            });
        }
        /**
         * 计费方案列表
         */
        $scope.getChargingSchemeList = function getChargingSchemeList(tableState) {
            $scope.chargingSchemeTableState = tableState;
            //分页信息
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;
            $scope.number = $scope.pagination.number || 10;
            //查询参数
            var searchModel = {};
            searchModel.start = $scope.start;
            searchModel.size = $scope.number;
            searchModel.schemeStatus = 1; // 启用状态
            searchModel.isDeleted = 0;
            searchModel.authorizationDepartmentId = AuthenticationService.currentUser().school_id;
            var promise = CrmChargingSchemeService.getPageList(searchModel);
            promise.then(
                function (response) {
                    if (response.status === "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                    } else {
                        $scope.chargingSchemeList = response.data.list;
                        //传分页参数
                        $scope.chargingSchemeTableState.pagination.numberOfPages = response.numberOfPages;
                    }
                }
            );
            _conductPayments();
        }
        /**
         * 选择某一计费方案、查询出对应的师资等级列表、清空价格
         */
        $scope.selectOneCharging = function selectOneCharging(row) {
            $scope.order.recharge.orderChargingId = row.id;
            $scope.order.recharge.orderChargingScheme = angular.copy(row);
            $scope.order.recharge.orderChargingName = row.schemeName;
            $scope.orderTeacherLevelList = getPricesList(row);
            $scope.order.recharge.orderChargingPrice = "";
        }
        $scope.selectOneChargingConfirm = function selectOneChargingConfirm() {
            $scope.chargingModal.hide();
        }

        /**
         * 更新学生年级
         */
        function updateCustomerStudent() {
            var promiseNew = CustomerStudentService.update($scope.customerStudentDetail);
            promiseNew.then(function (data) {
                //console.log(data);
                if (data.status == 'FAILURE') {
                    SweetAlert.swal(data.data);
                    return false;
                }
            }, function (error) {
                SweetAlert.swal("更新学生年级失败");
            });
        }
        /**
         * 更改计费方案 type1更改年级 2更改师资等级
         */
        $scope.changeCharging = function changeCharging(type) {
            // 顺带更改学生的年级
            if ($scope.orderOperating == 2) {
                $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
            }
            if (type == 1) {
                var customerStudentVo = {}
                customerStudentVo.crm_student_id = $scope.order.recharge.crmStudentId;
                var promise = CustomerStudentService.detail(customerStudentVo);
                promise.then(function (result) {
                    $scope.customerStudentDetail = result;
                    if ($scope.order.recharge.orderChargingId == undefined || $scope.order.recharge.orderChargingId == "") {
                        SweetAlert.swal("请选择计费方案");
                        $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    if ($scope.order.recharge.orderTeacherLevel == undefined || $scope.order.recharge.orderTeacherLevel == "") {
                        SweetAlert.swal("请选择师资等级");
                        $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    var title = "该操作将要修改该学生的年级,是否确定?";
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                    var flag_grade = unlawfulnessGrade.contains($scope.order.recharge.gradeId); //返回true
                    if (!flag_grade) {
                        $mtModal.moreModal({
                            scope: $scope,
                            status: 0,
                            text: title,
                            hasNext: function () {

                                CoursePlanService.getWxClassTimeList($scope.order.recharge.crmStudentId, $scope.customerStudentDetail.grade_id, $scope.order.recharge.gradeId).then(function (result) {
                                    if (result.wxExist) {
                                        if (result.jk) {
                                            var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                            $mtModal.moreModal({
                                                scope: $scope,
                                                status: 0,
                                                text: t,
                                                hasNext: function () {
                                                    CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                                    $scope.mtResultModal.hide();
                                                }
                                            });
                                        } else {
                                            var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整";
                                            $mtModal.moreModal({
                                                scope: $scope,
                                                status: 0,
                                                text: t,
                                                hasNext: function () {
                                                    CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                                    $scope.mtResultModal.hide();
                                                }
                                            });
                                        }
                                    } else {
                                        CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.order.recharge.gradeId);
                                        $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                        updateCustomerStudent();//更新学员年级
                                        $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
                                        if ($scope.getMyCrmCustomerStudentList) {
                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                        }
                                        $scope.mtResultModal.hide();
                                    }
                                });
                            },
                            cancel: function () {
                                $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                                $scope.mtResultModal.hide();
                            }
                        });
                    } else {
                        var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                        $scope.order.recharge.gradeId = $scope.customerStudentDetail.grade_id;
                        SweetAlert.swal(untitle);
                        return;
                    }
                }, function (error) {
                    SweetAlert.swal("获取学生信息失败");
                });
            } else {
                var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                var flag_grade = unlawfulnessGrade.contains($scope.order.recharge.gradeId); //返回true
                if (flag_grade) {
                    var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                    SweetAlert.swal(untitle);
                    return;
                }
                $scope.order.recharge.orderChargingPrice = getPrice($scope.order.recharge.orderChargingScheme, $scope.order.recharge.orderTeacherLevel, $scope.order.recharge.gradeId);
            }
        }
        function updateCustomerStudent() {
            var promiseNew = CustomerStudentService.update($scope.customerStudentDetail);
            promiseNew.then(function (data) {
                //console.log(data);
                if (data.status == 'FAILURE') {
                    SweetAlert.swal(data.data);
                    return false;
                }
            }, function (error) {
                SweetAlert.swal("更新学生年级失败");
            });
        }

        /**
         * 进行添加业绩计算比例的操作
         */
        $scope.showAddAchievementRatio = function showAddAchievementRatio(type) {
            $scope.relationType = type;
            $scope.modalAchieveTitle = '选择员工和角色';
            if (type == 2) {
                $scope.modalAchieveTitle = '选择试听课教师/授课教师';
            }
            // 展示科目信息
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.omsSubject = result.data;
            });
            $scope.order.achievementRatio = {};
            $scope.order.achievementRatio.departmentId = AuthenticationService.currentUser().school_id;
            $scope.order.achievementRatio.departName = AuthenticationService.currentUser().department.name;
            $scope.operateRatio = "add";
            $scope.relationTypeFlag = false;
            if (type == 2) {
                if ($scope.order.recharge.orderType == 1 || $scope.order.recharge.orderType == 5) {
                    $scope.order.achievementRatio.relationType = 1;
                    $scope.relationTypeFlag = true;
                } else if ($scope.order.recharge.orderType == 2) {
                    $scope.order.achievementRatio.relationType = 2;
                    $scope.relationTypeFlag = true;
                }
            }

            $scope.achieveRatioModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/order/modal.addAchievementRatio.html',
                show: true
            });
        }

        // 改变列表中的比例
        $scope.changeRatio = function changeRatio(row) {

            var totalRatio = 0;
            var achievementRatios = angular.copy($scope.order.achievementRatios);
            for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                if (row.userId != achievementRatios[i].userId) {
                    totalRatio = Number(achievementRatios[i].achievementRatio) + Number(totalRatio);
                }
            }
            var totalRatioNew = Number(row.achievementRatio) + Number(totalRatio);
            if (totalRatioNew != 1) {
                SweetAlert.swal("所有员工业绩计算比例之和必须为100%");
                $scope.order.ratioInvalid = true;
            } else {
                $scope.order.ratioInvalid = false;
            }
        }

        /**
         * 删除某条业绩比例表
         */
        $scope.removeRatio = function removeRatio(row, type) {
            if (type != undefined && type != null) {
                $scope.relationType = type;
            }
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
            if ($scope.relationType == 1) {
                var totalRatio = 0;
                var achievementRatios = angular.copy($scope.order.achievementRatios);

                // 删除当前排课列表
                for (var j = 0; j < achievementRatios.length; j++) {
                    if (achievementRatios[j].userId == userId) {
                        $scope.order.achievementRatios.splice(j, 1);
                    }
                }
                // 删除后判断现有的 比例之和是否是1，不是1 不合法
                for (var i = 0; i < $scope.order.achievementRatios.length; i++) {
                    totalRatio = Number($scope.order.achievementRatios[i].achievementRatio) + Number(totalRatio);
                }
                if (totalRatio != 1) {
                    $scope.order.ratioInvalid = true;
                } else {
                    $scope.order.ratioInvalid = false;
                }
            } else if ($scope.relationType == 2) {
                var relationTeachers = angular.copy($scope.order.orderRelationTeachers);
                for (var j = 0; j < relationTeachers.length; j++) {
                    if (relationTeachers[j].userId == userId) {
                        $scope.order.orderRelationTeachers.splice(j, 1);
                    }
                }
            }
        }
        //充值订单  添加收费
        $scope.order.recharge.paymentTempFlag = false;
        $scope.addShouFei = function (type) {
            $scope.order.recharge.supplementaryFee = "";
            $scope.order.recharge.payDate = "";
            $scope.order.recharge.totalPrice = isNaN($scope.order.recharge.totalPrice) || $scope.order.recharge.totalPrice == undefined || $scope.order.recharge.totalPrice == "" ? 0.00 : $scope.order.recharge.totalPrice;
            $scope.order.recharge.privilegeAmount = isNaN($scope.order.recharge.privilegeAmount) || $scope.order.recharge.privilegeAmount == undefined || $scope.order.recharge.privilegeAmount == "" ? 0.00 : $scope.order.recharge.privilegeAmount;
            var realTotalAmount = Number($scope.order.recharge.totalPrice.toFixed(2)) - Number(Number($scope.order.recharge.privilegeAmount).toFixed(2));
            //若是订单的金额为0,不允许进行收费操作，给除提示
            if (realTotalAmount > 0) {
                //将上次添加的记录置空
                if ($scope.order.orderStatus != 15) {
                    $scope.order.orderStatus = undefined;
                }
                $scope.order.supplementaryFee = "";
                $scope.order.payDate = "";
                $scope.modalTitle = "添加收费";
                $scope.addShouFeiModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/chargeTopup.html',
                    show: true
                });
            } else {
                SweetAlert.swal("应交金额应该大于0");
                return;
            }
        }

        /**
         * 添加交费记录
         */
        $scope.order.crmorderPayments = [];
        $scope.saveTempChargeRecord = function saveTempChargeRecord() {

            $scope.orderPaymentTemp = {};
            // 页面上输入的合同号、交费日期、交费金额

            $scope.orderPaymentTemp.orderNo = $scope.order.recharge.orderNo;
            $scope.orderPaymentTemp.payAmount = Number($scope.order.recharge.supplementaryFee);
            // $scope.orderPaymentTemp.payDate = new Date($scope.order.recharge.payDate+' 00:00:00');
            $scope.orderPaymentTemp.payDate = new Date($scope.order.recharge.payDate.getFullYear() + '/' + ($scope.order.recharge.payDate.getMonth() + 1) + "/" + $scope.order.recharge.payDate.getDate() + ' 00:00:00');
            $scope.orderPaymentTemp.paymentEdit = true;
            // 尾款金额需要计算出来
            if ($scope.order.recharge.realPayAmount == undefined || isNaN($scope.order.recharge.realPayAmount)) {
                $scope.order.recharge.realPayAmount = 0;
            }
            $scope.order.recharge.realPayAmount = Number($scope.order.recharge.realPayAmount) + Number($scope.orderPaymentTemp.payAmount);
            $scope.orderPaymentTemp.payDueAmount = $scope.order.recharge.totalPrice - Number($scope.order.recharge.privilegeAmount) - $scope.order.recharge.realPayAmount;
            $scope.order.crmorderPayments.push($scope.orderPaymentTemp);
            // 将现有的收费值清空
            $scope.addShouFeiModal.hide();
        }
        function _updateTemp(_this, _accountBlance, _payments) {
            $scope.order = {}
            $scope.order.recharge = _this;
            $scope.order.crmorderPayments = _payments;
            $scope.order.accountBalance = _accountBlance;
        }
        function _updateOrderTopup(_this, _accountBlance, _payments) {
            //每次清空订单子表
            $scope.order.orderCourses = [];
            $scope.order.crmorderPayments = _payments;
            $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
            _conductPayments();
            if ($scope.order.paymentsWrite == true) {
                SweetAlert.swal("尾款或交费金额不能为负");
            }
            // 充值类订单封装orderCourse信息
            var orderCourse = {
                'additionalAmount': $scope.order.totalPrice,
                'avaliableAmount': $scope.order.totalPrice
            };
            $scope.order.orderCourses.push(orderCourse);
            $scope.order.supplementaryFee = 0;
            if ($scope.order.orderNo == undefined && ($scope.order.nakedContract == undefined || !$scope.order.nakedContract)) {
                SweetAlert.swal({
                    title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                    text: "", type: false, showCancelButton: false,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                    closeOnConfirm: false, closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                            $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                            // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                            //     SweetAlert.swal('到期时间不能小于签约时间!');
                            //     _updateTemp(_this,_accountBlance,_payments);
                            //     return false;
                            // }

                            if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                                SweetAlert.swal('优惠金额过大!');
                                _updateTemp(_this, _accountBlance, _payments);
                                return false;
                            }


                            $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                            //$scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                            console.log($scope.order);
                            var promise = OrderService.editTopup($scope.order);
                            promise.then(function (data) {
                                //$scope.dataLoading = false;
                                SweetAlert.swal('操作成功');
                                $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                                if ($scope.getMsgCount) {
                                    if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                                        $scope.getMsgCount(3);
                                    } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                                        $scope.getMsgCount(2);
                                    } else {
                                        $scope.getMsgCount(1);
                                    }
                                    if ($scope.refreshCustomerOrderDetail) {
                                        $scope.refreshCustomerOrderDetail();
                                    }
                                }
                                if (!($scope.modal === undefined)) {
                                    $scope.modal.hide();
                                }
                                $scope.refreshTabs();
                            }, function (error) {
                                SweetAlert.swal('操作失败');
                                $scope.modal.hide();
                            });
                        } else {
                            return false;
                        }
                    });
            } else {
                // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                if ($scope.order.nakedContract == 0) {
                    if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                        $scope.order.orderNo = $scope.order.orderNoNew;
                    }
                } else {
                    $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                }

                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     _updateTemp(_this,_accountBlance,_payments);
                //     return false;
                // }

                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    _updateTemp(_this, _accountBlance, _payments);
                    return false;
                }

                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                //$scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;

                var promise = OrderService.editTopup($scope.order);
                promise.then(function (data) {
                    //$scope.dataLoading = false;
                    SweetAlert.swal('操作成功');
                    $scope.modal.hide();
                    if (!($scope.modal === undefined)) {
                        $scope.modal.hide();
                    }
                    if ($scope.refreshCustomerOrderDetail) {
                        $scope.refreshCustomerOrderDetail();
                    }
                    $scope.refreshTabs();
                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.modal.hide();
                });
            }
        }
        /**
         * 结转-转入（选择充值订单）
         */
        function _updateOrderTopupCarry(_this, _accountBlance, _payments) {
            //每次清空订单子表
            $scope.order.orderCourses = [];
            $scope.order.crmorderPayments = _payments;
            $scope.order.totalPrice = Number($scope.order.totalPrice.toFixed(2));
            _conductPayments();
            if ($scope.order.paymentsWrite == true) {
                SweetAlert.swal("尾款或交费金额不能为负");
            }
            // 充值类订单封装orderCourse信息
            var orderCourse = {
                'additionalAmount': $scope.order.totalPrice,
                'avaliableAmount': $scope.order.totalPrice
            };
            $scope.order.orderCourses.push(orderCourse);
            $scope.order.supplementaryFee = 0;
            $scope.order.orderCategory = 3;
            if ($scope.order.orderNo == undefined && ($scope.order.nakedContract == undefined || !$scope.order.nakedContract)) {
                SweetAlert.swal({
                    title: "有合同的订单需要填写合同编号才可以进行审核，您可以在修改订单时填写",
                    text: "", type: false, showCancelButton: false,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "OK", cancelButtonText: false,
                    closeOnConfirm: false, closeOnCancel: false
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                            $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                            // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                            //     SweetAlert.swal('到期时间不能小于签约时间!');
                            //     _updateTemp(_this,_accountBlance,_payments);
                            //     return false;
                            // }
                            if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                                SweetAlert.swal('优惠金额过大!');
                                _updateTemp(_this, _accountBlance, _payments);
                                return false;
                            }
                            $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                            //$scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
                            console.log($scope.order);
                            $scope.order.recharge = null;
                            var promise = OrderService.editCarryOrder($scope.order);
                            promise.then(function (data) {
                                SweetAlert.swal('操作成功');
                                $scope.modal.hide();
                                $scope.getCarryForwardList($scope.tableState);
                            }, function (error) {
                                // $scope.dataLoading = false;
                                SweetAlert.swal('操作失败');
                                $scope.modal.hide();
                            });
                        } else {
                            return false;
                        }
                    });
            } else {
                // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                if ($scope.order.nakedContract == 0) {
                    if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                        $scope.order.orderNo = $scope.order.orderNoNew;
                    }
                } else {
                    $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                }
                $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     _updateTemp(_this,_accountBlance,_payments);
                //     return false;
                // }
                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    _updateTemp(_this, _accountBlance, _payments);
                    return false;
                }
                $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                $scope.order.recharge = null;
                var promise = OrderService.editCarryOrder($scope.order);
                promise.then(function (data) {
                    SweetAlert.swal('操作成功');
                    $scope.getCarryForwardList($scope.tableState);
                    $scope.modal.hide();

                }, function (error) {
                    // $scope.dataLoading = false;
                    SweetAlert.swal('操作失败');
                    $scope.modal.hide();
                });
            }
        }
        /**
         * 先收费订单签约-充值订单
         */
        $scope.saveOrderNoSign = function saveOrderNoSign() {
            var nakedContract = $scope.order.nakedContract;
            var _this = angular.copy($scope.order.recharge)
            var _accountBlance = $scope.order.accountBalance;
            var _payments = $scope.order.crmorderPayments;
            $scope.order = angular.copy($scope.order.recharge);
            $scope.order.recharge = {};
            $scope.order.recharge = _this;
            $scope.order.nakedContract = nakedContract;
            // 重新封装合同号
            if ($scope.order.orderNo == $scope.order.originalOrderNo && ($scope.order.orderStatus == 14 || $scope.order.orderStatus == 15)) {
                $scope.order.orderNo = $scope.order.orderNoNew;
            }
            // 若是无合同订单,重新封装该字段值
            $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
            if ($scope.order.orderStatus == 14) {
                _updateOrderTopup(_this, _accountBlance, _payments);
            } else if ($scope.order.orderStatus == 15) {
                _updateOrderTopupCarry(_this, _accountBlance, _payments);
            }

        }
        /**
         * 根据折扣率计算优惠金额
         */
        $scope.getDiscount = function () {
            $scope.order.recharge.privilegeAmountTemp =
                Number(($scope.order.recharge.totalPrice * $scope.order.recharge.privilegeRatio / 100).toFixed(2));
            $scope.order.recharge.privilegeAmount = Number(($scope.order.recharge.totalPrice - $scope.order.recharge.privilegeAmountTemp).toFixed(2));
            _conductPayments();
        }
        /**
         * 改变交费金额时，重新计算尾款金额
         */
        $scope.conductPayments = function (type) {
            if (type == 1) {
                _conductPaymentsDX();
            } else {
                _conductPayments();
            }
            //计算下折扣率
            $scope.order.recharge.privilegeRatio =
                100 - Number(($scope.order.recharge.privilegeAmount * 100 / $scope.order.recharge.totalPrice).toFixed(1));
            $scope.order.recharge.privilegeRatio = Number($scope.order.recharge.privilegeRatio.toFixed(1));
        }
        /**
         * 编辑收费记录
         */
        $scope.showEditPayment = function (row) {
            row.paymentEdit = false;
        }
        /**
         * 对应的处理尾款
         */
        function _conductPayments() {
            $scope.order.paymentsWrite = false;
            $scope.order.recharge.realPayAmount = 0;
            if (isNaN($scope.order.totalPrice)) {
                $scope.order.totalPrice = 0;
            }
            // 尾款金额需要计算出来
            for (var i = $scope.order.crmorderPayments.length - 1; i >= 0; i--) {
                var data = $scope.order.crmorderPayments[i];
                if (Number(data.payAmount) <= 0) {
                    $scope.order.paymentsWrite = true;
                }
                $scope.order.recharge.realPayAmount = Number($scope.order.recharge.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.order.recharge.totalPrice - Number($scope.order.recharge.privilegeAmount) - $scope.order.recharge.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.order.paymentsWrite = true;
                }

            }
        }

        // 加载提示信息
        $timeout(function () {
            $("[data-toggle='tooltip']").tooltip();
        }, 1000);

        (function () {
            // 默认加一条业绩提醒的记录，默认的业绩人为当前登录用户
            var authenticationUser = AuthenticationService.currentUser();
            // 部门信息
            $scope.order.recharge.achievementRatio.departmentId = authenticationUser.school_id;
            $scope.order.recharge.achievementRatio.departName = authenticationUser.department.name;
            // 业绩人信息
            $scope.order.recharge.achievementRatio.userId = authenticationUser.id;
            $scope.order.recharge.achievementRatio.userName = authenticationUser.name;
            // 业绩人岗位信息
            $scope.order.recharge.achievementRatio.positionId = authenticationUser.position_id;
            $scope.order.recharge.achievementRatio.position = {};
            $scope.order.recharge.achievementRatio.position.id = authenticationUser.position_id;
            $scope.order.recharge.achievementRatio.position.name = authenticationUser.position_name;
            // 业绩比例默认100%
            $scope.order.recharge.achievementRatio.achievementRatio = 1;
            $scope.order.recharge.achievementRatios.push($scope.order.recharge.achievementRatio);
            // 展示学生年级
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });

        })()
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        // 在此试验一下模糊搜索逻辑迁移过来
        // 模糊搜索的函数、
        function _clealFirstOrder() {
            $scope.order.leadPhone = "";
            $scope.order.leadGradeId = "";
            $scope.order.leadMediaChannelId1 = "";
            $scope.order.leadMediaChannelId2 = "";
            $scope.order.crmStudentId = "";
        }
        var ___timerGo = ''
        $scope.gusseyourresult = function (row) {
            ___timerGo = setTimeout(function () {
                if ($scope.order.recharge.name) {
                    _clealFirstOrder();
                    $scope.hasresult = true;
                    var param = {
                        search: {
                            predicateObject: {
                                pageNum: 0,
                                pageSize: 0
                            }
                        }
                    }
                    var filter = {
                        name: $scope.order.recharge.name
                    }
                    OrderService.vagueSearch(filter).then(function (result) {
                        $scope.gusseresult = result.data;
                        $scope.xue = "学";
                        $scope.ke = "客";
                        if ($scope.gusseresult.length === 0) {
                            // $scope.gusseresult=[{'name':'查询不到此条信息，请创建'}];
                            $scope.hasresult = false;
                            // $scope.addThisinput=function () {
                            //     // $scope.order.recharge.name='';
                            //
                            // }
                            $scope.hasresult = 0;
                        } else {
                            $scope.hasresult = 1;
                        }
                    });
                } else {

                    $scope.hasresult = false;
                }
                clearTimeout(___timerGo)
            }, 400)
        }
        // 点击其他地方模糊搜索的结果框消失
        $scope.hideThisul = function () {
            if ($scope.hasresult === 0) {
                $scope.order.recharge.name = '';
                $scope.hasresult = false;
                // $scope.gusseresult.length = 0
            } else {

            }

        }
        $scope.addThisinput = function (curdata, flag) {
            flag = flag || 0;
            // 封装order
            $scope.order.recharge.crmStudentId = curdata.crm_student_id;
            $scope.order.recharge.name = curdata.name;
            $scope.order.accountBalance = curdata.accountBalance;
            $scope.order.recharge.consumeAccountBalance = 0;
            $scope.order.recharge.gradeId = curdata.grade_id;
            if (flag === 1) {
                $scope.order.recharge.name = curdata.name;
            } else {
                // $scope.order.recharge.name=curdata.name+'   '+curdata.phone;
                $scope.order.recharge.name = curdata.name;
            }

            $scope.hasresult = false;
            $scope.showCreat = 1;
            // 先收费，选中后将页面的值自动关联
            $scope.currentStudent = angular.copy(curdata);
            $scope.order.leadPhone = $scope.currentStudent.phone;
            $scope.order.leadGradeId = $scope.currentStudent.grade_id;
            $scope.order.leadMediaChannelId1 = $scope.currentStudent.media_channel_id_1;
            $scope.order.leadMediaChannelId2 = $scope.currentStudent.media_channel_id_2
            $scope.order.crmStudentId = $scope.currentStudent.crm_student_id;
            $scope.gusseresult.length = 0
        }

        // 创建意向客户并排课的渠道联动
        $scope.detail = {};
        // $scope.mediaChannel1List = [];
        $scope.mediaChannel2List = [];
        $scope.mediaChannel1ChangeForUpdate = function () {
            if ($scope.detail.media_channel_id_1) {
                CommonService.getMediaChannel($scope.detail.media_channel_id_1).then(function (result) {
                    $scope.mediaChannel2List = result.data;
                });
            } else {
                $scope.mediaChannel2List = [];
            }
            $scope.detail.media_channel_id_2 = null;
        }
        // 电话查重函数
        $scope.checkPhone = function () {
            if ($scope.detail.phone && $scope.detail.phone != '') {
                /*OrderService.checkPhone($scope.CrmInvitationDetailVoForCreate.leadPhone).then(function (result) {
                 if( result.status == 'SUCCESS' ){
         
                 }else{
                 $scope.CrmInvitationDetailVoForCreate.leadPhone = '';
                 SweetAlert.swal('手机号重复');
                 }
                 });*/
                var phoneVo = { "phone": $scope.detail.phone };
                //console.log(phoneVo);
                var promise = CommonService.repeat(phoneVo);
                promise.then(
                    function (data) {
                        //console.log(data);
                        if (data.status == 'FAILURE') {
                            //alert(data.data.repeateMsg);
                            /*SweetAlert.swal(data.data.repeateMsg,"学生姓名:"+data.data.name+"    所属人:"+data.data.userName
                             +"    学生状态:"+(data.data.state == 1 ? "在读学员" : "意向客户"));*/

                            // $scope.repeateData = data.data;
                            // $scope.modalForRepeatTitle = '电话号码重复';
                            // $scope.modalForRepeat = $modal({
                            //     scope: $scope,
                            //     templateUrl: 'partials/sos/leads/modal.repeate.html',
                            //     show: true
                            // });
                            SweetAlert.swal("电话号码重复，重新输入");
                            $scope.modalForRepeatHide();
                        }
                    },
                    function (data) {
                        console.log(data);
                    }
                );

            }
        }

        $scope.modalForRepeatHide = function () {
            // $scope.modalForRepeat.hide();
            if ($scope.order != undefined) {
                // $scope.order.leadPhone = null;
                $scope.detail.phone = null;
            }
        }


        // 添加意向客户
        //     * 创建意向客户并签约
        //     */
        $scope.createLeadsmessege = function () {
            var title = "添加意向客户信息";
            $scope.detail = {};
            $scope.modalTitle1 = title;
            $scope.addModal1 = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/coursePlan/createPlancustom.html',
                show: true,
                backdrop: 'static'
            });
            $scope.getLeadsBasicInfo();
        }
        $scope.getLeadsBasicInfo = function (tableState) {
            //获取所有的年级
            CustomerStudentCourseService.getAllGrade().then(function (result) {
                $scope.omsGrade = result;
            });
            //获取一级渠道信息
            CommonService.getMediaChannel(0).then(function (result) {
                $scope.mediaChannel1List = result.data;
            });
        }
        // 创建好以后添加到后台
        $scope.creatAddThismessege = function () {
            var promise = LeadsStudentService.create($scope.detail);
            promise.then(function (data) {
                if (data.status == 'FAILURE') {
                    if (typeof data.data == 'string') {
                        SweetAlert.swal(data.data);
                    } else {
                        SweetAlert.swal(data.data.repeateMsg);
                        return false;
                    }
                }
                $scope.CrmLeadsStudentVoForCreate = {};
                $scope.addModal1.hide();
                // console.log($scope.detail);
                // 讲新的客户信息连动到添加订单页面
                //  $scope.order.recharge.name=$scope.detail.name;
                // var obj = {'crmStudentId':data.id,'name':$scope.detail.name,'accountBalance':0,'consumeAccountBalance':0,'gradeId':data.gradeId};
                $scope.order.recharge.crmStudentId = data.data.id;
                $scope.order.recharge.name = $scope.detail.name;
                $scope.order.accountBalance = 0;
                $scope.order.recharge.consumeAccountBalance = 0;
                $scope.order.recharge.gradeId = data.data.gradeId;

                $scope.showCreat = 1;

            }, function (error) {
                SweetAlert.swal("创建Leads失败");
            });
        }

        if (sessionStorage.getItem("orderJudgeEntrance") == 'addOrder') {
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    sessionStorage.setItem("orderJudgeEntrance", null)
                    $scope.order.recharge.contractStartDate = new Date(result.data);
                }
            })
        }



    }])