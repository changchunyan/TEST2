var		g_OSIPHandle 		= 0;
var		g_DialogGuid		='';
var		g_ExtDialogGuid = '';
var		g_ExtUserData	  = '';
var		g_ExtCallType	  = 0;
var		g_SvrAccount		='10000';
var		g_FinishedReason=0;

var 	g_RecvMsg = new SIP_RecvMsg();

function SIP_RecvMsg()
{
	this.Parse = function(szdata)
	{	
		this.header='';
		this.content='';
		
		this.from='';
		this.to='';
		
		this.guid='';
		this.cmd='';
		this.cmdtype=0;
		this.result=0;	
			
		if(szdata)
		{
				var strs = szdata.split("\r\n\r\n");  
				if(strs.length > 0)
				{
					this.header = strs[0];
					this.from 	= T_GetFiledValue(this.header, 'from');
					this.to   	= T_GetFiledValue(this.header, 'to');						
				}
				if(strs.length > 1)
				{					
					this.content= strs[1];
					this.guid 	= T_GetMIMEValue(this.content, 'guid');
					this.cmd  	= T_GetMIMEValue(this.content, 'cmd');
					this.cmdtype= OSIP_GetCmdType(this.cmd);
					this.result	= T_GetMIMEValue(this.content, 'result');
				}
		}
	};
	
	this.IsSvrAccount = function()
	{
		return OSIP_IsSvrAccount(this.from);
	};
	this.GetContent = function(key)
	{
			return T_GetMIMEValue(this.content, key);
	};
	this.GetContentI = function(key)
	{
			return T_Int(T_GetMIMEValue(this.content, key));
	};		
}

function  OSIP_ExtEvent(uID,utype,lhandle,result,param,szdata,szdataex)
{
	switch(utype)
	{		
		case OSIPSEVENT_CALLOUT:
		{
			if(result == OSIPCALLOUT_STEP_INVITE)
			{
				if (param == 1)
				{
					g_ExtDialogGuid = T_GetFiledValue(szdata,'guid');
					g_ExtUserData = T_GetFiledValue(szdata,'userdata');			
					g_ExtCallType = OSIP_GetCallType(g_ExtUserData);
				}
			}
			else if(result == OSIPCALLOUT_STEP_FINISHED)
			{				
				var v = T_GetFiledValue(szdata,'guid');
				if (g_ExtDialogGuid == v) 
				{					
					g_ExtUserData 	= '';
					g_FinishedReason=param;
				}
			}			
		}break;
		case OSIPSEVENT_CALLIN:
		{
			if (result == OSIPCALLIN_STEP_INVITE)
			{
					g_ExtDialogGuid = T_GetFiledValue(szdata,'guid');		
					g_ExtUserData = T_GetFiledValue(szdata,'userdata');
					g_ExtCallType = OSIP_GetCallType(g_ExtUserData);
			}			
			else if (result == OSIPCALLIN_STEP_FINISHED)
			{				
				var v = T_GetFiledValue(szdata,'guid');
				if (g_ExtDialogGuid == v) 
				{					
					g_ExtUserData	  = '';
					g_FinishedReason=param;
				}
			}			
		}break;
		default:break;
	}	
}

function  OSIP_Event(uID,utype,lhandle,result,param,szdata,szdataex)
{
	if (uID == OSIP_EXTCHANNELID) 
	{
		return;
	}		
	switch(utype)
	{	
	case OSIPEVENT_CALLOUT:
		{			
			if(result == OSIPCALLOUT_STEP_CREATE)
			{
				g_OSIPHandle = lhandle;
			}
			else if (result == OSIPCALLOUT_STEP_RINGING
							||result == OSIPCALLOUT_STEP_TRYING
							||result == OSIPCALLOUT_STEP_ESTABLISHED)
			{
					g_DialogGuid = CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETGUID, '' , 0);
			}
			else if(result == OSIPCALLOUT_STEP_FINISHED)
			{				
				if (g_OSIPHandle == lhandle) 
				{
					g_FinishedReason = CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETFINISHEDREASON,  "" , 0);
					g_OSIPHandle = 0;
				}
			}
			else if(result == OSIPCALLOUT_STEP_DELETE)
			{
				
			}
		}break;
	case OSIPEVENT_CALLIN:
		{	
			if (result == OSIPCALLIN_STEP_CREATE)
			{
				if (g_OSIPHandle == 0)
				{
					g_OSIPHandle = lhandle;	
					g_DialogGuid = CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETGUID, '' , 0);				
				}
			}
			else if (result == OSIPCALLIN_STEP_INVITE)
			{			
					if (g_OSIPHandle == lhandle)
					{
						CPC_OSIP_Call(lhandle ,OSIP_CALL_SENDRING,  "" , 0);		
					}
					else
					{
						CPC_OSIP_Call(lhandle ,OSIP_CALL_STOP,  "" , 0);
					}				
			}
			else if (result == OSIPCALLIN_STEP_FINISHED)
			{								
				if (g_OSIPHandle == lhandle) 
				{
					g_FinishedReason = CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETFINISHEDREASON,  "" , 0);
					g_OSIPHandle = 0;
				}
			}
			else if(result == OSIPCALLIN_STEP_DELETE)
			{
				
			}			
		}break;	
	case OSIPEVENT_MESSAGE:
		{
			if (result == OSIPMESSAGE_RECV_SUCCESS)
			{					
				g_RecvMsg.Parse(szdata);				
	 			if(g_RecvMsg.IsSvrAccount())
	 			{
					if (g_RecvMsg.cmdtype == REPLYCMD_TYPE_DOEVENT)
		 			{		 				  
							OSIP_ExtEvent(OSIP_EXTCHANNELID, g_RecvMsg.GetContentI('type'), g_RecvMsg.GetContentI('handle'),g_RecvMsg.GetContentI('result'),g_RecvMsg.GetContentI('param'),g_RecvMsg.GetContent('data'), '');
		 			}
				}
			}
		}break;		
		default:
		{			
		}break;
	}
}

function OSIP_GetJsVer()
{
	return '1.1';
}
function OSIP_IsSvrAccount(account)
{
	if (account == g_SvrAccount)
	{
		 return 1;
	}
	else return 0;
}

//使用分机就返回分机，否则返回登陆sip
function OSIP_GetAccount()
{
	var vExt = OSIP_GetExt(); 
	if (vExt.length > 0)
	{
		return vExt;
	}	
	else
	{
		return CPC_OSIP_Ctrl(OSIP_CTRL_GETACCOUNT,'', 0);
	}
}

function OSIP_GetOwnerAccount()
{
		return CPC_OSIP_Ctrl(OSIP_CTRL_GETACCOUNT,'', 0);
}

function OSIP_GetCmdType(cmd)
{
	if (cmd == 'osips_dohold') return REPLYCMD_TYPE_DOHOLD;	
	else if (cmd == 'osips_dobusy') return REPLYCMD_TYPE_DOBUSY;
	else if (cmd == 'osips_dologout') return REPLYCMD_TYPE_DOLOGOUT;		
	else if (cmd == 'osips_doevent') return REPLYCMD_TYPE_DOEVENT;	
	else if (cmd == 'osips_startrefer') return REPLYCMD_TYPE_STARTREFER;	
	else if (cmd == 'osips_stoprefer') return REPLYCMD_TYPE_STOPREFER;				
	else if (cmd == 'osips_startmonitor') return REPLYCMD_TYPE_STARTMONITOR;	
	else if (cmd == 'osips_stopmonitor') return REPLYCMD_TYPE_STOPMONITOR;	
	else if (cmd == 'osips_startinsert') return REPLYCMD_TYPE_STARTINSERT;	
	else if (cmd == 'osips_stopinsert') return REPLYCMD_TYPE_STOPINSERT;
	else if (cmd == 'osips_startcallext') return REPLYCMD_TYPE_STARTCALLEXT;		
	else if (cmd == 'osips_stopcallext') return REPLYCMD_TYPE_STOPCALLEXT;	
	else if (cmd == 'osips_enablemic') return REPLYCMD_TYPE_ENABLEMIC;					
	else if (cmd == 'osips_enablespk') return REPLYCMD_TYPE_ENABLESPK;
	else if (cmd == 'osips_referestablished') return REPLYCMD_TYPE_REFERESTABLISHED;
	else return REPLYCMD_TYPE_NULL;
}

function OSIP_GetFinishedReason()
{
	return g_FinishedReason;	
}

function OSIP_GetCallInType()
{
	return OSIP_GetCallType(CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETUSERDATA, '' , 0));	
}

function OSIP_GetExtCallType()
{
	return g_ExtCallType;	
}

function OSIP_GetCallType(vUserData)
{
	if (!vUserData || vUserData.length == 0)
	{
		return CALLIN_TYPE_NULL;
	}
	else if (vUserData == 'osips_startcallext')
	{
		return CALLIN_TYPE_CALL;
	}	
	else if (vUserData == 'osips_startinsert')
	{
		return CALLIN_TYPE_INSERT;
	}
	else if (vUserData == 'osips_startmonitor')
	{
		return CALLIN_TYPE_MONITOR;
	}	
	else if (vUserData == 'osips_startconference')
	{
		return CALLIN_TYPE_CONFERENCE;
	}		
	else
	{
		return CALLIN_TYPE_UNKNOW;
	}
}


function OSIP_EnableMic(v)
{
	var guid = OSIP_GetGuid();	
	if (guid.length > 0)
	{	
		var msg='guid:'+guid+'\r\n';
		msg+='cmd:osips_enablemic\r\n';
		msg+='mic:'+v+'\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
	}
	else
	{
		return -1;
	}
}

function OSIP_EnableSpk(v)
{
	var guid = OSIP_GetGuid();	
	if (guid.length > 0)
	{	
		var msg='guid:'+guid+'\r\n';
		msg+='cmd:osips_enablespk\r\n';
		msg+='spk:'+v+'\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
	}
	else
	{
		return -1;
	}
}

function OSIP_SendDoHold(v)
{
	var guid = OSIP_GetGuid();	
	if (guid.length > 0)
	{	
		var msg='guid:'+guid+'\r\n';
		msg+='cmd:osips_dohold\r\n';
		msg+='hold:'+v+'\r\n';
		msg+='userdata:osips_dohold\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
	}
	else
	{
		return -1;
	}
}

function OSIP_SendDoBusy(account,v)
{
		if(account.length == 0) 
		{
			account = OSIP_GetOwnerAccount();
		}
		var msg='cmd:osips_dobusy\r\n';
		msg+='account:'+account+'\r\n';
		msg+='busy:'+v+'\r\n';		
		msg+='userdata:osips_dobusy\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}


function OSIP_StartRefer(code)
{
		var guid = OSIP_GetGuid();	
		if (guid.length > 0)
		{
			var msg='guid:'+guid+'\r\n';
			msg+='cmd:osips_startrefer\r\n';
			msg+='account:'+OSIP_GetOwnerAccount()+'\r\n';
			msg+='to:'+code+'\r\n';
			msg+='userdata:osips_startrefer\r\n';
			return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
		}
		else
		{
			return -1;
		}
}

function OSIP_StopRefer()
{
	var guid = OSIP_GetGuid();	
	if (guid.length > 0)
	{	
		var msg='guid:'+guid+'\r\n';
		msg+='cmd:osips_stoprefer\r\n';
		msg+='userdata:osips_stoprefer\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
	}
	else
	{		
		return -1;
	}
}

function OSIP_SendDoHang(account,vguid)
{
		var msg='cmd:osips_dohang\r\n';
		msg+='account:'+account+'\r\n';
		msg+='guid:'+vguid+'\r\n';		
		msg+='userdata:osips_dohang\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StartMonitor(account,vguid)
{
		var msg='guid:'+vguid+'\r\n';
		msg+='cmd:osips_startmonitor\r\n';
		msg+='account:'+account+'\r\n';
		msg+='type:1\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_startmonitor\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StopMonitor(account,vguid)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_stopmonitor\r\n';
		msg+='account:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='type:1\r\n';
		msg+='userdata:osips_stopmonitor\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);	
}

function OSIP_StartInsert(account,vguid)
{
		var msg='guid:'+vguid+'\r\n';
		msg+='cmd:osips_startinsert\r\n';
		msg+='account:'+account+'\r\n';
		msg+='type:1\r\n';
		msg+='to:'+account+'\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_startinsert\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StopInsert(account,vguid)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_stopinsert\r\n';
		msg+='account:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='type:1\r\n';
		msg+='userdata:osips_stopinsert\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);	
}

function OSIP_StartConference(account,vguid)
{
		if(vguid.length <= 0) vguid = OSIP_GetGuid();
		var msg='guid:'+vguid+'\r\n';
		msg+='cmd:osips_startconference\r\n';
		msg+='account:'+account+'\r\n';
		msg+='type:1\r\n';
		msg+='to:'+account+'\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_startconference\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StopConference(account,vguid)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_stopconference\r\n';
		msg+='account:'+account+'\r\n';
		msg+='type:1\r\n';
		msg+='to:'+account+'\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_stopconference\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);	
}

function OSIP_StartPlayFile(vguid,szFile)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_playfile\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='account:'+OSIP_GetAccount()+'\r\n';
		msg+='type:'+CPC_PLAY_FILE_START+'\r\n';
		msg+='file:'+szFile;
		msg+='userdata:osips_playfile\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StartPlayText(vguid,szText)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_playfile\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='account:'+OSIP_GetAccount()+'\r\n';
		msg+='type:'+CPC_PLAY_FILE_START+'\r\n';
		msg+='text:'+szText+'\r\n';
		msg+='userdata:osips_playfile\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_StopPlayFile(vguid)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_playfile\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='account:'+OSIP_GetAccount()+'\r\n';
		msg+='type:'+CPC_PLAY_FILE_STOPALL+'\r\n';
		msg+='userdata:osips_playfile\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_GotoIVRFile(szfile,goid,hang)
{
		var msg='guid:'+OSIP_GetGuid()+'\r\n';
		msg+='cmd:osips_gotoivr\r\n';
		msg+='from:'+OSIP_GetOwnerAccount()+'\r\n';
		msg+='account:'+OSIP_GetAccount()+'\r\n';
		msg+='file:'+szfile+'\r\n';
		msg+='goid:'+goid+'\r\n';
		msg+='hang:'+hang+'\r\n';
		msg+='userdata:osips_gotoivr\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);	
}

function OSIP_DoLogout(account)
{		
		var msg='cmd:osips_dologout\r\n';
		msg+='account:'+account+'\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_DoStartCallExt(code)
{
		var msg='cmd:osips_startcallext\r\n';
		msg+='account:'+code+'\r\n';
		msg+='to:'+code+'\r\n';
		msg+='from:'+ OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_startcallext\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_DoStopCallExt(code)
{
		var msg='cmd:osips_stopcallext\r\n';
		msg+='account:'+code+'\r\n';
		msg+='to:'+code+'\r\n';
		msg+='from:'+ OSIP_GetOwnerAccount()+'\r\n';
		msg+='userdata:osips_stopcallext\r\n';
		return CPC_OSIP_Msg(OSIP_MSG_TEXT, g_SvrAccount, '', msg, 0);
}

function OSIP_LogIn(account,password,ip,port)
{
	CPC_OSIP_Ctrl(OSIP_CTRL_LOGOUT, '', 0);
	CPC_OSIP_Ctrl(OSIP_CTRL_SETSERVER, ip, port);			
	var strValue;
	strValue="account="; strValue+=account;
	strValue+="&";			strValue+="password="; strValue+=password;
	return  CPC_OSIP_Ctrl(OSIP_CTRL_LOGIN,strValue,0);
}

function OSIP_StopCall()
{
	var vExt = OSIP_GetExt(); 
	if (vExt.length > 0)
	{
		return OSIP_DoStopCallExt(vExt);
	}
	else
	{	
		return CPC_OSIP_Call(0 ,OSIP_CALL_STOPALL, '' , 0);	
	}
}

function OSIP_Answer()
{
	if (g_OSIPHandle == 0)
	{
		return -2;
	}
	else
	{
		return CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_ANSWER,  "" , 0);	
	}
}

function OSIP_SendDTMF(code)
{
	var vExt = OSIP_GetExt(); 
	if (vExt.length > 0)
	{
		return 0;
	}
	else
	{
		return CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_SENDDTMF,  code , 0);
	}
}

function OSIP_StartCall(code)
{
	var vExt = OSIP_GetExt(); 
	if (vExt.length > 0)
	{
			return OSIP_DoStartCallExt(code);
	}
	else
	{
		if (g_OSIPHandle == 0)
		{
			var strAccount;
			strAccount  = "account="; strAccount += code;
			strAccount += "&to="; 	  strAccount += code;
			return CPC_OSIP_Call(0 , OSIP_CALL_START, strAccount , 0);
		}
		else
		{
			return -1;
		}
	}
}
function OSIP_GetDialogGuid()
{
	return g_DialogGuid;
}

function OSIP_GetExtDialogGuid()
{
	return g_ExtDialogGuid;
}

function OSIP_GetGuid()
{
	var guid='';
	var vExt = OSIP_GetExt(); 
	if (vExt.length > 0)
	{
		guid = g_ExtDialogGuid;
	}
	else 	if (g_OSIPHandle > 0)
	{
		guid = CPC_OSIP_Call(g_OSIPHandle ,OSIP_CALL_GETGUID, '' , 0);
	}
	else
	{
		guid = g_DialogGuid;
	}
	return guid;	
}

function OSIP_GetExt()
{
	return CPC_OSIP_Ctrl(OSIP_CTRL_GETEXT,"",0); 
}
