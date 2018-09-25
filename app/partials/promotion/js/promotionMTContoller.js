/**
 * Created by 李世明 on 2017/1/17 0017.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:升班设置相关
 */

angular.module('ywsApp').controller('PromotionMTContoller',
    ['$scope', '$sce', '$rootScope', '$modal', '$mtModal', 'StuDetail', 'PromotionMTServer', 'ClassManagementService',
        'localStorageService', 'ProductService',
        function ($scope, $sce, $rootScope, $modal, $mtModal, StuDetail, PromotionMTServer, ClassManagementService,
                  localStorageService, ProductService) {
            var v = Date.now()
            $scope.tabels = StuDetail.init($scope, [
                {
                    title: '按班级设置',   //  tabel切换拦标题
                    url: 'partials/promotion/modal/byClass.html?' + v,
                    clickFun: function () {
                        _reastParam()
                    }
                },
                {
                    title: '按课程设置',
                    url: 'partials/promotion/modal/byCourse.html?' + v,
                    clickFun: function () {
                        _reastParam()
                    }
                }
            ])
            $scope.getByClassList = function (tableState) {
                tableState = tableState || {}
                tableState.pagination = tableState.pagination || {}
                $scope.byClassTableState = tableState;
                var searchModel = {};
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                searchModel.start = start;
                searchModel.size = number;
                searchModel.upgradeType = 1;
                searchModel.schoolId = localStorageService.get('department').id;
                searchModel.isDeleted = 0;
                var promise = PromotionMTServer.getPageList(searchModel);
                promise.then(function (response) {
                    $scope.byClassList = response.data.data.list;
                    tableState.pagination.numberOfPages = response.numberOfPages;
                });
            }
            $scope.getByCourseList = function (tableState) {
                tableState = tableState || {}
                tableState.pagination = tableState.pagination || {}
                $scope.byCourseTableState = tableState;
                var searchModel = {};
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                searchModel.start = start;
                searchModel.size = number;
                searchModel.upgradeType = 2;
                searchModel.schoolId = localStorageService.get('department').id;
                searchModel.isDeleted = 0;
                var promise = PromotionMTServer.getPageList(searchModel);
                promise.then(function (response) {
                    $scope.byClassList = response.data.data.list;
                    tableState.pagination.numberOfPages = response.numberOfPages;
                });
            }
            $scope.getSelectList = function (tableState) {
                tableState = tableState || {}
                tableState.pagination = tableState.pagination || {}
                //班级列表
                if ($scope._setType() === 0) {
                    $scope.selectClassTableState = tableState;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    var filter = {};
                    filter.schoolId = localStorageService.get('department').id;
                    filter.classType = 1;
                    filter.start = start;
                    filter.size = number;
                    filter.name = $.trim(angular.element('[ng-model="selectName"]').val()) || undefined;
                    filter.status = 0;
                    var promise = ClassManagementService.getClassesByFilter(filter);
                    promise.then(function (response) {
                        $scope.selectList = response.data.list;
                        tableState.pagination.numberOfPages = response.data.pages;
                    });
                }
                //课程列表
                else if ($scope._setType() === 1) {
                    $scope.selectCourseTableState = tableState;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;
                    var number = pagination.number || 10;
                    var promise = ProductService.getCourseList(start, number, tableState, $scope.CourseListFilter);
                    promise.then(function (response) {
                        $scope.selectList = response.data;
                        tableState.pagination.numberOfPages = response.numberOfPages;
                    });
                }
            }
            $scope.showSelectModal = function () {
                if ($scope._setType() === 0) {
                    $scope.selectModalTitle = '选择班级'
                } else if ($scope._setType() === 1) {
                    $scope.selectModalTitle = '选择课程'
                }
                $scope.selectModal = $mtModal.modal('partials/promotion/modal/selectModal.html', $scope)
            }
            $scope._setType = function _setType() {
                for (var i = 0, len = $scope.tabels.length; i < len; i++) {
                    if ($scope.tabels[i].select) {
                        return i
                    }
                }
            }
            $scope.addToList = function (arg) {
                //选中的学员
                $scope.stuList = []
                if(arg){
                    //为升班选择班级做准备
                    for(var i = 0 , len = $scope.byClassList.length ; i<len ; i++){
                        if($scope.byClassList[i].select){
                            $scope.stuList.push(angular.copy($scope.byClassList[i]))
                        }
                    }
                    //  如果一个学生都没有选中则提示警告框
                    if(!$scope.stuList.length){
                        $mtModal.moreModal({
                            scope:$scope,
                            text:'请先选择要升班的学员',
                            status:0
                        })
                        return false
                    }
                }else{
                    $scope.selected = angular.copy($scope.aSelected) || []
                }
                $scope.selectClassModal2 = $mtModal.modal('partials/promotion/modal/'+(arg?'selectClassUp':'selectClass')+'.html', $scope)
            }
            /**
             * 提交升班关系设置（按班级）
             */
            $scope.submitData = function () {
                /**
                 *
                 *
                 */
                if(!$scope.aSelected.length){
                    $mtModal.moreModal({
                        scope: $scope,
                        text: '请添加升班班级',
                        status: 0
                    })
                    return false
                }
                var data = {};
                data.schoolId = localStorageService.get('department').id;
                data.referenceId = $scope.classDetail.id;
                if ($scope._setType() === 0) { //按班级
                    data.upgradeType = 1;
                    data.classes = angular.copy($scope.aSelected);
                } else if ($scope._setType() === 1) { //按课程
                    data.upgradeType = 2;
                    data.courses = angular.copy($scope.aSelected);
                }
                var promise = PromotionMTServer.createOrUpdate(data);
                promise.then(function (response) {
                    $scope.addModal.hide()
                    if (response.data.status === 'SUCCESS') {
                        $mtModal.moreModal({
                            scope: $scope,
                            text: '操作成功',
                            status: 1
                        })
                        if ($scope._setType() === 0) { //按班级
                            $scope.getByClassList($scope.byClassTableState);
                        } else if ($scope._setType() === 1) { //按课程
                            $scope.getByCourseList($scope.byCourseTableState);
                        }
                    } else if (response.data.status === 'FAILURE') {
                        SweetAlert.swal('添加失败，请重试', 'error');
                    }
                    $scope.addModal.hide();
                    _refrash()
                });
            }
            /**
             * 提交审核参数配置
             */
            $scope.setParam = {}
            function _reastParam() {
                for (var key in $scope.setParam) {
                    if (key != 'crmStudentId') {
                        $scope.setParam[key] = ''
                    }
                }
                $scope.ClassListSelect = 0
            }

            $scope.addModalPre = function () {
                $scope.classDetail = null
                if ($scope.aSelected) {
                    $scope.aSelected.length = 0
                }
                if ($scope._setType() === 0) {
                    $scope.addModalTitle = '升班关系设置（按班级）'
                } else if ($scope._setType() === 1) {
                    $scope.addModalTitle = '升班关系设置（按课程）'
                }
                $scope.addModal = $mtModal.modal('partials/promotion/modal/addModal.html?' + v, $scope)
            }
            /**
             * 选择班级
             * @param index
             */
            $scope.selectClass = function (index) {
                for (var i = 0, len = $scope.selectList.length; i < len; i++) {
                    if (i == index) {
                        $scope.selectList[index].select = 1
                        $scope._classDetail_ = angular.copy($scope.selectList[index])
                    } else {
                        $scope.selectList[i].select = 0
                    }
                }
            }
            /**
             * 选择班级确定
             */
            $scope.determine = function () {
                $scope.classDetail = angular.copy($scope._classDetail_)
                var searchModel = {};
                searchModel.referenceId = $scope.classDetail.id;
                searchModel.start = 0;
                searchModel.size = 1;
                searchModel.isDeleted = 0;
                searchModel.schoolId = localStorageService.get('department').id;
                if ($scope._setType() === 0) { //按班级
                    searchModel.upgradeType = 1;
                } else if ($scope._setType() === 1) { //按课程
                    searchModel.upgradeType = 2;
                }
                PromotionMTServer.getPageList(searchModel).then(function (data) {
                    if (data.data.status === 'SUCCESS') {
                        $scope.selectList = data.data.data.list
                        if ($scope._setType() === 0) { //按班级
                            $scope.aSelected = $scope.selectList.length?$scope.selectList[0].classes:[]
                        } else if ($scope._setType() === 1) { //按课程
                            $scope.aSelected = $scope.selectList.length?$scope.selectList[0].courses:[]
                        }
                    } else {
                        $scope.selectList.length = 0
                    }
                })
                //需要查是否有升班信息
                $scope.selectModal.hide()
            }
            /**
             * 选择班级确定
             */
            $scope.determineMore = function () {
                $scope.aSelected = angular.copy($scope.selected)
                //需要检查能否升班
                var crmClassUpgradeReference = {};
                crmClassUpgradeReference.referenceId = $scope.classDetail.id;
                crmClassUpgradeReference.schoolId = localStorageService.get('department').id;
                var list = [];
                if ($scope._setType() === 0) { //按班级
                    crmClassUpgradeReference.upgradeType = 1;
                    crmClassUpgradeReference.classes = [];
                    angular.forEach($scope.aSelected, function (data, index, array) {
                        var selectObj = {};
                        selectObj.id = data.id;
                        selectObj.courseId = data.courseId;
                        selectObj.name = data.name;
                        list.push(selectObj);
                    });
                    crmClassUpgradeReference.classes = list;
                } else if ($scope._setType() === 1) { //按课程
                    crmClassUpgradeReference.upgradeType = 2;
                    crmClassUpgradeReference.courses = [];
                    angular.forEach($scope.aSelected, function (data, index, array) {
                        var selectObj = {};
                        selectObj.id = data.id;
                        selectObj.name = data.name;
                        list.push(selectObj);
                    });
                    crmClassUpgradeReference.courses = list;
                }
                var promise = PromotionMTServer.check(crmClassUpgradeReference);
                promise.then(function (response) {
                    $scope.aSelected = response.data.data;
                    $scope.selectClassModal2.hide()
                });
            }
            /*==================*/
            $scope.selected = [];

            $scope.deleteSelectedAllCourses = function () {
                $scope.selected = [];
                $scope.countCourse = false
            };
            $scope.isCourseSelected = function (row) {
                var list = angular.copy($scope.selected);
                for (var i = 0; i < list.length; i++) {
                    if (row.id == list[i].id) {
                        return true;
                    }
                }
                return false;
            };
            $scope.countCourse = 0
            $scope.isCourseSelectedAll = function isCourseSelectedAll() {
                $scope.$flag = $scope.countCourse
                for (var i = 0, len = $scope.selectList.length; i < len; i++) {
                    $scope.selectOneCourse($scope.selectList[i], 1)
                }
                $scope.countCourse = !$scope.countCourse
                // return $scope.countCourse
            }
            /**
             * 监控选择状态，是否全选，angular监控对象属性变更列子
             */
            $scope.$watch('selected', function (newVal, oldVal) {
                if (newVal.length == 10) {
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
                $scope.addOneCourse(row);


            };
            $scope.addOneCourse = function (row) {
                Array.prototype.push.call($scope.selected, row);
            };
            $scope.deleteOneCourse = function (row, arg) {
                var list = arg ? $scope.aSelected : $scope.selected;
                for (var i = 0; i < list.length; i++) {
                    if (row.id == list[i].id) {
                        Array.prototype.splice.call(list, i, 1);
                        return false;
                    }
                }
            };
            /**
             * 选择
             * @param row
             * 对象
             */
            $scope.selectClassList = function (row) {
                if (!row) {
                    for (var i = 0, len = $scope.byClassList.length; i < len; i++) {
                        $scope.selectClassList($scope.byClassList[i], !$scope.ClassListSelect)
                    }
                    $scope.ClassListSelect = !$scope.ClassListSelect
                } else if (arguments.length == 2) {
                    row.select = arguments[1]
                } else {
                    row.select = !row.select
                    var flag = 0
                    for (var j = 0, jlen = $scope.byClassList.length; j < jlen; j++) {
                        if ($scope.byClassList[j].select) {
                            flag++
                        }
                    }
                    $scope.ClassListSelect = flag === jlen ? 1 : 0
                }
            }
            /**
             * 删除操作
             */
            $scope.deleteClass = function () {
                var data = []
                for (var i = 0, len = $scope.byClassList.length; i < len; i++) {
                    if ($scope.byClassList[i].select) {
                        var obj = angular.copy($scope.byClassList[i])
                        delete obj.select
                        data.push(obj)
                    }
                }
                if (data.length) {
                    $mtModal.moreModal({
                        scope: $scope,
                        status: 0,
                        text: '您确定删除' + data.length + '条记录吗？',
                        hasNext: function () {
                            $scope.ClassListSelect = 0
                            var promise = PromotionMTServer.remove(data);
                            promise.then(function (response) {
                                if (response.data.status === 'SUCCESS') {
                                    // $scope.getByClassList($scope.byClassTableState);
                                    _refrash()
                                }
                            });
                            $scope.mtResultModal.hide()
                        }
                    })
                }
            }
            /**
             * 刷新
             * @private
             */
            var _refrash = function () {
                if ($scope._setType() == 0) {
                    $scope.getByClassList()
                } else {
                    $scope.getByCourseList()
                }
            }
            /**
             * 获取点名上课学员列表
             * @param tableState
             * @returns {boolean}
             */
            $scope.getCallNameStudents = function getCallNameStudents(tableState) {
                $scope.getCallNameStudentsTableState = tableState;
                var searchModel = {};
                searchModel.crmStudentClassId = $scope.upgradeClassDetail.id;
                searchModel.schoolId = localStorageService.get('department').id;
                $scope.pagination = tableState.pagination;
                $scope.start = $scope.pagination.start || 0;
                $scope.number = $scope.pagination.number || 10;
                searchModel.start = 0//$scope.start;TODO：暂时不分页，年后加分页
                searchModel.size = 0//$scope.number;
                var promise = PromotionMTServer.queryUpgradeStudentList(searchModel);
                promise.then(function (response) {
                    if (response.status == "FAILURE") {
                        SweetAlert.swal("获取入班学员失败，请重试", "error");
                        return false;
                    } else {
                        $scope.byClassList = response.data.data.list;
                        tableState.pagination.numberOfPages = response.data.data.pages;
                    }
                });
            }
            /**
             * 获取学员即将升班班级列表
             * @param tableState
             */
            $scope.queryUpgradeClassList = function (tableState) {
                tableState = tableState || {}
                tableState.pagination = tableState.pagination || {}
                $scope.queryUpgradeClassListList = tableState;
                var searchModel = {};
                var pagination = tableState.pagination;
                var start = pagination.start || 0;
                var number = pagination.number || 10;
                searchModel.start = start;
                searchModel.size = number;
                searchModel.schoolId = localStorageService.get('department').id;
                searchModel.isDeleted = 0;
                searchModel.name = $scope.selectName;
                searchModel.id = $scope.upgradeClassDetail.id;
                searchModel.courseId = $scope.upgradeClassDetail.courseId;
                var promise = PromotionMTServer.queryUpgradeClassList(searchModel);
                promise.then(function (response) {
                    $scope.selectList = response.data.data.list;
                    tableState.pagination.numberOfPages = response.numberOfPages;
                });
            }
            /**
             * 去确认升班
             */
            $scope.determineUp = function () {
                $scope.aSelected = angular.copy($scope.selected)
                if(!$scope.aSelected){
                    $mtModal.moreModal({
                        scope:$scope,
                        text:'请先选择升班班级',
                        status:0
                    })
                    return false
                }
                $scope.determineUpModal = $mtModal.modal('partials/promotion/modal/true.html',$scope)
            }
            /**
             * 提交并检查升班学员
             */
            $scope.determineCheack = function () {
                if(!$scope.stuList.length){
                    $mtModal.moreModalHtml({
                        text:'没有可提交的学员',
                        status:0,
                        scope:$scope,
                        hasNext:function () {
                            //  关闭确认框
                            $scope.determineUpModal.hide()
                            //  关闭选中班级框
                            $scope.selectClassModal2.hide()
                            $scope.mtResultModal.hide()
                        }
                    })
                    return false
                }
                if(!angular.element('#sTime').val()){
                    $mtModal.moreModal({
                        text:'请选择升班日期',
                        status:0,
                        scope:$scope
                    })
                    return false
                }
                PromotionMTServer.upgradeClass({
                    //    开办时间
                    upgradeDate:angular.element('#sTime').val()+' 00:00:00',
                    //    已选班级
                    classList:angular.copy($scope.aSelected),
                    //    已选学生
                    studentList:angular.copy($scope.stuList),
                    //    原班级id
                    referenceId:$scope.upgradeClassDetail.id
                }).then(function (data) {
                    if(data.data.data){
                        var studentList = data.data.data,
                            stuName = '',
                            _stuName = '',
                            _stuNameText = ''
                        for(var i = 0 , len = studentList.length ; i<len ; i++){
                            stuName += (i===len-1?studentList[i].studentName:(studentList[i].studentName + '、'))
                            for(var yi = 0, ylen = $scope.stuList.length ; yi<ylen ; yi++){
                                if(studentList[i].crmStudentId===$scope.stuList[yi].crmStudentId){
                                    $scope.stuList.splice(yi,1)
                                    ylen--
                                }
                            }
                        }
                        for(var yi = 0, ylen = $scope.stuList.length ; yi<ylen ; yi++){
                            _stuName += (yi===ylen-1?$scope.stuList[yi].studentName:($scope.stuList[yi].studentName + '、'))
                        }
                        _stuNameText = stuName+' 没有购买该课程，不能升班；\n'+(_stuName?(_stuName+' 升班成功'):'')
                    }
                    //成功
                    if(data.data.status === 'SUCCESS'&&!data.data.data){
                        $mtModal.moreModal({
                            text:'操作成功！',
                            status:1,
                            scope:$scope
                        })
                        //  关闭确认框
                        $scope.determineUpModal.hide()
                        //  关闭选中班级框
                        $scope.selectClassModal2.hide()
//                        //  关闭选中学员框
//                        $scope.upgradeClassPreModal.hide()
                        $scope.getCallNameStudents($scope.getCallNameStudentsTableState)
                    }
                    //学员没课程
                    else if(data.data.status === 'SUCCESS'&&data.data.data){
                        $mtModal.moreModal({
                            text:_stuNameText,
                            status:1,
                            scope:$scope
                        })
                        //  关闭确认框
                        $scope.determineUpModal.hide()
                        //  关闭选中班级框
                        $scope.selectClassModal2.hide()
//                        //  关闭选中学员框
//                        $scope.upgradeClassPreModal.hide()
                        $scope.getCallNameStudents($scope.getCallNameStudentsTableState)
                    }
                    //所选学员已在该班级内，请勿重复操作
                    else if(data.data.status==='FAILURE'&&data.data.data){

                        $mtModal.moreModalHtml({
                            scope:$scope,
                            text:'所选学员:'+stuName+' 已在该班级内；\n系统已为您自动过滤点击确定继续提交，或者点击取消返回重选',
                            status:0,
                            hasNext:function () {
                                $scope.mtResultModal.hide()
                                $scope.determineCheack()
                            },
                            cancel:function () {
                                //  关闭确认框
                                $scope.determineUpModal.hide()
                                //  关闭选中班级框
                                $scope.selectClassModal2.hide()
                                $scope.mtResultModal.hide()
                            }
                        })
                    }
                    else{
                        $mtModal.moreModal({
                            text:'操作失败，请重试！',
                            status:0,
                            scope:$scope
                        })
                    }
                })
            }
            /**
             * 删除班级
             * @param stu
             * 学生信息
             * @param index
             * 学生对应的升班班级对应的索引
             */
            $scope.removeUpgradeClass = function (stu,index) {
                console.log(stu,stu.upgradeList[index])
                $mtModal.moreModal({
                    scope:$scope,
                    text:'确定将 '+stu.studentName+' 移除“'+stu.upgradeList[index].className+'”吗？',
                    status:0,
                    hasNext:function () {
                        PromotionMTServer.removeUpgradeClass({
                            crmStudentId:stu.crmStudentId,
                            upgradeClassId:stu.upgradeList[index].crmStudentClassId,
                            joinTime:stu.upgradeList[index].joinTime
                        }).then(function (data) {
                            //这个是返回值
                            console.log(data)
                            if(data.data.status==='SUCCESS'&&data.data.data == true){
                                $mtModal.moreModalHtml({
                                    scope:$scope,
                                    text:'操作成功！',
                                    status:1
                                })
                                $scope.byClassList[stu._$index].upgradeList.splice(index,1)
                            }else{
                                $mtModal.moreModal({
                                    scope:$scope,
                                    text:'操作失败！',
                                    status:0
                                })
                            }
                        })
                    }
                })

            }
        }
    ])