var g_cphonecobj=null;
var g_funceventcallback=null;
var err_noobj=-999;


function T_Format2d(v)
{
	if(v<10) return '0'+v.toString();
	else return v.toString();
}
function T_Format3d(v)
{
	if(v<10) return '00'+v.toString();
	else if(v<100) return '0'+v.toString();
	else return v.toString();
}

function T_Int(v)
{
	if(v)
	{
		if(v.length == 0)
		{
			return PARAM_NULL;
		}else
		{
			return Number(v);
		}
	}else
	{
		return 0;
	}
}

function T_GetMIMEValue(v,key)
{	
	var strs = v.split("\r\n");  
 	for(var i = 0; i < strs.length; i++)  
 	{  
  		var vline=strs[i];
    	var vindex=vline.indexOf(":");
			if(vindex != -1)  
			{
				var	szkey=vline.slice(0,vindex);
				if(szkey == key)
				{
					return vline.slice(vindex+1);
				}
			}
  }
  return "";
}

function T_GetFiledValue(v,key)
{	
	var strs = v.split("&");  
 	for(var i = 0; i < strs.length; i++)  
 	{  
  		var vline=strs[i];
    	var vindex=vline.indexOf("=");
			if(vindex != -1)  
			{
				var	szkey=vline.slice(0,vindex);
				if(szkey == key)
				{
					return vline.slice(vindex+1);
				}
			}
  }
  return "";
}


function T_GetNowTimeString()
{
	var vd=new Date();
	return '['+T_Format2d(vd.getHours())+':'+T_Format2d(vd.getMinutes())+':'+T_Format2d(vd.getSeconds())+' '+T_Format3d(vd.getMilliseconds())+']';
}

function T_IsIE()
{//navigator.userAgent.toLowerCase().indexOf("msie") == "-1")		    	
	  var ua=navigator.userAgent.toLowerCase();
   	if (navigator.appName == 'Microsoft Internet Explorer' || ua.match(/msie/) != null || ua.match(/trident/) != null || typeof(window.ActiveXObject) != 'undefined')
   	{
    		return 1;
   	}else
   	{
 			return 0;
 		}
}
//ie的模式，firefox不一样，异步？
function T_loadJS(url, success) {
  var domScript = document.createElement('script');
  domScript.src = url;
  success = success || function(){};
  domScript.onload = domScript.onreadystatechange = function() {
    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
      success();
      this.onload = this.onreadystatechange = null;
      this.parentNode.removeChild(this);
    }
  }
  document.getElementsByTagName('head')[0].appendChild(domScript);
}

function T_IsInstalled(szcphonecname)
{
	if(navigator.plugins && !T_IsIE()) 
	{	
		for (x=0; x<navigator.plugins.length;x++) 
		{      			
			if(navigator.plugins[x].name.toLowerCase() == szcphonecname.toLowerCase()) return true;
		} 
		return false;
	}else
	{
		try{
	     	var Ole = new ActiveXObject("Npcphonec.CPhonecEx");	      	
	  		return true;
	  }catch(e)
   	{
   		return false;
   	}
	}
}

function cDiv(bshow)
{
	var oDiv=document.createElement("div");
	oDiv.setAttribute("id","cphonecdiv"); 
	oDiv.style.border="0px solid black";
	oDiv.style.left="0px";
	oDiv.style.top="0px";
	oDiv.style.width="64px";
	oDiv.style.height="64px";
	oDiv.style.backgroundColor="#ffffff";
	oDiv.style.position="absolute";
	document.body.appendChild(oDiv);
	return oDiv;
}
function AttachIE11Event(obj, _strEventId, _functionCallback)
{
        var nameFromToStringRegex = /^function\s?([^\s(]*)/;
        var paramsFromToStringRegex = /\(\)|\(.+\)/;
        var params = _functionCallback.toString().match(paramsFromToStringRegex)[0];
        var functionName = _functionCallback.name || _functionCallback.toString().match(nameFromToStringRegex)[1];
        var handler;
        try {
            handler = document.createElement("script");
            handler.setAttribute("for", obj.id);
        }
        catch(ex) {
            handler = document.createElement('<script for="' + obj.id + '">');
        }
        handler.event = _strEventId + params;
        handler.appendChild(document.createTextNode(functionName + params + ";"));
        document.body.appendChild(handler);
}

function T_onEvent(uID,utype,lhandle,result,param,szdata,szdataex)
{
	g_funceventcallback(uID,utype,lhandle,result,param,szdata,szdataex);
}

function T_AttachObject(cphonecid)
{
	g_cphonecobj = document.getElementById(cphonecid); 	
	return g_cphonecobj;
}

function T_addobject(bshow,funceventcallback,bclose)
{
	var vdivobj=cDiv(bshow);	
	if(!T_IsIE()) 
	{
		vdivobj.innerHTML="<embed ID=\"cphonecobjid\" name=\"cphonecobjname\" type=\"application/x-npcphonec-plugin\" pluginspage=\"\" style=\"left:0px;top:0px;width:64px;Height:64px;margin:0px;padding:0px;visibility:visible;\"></embed>";
		g_cphonecobj = document.getElementById("cphonecobjid"); 	
		g_cphonecobj.onEvent=funceventcallback;
		if(bclose)
		{
			window.addEventListener('unload', CPC_CloseDevice, false);
		}
	}
	else
	{
		/*
	  var vobjtext='<OBJECT id="cphonecobjid" name="cphonecobjid" type="" codebase="" CLASSID="CLSID:B8D6BBCE-0174-4BED-8244-69F8A8A349A3" style="width:64px;height:64px"></OBJECT>'; 
	  var vobjevent='<script type="text/javascript" FOR="cphonecobjid" EVENT="onEvent(chID,type,handle,result,param,szdata,szdataex)">';
	  //vobjevent+='T_onEvent(uID,utype,lhandle,result,param,szdata,szdataex);';
	  vobjevent+='alert("ddd");';
	  vobjevent+='</script>';
	  vdivobj.innerHTML = vobjtext;// + vobjevent;	  
	  //document.body.appendChild(vobjevent);
	  g_cphonecobj = document.getElementById("cphonecobjid"); 
	  */
	  
		vdivobj.innerHTML="<OBJECT ID=\"cphonecobjid\" name=\"cphonecobjname\" type=\"\" codebase=\"\" CLASSID=\"CLSID:B8D6BBCE-0174-4BED-8244-69F8A8A349A3\" style=\"width:64px;height:64px\"></OBJECT>"; 
		g_cphonecobj = document.getElementById("cphonecobjid");
		var handler = document.createElement("script");
		handler.setAttribute("for", "cphonecobjid");
		handler.type = "text/javascript";
		handler.setAttribute('charset', 'utf-8');
		handler.event = "onEvent(uID,utype,lhandle,result,param,szdata,szdataex)";    
		try
		{   
			handler.appendChild(document.createTextNode("T_onEvent(uID,utype,lhandle,result,param,szdata,szdataex);"));
		}catch(ex)
		{
			handler.text = "T_onEvent(uID,utype,lhandle,result,param,szdata,szdataex);";
		}
		document.body.appendChild(handler);
		
		if(bclose)
		{
			if (typeof(g_cphonecobj.attachEvent) != "undefined")
			{	
				window.attachEvent('onunload', CPC_CloseDevice);	
			}else if (typeof(g_cphonecobj.addEventListener) != "undefined")
			{
				window.addEventListener('unload',onunload,false);
			}
		}		
	}		
	
	
	try
	{		
		if(!bshow)
		{
			vdivobj.style.width="0px";
			vdivobj.style.height="0px";
			g_cphonecobj.style.width="0px";
			g_cphonecobj.style.height="0px";			
		}
		g_cphonecobj.CPC_GetLastError();
		return 1;
	}catch(e)
	{
		g_cphonecobj=null;
		return -1;
	}
}

function CPC_AddObject(bshow,funceventcallback,bclose)
{
	g_funceventcallback = funceventcallback;
	if(document.getElementById("cphonecobjid") == null)
	{
		if (T_IsInstalled('cphonec sdk') <= 0)
		{
			 return -998;
		}
		else if(T_addobject(bshow,funceventcallback,bclose) > 0)
		{
			return 1;
		}else
		{			
			return -997;
		}
	}
	else
	{
		if(T_IsIE()) 
		{
			T_AttachObject('cphonecobjid');
			if(!bshow)
			{
				g_cphonecobj.style.width="0px";
				g_cphonecobj.style.height="0px";			
			}
			if(bclose)
			{
				if (typeof(g_cphonecobj.attachEvent) != "undefined")
				{	
					window.attachEvent('onunload', CPC_CloseDevice);	
				}else if (typeof(g_cphonecobj.addEventListener) != "undefined")
				{
					window.addEventListener('unload',onunload,false);
				}
			}			
		}		
		else
		{			
			T_AttachObject('cphonecobjid');
			if(bclose)
			{
				window.addEventListener('unload', CPC_CloseDevice, false);
			}			
		}
		return 1;
	}
} 

function CPC_OpenDevice(udevtype,uvalue,szvalue)
{		
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OpenDevice(T_Int(udevtype),T_Int(uvalue),szvalue);
}
function CPC_CloseDevice()
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_CloseDevice(0,0);
}
function CPC_CloseDeviceEx(udevtype,uvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_CloseDevice(udevtype,uvalue);
}
function CPC_SetDevCtrl(ch,ctrl,v)
{	
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_SetDevCtrl(T_Int(ch), T_Int(ctrl), T_Int(v));
}
function CPC_GetDevCtrl(ch,ctrl)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_GetDevCtrl(T_Int(ch), T_Int(ctrl));
}
function CPC_SetParam(ch,param,v)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_SetParam(T_Int(ch), T_Int(param), T_Int(v));
}
function CPC_GetParam(ch,param)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_GetParam(T_Int(ch), T_Int(param));
}
function CPC_PlayFile(ch,uplaytype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_PlayFile(T_Int(ch), T_Int(uplaytype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function CPC_PlayMultiFile(ch,uplaytype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_PlayMultiFile(T_Int(ch), T_Int(uplaytype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function CPC_PlayString(ch,uplaytype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_PlayString(T_Int(ch), T_Int(uplaytype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function CPC_RecordFile(ch,urecordtype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_RecordFile(T_Int(ch), T_Int(urecordtype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function CPC_Conference(ch,nconfid,uconftype,nvalue,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Conference(T_Int(ch), T_Int(nconfid), T_Int(uconftype), T_Int(nvalue), szvalue);
}
function CPC_Broadcast(ch,ubroadtype,nvalue,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Broadcast(T_Int(ch), T_Int(ubroadtype), T_Int(nvalue),szvalue);
}
function CPC_Event(ch,ueventype,nvalue,szinvalue,szoutvalue,nbufsize)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Event(T_Int(ch), T_Int(ueventype), T_Int(nvalue), szinvalue, szoutvalue, T_Int(nbufsize));
}
function CPC_General(ch,ugeneraltype,nvalue,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_General(T_Int(ch), T_Int(ugeneraltype), T_Int(nvalue), szvalue);
}
function CPC_CallLog(ch,ulogtype,szvalue,nvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_CallLog(T_Int(ch), T_Int(ulogtype), szvalue, T_Int(nvalue));
}
function CPC_DevInfo(ch,udevinfotype)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_DevInfo(T_Int(ch), T_Int(udevinfotype));
}
function CPC_Storage(ndevid,uoptype,useek,szpwd,szvalue,nbufsize)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Storage(T_Int(ndevid), T_Int(uoptype), T_Int(useek), szpwd, szvalue, T_Int(nbufsize));
}
function CPC_Tool(utooltype,nvalue,szinvalue,szinvalueex,szoutvalue,nbufsize)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Tool(T_Int(utooltype), T_Int(nvalue), szinvalue, szinvalueex, szoutvalue, T_Int(nbufsize));
}
function CPC_Remote(uremotetype,nvalue,szinvalue,szinvalueex,szoutvalue,nbufsize)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_Remote(T_Int(uremotetype), T_Int(nvalue), szinvalue, szinvalueex, szoutvalue, T_Int(nbufsize));
}
function CPC_GetLastError()
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_GetLastError();
}
function	CPC_OSIP_Ctrl(uctrltype,pinvalue,nvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OSIP_Ctrl(0,T_Int(uctrltype), pinvalue, T_Int(nvalue));
}

function	CPC_OSIP_Call(nOSIPHandle,ucalltype,pvalue,nvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OSIP_Call(0,T_Int(nOSIPHandle), T_Int(ucalltype), pvalue, T_Int(nvalue));
}
function	CPC_OSIP_PlayFile(nOSIPHandle,uplaytype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OSIP_PlayFile(0,T_Int(nOSIPHandle),  T_Int(uplaytype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function	CPC_OSIP_RecordFile(nOSIPHandle,urecordtype,nvalue,nvalueex,szvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OSIP_RecordFile(0, T_Int(nOSIPHandle),  T_Int(urecordtype), T_Int(nvalue), T_Int(nvalueex), szvalue);
}
function	CPC_OSIP_Msg(umsgtype,szaccount,szparam,szcontent,nvalue)
{
	return g_cphonecobj==null?err_noobj:g_cphonecobj.CPC_OSIP_Msg(0, T_Int(umsgtype), szaccount,szparam,szcontent,T_Int(nvalue));
}

function IC_GetDeviceName(vtype)
{
	switch(vtype)
	{
		case DEVTYPE_IR1:
		{
			return "IR1";
		}break;
		case DEVTYPE_IP1:
		{
			return "IP1";
		}break;		
		case DEVTYPE_IP1_F:
		{
			return "IP1-F";
		}break;			
		case DEVTYPE_IA4:
		{
			return "IA4";
		}break;		
		case DEVTYPE_IA4_F:
		{
			return "IA4-F";
		}break;						
		case DEVTYPE_IA1:
		{
			return "IA1";
		}break;
		case DEVTYPE_IA2:
		{
			return "IA2";
		}break;
		case DEVTYPE_IA3:
		{
			return "IA3";
		}break;
		case DEVTYPE_IB1:
		{
			return "IB1";
		}break;
		case DEVTYPE_IB2:
		{
			return "IB2";
		}break;
		case DEVTYPE_IB3:
		{
			return "IB3";
		}break;				
		case DEVTYPE_IC2_R:
		{
			return "IC2-R";
		}break;		
		case DEVTYPE_IC2_LP:
		{
			return "IC2-LP";
		}break;			
		case DEVTYPE_IC2_LPF:
		{
			return "IC2-LPF";
		}break;			
		case DEVTYPE_IC2_LPQ:
		{
			return "IC2-LPQ";
		}break;			
		case DEVTYPE_IC4_R:
		{
			return "IC4-R";
		}break;		
		case DEVTYPE_IC4_LP:
		{
			return "IC4-LP";
		}break;			
		case DEVTYPE_IC4_LPF:
		{
			return "IC4-LPF";
		}break;			
		case DEVTYPE_IC4_LPQ:
		{
			return "IC4-LPQ";
		}break;		
		case DEVTYPE_IC7_R:
		{
			return "IC7-R";
		}break;		
		case DEVTYPE_IC7_LP:
		{
			return "IC7-LP";
		}break;			
		case DEVTYPE_IC7_LPF:
		{
			return "IC7-LPF";
		}break;			
		case DEVTYPE_IC7_LPQ:
		{
			return "IC7-LPQ";
		}break;								
		default:
		{
			return "0x"+vtype.toString(16);
		}break;
	}
	return "unknow";
}

function IC_StartDial(ch,code,subline)
{
	var vsub=0;
	if (subline == 1)
	{//如果是内线拨号，不需要设置的出局号码，加忽略标记
		vsub = INTDIAL_SIGN;
	}
	if (CPC_DevInfo(ch, CPC_DEVINFO_GETMODULE) & DEVMODULE_HOOK)//如果设备支持软摘机
	{
		T_StartRecordFile();
		return CPC_General(ch, CPC_GENERAL_STARTDIAL, vsub, code);
	}else if (CPC_GetDevCtrl(ch, CPC_CTRL_PHONE) > 0 && (CPC_DevInfo(ch, CPC_DEVINFO_GETMODULE) & DEVMODULE_PHONEDIALOUT))
	{//如果电话机拿着就直接拨号，不进行软摘机检测拨号音了,某些型号不支持，如：多路的
		T_StartRecordFile();
		return CPC_General(ch, CPC_GENERAL_DIALOUT, vsub, code);
	}else
	{
		return BCERR_UNSUPPORTFUNC;
	}
}
