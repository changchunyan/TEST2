'use strict';
/**
 * The Teacher management controller.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('TeacherTimesController', ['$scope', '$modal', '$rootScope', '$location', '$routeParams', 'SweetAlert', 'CustomerStudentCourseService', 'localStorageService', 'AuthenticationService', 'DepartmentService', 'TeacherService',
        function ($scope, $modal, $rootScope, $location, $routeParams, SweetAlert, CustomerStudentCourseService, localStorageService, AuthenticationService, DepartmentService, TeacherService) {

            var oThis = this;

            oThis.getTeacherLists = getTeacherLists;
            oThis.isSelectedTeacher = isSelectedTeacher;
            oThis.checkedTeacher = checkedTeacher;
            oThis.deleteSelectedTeacher = deleteSelectedTeacher;
            oThis.deleteSelectedAllTeacher = deleteSelectedAllTeacher;

            oThis.getAllSubject = getAllSubject;//得到所有的科目 查询条件
            oThis.back = back;

            $scope.initDate = _init_date;//子类重置调用此方法
            $scope.selectedPersons = selectedPersons;//此方法 子类调用该方法

            /**
             * 判断教师是否被选中
             * @param row
             */
            function isSelectedTeacher(row) {
                return _isSelected(row);
            }

            /**
             * 选择或者删除教师
             * @param row
             */
            function checkedTeacher(row) {

                // $scope.$emit("SelectedPersonChange", $scope.selected.persons);

                if (_isSelected(row)) {
                    _deleteSelectedTeacher(row);
                    return false;
                }
                if ($scope.selected.persons && $scope.selected.persons.length >= 5) {
                    SweetAlert.swal("最多能查询五个教师！");
                    oThis.getTeacherLists($scope.taacherListsTableState);
                    return false;
                }
                _addSelectedTeacher(row);

            }

            function deleteSelectedTeacher(row) {
                _deleteSelectedTeacher(row);
            }

            function deleteSelectedAllTeacher() {
                //注意 这个删除全部
                $scope.selected.persons = [];
                $scope.selected.personsName = [];
                $scope.selected.personsNameShow = '';
                angular.forEach($scope.teacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        q.selected = false;
                    });
                });
            }

            /**
             * 判断是否选中
             * @param row
             * @returns {boolean}
             * @private
             */
            function _isSelected(row) {
                var list = angular.copy($scope.selected.persons);
                for (var i = 0; i < list.length; i++) {
                    if (row.userId == list[i].userId) {
                        return true;
                    }
                }
                return false;
            }

            function _addSelectedTeacher(row) {
                Array.prototype.push.call($scope.selected.persons, row);
                Array.prototype.push.call($scope.selected.personsName, row.username);
                $scope.selected.personsNameShow = $scope.selected.personsName.toString();
                $scope.selected.personsNameShow = $scope.selected.personsNameShow.replace(new RegExp(",", "gm"), "、");                //在弹框中选中，需要关联去选中页面中的button
                angular.forEach($scope.teacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        if (q.userId == row.userId) {
                            q.selected = true;
                        }
                    });
                });
            }

            function _deleteSelectedTeacher(row) {
                var list = $scope.selected.persons;
                var listName = $scope.selected.personsName;
                for (var i = 0; i < list.length; i++) {
                    if (row.userId == list[i].userId) {
                        Array.prototype.splice.call(list, i, 1);
                        Array.prototype.splice.call(listName, i, 1);
                        $scope.selected.personsNameShow = listName.toString();
                        $scope.selected.personsNameShow = $scope.selected.personsNameShow.replace(new RegExp(",", "gm"), "、");
                    }
                }
                //从弹框中删除的教师，还要去设置页面中的selected属性
                angular.forEach($scope.teacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        if (q.userId == row.userId) {
                            q.selected = false;
                        }
                    });
                });
            }

            /**
             * 查询teacher列表
             * @param tableState
             */
            $scope.teacherFilter = {};
            function getTeacherLists(tableState) {
                $scope.taacherListsTableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                //The very deep wounds!
                CustomerStudentCourseService.getCSShooleTeacherByFiltersNew(start, number, tableState, $scope.teacherFilter).then(function (result) {
                    $scope.teacherLists = result.data.studentTeachers.list;
                    $scope.taacherListsTableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                });
            }

            /**
             * 此方法 子类调用该方法
             */
            function selectedPersons() {
                //每次打开modal时，需要清空一下搜索条件
                $scope.teacherFilter = {};
                $scope.modalTitle = "选择要查询的教师";
                $scope.modal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.selectedTeachers.html',
                    show: true
                });
                /*	因为在页面中已经将校区各个学科对应的教师都列出来，所以这里不再预设查询教师时 为本校区教师了
                 * getSchools(function(){
                 var departmentName  = $scope.teacherFilter.departmentName;
                 $scope.teacherFilter = {
                 departmentName:departmentName
                 };
                 });*/

            }

            //teacherFilter.departmentName
            function getSchools(callback) {
                /*filter.id = localStorageService.get('school_id');*/
                var promise = DepartmentService.list(AuthenticationService.currentUser().organization.id);
                /* var promise = DepartmentService.getDepartmentByFilter(filter);*/
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal(response.data, "请重试", "error");
                        return false;
                    }
                    else {
                        var list = response.data;
                        if (list != null) {
                            $scope.teacherFilter.departmentName = list[0].name;
                            setTimeout(function () {
                                angular.element('#departmentName1').val(list[0].name);//无法回显  只能强制捆绑显示
                            }, 1000);

                        }
                        callback();
                    }
                });
            }

            /**
             * 得到所有的科目 查询条件
             */
            function getAllSubject() {
                // 获取科目信息
                CustomerStudentCourseService.getAllSubject().then(function (result) {
                    oThis.allSubject = result;
                });
            }

            /**
             * 返回
             */
            function back() {
                $location.path("/sos-admin/course_plan");
            }

            /**
             * 初始化参数
             * @private
             */
            function _init_date() {
                $scope.selected = {
                    persons: []//查询teacher列表
                    , personsName: []//查询回显teacher列表
                    , personsNameShow: ''
                    , timeLists: []//显示时间
                    , isShowAm: true//是否显示上午
                    , isShowPm: true//是否显示下午
                    , isShowNight: true//是否显示晚上
                    , isShowPlanTimes: true//是否显示已排时间
                    , isShowNotPlanTimes: true//是否显示未排时间
                    , isShowAPlanTimes: true//是否显示已消课时间
                    , isShowNoPlanTimes: true//是否显示未消课时间
                    , isWeekShow: true//是否按周显示  “isDayShow”与“isWeekShow”互斥
                    , isDayShow: false//是否按天显示  “isDayShow”与“isWeekShow”互斥
                    , dayShowOfWeek: 1//按天显示 选择星期几，默认是星期一
                    , isSelectedData: false//是否有查询数据
                    , selectedType: 1//1 表示教师查询   2 表示学生查询
                };
                getAllSubject();//查询条件初始化
            }

            $scope.checkItem = function (teacher) {
                checkedTeacher(teacher);
            }

                ;
            (function init() {
                _init_date();//初始化参数
                var path = $location.absUrl();
                if (path.indexOf("sos-admin/teacher_times_id") > 0) {
                    oThis.checkedTeacher({
                        crm_student_id: $routeParams.id,
                        username: $routeParams.name
                    })
                }
                //查询校区各个科目对应的教师
                var filter = {};
                TeacherService.getTeachersGroupBySubject(filter).then(function (response) {
                    $scope.teacherGroup = response.data.data;
                    //因为按钮长度限制4个汉字，所以在这里需要处理一下名字超过4个汉字的
                    angular.forEach($scope.teacherGroup, function (p, Pindex) {
                        angular.forEach(p.teachers, function (q, Qindex) {
                            if (q.username.length > 4) {
                                q.nameDisplay = q.username.substring(0, 4);
                            }
                            else {
                                q.nameDisplay = q.username;
                            }
                        });
                    });
                });
            })();
        }
    ])
    .controller('TimesController', ['$scope', '$modal', '$rootScope', '$location', 'SweetAlert', 'TeacherService', 'AuthenticationService',
        function ($scope, $modal, $rootScope, $location, SweetAlert, TeacherService, AuthenticationService) {

            var oThis = this;
            var ONE_DAY = 1000 * 60 * 60 * 24;//常量 表示一天的时间戳
            oThis.selectedPersons = selectedPersons;

            oThis.checkedShowCycle = checkedShowCycle;
            oThis.selectPersons = selectPersons;//向后台查询
            $scope.getTeacherTimes = _getTeacherTimes;
            oThis.getTeacherTimes = getTeacherTimes;
            oThis.resetSelectPersons = resetSelectPersons;//重置查询条件
            oThis.showWeek = showWeek;//显示汉字当前星期几
            oThis.showPlanDetail = showPlanDetail;

            $scope.isShowPlan = isShowPlan;//前端控制是否显示
            $scope.getBackTime = getBackTime;//往后按钮
            $scope.getForwardTime = getForwardTime;//向前 按钮
            $scope.getCurrentTimes = getCurrentTimes;//得到当前 按钮

            $scope.showExplainModal = showExplainModal;
            $scope.toolTipUrl = 'partials/toolTip/tipHTML/school.html?v=' + new Date().getTime()

            function showExplainModal() {
                $scope.explainTitle = '时间表图形说明';
                $scope.planTimeModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.planTimeExplain.html',
                    show: true
                });
            }


            function checkedShowCycle(type) {
                if (type == 'week') {
                    $scope.selected.isWeekShow = true;
                    $scope.selected.isDayShow = false;
                } else if (type == 'day') {
                    $scope.selected.isWeekShow = false;
                    $scope.selected.isDayShow = true;
                }
            }
            function initTimeIsShow() {
                if ($scope.selected.isShowAPlanTimes) {
                    angular.element('.time-item-2').show()
                } else {
                    angular.element('.time-item-2').hide()
                }
                if ($scope.selected.isShowNoPlanTimes) {
                    angular.element('.time-item-1').show()
                } else {
                    angular.element('.time-item-1').hide()
                }
            }
            $scope.timeIsShow = function timeIsShow(arg) {
                switch (arg) {
                    case 'am':
                        $scope.selected.isShowAm = !$scope.selected.isShowAm
                        break;
                    case 'pm':
                        $scope.selected.isShowPm = !$scope.selected.isShowPm
                        break;
                    case 'nt':
                        $scope.selected.isShowNight = !$scope.selected.isShowNight
                        break;
                    case 'yes':
                        $scope.selected.isShowPm = !$scope.selected.isShowPm
                        break;
                    case 'no':
                        $scope.selected.isShowNight = !$scope.selected.isShowNight
                        break;
                    case 1:
                        timeItemTrigg(arg, arguments[1])
                        break;
                    case 2:
                        timeItemTrigg(arg, arguments[1])
                        break;
                }
                function timeItemTrigg(arg, key) {
                    $scope.selected[key] = !$scope.selected[key]
                    if ($scope.selected[key]) {
                        angular.element('.time-item-' + arg).show()
                    } else {
                        angular.element('.time-item-' + arg).hide()
                    }
                }
            }
            /**
             * 向后台查询
             */
            function selectPersons() {

                if ($scope.selected.isDayShow && !$scope.selected.dayShowOfWeek) {
                    SweetAlert.swal("必须选择一个日期！");
                    return false
                }
                if (!$scope.selected.isShowAm && !$scope.selected.isShowPm && !$scope.selected.isShowNight) {
                    SweetAlert.swal("必须选择一个时间段（上午，下午或晚上）！");
                    return false;
                }
                if (arguments.length > 0) {
                    $scope.toolTipUrl = arguments[0] == 's' ? ('partials/toolTip/tipHTML/student.html?v=' + new Date().getTime()) : ('partials/toolTip/tipHTML/teacher.html?v=' + new Date().getTime())
                }
                //计算出需要显示的日期
                _setSelectedPersons();

                _setRequestDate();
                /* oThis._requestDate = {
                 isShowType:'day'  //day  week
                 }*/
                if ($scope.selected.isWeekShow) {
                    oThis._requestDate.isShowType = 'week';
                } else if ($scope.selected.isDayShow) {
                    oThis._requestDate.isShowType = 'day';

                    console.log($scope.selected.dayShowOfWeek)
                }


                /*   console.log($scope.selected);
                 console.log(oThis.requestDate);*/
                /*    oThis.requestDate.personsID = [35,6963];*/

                _getTeacherTimes();

            }

            function _getTeacherTimes() {
                //TODO 查询后台数据
                oThis.getTeacherTimes(function (data) {
                    $scope.selected.isSelectedData = true;
                    $scope.personsData = data.data.data;
                    console.log($scope.personsData)
                    /*setTimeout(function () {
                        $("[data-toggle='tooltip']").tooltip();
                    }, 1000)*/
                });
            }

            /**
             * TODO：获取校区时间表
             */
            $scope.thisTime = new Date()    //  存储获取校区时间表的临时时间
            /**
             * 计算前一天
             */
            /**
             * 返回日期
             * @param arg
             * @returns {number}
             */
            $scope.getSchoolsTimes = getSchoolsTimes
            $scope.SchoolTimes = ''
            function getDate(arg) {
                var oneDay = 24 * 60 * 60 * 1000,
                    beforeAndAfer = arg * oneDay,
                    atLast = $scope.thisTime.getTime() + beforeAndAfer
                return new Date(atLast)
            }
            function getSchoolsTimes(arg) {
                if (arg) {
                    $scope.thisTime = getDate(arg)
                    $scope.timeNow = false
                } else if (arg == 0) {
                    $scope.thisTime = new Date()
                } else {
                    $scope.timeNow = true
                }
                var reqData = {
                    timeLists: [new Date(getFormatData($scope.thisTime)).getTime() - 8 * 60 * 60 * 1000]
                }
                TeacherService.getSchoolsTimes(reqData).then(function (result) {
                    $scope.SchoolTimes = result.data.data[0].persons[0].noon[0]
                    setTimeout(function () {
                        initTimeIsShow()
                    }, 0)
                    if ($scope.SchoolTimes != '') {
                        for (var i = 0; i < $scope.SchoolTimes.afternoon.t12oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.afternoon.t12oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.afternoon.t12oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t12oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.afternoon.t12oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t12oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.afternoon.t14oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.afternoon.t14oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.afternoon.t14oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t14oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.afternoon.t14oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t14oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.afternoon.t16oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.afternoon.t16oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.afternoon.t16oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t16oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.afternoon.t16oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.afternoon.t16oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.forenoon.t6oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.forenoon.t6oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.forenoon.t6oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t6oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.forenoon.t6oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t6oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.forenoon.t8oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.forenoon.t8oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.forenoon.t8oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t8oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.forenoon.t8oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t8oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.forenoon.t10oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.forenoon.t10oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.forenoon.t10oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t10oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.forenoon.t10oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.forenoon.t10oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.night.t18oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.night.t18oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.night.t18oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.night.t18oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.night.t18oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.night.t18oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }
                        for (var i = 0; i < $scope.SchoolTimes.night.t20oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.night.t20oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.night.t20oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.night.t20oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.night.t20oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.night.t20oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }

                        for (var i = 0; i < $scope.SchoolTimes.night.t22oclock.length; i++) {
                            if (typeof ($scope.SchoolTimes.night.t22oclock[i].start_time) == 'string') {
                                $scope.SchoolTimes.night.t22oclock[i].start_time = new Date(Date.parse($scope.SchoolTimes.night.t22oclock[i].start_time.replace(/-/g, "/")));
                                $scope.SchoolTimes.night.t22oclock[i].end_time = new Date(Date.parse($scope.SchoolTimes.night.t22oclock[i].end_time.replace(/-/g, "/")));
                            }
                        }

                    }

                }, function (result) {
                    SweetAlert.swal('失败' + result.data);
                })
                console.log($scope.SchoolTimes)
            }
            /**
             * 计算出需要显示的日期
             * @private
             */
            function _setSelectedPersons() {
                if ($scope.selected.isWeekShow) {//按周查看
                    $scope.selected.timeLists = [];//清空 需要显示的时间戳
                    var monOfWeek = _getOneWeekMon();//星期一零点的时间戳
                    for (var i = 0; i < 7; i++) {//准备 查询七天的时间戳
                        Array.prototype.push.call($scope.selected.timeLists, monOfWeek + i * ONE_DAY);//每次遍历 添加一天的时间戳
                    }
                } else if ($scope.selected.isDayShow) {//按天查看
                    $scope.selected.timeLists = [];//清空 需要显示的时间戳
                    var firstOwnWeek = _getFirstOwnWeek();//到第一个选择天选择星期几的时间戳
                    for (var i = 0; i < 7; i++) {//准备 查询七天的时间戳
                        Array.prototype.push.call($scope.selected.timeLists, firstOwnWeek + i * ONE_DAY * 7);//每次遍历 添加一周的时间戳
                    }
                }
            }

            /**
             * 设置request参数
             * personsID  timeLists
             * @private
             */
            function _setRequestDate() {
                /* oThis.reques tDate = {//请求参数
                 personsID:[],
                 timeLists:[]
                 }*/
                oThis.requestDate.personsID = [];
                oThis.requestDate.timeLists = [];

                var lists = $scope.selected.persons;
                for (var i = 0; i < lists.length; i++) {
                    if (lists[i].userId) {
                        Array.prototype.push.call(oThis.requestDate.personsID, lists[i].userId);
                    } else {//user_id
                        Array.prototype.push.call(oThis.requestDate.personsID, lists[i].crm_student_id);
                    }

                }

                oThis.requestDate.selectedType = $scope.selected.selectedType || 1;

                oThis.requestDate.timeLists = angular.copy($scope.selected.timeLists);


            }

            /**
             * 得到当前星期的星期一
             * @private 返回星期一零点的时间戳
             */
            function _getOneWeekMon() {
                var today = _getToday();
                var dateOfWeekInt = _getDay();//得到当前 星期几（1-7 表示 星期一到星期天）
                if (dateOfWeekInt == 0) {//如果是周日
                    dateOfWeekInt = 7;
                }
                return today - ONE_DAY * (dateOfWeekInt - 1);//星期一零点的时间戳
            }

            /**
             * 得到第一个选择天选择星期几的时间戳
             * @private
             */
            function _getFirstOwnWeek() {

                var dateOfWeekInt = _getDay();//得到当前 星期几（1-7 表示 星期一到星期天）
                var selectedDay = parseInt($scope.selected.dayShowOfWeek, 10);
                //判断当前星期是否已经过去
                if (selectedDay >= dateOfWeekInt) {//如果未过去
                    return _getToday() + ONE_DAY * (selectedDay - dateOfWeekInt);//当前0点时间戳 + 相差的时间戳
                } else {//如果已经过去 从下周开始
                    return _getToday() - ONE_DAY * (dateOfWeekInt - selectedDay) + ONE_DAY * 7;//当前0点时间戳 - 相差的时间戳 + 一周的时间戳
                }
            }

            /**
             * 得到 当前0点的时间戳
             * @returns {Date}
             */
            function _getToday() {
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);

                return today.getTime();
            }

            /**
             * 得到当前 星期几（1-7 表示 星期一到星期天）
             * @private
             */
            function _getDay() {
                var dateOfWeek = new Date().getDay();//返回当前日期的在当前周的某一天（0～6--周日到周一）
                var dateOfWeekInt = parseInt(dateOfWeek, 10);//转换为整型,

                if (dateOfWeekInt == 0) {//如果是周日
                    dateOfWeekInt = 7;
                }
                return dateOfWeekInt;
            }

            /**
             * 通过时间戳得到当前星期几
             * @param timestamp
             * @returns {Number}
             * @private
             */
            function _getDayByTimestamp(timestamp) {
                var dateOfWeek = new Date(timestamp).getDay();//返回当前日期的在当前周的某一天（0～6--周日到周一）
                var dateOfWeekInt = parseInt(dateOfWeek, 10);//转换为整型,

                if (dateOfWeekInt == 0) {//如果是周日
                    dateOfWeekInt = 7;
                }
                return dateOfWeekInt;
            }

            /**
             * 查询教师时间
             * @param callback  回调函数
             */
            function getTeacherTimes(callback) {
                //判断当前用户是否为教师，如果是教师，那么预设一个用户id
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER) {
                    oThis.requestDate.personsID = [];
                    oThis.requestDate.personsID.unshift(AuthenticationService.currentUser().id);
                }
                var requestDate = angular.copy(oThis.requestDate);
                TeacherService.getTeacherTimes(requestDate, $scope.st, $scope.s_id).then(function (result) {
                    callback(result);
                }, function (result) {
                    SweetAlert.swal('失败' + result.data);
                })
            }

            $scope.refreshCoursePlan = function () {
                _getTeacherTimes();
            }

            function resetSelectPersons() {
                $scope.initDate();
                //判断当前用户是否为教师，如果是教师，那么预设一个用户id
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER) {
                    Array.prototype.push.call(oThis.requestDate.personsID, AuthenticationService.currentUser().id);
                    $scope.selected.personsNameShow = $rootScope.currentUser.name;
                }
                //从弹框中删除的教师，还要去设置页面中的selected属性
                angular.forEach($scope.teacherGroup, function (p, Pindex) {
                    angular.forEach(p.teachers, function (q, Qindex) {
                        q.selected = false;
                    });
                });
            }

            function showWeek(row) {
                var int = _getDayByTimestamp(row);
                if (int == 1) {
                    return '星期一';
                } else if (int == 2) {
                    return '星期二';
                } else if (int == 3) {
                    return '星期三';
                } else if (int == 4) {
                    return '星期四';
                } else if (int == 5) {
                    return '星期五';
                } else if (int == 6) {
                    return '星期六';
                } else if (int == 7) {
                    return '星期日';
                } else {
                    return '星期未知';
                }

            }

            function showPlanDetail(row) {
                $scope.planTimeModalData = row;
                $scope.modalTitle = '详情';
                $scope.planTimeModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/coursePlan/modal.planTimeDetail.html',
                    show: true
                });
            }


            /**
             * 选择需要查询教师或者学生
             */
            function selectedPersons() {

                $scope.selectedPersons();//调用父类的方法
            }

            function isShowPlan(plan) {
                if (plan.pasttype == 1 || plan.pasttype == 2 || plan.pasttype == 5 || plan.pasttype == 6 || plan.pasttype == 7 || plan.pasttype == 8) {//pasttype：1未消课，2已消课  3,未排课
                    if ($scope.selected.isShowPlanTimes) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (plan.pasttype == 3 || plan.pasttype == 4) {
                    if ($scope.selected.isShowNotPlanTimes) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (plan.pasttype == 4 || plan.pasttype == 5 || plan.pasttype == 6 || plan.pasttype == 7 || plan.pasttype == 8) {
                    return true;
                }
            }


            function getBackTime() {
                _setSelectedTimes('add');
                _getTeacherTimes();
            }

            function getForwardTime() {
                _setSelectedTimes('subtract');
                _getTeacherTimes();
            }

            function getCurrentTimes() {
                _setSelectedPersons()
                oThis.requestDate.timeLists = $scope.selected.timeLists;
                _getTeacherTimes();
            }

            /**
             * 处理 查询条件向前 往后
             * @param type add往后  subtract向前
             * @private
             */
            function _setSelectedTimes(type) {
                var distance = 0;
                var times = oThis.requestDate.timeLists;
                if (oThis._requestDate.isShowType == 'week') {
                    distance = 7 * ONE_DAY;
                } else if (oThis._requestDate.isShowType == 'day') {
                    distance = 49 * ONE_DAY;
                }
                if (type == 'add') {
                    for (var i = 0; i < times.length; i++) {
                        oThis.requestDate.timeLists[i] = times[i] + distance;
                    }
                } else if (type == 'subtract') {
                    for (var i = 0; i < times.length; i++) {
                        oThis.requestDate.timeLists[i] = times[i] - distance;
                    }
                }

            }

            /**
             * 判断当前登录用户是否为教师
             */

            if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER) {
                $scope._isTeacher = true;
            }

            /**
             * 判断当前登录用户是否为教务主管
             */
            $scope.isTeacherMaster = function () {
                var isTeacherMaster = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER_MASTER) {
                    isTeacherMaster = true;
                }
                return isTeacherMaster;
            }
            /**
             * 判断当前登录用户是否为课程顾问
             */
            $scope.isTeacherMaster2 = function () {
                var isTeacherMaster = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.COURSE_OFFICER) {
                    isTeacherMaster = true;
                }
                return isTeacherMaster;
            }
            /**
             * 判断当前登录用户是否为课程顾问主管|| 营销管培生
             */
            $scope.isTeacherMaster3 = function () {
                var isTeacherMaster = false;
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.COURSE_CHIEF_OFFICER) {
                    isTeacherMaster = true;
                }
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.YX_SHEN) {
                    isTeacherMaster = true;
                }
                return isTeacherMaster;
            }
            /*判断是否有排课'1.6.0'*/
            $scope.vDateTime = Date.now()
            $scope.isHasClass = function isHasClass(stutas) {
                if (arguments.length == 2) {
                    $scope.schoolClassDetail = true
                    return true
                }
                //无排课stutas==5 || stutas==6 || stutas==1 || stutas==2 || stutas==7 || stutas==8
                if (stutas == 5 || stutas == 6 || stutas == 1 || stutas == 2 || stutas == 7 || stutas == 8) {//stutas==5 || stutas==6 || stutas==0
                    return true
                } else {
                    //  有排课
                    return false
                }
            }

            /**
             * 初始化参数
             * @private
             */
            function _init_date() {
                oThis.requestDate = {//请求参数
                    personsID: [],
                    timeLists: [],
                    selectedType: 1// 1 表示教师查询   2 表示学生查询
                };
                $scope.show = {};
                oThis._requestDate = {
                    isShowType: 'day'  //day  week
                }
            }
            getSchoolsTimes()

                ;

            (function init() {
                _init_date();//初始化参数
                //判断当前用户是否为教师，如果是教师，那么预设一个用户id
                if (AuthenticationService.currentUser().position_id == Constants.PositionID.TEACHER) {
                    Array.prototype.push.call(oThis.requestDate.personsID, AuthenticationService.currentUser().id);
                    $scope.selected.personsNameShow = $rootScope.currentUser.name;
                    $scope.selected.isShowNotPlanTimes = false;
                    selectPersons();
                }
                if ($scope.dateTimeFlag == 1 && $scope.dateTimeModal) {
                    $scope.isSetTimeClass = 1
                    $scope.selected = {
                        isShowAm: 1,
                        isShowPm: 1,
                        isShowNight: 1,
                        persons: [$scope.dateTimeModal],
                        isShowPlanTimes: 1,
                        isShowNotPlanTimes: 1,
                        isWeekShow: true
                    }
                    selectPersons($scope.dateTimeFlag)
                    // checkedShowCycle('week')

                }
            })();

        }
    ])
    ;

/*$('#tableTime').hover(function () {
    console.log($(this))//'.table-time .mt-ul-time>li',
})
console.log($('#tableTime'))
angular.element('#tableTime').bind('hover',function () {
    console.log(1)
})*/
$(document).on('mouseenter', '.show-select', function () {
    var _this = $(this)
    _this.find('.mt-time-toolTip').css({
        top: _this.offset().top,
        left: (_this.offset().left + _this.width() + 3)
    }).show()
})
$(document).on('mouseleave', '.show-select', function () {
    $(this).find('.mt-time-toolTip').hide();
})
$(document).on('mouseenter', '.mt-tool-tip', function () {
    var _this = $(this)
    _this.find('.mt-time-toolTip').css({
        top: _this.offset().top,
        left: (_this.offset().left + _this.width() + 3)
    }).show()
})
$(document).on('mouseleave', '.mt-tool-tip', function () {
    $(this).find('.mt-time-toolTip').hide();
})
