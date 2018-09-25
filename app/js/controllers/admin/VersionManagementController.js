'use strict';

angular.module('ywsApp').controller('VersionManagementController', ['$scope','$sce','VersionManagementService', '$rootScope','$modal', '$mtModal', 'SweetAlert',
    function($scope,$sce,VersionManagementService,$rootScope,$modal, $mtModal, SweetAlert) {

        $scope.versionList = [];
        $scope.filter = {};
        $scope.versionTableState = {};
        $scope.getVersionList = getVersionList;
        $scope.addPublic = addPublic;
        $scope.isCanSave = isCanSave;
        $scope.showVersion = showVersion;
        $scope.changeVersion = changeVersion;
        $scope.removeVersion = removeVersion;
        $scope.saveCreate = saveCreate;
        $scope.saveChange = saveChange;
        $scope.cancleeditor = cancleeditor;


        $scope.saveFlag = true; //必填字段不为空
        $scope.tableState = {};


        //getVersionList($scope.tableState);
        //获取版本列表
        function getVersionList(tableState){
            if(!tableState.pagination){
                tableState.pagination={};
                tableState.search={};
                tableState.search={predicateObject:{}};
            }
            $scope.isLoading = true;
            $scope.versionTableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;
            VersionManagementService.getVersionListByFilter(start, number, tableState,$scope.filter).then(function (result) {
                $scope.versionList = result.data;
                $scope.leadNum = result.totalSize;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.versionTableState = tableState;
                $scope.isLoading = false;
            });

        }
        //添加新版本
        $scope.version = {};
        $scope.createVersionData = {};
        $scope.changeVersionData = {};
        $scope.showVersionData = {};
        //判断必填字段是否为空
        function isCanSave(editState) {
            if(editState === 'add'){
                if($scope.createVersionData.title && $scope.createVersionData.version && $scope.createVersionData.introduction){
                    $scope.saveFlag = false;
                }else{
                    $scope.saveFlag = true;
                }
            }else{
                if($scope.changeVersionData.title && $scope.changeVersionData.version && $scope.changeVersionData.introduction){
                    $scope.saveFlag = false;
                }else{
                    $scope.saveFlag = true;
                }
            }
        }

        //点击保存，创建版本
        function saveCreate() {
            $scope.version.isDeleted = 0;
            if ($('#summernote').summernote('isEmpty')) {
                SweetAlert.swal({
                    title: "请编辑内容！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })
                return;
            }
            $scope.version.title = $scope.createVersionData.title;
            $scope.version.version = $scope.createVersionData.version.replace(/\s+/g,"");// 去掉中间的空格
            $scope.version.version = $scope.createVersionData.version.replace(/\.+$/g, ""); //去掉版本最后的.
            $scope.version.introduction = $scope.createVersionData.introduction;
            $scope.version.contentPath = $('#summernote').summernote('code');
            if(!/^(\d+\.)+\d+$/.test($scope.version.version)){
                SweetAlert.swal({
                    title: "请输入正确的版本号！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })
                return;
            }

            VersionManagementService.createVersion($scope.version).then(function () {
                SweetAlert.swal({
                    title: "创建版本日志成功！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })

                $scope.modal.hide();
                getVersionList($scope.versionTableState);
            });
        }
        //点击保存，修改版本
        function saveChange() {
            if ($('#summernote-edit').summernote('isEmpty')) {
                SweetAlert.swal({
                    title: "请编辑内容！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })
                return;
            }
            $scope.version.isDeleted = 0;
            $scope.version.id = $scope.changeVersionData.id;
            $scope.version.title = $scope.changeVersionData.title;
            $scope.version.version = $scope.changeVersionData.version.replace(/\s+/g,"");// 去掉中间的空格
            $scope.version.version = $scope.changeVersionData.version.replace(/\.*$/g, ""); //去掉版本最后的.
            $scope.version.introduction = $scope.changeVersionData.introduction;
            $scope.version.contentPath = $('#summernote-edit').summernote('code');
            if(!($scope.version.contentPath == $scope.oldChangeVersionData)){
                $scope.version.ext= "version_img_change";
            }else{
                $scope.version.ext = undefined;
                $scope.version.contentPath = undefined;
            };
            if(!/^(\d+\.)+\d+$/.test($scope.version.version)){
                SweetAlert.swal({
                    title: "请输入正确的版本号！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })
                return;

            }
            VersionManagementService.updateVersion($scope.version).then(function () {
                SweetAlert.swal({
                    title: "修改版本日志成功！",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                    } else {
                    }
                })
                $("#editorhelp").css("transform","translateY(-1000px)");
                getVersionList($scope.versionTableState);
            });
        }

        //点击添加公告、弹窗
        function addPublic() {
            $scope.saveFlag = true;
            $scope.createVersionData = {};
            $scope.modal = $modal({
                scope: $scope,
                templateUrl: 'partials/admin/modal.addVersion.html',
                show: true,
                backdrop: "static",
            });
        }
        //点击编辑 弹窗
        function changeVersion(myData) {
            $scope.saveFlag = false;
            $scope.changeVersionData.id = myData.id;
            $scope.changeVersionData.title = myData.title;
            $scope.changeVersionData.version = myData.version;
            $scope.changeVersionData.introduction = myData.introduction;

            $scope.changeVersionData.contentPath = myData.contentPath;
            console.log(myData.contentPath);
            var timetamp = new Date().getTime();

            $('.note-editable').load(myData.contentPath+'?'+timetamp,function () {
                $("#editorhelp").css("transform","translateY(0px)");
                $scope.oldChangeVersionData = $('.note-editable').html();
            });



        }

        // 取消编辑然后编辑框弹回
        function cancleeditor() {
            $("#editorhelp").css("transform","translateY(-1000px)");
        }

        //点击查看弹窗
        function showVersion(myData) {
            $scope.showVersionData.title = myData.title;
            $scope.showVersionData.version = myData.version;
            $scope.showVersionData.introduction = myData.introduction;
            $scope.showVersionData.contentPath = $sce.trustAsResourceUrl(myData.contentPath);
            $scope.modal = $modal({
                scope: $scope,
                templateUrl: 'partials/admin/modal.showVersion.html',
                show: true,
            });

        }
        //点击删除
        function removeVersion(myData) {
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function (confirm) {
                    if (confirm) {
                        $scope.version.id = myData.id;
                        $scope.version.isDeleted = 1;
                        console.log($scope.version)
                        VersionManagementService.updateVersion($scope.version).then(function () {
                            $scope.versionTableState.pagination.start = 0 ;
                            getVersionList($scope.versionTableState);
                        });
                        }else{
                        }
                    })

        }
    }
])
