'use strict';

/**
 * The biBase controller.
 *
 * @author JeanZhang
 * @version 1.0
 */
angular
    .module('ywsApp')
    .controller(
        'BiBaseController',
        [
            '$scope',
            '$modal',
            '$filter',
            '$rootScope',
            'SweetAlert',
            'DepartmentService',
            'AuthenticationService',
            'localStorageService',
            'CommonService',
            'BiBaseService',
            function ($scope, $modal, $filter, $rootScope,
                      SweetAlert, DepartmentService,
                      AuthenticationService, localStorageService,
                      CommonService, BiBaseService) {
                // 方法声明
                $scope.getAllProvinces = getAllProvinces;
                $scope.getCitysByProvinceCode = getCitysByProvinceCode;
                $scope.isSelected = isSelected;
                $scope.init = init;
                $scope.reset = reset;
                $scope.setTimeScope = setTimeScope;
                $scope.showSelectDepartment = showSelectDepartment;
                $scope.getAllDepartments = getAllDepartments;
                $scope.selectDepartment = selectDepartment;
                $scope.departmentSelected = departmentSelected;
                $scope.argJudgement = argJudgement;
                /* 20180817 */
                $scope.oldSearch = false
                if (location.hash === '#/bi-admin/channelOrder' || location.hash === '#/bi-admin/gradeStatistics') {
                    $scope.baseHtmlUrl = 'partials/bi/bi.base.v2.html?'
                        + new Date().getTime();
                } else {
                    $scope.oldSearch = true
                    $scope.baseHtmlUrl = 'partials/bi/bi.base.html?'
                        + new Date().getTime();
                }

                // 初始化
                init();

                // 具体方法
                function getLoginSchoolId() {
                    if (localStorageService.get('school_id') != 0) {
                        $scope.searchModel.schoolId = localStorageService
                            .get('school_id');
                        $scope.isSchoolUser = true;
                        // 获取校区信息
                         if (localStorageService.get('department') != null && $scope.oldSearch) {
                             var school = localStorageService
                                 .get('department');
                             $scope.searchModel.schoolType = new String(
                                 school.schoolNature).toString();
                             if ($scope.searchModel.schoolType === 'null') {
                                 $scope.searchModel.schoolType = null;
                             }
                             $scope.searchModel.schoolProvince = school.provinceCode;
                             $scope.searchModel.schoolCity = school.cityCode;
                             getCitysByProvinceCode(school.provinceCode);
                         }
                    } else {
                        if (localStorageService.get('department') != null) {
                            var department = localStorageService
                                .get('department');
                            $scope.searchModel.departmentId = department.id;
                        }
                        $scope.isSchoolUser = false;
                    }
                }

                // TODO：20180630
                $scope.newTitles = {
                    '-1': ['市场', '智能营销媒体', '课程顾问介绍', '数据流转', '学习顾问推荐', 'APP', '素养线上渠道', '合计'],
                    '5': ['直访', '拉上', '地推leads', '学校', '社区', '企业', '异业', '小渠道', '自媒体', '渠道合作', /*'活动推广', '智慧拼团', '东城区英语大会',*/ '合计'],
                    '4': ['大众点评', '网络推广', '400', '短信', 'TMK', '微博', '微信', 'BD-教育宝', 'BD-培训世界', 'BD-新课网', 'BD-并肩', 'BD-真道坦途', '合计'],
                    '49': ['周末去哪儿', '童心元', '幼升小咨询台', '亲子团', '合计'],
                    '1': ['小一-小三', '小四-小六', '初一-初二', '初三', '初四', '高一-高二', '高三', '合计'],
                    '2': ['小一-小三', '小四-小六', '初一-初二', '初三', '初四', '高一-高二', '高三', '合计']
                }
                var t = ['地推leads', '拉上', '直访', '自媒体', '渠道合作']
                // 判断是否展示总计
                $scope.isShowTotalRow=function () {
                    var dataList = JSON.parse(window.sessionStorage.getItem('__exp__'))
                    if (!dataList) {
                        return 0
                    }
                    var len = dataList.length
                    if (dataList.length>10) {
                        return len - 10
                    }
                    return 0
                }
                // 返回打印模板数据
                function getHtml (name, id,data) {
                    var $html = marketTemplate($scope,id,data)
                    // if ($scope.searchModel.channelParentId == -1 || $scope.searchModel.channelParentId == 5 || $scope.searchModel.depType) {

                    // if ($scope.searchModel.channelParentId != 49) {
                    //     $html = marketTemplate($scope,id,data)
                    // } else {
                    //     $html = $('#' + id)
                    // }
                    $html.find('td').css({
                        border: '1px solid #ededed',
                        height: '40px'
                    })
                    $html.find('tr').map(function (i, tr) {
                        $(tr).find('.bgtd-header').map(function (index, td) {
                            // console.log(td)
                            $(td).css({
                                background: index % 2 ? '#f4b077' : '#f4b099'
                            })
                        })
                    })
                    return $html.html()
                }
                // 导出
                $scope.exportableV1 = function (name, id,data) {
                    $rootScope.ywsLoading = true
                    var html = getHtml(name, id,data)
                    var blob = new Blob([html], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    })
                    var s, e
                    if ($scope.searchModel.startTime.Format) {
                        s = $scope.searchModel.startTime.Format('yyyy-MM-dd')
                        e = $scope.searchModel.endTime.Format('yyyy-MM-dd')
                    } else {
                        s = $scope.searchModel.startTime.replace(/-/g, '')
                        e = $scope.searchModel.endTime.replace(/-/g, '')
                    }
                    // saveAs(blob, name + (s == e ? s : (s + '-' + e)) + ".xls");
                    saveAs(blob, ($scope.$$childHead.tabsName[$scope.searchModel.channelParentId] || $scope.$$childHead.tabsName[$scope.searchModel.depType]) + name + (s == e ? s : (s + '-' + e)) + ".xls")
                    $rootScope.ywsLoading = false
                };
                // 单行统计总和
                $scope.totalSmallByName = function (name, model) {
                    var total = 0
                    var models = angular.copy(model)
                    if ($scope.searchModel.channelParentId == 5) {
                        for (var mkey in models) {
                            if (t.indexOf(mkey) == -1) {
                                delete models[mkey]
                            }
                        }
                    }
                    for (var key in models) {
                        if (models.hasOwnProperty(key) && typeof models[key] == 'object') {
                            var item = models[key]
                            total += (item[name] || 0)
                        }
                    }
                    return total
                }
                // 列表统计总和
                $scope.totalAllByName = function (name, channelOrders, key) {
                    var total = 0
                    for (var i = 0, len = channelOrders.length; i < len; i++) {
                        // 列表统计和，非总和
                        var item = channelOrders[i]
                        if (key) {
                            var _item = item[key] || {}
                            total += (_item[name] || 0)
                        } else {
                            total += $scope.totalSmallByName(name, item)
                        }
                    }
                    return total
                }
                $scope.isBranch = function () {
                    var department = localStorageService
                        .get('department');
                    try {
                        return department.isBranch
                    } catch (e) {
                        return false
                    }
                }

                /**
                 * 获取当前机构
                 */
                function getAllDepartments() {
                    var promise = DepartmentService
                        .list(AuthenticationService
                            .currentUser().organization.id);
                    promise
                        .then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data,
                                    "请重试", "error");
                            } else {
                                $scope.departments = response.data;
                                $scope.selectdDepartment = localStorageService.get('department');
                                $scope.searchModel.departmentId = $scope.selectdDepartment.id;
                                // 默认选中
//												if (response.data) {
//													$scope.selectdDepartment = response.data[0];
//												}
                            }
                        });
                }

                /**
                 * 选择机构弹框
                 */
                function showSelectDepartment() {
                    $scope.modalTitle = '选择机构';
                    $scope.selectDepartmentModal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/hr/department/modal.department.html',
                        show: true
                    });
                    $scope.modalDepartments = angular
                        .copy($scope.departments);
                }

                /**
                 * 选择机构
                 */
                function selectDepartment(node) {
                    $scope.selectdDepartment = findSelectedDepartment(
                        $scope.departments, node.id);
                    $scope.searchModel.departmentId = $scope.selectdDepartment.id;
                }

                function findSelectedDepartment(departments, id) {
                    var found = false;
                    angular.forEach(departments, function (
                        department) {
                        if (found) {
                            return;
                        }
                        if (department.id == id) {
                            found = department;
                            return;
                        }
                        found = findSelectedDepartment(
                            department.children, id);
                    });
                    return found;
                }

                /**
                 * 选择成功后
                 */
                function departmentSelected() {
                    $scope.selectDepartmentModal.hide();
                }

                /**
                 * 获取所有省份
                 */
                function getAllProvinces() {
                    var promise = DepartmentService
                        .getAllProvince();
                    promise.then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试",
                                "error");
                        } else {
                            $scope.provinces = response.data;
                        }
                    }, function (error) {
                        SweetAlert.swal("获取省列表失败", "请重试", "error");
                    });
                }

                /**
                 * 根据省份code获取市
                 *
                 * @param pcode
                 *            province code
                 */
                function getCitysByProvinceCode(pcode) {
                    if (pcode == null) {
                        $scope.cities = null;
                    } else {
                        var promise = DepartmentService
                            .getCityByProvince(pcode);
                        promise.then(function (response) {
                            if (response.status == "FAILURE") {
                                SweetAlert.swal(response.data,
                                    "请重试", "error");
                            } else {
                                $scope.cities = response.data;
                            }
                        }, function (error) {
                            SweetAlert.swal("获取市列表失败", "请重试",
                                "error");
                        });
                    }
                }

                /**
                 * 获取省份名称
                 */
                function getProvinceName(provinceId) {
                    var obj;
                    angular.forEach($scope.provinces, function (
                        data, index) {
                        if (data.id == provinceId) {
                            var obj = data.name;
                        }
                    });
                    return obj;
                }

                /**
                 * 获取城市名称
                 */
                function getCityName(cityId) {
                    var obj;
                    angular.forEach($scope.cities, function (data,
                                                             index) {
                        if (data.id == cityId) {
                            obj = data.name;
                        }
                    });
                    return obj;
                }

                /**
                 * 判断当前选择的时间类型
                 */
                function isSelected(type) {
                    if (type == $scope.timeScope) {
                        return true;
                    } else {
                        return false;
                    }
                }

                /**
                 * 初始化方法
                 */
                function init() {
                    $scope.searchModel = {}; // 统计筛选条件数据
                    $scope.searchModel.startTime = getNowFormatDate();
                    $scope.searchModel.endTime = getNowFormatDate();

                    $scope.timeScope = {}; // 统计日期范围参数
                    if ($scope.oldSearch) {
                        getAllProvinces(); // 获取省份集合
                        setTimeout(function () {
                            BiBaseService.setTimeScope($scope, 0); // 默认按‘单日’查询
                        },100)
                    }
                    getAllDepartments(); // 获取组织架构
                    getLoginSchoolId(); // 获取当前登录是否是校区人员
                    // BiBaseService.setTimeScope($scope, 0); // 默认按‘单日’查询
                }

                function getNowFormatDate() {
                    return new Date()
                    // var date = new Date();
                    // var year = date.getFullYear();
                    // var month = date.getMonth() + 1;
                    // var strDate = date.getDate();
                    // if (month >= 1 && month <= 9) {
                    //     month = "0" + month;
                    // }
                    // if (strDate >= 0 && strDate <= 9) {
                    //     strDate = "0" + strDate;
                    // }
                    // return [year, month, strDate].join('-');
                }

                /**
                 * 重置统计筛选条件
                 */
                function reset(isQ) {
                    if ($scope.oldSearch) {
                        var viewType = $scope.searchModel.viewType;
                        $scope.searchModel = {}
                        if (viewType) {
                            $scope.searchModel.viewType = viewType;
                        }

                        $scope.selectdDepartment = localStorageService
                            .get('department');
                        $scope.searchModel.departmentId = $scope.selectdDepartment.id;
                        getLoginSchoolId();

                        if (isQ == true) {
                            setTimeScope(1);
                            $scope.isQ = true;
                        } else {
                            setTimeScope(0);
                        }
                        //重置时默认今天的时间
                        $scope.searchModel.startTime=new Date().Format("yyyy-MM-dd");
                        $scope.searchModel.endTime=new Date().Format("yyyy-MM-dd");
                    } else {
                        $scope.searchModel = {}

                        $scope.selectdDepartment = localStorageService
                            .get('department');
                        $scope.searchModel.departmentId = $scope.selectdDepartment.id;
                        getLoginSchoolId();


                        //重置时默认今天的时间
                        $scope.searchModel.startTime = new Date().Format("yyyy-MM-dd");
                        $scope.searchModel.endTime = new Date().Format("yyyy-MM-dd");
                    }

                }

                function setTimeScope(type) {
                    BiBaseService.setTimeScope($scope, type);
                }

                /**
                 * 参数判断
                 */
                function argJudgement(fun) {
                    var flag = false;
                    $scope.channelOrders = []
                    if ($scope.searchModel) {
                        if (!$scope.searchModel.departmentId) {
                            location.reload();
                            return false;
                        }
                        /*if (!$scope.searchModel.statTime
                                || $scope.searchModel.statTime === 'NaN-aN-aN') {
                            location.reload();
                            return false;
                        }*/
                        if (typeof ($scope.searchModel.startTime) != "undefined"
                            && (!$scope.searchModel.startTime || $scope.searchModel.startTime === 'NaN-aN-aN')) {
                            location.reload();
                            return false;
                        }
                        if (typeof ($scope.searchModel.endTime) != "undefined"
                            && (!$scope.searchModel.endTime || $scope.searchModel.endTime === 'NaN-aN-aN')) {
                            location.reload();
                            return false;
                        }
                        /*if (!$scope.searchModel.schoolType
                                || $scope.searchModel.schoolType === 'null') {
                            $scope.searchModel.schoolType = null;
                        }*/
                        /*	if (!$scope.searchModel.schoolProvince
                                    || $scope.searchModel.schoolProvince === 'null') {
                                $scope.searchModel.schoolProvince = null;
                            }
                            if (!$scope.searchModel.schoolCity
                                    || $scope.searchModel.schoolCity === 'null') {
                                $scope.searchModel.schoolCity = null
                            }*/
                        flag = true;
                    }
                    if (flag) {
                        fun();
                    }

                }

                $scope.updateDate = function (e) {
                    $scope.searchModel[e] = new Date($('#' + e).val())
                }
            }]);
