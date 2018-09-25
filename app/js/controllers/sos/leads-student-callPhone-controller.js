/**
 * Created by 毅 on 2016/5/28.
 */
ywsApp.controller('callPhoneCtrl',
    ['$scope', '$modal', '$rootScope', '$timeout','$location','$routeParams','SweetAlert','O2oCouponManagementService','TreeDataFactory','LeadsStudentService','CommonService',
        'InvitationRemindService','InvitationCommunicationService','InvitationDetailService','CoursePlanService','DepartmentService','AuthenticationService','CustomerStudentService',
        function($scope, $modal, $rootScope, $timeout,$location,$routeParams,SweetAlert,O2oCouponManagementService,
        		TreeDataFactory,LeadsStudentService,CommonService,InvitationRemindService,InvitationCommunicationService,
        		InvitationDetailService,CoursePlanService,DepartmentService,AuthenticationService,CustomerStudentService){
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
            //可否拨打电话
            $scope.getLoginUserInfo=getLoginUserInfo;
            getLoginUserInfo();
            function getLoginUserInfo(){
            	var loginUserDepartmentId = AuthenticationService.currentUser().department_id;
            	var promise = DepartmentService.getDeparmentById(AuthenticationService.currentUser().organization.id, loginUserDepartmentId);
    			promise.then(function(response){
    				if(response.status == "FAILURE"){
    					SweetAlert.swal(response.data,"请重试","error");
    				}else{
    					var loginDepartment=response.data;
    					if(loginDepartment.schoolNature===1 || loginDepartment.cityCode===110200){
    						$scope.canCallPhone=true;
    					}else{
    						$scope.canCallPhone=false;
    					}
    					if(loginDepartment.id===Constants.DepartmentID.ZONGBU){
    						$scope.canCallPhone=true;
    					}
    				}
    			});
            }
            
            $scope.mediaChannel1ChangeForUpdate = function(){
                if($scope.detailForUpdate.media_channel_id_1){
                    CommonService.getMediaChannel($scope.detailForUpdate.media_channel_id_1).then(function (result) {
                        $scope.mediaChannel2List = result.data;
                    });
                }else{
                    $scope.mediaChannel2List = [];
                }
                $scope.detailForUpdate.media_channel_id_2=null;
            };
            $scope.showNotCallConsole2 = function(){


                $scope.isShowCallConsole = false;
                $timeout(function(){
                    var div = document.getElementsByClassName('scrollable-content')[0];
                    div.scrollTop =$scope.scrollTop;
                },1000);

            };
            function ifResponseSuccess(response){
                if(response.data.status == 'FAILURE'){
                    SweetAlert.swal(response.data.data);
                    return false;
                }else{
                    return true;
                }
            }
            //手动拨号方法
            $scope.callPhoneAtHead = function(){
                /*TODO:老王让加 @李世明 2016-12-3=========s*/
                warningAlert('外呼暂时不可用')
                return false
                /*TODO:老王让加 @李世明 2016-12-3=========n*/
                $scope.studentid ={};
                var phone = document.getElementById('leadsPhone').value;
                if(phone=='')
                {
                    warningAlert('电话号码不能为空');
                }
                else{
                    if(CPC_OpenDevice(0,0,'')>0){
                        T_InitCPhoneC(phone);
                        $scope.isLoading = false;
                        $scope.phoneModel.hide();
                        $scope.showDetailView($scope.phone);
                    }else{
                        LeadsStudentService.callNumber(phone).then(function (result) {
                            if(result.data.status=="SUCCESS"){//打电话成功
                                LeadsStudentService.getStudent(phone).then(function (result) {
                                    if(result.data.status=="SUCCESS"){
                                        $scope.currentPhone = phone;//表明当前拨打的电话号码
                                        if(result.data.data){
                                            if(result.data.data.statenew==0){//表示 没有权限访问
                                                //跳转到电话控制台页面
                                                var title ='电话所属人';
                                                $scope.studnetDetail = result.data.data;
                                                $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.repeatCallPhone.html', show: true });
                                                return false;
                                            }else{
                                                $rootScope.isCalling=true;
                                                if(result.data.data.state==2){//如果是leads 则跳转leads 电话操作台

                                                    _showCallPhoneConsoleByLeads(result.data.data);//显示leads电话控制台
                                                }else{
                                                    $location.path('/sos-admin/customer_student/'+'call_phone/'+result.data.data.crm_student_id+'/'+phone);
                                                }
                                            }

                                        }else{
                                            $rootScope.isCalling=true;
                                            _showAddCallPhoneConsoleByLeads(phone);
                                           /* $scope.showAddView();*/
                                        }
                                    }
                                },function(result){
                                    warningAlert('查询学生失败');
                                });
                            }else{
                                warningAlert('操作失败'+'请录入坐席号码');
                            }
                        },function(result){
                            warningAlert('操作失败'+'请录入坐席号码');
                        });
                    }
                }
            };
                /**
                 * 显示leads电话控制台
                 * @private
                 */
                function _showCallPhoneConsoleByLeads(data){
                    $scope.detailForUpdate = data;
                    $scope.detail = data;

                    if( $scope.detailForUpdate.followUpAt){
                        $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:ss");
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
                function _showAddCallPhoneConsoleByLeads(phone){
                    //查询电话号码状态
                    var list = []; list.push(phone);
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
                    {//初始化
                        $scope.detailForUpdate = {
                            phone:phone
                        };
                        $scope.isAddState = true;
                        //  16-07-19-----------------s
                        //客户姓名默认为电话号码并可以修改
                        $scope.detailForUpdate.name = $scope.currentPhone
                        //客户年级默认为全年级并可修改
                        $scope.detailForUpdate.grade_id = 18
                        //  16-07-19-----------------n
                        $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
                    }

                    //跳转到电话控制台页面
                    var title ='通话中';
                    $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callPhoneDetail.html', show: true });
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
            //判断是否有到访记录
            $scope.findHaveDaoFang = function(detail,index){
                var crm_student_id = detail.crm_student_id || detail.id;
                if($scope.modalIsPlan){
                    $scope.modalIsPlan.hide();
                }
                $location.path('/sos_admin/customer_student_course/'+crm_student_id+"/3");

                /*//如果渠道是 拉上 或 直访 能直接添加试听
                 if(detail.media_channel_id_2 && (detail.media_channel_id_2 == 18 || detail.media_channel_id_2 == 19)){
                 $location.path('/sos_admin/customer_student_course/'+crm_student_id+"/3");
                 return;
                 }
                 //console.log(detail);
                 var filter ;
                 filter={"crm_student_id":crm_student_id};
                 CommonService.findHaveYaoYue(filter).then(function (result) {
                 $scope.dataLoading = false;
                 var flag = result.data;
                 if(!flag){
                 warningAlert('无邀约记录，无法进行排课');
                 }else{
                 $location.path('/sos_admin/customer_student_course/'+crm_student_id+"/3");
                 }
                 }, function(error) {
                 $scope.dataLoading = false;
                 warningAlert('邀约记录查询失败，无法进行排课');
                 return;
                 });*/

            }
            $scope.modalForRepeatHide = function(){
                $scope.modalForRepeat.hide();
                $scope.CrmLeadsStudentVoForCreate.phone = null;
                $scope.CrmLeadsStudentVoForCreate.mother_phone = null;
                $scope.CrmLeadsStudentVoForCreate.father_phone = null;
                if($scope.detailForUpdate.followUpAt){
                    $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:ss");
                }
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
                _findPhoneException(list,true,callback);
            };
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
            /**
             *
             * @param row
             * @param isNotOperate 是否不显示操作按钮
             */
            $scope.callNumber = function(row,isNotOperate){
                /*if(CPC_OpenDevice(0,0,'')>0)
                 {
                 console.log(row.phone);
                 T_InitCPhoneC(row.phone);

                 }*/

                $scope.phone = angular.copy(row);

                if(!isNotOperate){
                    $scope.phone.isNotOperate = false;
                }else{
                    $scope.phone.isNotOperate = isNotOperate;
                }
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
                    row.isCalled = true;
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
                LeadsStudentService.detail(detail).then(function(result){
                    //console.dir(result);
                    $scope.detailForUpdate = result;
                    if(result.followUpAt){
                        if($scope.isMobile){
                            $scope.detailForUpdate.followUpAt = result.followUpAt;
                        }else{
                            $scope.detailForUpdate.followUpAt = new Date(result.followUpAt).Format("yyyy-MM-dd hh:mm:ss");
                        }
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
                    if($scope.isMobile){
                        if(!$scope.detailForUpdate){
                            $scope.detailForUpdate = {};
                        }
                        var time = (new Date($scope.detailForUpdate.followUpAt).getTime()+8*60*60*1000)% (24*60*60*1000);
                        var date = new Date($scope.detailForUpdate.followUpAt).getTime() -time;
                        if(!isNaN(date)){
                            $scope.detailForUpdate.followUpAt1 = new Date(date);
                            $scope.detailForUpdate.followUpAt2 = new Date(time-8*60*60*1000);
                        }
                    }

                })
            }
            $scope.callPhone = function(phone,status){

                //注意，这是解决遗留问题，当电话从自己到父母变化时，强变为phone.phone,实际应该为current phone
                $scope.phone.phone_status = status;
                $scope.phone.phone = phone;

                $scope.isShowInvite = false;
                if(CPC_OpenDevice(0,0,'')>0)
                {
                    console.log(phone);
                    T_InitCPhoneC(phone);
                    $scope.isLoading = false;
                    $scope.phoneModel.hide();
                }else{
                    $rootScope.isCalling=true;
                    $scope.isLoading = false;
                    if(check_null($scope.phoneModel)){
                        $scope.phoneModel.hide();
                    }
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
                    $scope.currentPhone = phone;//表明当前拨打的电话号码

                    LeadsStudentService.callNumber(phone,$scope.phone.crm_student_id).then(function (result) {
                        $scope.courses1 = result.data;
                        if(result.data.status=="SUCCESS"){
                            $rootScope.isCalling=true;
                            console.log($scope.phone);
                            $scope.isLoading = false;
                            if(check_null($scope.phoneModel)){
                                $scope.phoneModel.hide();
                            }
                            $scope.currentPhone = phone;//表明当前拨打的电话号码
                            if($scope.isMobile){
                                if(!status){
                                    status = 1;
                                }
                                $scope.isShowCallConsole = true;
                                /*$location.path('/mobile/callConsole/'+phone+'/'+status+'/'+$scope.phone.crm_student_id);*/
                                {
                                    var div = document.getElementsByClassName('scrollable-content')[0];
                                    $scope.scrollTop = div.scrollTop;
                                    var id = $scope.phone.crm_student_id;
                                    $scope.phone = {};
                                    if(check_null(phone)){
                                        $scope.currentPhone = phone;
                                        $scope.phone.phone = phone;
                                        $scope.phone.phone_status = status;
                                        $scope.phone.crm_student_id = id;
                                        _getAllSelected();
                                        _getLeadsDetail( $scope.phone);//得到详细信息并将放在$scope.detailForUpdate
                                        $scope.purposeLevel = [{"name":"高","value":1},{"name":"一般","value":2},{"name":"暂无","value":3},{"name":"未标记","value":4}];

                                        $scope.CrmInvitationDetailVoForCreate = {};
                                        $scope.CrmInvitationDetailVoForCreate.personState = '2';
                                        $scope.CrmInvitationDetailVoForCreate.personType = '1';
                                        $scope.CrmInvitationDetailVoForCreate.personId = $scope.phone.crm_student_id;
                                        $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                                        $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();


                                        $scope.CrmInvitationCommunicationVoForCreate = {};
                                        $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                                        $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                                        $scope.CrmInvitationCommunicationVoForCreate.personId = $scope.phone.crm_student_id;
                                        $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                                    }
                                }

                            }else{
                                $scope.phoneModel=$modal({title:title,scope:$scope, templateUrl: 'partials/sos/leads/modal.callPhoneDetail.html', show: true });
                            }
                            }else{
                            successAlert(result.data.data);
                        }
                    },function(result){
                        warningAlert('操作失败'+'请录入坐席号码');
                    });
                }
            };

            /**
             * 改变leads 状态
             * @param rew
             * @param status 要改变的新状态
             */
            $scope.changeExceptionStatus = function(row,status){
                //console.log(2);
                if(typeof row.exceptionStatus !='undefined' &&row.exceptionStatus!=null){
                    row.exception_status=row.exceptionStatus;
                }
                if(status == row.exception_status){
                    return;
                }else if(!row.crm_student_id){
                    row.exception_status = status;
                    row.exceptionStatus=status;
                }else{
                    var obj = {
                        id:row.crm_student_id,
                        exceptionStatus:status
                    };
                    LeadsStudentService.updateLeadsStudent(obj).then(function (result) {
                        if(ifResponseSuccess(result)){
                            //if($scope.showListView){
                            //    $scope.showListView();
                            //}
                            if( $scope.detailForUpdate){
                                $scope.detailForUpdate.exception_status = status;
                                $scope.detailForUpdate.exceptionStatus = status;
                            }
                            row.exception_status = status;
                            row.exceptionStatus=status;
                            $('popup').hide();
                        }
                    });

                }
            };
            $scope.changeLeadsProterty = function(row,status){
                if(status == row.leadsProperty){
                    return;
                }else if(!row.crm_student_id){
                    row.leadsProperty = status;
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
                $scope.detailForUpdate.purposeLevel = $scope.detailForUpdate.purposeLevel || 4;
                $scope.detailForUpdate.exceptionStatus = $scope.detailForUpdate.exception_status || 1;
                $scope.detailForUpdate.next_visit_at = $scope.detailForUpdate.next_visit_at||$scope.detailForUpdate.nextVisitAt
                if($scope.detailForUpdate.next_visit_at){
                    $scope.detailForUpdate.next_visit_at = new Date($scope.detailForUpdate.next_visit_at);
                    $scope.detailForUpdate.nextVisitAt =  $scope.detailForUpdate.next_visit_at;
                }

                if($scope.isAddState){
                    _addLeadsStudent($scope.detailForUpdate)
                }else{
                        _updateLeadsStudent( $scope.detailForUpdate);
                }

            };
            $scope.saveCallPhoneDetilByMobile = function(){
                if($scope.detailForUpdate
                    && $scope.detailForUpdate.followUpAt1 &&  ($scope.detailForUpdate.followUpAt1 != null) && ($scope.detailForUpdate.followUpAt1 != 'Invalid Date')
                    && (!$scope.detailForUpdate.followUpAt2 || $scope.detailForUpdate.followUpAt2=='Invalid Date')){
                    warningAlert('下次跟进时间不能为空');
                    return;
                }
                if($scope.detailForUpdate
                    && $scope.detailForUpdate.followUpAt2 &&  ($scope.detailForUpdate.followUpAt2 != null) && ($scope.detailForUpdate.followUpAt2 !=  'Invalid Date')
                    && (!$scope.detailForUpdate.followUpAt1  || $scope.detailForUpdate.followUpAt1=='Invalid Date')){
                    warningAlert('下次跟进日期不能为空');
                    return;
                }
                /*alert($scope.CrmInvitationDetailVoForCreate.receiveTime2);*/
                if($scope.CrmInvitationDetailVoForCreate
                    && $scope.CrmInvitationDetailVoForCreate.receiveTime1 &&  ($scope.CrmInvitationDetailVoForCreate.receiveTime1 != null)  &&  ($scope.CrmInvitationDetailVoForCreate.receiveTime1 !=  'Invalid Date')
                    && (!$scope.CrmInvitationDetailVoForCreate.receiveTime2 ))
                {
                    warningAlert('预到访时间不能为空');
                    return;
                }
                if($scope.CrmInvitationDetailVoForCreate
                    && $scope.CrmInvitationDetailVoForCreate.receiveTime2 &&  ($scope.CrmInvitationDetailVoForCreate.receiveTime2 != null) &&  ($scope.CrmInvitationDetailVoForCreate.receiveTime2 !=  'Invalid Date')
                    && (!$scope.CrmInvitationDetailVoForCreate.receiveTime1 )){
                    warningAlert('预到访日期不能为空');
                    return;
                }

                if($scope.detailForUpdate
                    && $scope.detailForUpdate.followUpAt1  &&  $scope.detailForUpdate.followUpAt2
                    && ($scope.detailForUpdate.followUpAt1 != null)  &&  ($scope.detailForUpdate.followUpAt2 != null)
                    &&  $scope.detailForUpdate.followUpAt1.getTime()>0 )
                {
                    $scope.detailForUpdate.followUpAt = ($scope.detailForUpdate.followUpAt1).getTime()+($scope.detailForUpdate.followUpAt2).getTime()+8*60*60*1000;
                }else {


                }
                if($scope.CrmInvitationDetailVoForCreate && $scope.CrmInvitationDetailVoForCreate.receiveTime1 && $scope.CrmInvitationDetailVoForCreate.receiveTime2){
                    $scope.CrmInvitationDetailVoForCreate.receiveTime = ($scope.CrmInvitationDetailVoForCreate.receiveTime1).getTime()
                        +($scope.CrmInvitationDetailVoForCreate.receiveTime2).getTime()+8*60*60*1000;
                }

                if($scope.CrmInvitationDetailVoForCreate.invitationContent && (!$scope.CrmInvitationDetailVoForCreate.receiveTime ||  $scope.CrmInvitationDetailVoForCreate.receiveTime== null)){
                    warningAlert('请填写预到访时间');
                    return;
                }
                if($scope.CrmInvitationDetailVoForCreate.receiveTime && (!$scope.CrmInvitationDetailVoForCreate.invitationContent ||  $scope.CrmInvitationDetailVoForCreate.invitationContent== null)){
                    warningAlert('请填写邀约到访内容');
                    return;
                }


                if($scope.CrmInvitationDetailVoForCreate && $scope.CrmInvitationDetailVoForCreate.receiveTime1 &&$scope.CrmInvitationDetailVoForCreate.receiveTime2){
                    $scope.isShowInvite = true;
                }else{
                    $scope.isShowInvite = false;
                };
                if($scope.isAddState){
                    _addLeadsStudent($scope.detailForUpdate)
                }else{
                    _updateLeadsStudent( $scope.detailForUpdate);

                }

            };
            /**
             * $scope.detailForUpdate
             * @param deail
             * @private
             */
            function _updateLeadsStudent(deail){
                //console.dir($scope.detailForUpdate);
                if(!$scope.isMobile) {
                    if ($scope.CrmInvitationDetailVoForCreate.receiveTime && (new Date($scope.CrmInvitationDetailVoForCreate.receiveTime) < new Date())) {
                        warningAlert("预到访时间不能小于当天时间");
                        $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:mm");
                        return;
                    }
                }
                delete  deail.followUpAt1;
                delete  deail.followUpAt2;
                if( isNaN(deail.followUpAt) ){
                    delete  deail.followUpAt;
                }
                /*2016-09-23 @李世明 张晶 学员管理拨打电话处理邀约后是否弹框，deail.state==1时不弹框试听排课，为已有学员=============s*/
                var promise = ''
                if(deail.state==2){
                    promise = LeadsStudentService.update(deail);
                }else if(deail.state==1){
                    promise = CustomerStudentService.update(deail);
                }
                /*2016-09-23 @李世明 张晶 学员管理拨打电话处理邀约后是否弹框，deail.state==1时不弹框试听排课，为已有学员=============n*/

                promise.then(function(data) {
                    if(data.status == 'FAILURE'){
                        if(typeof data.data == 'string'){
                            SweetAlert.swal(data.data);
                        }else{
                            $scope.repeateData = data.data;
                            $scope.modalForRepeatTitle = '电话号码重复';
                            $scope.modalForRepeat = $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.repeate.html', show: true });
                        }
                        return false;
                    }
                    /*2016-09-23 @李世明 张晶 学员管理拨打电话处理邀约后是否弹框，deail.state==1时不弹框试听排课，为已有学员=============s*/

                    if(deail.state==1){
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
                    }else{
                        if($scope.isShowInvite){
                            /* if($scope.isMobile){
                             $scope.CrmInvitationDetailVoForCreate = {};
                             $scope.CrmInvitationDetailVoForCreate.personState = '2';
                             $scope.CrmInvitationDetailVoForCreate.personType = '1';
                             $scope.CrmInvitationDetailVoForCreate.personId = $routeParams.crm_student_id;;
                             $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                             $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();
                             }*/


                            saveInvitationDetail(function(){
                                _saveInvitationCommunication(function(){
                                    /*   $scope.phoneModel.hide();
                                     $scope.showListView();
                                     var shiting = $rootScope.showPermissions("FreeListening");
                                     if(shiting){
                                     $scope.title = '温馨提示';
                                     $scope.modalIsPlan= $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.isPlan.html', show: true });
                                     }*/
                                    if($scope.phoneModel){
                                        $scope.phoneModel.hide();
                                    }
                                    if(!$scope.isMobile){
                                        $scope.showListView();
                                        var shiting = $rootScope.showPermissions("FreeListening");
                                        if(shiting){
                                            $scope.title = '温馨提示';
                                            $scope.modalIsPlan= $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.isPlan.html', show: true });
                                            $rootScope.modalIsPlan = $scope.modalIsPlan
                                        }
                                    }else{
                                        $scope.isShowCallConsole = false;
                                        $timeout(function(){
                                            var div = document.getElementsByClassName('scrollable-content')[0];
                                            div.scrollTop =$scope.scrollTop;
                                        },500);
                                        //$location.url('/sos-admin/leads_student_myself');
                                    }

                                });
                            });
                        }else{
                            _saveInvitationCommunication(function(){
                                if($scope.phoneModel){
                                    $scope.phoneModel.hide();
                                }
                                if(!$scope.isMobile){
                                    $scope.showListView();
                                }else{
                                    $scope.isShowCallConsole = false;
                                    $timeout(function(){
                                        var div = document.getElementsByClassName('scrollable-content')[0];
                                        div.scrollTop =$scope.scrollTop;
                                    },500);
                                    //$location.url('/sos-admin/leads_student_myself');
                                }

                            });
                        }
                    }
                    /*2016-09-23 @李世明 张晶 学员管理拨打电话处理邀约后是否弹框，deail.state==1时不弹框试听排课，为已有学员=============n*/


                }, function(error) {
                    warningAlert("更新Leads失败");
                });
            }
            function _addLeadsStudent(deail){
                //console.dir($scope.detailForUpdate);
                if($scope.CrmInvitationDetailVoForCreate.receiveTime&&(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date()))
                {
                    warningAlert("预到访时间不能小于当天时间");
                    $scope.detailForUpdate.followUpAt = new Date($scope.detailForUpdate.followUpAt).Format("yyyy-MM-dd hh:mm");
                    return;
                }
                var promise = LeadsStudentService.create(deail);
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

                    if(data.data.id){
                        var student = {};
                        /*$scope.modalForImport.hide();*/
                        student.crm_student_id = data.data.id;
                        $scope.detailForUpdate = data.data;

                        //添加邀约初始化
                        {
                           /* $scope.CrmInvitationDetailVoForCreate = {};*/
                            $scope.CrmInvitationDetailVoForCreate.personState = '2';
                            $scope.CrmInvitationDetailVoForCreate.personType = '1';
                            $scope.CrmInvitationDetailVoForCreate.personId = student.crm_student_id;
                            $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                           /* $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();*/
                        }
                        //添加沟通初始化
                        {
                            /*$scope.CrmInvitationCommunicationVoForCreate = {};*/
                            $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                            $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                            $scope.CrmInvitationCommunicationVoForCreate.personId = student.crm_student_id;
                            $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                        }
                        if($scope.isShowInvite){
                            saveInvitationDetail(function(){
                                _saveInvitationCommunication(function(){
                                    $scope.phoneModel.hide();
                                    $scope.showListView();

                                    var shiting = $rootScope.showPermissions("FreeListening");
                                    if(shiting){
                                        $scope.title = '温馨提示';
                                        $scope.modalIsPlan= $modal({scope: $scope, templateUrl: 'partials/sos/leads/modal.isPlan.html', show: true });
                                        $rootScope.modalIsPlan = $scope.modalIsPlan
                                    }

                                });
                            });
                        }else{
                            _saveInvitationCommunication(function(){
                                $scope.phoneModel.hide();
                                $scope.showListView();
                            });
                        }
                    }else{
                        warningAlert("创建Leads失败");
                    }
                }, function(error) {
                    warningAlert("创建Leads失败");
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
            function _getAllSelected() {

              /*  CommonService.getSubjectIdSelect().then(function (result) {
                    $scope.subjectIds = result.data;
                });*/
                CommonService.getGradeIdSelect().then(function (result) {
                    $scope.gradeIds = result.data;
                });
                /*CommonService.getProvinceSelect().then(function (result) {
                    $scope.provinceList = result.data;
                });
                CommonService.getState(0).then(function (result) {
                    //console.dir(result);
                    $scope.state1List = result.data;
                });
                CommonService.getMediaChannel(0).then(function (result) {
                    $scope.mediaChannel1List = result.data;
                });*/
            };

            /**
             * 保存 邀约
             */
            function saveInvitationDetail(callback) {
                //console.log('Saving the invitationDetail.');
                //$scope.dataLoading = true;
                if(new Date($scope.CrmInvitationDetailVoForCreate.receiveTime)<new Date())
                {
                    warningAlert("预到访时间不能小于当天时间");
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
             * 选择意向程度//  16-07-19-----------------s
             * @param value
             */
            $scope.selectPurposeLevel = function (value) {
                $scope.detailForUpdate.purposeLevel=value;
            };
            //  16-07-19-----------------n
            (function init(){
                $scope.isShowCallConsole = false;
                if($scope.isMobile){
                    $scope.phone = {};
                    if(check_null($routeParams.phone)){
                        $scope.currentPhone = $routeParams.phone;
                        $scope.phone.phone = $routeParams.phone;
                        $scope.phone.phone_status = $routeParams.status;
                        $scope.phone.crm_student_id = $routeParams.crm_student_id;
                        _getAllSelected();
                        _getLeadsDetail( $scope.phone);//得到详细信息并将放在$scope.detailForUpdate
                        $scope.purposeLevel = [{"name":"高","value":1},{"name":"一般","value":2},{"name":"暂无","value":3},{"name":"未标记","value":4}];

                        $scope.CrmInvitationDetailVoForCreate = {};
                        $scope.CrmInvitationDetailVoForCreate.personState = '2';
                        $scope.CrmInvitationDetailVoForCreate.personType = '1';
                        $scope.CrmInvitationDetailVoForCreate.personId = $routeParams.crm_student_id;
                        $scope.CrmInvitationDetailVoForCreate.isinside = '1';
                        $scope.CrmInvitationDetailVoForCreate.invitateTime = new Date();


                        $scope.CrmInvitationCommunicationVoForCreate = {};
                        $scope.CrmInvitationCommunicationVoForCreate.personState = '2';
                        $scope.CrmInvitationCommunicationVoForCreate.personType = '1';
                        $scope.CrmInvitationCommunicationVoForCreate.personId = $routeParams.crm_student_id;
                        $scope.CrmInvitationCommunicationVoForCreate.communicateTime = new Date().Format("yyyy-MM-dd");
                    }
                    //  这里的改动可以查看2016-11-29 15:40以往的版本： $scope.phone = {};从条件外放到条件内
                }
            })();


        }])
;
