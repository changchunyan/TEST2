/**
 * The teacher service.
 *
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('TeacherService', ['$http', '$q', 'config','utilService',function($http, $q,config,utilService) {
    /*
    product == course
     */
    var oThis = this;
    var service = {};

    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    service.getTeachersListService = getTeachersListService;

    service.getTeachersCourseListService = getTeachersCourseListService;
    service.setTeacherToProductsService = setTeacherToProductsService;
    service.deleteTeacherService = deleteTeacherService;
    service.deleteTeacherCourseService = deleteTeacherCourseService;
    service.addTeacherCourseService = addTeacherCourseService;
    service.updateTeacherCourse = updateTeacherCourse;
    service.addTeacherCourse = addTeacherCourse;
    service.upDownCourseService = upDownCourseService;

    service.getTeacherTimes = getTeacherTimes;
    service.getSchoolsTimes = getSchoolsTimes;
    service.getTeachersGroupBySubject = getTeachersGroupBySubject;
    //----------------------------------------------------util--------------------------------------------------------------------------------------------
    oThis.prepareTeacherCoursesJson = prepareTeacherCoursesJson;


    //----------------------------------------------------service--------------------------------------------------------------------------------------------
    function getTeachersListService(start,number,params){
        var deferred = $q.defer();
        var predicate = params.predicateObject;
        var parameters =url_jointParameters(predicate);

        var url = config.endpoints.sos.teacher+'/teacherList?start=' + start + '&number=' + number+parameters;
        return utilService.getHttp(url);
    }

    function getTeachersCourseListService(start,number,params){
        var deferred = $q.defer();
        if(!check_null(params) && !check_null(params.teacherId)){
            params={
                teacherId:null
            };
        }
        var url = config.endpoints.sos.teacher+'/courseList?start=' + start + '&number=' + number +'&teacherId='+params.teacherId;
        return utilService.getHttp(url);
    }
    function setTeacherToProductsService(teacher,productList){
        if( productList.length > 0){
            var courseJson =  oThis.prepareTeacherCoursesJson(teacher,productList);
            var url = config.endpoints.sos.teacher+'/bindCourse';
            return utilService.putHttp(url,JSON.stringify(courseJson));
        }
    }
    function addTeacherCourseService(params){
        var url = config.endpoints.sos.teacher+'/createCourse';
        console.log(JSON.stringify(params));
        return utilService.postHttp(url,JSON.stringify(params));
    }

    /**
     * 未实现
     * @param id
     */
    function deleteTeacherService(id){
        //var url = config.endpoints.sos.teacher+''
        //return utilService.deleteHttp(url);
    }
    function deleteTeacherCourseService(id){
        var url = config.endpoints.sos.teacher+'/unbindCourse/'+id;
        return utilService.deleteHttp(url);
    }
    function updateTeacherCourse(params){
        var url = config.endpoints.sos.teacher+'/updateCourse';
        return utilService.putHttp(url,params);
    }
    function addTeacherCourse(params){
        var url = config.endpoints.sos.teacher+'/createCourse';
        return utilService.postHttp(url,params);
    }
    function upDownCourseService(params){
        var url = config.endpoints.sos.teacher+'/status';
        return utilService.postHttp(url,params);
    }
    function getTeacherTimes(obj) {
        var url = config.endpoints.sos.getTeacherTimes;
        if(arguments.length==3&&arguments[1]&&arguments[2]){
            url = config.endpoints.sos.st
            obj.studentID = arguments[2]
            obj.selectedType = 2
        }
        return utilService.postDataHttp2(url, obj);
    }

    /**
     * 获取校区时间表
     * @returns {*}
     */
    function getSchoolsTimes(arg){
        var url = config.endpoints.sos.getSchoolsTimes;
        return utilService.postDataHttp2(url,arg);
    }
    
    function getTeachersGroupBySubject(filter){
    	var url = config.endpoints.sos.course_plan + "/getTeachersGroupBySubject";
        return utilService.postDataHttp2(url, filter);
    }

    //----------------------------------------------------util--------------------------------------------------------------------------------------------
    function prepareTeacherCoursesJson(teacher,productList){
        var courseJson = {
            'courseList':[],
            'teacherId':null
        };
        for(var i=0;i<productList.length;i++){

            var course = {
                courseId:productList[i].id
                //teacherId:teacher.id
            };
            courseJson.courseList.push(course);
            courseJson.teacherId = teacher.user_id;
        }
        return courseJson;
    }


    return service;
  }
]);
