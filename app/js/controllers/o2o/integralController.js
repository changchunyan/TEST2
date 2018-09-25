/**
 * Created by 李世明 on 2016/12/1 0001.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:积分管理
 */
angular.module('ywsApp').controller('integralController',['$scope', '$mtModal', '$rootScope','integralServer','$sce',function ($scope,$mtModal,$rootScope,integralServer,$sce) {
    /**
     *  查询前配置
     * @param tableState
     * tableState对象中包含sort排序信息以及search搜索信息
     * @private
     */
    function _pageBefore(tableState) {
        $scope.tableState = tableState||{};//tableState对象中包含sort排序信息以及search搜索信息
        $scope.isLoading = true;    //控制数据加载状态
        $scope.tableState.pagination = $scope.tableState.pagination||{}
        $scope.tableState.pagination.start = $scope.tableState.pagination.start||0     //从第几条数据开始查询，默认0条
        $scope.tableState.pagination.number = $scope.tableState.pagination.number||10   //每页显示条数
    }
    /**
     *  查询后配置
     * @param tableState
     * tableState对象中包含sort排序信息以及search搜索信息
     * @param result
     * 查询结果
     * @private
     */
    function _pageAfter(tableState,result) {
        $scope.tableState.pagination.numberOfPages = result.numberOfPages;
        $scope.isLoading = false;
        // console.log("tableState信息：",$scope.tableState);
    }
    /**
     *  获取积分明细
     * @param tableState
     */
    $scope.getIntegralList = function (tableState) {
        _pageBefore(tableState)
        //数据获取函数
        integralServer.getIntegealList($scope.tableState).then(function(result) {
            // console.log(result);
            $scope.integralList = result.data
            _pageAfter(tableState,result)
        });
    }

    //smart-table配置变量
    $scope.integralList = [];
    $scope.selectIndex = 0;
    /**
     * 获取积分规则
     * @param tableState
     */
    $scope.getIntegralRuleList = function (tableState) {
        _pageBefore(tableState)
        //数据获取函数
        integralServer.getIntegealRulesList($scope.tableState).then(function(result) {
            // console.log(result);
            // $scope.integralRulesList = result.data
            var _list = angular.copy(result.data)
            for(var i = 0 , len = _list.length ; i< len ; i++){
                try{
                    _list[i].desp = JSON.parse(_list[i].desp)
                }catch (e){
                    _list[i].desp = {
                        text:'',
                        Num:''
                    }
                    console.log('数据错误')
                }
            }
            $scope.integralRulesList = _list
            _pageAfter(tableState,result)
        });
    }
    $scope.mtSrc = ''
    var _dealWithDetail = function () {
        /*
        TODO：=====================================================================
        * 第一类：只有一个输入框或者默认只带一个输入框：id=1|2|4|5|7|8|9
        * 第二类：带点击添加并且只有一个输入框：id=8
        * 第三类：带点击添加并且添加内容有两个个输入框：id=5
        * 第四类：直接带两个个输入框：id=3
        * */

    }
    $scope.getRulesGroupById = function (row) {
        $scope.mtTitle = row.name
        $scope.detail = angular.copy(row)
        // _dealWithDetail()
        $scope.mtTitle = $scope.detail.group_name
        integralServer.getRulesGroupById(row.group_id).then(function (data) {

            var _list = angular.copy(data.data)
            for(var i = 0 , len = _list.length ; i< len ; i++){
                _list[i].desp = JSON.parse(_list[i].desp)
            }
            $scope.list = _list
        })
        $scope.mtSrc = 'partials/o2o/info/modal.rule.html?v='+Date.now()
        $scope.zore = 0
        $mtModal.moreModalHtml({
            scope:$scope,
            hasNext:function () {
                //保存操作
                var newObj = angular.copy($scope.list)
                for(var i = 0 , len = newObj.length ; i<len ; i++){
                    if(!parseInt(newObj[i].desp.value)||(!newObj[i].desp.Num&&newObj[i].desp.Num!=undefined)){
                        $scope.zore = 1
                        return false
                    }
                    newObj[i].value = newObj[i].desp.value
                    newObj[i].desp = JSON.stringify(newObj[i].desp)
                }
                $scope.zore = 0
                integralServer.add(newObj).then(function (data) {
                    $scope.mtResultModal.hide()
                    $scope.getIntegralRuleList($scope.tableState)
                })
            },
            refresh:function () {
                $scope.getIntegralRuleList($scope.tableState)
            },
            width:'600px',
            height:'230px'
        })
    }
    $scope.changeRuleState = function (row) {
        var obj = angular.copy(row)
        obj.state = Number(!row.state,10)
        integralServer.update(obj).then(function (data) {
            $scope.getIntegralRuleList($scope.tableState)
        })
    }
    $scope.add = function add(){
        if($scope.detail.group_id==8&&$scope.list.length==5){
            return false
        }else{
            var obj = angular.copy($scope.list[0])
            obj.id = ''
            obj.value = ''
            obj.desp = {}
            $scope.list.push(obj)
        }
    }
    $scope.getDespList = function (two) {
        return two.text?two.text.replace(/Num/,two.Num).replace(/value/,two.value):''
    }
    $scope.deleteListByIndex = function (index) {
        $scope.list.splice(index,1)
    }
    $scope.tabelDatas = [
        {
            title:'积分明细',   //  tabel切换拦标题
            clickFun:$scope.getIntegralList,  //  点击tabel执行的方法
            show:1,             //  控制是否显示
            id:0,               //  标识
            select:1            //  是否选中，默认会选中第一个
        },
        {
            title:'积分规则',
            clickFun:$scope.getIntegralRuleList,
            show:1,
            id:1,
            select:0
        }
    ]
}])