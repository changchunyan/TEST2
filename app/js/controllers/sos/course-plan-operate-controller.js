'use strict';

/**
 * 排课改版
 * @author fanlin@youwinedu.com
 * @date  2016-06-12
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('CoursePlanOperateController', ['$scope', '$location', '$timeout', '$routeParams', 'CustomerStudentService', 'CustomerStudentGroupService',
        'CommonService', '$modal', '$mtModal', '$filter', 'LeadsStudentService', '$rootScope', 'SweetAlert', 'CoursePlanService', 'localStorageService', 'CustomerStudentCourseService', 'CreatePlanService', 'TeacherService', 'CrmChargingSchemeService', 'AuthenticationService', 'ClassManagementService',
        function ($scope, $location, $timeout, $routeParams, CustomerStudentService, CustomerStudentGroupService, CommonService, $modal, $mtModal, $filter, LeadsStudentService,
                  $rootScope, SweetAlert, CoursePlanService, localStorageService, CustomerStudentCourseService, CreatePlanService, TeacherService, CrmChargingSchemeService, AuthenticationService, ClassManagementService) {

            function warningAlert(title) {
                SweetAlert.swal({
                    title: title,
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                })
            }

            function successAlert(title) {
                SweetAlert.swal({
                    title: title,
                    type: "success",
                    showCancelButton: false,
                    cancelButtonText: '确定',
                    closeOnConfirm: true
                })
            }

            // 20180630 将储值课程改为可选的
            $scope.updateChargeIndex = function (index) {
                // if ($scope.detail.type == 2) {
                //     return false
                // }
                getNowSelectOrder(index)
                // $scope.showPaikeView(1)
            }

            $scope.showOrderCourseList = showOrderCourseList; // 显示选择课程订单对话框
            $scope.getOrderCourseList = getOrderCourseList;
            $scope.showTeacherList = showTeacherList; // 显示教师查询对话框
            $scope.getTeachersList = getTeachersList;
            $scope.showAddCoursePlanTime = showAddCoursePlanTime; //显示添加排课时间的对话框
            $scope.selectOrderCourse = selectOrderCourse;
            $scope.getEndTimeNew = getEndTimeNew;// 获取下课时间
            $scope.getCourseEndTime = getCourseEndTime; // 添加排课时间
            $scope.judgePlanTime = judgePlanTime;// 判断输入的时间是否合法
            $scope.getTeachersListByFilter = getTeachersListByFilter; //按时间段查询教师列表
            $scope.resetFilterTime = resetFilterTime; //按时间段查询教师列表条件致空
            $scope.getMyCrmCustomerStudentClassList = getMyCrmCustomerStudentClassList;
            $scope.showStudentsTimes = showStudentsTimes;
            $scope.showTeacherTimes = showTeacherTimes;
            $scope.selectDateTime = selectDateTime;
            $scope.showPaikeView = showPaikeView;
            $scope.changeCustomerGrade = changeCustomerGrade;
            $scope.changeCoefficient = changeCoefficient
            $scope.changeCofficientOne = changeCofficientOne;
            $scope.getWxClassTimeList = getWxClassTimeList;
            $scope.getClasslist = getClasslist;
            $scope.remindChoseStudent = remindChoseStudent;
            $scope.studentClass = {};
            // 排课信息用到的参数
            $scope.coursePlanFilter = {};
            $scope.config = {
                id: ''
                , type: ''
                , ONE_DAY_TIMESTAMP: 1000 * 60 * 60 * 24//一天那时间戳
                , default_plan_time: 0
                , TIME_OFFSET: (new Date().getTimezoneOffset()) * 60 * 1000 //本时间与格林威治标准时间 (GMT) 的毫秒差
            };


            $scope.chargingSchemeTable = [];//计费方案
            $scope.CustomerStoredOrderList = [];//储值订单列表


            function changeCofficientOne(reset) {
                if (reset) {
                    $scope.coursePlanFilter.coefficient = $scope.coefficient;
                }
                if ($scope.now == 3) {
                    $scope.coursePlanFilter.plan_available_num = $scope.coursePlanFilter.plan_available_num_bak / $scope.coursePlanFilter.coefficient;
                    $scope.coursePlanFilter.plan_available_num = Math.round($scope.coursePlanFilter.plan_available_num * 10) / 10;
                    $scope.plan_available_num = $scope.coursePlanFilter.plan_available_num;
                } else {
                    var num = Math.floor($scope.order_avaliable_amount / ($scope.order_charge * $scope.coursePlanFilter.coefficient));
                    var cnum = $scope.order_avaliable_amount - num * ($scope.order_charge * $scope.coursePlanFilter.coefficient);
                    if ($scope.order_rule == 1) {
                        if (cnum > 0)
                            num = cnum / ($scope.order_charge * $scope.coursePlanFilter.coefficient) > 0.5 ? num + 1 : num + 0.5;
                    } else {
                        num = cnum > 0 ? num + 1 : num;
                    }
                    $scope.plan_available_num = num;
                }

            }

            /**
             * 一对多储值排课处理
             * 储值排课部分处理排课时用户id，并且有充值订单都选中
             * 课时排课清除选中用户
             * @private
             */
            function _clearSelect() {
                coursePlanParams.ordcourseID = ''
                $scope.plan_available_num = ''
                $scope.coursePlanFilter.plan_available_num = undefined
                for (var i = 0, len = $scope.CGoupStudentCourseList.length; i < len; i++) {
                    if ($scope.CGoupStudentCourseList[i].selected) {
                        delete $scope.CGoupStudentCourseList[i].selected;
                        delete $scope.CGoupStudentCourseList[i].course_name;
                        delete $scope.CGoupStudentCourseList[i].course_num;
                        delete $scope.CGoupStudentCourseList[i].plan_available_num;
                        delete $scope.CGoupStudentCourseList[i].type;
                        delete $scope.CGoupStudentCourseList[i].groupType;
                        delete $scope.CGoupStudentCourseList[i].coefficient;
                        delete $scope.CGoupStudentCourseList[i].order_no;
                        delete $scope.CGoupStudentCourseList[i].additional_amount;//dingdanyue
                        delete $scope.CGoupStudentCourseList[i].avaliable_amount;
                        delete $scope.CGoupStudentCourseList[i].order_teacher_level;
                        delete $scope.CGoupStudentCourseList[i].order_teacher_level_name;
                        delete $scope.CGoupStudentCourseList[i].order_charge;
                        delete $scope.CGoupStudentCourseList[i].type;
                        delete $scope.CGoupStudentCourseList[i].groupType;
                        delete $scope.CGoupStudentCourseList[i].ordcourse_id;
                        delete $scope.CGoupStudentCourseList[i].coefficient;
                        delete $scope.CGoupStudentCourseList[i].plan_available_num;
                        delete $scope.CGoupStudentCourseList[i].order_rule;
                    }
                    if ($scope.now == 1) {
                        //用于一对多储值排课的version信息的存储
                        coursePlanParams.version = [];
                        _getWxClassTimeList($scope.CGoupStudentCourseList[i])
                    }
                    if ($scope.now == 3) {
                        //用于一对多课时排课version信息的存储
                        coursePlanParams.version = [];
                    }
                }
            }

            /**
             * 一对多储值排课处理构建用户对应的价格和ordcourse_id和学生id
             * @param stu
             * 用户信息
             * @private
             */
            function _setPriceAndOrdCId(stu) {
                try {
                    _getClassTime()
                } catch (e) {
                }
                if (typeof coursePlanParams.ordcourseID != 'object') {
                    coursePlanParams.ordcourseID = [];
                }
                var hasOrder = $scope.CustomerStoredOrderList && $scope.CustomerStoredOrderList.length || 0
                if (hasOrder) {
                    for (var i = 0, len = $scope.CGoupStudentCourseList.length; i < len; i++) {
                        if ($scope.CGoupStudentCourseList[i].crm_student_id == stu.crm_student_id) {
                            var chargeIndex = selectStuCourseModel[i].orderIndex
                            coursePlanParams.ordcourseID.push({
                                crmstudentID: $scope.CGoupStudentCourseList[i].crm_student_id,
                                ordcourse_id: $scope.CustomerStoredOrderList[chargeIndex].ordcourse_id,
                                price: $scope.CustomerStoredOrderList[chargeIndex].order_charge,
                                ChargingId: $scope.CustomerStoredOrderList[chargeIndex].order_charging_id,
                                TeacherLevelId: $scope.CustomerStoredOrderList[chargeIndex].order_teacher_level,
                                avaliable_amount: $scope.CustomerStoredOrderList[chargeIndex].avaliable_amount
                            })
                            $scope.CGoupStudentCourseList[i].order_no = $scope.CustomerStoredOrderList[chargeIndex].order_no;
                            $scope.CGoupStudentCourseList[i].additional_amount = $scope.CustomerStoredOrderList[chargeIndex].additional_amount;//dingdanyue
                            $scope.CGoupStudentCourseList[i].avaliable_amount = $scope.CustomerStoredOrderList[chargeIndex].avaliable_amount;
                            $scope.CGoupStudentCourseList[i].order_teacher_level = $scope.CustomerStoredOrderList[chargeIndex].order_teacher_level;
                            $scope.CGoupStudentCourseList[i].order_teacher_level_name = $scope.CustomerStoredOrderList[chargeIndex].order_teacher_level_name;
                            $scope.CGoupStudentCourseList[i].order_charge = $scope.CustomerStoredOrderList[chargeIndex].order_charge;
                            $scope.CGoupStudentCourseList[i].type = 1;
                            $scope.CGoupStudentCourseList[i].groupType = $scope.detail.group_type;
                            $scope.CGoupStudentCourseList[i].ordcourse_id = $scope.CustomerStoredOrderList[chargeIndex].ordcourse_id;
                            //$scope.CGoupStudentCourseList[i].version = $scope.CustomerStoredOrderList[$scope.chargeIndex].version;
                            //coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            $scope.CGoupStudentCourseList[i].coefficient = getCoefficient($scope.CGoupStudentCourseList[i].type, $scope.detail.group_type);
                            $scope.CGoupStudentCourseList[i].plan_available_num = $scope.CustomerStoredOrderList[chargeIndex].plan_available_num;
                            $scope.CGoupStudentCourseList[i].order_rule = $scope.CustomerStoredOrderList[chargeIndex].order_rule;
                            $scope.CGoupStudentCourseList[i].selected = 1

                            // $scope.CustomerStoredOrderList[i].plan_available_num
                            // _remaining($scope.CustomerStoredOrderList[$scope.chargeIndex].plan_available_num,1)
                            //为了避免在修改折算系数时，又将拿到的version信息置空，我们将该数组的定义需要使用它的地方进行。
                            $scope.changeCoefficient(true);
                            console.log('====================')
                            console.log($scope.CustomerStoredOrderList[chargeIndex].plan_available_num)
                        }
                    }
                } else {
                    _remaining(0, 1)
                }
                // console.log(coursePlanParams.ordcourseID)
            }

            function changeCoefficient(reset, index) {
                var num = undefined;
                coursePlanParams.coefficients = [];
                if ($scope.now == 3) {
                    coursePlanParams.ordcourseID = [];
                    //为了避免在修改折算系数时，又将拿到的version信息置空，我们将该数组的定义需要使用它的地方进行。
                    //coursePlanParams.version = [];
                }
                if (reset) {//当在排课页面修改排课系数时，reset = false;
                    for (var i = 0; i < $scope.CGoupStudentCourseList.length; i++) {
                        //一对多课时排课时走这里---一对多课时排课version信息在这个changeCofficent方法里进行了封装
                        if ($scope.CGoupStudentCourseList[i].selected == 1 && $scope.now == 3) {
                            var coefficient;
                            if (i == index) {
                                coefficient = getCoefficient($scope.CGoupStudentCourseList[i].type, $scope.CGoupStudentCourseList[i].groupType);
                                var c = {};
                                c.coefficient = coefficient;
                                c.crm_student_id = $scope.CGoupStudentCourseList[i].crm_student_id;
                                c.ordcourse_id = $scope.CGoupStudentCourseList[i].ordcourse_id;
                                coursePlanParams.coefficients.push(c);
                                coursePlanParams.ordcourseID.push(c.ordcourse_id);
                                $scope.CGoupStudentCourseList[i].coefficient = coefficient;
                                coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            } else {
                                var c = {};
                                c.coefficient = coefficient = $scope.CGoupStudentCourseList[i].coefficient;
                                c.crm_student_id = $scope.CGoupStudentCourseList[i].crm_student_id;
                                c.ordcourse_id = $scope.CGoupStudentCourseList[i].ordcourse_id;
                                coursePlanParams.coefficients.push(c);
                                coursePlanParams.ordcourseID.push(c.ordcourse_id);
                                coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            }
                            if (num == undefined) {
                                num = $scope.CGoupStudentCourseList[i].plan_available_num / coefficient;
                            } else {
                                num = (num > $scope.CGoupStudentCourseList[i].plan_available_num / coefficient) ? $scope.CGoupStudentCourseList[i].plan_available_num / coefficient : num;
                            }
                        }
                        //一对多储值---一对多储值排课version信息不是在这个changeCofficent方法里进行封装的，它在_getWxClassTimeList方法开始就进行了封装
                        if ($scope.CGoupStudentCourseList[i].selected == 1 && $scope.now != 3) {
                            var coefficient = getCoefficient($scope.CGoupStudentCourseList[i].type, $scope.CGoupStudentCourseList[i].groupType);
                            var c = {};
                            c.coefficient = coefficient;
                            c.ordcourse_id = $scope.CGoupStudentCourseList[i].ordcourse_id;
                            coursePlanParams.coefficients.push(c);
                            //coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            $scope.CGoupStudentCourseList[i].coefficient = coefficient;
                            var order_charge = $scope.CGoupStudentCourseList[i].order_charge * coefficient;
                            var ks = Math.floor($scope.CGoupStudentCourseList[i].avaliable_amount / order_charge);
                            var cnum = $scope.CGoupStudentCourseList[i].avaliable_amount - ks * order_charge;
                            if ($scope.CGoupStudentCourseList[i].order_rule == 1) {
                                if (cnum > 0)
                                    ks = cnum / order_charge > 0.5 ? ks + 1 : ks + 0.5;
                            } else {
                                ks = cnum > 0 ? ks + 1 : ks;
                            }
                            //coursePlanParams.coefficients.push(coefficient);
                            if (num == undefined) {
                                num = ks;
                            } else {
                                num = (num > ks) ? ks : num;
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.CGoupStudentCourseList.length; i++) {
                        if ($scope.CGoupStudentCourseList[i].selected == 1 && $scope.now == 3) {
                            var coefficient = $scope.CGoupStudentCourseList[i].coefficient;
                            var c = {};
                            c.coefficient = coefficient;
                            c.ordcourse_id = $scope.CGoupStudentCourseList[i].ordcourse_id;
                            c.crm_student_id = $scope.CGoupStudentCourseList[i].crm_student_id;
                            coursePlanParams.coefficients.push(c);
                            coursePlanParams.ordcourseID.push(c.ordcourse_id);
                            //coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            if (coefficient == 0 || typeof coefficient == 'NaN') {
                                coefficient = 1;
                            }
                            if (num == undefined) {
                                num = $scope.CGoupStudentCourseList[i].plan_available_num / coefficient;
                            } else {
                                num = (num > $scope.CGoupStudentCourseList[i].plan_available_num / coefficient) ? $scope.CGoupStudentCourseList[i].plan_available_num / coefficient : num;
                            }
                        }

                        if ($scope.CGoupStudentCourseList[i].selected == 1 && $scope.now != 3) {
                            var coefficient = $scope.CGoupStudentCourseList[i].coefficient;
                            var c = {};
                            c.coefficient = coefficient;
                            c.ordcourse_id = $scope.CGoupStudentCourseList[i].ordcourse_id;
                            coursePlanParams.coefficients.push(c);
                            //coursePlanParams.version.push($scope.CGoupStudentCourseList[i].version);
                            $scope.CGoupStudentCourseList[i].coefficient = coefficient;
                            var order_charge = $scope.CGoupStudentCourseList[i].order_charge * coefficient;
                            var ks = Math.floor($scope.CGoupStudentCourseList[i].avaliable_amount / order_charge);
                            var cnum = $scope.CGoupStudentCourseList[i].avaliable_amount - ks * order_charge;
                            if ($scope.CGoupStudentCourseList[i].order_rule == 1) {
                                if (cnum > 0)
                                    ks = cnum / order_charge > 0.5 ? ks + 1 : ks + 0.5;
                            } else {
                                ks = cnum > 0 ? ks + 1 : ks;
                            }
                            //coursePlanParams.coefficients.push(coefficient);
                            if (num == undefined) {
                                num = ks;
                            } else {
                                num = (num > ks) ? ks : num;
                            }
                        }
                    }
                }
                $scope.coursePlanFilter.plan_available_num = Math.round(num * 10) / 10;
                $scope.plan_available_num = $scope.coursePlanFilter.plan_available_num
            }

            /**
             * 剩余课时，一对多排课专用
             * @param plan_available_num
             * @private
             */
            function _remaining(plan_available_num, coefficient) {
                if (plan_available_num == undefined) {
                    return false
                }
                /*plan_available_num==undefined @李世明，原来条件：!plan_available_num；原因：一对多排课有一个人没课就不让他排课*/
                if ($scope.coursePlanFilter.plan_available_num == undefined) {
                    $scope.coursePlanFilter.plan_available_num = plan_available_num / coefficient;
                } else {
                    $scope.coursePlanFilter.plan_available_num = ($scope.coursePlanFilter.plan_available_num > (plan_available_num / coefficient)) ? plan_available_num / coefficient : $scope.coursePlanFilter.plan_available_num;
                }
                $scope.coursePlanFilter.plan_available_num = Math.round($scope.coursePlanFilter.plan_available_num * 10) / 10;
                $scope.plan_available_num = $scope.coursePlanFilter.plan_available_num;
                // $scope.changeCoefficient(true);
            }

            /**
             * 课时排课和储值排课tab切换
             */
            $scope.gradeIds = [];

            function showPaikeView(tabId) {//初始化储值排课页面
                // $scope.coursePlanFilter = {};
                $scope.coursePlanFilter = {
                    subjectId: $scope.coursePlanFilter.subjectId,
                    teacherName: $scope.coursePlanFilter.teacherName,
                    teacherID: $scope.coursePlanFilter.teacherID
                };
                // $scope.coursePlanFilter.subjectId = $scope.coursePlanFilter.subjectId;
                _init();
                $scope.now = tabId;
                $scope.stuUnSelectNum = 0
                if (tabId == 1) {
                    $scope.chuzhipaikeflag = true;
                }
                if (tabId == 3) {
                    $scope.chuzhipaikeflag = false;
                }
                if ($scope.detail.type == 2) {

                    _clearSelect()
                    if (arguments.length === 2 && arguments[1].hide) {
                        arguments[1].hide()
                    }
                    return false
                }

                if ($scope.now == 1) {
                    CommonService.getGradeIdSelect().then(function (result) {
                        $scope.gradeIds = result.data;
                    });
                    if ($scope.detail.type == 15 || $scope.detail.type == 16) {
                        $scope.choosePkType1();
                    } else {
                        $scope.plan_available_num = "";
                    }
                    $scope.order_rule_name = "";
                    //用于存放一对一储值时的version信息
                    coursePlanParams.version = [];

                    _getWxClassTimeList()
                } else {
                    if ($scope.detail.type == 15 || $scope.detail.type == 16) {
                        $scope.choosePkType1();
                    } else {
                        $scope.plan_available_num = "";
                    }
                    // $scope.coursePlanFilter.subjectId = "";
                    $scope.coursePlanFilter.courseName = "";
                }
                console.log($scope.coursePlanFilter);
                if (arguments.length === 2 && arguments[1].hide) {
                    arguments[1].hide()
                }
            }

            function getWxClassTimeList() {
                CoursePlanService.getWxClassTimeList($scope.detail.crm_student_id || stu.crm_student_id, $scope.grade_id || stu.grade_id, $scope.detailForUp.grade_id || $scope.grade_id || stu.grade_id, $scope).then(function (result) {
                    $scope.CustomerStoredOrderList = result.orderList;
                    _changeOrderChargeByGrade();
                })
            }

            /**
             * 传递参数时是一对多排课
             * @param stu
             * 学生信息，用于提交排课时封装参数
             * @param repeat
             * 用户点击查看订单时不用在设置提交参数
             * @private
             */
            function _getWxClassTimeList(stu, repeat) {
                CoursePlanService.getWxClassTimeList($scope.detail.crm_student_id || stu.crm_student_id, $scope.grade_id || stu.grade_id, $scope.detailForUp.grade_id || $scope.grade_id || stu.grade_id, $scope).then(function (result) {

                    $scope.CustomerStoredOrderList = result.orderList;
                    //将version信息封装传到后台
                    if (!stu && !selectStuCourseModel['0']) {
                        selectStuCourseModel = {
                            '0': {
                                select: true,
                                CGoupStudentCourseList: 0,
                                stuId: $scope.detail.crm_student_id,
                                orderIndex: 0
                            }
                        }
                    }
                    var chargeIndex = getNowSelectOrder(stu)
                    if ($scope.CustomerStoredOrderList != null && $scope.CustomerStoredOrderList.length && $scope.CustomerStoredOrderList[chargeIndex].version != null) {
                        // console.clear()
                        console.log($scope.CustomerStoredOrderList)
                        coursePlanParams.version.push($scope.CustomerStoredOrderList[chargeIndex].version);
                    }

                    if ($scope.now == 1 && stu) {
                        //一对多
                        if (!repeat) {
                            _setPriceAndOrdCId(stu)
                        }
                    } else {
                        if ($scope.CustomerStoredOrderList.length > 0) {

                            _changeOrderChargeByGrade();
                            // _initStoredOrderList();
                        }
                        $("[data-toggle='tooltip']").tooltip();
                    }

                });
            }


            function _getClassTime() {
                for (var i = 0; i < $scope.CustomerStoredOrderList.length; i++) {
                    //$scope.CustomerStoredOrderList[i].order_charge = $scope.CustomerStoredOrderList[i].order_charge * getCoefficient(2,3);
                    //注释掉的 是原先 的 是原来的计算逻辑 现在 可排课时 不够1 质监站
                    // var num = Math.floor($scope.CustomerStoredOrderList[i].avaliable_amount / ($scope.CustomerStoredOrderList[i].order_charge * getCoefficient(1, $scope.detail.group_type)));
                    // var cnum = $scope.CustomerStoredOrderList[i].avaliable_amount - num * $scope.CustomerStoredOrderList[i].order_charge * getCoefficient(1, $scope.detail.group_type);
                    // if ($scope.CustomerStoredOrderList[i].order_rule == 1) {
                    //     if (cnum > 0)
                    //         num = cnum / ($scope.CustomerStoredOrderList[i].order_charge * getCoefficient(1, $scope.detail.group_type)) > 0.5 ? num + 1 : num + 1;
                    // } else {
                    //     num = cnum > 0 ? num + 1 : num;
                    // }
                    var num = Number($scope.CustomerStoredOrderList[i].avaliable_amount / ($scope.CustomerStoredOrderList[i].order_charge * getCoefficient(1, $scope.detail.group_type)));
                    $scope.CustomerStoredOrderList[i].plan_available_num = num;
                    //用于储值排课，查看订单列表展示可排课时
                    $scope.CustomerStoredOrderList[i].plan_available_num_int = Math.ceil(num);//原生的可排课时

                    if ($scope.CustomerStoredOrderList[i].order_rule == 1) {
                        $scope.CustomerStoredOrderList[i].order_rule_name = "1小时";
                    } else {
                        $scope.CustomerStoredOrderList[i].order_rule_name = "40分钟";
                    }
                    $scope.CustomerStoredOrderList[i].accountBalance = $scope.detail.accountBalance;
                    //$scope.CustomerStoredOrderList[i].avaliable_amount = Math.floor($scope.CustomerStoredOrderList[i].avaliable_amount * 100)/100;
                }
            }

            function _changeOrderChargeByGrade() {//订单单价和可排课时计算
                _getClassTime()
                var chargeIndex = getNowSelectOrder({crm_student_id: $scope.detail.crm_student_id})
                $scope.storedOrderId = $scope.CustomerStoredOrderList[chargeIndex].order_no;
                coursePlanParams.ordcourseID = $scope.CustomerStoredOrderList[chargeIndex].ordcourse_id;
                var version = [];
                version[0] = $scope.CustomerStoredOrderList[chargeIndex].version;
                coursePlanParams.version = version;
                $scope.coefficient = getCoefficient(1, $scope.detail.group_type);
                $scope.coursePlanFilter.coefficient = $scope.coefficient;
                $scope.coursePlanFilter.teachingStyle = 1;
                switch ($scope.coursePlanFilter.teachingStyle) {
                    case 1:
                        $scope.coursePlanFilter.teachingStyle = '一对一'
                        break;
                    case 2:
                        $scope.coursePlanFilter.teachingStyle = '一对二'
                        break;
                    case 3:
                        $scope.coursePlanFilter.teachingStyle = '一对三'
                        break;
                    case 4:
                        $scope.coursePlanFilter.teachingStyle = '班课'
                        break;
                    case 5:
                        $scope.coursePlanFilter.teachingStyle = '其他'
                        break;
                }
                $scope.orderBalance = $scope.CustomerStoredOrderList[chargeIndex].additional_amount;
                $scope.order_avaliable_amount = $scope.CustomerStoredOrderList[chargeIndex].avaliable_amount;

                $scope.order_rule = $scope.CustomerStoredOrderList[chargeIndex].order_rule;
                console.log($scope.CustomerStoredOrderList[chargeIndex])
                if ($scope.order_rule == 1) {
                    $scope.order_rule_name = "1小时";

                    $scope.show.planLists = [];
                    if (!($scope.detail.type == 15 || $scope.detail.type == 16 || $scope.detail.type == 3)) {
                        $scope.TIME_SIZE = [
                            {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                                id: 5,
                                name: '2.5小时'
                            }, {id: 6, name: '3小时'},
                        ];
                    } else {
                        $scope.TIME_SIZE = [
                            {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {
                                id: 4,
                                name: '2小时'
                            }, {
                                id: 5,
                                name: '2.5小时'
                            }, {id: 6, name: '3小时'},
                        ];
                    }
                } else {
                    $scope.order_rule_name = "40分钟";
                    $scope.show.planLists = [];
                    $scope.TIME_SIZE = [
                        {id: 1, name: '40分钟(1课时)'}, {id: 2, name: '1小时(1.5课时)'}, {id: 3, name: '1小时20分钟(2课时)'}, {
                            id: 4,
                            name: '1小时40分钟(2.5课时)'
                        }, {
                            id: 5,
                            name: '2小时(3课时)'
                        }, {id: 6, name: '2小时20分钟(3.5课时)'}, {id: 7, name: '2小时40分钟(4课时)'}, {id: 8, name: '3小时(4.5课时)'},
                    ];
                }
                $scope.order_teacher_level = $scope.CustomerStoredOrderList[chargeIndex].order_teacher_level;
                coursePlanParams.order_teacher_level = $scope.order_teacher_level;
                // $scope.order_teacher_level = 1478845234030;
                $scope.order_charging_id = $scope.CustomerStoredOrderList[chargeIndex].order_charging_id;
                coursePlanParams.order_charging_id = $scope.order_charging_id;
                $scope.order_teacher_level_name = $scope.CustomerStoredOrderList[chargeIndex].order_teacher_level_name;
                $scope.scheme_name = $scope.CustomerStoredOrderList[chargeIndex].scheme_name;

                $scope.order_charge = $scope.CustomerStoredOrderList[chargeIndex].order_charge;
                coursePlanParams.order_charge = $scope.order_charge;
                // $scope.plan_available_num = $scope.CustomerStoredOrderList[chargeIndex].plan_available_num;//可排课时
                $scope.order_avaliable_amount = $scope.CustomerStoredOrderList[chargeIndex].avaliable_amount;
                //此判断是 当可拍金额为0时  可排课时 也为0
                if ($scope.order_avaliable_amount.toFixed(2) > 0) {
                    $scope.plan_available_num = Math.ceil(Number($scope.CustomerStoredOrderList[chargeIndex].plan_available_num));
                } else {
                    $scope.plan_available_num = 0;
                }
            }


            /**
             * 修改学员年级
             */
            function changeCustomerGrade() {

                if (!$scope.detailForUp.grade_id) {
                    title = "该学生年级事非法年级，请为该学生重新选择年级";
                    $scope.detailForUp.grade_id = $scope.grade_id;
                    warningAlert(title);
                    return;
                }
                var unlawfulnessGrade = [14, 15, 16, 18, 19, 20, ""];
                var flag_grade = true;
                var title = "该操作将要修改该学生的年级,是否确定?";
                for (var i = 0; i < unlawfulnessGrade.length; i++) {
                    if ($scope.detailForUp.grade_id == unlawfulnessGrade[i]) {
                        flag_grade = false;
                        title = "该学生年级事非法年级，请为该学生重新选择年级";
                        $scope.detailForUp.grade_id = $scope.grade_id;
                        warningAlert(title);
                        break;
                    }
                }

                if (flag_grade) {

                    $mtModal.moreModal({
                        scope: $scope,
                        status: 0,
                        text: title,
                        hasNext: function () {

                            CoursePlanService.getWxClassTimeList($scope.detail.crm_student_id, $scope.grade_id, $scope.detailForUp.grade_id).then(function (result) {
                                console.log(result);
                                if (result.wxExist) {
                                    if (result.jk) {
                                        var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整,余额不足,系统将删除最后的" + result.jkCount + "条排课记录";
                                        var mtHtml = "<span class='f16 cf8'>调整后单价为：" + result.orderList[0].order_charge + "</span>";
                                        $mtModal.moreModal({
                                            scope: $scope,
                                            status: 0,
                                            text: t,
                                            html: mtHtml,
                                            hasNext: function () {
                                                $scope.grade_id = $scope.detailForUp.grade_id;
                                                coursePlanParams.grade_id = $scope.detailForUp.grade_id;
                                                $scope.CustomerStoredOrderList = result.orderList;
                                                CoursePlanService.saveGradeChange(result, $scope.detail.crm_student_id, $scope.grade_id);
                                                _changeOrderChargeByGrade();
                                                updateCustomerStudent();//更新学员年级
                                                $scope.mtResultModal.hide();
                                            },
                                            cancel: function () {
                                                $scope.detailForUp.grade_id = $scope.grade_id;
                                                $scope.mtResultModal.hide();
                                            }

                                        });
                                    } else {
                                        var t = "发现该学员有未消排课记录,系统将把这些排课记录的计费金额按本次修改调整";
                                        var mtHtml = "<span class='f16 cf8'>调整后单价为：" + result.orderList[0].order_charge + "</span>";
                                        $mtModal.moreModal({
                                            scope: $scope,
                                            status: 0,
                                            text: t,
                                            html: mtHtml,
                                            hasNext: function () {
                                                $scope.grade_id = $scope.detailForUp.grade_id;
                                                coursePlanParams.grade_id = $scope.detailForUp.grade_id;
                                                $scope.CustomerStoredOrderList = result.orderList;
                                                CoursePlanService.saveGradeChange(result, $scope.detail.crm_student_id, $scope.grade_id);
                                                _changeOrderChargeByGrade();
                                                updateCustomerStudent();//更新学员年级
                                                $scope.mtResultModal.hide();
                                            },
                                            cancel: function () {
                                                $scope.detailForUp.grade_id = $scope.grade_id;
                                                $scope.mtResultModal.hide();
                                            }

                                        });
                                    }
                                } else {
                                    $scope.grade_id = $scope.detailForUp.grade_id;
                                    coursePlanParams.grade_id = $scope.detailForUp.grade_id;
                                    $scope.CustomerStoredOrderList = result.orderList;
                                    CoursePlanService.saveGradeChange(result, $scope.detail.crm_student_id, $scope.grade_id);
                                    _changeOrderChargeByGrade();
                                    updateCustomerStudent();//更新学员年级
                                    $scope.mtResultModal.hide();
                                }


                            });

                        },
                        cancel: function () {
                            $scope.detailForUp.grade_id = $scope.grade_id;
                            coursePlanParams.grade_id = $scope.detailForUp.grade_id;
                            $scope.mtResultModal.hide();
                        }

                    });
                }
            }


            function updateCustomerStudent() {

                if ($scope.detailForUp.nextVisitAt) {
                    $scope.detailForUp.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt);
                }

                var promise = CustomerStudentService.update($scope.detailForUp);
                promise.then(function (data) {
                    //console.log(data);
                    if (data.status == 'FAILURE') {
                        SweetAlert.swal(data.data);
                        return false;
                    }
                    $scope.showListView();
                }, function (error) {
                    alert("更新学生客户失败");
                });
            }

            /**
             * 根据学员信息查询订单课程的信息-弹框
             */

            function showOrderCourseList(row) {

                $scope.courseOrderTitle = "选择课程";
                $scope.detail = angular.copy(row);
                // if($scope.detail.type == 1){
                //     $scope.detail.type = $scope.typesofPk;
                // }
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.orderCourseSelect.html',
                    show: true,
                    backdrop: "static"
                });
            }

            $scope.showStoredOrderList = showStoredOrderList;

            /**
             * 根据学员信息查询订单课程的信息-弹框
             */
            function showStoredOrderList(row) {
                $scope.courseOrderTitle = "查询 充值订单";

                _getWxClassTimeList();
                $scope.detail = angular.copy(row);
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.storedOrderList.html',
                    show: true,
                    backdrop: "static"
                });
            }

            /**
             * 选择订单课程后点击确定操作
             */
            function selectOrderCourse() {
                //获取选中的radio选项的值，对科目、课程名称进行赋值
                var index = $("input[name='cscourse']:checked").val();
                if (index == undefined) {
                    warningAlert("请选择订单课程信息");
                    return;
                }

                // 设置得到的可排课课时的信息
                var plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
                if ($scope.CustomerStudentCourseList[index].order_rule == 1) {
                    $scope.order_rule_name = '1小时';
                    $scope.order_rule = 1;
                    $scope.show.planLists = [];

                    if (!($scope.detail.type == 15 || $scope.detail.type == 16 || $scope.detail.type == 3)) {
                        $scope.TIME_SIZE = [
                            {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                                id: 5,
                                name: '2.5小时'
                            }, {id: 6, name: '3小时'},
                        ];
                    } else {
                        $scope.TIME_SIZE = [
                            {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {
                                id: 4,
                                name: '2小时'
                            }, {
                                id: 5,
                                name: '2.5小时'
                            }, {id: 6, name: '3小时'},
                        ];
                    }


                }
                if ($scope.CustomerStudentCourseList[index].order_rule == 2) {
                    $scope.order_rule_name = '40分钟';
                    $scope.order_rule = 2;
                    $scope.show.planLists = [];
                    $scope.TIME_SIZE = [
                        {id: 1, name: '40分钟(1课时)'}, {id: 2, name: '1小时(1.5课时)'}, {id: 3, name: '1小时20分钟(2课时)'}, {
                            id: 4,
                            name: '1小时40分钟(2.5课时)'
                        }, {
                            id: 5,
                            name: '2小时(3课时)'
                        }, {id: 6, name: '2小时20分钟(3.5课时)'}, {id: 7, name: '2小时40分钟(4课时)'}, {id: 8, name: '3小时(4.5课时)'},
                    ];
                }

                var subjectID = $scope.CustomerStudentCourseList[index].subject_id;
                var course_type_name = $scope.CustomerStudentCourseList[index].course_type_name;
                $scope.coursePlanFilter.subjectId = subjectID;
                $scope.coursePlanFilter.courseName = course_type_name;
                $scope.coursePlanFilter.teachingStyle = $scope.CustomerStudentCourseList[index].teachingStyle;
                switch ($scope.coursePlanFilter.teachingStyle) {
                    case 1:
                        $scope.coursePlanFilter.teachingStyle = '一对一'
                        break;
                    case 2:
                        $scope.coursePlanFilter.teachingStyle = '一对二'
                        break;
                    case 3:
                        $scope.coursePlanFilter.teachingStyle = '一对三'
                        break;
                    case 4:
                        $scope.coursePlanFilter.teachingStyle = '班课'
                        break;
                    case 5:
                        $scope.coursePlanFilter.teachingStyle = '其他'
                        break;
                }
                $scope.coursePlanFilter.coefficient = getCoefficient($scope.CustomerStudentCourseList[index].teachingStyle, 1);
                $scope.coefficient = $scope.coursePlanFilter.coefficient;
                // 将查询条件封装到查询教师的filter中
                $scope.teacherFilter.subjectId = subjectID;

                $scope.subjectID = subjectID;

                $scope.teacherFilter.subjectId = subjectID;
                // 封装总参数中  科目
                coursePlanParams.subjectID = subjectID;
                //选择科目时候，查出当前用户所属校区所有教授该科目的教师，展示
                var filter = {};
                filter.subjectId = subjectID;
                $scope.subjectTeacherGroup = {};
                //查询校区各个科目对应的教师
                TeacherService.getTeachersGroupBySubject(filter).then(function (response) {
                    $scope.subjectTeacherGroup = response.data.data;
                    //因为按钮长度限制4个汉字，所以在这里需要处理一下名字超过4个汉字的
                    angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                        angular.forEach(p.teachers, function (q, Qindex) {
                            if (q.username.length > 4) {
                                q.nameDisplay = q.username.substring(0, 4);
                            }
                            else {
                                q.nameDisplay = q.username;
                            }
                            //从老师时间表进行排课，是带有默认教师的，在去切换科目时，如果恰巧是默认的，需要设置为选中
                            if ($scope.coursePlanFilter.teacherID && $scope.coursePlanFilter.teacherID == q.userId) {
                                q.selected = true;
                            }
                        });
                    });
                });

                // 封装到总参数中、封装订单课程id、科目id
                var ordcourse_id = $scope.CustomerStudentCourseList[index].ordcourse_id;

                //  @李世明 一对多排课 2016-11-18 s $scope.stuIndex为当前学生所在的索引位置=====================
                if ($scope.now == 3 && $scope.detail.type == 2) {
                    /* if(typeof coursePlanParams.ordcourseID != 'object'){
                     coursePlanParams.ordcourseID = []
                     }
                     var _len = coursePlanParams.ordcourseID.length
                     if(_len){
                     if(coursePlanParams.ordcourseID.indexOf(ordcourse_id)==-1){
                     coursePlanParams.ordcourseID.push(ordcourse_id);
                     }
                     }else{
                     coursePlanParams.ordcourseID.push(ordcourse_id);
                     }*/
                } else {
                    //一对一课时排课的情况下走这里
                    coursePlanParams.ordcourseID = ordcourse_id;
                    var version = [];
                    version[0] = $scope.CustomerStudentCourseList[index].version;
                    //将其初始化
                    coursePlanParams.version = [];
                    coursePlanParams.version = version;
                }
                coursePlanParams.subjectID = subjectID;
                //一对多课时排课时走这里
                if ($scope.CGoupStudentCourseList) {
                    $scope.CGoupStudentCourseList[$scope.stuIndex].selected = 1
                    $scope.CGoupStudentCourseList[$scope.stuIndex].course_name = $scope.CustomerStudentCourseList[index].course_name;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].course_num = $scope.CustomerStudentCourseList[index].course_num;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].type = $scope.CustomerStudentCourseList[index].teachingStyle;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].ordcourse_id = $scope.CustomerStudentCourseList[index].ordcourse_id;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].version = $scope.CustomerStudentCourseList[index].version;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].groupType = $scope.detail.group_type;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].teachingStyle = $scope.coursePlanFilter.teachingStyle;
                    $scope.CGoupStudentCourseList[$scope.stuIndex].coefficient = getCoefficient($scope.CGoupStudentCourseList[$scope.stuIndex].type, $scope.detail.group_type);
                    coursePlanParams.coefficients.push($scope.CGoupStudentCourseList[$scope.stuIndex].coefficient);
                    if ($scope.detail.type == 2 && $scope.now == 3) {
                        _getSelectSize()
                    }
                    $scope.stuIndex = null
                }
                // 设置可排课时
                if ($scope.detail.type == 2 && $scope.now != 1) {
                    //为了避免在修改折算系数时，又将拿到的version信息置空，我们将该数组的定义需要使用它的地方进行。
                    coursePlanParams.version = [];
                    $scope.changeCoefficient(true);
                } else {
                    $scope.coursePlanFilter.plan_available_num_bak = plan_available_num;
                    $scope.coursePlanFilter.plan_available_num = plan_available_num / $scope.coursePlanFilter.coefficient;
                    $scope.coursePlanFilter.plan_available_num = Math.round($scope.coursePlanFilter.plan_available_num * 10) / 10;
                }
                $scope.plan_available_num = $scope.coursePlanFilter.plan_available_num
                //  @李世明 一对多排课 2016-11-18 n $scope.stuIndex为当前学生所在的索引位置====================
                // 判断是否是o2o的订单，如果是，则默认选中教师
                var order_category = $scope.CustomerStudentCourseList[index].order_category;
                if (order_category == 2) {
                    // 封装总的参数中的教师id
                    coursePlanParams.teacherID = $scope.CustomerStudentCourseList[index].teacher_id;
                    coursePlanParams.subjectID = $scope.CustomerStudentCourseList[index].subject_id_o2o;
                    $scope.coursePlanFilter.teacherName = $scope.CustomerStudentCourseList[index].teacher_name;
                    $scope.subjectID = coursePlanParams.subjectID;
                    $scope.coursePlanFilter.courseName = $scope.CustomerStudentCourseList[index].course_name;
                }
                $scope.recordModal.hide();
            }

            $scope.stuUnSelectNum = 0

            /**
             * 判断一对多课时排课是否有还未选择排课的学生
             * @returns {boolean}
             * @private
             */
            function _getSelectSize() {
                $scope.stuString = ' '
                for (var i = 0, len = $scope.CGoupStudentCourseList.length; i < len; i++) {
                    if (!$scope.CGoupStudentCourseList[i].selected) {
                        $scope.stuString += $scope.CGoupStudentCourseList[i].studentName + ' '
                    }
                }
                if ($.trim($scope.stuString)) {
                    return false
                }
                $scope.stuUnSelectNum = 1
                return true
            }

            /**
             * 订单课程列表取消
             */
            $scope.cancle = function () {
                $scope.recordModal.hide();
            }


            //获取选中的value
            $scope.selectIt = function (index) {
                // 将科目下拉框赋值
                var subjectID = $scope.CustomerStudentCourseList[index].subject_id;
                $scope.coursePlanFilter.subjectId = subjectID;
            }
            /**
             * 显示教师时间段查询的条件
             */
            $scope.showTimeSearch = function () {
                if ($("input[type='checkbox']").is(':checked')) {
                    $("#timeShow").show();
                    $scope.startEndTime = "";
                } else {
                    $("#timeShow").hide();
                    //将原有的select的时间查询的条件清空
                    $scope.select = {};
                    $scope.teacherFilter.startTime = null;
                    $scope.teacherFilter.endTime = null;
                }
            }

            /**
             * 判断是否已经按钮选中教师了
             */
            $scope.isBtnSelectedTeacher = function (row) {
                var ret = false;
                angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        if (q.selected) {
                            if (row.userId == q.userId) {
                                ret = true;
                                return
                            }
                        }
                    });
                    if (ret == true) {
                        return;
                    }
                });
                return ret;
            }

            /**
             * 按钮选中老师
             */
            $scope.btnSelectTeacher = function (teacher) {
                angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        if (teacher.userId == q.userId) {
                            if (q.selected) {
                                q.selected = false;
                            }
                            else {
                                q.selected = true;
                            }
                        }
                        else {
                            q.selected = false;
                        }
                    });
                });
                //选中后，需要设置参数
                if (teacher.selected) {
                    $scope.coursePlanFilter.teacherName = teacher.username;
                    $scope.coursePlanFilter.teacherID = teacher.userId;
                    coursePlanParams.teacherID = teacher.userId;
                    $scope.coursePlanFilter.deptId_1 = sessionStorage['com.youwin.yws.department_id'];
                    console.log(teacher)
                }
                else {
                    $scope.coursePlanFilter.teacherName = null;
                    $scope.coursePlanFilter.teacherID = null;
                    coursePlanParams.teacherID = null;
                    $scope.coursePlanFilter.deptId_1 = null;
                }
            }

            /**
             * 选择教师列表中的老师
             */
            $scope.$watch("pkModalShow", function (oldVal, newVal) {
                console.log(oldVal)
                console.log(newVal)
                $scope.selectSubject();
            })
            $scope.selectTeacher = function (row) {
                var index = $("input[name='teacherRadio']:checked").val();
                if (index == undefined) {
                    warningAlert("请选择教师");
                    return;
                }
                // 默认设置是精准还是定制排课
                if ($("input[name='timeSearch']").is(':checked')) {
                    $scope.selected.isWeekShow = false;
                    $scope.selected.isDayShow = true;
                }
                angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        if ($scope.CStudentSchoolTeacherList.list[index].userId == q.userId) {
                            if (q.selected) {
                                q.selected = false;
                            }
                            else {
                                q.selected = true;
                            }
                        }
                        else {
                            q.selected = false;
                        }
                    });
                });

                var teacherID = $scope.CStudentSchoolTeacherList.list[index].userId;
                var teacherName = $scope.CStudentSchoolTeacherList.list[index].username;
                $scope.coursePlanFilter.deptId_1 = $scope.CStudentSchoolTeacherList.list[index].deptId;
                $scope.coursePlanFilter.teacherName = teacherName;
                $scope.coursePlanFilter.teacherID = teacherID;
                // 封装总的参数中的教师id
                coursePlanParams.teacherID = teacherID;
                $scope.teacherModal.hide();
            }
            /**
             * 取消教师的选择
             */
            $scope.cancleTeacher = function () {
                $scope.teacherModal.hide();
            }
            /**
             * 添加时间段弹窗取消
             */
            $scope.cancleAddCourseTime = function () {
                $scope.recordModal.hide();
            }
            /**
             * 将教师的时间段的查询条件清空
             */
            $scope.resetSearch = function () {
                $scope.select = {};
            }
            $scope.__subjectId = null
            /**
             * 切换科目时调用
             */
            $scope.selectSubject = function () {

                delete $scope.coursePlanFilter.teacherName;
                delete coursePlanParams.teacherID;
                console.log($scope.coursePlanFilter.subjectId)
                // var subjectId = $("#subjectId option:selected").val();
                var subjectId = $scope.coursePlanFilter.subjectId;
                if (!subjectId || subjectId == 0) {
                    return;
                }
                var __flag = arguments[0]
                if ($("input[name='timeSearch']").is(':checked') && $scope.timeSearchFlag && __flag == 1) {
                    judgePlanTime();
                } else {
                    var t = $scope.select.type;
                    $scope.select = {};
                    $scope.select.type = t;
                }
                if ($scope.isJudgePlanTime) {
                    $scope.isJudgePlanTime = 0
                    return false
                }
                $scope.teacherFilter.subjectId = subjectId;
                // 封装总参数中  科目
                coursePlanParams.subjectID = subjectId;
                //选择科目时候，查出当前用户所属校区所有教授该科目的教师，展示
                var filter = {};
                filter.subjectId = subjectId;
                filter.select = angular.copy($scope.select)
                var __type = $scope.select.type
                if (filter.select.startDate) {
                    var setDate = filter.select.startDate
                    filter.select.startDate = [setDate.getFullYear(), setDate.getMonth() + 1, setDate.getDate()].join('-')
                }
                $scope.subjectTeacherGroup = {};
                //查询校区各个科目对应的教师
                TeacherService.getTeachersGroupBySubject(filter).then(function (response) {
                    $scope.subjectTeacherGroup = response.data.data;
                    var timeTragger = 0
                    //因为按钮长度限制4个汉字，所以在这里需要处理一下名字超过4个汉字的
                    angular.forEach($scope.subjectTeacherGroup, function (p, Pindex) {
                        angular.forEach(p.teachers, function (q, Qindex) {
                            if (q.username.length > 4) {
                                q.nameDisplay = q.username.substring(0, 4);
                            }
                            else {
                                q.nameDisplay = q.username;
                            }
                            //从老师时间表进行排课，是带有默认教师的，在去切换科目时，如果恰巧是默认的，需要设置为选中
                            if ($scope.coursePlanFilter.teacherID && $scope.coursePlanFilter.teacherID == q.userId) {
                                q.selected = true;
                                $scope.coursePlanFilter.teacherName = q.username;
                                $scope.coursePlanFilter.teacherID = q.userId;
                                coursePlanParams.teacherID = q.userId;
                            }
                            //  切换时间时不在时间段老师清除并提示@李世明2016-10-22
                            if ($scope.timeSearchFlag && $scope.coursePlanFilter.teacherID == q.userId) {
                                timeTragger++
                            }
                        });
                    });
                    if (!timeTragger && $scope.coursePlanFilter.teacherID && $scope.timeSearchFlag) {
                        var teacherName = $scope.coursePlanFilter.teacherName
                        $scope.coursePlanFilter.teacherName = null;
                        $scope.coursePlanFilter.teacherID = null;
                        coursePlanParams.teacherID = null;
                        if ($scope.__subjectId == null) {
                            $scope.__subjectId = subjectId
                        }
                        if (__flag == 1 && $scope.__subjectId == subjectId && $scope.coursePlanFilter.deptId_1 == sessionStorage['com.youwin.yws.department_id']) {
                            warningAlert(teacherName + '老师在此时间内不可用')
                        }
                        $scope.__subjectId = subjectId
                    }
                    hideSetTeacherTime()
                    if (!$scope.select.type) {
                        $scope.select.type = __type
                    }
                });
            }

            /**
             *
             */
            function showStudentsTimes() {
                var id = $scope.detail.crm_student_id;
                var name = $scope.detail.name;
                $scope.recordCoursePlanModal.hide();
                if ($scope.addModal) {
                    $scope.addModal.hide()
                }
                $location.url('/sos-admin/customer_times_id/' + id + '/' + name);
            }

            function showTeacherTimes() {
                if ($scope.addModal) {
                    $scope.addModal.hide()
                }
                if ($rootScope.sdetailModal) {
                    $rootScope.sdetailModal.hide()
                }
                //    /sos-admin/teacher_times_id/:id/:name
                if ($scope.coursePlanFilter && $scope.coursePlanFilter.teacherName) {
                    $location.url('/sos-admin/teacher_times_id/' + $scope.coursePlanFilter.teacherID + '/' + $scope.coursePlanFilter.teacherName);
                } else {
                    $location.url('/sos-admin/teacher_times');
                }
                $scope.recordCoursePlanModal.hide();

            }

            /**
             * 弹出选择教师的对话框
             */
            function showTeacherList(row) {
                console.log(row);
                $scope.teacherModelTitle = "查询老师";
                //删除参数 但 保存参数
                if ($scope.teacherFilter.subjectId) {
                    var subjectId = $scope.teacherFilter.subjectId;
                }
                if ($scope.teacherFilter.departmentName) {
                    var departmentName = $scope.teacherFilter.departmentName;
                }

                $scope.teacherFilter = {};
                // 默认加载科目的查询的参数
                if (departmentName) {
                    $scope.teacherFilter.departmentName = departmentName;
                }
                if (subjectId) {
                    $scope.teacherFilter.subjectId = subjectId;
                }

                $scope.detail = angular.copy(row);
                $scope.teacherModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.teacherSelect.html',
                    show: true,
                    backdrop: "static"
                });
            }

            $scope.radioFun = function radioFun(index, list, flag) {
                $scope[list].list[index][flag] = !$scope[list].list[index][flag]
                for (var i = 0, len = $scope[list].list.length; i < len; i++) {
                    if (i != index) {
                        $scope[list].list[i][flag] = false
                    }
                }
            }
            /**
             * 获取教师列表的计划
             */
            $scope.teacherFilter = {};

            function getTeachersList(tableState) {
                if ($("input[name='timeSearch']").is(':checked') && $scope.timeSearchFlag) {
                    judgePlanTime();
                }
                if ($scope.teacherFilter.departmentName != undefined) {
                    $scope.isLoading = true;
                    $scope.teacherTableState = tableState;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    console.log($scope.teacherFilter)
                    CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                        $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                        $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.isLoading = false;
                        $("#departmentName").val($scope.teacherFilter.departmentName);
                    });
                } else {
                    // 获取当前校区的名称
                    if ($scope.detail.type == 1 || $scope.detail.type == 3 || $scope.detail.type == 15 || $scope.detail.type == 16) {
                        if (!$scope.detail.crm_student_id) {
                            $scope.detail.crm_student_id = '';
                        }
                        var promise = CustomerStudentCourseService.getSchoolName($scope.detail.crm_student_id, 1);
                        promise.then(function (result) {
                            //$scope.teacherFilter.departmentName = result;
                            $scope.teacherTableState = tableState;
                            $scope.isrendLoading = true;
                            //$scope.teacherTableState.pagination.start=0;
                            $scope.pagination = $scope.teacherTableState.pagination;
                            var start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                            var number = $scope.pagination.number || 10;
                            console.log($scope.teacherFilter)
                            CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                                $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                                $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                                $scope.isLoading = false;
                                $("#departmentName").val($scope.teacherFilter.departmentName);
                            });
                        }, function (error) {

                        });
                    } else if ($scope.detail.type == 2 || $scope.detail.type == 7) {
                        //$scope.teacherFilter.departmentName = $scope.schoolName;
                        $scope.teacherTableState = tableState || {};
                        $scope.isrendLoading = true;
                        $scope.teacherTableState.pagination = $scope.teacherTableState.pagination || {};
                        $scope.teacherTableState.pagination.start = $scope.teacherTableState.pagination.start || 0;
                        $scope.pagination = $scope.teacherTableState.pagination;
                        var start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                        var number = $scope.pagination.number || 10;
                        console.log($scope.teacherFilter)
                        CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                            $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                            $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                            $scope.isLoading = false;
                            $("#departmentName").val($scope.teacherFilter.departmentName);
                        });
                    }

                }
            }

            /**
             * 按时间段查询教师的列表条件致空
             */
            function resetFilterTime() {
                for (var key in $scope.select) {
                    if (key != 'type') {
                        delete $scope.select[key]
                    }
                }
                $scope.timeSearchFlag = 0
                $scope.mtPK = 0
                $scope.setingSelectModal.hide()
            }

            /**
             * 按时间段查询教师的列表
             */
            function getTeachersListByFilter() {
                // 判断选择时间段的按钮是否被选中，选择则对时间进行判断
                if ($("input[name='timeSearch']").is(':checked') && $scope.timeSearchFlag) {
                    judgePlanTime();
                }
                $scope.isLoading = true;
                if ($scope.timeSearchFlag && !$scope.teacherTableState) {
                    $scope.teacherTableState = {pagination: {}}
                }
                var pagination = $scope.teacherTableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                if (!$scope.timeSearchFlag) {
                    delete $scope.teacherFilter.startTime
                    delete $scope.teacherFilter.endTime
                }
                CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, $scope.teacherTableState, $scope.teacherFilter).then(function (result) {
                    $scope.CStudentSchoolTeacherList = result.data.studentTeachers;
                    $scope.teacherTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.isLoading = false;

                    $("#departmentName").val($scope.teacherFilter.departmentName);
                    hideSetTeacherTime()
                });
            }

            function hideSetTeacherTime() {
                if ($scope.timeSearchFlag) {
                    $scope.setingSelectModal.hide()
                }
                $scope.mtPK = 0
            }

            /**
             * 得到结束时间
             * 并得到selected 开始和结束时间戳
             */
            function getEndTimeNew() {
                if ($scope.select.startDate && $scope.select.time && $scope.select.timeSize) {
                    // 得到开始时间的毫秒数
                    var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
                    var startTime = startDate + " " + $scope.select.time + ":00";
                    var date = new Date(startTime);
                    // 将startTime转变为毫秒数
                    var timestampStart = date.getTime();
                    $scope.select.timestampBaseStart = timestampStart;
                    var timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);

                    if ($scope.order_rule_name == '1小时') {
                        $scope.order_rule = 1;
                        timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                        // 20180606修改追加
                        if ($scope.timeSizeOnly30) {
                            timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 60 * 1000);
                        }
                    }
                    if ($scope.order_rule_name == '40分钟') {
                        $scope.order_rule = 2;
                        timestampEnd = timestampStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                        // 20180606修改追加
                        if ($scope.timeSizeOnly30) {
                            timestampEnd = timestampStart + (($scope.select.timeSize) * 40 * 60 * 1000);
                        }
                    }

                    $scope.select.timestampBaseEnd = timestampEnd;
                    $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                    // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
                    $scope.startTime = startTime;
                    $scope.endTime = startDate + " " + $scope.select.timeEnd + ":00";
                    $scope.startEndTime = startDate + " " + $scope.select.time + "--" + $scope.select.timeEnd;
                }
            }


            /**
             * 判断时间是否合法，不能进行跨天
             */
            $scope.isJudgePlanTime = 0

            function judgePlanTime() {
                //通过start 时间 得到结束时间和页面显示时间
                if ($scope.select.startDate == undefined) {
                    warningAlert('请选择上课日期');
                    $scope.isJudgePlanTime++
                    return;
                }
                if ($scope.select.time == undefined) {
                    warningAlert('请选择上课时间');
                    $scope.isJudgePlanTime++
                    return;
                }
                if ($scope.select.timeSize == undefined) {
                    warningAlert('请选择上课时长');
                    $scope.isJudgePlanTime++
                    return;
                }
                if ($scope.select.time >= "21:00") {
                    var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                    $scope.select.timestampBaseEnd = timestampEnd;
                    $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                    if ($scope.select.timeEnd == "00:00") {
                        warningAlert('结束时间不能为零点,请重新选择上课时间');
                        $scope.isJudgePlanTime++
                        return;
                    }
                }
                var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                if ($scope.order_rule_name == '40分钟') {
                    $scope.order_rule = 2;
                    timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                }
                $scope.select.timestampBaseEnd = timestampEnd;
                $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                console.log(new Date(timestampEnd));

                if (_ifNotOneDay($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd)) {//判断时间是否跨天
                    warningAlert('一节课不能隔天');
                    $scope.isJudgePlanTime++
                    return;
                }
                /*  if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
                 SweetAlert.swal('时间已经过去了，不容许排课');
                 return;
                 }*/
                //将查询条件封装到teacherFilter中
                $scope.teacherFilter.startTime = $scope.startTime;
                $scope.teacherFilter.endTime = $scope.endTime;
            }

            /**
             * 单次排课时的日期是否合法
             */
            function judgePlanTimeNew() {
                //通过start 时间 得到结束时间和页面显示时间

                if ($scope.select.startDate == undefined) {
                    warningAlert('请选择上课日期');
                    return false;
                }
                if ($scope.select.time == undefined) {
                    warningAlert('请选择上课时间');
                    return false;
                }
                if ($scope.select.timeSize == undefined) {
                    warningAlert('请选择上课时长');
                    return false;
                }
                if ($scope.select.time >= "21:00") {
                    var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                    // 20180606修改追加
                    if ($scope.timeSizeOnly30) {
                        timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 60 * 1000);
                    }
                    if ($scope.order_rule_name == '40分钟') {
                        $scope.order_rule = 2;
                        timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                        // 20180606修改追加
                        if ($scope.timeSizeOnly30) {
                            timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 40 * 60 * 1000);
                        }
                    }
                    $scope.select.timestampBaseEnd = timestampEnd;
                    $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                    if ($scope.select.timeEnd == "00:00") {
                        warningAlert('结束时间不能为零点,请重新选择上课时间');
                        return false;
                    }
                }
                var timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                // 20180606修改追加
                if ($scope.timeSizeOnly30) {
                    timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 60 * 60 * 1000);
                }
                if ($scope.order_rule_name == '40分钟') {
                    $scope.order_rule = 2;
                    timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                    // 20180606修改追加
                    if ($scope.timeSizeOnly30) {
                        timestampEnd = $scope.select.timestampBaseStart + (($scope.select.timeSize) * 40 * 60 * 1000);
                    }
                }

                $scope.select.timestampBaseEnd = timestampEnd;
                $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                console.log(new Date(timestampEnd));

                if (_ifNotOneDay($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd)) {//判断时间是否跨天
                    warningAlert('一节课不能隔天');
                    return false;
                }
                /*   if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
                 SweetAlert.swal('时间已经过去了，不容许排课');
                 return false;
                 }*/
                return true;
            }

            /**
             * 判断时间是否夸天
             * @param start  时间戳
             * @param end 时间戳
             * @returns {boolean}
             * @private
             */
            function _ifNotOneDay(start, end) {
                var st = new Date(start).getHours();
                var en = new Date(end).getHours();
                /*  console.log(new Date(end));*/
                var end_m = new Date(end).getMinutes();
                var end_s = new Date(end).getSeconds();
                if (st > en) {//开始销售数大于结束时间小时数
                    if (end_m == 0 && end_s == 0 && en == 0) {
                        return false;
                    } else {
                        return true;
                    }

                }
                return false;
            }

            /**
             * 异步加载学生的订单课程信息
             */
            function getOrderCourseList(tableState) {
                $scope.isLoading = true;
                /*$scope.detail.crm_student_id,0*/
                CustomerStudentCourseService.getOrderCourseList(_setStudentId()).then(function (result) {
                    $scope.CustomerStudentCourseList = result.studentOrder;
                    // 若是CustomerStudentCourseList的size = 1，默认选中radio
                    var length = $scope.CustomerStudentCourseList.length;
                    if (1 == length) {
                        $scope.CustomerStudentCourseList[0].isChecked = true;
                        $scope.subjectId = $scope.CustomerStudentCourseList[0].subject_id;
                        if ($scope.schoolName != "" && $scope.subjectId != "") {
                            $scope.canSelectTime = true;
                        }
                    }
                    $scope.isLoading = false;
                });
            }

            var _stuTypeGId = 0;
            $scope.e = {}
            $scope.e.typesofPk = 1;

            function _setStudentId() {
                if ($scope.detail.type == 2 && $scope.now == 3) {
                    return {crmCustomerStudentId: _stuTypeGId, orderCategory: 0, orderRule: $scope.detail.order_rule};
                } else if ($scope.detail.type == 2 && $scope.now == 1) {
                    return {crmCustomerStudentId: _stuTypeGId, orderCategory: 3, orderRule: $scope.detail.order_rule};
                } else if ($scope.detail.type == 1 && $scope.now == 3) {
                    var aaaa = $scope.e.typesofPk;
                    return {crmCustomerStudentId: $scope.detail.crm_student_id, orderCategory: 0};
                } else {
                    return {crmCustomerStudentId: $scope.detail.crm_student_id, orderCategory: 0};
                }
            }

            /**
             * 显示添加上课时间的对话框
             */
            function showAddCoursePlanTime() {
                // 选择排课的方式 、排本周、下周、还是

                if ($scope.select.type == undefined) {
                    warningAlert('请选择排课方式');
                    return;
                }
                $scope.addCoursePlanTitle = "添加上课时间";
                $scope.recordModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/customer/modal.addCoursePlanTime.html',
                    show: true,
                    backdrop: "static"
                });


            }

            //**************************************添加排课****************************************//
            $scope.checkedShowCycle = checkedShowCycle;
            $scope.addPlans = addPlans;     //动态增加行
            $scope.addPlansRecord = addPlansRecord; //增加排课记录到数据库
            $scope._ifTime = _ifTime;

            function classDataToSave(requestDate) {
                requestDate.classId = $scope.detail.id
                requestDate.gradeId = requestDate.grade_id
                requestDate.user = $scope.detail.user_id
                delete requestDate.grade_id
                delete requestDate.groupID
                delete requestDate.schoolID
                delete requestDate.ordcourseID
                delete requestDate.studentID
                delete requestDate.teacherID
                delete requestDate.studentName
                delete requestDate.crmCustomerGroupId
                delete requestDate.crmOrderIds
                delete requestDate.schoolId
                return requestDate
            }

            /**
             * 检查crmOrder中是否有重复的数据,问题已经解决，但请别删除，日后在付
             * @param obj
             */
            function _reseatParam(obj) {
                var arr = []
                for (var i = 0, len = obj.crmOrder.length; i < len; i++) {
                    if (i == len - 1) {
                        return obj
                    }
                    (function (i) {
                        for (var j = i + 1, _len = len - i; j < _len; j++) {
                            var _item = 0
                            //  循环每一个属性和下一个对象作比较，如果有完全相同的就标记_item+1
                            for (var key in obj.crmOrder[i]) {
                                if (obj.crmOrder[i][key] == obj.crmOrder[j][key]) {
                                    _item++
                                }
                            }
                            if (_item == 5) {
                                arr.push(i)
                                alert('课时排课数据出现重复，请联系前端！点击继续排课不会影响数据，请放心执行！')
                            }
                        }
                    })(i)
                }
                /*if(arr.length){
                 for(var _ai = 0 ,_alen = arr.length; _ai<_alen ; _ai++){
                 obj.crmOrder.splice(_ai,1)
                 }
                 }*/
                return obj
            }

            $scope.chooseStudentPk = function () {
                $scope.detail.type = 1;
                coursePlanParams.type = 1;
                $scope.TIME_SIZE = [
                    {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                        id: 5,
                        name: '2.5小时'
                    }, {id: 6, name: '3小时'},
                ];
                $scope.plan_available_num = ''
            }
            // 20180825添加上课途径参数，最后合并到提交参数里面
            $scope.newParams = {typeO2o:''}

            /**
             * 增加排课记录到数据库
             */
            function addPlansRecord(requestDate, courseTime) {

                if (requestDate.type == 7 || requestDate.type == 12) {
                    requestDate = classDataToSave(requestDate)
                }

                var obj = angular.copy(requestDate);

                var courseLen = 0;
                for (var i = 0; i < obj.coursetime.length; i++) {
                    courseLen += (obj.coursetime[i].end - obj.coursetime[i].start);
                }
                if (requestDate.type != 12 && !$scope.MyCrmCustomerStudentListOk) {
                    if (courseLen > $scope.plan_available_num * 3600000) {
                        /*SweetAlert.swal({
                         title: "没有足够的课时可排",
                         type: "warning",
                         showCancelButton: false,
                         confirmButtonText: '确定',
                         closeOnConfirm: true
                         });*/

                        $mtModal.moreModal({
                            text: "没有足够的课时可排",
                            scope: $scope,
                            status: 0
                        })
                        return;

                    }
                }
                /*为一对多排课@李世明2016-11-19  s*/
                if (typeof obj.crmOrderIds == 'object' && obj.crmOrderIds.length && $scope.detail.type == 2) {
                    if ($scope.now == 3) {
                        obj.crmOrderIds = obj.crmOrderIds.join(',')
                    } else if ($scope.now == 1) {
                        obj.crmOrder = angular.copy(obj.crmOrderIds)
                        obj.crmOrderIds = JSON.stringify(obj.crmOrderIds)
                        // obj = angular.copy(_reseatParam(angular.copy(obj)))
                    }
                }
                /*为一对多排课@李世明2016-11-19  n*/
                var count = requestDate.coursetime.length;
                if ($scope.MyCrmCustomerStudentListOk) {

                } else {
                    if (!obj.crmStudentId && obj.type == 3) {
                        $mtModal.moreModal({
                            text: "学生信息无效！",
                            scope: $scope,
                            status: 0
                        })
                        $scope.detail.name = "";
                        return false;
                    }
                }
                CreatePlanService.addPlans(Object.assign(obj,($scope.newParams.typeO2o!==''&&$scope.newParams.typeO2o>=0?$scope.newParams:{})), $scope.recording).then(function (result) {
                    var response = result.data;
                    if (response.status == 'SUCCESS') {
                        var title = "排课成功!共排课" + count + "次(" + courseTime.toFixed(2) + "小时)",
                            carryOn = '继续排课',
                            ok = 'OK,不继续排课'
                        if ($scope.order_rule == 2) {
                            title = "排课成功!共排课" + count + "次(" + courseTime + "课时)";
                        }
                        if ($scope.recording) {
                            title = "记录上课成功!共排课" + count + "次(" + courseTimecourseTime.toFixed(2) + "小时)"
                            carryOn = '继续记录'
                            ok = 'OK,不继续记录'
                        }
                        //一对多排课 刷新 学生展示的
                        if ($scope.studentListForAddGroupTableState) {
                            if ($scope.MyCrmCustomerStudentListOk) {
                                if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                                    for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                                        $scope.MyCrmCustomerStudentListOk[i].planAvailableNum -= $scope.select.timeSize / 2;
                                    }
                                }
                            }
                        }
                        // $scope.studentClass=$scope.rowlink;
                        // $scope.studentClass.classTimeJson=JSON.stringify($scope.multiplelistdetail)

                        //更新 修改
                        if (requestDate.type == 12) {
                            var promise = ClassManagementService.update($scope.studentClass);
                            promise.then(function (response) {
                                if (response.status == "FAILURE") {
                                    SweetAlert.swal(response.data, "更新失败，请重试", "error");
                                } else {
                                    // $scope.detailModal.hide();
                                    $scope.getMyCrmCustomerStudentClassList($scope.gTableState);
                                }
                            });
                        }

                        SweetAlert.swal({
                            title: title,
                            type: "success",
                            showCancelButton: true,
                            confirmButtonText: carryOn,
                            cancelButtonText: ok,
                            closeOnConfirm: true
                        }, function (confirm) {
                            if (confirm) {
                                //继续排课时，初始化coursePlanParams.version = [];
                                coursePlanParams.version = [];
                                if ($scope.detail.type == 15 || $scope.detail.type == 16) {
                                    $scope.choosePkType();
                                }
                                addCoursePlanInfoContinue($scope.detail, courseTime);
                            } else {
                                //隐藏排课的弹框
                                // $scope.addModal.hide();
                                try {
                                    $scope.addModal.hide();
                                } catch (e) {
                                    $scope.recordCoursePlanModal.hide();
                                }

                                if ($rootScope.getMyCrmCustomerStudentList) {
                                    $rootScope.getMyCrmCustomerStudentList($rootScope.tableState);
                                }
                                if ($scope.callServer && $scope.myCoursePlanTableState) {
                                    $scope.callServer($scope.myCoursePlanTableState);
                                }
                                if ($scope.refreshCoursePlan) {
                                    //如果父类有刷新排课表方法，就刷新
                                    $scope.refreshCoursePlan();
                                }

                                if ($scope.getMyCrmCustomerStudentClassList) {
                                    $scope.getMyCrmCustomerStudentClassList($scope.gTableState)
                                }
                                console.log($scope.ListencallServerrecord)
                                if ($scope.ListencallServerrecord) {
                                    $scope.ListencallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                                if ($scope.myCoursePlanRecordTableState) {
                                    console.log("$scope.myCoursePlanRecordTableState")
                                    $scope.ClasscallServerrecord($scope.myCoursePlanRecordTableState);
                                }
                            }
                        });
                    } else if (response.status == 'FAILURE') {//抛出冲突
                        //获取返回的时间冲突的集合

                        if (result.data.data == false) {
                            warningAlert("时间未到，不能排课");
                            return false;
                        }
                        if (result.data.data && result.data.data.indexOf('可排金额不足') > -1) {
                            warningAlert("可排金额不足！");
                            return false;
                        }
                        // if (typeof result.data.data === 'string') {
                        //
                        // }
                        $scope.warningStudentList = result.data.data;
                        var Confilict = 'partials/sos/customer/modal.conflict.coursePlan.html';
                        if (requestDate.type == 7) {
                            Confilict = 'partials/sos/coursePlan/modal.conflict.class.html';
                        }
                        // 处理集合，封装前端页面要展示的值
                        // 弹出与已有的排课时间冲突的记录集合
                        if (typeof $scope.warningStudentList == 'string' && (requestDate.type == 3 || requestDate.type == 16 || requestDate.type == 15)) {
                            //                          warningAlert($scope.warningStudentList);
                            //刷新排课页面

                            $modal({
                                scope: $scope,
                                templateUrl: 'partials/common/modal.pknextweek.html',
                                show: true
                            });

                            // SweetAlert.swal({
                            //     title: $scope.warningStudentList,
                            //     type: "success",
                            //     confirmButtonText: "确定",
                            //     closeOnConfirm: true
                            // }, function (confirm) {
                            //     if (confirm) {
                            // if ($scope.now == 3) {
                            //     showPaikeView(3);
                            // } else if ($scope.now == 1) {
                            //     showPaikeView(1);
                            // }
                            // //试听页面的刷新
                            // if ($scope.detail.type == 3) {
                            //     // 获取leads的可排课时信息
                            //     CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                            //         $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                            //         if ($scope.CLeadsCourseTimeList[0] != undefined) {
                            //             $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                            //         } else {
                            //             $scope.plan_available_num = 4;
                            //         }
                            //         /*// 获取科目信息
                            //          CommonService.getSubjectIdSelect().then(function (result) {
                            //          $scope.omsSubject = result.data;
                            //          });*/
                            //     })
                            // }
                            //     }
                            //
                            // });
                        }  else if (typeof $scope.warningStudentList == 'string') {
                            warningAlert(result.data.data);
                            return false;
                        } else if ($scope.warningStudentList.length > 0 && $scope.warningStudentList.splice ) {
                            $scope.confilctModalTitle = "排课时间冲突列表";
                            $scope.recordModal = $modal({
                                scope: $scope,
                                templateUrl: Confilict,
                                show: true,
                                backdrop: "static"
                            });
                        }
                        else {
                            warningAlert('排课失败');
                        }

                    }
                }, function (result) {
                    warningAlert('失败：' + result);
                });
            }

            /**
             * 添加排课时间
             */
            $scope.pknoalert = pknoalert

            function pknoalert() {

                if ($scope.now == 3) {
                    showPaikeView(3);
                } else if ($scope.now == 1) {
                    showPaikeView(1);
                }
                //试听页面的刷新
                if ($scope.detail.type == 3) {
                    // 获取leads的可排课时信息
                    CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                        if (result.plan_available_num) {
                            $scope.plan_available_num = result.plan_available_num;
                        } else {
                            $scope.plan_available_num = 0;
                        }
                        /*// 获取科目信息
                         CommonService.getSubjectIdSelect().then(function (result) {
                         $scope.omsSubject = result.data;
                         });*/
                    })

                    // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                    //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                    //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                    //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                    //     } else {
                    //         $scope.plan_available_num = 4;
                    //     }
                    //     /*// 获取科目信息
                    //      CommonService.getSubjectIdSelect().then(function (result) {
                    //      $scope.omsSubject = result.data;
                    //      });*/
                    // })
                }
            }

            $scope.selectTime = {};

            function getCourseEndTime() {
                // 判断是否选择了日期 $("input[type='checkbox']:checked").length;
                var checkLength = $("input[name='dayofWeek']:checked").length;
                var dayOfWeek = $("input[name='dayofWeek']:checked").eq(0).val();
                if (checkLength == 0) {
                    SweetAlert.swal({
                        title: "请先选择日期",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        closeOnConfirm: true
                    })
                    return;
                }
                if ($scope.selectTime.time1) {
                    var time1 = $scope.selectTime.time1 = parseInt($scope.selectTime.time1);
                    if (time1 < 0 || time1 > 23 || time1 % 1 != 0) {
                        SweetAlert.swal({
                            title: "请填在0-23小时之间的整数",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            closeOnConfirm: true
                        })
                        $scope.selectTime.time1 = null;
                        return;
                    }
                    if ($scope.selectTime.time1 < 10) {
                        $scope.selectTime.time1 = '0' + $scope.selectTime.time1;
                    }
                    /*if(!$scope.selectTime.time2 && !$scope.selectTime.isFocus){
                     angular.element('#time2').focus();
                     $scope.selectTime.isFocus = true;
                     return;
                     }*/

                }
                if ($scope.selectTime.time2) {
                    var time2 = $scope.selectTime.time2 = parseInt($scope.selectTime.time2);
                    if (time2 < 0 || time2 > 59 || time2 % 1 != 0) {
                        SweetAlert.swal({
                            title: "请选在0-59分钟之间的整数",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            closeOnConfirm: true
                        })
                        $scope.selectTime.time2 = null;
                        return;
                    }
                    if ($scope.selectTime.time2 < 10) {
                        $scope.selectTime.time2 = '0' + $scope.selectTime.time2;
                    }
                }
                if (checkLength > 0 && ($scope.selectTime.time1 || $scope.selectTime.time1 == 0) && $scope.selectTime.timeSize) {
                    if (!$scope.selectTime.time1) {
                        $scope.selectTime.time1 = 0;
                    }
                    if (!$scope.selectTime.time2) {
                        $scope.selectTime.time2 = 0;
                    }
                    $scope.selectTime.time = $scope.selectTime.time1 + ':' + $scope.selectTime.time2;

                    var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek, $scope.selectTime.time);
                    $scope.selectTime.timestampBaseStart = timestampStart;
                    var timestampEnd = timestampStart + (($scope.selectTime.timeSize) * 60 * 30 * 1000);
                    if ($scope.order_rule_name == '1小时') {
                        timestampEnd = timestampStart + (($scope.selectTime.timeSize) * 60 * 30 * 1000);
                    }
                    if ($scope.order_rule_name == '40分钟') {
                        timestampEnd = timestampStart + (($scope.selectTime.timeSize + 1) * 40 * 30 * 1000);
                    }
                    $scope.selectTime.timestampBaseEnd = timestampEnd;
                    $scope.selectTime.timeEnd = new Date(timestampEnd).Format("hh:mm");
                }
            }

            $scope.show = {
                isWeekNumber: false
                , planLists: []  //本次排课列表
                , planListsPage: []  //排课列表--当前分页
                , submitPlan: submitPlan//提交排课
                , judgeType: judgeType //判断是本周、下周、批量排课
                , deletePlan: function (row) {
                    var list = [];
                    list.push(row);
                    deletePlans(list, 0);
                }
            };

            /**
             * 设置排课时间
             */
            function addPlans() {
                var a = $scope.plan_available_num;

                var checkList = $("input[name='dayofWeek']:checked");
                $scope.checkList = checkList;
                var checkLength = $("input[name='dayofWeek']:checked").length;
                if (checkLength == 0) {
                    warningAlert('请选择日期！');
                    return;
                }
                if ($scope.selectTime.time == undefined) {
                    warningAlert('请选择上课时间！');
                    return;
                }
                if ($scope.selectTime.timeSize == undefined) {
                    warningAlert('请选择上课时长！');
                    return;
                }
                var _index = $scope.show.planLists.length;
                // 确定包含已经过去的时间，不可进行排课   仅在选择是本周排课时判断
                if ($scope.select.type == 0) {
                    var flagBefore = _checkAddPlanTimeisBefore(checkList, $scope.selectTime.time);
                    /*if(!flagBefore){
                     SweetAlert.swal('包含已过去的时间，请重新选择');
                     return;
                     }*/
                }
                for (var i = 0; i < checkLength; i++) {
                    // 设置临时对象的值
                    var objTemp = {};
                    objTemp.start = i + _index;
                    objTemp.day = checkList.eq(i).val();
                    objTemp.startDate = checkList.eq(i).parent().text();
                    objTemp.startTime = $scope.selectTime.time;
                    objTemp.timelong = ($scope.selectTime.timeSize) * 0.5;
                    if ($scope.order_rule_name == '40分钟') {
                        objTemp.timelong = ($scope.selectTime.timeSize + 1) * 0.5;
                    }
                    objTemp.endTime = $scope.selectTime.timeEnd;
                    if (_checkedAddPlasTime(objTemp.startTime, objTemp.endTime, objTemp.day)) {
                    } else {
                        warningAlert('时间有冲突！');
                        return;
                    }
                }
                var planLists = angular.copy($scope.show.planLists)

                for (var i = 0; i < checkLength; i++) {
                    // 设置临时对象的值
                    var objTemp = {};
                    objTemp.start = i + _index;
                    objTemp.day = checkList.eq(i).val();
                    objTemp.startDate = checkList.eq(i).parent().text();
                    objTemp.startTime = $scope.selectTime.time;
                    objTemp.timelong = ($scope.selectTime.timeSize) * 0.5;
                    if ($scope.order_rule_name == '40分钟') {
                        objTemp.timelong = ($scope.selectTime.timeSize + 1) * 0.5;
                    }
                    objTemp.endTime = $scope.selectTime.timeEnd;
                    if (_checkedAddPlasTime(objTemp.startTime, objTemp.endTime, objTemp.day)) {
                        $scope.show.planLists.push(objTemp);
                    } else {
                        warningAlert('时间有冲突！');
                    }

                }
                // 继续判断课时是否超过了可排课课时
                if ($scope.show.planLists != undefined && $scope.show.planLists.length > 0) {
                    var addPlanTime = 0;
                    for (var k = 0; k < $scope.show.planLists.length; k++) {
                        addPlanTime += $scope.show.planLists[k].timelong;
                    }
                    if ($scope.detail.type != 15 && $scope.detail.type != 16 && addPlanTime > $scope.plan_available_num) {

                        warningAlert('没有足够的课时可排');
                        $scope.show.planLists = planLists;
                        return;
                    } else if (($scope.detail.type == 15 || $scope.detail.type == 16) && addPlanTime > $scope.plan_available_num.plan_available_num) {

                        warningAlert('没有足够的课时可排');
                        $scope.show.planLists = planLists;
                        return;
                    }

                }
                // 隐藏当前对话框
                $scope.recordModal.hide();
            }

            function _checkedAddPlasTime(start, end, day) {
                //非数字校验
                if (!$scope.show.planLists || !$scope.show.planLists.length) {
                    $scope.show.planLists = [];
                }
                var list = angular.copy($scope.show.planLists);
                for (var i = 0; i < list.length; i++) {
                    if (day === list[i].day) {
                        if (_compareTimeHourAndMinute(list[i].startTime, start) >= 0
                            && _compareTimeHourAndMinute(start, list[i].endTime) > 0) {
                            return false;
                        }
                    }
                }
                return true;
            }

            /**
             * 本周排课时，判断时间是否已经过去
             */
            function _checkAddPlanTimeisBefore(checkList, start) {
                for (var i = 0; i < checkList.length; i++) {
                    var t = _getTimestampByWeekAndTimeNew(checkList[i].value, start);
                    if (t < new Date().getTime()) {
                        return false;
                        break
                    }
                }
                return true;
            }

            /**
             * 比较"10:00"的字符串
             * 将"10:00" 拆成小时 与分钟
             * @private
             * time1 <time2 return 1
             * time1 =time2 return 0
             * time1 >time2 return -1
             */
            function _compareTimeHourAndMinute(time1, time2) {
                var arrTime1 = time1.split(":");
                var arrTime2 = time2.split(":");
                if (parseInt(arrTime1[0]) < parseInt(arrTime2[0])) {//hour 比较
                    return 1;
                } else if (parseInt(arrTime1[0]) == parseInt(arrTime2[0])) {//hour 比较 只有当hour相同时，才进行比较分钟
                    if (parseInt(arrTime1[1]) < parseInt(arrTime2[1])) {
                        return 1;
                    } else if (parseInt(arrTime1[1]) == parseInt(arrTime2[1])) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {//hour 比较
                    return -1;
                }
            }


            /**
             * 判断是否是批量排课
             * @param type
             * 用户选择的类型
             */
            function judgeType(type) {
                $scope.select.type = type
                if ($scope.select.type == 2) {
                    // 批量排课
                    $scope.show.isWeekNumber = true;
                } else {
                    $scope.show.isWeekNumber = false;
                }
            }

            function deletePlans(list, type) {//0 表示删除一个  1全部删除
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {
                            _deletePlans(list);
                        }
                    }
                );
            }

            /**
             * 删除 $scope.show.planLists 中
             * @param list
             * @private
             */
            function _deletePlans(list) {
                var planLists = angular.copy($scope.show.planLists);
                var start = list[0].start;
                // 删除当前排课列表
                for (var j = 0; j < planLists.length; j++) {
                    if (planLists[j].start == start) {
                        $scope.show.planLists.splice(j, 1);
                    }
                }
            }

            /**
             * 判断参数是否合法，type 1：学员2：一对多3：试听
             */
            function judgeParams(coursePlanParams, type) {
                if (type == 15 || type == 16) {
                    coursePlanParams.type = type;
                }


                // 校验订单课程id、非试听时必填
                if ((type == 1 || type == 2) && $scope.now != 1) {
                    if (coursePlanParams.ordcourseID == undefined || coursePlanParams.ordcourseID == "") {
                        warningAlert('请选择课程信息');
                        return false;
                    }
                }
                // 判断科目必填
                if (coursePlanParams.subjectID == undefined || coursePlanParams.subjectID == "") {
                    warningAlert('请选择科目');
                    return false;
                }
                // 教师必填
                if (coursePlanParams.teacherID == undefined || coursePlanParams.teacherID == "") {
                    warningAlert('请选择教师');
                    return false;
                }

                if (type == 1 && $scope.now == 1) {//年级必选
                    if (!($scope.CustomerStoredOrderList.length > 0)) {
                        warningAlert('没有订单信息');
                        return false;
                    }
                    if (!$scope.detailForUp.grade_id) {
                        title = "该学生年级事非法年级，请为该学生重新选择年级";
                        $scope.detailForUp.grade_id = $scope.grade_id;
                        warningAlert(title);
                        return;
                    }
                    var unlawfulnessGrade = [14, 15, 16, 18, 19, 20, ""];
                    var title = "该操作将要修改该学生的年级,是否确定?";
                    for (var i = 0; i < unlawfulnessGrade.length; i++) {
                        if ($scope.detailForUp.grade_id == unlawfulnessGrade[i]) {
                            title = "该学生年级事非法年级，请为该学生重新选择年级";
                            $scope.detailForUp.grade_id = $scope.grade_id;
                            warningAlert(title);
                            return false;
                        }
                    }

                }
                return true;
            }

            /**
             * 判断是否添加了日期
             */
            function judgeAddPlans() {
                if (!$scope.show.planLists.length && $scope.detail.type != 7) {
                    warningAlert('请添加排课时间');
                    return false;
                } else {
                    return true;
                }
            }

            /**
             * 判断是否添加了日期
             */
            function judgeAddPlansmultiple() {
                if ($scope.multiplelistdetail.length < 1) {
                    warningAlert('请添加排课时间');
                    return false;
                } else {
                    return true;
                }
            }

            // 用于验证时间是否和已设置的不可排课的时间冲突
            var checkCoursePlanParams = [];
            var checkCoursePlanAllParams = {};

            $scope.initTimeSize = function (timeSize) {
                $scope.select.timeSize = timeSize
                $scope.timeSizeOnly30 = timeSize
            }

            /**
             * 提交排课
             */
            function submitPlan() {

                if ($scope.MyCrmCustomerStudentListOk) {
                    if ($scope.MyCrmCustomerStudentListOk.length > 1) {
                        for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                            if ($scope.MyCrmCustomerStudentListOk[i].planAvailableNum == 0 || $scope.MyCrmCustomerStudentListOk[i].planAvailableNum < 0) {
                                warningAlert($scope.MyCrmCustomerStudentListOk[i].name + '剩余可排课时为空,请重新选择');
                                return false
                            }
                            if ($scope.MyCrmCustomerStudentListOk[i].planAvailableNum < $scope.select.timeSize / 2) {
                                warningAlert($scope.MyCrmCustomerStudentListOk[i].name + '剩余课时不够排课,请重新选择');
                                return false
                            }
                        }
                    }
                }
                if ($scope.recording) {
                    $scope.selected.isWeekShow = false
                    $scope.selected.isDayShow = true
                }
                //验证课时是否足够，不够直接返回false
                var size = $scope.select.timeSize * 0.5;
                if ($scope.order_rule == 2) {
                    size = ($scope.select.timeSize + 1) * 0.5;
                }
                // 20180606修改
                if ($scope.timeSizeOnly30) {
                    size = 0.5
                }
                if ($scope.detail.type == 15 || $scope.detail.type == 16) {
                    if (size > $scope.plan_available_num.plan_available_num) {

                        warningAlert('没有足够的课时可排课');
                        return false;
                    }
                } else if ($scope.detail.type != 15 && $scope.detail.type != 16) {
                    var shengyukeshi = Number(($scope.plan_available_num || 0).toFixed(2))

                    if ($scope.chuzhipaikeflag) {
                        if ($scope.plan_available_num < 1 && $scope.plan_available_num != 0) {
                            if (size > 1) {
                                warningAlert('没有足够的课时可排课');
                                return false;
                            }
                        } else {
                            if (size > $scope.plan_available_num) {

                                warningAlert('没有足够的课时可排课');
                                return false;
                            }
                        }
                    } else if (size > shengyukeshi && $scope.detail.type !=3 && $scope.detail.type !=7) {
                        warningAlert('没有足够的课时可排课');
                        return false;
                    }

                }
                if ($scope.detail.type == 2 && !coursePlanParams.ordcourseID) {
                    $mtModal.moreModal({status: 0, text: '没有可排课的订单', scope: $scope})
                    return false
                }
                if ($scope.detail.type == 2 && $scope.now == 3 && !_getSelectSize()) {
                    $mtModal.moreModal({status: 0, text: '请检查' + $scope.stuString + '是否有可排课程', scope: $scope})
                    return false
                }
                // 判断是精准日期排课  还是定制排课时间规则排课
                if ($scope.selected.isWeekShow) {
                    if (_ifTime(0)) {//判断是否有课时
                        if ($scope.select.type == 0) {//本周
                            submitPlan0();
                        } else if ($scope.select.type == 1) {//下周
                            submitPlan1();
                        } else if ($scope.select.type == 2) {//批量
                            submitPlan2();
                        } else {
                            warningAlert('请选择定制排课时间规则的排课方式');
                        }
                    }
                } else if ($scope.selected.isDayShow) {
                    submitPlanOne();
                }
            }

            /**
             * 精准日期排课（单次）
             */
            function submitPlanOne() {
                var flagParam = true,
                    flagTime = true
                // recording = $scope.recording
                coursePlanParams.subjectID = $scope.coursePlanFilter.subjectId
                flagParam = judgeParams(coursePlanParams, $scope.detail.type);
                // 先判断是否选择了教师科目等信息
                if (flagParam) {
                    // 判断页面上的输入的排课时间是否合法
                    flagTime = judgePlanTimeNew();
                    if (flagTime) {
                        // 判断上课时长是否小于可排课时
                        var size = $scope.select.timeSize * 0.5;
                        if ($scope.order_rule == 2) {
                            size = ($scope.select.timeSize + 1) * 0.5;
                        }
                        // 20180605修改
                        if ($scope.timeSizeOnly30) {
                            size = 0.5
                        }
                        if ($scope.detail.type == 15 || $scope.detail.type == 16) {
                            if (size > $scope.plan_available_num.plan_available_num) {
                                warningAlert('没有足够的课时可排课');
                                return false;
                            }
                        } else if ($scope.detail.type != 15 && $scope.detail.type != 16 && $scope.detail.type != 3 && $scope.detail.type != 17) {
                            //现在排课 <1 之后，可排1课时的 课程
                            if (!$scope.chuzhipaikeflag) {
                                // if ($scope.plan_available_num < 1 && $scope.plan_available_num != 0) {
                                //     warningAlert('可排课时小于1，不允许排课');
                                //     return false;
                                // }
                                if ($scope.plan_available_num == 0 && $scope.plan_available_num != '') {
                                    warningAlert('没有足够的课时可排课');
                                    return false;
                                }
                            } else {
                                if ($scope.plan_available_num < 1 && $scope.plan_available_num != 0) {
                                    if (size > 1) {
                                        warningAlert('没有足够的课时可排课');
                                        return false;
                                    }
                                } else {
                                    if (size > $scope.plan_available_num && $scope.detail.type !=3) {

                                        warningAlert('没有足够的课时可排课');
                                        return false;
                                    }
                                }


                            }

                        }

                        // 封装时间的参数
                        var plans = [];
                        var start = $scope.select.timestampBaseStart;
                        var end = $scope.select.timestampBaseEnd;
                        // 封装到数组中、在封装到总的参数中
                        plans.push(_setOnePlan(start, end));
                        checkCoursePlanAllParams = {
                            "teacherID": coursePlanParams.teacherID,
                            "coursePlanTimeList": plans
                        }
                        // 判断是否和设置的不可排课的时间
                        CoursePlanService.checkAddCoursePlanTime(checkCoursePlanAllParams).then(function (result) {
                            var response = result;
                            if (response.status == 'SUCCESS') {

                                var dataFlag = response.data;
                                // 代表有冲突，不可进行排课
                                if (dataFlag) {
                                    warningAlert('与教师设置的不可排课的时间冲突');
                                    return;
                                } else {
                                    // 判断是否要提交排课

                                    var count = plans.length,
                                        title = "即将排课" + count + "次(" + size.toFixed(2) + "小时),是否确定?"
                                    if ($scope.order_rule == 2) {
                                        title = "即将排课" + count + "次(" + size + "课时),是否确定?"
                                    }

                                    if ($scope.recording) {
                                        title = "即将记录上课" + count + "次(" + size.toFixed(2) + "小时),是否确定?"
                                        if ($scope.order_rule == 2) {
                                            title = "即将排课" + count + "次(" + size + "课时),是否确定?"
                                        }
                                    }
                                    SweetAlert.swal({
                                            title: title,
                                            type: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            closeOnConfirm: true
                                        }, function (confirm) {
                                            if (confirm) {

                                                _setBaseRequestData(coursePlanParams)
                                                _setCourseRequestData(plans);
                                                $scope.requestDate.studentIds = [];
                                                $scope.requestDate.intentionIds = [];
                                                if ($scope.MyCrmCustomerStudentListOk) {
                                                    if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                                                        for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                                                            if ($scope.MyCrmCustomerStudentListOk[i].state == 1) {
                                                                $scope.requestDate.studentIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                            }
                                                            if ($scope.MyCrmCustomerStudentListOk[i].state == 2) {
                                                                $scope.requestDate.intentionIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                            }
                                                        }
                                                    }
                                                }
                                                // 添加排课记录
                                                $scope.addPlansRecord($scope.requestDate, size);
                                            }
                                        }
                                    );

                                }
                            } else if (response.status == 'FAILURE') {//抛出冲突
                                SweetAlert.swal(result.data.data);
                                return;
                            }
                        }, function (result) {
                            warningAlert('失败：' + result);
                            return;
                        });
                    }
                }
            }

            /**
             * 本周排课 - 批量排课
             */
            function submitPlan0() {
                // 是否选择了教师科目等参数
                var flagParam = judgeParams(coursePlanParams, $scope.detail.type);
                if (!flagParam) {
                    return;
                }
                // 是否添加了日期
                var flag = judgeAddPlans();
                if (!flag) {
                    return;
                }
                // 时长

                var size = ($scope.selectTime.timeSize + 1) * 0.5;

                var length = $scope.show.planLists.length;
                var plans = [];
                checkCoursePlanParams = [];
                for (var i = 0; i < length; i++) {
                    // 星期二、星期三   开始时间、结束时间
                    var dayOfWeek = $scope.show.planLists[i].day;       // 星期几day
                    var start = $scope.show.planLists[i].startTime;     // 开始时间
                    var timeSize = $scope.show.planLists[i].timelong;   // 时长
                    var endTime = $scope.show.planLists[i].endTime; // 结束时间
                    if (!et(endTime, start, $scope.show.planLists[i])) {
                        return false
                    }
                    // 获取开始时间、结束时间的long值
                    var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek, start);
                    var timestampEnd = timestampStart + (timeSize * 60 * 60 * 1000);
                    if ($scope.order_rule_name == '40分钟') {
                        $scope.order_rule = 2;
                        timestampEnd = timestampStart + ((timeSize) * 40 * 60 * 1000);
                    }

                    plans.push(_setOnePlan(timestampStart, timestampEnd));
                    // 封装到验证的集合中
                    checkCoursePlanParams.push(_setOnePlan(timestampStart, timestampEnd));
                }
                checkCoursePlanAllParams = {
                    "teacherID": coursePlanParams.teacherID,
                    "coursePlanTimeList": checkCoursePlanParams
                }
                // 判断是否和设置的不可排课的时间
                CoursePlanService.checkAddCoursePlanTime(checkCoursePlanAllParams).then(function (result) {
                    var response = result;
                    if (response.status == 'SUCCESS') {
                        var dataFlag = response.data;
                        // 代表有冲突，不可进行排课
                        if (dataFlag) {
                            warningAlert('与教师设置的不可排课的时间冲突');
                            return;
                        } else {
                            // 判断是否要提交排课

                            var count = plans.length;
                            var size = 0;
                            if ($scope.show.planLists != undefined && $scope.show.planLists.length > 0) {
                                for (var k = 0; k < $scope.show.planLists.length; k++) {
                                    size += $scope.show.planLists[k].timelong;
                                }
                            }

                            var title = "即将排课" + count + "次(" + size.toFixed(2) + "小时),是否确定?"
                            if ($scope.order_rule == 2) {
                                title = "即将排课" + count + "次(" + size + "课时),是否确定?"
                            }

                            SweetAlert.swal({
                                    title: title,
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    closeOnConfirm: true
                                }, function (confirm) {
                                    if (confirm) {
                                        _setBaseRequestData(coursePlanParams)
                                        _setCourseRequestData(plans);
                                        // 添加排课记录
                                        $scope.requestDate.studentIds = [];
                                        $scope.requestDate.intentionIds = [];
                                        if ($scope.MyCrmCustomerStudentListOk) {
                                            if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                                                for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                                                    if ($scope.MyCrmCustomerStudentListOk[i].state == 1) {
                                                        $scope.requestDate.studentIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                    }
                                                    if ($scope.MyCrmCustomerStudentListOk[i].state == 2) {
                                                        $scope.requestDate.intentionIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                    }
                                                }
                                            }
                                        }
                                        $scope.addPlansRecord($scope.requestDate, size);
                                    }
                                }
                            );

                        }
                    } else if (response.status == 'FAILURE') {//抛出冲突
                        SweetAlert.swal(result.data.data);
                        return;
                    }
                }, function (result) {
                    warningAlert('失败：' + result);
                    return;
                });
            }

            /**
             * 下周排课 -批量排课
             */
            function submitPlan1() {
                // 是否选择了教师科目等参数
                var flagParam = judgeParams(coursePlanParams, $scope.detail.type);
                if (!flagParam) {
                    return;
                }
                // 是否添加了日期
                var flag = judgeAddPlans();
                if (!flag) {
                    return;
                }
                // 时长
                var size = $scope.selectTime.timeSize * 0.5;
                if ($scope.order_rule_name == '40分钟') {
                    size = ($scope.selectTime.timeSize + 1) * 0.5;
                }
                if (size > $scope.plan_available_num) {

                    warningAlert('没有足够的课时可排课');
                    return;
                }
                var length = $scope.show.planLists.length;
                var plans = [];
                checkCoursePlanParams = [];
                for (var i = 0; i < length; i++) {
                    // 星期二、星期三   开始时间、结束时间
                    var dayOfWeek = $scope.show.planLists[i].day;       // 星期几day
                    var start = $scope.show.planLists[i].startTime;     // 开始时间
                    var timeSize = $scope.show.planLists[i].timelong;   // 时长
                    var endTime = $scope.show.planLists[i].endTime;     // 结束时间
                    if (!et(endTime, start, $scope.show.planLists[i])) {
                        return false
                    }
                    // 获取开始时间、结束时间的long值
                    var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek, start) + $scope.config.ONE_DAY_TIMESTAMP * 7;
                    var timestampEnd = timestampStart + (timeSize * 60 * 60 * 1000);
                    if ($scope.order_rule_name == '40分钟') {
                        $scope.order_rule = 2;
                        timestampEnd = timestampStart + ((timeSize) * 40 * 60 * 1000);
                    }
                    plans.push(_setOnePlan(timestampStart, timestampEnd));
                    // 封装到验证的集合中
                    checkCoursePlanParams.push(_setOnePlan(timestampStart, timestampEnd));
                }
                checkCoursePlanAllParams = {
                    "teacherID": coursePlanParams.teacherID,
                    "coursePlanTimeList": checkCoursePlanParams
                }
                // 判断是否和设置的不可排课的时间
                CoursePlanService.checkAddCoursePlanTime(checkCoursePlanAllParams).then(function (result) {
                    var response = result;
                    if (response.status == 'SUCCESS') {
                        var dataFlag = response.data;
                        // 代表有冲突，不可进行排课
                        if (dataFlag) {
                            warningAlert('与教师设置的不可排课的时间冲突');
                            return;
                        } else {
                            // 判断是否要提交排课
                            var size = 0;
                            var count = plans.length;
                            if ($scope.show.planLists != undefined && $scope.show.planLists.length > 0) {
                                for (var k = 0; k < $scope.show.planLists.length; k++) {
                                    size += $scope.show.planLists[k].timelong;
                                }
                            }

                            var title = "即将排课" + count + "次(" + size.toFixed(2) + "小时),是否确定?"
                            if ($scope.order_rule == 2) {
                                title = "即将排课" + count + "次(" + size + "课时),是否确定?"
                            }

                            SweetAlert.swal({
                                    title: title,
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    closeOnConfirm: true
                                }, function (confirm) {
                                    if (confirm) {
                                        _setBaseRequestData(coursePlanParams)
                                        _setCourseRequestData(plans);
                                        // 添加排课记录
                                        $scope.requestDate.studentIds = [];
                                        $scope.requestDate.intentionIds = [];
                                        if ($scope.MyCrmCustomerStudentListOk) {
                                            if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                                                for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                                                    if ($scope.MyCrmCustomerStudentListOk[i].state == 1) {
                                                        $scope.requestDate.studentIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                    }
                                                    if ($scope.MyCrmCustomerStudentListOk[i].state == 2) {
                                                        $scope.requestDate.intentionIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                    }
                                                }
                                            }
                                        }
                                        $scope.addPlansRecord($scope.requestDate, size);
                                    }
                                }
                            );
                        }
                    } else if (response.status == 'FAILURE') {//抛出冲突
                        SweetAlert.swal(result.data.data);
                        return;
                    }
                }, function (result) {
                    warningAlert('失败：' + result);
                    return;
                });
            }

            function et(endTime, startTime, data) {
                startTime = startTime.length === 4 ? (startTime + '0') : startTime
                if (endTime == '00:00') {
                    warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '结束时间不能为零点,请重新选择上课时间');
                    return false;
                }
                if (_ifNotOneDay(new Date($scope.select.pTimeStart).getTime(), new Date($scope.select.pTimeEnd).getTime())) {//判断时间是否跨天
                    warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '一节课不能隔天');
                    return;
                }
                if (endTime < startTime) {
                    warningAlert(data.startDate + '上课时间：' + startTime + '-' + endTime + '一节课不能隔天');
                    return false;
                }
                return true
            }

            /**
             * 批量排课
             */
            function submitPlan2() {
                // 是否选择了教师科目等参数

                var flagParam = judgeParams(coursePlanParams, $scope.detail.type);
                if (!flagParam) {
                    return;
                }
                // 是否添加了日期
                var flag = judgeAddPlans();
                if (!flag) {
                    return;
                }
                // 批量排课开始日期、结束日期、次数
                var pStart = $scope.select.pTimeStart;
                var pEnd = $scope.select.pTimeEnd;
                var length = $scope.select.weekNumber || 1000;
                // 请选择日期
                if (pStart == undefined) {
                    warningAlert('请选择批量排课开始日期');
                    return;
                }
                if (pEnd == undefined) {
                    warningAlert('请选择批量排课结束日期');
                    return;
                }

                // 批量排课开始日期long值、结束日期long值
                var pStartTimestamp = new Date(pStart).getTime();
                var pEndTimestamp = new Date(pEnd).getTime();

                var plans = [];
                var start, end;
                var _start, _end, _planNumber = 1;
                var lengthCheck = $scope.show.planLists.length;
                var weekLength = Math.ceil(length / lengthCheck);
                for (var i = 0; i < weekLength; i++) {
                    for (var j = 0; j < lengthCheck; j++) {
                        if ((length - 1) < 0) {
                            break;
                        }
                        pStartTimestamp = new Date(pStart).getTime();
                        pEndTimestamp = new Date(pEnd).getTime();

                        var dayOfWeek = $scope.show.planLists[j].day;       // 星期几day
                        var startTime = $scope.show.planLists[j].startTime; // 开始时间
                        var endTime = $scope.show.planLists[j].endTime; // 结束时间
                        if (!et(endTime, startTime, $scope.show.planLists[j])) {
                            return false
                        }
                        // 获取开始时间、结束时间的long值
                        start = _getTimestampByWeekAndTimeNew2(dayOfWeek, startTime, pStartTimestamp);
                        end = _getTimestampByWeekAndTimeNew2(dayOfWeek, endTime, pStartTimestamp);
                        _start = start + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                        _end = end + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                        if ((_end <= pEndTimestamp + $scope.config.TIME_OFFSET + $scope.config.ONE_DAY_TIMESTAMP)) {
                            if (!_ifTime(_planNumber * 0.5 * $scope.select.timeSize)) {
                                plans = [];
                                return false;
                            }
                            pStartTimestamp = pStartTimestamp + $scope.config.TIME_OFFSET;//修正时区
                            /* if(pStartTimestamp<=_start && _start>new Date().getTime()){*/
                            if (pStartTimestamp <= _start) {
                                plans.push(_setOnePlan(_start, _end));
                                _planNumber += 1;
                                length -= 1;
                            } else {
                                weekLength += 1;
                            }

                        } else {
                            continue;
                        }
                    }
                }
                // 若plans有排课时间，则添加排课记录
                if (plans.length > 0) {
                    checkCoursePlanAllParams = {
                        "teacherID": coursePlanParams.teacherID,
                        "coursePlanTimeList": plans
                    }
                    // 继续判断课时是否超过了可排课课时
                    var addPlanTime = 0;
                    for (var k = 0; k < plans.length; k++) {
                        if ($scope.order_rule == 2) {
                            addPlanTime += (plans[k].end - plans[k].start) / (1000 * 40 * 60);
                        } else {
                            addPlanTime += (plans[k].end - plans[k].start) / (1000 * 60 * 60);
                        }
                    }
                    if (addPlanTime > $scope.plan_available_num) {
                        warningAlert('批量排课没有足够的课时可排');
                        $scope.show.planLists = {};
                        return;
                    }

                    // 判断是否和设置的不可排课的时间
                    CoursePlanService.checkAddCoursePlanTime(checkCoursePlanAllParams).then(function (result) {
                        var response = result;
                        if (response.status == 'SUCCESS') {
                            var dataFlag = response.data;
                            // 代表有冲突，不可进行排课
                            if (dataFlag) {
                                warningAlert('与教师设置的不可排课的时间冲突');
                                return;
                            } else {
                                // 判断是否要提交排课
                                var count = plans.length;
                                var title = "即将排课" + count + "次(" + addPlanTime.toFixed(2) + "小时),是否确定?"
                                if ($scope.order_rule == 2) {
                                    title = "即将排课" + count + "次(" + addPlanTime + "课时),是否确定?"
                                }

                                SweetAlert.swal({
                                        title: title,
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        closeOnConfirm: true
                                    }, function (confirm) {
                                        if (confirm) {

                                            _setBaseRequestData(coursePlanParams)

                                            _setCourseRequestData(plans);
                                            // 添加排课记录
                                            $scope.requestDate.studentIds = [];
                                            $scope.requestDate.intentionIds = [];
                                            if ($scope.MyCrmCustomerStudentListOk) {
                                                if ($scope.MyCrmCustomerStudentListOk.length > 0) {
                                                    for (var i = 0; i < $scope.MyCrmCustomerStudentListOk.length; i++) {
                                                        if ($scope.MyCrmCustomerStudentListOk[i].state == 1) {
                                                            $scope.requestDate.studentIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                        }
                                                        if ($scope.MyCrmCustomerStudentListOk[i].state == 2) {
                                                            $scope.requestDate.intentionIds.push($scope.MyCrmCustomerStudentListOk[i].crm_student_id)
                                                        }
                                                    }
                                                }
                                            }
                                            $scope.addPlansRecord($scope.requestDate, addPlanTime);
                                        }
                                    }
                                );
                            }
                        } else if (response.status == 'FAILURE') {//抛出冲突
                            SweetAlert.swal(result.data.data);
                            return;
                        }
                    }, function (result) {
                        warningAlert('失败：' + result);
                        return;
                    });
                } else {
                    SweetAlert.swal('本次排课为' + plans.length + '次');
                    return;
                }
            }

            /**
             * 判断本周选择的日期是否合法
             */
            function _ifThisWeek(num) {
                var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
                if (day == 0) {
                    day = 7;
                }
                var cha = num - day;
                if (cha < 0) {
                    SweetAlert.swal('这周已经没有' + $scope.WEEKS[num - 1].name);
                    return false;
                }
                return true;
            }

            /**
             * 判断日期是否是在下周之后
             * @param start  时间戳
             * @returns {boolean}
             */
            function ifNextWeek(start) {
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var oneDay = 1000 * 60 * 60 * 24;

                var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
                if (day == 0) {
                    day = 7;
                }
                var nextWeekStart = today.getTime() + oneDay * (7 - day + 1);
                if (nextWeekStart < start) {
                    return true;
                }
                return false;

            }

            /**
             * 减去num 后是否还有课时
             * @param num
             * @private
             */
            function _ifTime(num) {
                if (($scope.coursePlanFilter.plan_available_num - num) < 0) {
                    warningAlert('您没有课时了');
                    return false;
                } else {
                    return true;
                }
            }

            /**
             * 初始化 封装学员id、或者leadsid或者一对多的id、type 1学员2一对多3试听
             * 将参数存放在 $scope.requestDate 中
             */
            function _setBaseRequestData(coursePlanParams) {
                var obj = {
                    "type": coursePlanParams.type,
                    //"teacherName":coursePlanParams.teacherName,
                    "subjectId": coursePlanParams.subjectID,
                    //"subjectName":coursePlanParams.subjectName,
                    "studentName": coursePlanParams.studentName,
                    "crmCustomerGroupId": coursePlanParams.groupID,
                    "classTime": coursePlanParams.classTime,
                    "crmOrderIds": coursePlanParams.ordcourseID,
                    "crmStudentId": coursePlanParams.studentID,
                    "userId": coursePlanParams.teacherID,
                    "schoolId": coursePlanParams.schoolID,
                    "grade_id": coursePlanParams.grade_id,
                    "coefficients": coursePlanParams.coefficients,
                    "coefficient": $scope.coursePlanFilter.coefficient,
                    "version": coursePlanParams.version
                };

                if (coursePlanParams.type == 1 && $scope.now == 1) {
                    obj.type = 8;//一对一储值排课
                    obj.chargingId = coursePlanParams.order_charging_id;
                    obj.teacherLevelId = coursePlanParams.order_teacher_level;
                    //obj.teacherLevelId = $scope.order_teacher_level;
                    obj.charge = coursePlanParams.order_charge;
                    obj.avaliableAmount = $scope.order_avaliable_amount;

                }

                $scope.TIME_SIZE = [
                    {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                        id: 5,
                        name: '2.5小时'
                    }, {id: 6, name: '3小时'},
                ];
                if ($scope.order_rule) {
                    obj.order_rule = $scope.order_rule;
                    if ($scope.order_rule == 1) {
                        $scope.order_rule_name = '1小时';
                        $scope.order_rule = 1;
                        $scope.show.planLists = [];
                        if (!($scope.detail.type == 15 || $scope.detail.type == 16 || $scope.detail.type == 3)) {
                            $scope.TIME_SIZE = [
                                {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {id: 4, name: '2小时'}, {
                                    id: 5,
                                    name: '2.5小时'
                                }, {id: 6, name: '3小时'},
                            ];
                        } else {
                            $scope.TIME_SIZE = [
                                {id: 1, name: '0.5小时'}, {id: 2, name: '1小时'}, {id: 3, name: '1.5小时'}, {
                                    id: 4,
                                    name: '2小时'
                                }, {
                                    id: 5,
                                    name: '2.5小时'
                                }, {id: 6, name: '3小时'},
                            ];
                        }
                    }
                    if ($scope.order_rule == 2) {
                        $scope.order_rule_name = '40分钟';
                        $scope.order_rule = 2;
                        $scope.show.planLists = [];
                        $scope.TIME_SIZE = [
                            {id: 1, name: '40分钟(1课时)'}, {id: 2, name: '1小时(1.5课时)'}, {
                                id: 3,
                                name: '1小时20分钟(2课时)'
                            }, {id: 4, name: '1小时40分钟(2.5课时)'}, {
                                id: 5,
                                name: '2小时(3课时)'
                            }, {id: 6, name: '2小时20分钟(3.5课时)'}, {id: 7, name: '2小时40分钟(4课时)'}, {
                                id: 8,
                                name: '3小时(4.5课时)'
                            },
                        ];
                    }

                }
                $scope.requestDate = obj;

            }

            /**
             * 设置排课 具体排课
             * @param list 数组
             * @private
             */
            function _setCourseRequestData(list) {
                $scope.requestDate.coursetime = list;
            }

            /**
             * 设置一个排课
             * @param start
             * @param end
             * @private
             */
            function _setOnePlan(start, end, teacherID, subjectID, multipleglag, multipleglaglist) {
                var plan = {
                    start: start,
                    end: end,
                    teacherID: teacherID,
                    teacherId: teacherID,
                    subjectID: subjectID,
                    multipleglag: multipleglag,
                    multipleglaglist: multipleglaglist,
                };
                return plan;
            }

            // 排课规则、批量还是单次
            $scope.selected = {
                isWeekShow: true,
                isDayShow: false
            }

            /**
             * 排课规则  定制、还是单次排课
             */
            function checkedShowCycle(type) {
                if (type == 'week') {
                    $scope.selected.isWeekShow = true;
                    $scope.selected.isDayShow = false;
                    // $scope.select.type = 2
                } else if (type == 'day') {
                    $scope.selected.isWeekShow = false;
                    $scope.selected.isDayShow = true;
                }
            }

            $scope.$watch("recordCoursePlanModal", function (oldVal, newVal) {
                if (oldVal != newVal) {
                    $scope.select.type = null;
                }
            })

            /**
             * 根据星期几、是否是本周、开始时间、时长获取  开始时间、结束时间的long值
             */
            function getEndTimeNew() {
                if ($scope.select.time1) {
                    var time1 = $scope.select.time1 = parseInt($scope.select.time1);
                    if (time1 < 0 || time1 > 23 || time1 % 1 != 0) {
                        SweetAlert.swal({
                            title: "请填在0-23小时之间的整数",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            closeOnConfirm: true
                        })
                        $scope.select.time1 = null;
                        return;
                    }
                    if ($scope.select.time1 < 10) {
                        $scope.select.time1 = '0' + $scope.select.time1;
                    }
                    /*if(!$scope.selectTime.time2 && !$scope.selectTime.isFocus){
                     angular.element('#time2').focus();
                     $scope.selectTime.isFocus = true;
                     return;
                     }*/

                }
                if ($scope.select.time2) {
                    var time2 = $scope.select.time2 = parseInt($scope.select.time2);
                    if (time2 < 0 || time2 > 59 || time2 % 1 != 0) {
                        SweetAlert.swal({
                            title: "请选在0-59分钟之间的整数",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: '确定',
                            closeOnConfirm: true
                        })
                        $scope.select.time2 = null;
                        return;
                    }
                    if ($scope.select.time2 < 10) {
                        $scope.select.time2 = '0' + $scope.select.time2;
                    }
                }
                if ($scope.select.startDate && ($scope.select.time1 || $scope.select.time1 == 0) && $scope.select.timeSize) {
                    if (!$scope.select.time1) {
                        $scope.select.time1 = 0;
                    }
                    if (!$scope.select.time2) {
                        $scope.select.time2 = 0;
                    }
                    $scope.select.time = $scope.select.time1 + ':' + $scope.select.time2;
                    // 得到开始时间的毫秒数
                    var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
                    var startTime = startDate + " " + $scope.select.time + ":00";
                    var date = new Date(startTime);
                    // 将startTime转变为毫秒数
                    var timestampStart = date.getTime();
                    $scope.select.timestampBaseStart = timestampStart;
                    var timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                    if ($scope.order_rule_name == '1小时') {
                        timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 30 * 1000);
                        // 20180606修改追加
                        if ($scope.timeSizeOnly30) {
                            timestampEnd = timestampStart + (($scope.select.timeSize) * 60 * 60 * 1000);
                        }
                    }
                    if ($scope.order_rule_name == '40分钟') {
                        timestampEnd = timestampStart + (($scope.select.timeSize + 1) * 40 * 30 * 1000);
                        // 20180606修改追加
                        if ($scope.timeSizeOnly30) {
                            timestampEnd = timestampStart + (($scope.select.timeSize) * 40 * 60 * 1000);
                        }
                    }

                    $scope.select.timestampBaseEnd = timestampEnd;
                    $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                    // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
                    $scope.startTime = startTime;
                    $scope.endTime = startDate + " " + $scope.select.timeEnd + ":00";
                    $scope.startEndTime = startDate + " " + $scope.select.time + "--" + $scope.select.timeEnd;
                }
            }

            /**
             * 通过周 和时间字符串 得到 时间戳
             * @param week eg:"1"
             * @param time eg:"21:30"
             * @private
             */
            function _getTimestampByWeekAndTime(week, time) {
                var date0 = _timestampByWeek(week);
                var t = _timestampByTime(time);
                return date0 + t;
            }

            /**
             * 获取当前周的各天的时间戳
             */
            function _getTimestampByWeekAndTimeNew(week, time) {
                var date0 = _timestampByWeekNew(week);
                var t = _timestampByTime(time);
                return date0 + t;
            }

            /**
             * 获取具体时间所在周周的各天的时间戳
             */
            function _getTimestampByWeekAndTimeNew2(week, time, date) {
                /*var date0 = _timestampByWeekNew(week);*/
                var date0 = _timestampByWeekNew2(week, date);
                var t = _timestampByTime(time);
                return date0 + t;
            }

            /**
             * 通过星期得到具体日期的零点 时间戳
             * @param week
             * @private
             */
            function _timestampByWeek(week) {
                if (week == 7) {//因为前台设星期天为7
                    week = 0;
                }
                var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
                var cha = week - day;
                if (cha < 0) {//如果 今天是星期四，而要获取星期二的，直接给整个数据加7天
                    cha += 7;
                }

                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var oneday = 1000 * 60 * 60 * 24;
                return today.getTime() + oneday * cha;
            }

            /**
             * 获取当前周的时间
             */
            function _timestampByWeekNew(week) {
                if (week == 7) {//因为前台设星期天为7
                    week = 0;
                }
                var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
                var cha = week - day;
                if (week == 0) {
                    cha += 7
                }
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var oneday = 1000 * 60 * 60 * 24;
                return today.getTime() + oneday * cha;
            }

            /**
             * 获取当前周的时间
             */
            function _timestampByWeekNew2(week, date) {
                if (week == 7) {//因为前台设星期天为7
                    week = 0;
                }
                var day = new Date(date).getDay();//获取当前星期X(0-6,0代表星期天)
                var cha = week - day;
                if (week == 0) {
                    cha += 7
                }
                var today = new Date(date);
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                var oneday = 1000 * 60 * 60 * 24;
                var ret = today.getTime() + oneday * cha;
                /*if(ret<date){
                 ret += oneday*7;
                 }*/
                return ret;
            }

            /**
             * 通过实践得到毫秒数 eg:21:30
             * @param time
             * @returns {number}
             * @private
             */
            function _timestampByTime(time) {
                if (time) {
                    var _arr = time.split(':');
                    var hour = 1000 * 60 * 60 * _arr[0];
                    var minute = 1000 * 60 * _arr[1];
                    return hour + minute;
                }
            }

            /**
             * 根据一对多id获取学员的信息，封装到detail中
             */
            function getCrmStudentByGroupID() {
                if ($scope.detail.type != 2) {
                    return;
                }
                CustomerStudentGroupService.detail($scope.detail).then(function (result) {
                    $scope.groupDetailStudentList = result;
                    if (result.length > 0) {
                        var names = "";
                        for (var i = 0; i < result.length; i++) {
                            names += $scope.groupDetailStudentList[i].name + "、";
                        }
                        $scope.detail.name = names.substring(0, names.length - 1);
                    } else {
                        $scope.detail.name = "";
                    }
                });
            }

            /**
             * 排课成功后继续进行排课 2016-6-28 add by fanl
             */
            function addCoursePlanInfoContinue(row, courseTime) {
                //继续进行排课、清空页面课程名称、科目、教师的选择信息
                //$scope.courseName = "";
                //$scope.coursePlanFilter = {};
                //$scope.select = {};
                //$scope.checkList = undefined;
                //$scope.show.planLists = {};
                //$scope.subjectID = "";

                //清空参数中的教师科目、订单课程的信息
                //coursePlanParams.ordcourseID = "";
                //coursePlanParams.subjectID = "";
                //coursePlanParams.teacherID = "";
                coursePlanParams.coursetime = {};

                // 将type封装到对象中

                var type = $scope.detail.type;
                if (type == 3) {
                    // 获取leads的可排课时信息
                    CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                        if (result.plan_available_num) {
                            $scope.plan_available_num = result.plan_available_num;
                        } else {
                            $scope.plan_available_num = 0;
                        }
                        /*// 获取科目信息
                         CommonService.getSubjectIdSelect().then(function (result) {
                         $scope.omsSubject = result.data;
                         });*/
                    })

                    // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                    //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                    //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                    //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                    //     } else {
                    //         $scope.plan_available_num = 4;
                    //     }
                    //     /*// 获取科目信息
                    //      CommonService.getSubjectIdSelect().then(function (result) {
                    //      $scope.omsSubject = result.data;
                    //      });*/
                    // })
                }
                //TODO:先注释了，有问题在说，解决问题：一对多继续排课不清除选择的科目
                else if (type == 2) {
                    // 一对多排课，要加载一对多的订单课程的信息
                    var start = 0, number = 10;
                    CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start, number, $scope.detail.id).then(function (result) {
                        $scope.CGoupStudentCourseList = result.data.groupStudentList;
                        $scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
                        $scope.schoolName = result.data.schoolName;
                        $scope.stuUnSelectNum = 0;
                        try {
                            coursePlanParams.ordcourseID = ''
                            $scope.coursePlanFilter.plan_available_num = undefined
                            if ($scope.now == 1) {
                                _clearSelect()
                                /*$scope.plan_available_num = $scope.CustomerStudentCourseList[0].plan_available_num;
                                 $scope.courseName = $scope.CustomerStudentCourseList[0].course_type_name;*/
                            }
                        } catch (e) {
                        }
                    });
                } else {
                    // var plan_available_num_new = $scope.plan_available_num - courseTime;
                    // 重新选择订单课程，获取可排课时
                    //showPaikeView()参数为1时是一对一储值，为3时，是一对一课时
                    if ($scope.now == 3) {
                        showPaikeView(3);
                    } else if ($scope.now == 1) {
                        showPaikeView(1);
                        $scope.chuzhipaikeflag = true;
                    }
                    //因为要回到为选课状态，故将可排课时置0
                    if ($scope.plan_available_num == 0 && $scope.plan_available_num != '') {
                        $scope.plan_available_num = 0.00;
                    } else if ($scope.plan_available_num == undefined) {

                    }
                    //$scope.plan_available_num -= courseTime;
                    $scope.detail.all_course_plan_count += courseTime;
                    if ($scope.now == 1) {
                        $scope.order_avaliable_amount = $scope.order_avaliable_amount > ($scope.order_charge * $scope.coursePlanFilter.coefficient * courseTime) ? ($scope.order_avaliable_amount - $scope.order_charge * $scope.coursePlanFilter.coefficient * courseTime) : 0;
                    }
                    /*// 获取科目信息
                     CommonService.getSubjectIdSelect().then(function (result) {
                     $scope.omsSubject = result.data;
                     });*/
                }

            }

            function selectDateTime(user) {
                $scope.dateTimeTitle = "学生/老师时间表";
                $scope.dateTimeFlag = 1;
                $scope.dateTimeModal = angular.copy(user);
                if (arguments.length == 3 && arguments[1] == 1 && arguments[2]) {
                    $scope.st = true
                    $scope.s_id = arguments[2]
                }
                /*一对多排课选择上课时间和上课老师禁止显示操作*/
                if ($scope.detail.type == 2) {
                    $scope.st = true
                }
                $scope.dateTimeModals = $modal({
                    scope: $scope,
                    templateUrl: 'partials/dateTimeModal/teacher.html',
                    show: true,
                    backdrop: "static"
                });
            }

            /**
             * 设置精准排课
             * @param start
             * 开始时间
             * @param end
             * 结束时间
             */
            $scope.setTimeClass = setTimeClass;

            function setTimeClass(index, pasttype, start, end) {
                if (pasttype == 5 || pasttype == 6) {
                    return false
                }
                $scope.dateTimeModals.hide()
                if ($scope.teacherModal) {
                    $scope.teacherModal.hide()
                }
                $scope.checkedShowCycle('day')
                $scope.dateTimeModal.selected = 1
                $scope.btnSelectTeacher($scope.dateTimeModal)
                var timeSize = (end - start) / 1800000,
                    time1 = new Date(start).getHours() < 10 ? ('0' + new Date(start).getHours()) : new Date(start).getHours(),
                    time2 = new Date(start).getMinutes() < 10 ? ('0' + new Date(start).getMinutes()) : new Date(start).getMinutes()
                $scope.select = {
                    startDate: new Date(start),
                    time1: time1,
                    time2: time2
                }
                if (timeSize <= 4) {
                    $scope.select.timeSize = ''//timeSize
                }
                // $scope.getEndTimeNew() 下课时间
                //
                //requestDate.timeLists
            }

            /**
             * 设置老师查询时间段,即设置查询时间
             */
            $scope.setingSelectTeacher = setingSelectTeacher

            function setingSelectTeacher() {
                $scope.timeSearchFlag = !$scope.timeSearchFlag
                $scope.mtPK = arguments.length == 1 ? 1 : 0
                if ($scope.timeSearchFlag) {
                    $scope.setingSelectTitle = "设置查询时间";
                    $scope.setingSelectModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/dateTimeModal/setingSelect.html',
                        show: true,
                        backdrop: "static"
                    });
                } else {
                    //  TODO:清空查询条件并刷新教师列表
                    if ($scope.mtPK) {
                        $scope.resetFilterTime()
                        $scope.selectSubject()
                    } else {
                        $scope.resetFilterTime()
                        $scope.getTeachersListByFilter()
                    }

                }
            }

            $scope.$watch('select.time2', function (newValue, oldValue) {
                newValue = parseInt(newValue, 10)
                if (newValue >= 0 && newValue < 10 && newValue != oldValue) {
                    $scope.select.time2 = '0' + newValue
                }
            })
            $scope.$watch('selectTime.time2', function (newValue, oldValue) {
                newValue = parseInt(newValue, 10)
                if (newValue >= 0 && newValue < 10 && newValue != oldValue) {
                    $scope.selectTime.time2 = '0' + newValue
                }
            })

            // 20180721 一对多||一对一储值排课选择订单，最后将selectStuCourseModel的值更新到version中
            var selectStuCourseModel = {}

            // 更新一对多储值排课订单选项（要排的订单）
            function selectStuCourseModelUpdate(index, select) {
                var obj = {
                    select: false,
                    CGoupStudentCourseList: index,
                    stuId: $scope.CGoupStudentCourseList[index].crm_student_id
                }
                if (index === select) {
                    for (var key in selectStuCourseModel) {
                        if (selectStuCourseModel.hasOwnProperty(key)) {
                            selectStuCourseModel[key].select = false
                        }
                    }
                    obj.select = true
                }
                obj.orderIndex = !selectStuCourseModel[index] ? 0 : selectStuCourseModel[index].orderIndex
                selectStuCourseModel[index] = obj
                console.clear()
                console.log(selectStuCourseModel, $scope.CGoupStudentCourseList)
            }

            // 获取当前所操作的学生
            function getNowSelectOrder(params) {
                if (typeof params === 'object') {
                    // 传学生对象
                    for (var key in selectStuCourseModel) {
                        if (selectStuCourseModel.hasOwnProperty(key) && selectStuCourseModel[key].stuId == params.crm_student_id) {
                            console.log(selectStuCourseModel[key].orderIndex, key)
                            return selectStuCourseModel[key].orderIndex
                        }
                    }
                } else if (params >= 0) {
                    for (var key in selectStuCourseModel) {
                        if (selectStuCourseModel.hasOwnProperty(key) && selectStuCourseModel[key].select) {
                            selectStuCourseModel[key].orderIndex = params
                        }
                    }
                } else {
                    for (var key in selectStuCourseModel) {
                        if (selectStuCourseModel.hasOwnProperty(key) && selectStuCourseModel[key].select) {
                            return selectStuCourseModel[key].orderIndex
                        }
                    }
                }

            }

            // function getNowSelectOrderHtml() {
            //
            // }

            $scope.getNowSelectOrder = getNowSelectOrder
            $scope.selectStuCourseModelUpdate = selectStuCourseModelUpdate


            /**
             * 获取学生课程
             * @param stu
             */
            $scope.selectStuCourse = function (stu, index) {
                _stuTypeGId = stu.crm_student_id;
                $scope.stuIndex = index;
                if ($scope.now == 3) {
                    $scope.CustomerStudentCourseList = [];
                    // selectStuCourseModel = [{CGoupStudentCourseList:index,select:true}]
                    $scope.recordModal = $mtModal.modal('partials/sos/customer/modal.orderCourseSelect.html', $scope)
                } else {
                    selectStuCourseModelUpdate(index, index)
                    _getWxClassTimeList(stu, 1)
                    $scope.courseOrderTitle = "选择充值订单";
                    $scope.recordModal = $mtModal.modal('partials/sos/customer/modal.storedOrderList.html', $scope)
                }
            }

            //班级排课初始化排课参数--------s
            function classPK() {
                if ($scope.detail.subject_id) {
                    $scope.subjectID = $scope.detail.subject_id;
                    $scope.coursePlanFilter.subjectId = $scope.detail.subject_id;
                } else if ($scope.coursePlanFilter.subjectId) {
                    $scope.subjectID = $scope.coursePlanFilter.subjectId;
                    $scope.coursePlanFilter.subjectId = $scope.detail.subject_id;
                }
                if (!$scope.coursePlanFilter.teacherName) {
                    $scope.coursePlanFilter.teacherName = $scope.detail.teacher_name;
                }
                if (!$scope.coursePlanFilter.teacherID) {
                    coursePlanParams.teacherID = $scope.detail.teacher_id
                } else {
                    coursePlanParams.teacherID = $scope.coursePlanFilter.teacherID
                }

                $scope.show.planLists = JSON.parse($scope.detail.class_time_json) || [];
                // $scope.selectSubject();
                // if(!$scope.coursePlanFilter.teacherName){
                //     setTimeout(function () {
                //         $scope.selectSubject()
                //     },1000)
                // }

            }

            // 点击每一条搜索出来的信息然后同步联动
            $scope.addthisinput = function () {
                $scope.hasresult = false;
                // 得到学生的id
                var index = ''
                if (arguments.length == 2) {
                    index = arguments[1]
                    for (var i = 0, max = $scope[arguments[0]].length; i < max; i++) {
                        $scope[arguments[0]][i].selectTrue = i == index ? true : false
                    }
                } else {
                    index = $("input[name='studentRadio']:checked").val();
                }
                if (index == undefined) {
                    if ($scope.type == 2) {
                        SweetAlert.swal('请选择要排课的一对多');
                        return;
                    } else {
                        SweetAlert.swal('请选择要排课的学生');
                        return;
                    }
                }
                // 封装order

                $scope.detail.belong_user_name = $scope.gusseresult[index].belong_user_name;
                // $scope.detail.name = $scope.gusseresult[index].name;
                $scope.detail = $scope.gusseresult[index];
                $scope.order_rule = $scope.detail.order_rule;
                /*console.log();
                 $scope.detail.crm_student_id=$scope.gusseresult[index].crm_student_id;
                 $scope.detail.name=$scope.gusseresult[index].name ;
                 $scope.detail.accountBalance=$scope.gusseresult[index].accountBalance;
                 $scope.detail.consumeAccountBalance=0;
                 $scope.detail.belong_user_name=$scope.gusseresult[index].belong_user_name;
                 $scope.detail.school_id=$scope.gusseresult[index].school_id;*/


                $scope.hasresult = false;
                $scope.showCreat = 1;
                // 将type封装到对象中
                $scope.detail.type = $scope.type;

                if ($scope.selectedTeacherId) {
                    $rootScope.coursePlanFilter = {};
                    $rootScope.coursePlanFilter.teacherName = $scope.selectedTeacherName;
                    $rootScope.coursePlanFilter.teacherID = $scope.selectedTeacherId;
                }

                if ($scope.type == 3) {
                    // 获取leads的可排课时信息
                    $scope.order_rule = 1;
                    CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {

                        if (result.plan_available_num) {
                            $scope.plan_available_num = result.plan_available_num;
                            // 获取科目信息
                            CommonService.getSubjectIdSelect().then(function (result) {
                                $scope.omsSubject = result.data;

                            });
                        } else {
                            $scope.plan_available_num = 0;
                            $scope.alreadyPkList = result.list;
                            $scope.alreadyPkList.forEach(function (i, index) {
                                $scope.alreadyPkList[index].startDate = new Date(i.start_time).Format("yyyy/MM/dd hh/mm/ss");
                                $scope.alreadyPkList[index].endtDate = new Date(i.end_time).Format("yyyy/MM/dd hh/mm/ss");
                            })
                            $scope.alreadyPkListTitle = "试听课时已用完";
                            $scope.alreadyPkListModal = $modal({
                                scope: $scope,
                                templateUrl: 'partials/sos/customer/modal.alreadyPkList.html',
                                show: true,
                                backdrop: "static"
                            });
                        }
                    })

                    // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                    //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                    //     console.log(result.leadsCourseTime.list);
                    //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                    //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                    //     } else {
                    //         $scope.plan_available_num = 4;
                    //     }
                    //     // 获取科目信息
                    //     CommonService.getSubjectIdSelect().then(function (result) {
                    //         $scope.omsSubject = result.data;

                    //     });
                    // })

                } else if ($scope.type == 2) {
                    // 一对多排课，要加载一对多的订单课程的信息
                    var start = 0, number = 10;
                    CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start, number, $scope.detail.id).then(function (result) {
                        $scope.CGoupStudentCourseList = result.data.groupStudentList;
                        $scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
                        $scope.schoolName = result.data.schoolName;
                        /*$scope.plan_available_num = $scope.CustomerStudentCourseList[0].plan_available_num;
                         $scope.courseName = $scope.CustomerStudentCourseList[0].course_type_name;*/
                        CommonService.getSubjectIdSelect().then(function (result) {
                            $scope.omsSubject = result.data;
                            // $scope.recordCoursePlanModal = $modal({
                            //     scope: $scope,
                            //     templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                            //     show: true,
                            //     backdrop: "static"
                            // });
                        });
                    });
                } else if ($scope.type == 4) {
                    // 班级排课

                    $scope.coursePlanModalTitle = "班级排课";
                    //使用适配器模式将ngClick类似的命名规则转为ng_click

                    $scope.detail = angular.copy(getObject($scope.resultList[index]));
                    // 将type封装到对象中
                    $scope.detail.type = 7;

                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;
                        $scope.recordCoursePlanModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                            show: true,
                            backdrop: "static"
                        });
                    });
                } else {
                    if ($scope.recording) {
                        $scope.coursePlanModalTitle = '记录上课'
                    }
                    $scope.plan_available_num = ''
                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;
                    });
                }
                // console.log(curdata);
                // $scope.detail.name=curdata.name;
                // // 封装order
                // $scope.hasresult=false;
                // $scope.showCreat=1;
                // $scope.detail.crm_student_id=curdata.crm_student_id;
                // $scope.detail.name=curdata.name ;
                // $scope.detail.accountBalance=curdata.accountBalance;
                // $scope.detail.consumeAccountBalance=0;

                // $scope.detail.belong_user_name=curdata.belong_user_name;
                // $scope.detail.school_id=curdata.school_id;

                _init()
            }

            function camelCaseToDash(str) {
                // $1即为正则中第一个捕获，同上述的“\1”
                return str.replace(/([A-Z])/g, "_$1").toLowerCase();
            }


            function getObject(row) {
                var newRow = {}
                for (var key in row) {
                    if (row.hasOwnProperty(key)) {
                        newRow[camelCaseToDash(key)] = row[key]
                    }
                }
                return newRow
            }

            $scope.singlemultipleflag = true;
            $scope.forwardPlanPage = function () {
                $scope.onlyread = true;
                $scope.hasresult = false;
                // 得到学生的id
                var index = ''
                if (arguments.length == 2) {
                    index = arguments[1]
                    for (var i = 0, max = $scope[arguments[0]].length; i < max; i++) {
                        $scope[arguments[0]][i].selectTrue = i == index ? true : false
                    }
                } else {
                    index = $("input[name='studentRadio']:checked").val();
                }
                if (index == undefined) {
                    if ($scope.type == 2) {
                        SweetAlert.swal('请选择要排课的一对多');
                        return;
                    } else {
                        SweetAlert.swal('请选择要排课的学生');
                        return;
                    }
                }
                if ($scope.resultList[index].courseSubjectType == 3) {
                    $scope.singlemultipleflag = false;
                    $scope.multiplelistdetail = JSON.parse($scope.resultList[index].classTimeJson)
                    $scope.studentClass = $scope.resultList[index];

                    console.log($scope.multiplelistdetail)
                } else {
                    $scope.singlemultipleflag = true;
                }


                // $scope.detail = angular.copy($scope.resultList[index]);
                // $scope.order_rule=$scope.detail.order_rule;

                $scope.detail = $scope.resultList[index];
                console.log($scope.detail);
                $scope.order_rule = $scope.detail.order_rule;

                // 封装order
                $scope.hasresult = false;
                $scope.showCreat = 1;

                // 将type封装到对象中
                $scope.detail.type = $scope.type;

                if ($scope.selectedTeacherId) {
                    $rootScope.coursePlanFilter = {};
                    $rootScope.coursePlanFilter.teacherName = $scope.selectedTeacherName;
                    $rootScope.coursePlanFilter.teacherID = $scope.selectedTeacherId;
                }


                if ($scope.type == 3) {
                    // 获取leads的可排课时信息
                    $scope.order_rule = 1;
                    // CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                    //     $scope.CLeadsCourseTimeList = result.leadsCourseTime.list;
                    //     if ($scope.CLeadsCourseTimeList[0] != undefined) {
                    //         $scope.plan_available_num = $scope.CLeadsCourseTimeList[0].plan_available_num;
                    //     } else {
                    //         $scope.plan_available_num = 4;
                    //     }
                    //     // 获取科目信息
                    //     CommonService.getSubjectIdSelect().then(function (result) {
                    //         $scope.omsSubject = result.data;
                    //         $scope.recordCoursePlanModal = $modal({
                    //             scope: $scope,
                    //             templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                    //             show: true,
                    //             backdrop: "static"
                    //         });
                    //     });
                    // })


                    CustomerStudentCourseService.getLeadsCoursePlan($scope.detail.phone).then(function (result) {
                        if (result.plan_available_num) {
                            $scope.plan_available_num = result.plan_available_num;
                            // 获取科目信息
                            CommonService.getSubjectIdSelect().then(function (result) {
                                $scope.omsSubject = result.data;
                                $scope.recordCoursePlanModal = $modal({
                                    scope: $scope,
                                    templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                                    show: true,
                                    backdrop: "static"
                                });
                            });
                        } else {
                            $scope.plan_available_num = 0;
                            $scope.alreadyPkList = result.list;
                            $scope.alreadyPkList.forEach(function (i, index) {
                                $scope.alreadyPkList[index].startDate = new Date(i.start_time).Format("yyyy/MM/dd hh/mm/ss");
                                $scope.alreadyPkList[index].endtDate = new Date(i.end_time).Format("yyyy/MM/dd hh/mm/ss");
                            })
                            $scope.alreadyPkListTitle = "试听课时已用完";
                            $scope.alreadyPkListModal = $modal({
                                scope: $scope,
                                templateUrl: 'partials/sos/customer/modal.alreadyPkList.html',
                                show: true,
                                backdrop: "static"
                            });
                        }


                    })
                } else if ($scope.type == 2) {
                    // 一对多排课，要加载一对多的订单课程的信息
                    var start = 0, number = 10;
                    CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start, number, $scope.detail.id).then(function (result) {
                        $scope.CGoupStudentCourseList = result.data.groupStudentList;
                        $scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
                        $scope.schoolName = result.data.schoolName;
                        /*$scope.plan_available_num = $scope.CustomerStudentCourseList[0].plan_available_num;
                         $scope.courseName = $scope.CustomerStudentCourseList[0].course_type_name;*/
                        CommonService.getSubjectIdSelect().then(function (result) {
                            $scope.omsSubject = result.data;
                            // $scope.recordCoursePlanModal = $modal({
                            //     scope: $scope,
                            //     templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                            //     show: true,
                            //     backdrop: "static"
                            // });
                        });
                    });
                } else if ($scope.type == 4) {
                    // 班级排课
                    $scope.coursePlanModalTitle = "班级排课";
                    //使用适配器模式将ngClick类似的命名规则转为ng_click

                    $scope.detail = angular.copy(getObject($scope.resultList[index]));
                    console.log($scope.detail)
                    // 将type封装到对象中
                    $scope.detail.type = 7;

                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;

                        $scope.selectSubject();
                        // setTimeout(function () {
                        //     console.log($("#subjectId option"));
                        //
                        //     $("#subjectId option").each(function () {
                        //         if( $(this).attr("value") == "number:"+$scope.resultList[index].subjectId ){
                        //             $(this).attr("selected",true);
                        //             $scope.selectSubject();
                        //         }else{
                        //             $(this).attr("selected",false);
                        //  }
                        //     })
                        //
                        // },500)
                        // if($scope.recordCoursePlanModal){
                        //     $scope.recordCoursePlanModal.hide();
                        // }
                        // $scope.recordCoursePlanModal = $modal({
                        //     scope: $scope,
                        //     templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                        //     show: true,
                        //     backdrop: "static"
                        // });

                    });
                } else {
                    if ($scope.recording) {
                        $scope.coursePlanModalTitle = '记录上课'
                    }
                    $scope.plan_available_num = ''
                    // 获取科目信息
                    CommonService.getSubjectIdSelect().then(function (result) {
                        $scope.omsSubject = result.data;
                        $scope.recordCoursePlanModal = $modal({
                            scope: $scope,
                            templateUrl: 'partials/sos/customer/modal.coursePlanInfo.html',
                            show: true,
                            backdrop: "static"
                        });
                    });
                }
                _init()
            }

            //班级排课初始化排课参数--------n

            function _init() {
                if ($scope.detail.type == 7) {
                    coursePlanParams.type = $scope.detail.type;
                    classPK()
                }
                if ($scope.detail.hasData) {
                    return false
                }
                $scope.select = {};
                $scope.select.type = 2;
                $scope.show.isWeekNumber = true;
                $scope.now = 3;
                $scope.detailForUp = {};
                //  一对多排课,一对多排课不需要获取学员信息@李世明 2016-11-24&&$scope.detail.type!=7&&$scope.detail.type!=9
                if ($scope.detail.type != 2 && $scope.detail.type != 7 && $scope.detail.type != 9) {

                    if ($scope.detail.crm_student_id) {
                        CustomerStudentService.detail($scope.detail).then(function (result) {
                            //console.dir(result);
                            $scope.detailForUp = result;
                            $scope.grade_id = $scope.detailForUp.grade_id;//备份年级，用于取消
                        });
                    }

                }

                // 每次进来初始化为空
                coursePlanParams = {};
                // 初始化设置 学生id、姓名、排课类型、学校、一对多id
                coursePlanParams.studentID = $scope.detail.crm_student_id;
                coursePlanParams.type = $scope.detail.type;
                coursePlanParams.schoolID = $scope.detail.school_id;
                coursePlanParams.studentName = $scope.detail.name;
                coursePlanParams.groupID = $scope.detail.id;
                if ($scope.coursePlanFilter.teacherID || $scope.coursePlanFilter.teacherID == 0) {
                    coursePlanParams.teacherID = $scope.coursePlanFilter.teacherID;
                }
                if ($scope.coursePlanFilter.subjectId) {
                    coursePlanParams.subjectID = $scope.coursePlanFilter.subjectId;
                }

                if ($scope.detail.grade_id == undefined) {
                    coursePlanParams.grade_id = "";
                } else {
                    coursePlanParams.grade_id = $scope.detail.grade_id;
                }

                // 初始化时将值设置为空
                if ($scope.detail.type == 2) {
                    coursePlanParams.coefficients = [];
                    $scope.group_type = $scope.detail.group_type;
                    var list = $scope.CGoupStudentCourseList;
                    if (list != undefined) {
                        var temp = "";
                        for (var i = 0; i < list.length; i++) {
                            temp += list[i].ordcourse_id + ",";
                        }
                        var ordcourseID = temp.substring(0, temp.length - 1);
                        coursePlanParams.ordcourseID = ordcourseID;
                    } else {
                        coursePlanParams.ordcourseID = "";
                    }
                } else {
                    coursePlanParams.ordcourseID = "";
                }
                // 试听排课，默认为精准日期时间排课
                if ($scope.detail.type == 3) {
                    $scope.selected.isWeekShow = false;
                    $scope.selected.isDayShow = true;
                }
                // 获取一对多下的学员的信息
                // getCrmStudentByGroupID();老王说注释，不要了
                _setBaseRequestData(coursePlanParams);//初始化 基本与后台ajax请求参数

                //如果是从教师时间表进来的排课，那么需要设置默认教师
                if ($rootScope.coursePlanFilter && $rootScope.coursePlanFilter.teacherName && $rootScope.coursePlanFilter.teacherID) {
                    $scope.coursePlanFilter.teacherName = $rootScope.coursePlanFilter.teacherName;
                    $scope.coursePlanFilter.teacherID = $rootScope.coursePlanFilter.teacherID;
                    // 封装总的参数中的教师id
                    coursePlanParams.teacherID = $rootScope.coursePlanFilter.teacherID;
                }

                //通过学生时间表排课，进入排课页面后，默认精准时间排课，并且设置日期
                if ($scope.date) {
                    $scope.select.startDate = new Date($scope.date);
                    $scope.selected.isWeekShow = false;
                    $scope.selected.isDayShow = true;
                }

                if ($scope.detail.type == 7) {
                    classPK()
                }
                // 加判断  去掉输入框的下边框红线
                if ($scope.detail.name) {
                    $scope.showCreat = 1;
                } else {
                    $scope.showCreat = 0;
                }
            }

            //透明遮罩 判断当前是否已经有学生
            function remindChoseStudent() {
                if (!$scope.detail.name) {
                    SweetAlert.swal('请先选择学生！');
                }
            }

            /**
             * 初始化方法-排课总参数
             */
            (function init($scope) {
                // 默认显示批量排课

                _init();

            })($scope);

            function getClasslist(tableState) {
                $scope.hasresult = true;
                tableState = tableState || {};
                tableState.pagination = tableState.pagination || {};
                $scope.gTableState = tableState;
                $scope.isLoading = true;
                $scope.pagination = tableState.pagination;
                // $scope.start = $scope.pagination.start || 0;
                // $scope.number = $scope.pagination.number || 0;
                $scope.filter.start = 0;
                $scope.filter.size = 1000;
                $scope.filter.schoolId = AuthenticationService.currentUser().school_id;

                var promise = ClassManagementService.getClassesByFilter($scope.filter);
                promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            $scope.resultList = response.data.list;
                            for (var i = 0; i < $scope.resultList.length; i++) {
                                if (!$scope.resultList[i].planCount) {
                                    $scope.resultList[i].planCount = 0;
                                }
                                if ($scope.resultList[i].classTimeJson) {
                                    var classTimeList = [];
                                    var list = eval($scope.resultList[i].classTimeJson);
                                    for (var j = 0; list != null && j < list.length; j++) {
                                        if (classTimeList.length == 0) {
                                            classTimeList.push(list[j]);
                                        }
                                        else {
                                            for (var k = 0; k < classTimeList.length; k++) {
                                                if (classTimeList[k].startTime == list[j].startTime && classTimeList[k].endTime == list[j].endTime) {
                                                    //拼上星期几的描述
                                                    classTimeList[k].startDate = classTimeList[k].startDate + list[j].startDate.substr(2, 1);
                                                    break;
                                                }
                                                else if (k == classTimeList.length - 1) {
                                                    //遍历到最后一个还不相等，那么就加入
                                                    classTimeList.push(list[j]);
                                                    break;
                                                }
                                            }

                                        }
                                    }
                                    for (var j = 0; j < classTimeList.length; j++) {
                                        classTimeList[j].startDate = "周" + classTimeList[j].startDate.substr(2);
                                    }
                                    $scope.resultList[i].classTimeList = classTimeList;
                                }
                            }
                            tableState.pagination.numberOfPages = response.data.pages;
                        }
                        $scope.isLoading = false;
                        // setTimeout(function () {
                        //  ColEdit.initCol($scope)
                        //  angular.element('body').scroll()
                        // })
                    },
                    function (error) {
                    });
            }

            //    zhj 班类多科的排课

            //多科目排课的函数
            $scope.multiplePk = function () {
                //获取到所有教师的id和名字
                var multiplelist = $scope.show.planLists

                $scope.multipleTeacherList = []
                angular.forEach(multiplelist, function (row, index) {
                    angular.forEach(row.detail, function (rown, indexn) {
                        var teacherId = rown.teacherId;
                        $scope.multipleTeacherList.push(teacherId)
                    })
                });
                var flag = judgeAddPlansmultiple();
                if (!flag) {
                    return;
                }
                // 批量排课开始日期、结束日期、次数
                var pStart = $scope.select.pTimeStart;
                var pEnd = $scope.select.pTimeEnd;
                var length = $scope.select.weekNumber || 1000;
                // 请选择日期
                if (pStart == undefined) {
                    warningAlert('请选择批量排课开始日期');
                    return;
                }
                if (pEnd == undefined) {
                    warningAlert('请选择批量排课结束日期');
                    return;
                }

                // 批量排课开始日期long值、结束日期long值
                var pStartTimestamp = new Date(pStart).getTime();
                var pEndTimestamp = new Date(pEnd).getTime();

                var plans = [];
                var start, end;
                var _start, _end, _planNumber = 1;
                var lengthCheck = $scope.multiplelistdetail.length;

                var weekLength = Math.ceil(length / lengthCheck);
                for (var i = 0; i < weekLength; i++) {
                    for (var j = 0; j < $scope.multiplelistdetail.length; j++) {
                        if ((length - 1) < 0) {
                            break;
                        }

                        for (var m = 0; m < $scope.multiplelistdetail[j].detail.length; m++) {

                            pStartTimestamp = new Date(pStart).getTime();
                            pEndTimestamp = new Date(pEnd).getTime();
                            var dayOfWeek = $scope.multiplelistdetail[j].detail[m].day;         // 星期几day
                            var startTime = $scope.multiplelistdetail[j].detail[m].startTime; // 开始时间
                            var endTime = $scope.multiplelistdetail[j].detail[m].endTime;   // 结束时间
                            var teacherID = $scope.multiplelistdetail[j].detail[m].teacherId;
                            var subjectID = $scope.multiplelistdetail[j].detail[m].subjectId
                            var multipleglag = i
                            var multipleglaglist = j;
                            if (!et(endTime, startTime, $scope.multiplelistdetail[j].detail[m])) {
                                return false
                            }
                            // 获取开始时间、结束时间的long值
                            start = _getTimestampByWeekAndTimeNew2(dayOfWeek, startTime, pStartTimestamp);
                            end = _getTimestampByWeekAndTimeNew2(dayOfWeek, endTime, pStartTimestamp);
                            _start = start + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                            _end = end + $scope.config.ONE_DAY_TIMESTAMP * 7 * i;
                            if ((_end <= pEndTimestamp + $scope.config.TIME_OFFSET + $scope.config.ONE_DAY_TIMESTAMP)) {
                                if (!_ifTime(_planNumber * 0.5 * $scope.select.timeSize)) {
                                    plans = [];
                                    return false;
                                }
                                pStartTimestamp = pStartTimestamp + $scope.config.TIME_OFFSET;//修正时区
                                /* if(pStartTimestamp<=_start && _start>new Date().getTime()){*/
                                if (pStartTimestamp <= _start) {
                                    plans.push(_setOnePlan(_start, _end, teacherID, subjectID, multipleglag, multipleglaglist));
                                    _planNumber += 1;
                                    length -= 1;
                                } else {
                                    weekLength += 1;
                                }

                            } else {
                                continue;
                            }


                        }


                    }
                }
                // 若plans有排课时间，则添加排课记录

                console.log(plans)
                if (plans.length > 0) {
                    checkCoursePlanAllParams = {
                        "coursePlanTimeList": plans,
                        coursetype: 3,
                    }
                    // 继续判断课时是否超过了可排课课时
                    var addPlanTime = 0;
                    for (var k = 0; k < plans.length; k++) {
                        if ($scope.order_rule == 2) {
                            addPlanTime += (plans[k].end - plans[k].start) / (1000 * 40 * 60);
                        } else {
                            addPlanTime += (plans[k].end - plans[k].start) / (1000 * 60 * 60);
                        }
                    }
                    // 判断是否和设置的不可排课的时间

                    console.log(checkCoursePlanAllParams)
                    CoursePlanService.checkAddCoursePlanTime(checkCoursePlanAllParams).then(function (result) {
                        var response = result;
                        if (response.status == 'SUCCESS') {
                            var dataFlag = response.data;

                            // 代表有冲突，不可进行排课
                            if (dataFlag) {
                                warningAlert('与教师设置的不可排课的时间冲突');
                                return;
                            } else {
                                // 判断是否要提交排课
                                var count = plans.length;
                                var title = "即将排课" + count + "次(" + addPlanTime.toFixed(2) + "小时),是否确定?"
                                if ($scope.order_rule == 2) {
                                    title = "即将排课" + count + "次(" + addPlanTime + "课时),是否确定?"
                                }

                                SweetAlert.swal({
                                        title: title,
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        closeOnConfirm: true
                                    }, function (confirm) {
                                        if (confirm) {
                                            coursePlanParams.type = 12;
                                            _setBaseRequestData(coursePlanParams)
                                            _setCourseRequestData(plans);
                                            // 添加排课记录
                                            $scope.requestDate.type == 12
                                            $scope.addPlansRecord($scope.requestDate, addPlanTime);
                                        }
                                    }
                                );
                            }
                        } else if (response.status == 'FAILURE') {//抛出冲突
                            SweetAlert.swal(result.data.data);
                            return;
                        }
                    }, function (result) {
                        warningAlert('失败：' + result);
                        return;
                    });
                } else {
                    SweetAlert.swal('本次排课为' + plans.length + '次');
                    return;
                }


            }

            //定义时长，比之前多了一个40分钟，id用于计算课时，不可随意定义
            $scope.TIME_SIZE1 = [
                {id: "1", name: '0.5小时'}, {id: "7", name: '40分钟'}, {id: "2", name: '1小时'}, {id: "3", name: '1.5小时'}, {
                    id: "4",
                    name: '2小时'
                }, {id: "5", name: '2.5小时'}, {id: "6", name: '3小时'}
            ];
            //查看上课时间
            $scope.courseSee = function (row) {
                console.log(row)
                row.detail.forEach(function (j, jIndex, jArray) {
                    $scope.TIME_SIZE1.forEach(function (i, index, array) {
                        if (i.id == j.timelong) {
                            row.detail[jIndex].timelongName = i.name;
                        }
                    })
                })

                $scope.modalhCallNameCourseTitle = '查看';
                $scope.multipleCourse = row;
                $scope.modalhCallNameCourseModel = $modal({
                    scope: $scope,
                    // templateUrl: 'partials/sos/coursePlan/model.coursesee.html?'+new Date().getTime(),
                    templateUrl: 'partials/sos/coursePlan/model.multiplecoursesee.html?' + new Date().getTime(),
                    show: true,
                    backdrop: "static"
                });

            };

            //多科的排课删除
            $scope.multipledeletePlans = function (list, type) {//0 表示删除一个  1全部删除
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {

                            $scope.multiplelistdetail.splice(type, 1);

                        }
                    }
                );
            }


            $scope.showAddMultipleCoursePlan = function () {
                //添加上课计划的入口

                $scope.coursePlanEntrance = "addClass";
                $scope.addMultipleCourseTitle = "添加上课时间";
                $scope.addMultipleCoursePlanTimeModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/class/modal.addClassMultipleSubjectCoursePlanTime.html',
                    show: true,
                    backdrop: "static"
                });
            }

            $scope.getMultipleCourseTeachers = function getMultipleCourseTeachers(subjectId, listIndex) {

                // var subjectInfoArray = subjectInfo.split(":");
                // var subjectId = subjectInfoArray[0];
                $scope.subjectId = subjectId;
                // $scope.subjectName = $scope.omsSubject[subjectInfoArray[1]].name;
                $scope.omsSubject.forEach(function (i) {
                    if ($scope.subjectId == i.id) {
                        $scope.subjectName = i.name;
                    }
                })
                // $scope.addMultipleCourseIndex = subjectInfoArray[1];

                if (listIndex || listIndex == 0) {
                    // $scope.LessonTimeList[listIndex].multipleCourseSelectTime.subjectId = subjectInfo;
                    $scope.LessonTimeList[listIndex].subjectId = $scope.subjectId;
                    $scope.LessonTimeList[listIndex].subjectName = $scope.subjectName;
                }

                var tableState = {
                    pagination: {},
                    search: {},
                    sort: {}
                }
                var schoolId = sessionStorage.getItem("com.youwin.yws.school_id");
                tableState.search.schoolId = schoolId;
                tableState.search.subjectId = subjectId;
                tableState.pagination.number = 0;
                tableState.pagination.start = 0;
                $scope.isrendLoading = true;

                if (listIndex == void 0) {
                    CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(0, 0, tableState, {}).then(function (result) {
                        $scope.multipleCourseTeachersList = result.data.studentTeachers.list;
                        $scope.isLoading = false;
                    });
                } else {
                    CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(0, 0, tableState, {}).then(function (result) {
                        // $scope.classMultipleSubjectCourseTeacherFilter = null;
                        $scope.LessonTimeList[listIndex].teacher = result.data.studentTeachers.list;
                        // if($scope.LessonTimeList[listIndex].multipleCourseSelectTime){
                        $scope.LessonTimeList[listIndex].multipleCourseSelectTime.teacherIndex = null;
                        // }
                        $scope.isLoading = false;
                    });
                }
            }

            $scope.week = [
                {theDayOfWeekId: 1, startDate: "星期一", count: 0},
                {theDayOfWeekId: 2, startDate: "星期二", count: 0},
                {theDayOfWeekId: 3, startDate: "星期三", count: 0},
                {theDayOfWeekId: 4, startDate: "星期四", count: 0},
                {theDayOfWeekId: 5, startDate: "星期五", count: 0},
                {theDayOfWeekId: 6, startDate: "星期六", count: 0},
                {theDayOfWeekId: 7, startDate: "星期日", count: 0}
            ]


            $scope.chooseTheDayOfWeek = function (index, startDate) {
                $scope.activeDay = index;
                $scope.startDate = startDate;
                $scope.classMultipleInfo = {};
                $scope.multipleCourseSelectTime = {};
                $scope.multipleCourseTeachersList = [];
            }

            $scope.checkWeek = function () {
                if (!$scope.activeDay && $scope.activeDay != 0) {
                    warningAlert("请先选择日期")
                    return;
                }
            }
            $scope.getMultipleCourseEndTime = function (listIndex) {
                var dayOfWeek = $scope.activeDay;
                if (!dayOfWeek && dayOfWeek != 0) {
                    warningAlert("请先选择日期")
                    return;
                }
                if (listIndex == void 0) {
                    var changeWhichOne = $scope.multipleCourseSelectTime;
                } else {
                    var changeWhichOne = $scope.LessonTimeList[listIndex].multipleCourseSelectTime;

                    // var oldTimeLong = parseInt($scope.LessonTimeList[listIndex].timelong);

                }

                changeWhichOne.startDate = $scope.startDate;

                if (changeWhichOne.time1) {
                    var time1 = changeWhichOne.time1 = parseInt(changeWhichOne.time1);
                    if (time1 < 0 || time1 > 23 || time1 % 1 != 0) {
                        warningAlert("请填在0-23小时之间的整数")
                        changeWhichOne.time1 = null;
                        return;
                    }
                    if (changeWhichOne.time1 < 10) {
                        changeWhichOne.time1 = '0' + changeWhichOne.time1;
                    }
                }
                if (changeWhichOne.time2) {
                    var time2 = changeWhichOne.time2 = parseInt(changeWhichOne.time2);
                    if (time2 < 0 || time2 > 59 || time2 % 1 != 0) {
                        warningAlert("请选在0-59分钟之间的整数")
                        changeWhichOne.time2 = null;
                        return;
                    }
                    if (changeWhichOne.time2 < 10) {
                        changeWhichOne.time2 = '0' + changeWhichOne.time2;
                    }
                }
                if ((dayOfWeek + 1) && (changeWhichOne.time1 || changeWhichOne.time1 == 0) && changeWhichOne.timeSize || listIndex != void 0) {
                    if (!changeWhichOne.time1) {
                        changeWhichOne.time1 = 0;
                    }
                    if (!changeWhichOne.time2) {
                        changeWhichOne.time2 = "00";
                    }
                    changeWhichOne.time = changeWhichOne.time1 + ':' + changeWhichOne.time2;

                    var timestampStart = _getTimestampByWeekAndTimeNew(dayOfWeek + 1, changeWhichOne.time);
                    changeWhichOne.timestampBaseStart = timestampStart;
                    if (changeWhichOne.timeSize == 7) {
                        var timestampEnd = timestampStart + ((4 / 3) * 60 * 30 * 1000);
                    } else {
                        var timestampEnd = timestampStart + ((changeWhichOne.timeSize) * 60 * 30 * 1000);
                    }

                    changeWhichOne.timestampBaseEnd = timestampEnd;
                    changeWhichOne.timeEnd = new Date(timestampEnd).Format("hh:mm");

                    var checkStatus = et(changeWhichOne.timeEnd, changeWhichOne.time, changeWhichOne);

                    // if(changeWhichOne == $scope.multipleCourseSelectTime){
                    //     if(checkStatus){
                    //         $scope.addIsLegitimate = true;
                    //     }else{
                    //         $scope.addIsLegitimate = false;
                    //     }
                    // }
                    if (changeWhichOne == $scope.multipleCourseSelectTime) {
                        if (et(changeWhichOne.timeEnd, changeWhichOne.time, changeWhichOne)) {
                            $scope.addIsLegitimate = true;
                        } else {
                            $scope.addIsLegitimate = false;
                        }
                    } else {

                        if (!et(changeWhichOne.timeEnd, changeWhichOne.time, changeWhichOne)) {
                            var oldTimeLong = parseInt($scope.LessonTimeList[listIndex].timelong);

                            changeWhichOne.timeSize = oldTimeLong.toString();
                            changeWhichOne.time1 = $scope.LessonTimeList[listIndex].startTime.split(":")[0];
                            changeWhichOne.time2 = $scope.LessonTimeList[listIndex].startTime.split(":")[1];
                            changeWhichOne.timeEnd = $scope.LessonTimeList[listIndex].endTime;
                            return;
                        }
                    }
                }
            }
            $scope.LessonTimeListNew = [];
            $scope.LessonTimeList = []
            $scope.LessonTimeListNewNewNew = [];
            $scope.addLessonTime = function () {
                if (!$scope.activeDay && $scope.activeDay != 0) {
                    warningAlert("请选择日期");
                    return;
                } else if (!$scope.classMultipleInfo.subjectId) {
                    warningAlert("请选择科目");
                    return;
                } else if (!$scope.classMultipleInfo.teacherId) {
                    warningAlert("请选择上课老师");
                    return;
                } else if (!$scope.multipleCourseSelectTime.time1) {
                    warningAlert("请选择上课时间");
                    return;
                } else if (!$scope.multipleCourseSelectTime.time2) {
                    warningAlert("请选择上课时间");
                    return;
                } else if (!$scope.multipleCourseSelectTime.timeSize) {
                    warningAlert("请选择上课时长");
                    return;
                }

                // $scope.LessonTimeListNewNewNew.forEach(function(i,index,array){
                //     i.detail.forEach(function(j,jindex,jarray){
                //         if($scope.classMultipleInfo.sucjectId == j.subjectId && $scope.classMultipleInfo.teacherId == j.teacherId){
                //
                //         }
                //     })
                // })


                var lessonTimeInfo = {};
                lessonTimeInfo.multipleCourseSelectTime = {
                    subjectId: $scope.classMultipleInfo.subjectId,
                    teacherId: $scope.classMultipleInfo.teacherId,
                    time1: $scope.multipleCourseSelectTime.time1,
                    time2: $scope.multipleCourseSelectTime.time2,
                    timeSize: $scope.multipleCourseSelectTime.timeSize,
                    timeEnd: $scope.multipleCourseSelectTime.timeEnd
                }
                // lessonTimeInfo.weekInfo = weeks;
                lessonTimeInfo.subjectId = $scope.subjectId;
                lessonTimeInfo.subjectName = $scope.subjectName;
                // lessonTimeInfo.teacherId = $scope.multipleCourseTeachersList[$scope.classMultipleInfo.teacherIndex].userId;
                lessonTimeInfo.teacherId = $scope.classMultipleInfo.teacherId;
                lessonTimeInfo.startDate = $scope.startDate;
                lessonTimeInfo.startTime = $scope.multipleCourseSelectTime.time1 + ":" + $scope.multipleCourseSelectTime.time2;
                lessonTimeInfo.timelong = $scope.multipleCourseSelectTime.timeSize;
                $scope.TIME_SIZE1.forEach(function (i, index, array) {
                    if (i.id == $scope.multipleCourseSelectTime.timeSize) {
                        lessonTimeInfo.timelongName = i.name;
                    }
                })
                // lessonTimeInfo.timelongName = $scope.TIME_SIZE1[$scope.multipleCourseSelectTime.timeSize].name;
                lessonTimeInfo.day = $scope.activeDay + 1;
                lessonTimeInfo.endTime = $scope.multipleCourseSelectTime.timeEnd;
                lessonTimeInfo.teacher = $scope.multipleCourseTeachersList;
                lessonTimeInfo.subject = $scope.omsSubject;
                $scope.multipleCourseTeachersList.forEach(function (i, index, array) {
                    if (i.userId == lessonTimeInfo.teacherId) {
                        lessonTimeInfo.teacherName = i.username;
                    }
                })


                var startTime1 = new Date("1970/1/2 " + lessonTimeInfo.startTime);
                var endTime1 = new Date("1970/1/2 " + lessonTimeInfo.endTIme);
                //判断时间是否冲突
                var judgConflictArray = [];
                $scope.LessonTimeListNewNewNew.forEach(function (i) {
                    if (i.startDate == $scope.week[$scope.activeDay].startDate) {
                        judgConflictArray.push(i);
                    }
                })
                for (var i = 0; i < judgConflictArray.length; i++) {
                    for (var j = 0; j < judgConflictArray[i].detail.length; j++) {
                        var startTime2 = new Date("1970/1/2 " + judgConflictArray[i].detail[j].startTime);
                        var endTime2 = new Date("1970/1/2 " + judgConflictArray[i].detail[j].endTime);
                        if (startTime1 >= startTime2 && startTime1 <= endTime2 || endTime1 >= startTime2 && endTime1 <= endTime2) {
                            warningAlert("时间重复");
                        }
                    }

                }

                // lessonTimeInfo.teacherName = $scope.multipleCourseTeachersList[$scope.classMultipleInfo.teacherIndex].username;
                // if(!lessonTimeInfo.subject || !lessonTimeInfo.teacher || !lessonTimeInfo.startTime || !lessonTimeInfo.timelong){
                //     warningAlert("请先选择一个科目并添加老师及上课时间，再继续添加其他上课计划");
                //     return false;
                // }
                $scope.LessonTimeList.push(lessonTimeInfo);

                $scope.classMultipleInfo = {};
                $scope.multipleCourseSelectTime = {};
                $scope.week[$scope.activeDay].count++;
                $scope.addIsLegitimate = false;

            };
            $scope.addMultipleCoursePlanTime = function () {


                $scope.show.planLists = [];

                //重组
                $scope.LessonTimeList.forEach(function (lesson, index, array) {
                    var row = {};
                    row.day = lesson.day;
                    row.startDate = lesson.startDate;
                    row.startTime = lesson.startTime;
                    row.endTime = lesson.endTime;
                    row.timelong = lesson.timelong;
                    row.subjectId = lesson.subjectId;
                    row.teacherId = lesson.teacherId;
                    row.teacherName = lesson.teacherName;
                    row.subjectName = lesson.subjectName;
                    row.timelongName = lesson.timelongName;
                    $scope.LessonTimeListNew.push(row);
                    var row2 = {};
                    row2.start = index;
                    row2.day = lesson.day;
                    row2.startDate = lesson.startDate;
                    row2.startTime = lesson.startTime;
                    row2.endTime = lesson.endTime;
                    row2.timelong = lesson.timelong;
                    row2.timelongName = lesson.timelongName;
                    $scope.show.planLists.push(row2);
                })

                var lists = [[], [], [], [], [], [], []];
                $scope.LessonTimeListNew.forEach(function (list, index, array) {
                    lists[parseInt(list.day) - 1].push(list);
                })
                $scope.LessonTimeListNewNew = [];
                var startIndex = $scope.LessonTimeListNewNewNew.length;
                lists.forEach(function (i, index, array) {
                    if (i.length > 0) {
                        var obj = {}
                        obj.start = startIndex++;
                        obj.detail = [];
                        i.forEach(function (j, jndex) {
                            obj.startDate = j.startDate;
                            j.start = jndex;
                            obj.detail.push(j)
                        })
                        $scope.LessonTimeListNewNew.push(obj);
                    }
                    if (index == lists.length - 1) {
                        lists = [[], [], [], [], [], [], []];
                    }
                })


                //校验时间是否冲突
                var checkLessonTime = $scope.LessonTimeListNewNewNew.concat($scope.LessonTimeListNewNew);
                //将所有时间提取出来
                var checkLists = [[], [], [], [], [], [], []];
                checkLessonTime.forEach(function (i) {
                    i.detail.forEach(function (j) {
                        var obj = {}
                        obj.startTime = j.startTime;
                        obj.endTime = j.endTime;
                        checkLists[parseInt(j.day - 1)].push(obj);
                    })
                })
                for (var i = 0; i < checkLists.length; i++) {
                    for (var j = 1; j < checkLists[i].length; j++) {
                        for (var k = 0; k < j; k++) {
                            var startTime1 = new Date("1970/01/02 " + checkLists[i][j].startTime).getTime();
                            var endTime1 = new Date("1970/01/02 " + checkLists[i][j].endTime).getTime();
                            var startTime2 = new Date("1970/01/02 " + checkLists[i][k].startTime).getTime();
                            var endTime2 = new Date("1970/01/02 " + checkLists[i][k].endTime).getTime();
                            if (startTime1 >= startTime2 && startTime1 <= endTime2 || endTime1 >= startTime2 && endTime1 <= endTime2) {
                                $scope.LessonTimeListNew = [];
                                $scope.LessonTimeListNewNew = [];
                                warningAlert("时间重复");
                                return;
                            }
                        }
                    }
                }


                $scope.LessonTimeListNewNewNew = $scope.LessonTimeListNewNewNew.concat($scope.LessonTimeListNewNew);
                $scope.multiplelistdetail = $scope.multiplelistdetail.concat($scope.LessonTimeListNewNew)
                $scope.addMultipleCoursePlanTimeModal.hide();
                clearAllMultipleCourseData();
            }

            $scope.clearAllMultipleCourseData = clearAllMultipleCourseData;

            function clearAllMultipleCourseData() {
                $scope.LessonTimeListNewNew = [];
                $scope.LessonTimeListNew = [];
                $scope.classMultipleInfoList = [];

                // $scope.LessonTimeListNewNewNew = [];
                $scope.classMultipleInfo = {};
                $scope.multipleCourseTeachersFilter = {};
                // $scope.multipleCourseTeacherLists = [];
                $scope.multipleCourseSelectTime = {};
                $scope.LessonTimeList = [];
                $scope.activeDay = null;
                $scope.selectedCourse = null;
                $scope.week.forEach(function (i, index, array) {
                    $scope.week[index].count = 0;
                })
            }

            function getMyCrmCustomerStudentClassList(tableState) {
                tableState = tableState || {};
                tableState.pagination = tableState.pagination || {};
                $scope.gTableState = tableState;
                $scope.isLoading = true;
                $scope.pagination = tableState.pagination;
                $scope.start = $scope.pagination.start || 1;
                $scope.number = $scope.pagination.number || 10;
                $scope.filter.start = $scope.start;
                $scope.filter.size = $scope.number;
                $scope.filter.schoolId = AuthenticationService.currentUser().school_id;

                var promise = ClassManagementService.getClassesByFilter($scope.filter);
                promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            $scope.MyCrmCustomerStudentClassList = response.data.list;
                            for (var i = 0; i < $scope.MyCrmCustomerStudentClassList.length; i++) {
                                if (!$scope.MyCrmCustomerStudentClassList[i].planCount) {
                                    $scope.MyCrmCustomerStudentClassList[i].planCount = 0;
                                }
                                if ($scope.MyCrmCustomerStudentClassList[i].classTimeJson) {
                                    var classTimeList = [];
                                    var list = eval($scope.MyCrmCustomerStudentClassList[i].classTimeJson);
                                    for (var j = 0; list != null && j < list.length; j++) {
                                        if (classTimeList.length == 0) {
                                            classTimeList.push(list[j]);
                                        }
                                        else {
                                            for (var k = 0; k < classTimeList.length; k++) {
                                                if (classTimeList[k].startTime == list[j].startTime && classTimeList[k].endTime == list[j].endTime) {
                                                    //拼上星期几的描述
                                                    classTimeList[k].startDate = classTimeList[k].startDate + list[j].startDate.substr(2, 1);
                                                    break;
                                                }
                                                else if (k == classTimeList.length - 1) {
                                                    //遍历到最后一个还不相等，那么就加入
                                                    classTimeList.push(list[j]);
                                                    break;
                                                }
                                            }

                                        }
                                    }
                                    for (var j = 0; j < classTimeList.length; j++) {
                                        classTimeList[j].startDate = "周" + classTimeList[j].startDate.substr(2);
                                    }
                                    $scope.MyCrmCustomerStudentClassList[i].classTimeList = classTimeList;
                                }
                            }
                            tableState.pagination.numberOfPages = response.data.pages;
                        }
                        $scope.isLoading = false;
                    },
                    function (error) {
                    });
            }

            //删除本次添加的上课计划列表项
            $scope.deleteMultipleCoursePlanTime = function (index) {
                $scope.LessonTimeList.splice(index, 1);
                //重置当前星期的上课课程数量
                $scope.week[$scope.activeDay].count--;
            }

            $scope.choosePkType = function () {
                showPaikeView(3);
                CustomerStudentService.getOne2OneCoursePlans($scope.detail.crm_student_id, $scope.detail.type).then(function (response) {

                    if (response.status == "SUCCESS") {
                        $scope.plan_available_num = response.data.o2oAuditionCourseTime.list[0];
                        if ($scope.plan_available_num.plan_available_num == 0) {
                            warningAlert("该学员已无试听课时")
                        }

                    }
                })
            }

            $scope.choosePkType1 = function () {
                CustomerStudentService.getOne2OneCoursePlans($scope.detail.crm_student_id, $scope.detail.type).then(function (response) {

                    if (response.status == "SUCCESS") {
                        $scope.plan_available_num = response.data.o2oAuditionCourseTime.list[0];
                        if ($scope.plan_available_num.plan_available_num == 0) {
                            warningAlert("该学员已无试听课时")
                        }

                    }
                })
            }


        }
    ]);
