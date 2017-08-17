/**
 * Created by Administrator on 2017/7/14.
 */
function getAttribute() {
    var myflow = $.myflow;
    this.attribute = {
        start: {
            showType: 'image',
            type: 'start',
            id: "",
            name: {text: '<<start>>'},
            text: {text: '开始'},
            img: {src: './img/48/start_event_empty.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            category: "0",//组件类别  0/system   1/custome
            props: {
                text: {
                    name: 'text', label: '显示', value: '', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '开始'
                }
            }
        },
        end: {
            type: 'end',
            showType: 'image',
            id: "",
            category: "0",//组件类别  0/system   1/custome
            name: {text: '<<end>>'},
            text: {text: '结束'},
            img: {src: './img/48/end_event_terminate.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            props: {
                text: {
                    name: 'text', label: '显示', value: '', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '结束'
                }
            }
        },
        cancel: {
            type: 'cancel',
            showType: 'image',
            id: "",
            category: "0",//组件类别  0/system   1/custome
            name: {text: '<<cancel>>'},
            text: {text: '取消'},
            img: {src: './img/48/end_event_cancel.png', width: 48, height: 48},
            attr: {width: 0, height: 0},
            props: {
                text: {
                    name: 'text', label: '显示', value: '', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '取消'
                }
            }
        },
        error: {
            type: 'error',
            showType: 'image',
            id: "",
            category: "0",//组件类别  0/system   1/custome
            name: {text: '<<error>>'},
            text: {text: '错误'},
            img: {src: './img/48/end_event_error.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            props: {
                text: {
                    name: 'text', label: '显示', value: '', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '错误'
                }
            }
        },
        fork: {
            type: 'fork',
            showType: 'image',
            id: "",
            name: {text: '<<fork>>'},
            text: {text: '分支'},
            img: {src: './img/48/gateway_parallel.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            category: "0",//组件类别  0/system   1/custome
            //props : pathProps
            //{
            //	text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'分支'},
            //	param1: {name:'param1', label: '表达式', value:'', editor: function(){return new myflow.editors.inputEditor();}}
            //}
        }
        ,
        join: {
            type: 'join',
            showType: 'image',
            id: "",
            category: "0",//组件类别  0/system   1/custome
            name: {text: '<<join>>'},
            text: {text: '合并'},
            img: {src: './img/48/gateway_parallel.png', width: 48, height: 48},
            attr: {width: 50, heigth: 50},
            props: {
                text: {
                    name: 'text', label: '显示', value: '', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '合并'
                },
                param1: {
                    name: 'param1', label: '表达式', value: '', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                }
            }
        },
        /*====================设备相关 开始=============================*/
        recEquipmentAlarm: {
            type: 'recEquipmentAlarm',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',
            text: {text: '接收设备报警'},
            img: {src: './img/16/task_recEquipmentAlarm1.png', width: 25, height: 25},
            expression: {},
            //调整rect背景颜色
            attr: {
                //fill: "90-#fff-#9d1519"
            },
            props: {
                text: {name: 'text', label: '显示', value: ''},
                param1: {
                    name: 'param1', label: '设备类型', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '指定设备', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param3: {
                    name: 'param3', label: '指定事件类型', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        remEquipmentAlarm: {
            type: 'remEquipmentAlarm',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            expression: {},
            text: {text: '解除设备报警'},
            img: {src: './img/16/task_recEquipmentAlarm1.png', width: 25, height: 25},
            //调整rect背景颜色
            attr: {
                //fill: "90-#fff-#9d1519"
            },
            props: {
                text: {name: 'text', label: '显示', value: '解除设备报警'},
                param1: {
                    name: 'param1', label: '设备类型', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '指定设备', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param3: {
                    name: 'param3',
                    label: '指定事件类型',
                    time: '-1',
                    value: [],
                    editorType: 'Array',
                    editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        sendMessage: {
            type: 'sendMessage',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',
            text: {text: '发送短信'},
            img: {src: './img/16/task_sendMessage1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '发送短信'},
                param1: {
                    name: 'param1', label: '接收人', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '短信內容', value: '', editorType: 'input', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param3: {
                    name: 'param3',
                    label: '执行方式',
                    value: '',
                    time: '-1',
                    editorType: 'Radio',
                    editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        accessCtr: {
            type: 'accessCtr',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '门禁控制'},
            img: {src: './img/16/task_accessCtr1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '门禁控制'},
                param1: {
                    name: 'param1', label: '指定门禁', value: '', editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '指定区域', value: '', editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param3: {
                    name: 'param3', label: '全场', value: '', editorType: 'Checkbox', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param4: {
                    name: 'param4', label: '动作', value: '', editorType: 'Radio', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param5: {
                    name: 'param5', label: '执行方式', value: '', editorType: 'Radio', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        radioCtr: {
            type: 'radioCtr',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '广播控制'},
            img: {src: './img/16/task_radioCtr1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '广播控制'},
                param1: {
                    name: 'param1', label: '指定门禁', value: '', editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '指定区域', value: '', editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param3: {
                    name: 'param3', label: '全场', value: '', editorType: 'Checkbox', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param4: {name: 'param4', label: '动作', value: '', editorType: 'Radio'},
                param5: {
                    name: 'param5', label: '执行方式', value: '', editorType: 'Radio', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        recLinked: {
            type: 'recLinked',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            text: {text: '视频联动'},
            id: '',
            time: '-1',
            img: {src: './img/16/task_recLinked1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '视频联动'},
                param1: {
                    name: 'param1', label: '执行方式', value: '', editorType: 'Radio', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '联动命令', value: [], editorType: 'Array', editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        propAlarm: {
            type: 'propAlarm',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '警情推送'},
            img: {src: './img/16/task_emergencyCtr1.png', width: 25, height: 25},
            //调整rect背景颜色
            attr: {
                //fill: "90-#fff-#9d1519"
            },
            props: {
                text: {
                    name: 'text', label: '显示', editor: function () {
                        return new myflow.editors.textEditor();
                    }, value: '警情推送'
                },
                param1: {
                    name: 'param1', label: '用户', value: '', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                param2: {
                    name: 'param2', label: '服务器地址', value: '', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                param3: {
                    name: 'param3', label: '内容', value: '', editor: function () {
                        return new myflow.editors.inputEditor();
                    }
                },
                isauto: {
                    name: 'isauto', label: '执行方式', value: '', editor: function () {
                        return new myflow.editors.selectEditor('isauto');
                    }
                }
            }
        },
        clientMutual: {
            type: 'clientMutual',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '客户端交互'},
            img: {src: './img/16/task_recEquipmentMessage1.png', width: 25, height: 25},
            //调整rect背景颜色
            attr: {
                //fill: "90-#fff-#9d1519"
            },
            props: {
                text: {name: 'text', label: '显示', value: '客户端交互'},
                param1: {name: 'param1', label: '交互类型', value: ''},
                param2: {name: 'param2', label: '等待回复', value: ''},
                isauto: {name: 'isauto', label: '执行方式', value: ''}
            }
        },
        startRec: {
            type: 'startRec',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '启动录像'},
            img: {src: './img/16/task_startRec1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: ''},
                param1: {name: 'param1', label: '位置', value: ''},
                isauto: {name: 'isauto', label: '执行方式', value: ''}
            }
        },
        sendMail: {
            type: 'sendMail',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '发送邮件'},
            img: {src: './img/16/task_sendMail1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '发送邮件'},
                recAccount: {name: 'recAccount', label: '收件人', value: ''},
                isauto: {name: 'isauto', label: '执行方式', value: '1'}
            }
        },
        network: {
            type: 'network',
            category: "1",//组件类别  0/system   1/custome
            name: {text: '<<task>>'},
            id: '',
            time: '-1',

            text: {text: '网络命令'},
            img: {src: './img/16/task_recEquipmentMessage1.png', width: 25, height: 25},
            props: {
                text: {name: 'text', label: '显示', value: '网络命令'},
                ipText: {name: 'recText', label: 'IP', value: '112233'},
                recText: {name: 'recText', label: '端口', value: ''},
                message: {name: 'message', label: '命令', value: ''},
                isauto: {name: 'isauto', label: '执行方式', value: ''}
            }
        }
        /*=========================设备相关 结束=============================*/
    };
    return this.attribute
}
var attribute = getAttribute();