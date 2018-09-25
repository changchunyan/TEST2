'use strict';

/**
 * The CoursePlan  service.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */

angular.module('ywsApp').factory('CoursePlanService', ['$http', '$q', 'config', '$filter', '$timeout', function ($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.recordlist = recordlist;
    service.Activityrecordlist = Activityrecordlist;
    service.Grouprecordlist = Grouprecordlist;
    service.Classrecordlist = Classrecordlist;
    service.classPorintList = classPorintList;
    service.classPorintListmore = classPorintListmore;
    service.GroupInfoCoursePlanrecord = GroupInfoCoursePlanrecord;
    service.CourseDetailInfoServerRecord = CourseDetailInfoServerRecord;
    service.Listenrecordlist = Listenrecordlist;
    service.Listenrecordmultiplelist = Listenrecordmultiplelist;
    service.Excelrecordlist = Excelrecordlist;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.Studentlist = Studentlist;
    service.StudentRecordList = StudentRecordList;
    service.yesconsume = yesconsume;
    service.consume = consume;
    service.EditCoursePlan = EditCoursePlan;
    service.SubjectList = SubjectList;
    service.EditCoursePlanNow = EditCoursePlanNow;
    service.teachernow = teachernow;
    service.getList = getList;
    service.deleteByModel = deleteByModel;
    service.getTeacherListByFilter = getTeacherListByFilter;
    service.getAllDictData = getAllDictData;
    service.updateTeacherUnavailableTime = updateTeacherUnavailableTime;
    service.getTeacherUnavailableListByFilter = getTeacherUnavailableListByFilter;
    service.deleteUnavaliableRecord = deleteUnavaliableRecord;
    service.getConflictPlanList = getConflictPlanList;
    service.checkAddCoursePlanTime = checkAddCoursePlanTime;
    service.getWxClassTimeList = getWxClassTimeList;
    service.saveGradeChange = saveGradeChange;
    service.getTeacherTodayCourse = getTeacherTodayCourse;
    service._detail = _detail;
    service.getCoursePlanInfo = getCoursePlanInfo;
    service.ClassrecordlistSNP = ClassrecordlistSNP;


    function getCoursePlanInfo(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.course_plan + '/getCoursePlanInfo/' + id).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data,
                status: response.status
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * 获取教师今日上课安排
     */
    function getTeacherTodayCourse(start, number, params) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/getTeacherTodayCourse', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * Gets the list of InvitationCommunication.
     * @return the InvitationCommunication
     */

    /**
     *
     * @param studentId 学生id
     * @param gradeId  修改前年级id
     * @param nowGradeId
     * @param scope
     * @returns
     * {jk=false, //布尔值  true 需要删除排课
                jkCount=0, //要删的排课记录条数
                jkPlanIds=, //string 要删除的排课id
                orderList= //储值订单列表 list
                wxExist //布尔值  true 存在未消课时
                upOrderList //修改订单金额列表
                }
     */
    function getWxClassTimeList(studentId, gradeId, nowGradeId, scope) {

        var deferred = $q.defer();

        var data = {};
        data.studentId = studentId;
        data.gradeId = gradeId;
        data.nowGradeId = nowGradeId;

        try {
            if (scope.detail.type == 2) {
                data.orderRule = scope.detail.order_rule
            }
        } catch (e) {

        }

        $http.post(config.endpoints.sos.course_plan + '/wxClassTime?date=' + new Date().getTime(), data)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {

            })
        return deferred.promise;

    }

    /**
     *
     * @param data  getWxClassTimeList 返回结果
     * @param studentId  学生id
     * @param grade_id    修改后班级id
     * @returns {*}
     */
    function saveGradeChange(data, studentId, grade_id) {//修改订单列表并保存数据修改排课记录
        data.studentId = studentId;
        data.grade_id = grade_id;
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/upCoursePlan?date=' + new Date().getTime(), data)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {

            })
        return deferred.promise;
    }

    function _detail(orderChargingId) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.crmChargingScheme + "/queryById/" + orderChargingId)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }

    function list(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/CoursePlanlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function EditCoursePlan(start, number, params, OmsCoursePlanVoForEdit) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {

            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
            params.search.predicateObject.type = OmsCoursePlanVoForEdit.type;
            params.search.predicateObject.subject_id = OmsCoursePlanVoForEdit.subject_id;
            if (OmsCoursePlanVoForEdit.crmClassId != null) {
                params.search.predicateObject.crmClassId = OmsCoursePlanVoForEdit.crmClassId;
            } else {
                params.search.predicateObject.crmCustomerStudentId = OmsCoursePlanVoForEdit.crmCustomerStudentId;
            }

            params.search.predicateObject.omscourseplanid = OmsCoursePlanVoForEdit.id;
            if (OmsCoursePlanVoForEdit.subjectId != null) {
                params.search.predicateObject.subjectId = OmsCoursePlanVoForEdit.subjectId;
            }
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
            params.search.predicateObject.subject_id = OmsCoursePlanVoForEdit.subject_id;
            params.search.predicateObject.subjectId = OmsCoursePlanVoForEdit.subjectId;

        }
        $http.post(config.endpoints.sos.course_plan + '/CoursePlanDetail', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function teachernow(start, number, teachername) {
        var deferred = $q.defer();

        teachername.pageNum = 1;
        teachername.pageSize = 10;
        $http.post(config.endpoints.sos.course_plan + '/teacherDetail', teachername).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function SubjectList(OmsCoursePlanVoForEdit) {
        var deferred = $q.defer();

        $http.post(config.endpoints.sos.course_plan + '/customerStudent', OmsCoursePlanVoForEdit).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response

            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * 单个学生排课详情
     * @return the InvitationCommunication
     */
    function Studentlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            if (number != 0) {
                params.search.predicateObject = {};
                params.search.predicateObject.pageNum = start / number + 1;
                params.search.predicateObject.pageSize = number;
            } else {
                params.search.predicateObject.pageNum = start;
                params.search.predicateObject.pageSize = number;
            }
        } else {
            if (number != 0) {
                params.search.predicateObject.pageNum = start / number + 1;
                params.search.predicateObject.pageSize = number;
            } else {
                params.search.predicateObject.pageNum = start;
                params.search.predicateObject.pageSize = number;
            }
        }
        $http.post(config.endpoints.sos.course_plan + '/StudentPlanlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function GroupInfoCoursePlanrecord(params) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/GroupInfoPlanlist', params).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                // numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

	function CourseDetailInfoServerRecord(params) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/CourseDetailInfolist', params).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data,
                // numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }


    function recordlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/NewCoursePlanRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Activityrecordlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/ActivityRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Grouprecordlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/NewGroupRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Classrecordlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/CoursePlanClasslist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function ClassrecordlistSNP(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/SNPCoursePlanClasslist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function classPorintList(param) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/GroupInfoPlanlist', param).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }
    function classPorintListmore(param) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/tempGroupInfoPlanlist', param).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Listenrecordlist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        params.search.predicateObject.type = 3;
        $http.post(config.endpoints.sos.course_plan + '/CoursePlanRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Listenrecordmultiplelist(start, number, params) {
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        params.search.predicateObject.type = 3;

        console.log(params.search.predicateObject)
        $http.post(config.endpoints.sos.CustomerStudent + '/findTempGroupList', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    function Excelrecordlist(start, number, params) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/ExcelPlanRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get ExcelPlanRecordlist : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise; 
    }


    function StudentRecordList(start, number, params) { 
        var deferred = $q.defer();

        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan + '/StudentPlanRecordlist', params.search.predicateObject).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }
    /**
     * Creates a InvitationCommunication.
     * @param InvitationCommunication to create
     * @return the InvitationCommunication
     */
    function create(CrmInvitationCommunicationVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.InvitationCommunication, CrmInvitationCommunicationVo).success(function (response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to create InvitationCommunication : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }

    /**
     * 逻辑删除排课
     */
    function update(OmsCoursePlanVo) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.CoursePlan + '/' + OmsCoursePlanVo.id, OmsCoursePlanVo).success(function (response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function (response, status, headers, config) {
                //console.log('Failed to update InvitationCommunication : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    /**
     * 逻辑删除排课
     */
    function remove(OmsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/delete', OmsCoursePlan).success(function (response, status, headers, config) {
            deferred.resolve({
                //deferred.resolve(response.data);
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to delete CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }



    /**
     * 消课和取消
     */
    function consume(omsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/consume', omsCoursePlan).success(function (response, status, headers, config) {
            deferred.resolve(response);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to consume OmsCoursePlan : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    function EditCoursePlanNow(omsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/UpdateCoursePlan', omsCoursePlan).success(function (response, status, headers, config) {
            deferred.resolve(response);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to consume OmsCoursePlan : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    /**
     * 消课和取消
     */
    function yesconsume(omsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/yespastcourse', omsCoursePlan).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data,
                status: response.status,
                error: response.error
            });
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to consume OmsCoursePlan : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    /**
     * 获取排课记录
     */
    function getList(omsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/getList', omsCoursePlan)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to getList OmsCoursePlan : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    /**
     * 删除排课
     */
    function deleteByModel(omsCoursePlan) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/deleteByModel', omsCoursePlan)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to delete OmsCoursePlan : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }

    function getTeacherListByFilter(start, number, params, filter) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.course_plan + '/getTeachersByFilter', filter)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    function getTeacherUnavailableListByFilter(start, number, params, filter) {
        var deferred = $q.defer();
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.course_plan + '/getTeacherUnavailableListByFilter', filter)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    function getAllDictData() {
        var deferred = $q.defer();
        $http.get(config.endpoints.hr.employee + "/getAllDictData")
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    function updateTeacherUnavailableTime(selectedTeacher) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + "/updateTeacherUnavailableTime", selectedTeacher)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    function deleteUnavaliableRecord(id) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + "/deleteUnavaliableRecord", id)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    function getConflictPlanList(selectedTeacher) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + "/getConflictPlanList", selectedTeacher)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;
    }

    /**
     * 判断和教师设置的不可排课时间是否有冲突
     */
    function checkAddCoursePlanTime(teacherCoursePlanList) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + "/checkAddCoursePlanTime", teacherCoursePlanList)
            .success(function (response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (response, status, headers, config) {
                deferred.reject(response);
            }
            );
        return deferred.promise;

    }
    return service;
}
]);
