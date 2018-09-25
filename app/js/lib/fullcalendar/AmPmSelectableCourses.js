/**
 * Created by 毅 on 2015/10/28.
 */
$(document).ready(function() {

    var _events =[];
    var _events_add = [];
    var addBatchCourse =[];
    var calendar ;
    var isSubmit = false;
    var residue_number ;
    var pastcourse=0;
    var planCourses = 0;//已经排课数
    //工具类 创建命名空间
    var UtilFullCalendar = UtilFullCalendar || {};
    var defaultPlanCourse = 0;
    //比对时间冲突
    UtilFullCalendar.compare = function(_events,_start,_end){//_events 选中课程源
        _start = Date.parse(_start);
        _end = Date.parse(_end);
        for(var i= 0;i<_events.length;i++){
            if(_start<_events[i].start){
                if(_end>_events[i].start)
                    return false;
            }else{
                if(_start<_events[i].end){
                    return false;
                }
            }

        }
        return true;
    };
    UtilFullCalendar.deleteCourse = function(id){
        var eve =_events_add;
        for(var i=0;i<eve.length;i++){
            if(id == eve[i].id){
                //setShowTopRightAdd(eve[i].start,eve[i].end);
                _events_add.splice(i,1);
                return true;
            }
        }
        return false;
    };
    UtilFullCalendar.deleteStormCourse = function(id){
        var eve = _events;
        for(var i=0;i<eve.length;i++){
            if(id == eve[i].id){
                //setShowTopRightAdd(eve[i].start,eve[i].end);
                eve.splice(i,1);
                return true;
            }
        }
        return false;
    };
    UtilFullCalendar.alterCourse = function(id,course){
        UtilFullCalendar.deleteCourse(id);
        _events_add.push(course);
    };
    UtilFullCalendar.getCurrentCourse = function(start,end){
        var oneHour = 60 * 60 * 1000;
        return (end-start)/oneHour;
    };
    UtilFullCalendar.setButtonDisabled = function(select){
        $(select).prop('disabled',true);
        $(select).removeClass('btn-success');
    };
    UtilFullCalendar.setButtonDisabledFalse = function(select){
        $(select).prop('disabled',false);
        $(select).addClass('btn-success');
    };

//---------------------------------------------------------------------------------------------------------
    var teacher ={
        name:coursePlanParams.teacherName
    };
    var isListening = false;
    var isNotEditCourse = false;
    (function init(){
        //looktg();//返回上一页
        $('#js-total-hour').html(coursePlanParams.classTime);//总课时
        $('#js-destroy-hour').html(coursePlanParams.destroyTime);//待销课时
      /*  <label>总课时<span id="js-total-hour" class="label label-primary">10</span> </label>
        <label >待排课时<span id="js-residue-hour" class="label label-success">10</span> </label>
        <label >待销课时<span id="js-destroy-hour" class="label label-warning">10</span> </label>
*/
        isListening = coursePlanParams.isListening;
        isNotEditCourse = coursePlanParams.isNotEditCourse;
        /*当前排课信息按钮都显示
        if(isNotEditCourse){
            setNotEditCourse();
        }*/
        setResidueNumber();
        isShowSubmit();
        UtilFullCalendar.setButtonDisabled('#clearBatch');
        //showTopRight();
        $('#js-residue-hour').html(residue_number);
    })();
    function setNotEditCourse(){
        $('.isEditShow').hide();
    }

//----------------------------------------核心方法-----------------------------------------------------------------
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaWeek'
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        firstDay: 1,
        minTime:'6:00',//开始时间
        maxTime:'24:00',//结束时间
        slotDuration:'06:00:00',
        buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
            prev: '上一周',
            next: '下一周'
        },
        // time formats
        titleFormat: {
            week: "YYYY年MMMD日"
        },
        defaultView:'agendaWeek',//默认视图
        allDaySlot:false,//是否在日历上方显示all-day(全天)
        defaultDate: new Date(),
        timezone:'local',
        //firstHour:6,//默认开始时间
        selectable: true,
        height: 450,
        contentHeight:500,
        slotEventOverlap:false,//设置视图中的事件显示是否可以重叠覆盖
        selectHelper: true,
        editable: false,//判断该日程能否拖动
        //forceEventDuration:true,
        select: function(start, end) {//添加课程
            if(start < new Date()){
                /*alert('时间已经过去,您不能添加');*/
                swal({   title: "不能添加!",   text: "时间已经过去!",   type: "warning" });
                $('#calendar').fullCalendar('unselect');
                return false;
            }

            var _start =start.format();
            var _end = end.format();
            var hour = UtilFullCalendar.getCurrentCourse((Date.parse(_start)),(Date.parse(_end)));
            pastourse=pastcourse+parseFloat(hour);
            pastcourse=pastcourse+parseFloat(hour);

            //修改
            if(!UtilFullCalendar.compare(_events,_start,_end)){
                /*alert('时间相冲');*/
                swal({   title: "不能添加!",   text: "时间相冲!",   type: "warning" });
                $('#calendar').fullCalendar('unselect');
                return false;
            }
            if(!UtilFullCalendar.compare(_events_add,_start,_end)){
                /*alert('时间相冲');*/
                swal({   title: "不能添加!",   text: "时间相冲!",   type: "warning" });
                $('#calendar').fullCalendar('unselect');
                return false;
            }
            //if(!isHour(Date.parse(_start),Date.parse(_end)) ){
            //    alert('您没有课时了');
            //    $('#calendar').fullCalendar('unselect');
            //    return;
            //}
            var r = true;
            var eventData;
            eventData = {
                //title: "老师："+coursePlanParams.teacherID,
                title: "",
                start: Date.parse(start.format()),
                end: Date.parse(end.format()),
                teacherId:coursePlanParams.teacherID,
                id:getRandTime(),
                backgroundColor:getBackgroundWeek(start.format())
            };
            var _eventData = eventData;
          /*  var _eventData ={
                //title: "老师："+teacher.name+"\n学生："+coursePlanParams.studentName,
                title: "老师：",
                start: Date.parse(start.format()),
                end: Date.parse(end.format()),
                teacherId:coursePlanParams.teacherID,
                id:(Date.parse(new Date()))
                //backgroundColor:getBackgroundWeek(start)
            };*/
            _events_add.push(_eventData);
            //setShowTopRight(Date.parse(start.format()),Date.parse(end.format()));

            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            isSubmit = true;
            isShowSubmit();


            $('#calendar').fullCalendar('unselect');
        },
        eventClick:function(event){//
            var s = event.editable;
            var id = event.id;
            if(typeof(s)!="undefined"&&s!=null&&!s){
                /*alert('您没有删除权限');*/
                swal({   title: "不能删除!",   text: "您没有删除权限",   type: "warning" });
            }else{
                var r=confirm("确认删除课程！");
                if (r==true)
                {
                    deleteCourse(event);
                }
            }
           /* UtilFullCalendar.deleteCourse(event.id);
            $('#calendar').fullCalendar( 'removeEvents' ,event.id );*/
        },
        eventStartEditable:false,
        eventLimit: true, // allow "more" link when too many events
        loading:function(){
            $("#calendar").fullCalendar('refetchEvent');
        },
        eventMouseover:function(event,obj,view ){
            var node = $(obj.currentTarget);
            var content = '时间 : '+node.find('.fc-time').text()+'<br />'+ node.find('.fc-title').html();
            node.webuiPopover({content:content,trigger:'hover'});

        },
        events: function (start, end, timezone, callback) {//页面加载时触发 加载数据
            $.ajax({
                url: config.endpoints.sos.teacher+'/getAvailableCourseTime',
                //url:'js/lib/loading.json',
                type:'GET',
                dataType:"json",
                contentType:"application/json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", getToken());
                },
                headers: {
                    "Authorization":getToken()
                },
                //coursePlanParams.teacherID
                data:
                    {
                        "teacherId":coursePlanParams.teacherID,
                        "t":new Date().getTime()//添加时间戳
                    },
                success: function (data) {
                    var events = [];
                    if(check_null(data)){
                        $.each(data.data, function (name, item) {
                            events.push({
                                id: item.id,
                                title: "",
                                start: (item.startTime),
                                end: (item.endTime),// will be parsed
                                editable: true
                                //backgroundColor:isBackColor(item.is_past)

                            });
                        });
                    }
                    _events = events;

                    //$("#calendar").fullCalendar('renderEvent',events,true);
                    $('#calendar').fullCalendar('option', 'height', 700);
                    callback(events);
                    //$("#calendar").fullCalendar( 'refetchEvents' );
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    console.log('error:{textStatus:'+textStatus+',errorThrown:'+errorThrown+'}');
                }
            });
        }
    });
    function isBackColor(s){
        if(typeof(s)!="undefined"&&s!=null){
            var isGrey = s;
            if( isGrey){
                return '#080808'
            }
        }
        return '#00CC00'
    }
    function getBackgroundWeek(course){
        if(compareDateOnWeek(course)){
            return '#00CC00';
        }
        return ''
    }


    //最终提交
    $('#js-submit').on('click',function(){

        var planCourses = parseFloat(defaultPlanCourse)-parseFloat(residue_number);
        UtilFullCalendar.setButtonDisabled('#js-submit');
        $.ajax({
            url: config.endpoints.sos.teacher+'/createAvailableCourseTime',
            //url:'test/date/loading.json',
            type:'POST',
            dataType:"json",
            contentType:"application/json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", getToken());
            },
            headers: {
                "Authorization":getToken()
            },
            data: JSON.stringify(//请求参数 上一页面传来
                {
                    /*"type":coursePlanParams.type,
                    "teacherName":coursePlanParams.teacherName,
                    "subjectId":coursePlanParams.subjectID,
                    "studentName":coursePlanParams.studentName,
                    "crmCustomerGroupId":coursePlanParams.groupID,
                    "classTime":coursePlanParams.classTime,
                    "crmOrderIds":coursePlanParams.ordcourseID,
                    "coursetime":_events_add,
                    "crmStudentId":coursePlanParams.studentID,
                    "userId":coursePlanParams.teacherID,
                    "schoolId":coursePlanParams.schoolID,
                    "residuenumber":planCourses*/
                    "teacherId":coursePlanParams.teacherID,
                    "coursetime":_events_add
                }),
            success: function (data) {
              /*  alert("排课成功");*/
                swal({   title: "成功!",   text: "排课成功!",   type: "success" });
                //_toBeforePage();
                _closePage();
                UtilFullCalendar.setButtonDisabledFalse('#js-submit');
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log('error:{textStatus:'+textStatus+',errorThrown:'+errorThrown+'}');
            }
        });
    });
    //批量排课
    $('#batch').on('click',function(){
        var all_week = _events_add.length;
        var week = parseFloat($('#setWeek').val());
        var totalHour =0;
        for(var index;index<_events_add.length;index++){
            totalHour +=  (_events_add[index].end.valueOf() - _events_add[index].start.valueOf())*(parseFloat(week)-1);
        }
        var shengyu = residue_number*60*60*1000;


        /*if(shengyu < totalHour){
            alert('超出了！');
            $('#setWeek').focus();
            return;
        }*/
        var datas =[];
        datas = _events_add.slice();
        for(var x=0;x<datas.length;x++){//判断是否是一周内时间
            if(!compareDateOnWeek(datas[x].start)){
                datas.splice(x,1);
            }
        }
        //批量排课时间冲突
        for(var i=0;i<(week-1);i++){
            for(var j=0;j<datas.length;j++){
                var _eventData ={
                    title: teacher.name,
                    start: new Date(addDay(datas[j].start,7*(i+1))),
                    end: new Date(addDay(datas[j].end,7*(i+1)))
                };
                if(!UtilFullCalendar.compare(_events,_eventData.start,_eventData.end)){
                    /*alert('时间相冲');*/
                    swal({   title: "不能添加!",   text: "时间相冲",   type: "warning" });
                    return false;
                }
                if(!UtilFullCalendar.compare(_events_add,_eventData.start,_eventData.end)){
                    /*alert('时间相冲');*/
                    swal({   title: "不能添加!",   text: "时间相冲",   type: "warning" });
                    return false;
                }

            }
        }
        var isDisabled = false;
        for(var i=0;i<(week-1);i++){
            for(var j=0;j<datas.length;j++){
                var _eventData ={
                    //title: teacher.name,
                    title: '',
                    start: addDay(datas[j].start,7*(i+1)),
                    end: addDay(datas[j].end,7*(i+1)),
                    backgroundColor:'#85EF0B',
                    id:getRandTime()
                };
                //setShowTopRight(_eventData.start,_eventData.end);
                _events_add.push(_eventData);
                addBatchCourse.push(_eventData);
                isDisabled = true;
            }
        }
        if(isDisabled){
            UtilFullCalendar.setButtonDisabled('#batch');
        }

        $('#calendar').fullCalendar('addEventSource',addBatchCourse);
        UtilFullCalendar.setButtonDisabledFalse('#clearBatch');

    });
    $('#clearBatch').on('click',function(){
        var r=confirm("确认取消批量排课！");
        if(r){
            for(var i=0;i<addBatchCourse.length;i++){
                UtilFullCalendar.deleteCourse(addBatchCourse[i].id);
                $('#calendar').fullCalendar( 'removeEvents' ,addBatchCourse[i].id );
            }
            addBatchCourse = [];
            UtilFullCalendar.setButtonDisabledFalse('#batch');
            UtilFullCalendar.setButtonDisabled('#clearBatch');
        }

    });

//-----------------------------------------util----------------------------------------------------------------
    //已经排课
    function setPlanCourses(){
        planCourses = parseFloat(defaultPlanCourse)-parseFloat(residue_number);
    }
    function getPlanCourses(){
        return planCourses;
    }
    function addDay(data,days){
        var date = new Date(data);
        var oneday = 1000 * 60 * 60 * 24;
        return date.getTime()+days*oneday;
    }
    //判断时间是否在当前周中
    function compareDateOnWeek(date){
        var time = new Date(date).getTime();
        if(getToday0()>time || getToday7()<time){
            return false;
        }
        return true;
    }
    function showTopRight(){
        if(!isListening){
            $('#js-residue-hour').html(residue_number);
        }
    }
    //获取当天零点时间戳
    function getToday0(){
        // 今天零点
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today.getTime();
    }
    //获取下周零点时间戳
    function getToday7(){
        var oneday = 1000 * 60 * 60 * 24;
        return getToday0()+oneday*7;
    }
    //得到登录key
    function getToken(){
        var user = sessionStorage.getItem('com.youwin.yws.user');
        var token = sessionStorage.getItem('com.youwin.yws.token');
        var _user = jQuery.parseJSON(user);
        return 'bearer '+$.base64.encode(_user.account + ':' + jQuery.parseJSON(token));
    }
    function getTime(date){
        return new Date(date).getTime();
    }
    function isHour(start, end){
        var classHour = UtilFullCalendar.getCurrentCourse(start,end);
        if((parseFloat(residue_number) - classHour)<0){
            return false;
        }
        return true;
    }
    function setShowTopRight(startTime,endTime){//毫秒数
        residue_number = parseFloat(residue_number)-UtilFullCalendar.getCurrentCourse(startTime,endTime);
        pastcourse=parseFloat(pastcourse)+UtilFullCalendar.getCurrentCourse(startTime,endTime)
        showTopRight();
    }
    function _toBeforePage(){
        coursePlanParams = {};
        //window.location.href='#/o2o-admin/order';
        location.reload(true);
    }
    function _closePage(){
        $("form[name='addTransferForm']").find('.close').trigger('click');
    }
    function setShowTopRightAdd(startTime,endTime){
        residue_number = parseFloat(residue_number)+UtilFullCalendar.getCurrentCourse(startTime,endTime);
        pastcourse=parseFloat(residue_number)-UtilFullCalendar.getCurrentCourse(startTime,endTime);
        showTopRight();
    }
    function isShowSubmit(){
        if(isSubmit){
            UtilFullCalendar.setButtonDisabledFalse('#js-submit');
        }else{
            UtilFullCalendar.setButtonDisabled('#js-submit');
        }
    }
    function looktg(){
        if(!coursePlanParams.teacherName){
            swal({   title: "返回上一页!",   text: "刷新页面",   type: "warning" });
            history.go(-1);
        }
    }
    function setResidueNumber(){
        residue_number =  coursePlanParams.plan_available_num;
        if(coursePlanParams.plan_available_num==false)
        {
            residue_number=0;
        }
        else
        {
        }

        //residue_number = 10;
        defaultPlanCourse = residue_number;
    }

    //---------------------------------------------------------------------------------------------------------
    function deleteCourse(course){
        if(ifStoreCourses(course.id)){
            var url =  config.endpoints.sos.teacher+'/deleteAvailableCourseTime/'+course.id;
            ajaxHttp('DELETE',url,{},function(){
                UtilFullCalendar.deleteStormCourse(course.id);
                deleteShowCourse(course);
                return true;
            })
        }else{
            UtilFullCalendar.deleteCourse(course.id);
            deleteShowCourse(course);
            return true;
        }
        return false;

    }
    function ifBatch(course){

    }

    //---------------------------------------------------------------------------------------------------------
    function ifStoreCourses(id){//是否是已经在数据库中存在的课
        if(!check_null(id)){
            return false;
        }
        for(var i=0;i<_events.length;i++){
            if(_events[i].id==id ){
                return true;
            }
        }
        return false;
    }
    function ajaxHttp(method,url,param,callback){
        var data ={};
        if(check_null(param)){
            data = param;
        }
        $.ajax({
            url: url,
            //url:'test/date/loading.json',
            type:method,
            dataType:"json",
            contentType:"application/json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", getToken());
            },
            headers: {
                "Authorization":getToken()
            },
            data: data,
            success: callback,
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log('error:{textStatus:'+textStatus+',errorThrown:'+errorThrown+'}');
            }
        });
    }
    function deleteShowCourse(course){
        $('#calendar').fullCalendar( 'removeEvents' ,course.id );
    }

    //---------------------------------------------------------------------------------------------------------


});

//---------------------------------------------------------------------------------------------------------
$(function(){
    //$('#calendar .fc-widget-content span').html('下午');
    (function setLineName(){
        //初始化左侧 显示
        var lineName = $('#calendar .fc-widget-content span');
        lineName.eq(0).html('上午');
        lineName.eq(1).html('下午');
        lineName.eq(2).html('晚上');
    })();

});


