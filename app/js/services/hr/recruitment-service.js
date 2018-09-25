/**
 * The recruitment management service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'RecruitmentManagementService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};

            service.addRecruitment = addRecruitment;
            service.updateRecruitment = updateRecruitment;
            service.getExecutorList = getExecutorList;
            service.getResponsibleList = getResponsibleList;
            service.getRecruitmentByFilter = getRecruitmentByFilter;
            service.updateRecruitmentStatus = updateRecruitmentStatus;
            service.getRecruitmentPoints = getRecruitmentPoints;
            service.getTalentByFilter = getTalentByFilter;
            service.getUserByUserId = getUserByUserId;
            service.updateRecruitmentSchedule = updateRecruitmentSchedule;
            service.deleteRecruitmentSchedule = deleteRecruitmentSchedule;
            service.getDepartmentNeedList = getDepartmentNeedList;
            service.uploadFileToUrl = uploadFileToUrl;
            service.deleteRecruitment = deleteRecruitment;

            /**
             * 根据招聘需求id删除对应招聘需求
             * @param id
             */
            function deleteRecruitment(id){
                var deferred  = $q.defer();
                $http.delete(config.endpoints.hr.recruitment + '/deleteRecruitment/' + id)
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
             * 添加招聘需求
             */
            function addRecruitment(recruitment){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.recruitment + '/addRecruitment', recruitment)
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
             * 获取可选负责人列表
             */
            function getResponsibleList(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + '/getResponsibleList')
                    .success(function(response,status,headers,config){
                        deferred.resolve(response);
                    })
                    .error(function(response,status,headers,config){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 获取可选执行人列表
             */
            function getExecutorList(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + '/getExecutorList')
                    .success(function(response,status,headers,config){
                        deferred.resolve(response);
                    })
                    .error(function(response,status,headers,config){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function getTalentByFilter(recruitmentId,talent,start,number){
                if(talent.recruitmentSchedule != undefined){
                    talent.recruitmentScheduleName = talent.recruitmentSchedule.name;
                }
                else{
                    talent.recruitmentScheduleName = undefined;
                }
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + "/getTalentByFilter?talent=" + JSON.stringify(talent)
                    +'&recruitmentId=' + recruitmentId + '&start=' + start + '&number=' + number)
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
             * 根据条件查询招聘需求
             */
            function getRecruitmentByFilter(recruitment, start, number){
                if(recruitment.position != undefined){
                    recruitment.positionId = recruitment.position.id;
                }
                if(recruitment.department != undefined){
                    recruitment.departmentId = recruitment.department.id;
                }
                if(recruitment.startTime == undefined){
                    recruitment.startTime = undefined;
                }
                if(recruitment.deadline == undefined){
                    recruitment.deadline = undefined;
                }
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + "/getRecruitmentByFilter?recruitment=" + JSON.stringify(recruitment)
                    +'&start=' + start + '&number=' + number)
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
             * 切换招聘需求状态(开始/暂停)
             */
            function updateRecruitmentStatus(recruitment){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.recruitment + '/switchRecruitmentStatus/' +  recruitment.id,recruitment.recruitmentStatus)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 修改招聘需求
             */
            function updateRecruitment(recruitment){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.recruitment + '/updateRecruitment',recruitment)
                    .success(function(response,status,headers,config){
                        deferred.resolve(response);
                    })
                    .error(function(response,status,headers,config){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 获取所有招聘流程节点
             */
            function getRecruitmentPoints(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + '/getRecruitmentPoints')
                    .success(function(response,status,headers,config){
                        deferred.resolve(response);
                    })
                    .error(function(response,status,headers,config){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 根据用户id去获取用户
             */
            function getUserByUserId(userId){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.recruitment + '/getUserByUserId?userId='+userId)
                    .success(function(response,status,headers,config){
                        deferred.resolve(response);
                    })
                    .error(function(response,status,headers,config){
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 保存
             * @param recruitmentSchedule
             */
            function updateRecruitmentSchedule(recruitmentSchedule){
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.recruitment + "/updateRecruitmentSchedule", recruitmentSchedule)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            /**
             * 删除招聘节点，一次只删除一个
             * @param recruitmentSchedule
             */
            function deleteRecruitmentSchedule(recruitmentSchedule){
                var deferred = $q.defer();
                $http.delete(config.endpoints.hr.recruitment + '/deleteRecruitmentSchedule/' + recruitmentSchedule.id)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            
            /**
             * 获取在招的部门
             */
            function getDepartmentNeedList(organizationId) {
            	var deferred = $q.defer();
            	$http.get(config.endpoints.hr.recruitment + "/getDepartmentNeedList/" + organizationId)
            	.success(function(response, status, headers, config) {
            		deferred.resolve(response);
            	})
            	.error(function(response, status, headers, config) {
            		deferred.reject(response);
            	}
            	);
            	return deferred.promise;
            }

            /**
             * 文件上传
             */
            function uploadFileToUrl(data,name, uploadUrl){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.recruitment + "/uploadFile",name + "/r/n"+ data)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            return service;
        }
    ]);
