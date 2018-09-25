/**
 * Created by 毅 on 2016/3/20.
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('DetailWorkFlowCtl',
    ['$scope', '$modal', '$rootScope', '$location','$routeParams','$timeout','$base64','SweetAlert','WorkFlowService','FileUploader','localStorageService',
        function($scope, $modal, $rootScope,$location,$routeParams, $timeout,$base64,SweetAlert,WorkFlowService,FileUploader,localStorageService) {
            var oThis = this;
            var formData = [];//控制form 显示数据
            $scope.data = {};
            $scope.fileData = [];
            $scope.getFlowDetail = getFlowDetail;
            $scope.deleteProcess = deleteProcess;

            $scope.proceedTask = proceedTask;
            $scope.addBeneficiaries = addBeneficiaries;//添加收款人
            $scope.deleteBeneficiaries = deleteBeneficiaries;//删除收款人

            $scope.submitNextStep = submitNextStep;//提交 到下一步
            $scope.callBackStep = callBackStep;//打回
            $scope.saveDraft = saveDraft;//保存草稿
            $scope.proceedAndSaveDraft = proceedAndSaveDraft;//下一步 并保存草稿

            $scope.openUrl = openUrl;
            $scope.deleteFile = deleteFile;

            $scope.setDaXie = setDaXie;

            $scope.flowStatusSELECT = [{name:'全部',id:0},{name:'进行中',id:1},{name:'打回',id:2},{name:'已处理',id:3},{name:'结束',id:4},{name:'已删除',id:5},{name:'草稿',id:6}];

            function _ifResponseSuccess(response){
                if(response.data.status == 'FAILURE'){
                    SweetAlert.swal(response.data.error);
                    return false;
                }else{
                    return true;
                }
            }
            /*********************************************************调用Service层********************************************************************************/

            /**
             * 得到工作流明细
             * @param id
             */
            function getFlowDetail(id){

                WorkFlowService.getProcessesDetail(id).then(function (result) {
                    _dealResponseDetailData(result.data);
                    _dealShowOrEditType();

                    /*初始化付款方式 只有当付款方式没有时才走这个方法*/
                        if(!$scope.requestData.paymentType){
                            $scope.requestData.paymentType = {};
                        }
                        if(!check_null($scope.requestData.paymentType.cash) && !check_null($scope.requestData.paymentType.bankTransfer)){
                            $scope.requestData.paymentType.cash = 'cash';
                        }

                });
            }

            function deleteProcess(){
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900 ',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            var obj = {
                                id:$scope.requestData.taskId,
                                reason:'自己删除'
                            };

                            WorkFlowService.deleteProcess(obj).then(function (result) {
                                history.go(-1);
                            });
                        }
                    }
                );

            }

            function proceedTask(){
                WorkFlowService.proceedTask($scope.requestData).then(function(result){

                })
            }

            /**
             * 添加收款人
             */
            function addBeneficiaries(){
                if($scope.requestData && !$scope.requestData.beneficiaries){
                    $scope.requestData.beneficiaries = []
                }
                var row = {
                    name:'',//收款人姓名
                    amount:'',//汇款金额
                    bankAcount:'',//收款人账号
                    openingBank:'',//开户行
                    subbranchBank:''//支行
                };
                $scope.requestData.beneficiaries.push(row);
            }

            /**
             * 删除收款人
             */
            function deleteBeneficiaries(index){
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            Array.prototype.splice.call($scope.requestData.beneficiaries,index,1);
                        }
                    }
                );
            }

            function submitNextStep(){

                SweetAlert.swal({
                        title: "确定要提交到下一步吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900 ',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            _SetNextEitherOr(true);
                            _setFiles();
                            WorkFlowService.submitNextStep($scope.requestData).then(function (result) {
                                if(_ifResponseSuccess(result)){
                                    SweetAlert.swal("成功" );
                                    $location.path('/workflowManager-admin/solve_workflow');
                                    /*history.go(-1);*/
                                }
                            },function(err){
                                SweetAlert.swal("失败");
                                console.log(err);
                            });
                        }
                    }
                );

            }

            /**
             * 打回
             */
            function callBackStep(){
                SweetAlert.swal({
                        title: "确定要打回吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900 ',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            _SetNextEitherOr(false);
                            WorkFlowService.submitNextStep($scope.requestData).then(function (result) {
                                if(_ifResponseSuccess(result)){
                                    SweetAlert.swal("成功" );
                                    $location.path('/workflowManager-admin/solve_workflow');
                                    /*history.go(-1);*/
                                }
                            },function(err){
                                SweetAlert.swal("失败");
                                console.log(err);
                            });

                        }
                    }
                );

            }

            /**
             * 保存草稿
             */
            function saveDraft(){
                _setFiles();
                WorkFlowService.saveDraft($scope.requestData).then(function (result) {
                    if(_ifResponseSuccess(result)){
                        SweetAlert.swal("成功" );
                        $location.path('/workflowManager-admin/solve_workflow');
                        /*history.go(-1);*/
                    }
                },function(err){
                    SweetAlert.swal("失败");
                    console.log(err);
                });
            }

            /**
             * 下一步 并保存草稿
             */
            function proceedAndSaveDraft(){
                SweetAlert.swal({
                        title: "确定要下一步并保存草稿吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900 ',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            _setFiles();
                            WorkFlowService.proceedAndSaveDraft($scope.requestData).then(function (result) {
                                if(_ifResponseSuccess(result)){
                                    SweetAlert.swal("成功" );
                                    $location.path('/workflowManager-admin/solve_workflow');
                                    /* history.go(-1);*/
                                }
                            },function(err){
                                SweetAlert.swal("失败");
                                console.log(err);
                            });



                        }
                    }
                );

            }



            /**
             * 处理明细返回数据
             * @param data
             * @private
             */
            function _dealResponseDetailData(data){
                $scope.detailData = data;
                $scope.requestData = data.processVariables;
                $scope.requestData.fees1 = angular.copy(data.processVariables.fees);
                $scope.requestData.taskId =data.taskId;
                formData = data.formData.formProperties;

                _dealResponseDetailData_steps();//处理步骤数据
             /*   _dealResponseDetailData_costTypeLists();//处理费用类型*/
                _dealResponseDetailData_approvalInfo();


                if(!$scope.requestData.beneficiaries){
                    $scope.requestData.beneficiaries = [];
                    addBeneficiaries();
                }

                getBaseUrl();

                $scope.isFirse = _ifFirst();
                if($scope.requestData.expectingCreditTime){
                    $scope.requestData.expectingCreditTime = new Date($scope.requestData.expectingCreditTime).Format("yyyy-MM-dd");
                }
                if($scope.requestData.useTime){
                    $scope.requestData.useTime = new Date($scope.requestData.useTime).Format("yyyy-MM-dd");
                }
                if($scope.requestData.expectingCreditTime){
                    $scope.requestData.expectingCreditTime = new Date($scope.requestData.expectingCreditTime).Format("yyyy-MM-dd");
                }
                if($scope.requestData.purchaseTime){
                    $scope.requestData.purchaseTime = new Date($scope.requestData.purchaseTime).Format("yyyy-MM-dd");
                }


            }

                /**
                 * 处理步骤数据
                 * 数据是存在steps 和stepsDesc 中的，最后封装到一个$scope.data.steps 数组中
                 * @private
                 */
                function _dealResponseDetailData_steps(){
                    $scope.data.steps = [];
                    for(var i=0;i<$scope.detailData.steps.length;i++){
                        if(!check_null($scope.detailData.stepsDesc[i])){
                            $scope.detailData.stepsDesc[i] = '';
                        }
                        var step = {
                            name:$scope.detailData.steps[i].userName,
                            desc:$scope.detailData.stepsDesc[i],
                            startTime:$scope.detailData.steps[i].startTime,
                            completeTime:$scope.detailData.steps[i].completeTime
                        };
                        $scope.data.steps.push(step);
                    }
                }

                /**
                 * //处理费用类型
                 * @private
                 */
                function _dealResponseDetailData_costTypeLists(){
                    $scope.data.costTypeLists = [];
                    var formProp0 = $scope.detailData.formData.formProperties[0].informationValues;
                    for(var prop in formProp0){
                        var cost = {
                            name:formProp0[prop],
                            md:'requestData.fees.'+prop,
                            checked:false
                        };
                        if($scope.requestData && $scope.requestData.fees && $scope.requestData.fees[prop] == 'checked'){ //判断是否被选中
                            cost.checked = true;
                        }
                        $scope.data.costTypeLists.push(cost);
                    }

                }

                function _dealResponseDetailData_approvalInfo(){
                    $scope.data.approvalInfo = {};
                    var rec = /ApprovalInfo/i;
                    for(var i=0;i<formData.length;i++){
                        if(rec.test(formData[i].id)){
                            $scope.data.approvalInfo[formData[i].id] ={
                                isShow:true
                                ,required:formData[i].required
                                ,writable:formData[i].writable
                            };
                           /* var info = {
                                name:formData[i].name
                                ,md:formData[i].id
                                ,required:formData[i].required
                                ,writable:formData[i].writable
                            };*/
                            /*console.log(info.md);*/


                            /*$scope.data.approvalInfo.push(info);*/
                        }
                    }
                }
                function _ifFirst(){
                    for(var i=0;i<formData.length;i++){
                        if(formData[i].type=='eitherOr'){
                            return false;
                        }
                    }
                    return true;
                }


            /**
             * 设置 下一步和 打回 参数设置
             * @param isTrue
             * @returns {boolean}
             * @private
             */
            function _SetNextEitherOr(isTrue){
                for(var i=0;i<formData.length;i++){
                    if(formData[i].type=='eitherOr'){
                        $scope.requestData[formData[i].id] = isTrue;
                    }
                }
                return true;
            }



            //上传导入信息
            var uploader = $scope.uploader = new FileUploader({
                //url: config.endpoints.sos.LeadsStudent + '/importLeads',
                url: config.endpoints.workFlow.uploadFile,
                headers:{
                    'Authorization' : 'bearer ' + $base64.encode(localStorageService.get('user').account + ':' + localStorageService.get('token')),
                }
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });

            // CALLBACKS
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };

            //添加一个文件
            uploader.onAfterAddingFile = function(fileItem) {
                //判断后缀
                var fileExtend=fileItem.file.name.substring(fileItem.file.name.lastIndexOf('.')).toLowerCase();
                //console.info(fileExtend);
                /*if(fileExtend != '.xls'){
                    SweetAlert.swal('请选择后缀名为xls格式的excel模版文件');
                    fileItem.remove();
                    return false;
                }*/
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
                    SweetAlert.swal('上传成功！');
                    fileItem.file.yws_url = response.data;
                   /* console.log($scope.uploader.queue[0].file.lastModifiedDate);
                    $scope.fileData.push(response.data);
                    if($scope.requestData.files){
                        $scope.requestData.files += ','+response.data;
                    }else{
                        $scope.requestData.files = response.data;
                    }*/

                }else{
                    SweetAlert.swal(response.error);
                    fileItem.remove();
                }
                $rootScope.ywsLoading = false;
                //SweetAlert.swal(response.data.msg);
            };

            function getBaseUrl(){
                WorkFlowService.getBaseUrl().then(function (result) {
                    $scope.baseUrl = result.data;
                    dealFiles();
                },function(err){
                    SweetAlert.swal("获取base地址错误失败");
                    console.log(err);
                });
            }

            function dealFiles(){
               var files =  $scope.requestData.files;
                if(files){
                    files=files.split(",");
                    $scope.fileLists = [];
                    $scope.fileListsNotHead = [];
                    for(var i=0;i<files.length;i++){
                        var file = {
                            url:$scope.baseUrl +files[i]
                        };
                        $scope.fileListsNotHead.push({
                            url:files[i]
                        });
                        $scope.fileLists.push(file);
                    }
                    /*console.log($scope.fileLists); */
                }

            }
            function openUrl(url){
                window.open(url);
            }
            function deleteFile(index){
               /* $scope.requestData.files.*/
                    Array.prototype.splice.call($scope.fileLists,index,1);
                    Array.prototype.splice.call($scope.fileListsNotHead,index,1);
            }

            /**
             * 拼接 附件字符串
             * @private
             */
            function _setFiles(){
                //处理 上传组件问题
                var arry = $scope.uploader.queue;
                $scope.requestData.files = '';
                for(var i=0;i<arry.length;i++){
                    if($scope.requestData.files){
                        $scope.requestData.files += ','+arry[i].file.yws_url;
                    }else{
                        $scope.requestData.files = arry[i].file.yws_url;
                    }
                }
                if($scope.fileListsNotHead && $scope.fileListsNotHead.length>0){
                    if(!$scope.requestData.files){
                        $scope.requestData.files = '';
                    }
                    var items = $scope.fileListsNotHead;
                    for(var i=0;i<items.length;i++){
                        if($scope.requestData.files){
                            $scope.requestData.files += ','+items[i].url;
                        }else{
                            $scope.requestData.files = items[i].url;
                        }
                    }
                }

            }

            function _dealShowOrEditType(){
                if($scope.type==0){
                    $scope.isFirse = false;

                    $scope.data.approvalInfo = {};
                    var rec = /ApprovalInfo/i;
                    for(var i=0;i<formData.length;i++){
                        if(rec.test(formData[i].id)){
                            $scope.data.approvalInfo[formData[i].id] ={
                                isShow:true
                                ,required:formData[i].required
                                ,writable:false
                            };
                        }
                    }
                }
            }
            function setDaXie(n){
                $scope.requestData.totalAmountUppercase = DX(n);
            }

            (function init(angular){
                $scope.data = {};
                if(!check_null($routeParams.type)){
                    $scope.type = 1;
                }else{
                    $scope.type = $routeParams.type;
                }
                if(check_null($routeParams.id)){
                    $scope.flowId = $routeParams.id;
                    $scope.getFlowDetail($scope.flowId);
                }else{
                    SweetAlert.swal('id为空！');
                }

            })(angular);


        }]);
