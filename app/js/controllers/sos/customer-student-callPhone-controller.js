/**
 * Created by 毅 on 2016/5/28.
 */
angular.module('ywsApp')
    .controller('callPhoneCustomerCtrl',
        ['$scope', '$modal', '$rootScope', '$timeout','$routeParams','SweetAlert','O2oCouponManagementService','TreeDataFactory','LeadsStudentService','CommonService',
            'InvitationRemindService','InvitationCommunicationService','InvitationDetailService','CoursePlanService','CustomerStudentService',
            function($scope, $modal, $rootScope, $timeout,$routeParams,SweetAlert,O2oCouponManagementService,TreeDataFactory,LeadsStudentService,CommonService,
                     InvitationRemindService,InvitationCommunicationService,InvitationDetailService,CoursePlanService,CustomerStudentService ) {
                var oThis = this;
                function warningAlert(title) {
                    SweetAlert.swal({
                        title: title,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonText: '确定',
                        closeOnConfirm: true
                    })
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
                function ifResponseSuccess(response){
                    if(response.data.status == 'FAILURE'){
                        SweetAlert.swal(response.data.data);
                        return false;
                    }else{
                        return true;
                    }
                }
                $scope.hideModel = function(){
                    $scope.showListView();
                    $scope.phoneModel.hide();

                };
                $scope.ifLastCommunicatedByPhone = function(lastDate){
                    var time = lastDate;
                    var thatDay = new Date();
                    var rowDay = new Date(lastDate);
                    if(time){
                        if(thatDay.getYear() == rowDay.getYear()){
                            if(thatDay.getMonth() == rowDay.getMonth()){
                                if(thatDay.getDay() == rowDay.getDay()){
                                    return true;
                                }
                            }
                        }

                    }
                    return false;

                };
                /**
                 * 更改电话异常状态
                 */
                $scope.updatePhoneException = function(obj){
                    LeadsStudentService.updatePhoneException(obj).then(function (result) {
                        if(ifResponseSuccess(result)){
                            $('popup').hide();
                            _isPhone(obj.phone,obj.status)
                        }
                    });
                };
                $scope.changePhoneStatus = function(obj,status){
                    var obj = {
                        phone:obj,
                        status:status
                    }
                    $scope.updatePhoneException(obj);
                }
                function _dealPhones(data){
                    var list = data.data;
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            _isPhone(list[i].phone,list[i].status,list[i].lastCommunicatedAt);
                        }
                    }

                }
                function _isPhone(phone,status,lastDate){
                    if($scope.phone.phone == phone ){
                        $scope.phone.phone_status = status;
                        $scope.phone.phone_lastDate =lastDate;

                    }else if($scope.phone.mother_phone == phone ){
                        $scope.phone.mother_phone_status = status;
                        $scope.phone.mother_phone_lastDate =lastDate;
                    }else if($scope.phone.father_phone == phone ){
                        $scope.phone.father_phone_status = status;
                        $scope.phone.father_phone_lastDate =lastDate;
                    }
                }
                $scope.findPhoneException = function(list,callback){
                    LeadsStudentService.findPhoneException(list).then(function (result) {
                        if(ifResponseSuccess(result)){
                            $('popup').hide();
                            if(callback){
                                callback();
                            }
                            _dealPhones(result.data);
                        }

                    });
                };
                $scope.callNumber = function(row){
                    /*if(CPC_OpenDevice(0,0,'')>0)
                     {
                     console.log(row.phone);
                     T_InitCPhoneC(row.phone);

                     }*/
                    $scope.exc = true
                    $scope.phone = angular.copy(row);
                    var list = [];
                    if($scope.phone.phone){
                        list.push($scope.phone.phone);
                    }
                    if($scope.phone.mother_phone){
                        list.push($scope.phone.mother_phone);
                    }
                    if($scope.phone.father_phone){
                        list.push($scope.phone.father_phone);
                    }
                    $scope.findPhoneException(list,function(){
                        var title ='联系方式';
                        //alert(currentUser().landline);
                        $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callNumber.html', show: true });
                        $timeout(function(){
                            var node1 = $("#calling");
                            var content1 = '拨打操作后，您所绑定的座机会先响起；在您接起6-10秒后，会拨打客户的电话，请等待客户接听';
                            node1.webuiPopover({content:content1,trigger:'hover',placement:'bottom'});
                        },1000);
                    });



                };
                function _ifOnePhone(phone){
                    var length = 0;
                    if(check_null(phone.mother_phone)){
                        length +=1;
                    }
                    if(check_null(phone.father_phone)){
                        length +=1;
                    }
                    if(length ==0){
                        return true;

                    }else{
                        return false;
                    }
                }

                /**
                 * 得到详细信息并将放在$scope.detailForUpdate
                 * 并刷新 列表参数
                 * @param detail
                 * @private
                 */
                function _getLeadsDetail(detail,callback){
                    CustomerStudentService.detail(detail).then(function(result){
                        //console.dir(result);
                        $scope.detailForUpdate = result;
                        if(result.nextVisitAt){
                            $scope.detailForUpdate.nextVisitAt = new Date(result.nextVisitAt).Format("yyyy-MM-dd hh:mm:ss");
                        }
                        $scope.detail = result;
                        //刷新列表
                        /*$scope.myCrmLeadsStudentListTableState.pagination.start = 0;
                         $scope.getList($scope.myCrmLeadsStudentListTableState);*/
                        if(result.province_code){
                            CommonService.getCitySelect(result.province_code).then(function (result) {
                                $scope.cityList = result.data;
                            });
                        }
                        if(result.city_code){
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

                    })
                }
                $scope.callPhone = function(phone){
                    //初始化
                    $scope.isShowInvite = false;


                    if(CPC_OpenDevice(0,0,'')>0)
                    {
                        console.log(phone);
                        T_InitCPhoneC(phone);
                        $scope.isLoading = false;
                        $scope.phoneModel.hide();
                        //$scope.showDetailView($scope.phone);

                    }
                    else{
                        $rootScope.isCalling=true;
                        /*     console.log($scope.phone);*/
                        //SweetAlert.swal('操作成功');
                        $scope.isLoading = false;
                        if(check_null($scope.phoneModel)){

                            $scope.phoneModel.hide();
                        }
                        /*$scope.showDetailView($scope.phone);*/
                        var title ='通话中';
                        _getLeadsDetail( $scope.phone);//得到详细信息并将放在$scope.detailForUpdate


                        //添加邀约初始化
                        {
                            $scope.CrmInvitationDetailVoForCreate = {};
                            $scope.CrmInvitationDetailVoForCreate.personState = '2';
                            $scope.CrmInvitationDetailVoForCreate.personType = '1';
                            $scope.CrmInvitationDetailVoForCreate.personId = $scope.phone.crm_student_id;

                            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                            $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
                        }
                        //添加沟通初始化
                        {
                            $scope.CrmInvitationCommunicationVoForCreate = {};
                            $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                            $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                            $scope.CrmInvitationCommunicationVoForCreate.personId = $scope.phone.crm_student_id;

                            $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                        }

                        /*$scope.detailForUpdate = $scope.phone;*/
                        $scope.currentPhone = phone;//表明当前拨打的电话号码
                        //alert(currentUser().landline);
                        /*   $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callPhoneDetail.html', show: true });*/

                        LeadsStudentService.callNumber(phone,$scope.phone.crm_student_id).then(function (result) {
                            $scope.courses1 = result.data;
                            console.log(result);

                            if(result.data.status=="SUCCESS")
                            {
                                $rootScope.isCalling=true;
                                console.log($scope.phone);
                                //SweetAlert.swal('操作成功');
                                $scope.isLoading = false;
                                if(check_null($scope.phoneModel)){

                                    $scope.phoneModel.hide();
                                }
                                /* $scope.showDetailView($scope.phone);
                                 var title ='通话中';
                                 _getLeadsDetail( $scope.phone);//得到详细信息并将放在$scope.detailForUpdate
                                 */

                                /*$scope.detailForUpdate = $scope.phone;*/
                                $scope.currentPhone = phone;//表明当前拨打的电话号码
                                //alert(currentUser().landline);
                                $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callPhoneDetail.html', show: true });

                            }else
                            {
                                SweetAlert.swal(result.data.data);
                            }

                            //getOrderListController(oThis.tableState);
                        },function(result){
                            SweetAlert.swal('操作失败'+'请录入坐席号码');
                        });
                    }
                };

                /**
                 * 改变leads 状态
                 * @param rew
                 * @param status 要改变的新状态
                 */
                $scope.changeExceptionStatus = function(row,status){
                    if(status == row.exception_status){
                        return;
                    }else{
                        var obj = {
                            id:row.crm_student_id,
                            exceptionStatus:status
                        };
                        LeadsStudentService.updateLeadsStudent(obj).then(function (result) {
                            if(ifResponseSuccess(result)){
                                $scope.showListView();
                                if( $scope.detailForUpdate){
                                    $scope.detailForUpdate.exception_status = status;
                                }
                                $('popup').hide();
                            }
                        });

                    }
                };
                $scope.changeLeadsProterty = function(row,status){
                    if(status == row.leadsProperty){
                        return;
                    }else{
                        var obj = {
                            id:row.crm_student_id,
                            leadsProperty:status
                        };
                        LeadsStudentService.updateLeadsStudent(obj).then(function (result) {
                            if(ifResponseSuccess(result)){
                                $scope.showListView();
                                if( $scope.detailForUpdate){
                                    $scope.detailForUpdate.leadsProperty = status;
                                }
                                $('popup').hide();
                            }
                        });

                    }
                };

                /**
                 * 提醒列表
                 */
                $scope.CrmLeadsStudentRemindList =  [];
                $scope.getRemindList = function callServer(tableState) {
                    if($scope.detail){
                        tableState.search.predicateObject = {};
                        tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                        $scope.myCrmLeadsStudentRemindListTableState = tableState;
                        //console.dir(tableState);
                        $scope.isRemindLoading = true;
                        var pagination = tableState.pagination;
                        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                        var number = pagination.number || 10;  // Number of entries showed per page.
                        InvitationRemindService.list(start, number, tableState,$scope.myCrmLeadsStudentFilter).then(function (result) {
                            //console.dir(result.data);
                            //$scope.getAllSelected();
                            $scope.CrmLeadsStudentRemindList = result.data;
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                            $scope.isRemindLoading = false;
                        });
                    }
                };

                /**
                 * 沟通列表
                 */
                $scope.CrmLeadsStudentCommunicationList =  [];
                $scope.getCommunicationList = function callServer(tableState) {
                    if($scope.detail) {
                        tableState.search.predicateObject ={};
                        tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                        $scope.myCrmLeadsStudentCommunicationListTableState = tableState;
                        //console.dir(tableState);
                        $scope.isCommunicationLoading = true;
                        var pagination = tableState.pagination;
                        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                        var number = pagination.number || 10;  // Number of entries showed per page.
                        InvitationCommunicationService.list(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                            //console.dir(result.data);
                            //$scope.getAllSelected();
                            $scope.CrmLeadsStudentCommunicationList = result.data;
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                            $scope.isCommunicationLoading = false;
                        });
                    }
                };

                /**
                 * 邀约列表
                 */
                $scope.CrmLeadsStudentInvitationList =  [];
                $scope.getInvitationList = function callServer(tableState) {
                    if($scope.detail) {
                        tableState.search.predicateObject = {};
                        tableState.search.predicateObject.dataStudentDetailId = $scope.detail.crm_student_id;
                        $scope.myCrmLeadsStudentInvitationListTableState = tableState;
                        //console.dir(tableState);
                        $scope.isInvitationLoading = true;
                        var pagination = tableState.pagination;
                        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                        var number = pagination.number || 10;  // Number of entries showed per page.
                        InvitationDetailService.viewlist(start, number, tableState, $scope.myCrmLeadsStudentFilter).then(function (result) {
                            //console.dir(result.data);
                            //$scope.getAllSelected();
                            $scope.CrmLeadsStudentInvitationList = result.data;
                            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                            $scope.isInvitationLoading = false;
                        });
                    }
                };
                /**
                 * 未消课列表
                 */
                $scope.getPlanCourseList = function callServer(tableState) {
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

                /**
                 * 拨打客户电话沟通操作台 控制是否显示邀约
                 * 通过$scope.isShowInvite参数来控制
                 */
                $scope.choiceIfShowInvite = function(){
                    if($scope.isShowInvite){
                        $scope.isShowInvite = false;
                    }else{
                        $scope.isShowInvite = true;
                    }
                };
                /**
                 *拨打客户电话沟通操作台 提交操作
                 */
                $scope.saveCallPhoneDetil = function(){
                    $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt);
                    if($scope.detailForUpdate.next_visit_at){
                        $scope.detailForUpdate.next_visit_at = new Date($scope.detailForUpdate.next_visit_at);
                        $scope.detailForUpdate.nextVisitAt =  $scope.detailForUpdate.next_visit_at;
                    }

                    _updateLeadsStudent( $scope.detailForUpdate);
                };

                /**
                 * $scope.detailForUpdate
                 * @param deail
                 * @private
                 */
                function _updateLeadsStudent(deail){
                    //console.dir($scope.detailForUpdate);
                    if($scope.CrmInvitationDetailVoForCreate.receiveTime&&(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date()))
                    {
                        successAlert("预到访时间不能小于当天时间");
                        $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:mm");
                        return;
                    }
                    /****************************************************/
                    /* function updateCustomerStudent(){
                     //console.dir($scope.detailForUpdate);

                     if($scope.detailForUpdate.nextVisitAt){
                     $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt);
                     }

                     var promise = CustomerStudentService.update($scope.detailForUpdate);
                     promise.then(function(data) {
                     //console.log(data);
                     if(data.status == 'FAILURE'){
                     SweetAlert.swal(data.data);
                     return false;
                     }
                     $scope.showListView();
                     $scope.detailForUpdate = {};
                     }, function(error) {
                     alert("更新学生客户失败");
                     });
                     }*/
                    /**********************************/
                    if($scope.detailForUpdate.nextVisitAt){
                        $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt);
                    }
                    var promise = CustomerStudentService.update(deail);

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
                        /* $scope.showDetailView($scope.detailForUpdate);*/
                        //处理回调
                        if($scope.isShowInvite){
                            saveInvitationDetail(function(){
                                _saveInvitationCommunication(function(){
                                    $scope.phoneModel.hide();
                                    $scope.showListView();
                                });
                            });
                        }else{
                            _saveInvitationCommunication(function(){
                                $scope.phoneModel.hide();
                                $scope.showListView();
                            });
                        }
                    }, function(error) {
                        SweetAlert.swal("更新学生客户失败");
                    });
                }

                /**
                 * 添加沟通
                 * @private
                 */
                function _saveInvitationCommunication(callback) {
                    //console.log('Saving the invitationCommunication.');
                    //$scope.dataLoading = true;
                    var promise = InvitationCommunicationService.CallSave($scope.CrmInvitationCommunicationVoForCreate);
                    promise.then(function(CrmInvitationCommunicationVoForCreate) {
                        callback();
                    }, function(error) {
                        $scope.dataLoading = false;
                    });
                }

                /**
                 * 保存 邀约
                 */
                function saveInvitationDetail(callback) {
                    //console.log('Saving the invitationDetail.');
                    //$scope.dataLoading = true;
                    if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date())
                    {
                        successAlert("预到访时间不能小于当天时间");
                    }
                    else{
                        $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);

                        $scope.CrmInvitationDetailVoForCreate.receiveTime = new Date($scope.CrmInvitationDetailVoForCreate.receiveTime);
                        var promise = InvitationDetailService.create($scope.CrmInvitationDetailVoForCreate);
                        promise.then(function(CrmInvitationDetailVoForCreate) {
                            /*$scope.showInvitationListView();*/
                            $scope.dataLoading = false;
                            /* $scope.modal.hide();*/
                            /* $scope.modalTitle = '温馨提示';
                             $scope.modal = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.chooseleason.html', show: true});
                             if($scope.detail){
                             $scope.detail.state1Name = "已邀约";
                             }*/
                            callback();
                        }, function(error) {
                            $scope.dataLoading = false;
                        });
                    }
                };

                /**
                 * 显示leads电话控制台
                 * @private
                 */
                function _showCallPhoneConsoleByLeads(data){
                    $scope.detailForUpdate = data;
                    $scope.detail = data;

                    if($scope.detail.followUpAt){
                        $scope.detail.followUpAt = new Date($scope.detail.followUpAt).Format("yyyy-MM-dd hh:ss");
                    }
                    if($scope.detail.nextVisitAt){
                        $scope.detail.nextVisitAt = new Date($scope.detail.nextVisitAt).Format("yyyy-MM-dd hh:ss");
                    }
                    if($scope.detailForUpdate.followUpAt){
                        $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:ss");
                    }
                    if($scope.detailForUpdate.nextVisitAt){
                        $scope.detailForUpdate.nextVisitAt = new Date($scope.detailForUpdate.nextVisitAt).Format("yyyy-MM-dd hh:ss");
                    }


                    //添加邀约初始化
                    {
                        $scope.CrmInvitationDetailVoForCreate = {};
                        $scope.CrmInvitationDetailVoForCreate.personState = '2';
                        $scope.CrmInvitationDetailVoForCreate.personType = '1';
                        $scope.CrmInvitationDetailVoForCreate.personId = data.crm_student_id;
                        $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                        $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
                    }
                    //添加沟通初始化
                    {
                        $scope.CrmInvitationCommunicationVoForCreate = {};
                        $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                        $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                        $scope.CrmInvitationCommunicationVoForCreate.personId = data.crm_student_id;
                        $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                    }
                    //查询电话号码状态
                    var list = [];
                    list.push($scope.currentPhone);
                    _findPhoneException(list,false,function(data){
                        list = null;
                        if(data && data[0]){
                            if(!$scope.phone){
                                $scope.phone = {};
                            }
                            $scope.phone.phone_status =data[0].status;
                            $scope.phone.phone =data[0].phone;
                        }
                    });
                    //跳转到电话控制台页面
                    var title ='通话中';
                    $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callPhoneDetail.html', show: true });
                }
                /**
                 * 查询电话状态
                 * @param list 需要查询的列表
                 * @param is  是否调用 _dealPhones方法
                 * @param callback  回调函数
                 * @private
                 */
                function _findPhoneException(list,is,callback){
                    LeadsStudentService.findPhoneException(list).then(function (result) {
                        if(ifResponseSuccess(result)){
                            $('popup').hide();
                            if(callback){
                                callback(result.data.data);
                            }
                            if(is){
                                _dealPhones(result.data);
                            }

                        }

                    });
                }
                (function init(){

                    if(check_null($routeParams.student_id)){
                        if($routeParams.student_id == 'add'){//分配学员
                        }else{
                            if($routeParams.type =='call_phone'){
                                $scope.currentPhone = $routeParams.phone;
                                //得到详情
                                CustomerStudentService.detail({
                                    crm_student_id:$routeParams.student_id
                                }).then(function(result){
                                    //console.dir(result);
                                    /*$scope.detailForUpdate = result;*/
                                    var list = []; list.push($scope.currentPhone);
                                    _findPhoneException(list,false,function(data){
                                        list = null;
                                        if(data && data[0]){
                                            if(!$scope.phone){
                                                $scope.phone = {};
                                            }
                                            $scope.phone.phone_status =data[0].status;
                                            $scope.phone.phone =data[0].phone;
                                            if( $scope.phone.phone_status ==5){
                                                SweetAlert.swal("此电话被投诉，无法拨号");
                                            }else{
                                                //弹出通话空控制台
                                                $scope.detailForUpdate =result;
                                                _showCallPhoneConsoleByLeads(result);//显示leads电话控制台
                                            }
                                        }
                                    });



                                });


                            }
                        }

                    }
                })();

            }]);