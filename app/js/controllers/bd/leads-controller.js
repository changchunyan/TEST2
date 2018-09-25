'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdLeadsController', ['$scope', '$routeParams', '$location', 'BdLeadsService', 'CommonService', '$modal', '$rootScope', 'SweetAlert', 'FileUploader', '$base64',
    'BdRemindService', 'BdCommunicationService', 'BdInvitationService', 'localStorageService', 'AuthenticationService','$optionData','ColEdit',
    function ($scope, $routeParams, $location, BdLeadsService, CommonService, $modal, $rootScope, SweetAlert, FileUploader, $base64, BdRemindService, BdCommunicationService, BdInvitationService, localStorageService, AuthenticationService,$optionData,ColEdit) {
        $scope.isList = true;
        $scope.isAdding = false;
        $scope.isDetail = false;
        $scope.isUpdate = false;
        $scope.isAllot = false;
        $scope.leadNum = 0;
        $scope.isBatchOperate = false;
        $scope.batchNum = 1;
        $scope.remindLead = {};

        $scope.changeLeadCheckbox = changeLeadCheckbox;
        $scope.ifLeadChecked = ifLeadChecked;//批量判断是否被选中

        $scope.changeWorkCheckbox = changeWorkCheckbox;
        $scope.ifWorkChecked = ifWorkChecked;//批量判断是否被选中

        $scope.ifBatchChecked = ifBatchChecked;
        $scope.changeSelectMore = changeSelectMore;
        // * m&t 新增
        /**
         * 改变查询更多按钮
         */
        $scope.selectMoreText = '更多查询条件'
        function changeSelectMore(flag) {
            if(arguments[1]){
                $scope.selectMore = !$scope.selectMore
                $scope.selectMoreText = $scope.selectMore?'收起查询条件':'更多查询条件'
            }else {
                $scope.selectMore = flag
                $scope.selectMoreText = flag?'收起查询条件':'更多查询条件'
            }
            // angular.element('#body').scroll()
            setTimeout(function () {
                resatList()
            },100)
        }

        /**
         * 招商Leads列表
         */
        $scope.bdLeadsFilter = {};//招商Leads过滤条件
        if ($routeParams.bak) {
            var bakFilter = JSON.parse($routeParams.bak);
            $scope.bdLeadsFilter = bakFilter.bakBdLeadsFilter;
            $scope.mtSeach = angular.copy($scope.bdLeadsFilter)
        }
        $scope.bdLeadsList = [];
        $scope.bdLeadsListTableState = {};
        $scope.userInfo = {};

        $scope.exportLeadsList = [];

        $scope.exportLeads = function exportLeads(){

            BdLeadsService.listAllByfilter($scope.bdLeadsFilter).then(function (result) {
                $scope.exportLeadsList = result.data;
                angular.forEach($scope.exportLeadsList, function(data, index, array){

                    var create = new Date(data.create_at);

                    data.create_at = create.getFullYear() + "-" + (create.getMonth()+1) + "-" + create.getDate();

                    if(data.record == '' || data.record == null || data.record == undefined){
                        data.record = ""
                    }
                    if(data.communicationTypeName == '' || data.communicationTypeName == null || data.communicationTypeName == undefined){
                        data.communicationTypeName = ""
                    }
                    if(data.genderName == '' || data.genderName == null || data.genderName == undefined){
                        data.genderName = ""
                    }
                    if(data.age == '' || data.age == null || data.age == undefined){
                        data.age = ""
                    }
                    if(data.education_name == '' || data.education_name == null || data.education_name == undefined){
                        data.education_name = ""
                    }
                    if(data.marreyName == '' || data.marreyName == null || data.marreyName == undefined){
                        data.marreyName = ""
                    }
                    if(data.haveChildName == '' || data.haveChildName == null || data.haveChildName == undefined){
                        data.haveChildName = ""
                    }
                    if(data.professionBackgroundName == '' || data.professionBackgroundName == null || data.professionBackgroundName == undefined){
                        data.professionBackgroundName = ""
                    }
                    if(data.interestName == '' || data.interestName == null || data.interestName == undefined){
                        data.interestName = ""
                    }
                    if(data.customer_type_name == '' || data.customer_type_name == null || data.customer_type_name == undefined){
                        data.customer_type_name = ""
                    }
                    if(data.customer_status_name == '' || data.customer_status_name == null || data.customer_status_name == undefined){
                        data.customer_status_name = ""
                    }
                    if(data.project_name == '' || data.project_name == null || data.project_name == undefined){
                        data.project_name = ""
                    }
                    if(data.intentAddr == '' || data.intentAddr == null || data.intentAddr == undefined){
                        data.intentAddr = ""
                    }
                    if(data.intentionName == '' || data.intentionName == null || data.intentionName == undefined){
                        data.intentionName = ""
                    }
                    if(data.joinReasonName == '' || data.joinReasonName == null || data.joinReasonName == undefined){
                        data.joinReasonName = ""
                    }
                    if(data.mediaOriginName == '' || data.mediaOriginName == null || data.mediaOriginName == undefined){
                        data.mediaOriginName = ""
                    }
                    if(data.mediaDetailName == '' || data.mediaDetailName == null || data.mediaDetailName == undefined){
                        data.mediaDetailName = ""
                    }
                    if(data.mediaEffectName == '' || data.mediaEffectName == null || data.mediaEffectName == undefined){
                        data.mediaEffectName = ""
                    }
                });
                exportStatisticsToExcel();
            });
        }

        function exportStatisticsToExcel(){
            var statisticsExportTableStyle = {
                sheetid: '招商leads列表',
                headers: true,
                caption: {
                    title:'招商leads列表',
                },
                column: {style:'font-size:14px; text-align:left;'},
                columns: [{columnid:'name',title: '姓名',width: '100px'},
                    {columnid:'record',title: '备注信息',width:'200px'},
                    {columnid:'communicationTypeName',title: '沟通类型'},
                    {columnid:'genderName',title: '性别'},
                    {columnid:'age',title: '年龄'},
                    {columnid:'education_name',title: '学历'},
                    {columnid:'marreyName',title: '婚否'},
                    {columnid:'haveChildName',title: '育否'},
                    {columnid:'professionBackgroundName',title: '职业背景'},
                    {columnid:'interestName',title: '兴趣'},
                    {columnid:'customer_type_name',title: '客户类型'},
                    {columnid:'customer_status_name',title: '客户状态'},
                    {columnid:'project_name',title: '咨询项目'},
                    {columnid:'intentAddr',title: '意向区域'},
                    {columnid:'intentionName',title: '真实意向'},
                    {columnid:'joinReasonName',title: '加盟原因'},
                    {columnid:'mediaOriginName',title: '渠道来源'},
                    {columnid:'mediaDetailName',title: '渠道详情'},
                    {columnid:'mediaEffectName',title: '媒体影响'},
                    {columnid:'province_name',title: '省'},
                    {columnid:'city_name',title: '市'},
                    {columnid:'area_name',title: '县（区）'},
                    {columnid:'owner_name',title: '所属人'},
                    {columnid:'create_at',title: '创建时间'}
                ],
                row: {
                    style: function(sheet, row, rowidx){
                        return 'background:'+(rowidx%2?'#E1FFFF':'#F0E68C');
                    }
                },
                cells: {
                    style: 'font-size:13px; text-align:left;'
                }
            };
            alasql('SELECT * INTO XLS("招商leads列表.xls", ?) FROM ?', [statisticsExportTableStyle,  $scope.exportLeadsList]);
        }

        var _bakFilter;
        var flag = true;
        $scope.bdLeadsFilterChange = function bdLeadsFilterChange() {
            $scope.bdLeadsListTableState.pagination.start = 0
            $scope.bdLeadsListTableState.search.predicateObject.pageNum = 1
            $scope.bdLeadsListTableState.pageNum = 1
            $scope.getBdLeadsList($scope.bdLeadsListTableState);
        }
        /**
         * 重新赋值查询参数
         * @private
         */
        var _setParam = function () {
            $scope.bdLeadsListTableState.search = $scope.bdLeadsListTableState.search||{}
            $scope.bdLeadsListTableState.search.predicateObject = $scope.bdLeadsListTableState.search.predicateObject?$scope.bdLeadsListTableState.search.predicateObject:{}
            for(var key in $scope.mtSeach){
                if($scope.mtSeach[key]!=undefined){
                    $scope.bdLeadsListTableState.search.predicateObject[key] = $scope.mtSeach[key]
                    $scope.bdLeadsFilter[key] = $scope.mtSeach[key]
                }else{
                    delete $scope.bdLeadsListTableState.search.predicateObject[key]
                    delete $scope.bdLeadsFilter[key]
                }
            }
        }
        /**
         * 点击查询进入
         */
        $scope.getBdLeadsListFilterChange = function () {
            if(!arguments.length){
                $scope.bdLeadsListTableState.pagination.start = 0
                $scope.bdLeadsListTableState.search.predicateObject.pageNum = 1
                $scope.bdLeadsListTableState.pageNum = 1
            }
            _setParam()
            $scope.getBdLeadsList($scope.bdLeadsListTableState);
        }
        /**
         * 重置
         */
        $scope.resetSelect = function resetSelect(){
            $scope.bdLeadsListTableState.search.predicateObject = {}
            $scope.bdLeadsFilter={}
            $scope.mtSeach = {}
            $scope.getBdLeadsListFilterChange()

        }
        $scope.getBdLeadsList = function callServer(tableState) {
            _setParam()
            if ($routeParams.bak && flag) {
                flag = !flag;
                var bakFilter = JSON.parse($routeParams.bak);
                tableState.pagination.start = bakFilter.bakTableState.pagination.start;
                tableState.pagination.number = bakFilter.bakTableState.pagination.number;
                tableState.search = bakFilter.bakTableState.search;
                $scope.originChangeForFilter();
                $scope.privinceChangeForFilter();
                $scope.cityChangeForFilter();
            }

            if (!angular.equals({}, $scope.bdLeadsFilter)) {//清除旧的招商Leads过滤条件备份，创建新的备份
                var bakFilter = {};
                bakFilter.bakBdLeadsFilter = $scope.bdLeadsFilter;
                bakFilter.bakTableState = tableState;
                _bakFilter = JSON.stringify(bakFilter);
            }

            if (tableState.search.predicateObject != null && tableState.search.predicateObject.bdLeadsFilter != null) {
                if (tableState.search.predicateObject.bdLeadsFilter.name != null) {
                    if (tableState.search.predicateObject.bdLeadsFilter.name.length > 10) {
                        return;
                    }
                }
                if (tableState.search.predicateObject.bdLeadsFilter.phone != null) {
                    if (tableState.search.predicateObject.bdLeadsFilter.phone.length > 11) {
                        return;
                    }
                }
                if (tableState.search.predicateObject.bdLeadsFilter.creator_name != null) {
                    if (tableState.search.predicateObject.bdLeadsFilter.creator_name.length > 20) {
                        return;
                    }
                }
                if (tableState.search.predicateObject.bdLeadsFilter.owner_name != null) {
                    if (tableState.search.predicateObject.bdLeadsFilter.owner_name.length > 20) {
                        return;
                    }
                }
            }

            $scope.bdLeadsListTableState = tableState;
            //console.dir(tableState);
            $scope.isBdLeadsLoading = true;

            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;// Number of entries showed per page.


            //$scope.getAllSelected();
            //if(!$rootScope.showPermissions("BdLeadsViewAll") && $rootScope.showPermissions("BdLeadsViewSelf")) {
            //  $scope.bdLeadsFilter.createBy = $rootScope.currentUser.id;
            //}

            BdLeadsService.list(start, number, tableState, $scope.bdLeadsFilter).then(function (result) {
                //$scope.getAllSelected();
                $scope.bdLeadsList = result.data;
                $scope.leadNum = result.totalSize;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.bdLeadsListTableState = tableState;
                $scope.isBdLeadsLoading = false;
                setTimeout(function () {
                    ColEdit.initCol($scope)
                })
                /* $scope.batchList = [];*/
            });
        };
        /**
         * 控制显示
         * @param arg
         */
        $scope.showCol = function (arg) {
            ColEdit.showCol(arg)
        }

        /**
         * 选择显示
         * @param index
         * 对应的下标
         */
        $scope.selectCol = function (index) {
            ColEdit.selectCol(index)
        }

        /**
         * 全选
         */
        $scope.selectColAll = function () {
            ColEdit.selectColAll()
        }
        /**
         * 恢复编辑列
         */
        $scope.reastCol = function () {
            ColEdit.reastCol()
        }
        //是否选中
        $scope.isSelected = function (student) {
            for (var index in $scope.MyCrmLeadsStudentListOk) {
                if ($scope.MyCrmLeadsStudentListOk[index].crm_student_id == student.crm_student_id) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 修改沟通类型和客户类型
         * @param userId
         * @param type
         * @param optionId
         */
        $scope.changeUserType = function (row,type,optionId) {
            var obj = angular.copy(row)
            /*var obj = {
                bd_lead_id:row.bd_lead_id,
                phone:row.phone,
                mediaOrigin:row.mediaOrigin
            }*/
            if(type=='CustomerType'){
                obj.customer_type = optionId
            }else{
                obj.communicationType = optionId
            }
            BdLeadsService.save(obj).then(function (result) {
                if(result.status != 'FAILURE'){
                    $scope.getBdLeadsListFilterChange(1)
                }
            });
        }

        $scope.customerStatusList = [];
        $scope.customerTypeList = [];
        $scope.projectList = [];
        //$scope.mediaList = [];
        $scope.provinceList = [];
        $scope.cityList = [];
        $scope.areaList = [];
        $scope.educationList = [];
        $scope.investPropList = [];
        $scope.investTypeList = [];
        $scope.genderList = [];
        $scope.mediaOriginList = [];
        $scope.mediaDetailList = [];
        $scope.mediaEffectList = [];

        $scope.privinceChangeForFilter = function () {
            if ($scope.mtSeach.province) {/*$scope.bdLeadsFilter.province改为,以下内容也一样*/
                BdLeadsService.getDictionary("City", $scope.mtSeach.province).then(function (result) {
                    $scope.cityList = result.data;
                });
            } else {
                $scope.cityList = [];
            }
        };

        $scope.cityChangeForFilter = function () {
            if ($scope.mtSeach.city) {
                BdLeadsService.getDictionary("Area", $scope.mtSeach.city).then(function (result) {
                    $scope.areaList = result.data;
                });
            } else {
                $scope.areaList = [];
            }
        };

        $scope.originChangeForFilter = function () {
            if ($scope.mtSeach.mediaOrigin) {
                BdLeadsService.getDictionary("MediaDetail", $scope.mtSeach.mediaOrigin).then(function (result) {
                    $scope.mediaDetailList = result.data;
                });
            } else {
                $scope.mediaDetailList = [];
            }
        };

        /**
         * 显示列表页面
         */
        $scope.showListView = function () {
            $scope.isList = true;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = false;
            //刷新Leads列表
            $scope.bdLeadsListTableState.pagination.start = 0;
            $scope.getBdLeadsList($scope.bdLeadsListTableState);
        }

        //------------------- add page --------------------------//
        /*
         $scope.showAddView =  function() {
         $scope.isList = false;
         $scope.isAdding = true;
         $scope.isDetail = false;
         $scope.isUpdate = false;
         $scope.isAllot = false;

         //客户状态默认为未联系
         $scope.BdLeadsVo.customer_status = 0;
         }

         $scope.BdLeadsVo = {};
         $scope.createLeads = function createLeads(){
         var promise = BdLeadsService.create($scope.BdLeadsVo);
         promise.then(function(data) {
         if(data.status == 'FAILURE'){
         SweetAlert.swal(data.data);
         return false;
         }
         $scope.BdLeadsVo = {};
         $scope.showListView();
         }, function(error) {
         alert("创建招商Leads失败");
         });
         }
         */

        $scope.provinceChangeForAdd = function () {
            if ($scope.BdLeadsVo.province) {
                BdLeadsService.getDictionary("City", $scope.BdLeadsVo.province).then(function (result) {
                    $scope.cityList = result.data;
                });
            } else {
                $scope.cityList = [];
            }
        };

        $scope.cityChangeForAdd = function () {
            if ($scope.BdLeadsVo.city) {
                BdLeadsService.getDictionary("Area", $scope.BdLeadsVo.city).then(function (result) {
                    $scope.areaList = result.data;
                });
            } else {
                $scope.areaList = [];
            }
        };

        //--------------------------- Allot ---------------------------//
        $scope.bdManagerList = [];
        $scope.showAllotView = function () {
            $scope.isList = true;
            $scope.isAdding = false;
            $scope.isDetail = false;
            $scope.isUpdate = false;
            $scope.isAllot = true;
            //BdLeadsService.getBDManagers().then(function (result) {
            //    $scope.bdManagerList = result.data;
            //});
            BdLeadsService.getBDManagers2($scope.userInfo).then(function (result) {
                $scope.bdManagerList = result.data;
            });
        };

        $scope.getBdManagerList = function () {
            BdLeadsService.getBDManagers2($scope.userInfo).then(function (result) {
                $scope.bdManagerList = result.data;
                $scope.worksList = [];
            });
        };
        $scope.nextCourseDatas = [{"name": "今日", "id": 1}, {"name": "昨日", "id": 2}, {
            "name": "本周",
            "id": 10
        }, {"name": "上周", "id": 12}, {"name": "本月", "id": 13}, {"name": "上月", "id": 14}, {"name": "自定义", "id": 8}];
        $scope.ageDatas = [{"name": "25岁以下", "id": 22}, {"name": "26-35岁", "id": 23}, {
            "name": "36-45岁",
            "id": 24
        }, {"name": "45岁以上", "id": 25},{"name": "自定义", "id": 8}];
        $scope.BdLeadsListOk = [];
        $scope.isSelected = function (lead) {
            //console.log(student);
            for (var index in $scope.BdLeadsListOk) {
                if ($scope.BdLeadsListOk[index].bd_lead_id == lead.bd_lead_id) {
                    return true;
                }
            }
            return false;
        }
        $scope.allotBdLeadsFilter = {};
        $scope.selectOne = function (lead) {
            for (var index in $scope.BdLeadsListOk) {
                if ($scope.BdLeadsListOk[index].bd_lead_id == lead.bd_lead_id) {
                    $scope.deleteOne(lead);
                    return;
                }
            }
            $scope.BdLeadsListOk.push(lead);
        };
        $scope.deleteOne = function (lead) {
            //console.dir(lead);
            var newList = [];
            for (var index in $scope.BdLeadsListOk) {
                if ($scope.BdLeadsListOk[index].bd_lead_id != lead.bd_lead_id) {
                    newList.push($scope.BdLeadsListOk[index]);
                }
            }
            $scope.BdLeadsListOk = newList;
        };

        $scope.saveAllot = function () {
            var AllotBdLeadsVo = {};
            AllotBdLeadsVo.leadsList = $scope.BdLeadsListOk;
            AllotBdLeadsVo.owner_id = $scope.allotBdLeadsFilter.user_id;
            var promise = BdLeadsService.saveAllot(AllotBdLeadsVo);
            promise.then(function (data) {
                $scope.showListView();
                $scope.BdLeadsListOk = [];
                $scope.allotBdLeadsFilter = {};
            }, function (error) {
                alert("分配招商Leads失败");
            });
        }

        $scope.viewBdLead = function (detail) {
            if (_bakFilter)
                $location.path("/bd-admin/lead/" + detail.bd_lead_id + "/" + _bakFilter);
            else
                $location.path("/bd-admin/lead/" + detail.bd_lead_id);
        }

        $scope.editBdLead = function (detail) {
            if (_bakFilter)
                $location.path("/bd-admin/lead_edit/" + detail.bd_lead_id + "/" + _bakFilter);
            else
                $location.path("/bd-admin/lead_edit/" + detail.bd_lead_id);
            // $location.path("/bd-admin/lead_edit/"+detail.bd_lead_id);
        }

        $scope.addBdLead = function () {
            $location.path("/bd-admin/lead_edit/0");
        }

        $scope.addFranchiser = function (detail) {
            localStorageService.set("BdLeadId", detail.bd_lead_id);
            $location.path("/bd-admin/franchiser_edit/0");
        };

        $scope.downloadTemplate = function () {

        };

        $scope.excelImport = function () {
            //$scope.modalTitleForImport = '导入招商Leads';
            //$scope.modalForImport = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.importLeads.html', show: true });
            $scope.modelTitle = '招商Leads批量导入';
            $scope.modelExcel = $modal({
                scope: $scope,
                templateUrl: 'partials/bd/leads/model.importLeads.html?' + new Date().getTime(),
                show: true
            });
        };

        $scope.checkBdLead = function () {
            $scope.checkBdLeadTitle = '查询';
            $scope.checkBdLeadModel = $modal({
                scope: $scope,
                templateUrl: 'partials/bd/leads/model.checkPhone.html?' + new Date().getTime(),
                show: true
            });
        };

        $scope.doCheck = function doCheck() {
            var temp = $scope.remindLead.phone;
            var promise = BdLeadsService.findByPhone($scope.remindLead.phone);
            promise.then(function (response) {

                if (response.data != null) {
                    $scope.remindLead = response.data;
                } else {
                    $scope.remindLead = {};
                    $scope.remindLead.phone = temp;
                    //$scope.remindLead.name = "无";
                    SweetAlert.swal('该手机号码不存在');
                }
            }, function (error) {
                alert("查询招商Leads失败");
            });
        };

        /*******************************************************Leads导入start*******************************************************/
        $scope.domain = "";
        if ($location.host().indexOf("localhost") != -1) {//返回大于等于0的整数值，若不包含"localhost"则返回"-1。);
            $scope.domain = "http://" + $location.host() + ":8000/app";
        } else {
            $scope.domain = "http://" + $location.host();
        }

        //上传导入信息
        var uploader = $scope.uploader = new FileUploader({
            //url: config.endpoints.sos.LeadsStudent + '/importLeads',
            url: config.endpoints.bd.Leads + '/excelimport',
            headers: {
                'Authorization': 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
            }
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                if (this.queue.length >= 1) {
                    SweetAlert.swal('只能单个上传');
                    return false;
                }
                return this.queue.length < 1;
            }
        });

        //添加一个文件
        uploader.onAfterAddingFile = function (fileItem) {
            //判断后缀
            var fileExtend = fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();

            //console.info(fileExtend);
            if (fileExtend != '.xlsx') {
                SweetAlert.swal('请选择后缀名为xlsx格式的excel模版文件');
                fileItem.remove();
                return false;
            }

            var size = fileItem.file.size;
            if (size > 5 * 1024 * 1024) {
                SweetAlert.swal('大小不能超过5MB');
                fileItem.remove();
                return false;
            }

        };

        //添加多个文件
        uploader.onAfterAddingAll = function (addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };

        uploader.onProgressItem = function (fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
            $rootScope.ywsLoading = true;
        };

        /*uploader.onBeforeUploadItem = function(item) {
         console.info('onBeforeUploadItem', item);
         };
         uploader.onProgressItem = function(fileItem, progress) {
         console.info('onProgressItem', fileItem, progress);
         };
         uploader.onProgressAll = function(progress) {
         console.info('onProgressAll', progress);
         };*/
        /*uploader.onSuccessItem = function(fileItem, response, status, headers) {
         console.info('onSuccessItem', fileItem, response, status, headers);
         };
         uploader.onErrorItem = function(fileItem, response, status, headers) {
         console.info('onErrorItem', fileItem, response, status, headers);
         };
         uploader.onCancelItem = function(fileItem, response, status, headers) {
         console.info('onCancelItem', fileItem, response, status, headers);
         };*/

        //单个文件上传成功
        /*uploader.onCompleteItem = function(fileItem, response, status, headers) {
         //console.info('onCompleteItem', fileItem);
         if(response.data.checked){
         SweetAlert.swal(response.data.msg);
         fileItem.remove();
         //刷新我的学生Leads列表
         $scope.myCrmLeadsStudentListTableState.pagination.start = 0;
         $scope.getList($scope.myCrmLeadsStudentListTableState);
         //刷新学校学生Leads列表
         if($scope.isSchoolMaster()){
         $scope.schoolCrmLeadsStudentListTableState.pagination.start = 0;
         $scope.getSchoolCrmLeadsStudentList($scope.schoolCrmLeadsStudentListTableState);
         }
         }else{
         SweetAlert.swal(response.data.msg);
         fileItem.remove();
         }
         //SweetAlert.swal(response.data.msg);
         };*/

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            //console.info(response);
            if (response.status == 'SUCCESS') {
                if (response.data.code == 1) {
                    /* SweetAlert.swal(response.data.msg + ":" + response.data.infos);*/

                    $scope.alertErr = [];
                    $scope.alertErr[0] = {};
                    $scope.alertErr[0].err = response.data.msg;

                    for (var i = 0; i < response.data.infos.length; i++) {
                        $scope.alertErr[i + 1] = {};
                        $scope.alertErr[i + 1].err = response.data.infos[i];
                    }
                    $scope.errType = 1;
                    $scope.modal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(),
                        show: true
                    });
                } else if (response.data.code == 0) {
                    SweetAlert.swal(response.data.msg);
                }
                $scope.showListView();
                $scope.modelExcel.hide();
            } else {

                if (response.data != null) {

                    $scope.alertErr = [];
                    $scope.alertErr[0] = {};
                    $scope.alertErr[0].err = response.error + "：";
                    var i = 0;
                    angular.forEach(response.data, function (err) {
                        var msgs = "";
                        msgs += "第" + err.line + "行 ";
                        angular.forEach(err.infos, function (info) {
                            msgs += info + "  ";
                        });
                        $scope.alertErr[i + 1] = {};
                        $scope.alertErr[i + 1].err = msgs;
                        i++;
                    });
                    $scope.errType = 1;
                    $scope.modal = $modal({
                        scope: $scope,
                        templateUrl: 'partials/bd/leads/lead_err_model.html?' + new Date().getTime(),
                        show: true
                    });
                } else {
                    SweetAlert.swal(response.error);
                }
                $scope.showListView();
                $scope.modelExcel.hide();

            }
            fileItem.remove();
            $rootScope.ywsLoading = false;
            //SweetAlert.swal(response.data.msg);
        };
        //全部上传成功
        /*uploader.onCompleteAll = function() {
         //console.info('onCompleteAll');
         };*/

        //console.info('uploader', uploader);
        /*******************************************************Leads导入end*******************************************************/

        function changeLeadCheckbox(row) {
            var is = false;
            for (var i = 0; i < $scope.batchList.length; i++) {
                if (row.bd_lead_id == $scope.batchList[i]) {
                    $scope.batchList.splice(i, 1);
                    is = true;
                }
            }
            if (!is) {
                Array.prototype.push.call($scope.batchList, row.bd_lead_id);
            }
        }

        /**
         * 批量判断是否被选中
         * @param row
         * @returns {boolean}
         */
        function ifLeadChecked(row) {
            var lists = $scope.batchList;
            for (var i = 0; i < lists.length; i++) {
                if (row.bd_lead_id == lists[i]) {
                    return true;
                }
            }
            return false;
        }

        function changeWorkCheckbox(row) {
            var is = false;
            for (var i = 0; i < $scope.worksList.length; i++) {
                if (row.userId == $scope.worksList[i]) {
                    $scope.worksList.splice(i, 1);
                    is = true;
                }
            }
            if (!is) {
                Array.prototype.push.call($scope.worksList, row.userId);
            }
        }

        /**
         * 批量判断是否被选中
         * @param row
         * @returns {boolean}
         */
        function ifWorkChecked(row) {
            var lists = $scope.worksList;
            for (var i = 0; i < lists.length; i++) {
                if (row.userId == lists[i]) {
                    return true;
                }
            }
            return false;
        }

        function ifBatchChecked() {
            $scope.isBatchOperate = !($scope.isBatchOperate);
        }

        $scope.distribute = function () {
            var param = {};
            param.leads = $scope.batchList;
            param.works = $scope.worksList;
            var promise = BdLeadsService.distribute(param);
            promise.then(function (response) {
                    if (response.status == 'SUCCESS') {
                        SweetAlert.swal('操作成功');
                        $scope.showListView();
                        $scope.batchList = [];
                        $scope.worksList = [];
                        //$scope.gotoListView();
                    } else {
                        SweetAlert.swal(response.error);
                    }
                },
                function (error) {
                    SweetAlert.swal('开始任务失败', '请重试', 'error');
                });
        };

        $scope.batchDistribute = function () {
            if ($scope.batchNum == null) {
                SweetAlert.swal('批量操作人数不合法');
                return false;
            }
            if ($scope.batchNum > $scope.leadNum) {
                SweetAlert.swal('批量操作人数不能大于总人数');
                return false;
            }
            if ($scope.batchNum <= 0) {
                SweetAlert.swal('批量操作人要大于1');
                return false;
            }
            $scope.bdLeadsFilter.works = $scope.worksList;
            $scope.bdLeadsFilter.limit = $scope.batchNum;
            var promise = BdLeadsService.batchDistribute($scope.bdLeadsFilter);
            promise.then(function (response) {
                    if (response.status == 'SUCCESS') {
                        SweetAlert.swal('操作成功');
                        $scope.showListView();
                        $scope.batchList = [];
                        $scope.worksList = [];
                        //$scope.gotoListView();
                    } else {
                        SweetAlert.swal(response.error);
                    }
                },
                function (error) {
                    SweetAlert.swal('开始任务失败', '请重试', 'error');
                });
        };

        $scope.gotoListView = function () {
            history.go(0);
        };
        $scope.$editColList = [
            //1
            {
                id: 2,
                name: '备注信息',
                select: 1
            },
            //3
            {
                id: 4,
                name: '沟通类型',
                select: 1
            },
            {
                id: 5,
                name: '性别',
                select: 1
            },
            {
                id: 6,
                name: '年龄',
                select: 0
            },
            {
                id: 7,
                name: '学历',
                select: 0
            },
            {
                id: 8,
                name: '婚否',
                select: 0
            },
            {
                id: 9,
                name: '育否',
                select: 0
            },
            {
                id: 10,
                name: '职业背景',
                select: 1
            },
            {
                id: 11,
                name: '兴趣',
                select: 0
            },
            {
                id: 12,
                name: '客户类型',
                select: 1
            },
            //13
            {
                id: 14,
                name: '咨询项目',
                select: 1
            },
            {
                id: 15,
                name: '意向区域',
                select: 1
            },
            {
                id: 16,
                name: '真实意向',
                select: 0
            },
            {
                id: 17,
                name: '加盟原因',
                select: 1
            },
            {
                id: 18,
                name: '渠道来源',
                select: 1
            },
            {
                id: 19,
                name: '渠道详情',
                select: 1
            },
            {
                id: 20,
                name: '媒体影响',
                select: 0
            },
            {
                id: 21,
                name: '省',
                select: 1
            },
            {
                id: 22,
                name: '市',
                select: 1
            },
            {
                id: 23,
                name: '县(区)',
                select: 2
            },
            {
                id: 24,
                name: '所属人',
                select: 0
            },
            {
                id: 25,
                name: '创建时间',
                select: 0
            }
        ]
        if(!$rootScope.showPermissions('BdLeadsViewAll')){
            $scope.$editColList.splice($scope.$editColList.length-2,1)
            $scope.$editColList[$scope.$editColList.length-1].id=24
        }
        ;(function init() {
            $scope.batchList = [];
            $scope.worksList = [];
            ColEdit.isHasData($scope,'_editColList');
            $optionData.initData($scope);
        })();
    }
]);
