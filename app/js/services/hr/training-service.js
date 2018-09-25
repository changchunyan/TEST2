/**
 * The position maintenance service.
 *
 * @author zhiqing
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'TrainingManagementService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.getAllTrainingTypes = getAllTrainingTypes;
            service.getSelectedTrainingTypePath = getSelectedTrainingTypePath;
            service.addRoot = addRoot;
            service.update = update;
            service.addChild = addChild;
            service.remove = remove;
            service.addTraining = addTraining;
            service.getTrainingByFilter = getTrainingByFilter;
            service.removeTraining = removeTraining;
            service.getPersonByFilter = getPersonByFilter;
            service.editTraining = editTraining;
            service.signUp = signUp;
            service.getSignUpUserByFilter = getSignUpUserByFilter;
            
            function signUp(trainingId){
            	var deferred = $q.defer();
                $http.post(config.endpoints.hr.training + '/signUp', trainingId)
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
             * Get the training list.
             * @returns {*}
             */
            function getAllTrainingTypes() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.training)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    }
                )
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Get the path which can be reached to the given training.
             * @param trainingId
             * @returns {*}
             */
            function getSelectedTrainingTypePath(trainingTypeId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.training + "/getTrainingTypePath?trainingTypeId=" + trainingTypeId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    }
                )
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Update the training type's name
             * @param trainingType the training type to be updated
             * @returns {*}
             */
            function update(trainingType) {
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.training + '/' + trainingType.id, trainingType)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Add root training type to the system.
             * @param root the root training type
             * @returns {*}
             */
            function addRoot(root) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.training, root)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Delete the given training type.
             * @param trainingType the training type
             * @returns {*}
             */
            function remove(trainingType) {
                var deferred = $q.defer();
                $http.delete(config.endpoints.hr.training + '/' + trainingType.id)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Add child to a training type.
             * @param parent the parent
             * @param child the child
             * @returns {*}
             */
            function addChild(parent, child) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.training + '/' + parent.id, child)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Add a new training.
             * @param training the training to be added
             */
            function addTraining(training) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.training + '/addTraining', training)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }
            
            function editTraining(training){
            	var deferred = $q.defer();
                $http.post(config.endpoints.hr.training + '/editTraining', training)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function getTrainingByFilter(training, start, number) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.training + "/getTrainingByFilter?training="
                    + JSON.stringify(training) + '&start=' + start + '&number=' + number)
                    .success(function (response, status, headers, config) {
                        deferred.resolve({
                            data: response.data.list,
                            numberOfPages: response.data.pages
                        });
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }

            function removeTraining(training) {
                var deferred = $q.defer();
                $http.delete(config.endpoints.hr.training + "/deleteTraining/" + training.id)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response.data);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                );
                return deferred.promise;
            }
            
            function getPersonByFilter(filter, flag, start, number){
            	//flag=1表示要查询提醒人员，flag=2表示要查询已报名人员
            	var deferred = $q.defer();
                $http.get(config.endpoints.hr.training + "/getPersonByFilter?flag=" + flag 
                		+ "&filter=" + JSON.stringify(filter)
                		+ '&start=' + start + '&number=' + number)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            
            function getSignUpUserByFilter(filter, start, number) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.training + "/getSignUpUserFilter?filter="
                    + JSON.stringify(filter) + '&start=' + start + '&number=' + number)
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
    ]
);
