'use strict';
/**
 * The order management controller.OrderAddController
 * @author sunqc@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp')
    .controller('selectCourseController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'OrderService', 'CommonService', 'ProductService',
        function ($scope, $modal, $rootScope, SweetAlert, OrderService, CommonService, ProductService) {
            //===========================*****************************选择课程xxx
            $scope.chooseOne = {};
            $scope.showSingle = false;
            // 授课方式
            $scope.teachingStyles = [{name: '一对一', id: 1}, {name: '一对二', id: 2}, {name: '一对三', id: 3}, {
                name: '班课',
                id: 4
            }, {name: '其他', id: 5}];
            ;
            $scope.$on("chooseOne", function (event, row) {
                    $scope.chooseOne = row;
                    if (row.is_fullsubject == 1) {
                        $scope.showSingle = true;
                    } else {
                        $scope.chooseOne.subjects = [];
                        //不显示弹框选科目同时默认增加一条课程记录
                        $scope.showSingle = false;
                        var subjectObj = {};
                        subjectObj.id = row.subjectId;
                        subjectObj.name = row.subject_name;
                        $scope.chooseOne.subjects.push(subjectObj);
                        $scope.doSelectOneCourse();
                    }
                }
            );
            $scope.cancelSingle = function () {
                $scope.showSingle = false;
            };

            $scope.setOneCourseSubject = function (row, subject) {
                if (row.subjects && row.subjects.length > 0) {

                } else {
                    row.subjects = [];
                    row.subjectName = [];
                }
                if ($scope.isCheckedSubject(row, subject)) {//如果选中
                    var num = _isCheckedSubjectNum(row, subject);
                    row.subjects.splice(num, 1);
                    row.subjectName.splice(num, 1);
                    ;
                    row.showSubjectName = row.subjectName.toString();
                } else {
                    row.subjects.push(subject);
                    row.subjectName.push(subject.name);
                    row.showSubjectName = row.subjectName.toString();
                }
            };

            $scope.selectCourse = function selectCourse(index, flag) {

                $scope.$parent.initCindex(index)
                $scope.selectCourseTitle = '选择课程';
                $scope.selectCourseModal = $modal({
                    scope: $scope,
                    templateUrl: 'partials/sos/order/modal.selectCourse.html',
                    show: true
                });
                $scope.getProductIdModal();
            };
            /**
             * 准备购买课程设置科目
             * @param row
             * @param subject
             */
            $scope.preSetDate = []
            $scope.preSetCourseSubject = function (row, subject) {
                if ($scope.isCheckedSubject(row, subject)) {//如果选中
                    var num = _isCheckedSubjectNum(row, subject);
                    $scope.preSetDate.splice(num, 1)
                } else {
                    $scope.preSetDate.push({row: row, subject: subject})
                }
            }
            /**
             * 购买课程设置科目
             * @param row
             * @param subject
             */
            $scope.preRow = []
            $scope.setCourseSubject = function (row, subject) {
                if (row.subjects && row.subjects.length > 0) {

                } else {
                    row.subjects = [];
                    row.subjectName = [];
                }
                if ($scope.isCheckedSubject(row, subject)) {//如果选中
                    var num = _isCheckedSubjectNum(row, subject);
                    row.subjects.splice(num, 1);
                    row.subjectName.splice(num, 1);
                    ;
                    row.showSubjectName = row.subjectName.toString();
                } else {
                    row.subjects.push(subject);
                    row.subjectName.push(subject.name);
                    row.showSubjectName = row.subjectName.toString();
                    $scope.preRow.push(subject)
                }
            }
            $scope.isCheckedSubject = function (row, subject) {
                if (!row.subjects) {
                    return false;
                }
                var list = angular.copy(row.subjects);
                for (var i = 0; i < list.length; i++) {
                    if (subject.id == list[i].id) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * 得到被选中的下标
             * @param row
             * @param subject
             * @returns {number}
             */
            function _isCheckedSubjectNum(row, subject) {
                if (!row.subjects) {
                    return 0;
                }
                var list = angular.copy(row.subjects);
                for (var i = 0; i < list.length; i++) {
                    if (subject.id == list[i].id) {
                        return i;
                    }
                }
                return 0;
            }

            $scope.getProductIdModal = function getProductIdModal() {

                CommonService.getOffLineProductIdSelect().then(function (result) {
                    $scope.productIdsModal = result.data;
                    //console.log($scope.productIdsModal);
                });
                $scope.gradeIdsModal = [];
                $scope.courseTypeIdsModal = [];
            };

            $scope.onProductIdModal = function onProductIdModal() {
                $scope.gradeIdsModal = [];
                $scope.courseTypeIdsModal = [];
                var params = {};
                params.productId = $scope.CourseListFilter.productTypeId;
                OrderService.getCourseTypeIdSelect(params).then(function (result) {
                    $scope.courseTypeIdsModal = result.data;
                });
            };

            $scope.onCourseTypeIdModal = function onCourseTypeIdModal() {
                $scope.gradeIdsModal = [];
                var params = {};
                params.courseTypeId = $scope.CourseListFilter.course_type_id;
                OrderService.getGradeIdSelect(params).then(function (result) {
                    $scope.gradeIdsModal = result.data;
                });
            };

            $scope.CourseList = [];//课程列表数据
            $scope.CourseListFilter = {};//课程列表过滤条件
            $scope.CourseListTableState = {};//课程列表分页条件
            $scope.isCourseListLoading = true;
            $scope.getCourseList = function (tableState) {
                $scope.CourseListTableState = tableState;
                $scope.isCourseListLoading = true;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.CourseListFilter.offLine = "offLine";
                ProductService.getCourseList(start, number, tableState, $scope.CourseListFilter).then(function (result) {

                    console.dir(result.data);
                    //$scope.getAllSelected();
                    $scope.CourseList = result.data;
                    tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    $scope.CourseListTableState = tableState;
                    $scope.isCourseListLoading = false;
                });
            };
            $scope.selected = {};
            $scope.selected.courses = [];

            $scope.deleteSelectedAllCourses = function () {
                $scope.selected.courses = [];
                $scope.countCourse = false
            };
            $scope.isCourseSelected = function (row) {
                var list = angular.copy($scope.selected.courses);
                for (var i = 0; i < list.length; i++) {
                    if (row.id == list[i].id) {
                        return true;
                    }
                }
                return false;
            };
            $scope.countCourse = false
            $scope.isCourseSelectedAll = function isCourseSelectedAll() {
                $scope.$flag = $scope.countCourse
                for (var i = 0, len = $scope.CourseList.length; i < len; i++) {
                    /*修复bug @李世明 2016-12-10 防止某一页已经全部选中翻页后继续选择，直接提示*/
                    if ($scope.countCourse && !$scope.isCourseSelected($scope.CourseList[i])) {
                        SweetAlert.swal("最多只能添加10种课程");
                        return false;
                    }
                    var flag = $scope.selectOneCourse($scope.CourseList[i], 1)
                    /*if(flag==false){
                     $scope.countCourse++
                     }*/
                }
                // return ($scope.countCourse = $scope.countCourse?false:true)
                $scope.countCourse = !$scope.countCourse
                return $scope.countCourse
            }
            /**
             * 监控选择状态，是否全选，angular监控对象属性变更列子
             */
            $scope.$watch('selected', function (newValue, oldValue) {
                if (newValue.courses.length == 10) {
                    $scope.countCourse = true
                } else {
                    $scope.countCourse = false
                }
            }, true)
            /**
             * 处理单个
             * @param row
             * @param flag
             * 如果传1则规定是从全选中调用函数，需要特殊处理
             * @returns {boolean}
             */
            $scope.selectOneCourse = function (row, flag) {
                if ($scope.isCourseSelected(row)) {
                    //如果全选处理那么当当前状态为选中时则移除处理
                    if (flag == 1 && $scope.$flag || !flag) {
                        $scope.deleteOneCourse(row);
                    }
                    return false;
                }
                if ($scope.selected.courses && $scope.selected.courses.length >= 10) {
                    SweetAlert.swal("最多只能添加10种课程");
                    return false;
                }
                if (row.is_fullsubject != 1) {
                    var subjectObj = {};
                    row.subjects = [];
                    subjectObj.id = row.subjectId;
                    subjectObj.name = row.subject_name;
                    row.subjects.push(subjectObj);
                    row.showSubjectName = row.subject_name;
                    $scope.preRow.push(subjectObj);
                }
                $scope.addOneCourse(row);


            };

            $scope.addOneCourse = function (row) {
                /**
                 * 解决删除后再次选中后自动带入科目
                 */
                if (row.is_fullsubject) {
                    if (row.subjects && row.subjects.length) {
                        row.subjects.length = 0
                    }
                    if (row.subjectName && row.subjectName.length) {
                        row.subjectName.length = 0
                    }
                    row.showSubjectName = null
                }
                Array.prototype.push.call($scope.selected.courses, row);
            };

            $scope.deleteOneCourse = function (row) {
                var list = $scope.selected.courses;
                for (var i = 0; i < list.length; i++) {
                    if (row.id == list[i].id) {
                        for (var si = 0; si < list[i].length; si++) {
                            for (var pi = 0; pi < $scope.preRow.length; pi++) {
                                if ($scope.preRow[pi].id = list[i].subjects[si].id) {
                                    Array.prototype.splice.call($scope.preRow, pi, 1)
                                }
                            }
                        }
                        Array.prototype.splice.call(list, i, 1);
                        return false;
                    }
                }
            };

            $scope.doSelectCourse = function () {

                if ($scope.selected.courses.length <= 0) {
                    SweetAlert.swal("没有选定课程");
                    return;
                }

                var tmpGradeId = $scope.selected.courses[0].gradeId;
                for (var i = 0; i < $scope.selected.courses.length; i++) {
                    var course = $scope.selected.courses[i];
                    if (course.gradeId != tmpGradeId) {
                        SweetAlert.swal("课程年级不一致");
                        return;
                    }
                }
                // for(var i=0;i<$scope.selected.courses.length;i++){
                //     var course = $scope.selected.courses[i];
                //     if( course.gradeId != tmpGradeId ){
                //         SweetAlert.swal("课程年级不一致");
                //         return;
                //     }
                // }


                for (var i = 0; i < $scope.selected.courses.length; i++) {
                    var course = $scope.selected.courses[i];
                    if (!(course.subjects) || course.subjects.length <= 0) {
                        SweetAlert.swal("有课程没有指定科目，请选择或者删除");
                        return;
                    }
                }

                $scope.$emit("arrangeOneCourseTeacher", "老师列表");

                var list = [];
                for (var i = 0; i < $scope.selected.courses.length; i++) {
                    var course = $scope.selected.courses[i];

                    if (course.subjectType == 3) {
                        var courseBuyUnit = null;
                        if (course.isRegularCharge) {
                            courseBuyUnit = 3;
                        } else if (!course.isRegularCharge && course.courseUnit == 1) {
                            courseBuyUnit = 1;
                        } else if (!course.isRegularCharge && course.courseUnit == 2) {
                            courseBuyUnit = 2;
                        }
                        var subjectName = '';
                        for (var j = 0; j < course.subjects.length; j++) {
                            if (j == course.subjects.length - 1) {
                                subjectName += course.subjects[j].name;
                            } else {
                                subjectName += course.subjects[j].name + ',';
                            }
                        }
                        var obj = {
                            'originalNum': 0,
                            'courseId': course.id,
                            'courseName': course.name,
                            'gradeId': course.gradeId,
                            'courseTypeId': course.courseTypeId,
                            'gradeName': course.gradeName,
                            'courseTypeName': course.courseTypeName,
                            'subjectName': subjectName,
                            'standardPrice': course.standardPrice,
                            'actualPrice': 0,
                            'teacherId': course.teacherId,
                            'isAudition': 0,
                            'isCourseAudition': 0,
                            'teachingStyle': course.teachingStyle,
                            'courseProperty': 1,
                            'studentClassId': null,
                            'studentClassName': '',
                            'courseUnit': course.courseUnit,
                            'isRegularCharge': course.isRegularCharge,
                            'regularTimes': course.regularTimes,
                            'courseBuyUnit': courseBuyUnit,
                            'subjects': course.subjects,
                            'subjectType': course.subjectType
                        };
                        list.push(obj);
                    } else {
                        for (var j = 0; j < course.subjects.length; j++) {
                            var subject = course.subjects[j];
                            var cp = 0;
                            if (subject.id == zengKeSubjectFlag) {
                                cp = 2;
                            } else {
                                cp = 1;
                            }
                            var courseBuyUnit = null;
                            if (course.isRegularCharge) {
                                courseBuyUnit = 3;
                            } else if (!course.isRegularCharge && course.courseUnit == 1) {
                                courseBuyUnit = 1;
                            } else if (!course.isRegularCharge && course.courseUnit == 2) {
                                courseBuyUnit = 2;
                            }
                            var obj = {
                                'originalNum': 0,
                                'courseId': course.id,
                                'courseName': course.name,
                                'gradeId': course.gradeId,
                                'courseTypeId': course.courseTypeId,
                                'subjectId': subject.id,
                                'gradeName': course.gradeName,
                                'courseTypeName': course.courseTypeName,
                                'subjectName': subject.name,
                                'standardPrice': course.standardPrice,
                                'actualPrice': 0,
                                'teacherId': course.teacherId,
                                'isAudition': 0,
                                'teachingStyle': course.teachingStyle,
                                'isCourseAudition': 0,
                                'courseProperty': cp,
                                'studentClassId': null,
                                'studentClassName': '',
                                'courseUnit': course.courseUnit,
                                'isRegularCharge': course.isRegularCharge,
                                'regularTimes': course.regularTimes,
                                'courseBuyUnit': courseBuyUnit,
                                'subjectType': course.subjectType
                            };
                            list.push(obj);
                        }
                    }
                }

                //console.log(list);
                $scope.$emit("arrangeCourse", list);
                $scope.selectCourseModal.hide();
            };

            $scope.doSelectOneCourse = function () {
                if (!($scope.chooseOne.subjects) || $scope.chooseOne.subjects.length <= 0) {
                    SweetAlert.swal("没有选定科目");
                    return;
                }

                $scope.$emit("arrangeOneCourseTeacher", "老师列表");

                var list = [];
                var course = $scope.chooseOne;

                if (course.subjectType != 3) {
                    for (var j = 0; j < course.subjects.length; j++) {
                        var subject = course.subjects[j];
                        var cp = 0;
                        if (subject.id == zengKeSubjectFlag) {
                            cp = 2;
                        } else {
                            cp = 1;
                        }
                        var courseBuyUnit = null;
                        if (course.isRegularCharge) {
                            courseBuyUnit = 3;
                        } else if (!course.isRegularCharge && course.courseUnit == 1) {
                            courseBuyUnit = 1;
                        } else if (!course.isRegularCharge && course.courseUnit == 2) {
                            courseBuyUnit = 2;
                        }
                        var obj = {
                            'originalNum': 0,
                            'courseId': course.id,
                            'courseName': course.name,
                            'gradeId': course.gradeId,
                            'courseTypeId': course.courseTypeId,
                            'subjectId': subject.id,
                            'gradeName': course.gradeName,
                            'courseTypeName': course.courseTypeName,
                            'subjectName': subject.name,
                            'standardPrice': course.standardPrice,
                            'actualPrice': 0,
                            'teacherId': course.teacherId,
                            'isAudition': 0,
                            'isCourseAudition': 0,
                            'courseProperty': cp,
                            'studentClassId': null,
                            'studentClassName': '',
                            'courseUnit': course.courseUnit,
                            'isRegularCharge': course.isRegularCharge,
                            'regularTimes': course.regularTimes,
                            'courseBuyUnit': courseBuyUnit
                        };
                        list.push(obj);
                    }
                } else {
                    var courseBuyUnit = null;
                    if (course.isRegularCharge) {
                        courseBuyUnit = 3;
                    } else if (!course.isRegularCharge && course.courseUnit == 1) {
                        courseBuyUnit = 1;
                    } else if (!course.isRegularCharge && course.courseUnit == 2) {
                        courseBuyUnit = 2;
                    }
                    var subjectName = '';
                    for (var j = 0; j < course.subjects.length; j++) {
                        if (j == course.subjects.length - 1) {
                            subjectName += course.subjects[j].name;
                        } else {
                            subjectName += course.subjects[j].name + ',';
                        }
                    }
                    var obj = {
                        'originalNum': 0,
                        'courseId': course.id,
                        'courseName': course.name,
                        'gradeId': course.gradeId,
                        'courseTypeId': course.courseTypeId,
                        'gradeName': course.gradeName,
                        'courseTypeName': course.courseTypeName,
                        'subjectName': subjectName,
                        'standardPrice': course.standardPrice,
                        'actualPrice': 0,
                        'teacherId': course.teacherId,
                        'isAudition': 0,
                        'isCourseAudition': 0,
                        'courseProperty': 1,
                        'studentClassId': null,
                        'studentClassName': '',
                        'courseUnit': course.courseUnit,
                        'isRegularCharge': course.isRegularCharge,
                        'regularTimes': course.regularTimes,
                        'courseBuyUnit': courseBuyUnit,
                        'subjects': course.subjects,
                        'subjectType': course.subjectType
                    };
                    list.push(obj);
                }

                $scope.$emit("arrangeCourse", list);
                $scope.showSingle = false;
            };
            $scope.isSlide = false
            $scope.showTriggar = function (index) {
                if (arguments.length && index >= 0) {
                    $scope.selected.courses[index].showSingle = true
                    $scope.$_index = index
                    // $scope.isSlide = !$scope.isSlide
                } else {
                    for (var i = 0, len = $scope.selected.courses.length; i < len; i++) {
                        $scope.selected.courses[i].showSingle = false
                    }
                    var $_index = $scope.$_index
                    if (index == -1 && $scope.selected.courses[$_index] && $scope.selected.courses[$_index].subjects && $scope.preRow) {
                        //  取消删掉之前添加的数据
                        // var sdata = $scope.selected.courses[$_index].subjects
                        for (var s = 0, slen = $scope.selected.courses[$_index].subjects.length; s < slen; s++) {
                            for (var r = 0, rlen = $scope.preRow.length; r < rlen; r++) {
                                if ($scope.selected.courses[$_index].subjects[s] && $scope.selected.courses[$_index].subjects[s].$$hashKey == $scope.preRow[r].$$hashKey) {
                                    for (var sn = 0, snlen = $scope.selected.courses[$_index].subjectName.length; sn < snlen; sn++) {
                                        if ($scope.selected.courses[$_index].subjects[s].name == $scope.selected.courses[$_index].subjectName[sn]) {
                                            $scope.selected.courses[$_index].subjectName.splice(sn, 1)
                                        }
                                    }
                                    $scope.selected.courses[$_index].subjects.splice(s, 1)
                                    $scope.selected.courses[$_index].showSubjectName = $scope.selected.courses[$_index].subjectName.toString();
                                }
                            }
                        }
                    }
                }
                $scope.isSlide = !$scope.isSlide
                $scope.preRow.length = 0
                //只封装一个科目信息供选择
                if ($scope.selected.courses[index] != undefined && !$scope.selected.courses[index].is_fullsubject) {
                    var subObj = {};
                    subObj.id = $scope.selected.courses[index].subjectId;
                    subObj.name = $scope.selected.courses[index].subject_name;
                    $scope.subjectIdsModal.length = 0
                    // 获取科目
                    CommonService.getSubjectIdSelect(subObj).then(function (result) {
                        $scope.subjectIdsModal = result.data;
                    });
                }
            }

            $scope.subjectIdsModal = [];
            $scope.getSubjectIdModal = function getSubjectIdModal() {
                CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIdsModal = result.data;
                });
            }();
            //============================*************************
        }
    ])
;
