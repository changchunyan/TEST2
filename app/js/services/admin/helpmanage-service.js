'use strict';

/**
 * The permission service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'HelpManagerService', ['$http', '$q', 'config',
        function($http, $q, config) {

            var service = {};
            service.contentList = contentList;
            service.allTopic = allTopic;
            service.topicList = topicList;
//            service.update = update;
            service.getPermissionsByFilter = getPermissionsByFilter;
            service.getPermissionTree = getPermissionTree;
            service.SaveHelpContent = SaveHelpContent;
            service.uploadFileToUrl = uploadFileToUrl;
            service.saveTopic = saveTopic;
            service.updateContent = updateContent;
            service.updateTopic = updateTopic;
            service.contentById = contentById;

            /**
             * 文件上传
             */
            function uploadFileToUrl(data, name, uploadFileName){
                var deferred = $q.defer();
                $http.post(config.endpoints.admin.help + "/uploadFile", name + "/r/n" + uploadFileName + "/r/n" + data)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }


            function allTopic(){
                var deferred = $q.defer();
                $http.get(config.endpoints.admin.help + "/topicList")
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data
                        });
                    })
                    .error(function(response, status, headers, config) {
                        console.log('Failed to get contentList : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            function contentById(id){
                var deferred = $q.defer();
                $http.get(config.endpoints.admin.help + "/contentList/"+id)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data
                        });
                    })
                    .error(function(response, status, headers, config) {
                        console.log('Failed to get contentList : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }
            /**
             * Gets the list of content.
             * @return the promise
             */
            function contentList(start, number, params,filter) {
                var deferred = $q.defer();
                if(!params.search.predicateObject){
                    params.search.predicateObject = {};
                    params.search.predicateObject.pageNum = start/number+1;
                    params.search.predicateObject.pageSize = number;
                }else{
                    params.search.predicateObject.pageNum = start/number+1;
                    params.search.predicateObject.pageSize = number;
                }
                filter.pageNum = params.search.predicateObject.pageNum;
                filter.pageSize = params.search.predicateObject.pageSize;
                $http.post(config.endpoints.admin.help + "/contentList",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                            numberOfPages: response.data.pages,
                            totalSize:response.data.total
                        });
                    })
                    .error(function(response, status, headers, config) {
                        console.log('Failed to get contentList : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            function topicList(start, number, params,filter) {
                var deferred = $q.defer();
                if(!params.search.predicateObject){
                    params.search.predicateObject = {};
                    params.search.predicateObject.pageNum = start/number+1;
                    params.search.predicateObject.pageSize = number;
                }else{
                    params.search.predicateObject.pageNum = start/number+1;
                    params.search.predicateObject.pageSize = number;
                }
                filter.pageNum = params.search.predicateObject.pageNum;
                filter.pageSize = params.search.predicateObject.pageSize;
                $http.post(config.endpoints.admin.help + "/topicList",filter)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                            numberOfPages: response.data.pages,
                            totalSize:response.data.total
                        });
                    })
                    .error(function(response, status, headers, config) {
                        console.log('Failed to get contentList : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            function getPermissionTree(){
                var deferred = $q.defer();
                $http.get(config.endpoints.admin.permission)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function getPermissionsByFilter(permission,start,number){
                var deferred = $q.defer();
                var temp = {} ;
                if(permission.name != undefined){
                    temp.name = permission.name;
                }
                if(permission.displayName != undefined){
                    temp.displayName = permission.displayName;
                }
                $http.get(config.endpoints.admin.permission + "/getPermissionsByFilter?permission="+ JSON.stringify(temp)
                    + '&start=' + start + '&number=' + number)
                    .success(function(response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function(response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            // **********重点来了 编辑完添加帮助内容以后 将数据打包发送给后台
           function SaveHelpContent(dateBag,helpTopicId) {

                var deferred = $q.defer();

                $http.post(config.endpoints.admin.help + "/createHelpContent/"+helpTopicId,dateBag)
                    .success(function(response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list
                        });

                    })
                    .error(function(response, status, headers, config) {
                            console.log('Failed to get backlog : ' + JSON.stringify(response));
                            deferred.reject(response.error);
                        }
                    );
                return deferred.promise;
            }

           //添加主题
           function saveTopic(HelpTopic) {

               var deferred = $q.defer();
               $http.post(config.endpoints.admin.help + "/createHelpTopic",HelpTopic)
                   .success(function(response, status, headers, config) {
                       deferred.resolve({
                           data: response.data.list
                       });
                   })
                   .error(function(response, status, headers, config) {
                           console.log('Failed to get backlog : ' + JSON.stringify(response));
                           deferred.reject(response.error);
                       }
                   );
               return deferred.promise;
           }

            /**
             * Creates a permission.
             * @param permission the permission to create
             * @return the promise
             */
            function create(permission) {
                var deferred = $q.defer();
                $http.post(config.endpoints.admin.permission, permission)
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
             * Updates a permission.
             * @param permission the permission to update
             * @return the promise
             */
            function updateTopic(obj) {
                var deferred = $q.defer();
                $http.put(config.endpoints.admin.help + '/updateHelpTopic',obj)
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
             * Deletes the permission.
             * @param permission the permission to delete
             */
            function updateContent(obj) {
                var deferred = $q.defer();
                $http.put(config.endpoints.admin.help + '/updateHelpContent',obj).success(function(response, status, headers, config) {
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
