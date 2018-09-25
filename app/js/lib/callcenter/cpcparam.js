var		FALSE				=0;
var		TRUE				=1;
var		NULL				=0;

var		CPC_DLL_VER				=0x0106;
var		CPC_DLL_VER_STR		="1.06";

var		CPC_FILETRANS_VER		=0x30301;


var		CPC_GENERAL_LICENSE			='http://www.cphonec.com/v1';

//播放/录音回调时如果返回该值，系统将自动删除该回调模块，下次将不会被回调
var		CB_REMOVELIST						=-1;
var		PARAM_NULL							=-99;

//代拨标记
var		PROXYDIAL_SIGN					=0x40000000;
//不出局就内部拨号,忽略设置的出局号码
var		INTDIAL_SIGN						=0x20000000;
//出局拨号,必须加上设置的出局号码
var		EXTDIAL_SIGN						=0x10000000;

var		MULTI_SEPA_CHAR					='|';//多个文件播放列表分割符号

var		DIAL_DELAY_SECOND				=',';//拨号时号码之间延迟1秒
var		DIAL_DELAY_HSECOND			='.';//拨号时号码之间延迟0.5秒
var		DIAL_CHECK_CITYCODE			=':';//拨号时该符号后自动过滤城市区号

var		SIP_PARAM_SPLIT					=',';//SIP参数的分隔符号

//自动创建录音文件时的默认目录名
var		RECFILE_DIR							='recfile';
//配置信息里的KEY
var		INI_CPCPARAM						='cpcparam';
//默认配置文件名
var		INI_FILENAME						='cpcconfig.ini';

var		MAX_USB_COUNT				=64;//支持的最多USB芯片数
var		MAX_CHANNEL_COUNT		=128;//支持的最多通道数


var		DEV_ALL_CHANNELID		=512;//0x200,表示控制所有设备通道，避免应用层循环

//声卡控制有效通道ID号
//0->255为USB设备通道号
var		SOUND_CHANNELID				=256;
//远程通信通道,HTTP上传/下载
var		REMOTE_CHANNELID			=257;
//SIP控制通道
var		OSIP_CHANNELID			=258;
//socket 服务器端通道
var		SOCKET_SERVER_CHANNELID			=259;
//socket 终端通道
var		SOCKET_CLIENT_CHANNELID			=260;
//UDP通道
var		SOCKET_UDP_CHANNELID			=261;
//usb设备插入检测通道
var		PLUGIN_CHANNELID					=263;

var		GENERAL_CHANNELID					=264;
//绑定的分机通道消息
var		OSIP_EXTCHANNELID					=265;

var		MAX_SIPMSG_LEN				=400;//发送消息的最大长度
var		MAX_SIPCMD_LEN				=400;//发送命令的最大长度

var		DEFAULT_FLASH_ELAPSE			=600;//默认拍插簧间隔时间(ms)
var		DEFAULT_FLASHFLASH_ELAPSE		=1000;//默认拍插簧后间隔一定时间回调事件ms
var		DEFAULT_RING_ELAPSE			=1000;//默认给内部话机/交换机震铃时间ms响 1秒
var		DEFAULT_RINGSILENCE_ELAPSE		=4000;//默认给内部话机/交换机震铃后停止ms 4秒
var		DEFAULT_RING_TIMEOUT			=12;//默认给内线震铃超时次数,每次1秒响4秒停,总共时间就为N*5
var		DEFAULT_REFUSE_ELAPSE			=500;//拒接时默认使用间隔(ms)
var		DEFAULT_DIAL_SPEED			=75;//默认拨号速度ms
var		DEFAULT_DIAL_SILENCE			=75;//默认号码之间静音时间ms
var		DEFAULT_CHECKDIALTONE_TIMEOUT		=3000;//检测拨号音超时就强制呼叫ms
var		DEFAULT_CALLINTIMEOUT			=5500;//来电响铃超时ms

//设备类型
var		DEVTYPE_UNKNOW				=-1;//未知设备

var		DEVTYPE_IR1				=0x8100;

var		DEVTYPE_IA1				=0x8111;
var		DEVTYPE_IA2				=0x8112;
var		DEVTYPE_IA3				=0x8113;
var		DEVTYPE_IA4				=0x8114;
var		DEVTYPE_IA4_F			=0x8115;

var		DEVTYPE_IB1				=0x8121;
var		DEVTYPE_IB2				=0x8122;
var		DEVTYPE_IB3				=0x8123;
var		DEVTYPE_IB4				=0x8124;

var		DEVTYPE_IP1				=0x8131;
var		DEVTYPE_IP1_F				=0x8132;

var		DEVTYPE_IC2_R				=0x8200;
var		DEVTYPE_IC2_LP				=0x8203;
var		DEVTYPE_IC2_LPQ				=0x8207;
var		DEVTYPE_IC2_LPF				=0x8211;

var		DEVTYPE_IC4_R				=0x8400;
var		DEVTYPE_IC4_LP				=0x8403;
var		DEVTYPE_IC4_LPQ				=0x8407;
var		DEVTYPE_IC4_LPF				=0x8411;

var		DEVTYPE_IC7_R				=0x8700;
var		DEVTYPE_IC7_LP				=0x8703;
var		DEVTYPE_IC7_LPQ				=0x8707;
var		DEVTYPE_IC7_LPF				=0x8711;

//--------------------------------------------------------------
//设备功能模块
//是否具有内置喇叭功能
//可以PC播放语音到喇叭/通话时线路声音到喇叭
var		DEVMODULE_DOPLAY			 =0x1;
//是否具有可接入外线获取来电号码(FSK/DTMF双制式)/通话录音功能
//可以来电弹屏/通话录音/通话时获取对方按键(DTMF)
var		DEVMODULE_CALLID			 =0x2;
//是否具有可接入话机进行PSTN通话功能
//可以使用电话机进行PSTN通话/获取话机拨出的号码
var		DEVMODULE_PHONE				 =0x4;
//是否具有继电器切换断开/接通话机功能
//断开话机后可以:来电时话机不响铃/使用话机MIC独立采集录音配合DEVFUNC_RING模块给话机模拟来电震铃
var		DEVMODULE_SWITCH			 =0x8;
//PC播放语音给话机听筒,具有 DEVMODULE_SWITCH模块,switch后播放语音到话机听筒
var		DEVMODULE_PLAY2TEL			 =0x10;
//是否具有话机摘机后拨号/放音给线路的功能
//可以使用PC自动摘机进行拨号/通话时可以给对方播放语音/来电留言/外拨通知/来电IVR(语音答录)
var		DEVMODULE_HOOK				 =0x20;
//是否具有插入MIC/耳机功能
//可以用MIC/耳机进行PSTN通话/使用MIC独立录音/PC播放语音给耳机
var		DEVMODULE_MICSPK			 =0x40;
//是否具有让接在phone口的设备(电话机,交换机等)模拟震铃功能
//可以任意时刻让phone口的设备模拟来电震铃.如:在来电IVR(语音答录)之后进入工服务时给内部话机或交换机模拟震铃
var		DEVMODULE_RING				 =0x80;
//是否具有接收/发送传真功能
//可以发送图片,文档到对方的传真机/可以接收保存对方传真机发送过来的图片
var		DEVMODULE_FAX				 =0x100;
//具有级性反转检测对方摘机的功能
//如果PSTN线路在当地电信部门同时开通该级性反转检测服务,就可以在外拨时精确检测到对方摘机/挂机
//如果没有该功能,只有拨打的号码具有标准回铃才才能检测到对方摘机,对手机彩铃,IP等不具有标准回铃线路的不能检测对方摘机/挂机
var		DEVMODULE_POLARITY			 =0x800;

//是否允许电话摘机时，不需要软摘机就可以拨号
var		DEVMODULE_PHONEDIALOUT	 =0x1000;

//----------------------------------------------------------------


//打开设备类型
var		ODT_LUSBDEV						 =0x0;//本地usb设备
var		ODT_SOUND							 =0x1;//声卡
var		ODT_SIP								 =0x2;//OSIP模块
var		ODT_SOCKET_CLIENT			 =0x4;//SOCKET终端模块
var		ODT_SOCKET_SERVER			 =0x8;//SOCKET服务器模块
var		ODT_SOCKET_UDP				 =0x10;//UDP模块
var 	ODT_PLUGIN						 =0x40;//设备插入检测模块
var		ODT_ALL								 =0xFF;//全部
var		ODT_CHANNEL						 =0x100;//关闭指定CC301通道
//
//保存用户自定义参数
//保存tool用户数据立即写入文件
var		SUD_WRITEFILE					=0x1;
//加密
var		SUD_ENCRYPT					=0x2;
//
//-----------------------------------------------------
//linein线路选择
var		LINEIN_ID_1							 =0x0;//默认正常状态录音，采集来电号码等
var		LINEIN_ID_2							 =0x1;//电话机断开后话柄录音
var		LINEIN_ID_3							 =0x2;//hook line	软摘机后录音,录音数据可以提高对方的音量,降低本地音量
var		LINEIN_ID_LOOP					 =0x3;//内部环路测试,设备测试使用,建议用户不需要使用
//-----------------------------------------------------

var		ADCIN_ID_MIC							 =0x0;//mic录音
var		ADCIN_ID_LINE							 =0x1;//电话线录音

//adc
var		DOPLAY_CHANNEL1_ADC						 =0x0;
var		DOPLAY_CHANNEL0_ADC						 =0x1;
var		DOPLAY_CHANNEL0_DAC						 =0x2;
var		DOPLAY_CHANNEL1_DAC						 =0x3;

//------------
var		SOFT_FLASH							 =0x1;//使用软件调用拍插完成
var		TEL_FLASH							 =0x2;//使用话机拍插完成
//------------
//拒接时使用模式
var		REFUSE_ASYN					=0x0;//异步模式,调用后函数立即返回，但并不表示拒接完成，拒接完成后将接收到一个拒接完成的事件
var		REFUSE_SYN					=0x1;//同步模式,调用后该函数被堵塞，等待拒接完成返回，系统不再有拒接完成的事件


//拍插簧类型
var		FT_NULL								 =0x0;
var		FT_TEL								 =0x1;//话机拍插簧
var		FT_PC								 =0x2;//软拍插簧
var		FT_ALL								 =0x3;
//-------------------------------

//拨号类型
var		DTT_DIAL							 =0x0;//拨号
var		DTT_SEND							 =0x1;//二次发码/震铃发送CALLID
//-------------------------------

//来电号码模式
var		CALLIDMODE_NULL							 =0x0;//未知
var		CALLIDMODE_FSK							 =0x1;//FSK来电
var		CALLIDMODE_DTMF							 =0x2;//DTMF来电
//

//号码类型
var		CTT_NULL							 =0x0;
var		CTT_MOBILE							 =0x1;//移动号码
var		CTT_PSTN							 =0x2;//普通固话号码
//------------------------------

var		CALLT_NULL							 =0x0;//
var		CALLT_CALLIN							 =0x1;//来电
var		CALLT_CALLOUT							 =0x2;//去电
//-------------------

var		CRESULT_NULL							 =0x0;
var		CRESULT_MISSED							 =0x1;//呼入未接
var		CRESULT_REFUSE							 =0x2;//呼入拒接
var		CRESULT_RINGBACK						 =0x3;//呼叫后回铃了
var		CRESULT_CONNECTED						 =0x4;//接通
//--------------------------------------

var		OPTYPE_NULL							 =0x0;
var		OPTYPE_REMOVE							 =0x1;//上传成功后删除本地文件
//本地保存临时记录,成功后删除,如果没成功，以后可以重新传
var		OPTYPE_SAVE							=0x2;

//设备错误ID
var		DERR_READERR							 =0x0;//读取数据发送错误
var		DERR_WRITEERR							 =0x1;//写入数据错误
var		DERR_FRAMELOST							 =0x2;//丢数据包
var		DERR_REMOVE							 =0x3;//设备移除
var		DERR_SERIAL							 =0x4;//设备序列号冲突
//---------------------------------------

//语音识别时的性别类型
var		SG_NULL								 =0x0;
var		SG_MALE								 =0x1;//男性
var		SG_FEMALE							 =0x2;//女性
var		SG_AUTO								 =0x3;//自动
//--------------------------------

//设备共享模式
var		SM_NOTSHARE							 =0x0	;
var		SM_SENDVOICE							 =0x1;//发送语音
var		SM_RECVVOICE							 =0x2;//接收语音
//----------------------------------

//
var		TTS_LIST_REINIT							 =0x0;//重新初始化新的TTS列表
var		TTS_LIST_APPEND							 =0x1;//追加TTS列表文件
//------------------------------------------------

//--------------------------------------------------------
var		DIALTYPE_DTMF							 =0x0;//DTMF拨号
var		DIALTYPE_FSK							 =0x1;//FSK拨号
//--------------------------------------------------------

//--------------------------------------------------------
var		PLAYFILE_MASK_REPEAT			=0x1;//循环播放
var		PLAYFILE_MASK_PAUSE				=0x2;//默认暂停
//--------------------------------------------------------

//播放文件回调的状态
var		PLAYFILE_PLAYING				=0x1;//正在播放
var		PLAYFILE_REPEAT					=0x2;//准备重复播放
var		PLAYFILE_END						=0x3;//播放结束

var		RING_LOW							=0x0;//来电震铃静音
var		RING_HIGH						  =0x1;//来电震铃响

var		CONFERENCE_MASK_DISABLEMIC						=0x100;//停止MIC,会议中其它成员不能听到该用户说话
var		CONFERENCE_MASK_DISABLESPK						=0x200;//停止SPK,不能听到会议中其它成员说话


var		RECORD_MASK_ECHO							=0x1;//回音抵消后的数据
var		RECORD_MASK_AGC								=0x2;//自动增益后录音
var		RECORD_MASK_PAUSE							=0x4;//暂停

var		CHECKLINE_MASK_DIALOUT		=0x1;//线路是否有正常拨号音(有就可以正常软拨号)
var		CHECKLINE_MASK_REV				=0x2;//线路LINE口/PHONE口接线是否正常,不正常就表示接反了


var		CHECKDIALTONE_BEGIN				=0x0;//检测拨号音
var		CHECKDIALTONE_ENDDIAL			=0x1;//检测到拨号音准备拨号
var		CHECKDIALTONE_TIMEOUTDIAL		=0x2;//检测拨号音超时强制自动拨号
var		CHECKDIALTONE_FAILED				=0x3;//检测拨号音超时就报告拨号失败,不拨号
var		CHECKDIALTONE_DIALOUT				=0x4;//直接拨号
var		CHECKDIALTONE_SENDNUMBER		=0x5;//发送号码
var		CHECKDIALTONE_FULLCODE			=0x10;//实际拨的完整号码


var		OUTVALUE_MAX_SIZE							=260;//location返回的最大长度


//-----------------------------------------------

// 消息参数
var		MSG_KEY_SIP												='sip:'; //消息来源SIP号
var		MSG_KEY_NAME											='name:';//消息来源名称，保留
var		MSG_KEY_TIME											='time:';//消息来源时间
var		MSG_KEY_FACE											='face:';//字体名称
var		MSG_KEY_COLOR											='color:';//字体颜色
var		MSG_KEY_SIZE											='size:';//字体尺寸
var		MSG_KEY_CHARSET											='charset:';//字体特征
var		MSG_KEY_EFFECTS											='effects:';//字体效果
var		MSG_KEY_LENGTH											='length:';//消息正文长度
//CC文件参数
var		MSG_KEY_FILENAME										='filename:';//文件名
var		MSG_KEY_FILESIZE										='filesize:';//文件长度
var		MSG_KEY_FILETYPE										='filetype:';//文件类型


var		MSG_KEY_IP						="ip:";//接收到的UDP数据的IP地址
var		MSG_KEY_PORT					="port:";//接收到的UDP数据的端口

//
var		MSG_KEY_SPLIT											='\r\n';//参数之间分隔符号
var		MSG_TEXT_SPLIT										='\r\n\r\n';//消息参数和消息内容的分隔符号



///==========================
//事件定义
//--------------------------

// 本地电话机摘机事件
var	CPCEvent_PhoneHook					=1;

// 本地电话机挂机事件
var	CPCEvent_PhoneHang					=2;

// 外线通道来电响铃事件
// BRI_EVENT.lResult		为响铃次数
// CPC_EVENT.lParam=1		开始1秒响铃[RING_HIGH]
// CPC_EVENT.lParam=0		为1秒响铃完成，开始4秒静音[RING_LOW]
// CPC_EVENT.szData			本次呼入的来电号码,如果还没有接受到号码就为空，一般外线第1次震铃后才有号码
var	CPCEvent_CallIn					=3;

// 得到来电号码
// BRI_EVENT.lResult		来电号码模式(CALLIDMODE_FSK/CALLIDMODE_DTMF
// BRI_EVENT.szData		保存的来电号码
// 该事件可能在响铃前,也可能在响铃后
var	CPCEvent_GetCallID					=4;

// 对方停止呼叫(产生一个未接电话)
var	CPCEvent_StopCallIn					=5;

// 调用开始拨号后，全部号码拨号结束
var	CPCEvent_DialEnd					=6;

// 播放文件结束事件
// BRI_EVENT.lResult		 播放文件时返回的句柄ID
var	CPCEvent_PlayFileEnd			 =7;

// 多文件连播结束事件
var	CPCEvent_PlayMultiFileEnd		=8;

//播放字符结束
var	CPCEvent_PlayStringEnd			 =9;

// 播放文件结束准备重复播放
// BRI_EVENT.lResult		 播放文件时返回的句柄ID
var	CPCEvent_RepeatPlayFile			 =10;

// 给本地设备发送震铃信号时发送号码结束
var	CPCEvent_SendCallIDEnd			 =11;

//给本地设备发送震铃信号时超时
//默认不会超时
var	CPCEvent_RingTimeOut				=12;

//正在内线震铃
// BRI_EVENT.lResult		 已经响铃的次数
// CPC_EVENT.lParam=1		 开始1秒响铃[RING_HIGH]
// CPC_EVENT.lParam=0		 为1秒响铃完成，开始4秒静音[RING_LOW]
var	CPCEvent_Ringing								=13;

// 通话时检测到一定时间的静音.默认为5秒
var	CPCEvent_Silence								=14;

// 线路接通时收到DTMF码事件
// 该事件不能区分通话中是本地话机按键还是对方话机按键触发
var	CPCEvent_GetDTMFChar							=15;

// 拨号后,被叫方摘机事件（该事件仅做参考,原因如下：）
// 原因：
// 该事件只适用于拨打是标准信号音的号码时，也就是拨号后带有标准回铃音的号码。
// 如：当拨打的对方号码是彩铃(彩铃手机号)或系统提示音(179xx)都不是标准回铃音时该事件无效。
//
var	CPCEvent_RemoteHook					=16;

// 挂机事件
// 如果线路检测到被叫方摘机后，被叫方挂机时会触发该事件，不然被叫方挂机后就触发CPCEvent_Busy事件
// 该事件或者CPCEvent_Busy的触发都表示PSTN线路已经被断开
var	CPCEvent_RemoteHang					=17;

// 检测到忙音事件,表示PSTN线路已经被断开
var	CPCEvent_Busy					=18;

// 本地摘机后检测到拨号音
var	CPCEvent_DialTone								=19;

// 只有在本地话机摘机，没有调用软摘机时，检测到DTMF拨号
var	CPCEvent_PhoneDial					=20;

// 电话机拨号结束呼出事件。
// 也就时电话机拨号后接收到标准回铃音或者15秒超时
// BRI_EVENT.lResult=0 检测到回铃音//	注意：如果线路是彩铃是不会触发该类型
// BRI_EVENT.lResult=1 拨号超时
// BRI_EVENT.lResult=2 动态检测拨号码结束(根据中国大陆的号码规则进行智能分析，仅做参考)
// CPC_EVENT.lParam=1	 电脑软件拨号后触发[RINGBACK_PCDIAL]
// CPC_EVENT.lParam=0	 电话机拨号后触发[RINGBACK_TELDIAL]
// BRI_EVENT.szData		 本次呼叫的号码
var	CPCEvent_RingBack								=21;

// MIC插入状态
// 只适用具有该功能的设备
var	CPCEvent_MicIn					=22;
// MIC拔出状态
// 只适用具有该功能的设备
var	CPCEvent_MicOut					=23;

// 拍插簧(Flash)完成事件，拍插簧完成后可以检测拨号音后进行二次拨号
// BRI_EVENT.lResult=TEL_FLASH	用户使用电话机进行拍叉簧完成
// BRI_EVENT.lResult=SOFT_FLASH	调用StartFlash函数进行拍叉簧完成
var	CPCEvent_FlashEnd								=24;

// 拒接完成
var	CPCEvent_RefuseEnd					=25;

// 语音识别完成
var	CPCEvent_SpeechResult							=26;

//PSTN线路断开,线路进入空闲状态
//当前没有软摘机而且话机也没摘机
var	CPCEvent_PSTNFree								=27;

// 启动声卡失败
var	CPCEvent_OpenSoundFailed										=35;

// 产生一个PSTN呼入/呼出日志
var	CPCEvent_CallLog								=36;

//检测到连续的静音
//使用CPC_GENERAL_CHECKSILENCE启动后检测到设定的静音长度
var	CPCEvent_RecvSilence							=37;

//检测到连续的声音
//使用CPC_GENERAL_CHECKVOICE启动后检测到设定的声音长度
var	CPCEvent_RecvVoice					=38;

//远程上传事件
var	CPCEvent_UploadSuccess							=50;
var	CPCEvent_UploadFailed							=51;
// 远程连接已被断开
var	CPCEvent_RemoteDisconnect										=52;

//HTTP远程下载文件完成
//BRI_EVENT.lResult		 启动下载时返回的本次操作的句柄
var	CPCEvent_DownloadSuccess				=60;
var	CPCEvent_DownloadFailed				=61;

//线路检测结果
//BRI_EVENT.lResult	为检测结果信息
var	CPCEvent_CheckLine					=70;


// 开始软件拨号
// BRI_EVENT.szData	准备拨的号码
var	CPCEvent_DoStartDial							=106;

//设备控制改变
var CPCEvent_DevCtrl							=110;

//获取到划词取的电话号码,可以考虑弹出页面，也可以直接拨号
var	CPCEvent_WordHook						=192;

//设备可能被拔掉了,效果相当于CPCEvent_DevErr事件时的CPC_EVENT.lResult=3
var CPCEvent_PlugOut						=195;
//检测到有设备已经插入，可以尝试打开
var CPCEvent_PlugIn							=196;

// 接收到FSK信号，包括通话中FSK/来电号码的FSK
var	CPCEvent_RecvedFSK					=198;

//设备错误
var	CPCEvent_DevErr					=199;

//UDP事件
var	CPCEvent_Socket_U_RecvedData			=360;//接收到UDP数据

var	CPCEvent_EndID					=500;//空ID
var	CPCEvent_UserID					=1024;//用户自定义ID

//文件录音格式
var		CPC_WAV_FORMAT_DEFAULT			=0;	// BRI_AUDIO_FORMAT_PCM8K16B
var		CPC_WAV_FORMAT_ALAW8K			=1;	// 8k/s
var		CPC_WAV_FORMAT_ULAW8K			=2;	// 8k/s
var		CPC_WAV_FORMAT_IMAADPCM8K4B		=3;	// 4k/s
var		CPC_WAV_FORMAT_PCM8K8B			=4;	// 8k/s
var		CPC_WAV_FORMAT_PCM8K16B			=5;	//16k/s
var		CPC_WAV_FORMAT_MP38K8B			=6;	//1k/s
var		CPC_WAV_FORMAT_MP38K16B			=7;	//2k/s //保留
var		CPC_WAV_FORMAT_TM8K1B			=8;	//~1.5k/s
var		CPC_WAV_FORMAT_GSM6108K			=9;	//~2.2k/s
var		CPC_WAV_FORMAT_END			=255;	//无效ID
//保留最多256个
////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------------
//设备信息
var		CPC_DEVINFO_GETCHIPTYPE			=1;//获取USB模块类型
var		CPC_DEVINFO_GETCHIPS			=2;//获取USB模块数量,该值等于最后一个通道的DEVID
var		CPC_DEVINFO_GETTYPE			=3;//获取通道类型
var		CPC_DEVINFO_GETMODULE			=4;//获取通道功能模块
var		CPC_DEVINFO_GETCHIPCHID			=5;//获取通道所在USB芯片的中的传输ID(0或者1)
var		CPC_DEVINFO_GETSERIAL			=6;//获取通道序列号(0-n)
var		CPC_DEVINFO_GETCHANNELS			=7;//获取通道数量
var		CPC_DEVINFO_GETDEVID			=8;//获取通道所在的USB模块ID(0-n)
var		CPC_DEVINFO_GETDLLVER						=9;//获取DLL版本号
var		CPC_DEVINFO_GETCHIPCHANNEL		=10;//获取该USB模块第一个传输ID所在的通道号
var		CPC_DEVINFO_GETCHANNELTYPE		=11;//通道线路接外线还是话机类型
var		CPC_DEVINFO_GETCHIPCHANNELS		=12;//获取该USB模块第二个传输ID所在的通道号

var		CPC_DEVINFO_FILEVERSION			=20;//获取DLL的文件版本
var 	CPC_DEVINFO_FILEVERSIONL		=21;//获取DLL的文件版本[数字]

var		CPC_DEVINFO_CHECKDEVICESIGN	=30;//检查设备是否被授权
//-----------------------------------------------------------------

//参数类型列表
//uParamType (可以使用API自动保存/读取)
var		CPC_PARAM_BUSY				=1;//检测到几个忙音回调
var		CPC_PARAM_DTMFLEVEL						=2;//dtmf检测时允许的性噪声比(0-5)
var		CPC_PARAM_DTMFVOL			=3;//dtmf检测时允许的能量(1-100)
var		CPC_PARAM_DTMFNUM			=4;//dtmf检测时允许的持续时间(2-10)
var		CPC_PARAM_DTMFLOWINHIGH			=5;//dtmf低频不能超过高频值(默认为6)
var		CPC_PARAM_DTMFHIGHINLOW			=6;//dtmf高频不能超过低频值(默认为4)
var		CPC_PARAM_DIALSPEED			=7;//拨号的DTMF长度(1ms-60000ms)
var		CPC_PARAM_DIALSILENCE			=8;//拨号时的间隔静音长度(1ms-60000ms)
var		CPC_PARAM_DIALVOL			=9;//拨号音量大小
var		CPC_PARAM_RINGSILENCE			=10;//来电不响铃多少时间超时算未接电话
var		CPC_PARAM_CONNECTSILENCE		=11;//通话时连续多少时间静音后回调
var		CPC_PARAM_RINGBACKNUM			=12;//拨几个数字以上后检测回铃开始有效//默认为2个,可起到忽略出局号码后检测的回铃音
var		CPC_PARAM_SWITCHLINEIN			=13;//自动切换LINEIN选择
var		CPC_PARAM_FLASHELAPSE			=14;//拍插簧间隔
var		CPC_PARAM_FLASHENDELAPSE		=15;//拍插簧后延迟一定时间再回调事件
var		CPC_PARAM_RINGELAPSE			=16;//内线震铃时时间长度
var		CPC_PARAM_RINGSILENCEELAPSE		=17;//内线震铃时静音长度
var		CPC_PARAM_RINGTIMEOUT			=18;//内线震铃时超时次数
var		CPC_PARAM_RINGCALLIDTYPE		=19;//内线震铃时发送号码的方式dtmf/fsk
var		CPC_PARAM_REFUSEELAPSE			=20;//拒接时间隔时间长度
var		CPC_PARAM_DIALTONETIMEOUT		=21;//检测拨号音超时
var		CPC_PARAM_MINCHKFLASHELAPSE		=22;//拍插簧检测时挂机至少的时间ms,挂机时间小于该值就不算拍插簧
var		CPC_PARAM_MAXCHKFLASHELAPSE		=23;//拍插簧检测时挂机最长的时间ms,挂机时间大于该值就不算拍插簧
var		CPC_PARAM_HANGUPELAPSE			=24;//检测电话机挂机时的至少时间长度ms,//建议挂机检测次数在拍插簧以上，避免发生挂机后又检测到拍插
var		CPC_PARAM_OFFHOOKELAPSE			=25;//检测电话机摘机时的至少时间长度ms
var		CPC_PARAM_RINGHIGHELAPSE		=26;//检测来电震铃时响铃的至少时间长度ms
var		CPC_PARAM_RINGLOWELAPSE			=27;//检测来电震铃时不响铃的至少时间长度ms
var		CPC_PARAM_DIALTONERESULT		=28;//检测拨号音超时后强制拨号还是提示拨号dostartdial失败


var		CPC_PARAM_SPEECHGENDER			=30;//语音设置性别
var		CPC_PARAM_SPEECHTHRESHOLD		=31;//语音识别门限
var		CPC_PARAM_SPEECHSILENCEAM		=32;//语音识别静音门限
var		CPC_PARAM_ECHOTHRESHOLD			=33;//回音抵消处理抵消门限参数
var		CPC_PARAM_ECHODECVALUE			=34;//回音抵消处理减少增益参数
var		CPC_PARAM_SIGSILENCEAM			=35;//信号音/线路通话分析的静音门限

var		CPC_PARAM_LINEINFREQ1TH			=40;//第一组线路双频模式信号音频率
var		CPC_PARAM_LINEINFREQ2TH			=41;//第二组线路双频模式信号音频率
var		CPC_PARAM_LINEINFREQ3TH			=42;//第三组线路双频模式信号音频率

var		CPC_PARAM_ADBUSYMINFREQ			=45;//检测忙音叠加时最小频率
var		CPC_PARAM_ADBUSYMAXFREQ			=46;//检测忙音叠加时最大频率

//增益控制
var		CPC_PARAM_AM_MIC			=50;//MIC增益
var		CPC_PARAM_AM_SPKOUT			=51;//耳机spk增益
var		CPC_PARAM_AM_LINEIN			=52;//线路输入能量
var		CPC_PARAM_AM_LINEOUT			=53;//mic到线路能量+播放语音到到线路能量
var		CPC_PARAM_AM_DOPLAY			=54;//喇叭输出增益
//

var		CPC_PARAM_CITYCODE			=60;//城市区号,适合中国大陆
var		CPC_PARAM_PROXYDIAL			=61;//代拨号
var		CPC_PARAM_CITYCODEL			=62;//城市区号(字符格式)
var		CPC_PARAM_EXTCODE				=63;//出局号码
var		CPC_PARAM_EXTCODEL			=64;//出局号码,不要符号，只要前面的数字和*,#,用来跟拨的号码比较是否一样了，一样就表示出局了,只有get,没有set
var		CPC_PARAM_MOBILEZERO		=65;//手机号码根据设置的本地区号比较自动加去开头的0
var		CPC_PARAM_PHONEDIALEND	=66;//电话机拨号时根据设置的区号来判断长度自动结束回铃
var		CPC_PARAM_PRECALLID			=67;//来电号码前缀，如果来电号码前几个跟这一样就自动删除掉留下后面部分,包括*,#所以要用字符格式
var		CPC_PARAM_AREACALLID		=68;//不是手机号码，来电号码长度超过9位，而且第一个不是0就自动加0


var		CPC_PARAM_FINDSVRTIMEOUT		=70;//设置自动CC搜索超时时间
var		CPC_PARAM_CONFJITTERBUF			=71;//会议交换的动态缓冲大小

var		CPC_PARAM_RINGTHRESHOLD			=80;//来电响铃信号分析门限

var		CPC_PARAM_DTMFCALLIDLEVEL		=100;//dtmf来电号码检测时允许的性噪声比(0-7)
var		CPC_PARAM_DTMFCALLIDNUM			=101;//dtmf来电号码检测时允许的持续时间(2-10)
var		CPC_PARAM_DTMFCALLIDVOL			=102;//dtmf来电号码检测时允许的能量要求

var		CPC_PARAM_DTMFSECTONERATE		=105;//dtmf检测的2次谐波比例不能超过该值1-128，建议在30-70
var		CPC_PARAM_FSKFILTER					=110;//是否开启FSK信号滤波,如果来电号码里有很高概率乱码时可以切换该参数测试
var		CPC_PARAM_FSKSPACEAM				=111;//FSK信号匹配参数,默认为100,范围为20-1000.200表示放大一倍，恢复高频被衰减部分，提高可靠度,建议在100-400之间

var		CPC_PARAM_SOUNDBUFNUM				=120;//声卡播放缓冲数量

var	  CPC_PARAM_TOOLTIPFONTSIZE	  =130;//Tooltip 文本字体大小

//设备控制/状态
//uCtrlType
var		CPC_CTRL_DOSHARE			=1;//设备共享
var		CPC_CTRL_DOHOOK				=2;//软件摘挂机控制
var		CPC_CTRL_DOPHONE			=3;//控制电话机是否可用,可控制话机震铃,实现硬拍插簧等
var		CPC_CTRL_DOPLAY				=4;//喇叭控制开关
var		CPC_CTRL_DOLINETOSPK			=5;//线路声音到耳机，用耳机通话时打开
var		CPC_CTRL_DOPLAYTOSPK			=6;//播放的语音到耳机
var		CPC_CTRL_DOMICTOLINE			=7;//MIC说话声到电话线
var		CPC_CTRL_ECHO				=8;//打开/关闭回音抵消
var		CPC_CTRL_RECVFSK			=9;//打开/关闭接收FSK来电号码
var		CPC_CTRL_RECVDTMF			=10;//打开/关闭接收DTMF
var		CPC_CTRL_RECVSIGN			=11;//打开/关闭信号音检测
var		CPC_CTRL_WATCHDOG			=12;//打开关闭看门狗
var		CPC_CTRL_PLAYMUX			=13;//选择到喇叭的语音通道 line1x/pcplay ch0/line2x/pcplay ch1
var		CPC_CTRL_PLAYTOLINE			=14;//播放的语音到line
var		CPC_CTRL_SELECTLINEIN			=15;//选择输入的线路line通道
var		CPC_CTRL_SELECTADCIN			=16;//选择输入的为线路还是MIC语音
var		CPC_CTRL_PHONEPOWER			=17;//打开/关闭给话机供电使能,如果不给话机供电,dophone切换后,话机将不可用,所有对话机的操作都无效
var		CPC_CTRL_RINGPOWER			=18;//内线震铃使能
var		CPC_CTRL_LEDPOWER			=19;//LED指示灯
var		CPC_CTRL_LINEOUT			=20;//线路输出使能
var		CPC_CTRL_SWITCHOUT			=21;//硬件回音抵消
var		CPC_CTRL_UPLOAD				=22;//打开/关闭设备USB数据上传功能,关闭后将接收不到设备语音数据
var		CPC_CTRL_DOWNLOAD			=23;//打开/关闭设备USB数据下载功能,关闭后将不能发送语音/拨号到设备
var		CPC_CTRL_POLARITY			=24;//开关级性反转摘机检测
var		CPC_CTRL_ADBUSY				=25;//是否打开检测忙音叠加时环境(只有在使用两路外线网关时由于同时挂机才会触发忙音被叠加的环境,普通用户不需要使用)
var		CPC_CTRL_RECVCALLIN			=26;//打开/关闭软解码来电
var		CPC_CTRL_READFRAMENUM			=27;//一次请求读取的USB帧数量，越大占用CPU越小，延迟也就越大，一帧为4ms,最大30帧，也就是设置范围为(1-30)
var		CPC_CTRL_DTMFCALLID			=28;//忽略DTMF模式接收来电号码,默认是开启检测的

//以下状态不能设置(set),只能获取(get)
var		CPC_CTRL_PHONE				=30;//电话机摘挂机状态
var		CPC_CTRL_MICIN				=31;//mic插入状态
var		CPC_CTRL_RINGTIMES			=32;//来电响铃的次数
var		CPC_CTRL_RINGSTATE			=33;//来电响铃状态，正在响还是不响
//

//放音控制
//uPlayType
var		CPC_PLAY_FILE_START						=1;//开始播放文件
var		CPC_PLAY_FILE_SETCALLBACK		=2;//设置播放文件回调函数
var		CPC_PLAY_FILE_SETVOLUME			=3;//设置播放文件音量
var		CPC_PLAY_FILE_GETVOLUME			=4;//获取播放文件音量
var		CPC_PLAY_FILE_PAUSE			=5;//暂停播放文件
var		CPC_PLAY_FILE_RESUME			=6;//恢复播放文件
var		CPC_PLAY_FILE_ISPAUSE			=7;//检测是否已暂停播放
var		CPC_PLAY_FILE_SETREPEAT			=8;//设置是否循环播放
var		CPC_PLAY_FILE_ISREPEAT			=9;//检测是否在循环播放
var		CPC_PLAY_FILE_SEEKTO			=11;//跳转到某个时间(ms)
var		CPC_PLAY_FILE_SETREPEATTIMEOUT					=12;//设置循环播放超时次数
var		CPC_PLAY_FILE_GETREPEATTIMEOUT					=13;//获取循环播放超时次数
var		CPC_PLAY_FILE_SETPLAYTIMEOUT					=14;//设置播放总共超时时长(ms)
var		CPC_PLAY_FILE_GETPLAYTIMEOUT					=15;//获取播放总共超时时长
var		CPC_PLAY_FILE_TOTALLEN			=16;//总共时间(ms)
var		CPC_PLAY_FILE_CURSEEK			=17;//当前播放的文件时间位置(ms)
var		CPC_PLAY_FILE_ELAPSE			=18;//总共播放的时间(ms),包括重复的,后退的,不包括暂停的时间
var		CPC_PLAY_FILE_ISPLAY			=19;//该句柄是否在播放
var		CPC_PLAY_FILE_ENABLEAGC			=20;//打开关闭自动增益
var		CPC_PLAY_FILE_ISENABLEAGC		=21;//检测是否打开自动增益
var		CPC_PLAY_FILE_STOP						=22;//停止播放指定文件
var		CPC_PLAY_FILE_GETCOUNT			=23;//获取正在文件播放的数量,可以用来检测如果没有了就可以关闭喇叭
var		CPC_PLAY_FILE_STOPALL			=24;//停止播放所有文件
var		CPC_PLAY_FILE_REMOTEBUFFERLEN		=25;//远程播放需要下载的缓冲长度
var		CPC_PLAY_FILE_REMOTEBUFFERSEEK		=26;//远程播放已经下载的缓冲长度
//--------------------------------------------------------

var		CPC_PLAY_MULTIFILE_START		=1;//开始多文件连续播放
var		CPC_PLAY_MULTIFILE_PAUSE		=2;//暂停多文件连续播放
var		CPC_PLAY_MULTIFILE_RESUME		=3;//恢复多文件连续播放
var		CPC_PLAY_MULTIFILE_ISPAUSE		=4;//检测是否暂停了多文件连续播放
var		CPC_PLAY_MULTIFILE_SETVOLUME					=5;//设置多文件播放音量
var		CPC_PLAY_MULTIFILE_GETVOLUME					=6;//获取多文件播放音量
var		CPC_PLAY_MULTIFILE_STOP			=7;//停止多文件连续播放
var		CPC_PLAY_MULTIFILE_STOPALL		=8;//停止全部多文件连续播放
//--------------------------------------------------------

//录音控制
//uRecordType
var		CPC_RECORD_FILE_START			=1;//开始文件录音
var		CPC_RECORD_FILE_PAUSE			=2;//暂停文件录音
var		CPC_RECORD_FILE_RESUME			=3;//恢复文件录音
var		CPC_RECORD_FILE_ISPAUSE			=4;//检测是否暂停文件录音
var		CPC_RECORD_FILE_ELAPSE			=5;//获取已经录音的时间长度,单位(s)
var		CPC_RECORD_FILE_SETVOLUME		=6;//设置文件录音音量
var		CPC_RECORD_FILE_GETVOLUME		=7;//获取文件录音音量
var		CPC_RECORD_FILE_PATH			=8;//获取文件录音的路径
var		CPC_RECORD_FILE_STOP			=9;//停止某个文件录音
var		CPC_RECORD_FILE_STOPALL			=10;//停止全部文件录音
var		CPC_RECORD_FILE_COUNT			=11;//获取正在录音的数量
var		CPC_RECORD_FILE_SETROOT			=20;//设置默认录音目录
var		CPC_RECORD_FILE_GETROOT			=21;//获取默认录音目录


//会议控制
//uConferenceType
var		CPC_CONFERENCE_CREATE			=1;//创建会议
var		CPC_CONFERENCE_ADDTOCONF		=2;//增加通道到某个会议
var		CPC_CONFERENCE_GETCONFID		=3;//获取某个通道的会议ID
var		CPC_CONFERENCE_SETSPKVOLUME		=4;//设置会议中某个通道放音音量
var		CPC_CONFERENCE_GETSPKVOLUME		=5;//获取会议中某个通道放音音量
var		CPC_CONFERENCE_SETMICVOLUME		=6;//设置会议中某个通道录音音量
var		CPC_CONFERENCE_GETMICVOLUME		=7;//获取会议中某个通道录音音量
var		CPC_CONFERENCE_PAUSE			=8;//暂停某个会议
var		CPC_CONFERENCE_RESUME			=9;//恢复某个会议
var		CPC_CONFERENCE_ISPAUSE			=10;//检测是否暂停了某个会议
var		CPC_CONFERENCE_ENABLESPK		=11;//打开关闭会议者听功能
var		CPC_CONFERENCE_ISENABLESPK		=12;//检测会议者听功能是否打开
var		CPC_CONFERENCE_ENABLEMIC		=13;//打开关闭会议者说功能
var		CPC_CONFERENCE_ISENABLEMIC		=14;//检测会议者说功能是否打开
var		CPC_CONFERENCE_ENABLEAGC		=15;//打开关闭自动增益
var		CPC_CONFERENCE_ISENABLEAGC		=16;//检测是否打开了自动增益
var		CPC_CONFERENCE_DELETECHANNEL					=17;//把通道从会议中删除
var		CPC_CONFERENCE_DELETECONF		=18;//删除一个会议
var		CPC_CONFERENCE_DELETEALLCONF					=19;//删除全部会议
var		CPC_CONFERENCE_GETCONFCOUNT		=20;//获取会议数量
var		CPC_CONFERENCE_SETJITTERBUFSIZE		=21;//设置会议动态缓冲长度
var		CPC_CONFERENCE_GETJITTERBUFSIZE		=22;//获取会议动态缓冲长度

var		CPC_CONFERENCE_RECORD_START		=30;//开始录音
var		CPC_CONFERENCE_RECORD_PAUSE		=31;//暂停录音
var		CPC_CONFERENCE_RECORD_RESUME					=32;//恢复录音
var		CPC_CONFERENCE_RECORD_ISPAUSE					=33;//检测是否暂停录音
var		CPC_CONFERENCE_RECORD_FILEPATH					=34;//获取录音文件路径
var		CPC_CONFERENCE_RECORD_ISSTART		=35;//检测会议是否已经启动了录音
var		CPC_CONFERENCE_RECORD_STOP		=36;//停止指定会议录音
var		CPC_CONFERENCE_RECORD_STOPALL					=37;//停止全部会议录音
//--------------------------------------------------------



//函数general
//uGeneralType
var		CPC_GENERAL_STARTDIAL			=1;//自动软摘机检测拨号音后开始拨号
var		CPC_GENERAL_SENDNUMBER			=2;//二次拨号,直接发送DTMF,所有代拨参数都无效
var		CPC_GENERAL_REDIAL			=3;//重拨最后一次呼叫的号码,程序退出后该号码被释放
var		CPC_GENERAL_STOPDIAL			=4;//停止拨号
var		CPC_GENERAL_ISDIALING			=5;//是否在拨号
var		CPC_GENERAL_DIALOUT				=6;//不软摘机检测拨号音,直接开始拨号

var		CPC_GENERAL_STARTRING			=10;//phone口震铃
var		CPC_GENERAL_STOPRING			=11;//phone口震铃停止
var		CPC_GENERAL_ISRINGING			=12;//phone口是否在震铃

var		CPC_GENERAL_STARTFLASH			=20;//拍插簧
var		CPC_GENERAL_STOPFLASH			=21;//拍插簧停止
var		CPC_GENERAL_ISFLASHING			=22;//是否正在拍插簧

var		CPC_GENERAL_STARTREFUSE			=30;//拒接当前呼入
var		CPC_GENERAL_STOPREFUSE			=31;//终止拒接操作
var		CPC_GENERAL_ISREFUSEING			=32;//是否正在拒接当前呼入

var		CPC_GENERAL_GETCALLIDTYPE		=50;//获取本次呼入的来电号码类型
var		CPC_GENERAL_GETCALLID			=51;//获取本次呼入的来电号码
var		CPC_GENERAL_GETTELDIALCODE		=52;//获取本次电话机拨出的号码类型,return	buf
var		CPC_GENERAL_GETTELDIALCODEEX					=53;//获取本次电话机拨出的号码类型,outbuf
var		CPC_GENERAL_RESETTELDIALBUF		=54;//清空电话拨的号码缓冲
var		CPC_GENERAL_GETTELDIALLEN		=55;//电话机已拨的号码长度

var		CPC_GENERAL_STARTSHARE			=60;//启动设备共享服务
var		CPC_GENERAL_STOPSHARE			=61;//停止设备共享服务
var		CPC_GENERAL_ISSHARE			=62;//是否启用设备共享服务模块

var		CPC_GENERAL_ENABLECALLIN		=70;//禁止/启用外线呼入
var		CPC_GENERAL_ISENABLECALLIN		=71;//外线是否允许呼入
var		CPC_GENERAL_ISLINEHOOK			=72;//外线是否摘机状态(电话机摘机并连着line或者有软摘机都表示摘机状态)
var		CPC_GENERAL_ISLINEFREE			=73;//外线是否空闲(没有摘机并且没有来电表示空闲)


var		CPC_GENERAL_RESETRINGBACK		=80;//复位检测到的回铃,重新启动检测
var		CPC_GENERAL_CHECKCHANNELID		=81;//检测通道ID是否合法
var		CPC_GENERAL_CHECKDIALTONE		=82;//检测拨号音
var		CPC_GENERAL_CHECKSILENCE		=83;//检测线路静音
var		CPC_GENERAL_CHECKVOICE			=84;//检测线路声音
var		CPC_GENERAL_CHECKLINESTATE		=85;//检测线路状态(是否可正常拨号/是否接反)
var		CPC_GENERAL_GETMAXPOWER			=86;//获取当前最大语音幅度

var		CPC_GENERAL_SETUSERVALUE		=90;//用户自定义通道数据,系统退出后自动释放
var		CPC_GENERAL_SETUSERSTRING		=91;//用户自定义通道字符,系统退出后自动释放
var		CPC_GENERAL_GETUSERVALUE		=92;//获取用户自定义通道数据
var		CPC_GENERAL_GETUSERSTRING		=93;//获取用户自定义通道字符

var		CPC_GENERAL_GETOSIPVALID		=95;//获取osip是否已授权
var		CPC_GENERAL_GETOSIPSERIAL		=96;//获取osip序列码
var		CPC_GENERAL_SETOSIPCHECK		=97;//设置osip授权码
var   CPC_GENERAL_GETDEVICESIGN = 98;//获取设备码
var		CPC_GENERAL_USEREVENT			=99;//发送用户自定义事件
//初始化通道INI文件参数
var		CPC_GENERAL_READPARAM			=100;//读取ini文件进行全部参数初始化
var		CPC_GENERAL_WRITEPARAM			=101;//把参数写入到ini文件
//
var		CPC_GENERAL_EXTCODE					=200;//
var		CPC_GENERAL_PROXYDIAL				=201;//

//call log
var		CPC_CALLLOG_BEGINTIME			=1;//获取呼叫开始时间
var		CPC_CALLLOG_RINGBACKTIME		=2;//获取回铃时间
var		CPC_CALLLOG_CONNECTEDTIME		=3;//获取接通时间
var		CPC_CALLLOG_ENDTIME				=4;//获取结束时间
var		CPC_CALLLOG_CALLTYPE			=5;//获取呼叫类型/呼入/呼出
var		CPC_CALLLOG_CALLRESULT			=6;//获取呼叫结果
var		CPC_CALLLOG_CALLID						=7;//获取号码
var		CPC_CALLLOG_CALLRECFILE			=8;//获取录音文件路径
var		CPC_CALLLOG_DELRECFILE			=9;//删除录音文件，要删除前必须先停止录音

var		CPC_CALLLOG_RESET			=20;//复位所有状态
var		CPC_CALLLOG_AUTORESET			=21;//自动复位

//工具函数，跟设备无关
//uToolType
var		CPC_TOOL_PSTNEND			=1;//检测PSTN号码是否已经结束
var		CPC_TOOL_CODETYPE			=2;//判断号码类型(内地手机/固话)
var		CPC_TOOL_LOCATION			=3;//获取号码所在地信息
var		CPC_TOOL_DISKFREESPACE			=4;//获取该硬盘剩余空间(M)
var		CPC_TOOL_DISKTOTALSPACE			=5;//获取该硬盘总共空间(M)
var		CPC_TOOL_DISKLIST			=6;//获取硬盘列表
var		CPC_TOOL_RESERVID1			=7;//保留
var		CPC_TOOL_RESERVID2			=8;//保留
var		CPC_TOOL_CONVERTFMT						=9;//转换语音文件格式
var		CPC_TOOL_SELECTDIRECTORY		=10;//选择目录
var		CPC_TOOL_SELECTFILE			=11;//选择文件
var		CPC_TOOL_CONVERTTOTIFF			=12;//转换图片到传真tiff格式,必须先启动传真模块,支持格式:(*.doc,*.htm,*.html,*.mht,*.jpg,*.pnp.....)
var		CPC_TOOL_APMQUERYSUSPEND		=13;//是否允许PC进入待机/休眠,打开USB设备后才能使用
var		CPC_TOOL_SLEEP				=14;//让调用该方法的线程等待N毫秒
var		CPC_TOOL_SETUSERVALUE			=15;//保存用户自定义信息
var		CPC_TOOL_GETUSERVALUE			=16;//读取用户自定义信息
var		CPC_TOOL_ISFILEEXIST			=17;//检测本地文件是否存在
var		CPC_TOOL_GETUSERVALUEI			=18;//读取用户自定义信息
var		CPC_TOOL_ISFILEEXIST			=20;//检测本地文件是否存在
var		CPC_TOOL_FSKENCODE			=21;//FSK编码
var		CPC_TOOL_WRITELOG			=22;//写文件日志->userlog目录
var		CPC_TOOL_SHOWTOOLTIP	=23;//在显示器右下角显示提示文字
var		CPC_TOOL_WORDHOOK			=24;//启动关闭划词取号
//------------------------------------------------------

//存储操作
var		CPC_STORAGE_PUBLIC_READ			=1;//读取共享区域数据
var		CPC_STORAGE_PUBLIC_READSTR		=2;//读取共享区域字符串数据,读到'\0'自动结束
var		CPC_STORAGE_PUBLIC_WRITE		=3;//写入共享区域数据
var		CPC_STORAGE_PUBLIC_SETREADPWD		=4;//设置读取共享区域数据的密码
var		CPC_STORAGE_PUBLIC_SETWRITEPWD		=5;//设置写入共享区域数据的密码
var		CPC_STORAGE_PUBLIC_GETSPACESIZE		=6;//获取存储空间长度


//远程操作
//RemoteType
var		CPC_REMOTE_UPLOAD_START			=1;//上传文件到WEB服务器(http协议)
var		CPC_REMOTE_UPLOAD_DATA			=2;//上传字符数据到WEB服务器(send/post)(保留)
var		CPC_REMOTE_UPLOAD_STOP			=3;//上传文件到WEB服务器(http协议)
var		CPC_REMOTE_UPLOAD_LOG				=4;//重新上传以前没有成功的记录
var		CPC_REMOTE_UPLOAD_TOTALSIZE			=5;//获取需要上传的总共长度
var		CPC_REMOTE_UPLOAD_TRANSIZE		=6;//获取已经上传的长度
var		CPC_REMOTE_UPLOAD_CLEARLOG		=7;//删除所有未成功的日志
var		CPC_REMOTE_UPLOAD_COUNT			=8;//
var		CPC_REMOTE_UPLOAD_STOPALL			=9;//

var		CPC_REMOTE_DOWNLOAD_START			=20;//开始下载远程文件
var		CPC_REMOTE_DOWNLOAD_STOP		=21;//停止下载远程文件
var		CPC_REMOTE_DOWNLOAD_TOTALSIZE			=22;//下载的总共长度
var		CPC_REMOTE_DOWNLOAD_TRANSIZE		=23;//已经下载的长度
var		CPC_REMOTE_DOWNLOAD_COUNT			=24;//
var		CPC_REMOTE_DOWNLOAD_STOPALL			=25;//

var		CPC_REMOTE_SETCOOKIE			=40;//设置HTTP连接的COOKIE

//---------------------------------------
//err 错误代码
//---------------------------------------
//USB设备操作 返回的错误ID
var		BCERR_BASE					=-9;  //最小错误值
var		BCERR_INVALIDHANDLE			=-9;  //不合法的句柄
var		BCERR_NOPLAYHANDLE			=-10; //没有空闲播放句柄
var		BCERR_OPENFILEFAILED		=-11; //打开文件失败
var		BCERR_READFILEFAILED		=-12; //读取文件数据错误
var		BCERR_WAVHEADERFAILED		=-13; //解析文件头失败
var		BCERR_NOTSUPPORTFORMAT		=-14; //语音格式不支持
var		BCERR_NORECHANDLE			=-15; //没有足够的录音句柄
var		BCERR_CREATEFILEFAILED		=-16; //创建录音文件失败,检查文件路径格式
var		BCERR_NOBUFSIZE				=-17; //缓冲不够
var		BCERR_PARAMERR				=-18; //参数错误
var		BCERR_INVALIDTYPE			=-19; //不合法的参数类型		
var		BCERR_INVALIDCHANNEL		=-20; //不合法的通道ID
var		BCERR_ISMULTIPLAYING		=-21; //正在多文件播放,请先停止播放
var		BCERR_ISCONFRECING			=-22; //正在会议录音,请先停止录音
var		BCERR_INVALIDCONFID			=-23; //错误的会议ID号
var		BCERR_NOTCREATECONF			=-24; //会议模块还未创建
var		BCERR_NOTCREATEMULTIPLAY	=-25; //没有开始多文件播放
var		BCERR_NOTCREATESTRINGPLAY	=-26; //没有开始字符播放
var		BCERR_ISFLASHING			=-27; //正在拍插簧,请先停止
var		BCERR_FLASHNOTLINE			=-28; //设备没有接通线路不能拍插簧
var		BCERR_NOTLOADFAXMODULE		=-29; //未启动传真模块
var		BCERR_FAXMODULERUNING		=-30; //传真正在使用，请先停止
var		BCERR_VALIDLICENSE			=-31; //错误的license
var		BCERR_ISFAXING				=-32; //正在传真不能软挂机
var		BCERR_CCMSGOVER				=-33; //CC消息长度太长
var		BCERR_CCCMDOVER				=-34; //CC命令长度太长
var		BCERR_INVALIDSVR			=-35; //服务器错误
var		BCERR_INVALIDFUNC			=-36; //未找到指定函数模块
var		BCERR_INVALIDCMD			=-37; //未找到指定命令
var		BCERR_UNSUPPORTFUNC			=-38; //设备不支持该功能unsupport func
var		BCERR_DEVNOTOPEN			=-39; //未打开指定设备
var		BCERR_INVALIDDEVID			=-40; //不合法的ID
var		BCERR_INVALIDPWD			=-41; //密码错误
var		BCERR_READSTOREAGEERR		=-42; //读取存储错误
var		BCERR_INVALIDPWDLEN			=-43; //密码长度太长
var		BCERR_NOTFORMAT				=-44; //flash还未格式化
var		BCERR_FORMATFAILED			=-45; //格式化失败
var		BCERR_NOTENOUGHSPACE		=-46; //写入的FLASH数据太长,存储空间不够
var		BCERR_WRITESTOREAGEERR		=-47; //写入存储错误
var		BCERR_NOTSUPPORTCHECK		=-48; //通道不支持线路检测功能
var		BCERR_INVALIDPATH			=-49; //不合法的文件路径
var		BCERR_AUDRVINSTALLED		=-50; //虚拟声卡驱动已经安装
var		BCERR_AUDRVUSEING			=-51; //虚拟声卡正在使用不能覆盖,请退出正在使用该驱动的软件或者重新启动电脑再安装
var		BCERR_AUDRVCOPYFAILED		=-52; //虚拟声卡驱动文件复制失败
var		BCERR_ISALREADYEXIST		=-53; //已经存在
var		BCERR_RENAMEFAILED			=-54; //重命名文件失败，必须在同一个目录才可能成功
var		BCERR_DIALCODEEMPTY			=-55; //拨号号码为空
var		BCERR_NOTMALLOC				=-56; //为初始化内存
var		BCERR_NOTAUTHORIZE			=-57; //功能未授权
var		BCERR_DEVEXCLUSIVE			=-58; //设备被占用
var		BCERR_READINOFFAILED		=-59; //读取设备信息失败
var		BCERR_REFUSENOTCALLIN		=-60; //当前没有来电，拒接失败

var		ERROR_INVALIDDLL			=-198;//不合法的DLL文件
var		ERROR_NOTINIT				=-199;//还没有初始化任何设备
var		BCERR_UNKNOW				=-200;//未知错误

//----------------------------------------

//-----------
var			OSIPERR_NOTLOGIN					=-100;
//------------

var			OSIPLOGIN_FAILED					=0;
var			OSIPLOGIN_SUCCESS					=1;
var			OSIPLOGIN_REGISTER				=2;

var			OSIPLOGOUT_FAILED					=10;
var			OSIPLOGOUT_SUCCESS				=11;

var			OSIPMESSAGE_SEND_FAILED		=0;
var			OSIPMESSAGE_SEND_TIMEOUT		=1;
var			OSIPMESSAGE_SEND_SUCCESS		=2;
var			OSIPMESSAGE_RECV_SUCCESS		=3;
var 		OSIPMESSAGE_RECV_NOTEXIST		=4;

//------------
var			OSIPCALLOUT_STEP_NULL					=0;
var			OSIPCALLOUT_STEP_CREATE			=101;//创建新的呼叫
var			OSIPCALLOUT_STEP_INVITE			=102;//正在呼叫
var			OSIPCALLOUT_STEP_TRYING			=103;//对方已经接收到请求
var			OSIPCALLOUT_STEP_RINGING			=104;//正在响铃
var			OSIPCALLOUT_STEP_CONNECTING	=105;//正在连接
var			OSIPCALLOUT_STEP_FAILED			=106;//呼叫失败

var			OSIPCALLOUT_STEP_ESTABLISHED		=108;//接通

var			OSIPCALLOUT_STEP_DOCANCEL			=110;//本地挂机
var			OSIPCALLOUT_STEP_DOBYE				=111;//本地挂机
var			OSIPCALLOUT_STEP_DOREFUSE			=112;//拒接
var			OSIPCALLOUT_STEP_DOHOLD			=113;//呼叫保持

var			OSIPCALLOUT_STEP_REMOTEHANG		=120;//对方挂机
var			OSIPCALLOUT_STEP_FINISHED			=121;//错误或者结束
var			OSIPCALLOUT_STEP_TIMEOUT			=122;//超时
var			OSIPCALLOUT_STEP_REFER				=123;//呼叫转移

var			OSIPCALLOUT_STEP_DELETE			=130
//------------
var			OSIPCALLIN_STEP_NULL					=0;
var			OSIPCALLIN_STEP_CREATE				=201;//新的呼叫
var			OSIPCALLIN_STEP_INVITE				=202;//正在呼叫
var			OSIPCALLIN_STEP_TRYING				=203;//已经接收到请求
var			OSIPCALLIN_STEP_RINGING			=204;//正在回铃
var			OSIPCALLIN_STEP_CONNECTING			=205;//正在连接
var			OSIPCALLIN_STEP_FAILED				=206;//呼叫失败
var			OSIPCALLIN_STEP_ESTABLISHED		=208;//接通

var			OSIPCALLIN_STEP_DOCANCEL			=210;//停止呼叫
var			OSIPCALLIN_STEP_DOBYE				=211;//本地挂机
var			OSIPCALLIN_STEP_DOREFUSE			=212;//本地拒接
var			OSIPCALLIN_STEP_DOHOLD				=213;//呼叫保持

var			OSIPCALLIN_STEP_REMOTEHANG			=220;//对方挂机
var			OSIPCALLIN_STEP_FINISHED			=221;//错误或者结束
var			OSIPCALLIN_STEP_TIMEOUT			=222;//超时
var			OSIPCALLIN_STEP_REFER				=223;//呼叫转移
var			OSIPCALLIN_STEP_DELETE				=230;//

//==============================
//事件
var			OSIPEVENT_LOGIN						=20000;
var			OSIPEVENT_LOGOUT					=20001;

var			OSIPEVENT_CALLIN					=20010;
var			OSIPEVENT_CALLOUT					=20011;

var			OSIPEVENT_RECVDTMF				=20020;

var			OSIPEVENT_MESSAGE					=20030;

//-----
var			OSIPSEVENT_LOGIN					=30000;
var			OSIPSEVENT_LOGOUT					=30001;

var			OSIPSEVENT_CALLIN					=30010;
var			OSIPSEVENT_CALLOUT				=30011;

var			OSIPSEVENT_RECVDTMF				=30020;

var			OSIPSEVENT_MESSAGE				=30030;

var			OSIPSEVENT_RECORDFILESTART	=30210;
var			OSIPSEVENT_RECORDFILESTOP		=30211;

//=====remote
var			OSIPSEVENT_UPDATESTATE		=30350;
//内部接收到的应答消息
var			OSIPSEVENT_REPLYCMD				=31050;
//======
var			OSIPS_STATE_LOGIN					  =1;
var			OSIPS_STATE_LOGOUT					=2;
var			OSIPS_STATE_BUSY						=3;
var			OSIPS_STATE_FREE						=4;
var			OSIPS_STATE_CALLIN				  =5;
var			OSIPS_STATE_CALLOUT				  =6;

var			OSIPS_STATE_REPEATLOGIN		  =32;	
//
//==============================
//API操作
var			OSIP_CTRL_SETLICENSE				=1;
var			OSIP_CTRL_SETSERVER					=2;
var			OSIP_CTRL_LOGIN						=3;
var			OSIP_CTRL_LOGOUT					=4;
var			OSIP_CTRL_ISLOGON					=5;

var			OSIP_CTRL_GETSERVER				=100;
var			OSIP_CTRL_GETUSERAGENT		=101;
var			OSIP_CTRL_GETACCOUNT			=102;
var			OSIP_CTRL_GETEXT					=103;
//======================
//呼叫
var			OSIP_CALL_START						=3;
var			OSIP_CALL_STOP						=4;
var			OSIP_CALL_STOPALL					=5;
var			OSIP_CALL_SENDRING					=6;
var			OSIP_CALL_ANSWER					=7;
var			OSIP_CALL_DOHOLD					=8;//呼叫保持,c=(0.0.0.0)
var			OSIP_CALL_GETSTEP					=9;

var			OSIP_CALL_GETCONFID					=20;
var			OSIP_CALL_GETOSIPCHANNELID	=21;

var			OSIP_CALL_ENABLEMIC					=40;
var			OSIP_CALL_ENABLESPK				=41;
var			OSIP_CALL_ISENABLEMIC			=42;
var			OSIP_CALL_ISENABLESPK			=43;

var			OSIP_CALL_ISDOHOLD				=44;
var			OSIP_CALL_GETGUID					=45;
var			OSIP_CALL_GETUSERDATA			=46;
var			OSIP_CALL_GETFINISHEDREASON=47;

var			OSIP_CALL_SENDDTMF				=50;

var			OSIP_CALL_SETMICVOLUME		=60;
var			OSIP_CALL_SETSPKVOLUME		=61;
var			OSIP_CALL_GETMICVOLUME		=62;
var			OSIP_CALL_GETSPKVOLUME		=63;

var			OSIP_MSG_TEXT						=1;
//======================

var 		CALLIN_TYPE_NULL				=0;
var 		CALLIN_TYPE_CALL				=1;
var 		CALLIN_TYPE_MONITOR			=2;
var 		CALLIN_TYPE_INSERT			=3;
var 		CALLIN_TYPE_CONFERENCE	=4;

var 		CALLIN_TYPE_UNKNOW			=99;

//--------------------------
//---------------------------
var			REPLYCMD_TYPE_NULL					= 0;
var			REPLYCMD_TYPE_STARTMONITOR	= 1;
var			REPLYCMD_TYPE_STOPMONITOR		= 2;
var			REPLYCMD_TYPE_DOHOLD				= 3;
var			REPLYCMD_TYPE_DOBUSY				= 4;
var			REPLYCMD_TYPE_DOLOGOUT			= 5;
var			REPLYCMD_TYPE_DOEVENT				= 6;
var			REPLYCMD_TYPE_STARTREFER		= 7;
var			REPLYCMD_TYPE_STOPREFER			= 8;
var			REPLYCMD_TYPE_DOHANG				= 9;
var			REPLYCMD_TYPE_STARTINSERT		= 10;
var			REPLYCMD_TYPE_STOPINSERT		= 11;
var			REPLYCMD_TYPE_STARTCALLEXT	= 12;
var			REPLYCMD_TYPE_STOPCALLEXT		= 13;
var			REPLYCMD_TYPE_ENABLEMIC			= 14;
var			REPLYCMD_TYPE_ENABLESPK			= 15;
var			REPLYCMD_TYPE_REFERESTABLISHED=16;
//--------------------------------

var			OSIP_FINISHED_TIMEOUT_INVITE		=2;//请求超时
var			OSIP_FINISHED_TIMEOUT_CMD				=3;//发送命令超时
var			OSIP_FINISHED_TIMEOUT_VOICE			=4;//音频长时间静音
var			OSIP_FINISHED_TIMEOUT_RING			=5;//回铃超时
var			OSIP_FINISHED_TIMEOUT_NORING		=6;//未回铃

var			OSIP_FINISHED_FAILED						=16;//呼叫失败
var			OSIP_FINISHED_REFUSE						=17;//呼叫拒接
var			OSIP_FINISHED_DOHANG						=18;//本地挂机
var			OSIP_FINISHED_DOCANCEL					=19;//取消
var			OSIP_FINISHED_REMOTEHANG				=20;//对方挂机
//--
