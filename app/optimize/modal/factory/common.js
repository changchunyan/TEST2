/**
 * Created by 李世明 on 2016/11/12 0012.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:公共弹框服务接口
 */
'use strict';

angular.module('ywsApp').factory('$mtModal', ['$modal','$sce',function ($modal,$sce) {
        var _modal =  {
            /**
             * 公共弹框加载函数
             * @param url
             * 传递需要加载的url
             * @param scope
             * 作用域
             * @returns {*}
             */
            modal: function (url,scope) {
                return $modal({
                    scope: scope,
                    templateUrl: url + '?' + new Date().getTime(),
                    show: true,
                    backdrop: "static"
                });
            },
            /**
             * TODO:不再维护，使用下面的扩展方法
             * 警告框和成功提示框使用说明:
             * moreModal(arg)
             * arg:{
             *  scope:$scope,
             *  status:1|0, //状态参数1:成功，0：失败;
             *  text:'',    //提示内容,默认为'操作成功';
             *  hasNext:funtion(){},    //可选，多层提示框专用
             *  refresh:function(){}    //  可选，用于操作完成后刷新
             * }
             * @private
             */
            moreModal:function (arg) {
                var _arg = this.setParam(arg),
                    scope = arg.scope
                scope.mtImg = _arg.status ? mtResultIcon.success : mtResultIcon.warning
                this._dealWith(scope,_arg)
            },
            scope:'',
            /**
             * 警告框和成功提示框使用说明:
             * 使用和moreModal方法类似，额外接受width属性，自由控制宽度
             * @param arg
             */
            moreModalHtml :function (arg) {
                var text = arg.text?arg.text:0
                this.scope = arg.scope
                this._setStatus(arg.status)
                var _arg = this.setParam(arg),
                    scope = arg.scope
                if(!text){
                    _arg.text = ''
                }
                this._dealWith(scope,_arg,1)
            },
            /**
             * 统一处理
             * @param scope
             * @param _arg
             * @private
             */
            _dealWith:function (scope,_arg) {
                scope.mtContent = _arg.text
                scope.mtHtml = $sce.trustAsHtml(_arg.mtHtml)
                try{
                    scope.mtResultModal.hide()
                }catch (e){}
                if (_arg.hasNext && typeof _arg.hasNext == 'function') {
                    scope.hasNext = _arg.hasNext
                }else{
                    this.future(_arg.refresh)
                    scope.hasNext = null
                }
                if(arguments.length==3){
                    scope.mtResultModal = this.modal(mtResultIcon.modalHtml,scope)
                }else{
                    scope.mtResultModal = this.modal(mtResultIcon.html,scope)
                }
                if(_arg.cancel){
                    scope.cancelModal = _arg.cancel
                }else{
                    scope.cancelModal = scope.mtResultModal.hide
                }
                if(_arg.width){
                    scope.mtWidth = {width:_arg.width}
                }else{
                    scope.mtWidth = {}
                }
                if(_arg.height){
                    scope.mtHeight = {'min-height':_arg.height}
                }else{
                    scope.mtHeight = {}
                }
            },
            /**
             * 设置默认参数
             * @param arg
             * @returns {{}}
             */
            setParam:function (arg) {
                var _arg = {}
                if(arg){
                    _arg = {
                        status:arg.status||0,
                        text:arg.text||'操作成功',
                        refresh:arg.refresh||undefined,
                        hasNext:arg.hasNext||undefined,
                        cancel:arg.cancel||undefined,
                        mtHtml:arg.html||undefined,
                        width:arg.width||'',
                        height:arg.height||''
                    }
                }else{
                    _arg = {
                        status:1,
                        text:'操作成功'
                    }
                }
                return _arg
            },
            _setStatus:function (arg) {
                switch (arg){
                    case 0:
                        this.scope.mtImg = mtResultIcon.warning;
                        break;
                    case 1:
                        this.scope.mtImg = mtResultIcon.warning;
                        break;
                    default:
                        this.scope.mtImg = '';
                        break;
                }
            },
            /**
             * 将来某个时间段执行
             * @param arg
             * 函数
             */
            future:function (arg) {
                setTimeout(function () {
                    if(arg){
                        arg()
                    }
                },100)
            }
        }
        return _modal
    }])