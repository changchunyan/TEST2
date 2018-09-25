'use strict';

/**
 * 用于少年派托管项目托管记录的 controller。对应 modal.snpCourseRecord.html
 */
 angular.module('ywsApp').controller('SNPCourseRecordController', ['$scope', '$location', 'CoursePlanService', '$modal', '$rootScope', 'SweetAlert','UserPrizeService',
     'CustomerStudentGroupService', 'LeadsStudentService', 'CustomerStudentCourseService', 'CommonService', 'OrderService',
     '$routeParams', 'AuthenticationService', 'ClassStudentAttendenceService','$mtModal','CustomerStudentService','ClassManagementService',
     function ($scope, $location, CoursePlanService, $modal, $rootScope, SweetAlert,UserPrizeService, CustomerStudentGroupService, LeadsStudentService, CustomerStudentCourseService,
               CommonService, OrderService, $routeParams, AuthenticationService, ClassStudentAttendenceService,$mtModal,CustomerStudentService,ClassManagementService) {

        $scope.filter = {};
        $scope.getClassList = getClassList;
        $scope.selectClass = selectClass;
        $scope.selectedClass = {};
        $scope.showClassSelector = false;
        $scope.recordDate = new Date().Format("yyyy-MM-dd");
        $scope.getClassStudents = getClassStudents;

        $scope.markArrival = markArrival;
        $scope.markHomeworkStart = markHomeworkStart;
        $scope.markHomeworkEnd = markHomeworkEnd;
        $scope.markLeave = markLeave;

        $scope.allAttendence = allAttendence;
        $scope.allHomeworkStarted = allHomeworkStarted;
        $scope.allHomeworkEnded = allHomeworkEnded;
        $scope.allLeave = allLeave;

        $scope.selectAllArrival = selectAllArrival;
        $scope.selectAllHomeworkStarted = selectAllHomeworkStarted;
        $scope.selectAllHomeworkEnded = selectAllHomeworkEnded;
        $scope.selectAllLeave = selectAllLeave;

        $scope.countArrival = countArrival;
        $scope.countHomeworkStarted = countHomeworkStarted;
        $scope.countHomeworkEnded = countHomeworkEnded;
        $scope.countLeave = countLeave;

        $scope.submitRecord = submitRecord;
        $scope.showAddScoreView = showAddScoreView;
        $scope.showSubScoreView = showSubScoreView;

        function getClassStudentsByIdAndDate(classId, date) {
          ClassStudentAttendenceService.getSNPAttendenceList(classId, date).then(function (response) {
              if (response.status == "FAILURE") {
                  SweetAlert.swal("获取学员失败，请重试", "error");
                  return false;
              } else {
                  $scope.classStudents = response.data.list;
                  $scope.classStudentsTotal = response.data.total;

                   // 记录原始记录列表，用于对比变化决定是否更新时间相关的属性。之所以这么做，由几方面因素共同构成：
                   // 1. resultList 作为 model 将会直接绑定页面元素
                   // 2. 我们并不直接记录时间，只记录与否。如到校与否，到校时间以提交整个班级的时间为准，而非点击“到校”按钮的时间。
                   //
                   // 考虑这个例子：
                   // 学生之前已经到校，现在操作人选择了“开始作业”，然后点击“提交”。在提交时，统一的逻辑会看学生是否到校，如果到校则以当前时间为到校时间。
                   // 如果不考虑之前的状态，那么学生的到校时间将会被记录为最后一次任意操作的时间。这是不对的。
                   // 所以提交逻辑应该对比之前的状态与现在状态，来决定是否更新时间相关的属性。

                   $scope.originalClassStudents = angular.copy($scope.classStudents);
                   for (var i = 0; i < $scope.classStudents.length; i++) {
                     var student = $scope.classStudents[i];
                     student.homeworkStarted = !!student.homeworkStartTime;
                     student.homeworkEnded = !!student.homeworkEndTime;
                     student.leave = !!student.leaveTime;
                   }
              }
          });
        }

        // 这两个参数由 snp-course-plan-controller 传入，用于在跳出框时读取默认的班级和日期的数据
        if ($scope.snpClassId && $scope.snpDate) {
          $scope.filter.name = $scope.snpClassName;
          $scope.recordDate = new Date($scope.snpDate).Format('yyyy-MM-dd');
          $scope.getClassList(function(list) {
            for (var i = 0; i < list.length; i++) {
              if (list[i].id == $scope.snpClassId) {
                $scope.selectedClass = list[i];
                break;
              }
            }
            $scope.showClassSelector = false;
            getClassStudentsByIdAndDate($scope.snpClassId, new Date($scope.snpDate).Format('yyyy-MM-dd'));
          });
        }

        /**
         * 根据用户输入的搜索关键词获取班级列表。
         */
        function getClassList(callback) {
          $scope.isLoading = true;

          $scope.filter.start = 0;
          $scope.filter.size = 1000;
          $scope.filter.schoolId = AuthenticationService.currentUser().school_id;
          $scope.filter.classCategory = 2;
          $scope.filter.status = 0;

          if (!$scope.filter.name || $scope.filter.name.length == 0) {
            return;
          }

          ClassManagementService.getClassesByFilter($scope.filter).then(function(response) {
            $scope.isLoading = false;
            if (response.status == "FAILURE") {
               SweetAlert.swal(response.data, "请重试", "error");
            } else {
               $scope.resultList = response.data.list;
               $scope.showClassSelector = true;
               if (callback) {
                 callback(response.data.list);
               }
            }
          });
       }

       /**
        * 响应用户点击班级下拉框中的某个班级的函数。
        * @param index 用户点击的班级在列表中的位置，0-based
        */
       function selectClass(index) {
         $scope.showClassSelector = false;
         $scope.selectedClass = $scope.resultList[index];
         $scope.getClassStudents();
       }

       /**
        * 获取班级内学生列表及到校情况。
        * 由于一个班级的学生不会太多，这里就暂时不分页了。
        */
       function getClassStudents() {
           if (!$scope.selectedClass || !$scope.selectedClass.id || !$scope.recordDate) {
             return;
           }
           getClassStudentsByIdAndDate($scope.selectedClass.id, $scope.recordDate);
       }

       function submitRecord() {
         var list = [];
         for (var i = 0; i < $scope.classStudents.length; i++) {
           var currentRecord = $scope.classStudents[i];
           var originalRecord = $scope.originalClassStudents[i];
           if (currentRecord.isAttendence && !originalRecord.isAttendence) {
             currentRecord.arrivalTime = new Date();
           } else if (!currentRecord.isAttendence && originalRecord.isAttendence) {
             currentRecord.arrivalTime = null;
           }
           if (currentRecord.homeworkStarted && !originalRecord.homeworkStartTime) {
             currentRecord.homeworkStartTime = new Date();
           } else if (!currentRecord.homeworkStarted && originalRecord.homeworkStartTime) {
             currentRecord.homeworkStartTime = null;
           }
           if (currentRecord.homeworkEnded && !originalRecord.homeworkEndTime) {
             currentRecord.homeworkEndTime = new Date();
           } else if (!currentRecord.homeworkEnded && originalRecord.homeworkEndTime) {
             currentRecord.homeworkEndTime = null;
           }
           if (currentRecord.leave && !originalRecord.leaveTime) {
             currentRecord.leaveTime = new Date();
           } else if (!currentRecord.leave && originalRecord.leaveTime) {
             currentRecord.leaveTime = null;
           }
           list.push(currentRecord);
         }
         ClassStudentAttendenceService.updateSNPAttendenceList({list:list}).then(function(response) {
           if (response.status == "FAILURE") {
               SweetAlert.swal("记录考勤失败，请重试", "error");
               return false;
           } else {
             $scope.$emit('snpClassStudentAttendenceUpdated');
           }
         });
       }

       /**
        * 响应用户点击某个学生的到校按钮的函数。
        * 如果学生之前是到校状态，那么除缺勤原因外的其他选项都被清空。
        * 如果学生之前是未到状态，并且已经选择了缺勤原因，那么缺勤原因将被清空。
        *
        * @param student student
        */
       function markArrival(student) {
         student.isAttendence = !student.isAttendence;
         if (!student.isAttendence) {
           student.homeworkStarted = false;
           student.homeworkEnded = false;
           student.leave = false;
         } else {
           student.reason = null;
         }
       }

       /**
        * 响应用户点击全部到校按钮的函数。
        * 如果之前全部都已到校，则点击全部到校时，将会把所有学生的到校按钮全部清空。
        * 如果之前有至少一个学生未到校，则点击全部到校时，将会把所有学生的到校按钮全部选中。
        * 其他选项的状态将依据 markArrival 的逻辑操作。
        */
       function selectAllArrival() {
         if (!$scope.classStudents) {
           return;
         }
         var all = $scope.allAttendence();
         for (var i = 0; i < $scope.classStudents.length; i++) {
           var student = $scope.classStudents[i];
           student.isAttendence = !all;
           if (!student.isAttendence) {
             student.homeworkStarted = false;
             student.homeworkEnded = false;
             student.leave = false;
           } else {
             student.reason = null;
           }
         }
       }

       /**
        * 响应用户点击某个学生的开始作业按钮的函数。
        * 如果学生之前是开始状态，那么开始按钮将被清空，完成按钮将被清空并禁用。
        * 如果学生之前是未开始状态，那么开始按钮将被选中，完成按钮将被启用。
        *
        * @param student student
        */
       function markHomeworkStart(student) {
         if (!student.isAttendence) {
           return;
         }
         student.homeworkStarted = !student.homeworkStarted;
         if (!student.homeworkStarted) {
           student.homeworkEnded = false;
         }
       }

       /**
        * 响应用户点击全部开始作业按钮的函数。
        */
       function selectAllHomeworkStarted() {
         if (!$scope.classStudents) {
           return;
         }
         var all = $scope.allHomeworkStarted();
         for (var i = 0; i < $scope.classStudents.length; i++) {
           var student = $scope.classStudents[i];
           student.homeworkStarted = !all;
           if (!student.homeworkStarted) {
             student.homeworkEnded = false;
           }
         }
       }

       /**
        * 响应用户点击某个学生的结束作业按钮的函数。
        *
        * @param student student
        */
       function markHomeworkEnd(student) {
         if (!student.isAttendence || !student.homeworkStarted) {
           return;
         }
         student.homeworkEnded = !student.homeworkEnded;
       }

       /**
        * 响应用户点击全部完成作业按钮的函数。
        */
       function selectAllHomeworkEnded() {
         if (!$scope.classStudents) {
           return;
         }
         var all = $scope.allHomeworkEnded();
         for (var i = 0; i < $scope.classStudents.length; i++) {
           $scope.classStudents[i].homeworkEnded = !all;
         }
       }

       /**
        * 响应用户点击某个学生的离校按钮的函数。
        *
        * @param student student
        */
       function markLeave(student) {
         if (!student.isAttendence) {
           return;
         }
         student.leave = !student.leave;
       }

       /**
        * 响应用户点击全部离校按钮的函数。
        */
       function selectAllLeave() {
         if (!$scope.classStudents) {
           return;
         }
         var all = $scope.allLeave();
         for (var i = 0; i < $scope.classStudents.length; i++) {
           $scope.classStudents[i].leave = !all;
         }
       }

       /**
        * 判断是否全部到校。
        */
       function allAttendence() {
         if (!$scope.classStudents) {
           return false;
         }
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if (!$scope.classStudents[i].isAttendence) {
             return false;
           }
         }
         return true;
       }

       /**
        * 判断是否全部开始作业。
        */
       function allHomeworkStarted() {
         if (!$scope.classStudents) {
           return false;
         }
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if (!$scope.classStudents[i].homeworkStarted) {
             return false;
           }
         }
         return true;
       }

       /**
        * 判断是否全部完成作业。
        */
       function allHomeworkEnded() {
         if (!$scope.classStudents) {
           return false;
         }
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if (!$scope.classStudents[i].homeworkEnded) {
             return false;
           }
         }
         return true;
       }

       /**
        * 判断是否全部离校。
        */
       function allLeave() {
         if (!$scope.classStudents) {
           return false;
         }
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if (!$scope.classStudents[i].leave) {
             return false;
           }
         }
         return true;
       }

       function countArrival() {
         if (!$scope.classStudents) {
           return 0;
         }
         var count = 0;
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if ($scope.classStudents[i].isAttendence) {
             count++;
           }
         }
         return count;
       }

       function countHomeworkStarted() {
         if (!$scope.classStudents) {
           return 0;
         }
         var count = 0;
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if ($scope.classStudents[i].homeworkStarted) {
             count++;
           }
         }
         return count;
       }

       function countHomeworkEnded() {
         if (!$scope.classStudents) {
           return 0;
         }
         var count = 0;
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if ($scope.classStudents[i].homeworkEnded) {
             count++;
           }
         }
         return count;
       }

       function countLeave() {
         if (!$scope.classStudents) {
           return 0;
         }
         var count = 0;
         for (var i = 0; i < $scope.classStudents.length; i++) {
           if ($scope.classStudents[i].leave) {
             count++;
           }
         }
         return count;
       }

       function showAddScoreView(student) {
         if (!student.isAttendence) {
           return;
         }
         $scope.scoreType = 'add';
         $scope.scoreStudent = student;
         $scope.snpRecordScoreModal = $modal({
           scope: $scope,
           templateUrl: 'partials/sos/customer/modal.snpCourseRecordScore.html',
           show: true,
           backdrop: 'static'
         });
       }

       function showSubScoreView(student) {
         if (!student.isAttendence) {
           return;
         }
         $scope.scoreType = 'sub';
         if (!student.isAttendence) {
           return;
         }
         $scope.scoreStudent = student;
         $scope.snpRecordScoreModal = $modal({
           scope: $scope,
           templateUrl: 'partials/sos/customer/modal.snpCourseRecordScore.html',
           show: true,
           backdrop: 'static'
         });
       }


       function getScoreGroups() {
         ClassStudentAttendenceService.getSNPScoreGroups().then(function(response) {
           $scope.scoreGroups = response.data;
         });
       }

       getScoreGroups();

       $scope.$on('snpStudentScoreConfirmed', function() {
         console.log($scope.scoreStudent.addScores);
         $scope.snpRecordScoreModal.hide();
       });

    }
  ]
);
