'use strict';

/**
 * The BdLeads management controller.
 *
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').controller('BdLeadEditController', ['$scope', '$location','BdLeadsService','CommonService', '$modal', '$rootScope', 'SweetAlert',
  'BdRemindService','BdCommunicationService','BdInvitationService','localStorageService','AuthenticationService', '$routeParams','$optionData',
  function($scope, $location,BdLeadsService, CommonService,$modal, $rootScope, SweetAlert,BdRemindService,BdCommunicationService,BdInvitationService,localStorageService,AuthenticationService,$routeParams,$optionData) {
      $scope.isAdding = false;
      $scope.isEditing = false;
      $scope.leadId = $routeParams.id;
      $scope.BdLeadsVo = {};
      //各种下拉数据list
      $scope.customerStatusList = [];
      $scope.customerTypeList = [];
      $scope.projectList = [];
      $scope.mediaList = [];
      $scope.provinceList = [];
      $scope.cityList = [];
      $scope.areaList = [];
      $scope.educationList = [];
      $scope.investPropList = [];
      $scope.investTypeList = [];
      $scope.genderList = [];
      $scope.mediaOriginList = [];
      $scope.haveChildList = [];
      $scope.marreyList = [];
      $scope.mediaDetailList = [];
      $scope.mediaEffectList = [];
      $scope.professionBackgroundList = [];
      $scope.investAbilityList = [];
      $scope.communicationTypeList = [];
      $scope.interestList = [];
      $scope.joinReasonList = [];
      $scope.intentionList = [];
      //end

      $scope.BdRemindVoForCreate = {};
      //加载下拉list数据
      //$optionData.initData($scope);
      $scope.getBdLead = function() {
          $scope.isAdding = false;
          $scope.isEditing = false;
          BdLeadsService.getDictionary("joinreason").then(function (result) {
              $scope.joinReasonList = result.data;
          });
          BdLeadsService.getDictionary("intention").then(function (result) {
              $scope.intentionList = result.data;
          });
          BdLeadsService.getDictionary("communicationtype").then(function (result) {
              $scope.communicationTypeList = result.data;
          });
          BdLeadsService.getDictionary("interest").then(function (result) {
              $scope.interestList = result.data;
          });
          BdLeadsService.getDictionary("Province").then(function (result) {
              $scope.provinceList = result.data;
          });
          BdLeadsService.getDictionary("CustomerStatus").then(function (result) {
              $scope.customerStatusList = result.data;
          });
          BdLeadsService.getDictionary("CustomerType").then(function (result) {
              $scope.customerTypeList = result.data;
          });
          BdLeadsService.getDictionary("Project").then(function (result) {
              $scope.projectList = result.data;
          });
          BdLeadsService.getDictionary("MARRIED").then(function (result) {
              $scope.marreyList = result.data;
          });
          BdLeadsService.getDictionary("HaveChild").then(function (result) {
              $scope.haveChildList = result.data;
          });
          //BdLeadsService.getDictionary("Media").then(function (result) {
          //    $scope.mediaList = result.data;
          //});
          BdLeadsService.getDictionary("Education").then(function (result) {
              $scope.educationList = result.data;
          });
          BdLeadsService.getDictionary("InvestProp").then(function (result) {
              $scope.investPropList = result.data;
          });
          BdLeadsService.getDictionary("InvestType").then(function (result) {
              $scope.investTypeList = result.data;
          });
          BdLeadsService.getDictionary("Gender").then(function (result) {
              $scope.genderList = result.data;
          });

          BdLeadsService.getDictionary("MediaOrigin").then(function (result) {
              console.log(result.data);
              $scope.mediaOriginList = result.data;
          });
          BdLeadsService.getDictionary("MediaEffect").then(function (result) {
              $scope.mediaEffectList = result.data;
          });
          BdLeadsService.getDictionary("ProfessionBackground").then(function (result) {
              $scope.professionBackgroundList = result.data;
          });
          BdLeadsService.getDictionary("InvestAbility").then(function (result) {
              $scope.investAbilityList = result.data;
          });

          if($scope.leadId == null || $scope.leadId == 0) {
              $scope.isAdding = true;
              $scope.BdLeadsVo = {};
              $scope.BdLeadsVo.customer_status = 1;
              return;
          } else {
              $scope.isEditing = true;

              BdLeadsService.detail($scope.leadId).then(function(result){
                  $scope.BdLeadsVo = result;
                  BdLeadsService.getDictionary("MediaDetail",$scope.BdLeadsVo.mediaOrigin).then(function (result) {
                      $scope.mediaDetailList = result.data;
                  });
                  if($scope.BdLeadsVo.province){
                      BdLeadsService.getDictionary("City",$scope.BdLeadsVo.province).then(function (result) {
                          $scope.cityList = result.data;
                      });
                  }else{
                      $scope.cityList =[];
                  }
                  if($scope.BdLeadsVo.city){
                      BdLeadsService.getDictionary("Area",$scope.BdLeadsVo.city).then(function (result) {
                          $scope.areaList = result.data;
                      });
                  }else{
                      $scope.areaList =[];
                  }
                  //BdLeadsService.getDictionary("Area",$scope.BdLeadsVo.city).then(function (result) {
                  //    $scope.areaList = result.data;
                  //});
                  //BdLeadsService.getDictionary("MediaDetail",$scope.BdLeadsVo.mediaOrigin).then(function (result) {
                  //    $scope.areaList = result.data;
                  //});
              });
          }
      };

      $scope.saveLead = function saveLead(){
          var promise = BdLeadsService.save($scope.BdLeadsVo);
          promise.then(function(response) {
              console.log(response);
              if(response.status == 'FAILURE'){
                  if( response.data ){
                      SweetAlert.swal(response.data);
                  }else{
                      SweetAlert.swal(response.error);
                  }
                  return false;
              }

              if( response.data != null && response.data.addRemind == 1 ){
                  $scope.modalAdd = $modal({title: '已存在，添加提醒',scope: $scope, templateUrl: 'partials/bd/leads/model.remind2.html', show: true });
                  $scope.remindLead = response.data;
                  return false;
              }

              $scope.BdLeadsVo = {};
              $scope.showListView();
          }, function(error) {
              alert("创建招商Leads失败");
          });
      };

      $scope.getBdLead();

      $scope.provinceChangeForAdd = function(){
          if($scope.BdLeadsVo.province){
              BdLeadsService.getDictionary("City",$scope.BdLeadsVo.province).then(function (result) {
                  $scope.cityList = result.data;
              });
          }else{
              $scope.cityList = [];
          }
      };

      $scope.cityChangeForAdd = function(){
          if($scope.BdLeadsVo.city){
              BdLeadsService.getDictionary("Area",$scope.BdLeadsVo.city).then(function (result) {
                  $scope.areaList = result.data;
              });
          }else{
              $scope.areaList =[];
          }
      };

      $scope.mediaDetailChangeForAdd = function(){
          if($scope.BdLeadsVo.mediaOrigin){
              BdLeadsService.getDictionary("MediaDetail",$scope.BdLeadsVo.mediaOrigin).then(function (result) {
                  $scope.mediaDetailList = result.data;
              });
          }else{
              $scope.mediaDetailList =[];
          }
      };

      $scope.saveRemind = function(){
          $scope.dataLoading = true;
          $scope.BdRemindVoForCreate.personId = $scope.remindLead.bd_lead_id;
          $scope.BdRemindVoForCreate.remindTime = new Date();
          var promise = BdRemindService.create2($scope.BdRemindVoForCreate);
          promise.then(function(data) {
              $scope.dataLoading = false;
              $scope.modalAdd.hide();
              if(data.status == 'FAILURE'){
                  SweetAlert.swal(data.error);
                  return false;
              }
              $scope.BdLeadsVo = {};
              $scope.BdRemindVoForCreate = {};
              $scope.showListView();
          }, function(error) {
              SweetAlert.swal("添加失败");
              $scope.dataLoading = false;
          });

      };

      $scope.showListView = function() {
    	  
    	if($routeParams.bak)
      		$location.path("/bd-admin/leads_list/"+$routeParams.bak);
      	else
      		$location.path("/bd-admin/leads_list");
      }
  }
]);
