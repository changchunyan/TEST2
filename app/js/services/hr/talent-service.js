/**
 * The talent management service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'TalentService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.getList = getList;
            service.add = add;
            service.update = update;
            service.remove = remove;
            service.findByFilter = findByFilter;
            service.uploadFileToUrl = uploadFileToUrl;
            service.uploadImageToUrl = uploadImageToUrl;
            service.download = download;
            service.downloadHistory = downloadHistory;
            service.getTeachingCharacteristic = getTeachingCharacteristic;
            service.getGrade = getGrade;
            service.getIdentityType = getIdentityType;
            service.copy = copy;
            service.findSameTalent = findSameTalent;
            service.getRecruitmentNeed = getRecruitmentNeed;
            service.addFinishNode = addFinishNode;
            service.getTeamDataByFilter = getTeamDataByFilter;
            service.getPersonalDataByFilter = getPersonalDataByFilter;
            
            function getPersonalDataByFilter(condition, start, size){
            	if(condition.channel1 == null){
            		condition.channel1 = undefined;
            	}
            	if(condition.channel2 == null){
            		condition.channel2 = undefined;
            		condition.channel3 = undefined;
            	}
            	if(condition.channel3 == null){
            		condition.channel3 = undefined;
            	}
            	var deferred = $q.defer();
	        	$http.get(config.endpoints.hr.talent + "/getPersonalDataByFilter?condition=" + JSON.stringify(condition) + "&start=" + start + "&size=" + size)
	            	.success(function(response, status, headers, config) {
	            		deferred.resolve(response);
	            	})
	            	.error(function(response, status, headers, config) {
	            		deferred.reject(response);
	            	}
	        	);
	        	return deferred.promise;
            }
            
            function getTeamDataByFilter(condition, start, size){
            	if(condition.channel1 == null){
            		condition.channel1 = undefined;
            	}
            	if(condition.channel2 == null){
            		condition.channel2 = undefined;
            		condition.channel3 = undefined;
            	}
            	if(condition.channel3 == null){
            		condition.channel3 = undefined;
            	}
	        	var deferred = $q.defer();
	        	$http.get(config.endpoints.hr.talent + "/getTeamDataByFilter?condition=" + JSON.stringify(condition) + "&start=" + start + "&size=" + size)
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
             * 为人才添加【已入职】节点
             * @param talent
             * @returns {*}
             */
            function addFinishNode(talent){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.talent + "/addFinishNode", talent)
                    .success(function(response, stauts, headers, config){
                        deferred.resolve(response);
                    })
                    .error(function(response, stauts, headers, config){
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function getRecruitmentNeed(departmentId, positionId){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/getRecruitmentNeed?departmentId="
                    + departmentId + "&positionId=" + positionId)
                    .success(function(response, stauts, headers, config){
                        deferred.resolve(response);
                    })
                    .error(function(response, stauts, headers, config){
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function getIdentityType(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/getIdentityType")
                    .success(function(response, status, headers, config){
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config){
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function getGrade(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/getGrade")
                    .success(function(response, status, headers, config){
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config){
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            
            function add(talent) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.talent + "/create", talent)
                  .success(function(response, status, headers, config) {
                    deferred.resolve(response);
                  })
                  .error(function(response, status, headers, config) {
                    deferred.reject(response);
                  }
                );
                return deferred.promise;
            }
            
            function update(talent) {
            	var deferred = $q.defer();
            	$http.post(config.endpoints.hr.talent + "/update", talent)
            	.success(function(response, status, headers, config) {
            		deferred.resolve(response);
            	})
            	.error(function(response, status, headers, config) {
            		deferred.reject(response);
            	}
            	);
            	return deferred.promise;
            }
            
            function remove(hrTalent) {
            	var deferred = $q.defer();
            	$http.delete(config.endpoints.hr.talent + "/delete/" + hrTalent.id)
            	.success(function(response, status, headers, config) {
            		deferred.resolve(response);
            	})
            	.error(function(response, status, headers, config) {
            		deferred.reject(response);
            	}
            	);
            	return deferred.promise;
            }
            
            function getList(start, size) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/getList?start=" + start + "&size=" + size)
                  .success(function(response, status, headers, config) {
                	  deferred.resolve({
                          data: response.data.list,
                          numberOfPages: response.data.pages
                        });
                  })
                  .error(function(response, status, headers, config) {
                    deferred.reject(response.error);
                  }
                );
                return deferred.promise;
            }
            
            function findByFilter(searchTalent, start, size) {
            	var deferred = $q.defer();
            	$http.get(config.endpoints.hr.talent + "/findByFilter?searchTalent=" + JSON.stringify(searchTalent) + "&start=" + start + "&size=" + size)
	            	.success(function(response, status, headers, config) {
	            		deferred.resolve(response);
	            	})
	            	.error(function(response, status, headers, config) {
	            		deferred.reject(response);
	            	}
            	);
            	return deferred.promise;
            }

            function findSameTalent(searchTalent, start, size) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/findSameTalent?searchTalent=" + JSON.stringify(searchTalent) + "&start=" + start + "&size=" + size)
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
            function uploadFileToUrl(data, name, uploadFileName){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.talent + "/uploadFile", name + "/r/n" + uploadFileName + "/r/n" + data)
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
             * 图片上传
             */
            function uploadImageToUrl(data, name, uploadFileName){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.talent + "/uploadImage", name + "/r/n" + uploadFileName + "/r/n" + data)
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
             * 文件下载
             */
            function download(data){
            	var deferred = $q.defer();
            	$http.post(config.endpoints.hr.talent + "/downloadFile", data)
	            	.success(function(response, status, headers, config) {
                        if(response.status == "SUCCESS"){
                            window.location.href = response.data;
                        }
	            	})
	            	.error(function(response, status, headers, config) {
	            		deferred.reject(response);
	                });
            	return deferred.promise;
            }

            /**
             * 获取所有教学特点
             * @returns {*}
             */
            function getTeachingCharacteristic(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.talent + "/getTeachingCharacteristic")
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function downloadHistory(historyData){
            	var deferred = $q.defer();
            	$http.post(config.endpoints.hr.talent + "/downloadHistoryFile", historyData)
	            	.success(function(response, status, headers, config) {
                        if(response.status == "SUCCESS"){
                            window.location.href = response.data;
                        }
	            	})
	            	.error(function(response, status, headers, config) {
	            		deferred.reject(response);
	                });
            	return deferred.promise;
            }

            function copy(newFile, oldFile){
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.talent + "/copy", newFile + "/r/n" + oldFile)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            
            return service;
        }
    ]);
