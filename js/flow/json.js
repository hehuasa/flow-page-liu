//接收传输的数据
if(localStorage.data){
    var restoreData=JSON.parse(localStorage.data).svgData;
    var flowKey=JSON.parse(localStorage.data).flowData.flowKey;
    var isEnable=JSON.parse(localStorage.data).flowData.isenable;
    $('#flowName').val(JSON.parse(localStorage.data).flowData.flowName);
}

var eqtypes = '/local/hlsmecs/Flow/eqtypes';
//单独查询某一设备类型（参数为id=''）
var eqtype = '/flow-page/hlsmecs/Flow/eqtype';
//查找所有设备
var points = '/flow-page/hlsmecs/Flow/points';
//分页查找设备
var pagesUrl = '/flow-page/hlsmecs/Flow/Qpoints/query';
//按设备类型查找
var Qtype = '/flow-page/hlsmecs/Flow/points/Qtype';
//事件类型
var events = '/flow-page/hlsmecs/Flow/events';
//查找所有报警和故障事件
var allEvents = '/flow-page/hlsmecs/Flow/events/alarmEvents';
//保存数据（刘经理）
var saveUrl1 = '/flow-page/hlsmecs/Flow/flow';
//保存数据（陈军）
var saveUrl = '/save/Greatech_Admin/flows/getFlows';
var updateFlowUrl='/flow-page/hlsmecs/Flow/flow/update';//修改流程


var rectBox=[];//点击模块时的元素
var click=false;
var modalData = [
    {
        "bussCaption": "接收设备报警",
        type: 'recEquipmentAlarm',
        "bussClass": "com.greatech.workflow.imp.WaitingForDeviceAlarm",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["null"]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "接收设备报警",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "POPUP_BOX",
            "property": "deviceType",
            "propertyCaption": "设备类型",
            "propertyDes": "设备类型",
            "propertyGroup": "a",
            "propertyValueType": "POPUP_BOX",
            "propertyValues": ["设备类型1", "设备类型2", "设备类型3", "设备类型4", "设备类型5", "设备类型6", "设备类型7", "设备类型8", "设备类型9", "设备类型0", "设备类型A", "设备类型B"]
        }, {
            "defaultValue": "",
            "nodeType": "CHECK_BOX",
            "property": "devicePoint",
            "propertyCaption": "指定设备",
            "propertyDes": "指定设备",
            "propertyGroup": "a",
            "propertyValueType": "CHECK_BOX",
            "propertyValues": ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6", "设备7", "设备8", "设备9", "设备0"]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "eventType",
            "propertyCaption": "指定事件类型",
            "propertyDes": "指定事件类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValuesUrl": "ssssssss"
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "receive-icon"
    },
    {
        "bussCaption": "解除设备报警",
        type: 'remEquipmentAlarm',
        "bussClass": "com.greatech.workflow.uiservice.service.DemoveDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["\"\""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "解除设备报警",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "deviceType",
            "propertyCaption": "设备类型",
            "propertyDes": "设备类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["设备类型1", "设备类型2"]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "devicePoint",
            "propertyCaption": "指定设备",
            "propertyDes": "指定设备",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["设备1", "设备2"]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "eventType",
            "propertyCaption": "指定事件类型",
            "propertyDes": "指定事件类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["事件类型1", "事件类型2"]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "remove-icon"
    },
    {
        "bussCaption": "发送短信",
        type: 'sendMessage',
        "bussClass": "com.greatech.workflow.imp.SendMessage",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [
            {
                "defaultValue": "",
                "nodeType": "TEXT_INPUT",
                "property": "caption",
                "propertyCaption": "显示",
                "propertyDes": "发送短信",
                "propertyGroup": "a",
                "propertyValueType": "TEXT_INPUT",
                "propertyValues": [""]
            },
            {
                "defaultValue": "",
                "nodeType": "TEXT_INPUT",
                "property": "receive",
                "propertyCaption": "接收人",
                "propertyDes": "接收人",
                "propertyGroup": "a",
                "propertyValueType": "TEXT_INPUT",
                "propertyValues": ["\"\""]
            },
            {
                "defaultValue": "",
                "nodeType": "TEXT_INPUT",
                "property": "message ",
                "propertyCaption": "短信内容",
                "propertyDes": "短信内容",
                "propertyGroup": "a",
                "propertyValueType": "TEXT_INPUT",
                "propertyValues": ["\"\""]
            },
            {
                "defaultValue": "",
                "nodeType": "RADIO_TEXT",
                "property": "executeType",
                "propertyCaption": "执行方式",
                "propertyDes": "执行方式",
                "propertyGroup": "a",
                "propertyValueType": "RADIO_TEXT",
                "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
            }],
        "showIcon": "sendNote-icon"
    },
    {
        "bussCaption": "门禁控制",
        type: 'accessCtr',
        "bussClass": "com.greatech.workflow.uiservice.service.conDoorDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "门禁控制",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "typess",
            "propertyCaption": "类型",
            "propertyDes": "类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["控制类型1", "控制类型2"]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "parameterOne",
            "propertyCaption": "参数1",
            "propertyDes": "参数1",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "parameterTwo",
            "propertyCaption": "参数2",
            "propertyDes": "参数2",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "conDoor-icon"
    },
    {
        "bussCaption": "广播控制",
        type: 'radioCtr',
        "bussClass": "com.greatech.workflow.uiservice.service.conRadioDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "广播控制",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "typess",
            "propertyCaption": "类型",
            "propertyDes": "类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["控制类型1", "控制类型2"]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "parameterOne",
            "propertyCaption": "参数1",
            "propertyDes": "参数1",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "parameterTwo",
            "propertyCaption": "参数2",
            "propertyDes": "参数2",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "conRadio-icon"
    },
    {
        "bussCaption": "视屏联动",
        type: 'recLinked',
        "bussClass": "com.greatech.workflow.imp.VideoViewOrPTZ",
        "conditionsProperties": [
            {
                "nodeType": "DROP_DOWN",
                "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
                "property": "conditions",
                "propertyCaption": "判断条件",
                "propertyDes": "判断条件",
                "propertyValueType": "DROP_DOWN",
                "propertyValues": [""]
            }],
        "propertyInfos": [
            {
                "defaultValue": "",
                "nodeType": "TEXT_INPUT",
                "property": "caption",
                "propertyCaption": "显示",
                "propertyDes": "视屏联动",
                "propertyGroup": "a",
                "propertyValueType": "TEXT_INPUT",
                "propertyValues": [""]
            },
            {
                "defaultValue": "",
                "nodeType": "DROP_DOWN",
                "property": "executeType",
                "propertyCaption": "执行方式",
                "propertyDes": "执行方式",
                "propertyGroup": "a",
                "propertyValueType": "DROP_DOWN",
                "propertyValues": ["自动", "手动"]
            },
            {
                "defaultValue": "",
                "nodeType": "TEXT_INPUT",
                "property": "linkageOrder",
                "propertyCaption": "联动命令",
                "propertyDes": "联动命令",
                "propertyGroup": "a",
                "propertyValueType": "TEXT_INPUT",
                "propertyValues": [""]
            }
        ],
        "showIcon": "recLinked-icon"
    },
    {
        "bussCaption": "警情推送",
        type: 'propAlarm',
        "bussClass": "com.greatech.workflow.uiservice.service.AlertDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["null"]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "警情推送",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "users",
            "propertyCaption": "用户",
            "propertyDes": "用户",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "address",
            "propertyCaption": "服务器地址",
            "propertyDes": "服务器地址",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "text",
            "propertyCaption": "内容",
            "propertyDes": "指定事件类型",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "alert-icon"
    },
    {
        "bussCaption": "客户端交互",
        type: 'clientMutual',
        "bussClass": "com.greatech.workflow.uiservice.service.ClientDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "客户端交互",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "interactionType",
            "propertyCaption": "交互类型",
            "propertyDes": "交互类型",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["客户端播放视频", "客户端消息"]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "waitReply",
            "propertyCaption": "等待回复",
            "propertyDes": "等待回复",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "client-icon"
    },
    {
        "bussCaption": "启动录像",
        type: 'startRec',
        "bussClass": "com.greatech.workflow.uiservice.service.startVideoDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "启动录像",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "places",
            "propertyCaption": "位置",
            "propertyDes": "位置",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["地点1", "地点2"]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "startVideo-icon"
    },

    {
        "bussCaption": "发送邮件",
        type: 'sendMail',
        "bussClass": "com.greatech.workflow.uiservice.service.sendMailDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "发送邮件",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "recipient",
            "propertyCaption": "收件人",
            "propertyDes": "收件人",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": ["\"\""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "sendMail-icon"
    },
    {
        "bussCaption": "网络命令",
        type: 'network',
        "bussClass": "com.greatech.workflow.uiservice.service.inOrderDevice",
        "conditionsProperties": [{
            "nodeType": "DROP_DOWN",
            "operaterTypes": ["GREATER_THEN", "LESS_THEN", "GREATER_EQUEL", "LESS_EQUEL", "EQUEL", "CONTAIN", "IN"],
            "property": "conditions",
            "propertyCaption": "判断条件",
            "propertyDes": "判断条件",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": [""]
        }],
        "propertyInfos": [{
            "defaultValue": "",
            "nodeType": "TEXT_INPUT",
            "property": "caption",
            "propertyCaption": "显示",
            "propertyDes": "网络命令",
            "propertyGroup": "a",
            "propertyValueType": "TEXT_INPUT",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "NUMBER",
            "property": "port",
            "propertyCaption": "端口",
            "propertyDes": "设备类型",
            "propertyGroup": "a",
            "propertyValueType": "NUMBER",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "NUMBER",
            "property": "order",
            "propertyCaption": "命令",
            "propertyDes": "命令",
            "propertyGroup": "a",
            "propertyValueType": "NUMBER",
            "propertyValues": [""]
        }, {
            "defaultValue": "",
            "nodeType": "DROP_DOWN",
            "property": "executeType",
            "propertyCaption": "执行方式",
            "propertyDes": "执行方式",
            "propertyGroup": "a",
            "propertyValueType": "DROP_DOWN",
            "propertyValues": ["自动", "手动"]
        }, {
            "defaultValue": "",
            "nodeType": "RADIO_TEXT",
            "property": "isWait",
            "propertyCaption": "是否等待",
            "propertyDes": "是否等待",
            "propertyGroup": "a",
            "propertyValueType": "RADIO_TEXT",
            "propertyValues": ["0：不等待", "-1：一直等待", ">0等待的最大秒数"]
        }],
        "showIcon": "inOrder-icon"
    }
];
var propsName;//当前属性框时的id
var propsBox;//属性框动态获取值的父元素
var propsBoxId;
var clickState = 0;
var documentObj;
var modalsObj = {};
var src_;
var svgData = {};
var flowData = {};
var source = [];

var eventTarget;//存储被点击且需要显示属性的元素

var path = document.getElementById('path');
var act = document.getElementsByClassName('flow-tools-act')[0];
var parentNode = path.parentNode;


var propsObj = {};//暂存当前线条属性框的值
var modalPropsObj = {};//暂存当前线条属性框的值
var judge;

var pathProps = {};


var iconType = [
    {name: 'fire-icon', url: './img/16/fire.png'},
    {name: 'gases-icon', url: './img/16/fire.png'},
    {name: 'receive-icon', url: './img/16/task_recEquipmentAlarm1.png'},
    {name: 'remove-icon', url: './img/16/task_recEquipmentAlarm1.png'},
    {name: 'recEquipmentMessage-icon', url: './img/16/task_recEquipmentMessage1.png'},
    {name: 'client-icon', url: './img/16/task_recEquipmentMessage1.png'},
    {name: 'inOrder-icon', url: './img/16/task_recEquipmentMessage1.png'},
    {name: 'sendNote-icon', url: './img/16/task_sendMessage1.png'},
    {name: 'sendMail-icon', url: './img/16/task_sendMail1.png'},
    {name: 'startVideo-icon', url: './img/16/task_startRec1.png'},
    {name: 'createVideo-icon', url: './img/16/task_startRec1.png'},
    {name: 'recLinked-icon', url: './img/16/task_recLinked1.png'},
    {name: 'conDoor-icon', url: './img/16/task_accessCtr1.png'},
    {name: 'zhou-icon', url: './img/16/task_emergencyCtr1.png'},
    {name: 'alert-icon', url: './img/16/task_emergencyCtr1.png'},
    {name: 'emergency-icon', url: './img/16/task_emergencyCtr1.png'},
    {name: 'conRadio-icon', url: './img/16/task_radioCtr1.png'}
];
var icon = 'fire-icon';


var judeItems = {
    GREATER_THEN: {name: "大于", key: 1},
    LESS_THEN: {name: "小于", key: 2},
    GREATER_EQUEL: {name: "大于等于", key: 3},
    LESS_EQUEL: {name: "小于等于", key: 4},
    EQUEL: {name: "等于", key: 5},
    CONTAIN: {name: "包含", key: 6},
    IN: {name: "在..里面", key: 7}
};

var modalBox = '';
var clickArray;