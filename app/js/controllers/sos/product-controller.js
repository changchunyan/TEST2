'use strict';

/**
 * The dictionary manange controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('ProductController', ['$scope', '$modal', '$rootScope', 'SweetAlert', 'ProductService', 'CommonService', 'fileReader', 'OrderService',
    function ($scope, $modal, $rootScope, SweetAlert, ProductService, CommonService, fileReader, OrderService) {
        $scope.getProjectList = getProjectList;
        $scope.getProjectList();
        $scope.changCourseUnit = changCourseUnit;
        $scope.changeRegular = changeRegular;
        $scope.tt = {};
        $scope.isList = true;
        $scope.isAddProductType = false;
        $scope.isAddCourseType = false;
        $scope.isFavorable = false;
        $scope.isImport = false;
        $scope.Offline = {
            Course: {}
        };

        $scope.showListView = function () {
            $scope.isList = true;
            $scope.isAddProductType = false;
            $scope.isAddCourseType = false;
            $scope.isFavorable = false;
            $scope.isImport = false;
        }

        $scope.showAddCourseTypeView = function () {
            $scope.isList = false;
            $scope.isAddProductType = false;
            $scope.isAddCourseType = true;
            $scope.isFavorable = false;
            $scope.isImport = false;
        }
        $scope.showFavorableView = function () {
            $scope.isList = false;
            $scope.isAddProductType = false;
            $scope.isAddCourseType = false;
            $scope.isFavorable = true;
            $scope.isImport = false;
        }
        $scope.showImportView = function () {
            $scope.isList = false;
            $scope.isAddProductType = false;
            $scope.isAddCourseType = false;
            $scope.isFavorable = false;
            $scope.isImport = true;
        }

        /**
         * 点击按期买课
         */
        function changeRegular() {
            if ($scope.Offline.Course.id != undefined) {
                return false;
            } else {
                $scope.Offline.Course.isRegularCharge = !$scope.Offline.Course.isRegularCharge;
            }
        }

        // 授课方式
        $scope.teachingStyles = [{name: '一对一', id: 1}, {name: '一对二', id: 2}, {name: '一对三', id: 3}, {
            name: '班课',
            id: 4
        }, {name: '其他', id: 5}];
        ;
        // 课程单位
        $scope.courseUnit = [{name: '按课时计费', id: 1}, {name: '按次计费', id: 2}];

        /**************************************product list change*********************************************/

        /*  $scope.onCourseTypeIdSelect = function onCourseTypeIdSelect() {
         $scope.gradeIdSelectes = [];
         var params = {};
         params.courseTypeId = $scope.CourseListFilter.course_type_id;
         OrderService.getGradeIdSelect(params).then(function (result) {
         $scope.gradeIdSelectes = result.data;
         });
         };*/

        $scope.onCourseTypeIdSelect1 = function onCourseTypeIdSelect1() {
            $scope.gradeIdSelectes = [];
            var params = {};
            /* if($scope.CourseListFilter.course_type_id==null){
             return;
             }*/
            params.courseTypeId = $scope.CourseListFilter.course_type_id;
            //CommonService.getGradeIdSelect(params).then(function (result) {
            //    $scope.gradeIds = result.data;
            //});
            //$scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品

            OrderService.getGradeIdSelect(params).then(function (result) {
                $scope.gradeIdSelectes1 = result.data;
                $scope.getOnLineCourseListForSchool($scope.CourseListTableState);
                // $scope.getOnLineCourseListForSchool($scope.OnLineCourseListTableState);
                // $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
                console.log($scope.CourseListFilter.productTypeId);
            });


        };


        /**
         * 课程列表
         */
        $scope.CourseList = [];//课程列表数据
        $scope.CourseListFilter = {};//课程列表过滤条件
        $scope.CourseListTableState = {};//课程列表分页条件
        $scope.getCourseList = function (tableState) {
            $scope.CourseListTableState = tableState;
            $scope.isCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            $scope.CourseListFilter.is_AllSubject = 1;
            ProductService.getCourseList(start, number, tableState, $scope.CourseListFilter).then(function (result) {
                $scope.getAllSelected();
                $scope.CourseList = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].projectNames != null && result.data[i].projectNames && result.data[i].projectNames != undefined) {
                        $scope.CourseList[i].projectNames = result.data[i].projectNames.join(",");
                    }
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.CourseListTableState = tableState;
                $scope.isCourseListLoading = false;
            });
        }

        $scope.onProductIdSelect = function onProductIdSelect() {
            $scope.gradeIdSelectes = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = 8;
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };
        $scope.onProductIdSelect();

        $scope.getOnLineCourseList = function (tableState) {
            $scope.CourseListTableState = tableState;
            $scope.isCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            $scope.CourseListFilter.is_AllSubject = 1;
            ProductService.getOnLineCourseList(start, number, tableState, $scope.CourseListFilter).then(function (result) {
                $scope.getAllSelected();
                $scope.onProductIdSelect();
                $scope.CourseList1 = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].projectNames != null && result.data[i].projectNames && result.data[i].projectNames != undefined) {
                        $scope.CourseList[i].projectNames = result.data[i].projectNames.join(",");
                    }
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.OnLineCourseListTableState = tableState;
                $scope.isCourseListLoading = false;
            });
        }
        $scope.onProductIdSelect = function onProductIdSelect() {
            $scope.gradeIdSelectes = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = $scope.CourseListFilter.productTypeId;//CourseListFilter.productTypeId
            //CommonService.getCourseTypeIdSelect(params).then(function (result) {
            //    $scope.courseTypeIds = result.data;
            //});
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };

        $scope.onProductIdSelect1 = function onProductIdSelect1() {
            $scope.gradeIdSelectes = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = $scope.CourseListFilter.productTypeId;//CourseListFilter.productTypeId
            //CommonService.getCourseTypeIdSelect(params).then(function (result) {
            //    $scope.courseTypeIds = result.data;
            //});
            $scope.CourseListFilter.productTypeId = $scope.CourseListFilter.productTypeId;//产品类型只选线上产品
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };
        $scope.getOnLineCourseListForSchool = function (tableState) {
            $scope.CourseListTableState = tableState;
            $scope.isCourseListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            $scope.CourseListFilter.is_AllSubject = 1;
            ProductService.getOnLineCourseListForSchool(start, number, tableState, $scope.CourseListFilter).then(function (result) {
                //$scope.getAllSelected();
                //$scope.onProductIdSelect();
                $scope.CourseList = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].projectNames != null && result.data[i].projectNames && result.data[i].projectNames != undefined) {
                        $scope.CourseList[i].projectNames = result.data[i].projectNames.join(",");
                    }
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.OnLineCourseListTableState = tableState;
                $scope.isCourseListLoading = false;
            });
        }

        var searchModel = new Object();
        searchModel.search = {};
        searchModel.search.predicateObject = {};
        searchModel.search.predicateObject.pageNum = null;
        searchModel.search.predicateObject.pageSize = null;
        var searchFilter = new Object();
        searchFilter.pageNum = null;
        searchFilter.pageSize = null;
        ProductService.getProductTypeList(0, 10, searchModel, searchFilter).then(function (result) {
            $scope.getAllSelected();
            $scope.ProductTypeList = result.data;
            $scope.ProductTypeOfflineList = result.data;
            $scope.setProductTypeOnlineAndOffline();
            if (!check_null(result.numberOfPages)) {
                result.numberOfPages = 1;
            }
        });

        /**
         * 产品类型列表
         */
        $scope.ProductTypeList = [];//产品类型列表数据
        $scope.ProductTypeListFilter = {};//产品类型列表过滤条件
        $scope.ProductTypeListTableState = {};//产品类型列表分页条件
        $scope.getProductTypeList = function (tableState) {
            $scope.ProductTypeListTableState = tableState;
            $scope.isProductTypeListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getProductTypeList(start, number, tableState, $scope.ProductTypeListFilter).then(function (result) {
                $scope.getAllSelected();
                $scope.ProductTypeList = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].projectNames != null && result.data[i].projectNames && result.data[i].projectNames != undefined) {
                        $scope.ProductTypeList[i].projectNames = result.data[i].projectNames.join(",");
                    }
                }

                $scope.ProductTypeOfflineList = result.data;

                $scope.setProductTypeOnlineAndOffline();

                if (!check_null(result.numberOfPages)) {
                    result.numberOfPages = 1;
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.ProductTypeListTableState = tableState;
                $scope.isProductTypeListLoading = false;
            });
        };
        /**
         * filter 处理产品类型 分为线上ProductTypeList 和线下产品 ProductTypeOfflineList
         */
        $scope.setProductTypeOnlineAndOffline = function () {
            var del = 0;
            var offlineList = [];
            var onlineList = [];
            for (var i = 0; i < $scope.ProductTypeOfflineList.length; i++) {
                if ($scope.ProductTypeOfflineList[i].id != config.flag.onLineCourseFlag) {
                    offlineList.push($scope.ProductTypeOfflineList[i]);
                }
                if ($scope.ProductTypeOfflineList[i].id == config.flag.onLineCourseFlag) {
                    onlineList.push($scope.ProductTypeOfflineList[i]);
                }
            }
            $scope.ProductTypeOfflineList = offlineList;
            $scope.ProductTypeOnlineList = onlineList;
        };

        /**
         * 课程类型列表
         */
        $scope.CourseTypeList = [];//课程类型列表数据
        $scope.CourseTypeListFilter = {};//课程类型列表过滤条件
        $scope.CourseTypeListTableState = {};//课程类型列表分页条件
        $scope.getCourseTypeList = function (tableState) {
            $scope.CourseTypeListTableState = tableState;
            $scope.isCourseTypeListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getCourseTypeList(start, number, tableState, $scope.CourseTypeListFilter).then(function (result) {
                $scope.getAllSelected();
                $scope.CourseTypeList = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].projectNames != null && result.data[i].projectNames && result.data[i].projectNames != undefined) {
                        $scope.CourseTypeList[i].projectNames = result.data[i].projectNames.join(",");
                    }
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.CourseTypeListTableState = tableState;
                $scope.isCourseTypeListLoading = false;
            });
        }

        /**
         * 获取所有项目
         */
        function getProjectList() {
            var promise = ProductService.getProjectList()
                .then(function (response) {
                        if (response.status == "FAILURE") {
                            SweetAlert.swal(response.data, "请重试", "error");
                        }
                        else {
                            $scope.projectList = response.data;
                        }
                    }, function (error) {
                        SweetAlert.swal('获取所有项目', '请重试', 'error');
                    }
                );
        }

        /**
         * 获取年级、课程类型下拉菜单
         */
        $scope.gradeIds = [];
        $scope.courseTypeIdsOfOne2One = [];
        $scope.courseTypeIdsOfShaoNianPai = [];
        $scope.getAllSelected = function getAllSelected() {

            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getCourseTypeIdSelectOfOne2One().then(function (result) {
                $scope.courseTypeIdsOfOne2One = result.data;
            });
            CommonService.getCourseTypeIdSelectOfShaoNianPai().then(function (result) {
                $scope.courseTypeIdsOfShaoNianPai = result.data;
            });
            CommonService.getWhoCanBuy().then(function (result) {
                $scope.whoCanBuy = result.data;
            });

        };
        $scope.getAllSelected();

        //产品类型modal
        function showProductTypeModal() {
            $scope.modalTitleForProductType = typeof $scope.ProductType.id === 'undefined' ? '添加产品类型' : '更新产品类型';
            $scope.modalForProductType = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/modal.productType.html',
                show: true,
                backdrop: 'static'
            });
        }

        //跳转到产品类型添加页面
        $scope.showAddProductTypeView = function () {
            $scope.ProductType = {};
            $scope.tt.sb = {};
            showProductTypeModal();
        }
        /**
         * table选择
         * @param arg
         */
        $scope.isSelectedProduct = 1
        $scope.setSelectedProduct = function (arg) {
            $scope.isSelectedProduct = arg
        }
        //跳转到产品类型编辑页面
        $scope.showEditProductTypeView = function (ProductType) {
            $scope.tt.sb = ProductType.ids;
            $scope.ProductType = angular.copy(ProductType);
            $scope.ProductTypeOld = angular.copy(ProductType);
            showProductTypeModal();
        }

        /**
         * 添加/更新产品类型
         */
        $scope.ProductType = {};//要创建的产品类型对象
        $scope.saveProductType = function () {
            if ($scope.tt.sb.length > 0) {
                if (typeof $scope.ProductType.id === 'undefined') {
                    $scope.ProductType.productId = [];
                    angular.forEach($scope.tt.sb, function (p, index) {
                        $scope.ProductType.productId.push(p.id);

                    });
                    $scope.ProductType.productIds = $scope.ProductType.productId.join(",");
                    var promise = ProductService.createProductType($scope.ProductType);
                    promise.then(function (success) {
                        if (success.status == "FAILURE") {
                            SweetAlert.swal(success.data);
                            $scope.dataLoadingForProductType = false;
                            return;
                        }
                        $scope.dataLoadingForProductType = false;
                        $scope.modalForProductType.hide();
                        $scope.tt.sb = {};
                        $scope.ProductTypeListTableState.pagination.start = 0;
                        $scope.getProductTypeList($scope.ProductTypeListTableState);
                    }, function (error) {
                        $scope.dataLoadingForProductType = false;
                    });
                } else {
                    if ($scope.ProductTypeOld.name == $scope.ProductType.name && $scope.ProductTypeOld.ids == $scope.tt.sb) {
                        $scope.dataLoadingForProductType = false;
                        $scope.modalForProductType.hide();
                        return;
                    }
                    $scope.ProductType.productId = [];
                    angular.forEach($scope.tt.sb, function (p, index) {
                        $scope.ProductType.productId.push(p.id);

                    });
                    $scope.ProductType.productIds = $scope.ProductType.productId.join(",");
                    var promise = ProductService.updateProductType($scope.ProductType);
                    promise.then(function (success) {
                        if (success.status == "FAILURE") {
                            SweetAlert.swal(success.data);
                            $scope.dataLoadingForProductType = false;
                            return;
                        }
                        $scope.dataLoadingForProductType = false;
                        $scope.modalForProductType.hide();
                        $scope.ProductTypeListTableState.pagination.start = 0;
                        $scope.getProductTypeList($scope.ProductTypeListTableState);
                    }, function (error) {
                        $scope.dataLoadingForProductType = false;
                    });
                }
            } else {
                SweetAlert.swal("请选择所属项目");
                return;
            }
        }

        //删除产品类型
        $scope.removeProductType = function (ProductType) {
            ProductType.isDeleted = true;
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900 ',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = ProductService.updateProductTypeForDelete(ProductType);
                        promise.then(function () {
                            $scope.ProductTypeListTableState.pagination.start = 0;
                            $scope.getProductTypeList($scope.ProductTypeListTableState);
                        }, function (error) {
                            SweetAlert.swal('删除失败', 'error');
                        });
                    }
                }
            );
        }

        $scope.onProductIdSelect = function onProductIdSelect() {
            $scope.gradeIdSelectes = [];
            $scope.courseTypeIds = [];
            var params = {};
            params.productId = config.flag.onLineCourseFlag;//CourseListFilter.productTypeId
            //CommonService.getCourseTypeIdSelect(params).then(function (result) {
            //    $scope.courseTypeIds = result.data;
            //});
            $scope.CourseListFilter.productTypeId = config.flag.onLineCourseFlag;//产品类型只选线上产品
            OrderService.getCourseTypeIdSelect(params).then(function (result) {
                $scope.courseTypeIds = result.data;
            });
        };

        /**
         * 添加课程类型
         */
        $scope.CourseType = {};//要创建的课程类型对象
        $scope.saveCourseType = function () {
            if (typeof $scope.CourseType.id === 'undefined') {
                var promise = ProductService.createCourseType($scope.CourseType);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourseType = false;
                        return;
                    }
                    $scope.dataLoadingForCourseType = false;
                    $scope.modalForCourseType.hide();
                    $scope.getCourseTypeList($scope.CourseTypeListTableState);
                }, function (error) {
                    $scope.dataLoadingForCourseType = false;
                });
            } else {
                if ($scope.CourseTypeOld.name == $scope.CourseType.name && $scope.CourseTypeOld.omsProductTypeId == $scope.CourseType.omsProductTypeId) {
                    $scope.dataLoadingForCourseType = false;
                    $scope.modalForCourseType.hide();
                    return;
                }
                var promise = ProductService.updateCourseType($scope.CourseType);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourseType = false;
                        return;
                    }
                    $scope.dataLoadingForCourseType = false;
                    $scope.modalForCourseType.hide();
                    $scope.getCourseTypeList($scope.CourseTypeListTableState);
                }, function (error) {
                    $scope.dataLoadingForCourseType = false;
                });
            }
        }

        //课程类型modal
        function showCourseTypeModal() {
            $scope.modalTitleForCourseType = typeof $scope.CourseType.id === 'undefined' ? '添加课程类型' : '更新课程类型';
            $scope.modalForCourseType = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/modal.courseType.html',
                show: true
            });
        }

        //跳转到课程类型添加页面
        $scope.showAddCourseTypeView = function () {
            $scope.CourseType = {};
            showCourseTypeModal();
        }
        //跳转到课程类型编辑页面
        $scope.showEditCourseTypeView = function (CourseType) {
            $scope.CourseType = angular.copy(CourseType);
            $scope.CourseTypeOld = angular.copy(CourseType);
            showCourseTypeModal();
        }
        //删除课程类型
        $scope.removeCourseType = function (CourseType) {
            CourseType.isDelete = true;
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900 ',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = ProductService.updateCourseTypeForDelete(CourseType);
                        promise.then(function () {
                            $scope.getCourseTypeList($scope.CourseTypeListTableState);
                        }, function (error) {
                            SweetAlert.swal('删除失败', 'error');
                        });
                    }
                }
            );
        };
        /** 添加线上产品相关 */
        $scope.courseIntroList = [];
        $scope.expiredDaysSelect = [
            {name: '一个月', id: 1}, {name: '两个月', id: 2}, {name: '三个月', id: 3},
            {name: '四个月', id: 4}, {name: '五个月', id: 5}, {name: '六个月', id: 6},
            {name: '七个月', id: 7}, {name: '八个月', id: 8}, {name: '九个月', id: 9},
            {name: '十个月', id: 10}, {name: '十一个月', id: 11}, {name: '十二个月', id: 12},
            {name: '十三个月', id: 13}, {name: '十四个月', id: 14}, {name: '十五个月', id: 15},
            {name: '十六个月', id: 16}, {name: '十七个月', id: 17}, {name: '十八个月', id: 18},
            {name: '十九个月', id: 19}, {name: '二十个月', id: 20}, {name: '二十一个月', id: 21},
            {name: '二十二个月', id: 22}, {name: '二十个三月', id: 23}, {name: '二十四个月', id: 24}
        ];
        $scope.isShelveSelect = [{name: '上架', id: 1}, {name: '下架', id: 0}];
        $scope.courseIntro = {};
        $scope.courseNumSeq = null;
        $scope.courseContent = null;
        $scope.courseMaterial = null;
        $scope.Allsubject = {};
        $scope.getSubjectIdSelect = function getProductIdSelect() {
            $scope.Allsubject.is_AllSubject = 1;
            CommonService.getSubjectIdSelect($scope.Allsubject).then(function (result) {

                $scope.subjectIds = result.data;
            });
        }();
        $scope.getFile = function () {
            fileReader.readAsDataUrl($scope.Course.courseImage, $scope)
                .then(function (result) {
                    $scope.imageSrc = result;
                    $scope.Course.courseImage = result;
                });
        };
        $scope.deleteCourIntro = function (id) {
            $scope.courseIntroList.splice(id - 1, 1);
            for (var i = (id - 1); i < $scope.courseIntroList.length; i++) {
                $scope.courseIntroList[i].courseNumSeq -= 1;
            }
        };

        /** 添加课程介绍 */
        $scope.addCourseIntro = function () {
            var courseIntro = {
                'courseNumSeq': ($scope.courseIntroList.length + 1),
                'courseContent': $("#courseContent").val(),
                'courseMaterial': $("#courseMaterial").val()
            };
            $scope.courseIntroList.push(courseIntro);
            $("#courseNumSeq").val('');
            $("#courseContent").val('');
            $("#courseMaterial").val('');
            console.log($scope.courseIntroList);
        }

        /** 清空课程介绍 */
        $scope.clearCourseIntro = function () {
            $scope.courseIntroList = [];
        }

        /** 添加线上课程介绍 */
        $scope.saveOrUpdateOnlineCourse = function () {
            if (!check_null($scope.Course.courseImage)) {
                SweetAlert.swal('请添加课程图片');
                return false;
            }
            if (!check_null($scope.courseIntroList)) {
                SweetAlert.swal('请添加课程介绍');
                return false;
            }

            $scope.Course.courseIntroList = $scope.courseIntroList;
            if (typeof $scope.Course.id === 'undefined') {
                var promise = ProductService.createCourse($scope.Course);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.imageSrc = null;
                    if ($scope.OnLineCourseListTableState) {
                        $scope.getOnLineCourseListForSchool($scope.OnLineCourseListTableState);
                    } else {
                        $scope.getCourseList($scope.CourseListTableState);
                    }
                }, function (error) {
                    $scope.dataLoadingForCourse = false;
                });
            } else {
                var promise = ProductService.updateCourse($scope.Course);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.imageSrc = null;
                    if ($scope.OnLineCourseListTableState) {
                        $scope.getOnLineCourseListForSchool($scope.OnLineCourseListTableState);
                    } else {
                        $scope.getCourseList($scope.CourseListTableState);
                    }
                }, function (error) {
                    $scope.dataLoadingForCourse = false;
                });
            }
        }

        /**
         * 添加线下产品
         */
        $scope.e = {};
        $scope.Course = {};//要创建的产品对象
        $scope.saveCourse = function (subjectType) {
            //科目类型设置(1:单科;2:全科;3:班类多科)
            var subjectType = (subjectType ? parseInt(subjectType) : 1)
            if ($scope.Offline.Course.standardPrice < 0) {
                SweetAlert.swal("产品单价不能小于0元");
                return;
            }
            if (typeof $scope.Course.id === 'undefined') {

                $scope.Offline.Course.subjectType = subjectType;
                var promise = ProductService.createCourse($scope.Offline.Course);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.Offline.Course = {};
                    if ($scope.OnLineCourseListTableState) {
                        $scope.getOnLineCourseList($scope.OnLineCourseListTableState);
                    } else {
                        $scope.getCourseList($scope.CourseListTableState);
                    }
                }, function (error) {
                    $scope.dataLoadingForCourse = false;
                });
            } else {
                if ($scope.offLineShow) {
                    $scope.Course = $scope.Offline.Course;
                }

                if ($scope.CourseOld.gradeId == $scope.Course.gradeId && $scope.CourseOld.is_fullsubject == $scope.Course.is_fullsubject && $scope.CourseOld.courseTypeId == $scope.Course.courseTypeId && $scope.CourseOld.subjectId == $scope.Course.subjectId
                    && $scope.CourseOld.standardPrice == $scope.Course.standardPrice && $scope.CourseOld.name == $scope.Course.name && $scope.CourseOld.regularTimes == $scope.Course.regularTimes && $scope.CourseOld.saleType == $scope.Course.saleType) {
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    return;
                }
                $scope.Course.subjectType = subjectType;
                var promise = ProductService.updateCourse($scope.Course);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForCourse = false;
                        return;
                    }
                    $scope.dataLoadingForCourse = false;
                    $scope.modalForCourse.hide();
                    $scope.Offline.Course = {};
                    if ($scope.OnLineCourseListTableState) {
                        $scope.getOnLineCourseList($scope.OnLineCourseListTableState);
                    } else {
                        $scope.getCourseList($scope.CourseListTableState);
                    }
                }, function (error) {
                    $scope.dataLoadingForCourse = false;
                });
            }
        };

        //产品modal
        function showCourseModal() {
            $scope.modalTitleForCourse = typeof $scope.Course.id === 'undefined' ? '添加产品' : '更新产品';
            $scope.modalForCourse = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/modal.course.html',
                show: true
            });
        }

        //跳转到产品添加页面
        $scope.showAddCourseView = function () {
            $scope.offLineShow = true;
            $scope.onLineShow = true;
            $scope.offLineShow2 = false;
            $scope.onLineShow2 = true;
            $scope.Course = {};
            $scope.Offline.Course = {};
            $scope.courseIntroList = [];
            $scope.imageSrc = null;
            $scope.omsProductTypeIdChange();
            showCourseModal();
        };
        $scope.showAddCourseViewOnline = function () {
            $scope.offLineShow = false;
            $scope.onLineShow = true;
            $scope.offLineShow2 = false;
            $scope.onLineShow2 = true;
            $scope.Course = {};
            $scope.Offline.Course = {};
            $scope.courseIntroList = [];
            $scope.imageSrc = null;
            $scope.omsProductTypeIdChange();
            showCourseModal();
        };
        // 初始化售卖类型
        $scope.setCourseSaleType = function (arg) {
            arg.saleType = arg.id ? arg.saleType : 2
        }
        //跳转到产品编辑页面
        $scope.showEditCourseView = function (Course) {
            $scope.subjectType = Course.subjectType;
            $scope.Course = angular.copy(Course);
            $scope.CourseOld = angular.copy(Course);
            if (Course.omsProductTypeId == onLineCourseFlag) {
                $scope.offLineShow = false;
                $scope.onLineShow = true;
                //获取产品详情todo
                ProductService.getCourse($scope.Course.id).then(function (result) {
                    console.log(result.data);
                    $scope.Course.courseImage = {};
                    $scope.Course.courseImage = url_timestamp(QINIU_O2O_DOMIAN + result.data.courseImage);
                    $scope.courseIntroList = result.data.courseIntroList;
                    $scope.imageSrc = $scope.Course.courseImage;
                });
            } else {
                $scope.Offline.Course = angular.copy(Course);
                $scope.offLineShow = true;
                $scope.onLineShow = false;
            }
            $scope.omsProductTypeIdChange();
            showCourseModal();
        }
        //删除产品
        $scope.removeCourse = function (Course) {
            Course.isDeleted = true;
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900 ',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = ProductService.updateCourseForDelete(Course);
                        promise.then(function () {
                            if ($scope.OnLineCourseListTableState) {
                                $scope.getOnLineCourseListForSchool($scope.OnLineCourseListTableState);
                            } else {
                                $scope.getCourseList($scope.CourseListTableState);
                            }
                        }, function (error) {
                            SweetAlert.swal('删除失败', 'error');
                        });
                    }
                }
            );
        }

        //上架或下架
        $scope.upordwonCourse = function (Course) {
            if (Course.isShelve == 1) {
                Course.isShelve = 0;
            } else {
                Course.isShelve = 1;
            }
            var promise = ProductService.updateCourseForDelete(Course);
            promise.then(function () {
                if ($scope.OnLineCourseListTableState) {
                    $scope.getOnLineCourseListForSchool($scope.OnLineCourseListTableState);
                } else {
                    $scope.getCourseList($scope.CourseListTableState);
                }
            }, function (error) {
                SweetAlert.swal('更新失败', 'error');
            });
        }

        //产品类型过滤课程类型
        $scope.CourseTypeListByFilter = [];
        $scope.omsProductTypeIdChange = function () {
            var searchModel = new Object();
            if ($scope.offLineShow2) {
                searchModel = $scope.Offline.Course;
            }
            if ($scope.onLineShow2) {
                searchModel = $scope.Course;
            }
            ProductService.getCourseTypeByFilter(searchModel).then(function (result) {
                $scope.CourseTypeListByFilter = result.data;
            });
        }

        $scope.getTabIndex = function (obj) {
            //console.log($scope.Course);
            if (obj.title == '线下产品') {
                $scope.offLineShow2 = true;
                $scope.onLineShow2 = false;
                searchModel = $scope.Offline.Course;
            }
            if (obj.title == '线上产品') {
                $scope.offLineShow2 = false;
                $scope.onLineShow2 = true;
                searchModel = $scope.Course;
            }
            ProductService.getCourseTypeByFilter(searchModel).then(function (result) {
                $scope.CourseTypeListByFilter = result.data;
            });
        }

        //课程类型变化
        $scope.courseTypeIdAndGradeIdChange = function () {
            if ($scope.Course.gradeId && $scope.Course.courseTypeId) {
                var courseTypeName = null;
                var gradeName = null;
                for (var index1 in $scope.gradeIds) {
                    if ($scope.Course.gradeId == $scope.gradeIds[index1].id) {
                        gradeName = $scope.gradeIds[index1].name;
                    }
                }
                for (var index2 in $scope.CourseTypeListByFilter) {
                    if ($scope.Course.courseTypeId == $scope.CourseTypeListByFilter[index2].id) {
                        courseTypeName = $scope.CourseTypeListByFilter[index2].name;
                    }
                }
                $scope.Course.name = gradeName + courseTypeName;
            } else {
                $scope.Course.name = null;
            }
        }

        /**
         * 课程类型优惠列表
         */
        $scope.FavorableList = [];//课程类型优惠列表数据
        $scope.FavorableListFilter = {};//课程类型优惠列表过滤条件
        $scope.FavorableListTableState = {};//课程类型优惠列表分页条件
        $scope.getFavorableList = function (tableState) {
            $scope.FavorableListTableState = tableState;
            $scope.isFavorableListLoading = true;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            ProductService.getFavorableList(start, number, tableState, $scope.FavorableListFilter).then(function (result) {
                $scope.FavorableList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.FavorableListTableState = tableState;
                $scope.isFavorableListLoading = false;
            });
        }

        /**
         * 添加优惠
         */
        $scope.Favorable = {};//要创建的优惠对象
        $scope.saveFavorable = function () {
            if (typeof $scope.Favorable.id === 'undefined' || $scope.Favorable.id == null) {
                var promise = ProductService.createFavorable($scope.Favorable);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForFavorable = false;
                        return;
                    }
                    $scope.dataLoadingForFavorable = false;
                    $scope.getFavorableList($scope.FavorableListTableState);
                    $scope.Favorable.minPrice = null;
                    $scope.Favorable.maxPrice = null;
                    $scope.Favorable.discount = null;
                }, function (error) {
                    $scope.dataLoadingForFavorable = false;
                });
            } else {
                var promise = ProductService.updateFavorable($scope.Favorable);
                promise.then(function (success) {
                    if (success.status == "FAILURE") {
                        SweetAlert.swal(success.data);
                        $scope.dataLoadingForFavorable = false;
                        return;
                    }
                    $scope.dataLoadingForFavorable = false;
                    $scope.getFavorableList($scope.FavorableListTableState);
                    $scope.Favorable.id = null;
                    $scope.Favorable.minPrice = null;
                    $scope.Favorable.maxPrice = null;
                    $scope.Favorable.discount = null;
                }, function (error) {
                    $scope.dataLoadingForFavorable = false;
                });
            }
        }
        //优惠modal
        $scope.showFavorableModal = function (CourseType) {
            $scope.Favorable = {};
            $scope.CourseType = angular.copy(CourseType);
            $scope.FavorableListFilter.omsCourseTypeId = $scope.CourseType.id;
            $scope.Favorable.omsCourseTypeId = CourseType.id;
            $scope.modalTitleForFavorable = $scope.CourseType.productTypeName + $scope.CourseType.name + '优惠管理';
            $scope.modalForFavorable = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/modal.favorable.html',
                show: true
            });
        }

        //编辑优惠
        $scope.editFavorable = function (Favorable) {
            $scope.Favorable = Favorable;
        }
        //删除优惠
        $scope.removeFavorable = function (Favorable) {
            Favorable.isDelete = true;
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900 ',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        var promise = ProductService.updateFavorableForDelete(Favorable);
                        promise.then(function () {
                            $scope.getFavorableList($scope.FavorableListTableState);
                        }, function (error) {
                            SweetAlert.swal('删除失败', 'error');
                        });
                    }
                }
            );
        }
        $scope.checkRange = function (input, data) {
            if ($scope.Course.minPrice <= data && $scope.Course.maxPrice >= data) {
                return true;
            } else {
                input.$invalid = true;
            }
        }

        /**
         * 一对多系数设置
         */
        $scope.showCoefficientView = function showCoefficientView() {
            $scope.coefficientTitle = '一对多系数设置';
            $scope.modalCoefficient = $modal({
                scope: $scope,
                templateUrl: 'partials/sos/product/modal.coefficient.html',
                show: true,
                backdrop: 'static'
            });
        }

        /**
         * 获取一对多系数列表
         */
        $scope.getCoefficientList = function getCoefficientList(tableState) {
            var filter = {};
            var promise = ProductService.getCoefficientList(filter);
            promise.then(function (data) {
                $scope.coefficientList = data.data;
            }, function (error) {
                SweetAlert.swal('获取一对多系数列表失败', 'error');
            });
        }

        /**
         * 保存一对多系数
         */
        $scope.saveCoefficient = function saveCoefficient() {
            var promise = ProductService.saveCoefficient($scope.coefficientList);
            promise.then(function (data) {
                SweetAlert.swal('操作成功');
                $scope.modalCoefficient.hide();
            }, function (error) {
                SweetAlert.swal('获取一对多系数列表失败', 'error');
            });
        }

        /**
         * 隐藏一对多系数弹框
         */
        $scope.coefficientModalHide = function coefficientModalHide() {
            $scope.modalCoefficient.hide();
        }
        /**
         * 更改课时单位
         */
        $scope.priceUnit = "元";
        $scope.regularUnit = "";

        function changCourseUnit() {
            // 按期收费
            if ($scope.Offline.Course.isRegularCharge) {
                $scope.priceUnit = "元/期";
                if ($scope.Offline.Course.courseUnit == 1) {
                    $scope.regularUnit = "(课时/期)";
                } else if ($scope.Offline.Course.courseUnit == 2) {
                    $scope.regularUnit = "(次/期)";
                }
            } else {
                $scope.priceUnit = "元";
                $scope.regularUnit = "";
                // 按课时计费
                if ($scope.Offline.Course.courseUnit == 1) {
                    $scope.priceUnit = "元/课时";
                } else if ($scope.Offline.Course.courseUnit == 2) {
                    $scope.priceUnit = "元/次";
                }
            }
        }

        // 监控按期买课复选框的值得变化
        $scope.$watch('Offline.Course.isRegularCharge', function (newValue, oldValue) {
            console.log(newValue, oldValue);
            changCourseUnit();
        })

    }
]);

