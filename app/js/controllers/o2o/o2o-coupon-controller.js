'use strict';
/**
 * The Coupon management controller.
 * @author sunqc
 * @version 1.0
 */
var ywsApp = angular.module('ywsApp');
ywsApp.controller('CouponManagementController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','O2oCouponManagementService',
        function($scope, $modal, $rootScope, SweetAlert,O2oCouponManagementService) {
            var oThis = this;
            var DEFAULT_IMG_URL = Constants.DEFAULT_IMG_URL;//当图片不存在时显示的图片地址
           /* $scope.list =[];
            $scope.Page = {
                pageSize:5,
                pageCurrent:1
            };//分页*/
            $scope.callCouponListController = callCouponListController;
            $scope.tableStateCouponList = {};

            oThis.couponList = [];
            oThis.view = {
                tableStateCouponList:{}//存放当前分页参数
            };//存放页面显示参数


            //---------------------------------------ctrl方法-------------------------------------
            oThis.detailCouponShow = detailCouponShow;
            oThis.addCouponShow = addCouponShow;
            oThis.editCouponShow = editCouponShow;
            oThis.deleteCoupon = deleteCoupon;
            oThis.view.clickUpOut = clickUpOut;

            //---------------------------------------util---------------------------------------

            $scope.ifTimeDue = ifTimeDue;
            oThis.detailShow = detailShow;
            oThis.getCouponList = getCouponList;

            $scope._updateCouponController = _updateCouponController;//子controller可以调用
            oThis._clickUpOut = _clickUpOut;
            oThis._upDownCouponController = _upDownCouponController;
            oThis._deleteCoupon = _deleteCoupon;
            oThis.view.defaultImg = defaultImg;

            /*************************************************************************************************************
             * *********************************************************************************************************/
            (function init(angular){
                oThis.isLoadingCouponList = true;
            })(angular);

            //---------------------------------------$scope方法------------------------------------------
            function callCouponListController(tableState){
                oThis.getCouponList(tableState);
            }

            //---------------------------------------ctrl方法---------------------------------------
            function detailCouponShow(coupon){
                var title = '显示';
                $scope.showType = 0;//1 表示修改  2 表示添加  0 表示显示

                $scope.currentCoupon = angular.copy(coupon);
                $scope.currentCoupon.validitystarttime = new Date($scope.currentCoupon.validitystarttime).Format("yyyy-MM-dd");
                $scope.currentCoupon.validityendtime = new Date($scope.currentCoupon.validityendtime);
                oThis.detailShow(title);

            }

            function addCouponShow(){
                var title  = '添加';
                $scope.showType = 2;//1 表示修改  2 表示添加  0 表示显示
                $scope.currentCoupon = {};

                oThis.detailShow(title);
            }
            function editCouponShow(coupon){
                var title = '修改';
                $scope.showType = 1;//1 表示修改  2 表示添加  0 表示显示
                $scope.currentCoupon = angular.copy(coupon);
                $scope.currentCoupon.validitystarttime = new Date($scope.currentCoupon.validitystarttime).Format("yyyy-MM-dd");
                $scope.currentCoupon.validityendtime = new Date($scope.currentCoupon.validityendtime);
                oThis.detailShow(title);
            }
            function deleteCoupon(coupon){
                var id = coupon.id;
                SweetAlert.swal({
                        title: "确定要删除吗？",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function(confirm) {
                        if (confirm) {
                            oThis._deleteCoupon(id);
                        }
                    }
                );

            }

            //---------------------------------------util---------------------------------------
            //打开detailCoupon modal
            function detailShow(title){
                $scope.detailShowModal = $modal({title:title,scope: $scope, templateUrl: 'partials/o2o/coupon/modal.detailCoupon.html', show: true });
            }
            //上下架事件
            function clickUpOut(coupon,$event){
                oThis._clickUpOut(coupon);
                $event.stopPropagation();//组织冒泡事件
                return this;
            }
            /**
             * 判断是否过期
             * 如endTime 不存在 则默认为没有过期
             */
            function ifTimeDue(endTime){
                var curreyTime = Date.parse(new Date());
                endTime = endTime+24*60*60*1000;
                if(check_null(endTime)){
                    if(curreyTime > endTime){
                        return true;
                    }
                }
                return false;
            }
            function defaultImg(url){
                if(check_null(url)){
                    return QINIU_O2O_DOMIAN+url;
                }else{
                    return DEFAULT_IMG_URL;
                }
            }
            //-------------------------------------------------------------调用service------------------------------------------
            function getCouponList(tableState){
                $scope.tableStateCouponList = tableState;

                var start = tableState.pageCurrent || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                var number = tableState.pageItems || 12;  // Number of entries showed per page.
                var search ='';

                O2oCouponManagementService.getCouponListService(start, number,search).then(function (result) {
                    oThis.couponList = result.data;
                    $scope.Page.pageSize = result.numberOfPages;//set the number of pages so the pagination can update
                    oThis.isLoadingCouponList = false;
                });
            }
            function _clickUpOut(coupon){
                //if(check_null(coupon.isShelve)){
                    var params = {
                        id:coupon.id,
                        isShelve:coupon.isShelve || 0

                    };
                    if( coupon.isShelve == 0){//0 表示下架 1 上架
                        params.isShelve = 1;
                        oThis._upDownCouponController(params, function(){
                            coupon.isShelve = 1;
                        });

                    }else{
                        params.isShelve = 0;
                        oThis._upDownCouponController(params,function(){
                            coupon.isShelve = 0;
                        });
                    }
              /*  }else{
                    coupon.isShelve = 1;//让其上架
                }*/
            }
            function _updateCouponController(params,callback){
                //var json = JSON.stringify(params);
                O2oCouponManagementService.updateCouponService(params).then(function (result) {
                    var status = result.data;
                    //oThis.isLoadingCouponList = false;
                    if(callback && angular.isFunction(callback) ){
                        callback();
                    }
                });
            }
            function _upDownCouponController(params,callback){
                O2oCouponManagementService.upDownShelveService(params).then(function (result) {
                    var status = result.data;
                    //oThis.isLoadingCouponList = false;
                    if(callback && angular.isFunction(callback) ){
                        callback();
                    }
                });
            }
            function _deleteCoupon(id){
                O2oCouponManagementService.deleteCouponService(id).then(function (result) {
                    var status = result.data;
                    oThis.getCouponList($scope.tableStateCouponList);
                });
            }

        }]);

ywsApp.controller('O2ODetailCouponController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','O2oCouponManagementService','CommonService','fileReader',
        function($scope, $modal, $rootScope, SweetAlert,O2oCouponManagementService,CommonService,fileReader) {
            var oThis = this;

            (function init(){
                oThis.view={

                    selectedCondition:[
                        {name:'无限制', id:0},
                        {name:'新用户注册奖励', id:1},
                        {name:'参与活动', id:2},
                        {name:'分享注册', id:3}
                    ],
                    upDownState:[
                        {name:'上架', id:1},
                        {name:'下架', id:0}

                    ],
                    selectedTotalType:[
                        {name:'累计总价', id:2},
                        {name:'累计课时', id:3},
                        {name:'单笔消费', id:1}
                    ],
                    showCourses:'',//显示选中课程字符串
                    courseTree:[],//课程类型 tree
                    courseType:{},//被选中课程类型
                    isLoading:false,
                    isShowSubmit:false
                   /* isSelectedCourse:false*/

                };
                oThis.view.courseTree = [];
                oThis.coupon = {};//收集view 数据
                //oThis.isLoadingDetailCoupon = true;
                oThis.showType = $scope.showType;//1 表示修改  2 表示添加  0 表示显示
                oThis.currentCoupon = $scope.currentCoupon;
                oThis.isEdit = false;//頁面是否可以編輯
                oThis.fenXiangText = false;//获取条件 --是否显示“分享注册”

                oThis.provinceList = [];//省份
                oThis.condition = 0;//获取条件 seleted
                oThis.selectAddressType = 0;//1 表示 基本信息课程  2 表示 使用条件课程   0 表示 默认

                //默认值
                $scope.currentCoupon.activeConditionType = 1;//使用条件类型   单笔消费
                $scope.currentCoupon.gainConditionType = 0;//获取条件: 无限制

                ifEditShow();
                /*if(oThis.showType==2){
                    oThis.view.isSelectedCourse = true;
                }*/
                getAllProvince();
                getCoursesTree();

                _initData();

            })();



            /***********************************ctrl**************************************************************************************/
            oThis._initData = _initData;
            oThis.submitController = submitController;
            oThis.searchCoursesView = searchCoursesView;

            $scope.getFile = getFile;
            oThis._updateCouponController = _updateCouponController;//从father controller 中引入
            oThis._addCouponController = _addCouponController;
            $scope.setSelectedAndNode = setSelectedAndNode;

            /***********************************service**************************************************************************************/
            oThis.addSubmit = addSubmit;
            oThis.editSubmit = editSubmit;
            oThis.getDetailCouponById = getDetailCouponById;
            oThis.getAllProvince = getAllProvince;//省份
            oThis.getCoursesTree = $scope.getCoursesTree = getCoursesTree;
            //$scope.getCoursesTree = getCoursesTree;

            /***********************************util**************************************************************************************/

            oThis.ifEditShow = ifEditShow;

            oThis.setDetailCouponData = setDetailCouponData;
            oThis.showSelectedProvince = showSelectedProvince;

            //oThis.showConditionText = showConditionText;
            oThis.view._setShowCourses = _setShowCourses;
            oThis._FATCoursesTree = _FATCoursesTree;


            /***********************************ctrl**************************************************************************************/
            function _initData(){
                if (oThis.showType==1 || oThis.showType==0 ) {//1 表示修改  2 表示添加  0 表示显示
                    //添加时不用查优惠券详细信息
                    getDetailCouponById(oThis.currentCoupon.id);
                    oThis.currentCoupon.validitystarttime = new Date(oThis.currentCoupon.validitystarttime).Format("yyyy-MM-dd");
                    oThis.currentCoupon.validityendtime = new Date(oThis.currentCoupon.validityendtime).Format("yyyy-MM-dd");//添加时默认是2050年
                    //oThis.currentCoupon.validitystarttime = new Date(oThis.currentCoupon.validitystarttime);
                    //oThis.currentCoupon.validityendtime = new Date(oThis.currentCoupon.validityendtime);

                }else{
                    oThis.currentCoupon.validitystarttime = new Date().Format("yyyy-MM-dd");
                    oThis.currentCoupon.validityendtime = new Date(2050,12,31).Format("yyyy-MM-dd");//添加时默认是2050年
                }
                if(check_null(oThis.currentCoupon.imageMax)){
                    oThis.view.imageMax =  QINIU_O2O_DOMIAN+oThis.currentCoupon.imageMax;
                }
                if( oThis.showType==1 ||oThis.showType==2 ){
                   oThis.view.isShowSubmit = true;
                }else{
                    oThis.view.isShowSubmit = false;
                }

            }

            /**
             * 配合 directive img-model
             */
            function getFile() {
                console.log($scope.currentCoupon.imageMax);
                fileReader.readAsDataUrl($scope.currentCoupon.imageMax, $scope)
                    .then(function(result) {
                        oThis.view.imageMax = result;
                        $scope.currentCoupon.imageMax=result;
                    });
            }

            /***********************************ctrl**************************************************************************************/
            function submitController(){
                //判读是否提交类型
                if(!check_null($scope.currentCoupon.imageMax)){
                    SweetAlert.swal('请添加图片样式');
                    return false;
                }else if($scope.currentCoupon.validityendtime <= $scope.currentCoupon.validitystarttime){
                    SweetAlert.swal('结束时间必须大于开始时间');
                    return false;
                }else if($scope.currentCoupon.couponReduction >= $scope.currentCoupon.singlePayment){
                    SweetAlert.swal('单笔消费必须大于等于优惠金额');
                    return false;
                }
                oThis.view.isLoading = true;
                if(oThis.showType == 1){//1 表示修改  2 表示添加  0 表示显示
                    oThis.editSubmit();
                }else if(oThis.showType == 2){//1 表示修改  2 表示添加  0 表示显示
                    oThis.addSubmit();
                }
            }
            function setSelectedAndNode(selectedIDs,nodes){
                if(oThis.selectAddressType ==1 ){
                    //oThis.currentCoupon.selectedCoursesID = oThis.currentCoupon.omsCouponCourseList =selectedIDs;
                    oThis.currentCoupon.omsCouponCourseList =selectedIDs;
                    $scope.currentCoupon.omsCouponCourseList =selectedIDs;
                    oThis.currentCoupon.selectedCoursesNODEs = nodes;
                    oThis.view._setShowCourses(nodes);

                }

            }

            /***********************************service**************************************************************************************/

            /**
             * 得到优惠券详细信息
             * @param id 优惠券id
             */
            function getDetailCouponById(id){
                O2oCouponManagementService.detailCouponByIdService(id).then(function(result) {
                    var detailCouponMap = result.data;
                    oThis.setDetailCouponData(detailCouponMap);
                    oThis.isLoadingDetailCoupon = false;
                });
            }
            function getAllProvince(){//省份
                CommonService.getProvinceSelect().then(function(result) {
                    oThis.provinceList = result.data;
                });
            }
            function addSubmit(){
                $scope.currentCoupon.selectedCoursesNODEs = null;
                oThis._addCouponController()
            }
            function editSubmit(callback){
                $scope.currentCoupon.selectedCoursesNODEs = null;
                oThis._updateCouponController($scope.currentCoupon,callback);
            }
            function _addCouponController(callback){
                console.log($scope.currentCoupon);
                O2oCouponManagementService.addCouponService($scope.currentCoupon).then(function (result) {
                    var status = result.data;
                    if(callback && angular.isFunction(callback) ){
                        callback();
                    }
                    SweetAlert.swal('添加成功');
                    $scope.callCouponListController($scope.tableStateCouponList);
                    $scope.detailShowModal.hide();
                },function(result){
                    SweetAlert.swal('失败'+ result.data);
                });
            }
            function _updateCouponController(params,callback){
                //var json = JSON.stringify(params);
                O2oCouponManagementService.updateCouponService(params).then(function (result) {
                    var status = result.data;
                    //oThis.isLoadingCouponList = false;
                    if(callback && angular.isFunction(callback) ){
                        callback();
                    }
                    SweetAlert.swal('修改成功');
                    $scope.callCouponListController($scope.tableStateCouponList);
                    oThis.view.isLoading = false;
                    $scope.detailShowModal.hide();
                },function(result){
                    SweetAlert.swal('失败'+ result);
                    oThis.view.isLoading = false;
                });
            }

            function getCoursesTree(){
                O2oCouponManagementService.searchCourseTree().then(function(result) {
                    oThis.view.courseTree = oThis._FATCoursesTree(result.data);
                    //oThis.isLoadingSearchCourses = false;
                    //oThis._ctrlShow();
                    return oThis.view.courseTree;
                });
            }
            function _FATCoursesTree(tree){
                var root = [];
                for(var i=0;i<tree.length;i++){
                    var node = {
                        id:tree[i].omsCourseType.id,
                        name:tree[i].omsCourseType.name,
                        check:false,
                        items:[]
                    };
                    //node.courses;
                    for(var j=0;j<tree[i].omsCourseList.length;j++){
                        var items = {
                            id:tree[i].omsCourseList[j].id,
                            name:tree[i].omsCourseList[j].name,
                            check:false,
                            fatherName:tree[i].omsCourseType.name,
                            fatherId:tree[i].omsCourseList[j].courseTypeId,
                            father:node
                        };
                        node.items.push(items);
                    }
                    root.push(node);
                }
                return root;
            }


            /***********************************util**************************************************************************************/

            function ifEditShow(){
                if (oThis.showType == 0) {//1 表示修改  2 表示添加  0 表示显示
                    $('.js-edit-bottom').hide();
                }
                if (oThis.showType==1 || oThis.showType==2) {//1 表示修改  2 表示添加  0 表示显示
                    oThis.isEdit = true;//頁面是否可以編輯
                    $('.js-edit-bottom').show();
                }
            }
            function searchCoursesView(type){//type=1 基本  当前课程多选只用一个 所以类型也就只有一个
                oThis.selectAddressType = type;
                var title  = '查询课程';

                //oThis.currentCoupon.couponCoursesList =[];//被选优惠券课程
                $scope.currentCoupon.couponCoursesList = oThis.currentCoupon.couponCoursesList;
                $scope.modalSearchCourses=$modal({title:title,scope:$scope, templateUrl: 'partials/o2o/coupon/modal.searchCourses.html', show: true });
            }
            function setDetailCouponData(data){
                if(check_null(data.omsCoupon)){
                    oThis.currentCoupon = data.omsCoupon;//将前面的代码完全重新覆盖了一遍  注意前后两次请求的参数命名的一致性
                }
                oThis.currentCoupon.couponCoursesList = data.omsCouponCourseList;
                oThis.currentCoupon.couponProvinceList = data.omsCouponProvinceList;

              /*  oThis.currentCoupon.validitystarttime = new Date(oThis.currentCoupon.validitystarttime);
                oThis.currentCoupon.validityendtime = new Date(oThis.currentCoupon.validityendtime);*/

                oThis.showSelectedProvince();

                var courseLists = [];
                //因为接口传来的数据不是 name 而是 courseName  进行转义
                if(check_null(data.omsCouponCourseList) && data.omsCouponCourseList.length>0){
                    var list = data.omsCouponCourseList;

                    for(var i= 0;i<list.length;i++){
                        var node = {
                            id:list[i].couponId,
                            name:list[i].courseName
                        };
                        courseLists.push(node);
                    }
                }
                oThis.view._setShowCourses(courseLists);
                //oThis.view.courseType =

            }
            function showSelectedProvince(){
                var lists = oThis.currentCoupon.couponProvinceList;
                for(var i=0;i<lists.length;i++){
                    $scope.selected.push(lists[i].provinceCode);
                }
            }
           /* function showConditionText(){
                    if(oThis.condition ==1){
                       oThis.fenXiangText = true;
                    }
            }*/
            function _setShowCourses(nodes){
                oThis.view.showCourses = '';
                for(var i=0;i<nodes.length;i++){
                    oThis.view.showCourses += nodes[i].name +';';
                }
            }

            /***********************************地区选择 start**************************************************************************************/
            $scope.selected = [];//最后选中的都会放在这个参数中
            var updateSelected = function (action, id) {
                if (action == 'add' & $scope.selected.indexOf(id) == -1) {
                    $scope.selected.push(id);
                    $scope.currentCoupon.omsCouponProvinceList = $scope.selected;
                }
                if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
                    $scope.selected.splice($scope.selected.indexOf(id), 1);
                }
            };

            $scope.updateSelection = function ($event, id) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id);
            };

            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < oThis.provinceList.length; i++) {
                    var entity = oThis.provinceList[i];
                    updateSelected(action, entity.provinceCode);
                }
            };

            $scope.getSelectedClass = function (entity) {
                return $scope.isSelected(entity.id) ? 'selected' : '';
            };

            $scope.isSelected = function (id) {
                return $scope.selected.indexOf(id) >= 0;
                //return true;
            };

            //something extra I couldn't resist adding :)
            $scope.isSelectedAll = function () {
                return $scope.selected.length === oThis.provinceList.length;
            };
            /***********************************地区选择 end**************************************************************************************/

        }]);
ywsApp.controller('SearchCoursesController',
    ['$scope', '$modal', '$rootScope', 'SweetAlert','O2oCouponManagementService','TreeDataFactory',
        function($scope, $modal, $rootScope, SweetAlert,O2oCouponManagementService,TreeDataFactory) {
            var oThis = this;
            oThis.showType = $scope.showType;//1 表示修改  2 表示添加  0 表示显示
            oThis.isLoadingSearchCourses = true;
            oThis.courseTree = [];
            oThis.show = {
                selected:[],
                selectedNode:[]
            };
            oThis.selectedCourse = [];
            oThis.view = {
                isSubmit:false
            };

            (function init(){
                oThis.view.isSubmit = (oThis.showType==2);
                getCoursesTree();
                oThis.currentCoupon ={//这样使 currentCoupon 的基础信息都干掉了 只有couponCoursesList
                    couponCoursesList :$scope.currentCoupon.couponCoursesList
                };
                oThis.currentCoupon = $scope.currentCoupon;
                _setSelectedCourse();

            })();

            /***********************************ctrl**************************************************************************************/
            oThis.getCoursesList = getCoursesTree;
            oThis.submitController = submitController;

            /***********************************util**************************************************************************************/
            /**
             * 格式化course tree
             */
            oThis._FATCoursesTree = _FATCoursesTree;
            oThis._setSelectedCourse = _setSelectedCourse;
            oThis._ctrlShow = _ctrlShow;


            /***********************************ctrl**************************************************************************************/
            function getCoursesTree(){
                O2oCouponManagementService.searchCourseTree().then(function(result) {
                    oThis.courseTree = oThis._FATCoursesTree(result.data);
                    oThis.isLoadingSearchCourses = false;
                    oThis._ctrlShow();
                    return oThis.courseTree;
                });
            }
            function submitController(){
                var selected =oThis.show.selected;
                var selectedNode = oThis.show.selectedNode;
                //oThis.show = null;
                $scope.setSelectedAndNode(selected,selectedNode);

                $scope.modalSearchCourses.hide();
            }

            /***********************************util**************************************************************************************/
            function _FATCoursesTree(tree){
                var root = [];
                for(var i=0;i<tree.length;i++){
                    var node = {
                        id:tree[i].omsCourseType.id,
                        name:tree[i].omsCourseType.name,
                        check:false,
                        items:[]
                    };
                    //node.courses;
                    for(var j=0;j<tree[i].omsCourseList.length;j++){
                        var items = {
                            id:tree[i].omsCourseList[j].id,
                            name:tree[i].omsCourseList[j].name,
                            check:false,
                            fatherName:tree[i].omsCourseType.name,
                            fatherId:tree[i].omsCourseList[j].courseTypeId,
                            father:node
                        };
                        node.items.push(items);
                    }
                    root.push(node);
                }
                return root;
            }
            function _setSelectedCourse(){
                oThis.selectedCourse = [];//清空
                $scope.selectedCourse = [];
                var list = oThis.currentCoupon.couponCoursesList;
                if(check_null(list) && list.length>0){
                    for(var i=0;i<list.length;i++){
                        oThis.selectedCourse.push(list[i].courseId);
                        $scope.selectedCourse.push(list[i].courseId);
                    }
                }
                return oThis.selectedCourse;
            }
            /**
             * 控制显示
             * @private
             */
            function _ctrlShow(){
                oThis.show =new TreeDataFactory(oThis.courseTree,oThis.selectedCourse);
                $scope.selectedCourse = oThis.show.selected;//$scope返回被选中课程
            }


        }])
;