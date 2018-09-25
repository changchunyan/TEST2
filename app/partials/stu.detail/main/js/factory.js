/**
 * Created by 李世明 on 2016/12/30 0030.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:新学员详情服务
 */
angular.module('ywsApp').factory('StuDetail', ['$mtModal','CommonService', function ($mtModal,CommonService) {
    var  v = '?v='+Date.now()
    var StuDetail = {
        scope: {},
        /**
         * 初始化table选项卡
         * 如果不传index则默认选中第一个，否则选中所传入得index选项卡
         * @param scope
         * 控制器作用域
         * @param tabelDatas
         * {
               title: '基本信息',   //  tabel切换拦标题
               clickFun: this.scope.getIntegralList,  //  点击tabel执行的方法
           }
         * 选项卡标题数组
         * @param index
         * 默认选中选项卡索引
         */
        init: function (scope,tabelDatas,index) {
            this.scope = scope
            if(!tabelDatas){
                tabelDatas = this.stuDetail
            }
            for(var i = 0 ,len = tabelDatas.length ; i < len; i++){
                tabelDatas[i].id = i
                tabelDatas[i].show = 1
                tabelDatas[i].select = 0
            }
            index = index>=0?index:0
            tabelDatas[index].select = 1
            this.scope.loadUrl = tabelDatas[index].url
            return tabelDatas
        },
        stuDetail: [
                // {
                //     title: '基本信息',   //  tabel切换拦标题
                //     clickFun: function () {
                //         StuDetail.scope._detail_(StuDetail.scope.__detail)
                //         StuDetail.scope.isLock();
                //     },
                //     url:'partials/stu.detail/main/tpl/leads/info.html'+v
                // },
                // {
                //     title: '家庭信息',
                //     clickFun: function () {
                //         StuDetail.scope._detail_(StuDetail.scope.__detail)
                //         CommonService.getProvinceSelect().then(function (result) {
                //             StuDetail.scope.provinceList = result.data;
                //             StuDetail.scope.isLock();
                //         });
                //     },
                //     url:'partials/stu.detail/main/tpl/family.info.html'+v
                // },
                {
                    title: '记录管理',
                    clickFun: '',
                    url:'partials/stu.detail/main/tpl/recording.html'+v
                }
            ]
    }
    return StuDetail
}])
