/**
 * 学生客户排课信息
 * @author fanlin@youwinedu.com
 * @version 1.0
 */
angular.module("ywsApp").controller('CustomerStudentCourseController', ['$scope', '$location','CustomerStudentService','CustomerStudentCourseService','CreatePlanService','$modal', '$rootScope', 'SweetAlert','$routeParams','$timeout',
	function($scope, $location,CustomerStudentService,CustomerStudentCourseService,CreatePlanService,$modal, $rootScope, SweetAlert,$routeParams,$timeout) {

		// 方法声明
		$scope.forwardCoursePlan = forwardCoursePlan;
		$scope.getCRMCourseBySomething = getCRMCourseBySomething;
		$scope.getCSShooleTeacherByFilters = getCSShooleTeacherByFilters;

		// 显示选择时间对话框、创建排课的对话框
		$scope.showTimeDialog = showTimeDialog;
		$scope.showPlanDialog = showPlanDialog;
		$scope.forwardCoursePlanNew = forwardCoursePlanNew;
		$scope.judgePlanTime = judgePlanTime;
		$scope.cancle = cancle;

		// 变量声明
		var type = $routeParams.type;
		$scope.type = $routeParams.type;
		$scope.formData = {};
		$scope.teacherState = {};
		$scope.courseState = {};

		// 选择时间段的教师排课
		$scope.select = {};
		$scope.show = {
				getEndTime: getEndTime//自动生成结束时间
		      , submitPlan: submitPlan//提交排课
		};
		$scope. TIME_SIZE = [
		    {id:1,name:'0.5小时'},{id:2,name:'1小时'},{id:3,name:'1.5小时'},{id:4,name:'2小时'},{id:5,name:'2.5小时'},{id:6,name:'3小时'},
		];

		// 变更科目时进行查询
		$scope.selectSubject = function(){
			// 获取选中的radio的值
			var index = $('input:radio:checked').val();
			// radio有选中的，则进行查询，否则不进行处理
			if(index >= 0){
				var subjectID = $("#orderInfo").find("tr").eq(index).find("td:eq(6)").find("select").find("option:selected").val();
				$scope.subjectId = subjectID;
				$scope.dataPrepareReady = true;
				getCSShooleTeacherByFilters();
			}
		}
		// 试听选择
		$scope.selectSubjectSt = function(){
			var subjectID = $("#orderInfo").find("tr:eq(0)").find("select:eq(1)").find("option:selected").val();
			$scope.subjectId = subjectID;
			$scope.dataPrepareReady = true;
			// 排试听，只一个，激活
			if($scope.schoolName != ""){
				$scope.canSelectTime = true;
			}
			getCSShooleTeacherByFilters();
		}
		$scope.selectSubjectGroup = function(){
			var subjectID = $("#orderInfo").find("tr:eq(0)").find("select:eq(0)").find("option:selected").val();
			$scope.subjectId = subjectID;
			$scope.dataPrepareReady = true;
			// 排一对多，选择科目后激活
			if($scope.schoolName != ""){
				$scope.canSelectTime = true;
			}
			getCSShooleTeacherByFilters();
		}

		// 获取排课页面的教师的信息
		function getCSShooleTeacherByFilters(tableState){
			$scope.TableStateNew = tableState;
			if($scope.dataPrepareReady == true){
				if($scope.schoolName != undefined){
					var schoolName = $scope.schoolName;
					if(check_null(tableState)){
						$scope.teacherState = tableState;
					}else{
						$scope.isrendLoading = true;
						$scope.teacherState.pagination.start=0;
					}
					$scope.pagination = $scope.teacherState.pagination;
					var start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
					var number = $scope.pagination.number || 10;

					CustomerStudentCourseService.getCSShooleTeacherByFilters($scope.teacherName,$scope.schoolName,$scope.subjectId,$scope.partFull,
							$scope.mobile,$scope.teacherGrade,$scope.startTime,$scope.endTime,start,number).then(function(result){
						$scope.CStudentSchoolTeacherList = result.data.studentTeachers;
						$scope.teacherState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						$scope.isLoading = false;
						$("#schoolName").val(schoolName);
					});
				}else{
					var	promise = CustomerStudentCourseService.getSchoolName($routeParams.id,type);
					promise.then(function(result){
						$scope.schoolName = result;
						$scope.teacherState = tableState;
						$scope.isrendLoading = true;
						$scope.teacherState.pagination.start=0;
						$scope.pagination = $scope.teacherState.pagination;
						var start = $scope.pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
						var number = $scope.pagination.number || 10;

						CustomerStudentCourseService.getCSShooleTeacherByFilters($scope.teacherName,$scope.schoolName,$scope.subjectId,$scope.partFull,
								$scope.mobile,$scope.teacherGrade,$scope.startTime,$scope.endTime,start,number).then(function(result){
							$scope.CStudentSchoolTeacherList = result.data.studentTeachers;
							$scope.teacherState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
							$scope.isLoading = false;

						});
					},function(error){

					});
				}
			}
			// 若存在model，则进行隐藏
			if($scope.addModal != undefined){
				$scope.addModal.hide();
			}
		}

		// 获取排课页面的除教师列表外的其他信息
		function getCRMCourseBySomething(tableState){
			$scope.courseState = tableState;
			$scope.isLoading = true;
			var pagination =  tableState.pagination;
			var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
			var number = pagination.number || 10;  // Number of entries showed per page.
			// 获取排课的类型，1 是单个学员排课的信息，2 是一对多排课的信息  3 是试听排课
			if(type != null) {
				if(1 == type){
					CustomerStudentCourseService.getCRMCustomerStudentInfoByID(start,number,$routeParams.id).then(function(result){
						$scope.detail = result.data.customerStudent;
						$scope.CustomerStudentCourseList = result.data.studentOrder;
						$scope.CStudentCoursePlanList = result.data.studentCoursePlan;
						$scope.schoolName = result.data.schoolName;
						// 设置分页
						$scope.courseState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						// 若是CustomerStudentCourseList的size = 1，默认选中radio
						var length = $scope.CustomerStudentCourseList.length;
						if(1 == length){
							 $scope.CustomerStudentCourseList[0].isChecked = true;
						     $scope.subjectId = $scope.CustomerStudentCourseList[0].subject_id;
						     if($scope.schoolName!="" && $scope.subjectId != ""){
								$scope.canSelectTime = true;
							 }
						}else if(length > 1){
							// 需要设置ischecked的
							var order_no =  $scope.CustomerStudentCourseList[0].order_no;
							for(var i = 0 ;i<length;i++){
								var order_no_temp = $scope.CustomerStudentCourseList[i].order_no;
								if(order_no_temp == order_no){
									$scope.CustomerStudentCourseList[i].disabled = false;
								}else{
									$scope.CustomerStudentCourseList[i].disabled = true;
								}

							}
						}
						$scope.dataPrepareReady = true;
						$scope.getCSShooleTeacherByFilters($scope.TableStateNew);
						$scope.isrendLoading = false;
					});
				}else if(2 == type){
					CustomerStudentCourseService.getCRMCustomerGroupInfoByGroupID(start,number,$routeParams.id).then(function(result){
						$scope.CGoupStudentCourseList = result.data.groupStudentList;
						$scope.CustomerStudentCourseList = result.data.groupOrderCourseList;
						$scope.CStudentCoursePlanList = result.data.groupCoursePlanList;
						$scope.schoolName = result.data.schoolName;
						// 设置分页
						$scope.courseState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						// 获取科目信息
						CustomerStudentCourseService.getAllSubject().then(function(result){
							$scope.omsSubject = result;
						});
						var length = $scope.CustomerStudentCourseList.length;
						if(1 == length){
							 $scope.CustomerStudentCourseList[0].isChecked = true;
							 $scope.dataPrepareReady = true;
							 $scope.getCSShooleTeacherByFilters($scope.TableStateNew);
							 $scope.selectTime = true;
						}
						$scope.isrendLoading = false;
					});
				}else if(3 == type){
					CustomerStudentCourseService.getCRMCustomerLeaderInfoByID(start,number,$routeParams.id).then(function(result){
						$scope.detail = result.data.customerStudent;
						$scope.CStudentCoursePlanList = result.data.studentCoursePlan;
						$scope.CLeadsCourseTimeList = result.data.leadsCourseTime.list;
						// 获取试听学生的年级，默认选中该年级
						$("#gradeId").val($scope.detail.grade_id);

						if($scope.CLeadsCourseTimeList[0] != undefined){
							$scope.classTime = $scope.CLeadsCourseTimeList[0].plan_available_num;

						}else{
							$scope.classTime = 4;

						}
						// 试听设置radio被选中
						$("input[name='cscourseSt']:eq(0)").attr("checked",'checked');
						$scope.schoolName = result.data.schoolName;
						$scope.dataPrepareReady = true;
						$scope.getCSShooleTeacherByFilters($scope.TableStateNew);
						// 设置分页
						$scope.courseState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
						$scope.isrendLoading = false;
					});
					//获取所有的年级
					CustomerStudentCourseService.getAllGrade().then(function(result){
						$scope.omsGrade = result;
					});

					// 获取科目信息
					CustomerStudentCourseService.getAllSubject().then(function(result){
						$scope.omsSubject = result;
					});
				}
			}
		}

		// 转向排课的页面,所需参数
		function forwardCoursePlan(row){
			var subjectID = $scope.subjectId;//页面绑定获取科目
			var classTime = "";//页面绑定获取课时
			var studentID = ""; 	// 代表学员id
			var studentName = "";	// 学员姓名
			var groupID = "";  	// 代表一对多
			var gradeID = "";  	// 年级id
			var ordcourseID = ""; 	// 订单关联课程表的主键id，选购课程id
			var type = $scope.type;   //1:学员 2:一对多排课 3：leads
			var studentType = 1;   // 1:学员 3：lead
			var course_num = "";   // 剩余课时数量
			var plan_available_num = ""; //可选课时的数量
			var course_type_name = "";

			if(subjectID == undefined){
				SweetAlert.swal("请选择科目信息！");
				return;
			}
			// 获取学员信息
			if($scope.detail != undefined){
				studentID = $scope.detail.crm_student_id;
				studentName = $scope.detail.customer_name;
			}
			// 获取一对多信息
			var list = $scope.CGoupStudentCourseList; //为了获取一对多id
			if(list != undefined){
				groupID =  $scope.CGoupStudentCourseList[0].group_id; //从查询的结果集中获取一对多id
			}
			// 区分是否是试听
			if(type == "3"){
				studentType = 3;
				gradeID = $("#gradeId").val();  // 直接获取select的年级的值
				if(gradeID == undefined){
					SweetAlert.swal("请选择年级信息！");
					return;
				}
				course_num = "";  //试听没有课时剩余数
				plan_available_num = $scope.classTime;
				course_type_name= "试听课";

			}else{
				// 获取到集合的下标
				var index = $("input[name='cscourse']:checked").val();
				if(index == undefined){
					SweetAlert.swal("请选择产品类型信息！");
					return;
				}
				gradeID = $scope.CustomerStudentCourseList[index].grade_id;//获取年级id
				ordcourseID = $scope.CustomerStudentCourseList[index].ordcourse_id;//获取选购课程的id
				course_num = $scope.CustomerStudentCourseList[index].course_num;
				plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
				course_type_name= $scope.CustomerStudentCourseList[index].course_type_name;
				// 如果是一对多，重新对订单id进行处理
				if($scope.type == 2){
					if(list != undefined){
						var temp = "";
						for(var i=0;i<list.length;i++){
							temp += list[i].ordcourse_id + ",";
						}
						ordcourseID = temp.substring(0,temp.length-1);
					}
				}

			}
			// 排课所需的参数对象
			coursePlanParams = {
				"teacherID": row.userId,
				"type":type,
				"teacherName":row.username,
				"schoolID":row.deptId,
				"subjectID":subjectID,
				"subjectName":row.subject_name,
				"gradeID":gradeID,
				"studentID":studentID,
				"studentName":studentName,
				"groupID":groupID,
				"classTime":classTime,
				"ordcourseID":ordcourseID,
				"course_num":course_num,
				"plan_available_num":plan_available_num,
				"course_type_name":course_type_name,
			};
			//跳转到排课页面
			$location.path("/sos-admin/course_plan/plan/" + type +"/"+ studentType);
		}

		// 删除排课信息
		function removeCoursePlanByFilter(row){
			CustomerStudentCourseService.removeCoursePlanByFilter($scope.type,row);
		}

		//获取选中的value
		$scope.selectIt = function(index){
			// 将科目下拉框赋值，同时调用根据科目查询老师的方法 modify by 2015-11-4
			//var subjectID = $scope.CustomerStudentCourseList[index].subject_id;
			if(1 == type){
				var subjectID = $("#orderInfo").find("tr").eq(index).find("td:eq(6)").find("select").find("option:selected").val();
			}else if(2 == type){
				var subjectID = $("#orderInfo").find("tr:eq(0)").find("select:eq(0)").find("option:selected").val();
			}
			$scope.subjectId = subjectID;
			// 激活按钮
			if($scope.schoolName!="" && $scope.subjectId != ""){
				$scope.canSelectTime = true;
			}
			getCSShooleTeacherByFilters();
		}
		//选择年级
		$scope.selectGrade = function(gradeID){
			$scope.gradeId = gradeID;
		};

		/**
		 * 显示选择时间的对话框
		 */
		function showTimeDialog(){
			var title = "选择上课时间";
	    	$scope.modalTitle = title;
	    	// 设置可排课时
	    	var index = $("input[name='cscourse']:checked").val();
	    	if($scope.type != 3){
	    		if(index == undefined){
					SweetAlert.swal("请选择产品类型信息！");
					return;
				}
	    		var plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
		    	$scope.plan_available_num = plan_available_num;
	    	}else if($scope.type == 3){
				$scope.plan_available_num = $scope.classTime;
	    	}
	        $scope.addModal = $modal({scope: $scope, templateUrl: 'partials/sos/customer/modal.timeShow.html', show: true,backdrop:'static'});
		}
		/**
		 * 显示排课的对话框
		 */
		function showPlanDialog(row){
			if($scope.startEndTime == undefined || $scope.startEndTime == ""){
				SweetAlert.swal("请选择排课的时间段信息！");
				return;
			}
			var title = "";
			$scope.modalTilePlan = title;
			$scope.rowDetail = row;
			$scope.addModalPlan = $modal({scope: $scope, templateUrl: 'partials/sos/customer/modal.createPlanShow.html', show: true,backdrop:'static'});
		}
		/**
	     * 得到结束时间
	     * 并得到selected 开始和结束时间戳
	     */
	    function getEndTime(){
	        if($scope.select.startDate &&$scope.select.time && $scope.select.timeSize){
	             // 得到开始时间的毫秒数
	        	 var startDate = $scope.select.startDate.Format("yyyy-MM-dd");
	        	 var startTime = startDate + " " + $scope.select.time+":00";
	        	 var date = new Date(startTime);
	        	 // 将startTime转变为毫秒数
	        	 var timestampStart = date.getTime();
                 $scope.select.timestampBaseStart = timestampStart;
                 var timestampEnd =  timestampStart +(($scope.select.timeSize)*60*30*1000);
                 $scope.select.timestampBaseEnd = timestampEnd;
                 $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
                 // 查询时间条件的开始时间、结束时间、页面上选择的时间段的显示
                 $scope.startTime = startTime;
                 $scope.endTime = startDate + " " + $scope.select.timeEnd +":00";
                 $scope.startEndTime = startDate + " " + $scope.select.time + "--"+$scope.select.timeEnd;
	        }
	    }
	    function forwardCoursePlanNew(row){
			var subjectID = $scope.subjectId;//页面绑定获取科目
			var classTime = "";//页面绑定获取课时
			var studentID = ""; 	// 代表学员id
			var studentName = "";	// 学员姓名
			var groupID = "";  	// 代表一对多
			var gradeID = "";  	// 年级id
			var ordcourseID = ""; 	// 订单关联课程表的主键id，选购课程id
			var type = $scope.type;   //1:学员 2:一对多排课 3：leads
			var studentType = 1;   // 1:学员 3：lead
			var course_num = "";   // 剩余课时数量
			var plan_available_num = ""; //可选课时的数量
			var course_type_name = "";

			if(subjectID == undefined){
				SweetAlert.swal("请选择科目信息！");
				return;
			}
			// 获取学员信息
			if($scope.detail != undefined){
				studentID = $scope.detail.crm_student_id;
				studentName = $scope.detail.customer_name;
			}
			// 获取一对多信息
			var list = $scope.CGoupStudentCourseList; //为了获取一对多id
			if(list != undefined){
				groupID =  $scope.CGoupStudentCourseList[0].group_id; //从查询的结果集中获取一对多id
			}
			// 区分是否是试听
			if(type == "3"){
				studentType = 3;
				gradeID = $("#gradeId").val();  // 直接获取select的年级的值
				if(gradeID == undefined){
					SweetAlert.swal("请选择年级信息！");
					return;
				}
				course_num = "";  //试听没有课时剩余数
				plan_available_num = $scope.classTime;
				course_type_name= "试听课";

			}else{
				// 获取到集合的下标
				var index = $("input[name='cscourse']:checked").val();
				if(index == undefined){
					SweetAlert.swal("请选择产品类型信息！");
					return;
				}
				gradeID = $scope.CustomerStudentCourseList[index].grade_id;//获取年级id
				ordcourseID = $scope.CustomerStudentCourseList[index].ordcourse_id;//获取选购课程的id
				course_num = $scope.CustomerStudentCourseList[index].course_num;
				plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
				course_type_name= $scope.CustomerStudentCourseList[index].course_type_name;
				// 如果是一对多，重新对订单id进行处理
				if($scope.type == 2){
					if(list != undefined){
						var temp = "";
						for(var i=0;i<list.length;i++){
							temp += list[i].ordcourse_id + ",";
						}
						ordcourseID = temp.substring(0,temp.length-1);
					}
				}
			}
			// 排课所需的参数对象
			coursePlanParams = {
				"teacherID": row.userId,
				"type":type,
				"teacherName":row.username,
				"schoolID":row.deptId,
				"subjectID":subjectID,
				"subjectName":row.subject_name,
				"gradeID":gradeID,
				"studentID":studentID,
				"studentName":studentName,
				"groupID":groupID,
				"classTime":classTime,
				"ordcourseID":ordcourseID,
				"course_num":course_num,
				"plan_available_num":plan_available_num,
				"course_type_name":course_type_name,
			};
		}
	    /**
	     * 提交排课信息
	     */
	    function submitPlan(rowDetail){
	    	// 判断时间> 当前时间，过去的时间不能进行排课
	    	forwardCoursePlanNew(rowDetail);
	    	// 封装上排课的时间
	    	coursePlanParams.coursetime = [];
	        var plan = {
	                  start: new Date($scope.startTime).getTime(),
	                  end: new Date($scope.endTime).getTime(),
	        	};
	        coursePlanParams.coursetime.push(plan);
	        var obj = {
	                  "type":coursePlanParams.type,
	                  "teacherName":coursePlanParams.teacherName,
	                  "subjectId":coursePlanParams.subjectID,
	                  "subjectName":coursePlanParams.subjectName,
	                  "studentName":coursePlanParams.studentName,
	                  "crmCustomerGroupId":coursePlanParams.groupID,
	                  "classTime":coursePlanParams.classTime,
	                  "crmOrderIds":coursePlanParams.ordcourseID,
	                  "coursetime":coursePlanParams.coursetime,
	                  "crmStudentId":coursePlanParams.studentID,
	                  "userId":coursePlanParams.teacherID,
	                  "schoolId":coursePlanParams.schoolID,
	        };
	    	CreatePlanService.addPlans(obj).then(function (result) {
	              var response = result.data;
	              if(response.status == 'SUCCESS'){
	            	  SweetAlert.swal("排课成功！");
	            	  // 排课成功后进行刷新页面的操作
	            	  window.location.reload();
	              }else if(response.status == 'FAILURE'){//抛出冲突
	                  SweetAlert.swal(result.data.data);
	              }
		          // 隐藏掉已有的
		  	      if($scope.addModalPlan != undefined){
		  			$scope.addModalPlan.hide();
		  		  }
	          },function(result){
	              SweetAlert.swal('失败：'+ result);
		          // 隐藏掉已有的
		  	      if($scope.addModalPlan != undefined){
		  			$scope.addModalPlan.hide();
		  		  }
	          });
	    }
	    /**
	     * 判断时间是否合法，不能进行跨天
	     */
        function judgePlanTime(){
        	//通过start 时间 得到结束时间和页面显示时间
        	if($scope.select.startDate == undefined){
        		SweetAlert.swal('请选择上课日期');
                return false;
        	}
        	if($scope.select.time == undefined){
        		SweetAlert.swal('请选择上课时间');
                return false;
        	}
        	if($scope.select.timeSize == undefined){
        		SweetAlert.swal('请选择上课时长');
                return false;
        	}
        	if($scope.select.time >= "21:00"){
        		 var timestampEnd =  $scope.select.timestampBaseStart +(($scope.select.timeSize)*60*30*1000);
                 $scope.select.timestampBaseEnd = timestampEnd;
                 $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
        		 if($scope.select.timeEnd == "00:00"){
        			 SweetAlert.swal('结束时间不能为零点,请重新选择上课时间');
        			 return false;
        		 }
        	}
            var timestampEnd =  $scope.select.timestampBaseStart +(($scope.select.timeSize)*60*30*1000);
            $scope.select.timestampBaseEnd = timestampEnd;
            $scope.select.timeEnd = new Date(timestampEnd).Format("hh:mm");
            console.log(new Date(timestampEnd));

            if(_ifNotOneDay($scope.select.timestampBaseStart,$scope.select.timestampBaseEnd)){//判断时间是否跨天
                SweetAlert.swal('一节课不能隔天');
                return false;
            }
           /* if($scope.select.timestampBaseStart<new Date().getTime()){//判断是否小于当前时间
                SweetAlert.swal('时间已经过去了，不容许排课');
                return false;
            }*/
            var size = $scope.select.timeSize *0.5;
            var plan_available_num;
            if(type == "3"){
				plan_available_num = $scope.classTime;
            }else{
            	var index = $("input[name='cscourse']:checked").val();
				plan_available_num = $scope.CustomerStudentCourseList[index].plan_available_num;
            }
            if((plan_available_num-size)<0 ){
                SweetAlert.swal('您没有足够的课时了');
                return false;
            }
            getCSShooleTeacherByFilters();
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
            console.log(new Date(end));
            var end_m = new Date(end).getMinutes();
            var end_s = new Date(end).getSeconds();
            if(st > en){//开始销售数大于结束时间小时数
                if(end_m==0 &&  end_s==0 && en==0){
                    return false;
                }else{
                    return true;
                }

            }
            return false;
        }
        /*
         * 取消
         */
        function cancle(){
        	$scope.startEndTime = "";
        	$scope.addModal.hide();
        }
		(function init(){
			$('popup').hide();//删除可能存在的popup 弹框
			 $timeout(function(){
	                $("[data-toggle='tooltip']").tooltip();
	            },1000);
		})();

	}
]);
