'use strict';

/**
 * The authentication service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'AuthenticationService', ['$http', '$rootScope', '$timeout', '$q', 'config', '$base64', 'localStorageService',
        function ($http, $rootScope, $timeout, $q, config, $base64, localStorageService) {

            var service = {};

            service.login = login;
            service.logout = logout;
            service.authenticated = authenticated;
            service.currentUser = currentUser;
            service.changePassword = changePassword;
            service.changeLandline = changeLandline;
            service.getVerifyImg = getVerifyImg;
            service.spacifySchool = spacifySchool;
            service.getSchool = getSchool;
            service.chooseSchool = chooseSchool;

            function getVerifyImg() {
                var deferred = $q.defer();
                $http.get(config.endpoints.captcha)
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
             * Login. If login succeeds, the user info (userId, token) are stored in cookie.
             *
             * @param username the account
             * @param password the password in plaintext
             * @return a promise
             */
            function login(username, password) {
                var deferred = $q.defer();
                $http.post(config.endpoints.login, {
                    "account": username,
                    "password": password
                }
                ).success(function (response, status, headers, config) {
                    /*           if(response.status == "FAILURE"){
                                 deferred.reject(response.error);
                               }*/
                    if (response.status == "SUCCESS") {
                        console.log(response);

                        localStorageService.set('isModyfied', response.data.isModyfied);

                        localStorageService.set('user', response.data.user);
                        localStorageService.set('roles', response.data.roles);
                        localStorageService.set('token', response.data.session.token);
                        localStorageService.set('position_id', response.data.position_id);
                        localStorageService.set('department_id', response.data.department_id);
                        localStorageService.set('school_id', response.data.school_id);
                        localStorageService.set('landline', response.data.landline);
                        localStorageService.set('profile', response.data.profile);
                        localStorageService.set('positionName', response.data.positionName);
                        localStorageService.set('department', response.data.department);
                        localStorageService.set('isOutbound', response.data.isOutbound);
                        localStorageService.set('employeeId', response.data.employeeId);
                        localStorageService.set('outboundphone', response.data.outboundphone);
                        localStorageService.set('userId', response.data.userId);
                        $rootScope.jumpELearning()
                    }
                    deferred.resolve(response);
                })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            /**
             * Logout.
             * @return a promise
             */
            function logout() {
                var deferred = $q.defer();
                $http.post(config.endpoints.logout, currentUser().account)
                    .success(function (response, status, headers, config) {
                        deferred.resolve();
                    })
                    .error(function (response, status, headers, config) {
                        deferred.resolve(response);
                    }
                    );

                // successfully or not, the local token/user/roles are cleared
                localStorageService.remove('token');
                localStorageService.remove('user');
                localStorageService.remove('roles');
                localStorageService.remove('position_id');
                localStorageService.remove('department_id');
                localStorageService.remove('school_id');
                localStorageService.remove('landline');
                localStorageService.remove('profile');
                localStorageService.remove('positionName');
                localStorageService.remove('department');
                localStorageService.remove('isOutbound');
                localStorageService.remove('employeeId');
                localStorageService.remove('outboundphone');
                localStorageService.remove('userId');
                return deferred.promise;
            }

            function changePassword(password) {
                var deferred = $q.defer();
                var temp = {};
                temp.password = password.new;
                $http.post(config.endpoints.hr.employee + '/changePassword', JSON.stringify(temp))
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            function changeLandline(landline) {
                var deferred = $q.defer();
                if (landline == "") {
                    //如果为空，请求就会报错，这里给赋值处理
                    landline = "-1";
                }
                $http.post(config.endpoints.hr.employee + "/changeLandline", landline)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            /**
             * Checks whether it is authenticated.
             * @return true if authenticated, otherwise false
             */
            function authenticated() {
                return !!localStorageService.get('token');
            }

            /**
             * Gets current user with roles.
             * @return current user.
             */
            function currentUser() {
                var user = localStorageService.get('user');
                if (!user) {
                    return null;
                }
                user.roles = localStorageService.get('roles');
                user.token = localStorageService.get('token');
                user.department_id = localStorageService.get('department_id');
                user.position_id = localStorageService.get('position_id');
                user.landline = localStorageService.get('landline');
                user.profile = localStorageService.get('profile');
                user.school_id = localStorageService.get('school_id');
                user.position_name = localStorageService.get('positionName');
                user.department = localStorageService.get('department');
                user.isOutbound = localStorageService.get('isOutbound');
                user.employeeId = localStorageService.get('employeeId');
                user.outboundphone = localStorageService.get('outboundphone');
                user.userId = localStorageService.get('userId');
                try {
                    user.account = localStorageService.get('user').account;
                } catch (e) {
                    console.log('错了')
                }
                try {
                    user.projectSettingId = localStorageService.get('department').projectSettingId;
                    user.schoolNature = localStorageService.get('department').schoolNature;
                } catch (e) {
                    console.log('错了')
                }
                return user;
            }

            /**
             * Gets the http auth token.
             * @return the http auth token.
             */
            function httpAuthToken() {
                var user = localStorageService.get('user');
                if (!user) {
                    return '';
                }
                return 'bearer ' + $base64.encode(user.account + ':' + user.token);
            }

            //权限控制模块
            $rootScope.showPermissions = function (name) {
                var can = false;
                //用户角色
                angular.forEach($rootScope.currentUser.roles, function (role) {
                    //角色权限
                    angular.forEach(role.permissions, function (permission) {
                        if (permission.name === name) {
                            can = true;
                        }
                    });
                });
                return can;
            }

            function spacifySchool(position_id) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.checkAuthority, { position_id: position_id })
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            function getSchool(params) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.checkAuthority + '/getSchool', params)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            function chooseSchool(params) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.checkAuthority + '/chooseSchool', params)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response.error);
                    }
                    );
                return deferred.promise;
            }

            return service;
        }
    ]);
