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
                setShowTopRightAdd(eve[i].start,eve[i].end);
                _events_add.splice(i,1);

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
        $(select).attr('disabled',true);
        $(select).removeClass('btn-success');
    };
    UtilFullCalendar.setButtonDisabledFalse = function(select){
        $(select).attr('disabled',false);
        $(select).addClass('btn-success');
    };

    var teacher ={
        name:coursePlanParams.teacherName
    };

    (function init(){
        looktg();//返回上一页

        setResidueNumber();
        isShowSubmit();
        showTopRight();
    })();

    //核心方法
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
        maxTime:'22:00',//结束时间
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
        firstHour:6,//默认开始时间
       /* selectable: true,*/
        height: 650,
        slotEventOverlap:false,//设置视图中的事件显示是否可以重叠覆盖
        /*selectHelper: true,*/
        editable: false,//判断该日程能否拖动
        //forceEventDuration:true,
        /*select: function(start, end) {//添加课程
            if(start > new Date()){
                var _start =start.format();
                var _end = end.format();
                var hour = UtilFullCalendar.getCurrentCourse((Date.parse(_start)),(Date.parse(_end)));
//                pastourse=pastcourse+parseFloat(hour);
             pastcourse=pastcourse+parseFloat(hour);
             

                //修改
                if(!UtilFullCalendar.compare(_events,_start,_end)){
                    /!*alert('时间相冲');*!/
                    swal({   title: "失败!",   text: "时间相冲!",   type: "error" });
                    $('#calendar').fullCalendar('unselect');
                    return false;
                }
                if(!UtilFullCalendar.compare(_events_add,_start,_end)){
                    /!*alert('时间相冲');*!/
                    swal({   title: "失败!",   text: "时间相冲!",   type: "error" });
                    $('#calendar').fullCalendar('unselect');
                    return false;
                }
                if(!isHour(Date.parse(_start),Date.parse(_end)) ){
                   /!* alert('您没有课时了');*!/
                    swal({   title: "失败!",   text: "您没有课时了!",   type: "error" });
                    $('#calendar').fullCalendar('unselect');
                    return;
                }
                var r = true;
                var eventData;

                eventData = {
                    title: "老师："+teacher.name+"\n学生："+coursePlanParams.studentName,
                    start: Date.parse(start.format()),
                    end: Date.parse(end.format()),
                    id:getRandTime()
                };
                var _eventData = eventData;
                _events_add.push(_eventData);
                setShowTopRight(Date.parse(start.format()),Date.parse(end.format()));

                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                isSubmit = true;
                isShowSubmit();
            }else{
                swal({   title: "失败!",   text: "时间已经过去,您不能添加!",   type: "error" });
                /!*alert('时间已经过去,您不能添加')*!/
            };

            $('#calendar').fullCalendar('unselect');
        },*/
       /* eventClick:function(event){//
            var s = event.editable;
            var id = event.id;
            if(typeof(s)!="undefined"&&s!=null&&!s){
               /!* alert('已排课程，不允许删除。');*!/
                swal({   title: "失败!",   text: "已排课程，不允许删除",   type: "error" });

            }else{
                var r=confirm("确认删除课程！");
                if (r==true)
                {
                    UtilFullCalendar.deleteCourse(event.id);
                    $('#calendar').fullCalendar( 'removeEvents' ,event.id );
                }
            }
        },*/
        editable: false,
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
                url: config.endpoints.sos.coursePlan,
                //url:'js/lib/loading.json',
                type:'POST',
                dataType:"json",
                contentType:"application/json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", getToken());
                },
                headers: {
                    "Authorization":getToken()
                },
                //coursePlanParams.teacherID
                data:JSON.stringify(//请求参数 上一页面传来
                    {
                        "crm_student_id":coursePlanParams.studentID,
                        "user_id":coursePlanParams.teacherID,
                        "crm_customer_group_id":coursePlanParams.groupID,
                        "start_time":Date.parse(start.format()),
                        "end_time":Date.parse(end.format())
                       /* "start_time":Date.parse(start.format()),
                        "end_time":Date.parse(end.format())*/


                    }),
                success: function (data) {
                    var events = [];
                    if(check_null(data.data)) {
                        $.each(data.data, function (name, item) {
                            events.push({
                                id: item.id,
                                title: "老师：" + item.teachername + "\n学生：" + item.studentname +"\n学习顾问："+item.username,
                                start: (item.start_time),
                                end: (item.end_time),// will be parsed
                                editable: false,
                                backgroundColor: isBackColor(item.is_past)

                            });
                        });
                    }
                    _events = events;

                    //$("#calendar").fullCalendar('renderEvent',events,true);
                  /*  addBatchCourse.push(events);
                    if(check_null(_eventData)){
                    	 addBatchCourse.push(_eventData);
                    }*/
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

    //最终提交
    $('#js-submit').on('click',function(){
        
        var planCourses = parseFloat(defaultPlanCourse)-parseFloat(residue_number);
        UtilFullCalendar.setButtonDisabled('#js-submit');
        $.ajax({
            url: config.endpoints.sos.creatCoursePlan,
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
                    "type":coursePlanParams.type,
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
                    "residuenumber":planCourses
                }),
            success: function (data) {
                /*alert("排课成功");*/
                swal({   title: "成功!",   text: "排课成功!",   type: "success" });
                UtilFullCalendar.setButtonDisabledFalse('#js-submit');
                _toBeforePage();
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
        for(var index in _events_add){
        //for(var index;index<all_week;index++){
            totalHour +=  (_events_add[index].end.valueOf() - _events_add[index].start.valueOf())*(parseFloat(week)-1);
        }
        var shengyu = residue_number*60*60*1000;
       
       
        if(shengyu < totalHour){
            /*alert('超出了！');*/
            swal({   title: "失败!",   text: "超出了!",   type: "error" });
            $('#setWeek').focus();
            return;
        }
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
                    swal({   title: "失败!",   text: "时间相冲!",   type: "error" });
                    return false;
                }
                if(!UtilFullCalendar.compare(_events_add,_eventData.start,_eventData.end)){
                    /*alert('时间相冲');*/
                    swal({   title: "失败!",   text: "时间相冲!",   type: "error" });
                    return false;
                }

            }
        }
        var isDisabled = false;
        for(var i=0;i<(week-1);i++){
            for(var j=0;j<datas.length;j++){
                var _eventData ={
                    title: teacher.name,
                    start: addDay(datas[j].start,7*(i+1)),
                    end: addDay(datas[j].end,7*(i+1)),
                    id:getRandTime()
                };
                setShowTopRight(_eventData.start,_eventData.end);
                _events_add.push(_eventData);
                addBatchCourse.push(_eventData);
                isDisabled = true;
            }
        }
        if(isDisabled){
            UtilFullCalendar.setButtonDisabled('#batch');
        }

        $('#calendar').fullCalendar('addEventSource',addBatchCourse);

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
        }

    });
    //util
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
        $('#js-residue-hour').html(residue_number);
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
        var param ='';
        if(coursePlanParams.type == '1' || coursePlanParams.type == '3'){
            param = coursePlanParams.studentID;
        }else if(coursePlanParams.type == '2' ){
            param = coursePlanParams.groupID;
        }
        var type = coursePlanParams.type;
        coursePlanParams = {};

        window.location.href='#/sos_admin/customer_student_course/'+param+'/'+type;
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
           /* alert('刷新页面，请返回上一页！');*/
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

        
       
        defaultPlanCourse = residue_number;
    }


});

