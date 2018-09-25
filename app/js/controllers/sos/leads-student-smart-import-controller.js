'use strict';
/**
 * The Coupon management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('LeadsStudentSmartImportController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','LeadsStudentService','$location','FileUploader','$routeParams','CommonService','$base64','localStorageService',
        function($scope, $modal, $rootScope, SweetAlert,LeadsStudentService,$location,FileUploader,$routeParams,CommonService,$base64,localStorageService) {
            var oThis = this;

            //=================================***********************************新优惠券
            $scope.currentDate = new Date();

            $scope.key;
            $scope.excelDownloadUrl = '';
            $scope.errorFileUrl = '';
            $scope.mediaChannelId1;
            //$scope.mediaChannelId2 = false;
            $scope.media = {};
            $scope.media.mediaChannelId2;
            $scope.gradeId;
            $scope.gradeIds = [];
            $scope.mediaChannel1List = [];
            $scope.mediaChannel2List = [];
            $scope.allMediaChannel = [];
            $scope.provinceList = [];
            //var id = $routeParams.id;

            $scope.isDefaultSelected = function(){
                var bol = $scope.gradeId && $scope.mediaChannelId1 && ($scope.mediaChannel2List.length <= 0 || ($scope.mediaChannel2List.length > 0 && $scope.media.mediaChannelId2));
                //console.log($scope.mediaChannel2List.length <= 0);
                //console.log($scope.mediaChannel2List.length > 0);
                //console.log($scope.media.mediaChannelId2);
                return bol;
            };

            $scope.doImport = function(){
                LeadsStudentService.doSmartImport($scope.key).then(function(response){
                    if(response.status == 'SUCCESS'){
                        var successCount = response.data.successCount;
                        var duplicatedCount = response.data.duplicatedCount;
                        var failCount = response.data.failCount;
                        $scope.key = null;
                        $scope.fullStudentList = [];
                        $scope.studentList = [];
                        $scope.errorFileUrl = response.data.errorFileUrl;
                        if( $scope.errorFileUrl ){
                            SweetAlert.swal("操作成功，导入" + successCount + "条,失败" + failCount + "条，重复数据" + duplicatedCount + "条，可点击“下载异常数据excel”按钮查看");
                        }else{
                            SweetAlert.swal("操作成功，导入" + successCount + "条,失败" + failCount + "条，重复数据" + duplicatedCount + "条");
                        }

                    }else{
                        SweetAlert.swal(response.error);
                    }
                });
            };

            $scope.mediaChannel1Change = function(){
                //console.log($scope.mediaChannelId1);
                if($scope.mediaChannelId1){
                    CommonService.getMediaChannel($scope.mediaChannelId1).then(function (result) {
                        $scope.mediaChannel2List = result.data;

                    });
                }else{
                    $scope.mediaChannel2List = [];
                }
                if( $scope.mediaChannel2List == null || $scope.mediaChannel2List.length == 0 ){
                    $scope.media.mediaChannelId2 = null;
                }
            };

            $scope.showSmartImportModal = function(){
                $scope.modalTitleForSmartImport = '导入意向客户';
                $scope.modalForSmartImport = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.smartImportLeads.html', show: true });
            };

            $scope.toAdd = function toAdd() {
                $location.path('/o2o-admin/coupon/edit/0');
            };
            $scope.toList = function toList() {
                $location.path('/o2o-admin/coupon');
            };

            $scope.toView = function toView(row) {
                $location.path('/o2o-admin/coupon/view/' + row.id);
            };

            $scope.getGradeName = function getGradeName(gradeId) {
                var list = $scope.gradeIds;
                for(var i=0;i<list.length;i++){
                    if( gradeId == list[i].id ){
                        return list[i].name;
                    }
                }
                return '';
            };

            $scope.getMediaChannelName = function getMediaChannelName(channelId) {
                var list = $scope.allMediaChannel;
                for(var i=0;i<list.length;i++){
                    if( channelId == list[i].id ){
                        return list[i].name;
                    }
                }
                return '';
            };

            $scope.getProvinceName = function getProvinceName(provinceCode) {
                var list = $scope.provinceList;
                for(var i=0;i<list.length;i++){
                    if( provinceCode == list[i].provinceCode ){
                        return list[i].provinceName;
                    }
                }
                return '';
            };

            $scope.getGenderName = function getGenderName(gender) {
                return gender?"男":"女";
            };

            //========================****************************传文件
            //上传导入信息
            var uploader = $scope.uploader = new FileUploader({
                url: config.endpoints.sos.LeadsStudent + '/smartimport',
                headers:{
                    'Authorization' : 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
                }
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    if( this.queue.length >=1 ){
                        SweetAlert.swal('只能单个上传');
                        return false;
                    }
                    return this.queue.length < 1;
                }
            });
            //添加一个文件
            uploader.onAfterAddingFile = function(fileItem) {
                //判断后缀
                var fileExtend=fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();

                //console.info(fileExtend);
                if(fileExtend.toLowerCase() != '.xlsx' && fileExtend.toLowerCase() != '.xls' ){
                    SweetAlert.swal('请选择后缀名为xlsx或xls格式的excel模版文件');
                    fileItem.remove();
                    return false;
                }

                var size = fileItem.file.size;
                if(size > 2*1024*1024){
                    SweetAlert.swal('大小不能超过2MB');
                    fileItem.remove();
                    return false;
                }

                var url = config.endpoints.sos.LeadsStudent + '/smartimport?gradeId=' + $scope.gradeId + "&channel1=" + $scope.mediaChannelId1 + "&channel2=";
                if( $scope.media.mediaChannelId2 ){
                    url += $scope.media.mediaChannelId2;
                }
                fileItem.url = url;


            };

            //添加多个文件
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };

            uploader.onProgressItem = function(fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
                $rootScope.ywsLoading = true;
            };

            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                //console.info(response);
                if(response.status == 'SUCCESS'){
                    if( response.data.size == response.data.validSize ){
                        SweetAlert.swal("文件上传成功，数据总共" + response.data.size + "条，成功解析" + response.data.validSize +  "条");
                    }else if( response.data.tooMuchError ){
                        SweetAlert.swal("文件上传成功，数据总共" + response.data.size + "条，成功解析" + response.data.validSize +  "条，超过半数解析不成功，建议使用批量导入的“下载意向客户导入模板”");
                    }else{
                        SweetAlert.swal("文件上传成功，数据总共" + response.data.size + "条，成功解析" + response.data.validSize +  "条，可点击“下载已解析excel”按钮查看");
                    }

                    $scope.key = response.data.key;
                    $scope.fullStudentList = response.data.list;
                    if( response.data.flag ){
                        $scope.excelDownloadUrl = response.data.excelDownloadUrl;
                    }else{
                        $scope.excelDownloadUrl = '';
                    }
                }else{
                    $scope.key = null;
                    $scope.fullStudentList = [];
                    $scope.studentList = [];
                    SweetAlert.swal(response.error);
                }
                fileItem.remove();
                //$scope.getStudentList();
                if( $scope.studentListTableState && $scope.studentListTableState.pagination ){
                    $scope.studentListTableState.pagination.start = 0;
                    $scope.studentListTableState.pagination.number = 10;
                    $scope.studentListTableState.pagination.numberOfPages = Math.ceil($scope.fullStudentList.length/10);
                    $scope.getStudentList($scope.studentListTableState);
                }else{
                    $scope.getStudentList();
                }
                $rootScope.ywsLoading = false;
                $scope.errorFileUrl = '';
            };

            $scope.fullStudentList = [];
            $scope.studentList = [];
            $scope.studentListTableState = {};
            $scope.getStudentList = function getStudentList(tableState) {
                //console.log(tableState);
                if(!tableState){
                    tableState ={
                        pagination:{},
                        search:{
                            predicateObject:{}
                        }
                    }
                }
                $scope.studentListTableState = tableState;
                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                $scope.studentList = $scope.fullStudentList.slice(start,start+number);
                tableState.pagination.numberOfPages = Math.ceil($scope.fullStudentList.length/number);
                $scope.studentListTableState = tableState;
            };

            //CommonService.getGradeIdSelect().then(function (result) {
            //    $scope.gradeIds = result.data;
            //});
            //CommonService.getProvinceSelect().then(function (result) {
            //    $scope.provinceList = result.data;
            //});
            //CommonService.getState(0).then(function (result) {
            //    //console.dir(result);
            //    $scope.state1List = result.data;
            //});
            //CommonService.getMediaChannel(0).then(function (result) {
            //    $scope.mediaChannel1List = result.data;
            //});

            $scope.initLoad = function initLoad() {
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });
                CommonService.getAllMediaChannel().then(function (result) {
                    $scope.allMediaChannel = result.data;
                });
                CommonService.getProvinceSelect().then(function (result) {
                    $scope.provinceList = result.data;
                });
            }();

        }]);