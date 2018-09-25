/**
 * Created by 李世明 on 2016/11/2 0002.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:买课程，修改订单，审核，退费OrderOperatingController
 */
'use strict';
angular.module('ywsApp').controller('OrderOperatingController', ['$scope', '$mtModal', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'AuthenticationService', 'ClassManagementService', 'CustomerStudentCourseService', 'LeadsStudentService', 'localStorageService', 'CrmChargingSchemeService', 'CustomerStudentService', 'CoursePlanService',
    function ($scope, $mtModal, $modal, $rootScope, SweetAlert, OrderService, CommonService, AuthenticationService, ClassManagementService, CustomerStudentCourseService, LeadsStudentService, localStorageService, CrmChargingSchemeService, CustomerStudentService, CoursePlanService) {
        $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
            name: '推荐',
            id: 5
        }, {name: '赠课', id: 8}];
        if ($scope.orderOperating == 9) {
            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
        }
        $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];

        // TODO:20180803 素养课程选班
        $scope.classModal = {}
        $scope.selectClassModal = function (row, order) {
            console.log(order)
            row.clickNow = !row.clickNow
            $scope.classModal = order // angular.copy(order)
        }

        CommonService.getGradeIdSelect().then(function (result) {
            $scope.gradeIds = result.data;
            $scope.leadGradeIds = result.data;
        });

        //聚焦失焦0的展示
        $scope.isFocus = function (index, key) {
            $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : '';
        };
        $scope.isBlur = function (index, key) {
            $scope.order.orderCourses[index][key] = $scope.order.orderCourses[index][key] ? $scope.order.orderCourses[index][key] : 0
        };
        //聚焦失焦0的展示 20180102
        $scope.isFocusV2 = function (index, key) {
            $scope.moreOrder.orderCourses[index][key] = $scope.moreOrder.orderCourses[index][key] ? $scope.moreOrder.orderCourses[index][key] : '';
        };
        $scope.isBlurV2 = function (index, key) {
            $scope.moreOrder.orderCourses[index][key] = $scope.moreOrder.orderCourses[index][key] ? $scope.moreOrder.orderCourses[index][key] : 0
        };
        //聚焦失焦0的展示 20180102
        $scope.isFocusV3 = function (index, key, pindex) {
            $scope.orders[pindex].orderCourses[index][key] = $scope.orders[pindex].orderCourses[index][key] ? $scope.orders[pindex].orderCourses[index][key] : '';
            reseatPue(pindex)
        };
        $scope.isBlurV3 = function (index, key, pindex) {
            $scope.orders[pindex].orderCourses[index][key] = $scope.orders[pindex].orderCourses[index][key] ? $scope.orders[pindex].orderCourses[index][key] : 0
            reseatPue(pindex)
        };
        // 推荐人
        $scope.recommendStudent = {}
        $scope.recommendStudentItems = []
        // $scope.recommendStudentName = '小'
        // 更新推荐学员
        $scope.updateRecommendStudent = function (item) {
            $scope.recommendStudent = item
            $scope.order.recommendStudentId = item.id
            $scope.hasRecommendStudentResult = false
        }

        // 服务费
        $scope.servicePayment = {}
        $scope.servicePaymentFlag = false

        var recommendTimes = ''
        $scope.findRecommendStudentItems = function () {
            clearTimeout(recommendTimes)
            recommendTimes = setTimeout(function () {
                console.log($scope.recommendStudent.name)
                OrderService.recommendSearch($scope.recommendStudent.name).then(function (result) {
                    $scope.recommendStudentItems = result.data;
                    $scope.xue = "学";
                    $scope.ke = "客";
                    $scope.hasRecommendStudentResult = true
                    console.log(result)
                });
            }, 300)
        }

        $scope.getRecommendStudentByOrderId = function (id) {
            OrderService.getRecommendStudentByOrderId(id).then(function (result) {
                $scope.recommendStudent = result.data || {};
            });
        }

        function reseatPue(index) {
            // 重置每条收费记录的尾款金额
            if (index != undefined && $scope.orders && $scope.orders[index].crmorderPayments) {
                var pue = 0
                var realTotalAmount = $scope.orders[index].totalPrice - $scope.orders[index].privilegeAmount
                // 按照缴费日期从大到小
                $scope.orders[index].crmorderPayments.sort(function (a, b) {
                    console.log(a.payDate)
                    return (a.payDate - b.payDate < 0)
                })
                var crmorderPayments = angular.copy($scope.orders[index].crmorderPayments.reverse())
                crmorderPayments.map(function (item) {
                    pue += item.payAmount
                    item.payDueAmount = realTotalAmount - pue
                })
                $scope.orders[index].crmorderPayments = angular.copy(crmorderPayments.reverse())
                $scope.orders[index].payDueAmount = Number((realTotalAmount - pue).toFixed(2))
                if (realTotalAmount - pue < 0 && realTotalAmount - pue > -0.001) {
                    $scope.orders[index].realTotalAmount = Number($scope.orders[index].realTotalAmount.toFixed(2))
                    $scope.orders[index].privilegeAmountTemp = Number($scope.orders[index].privilegeAmountTemp.toFixed(2))
                }
            }
        }

        $scope.$on("arrangeOneCourseTeacher", function (event, msg) {
            OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                $scope.Teachers = result.data;
            });
        });

        $scope.orderCourseSubjectName = function (course) {
            if (course.subjectType == 1 || course.subjectType == 2) {
                return course.subjectName;
            } else if (course.subjectType == 3) {
                var name = '';
                for (var i = 0; i < course.subjects.length; i++) {
                    name += course.subjects[i].name;
                    if (i < course.subjects.length - 1) {
                        name += ','
                    }
                }
                return name;
            }
            return '';
        }

        $scope.cIndex = ''
        $scope.initCindex = function (index) {
            $scope.cIndex = index
        }
        $scope.$on("arrangeCourse", function (event, rows) {
            if (($scope.$parent.orderOperating == 5 || $scope.$parent.orderOperating == 10) && !$scope.modalFreeLessons) {
                var __order = $scope.orders[$scope.cIndex]
                // 以前的
                if (rows.length > 50) {
                    SweetAlert.swal("课程最多50条");
                    return;
                }
                if (__order.orderCourses && __order.orderCourses.length > 0) {
                    if (rows.length + __order.orderCourses.length > 50) {
                        SweetAlert.swal("课程最多50条");
                        return;
                    }
                }

                if (__order.orderCourses && __order.orderCourses.length > 0) {
                    var temGradeId = __order.orderCourses[0].gradeId;
                    // for (var i = 0; i < rows.length; i++) {
                    //     if (rows[i].gradeId != temGradeId) {
                    //         SweetAlert.swal("课程年级不一致");
                    //         return;
                    //     }
                    // }
                }

                if (__order.orderCourses && __order.orderCourses.length > 0) {
                    for (var i = 0; i < __order.orderCourses.length; i++) {
                        for (var j = 0; j < rows.length; j++) {
                            if (__order.orderCourses[i].courseId == rows[j].courseId && __order.orderCourses[i].subjectId == rows[j].subjectId) {
                                SweetAlert.swal(__order.orderCourses[i].courseTypeName + "已存在列表中");
                                return;
                            }
                        }
                    }
                }
                if (!__order.orderCourses) {
                    __order.orderCourses = []
                }
                for (var i = 0; i < rows.length; i++) {
                    __order.orderCourses.push(rows[i]);
                }
            }
            // V2
            else if ($scope.modalFreeLessons) {
                if (rows.length > 50) {
                    SweetAlert.swal("课程最多50条");
                    return;
                }
                if ($scope.moreOrder.orderCourses && $scope.moreOrder.orderCourses.length > 0) {
                    if (rows.length + $scope.moreOrder.orderCourses.length > 50) {
                        SweetAlert.swal("课程最多50条");
                        return;
                    }
                }

                if ($scope.moreOrder.orderCourses && $scope.moreOrder.orderCourses.length > 0) {
                    var temGradeId = $scope.moreOrder.orderCourses[0].gradeId;
                }

                if ($scope.moreOrder.orderCourses && $scope.moreOrder.orderCourses.length > 0) {
                    for (var i = 0; i < $scope.moreOrder.orderCourses.length; i++) {
                        for (var j = 0; j < rows.length; j++) {
                            if ($scope.moreOrder.orderCourses[i].courseId == rows[j].courseId && $scope.moreOrder.orderCourses[i].subjectId == rows[j].subjectId) {
                                SweetAlert.swal($scope.moreOrder.orderCourses[i].courseTypeName + "已存在列表中");
                                return;
                            }
                        }
                    }
                }

                for (var i = 0; i < rows.length; i++) {
                    $scope.moreOrder.orderCourses.push(rows[i]);
                }
            } else {
                // 以前的
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
                    // for (var i = 0; i < rows.length; i++) {
                    //     if (rows[i].gradeId != temGradeId) {
                    //         SweetAlert.swal("课程年级不一致");
                    //         return;
                    //     }
                    // }
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
                if (!$scope.order.orderCourses) {
                    $scope.order.orderCourses = []
                }
                for (var i = 0; i < rows.length; i++) {
                    $scope.order.orderCourses.push(rows[i]);
                }
            }
        });

        /**
         *
         */
        $scope.isVailabled = function () {
            $scope.order.paymentsWrite = false;
            if ($scope.order.realPayAmount != "" && Number($scope.order.realPayAmount) == 0) {
                $scope.order.paymentsWrite = true;
            }
        }
        /**
         * 保存订单的先收费记录
         */
        $scope.saveOrderFirstCharge = function () {
            if (!validateAchievementRatio($scope.order)) {
                return false
            }
            var promise;
            if ($scope.order.id != undefined) {
                promise = OrderService.editFirstChargeOrder($scope.order);
            } else {
                //$scope.order.crmStudentId = 2705249;
                promise = OrderService.saveOrderFirstCharge($scope.order);
            }
            promise.then(function (data) {
                SweetAlert.swal('操作成功');
                try {
                } catch (e) {
                } finally {
                    if (!($scope.modal === undefined)) {
                        $scope.modal.hide();
                    }
                    $scope.refreshTabs();
                    if ($scope.customerEditFlag) {
                        $scope.refreshCustomerOrderDetail();
                    }
                }
                try {
                    $scope.getIndexData(3)
                    $scope.getIndexData(5)
                } catch (e) {

                }
                //刷新订单列表
            }, function (error) {
                SweetAlert.swal('操作失败');
                $scope.modal.hide();
            });
        }

        $scope.clearOrderNo = function () {
            if ($scope.order.nakedContract) {
                $scope.order.orderNo = null;
                $scope.order.recharge.orderNo = null;
            }
        }

        /**
         * 订单查重
         */
        $scope.orderNoExistCheck = function orderNoExistCheck() {
            reseatOrderNo()
            if (!arguments.length) {  //  买课程用
                if ($scope.order.orderNo == $scope.order.originalOrderNo && ($scope.order.orderStatus == 14 || $scope.order.orderStatus == 15)) {
                    $scope.order.orderNo = $scope.order.orderNoNew;
                }
                if ($scope.order.orderNo == '') {
                    return false;
                }
                _commonCallBack(OrderService.orderNoExist($scope.order.orderNo))
                return false;
            }
            if (arguments.length && arguments[0] == 1 && $scope.orderOperating != 10) {
                if ($scope.order.orderNo == "" && $scope.orderCopy.orderNo != "") {
                    // SweetAlert.swal("已有合同号，不能再次置空，请重新输入");
                    $scope.orderNoExist = true;
                    return;
                }
                // 不验证
                if ($scope.order.orderNo == $scope.orderCopy.orderNo) {
                    $scope.orderNoExist = null;
                    return false;
                }
            }
            if (arguments.length) {
                if (arguments[0] == 2)
                    _commonCallBack(OrderService.orderNoExist($scope.order.orderNoNew))
                else
                    _commonCallBack(OrderService.orderNoExist($scope.order.orderNo))
            }
            if (arguments.length && arguments[0] == 1 && $scope.orderOperating == 10) {
                // 不验证
                if ($scope.order.orderNo == $scope.orderCopy.orderNo) {
                    $scope.orderNoExist = null;
                    return false;
                } else {
                    _commonCallBack(OrderService.orderNoExist($scope.order.orderNo));
                }
            }
        };

        function _commonCallBack(promiseExist) {
            promiseExist.then(function (data) {
                if (data.data) {
                    $scope.orderNoExist = data;
                    SweetAlert.swal('该合同编号已存在');
                    // $scope.modal.hide();
                    return false;
                } else {
                    $scope.orderNoExist = null;
                    return true;
                }
            });

        }

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
            //alert('onContractorPositionSelect'+$scope.order.contractorPosition);
            OrderService.getContractorsSelect($scope.order.contractorPosition).then(function (result) {
                $scope.contractors = result.data;
            });
        };


        $scope.onIsAuditionSelect = function onIsAuditionSelect() {
            $scope.order.orderCoursesNew = [];
            angular.forEach($scope.order.orderCourses, function (data, index, array) {
                if ($scope.order.isAudition == 1) {
                    data.isAudition = 1;
                } else {
                    data.isAudition = 0;
                }
                $scope.order.orderCoursesNew.push(data);
            });
            $scope.order.orderCourses = $scope.order.orderCoursesNew;
        };

        $scope.onIsCourseAuditionSelect = function onIsCourseAuditionSelect() {
            OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
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

        $scope.getSubjectIdSelect = function getSubjectIdSelect() {
            CommonService.getSubjectIdSelect().then(function (result) {
                $scope.subjectIds = result.data;
            });
        }();

        $scope.onProductIdSelect = function onProductIdSelect() {
            $scope.gradeIds = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = $scope.productId;
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

        $scope.courseProperty = 1;
        $scope.addOrderCourse = function addOrderCourse() {
            OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                $scope.Teachers = result.data;
            });
            if ($scope.productId == null || $scope.gradeId == null || $scope.subjectId == null || $scope.courseTypeId == null || $scope.originalNum == null) {
                SweetAlert.swal('添加失败', '请选择全部条件重试');
                return false;
            }

            if ($scope.order && $scope.order.orderCourses && $scope.order.orderCourses.length > 0 && $scope.order.orderCourses[0].gradeId && $scope.order.orderCourses[0].gradeId != $scope.gradeId) {
                SweetAlert.swal('添加失败', '订单中课程年级必须一致');
                return false;
            }

            var originalNumNew = $scope.originalNum;
            OrderService.getOrderCourse($scope.productId, $scope.courseTypeId, $scope.gradeId, $scope.subjectId).then(function (result) {

                OrderService.getStudentAuditionTeachingList($scope.order.crmStudentId).then(function (result) {
                    $scope.Teachers = result.data;
                });

                var subjectName = "";
                angular.forEach($scope.subjectIds, function (data, index, array) {
                    if ($scope.subjectId == data.id) {
                        subjectName = data.name;
                    }
                });

                if ($scope.subjectId == zengKeSubjectFlag) {
                    $scope.courseProperty = 2;
                } else {
                    $scope.courseProperty = 1;
                }

                var orderCourse = {
                    'originalNum': Number(originalNumNew), 'courseId': result.data.id,
                    'gradeId': result.data.gradeId,
                    'courseTypeId': result.data.courseTypeId,
                    'subjectId': $scope.subjectId,
                    'gradeName': result.data.gradeName,
                    'courseTypeName': result.data.courseTypeName,
                    'subjectName': subjectName,
                    'standardPrice': result.data.standardPrice,
                    'actualPrice': 0,
                    'teacherId': result.data.teacherId,
                    'isAudition': $scope.order.isAudition,
                    'isCourseAudition': $scope.order.isAudition,
                    'courseProperty': $scope.courseProperty
                };
                $scope.order.orderCourses.push(orderCourse);
                $scope.order.totalOriginalNum = (parseInt(originalNumNew) + parseInt($scope.order.totalOriginalNum));
                $scope.order.totalPrice = ($scope.order.totalPrice + (originalNumNew * 0));//.toFixed(0);
                orderCourse = null;
                $scope.subjectId = null;
            });
            //$scope.gradeId =null;
            //$scope.courseTypeId = null;
            //$scope.gradeName =null;
            //$scope.subjectName = null;
            //$scope.courseTypeName = null;
            //$scope.productId = null;
            $scope.originalNum = null;
            $scope.courseProperty = null;
        };

        /**
         * 重置订单
         */
        function resetOrderProtocol() {
            $scope.order.orderCourses = [];
            $scope.order.crmorderPayments = [];
            $scope.order.hours = '';
            $scope.order.minite = '';
            $scope.order.totalOriginalTimes = '';
            $scope.order.totalPrice = '';
            $scope.order.realTotalAmount = '';
            $scope.order.privilegeAmount = '';
            $scope.order.privilegeRatio = '';
            // 充值
            // 新加s
            var gId = $scope.order.recharge.gradeId
            $scope.order.slaveType = '';
            $scope.order.specialOrderClassType = '';
            $scope.order.specialOrderType = '';
            $scope.order.specialOrderClassType = '';
            $scope.order.specialOrderRequirements = '';
            // n
            $scope.order.recharge = {gradeId: gId};
            $scope.order.orderChargingId = '';
        }

        $scope.orderPays = function () {
            if ($scope.order.orderStatus == 14 && $scope.orders.length <= 1 && !$scope.showCreatFlag) {
                var p = angular.copy($scope.MtCrmorderPayments) || []
                p.map(function (item) {
                    if (!$scope.order.crmorderPayments) {
                        $scope.order.crmorderPayments = []
                    }
                    $scope.order.crmorderPayments.push(item)
                })
            }
        }

        $scope.orders = [];
        $scope.beforeSaveOrder = function () {
            $scope.addProtocolEntrence = 'keshi';
            $scope.order.realTotalAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100)) / 100;
            $scope.order.payDueAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100;

            var orderElement = angular.copy($scope.order);
            console.log($scope.order);
            if ($scope.order.orderCourses.length == 0) {
                SweetAlert.swal('请输入课程');
                return;
            }
            /*
                暂时注释
            if ($scope.order.privilegeRatio < 50) {
                SweetAlert.swal('折扣率不能低于50%');
                return;
            }*/

            if (!orderElement.orderType && $scope.orders.length > 0) {
                orderElement.orderType = $scope.orders[0].orderType;
            }
            orderElement.orderCategory = 1;
            for (var i = 0; i < $scope.gradeIds.length; i++) {
                if ($scope.gradeIds[i].id == $scope.order.recharge.gradeId) {
                    orderElement.currentGrade = $scope.gradeIds[i].name;
                    break;
                }
            }

            if (orderElement.orderType == 1 || orderElement.orderType == 2 || orderElement.orderType == 5) {
                orderElement.masterSlaveRelation = 1;
                $scope.orders.push(orderElement);
                for (var i = 0; i < $scope.orders.length; i++) {
                    if ($scope.orders[i].orderStatus != 14 && $scope.orders[i].payDueAmount.toFixed(2) < 0) {
                        SweetAlert.swal('订单尾款不能为负数');
                        return;
                    }
                }
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
                        resetOrderProtocol();
                        if ($scope.addProtocolModal) {
                            $scope.addProtocolModal.hide();
                        }
                        $scope.addProtocolModal = $modal({scope: $scope, templateUrl: mtModal.addProtocol, show: true});  // optimize/modal/order/addProtocol.html
                    } else {
                        $scope.saveOrder($scope.orders);
                    }
                });
            } else if (orderElement.orderType == 8) {
                $scope.order.orderCategory = 1;
                $scope.order.masterSlaveRelation = 1;
                $scope.orders.push($scope.order);
                if ($scope.orders[0].orderStatus != 14 && $scope.orders[0].payDueAmount.toFixed(2) < 0) {
                    SweetAlert.swal('订单尾款不能为负数');
                    return;
                }
                $scope.saveOrder($scope.orders);
            }
        }

        $scope.orderAddProtocol = {};
        $scope.saveOrderProtocolModal = function () {
            console.log($scope.order)
        }

        $scope.saveOrder = function saveOrder(obj) {
            if (obj) {
                if (obj.constructor == Array) {
                    obj.forEach(function (i, index) {
                        if (i.orderCategory == 1) {
                            obj[index].repeatClick = true;

                            obj[index].totalPrice = Number(i.totalPrice.toFixed(2));
                        } else if (i.orderCategory == 3) {
                            obj[index].repeatClick = true;
                            obj[index].recharge.totalPrice = Number(i.recharge.totalPrice.toFixed(2));
                        }
                    })
                } else if (obj.constructor == Object) {
                    obj.repeatClick = true;
                    obj.totalPrice = Number(obj.totalPrice.toFixed(2));
                    obj = [obj];
                }
            } else {
                obj = [$scope.order];
            }

            $scope.orders = obj;
            for (var i = 0; i < $scope.orders.length; i++) {
                // 附加条件
                if ($scope.orders[i].orderCategory == 3 && $scope.orders[i].recharge && $scope.orders[i].recharge != {}) {
                    $scope.orders[i] = $scope.orders[i].recharge;
                }
            }
            validateSuccess(1);
        }

        function setTimeByType(obj) {
            switch ($scope.orderOperating) {
                case 2://  创建新意向客户并签约
                case 3:
                case 4://lhr加
                case 1://  对选中学生签约
                    var data = angular.copy(obj)
                    if (obj.constructor == Array) {
                        for (var i = 0; i < data.length; i++) {
                            if ($scope.orders[i].crmorderPayments && $scope.orders[i].crmorderPayments.length) {
                                $scope.orders[i].contractStartDate = new Date($scope.orders[i].contractStartDate);
                                $scope.orders[i].contractEndDate = new Date($scope.orders[i].contractEndDate);
                                _contractStartDate = new Date($scope.orders[i].contractStartDate);
                                _contractEndDate = new Date($scope.orders[i].contractEndDate);
                            }
                        }
                    }
                    break;
            }
        }

        var _contractEndDate = '',
            _contractStartDate = ''

        /**
         * 验证订单数据信息是否合法，提取公共部分
         * @returns {boolean}
         * 返回boolen
         */
        function validateOrderInfo(obj) {
            if (obj) {
                _contractEndDate = $scope.order.contractEndDate
                _contractStartDate = $scope.order.contractStartDate
                /**
                 * $scope.orderOperating==5为修改，小于5为添加或买课程
                 */
                // if ($scope.orderOperating >= 5 && !arguments.length) {
                //     // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                //     if ($scope.order.nakedContract == 0) {
                //         if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                //             $scope.order.orderNo = $scope.order.orderNoNew;
                //         }
                //     } else {
                //         if ($scope.orderCopy.orderNo == $scope.orderCopy.originalOrderNo) {
                //             $scope.order.orderNo = $scope.orderCopy.originalOrderNo
                //         } else {
                //             $scope.order.orderNo = $scope.orderCopy.orderNo;
                //         }
                //         $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                //     }
                //     $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                // }
                if ($scope.orderOperating >= 5 && arguments.length) {
                    $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                }
                if ($scope.order.accountBalance < $scope.order.consumeAccountBalance) {
                    SweetAlert.swal('使用账户余额不能大于电子账户余额!');
                    return false;
                }

                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }

                if ($scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    return false;
                }

                if ((($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100 < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    return false;
                }

                var a = ($scope.order.totalPrice * 100) - ($scope.order.consumeAccountBalance * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)
                if ((($scope.order.totalPrice * 100) - ($scope.order.consumeAccountBalance * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100 < 0) {
                    SweetAlert.swal('尾款金额不能为负数', '请重试');
                    return false;
                }
            } else {
                _contractEndDate = $scope.order.contractEndDate
                _contractStartDate = $scope.order.contractStartDate
                /**
                 * $scope.orderOperating==5为修改，小于5为添加或买课程
                 */
                if ($scope.orderOperating >= 5 && !arguments.length) {
                    // 无合同订单，修改时合同号不变，有合同订单有两种情况（1）
                    if ($scope.order.nakedContract == 0) {
                        if ($scope.order.orderNo == $scope.order.originalOrderNo) {
                            $scope.order.orderNo = $scope.order.orderNoNew;
                        }
                    } else {
                        if ($scope.orderCopy.orderNo == $scope.orderCopy.originalOrderNo) {
                            $scope.order.orderNo = $scope.orderCopy.originalOrderNo
                        } else {
                            $scope.order.orderNo = $scope.orderCopy.orderNo;
                        }
                        $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
                    }
                    $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                }
                if ($scope.orderOperating >= 5 && arguments.length) {
                    $scope.order.contractEndDate = new Date($scope.order.contractEndDate);
                }
                if ($scope.order.accountBalance < $scope.order.consumeAccountBalance) {
                    SweetAlert.swal('使用账户余额不能大于电子账户余额!');
                    return false;
                }

                // if ($scope.order.contractEndDate < $scope.order.contractStartDate) {
                //     SweetAlert.swal('到期时间不能小于签约时间!');
                //     return false;
                // }

                if ($scope.order.orderCourses.length == 0) {
                    SweetAlert.swal('请选择课程!');
                    return false;
                }
                if ($scope.order.privilegeAmount - $scope.order.totalPrice > 0) {
                    SweetAlert.swal('优惠金额过大!');
                    return false;
                }

                if ((($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100 < 0) {
                    SweetAlert.swal('实付金额填写错误', '请重试');
                    return false;
                }

                var a = ($scope.order.totalPrice * 100) - ($scope.order.consumeAccountBalance * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)
                if (((($scope.order.totalPrice * 100) - ($scope.order.consumeAccountBalance * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100).toFixed(2) < 0) {
                    SweetAlert.swal('尾款金额不能为负数', '请重试');
                    return false;
                }
            }

            // 日期处理
            // if($scope.order.contractEndDate.length <=　10){
            // 	$scope.order.contractEndDate = new Date($scope.order.contractEndDate + " 00:00 ");
            //     $scope.order.contractStartDate = new Date($scope.order.contractStartDate + " 00:00 ");
            // }else{
            // 	$scope.order.contractEndDate = new Date($scope.order.contractEndDate);
            //     $scope.order.contractStartDate = new Date($scope.order.contractStartDate);
            // }
            return true
        }

        function add() {
            var promise = requireToAdd();
            promise.then(function (data) {
                $scope.$broadcast("addOrderSuccess", "添加订单成功");
                $scope.orders = angular.copy($scope.___oreders___)
                $scope.___oreders___ = null
                SweetAlert.swal('操作成功');
                if ($scope.modal && $scope.modal.hide) {
                    $scope.modal.hide();
                }
                if ($scope.orderModalV2 && $scope.orderModalV2.hide) {
                    $scope.orderModalV2.hide();
                }
                if ($rootScope.orderModalV2 && $rootScope.orderModalV2.hide) {
                    $rootScope.orderModalV2.hide();
                }
                // try {
                //     $scope.modal.hide();
                // } catch (e) {
                //     if ($rootScope.orderModalV2) {
                //         $rootScope.orderModalV2.hide()
                //     } else {
                //         $scope.orderModalV2.hide()
                //     }
                // }
                reloadParentUrl();
                if (!$scope.jiezhuan) {
                    $scope.$emit("refreshOrder", "刷新order");
                } else {
                    $scope.$parent.updateJiezhuan(false)
                }
            }, function (error) {
                $scope.orders = angular.copy($scope.___oreders___)
                $scope.___oreders___ = null
                SweetAlert.swal(error);
                if ($scope.addProtocolModal) {
                    $scope.addProtocolModal.hide()
                }
                if ($scope.modal) {
                    $scope.modal.hide();
                }

            });
            // var promiseExist = OrderService.orderNoExist($scope.order.orderNo);
            // promiseExist.then(function (data) {
            //     if (data.data) {
            //         $scope.orderNoExist = data;
            //         SweetAlert.swal('合同号已存在');
            //         return false;
            //     } else {
            //         if ($scope.orders && $scope.orders.length > 0) {
            //             for (var i = 0; i < $scope.orders.length; i++) {
            //                 $scope.orders[i].realTotalAmount = $scope.orders[i].totalPrice - $scope.orders[i].privilegeAmount;
            //                 $scope.orders[i].payDueAmount = $scope.orders[i].totalPrice - $scope.orders[i].privilegeAmount - $scope.orders[i].realPayAmount - $scope.orders[i].consumeAccountBalance;
            //                 $scope.orders[i].orderCategory = 1;
            //                 if (i > 0) {
            //                     $scope.orders[i].masterSlaveRelation = 2;
            //                 }
            //                 if (!$scope.orders[i].orderNo) {
            //                     $scope.orders[i].orderNo = "";
            //                 }
            //                 if ($scope.orders[i].nakedContract) {
            //                     $scope.orders[i].nakedContract = 1;
            //                 } else {
            //                     $scope.orders[i].nakedContract = 0;
            //                 }
            //             }
            //         }

            //     }
            // }, function (error) {
            //     SweetAlert.swal('网络异常');
            //     return false;
            // });
        }

        /**
         * 调用OrderService的edit方法更新先收费-签约-课时订单，并刷新表单
         */
        function update() {
            var arg = arguments
            $scope.order.realTotalAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100)) / 100;
            $scope.order.payDueAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100) - ($scope.order.supplementaryFee * 100)) / 100;
            if ($scope.order.orderStatus != 14 && $scope.order.payDueAmount.toFixed(2) < 0) {
                SweetAlert.swal('订单尾款不能为负数');
                return;
            }
            var promise = OrderService.edit($scope.order);
            promise.then(function (data) {
                if (arg.length) {
                    $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                    _existNews()
                }
                SweetAlert.swal('操作成功');
                try {
                    $scope.modal.hide();
                } catch (e) {
                    $scope.editOrderModal.hide();
                } finally {
                    if (!($scope.modal === undefined)) {
                        $scope.modal.hide();
                    }
                    $scope.refreshTabs(); // 刷新表单
                    if ($scope.customerEditFlag) {
                        $scope.refreshCustomerOrderDetail();
                    }
                }
            }, function (error) {
                SweetAlert.swal('操作失败');
                $scope.editOrderModal.hide();
            });
        }

        function validateAchievementRatio(order) {
            var flag = 0
            for (var i = 0, len = order.achievementRatios.length; i < len; i++) {
                flag += Number(order.achievementRatios[i].achievementRatio)
            }
            var r = flag == 1 ? true : false
            if (!r) {
                SweetAlert.swal('所有员工业绩计算比例之和必须为100%');
            }
            return r
        }

        function updateRealPayAmount(order) {
            order.realPayAmount = 0
            for (var i = 0, len = order.crmorderPayments.length; i < len; i++) {
                var payment = order.crmorderPayments[i]
                order.realPayAmount += payment.payAmount
            }
        }

        $scope.dobulePayDueAmount = function (row) {
            return row.payDueAmount.toFixed(2)
        }

        // 更新数据
        $scope.updateV2 = function updateV2() {
            // 验证是否是推荐学员订单
            if ($scope.orders[0].orderType == 5 && !$scope.recommendStudent.id) {
                SweetAlert.swal('请选择推荐人');
                return false
            }
            if (!$scope.orders[0].orderType) {
                SweetAlert.swal('请选择业绩类型');
                return false
            }
            var flag = 0
            var orderStatus = $scope.order.orderStatus
            // 所有员工业绩计算比例之和必须为100%
            if (!validateAchievementRatio($scope.orders[0])) {
                return false
            }
            for (var i = 0, len = $scope.orders.length; i < len; i++) {
                $scope.orders[i].orderStatus = orderStatus
                $scope.orders[i].recommendStudentId = $scope.recommendStudent.id
                reseatPue(i)
                if ($scope.orders[i].orderCategory == 1 && $scope.orders[i].orderCourses.length == 0) {
                    SweetAlert.swal('课时订单的课程信息不能为空');
                    flag = 1
                    return;
                }
                // if ($scope.orders[i].realTotalAmount <= 0) {
                if ($scope.orders[i].realTotalAmount.toFixed(2) < 0) {
                    SweetAlert.swal('课时订单的应交金额不能为负数');
                    flag = 1
                    return;
                }
                if ($scope.orders[i].orderStatus != 14 && $scope.orders[i].payDueAmount.toFixed(2) < 0) {
                    SweetAlert.swal('订单尾款不能为负数');
                    flag = 1
                    return;
                } else if (i > 0) {
                    $scope.orders[i].achievementRatios = $scope.orders[0].achievementRatios
                    $scope.orders[i].orderRelationTeachers = $scope.orders[0].orderRelationTeachers
                    $scope.orders[i].tryListenFlag = $scope.orders[0].tryListenFlag
                    $scope.orders[i].userId = $scope.orders[0].userId
                    $scope.orders[i].userId = $scope.orders[0].userId
                }
                if ($scope.orders[i].orderCategory == 3) {
                    $scope.orders[i].orderCourses = [{
                        'additionalAmount': $scope.orders[i].totalPrice,
                        'avaliableAmount': $scope.orders[i].totalPrice
                    }]
                }

                // 缴费日期改成日期格式
                if ($scope.orders[i].payDate) {
                    $scope.orders[i].payDate = new Date($scope.orders[i].payDate)
                }
                if ($scope.orders[i].crmorderPayments && $scope.orders[i].crmorderPayments.length) {
                    angular.forEach($scope.orders[i].crmorderPayments, function (data) {
                        data.payDate = new Date(data.payDate)
                    })
                }

                // $scope.orders[i].privilegeAmountTemp = Number(($scope.orders[i].totalPrice * $scope.orders[i].privilegeRatio / 100).toFixed(2));
                // 直减优惠
                // $scope.orders[i].privilegeAmount = Number(($scope.orders[i].totalPrice - $scope.orders[i].privilegeAmountTemp).toFixed(2));
                // 应付金额
                $scope.orders[i].realTotalAmount = (($scope.orders[i].totalPrice * 100) - ($scope.orders[i].privilegeAmount * 100)) / 100;
                // $scope.orders[i].realTotalAmount =
                reseatPue(i)
                // 实付金额 20180529放开
                updateRealPayAmount($scope.orders[i])
                // $scope.orders[i].realPayAmount = $scope.orders[i].realTotalAmount - $scope.orders[i].payDueAmount

                // if (orderStatus == 14 && i == 0) {
                //     $scope.orders[i].orderStatus = 2
                // }
            }
            if (flag) {
                return false
            }
            // if (!arg) {
            //
            // }
            if (!$scope.skipAppend) {
                appendServerPay($scope.orders)
            }
            if (orderStatus == 14) {
                $scope.orders[0].orderStatus = 2
            }
            var promise = OrderService.batchUpdate($scope.orders);
            promise.then(function (data) {
                if (arguments.length) {
                    $scope.getRemindsData($rootScope.isRemindsContentShow, $rootScope.hkSelectedKinds, 1);
                    _existNews()
                }
                SweetAlert.swal('操作成功');
                try {
                    $scope.modal.hide();
                } catch (e) {
                    $scope.editOrderModal.hide();
                } finally {
                    // if (!($scope.modal === undefined)) {
                    //     $scope.modal.hide();
                    // }
                    $scope.refreshTabs(); // 刷新表单
                    if ($scope.customerEditFlag) {
                        $scope.refreshCustomerOrderDetail();
                    }
                }
            }, function (error) {
                SweetAlert.swal(error || '操作失败');
                // $scope.editOrderModal.hide();
            });
        }

        /**
         * 判断是否可以刷新消息
         * @private
         */
        function _existNews() {
            if ($scope.getMsgCount) {
                if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaozhang || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaozhang) {//校长
                    $scope.getMsgCount(3);
                } else if ($rootScope.isRemindsContentShow == 2 && $scope.isHxiaoquzhuguan || $rootScope.isRemindsContentShow == 1 && $scope.isHxiaoquzhuguan) {
                    $scope.getMsgCount(2);
                } else {
                    $scope.getMsgCount(1);
                }
            }
        }


        function validateSuccess() {
            var arg = arguments;
            setTimeByType($scope.orders)
            if ($scope.order.orderStatus == 14 || $scope.orders[0].orderStatus == 14) {
                $scope.updateV2()
            } else if ($scope.orderOperating < 5) {
                add()
            } else {
                update(arg.length)
            }
            _getOrderCopy($scope.orders);
            if ($scope.getIndexData) {
                $scope.getIndexData(3)
            }
        }

        /**
         * 返回并重置签约时间和到期时间
         * @returns {*}
         * @private
         */
        function _getOrderCopy(obj) {
            if (obj.constructor == Array) {
                var data = angular.copy(obj)
                for (var i = 0; i < data.length; i++) {
                    data[i].contractEndDate = _contractEndDate
                    data[i].contractStartDate = _contractStartDate
                }
                return data;
            } else {
                var data = angular.copy($scope.order)
                $scope.order.contractEndDate = _contractEndDate
                $scope.order.contractStartDate = _contractStartDate
                return data
            }
        }

        function requireToAdd() {
            for (var i = 0, len = $scope.orders.length; i < len; i++) {
                updateRealPayAmount($scope.orders[i])
            }
            switch ($scope.orderOperating) {
                case 1://  学员管理列表-->买课程
                case 3://  对选中学生签约
                case 4://  我的意向客户列表-->买课程
                    return OrderService.addBatch(_getOrderCopy($scope.orders));
                    break;
                case 2://  创建新意向客户并签约
                    return OrderService.addAndNewLead(_getOrderCopy());
                    break;
            }
        }

        /*
         *
         * 刷新父级页面列表
         * $scope.orderOperating
         * 订单类型
         */
        function reloadParentUrl() {
            switch ($scope.orderOperating) {
                case 1://  学员管理列表-->买课程
                    //  学员管理列表-->买课程
                    $scope.refreshCustomerOrderDetail();
                    break;
                // case 4 :
                case 2://  创建新意向客户并签约

                case 3://  对选中学生签约
                    $scope.schoolCrmLeadsStudentListTableState = {};
                    if ($scope.getList) {//刷新lead列表
                        $scope.getList($scope.schoolCrmLeadsStudentListTableState);
                    }
                    break;
            }

        }

        /**
         * 选择交费情况 全部缴费、部分交费、未缴费 fanl
         */
        $scope.seletPayCondition = function seletPayCondition(type) {
            if (type == 1) {
                $scope.PayDisabled = true;
                var realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
                var consumeAccountBalance = $scope.order.consumeAccountBalance;
                $scope.order.realPayAmount = (realTotalAmount - consumeAccountBalance).toFixed(2);
                $scope.order.realPayAmount = isNaN($scope.order.realPayAmount) ? 0.00 : $scope.order.realPayAmount
            } else if (type == 2) {
                $scope.PayDisabled = false;
                $scope.order.realPayAmount = "";
            } else if (type == 3) {
                $scope.PayDisabled = true;
                $scope.order.realPayAmount = 0;
            }
            $("#payType" + type).addClass("active").siblings().removeClass("active");
        };
        /**
         * 改变使用金额清空交费情况
         */
        $scope.resetPayCondition = function resetPayCondition() {
            _orderOperating()
            _conductPayments();
            $scope.PayDisabled = true;
            //计算下折扣率
            $scope.order.privilegeRatio = 100 - Number(($scope.order.privilegeAmount * 100 / $scope.order.totalPrice).toFixed(1));
            $scope.order.privilegeRatio = Number($scope.order.privilegeRatio.toFixed(1));
        }
        /**
         * 改变使用金额清空交费情况
         */
        $scope.resetPayConditionV2 = function resetPayConditionV2() {
            _orderOperatingV2()
            _conductPaymentsV2();
            $scope.PayDisabled = true;
            //计算下折扣率
            $scope.moreOrder.privilegeRatio = 100 - Number(($scope.moreOrder.privilegeAmount * 100 / $scope.moreOrder.totalPrice).toFixed(1));
            $scope.moreOrder.privilegeRatio = Number($scope.moreOrder.privilegeRatio.toFixed(1));
        }
        /**
         * 改变使用金额清空交费情况
         */
        $scope.resetPayConditionV3 = function resetPayConditionV3(index) {
            // $("#payType1").removeClass("active").siblings().removeClass("active");
            // $scope.orders[$scope.cIndex].realPayAmount = "";
            // _conductPayments($scope.cIndex);
            _orderOperating(index)
            // _conductPayments(index);
            $scope.orders[index].realPayAmount = 0;
            $scope.orders[index].paymentsWrite = false;
            if (isNaN($scope.orders[index].totalPrice)) {
                $scope.orders[index].totalPrice = 0;
            }
            // 尾款金额需要计算出来
            var crmorderPayments = angular.copy($scope.orders[index].crmorderPayments.reverse())
            angular.forEach(crmorderPayments, function (data, i, array) {
                if (Number(data.payAmount) <= 0) {
                    $scope.orders[index].paymentsWrite = true;
                }
                $scope.orders[index].realPayAmount = Number($scope.orders[index].realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount
                var ii = i
                while (ii > 0) {
                    data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                    ii--
                }
                // if (i === 0) {
                //     data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount;
                // } else {
                //     data.payDueAmount = crmorderPayments[i-1].payDueAmount - data.payAmount
                // }
                if (Number(data.payDueAmount) < 0) {
                    $scope.orders[index].paymentsWrite = true;
                }
                if (isNaN(data.payDueAmount)) {
                    data.payDueAmount = 0;
                }
            });
            $scope.orders[index].crmorderPayments = angular.copy(crmorderPayments.reverse())
            $scope.PayDisabled = true;
            //计算下折扣率
            $scope.orders[index].privilegeRatio = 100 - Number(($scope.orders[index].privilegeAmount * 100 / $scope.orders[index].totalPrice).toFixed(1));
            $scope.orders[index].privilegeRatio = Number($scope.orders[index].privilegeRatio.toFixed(1));

        }
        /**
         * 输入折扣率时自动计算
         */
        $scope.getDiscount = function getDiscount(index) {
            if (index >= 0) {
                //根据折扣率计算优惠金额，
                $scope.orders[index].privilegeAmountTemp = Number(($scope.orders[index].totalPrice * $scope.orders[index].privilegeRatio / 100).toFixed(2));
                $scope.orders[index].privilegeAmount = Number(($scope.orders[index].totalPrice - $scope.orders[index].privilegeAmountTemp).toFixed(2));
                _orderOperating(index)
                _conductPayments(index);
                $scope.PayDisabled = true;
            } else {
                //根据折扣率计算优惠金额，
                $scope.order.privilegeAmountTemp = Number(($scope.order.totalPrice * $scope.order.privilegeRatio / 100).toFixed(2));
                $scope.order.privilegeAmount = Number(($scope.order.totalPrice - $scope.order.privilegeAmountTemp).toFixed(2));
                _orderOperating()
                _conductPayments();
                $scope.PayDisabled = true;
            }
        }
        /**
         * 输入折扣率时自动计算
         */
        $scope.getDiscountV2 = function getDiscountV2(index) {
            //根据折扣率计算优惠金额，
            $scope.moreOrder.privilegeAmountTemp = Number(($scope.moreOrder.totalPrice * $scope.moreOrder.privilegeRatio / 100).toFixed(2));
            $scope.moreOrder.privilegeAmount = Number(($scope.moreOrder.totalPrice - $scope.moreOrder.privilegeAmountTemp).toFixed(2));
            _orderOperatingV2(index)
            _conductPaymentsV2(index);
            $scope.PayDisabled = true;
        }

        $scope.changeStandardPrice = function changeStandardPrice(index, cindex) {
            if ($scope.$parent.orderOperating == 5 || $scope.$parent.orderOperating == 10) {
                var __order = $scope.orders[index]
                __order.totalOriginalNum = 0;
                __order.totalOriginalTimes = 0;
                __order.totalPrice = 0;
                _priceV3(index, cindex)
                // 判断时长
                if (__order.orderRule == 1) {
                    __order.hours = __order.totalOriginalNum;
                    __order.minite = 0;
                } else {
                    __order.hours = parseInt(__order.totalOriginalNum * 40 / 60);
                    __order.minite = parseInt((__order.totalOriginalNum * 40) % 60);
                }

                //若折扣率有值重新计算优惠的金额
                if (__order.privilegeRatio != undefined && __order.privilegeRatio != '') {
                    __order.privilegeAmountTemp = Number((__order.totalPrice * __order.privilegeRatio / 100).toFixed(2));
                    __order.privilegeAmount = Number((__order.totalPrice - __order.privilegeAmountTemp).toFixed(2));
                }
                // 尾款金额需要计算出来
                var crmorderPayments = __order.crmorderPayments.reverse()
                angular.forEach(crmorderPayments, function (data, i, array) {
                    if (Number(data.payAmount) <= 0) {
                        __order.paymentsWrite = true;
                    }
                    __order.realPayAmount = Number(__order.realPayAmount) + Number(data.payAmount);
                    // data.payDueAmount = __order.totalPrice - Number(__order.privilegeAmount) - $scope.order.realPayAmount;
                    data.payDueAmount = __order.totalPrice - Number(__order.privilegeAmount) - data.payAmount
                    var ii = i
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }
                    if (Number(data.payDueAmount) < 0) {
                        __order.paymentsWrite = true;
                    }
                    if (isNaN(data.payDueAmount)) {
                        data.payDueAmount = 0;
                    }
                });
                __order.crmorderPayments = angular.copy(crmorderPayments.reverse())
            } else {
                $scope.order.totalOriginalNum = 0;
                $scope.order.totalOriginalTimes = 0;
                $scope.order.totalPrice = 0;
                _price()
                // 判断时长
                if ($scope.order.orderRule == 1) {
                    $scope.order.hours = $scope.order.totalOriginalNum;
                    $scope.order.minite = 0;
                } else {
                    $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                    $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
                }

                //若折扣率有值重新计算优惠的金额
                if ($scope.order.privilegeRatio != undefined && $scope.order.privilegeRatio != '') {
                    $scope.order.privilegeAmountTemp = Number(($scope.order.totalPrice * $scope.order.privilegeRatio / 100).toFixed(2));
                    $scope.order.privilegeAmount = Number(($scope.order.totalPrice - $scope.order.privilegeAmountTemp).toFixed(2));
                }
                console.log($scope.order.orderCourses[0])
                // 去掉样式，将本次支付金额置空   fanl
                _orderOperating();
                _conductPayments();
            }
            reseatPue(index)
        };

        $scope.changeStandardPriceV2 = function changeStandardPrice() {
            $scope.moreOrder.totalOriginalNum = 0;
            $scope.moreOrder.totalOriginalTimes = 0;
            $scope.moreOrder.totalPrice = 0;
            _priceV2()
            // 判断时长
            if ($scope.moreOrder.orderRule == 1) {
                $scope.moreOrder.hours = $scope.moreOrder.totalOriginalNum;
                $scope.moreOrder.minite = 0;
            } else {
                $scope.moreOrder.hours = parseInt($scope.moreOrder.totalOriginalNum * 40 / 60);
                $scope.moreOrder.minite = parseInt(($scope.moreOrder.totalOriginalNum * 40) % 60);
            }

            //若折扣率有值重新计算优惠的金额
            if ($scope.moreOrder.privilegeRatio != undefined && $scope.moreOrder.privilegeRatio != '') {
                $scope.moreOrder.privilegeAmountTemp = Number(($scope.moreOrder.totalPrice * $scope.moreOrder.privilegeRatio / 100).toFixed(2));
                $scope.moreOrder.privilegeAmount = Number(($scope.moreOrder.totalPrice - $scope.moreOrder.privilegeAmountTemp).toFixed(2));
            }
            // 去掉样式，将本次支付金额置空   fanl
            _orderOperatingV2();
            _conductPaymentsV2();

        };

        /**
         * 对应的处理尾款
         */
        function _conductPayments(index) {
            if (index >= 0) {
                $scope.orders[index].realPayAmount = 0;
                $scope.orders[index].paymentsWrite = false;
                if (isNaN($scope.orders[index].totalPrice)) {
                    $scope.orders[index].totalPrice = 0;
                }
                // 尾款金额需要计算出来
                var crmorderPayments = angular.copy($scope.orders[index].crmorderPayments.reverse())
                angular.forEach(crmorderPayments, function (data, i, array) {
                    if (Number(data.payAmount) <= 0) {
                        $scope.orders[index].paymentsWrite = true;
                    }

                    $scope.orders[index].realPayAmount = Number($scope.orders[index].realPayAmount) + Number(data.payAmount);

                    data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount
                    var ii = i
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }

                    // data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount;
                    if (Number(data.payDueAmount) < 0) {
                        $scope.orders[index].paymentsWrite = true;
                    }
                    if (isNaN(data.payDueAmount)) {
                        data.payDueAmount = 0;
                    }
                });
                $scope.orders[index].crmorderPayments = angular.copy(crmorderPayments.reverse())
                $scope.orders[index].privilegeAmount = ($scope.orders[index].totalPrice * ((100 - $scope.orders[index].privilegeRatio) / 100)).toFixed(1)
                //计算下折扣率
                // $scope.orders[index].privilegeRatio = 100 - Number(($scope.orders[index].privilegeAmount * 100 / $scope.orders[index].totalPrice).toFixed(1));
                // $scope.orders[index].privilegeRatio = Number($scope.orders[index].privilegeRatio.toFixed(1));
            } else {
                $scope.order.realPayAmount = 0;
                $scope.order.paymentsWrite = false;
                if (isNaN($scope.order.totalPrice)) {
                    $scope.order.totalPrice = 0;
                }
                // 尾款金额需要计算出来
                var crmorderPayments = angular.copy($scope.order.crmorderPayments.reverse())
                angular.forEach(crmorderPayments, function (data, index, array) {
                    if (Number(data.payAmount) <= 0) {
                        $scope.order.paymentsWrite = true;
                    }
                    $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                    // data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                    data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - data.payAmount
                    var ii = index
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }
                    if (Number(data.payDueAmount) < 0) {
                        $scope.order.paymentsWrite = true;
                    }
                    if (isNaN(data.payDueAmount)) {
                        data.payDueAmount = 0;
                    }
                });
                $scope.order.crmorderPayments = angular.copy(crmorderPayments.reverse())
            }
        }

        /**
         * 对应的处理尾款
         */
        function _conductPaymentsV2() {
            $scope.moreOrder.realPayAmount = 0;
            $scope.moreOrder.paymentsWrite = false;
            if (isNaN($scope.moreOrder.totalPrice)) {
                $scope.moreOrder.totalPrice = 0;
            }
            // 尾款金额需要计算出来
            var crmorderPayments = angular.copy($scope.moreOrder.crmorderPayments.reverse())
            angular.forEach(crmorderPayments, function (data, index, array) {
                if (Number(data.payAmount) <= 0) {
                    $scope.moreOrder.paymentsWrite = true;
                }
                $scope.moreOrder.realPayAmount = Number($scope.moreOrder.realPayAmount) + Number(data.payAmount);
                // data.payDueAmount = $scope.moreOrder.totalPrice - Number($scope.moreOrder.privilegeAmount) - $scope.moreOrder.realPayAmount;
                data.payDueAmount = $scope.moreOrder.totalPrice - Number($scope.moreOrder.privilegeAmount) - data.payAmount
                var ii = index
                while (ii > 0) {
                    data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                    ii--
                }
                if (Number(data.payDueAmount) < 0) {
                    $scope.moreOrder.paymentsWrite = true;
                }
                if (isNaN(data.payDueAmount)) {
                    data.payDueAmount = 0;
                }
            });
            $scope.moreOrder.crmorderPayments = angular.copy(crmorderPayments.reverse())
            //计算下折扣率
            $scope.moreOrder.privilegeRatio = 100 - Number(($scope.moreOrder.privilegeAmount * 100 / $scope.moreOrder.totalPrice).toFixed(1));
            $scope.moreOrder.privilegeRatio = Number($scope.moreOrder.privilegeRatio.toFixed(1));
        }

        function _conductPaymentsDX() {
            $scope.order.realPayAmount = 0;
            $scope.order.paymentsWrite = false;
            if (isNaN($scope.order.totalPrice)) {
                $scope.order.totalPrice = 0;
            }
            for (var i = $scope.order.crmorderPayments.length - 1; i >= 0; i--) {
                var data = $scope.order.crmorderPayments[i];
                if (Number(data.payAmount) <= 0) {
                    $scope.order.paymentsWrite = true;
                }
                $scope.order.realPayAmount = Number($scope.order.realPayAmount) + Number(data.payAmount);
                data.payDueAmount = $scope.order.totalPrice - Number($scope.order.privilegeAmount) - $scope.order.realPayAmount;
                if (Number(data.payDueAmount) < 0) {
                    $scope.order.paymentsWrite = true;
                }
            }
            if ($scope.order.orderStatus == 14) {
                $scope.order.payDueAmount = 0 - Number($scope.order.realPayAmount);
            }
        }

        /**
         * 充值订单修改价格
         * @private
         */
        function _price() {
            if ($scope.orderOperating == 10) {//充值修改
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    $scope.order.totalOriginalNum = $scope.order.totalOriginalNum + data.originalNum;
                    $scope.order.totalPrice = $scope.order.totalPrice + (originalNum * data.actualPrice);
                });
            } else {
                angular.forEach($scope.order.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.regularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        $scope.order.totalOriginalTimes = parseInt($scope.order.totalOriginalTimes) + parseInt(originalNum);
                    } else {

                        $scope.order.totalOriginalNum = parseInt($scope.order.totalOriginalNum) + parseInt(originalNum);
                    }
                    $scope.order.totalPrice = $scope.order.totalPrice + (data.originalNum * data.actualPrice);
                    //$scope.order.totalPrice = $scope.order.totalPrice.toFixed(2);
                    $scope.isShowClassAdd(index)
                });
            }
        }

        /**
         * 充值订单修改价格
         * @private
         */
        function _priceV2() {
            if ($scope.orderOperating == 10) {//充值修改
                angular.forEach($scope.moreOrder.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    $scope.moreOrder.totalOriginalNum = $scope.moreOrder.totalOriginalNum + data.originalNum;
                    $scope.moreOrder.totalPrice = $scope.moreOrder.totalPrice + (originalNum * data.actualPrice);
                });
            } else {
                angular.forEach($scope.moreOrder.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.regularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        $scope.moreOrder.totalOriginalNum = parseInt($scope.moreOrder.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        $scope.moreOrder.totalOriginalTimes = parseInt($scope.moreOrder.totalOriginalTimes) + parseInt(originalNum);
                    } else {

                        $scope.moreOrder.totalOriginalNum = parseInt($scope.moreOrder.totalOriginalNum) + parseInt(originalNum);
                    }
                    $scope.moreOrder.totalPrice = $scope.moreOrder.totalPrice + (data.originalNum * data.actualPrice);
                    //$scope.order.totalPrice = $scope.order.totalPrice.toFixed(2);
                    $scope.isShowClassAdd(index)
                });
            }
        }

        /**
         * 充值订单修改价格
         * @private
         */
        function _priceV3(index1, cindex) {
            var __order = $scope.orders[index1]
            if ($scope.orderOperating == 10) {//充值修改
                angular.forEach(__order.orderCourses, function (data, index, array) {
                    //data等价于array[index]
                    //console.log(data.a+'='+array[index].a);
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    __order.totalOriginalNum = __order.totalOriginalNum + data.originalNum;
                    __order.totalPrice = __order.totalPrice + (originalNum * data.actualPrice);
                });
                _conductPayments(index1);
            } else {
                angular.forEach(__order.orderCourses, function (data, index, array) {
                    var originalNum = data.originalNum;
                    if (!originalNum || originalNum == '') {
                        originalNum = 0;
                    }
                    // 判断是否是期 是期，则单位为 次或期 、小时或期，若是期，数量=每次的次数（或小时）* 期数
                    if (data.isRegularCharge) {
                        if (data.courseBuyUnit == 3) {
                            originalNum = originalNum * data.regularTimes;
                            data.isRegularCharge = true;
                        }
                    }
                    // 按课时计费
                    if (data.courseUnit == 1) {
                        __order.totalOriginalNum = parseInt(__order.totalOriginalNum) + parseInt(originalNum);
                    } else if (data.courseUnit == 2) {
                        __order.totalOriginalTimes = parseInt(__order.totalOriginalTimes) + parseInt(originalNum);
                    } else {

                        __order.totalOriginalNum = parseInt(__order.totalOriginalNum) + parseInt(originalNum);
                    }
                    __order.totalPrice = __order.totalPrice + (data.originalNum * data.actualPrice);
                    //$scope.order.totalPrice = $scope.order.totalPrice.toFixed(2);
                    $scope.isShowClassAddV3(index1, index)
                });
            }
        }

        function _orderOperating(index) {
            if (index >= 0) {
                $("#payType1").removeClass("active").siblings().removeClass("active");
                $scope.orders[index].realPayAmount = "";
            } else if ($scope.orderOperating < 5) {
                $("#payType1").removeClass("active").siblings().removeClass("active");
                $scope.order.realPayAmount = "";
            }
        }

        function _orderOperatingV2() {
            $("#payType1").removeClass("active").siblings().removeClass("active");
            $scope.moreOrder.realPayAmount = "";
        }

        $scope.isShowClassAdd = function isShowClassAdd(index) {
            $scope.filter = {};
            // 点击选班时，展示班级的列表
            $scope.filter.start = 0;
            $scope.filter.size = 10;
            $scope.filter.courseId = $scope.order.orderCourses[index].courseId;
            $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
            var promise = ClassManagementService.getClassesByFilter($scope.filter);
            promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        $scope.order.orderCourses[index].isShow = false
                    } else {
                        $scope.MyCrmCustomerStudentClassList = response.data.list;
                        if ($scope.MyCrmCustomerStudentClassList.length > 0) {
                            $scope.order.orderCourses[index].isShow = true;
                        }
                    }

                },
                function (error) {
                });
        }

        $scope.isShowClassAddV3 = function isShowClassAddV3(index, cindex) {
            var __order = $scope.orders[index]
            $scope.filter = {};
            // 点击选班时，展示班级的列表
            $scope.filter.start = 0;
            $scope.filter.size = 10;
            $scope.filter.courseId = __order.orderCourses[cindex].courseId;
            $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
            var promise = ClassManagementService.getClassesByFilter($scope.filter);
            promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        __order.orderCourses[cindex].isShow = false
                    } else {
                        $scope.MyCrmCustomerStudentClassList = response.data.list;
                        if ($scope.MyCrmCustomerStudentClassList.length > 0) {
                            __order.orderCourses[cindex].isShow = true;
                        }
                    }

                },
                function (error) {
                });
        }

        /**
         * 订单删除课程信息
         */
        $scope.delOrderCourse = function delOrderCourse(obj) {
            if (!obj.originalNum || obj.originalNum == '') {
                obj.originalNum = 0;
            }
            $scope.order.totalOriginalNum = $scope.order.totalOriginalNum - obj.originalNum;
            $scope.order.totalPrice = $scope.order.totalPrice - (obj.originalNum * obj.actualPrice);
            $scope.order.orderCoursesNew = [];
            angular.forEach($scope.order.orderCourses, function (data, index, array) {
                if (data.$$hashKey != obj.$$hashKey) {
                    $scope.order.orderCoursesNew.push(data);
                }
            });
            // 判断时长
            if ($scope.order.orderRule == 1) {
                $scope.order.hours = $scope.order.totalOriginalNum;
                $scope.order.minite = 0;
            } else {
                $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
            }
            $scope.order.orderCourses = $scope.order.orderCoursesNew;
            // 去掉样式，将本次支付金额置空   fanl
            _orderOperating()
        };

        /**
         * 订单删除课程信息
         */
        $scope.delOrderCourseV2 = function delOrderCourseV2(obj, pindex) {
            if (!obj.originalNum || obj.originalNum == '') {
                obj.originalNum = 0;
            }
            $scope.orders[pindex].totalOriginalNum = $scope.orders[pindex].totalOriginalNum - obj.originalNum;
            $scope.orders[pindex].totalPrice = $scope.orders[pindex].totalPrice - (obj.originalNum * obj.actualPrice);
            $scope.orders[pindex].orderCoursesNew = [];
            angular.forEach($scope.orders[pindex].orderCourses, function (data, index, array) {
                /*if (data.$$hashKey != obj.$$hashKey) {
                    $scope.orders[pindex].orderCoursesNew.push(data);
                }*/
                if (data.id != obj.id) {
                    $scope.orders[pindex].orderCoursesNew.push(data);
                }
            });
            // 判断时长
            if ($scope.orders[pindex].orderRule == 1) {
                $scope.orders[pindex].hours = $scope.orders[pindex].totalOriginalNum;
                $scope.orders[pindex].minite = 0;
            } else {
                $scope.orders[pindex].hours = parseInt($scope.orders[pindex].totalOriginalNum * 40 / 60);
                $scope.orders[pindex].minite = parseInt(($scope.orders[pindex].totalOriginalNum * 40) % 60);
            }
            $scope.orders[pindex].orderCourses = $scope.orders[pindex].orderCoursesNew;
            if (!$scope.orders[pindex].orderCourses.length) {
                $scope.orders[pindex].privilegeAmount = 0
            }
            // 去掉样式，将本次支付金额置空   fanl
            _orderOperating(pindex)
        };

        /**
         * 进行选班操作
         */
        $scope.selectCrmClass = function selectCrmClass(courseId, index) {
            $scope.modalClassTitle = '班级管理';
            $scope.selectCourseId = courseId;
            $scope.selectIndex = index;
            $scope.selectCrmClassModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/order/selectCrmClass.html',
                show: true
            });
        }
        /**
         * 更改订单课时规格
         */
        $scope.changeOrderRule = function changeOrderRule() {
            // 判断时长
            if ($scope.order.orderRule == 1) {
                $scope.order.hours = $scope.order.totalOriginalNum;
                $scope.order.minite = 0;
            } else {
                $scope.order.hours = parseInt($scope.order.totalOriginalNum * 40 / 60);
                $scope.order.minite = parseInt(($scope.order.totalOriginalNum * 40) % 60);
            }
            if ($scope.order.orderStatus == 14) {
                _conductPayments();
            }
        }
        /**
         * 进行添加业绩计算比例的操作
         */
        $scope.showAddAchievementRatio = function showAddAchievementRatio(type) {
            $scope.relationType = type;
            $scope.relationTypeFlag = false;
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
            // 若订单是新签、推荐设置选择教师的类型  只能选试听教师、续费只能选授课教师
            if (type == 2) {
                if ($scope.order.orderType == 1 || $scope.order.orderType == 5) {
                    $scope.order.achievementRatio.relationType = 1;
                    $scope.relationTypeFlag = true;
                } else if ($scope.order.orderType == 2) {
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
                $scope.orders[0].ratioInvalid = true;
            } else {
                $scope.order.ratioInvalid = false;
                $scope.orders[0].ratioInvalid = false;
            }
        }

        /**
         * 保存业绩信息
         */
        $scope.saveAchievementRatioV2 = function (achievementRatios, orderRelationTeachers, ratioInvalid) {
            $scope.orders[0].achievementRatios = achievementRatios
            $scope.orders[0].orderRelationTeachers = orderRelationTeachers
            $scope.orders[0].ratioInvalid = ratioInvalid
        }

        /*$scope.$watch('order.achievementRatio',function(newValue,oldValue){
         console.log(newValue,oldValue)
         })*/

        /**
         * 删除某条业绩比例表
         */
        $scope.removeRatio = function removeRatio(row, type, arg) {
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
                        _deleteRatio(row, arg);
                    }
                }
            );
        }

        // $scope.mediaChannel2List = [];
        /**
         * 渠道变更获取渠道详情
         * @lishiming 2016-11-02
         */
        /*$scope.mediaChannel1Change = function () {
            if ($scope.order.leadMediaChannelId1) {
                CommonService.getMediaChannel($scope.order.leadMediaChannelId1).then(function (result) {
                    //console.dir(result.data);
                    $scope.mediaChannel2List = result.data;
                    //$scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
                });
            } else {
                $scope.mediaChannel2List = [];
                //$scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
            }
        }*/
        $scope.mediaChannel2List = [];
        $scope.mediaChannel3List = [];
        $scope.mediaChannel1Change = function () {
            if ($scope.order.leadMediaChannelId1) {
                CommonService.getMediaChannel($scope.order.leadMediaChannelId1).then(function (result) {
                    //console.dir(result.data);
                    $scope.mediaChannel2List = result.data;
                    //$scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
                });
            } else {
                $scope.mediaChannel2List = [];
                //$scope.CrmLeadsStudentVoForCreate.media_channel_id_2 = null;
            }
        }

        $scope.mediaChannel2Change = function () {
            if ($scope.order.leadMediaChannelId2) {
                CommonService.getMediaChannel($scope.order.leadMediaChannelId2).then(function (result) {
                    $scope.mediaChannel3List = result.data;
                });
            } else {
                $scope.mediaChannel3List = [];
                $scope.order.leadMediaChannelId3 = null;
            }
        }

        /**
         * 删除业绩比例信息
         * @param list
         * @private
         */
        function _deleteRatio(row, arg) {
            var userId = row.userId;
            if ($scope.relationType == 1) {
                var order = {}
                if (arg == -1) {
                    order = $scope.order
                } else {
                    order = $scope.orders[0]
                }
                // var order = $scope.orders[0] || $scope.order
                var totalRatio = 0;
                var achievementRatios = angular.copy(order.achievementRatios);

                // 删除当前排课列表
                for (var j = 0; j < achievementRatios.length; j++) {
                    if (achievementRatios[j].userId == userId) {
                        order.achievementRatios.splice(j, 1);
                    }
                }
                // 删除后判断现有的 比例之和是否是1，不是1 不合法
                for (var i = 0; i < order.achievementRatios.length; i++) {
                    totalRatio = Number(order.achievementRatios[i].achievementRatio) + Number(totalRatio);
                }
                if (totalRatio != 1) {
                    order.ratioInvalid = true;
                } else {
                    order.ratioInvalid = false;
                }
            } else if ($scope.relationType == 2) {
                var relationTeachers = angular.copy($scope.order.orderRelationTeachers);
                for (var j = 0; j < relationTeachers.length; j++) {
                    if (relationTeachers[j].userId == userId) {
                        $scope.orders[0].orderRelationTeachers.splice(j, 1);
                    }
                }
            }
        }

        /**
         * 从查看进来那么返回查看，否则关闭modal
         */
        $scope.closeModal = function () {
            if ($scope.orderIng) {
                $scope.modalTitle = '查看'
                $scope.modalTitleDetail = ''
                $scope.orderOperating = $scope.orderIng
            } else {
                $scope.modal.hide();
            }
        }
        /**
         * 订单详情里操作
         * @param arg
         */
        $scope.operating = function (arg) {
            $scope.orderOperating = arg
            $scope.modalTitleDetail = '';
            switch (arg) {
                case 6:
                    $scope.modalTitle = '查看';
                    break;
                case 7:
                    $scope.getOrderPayments();
                    $scope.order.repeatClick = false;
                    $scope.modalTitle = '审核';
                    break;
                case 8:
                    $scope.getOrderPayments()
                    $scope.modalTitle = '退费';
                    break;
            }
            _orderOpen(arg)
        }

        /**
         * 保存查看变量标志
         * @param arg
         * 值为6是为查看
         * @private
         */
        function _orderOpen(arg) {
            if (6 == arg) {
                $scope.orderIng = arg
            }
        }

        _orderOpen($scope.orderOperating);
        /*(function () {
            // 默认加一条业绩提醒的记录，默认的业绩人为当前登录用户
            var authenticationUser = AuthenticationService.currentUser();
            // 部门信息
            $scope.order.achievementRatio.departmentId = authenticationUser.school_id;
            $scope.order.achievementRatio.departName = authenticationUser.department.name;
            // 业绩人信息
            $scope.order.achievementRatio.userId = authenticationUser.id;
            $scope.order.achievementRatio.userName = authenticationUser.name;
            // 业绩人岗位信息
            $scope.order.achievementRatio.positionId = authenticationUser.position_id;
            $scope.order.achievementRatio.position = {};
            $scope.order.achievementRatio.position.id = authenticationUser.position_id;
            $scope.order.achievementRatio.position.name = authenticationUser.position_name;
            // 业绩比例默认100%
            $scope.order.achievementRatio.achievementRatio = 1;
            $scope.order.achievementRatios.push($scope.order.achievementRatio);
        })()*/

        $scope.order.paymentTempFlag = false;
        //课时订单  添加收费
        $scope.addShouFei = function (type, index) {
            if (index >= 0) {
                $scope.orders[index].totalPrice = isNaN($scope.orders[index].totalPrice) || $scope.orders[index].totalPrice == undefined || $scope.orders[index].totalPrice == "" ? 0.00 : $scope.orders[index].totalPrice;
                $scope.orders[index].privilegeAmount = isNaN($scope.orders[index].privilegeAmount) || $scope.orders[index].privilegeAmount == undefined || $scope.orders[index].privilegeAmount == "" ? 0.00 : $scope.orders[index].privilegeAmount;
                var realTotalAmount = ($scope.orders[index].totalPrice - $scope.orders[index].privilegeAmount).toFixed(2);
                //若是订单的金额为0,不允许进行收费操作，给除提示
                if (type == 1) {
                    $scope.orders[index].paymentTempFlag = true;
                }
                $scope.orders[index].realPayAmount = 0
                if (!$scope.orders[index].crmorderPayments) {
                    $scope.orders[index].crmorderPayments = []
                }
                $scope.orders[index].crmorderPayments.map(function (item) {
                    $scope.orders[index].realPayAmount += item.payAmount
                })
                if (realTotalAmount > 0) {
                    //将上次添加的记录置空
                    $scope.orders[index].supplementaryFee = "";
                    $scope.orders[index].payDate = new Date();
                    $scope.modalTitle = "添加收费";
                    $scope.updateIndex = index
                    $scope.addShouFeiModal = $modal({
                        scope: $scope,
                        // templateUrl: 'partials/sos/order/charge.html',
                        templateUrl: 'partials/v2.order/charge-1.html',
                        show: true
                    });
                } else {
                    SweetAlert.swal("应交金额应该大于0");
                    return;
                }
            } else {
                $scope.order.totalPrice = isNaN($scope.order.totalPrice) || $scope.order.totalPrice == undefined || $scope.order.totalPrice == "" ? 0.00 : $scope.order.totalPrice;
                $scope.order.privilegeAmount = isNaN($scope.order.privilegeAmount) || $scope.order.privilegeAmount == undefined || $scope.order.privilegeAmount == "" ? 0.00 : $scope.order.privilegeAmount;
                var realTotalAmount = Number($scope.order.totalPrice.toFixed(2)) - Number(Number($scope.order.privilegeAmount).toFixed(2));
                //若是订单的金额为0,不允许进行收费操作，给除提示
                if (type == 1) {
                    $scope.order.paymentTempFlag = true;
                }
                if (realTotalAmount > 0) {
                    //将上次添加的记录置空
                    $scope.order.supplementaryFee = "";
                    $scope.order.payDate = "";
                    $scope.modalTitle = "添加收费";
                    $scope.addShouFeiModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/sos/order/charge.html',
                        show: true
                    });
                } else {
                    SweetAlert.swal("应交金额应该大于0");
                    return;
                }
            }
        }
        //课时订单  添加收费
        $scope.addShouFeiV2 = function (type, index) {
            $scope.moreOrder.totalPrice = isNaN($scope.moreOrder.totalPrice) || $scope.moreOrder.totalPrice == undefined || $scope.moreOrder.totalPrice == "" ? 0.00 : $scope.moreOrder.totalPrice;
            $scope.moreOrder.privilegeAmount = isNaN($scope.moreOrder.privilegeAmount) || $scope.moreOrder.privilegeAmount == undefined || $scope.moreOrder.privilegeAmount == "" ? 0.00 : $scope.moreOrder.privilegeAmount;
            var realTotalAmount = Number($scope.moreOrder.totalPrice.toFixed(2)) - Number(Number($scope.moreOrder.privilegeAmount).toFixed(2));
            //若是订单的金额为0,不允许进行收费操作，给除提示
            if (type == 1) {
                $scope.moreOrder.paymentTempFlag = true;
            }
            if (realTotalAmount > 0) {
                //将上次添加的记录置空
                $scope.moreOrder.supplementaryFee = "";
                $scope.moreOrder.payDate = "";
                $scope.modalTitle = "添加收费";
                $scope.addShouFeiModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/v2.order/charge.html',
                    show: true
                });
            } else {
                SweetAlert.swal("应交金额应该大于0");
                return;
            }
        }

        /**
         * 结转-转入
         */
        function update_carry() {
            var arg = arguments
            // 买课程订单
            // $scope.order.orderCategory = 1;
            $scope.order.realTotalAmount = $scope.order.totalPrice - $scope.order.privilegeAmount;
            $scope.order.payDueAmount = $scope.order.totalPrice - $scope.order.privilegeAmount - $scope.order.realPayAmount - $scope.order.supplementaryFee;
            if ($scope.order.orderStatus != 15 && $scope.order.payDueAmount.toFixed(2) < 0) {
                SweetAlert.swal('订单尾款不能为负数');
                return false;
            }
            $scope.order.recharge = null;
            //$scope.order.achievementRatio = null;
            var promise = OrderService.editCarryOrder($scope.order);
            promise.then(function (data) {
                $scope.getCarryForwardList($scope.tableState);
                try {
                    $scope.modal.hide();
                } catch (e) {
                    $scope.$parent.modal.hide()
                }
                SweetAlert.swal({
                    title: "是否有附加的优惠或赠课协议？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '有, 继续添加',
                    cancelButtonText: '没有，确认提交',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        $scope.$parent.updateJiezhuan(true)
                        $scope.$parent.addstudentOrderV2(0)
                    } else {
                        SweetAlert.swal('操作成功');
                    }
                });
            }, function (error) {
                // $scope.dataLoading = false;
                SweetAlert.swal(error || '操作失败');
                // $scope.modal.hide();
            });

        }

        function reseatOrderNo() {
            var orderNo = $('[data-no]').val()
            if ($scope.orders && $scope.orders.length) {
                $scope.orders[0].orderNo = orderNo
                $scope.orders[0].nakedContract = $scope.order.nakedContract
                for (var i = 1, len = $scope.orders.length; i < len; i++) {
                    $scope.orders[i].orderNo = orderNo ? (orderNo + '-' + i) : ''
                }
            }
        }

        $scope.updateNakedContract = function (arg) {
            if (arg) {
                $('[data-no]').val('')
            }
            reseatOrderNo()
        }
        $scope.reseatOrders = function () {
            $scope.recommendStudent = {}
            var nakedContract = $scope.order.nakedContract
            if ($scope.order.orderType == 8 && $scope.orders && $scope.orders.length) {
                $scope.cancelFreeLessons(0)
                $scope.order.orderType = 8
                $scope.order.nakedContract = nakedContract
            }
            isShowServerInput()
        }
        $scope.reseatOrdersV2 = function (orderType) {
            $scope.recommendStudent = {}
            if ($scope.orders[0].orderType == 8) {
                var orders = angular.copy($scope.orders[0])
                $scope.orders = [orders]
            }
            isShowServerInput()
        }
        /**
         * 先收费订单签约-买课程订单
         */
        $scope.saveOrderNoSign = function () {
            if (!validateAchievementRatio($scope.order)) {
                return false
            }
            // $scope.order.masterSlaveRelation = 1;
            // $scope.order.orderCategory = 1;
            if ($scope.order.crmorderPayments[0].payDueAmount > 0 && $scope.order.crmorderPayments[0].payDueAmount < 0.001) {
                $scope.order.crmorderPayments[0].payDueAmount = 0
            }
            if ($scope.order.crmorderPayments[0].payDueAmount != 0) {
                SweetAlert.swal("转入金额和订单金额必须相等");
                return false
            }
            _conductPayments();
            if ($scope.order.paymentsWrite == true) {
                SweetAlert.swal("尾款或交费金额不能为负");
                return false
            }
            // 重新封装合同号
            if ($scope.order.orderNo == $scope.order.originalOrderNo && ($scope.order.orderStatus == 14 || $scope.order.orderStatus == 15)) {
                $scope.order.orderNo = $scope.order.orderNoNew;
            }
            // 若是无合同订单,重新封装该字段值
            $scope.order.nakedContract = $scope.order.nakedContract ? 1 : 0;
            if ($scope.order.orderCategory == 3) {
                var orderCourse = {
                    'additionalAmount': $scope.order.totalPrice,
                    'avaliableAmount': $scope.order.totalPrice
                };
                // if (!$scope.order.orderCourses) {
                //     $scope.order.orderCourses = []
                // }
                // $scope.order.orderCourses.push(orderCourse)
                // 修改bug 20180526
                $scope.order.orderCourses = [orderCourse]
            }
            //调用更新的方法
            if ($scope.order.orderStatus == 14) {
                $scope.order.realTotalAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100)) / 100;
                $scope.order.payDueAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100) - ($scope.order.supplementaryFee * 100)) / 100;
                //                $scope.order.payDueAmount = (($scope.order.totalPrice * 100) - ($scope.order.privilegeAmount * 100) - ($scope.order.realPayAmount * 100)) / 100;
                if ($scope.order.orderStatus != 14 && $scope.order.payDueAmount.toFixed(2) < 0) {
                    SweetAlert.swal('订单尾款不能为负数');
                    return;
                }
                $scope.order.orderNoFlag = 1;
                update();
            } else if ($scope.order.orderStatus == 15) {
                // 结转转入时调用
                update_carry();
            }
        }

        /**
         * 先收费那将某些值清空 开始
         */
        function _clealFirstOrder() {
            $scope.order.leadPhone = "";
            $scope.order.leadGradeId = "";
            $scope.order.leadMediaChannelId1 = "";
            $scope.order.leadMediaChannelId2 = "";
            $scope.order.crmStudentId = "";
        }

        var timerGo = ''
        // 模糊搜索的函数、
        $scope.gusseyourresult = function (row) {
            clearTimeout(timerGo)
            timerGo = setTimeout(function () {
                if ($scope.order.name) {
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
                        name: $scope.order.name
                    }
                    OrderService.vagueSearch(filter).then(function (result) {
                        $scope.gusseresult = result.data;
                        $scope.xue = "学";
                        $scope.ke = "客";
                        if ($scope.gusseresult.length === 0) {
                            // $scope.gusseresult=[{'name':'查询不到此条信息，请创建'}];
                            $scope.hasresult = false;
                            // $scope.addThisinput=function () {
                            //     // $scope.order.name='';
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
            }, 400)
        }
        // 点击其他地方模糊搜索的结果框消失
        $scope.hideThisul = function () {
            if ($scope.hasresult === 0) {
                $scope.order.name = '';
                $scope.hasresult = false;
            } else {

            }
        }
        // 学生年级
        $scope.oldGradeId = ''
        $scope.addThisinput = function (curdata, flag) {
            flag = flag || 0;
            // 封装order
            $scope.order.crmStudentId = curdata.crm_student_id;
            $scope.order.name = curdata.name;
            $scope.order.stuState = curdata.state;
            $scope.order.membershipLevel = curdata.membershipLevel;
            $scope.order.accountBalance = curdata.accountBalance;
            $scope.order.consumeAccountBalance = 0;
            $scope.order.gradeId = curdata.grade_id;
            // 判断是否有学生年级
            if (!$scope.oldGradeId) {
                $scope.oldGradeId = curdata.grade_id
            }
            if (flag === 1) {
                $scope.order.name = curdata.name;
            } else {
                // $scope.order.name=curdata.name+'   '+curdata.phone;
                $scope.order.name = curdata.name;
            }

            $scope.hasresult = false;
            $scope.showCreat = 1;
            // 先收费，选中后将页面的值自动关联
            $scope.currentStudent = angular.copy(curdata);
            $scope.order.leadPhone = $scope.currentStudent.phone;
            $scope.order.leadGradeId = $scope.currentStudent.grade_id;
            $scope.order.leadMediaChannelId1 = $scope.currentStudent.media_channel_id_1;
            $scope.order.leadMediaChannelId2 = $scope.currentStudent.media_channel_id_2
            $scope.order.leadMediaChannelId3 = $scope.currentStudent.media_channel_id_3
            $scope.order.crmStudentId = $scope.currentStudent.crm_student_id;
            $scope.gusseresult.length = 0
            $scope.mediaChannel1Change()
            $scope.mediaChannel2Change()
        }

        // 创建意向客户并排课的渠道联动
        $scope.detail = {};
        // $scope.mediaChannel1List = [];
        $scope.mediaChannel2List = [];
        $scope.mediaChannel1ChangeForUpdate = function (arg) {
            // if ($scope.detail.media_channel_id_1) {
            //     CommonService.getMediaChannel($scope.detail.media_channel_id_1).then(function (result) {
            //         $scope.mediaChannel2List = result.data;
            //     });
            // } else {
            //     $scope.mediaChannel2List = [];
            // }
            // $scope.detail.media_channel_id_2 = null;
            if ($scope.detail['media_channel_id_' + arg]) {
                CommonService.getMediaChannel($scope.detail['media_channel_id_' + arg]).then(function (result) {
                    $scope['mediaChannel' + (arg + 1) + 'List'] = result.data;
                });
            } else {
                $scope['mediaChannel' + (arg + 1) + 'List'] = [];
            }
            $scope.detail['media_channel_id_' + (arg + 1)] = null;
        }
        // 电话查重函数
        $scope.checkPhone = function () {
            if ($scope.detail.phone && $scope.detail.phone != '') {
                var phoneVo = {"phone": $scope.detail.phone};
                //console.log(phoneVo);
                var promise = CommonService.repeat(phoneVo);
                promise.then(
                    function (data) {
                        //console.log(data);
                        if (data.status == 'FAILURE') {
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
                //  $scope.order.name=$scope.detail.name;
                // var obj = {'crmStudentId':data.id,'name':$scope.detail.name,'accountBalance':0,'consumeAccountBalance':0,'gradeId':data.gradeId};
                $scope.order.crmStudentId = data.data.id;
                $scope.order.name = $scope.detail.name;
                // 新加会员等级
                $scope.order.membershipLevel = $scope.detail.membershipLevel || 1;
                $scope.order.stuState = $scope.detail.stuState || 2;
                $scope.order.accountBalance = 0;
                $scope.order.consumeAccountBalance = 0;
                $scope.order.gradeId = data.data.gradeId;
                $scope.showCreat = 1;

            }, function (error) {
                SweetAlert.swal("创建Leads失败");
            });
        }
        // * 编辑收费记录
        // */
        $scope.showEditPayment = function (row) {
            row.paymentEdit = false;
        }
        /**
         * 改变交费金额时，重新计算尾款金额
         */
        $scope.conductPayments = function (type, index) {
            if (type == 1) {
                _conductPaymentsDX();
            } else {
                _conductPayments(index);
                // $scope.getDiscount(index)
            }
            reseatPue(index)
        }
        $scope.conductPaymentsV2 = function (index, arg) {
            if (arg === 1) {
                $scope.orders[index].realPayAmount = 0;
                $scope.orders[index].paymentsWrite = false;
                if (isNaN($scope.orders[index].totalPrice)) {
                    $scope.orders[index].totalPrice = 0;
                }
                // 尾款金额需要计算出来
                var crmorderPayments = $scope.orders[index].crmorderPayments.reverse()
                angular.forEach(crmorderPayments, function (data, i, array) {
                    if (Number(data.payAmount) <= 0) {
                        $scope.orders[index].paymentsWrite = true;
                    }
                    $scope.orders[index].realPayAmount = Number($scope.orders[index].realPayAmount) + Number(data.payAmount);
                    // data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount;
                    // if (i === 0) {
                    //     data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount;
                    // } else {
                    //     data.payDueAmount = crmorderPayments[i - 1].payDueAmount - data.payAmount
                    // }

                    data.payDueAmount = $scope.orders[index].totalPrice - Number($scope.orders[index].privilegeAmount) - data.payAmount
                    var ii = i
                    while (ii > 0) {
                        data.payDueAmount -= crmorderPayments[ii - 1].payAmount
                        ii--
                    }

                    if (Number(data.payDueAmount) < 0) {
                        $scope.orders[index].paymentsWrite = true;
                    }
                    if (isNaN(data.payDueAmount)) {
                        data.payDueAmount = 0;
                    }
                });
                $scope.orders[index].crmorderPayments = crmorderPayments.reverse()
                $scope.PayDisabled = true;
                //计算下折扣率
                $scope.orders[index].privilegeRatio = 100 - Number(($scope.orders[index].privilegeAmount * 100 / $scope.orders[index].totalPrice).toFixed(1));
                $scope.orders[index].privilegeRatio = Number($scope.orders[index].privilegeRatio.toFixed(1));
            } else if (index >= 0) {
                _conductPayments(index);
            } else {
                _conductPaymentsV2()
            }
        }
        var orderEntrance = sessionStorage.getItem("orderJudgeEntrance");
        if (orderEntrance == 'addOrder') {
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    sessionStorage.setItem("orderJudgeEntrance", null);
                    $scope.order.contractStartDate = new Date(result.data);
                }
            })
        } else if (orderEntrance == 'firstCharge') {
            OrderService.getServeDate().then(function (result) {
                $rootScope.isModyfied = localStorageService.get("isModyfied");
                if (result.status = "SUCCESS") {
                    sessionStorage.setItem("orderJudgeEntrance", null);
                    $scope.order.payDate = new Date(result.data);
                    // $scope.order.recharge.payDate = new Date(result.data);
                }
            })
        } else {
            $rootScope.isModyfied = localStorageService.get("isModyfied");
        }


        /**
         * 多订单处理2017-12-18
         *
         */
        // 赠课或附加可
        $scope.freeLessons = false

        function initOrder() {
            //课时订单
            // $scope.order = {};
            $scope.order.orderCourses = [];
            $scope.order.crmorderPayments = [];
            //储值订单

            $scope.orderRecharge = {};
            $scope.orderRecharge.recharge = {};
            $scope.allChildOrder = [];


            $scope.orderTypeSelect = [{name: '新签', id: 1}, {name: '续费', id: 2}, {name: '返课', id: 3}, {
                name: '推荐',
                id: 5
            }, {name: '赠课', id: 8}];
            $scope.isCourseAuditionSelect = [{name: '是', id: 1}, {name: '否', id: 0}];
            if ($scope.orderRecharge.recharge == undefined) {
                $scope.orderRecharge.recharge = {};
            }
            $scope.orderRecharge.recharge.orderCourses = [];
            // 定义业绩的对象
            $scope.orderRecharge.recharge.achievementRatios = [];
            $scope.orderRecharge.recharge.achievementRatio = {};
            // 定义交费记录数组
            $scope.orderRecharge.recharge.crmorderPayments = [];
            $scope.orderRecharge.ratioInvalid = false;
            $scope.orderRecharge.recharge.totalOriginalNum = 0;
            $scope.orderRecharge.recharge.totalPrice = 0;
            $scope.orderRecharge.recharge.originalNum = 0;
            $scope.orderRecharge.rechargeNoExist = false;


            // $scope.orderRecharge.recharge.name = $scope.orderRecharge.name;
            // $scope.orderRecharge.recharge.accountBalance = $scope.orderRecharge.accountBalance;
            $scope.orderRecharge.recharge.totalPrice = $scope.orderRecharge.totalPrice;
            $scope.orderRecharge.recharge.gradeId = $scope.orderRecharge.gradeId;
            // $scope.orderRecharge.recharge.crmStudentId = $scope.orderRecharge.crmStudentId;
            $scope.orderRecharge.crmorderPayments = [];

            if ($scope.orders[0].orderCategory == 1) {
                $scope.orderRecharge.recharge.gradeId = $scope.orders[0].gradeId;
            }
            if ($scope.orders[0].recharge.orderCategory == 3) {
                $scope.orderRecharge.recharge.gradeId = $scope.orders[0].recharge.gradeId;
            }
        }

        $scope.batchTotalPrice = function () {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1) {
                    totalPrice += $scope.orders[i].totalPrice;
                } else {
                    try {
                        totalPrice += $scope.orders[i].recharge.totalPrice;
                    } catch (e) {
                        totalPrice += $scope.orders[i].totalPrice
                    }
                }
            }
            /*for (var i = 0; i < $scope.orderChildList.length; i++) {
                totalPrice += $scope.orderChildList[i].totalPrice;
            }
            for (var i = 0; i < $scope.orderRechargeChildList.length; i++) {
                totalPrice += $scope.orderRechargeChildList[i].recharge.totalPrice;
            }*/
            return totalPrice;
        }
        // 总折扣率的计算排除促销订单。
        $scope.batchTotalPriceV2 = function () {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1 && $scope.orders[i].slaveType != '促销课程' && $scope.orders[i].slaveType != '赠课') {
                    totalPrice += $scope.orders[i].totalPrice;
                } else if ($scope.orders[i].slaveType != '促销课程' && $scope.orders[i].slaveType != '赠课') {
                    try {
                        totalPrice += $scope.orders[i].recharge.totalPrice;
                    } catch (e) {
                        totalPrice += $scope.orders[i].totalPrice
                    }
                }
            }
            return totalPrice;
        }

        $scope.batchRealAmount = function () {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1) {
                    totalPrice += $scope.orders[i].privilegeAmountTemp;
                } else {
                    try {
                        totalPrice += $scope.orders[i].recharge.totalPrice - $scope.orders[i].recharge.privilegeAmount;
                    } catch (e) {
                        totalPrice += $scope.orders[i].totalPrice - $scope.orders[i].privilegeAmount
                    }
                }
            }
            /*for (var i = 0; i < $scope.orderChildList.length; i++) {
                totalPrice += $scope.orderChildList[i].realTotalAmount;
            }
            for (var i = 0; i < $scope.orderRechargeChildList.length; i++) {
                totalPrice += $scope.orderRechargeChildList[i].recharge.totalPrice - $scope.orderRechargeChildList[i].recharge.privilegeAmount
            }*/
            return totalPrice;
        }
        // 总折扣率的计算排除促销订单。
        $scope.batchRealAmountV2 = function () {
            var totalPrice = 0;
            for (var i = 0; i < $scope.orders.length; i++) {
                if ($scope.orders[i].orderCategory == 1 && $scope.orders[i].slaveType != '促销课程' && $scope.orders[i].slaveType != '赠课') {
                    totalPrice += $scope.orders[i].privilegeAmountTemp;
                } else if ($scope.orders[i].slaveType != '促销课程' && $scope.orders[i].slaveType != '赠课') {
                    try {
                        totalPrice += $scope.orders[i].recharge.totalPrice - $scope.orders[i].recharge.privilegeAmount;
                    } catch (e) {
                        totalPrice += $scope.orders[i].totalPrice - $scope.orders[i].privilegeAmount
                    }
                }
            }
            return totalPrice;
        }
        if (!$scope.order.orderCategory) {
            $scope.order.orderCategory = 1
        }
        $scope.tabOrderFlag = function (flag, arg) {
            clearSelectInput()
            $scope.order.orderCategory = flag
            if (arg) {
                $scope.___crmorderPayments = angular.copy($scope.order.crmorderPayments)
                $scope.order.orderCourses = [];
                $scope.order.privilegeAmount = '';
                $scope.order.privilegeRatio = 100;
                // $scope.order.crmorderPayments
            } else {
                resetOrderProtocol();
            }
            // if ($scope.order.orderStatus == 14) {
            //     $scope.order.crmorderPayments = angular.copy($scope.MtCrmorderPayments)
            // }
            // initOrder();
        }
        $scope.initCrmorderPayments = function () {
            $scope.order.crmorderPayments = angular.copy($scope.___crmorderPayments)
        }
        $scope.initOrderPayDate = function (arg) {
            if (!arg) {
                $scope.order.payDate = new Date()
            } else {
                $scope.moreOrder.payDate = new Date()
            }
        }
        $scope.endMoreOrder = 0

        function clearSelectInput() {
            try {
                $('#selectInput').val('')
            } catch (e) {
            }
        }

        // 更新是否满足服务费条件
        // function updateServerPaymentFlag() {
        //     var order = $scope.orders[0] || $scope.order
        //     if ((order.orderType == 5 || order.orderType == 1) && order.slaveType == '正课') {
        //         $scope.servicePaymentFlag = true
        //     } else {
        //         $scope.servicePaymentFlag = false
        //     }
        // }

        // 服务费实际费用
        function updateServerPayAmount() {
            var payAmount = 0
            if ($scope.servicePayment.classWayType === '4') {
                payAmount = 0
            } else {
                payAmount = Math.floor($scope.servicePayment.servicePayAmount / $scope.servicePayment.classWayType)
            }
            $scope.servicePayment.payAmount = isNaN(payAmount) ? '' : payAmount
        }

        $scope.updateServerPayAmount = updateServerPayAmount
        // 添加附加课
        $scope.tabFreeLessons = function (flag, arg) {
            // 服务费
            // updateServerPaymentFlag()
            isShowServerInput()
            if ($scope.endMoreOrder && !arg) {
                clearSelectInput()
                $scope.endMoreOrder = arg || 0
                resetOrderProtocol();
                return false
            }
            if ($scope.freeLessons) {
                if (!$scope.order.slaveType) {
                    SweetAlert.swal("请选择正/促销/赠课");
                    return false
                }
                else if ($scope.order.slaveType == '促销课程' && !$scope.order.specialOrderClassType) {
                    SweetAlert.swal("请选择授课类型");
                    return false
                }
                else if ($scope.order.slaveType == '赠课' && (!$scope.order.specialOrderType)) {
                    SweetAlert.swal("请选择赠课类型");
                    return false
                }
                else if ($scope.order.slaveType == '赠课' && (!$scope.order.specialOrderClassType)) {
                    SweetAlert.swal("请选择授课类型");
                    return false
                }
                else if ($scope.order.slaveType == '赠课' && (!$scope.order.specialOrderRequirements)) {
                    SweetAlert.swal("请选择赠课条件");
                    return false
                }
            }
            if ($scope.order.orderCategory == 1) {
                if (!$scope.order.totalPrice) {
                    SweetAlert.swal("请将课时订单填写完整");
                    return false
                } else if ((!$scope.order.privilegeRatio && !$scope.orders.length) && $scope.order.slaveType != '赠课') {
                    // } else if ((!$scope.order.privilegeRatio && !$scope.orders.length) && $scope.order.orderType != 8) {
                    SweetAlert.swal("折扣不能为空");
                    return false
                } else if ($scope.order.privilegeRatio < 0) {
                    SweetAlert.swal("应交金额不能小于0");
                    return false
                }
            } else if ($scope.order.orderCategory == 3) {
                if (!$scope.order.orderChargingId || !$scope.order.recharge.orderTeacherLevel || !$scope.order.recharge.totalPrice || !($scope.order.recharge.privilegeRatio >= 0)) {
                    SweetAlert.swal("请将充值订单填写完整");
                    return false
                } else if (!$scope.order.recharge.privilegeRatio && !$scope.orders.length && $scope.order.slaveType != '赠课') {
                    // } else if (!$scope.order.recharge.privilegeRatio && !$scope.orders.length && $scope.order.orderType != 8) {
                    SweetAlert.swal("折扣不能为空");
                    return false
                } else if ($scope.order.recharge.privilegeRatio < 0) {
                    SweetAlert.swal("应交金额不能小于0");
                    return false
                }
            }
            console.log($scope.order)
            var order = angular.copy($scope.order)
            // 课时
            if (order.orderCategory == 1) {
                order.realTotalAmount = ((order.totalPrice * 100) - (order.privilegeAmount * 100)) / 100;
                order.payDueAmount = ((order.totalPrice * 100) - (order.privilegeAmount * 100) - (order.realPayAmount * 100)) / 100;
                order.privilegeAmountTemp = order.realTotalAmount
                // var orderElement = angular.copy(order);
                if (order.orderCourses.length == 0) {
                    SweetAlert.swal('请输入课程');
                    return;
                }
                // if (order.privilegeRatio < 50) {
                //     SweetAlert.swal('折扣率不能低于50%');
                //     return;
                // }
                if (!order.orderType && len > 0) {
                    order.orderType = $scope.orders[0].orderType;
                }
                order.orderCategory = 1;
                for (var ii = 0; ii < $scope.gradeIds.length; ii++) {
                    if ($scope.gradeIds[ii].id == order.recharge.gradeId) {
                        order.currentGrade = $scope.gradeIds[ii].name;
                        break;
                    }
                }
                if (order.orderType == 1 || order.orderType == 2 || order.orderType == 5) {
                    order.masterSlaveRelation = 1;
                    if (order.orderStatus != 14 && order.payDueAmount.toFixed(2) < 0) {
                        SweetAlert.swal('订单尾款不能为负数');
                        return;
                    }
                } else if (order.orderType == 8) {
                    order.orderCategory = 1;
                    order.masterSlaveRelation = 1;
                    if (order.orderStatus != 14 && order.payDueAmount.toFixed(2) < 0) {
                        SweetAlert.swal('订单尾款不能为负数');
                        return;
                    }
                }
            } else if (order.orderCategory == 3) {


                if (order.constructor === Object && order.orderCourses && order.orderCourses.length > 0) {
                    order.realTotalAmount = ((order.totalPrice * 100) - (order.privilegeAmount * 100)) / 100;
                    order.payDueAmount = ((order.totalPrice * 100) - (order.privilegeAmount * 100) - (order.realPayAmount * 100)) / 100;
                    if (order.orderStatus != 14 && order.payDueAmount.toFixed(2) < 0) {
                        SweetAlert.swal('订单尾款不能为负数');
                        return;
                    }
                    order.orderCategory = 1;
                    $scope.orderChildList.push(angular.copy($scope.order));
                    order = {};
                }

                if (order.recharge.constructor === Object && order.recharge.orderChargingName && order.recharge.name != 0) {
                    order.recharge.realTotalAmount = order.recharge.totalPrice - order.recharge.privilegeAmount;
                    order.recharge.payDueAmount = order.recharge.totalPrice - order.recharge.privilegeAmount - order.recharge.realPayAmount;
                    if (order.orderStatus != 14 && order.recharge.payDueAmount.toFixed(2) < 0) {
                        SweetAlert.swal('订单尾款不能为负数');
                        return;
                    }
                    var orderCourse = {
                        'additionalAmount': order.recharge.totalPrice,
                        'avaliableAmount': order.recharge.totalPrice
                    };
                    // if (!order.recharge.orderCourses) {
                    //     order.recharge.orderCourses = []
                    // }
                    // 修改bug，订单重复
                    order.recharge.orderCourses = [orderCourse]
                    // 结算收费
                    order.recharge.crmorderPayments = order.crmorderPayments
                    // order.recharge.orderCourses.push(orderCourse);
                    // order.recharge.orderCourses.push(orderCourse);
                    order.recharge.orderCategory = 3;
                    order.orderCategory = 3;
                    order.recharge.privilegeAmountTemp = order.realTotalAmount
                    order.recharge.orderChargingId = order.orderChargingId
                    // order.recharge.specialOrderRequirements = order.specialOrderRequirements
                    // order.recharge.specialOrderClassType = order.specialOrderClassType
                    // order.recharge.specialOrderType = order.specialOrderType
                    // order.recharge.slaveType = order.slaveType
                }
                // 充值
                // order.recharge.orderCategory = 3;
                // order.orderCategory = 3;
                // if (order.orderType == 1 || order.orderType == 2 || order.orderType == 5) {
                //     order.recharge.orderType = order.orderType
                //     order.recharge.masterSlaveRelation = 1;
                // } else if (order.orderType == 8) {
                //     order.recharge.orderType = order.orderType
                //     order.orderCategory = 3;
                //     order.recharge.orderCategory = 3;
                //     order.masterSlaveRelation = 1;
                // }
            }

            // 如果已经有主合同了的话给自合同编号
            var len = $scope.orders.length
            if (order.nakedContract) {
                order.nakedContract = 1
            }
            if (len === 1 && ($scope.order.orderStatus == 14 || $scope.___orderStatus == 14) && !$scope.showCreatFlag) {
                $scope.showCreatFlag = 1
                // $scope.orders = []
                // $scope.orders.push(order)
                order.orderStatus = 14
                $scope.orders.splice(0, 1, order)
            } else {
                if (len && !$scope.orders[0].nakedContract && $scope.orders[0].orderNo) {
                    order.orderNo = $scope.orders[0].orderNo + '-' + len
                    if (order.orderCategory == 3) {
                        order.recharge.orderNo = order.orderNo
                    }
                }
                $scope.orders.push(order)
            }
            clearSelectInput()
            $scope.endMoreOrder = arg || 0
            resetOrderProtocol();
            $scope.order.orderStatus = $scope.orders[0].orderStatus
            $scope.order.accountBalance = $scope.orders[0].accountBalance || 0
            $scope.freeLessons = !!flag
            // 处理是否清空服务费用
            isClearServerPay()
        }

        // 处理是否清空服务费用
        function isClearServerPay() {
            var len = $scope.orders.length
            if (len) {
                var flag = 0
                for (var i = 0; i < len; i++) {
                    var order = $scope.orders[i]
                    if (!((order.orderType == 5 || order.orderType == 1) && order.slaveType == '正课')) {
                        i++
                    }
                }
                if (flag) {
                    $scope.servicePayment = {}
                }
            }
        }

        var xianshoufei = false

        // 是否展示服务费输入框
        function isShowServerInput(arg) {
            var _order = angular.copy($scope.order)
            var _orders = ''
            if (arg) {
                _orders = angular.copy($scope.orders)
            } else if ($scope.order.orderStatus == 14 && $scope.orders.length == 1 && $scope.orders[0].id == $scope.order.id && !xianshoufei) {
                // $scope.orders[0] = angular.copy($scope.order)
                xianshoufei = true
                _orders = angular.copy([$scope.order])
            } else {
                _orders = angular.copy($scope.orders).concat([_order])
            }
            var flag = 0
            var _slaveType = 0
            for (var i = 0, len = _orders.length; i < len; i++) {
                var order = _orders[i]
                // if ((order.orderType == 5 || order.orderType == 1) && order.slaveType == '正课') {
                if (order.orderType == 5 || order.orderType == 1) {
                    flag = -1
                }
                if (order.slaveType == '正课') {
                    _slaveType = -1
                } else if (i == len - 1) {
                    flag = (_slaveType + flag == -2) ? 1 : 0
                }
            }
            if (flag) {
                $scope.servicePaymentFlag = true
            } else {
                $scope.servicePaymentFlag = false
            }
        }

        $scope.isShowServerInput = isShowServerInput

        // 再第一个订单上面追加服务费用得属性
        function appendServerPay(orders) {
            var flag = 0
            for (var i = 0, len = orders.length; i < len; i++) {
                var _order = orders[i]
                if ((orders[0].orderType == 5 || orders[0].orderType == 1) && _order.slaveType == '正课') {
                    flag++
                }
            }
            var order = orders[0]
            if (flag) {
                if (order.orderCategory == 3 && order.recharge) {
                    order.recharge.servicePayment = order.recharge.servicePayment || {}
                    order.recharge.servicePayment = angular.copy($scope.servicePayment)
                    order.recharge.servicePayment.payDate = new Date(order.recharge.servicePayment.payDate)
                } else {
                    order.servicePayment = order.servicePayment || {}
                    order.servicePayment = angular.copy($scope.servicePayment)
                    order.servicePayment.payDate = new Date(order.servicePayment.payDate)
                }
            } else {
                if (order.orderCategory == 3 && order.recharge) {
                    try {
                        order.recharge.servicePayment = null
                    } catch (e) {
                        order.servicePayment = null
                    }
                } else {
                    order.servicePayment = null
                }
            }

        }

        // 服务费用给个默认时间
        $scope.initServerDate = function () {
            $scope.servicePayment.payDate = $scope.servicePayment.payDate || new Date()
        }

        // 获取综合服务费
        function getOrderServicePayment(order) {
            OrderService.getOrderServicePayment(order.orderNo || order.originalOrderNo).then(function (result) {
                var data = result.data[0]
                if (data) {
                    data.servicePayAmount = data.servicePayAmount && (data.servicePayAmount + '')
                    data.classWayType = data.classWayType && (data.classWayType + '')
                    $scope.servicePayment = data
                    // isShowServerInput(1)
                }
                isShowServerInput(1)
            });
        };
        // 取消附加课程
        $scope.cancelFreeLessons = function () {
            $scope.freeLessons = !!false
            if (!$scope.orders.length) {
                return false
            }
            $scope.orders[0].achievementRatios = angular.copy($scope.order.achievementRatios)
            $scope.orders[0].tryListenFlag = $scope.order.tryListenFlag
            $scope.orders[0].orderRelationTeachers = angular.copy($scope.order.orderRelationTeachers)
            $scope.orders[0].orderRule = $scope.order.orderRule
            $scope.orders[0].masterSlaveRelation = $scope.order.masterSlaveRelation || ''
            $scope.orders[0].orderType = $scope.order.orderType
            $scope.orders[0].parentPhone = $scope.order.parentPhone
            $scope.orders[0].parentID = $scope.order.parentID
            $scope.orders[0].gradeId = $scope.order.gradeId
            $scope.orders[0].parentName = $scope.order.parentName
            $scope.orders[0].name = $scope.order.name
            $scope.orders[0].nakedContract = $scope.order.nakedContract
            $scope.orders[0].orderNo = $scope.order.orderNo
            $scope.orders[0].crmStudentId = $scope.order.crmStudentId
            $scope.order = angular.copy($scope.orders[0])
            $scope.orders = []
            $scope.endMoreOrder = 0
            $scope.order.masterSlaveRelation += ''
            // $('#signingForm').val($scope.order.masterSlaveRelation)
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
        $scope.selectOneChargingConfirm = function selectOneChargingConfirm() {
            $scope.chargingModal.hide();
        }
        /**
         * 弹窗计费方案
         */
        $scope.selectChargingScheme1 = function selectChargingScheme1(arg) {
            if (arg == undefined && arg != 0 && !$scope.order.crmStudentId) {
                SweetAlert.swal("请先添加学员和学员年级");
                return false
            }
            $scope.updateIndex = arg
            $scope.modalChargingTitle = '选择方案';
            $scope.chargingModal = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/order/modal.ChargingSchemesList.html',
                show: true
            });
        }
        /**
         * 选择某一计费方案、查询出对应的师资等级列表、清空价格
         */
        $scope.selectOneCharging = function selectOneCharging(row) {
            if (isUpdate) {
                $scope.orders[$scope.updateIndex].orderChargingId = row.id;
                $scope.orders[$scope.updateIndex].orderTeacherLevel = '';
                $scope.orders[$scope.updateIndex].orderChargingScheme = angular.copy(row);
                $scope.orders[$scope.updateIndex].orderChargingName = row.schemeName;
                $scope.orderTeacherLevelList = getPricesList(row);
                $scope.orders[$scope.updateIndex]._orderTeacherLevelList = $scope.orderTeacherLevelList
                $scope.orders[$scope.updateIndex].orderChargingPrice = '';
            } else {
                $scope.order.recharge.orderChargingId = row.id;
                $scope.order.orderChargingId = row.id;
                $scope.order.orderTeacherLevel = '';
                $scope.order.recharge.orderChargingScheme = angular.copy(row);
                $scope.order.recharge.orderChargingName = row.schemeName;
                $scope.orderTeacherLevelList = getPricesList(row);
                $scope.order.recharge.orderChargingPrice = "";
            }
        }
        /**
         * 选择某一计费方案、查询出对应的师资等级列表、清空价格
         */
        $scope.selectOneChargingV2 = function selectOneChargingV2(row) {
            $scope.moreOrder.orderChargingId = row.id;
            $scope.moreOrder.orderChargingScheme = angular.copy(row);
            $scope.moreOrder.orderChargingName = row.schemeName;
            $scope.orderTeacherLevelList = getPricesList(row);
            $scope.moreOrder.orderChargingPrice = '';
        }
        // 标记是否已经点击过保存按钮
        var flagClick = 0

        function setCurrentGrade(order) {
            for (var ii = 0; ii < $scope.gradeIds.length; ii++) {
                if (order.orderCategory == 3 && $scope.gradeIds[ii].id == order.recharge.gradeId) {
                    order.recharge.currentGrade = $scope.gradeIds[ii].name;
                    break;
                }
                else if (order.orderCategory == 1 && $scope.gradeIds[ii].id == order.gradeId) {
                    order.currentGrade = $scope.gradeIds[ii].name;
                    break;
                }
            }
        }

        $scope.beforeSaveOrderV2 = function () {
            // 验证是否是推荐学员订单
            if ($scope.order.orderType == 5 && !$scope.recommendStudent.id) {
                SweetAlert.swal('请选择推荐人');
                return false
            }
            if (!validateAchievementRatio($scope.order)) {
                return false
            }
            if ($scope.order.tryListenFlag == 1 && (!$scope.order.orderRelationTeachers || !$scope.order.orderRelationTeachers.length)) {
                SweetAlert.swal('请添加试听老师');
                return false
            }
            if (!$scope.endMoreOrder) {
                $scope.tabFreeLessons(1, 1)
            } else if ($scope.order.orderType == 8) {
                $scope.tabFreeLessons(1, 1, 8)
            }
            var orders = []
            /*
             暂时注释
            if ($scope.batchRealAmountV2() / $scope.batchTotalPriceV2() * 100 < 50 && $scope.order.orderType != 8) {
                 SweetAlert.swal('总的折扣率不能低于50%');
                 return false
             }*/
            flagClick = $scope.orders.length
            // order.achievementRatios
            // order.tryListenFlag
            // order.orderRelationTeachers
            // 用最后一条数据给0~(len-1)的数据赋值[achievementRatios,tryListenFlag,orderRelationTeachers]
            function copyMore() {
                // var flag = $scope.orders[0].orderCategory
                for (var i = 0, len = $scope.orders.length; i < len; i++) {
                    $scope.orders[i].nakedContract = $scope.order.nakedContract ? 1 : 0
                    $scope.orders[i].achievementRatios = $scope.order.achievementRatios
                    $scope.orders[i].tryListenFlag = $scope.order.tryListenFlag
                    $scope.orders[i].orderRelationTeachers = $scope.order.orderRelationTeachers
                    $scope.orders[i].name = $scope.order.name
                    $scope.orders[i].parentName = $scope.order.parentName
                    $scope.orders[i].gradeId = $scope.order.gradeId
                    $scope.orders[i].parentID = $scope.order.parentID
                    $scope.orders[i].parentPhone = $scope.order.parentPhone
                    $scope.orders[i].orderType = $scope.order.orderType
                    $scope.orders[i].masterSlaveRelation = $scope.order.masterSlaveRelation
                    $scope.orders[i].orderRule = $scope.order.orderRule
                    $scope.orders[i].crmStudentId = $scope.order.crmStudentId
                    // 推荐
                    $scope.orders[i].recommendStudentId = $scope.recommendStudent.id
                    if ($scope.orders[i].payDate) {
                        $scope.orders[i].payDate = new Date($scope.orders[i].payDate)
                    }
                    if ($scope.orders[i].recharge && $scope.orders[i].recharge.payDate) {
                        $scope.orders[i].recharge.payDate = new Date($scope.orders[i].recharge.payDate)
                    }
                    if ($scope.orders[i].crmorderPayments && $scope.orders[i].crmorderPayments.length) {
                        angular.forEach($scope.orders[i].crmorderPayments, function (data) {
                            data.payDate = new Date(data.payDate)
                        })
                    }
                    if ($scope.order.nakedContract) {
                        $scope.orders[i].orderNo = ''
                    }
                    /*flag == 3 && */
                    if ($scope.orders[i].orderCategory == 3) {
                        $scope.orders[i].recharge.nakedContract = $scope.order.nakedContract ? 1 : 0
                        $scope.orders[i].recharge.achievementRatios = $scope.order.achievementRatios
                        $scope.orders[i].recharge.tryListenFlag = $scope.order.tryListenFlag
                        $scope.orders[i].recharge.orderRelationTeachers = $scope.order.orderRelationTeachers
                        $scope.orders[i].recharge.name = $scope.order.name
                        $scope.orders[i].recharge.parentName = $scope.order.parentName
                        $scope.orders[i].recharge.gradeId = $scope.order.gradeId
                        $scope.orders[i].recharge.parentID = $scope.order.parentID
                        $scope.orders[i].recharge.parentPhone = $scope.order.parentPhone
                        $scope.orders[i].recharge.orderType = $scope.order.orderType
                        $scope.orders[i].recharge.masterSlaveRelation = $scope.order.masterSlaveRelation
                        $scope.orders[i].recharge.orderRule = $scope.order.orderRule
                        $scope.orders[i].recharge.crmStudentId = $scope.order.crmStudentId
                        $scope.orders[i].recharge.recommendStudentId = $scope.recommendStudent.id
                        $scope.orders[i].recharge.slaveType = $scope.orders[i].slaveType
                        $scope.orders[i].recharge.specialOrderClassType = $scope.orders[i].specialOrderClassType
                        $scope.orders[i].recharge.specialOrderType = $scope.orders[i].specialOrderType
                        $scope.orders[i].recharge.specialOrderRequirements = $scope.orders[i].specialOrderRequirements
                        $scope.orders[i].recharge.orderType = $scope.orders[i].orderType
                        if (i == 0) {
                            $scope.orders[i].recharge.id = $scope.order.id || ''
                            // if (flag == 3 && $scope.orders[i].orderCategory == 3) {
                            //     $scope.orders[i].recharge.slaveType = $scope.orders[i].slaveType
                            //     $scope.orders[i].recharge.specialOrderClassType = $scope.orders[i].specialOrderClassType
                            //     $scope.orders[i].recharge.specialOrderType = $scope.orders[i].specialOrderType
                            //     $scope.orders[i].recharge.specialOrderRequirements = $scope.orders[i].specialOrderRequirements
                            //     $scope.orders[i].recharge.orderType = $scope.orders[i].orderType
                            // }
                        }

                        // $scope.orders[i].recharge.orderChargingId = $scope.order.orderChargingId
                    }
                    setCurrentGrade($scope.orders[i])
                }
            }

            copyMore()
            // 附加课程去掉一下字段

            /**
             *
             * tryListenFlag：是否试听签单：0否；1是
             achievementRatios：订单业绩计算比例信息
             orderRelationTeachers：订单的试听教师、授课教师
             contractStartDate：签约时间
             orderType：订单类型
             *
             *
             */
            var _orders = angular.copy($scope.orders)
            for (var o = 1, olen = _orders.length; o < olen; o++) {
                delete _orders[o].tryListenFlag
                delete _orders[o].achievementRatios
                delete _orders[o].orderRelationTeachers
                delete _orders[o].contractStartDate
                // delete _orders[o].orderType
                delete _orders[o].achievementRatio

                // 将附加课信息帮到里面
                // if (_orders[o].orderCategory == 3) {
                //     _orders[o].recharge.slaveType = _orders[o].slaveType
                //     _orders[o].recharge.specialOrderClassType = _orders[o].specialOrderClassType
                //     _orders[o].recharge.specialOrderType = _orders[o].specialOrderType
                //     _orders[o].recharge.specialOrderRequirements = _orders[o].specialOrderRequirements
                //     _orders[o].recharge.orderType = _orders[o].orderType
                // }
            }
            // 如果第一个主订单是储值，则处理
            if (_orders[0].orderCategory == 3) {
                _orders[0].recharge.nakedContract = _orders[0].nakedContract
                _orders[0].recharge.orderType = _orders[0].orderType
                _orders[0].recharge.tryListenFlag = _orders[0].tryListenFlag
                _orders[0].recharge.orderNo = _orders[0].orderNo
                _orders[0].recharge.recharge = _orders[0].orderNo
                _orders[0].recharge.parentName = _orders[0].parentName
                _orders[0].recharge.parentID = _orders[0].parentID
                _orders[0].recharge.parentPhone = _orders[0].parentPhone
                _orders[0].recharge.signingForm = _orders[0].signingForm
                _orders[0].recharge.orderRule = _orders[0].orderRule
                _orders[0].recharge.orderRelationTeachers = _orders[0].orderRelationTeachers
                _orders[0].recharge.achievementRatios = _orders[0].achievementRatios
            }
            $scope.orders = angular.copy(_orders)
            if ($scope.orders.length) {
                // 追加服务费用对象
                appendServerPay($scope.orders)
                for (var xi = 0, xilen = $scope.orders.length; xi < xilen; xi++) {
                    reseatPue(xi)
                }
                $scope.___oreders___ = angular.copy($scope.orders)
                console.clear()
                console.log($scope.orders)
                $scope.skipAppend = true
                $scope.saveOrder($scope.orders);
            }
        };

        /**
         * 更新学生年级
         */
        function updateCustomerStudent(newGradeId) {
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
        $scope.changeChargingV2 = function changeChargingV2(type, index) {
            if (!$scope.orders.length || $scope.orders[index].orderCategory != 3) {
                return false
            }
            // 顺带更改学生的年级
            if ($scope.orderOperating == 2) {
                $scope.orders[index].orderChargingPrice = getPrice($scope.orders[index].orderChargingScheme, $scope.orders[index].orderTeacherLevel, $scope.orders[index].gradeId);
            }
            if (type == 1) {
                var customerStudentVo = {}
                customerStudentVo.crm_student_id = $scope.orders[index].crmStudentId;
                var promise = CustomerStudentService.detail(customerStudentVo);
                promise.then(function (result) {
                    $scope.customerStudentDetail = result;
                    if ($scope.orders[index].orderChargingId == undefined || $scope.orders[index].orderChargingId == "") {
                        SweetAlert.swal("请选择计费方案");
                        $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    if ($scope.orders[index].recharge.orderTeacherLevel == undefined || $scope.orders[index].recharge.orderTeacherLevel == "") {
                        SweetAlert.swal("请选择师资等级");
                        $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
                        return;
                    }
                    var title = "该操作将要修改该学生的年级,是否确定?";
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                    var flag_grade = unlawfulnessGrade.contains($scope.orders[index].gradeId); //返回true
                    if (!flag_grade) {
                        $mtModal.moreModal({
                            scope: $scope,
                            status: 0,
                            text: title,
                            hasNext: function () {

                                CoursePlanService.getWxClassTimeList($scope.orders[index].crmStudentId, $scope.customerStudentDetail.grade_id, $scope.orders[index].gradeId).then(function (result) {
                                    if (result.wxExist) {
                                        if (result.jk) {
                                            var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                            $mtModal.moreModal({
                                                scope: $scope,
                                                status: 0,
                                                text: t,
                                                hasNext: function () {
                                                    CoursePlanService.saveGradeChange(result, $scope.orders[index].crmStudentId, $scope.orders[index].gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.orders[index].gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.orders[index].orderChargingPrice = getPrice($scope.orders[index].orderChargingScheme, $scope.orders[index].orderTeacherLevel, $scope.orders[index].gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
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
                                                    CoursePlanService.saveGradeChange(result, $scope.order.recharge.crmStudentId, $scope.orders[index].gradeId);
                                                    $scope.customerStudentDetail.grade_id = $scope.order.recharge.gradeId;
                                                    updateCustomerStudent();//更新学员年级
                                                    $scope.orders[index].orderChargingPrice = getPrice($scope.orders[index].orderChargingScheme, $scope.orders[index].orderTeacherLevel, $scope.orders[index].gradeId);
                                                    if ($scope.getMyCrmCustomerStudentList) {
                                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                    }
                                                    $scope.mtResultModal.hide();
                                                },
                                                cancel: function () {
                                                    $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
                                                    $scope.mtResultModal.hide();
                                                }
                                            });
                                        }
                                    } else {
                                        CoursePlanService.saveGradeChange(result, $scope.orders[index].crmStudentId, $scope.orders[index].gradeId);
                                        $scope.customerStudentDetail.grade_id = $scope.orders[index].gradeId;
                                        updateCustomerStudent();//更新学员年级
                                        $scope.orders[index].orderChargingPrice = getPrice($scope.orders[index].orderChargingScheme, $scope.orders[index].orderTeacherLevel, $scope.orders[index].gradeId);
                                        if ($scope.getMyCrmCustomerStudentList) {
                                            $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                        }
                                        $scope.mtResultModal.hide();
                                    }
                                });
                            },
                            cancel: function () {
                                $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
                                $scope.mtResultModal.hide();
                            }
                        });
                    } else {
                        var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                        $scope.orders[index].gradeId = $scope.customerStudentDetail.grade_id;
                        SweetAlert.swal(untitle);
                        return;
                    }
                }, function (error) {
                    SweetAlert.swal("获取学生信息失败");
                });
            } else {
                var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                var flag_grade = unlawfulnessGrade.contains($scope.orders[index].gradeId); //返回true
                if (flag_grade) {
                    var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                    SweetAlert.swal(untitle);
                    return;
                }
                $scope.orders[index].orderChargingPrice = getPrice($scope.orders[index].orderChargingScheme, $scope.orders[index].orderTeacherLevel, $scope.orders[index].gradeId);
            }
        }

        function updateThisChargingPrice(newGradeId) {
            if ($scope.orders && $scope.orders.length) {
                $scope.orders.map(function (item) {
                    if (item.orderCategory == 3) {
                        var orderChargingScheme = item.orderChargingScheme || item.recharge.orderChargingScheme
                        var orderTeacherLevel = item.orderTeacherLevel || item.recharge.orderTeacherLevel
                        var orderChargingPrice = getPrice(orderChargingScheme, orderTeacherLevel, newGradeId);
                        item.orderChargingPrice = orderChargingPrice
                        try {
                            item.recharge.orderChargingPrice = orderChargingPrice
                        } catch (e) {
                        }
                    }
                })
            }
            try {
                var orderChargingScheme = $scope.order.orderChargingScheme || $scope.order.recharge.orderChargingScheme
                var orderTeacherLevel = $scope.order.orderTeacherLevel || $scope.order.recharge.orderTeacherLevel
                var orderChargingPrice = getPrice(orderChargingScheme, orderTeacherLevel, newGradeId);
                $scope.order.orderChargingPrice = orderChargingPrice
                $scope.order.recharge.orderChargingPrice = orderChargingPrice
            } catch (e) {
            }
            // order.orderChargingPrice = getPrice(orderChargingScheme , orderTeacherLevel, order.gradeId);
        }

        /**
         * 更改计费方案 type1更改年级 2更改师资等级
         */
        $scope.changeChargingV3 = function (type, index) {
            var order = {}
            var newGradeId = ''
            if (index == -1) {
                newGradeId = $scope.order.gradeId
            } else {
                newGradeId = $scope.orders[index].gradeId
            }
            if (index == -1 && $scope.order.orderCategory == 3) {
                order = $scope.order
            } else if ($scope.orders && $scope.orders.length) {
                for (var i = 0, len = $scope.orders.length; i < len; i++) {
                    if ($scope.orders[i].orderCategory == 3) {
                        order = $scope.orders[i]
                        order.crmStudentId = order.crmStudentId || $scope.orders[0].crmStudentId;
                        break
                    }
                }
            } else {
                var customerStudentVo = {}
                customerStudentVo.crm_student_id = $scope.order.crmStudentId
                var promise = CustomerStudentService.detail(customerStudentVo);
                promise.then(function (result) {
                    $scope.order.gradeId = result.grade_id
                })
                SweetAlert.swal("请选择计费方案和师资等级");
                return false
            }
            var orderChargingScheme = order.orderChargingScheme || order.recharge.orderChargingScheme
            var orderTeacherLevel = order.orderTeacherLevel || order.recharge.orderTeacherLevel
            // 顺带更改学生的年级
            /*if ($scope.orderOperating == 2) {
                order.orderChargingPrice = getPrice(orderChargingScheme, orderTeacherLevel, order.gradeId);
            }*/
            var customerStudentVo = {}
            customerStudentVo.crm_student_id = order.crmStudentId
            var promise = CustomerStudentService.detail(customerStudentVo);
            promise.then(function (result) {
                $scope.customerStudentDetail = result;
                if (order.orderChargingId == undefined || order.orderChargingId == "") {
                    SweetAlert.swal("请选择计费方案");
                    order.gradeId = $scope.customerStudentDetail.grade_id;
                    return;
                }
                if (orderTeacherLevel == undefined || orderTeacherLevel == "") {
                    SweetAlert.swal("请选择师资等级");
                    order.gradeId = $scope.customerStudentDetail.grade_id;
                    return;
                }
                var title = "该操作将要修改该学生的年级,是否确定?";
                var unlawfulnessGrade = [14, 15, 16, 18, 19, 20]; // 非法年级
                var flag_grade = unlawfulnessGrade.contains(newGradeId); //返回true
                if (!flag_grade) {
                    $mtModal.moreModal({
                        scope: $scope,
                        status: 0,
                        text: title,
                        hasNext: function () {

                            CoursePlanService.getWxClassTimeList(order.crmStudentId, $scope.customerStudentDetail.grade_id, newGradeId).then(function (result) {
                                if (result.wxExist) {
                                    if (result.jk) {
                                        var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                        $mtModal.moreModal({
                                            scope: $scope,
                                            status: 0,
                                            text: t,
                                            hasNext: function () {
                                                CoursePlanService.saveGradeChange(result, order.crmStudentId, newGradeId);
                                                $scope.customerStudentDetail.grade_id = newGradeId;
                                                updateCustomerStudent(newGradeId);//更新学员年级
                                                // 修改改合同下所有的储值订单价格
                                                updateThisChargingPrice(newGradeId)
                                                if ($scope.getMyCrmCustomerStudentList) {
                                                    $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                }
                                                $scope.mtResultModal.hide();
                                            },
                                            cancel: function () {
                                                order.gradeId = $scope.customerStudentDetail.grade_id;
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
                                                CoursePlanService.saveGradeChange(result, order.crmStudentId, newGradeId);
                                                $scope.customerStudentDetail.grade_id = newGradeId;
                                                updateCustomerStudent(newGradeId);//更新学员年级
                                                // 修改改合同下所有的储值订单价格
                                                updateThisChargingPrice(newGradeId)
                                                if ($scope.getMyCrmCustomerStudentList) {
                                                    $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                                }
                                                $scope.mtResultModal.hide();
                                            },
                                            cancel: function () {
                                                order.gradeId = $scope.customerStudentDetail.grade_id;
                                                $scope.mtResultModal.hide();
                                            }
                                        });
                                    }
                                } else {
                                    CoursePlanService.saveGradeChange(result, order.crmStudentId, newGradeId);
                                    $scope.customerStudentDetail.grade_id = newGradeId;
                                    updateCustomerStudent(newGradeId);//更新学员年级
                                    // 修改改合同下所有的储值订单价格
                                    updateThisChargingPrice(newGradeId)
                                    if ($scope.getMyCrmCustomerStudentList) {
                                        $scope.getMyCrmCustomerStudentList($rootScope.tableState);
                                    }
                                    $scope.mtResultModal.hide();
                                }
                            });
                        },
                        cancel: function () {
                            order.gradeId = $scope.customerStudentDetail.grade_id;
                            $scope.mtResultModal.hide();
                        }
                    });
                } else {
                    var untitle = "该学员年级为非法年级，请为学员重新选择年级";
                    order.gradeId = $scope.customerStudentDetail.grade_id;
                    SweetAlert.swal(untitle);
                    return;
                }
            }, function (error) {
                SweetAlert.swal("获取学生信息失败");
            });
        }
        var isUpdate = false;

        /**
         * 初始化附加课程
         */

        // 弹框数据
        $scope.moreOrder = {}

        // 课时订单特有
        window.more_1 = {
            orderCategory: 1,
            orderCourses: [],
            hours: '',
            minite: ''
        }
        // 储值订单特有
        window.more_3 = {
            orderCategory: 3,
            orderChargingId: '',
            orderTeacherLevel: '',
            orderChargingPrice: '',
            accountBalance: '',
            accountBalanceNew: ''
        }
        var mc = {
            slaveType: '',
            specialOrderClassType: '',
            specialOrderType: '',
            specialOrderRequirements: '',
            totalPrice: '',
            privilegeAmount: '',
            realTotalAmount: '',
            privilegeRatio: '',
            crmorderPayments: []
        }
        $scope.moreInit = function (arg) {
            if ($scope.modalFreeLessons) {
                $scope.modalFreeLessons.hide()
            }
            var _mc = angular.copy(mc)
            _mc.gradeId = $scope.order.gradeId
            $scope.moreOrder = angular.copy(Object.assign(angular.copy(_mc), angular.copy(window['more_' + arg])))
            $scope.modalFreeLessons = $modal({
                scope: $scope,
                templateUrl: 'partials/v2.order/add.more.html',
                show: true
            });
            $scope.moreOrder.accountBalance = $scope.moreOrder.accountBalance || 0
        };

        $scope.addToOrders = function () {
            $scope.moreOrder.realTotalAmount = $scope.moreOrder.totalPrice - $scope.moreOrder.privilegeAmount
            $scope.moreOrder._orderTeacherLevelList = angular.copy($scope.orderTeacherLevelList)
            $scope.orders.push(angular.copy($scope.moreOrder))
            $scope.modalFreeLessons.hide()
            isShowServerInput()
        };
        /**
         * 订单的缴费记录信息列表
         */
        $scope.getOrderPaymentsV2 = function getOrderPaymentsV2(order, arg) {
            OrderService.getOrderPayments($scope.start, $scope.number, order.orderNo || order.originalOrderNo).then(function (result) {
                order.orderPayments = result.data;
                order.crmorderPayments = result.data;
                angular.forEach(order.crmorderPayments, function (data, index, array) {
                    data.paymentEdit = true;
                });
                if (order.orderStatus == 14 && arg) {
                    $scope.MtCrmorderPayments = angular.copy(result.data)
                }
            });
        };
        // 是否允许审核
        $scope.isShenHe = function (orders) {
            var flag = 0
            for (var i = 0, len = orders.length; i < len; i++) {
                if (!orders[i].nakedContract && orders[i].orderNo == orders[i].originalOrderNo) {
                    flag += 1
                }
                if (!orders[i].payDueAmount != 0) {
                    flag += 1
                }
            }
            return flag
        }

        function defaultAchievementRatio() {
            // 默认加一条业绩提醒的记录，默认的业绩人为当前登录用户
            var authenticationUser = AuthenticationService.currentUser();
            if (!$scope.order.achievementRatio) {
                $scope.order.achievementRatio = {}
            }
            if (!$scope.order.achievementRatios) {
                $scope.order.achievementRatios = []
            }
            // 部门信息
            $scope.order.achievementRatio.departmentId = authenticationUser.school_id;
            $scope.order.achievementRatio.departName = authenticationUser.department.name;
            // 业绩人信息
            $scope.order.achievementRatio.userId = authenticationUser.id;
            $scope.order.achievementRatio.userName = authenticationUser.name;
            // 业绩人岗位信息
            $scope.order.achievementRatio.positionId = authenticationUser.position_id;
            $scope.order.achievementRatio.position = {};
            $scope.order.achievementRatio.position.id = authenticationUser.position_id;
            $scope.order.achievementRatio.position.name = authenticationUser.position_name;
            // 业绩比例默认100%
            $scope.order.achievementRatio.achievementRatio = 1;
            $scope.order.achievementRatios.push($scope.order.achievementRatio);
        }

        $scope.___orderStatus = 0
        !(function () {
            // 查看
            if ($scope.order.id) {
                $scope.order.orderType = '' + ($scope.order.orderType || '')
                $scope.order.masterSlaveRelation = '' + ($scope.order.masterSlaveRelation || '')
                $scope.order.orderRule = '' + ($scope.order.orderRule || '')
                $scope.getRecommendStudentByOrderId($scope.order.id)
                $scope.order.tryListenFlag = ($scope.order.tryListenFlag >= 0 && $scope.order.tryListenFlag !== null) ? ($scope.order.tryListenFlag + '') : ''
                if ($scope.modalTitle == '转入') {
                    defaultAchievementRatio()
                    console.log($scope.order)
                    $scope.order.parentPhone = Number($scope.order.parentPhone)
                    return false
                }
                isUpdate = !($scope.order.orderStatus == 14) ? true : false
                $scope.___orderStatus = $scope.order.orderStatus
                $scope.$parent.getSuborders($scope.order.id, true).then(function (result) {
                    $scope.orders = [$scope.order]
                    // $scope.orders = [angular.copy($scope.order)]
                    $scope.getOrderPaymentsV2($scope.orders[0], 1)
                    setTimeout(function () {
                        var __order = angular.copy($scope.order)
                        $scope.orders.splice(0, 1, __order)
                        $scope.saveAchievementRatioV2($scope.order.achievementRatios, $scope.order.orderRelationTeachers)
                    }, 1000)
                    // $scope.order.tryListenFlag += ''
                    if (result.data.length) {
                        $scope.orders = $scope.orders.concat(result.data)
                    }
                    // $scope.orders.push($scope.order)
                    var orders = $scope.orders
                    console.log(orders)
                    // 临时处理
                    for (var i = 1, len = orders.length; i < len; i++) {
                        // orders[i].orderChargingId = $scope.order.orderChargingId
                        orders[i].gradeId = $scope.order.gradeId
                        // orders[i].orderChargingName = $scope.order.orderChargingName
                        // orders[i].orderChargingId = $scope.order.orderChargingId
                        // orders[i].orderTeacherLevel = $scope.order.orderTeacherLevel
                        // $scope.$parent.getOrderChargingSchemeV2(orders[i])
                        //计算下折扣率
                        orders[i].privilegeRatio = 100 - Number((orders[i].privilegeAmount * 100 / orders[i].totalPrice).toFixed(1));
                        orders[i].privilegeRatio = Number(orders[i].privilegeRatio.toFixed(1));
                        // orders[i].privilegeRatio = ((orders[i].totalPrice - orders[i].privilegeAmount) / orders[i].totalPrice * 100).toFixed(1)
                        if (orders[i].orderCategory == 3) {
                            orders[i].orderTeacherLevel = Number(orders[i].orderTeacherLevel)
                            $scope.$parent.getOrderChargingSchemeV2(orders[i])
                        } else {
                            orders[i].orderRule = $scope.order.orderRule
                            orders[i].crmStudentId = $scope.order.crmStudentId
                            $scope.$parent.getOrderCourses(orders[i])
                            if (orders[i].orderRule == 1) {
                                orders[i].hours = orders[i].totalOriginalNum;
                                orders[i].minite = 0;
                            } else {
                                orders[i].hours = parseInt(orders[i].totalOriginalNum * 40 / 60);
                                orders[i].minite = parseInt((orders[i].totalOriginalNum * 40) % 60);
                            }
                        }
                        (function (order) {
                            $scope.getOrderPaymentsV2(order)
                            // $scope.orders.push(order)
                            // console.log(order.privilegeRatio)
                        })(orders[i])

                        // _conductPayments(i)
                    }
                    getOrderServicePayment(orders[0])
                    // 线上
                    // $scope.orders = $scope.orders.concat(orders)
                })
            } else {
                $scope.order.orderCourses = [];
                // 定义业绩的对象
                $scope.order.achievementRatios = [];
                // 定义订单相关的老师列表
                $scope.order.orderRelationTeachers = [];

                $scope.order.achievementRatio = {};
                // 定义payments对象数组
                $scope.order.crmorderPayments = [];
                $scope.order.ratioInvalid = false;
                $scope.order.repeatClick = false;
                $scope.order.totalOriginalNum = 0;
                $scope.order.totalOriginalTimes = 0;
                $scope.order.totalPrice = 0;
                $scope.order.recharge = {};
                $scope.orderNoExist = false;
                defaultAchievementRatio()
                $scope.order.tryListenFlag = $scope.order.tryListenFlag == 'null' ? '' : $scope.order.tryListenFlag
            }
        })()
    }
])
