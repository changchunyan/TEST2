/**
 * Created by 李世明 on 2017/1/17 0017.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:活动消课相关
 */

angular.module('ywsApp').controller('ActiveMTContoller', ['$scope', '$sce', '$rootScope', '$modal', '$mtModal', 'SweetAlert', 'StuDetail', 'CustomerStudentCourseService', 'ActiveMTServer', 'CoursePlanService', function ($scope, $sce, $rootScope, $modal, $mtModal, SweetAlert, StuDetail, CustomerStudentCourseService, ActiveMTServer, CoursePlanService) {
    var v = Date.now()
    $scope.tabels = StuDetail.init($scope, [
        {
            title: '课时消课',   //  tabel切换拦标题
            url: 'partials/active/modal/ks.html?' + v,
            clickFun: function () {
                _reastParam()
            }
        },
        {
            title: '储值消课',
            url: 'partials/active/modal/cz.html?' + v,
            clickFun: function () {
                _reastParam()
            }
        }
    ])
    console.log($scope.tabels)
    /**
     * 异步加载学生的订单课程信息
     */
    $scope.getOrderCourseList = function (tableState) {
        /*$scope.detail.crm_student_id,0*/
        CustomerStudentCourseService.getOrderCourseList(_setStudentId()).then(function (result) {
            $scope.CustomerStudentCourseList = result.studentOrder;
            _totalHours(angular.copy(result.studentOrder))
            // 若是CustomerStudentCourseList的size = 1，默认选中radio
            var length = $scope.CustomerStudentCourseList.length;
            if (1 == length) {
                $scope.CustomerStudentCourseList[0].isChecked = true;
                $scope.subjectId = $scope.CustomerStudentCourseList[0].subject_id;
                if ($scope.schoolName != "" && $scope.subjectId != "") {
                    $scope.canSelectTime = true;
                }
            }
        });
    }
    $scope.getOrderCourseListCZ = function () {
        CoursePlanService.getWxClassTimeList($scope.detail.crm_student_id, $scope.detail.grade_id, $scope.detail.grade_id, $scope).then(function (result) {
            $scope.CustomerStudentCourseList = result.orders;
            _totalHours(angular.copy(result.orders))
        })
    }

    function _setStudentId() {
        var obj = {crmCustomerStudentId: $scope.detail.crm_student_id}
        if (_setType() == 10) {
            obj.orderCategory = 0
        }//orderRule: $scope.detail.order_rule,courseBuyUnit: 1
        if (_setType() == 11) {
            obj.orderCategory = 3
            obj.allFlag = true
        }
        return obj
    }

    function _totalHours(list) {
        $scope.totalHours = 0
        $scope.zhHours = 0
        $scope.kpHours = 0
        for (var i = 0, len = list.length; i < len; i++) {
            if (_setType() == 10) {
                $scope.totalHours += list[i].course_num || list[i].course_num
                $scope.kpHours += list[i].plan_available_num || list[i].avaliable_amount
            } else {
                $scope.totalHours += list[i].avaliable_amount
                $scope.zhHours += list[i].additional_amount
            }

        }
    }

    //总消课数量
    $scope.autoDistribution = function () {
        //  临时总消课数
        $scope.setParam.totalConsumers = Number($scope.setParam.totalConsumers || 0).toFixed(1)
        var _totalConsumers = Number($scope.setParam.totalConsumers)
        if (_totalConsumers > $scope.kpHours) {
            $scope.setParam.totalConsumers = $scope.kpHours
            _alert()
            return false
        }
        $scope._total_ = 0
        for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
            //  如果消课总课数大于或等于当前行的剩余课时数，那么剩余课时数全部减调，然后需要减掉临时消课数
            if (_totalConsumers >= $scope.CustomerStudentCourseList[i].plan_available_num) {
                $scope.CustomerStudentCourseList[i].consumersNum = $scope.CustomerStudentCourseList[i].plan_available_num
                $scope.CustomerStudentCourseList[i].active = true
                _totalConsumers -= $scope.CustomerStudentCourseList[i].plan_available_num
                $scope.activeAll = (i === len - 1) ? true : false
            } else if (_totalConsumers > 0) {
                // 否则把总消课数给消课数量
                $scope.CustomerStudentCourseList[i].consumersNum = /\./.test(_totalConsumers.toString()) ? Number(_totalConsumers.toFixed(1)) : _totalConsumers
                $scope.CustomerStudentCourseList[i].active = true
                _totalConsumers = 0
                $scope.activeAll = (i === len - 1) ? true : false
            } else {
                $scope.CustomerStudentCourseList[i].consumersNum = ''
                $scope.CustomerStudentCourseList[i].active = false
            }
            $scope._total_ += Number($scope.CustomerStudentCourseList[i].consumersNum)
        }

    }
    /**
     * 单选
     * @param row
     */
    $scope.setActive = function (row) {
        if (row.consumersNum && row.active) {
            $scope.setParam.totalConsumers -= row.consumersNum
            $scope.setParam.totalConsumers = $scope.setParam.totalConsumers.toFixed(1)
            row.consumersNum = ''
        }
        row.active = !row.active;
        // $scope.validatePrice(index, 'plan_available_num');
        _isAllActive()
    }

    function _isAllActive() {
        var _len = 0
        for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
            if ($scope.CustomerStudentCourseList[i].active) {
                _len++
            }
        }
        if (_len === len)
            $scope.activeAll = true
        else
            $scope.activeAll = false

    }

    /**
     * 全选
     */
    $scope.setActiveAll = function () {
        for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
            if ($scope.activeAll) {
                $scope.CustomerStudentCourseList[i].active = false
            } else {
                $scope.CustomerStudentCourseList[i].active = true
            }
        }
        $scope.activeAll = !$scope.activeAll
    }
    /**
     * 提交审核参数配置
     * @type {{totalConsumers: number, userId, consumersTime: string, consumerRseason: string}}
     */
    $scope.setParam = {
        totalConsumers: '',//总消课数量
        crmStudentId: $scope.detail.crm_student_id,//用户id
        consumersTime: '',//消课时间
        consumerRseason: ''//消课原因
    }

    function _reastParam() {
        for (var key in $scope.setParam) {
            if (key != 'crmStudentId') {
                $scope.setParam[key] = ''
            }
        }
        $scope._total_ = 0
        $scope.classHours = 0
        $scope.activeAll = 0
    }

    $scope._total_ = 0
    /**
     * 提交审核
     */
    $scope.submitAudit = function () {
        $scope.setParam.consumersTime = angular.element('[name="consumersTime"]').val()
        var param = {},
            obj = angular.copy($scope.setParam)
        for (var key in obj) {
            param[key] = obj[key]
        }
        // 20180726活动消课限制为0.5课时
        var selectedCount = 0;
        for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
            var item = $scope.CustomerStudentCourseList[i];
            if (item.active && item.consumersNum && item.consumersNum !== '0') {
                if (item.consumersNum % 0.5 !== 0) {
                    SweetAlert.swal('请将第“' + (i + 1) + '”行“' + (item.order_category == 1 ? item.course_type_name : item.course_name) + '”的消课数量：' + item.consumersNum + '\n改为0.5课时的整数倍');
                    return false
                }
            } else if (item.active) {
                SweetAlert.swal('请输入第“' + (i + 1) + '”行的消课数量');
                return false
            } else {
                selectedCount++;
            }
        }
        if (selectedCount == $scope.CustomerStudentCourseList.length) {
            SweetAlert.swal('请选择课程');
            return false
        }
        param.list = angular.copy($scope.CustomerStudentCourseList)
        param.type = _setType()
        if (!_isNull(param.list)) {
            $mtModal.moreModal({
                scope: $scope,
                text: (function () {
                    if (_setType() == 11) {
                        return '请输入消课金额'
                    } else {
                        return '请输入消课数量'
                    }
                })()
            })
            return false
        }
        ActiveMTServer.audit(param).then(function (data) {
            if (data.data.status === 'SUCCESS') {
                $scope.activeModal.hide()
                $scope.getMyCrmCustomerStudentList($scope.myCrmCustomerStudentListTableState);
                $mtModal.moreModal({
                    scope: $scope,
                    text: '提交成功',
                    status: 1
                })
            } else {
                $mtModal.moreModal({
                    scope: $scope,
                    text: '提交失败',
                    status: 0
                })
            }
        })
    }

    function _isNull(list) {
        var _list = angular.copy(list),
            length = 0
        for (var i = 0, len = _list.length; i < len; i++) {
            if (_list[i].consumersNum) {
                length++
            }
        }
        return length
    }

    /**
     * 设置类型
     */
    function _setType() {
        for (var i = 0, len = $scope.tabels.length; i < len; i++) {
            if ($scope.tabels[i].select) {
                console.log('1' + i)
                return ('1' + i)
            }
        }
    }

    /**
     * 监控储值自动分配
     */
    $scope.$watch('setParam.totalConsumers', function (newVal, oldVal) {
        if (_setType() == 11) {
            if (newVal > $scope.totalHours) {
                $scope.setParam.totalConsumers = oldVal ? Number(oldVal).toFixed(1) : ''
                _alert()
                return false
            }
        }
    }, true)
    $scope.validatePrice = function (index, attr) {
        if (!arguments.length) {
            //  储值总数监控
            var _totalConsumers = Number($scope.setParam.totalConsumers)
            $scope._total_ = 0;
            $scope.classHours = 0
            for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
                //  如果消课总课数大于或等于当前行的剩余课时数，那么剩余课时数全部减调，然后需要减掉临时消课数
                if (_totalConsumers >= $scope.CustomerStudentCourseList[i].avaliable_amount) {
                    $scope.CustomerStudentCourseList[i].consumersNum = $scope.CustomerStudentCourseList[i].avaliable_amount
                    _totalConsumers -= $scope.CustomerStudentCourseList[i].avaliable_amount
                    //计算课时
                    $scope.classHours += $scope.CustomerStudentCourseList[i].consumersNum / $scope.CustomerStudentCourseList[i].order_charge
                } else if (_totalConsumers > 0) {
                    // 否则把总消课数给消课数量
                    $scope.CustomerStudentCourseList[i].consumersNum = _totalConsumers
                    _totalConsumers = 0
                    $scope.CustomerStudentCourseList[i].active = true
                    //计算课时
                    $scope.classHours += $scope.CustomerStudentCourseList[i].consumersNum / $scope.CustomerStudentCourseList[i].order_charge
                } else {
                    $scope.CustomerStudentCourseList[i].consumersNum = ''
                    $scope.CustomerStudentCourseList[i].active = false
                    $scope.CustomerStudentCourseList[i].consumersNum = ''
                }
                $scope._total_ += Number($scope.CustomerStudentCourseList[i].consumersNum)
            }
            $scope.classHours = /\./.test($scope.classHours.toString()) ? Number($scope.classHours.toFixed(1)) : $scope.classHours
        } else if ($scope.CustomerStudentCourseList[index].consumersNum > $scope.CustomerStudentCourseList[index][attr]) {
            $scope.CustomerStudentCourseList[index].consumersNum = $scope.CustomerStudentCourseList[index][attr]
            $mtModal.moreModal({
                scope: $scope,
                text: _setType() == 10 ? '消课数量不可大于可排课时' : '消课金额不可大于账户余额'
            })
            _setTotalConsumers()
            return false
        } else {
            _setTotalConsumers()
        }


    }

    function _setTotalConsumers() {
        // var $inputDom = angular.element('#active_mt').find('input')
        $scope.setParam.totalConsumers = 0
        $scope._total_ = 0
        $scope.classHours = 0
        for (var i = 0, len = $scope.CustomerStudentCourseList.length; i < len; i++) {
            $scope.setParam.totalConsumers += Number($scope.CustomerStudentCourseList[i].consumersNum) || 0
            $scope._total_ += Number($scope.CustomerStudentCourseList[i].consumersNum) || 0
            if (_setType() == 11) {
                $scope.classHours += $scope.CustomerStudentCourseList[i].consumersNum / $scope.CustomerStudentCourseList[i].order_charge
            }
        }
        if (_setType() == 11) {
            $scope.classHours = /\./.test($scope.classHours.toString()) ? Number($scope.classHours.toFixed(1)) : $scope.classHours
        }
        $scope.setParam.totalConsumers = /\./.test($scope.setParam.totalConsumers.toString()) ? Number($scope.setParam.totalConsumers.toFixed(1)) : $scope.setParam.totalConsumers
        $scope.setParam.totalConsumers = Number($scope.setParam.totalConsumers || 0).toFixed(1)
    }

    function _alert() {
        $mtModal.moreModal({
            scope: $scope,
            text: (function () {
                if (_setType() == 11) {
                    return '总消课金额不可大于总可排金额'
                } else {
                    return '总消课数量不可大于总可排课时'
                }
            })()
        })
    }
}
])
