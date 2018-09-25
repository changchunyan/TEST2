'use strict';

angular.module('ywsApp').controller('BdApplicationEditController', ['$scope', '$location','$filter','CommonService', 'BdApplicationService', 'BdLeadsService', '$modal', '$rootScope', 'SweetAlert',
  'localStorageService','AuthenticationService', "$routeParams",

    function($scope, $location,$filter,CommonService, BdApplicationService, BdLeadsService, $modal, $rootScope, SweetAlert,localStorageService,AuthenticationService, $routeParams) {
        $scope.step = 1;
        $scope.detail = {};
        $scope.display = function() {
            $scope.step = 1;
            
            BdLeadsService.getDictionary("Province").then(function (result) {
                $scope.provinceList = result.data;
                console.dir($scope.provinceList);
            });
            BdLeadsService.getDictionary('Gender').then(function (result) {
                $scope.genderList = result.data;
            });
            BdLeadsService.getDictionary('Education').then(function (result) {
                $scope.educationList = result.data;
            });

            var promise = BdApplicationService.detail($routeParams.id);
            promise.then(function(data) {
                $scope.detail = data;
                if($scope.detail.province) {
                    $scope.provinceChanged($scope.detail.province);
                }
                if($scope.detail.city) {
                    $scope.cityChanged($scope.detail.city);
                }
                if($scope.detail.education_time) {
                    $scope.detail.education_time = new Date($scope.detail.education_time);
                }
                if($scope.detail.work1_time) {
                    $scope.detail.work1_time = new Date($scope.detail.work1_time);
                }
                if($scope.detail.work2_time) {
                    $scope.detail.work2_time = new Date($scope.detail.work2_time);
                }
                if($scope.detail.work3_time) {
                    $scope.detail.work3_time = new Date($scope.detail.work3_time);
                }
                if($scope.detail.work4_time) {
                    $scope.detail.work4_time = new Date($scope.detail.work4_time);
                }
                if($scope.detail.work5_time) {
                    $scope.detail.work5_time = new Date($scope.detail.work5_time);
                }
                console.dir($scope.detail);
            });
            

        }
        $scope.display();

        $scope.back = function() {
            if($scope.step >=2 && $scope.step <= 3)
                $scope.step -= 1;
        }

        $scope.next = function() {
            if($scope.step !=1 && $scope.step != 2)
                return
            if($scope.step == 1) {
                if(!$scope.detail.name) {
                    showAlert("请输入申请者姓名");
                    return;
                } else if(!$scope.detail.province || !$scope.detail.city || !$scope.detail.area) {
                    showAlert("请选择城市");
                    return;
                } else if(!$scope.detail.address) {
                    showAlert("请输入家庭住址");
                    return;
                } else if(!$scope.detail.tellphone) {
                    showAlert("请输入家庭电话");
                    return;
                } else if(!$scope.detail.cellphone) {
                    showAlert("请输入移动电话");
                    return;
                } else if(!$scope.detail.fax) {
                    showAlert("请输入传真");
                    return;
                } else if(!$scope.detail.email) {
                    showAlert("请输入邮件");
                    return;
                } else if(!$scope.detail.weixin_no) {
                    showAlert("请输入微信号/微博");
                    return;
                }
            } else if($scope.step == 2) {
                if(!$scope.detail.age) {
                    showAlert("请输入年龄");
                    return;
                } else if(!$scope.detail.gender) {
                    showAlert("请选择性别");
                    return;
                } else if(!$scope.detail.birth_place) {
                    showAlert("请输入籍贯")
                    return;
                } else if(!$scope.detail.marriage) {
                    showAlert("请输入婚姻状况")
                    return;
                } else if(!$scope.detail.annual_income) {
                    showAlert("请输入个人年收入")
                    return;
                } else if(!$scope.detail.family_annual_income) {
                    showAlert("请输入家庭年收入")
                    return;
                } else if(!$scope.detail.hobby) {
                    showAlert("请输入兴趣")
                    return;
                } else if(!$scope.detail.speciality) {
                    showAlert("请输入特长")
                    return;
                }
            }

            $scope.step += 1;
        }

        $scope.save = function() {
            if(!$scope.detail.q1_A && !$scope.detail.q1_B && !$scope.detail.q1_C && !$scope.detail.q1_D) {
                showAlert("请回答第1题");
                return;
            } else if($scope.detail.q1_B && !$scope.detail.q1_program) {
                showAlert("请填写节目名称");
                return;
            } else if($scope.detail.q1_D && !$scope.detail.q1_channel) {
                showAlert("请填写渠道");
                return;
            }

            if(!$scope.detail.q2_A && !$scope.detail.q2_B && !$scope.detail.q2_C && !$scope.detail.q2_D
                && !$scope.detail.q2_E && !$scope.detail.q2_F && !$scope.detail.q2_G && !$scope.detail.q2_H) {
                showAlert("请回答第2题");
                return;
            } else if($scope.detail.q2_H && !$scope.detail.q2_other) {
                showAlert("请填写其他原因");
                return;
            }

            if(!$scope.detail.q3) {
                showAlert("请回答第3题");
                return;
            }

            if(!$scope.detail.q4) {
                showAlert("请回答第4题");
                return;
            }

            if(!$scope.detail.q5) {
                showAlert("请回答第5题");
                return;
            }

            if(!$scope.detail.q6_A && !$scope.detail.q6_B && !$scope.detail.q6_C && !$scope.detail.q6_D) {
                showAlert("请回答第6题");
                return;
            }

            if(!$scope.detail.q7_A && !$scope.detail.q7_B && !$scope.detail.q7_C && !$scope.detail.q7_D) {
                showAlert("请回答第7题");
                return;
            }

            if(!$scope.detail.q8_A && !$scope.detail.q8_B && !$scope.detail.q8_C && !$scope.detail.q8_D
                && !$scope.detail.q8_E && !$scope.detail.q8_F && !$scope.detail.q8_G) {
                showAlert("请回答第8题");
                return;
            }

            if(!$scope.detail.q9) {
                showAlert("请回答第9题");
                return;
            }

            if(!$scope.detail.q10_A && !$scope.detail.q10_B && !$scope.detail.q10_C && !$scope.detail.q10_D) {
                showAlert("请回答第10题");
                return;
            }

            if(!$scope.detail.q11) {
                showAlert("请回答第11题");
                return;
            }

            if(!$scope.detail.q12_first) {
                showAlert("请回答第12题的第一选择");
                return;
            } else if(!$scope.detail.q12_second) {
                showAlert("请回答第12题的第二选择");
                return;
            }

            if(!$scope.detail.q13) {
                showAlert("请回答第13题");
                return;
            }

            if(!$scope.detail.q14) {
                showAlert("请回答第14题");
                return;
            }

            if(!$scope.detail.q15) {
                showAlert("请回答第15题");
                return;
            }

            SweetAlert.swal({
                  title: "确定要提交吗？",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: '#DD6B55',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  closeOnConfirm: true
              }, function(confirm) {
                  if (confirm) {
                    var promise = BdApplicationService.save($scope.detail);
                    promise.then(function(data) {
                        if(data.status == 'FAILURE'){
                            showAlert("添加申请表失败");
                            return false;
                        }
                        showAlert("添加成功");
                    }, function(error) {
                        showAlert("添加申请表失败");
                    });
                  }
              }
            );

        }
        
        function showAlert(msg) {
            alert(msg);
        }


        $scope.provinceChanged = function(){
            if($scope.detail.province){
                BdLeadsService.getDictionary("City",$scope.detail.province).then(function (result) {
                    $scope.cityList = result.data;
                });
            }else{
                $scope.cityList = [];
            }
        };

        $scope.cityChanged = function(){
            if($scope.detail.city){
                BdLeadsService.getDictionary("Area",$scope.detail.city).then(function (result) {
                    $scope.areaList = result.data;
                });
            }else{
                $scope.areaList =[];
            }
        };

    }
]);
