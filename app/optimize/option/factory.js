/**
 * Created by 李世明 on 2016/12/2 0002.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:
 */
'use strict';
angular.module('ywsApp').factory('$optionData',['BdLeadsService',function (BdLeadsService) {
    var _obj = {
        id:'',
        code:'',
        type:'communicationtype',
        name:'未标记'
    }
    var _mtInit = {
        initData:function ($scope) {
            BdLeadsService.getDictionary("joinreason").then(function (result) {
                $scope.joinReasonList = result.data;
            });
            BdLeadsService.getDictionary("intention").then(function (result) {
                $scope.intentionList = result.data;
            });
            BdLeadsService.getDictionary("communicationtype").then(function (result) {
                $scope.communicationTypeList = result.data;
                /*用于列表中修改沟通类型*/
                $scope.communicationList = angular.copy(result.data);
                $scope.communicationList.push(_obj)
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
                /*用于列表中修改沟通类型*/
                $scope._customerTypeList = angular.copy(result.data);
                var _this = angular.copy(_obj)
                _this.type = 'CustomerType'
                $scope._customerTypeList.push(_this)
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
        }
    }
    return _mtInit
}])
