'use strict';

/**
 * The CoursePlan management controller.
 *
 * @author
 * @version 1.0
 */
angular.module('ywsApp').controller('CreatePlanCtrl', ['$scope','$routeParams','$location', 'CreatePlanService', '$modal', '$rootScope', '$timeout','SweetAlert',
  function($scope, $routeParams,$location,CreatePlanService, $modal, $rootScope,$timeout, SweetAlert) {
      $scope.config = {
          id:''
          ,type:''
          ,ONE_DAY_TIMESTAMP:1000*60*60*24//一天那时间戳
          ,default_plan_time:0
          ,TIME_OFFSET:(new Date().getTimezoneOffset())*60*1000 //本时间与格林威治标准时间 (GMT) 的毫秒差
      };
      $scope.show = {
          isWeekNumber: false
          , isPlanTime: false
          , planLists: []  //本次排课列表
          , planListsPage: []  //排课列表--当前分页
          , judgeType: judgeType
          , getEndTime: getEndTime//自动生成结束时间
          , submitPlan: submitPlan//提交排课
          , deletePlan: function(row){
              var list = [];
              list.push(row);
              $scope.deletePlans(list,0);
          }
          , deletePlans:function(){
              $scope.deletePlans( $scope.show.planLists,1);
          }
      };
      $scope.WEEKS = [
          {id:1,name:'星期一'}, {id:2,name:'星期二'}, {id:3,name:'星期三'}, {id:4,name:'星期四'}, {id:5,name:'星期五'},{id:6,name:'星期六'},{id:7,name:'星期日'},
      ];
      $scope. TIME_SIZE = [
          {id:1,name:'0.5小时'},{id:2,name:'1小时'},{id:3,name:'1.5小时'},{id:4,name:'2小时'},{id:5,name:'2.5小时'},{id:6,name:'3小时'},
      ];


      $scope.getPlanLists = getPlanLists;//得到当前排课列表
      $scope.addPlans = addPlans;
      $scope.deletePlans = deletePlans;


      function getPlanLists(tableState){
          $scope.planListsTableState = tableState;
          var pagination = tableState.pagination;
          var number = pagination.number || 5;  // Number of entries showed per page.

          if($scope.show.planListsPage && $scope.show.planListsPage.length ==0){
              pagination.start = pagination.start-number;
              if(pagination.start <0){
                  pagination.start = 0;
              }
          }
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.


          var list = angular.copy($scope.show.planLists);
          $scope.show.planListsPage = list.slice(start,start+5);
          tableState.pagination.numberOfPages = Math.ceil(list.length/number)||1;//set the number of pages so the pagination can update
      }
      function addPlans(requestDate,callback){
          var obj = angular.copy(requestDate);
          CreatePlanService.addPlans(obj).then(function (result) {
              var response = result.data;
              if(response.status == 'SUCCESS'){
                  for(var i=0;i<requestDate.coursetime.length;i++){
                      $scope.show.planLists.push(requestDate.coursetime[i]);
                  }
                  $scope.getPlanLists($scope.planListsTableState);//刷新右边列表
                  callback();
              }else if(response.status == 'FAILURE'){//抛出冲突
                  SweetAlert.swal(result.data.data);
              }
          },function(result){
              SweetAlert.swal('失败：'+ result);
          });
      }
      function deletePlans(list,type){//0 表示删除一个  1全部删除
          SweetAlert.swal({
                  title: "确定要删除吗？",
                  type: "warning",
                  showCancelButton: true,
                  /* confirmButtonColor: '#fe9900',*/
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  closeOnConfirm: true
              }, function(confirm) {
                  if (confirm) {

                      var obj = angular.copy(list);
                      var deleteData = angular.copy($scope.requestDate);
                      deleteData.coursetime = obj;

                      CreatePlanService.deletePlans(deleteData).then(function (result) {
                          var response = result.data;
                          if(response.status == 'SUCCESS'){
                              SweetAlert.swal('成功');

                              if(type == 1){//表批量
                                  $scope.coursePlanParams.plan_available_num =$scope.config.default_plan_time;
                              }else if(type == 0){//一个
                                  var time_size = list[0].end - list[0].start;
                                  var num = time_size/(1000*60*60);
                                  $scope.coursePlanParams.plan_available_num+=num;
                              }
                              _deletePlans(list);
                              //处理分页参数：如最后一页为1个，删除一个，处理
                              $scope.getPlanLists($scope.planListsTableState);


                          }else if(response.status == 'FAILURE'){//抛出冲突
                              SweetAlert.swal(result.data.data);
                              /*_deletePlans(list);*/
                          }
                      },function(result){
                          SweetAlert.swal('失败：'+ result);
                      });

                  }
              }
          );

      }

      /**
       * 删除 $scope.show.planLists 中
       * @param list
       * @private
       */
      function _deletePlans(list){
          var planLists=  angular.copy($scope.show.planLists);
          var planListsPage=  angular.copy($scope.show.planListsPage);
          for(var i=0;i<list.length;i++){
              var start = list[i].start;

              //TODO  因为当前 删除只有 全部删除和单个删除，所以有以下临时的写法。大晚上 脑袋不转，这个是偷懒的做法
              if(list.length>1){
                  $scope.show.planLists = [];
                  $scope.show.planListsPage = [];
              }else{
                  //删除当前排课列表
                  for(var j=0;j<planLists.length;j++){
                      if(planLists[j].start == start){
                          $scope.show.planLists.splice(j,1);
                      }
                  }
                  //删除当前排课分页列表
                  for(var j=0;j<planListsPage.length;j++){
                      if(planListsPage[j].start == start){
                          $scope.show.planListsPage.splice(j,1);
                      }
                  }
              }

          }
      }

      /******************************************show  start***************************************************************/
      /**
       * 判断排课类型
       */
      function judgeType(){
            if($scope.select.type == 2){
                $scope.show.isWeekNumber = true;
                $scope.show.isPlanTime = false;
            }else if($scope.select.type == 3){
                $scope.show.isWeekNumber = false;
                $scope.show.isPlanTime = true;
            }else{
                $scope.show.isWeekNumber = false;
                $scope.show.isPlanTime = false;
            }
      }
      /**
       * 得到结束时间
       * 并得到selected 开始和结束时间戳
       */
      function getEndTime(){
          if($scope.select.week &&$scope.select.time && $scope.select.timeSize){
              //$timeout(function(){
                  var timestampStart = _getTimestampByWeekAndTime($scope.select.week,$scope.select.time);
                  $scope.select.timestampBaseStart = timestampStart;
                  /*$scope.select.time = new Date(timestampStart).Format("yyyy-MM-dd hh:mm");*/
                  var timestampEnd =  timestampStart +(($scope.select.timeSize)*60*30*1000);
                  $scope.select.timestampBaseEnd = timestampEnd;
                  $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
              //},250);

          }
      }
      function submitPlan(){
          if(_ifTime(0)){//判断是否有课时
              $scope.requestDate.coursetime = [];//初始化排课

              //通过start 时间 得到结束时间和页面显示时间
              var timestampEnd =  $scope.select.timestampBaseStart +(($scope.select.timeSize)*60*30*1000);
              $scope.select.timestampBaseEnd = timestampEnd;
              $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
             /* console.log(new Date(timestampEnd));*/

              if(_ifNotOneDay($scope.select.timestampBaseStart,$scope.select.timestampBaseEnd)){//判断时间是否跨天
                  SweetAlert.swal('一节课不能隔天');
                  return false;
              }
              if(_ifNotOut23($scope.select.timestampBaseStart,$scope.select.timestampBaseEnd)){//判断时间是否跨天
                  SweetAlert.swal('排课时间不能超过23点');
                  return false;
              }

              if($scope.select.type == 0){//本周
                  submitPlan0();
              }else if($scope.select.type == 1){//下周
                  submitPlan1();
              }else if($scope.select.type == 2){//批量
                  submitPlan2();
              }
          }

      }
          function submitPlan0(){
              var size = $scope.select.timeSize *0.5;
              if(_ifTime(size)) {//判断是否有课时
                 /* if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
                      SweetAlert.swal('时间已经过去了，不容许排课');
                      return false;
                  }*/
                  if(_ifThisWeek($scope.select.week)){//判断是否在当前周
                      var plans = [];
                      plans.push(_setOnePlan($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd));

                      _setCourseRequestData(plans);
                      $scope.addPlans($scope.requestDate,function(){
                          $scope.coursePlanParams.plan_available_num -= size;
                      });


                  }
              }
          }
          function submitPlan1(){
              var size = $scope.select.timeSize *0.5;
              if(_ifTime(size)) {//判断是否有课时
                  var plans = [];
                  if(!ifNextWeek($scope.select.timestampBaseStart)){//如果不是在start 时间在本周，那么直接加7天时间戳
                      plans.push(_setOnePlan($scope.select.timestampBaseStart + $scope.config.ONE_DAY_TIMESTAMP*7,
                                            $scope.select.timestampBaseEnd + $scope.config.ONE_DAY_TIMESTAMP*7));
                  }else{
                      plans.push(_setOnePlan($scope.select.timestampBaseStart, $scope.select.timestampBaseEnd));
                  }
                  _setCourseRequestData(plans);
                  $scope.addPlans($scope.requestDate,function(){
                      $scope.coursePlanParams.plan_available_num -= size;
                  });
              }

          }
          function submitPlan2(){
              if(_ifTime(0.5)) {//判断是否有课时 最少课时为0.5 表 大于0课时 ，可以排课
                  var length =$scope.select.weekNumber || 1000;
                  var start = $scope.select.timestampBaseStart;
                  var end = $scope.select.timestampBaseEnd;

                  var pStart = $scope.select.pTimeStart;
                  var pEnd = $scope.select.pTimeEnd;

                  var pStartTimestamp = new Date(pStart).getTime();
                  var pEndTimestamp = new Date(pEnd).getTime();

                  var plans = [];

                  var _start, _end, _planNumber=1;
                  for(var i=0;i<length;i++){
                      _start = start+$scope.config.ONE_DAY_TIMESTAMP*7*i;
                      _end = end+$scope.config.ONE_DAY_TIMESTAMP*7*i;
                      if(_end<=pEndTimestamp+$scope.config.TIME_OFFSET+$scope.config.ONE_DAY_TIMESTAMP){
                          if(!_ifTime(_planNumber *0.5*$scope.select.timeSize)){
                              plans = [];
                              return false;
                          }
                          pStartTimestamp = pStartTimestamp+$scope.config.TIME_OFFSET;//修正时区
                          if(pStartTimestamp<=_start && _start>new Date().getTime()){
                              plans.push(_setOnePlan(_start,_end));
                              _planNumber +=1;
                          }else{
                              length+=1;
                          }

                      }else{
                          break;
                      }
                  }

                    if(plans.length>0){
                        _setCourseRequestData(plans);
                        $scope.addPlans($scope.requestDate,function(){
                            $scope.coursePlanParams.plan_available_num -= (_planNumber-1) *0.5*$scope.select.timeSize;
                            SweetAlert.swal('本次排课为'+plans.length+'次');
                        });
                    }else{
                        SweetAlert.swal('本次排课为'+plans.length+'次');
                    }


              }
          }


      /******************************************show  end***************************************************************/
      /**
       * 通过星期得到具体日期的零点 时间戳
       * @param week
       * @private
       */
      function _timestampByWeek(week){
          if(week ==7){//因为前台设星期天为7
              week = 0;
          }
          var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
          var cha = week-day;
          if(cha<0){//如果 今天是星期四，而要获取星期二的，直接给整个数据加7天
              cha += 7;
          }

          var today = new Date();
          today.setHours(0);
          today.setMinutes(0);
          today.setSeconds(0);
          today.setMilliseconds(0);

          var oneday = 1000 * 60 * 60 * 24;
          return today.getTime() +oneday*cha;
      }

      /**
       * 通过实践得到毫秒数 eg:21:30
       * @param time
       * @returns {number}
       * @private
       */
      function _timestampByTime(time){
          if(time){
              var _arr = time.split(':');
              var hour = 1000*60*60 * _arr[0];
              var minute = 1000*60 * _arr[1];
              return hour + minute;
          }
      }

      /**
       * 通过周 和时间字符串 得到 时间戳
       * @param week eg:"1"
       * @param time eg:"21:30"
       * @private
       */
      function _getTimestampByWeekAndTime(week,time){
          var date0 = _timestampByWeek(week);
          var t = _timestampByTime(time);
          return date0+t;
      }
          /**
           * 初始化 基本与后台ajax请求参数
           * 将参数存放在 $scope.requestDate 中
           */
          function _setBaseRequestData(coursePlanParams){
              var obj = {
                  "type":coursePlanParams.type,
                  "teacherName":coursePlanParams.teacherName,
                  "subjectId":coursePlanParams.subjectID,
                  "subjectName":coursePlanParams.subjectName,
                  "studentName":coursePlanParams.studentName,
                  "crmCustomerGroupId":coursePlanParams.groupID,
                  "classTime":coursePlanParams.classTime,
                  "crmOrderIds":coursePlanParams.ordcourseID,
                 /* "coursetime":_events_add,*/
                  "crmStudentId":coursePlanParams.studentID,
                  "userId":coursePlanParams.teacherID,
                  "schoolId":coursePlanParams.schoolID,
                 /* "residuenumber":planCourses*/
              };
              $scope.requestDate = obj;
          }
          /**
           * 设置排课 具体排课
           * @param list 数组
           * @private
           */
          function _setCourseRequestData(list){
              $scope.requestDate.coursetime = list;
          }
          /**
           * 设置一个排课
           * @param start
           * @param end
           * @private
           */
          function _setOnePlan(start,end){
              var plan = {
                  start: start,
                  end: end
              };
              return plan;
          }

      /**
       * 减去num 后是否还有课时
       * @param num
       * @private
       */
          function _ifTime(num){
          //TODO
        /*  if(!check_null($scope.coursePlanParams) || !check_null($scope.coursePlanParams.plan_available_num)){
              $scope.coursePlanParams ={
                  plan_available_num:0
              }
          }*/
            if($scope.coursePlanParams && ($scope.coursePlanParams.plan_available_num-num)<0 ){
                SweetAlert.swal('您没有课时了');
                return false;
            }else{
                return true;
            }
          /*return true;*/
          }
          function _ifThisWeek(num){
              var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
              if(day == 0){
                  day = 7;
              }
              var cha = num-day;
              if(cha<0){
                  SweetAlert.swal('这周已经没有'+ $scope.WEEKS[num-1].name);
                  return false;
              }
              return true;
          }

      /**
       * 判断日期是否是在下周之后
       * @param start  时间戳
       * @returns {boolean}
       */
          function ifNextWeek(start){
              var today = new Date();
              today.setHours(0);
              today.setMinutes(0);
              today.setSeconds(0);
              today.setMilliseconds(0);

              var oneDay = 1000 * 60 * 60 * 24;

              var day = new Date().getDay();//获取当前星期X(0-6,0代表星期天)
              if(day == 0){
                  day = 7;
              }
              var nextWeekStart = today.getTime()+oneDay*(7-day+1);
              if(nextWeekStart<start){
                  return true;
              }
                  return false;

          }

      /**
       * 判断时间是否夸天
       * @param start  时间戳
       * @param end 时间戳
       * @returns {boolean}
       * @private
       */
      function _ifNotOneDay(start,end){
          var st = new Date(start).getHours();
          var en = new Date(end).getHours();
          var end_m = new Date(end).getMinutes();
          var end_s = new Date(end).getSeconds();
          if(st > en){//开始销售数大于结束时间小时数
              if(end_m==0 &&  end_s==0 && en==0){
                  return false;
              }else{
                  return true;
              }

          }
        /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
              return false;
          }*/
          return false;
      }

      /**
       * 判断是否超过23点
       * @param start
       * @param end
       * @returns {boolean}
       * @private
       */
      function _ifNotOut23(start,end){
          var st = new Date(start).getHours();
          var en = new Date(end).getHours();
          var end_m = new Date(end).getMinutes();
          var end_s = new Date(end).getSeconds();
          if(en>=23 ||(en==0&&end_m==0&&end_s==0)){
              return true;
          }
          /*  if(en>23 ||(en==0&&end_m==0&&end_s==0)){
           return false;
           }*/
          return false;
      }


      (function init($scope){
          if(coursePlanParams){

          }
          $scope.config.default_plan_time = coursePlanParams.plan_available_num;
          if(check_null($routeParams.id)){
              $scope.config.id = $routeParams.id
          }
          if(check_null($routeParams.type)){
              $scope.config.type = $routeParams.type;
          }
          $scope.coursePlanParams=coursePlanParams;//上一个页面传来的参数

          $scope.select = {};  $scope.select.type = 0;//初始化排课方式

          _setBaseRequestData(coursePlanParams);//初始化 基本与后台ajax请求参数

      })($scope);

  }
]);
