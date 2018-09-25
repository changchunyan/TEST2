'use strict';

/* Services */

angular.module('ywsApp').factory('utilService', ['$http', '$q', 'config', function ($http, $q, config) {
    var oThis = this;
    var service = {};

    service.getHttp = getHttp;
    service.get = get;
    service.getHttp2 = getHttp2;
    service.postHttp = postHttp;
    service.postDataHttp = postDataHttp;
    service.postDataHttp2 = postDataHttp2;
    service.putHttp = putHttp;
    service.deleteHttp = deleteHttp;
    service.postDataHttpPage = postDataHttpPage;
    service.download = download;

    //util
    function get(url) {
        var deferred = $q.defer();
        $http.get(url)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(status);
                }
            );
        return deferred.promise;
    }

    function download(url) {
        var deferred = $q.defer();
        $http.get(url,
            {responseType: 'arraybuffer', CORS_ORIGIN_ALLOW_ALL: true})
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(status);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http GET 异步请求
     * @param url
     * @returns {*}  后台返回 data.list
     */
    function getHttp(url) {
        var deferred = $q.defer();
        $http.get(url)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages || response.data.totalPage
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(status);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http GET 异步请求
     * @param url
     * @returns {*} 后台返回 data
     */
    function getHttp2(url) {
        var deferred = $q.defer();
        $http.get(url)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data,
                    numberOfPages: response.data ? response.data.pages : 0
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http POST 异步请求
     * @param url
     * @param obj
     * @returns {*}  后台返回 status
     */
    function postHttp(url, obj) {
        var deferred = $q.defer();
        $http.post(url, obj)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: status,
                    more: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http POST 异步请求
     * 当前为控制台 所有请求所特有
     * @param url
     * @param obj
     * @returns {*}  后台返回 data 有数据
     */
    function postDataHttp(url, obj) {
        var deferred = $q.defer();
        $http.post(url, obj)
            .success(function (response, status, headers, config) {
                try {
                    deferred.resolve({
                        data: response,
                        numberOfPages: response.data.pages || 0
                    });
                } catch (e) {
                    deferred.resolve({
                        data: response
                    });
                }
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http POST 异步请求
     * 当前为工作流 所有请求所特有
     * @param url
     * @param obj
     * @returns {*}  后台返回 data 有数据
     */
    function postDataHttp2(url, obj) {
        var deferred = $q.defer();
        $http.post(url, obj)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    /**
     * 封装 angular $http POST 异步请求
     * 当前为控制台 明细特有
     * @param url
     * @param obj
     * @returns {*}  后台返回 data 有数据
     */
    function postDataHttpPage(url, obj) {
        var deferred = $q.defer();
        $http.post(url, obj)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response,
                    numberOfPages: response.data.page || 0
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function putHttp(url, obj) {
        var deferred = $q.defer();
        $http.put(url, obj)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: status,
                    more: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response);
                }
            );
        return deferred.promise;
    }

    function deleteHttp(url) {
        var deferred = $q.defer();
        $http.delete(url)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: status
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /*===============================一下内容李世明添加：为了使用教研系统接口=========================================*/
    service.getData = function (url) {
        var deferred = $q.defer();
        _httpBerfor(deferred, url, _geting)
        return deferred.promise;
    }
    service.postData = function (url, data) {
        var deferred = $q.defer();
        _httpBerfor(deferred, url, _posting, data)
        return deferred.promise;
    }

    function _posting(deferred, url, data) {
        // var deferred = $q.defer();
        var _headers = arguments[arguments.length - 1]
        $http.post(url, data, {
            headers: _headers
        })
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    function _geting(deferred, url) {
        // var deferred = $q.defer();
        var _headers = arguments[arguments.length - 1]
        $http.get(url, {
            headers: _headers
        }).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response
            });
        })
            .error(function (response, status, headers, config) {
                    console.log('Failed to get orders : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
        /*,{
         headers:{'Content-Type': 'application/json;charset=utf-8'}
         }*/
    }

    /**
     * 使用aop切入请求并获取token
     * @param deferred
     * @param url
     * @param fn
     * @param data
     * @private
     */
    function _httpBerfor(deferred, url, fn, data) {
        // var deferred = $q.defer();
        $http.post(oms_server + 'tr/getLMSToken')
            .success(function (response, status, headers, config) {
                if (response.data.lmsToken) {
                    window.lsmToken = response.data.lmsToken
                }
                var _headers = {
                    'api-token': response.data.lmsToken
                }
                fn(deferred, url, data, _headers)
            })
            .error(function (response, status, headers, config) {
                /* console.log('Failed to get orders : ' + JSON.stringify(response));*/
                // deferred.reject(response.error);
                var _headers = {
                    'api-token': response.data.lmsToken || response.data.lmsToken
                }
                fn(deferred, url, data, _headers)
            });
        // return deferred.promise;

    }

    return service;
}
]);