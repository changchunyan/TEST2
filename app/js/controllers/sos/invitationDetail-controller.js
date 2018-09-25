
/**
 * The InvitationDetail management controller.
 *
 * @author zhanghongjie@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('InvitationDetailController', ['$scope','$routeParams', 'InvitationDetailService','InvitationRemindService','InvitationCommunicationService','LeadsStudentService','CustomerStudentService','CommonService','localStorageService','OrderService', '$modal', '$rootScope', 'SweetAlert','AuthenticationService','StuDetail','$mtModal','$timeout','CoursePlanService',
    function($scope, $routeParams,InvitationDetailService,InvitationRemindService,InvitationCommunicationService,LeadsStudentService,CustomerStudentService,CommonService,localStorageService, OrderService,$modal, $rootScope, SweetAlert,AuthenticationService,StuDetail,$mtModal,$timeout,CoursePlanService) {
        //初始值
        $scope.CrmInvitationDetailVoForCreate = {};
        $scope.detail = {};
        $scope.invitationFilter={}
        $scope.add = add;
        $scope.save = save;
        $scope.edit = edit;
        $scope.remove = remove;
        $scope.view = view;
        $scope._detail_ = _detail
        $scope.allot = allot;
        $scope.isAdding = false;
        $scope.isDetail = false;
        $scope._detail_ = _detail
        $scope.hideAddView = hideAddView;
        $scope.saveInvitationDetail = saveInvitationDetail;
        $scope.showButton=showButton;
        $scope.CrmInvitationRemindVoForCreate = {};
        $scope.addInvitationRemind = addInvitationRemind;
        $scope.saveInvitationRemind = saveInvitationRemind;
        $scope.editInvitationRemind = editInvitationRemind;
        $scope.deleteInvitationRemind = deleteInvitationRemind;

        $scope.CrmInvitationCommunicationVoForCreate = {};
        $scope.addInvitationCommunication = addInvitationCommunication;
        $scope.saveInvitationCommunication = saveInvitationCommunication;
        $scope.editInvitationCommunication = editInvitationCommunication;
        $scope.deleteInvitationCommunication = deleteInvitationCommunication;
        $scope.visit=visit;
        $scope.editInvitationDetail = editInvitationDetail;
        $scope.deleteInvitationDetail = deleteInvitationDetail;
        $scope.CrmInvitationDetailVoForCreate = {};
        $scope.addInvitationDetail = addInvitationDetail;



        $scope.removeBrand = removeBrand;
        $scope.saveBrand = saveBrand;
        $scope.editBrand = editBrand;

        //  zhj
        $scope.changeSelectMore = changeSelectMore;
        $scope.searchReset = searchReset
        //获取当前登录用户的学校ID
        $scope.school_id = localStorageService.get('school_id');

        $scope.leadGradeIds = [{name:'小学一年级',id:1},{name:'小学二年级',id:2}];
        $scope.mediaChannel1List = [];
        $scope.studentId=0;
        $scope.studentName='';
        $scope.studentState=0;

        function _getNumber(){
            InvitationDetailService.getNumber().then(function (result) {
                $scope.num = {
                    invitates:result[0].invitates || 0 ,
                    calls:result[0].calls ||0,
                };
                console.log(result);
            });
        }
        $scope.mobile = {
            listsStart:0,
            detail:{},//详情
            getLists:function(){
                var start = $scope.mobile.listsStart || 0;
                var number = 20;
                var tableState = {
                    search:{}
                }
                //LeadsStudentService.listByMobile(start, number, $scope.myCrmLeadsStudentFilter).then(function (result) {
                InvitationDetailService.list(start, number,tableState).then(function (result) {
                    //console.dir(result.data);
                    if($scope.invitationList && $scope.invitationList.length>0){
                        $scope.invitationList = $scope.invitationList.concat(result.data);
                    }else{
                        $scope.invitationList = result.data;
                    }

                    $scope.mobile.listsStart = $scope.mobile.listsStart+number;
                });
            }
        };

        $scope.showStudentListModal = function(){
            $scope.modalTitleForStudentList = '学生查询';
            $scope.modalForStudentList = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.studentList.html', show: true });
            /* $scope.queryStudent();*/
        };

        /**
         * 快速查询
         */
        $scope.quick = [];
        $scope.filter = {};
        $scope.Invitationquick = function Invitationquick(i) {
            if($scope.quick[i]){
                $scope.quick[i] = false;
                if(i==1){
                    $scope.myCrmInvitationDetailTableState.search.predicateObject.invitateTime=null;
                }else{

                    $scope.myCrmInvitationDetailTableState.search.predicateObject.receiveTime=null;
                }
                $scope.getList($scope.myCrmInvitationDetailTableState);
            }else{
                if(i==1){
                    $scope.quick[i] = true;
                }
                if(i==2){
                    $scope.quick[i] = true;
                    $scope.quick[3] = false;
                }
                if(i==3){
                    $scope.quick[i] = true;
                    $scope.quick[2] = false;
                }

                _setFilter(i);
                $scope.getList($scope.myCrmInvitationDetailTableState);
                $scope.filter.start_time = null;
                $scope.filter.end_time = null;
            }

        };

        $scope.filter = {};
        function _setFilter(i){
            if(!$scope.myCrmInvitationDetailTableState.search.predicateObject){
                $scope.myCrmInvitationDetailTableState.search.predicateObject = {};
            }
            if(i==1){//今日邀约


                $scope.myCrmInvitationDetailTableState.search.predicateObject.invitateTime = new Date().Format('yyyy-MM-dd');

            }else if(i==2){//今日到访

                $scope.myCrmInvitationDetailTableState.search.predicateObject.receiveTime = new Date().Format('yyyy-MM-dd');

            }else if(i==3){//明日到访

                $scope.myCrmInvitationDetailTableState.search.predicateObject.receiveTime = new Date(new Date().getTime()+24*60*60*1000).Format('yyyy-MM-dd');


            }else {

            }

        }

        $scope.Brandquick = [];
        $scope.filter = {};
        $scope.BrandInvitationquick = function BrandInvitationquick(i) {
            if($scope.Brandquick[i]){
                $scope.Brandquick[i] = false;
                if(i==1){
                    $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject.invitateTime=null;
                }else{

                    $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject.receiveTime=null;
                }
                $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
            }else{
                if(i==1){
                    $scope.Brandquick[i] = true;
                }
                if(i==2){
                    $scopeBrandquick[i] = true;
                    $scope.Brandquick[3] = false;
                }
                if(i==3){
                    $scope.Brandquick[i] = true;
                    $scope.Brandquick[2] = false;
                }

                _setFilterBrand(i);
                $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
                $scope.filter.start_time = null;
                $scope.filter.end_time = null;
            }

        };

        $scope.filter = {};
        function _setFilterBrand(i){
            if(!$scope.myCrmInvitationDetailTableStateBrand.search.predicateObject){
                $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject = {};
            }
            if(i==1){//今日邀约


                $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject.invitateTime = new Date().Format('yyyy-MM-dd');

            }else if(i==2){//今日到访

                $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject.receiveTime = new Date().Format('yyyy-MM-dd');

            }else if(i==3){//明日到访

                $scope.myCrmInvitationDetailTableStateBrand.search.predicateObject.receiveTime = new Date(new Date()+24*60*60*1000).Format('yyyy-MM-dd');
            }else {

            }

        }

        $scope.BrandOtherquick = [];
        $scope.filter = {};
        $scope.BrandOtherInvitationquick = function BrandOtherInvitationquick(i) {
            if($scope.BrandOtherquick[i]){
                $scope.BrandOtherquick[i] = false;
                if(i==1){
                    $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject.invitateTime=null;
                }
                else{
                    $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject.receiveTime=null;
                }
                $scope.getListBrandOther($scope.myCrmInvitationDetailTableStateBrandOther);
            }
            else{
                if(i==1){
                    $scope.BrandOtherquick[i] = true;
                }
                if(i==2){
                    $scope.BrandOtherquick[i] = true;
                    $scope.BrandOtherquick[3] = false;
                }
                if(i==3){
                    $scope.BrandOtherquick[i] = true;
                    $scope.BrandOtherquick[2] = false;
                }
                _setFilterBrandOther(i);
                $scope.getListBrandOther($scope.myCrmInvitationDetailTableStateBrandOther);
                $scope.filter.start_time = null;
                $scope.filter.end_time = null;
            }
        };

        $scope.filter = {};
        function _setFilterBrandOther(i){
            if(!$scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject){
                $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject = {};
            }
            if(i==1){//今日邀约
                $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject.invitateTime = new Date().Format('yyyy-MM-dd');
            }
            else if(i==2){//今日到访
                $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject.receiveTime = new Date().Format('yyyy-MM-dd');
            }
            else if(i==3){//明日到访
                $scope.myCrmInvitationDetailTableStateBrandOther.search.predicateObject.receiveTime = new Date(new Date().getTime()+24*60*60*1000).Format('yyyy-MM-dd');
            }
        }




        /**
         * 品牌
         */
        $scope.showStudentListModalBrand = function (){
            $scope.modalTitleForStudentList = '学生查询';
            $scope.modalForStudentList = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.studentListBrand.html', show: true });
        }

        function showButton(school_id){

            if($scope.school_id==school_id){
                return true;
            }else{
                return false;
            }



        }

        $scope.checkPhone = function(){
            if( $scope.CrmInvitationDetailVoForCreate.leadPhone && $scope.CrmInvitationDetailVoForCreate.leadPhone != '' ){
                /*OrderService.checkPhone($scope.CrmInvitationDetailVoForCreate.leadPhone).then(function (result) {
                 if( result.status == 'SUCCESS' ){

                 }else{
                 $scope.CrmInvitationDetailVoForCreate.leadPhone = '';
                 SweetAlert.swal('手机号重复');
                 }
                 });*/
                var phoneVo = {"phone":$scope.CrmInvitationDetailVoForCreate.leadPhone};
                //console.log(phoneVo);
                var promise = CommonService.repeat(phoneVo);
                promise.then(
                    function(data){
                        //console.log(data);
                        if(data.status == 'FAILURE'){
                            //alert(data.data.repeateMsg);
                            /*SweetAlert.swal(data.data.repeateMsg,"学生姓名:"+data.data.name+"    所属人:"+data.data.userName
                             +"    学生状态:"+(data.data.state == 1 ? "在读学员" : "意向客户"));*/

                            $scope.repeateData = data.data;
                            $scope.modalForRepeatTitle = '电话号码重复';
                            $scope.modalForRepeat = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                            $scope.CrmInvitationDetailVoForCreate.leadPhone = null;
                        }
                    },
                    function(data){
                        console.log(data);
                    }
                );

            }
        }

        $scope.modalForRepeatHide = function(){
            $scope.modalForRepeat.hide();
        }

        $scope.selectIt = function(row){
            $scope.studentId=row.crm_student_id;
            $scope.studentName=row.name;
            $scope.studentState=row.state;
        };

        $scope.isSelected = function(row){
            return $scope.studentId == row.crm_student_id;
        };

        $scope.studentFilter = {};
        $scope.studentList =  [];
        $scope.studentListTableState = {};
        /* $scope.studentListFirst = false;*/
        $scope.currentPagination = {};
        $scope.getCrmStudentList = function callServer(tableState) {
            if( $scope.studentListFirst ){
                tableState.pagination.start = 0;
                tableState.pagination.number = 10;
            }
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 10;  // Number of entries showed per page.
            $scope.studentListTableState = tableState;
            /*  if(($scope.currentPagination.start != start || $scope.currentPagination.number != number) ){
             return false;
             }*/

            //console.dir(tableState);
            $scope.isSchoolLoading = true;
            $scope.currentPagination = tableState.pagination;
            OrderService.listStudent(start, number, tableState,$scope.studentFilter).then(function (result) {
                //console.dir(result.data);
                //$scope.getAllSelected();
                $scope.studentId=0;
                $scope.studentList = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.studentListTableState = tableState;
                $scope.isSchoolLoading = false;
                $scope.studentListFirst = false;
            });
        };

        $scope.queryStudent = function(){
            $scope.studentListFirst = true;
            $scope.getCrmStudentList($scope.studentListTableState);

        };
        $scope.reset = function(){
            $scope.studentFilter={};
        }

        $scope.newCustomerAndInvite = function(){
            $scope.callServerOrderCourseSelect();
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = $scope.studentState;
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.studentId;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.saveType = 2;
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true});
        };

        $scope.getGradeIdSelect = function getGradeIdSelect() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.leadGradeIds = result.data;
            });
        }();

        $scope.selectedInvite = function(){
            if( $scope.studentId == 0 ){
                SweetAlert.swal('请先选中学生');
                return false;
            }

            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = $scope.studentState;
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.studentId;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.saveType = 1;
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true});
        };

        $scope.callServerOrderCourseSelect = function callServerOrderCourseSelect() {
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            CommonService.getMediaChannel(0).then(function (result) {
                //alert("getMediaChannel");
                $scope.mediaChannel1List = result.data;
            });
        };


        /**
         * 列表
         */
        $scope.getList = function callServer(tableState) {
            $scope.school_id = localStorageService.get('school_id');
            $scope.myCrmInvitationDetailTableState = tableState;

            $scope.isLoading = true;
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            /*console.log('call server'+tableState);*/

            if(tableState.search.predicateObject){
                if (typeof tableState.search.predicateObject.mediaChannelId1 === 'undefined') {
                }else{
                    var obj1 = eval(tableState.search.predicateObject.mediaChannelId1);
                    tableState.search.predicateObject.mediaChannelId1 = obj1;
                }
                if (typeof tableState.search.predicateObject.mediaChannelId2 === 'undefined') {
                }else{
                    var obj2 = eval(tableState.search.predicateObject.mediaChannelId2);
                    tableState.search.predicateObject.mediaChannelId2 = obj2;
                }
            }
            InvitationDetailService.list($scope.start, $scope.number,tableState,$scope.invitationFilter).then(function (result) {
                //console.log(result.data);
                $scope.getAllSelected();
                $scope.displayedrrceive = result.data;

                for (var i = 0; i < $scope.displayedrrceive.length; i++) {
                    if(typeof($scope.displayedrrceive[i].lastInvitateTime)=='string'){
                        $scope.displayedrrceive[i].lastInvitateTime = new Date(Date.parse( $scope.displayedrrceive[i].lastInvitateTime.replace(/-/g, "/")));
                    }
                    if(typeof($scope.displayedrrceive[i].lastViewTime)=='string'){
                        $scope.displayedrrceive[i].lastViewTime = new Date(Date.parse( $scope.displayedrrceive[i].lastViewTime.replace(/-/g, "/")));
                    }
                    if(typeof($scope.displayedrrceive[i].createAt)=='string'){
                        $scope.displayedrrceive[i].createAt = new Date(Date.parse( $scope.displayedrrceive[i].createAt.replace(/-/g, "/")));
                    }
                }
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
                //选择列的初始化 需要放在 接口调成功之后
                setTimeout(function () {
                    // angular.element('#body').scroll()
                    initCol()
                    resatList()
                }, 100)

            });



        };

        /**
         * 品牌中心-邀约列表
         */
        $scope.getListBrand = function callServer(tableState) {
            $scope.myCrmInvitationDetailTableStateBrand = tableState;
            $scope.isLoading = true;
            if(!tableState){
                tableState= {
                    pagination:{},
                    search:{}
                };
            }
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.

            if(tableState.search.predicateObject){
                if (typeof tableState.search.predicateObject.mediaChannelId1 === 'undefined') {
                }else{
                    var obj1 = eval(tableState.search.predicateObject.mediaChannelId1);
                    tableState.search.predicateObject.mediaChannelId1 = obj1;
                }
                if (typeof tableState.search.predicateObject.mediaChannelId2 === 'undefined') {
                }else{
                    var obj2 = eval(tableState.search.predicateObject.mediaChannelId2);
                    tableState.search.predicateObject.mediaChannelId2 = obj2;
                }
            }else{
                tableState.search.predicateObject = {};
                tableState.search.predicateObject.listType = 1;
            }

            //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
            if($rootScope.showPermissions('PermissionForCallCenter')){
                tableState.search.predicateObject.mediaChannelId1 = 1;
                tableState.search.predicateObject.mediaChannelId2 = 30;
                //传递部门id
                tableState.search.predicateObject.departmentId = localStorageService.get('department_id');
                tableState.search.predicateObject.PermissionForCallCenter = '1';
            }

            InvitationDetailService.listBrand($scope.start, $scope.number,tableState).then(function (result) {
                $scope.getAllSelected();
                $scope.displayedrrceive = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        };

        /**
         * 判断是否为线上运营人员岗位
         */
        $scope.isO2OOperationSpecialist = function(){
            var isO2OOperationSpecialist = false;
            if(AuthenticationService.currentUser().position_id == Constants.PositionID.O2O_OPERATION_SPECIALIST){
                isO2OOperationSpecialist = true;
            }
            return isO2OOperationSpecialist;
        }

        /**
         * 品牌中心或者线上o2o-邀约其他校区
         */
        $scope.getListBrandOther = function callServer(tableState) {
            $scope.myCrmInvitationDetailTableStateBrandOther = tableState;
            $scope.isLoading = true;
            if(!tableState){
                tableState= {
                    pagination:{},
                    search:{}
                };
            }
            $scope.pagination = tableState.pagination;
            $scope.start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            $scope.number = $scope.pagination.number || 10;  // Number of entries showed per page.
            // 设置一级媒体渠道不可用、并值为媒体
            $scope.mediaChannelDisabled = true;
            if($scope.isO2OOperationSpecialist()){
                $scope.invitationFilter.mediaChannelId1 = Constants.MediaChannel.CHANNEL8;
            }
            else{
                $scope.invitationFilter.mediaChannelId1 = Constants.MediaChannel.CHANNEL4;
            }
            if(tableState.search.predicateObject){
                if (typeof tableState.search.predicateObject.mediaChannelId2 === 'undefined') {
                }else{
                    var obj2 = eval(tableState.search.predicateObject.mediaChannelId2);
                    tableState.search.predicateObject.mediaChannelId2 = obj2;
                }
            }else{
                tableState.search.predicateObject = {};
                tableState.search.predicateObject.listType = 2;
                tableState.search.predicateObject.isO2O = true;
                CommonService.getMediaChannel(Constants.MediaChannel.CHANNEL4).then(function (result) {
                    $scope.mediaChannel2List = result.data;
                });
            }
            //如果是呼叫权限的人，则查询所属机构下校区的数据，呼叫客信的数据
            if($rootScope.showPermissions('PermissionForCallCenter')){
                tableState.search.predicateObject.mediaChannelId1 = 1;
                tableState.search.predicateObject.mediaChannelId2 = 30;
                //传递部门id
                tableState.search.predicateObject.departmentId = localStorageService.get('department_id');
                tableState.search.predicateObject.PermissionForCallCenter = '1';
            }
            InvitationDetailService.listBrand($scope.start, $scope.number,tableState).then(function (result) {
                $scope.getAllSelected();
                $scope.displayedrrceive = result.data;
                tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                $scope.isLoading = false;
            });
        };
        /*
         * 对选中的进行邀约
         */
        $scope.selectedInviteBrand = function(){
            if( $scope.studentId == 0 ){
                SweetAlert.swal('请先选中学生');
                return false;
            }

            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = $scope.studentState;
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.studentId;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            $scope.saveType = 3;
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailBrand.html', show: true});
        };
        /*
         * 保存选中的邀约
         */
        $scope.saveInvitationDetailSelectedBrand = function() {
            if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date()){
                SweetAlert.swal("预到访时间不能小于当天时间");
            }else{
                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                    $scope.queryStudent();
                    $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
                    SweetAlert.swal("操作成功");
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }
        };
        /**
         *品牌-创建意向并新增
         */
        $scope.newCustomerAndInviteBrand = function(){
            $scope.callServerOrderCourseSelect();
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = $scope.studentState;
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.studentId;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.saveType = 2;
            $scope.modalTitle = '添加邀约';
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd h:mm");
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailBrand.html', show: true});
        };
        /**
         * Shows the new invitationDetail dialog.
         */
        function add(personState,personType,personId) {
            /*console.log('Starting creating new invitationDetail.');*/
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = personState;
            $scope.CrmInvitationDetailVoForCreate.personType = personType;
            $scope.CrmInvitationDetailVoForCreate.personId = personId;

            $scope.CrmInvitationDetailVoForCreate.isinside = '0';

            showModal();
        }

        /**
         * Shows the invitationDetail modal.
         * It checks $scope.invitationDetail for existence. If it exists, it tries to render it.
         * The logic is handled by angular itself.
         */
        function showModal() {
            $scope.modalTitle = typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined' ? '添加邀约到访' : '更新邀约到访';
            if(typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined'){
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true});
            }else{
                $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailEdit.html', show: true});
            }
        }



        /**
         * Saves the current invitationDetail.
         */
        function save() {
            /*console.log('Saving the invitationDetail.');*/
            $scope.dataLoading = true;
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
            if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.hideAddView();
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            } else {
                var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.hideAddView();
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }
            $scope.hideAddView();
        }
        /**
         * 保存
         */
        function saveBrand(){
            $scope.dataLoading = true;
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
            if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }else {
                var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }
            $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
        }

        /**
         * 品牌-创建意向并保存
         */
        $scope.saveInvitationDetailNewBrand = function() {
            if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date()){
                SweetAlert.swal("预到访时间不能小于当天时间");
            }else{
                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                var promise = InvitationDetailService.createWithLead($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(response) {
                    if(response.status == 'SUCCESS' ){
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        $scope.queryStudent();
                        $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
                        SweetAlert.swal("操作成功");
                    }else{
                        SweetAlert.swal("操作失败");
                    }
                    $scope.dataLoading = false;
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }
        };

        /**
         * Edit InvitationDetail.
         * @param InvitationDetail the InvitationDetail to edit
         */
        function edit(crmInvitationDetail) {
            /*console.log('Editing invitationDetail : ' + JSON.stringify(crmInvitationDetail));*/
            $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime).Format("yyyy-MM-dd");
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime).Format("yyyy-MM-dd h:mm");
            $scope.CrmInvitationDetailVoForCreate.isinside = '0';

            showModal();
        }

        /**
         * 编辑
         */
        function editBrand(crmInvitationDetail){
            $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime).Format("yyyy-MM-dd h:mm");
            $scope.CrmInvitationDetailVoForCreate.isinside = '3';
            showModal();
        }



        /**
         * Delete InvitationDetail.
         * @param InvitationDetail the InvitationDetail to delete
         */
        function remove(crmInvitationDetail) {
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        InvitationDetailService.remove(crmInvitationDetail).then(function(result){
                            $scope.hideAddView();
                        })
                    }
                }
            );

        }
        /*
         * 删除-品牌中心
         */
        function removeBrand(crmInvitationDetail) {
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        InvitationDetailService.remove(crmInvitationDetail).then(function(result){
                            $scope.getListBrand($scope.myCrmInvitationDetailTableStateBrand);
                        })
                    }
                }
            );

        }


        /**
         * view InvitationDetail.
         * @param InvitationDetail the InvitationDetail to view
         */
        function view(crmInvitationDetail) {
            /* console.log('Viewing InvitationDetail : ' + JSON.stringify(crmInvitationDetail));*/
            $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);

            $scope.modalTitle = '抱歉，您无法查看例子信息';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailView.html', show: true});
        }

        /**
         * view LeadsStudent detail
         */
        $scope.viewCrmLeadsStudent = function(detail){
            //console.log(detail);
            var det = angular.copy(detail);
            $scope.isDetail = true;
            $scope.isAdding = true;
            //console.dir(detail);
            //detail.leads_student_id = detail.leadsStudentId;
            LeadsStudentService.detail(detail).then(function(result){
                console.log(result);
                $scope.detail = result;
            })
            var tableState ={'pagination':{},'search':{'predicateObject':{}}};
            $scope.detail = angular.copy(detail);
            $scope.getRemindList(tableState);
            $scope.getCommunicationList(tableState);
            $scope.getInvitationList(tableState);

        };


        /**
         * view CustomerStudent detail
         */
        $scope.viewCrmCustomerStudent = function(detail){
            //console.log(detail);
            $scope.isDetail = true;
            $scope.isAdding = true;

            //console.dir(detail);
            CustomerStudentService.detail(detail).then(function(result){
                //console.dir(result);
                $scope.detail = result;
            })

            var tableState ={'pagination':{},'search':{'predicateObject':{}}};
            $scope.detail = angular.copy(detail);
            //$scope.callServerNormalOrderTab(tableState);
            //$scope.callServerRestitutionTab(tableState);
            //$scope.callServerPaymentTab(tableState);

            $scope.getRemindList(tableState);
            $scope.getCommunicationList(tableState);
            $scope.getInvitationList(tableState);

        };



        // /**
        // * 提醒列表
        // */
        // $scope.CrmLeadsStudentRemindList =  [];
        // $scope.getRemindList = function callServer(tableState) {
        // try{
        //     	tableState.search.predicateObject.student_data_id = $scope.detail.crm_student_id;
        //     }
        // catch(e)
        //     {
        //
        //     }
        //   $scope.myCrmLeadsStudentRemindListTableState = tableState;
        //   //console.dir(tableState);
        //   $scope.isRemindLoading = true;
        //   var pagination = tableState.pagination;
        //   var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        //   var number = pagination.number || 10;  // Number of entries showed per page.
        //   InvitationRemindService.list(start, number, tableState,$scope.myCrmLeadsStudentFilter).then(function (result) {
        //       //console.dir(result.data);
        //     //$scope.getAllSelected();
        //     $scope.CrmLeadsStudentRemindList = result.data;
        //     tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        //     $scope.isRemindLoading = false;
        //   });
        // };
        //
        // /**
        // * 沟通列表
        // */
        // $scope.CrmLeadsStudentCommunicationList =  [];
        // $scope.getCommunicationList = function callServer(tableState) {
        //  try{
        //      	tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
        //      }
        //  catch(e)
        //      {
        //      }
        //   $scope.myCrmLeadsStudentCommunicationListTableState = tableState;
        //   //console.dir(tableState);
        //   $scope.isCommunicationLoading = true;
        //   var pagination = tableState.pagination;
        //   var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        //   var number = pagination.number || 10;  // Number of entries showed per page.
        //   InvitationCommunicationService.list(start, number, tableState,$scope.myCrmLeadsStudentFilter).then(function (result) {
        //     //console.dir(result.data);
        //     //$scope.getAllSelected();
        //     $scope.CrmLeadsStudentCommunicationList = result.data;
        //     tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        //     $scope.isCommunicationLoading = false;
        //   });
        // };
        //
        // /**
        // * 邀约列表
        // */
        // $scope.CrmLeadsStudentInvitationList =  [];
        // $scope.getInvitationList = function callServer(tableState) {
        // try{
        //       tableState.search.predicateObject.student_data_id = $scope.detail.crm_student_id;
        //    }
        // catch(e)
        //    {
        //    }
        //   $scope.myCrmLeadsStudentInvitationListTableState = tableState;
        //   //console.dir(tableState);
        //   $scope.isInvitationLoading = true;
        //   var pagination = tableState.pagination;
        //   var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        //   var number = pagination.number || 10;  // Number of entries showed per page.
        //   InvitationDetailService.viewlist(start, number, tableState,$scope.myCrmLeadsStudentFilter).then(function (result) {
        //     //console.dir(result.data);
        //     //$scope.getAllSelected();
        //     $scope.CrmLeadsStudentInvitationList = result.data;
        //     tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
        //     $scope.isInvitationLoading = false;
        //   });
        // };


        /**
         * Shows the new invitationRemind dialog.
         */
        function addInvitationRemind() {
            /*  console.log('Starting creating new invitationRemind.');*/
            $scope.CrmInvitationRemindVoForCreate = {};
            $scope.CrmInvitationRemindVoForCreate.personState = '2';
            $scope.CrmInvitationRemindVoForCreate.personType = '1';
            $scope.CrmInvitationRemindVoForCreate.personId = $scope.detail.student_data_id;

            $scope.modalTitle = '添加邀约提醒';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html', show: true});

        }
        /**
         * Saves the current invitationRemind.
         */
        function saveInvitationRemind() {
            /* console.log('Saving the invitationRemind.');*/
            $scope.dataLoading = true;
            if (typeof $scope.CrmInvitationRemindVoForCreate.id === 'undefined') {
                var promise = InvitationRemindService.create($scope.CrmInvitationRemindVoForCreate);
                promise.then(function(CrmInvitationRemindVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            } else {
                var promise = InvitationRemindService.update($scope.CrmInvitationRemindVoForCreate);
                promise.then(function(CrmInvitationRemindVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                }, function(error) {
                    $scope.dataLoading = false;
                });
            }

        }
        /**
         * Edit InvitationRemind.
         * @param InvitationRemind the InvitationRemind to edit
         */
        function editInvitationRemind(crmInvitationRemind) {
            /*  console.log('Editing invitationRemind : ' + JSON.stringify(crmInvitationRemind));*/
            $scope.CrmInvitationRemindVoForCreate = angular.copy(crmInvitationRemind);

            $scope.modalTitle = '更新邀约提醒';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationRemind/modal.invitationRemind.html', show: true});

        }
        /**
         * Delete InvitationRemind.
         * @param InvitationRemind the InvitationRemind to delete
         */
        function deleteInvitationRemind(crmInvitationRemind) {

            /*console.log('Deleting InvitationRemind : ' + JSON.stringify(crmInvitationRemind));*/

            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: ' #fe9900',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        InvitationRemindService.remove(crmInvitationRemind).then(function(result){
                            //console.dir(result);
                        })
                    }
                }
            );

        }

        /**
         * Edit InvitationCommunication.
         * @param InvitationCommunication the InvitationCommunication to edit
         */

        /**
         * Delete InvitationCommunication.
         * @param InvitationCommunication the InvitationCommunication to delete
         */



        /**
         * Shows the new invitationDetail dialog.
         */
        function addInvitationDetail() {

            /*  console.log('Starting creating new invitationDetail.');*/
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = '2';
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = $scope.detail.student_data_id;

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();

            $scope.modalTitle = '添加邀约';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetail.html', show: true});

        }

        $scope.saveInvitationDetailSelected = function() {
            if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date())
            {
                SweetAlert.swal("预到访时间不能小于当天时间");
            }
            else{
                //$scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);

                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(CrmInvitationDetailVoForCreate) {
                    $scope.dataLoading = false;
                    $scope.modal.hide();
                    $scope.queryStudent();
                    $scope.getList($scope.myCrmInvitationDetailTableState);
                    SweetAlert.swal("操作成功");
                }, function(error) {
                    $scope.dataLoading = false;
                });

            }
        };

        $scope.saveInvitationDetailNew = function() {
            if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date())
            {
                SweetAlert.swal("预到访时间不能小于当天时间");
            }
            else{
                //$scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);
                $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                var promise = InvitationDetailService.createWithLead($scope.CrmInvitationDetailVoForCreate);
                promise.then(function(response) {
                    if( response.status == 'SUCCESS' ){
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        $scope.queryStudent();
                        $scope.getList($scope.myCrmInvitationDetailTableState);
                        SweetAlert.swal("操作成功");
                    }else{
                        SweetAlert.swal("操作失败");
                    }
                    $scope.dataLoading = false;
                }, function(error) {
                    $scope.dataLoading = false;
                });

            }
        };


        /**
         * 显示列表页面
         */
        function hideAddView() {
            $scope.isDetail = false;
            $scope.isAdding = false;
            //刷新列表
            /* $scope.myCrmInvitationDetailTableState.pagination.start = 0;*/
            $scope.getList($scope.myCrmInvitationDetailTableState);

        }


        /**
         * 显示列表页面
         */
        // function showListView() {
        //
        //   /*$scope.myCrmLeadsStudentRemindListTableState.pagination.start = 0;*/
        //   $scope.getRemindList($scope.myCrmLeadsStudentRemindListTableState);
        //
        //   /*$scope.myCrmLeadsStudentCommunicationListTableState.pagination.start = 0;*/
        //   $scope.getCommunicationList($scope.myCrmLeadsStudentCommunicationListTableState);
        //
        //   /*$scope.myCrmLeadsStudentInvitationListTableState.pagination.start = 0;*/
        //   $scope.getInvitationList($scope.myCrmLeadsStudentInvitationListTableState);
        //
        //
        // }


        /**
         * 获取一级渠道来源下拉菜单
         */
        $scope.purposeLevel = [{"name":"高","value":1},{"name":"中","value":2},{"name":"低","value":3},{"name":"未标记","value":4}];
        $scope.getAllSelected = function getAllSelected() {
            CommonService.getMediaChannel(0).then(function (result) {
                $scope.mediaChannel1List = result.data;
                $scope.mediaChannel1Change();
            })
            //获取年级的
            CommonService.getGradeIdSelect().then(function (result) {
                $scope.gradeIds = result.data;
            });
            //  跟进状态
            CommonService.getState(0).then(function (result) {
                //console.dir(result);
                $scope.state1List = result.data;
            });
        };




        /**
         * 媒体渠道二级及联
         * @type {Array}
         */
        $scope.mediaChannel1List = [];
        $scope.mediaChannel2List = [];
        $scope.invitationFilter = {};
        $scope.mediaChannel1Change = function(){
            if($scope.invitationFilter.mediaChannelId1){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId1).then(function (result) {
                    $scope.mediaChannel2List = result.data;
                });
            }else{
                $scope.mediaChannel2List = [];
            }
        }

        $scope.mediaChannel2List2 = [];
        $scope.mediaChannel1Change2 = function(){
            if($scope.CrmInvitationDetailVoForCreate.leadMediaChannelId1){
                CommonService.getMediaChannel($scope.CrmInvitationDetailVoForCreate.leadMediaChannelId1).then(function (result) {
                    $scope.mediaChannel2List2 = result.data;
                });
            }else{
                $scope.mediaChannel2List2 = [];
            }
            $scope.CrmInvitationDetailVoForCreate.leadMediaChannelId2 = null;
        }






        /**
         * Shows the allot leads dialog.
         */
        $scope.allotCrmLeadsStudentFilter = {};
        function allot(crmInvitationDetail) {
            /*console.log('allot leads : ' + JSON.stringify(crmInvitationDetail));*/
            $scope.allotCrmLeadsStudentFilter = angular.copy(crmInvitationDetail);

            $scope.getAllAllotPosition();

            $scope.modalTitle = '本校区分配';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.allot.html', show: true});
        }


        /**
         * 本校区分配，获得本校区所有岗位
         */
        $scope.getAllAllotPosition = function getAllAllotPosition() {
            CommonService.getAllPositionsByOrgId().then(function (result) {
                //console.dir(result.data);
                $scope.allAllotPosition = result.data;
            });
        };

        /**
         * 岗位员工二级联动
         */
        $scope.positionChangeForAllot = function(){
            if($scope.allotCrmLeadsStudentFilter.position_id){
                CommonService.getAllUserByOrgIdAndPositionId($scope.allotCrmLeadsStudentFilter.position_id).then(function (result) {
                    $scope.allAllotUser = result.data;
                });
            }else{
                $scope.allAllotUser = [];
            }
        }

        /**
         * 保存分配信息
         */
        $scope.MyCrmLeadsStudentListOk = [];//已选择的学生leads
        $scope.saveAllot = function(){
            //console.log($scope.allotCrmLeadsStudentFilter);
            var AllotCrmLeadsStudentVo = {};
            var crm_student_id = $scope.allotCrmLeadsStudentFilter.crm_student_id;
            var leadsStudent=new Object();
            leadsStudent={crm_student_id:crm_student_id};
            $scope.MyCrmLeadsStudentListOk[0] = leadsStudent;

            AllotCrmLeadsStudentVo.studentList = $scope.MyCrmLeadsStudentListOk;
            AllotCrmLeadsStudentVo.user_id = $scope.allotCrmLeadsStudentFilter.user_id;
            AllotCrmLeadsStudentVo.school_id = $scope.allotCrmLeadsStudentFilter.belongSchoolId;
            //console.log(AllotCrmLeadsStudentVo);
            if ( $scope.allotCrmLeadsStudentFilter.state === 2) {
                //学生leads
                var promise = LeadsStudentService.saveAllot(AllotCrmLeadsStudentVo);
                promise.then(function(data) {
                    $scope.hideAddView();
                    $scope.modal.hide();
                    $scope.allotCrmLeadsStudentFilter = [];
                }, function(error) {
                    alert("分配学生失败");
                });
            }else{
                //学生客户
                var promise = CustomerStudentService.saveAllot(AllotCrmLeadsStudentVo);
                promise.then(function(data) {
                    $scope.hideAddView();
                    $scope.modal.hide();
                    $scope.allotCrmLeadsStudentFilter = [];
                }, function(error) {
                    alert("分配学生失败");
                });
            }




        };

        ;(function init(){
            //$scope.leadsRepeatAlert = false;
            if($scope.isMobile){
                $scope.mobile.getLists();
                $rootScope.authenticated = false;
                _getNumber();
            }else {
                if (check_null($routeParams.type) && !$scope.modalForStudentList) {
                    $scope.showStudentListModal();//打开 弹窗添加邀约 medal
                    $scope.showStudentListModalBrand();
                }
            }
        })();

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

        //重置
        function searchReset(){
            for(var key in $scope.invitationFilter){
                if ($scope.invitationFilter.hasOwnProperty(key)){
                    switch (key){
                        default:
                            delete $scope.invitationFilter[key]
                            break;
                    }
                }
            }
            delete  $scope.invitationFilter.orderType;
            delete  $scope.invitationFilter.sortOrder;
            $scope.search();
        }

        $scope.search=function(){
            delete  $scope.invitationFilter.orderType;
            delete  $scope.invitationFilter.sortOrder;
            if( $scope.myCrmInvitationDetailTableState.pagination) {
                $scope.myCrmInvitationDetailTableState.pagination.start = 0
                $scope.myCrmInvitationDetailTableState.search.predicateObject.pageNum = 1
                $scope.invitationFilter.pageNum = 1
                $scope.getList($scope.myCrmInvitationDetailTableState);
            }else{
                $scope.getList($scope.myCrmInvitationDetailTableState)
            }
        }
        //选择列的功能

        $scope._showCol = false
        $scope.showCol = showCol
        $scope.selectCol = selectCol
        $scope.$editColCss = ''
        $scope.$editColListvisit =[
            {
                id: 0,
                name: '姓名',
                select: 1
            },
            {
                id: 1,
                name: '手机号',
                select: 0
            },
            {
                id: 2,
                name: '性别',
                select: 0
            },
            {
                id: 3,
                name: '年龄',
                select: 0
            },
            {
                id: 4,
                name: '异常',
                select: 0
            },
            {
                id: 5,
                name: '年级',
                select: 1
            },
            {
                id: 6,
                name: '状态',
                select: 1
            },
            {
                id: 7,
                name: '来源',
                select: 1
            },
            {
                id: 8,
                name: '意向程度',
                select: 0
            },
            {
                id: 9,
                name: '最新邀约时间',
                select: 1
            },
            {
                id: 10,
                name: '最新邀约内容',
                select: 1
            },
            {
                id: 11,
                name: '最新到访时间',
                select: 1
            },
            {
                id: 12,
                name: '最新到访内容',
                select: 1
            },
            {
                id: 13,
                name: '在读学校',
                select: 0
            },
            {
                id: 14,
                name: '亲属关系',
                select: 0
            },
            {
                id: 15,
                name: '家长姓名',
                select:0
            },
            {
                id: 16,
                name: '家长手机号',
                select: 0
            },
            {
                id: 17,
                name: '客户需求',
                select: 0
            },
            {
                id: 18,
                name: '创建时间',
                select:0
            },
            {
                id: 19,
                name: '所属校区',
                select: 0
            },
            {
                id: 20,
                name: '所属人',
                select: 0
            },
            {
                id: 21,
                name: '创建人',
                select: 0
            }
        ]
        $scope.colListLength = $scope.$editColListvisit.length;
        //  当前状态是否全选
        $scope.isAll = false
        //  将配置项保存到h5本地存储
        if (localStorage['$editColListvisit']=='undefined'||!localStorage['$editColListvisit']) {
            localSave($scope.$editColListvisit)
        }

        /**
         * 保存到本地
         * @param datas
         */
        function localSave(datas) {
            localStorage.setItem('$editColListvisit', JSON.stringify(datas))
        }

        function initCol() {
            $scope.lEditColList = JSON.parse(localStorage['$editColListvisit'])
            var selectMax = 0
            for (var li = 0; li < $scope.colListLength; li++) {
                var id = $scope.lEditColList[li].id,
                    isShow = $scope.lEditColList[li].select
                if (isShow) {
                    selectMax = selectMax + 1
                }
                if (li === $scope.colListLength - 1) {
                    $scope.isAll = selectMax === $scope.colListLength ? true : false
                }
                (function (index, isShow) {
                    editCol(index, isShow)
                })(id, isShow)
            }
        }

        /**
         * 打开或关闭编辑列
         * @param arg
         */
        function showCol(arg) {
            if (arg) {
                reastPosition()
            }
            $scope._showCol = arg
        }

        $scope.reastPosition = reastPosition
        window.reastPosition = reastPosition
        function reastPosition() {
            //  获取列表的位置
            var $mtList = angular.element('.mt-list').eq(0),
                //  获取选中框
                $editCol = angular.element('.edit-col').eq(0),
                // _top = $mtList.offset().top - 20 + 'px'
                _top = $mtList.offset().top - 20 + 'px'
            window._top_ = _top
            //  重置选择框位置
            $scope.$editColCss = {
                'top': _top
            }
        }

        /**
         * 选择显示
         * @param index
         * 对应的下标
         */
        function selectCol(index) {
            var selectMax = 0
            $scope.lEditColList[index].select = $scope.lEditColList[index].select ? 0 : 1
            localSave($scope.lEditColList)
            editCol($scope.lEditColList[index].id, $scope.lEditColList[index].select)
            for (var li = 0; li < $scope.colListLength; li++) {
                var isShow = $scope.lEditColList[li].select
                if (isShow) {
                    selectMax = selectMax + 1
                }
                if (li === $scope.colListLength - 1) {
                    $scope.isAll = selectMax === $scope.colListLength ? true : false
                    // localSave($scope.lEditColList)
                }
            }
        }

        /**
         * 全选
         */
        $scope.selectColAll = selectColAll
        function selectColAll() {
            for (var i = 0; i < $scope.colListLength; i++) {
                (function (i) {
                    if ($scope.isAll) {
                        $scope.lEditColList[i].select = 0
                        editCol($scope.lEditColList[i].id, 0)
                        if (i === $scope.colListLength - 1) {
                            $scope.isAll = false
                            localSave($scope.lEditColList)
                        }
                    } else {
                        $scope.lEditColList[i].select = 1
                        editCol($scope.lEditColList[i].id, 1)
                        if (i === $scope.colListLength - 1) {
                            $scope.isAll = true
                            localSave($scope.lEditColList)
                        }
                    }
                    // }
                    // editCol($scope.lEditColList[i].id,$scope.lEditColList[i].select)
                })(i)
            }
        }

        function editCol(index, isShow) {
            var $isShowCol = angular.element('.isShowCol').eq(0),
                $tr = $isShowCol.find('tbody tr'),
                max = $tr.length - 1
            if (isShow) {
                $isShowCol.find('tr th').eq(index).removeClass('hide')
                hideOrShow()
            } else {
                $isShowCol.find('tr th').eq(index).addClass('hide')
                hideOrShow()
            }
            function hideOrShow() {
                for (var i = 0; i < max; i++) {
                    if (isShow) {
                        $tr[i].cells[index].hidden = false//.removeClass('hide')//.find('td').eq(index)
                    } else {
                        $tr[i].cells[index].hidden = true//.addClass('hide')
                    }
                }
            }
        }

        /**
         * 恢复编辑列
         */
        $scope.reastCol = reastCol
        function reastCol() {
            $scope.lEditColList = $scope.$editColListvisit
            localSave($scope.lEditColList)
            initCol()
        }
        //    编辑列的结束
        //    排序
        var orderBy1=0;
        var orderBy2=0;
        var orderBy3=0;
        $scope.orderBy = function(flag){
            //邀约时间
            if(flag==1){
                if((orderBy1%2)==0){
                    $scope.invitationFilter.sortOrder=2
                }else{
                    $scope.invitationFilter.sortOrder=1
                }
                $scope.invitationFilter.orderType=1
                orderBy1++; orderBy2=0;orderBy3=0;
            }
            //到访时间
            if(flag==2){
                if((orderBy2%2)==0){
                    $scope.invitationFilter.sortOrder=2
                }else{
                    $scope.invitationFilter.sortOrder=1
                }
                $scope.invitationFilter.orderType=2
                orderBy1=0; orderBy2++;orderBy3=0;
            }
            //意向程度
            if(flag==3){
                if((orderBy3%2)==0){
                    $scope.invitationFilter.sortOrder=1
                }else{
                    $scope.invitationFilter.sortOrder=2
                }
                $scope.invitationFilter.orderType=3
                orderBy1=0; orderBy2=0;orderBy3++;
            }
            $scope.getList($scope.myCrmInvitationDetailTableState);
        }

        //渠道来源的二级函数获取
        $scope.mediaChannel2ListForMyFilter = [];
        $scope.mediaChannel1ChangeForFilter = function(){
            //我的意向客户
            if($scope.invitationFilter.mediaChannelId1){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel2ListForMyFilter = [];
            }
            //校区意向客户/总部意向客户/已分配意向客户
            if($scope.invitationFilter.mediaChannelId1){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel2ListForMyFilter = [];
            }
            //领取意向客户
            if($scope.invitationFilter.mediaChannelId1){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId1).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel2ListForMyFilter = [];
            }
        }
        $scope.mediaChannel2ChangeForFilter = function(){
            //我的意向客户
            if($scope.invitationFilter.mediaChannelId2){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId2).then(function (result) {
                    $scope.mediaChannel3ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel3ListForMyFilter = [];
            }
            //校区意向客户/总部意向客户/已分配意向客户
            if($scope.invitationFilter.mediaChannelId2){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId2).then(function (result) {
                    $scope.mediaChannel2ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel2ListForMyFilter = [];
            }
            //领取意向客户
            if($scope.invitationFilter.mediaChannelId2){
                CommonService.getMediaChannel($scope.invitationFilter.mediaChannelId2).then(function (result) {
                    $scope.mediaChannel3ListForMyFilter = result.data;
                });
            }else{
                $scope.mediaChannel3ListForMyFilter = [];
            }
        }
        //打开详情的页面 模块代码
        $scope.allsorcecon=true;
        $scope.getDetail = function(detail,flag){
            //查看详情 查看更多
            detail.crm_student_id=detail.studentId;
            $scope.detailnew=detail;
            console.log(detail.gender)
            $scope.apprealaifang=false;
            $scope.chakangengduotag=false;
            $scope.chakangengduo='展开更多信息'
            $scope._flag_ = flag
            $scope.__detail = angular.copy(detail)
            /*学员详情开始========================================================*/
            $scope.stuTabs = StuDetail.init($scope)
            $scope.mtSrc = 'partials/stu.detail/main/index.html?v=1.0'
            $mtModal.moreModalHtml({scope:$scope,width:'1100px',hasNext:function () {
                var _obj = $scope.stuTabs.find(function(stu){
                    return stu.title == '记录管理'&&stu.select
                })
                if(_obj){
                    $scope.mtResultModal.hide()
                    return false
                }
                _setReadonlyPropo()
                SweetAlert.swal({
                    title: '确定更新吗？',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    closeOnConfirm: true
                },function (config) {
                    if(config)
                        $scope.updateLeadsStudent(1)
                })
            }})
            /*学员详情结束========================================================*/
            _detail(detail)
            isLock()
        }
        function _detail(detail,type) {
            $scope.laifangtabhide = true;
            $scope.perfectTime=detail.receiveTime
            detail.crm_student_id=detail.studentId
            $scope.detail = angular.copy(detail)
            LeadsStudentService.detail(detail).then(function (result) {
                $scope.detailForUpdate = result;
                for(var i=0;i<$scope.detailForUpdate.growthList.length;i++){
                    if( $scope.detailForUpdate.growthList[i].type==2){
                        if($scope.detailForUpdate.growthList[i].visit_state==0){
                            $scope.arrrepeat=$scope.detailForUpdate.growthList[i]

                            $scope.laifangtabhide=false
                            $scope.oneflg=false;
                            $scope.flag=true;
                            $scope.laifangyaoyuecheck=false;
                            $scope.aaaaa=angular.copy($scope.detailForUpdate.growthList[i])
                            $scope.twoflag=true;
                            $scope.twozhifang=true;
                            break
                        }else{
                            $scope.arrrepeat=null
                        }

                    }
                }
                //无数据的时候初始化
                if($scope.detailForUpdate.growthList.length<1){

                    $scope.onclicktabone();
                    $scope.arrrepeat={}
                }
                if ($scope.detailForUpdate.birthDate) {

                    $scope.detailForUpdate.birthDate = new Date($scope.detailForUpdate.birthDate)
                    $scope.detailForUpdate.birthDate = [$scope.detailForUpdate.birthDate.getFullYear(), ($scope.detailForUpdate.birthDate.getMonth() + 1), $scope.detailForUpdate.birthDate.getDate()].join('-')
                }


                if ($scope.detailForUpdate.followUpAt) {
                    $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd");
                }
                if ($scope.detailForUpdate.receiveTime) {
                    $scope.detailForUpdate.receiveTime = new Date($scope.detailForUpdate.receiveTime).Format("yyyy-MM-dd");

                }
                //刷新列表
                /*$scope.myCrmLeadsStudentListTableState.pagination.start = 0;
                 $scope.getList($scope.myCrmLeadsStudentListTableState);*/
                if (result.province_code) {

                    CommonService.getCitySelect(result.province_code).then(function (result) {
                        $scope.cityList = result.data;
                    });
                }
                if (result.city_code) {

                    CommonService.getAreaSelect(result.city_code).then(function (result) {
                        $scope.areaList = result.data;
                    });
                }

                CommonService.getState(result.state_id_1).then(function (result) {

                    $scope.state2List = result.data;
                });
                CommonService.getMediaChannel(result.media_channel_id_1).then(function (result) {

                    $scope.mediaChannel2List = result.data;
                });

                if(type==12){
                    $scope.detailForUpdate.purposeLevel=detail.purpose_level;
                    $scope.updateLeadsStudent()
                }

            })
            //    以上2结束

        }

        var isLock = function () {
            $timeout(function () {
                angular.element('.is-select').find('input,select,textarea').attr({'readonly':'readonly','disabled':'disabled'})
                if($scope._flag_&&(!$rootScope.showPermissions('LeadsEdit')  || !$scope.canEditAndDelete($scope.detailForUpdate.belong_user_id))){
                    angular.element('.btn-success').attr('disabled','disabled')
                }
            },600)
        }

        $scope.changegengduo=function changegengduo(){
            $scope.chakangengduotag=!$scope.chakangengduotag
            if( $scope.chakangengduotag){
                $scope.chakangengduo='收起更多信息'
                $scope.apprealaifang=true;
            }else{
                $scope.chakangengduo='展开更多信息'
                $scope.apprealaifang=false;
            }
        }
        $scope.chakangengduo='展开更多信息'
        $scope.chakangengduo='更多信息'
        $scope.chakangengduo=function chakangengduo(){
            $scope.chakangengduo='收起更多信息';
        }

        $scope.addtaoyue=function addtaoyue(detail){
            $scope.CrmInvitationDetailVoForCreate = {};
            $scope.CrmInvitationDetailVoForCreate.personState = '2';
            $scope.CrmInvitationDetailVoForCreate.personType = '1';
            $scope.CrmInvitationDetailVoForCreate.personId = detail.crm_student_id;
            //默认内容为1，时间为今天
            $scope.CrmInvitationDetailVoForCreate.invitationContentType=1;
            $scope.CrmInvitationDetailVoForCreate.viewTime=new Date();
            $scope.CrmInvitationDetailVoForCreate.visitContentType=1;
            console.log($scope.arrrepeat)
            if(!$scope.laifangyaoyuecheck) {

                // $scope.CrmInvitationDetailVoForCreate.id=crmInvitationDetail.referenceId;
                // $scope.CrmInvitationDetailVoForCreate.personId=$scope.detailnew.crm_student_id
                // $scope.CrmInvitationDetailVoForCreate.type=2;
                // $scope.CrmInvitationDetailVoForCreate.invitateTime = crmInvitationDetail.invitate_time
                // $scope.laifangeditcontent=crmInvitationDetail.visit_content_type;
                // $scope.CrmInvitationDetailVoForCreate.invitationContentType = crmInvitationDetail.invitation_content_type;
                // $scope.CrmInvitationDetailVoForCreate.viewTime =crmInvitationDetail.receive_time;
                // $scope.CrmInvitationDetailVoForCreate.flaglink =crmInvitationDetail.receive_time;
                // $scope.CrmInvitationDetailVoForCreate.receiveTime=crmInvitationDetail.receive_time;
                console.log($scope.arrrepeat)
                if($scope.arrrepeat.referenceId) {
                    $scope.aaaaa.id = $scope.arrrepeat.referenceId;
                }
                $scope.aaaaa.personId=$scope.arrrepeat.crm_student_id
                $scope.aaaaa.type=2;
                $scope.aaaaa.invitateTime=$scope.arrrepeat.invitate_time
                $scope.aaaaa.invitationContentType =$scope.arrrepeat.invitation_content_type
                $scope.aaaaa.receiveTime =$scope.arrrepeat.receive_time
                $scope.aaaaa.invitate_time =$scope.arrrepeat.invitate_time
                $scope.aaaaa.viewTime =$scope.arrrepeat.receive_time
                $scope.aaaaa.visitContentType =$scope.arrrepeat.invitation_content_type
                $scope.nochangesort={}
                $scope.nochangesort.receiveTime=$scope.arrrepeat.receive_time
                $scope.nochangesort.viewTime=$scope.arrrepeat.receive_time
                $scope.nochangesort.invitationContentType =$scope.arrrepeat.invitation_content_type
            }
            //默认结束

            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
            //$scope.CrmInvitationDetailVoForCreate.receiveTime =(new Date()).Format("yyyy-M-d h:m:s");
            $scope.modalTitle = '添加邀约/到访记录';
            $scope.detail = angular.copy(detail);
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date().Format("yyyy-MM-dd");

            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/addyaoyue1.html', show: true});
        }
        $scope.one=true;
        $scope.two=false;
        $scope.oneflag=true;
        $scope.twoflag=false;
        $scope.onclicktabone=function onclicktabone(){
            $scope.one=true;
            $scope.two=false;
            $scope.oneflag=true;
            $scope.twoflag=false;
            $scope.yaoyuefang=true;
            $scope.twozhifang=false;
            $scope.CrmInvitationDetailVoForCreate.state=0;
        }

        $scope.onclicktabtwo=function onclicktabtwo(){
            $scope.one=false;
            $scope.two=true;
            $scope.oneflag=false;
            $scope.twoflag=true;
            $scope.yaoyuefang=false;
            $scope.twozhifang=true;
            $scope.CrmInvitationDetailVoForCreate.state=1;
        }
        function saveInvitationDetail(detail,type) {
            $scope.zhifangbianjisubmit=false;
            if (new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date((new Date($scope.CrmInvitationDetailVoForCreate.invitateTime)/1000-86400)*1000)) {
                warningAlert("预计到访时间不可小于邀约时间");
                return false
            }
            if($scope.one) {
                if ($scope.CrmInvitationDetailVoForCreate.receiveTime && new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date((new Date($scope.CrmInvitationDetailVoForCreate.invitateTime)/1000-86400)*1000)) {
                    // warningAlert("预到访时间不能小于当天时间");
                }
                else {
                    $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date($scope.CrmInvitationDetailVoForCreate.invitateTime);
                    $scope.CrmInvitationDetailVoForCreate.receiveTime =new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                    if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                        $scope.CrmInvitationDetailVoForCreate.receiveTime =new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                        var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function (CrmInvitationDetailVoForCreate) {
                            $scope.dataLoading = false;
                            $scope.search();
                            $scope.modal.hide();
                            var shiting = $rootScope.showPermissions("FreeListening");
                            // if(shiting){
                            //     $scope.modalTitle = '温馨提示';
                            //     $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});
                            // }
                            if ($scope.__detail) {
                                $scope._detail_($scope.__detail)
                            }
                        }, function (error) {
                            $scope.dataLoading = false;
                        });
                    } else {

                        var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function (CrmInvitationDetailVoForCreate) {
                            $scope.search();
                            $scope.dataLoading = false;
                            $scope.modal.hide();
                        }, function (error) {

                            $scope.dataLoading = false;
                        });
                    }
                }
                _detail($scope.detailnew)
                isLock()
            }else{
                $scope.CrmInvitationDetailVoForCreate.type=5;
                //直访添加状态直接为1
                $scope.CrmInvitationDetailVoForCreate.state=1;
                //后台参数不同，修改直访内容为要约内容
                $scope.CrmInvitationDetailVoForCreate.viewTime = new Date($scope.CrmInvitationDetailVoForCreate.viewTime);
                // $scope.CrmInvitationDetailVoForCreate.receiveTime =null;
                if (typeof $scope.CrmInvitationDetailVoForCreate.id === 'undefined') {
                    $scope.CrmInvitationDetailVoForCreate.invitationContentType=$scope.CrmInvitationDetailVoForCreate.visitContentType
                    $scope.CrmInvitationDetailVoForCreate.receiveTime =null;
                    var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                    promise.then(function (CrmInvitationDetailVoForCreate) {
                        $scope.search();
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        var shiting = $rootScope.showPermissions("FreeListening");
                        // if(shiting){
                        //     $scope.modalTitle = '温馨提示';
                        //     $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});
                        // }
                        if ($scope.__detail) {
                            $scope._detail_($scope.__detail)
                        }
                    }, function (error) {
                        $scope.dataLoading = false;
                    });
                } else {
                    var promise = InvitationDetailService.update($scope.CrmInvitationDetailVoForCreate);
                    promise.then(function (CrmInvitationDetailVoForCreate) {
                        $scope.search();
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                    }, function (error) {
                        $scope.dataLoading = false;
                    });
                }

            }
            _detail($scope.detailnew)
            isLock()
        }

        function addInvitationCommunication(row) {
            //console.log('Starting creating new invitationCommunication.');
            $scope.CrmInvitationCommunicationVoForCreate = {};
            $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
            $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
            $scope.CrmInvitationCommunicationVoForCreate.personId = row.crm_student_id;

            $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
            $scope.CrmInvitationCommunicationVoForCreate.nextTime = new Date().Format("yyyy-MM-dd");
            $scope.modalTitle = '添加沟通记录';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html', show: true});

        }


        function saveInvitationCommunication() {
            if(new Date($scope.CrmInvitationCommunicationVoForCreate.communicateTime)>new Date($scope.CrmInvitationCommunicationVoForCreate.nextTime)){
                warningAlert("下次跟进时间不可小于沟通时间");

            }else {
                if (typeof $scope.CrmInvitationCommunicationVoForCreate.id === 'undefined') {
                    var promise = InvitationCommunicationService.create($scope.CrmInvitationCommunicationVoForCreate);
                    promise.then(function (CrmInvitationCommunicationVoForCreate) {
                        successAlert("添加沟通成功");
                        // $scope.getList($scope.myCrmLeadsStudentListTableState);
                        $scope.dataLoading = false;
                        $scope.search();
                        $scope.modal.hide();
                    }, function (error) {
                        $scope.dataLoading = false;
                    });
                } else {
                    var promise = InvitationCommunicationService.update($scope.CrmInvitationCommunicationVoForCreate);
                    promise.then(function (CrmInvitationCommunicationVoForCreate) {
                        $scope.dataLoading = false;
                        $scope.modal.hide();
                        $scope.search();
                    }, function (error) {
                        $scope.dataLoading = false;
                    });
                }
                _detail($scope.detailnew)
                isLock()
            }
        }
        function editInvitationCommunication(crmInvitationCommunication) {
            crmInvitationCommunication.id=crmInvitationCommunication.referenceId
            crmInvitationCommunication.personId = crmInvitationCommunication.crm_student_id;
            $scope.CrmInvitationCommunicationVoForCreate = angular.copy(crmInvitationCommunication);
            $scope.CrmInvitationCommunicationVoForCreate.communicateTime =crmInvitationCommunication.communicate_time
            $scope.CrmInvitationCommunicationVoForCreate.nextTime = new Date(crmInvitationCommunication.nextTime).Format("yyyy-MM-dd");
            $scope.CrmInvitationCommunicationVoForCreate.communicateContent =crmInvitationCommunication.communicate_content
            $scope.modalTitle = '更新沟通记录';
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationCommunication/modal.invitationCommunication.html', show: true});

        }


        function deleteInvitationCommunication(crmInvitationCommunication) {
            crmInvitationCommunication.id=crmInvitationCommunication.referenceId
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {
                        var promise = InvitationCommunicationService.remove(crmInvitationCommunication);
                        //$rootScope.showLoading();
                        promise.then(function() {
                            $scope.search();
                            _detail($scope.detailnew)
                            isLock()
                            //$rootScope.hideLoading();
                        }, function(error) {
                            //$rootScope.hideLoading();
                        });
                    }
                }
            );
        }

        $scope.edittablaifangflg=true;
        $scope.flaglaifang={};
        $scope.flaglaifang.lai=true;
        $scope.edittablaifang=function edittablaifang(){
            $scope.flaglaifang.lai=true;
            $scope.edittablaifangflg=true;
            $scope.flaglaifang.wei=false;
        }

        $scope.edittablaifangwei=function edittablaifangwei(){
            $scope.flaglaifang.lai=false;
            $scope.edittablaifangflg=false;
            $scope.flaglaifang.wei=true;
        }

        $scope.updatezhifanig = function (crmInvitationDetail,type){
            if(type==3){
                if (new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) > new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)) {
                    warningAlert("邀约时间不能大于预计到访时间");
                    return false
                }
            }

            if(type!=3) {
                if ($scope.flaglaifang.lai) {
                    crmInvitationDetail.state = 1
                    if (new Date($scope.CrmInvitationDetailVoForCreate.viewTime) < new Date(new Date($scope.CrmInvitationDetailVoForCreate.invitateTime)/1000-86400)*1000) {
                        warningAlert("到访时间不能小于邀约时间");
                        return false
                    }
                } else if ($scope.flaglaifang.wei) {

                    crmInvitationDetail.state = 2
                }
            }
            crmInvitationDetail.personId= crmInvitationDetail.crm_student_id;
            var promise = InvitationDetailService.update(crmInvitationDetail);
            promise.then(function (CrmInvitationDetailVoForCreate) {

                _detail($scope.detailnew)
                $scope.search()
                $scope.modal.hide();
            })



        }
        $scope.laifangedit=function laifangedit(crmInvitationDetail,type){
            if(type==1) {
                $scope.tachlaifang=true;
                $scope.modalTitle = '到访编辑';
                $scope.zhifangbianjisubmit=true
                $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
                $scope.CrmInvitationDetailVoForCreate.id = crmInvitationDetail.referenceId;
                $scope.CrmInvitationDetailVoForCreate.personId=$scope.detailnew.crm_student_id
                $scope.CrmInvitationDetailVoForCreate.type=2;
                $scope.CrmInvitationDetailVoForCreate.invitateTime =crmInvitationDetail.invitate_time;
                $scope.CrmInvitationDetailVoForCreate.visitContentType = crmInvitationDetail.visit_content_type;
                $scope.laifangeditcontent=crmInvitationDetail.invitation_content_type;
                $scope.CrmInvitationDetailVoForCreate.viewTime =crmInvitationDetail.view_time;
                $scope.CrmInvitationDetailVoForCreate.receiveTime=crmInvitationDetail.receive_time;
                $scope.laifanginnertexxt='到访内容'
                $scope.tachlaifang=true;
            }else{
                $scope.modalTitle = '邀约确认';
                $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
                $scope.CrmInvitationDetailVoForCreate.id=crmInvitationDetail.referenceId;
                $scope.CrmInvitationDetailVoForCreate.personId=$scope.detailnew.crm_student_id
                $scope.CrmInvitationDetailVoForCreate.type=2;
                $scope.CrmInvitationDetailVoForCreate.invitateTime = crmInvitationDetail.invitate_time
                $scope.laifangeditcontent=crmInvitationDetail.invitation_content_type;
                // $scope.CrmInvitationDetailVoForCreate.invitationContentType = crmInvitationDetail.invitation_content_type;
                $scope.CrmInvitationDetailVoForCreate.visitContentType = crmInvitationDetail.invitation_content_type;
                $scope.CrmInvitationDetailVoForCreate.viewTime =crmInvitationDetail.receive_time;
                $scope.CrmInvitationDetailVoForCreate.flaglink =crmInvitationDetail.receive_time;
                $scope.CrmInvitationDetailVoForCreate.receiveTime=crmInvitationDetail.receive_time;
                $scope.laifanginnertexxt='到访内容'
                $scope.tachlaifang=false;
            }

            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.laifangedit.html', show: true});
        }
        function visit(crmInvitationDetail,type) {
            if(type==2){
                if($scope.flaglaifang.lai){
                    crmInvitationDetail.state = 1
                    if (new Date($scope.aaaaa.viewTime) < new Date(new Date($scope.aaaaa.invitate_time)/1000-86400)*1000) {
                        warningAlert("到访时间不能小于邀约时间");
                        return false
                    }
                }else{
                    crmInvitationDetail.state = 2
                }
            }else{

                if($scope.flaglaifang.lai){
                    crmInvitationDetail.state = 1
                    if (new Date($scope.CrmInvitationDetailVoForCreate.viewTime) < new Date(new Date($scope.CrmInvitationDetailVoForCreate.invitateTime)/1000-86400)*1000) {
                        warningAlert("到访时间不能小于邀约时间");
                        return false
                    }
                }else{

                    crmInvitationDetail.state = 2
                }
            }

            $scope.visitvlu = angular.copy(crmInvitationDetail);
            crmInvitationDetail.receiveTime=new Date(crmInvitationDetail.receiveTime)
            var promise = InvitationDetailService.visit(crmInvitationDetail);
            promise.then(function() {
                $scope.search();
                // saveInvitationDetail($scope.visitvlu,2)
                // isLock()
                $scope.flag=false;
                $scope.twozhifang=false;
                $scope.one=true;
                $scope.two=false;
                $scope.laifangyaoyuecheck=true;
                $scope.modal.hide();
                _detail($scope.detailnew)
            }, function(error) {
            });
        }

        function editInvitationDetail(crmInvitationDetail) {

            crmInvitationDetail.id=crmInvitationDetail.referenceId
            $scope.CrmInvitationDetailVoForCreate = angular.copy(crmInvitationDetail);
            $scope.CrmInvitationDetailVoForCreate.isinside = '1';

            $scope.modalTitle = '更新邀约';
            $scope.CrmInvitationDetailVoForCreate.invitationContentType =crmInvitationDetail.invitation_content_type ;
            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date(crmInvitationDetail.invitate_time).Format("yyyy-MM-dd");
            $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date(crmInvitationDetail.receive_time).Format("yyyy-MM-dd");
            $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/invitationDetail/modal.invitationDetailEdit.html', show: true});

        }


        $scope.updatezhifanig = function (crmInvitationDetail,type){
            if(type==3){
                if (new Date($scope.CrmInvitationDetailVoForCreate.invitateTime) > new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)) {
                    warningAlert("邀约时间不能大于预计到访时间");
                    return false
                }
            }

            if(type!=3) {
                if ($scope.flaglaifang.lai) {
                    crmInvitationDetail.state = 1
                    if (new Date($scope.CrmInvitationDetailVoForCreate.viewTime) < new Date(new Date($scope.CrmInvitationDetailVoForCreate.invitateTime)/1000-86400)*1000) {
                        warningAlert("到访时间不能小于邀约时间");
                        return false
                    }
                } else if ($scope.flaglaifang.wei) {

                    crmInvitationDetail.state = 2
                }
            }
            crmInvitationDetail.personId= crmInvitationDetail.crm_student_id;
            var promise = InvitationDetailService.update(crmInvitationDetail);
            promise.then(function (CrmInvitationDetailVoForCreate) {

                _detail($scope.detailnew)
                $scope.search()
                $scope.modal.hide();
            })



        }


        function deleteInvitationDetail(crmInvitationDetail) {
            crmInvitationDetail.id=crmInvitationDetail.referenceId
            SweetAlert.swal({
                    title: "确定要删除吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                }, function(confirm) {
                    if (confirm) {

                        InvitationDetailService.remove(crmInvitationDetail).then(function (result) {
                            $scope.search();
                            if( crmInvitationDetail.type==2){

                                if(crmInvitationDetail.visit_state!=1){

                                    $scope.twozhifang=false;
                                    $scope.twoflag=false;
                                    $scope.yaoyuefang=true;
                                    $scope.one=true;
                                    $scope.flag=false;
                                    $scope.laifangyaoyuecheck=true;
                                    $scope.zhifangbianjisubmit=false;
                                }
                            }
                            // if(){
                            //     $scope.twozhifang=false;
                            // }

                            _detail($scope.detailnew)
                            isLock()
                        });

                    }
                }
            );
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
        $scope.laifangyaoyuecheck=true;
        function warningAlert(title,fun,c) {
            SweetAlert.swal({
                title: title,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: '确定',
                closeOnConfirm: true
            },fun)
        }

        //    未消课列表
        $scope.callServer1 = function callServer1(tableState) {
            
            console.log($scope.detail)
            if($scope.detail) {
                if(!tableState.search.predicateObject){
                    tableState.search.predicateObject = {};
                }
                tableState.search.predicateObject.crm_student_id = $scope.detail.crm_student_id;
                $scope.isLoading = true;

                $scope.myCoursePlanTableState = tableState;

                var pagination = tableState.pagination;
                var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = pagination.number || 10;  // Number of entries showed per page.
                CoursePlanService.Studentlist(start, number, tableState).then(function (result) {
                    $scope.displayed = result.data;
                    
                    $scope.displayed1 = result.data;
                    if(check_null(result.numberOfPages)){
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                    }else{
                        tableState.pagination.numberOfPages = 0;
                    }

                    $scope.isLoading = false;
                },function(err){
                    tableState.pagination.numberOfPages = 0;
                });
            }
        };

        var _setReadonlyPropo = function () {
            var birthList = angular.element('.modal-body').find('[name="birthDate"]'),
                birthDate = angular.element('.modal-body').find('[name="birthDate"]').val(),
                followList = angular.element('.modal-body').find('[name="followUpAt"]'),
                followUpAt = angular.element('.modal-body').find('[name="followUpAt"]').val()
            /*if(birthList.length>1){
             for(var i = 0 , len = birthList.length ; i< len ; i++){
             if(birthList[i].value){
             birthDate = birthList[i].value
             }
             if(followList[i]&&followList[i].value){
             followUpAt = followList[i].value
             }
             }
             }*/
            $scope._birthDate =birthDate
            $scope._followUpAt =followUpAt
            $scope.detailForUpdate.birthDate = new Date(birthDate)
        }

        $scope.updateLeadsStudent = updateLeadsStudent;
        //$scope.CrmLeadsStudentVoForUpdate = {}; //创建学生线索对象
        function updateLeadsStudent(arg){

            if($scope.detailForUpdate.followUpAt){
                $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt);
            }
            if(!arg){
                _setReadonlyPropo()
            }
            var promise = LeadsStudentService.update($scope.detailForUpdate);
            promise.then(function(data) {
                if(data.status == 'FAILURE'){
                    if(typeof data.data == 'string'){
                        SweetAlert.swal(data.data);
                    }else{
                        //console.log(data);
                        //SweetAlert.swal(data.data.repeateMsg);
                        $scope.repeateData = data.data;
                        $scope.modalForRepeatTitle = '电话号码重复';
                        $scope.modalForRepeat = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                    }
                    return false;
                }
                //$scope.detailForUpdate = {};
                //显示列表页
                //$scope.showListView();
                //显示详情页
                if(arg){
                    $scope.detail = angular.copy($scope.detailForUpdate)
                    successAlert('更新成功')
                    $scope.detailForUpdate.birthDate = $scope._birthDate
                    $scope.detailForUpdate.followUpAt = $scope._followUpAt
                    $scope.getList($scope.myCrmLeadsStudentListTableState)
                }
                else{

                    $scope.showDetailView($scope.detailForUpdate);

                }
            }, function(error) {
                warningAlert("更新Leads失败");
            });
        }
        $scope.getTabIndex = getTabIndex;
        function getTabIndex(obj){
            if(obj.title==='沟通记录'){
                $scope.recordTab='0';
            }else if(obj.title==='邀约记录'){
                $scope.recordTab='1';
            }else if(obj.title==='排课记录'){
                $scope.recordTab='2';
            }
        }
        $scope.StudentStatus = [{"name":"结课","value":2},{"name":"转课","value":5},{"name":"退费","value":4}];
    }
]);
