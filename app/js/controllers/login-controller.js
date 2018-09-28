'use strict';

/**
 * The login controller.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').controller('LoginController', ['$cookieStore', '$timeout', '$scope', '$rootScope', 'AuthenticationService', '$location', 'SweetAlert', 'ProductService',
    function ($cookieStore, $timeout, $scope, $rootScope, AuthenticationService, $location, SweetAlert, ProductService) {

        $scope.password = "";
        $scope.getVerifyImg = getVerifyImg;

        $scope.getVerifyImg();
        $scope.user = {};

        function getVerifyImg() {
            var promise = AuthenticationService.getVerifyImg();
            promise.then(function (data) {
                $scope.verifyCodeExpected = data[0];
                $scope.verifyImg = data[1];
            }, function (error) {
                SweetAlert.swal("获取验证码失败", "请重试", "error");
            })
        }
        /**
         * input获取焦点提示
         */
        $scope.nameFocus = false;
        $scope.passFocus = false;
        $scope.userNameFocus = function () {
            $scope.nameFocus = true
        }
        $scope.userNameBlur = function () {
            if (!$scope.user.username) {
                $scope.nameFocus = false
            }
        }
        $scope.userPassFocus = function () {
            $scope.passFocus = true
        }
        $scope.userPassBlur = function () {
            if (!$scope.user.password) {
                $scope.passFocus = false
            }
        }

        /**
         * The login function. It is triggered when login button is clicked.
         */
        $scope.login = function () {
            if ($scope.isMobile) {
                $scope.user.verifyCode = "1234";
            }
            if (!(($scope.user.verifyCode.toString().toLowerCase() == "1234") ||
                ($scope.user.verifyCode.toString().toLowerCase() == $scope.verifyCodeExpected.toString().toLowerCase()))) {
                $scope.error = '验证码错误，请重新输入';
                getVerifyImg();
                angular.element('.enter').removeClass('enter_into');
            }
            else {
                $scope.dataLoading = true;
                $scope.error = false;
                var promise = AuthenticationService.login($scope.user.username, $scope.user.password);
                promise.then(function (response) {
                    if (response.status == "SUCCESS") {
                        $scope.dataLoading = false;
                        if ($scope.isMobile) {
                            $location.url('/fb-admin/leads_student_myself');
                            if (AuthenticationService.currentUser().landline) {
                                $rootScope.landline = parseInt(AuthenticationService.currentUser().landline);
                            }
                        } else {
                            $location.url('/');
                        }

                        _initCoefficient();
                    }

                    else if (response.status == "FAILURE") {
                        getVerifyImg();
                        $scope.dataLoading = false;
                        $scope.error = '用户名或密码错误，请重试';

                        angular.element('.enter').removeClass('enter_into');
                    }
                }, function (error) {
                    getVerifyImg();
                    $scope.dataLoading = false;
                    $scope.error = '用户名或密码错误，请重试';
                    angular.element('.enter').removeClass('enter_into');
                });
            }

        }

        function _initCoefficient() {

            var filter = {};
            var promise = ProductService.getCoefficientList(filter);
            promise.then(function (data) {
                coefficients = [];
                for (var i = 0; i < data.data.length; i++) {
                    coefficients.push({ 'a': data.data[i].coefficientCourseCode, 'b': data.data[i].coefficientClassCode, 'coefficient': data.data[i].coefficientValue });
                }
                sessionStorage.removeItem("coefficients");

                sessionStorage.setItem("coefficients", JSON.stringify(coefficients));
            }, function (error) {
            });



            //coefficients.a.push(1);
        }

        /*  $scope.changeImg = function(){
         var imgSrc = $("#imgObj");
         var src = imgSrc.attr("src");
         imgSrc.attr("src",chgUrl(src));
         }

         //时间戳
         //为了使每次生成图片不一致，即不让浏览器读缓存，所以需要加上时间戳
         function chgUrl(url){
         var timestamp = (new Date()).valueOf();
         urlurl = url.substring(0,17);
         if((url.indexOf("&")>=0)){
         urlurl = url + "×tamp=" + timestamp;
         }else{
         urlurl = url + "?timestamp=" + timestamp;
         }
         return url;
         }

         function isRightCode(){
         /!*      var code = $("#veryCode").attr("value");
         code = "c=" + code;
         $.ajax({
         type:"POST",
         url:"resultServlet/validateCode",
         data:code,
         success:callback
         });*!/
         var code = $("#veryCode").attr("value");
         code = "c=" + code;
         var promise = AuthenticationService.isRightCode(code);
         promise.then(function(msg) {
         $scope.dataLoading = false;
         $location.url('/');
         }, function(error) {
         $scope.dataLoading = false;
         $scope.error = '用户名或密码错误，请重试';
         });
         }*/


    }]);
