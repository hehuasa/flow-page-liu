/**
 * Created by Administrator on 2017/7/18.
 */
//动态生成属性窗口--编辑器
var propsEditor = {
    row: '<div class="row props-row"></div>',
    inputEditor: function (obj,index) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9"><label>' +
            '<input  class="props-row-input form-control" type="text" id="prop_name"></label>' +
            '</div>').append(row);
        return row;
    },
    radioEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9">' +
            '<label class="radio-inline" ><input name="radio" type="radio" value="0">手动</label>' +
            '<label class="radio-inline"><input name="radio" type="radio" value="1">自动</label>' +
            '</div>').append(row);
        return row;
    },
    radioTextEditor: function (obj) {
        var row = this.row;
        row.attr('id', 'props_time');
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9" onchange="changeTime(event)">' +
            '<label class="radio-inline"><input type="radio" name="time" value=' + propertyValues[0].value + '>' + propertyValues[0].name + '</label>' +
            '<label class="radio-inline"><input type="radio" name="time" value=' + propertyValues[1].value + '>' + propertyValues[1].name + '</label>' +
            '<label class="radio-inline"><input type="radio" name="time" class="specificTime" value=' + propertyValues[2].value + '>' + propertyValues[2].name + '</label>' +
            '<label class="display-none">：<input type="text" name="time" class="specific-time" value=""></label>' +
            '</div>').append(row);
        return row;
    },
    checkBoxEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text "> '+ obj.propertyCaption + '</div>').append(row);
        $('<div class="prop-type"></div>' +
            '<button class="btn btn-default prop-btn" onclick="chooseOptions(event)">' +
            '<span class="glyphicon glyphicon-th"></span>' +
            '</button>' +
            '</div>').append(row);
        return row;
    },
    ctrlCheckBoxEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9">' +
            '<label><input type="checkbox" name="holeFac" value="全厂">全厂</label>' +
            '</div>').append(row);
        return row;
    },
    ajaxCheckBoxEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="prop-type"></div>' +
            '<button class="btn btn-default prop-btn" onclick="chooseAjaxOptions(event)">' +
            '<span class="glyphicon glyphicon-th"></span>' +
            '</button>' +
            '</div>').append(row);
        return row;
    },
    numEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9">' +
            '<div></div>' +
            '<input class="form-control props-row-input input-num" oninput="getNum(event)" onchange="getVal(event)" type="number">' +
            '</div>').append(row);
        return row;
    },
    textareaEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="col-xs-9">' +
            '<label><textarea placeholder="输入框大小可在右下角拖动" class="form-control input-textarea" rows="3" onchange="getVal(event)"></textarea></label> ' +
            '</div>').append(row);
        return row;
    },
    selectInputEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div  class="col-xs-9"><select class="form-control rec-link-select" onchange="judeRecLinkVal(event)">' +
            '<option value="-1">请选择</option>' +
            '<option value="SWITCH">摄像机</option>' +
            '<option value="PTZ">PTZ控制</option></select>' +
            '<input class="form-control rec-link-input display-none" name="rec-link-1" type="number" onchange="getRecLinkVal(event)" required="required"><input class="form-control rec-link-input display-none"  name="rec-link-2" type="number" onchange="getRecLinkVal(event)" required="required"> ' +
            '</div></div>').append(row);
        return row;
    },
    ajaxTreeEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="prop-type"></div>' +
            '<button class="btn btn-default prop-btn" onclick="chooseAjaxTrees(event)">' +
            '<span class="glyphicon glyphicon-th"></span>' +
            '</button>' +
            '</div>').append(row);
        return row;
    },
    ajaxPageEditor: function (obj) {
        var row = this.row;
        $('<div class="col-xs-3 props-row-text ">' + obj.propertyCaption + '</div>').append(row);
        $('<div class="prop-type"></div>' +
            '<button class="btn btn-default prop-btn" onclick="choosePages(event)">' +
            '<span class="glyphicon glyphicon-th"></span>' +
            '</button>' +
            '</div>').append(row);
        return row;
    }
};
var propertyValueType=[
    "INPUT","RADIO","RADIO_TEXT","CHECKBOX",
    "CTRL_CHECKBOX","AJAX_CHECKBOX","NUM",
    "TEXTAREA","SELECT_INPUT","TREE",
    "AJAX_TREE","AJAX_PAGE"];
//相应的点击函数
function chooseOptions(e) {
    e = e || window.event;
    //拿到需要渲染的数据
    var num=getModalDataIndex(modalPropsObj,modalData);
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var array=modalData[num].propertyInfos[index].propertyValues;

    //渲染数据
    var data = [];
    for (var i = 0; i < array.length; i++) {
        data[i] = {value: array[i], name: array[i]};
    }
    var array1 = Object.keys(modalPropsObj.props);
    for (var a in modalPropsObj.props) {
        if (a == array1[index]) {
            createCheckBox(data, $('#POPUP_BOXLabel'), index);
        }
    }
    //propsBox为显示选中数据的div
    (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
    $('#POPUP_BOX').modal(
        {backdrop: false}
    )
}
function chooseAjaxOptions(e) {
    e = e || window.event;
    //拿到需要渲染的数据
    var num=getModalDataIndex(modalPropsObj,modalData);
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var obj=modalData[num].propertyInfos[index].propertyValuesUrl;

    $.get(obj.url_a, function (res) {
        var data = [];
        for (var i = 0; i < res.data.types.length; i++) {
            data[i] = {value: res.data.types[i].tname, name: res.data.types[i].id};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        var array1 = Object.keys(modalPropsObj.props);
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                createCheckBox(data, $('#POPUP_BOXLabel'), index);
            }
        }
    });
    $('#POPUP_BOX').modal(
        {backdrop: false}
    )
}
function chooseAjaxTrees(e) {
    e = e || window.event;
    var num=getModalDataIndex(modalPropsObj,modalData);
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var obj=modalData[num].propertyInfos[index].propertyValuesUrl;
    $.get(obj.url_a, function (res) {
        var data = [];
        for (var i = 0; i < res.data.types.length; i++) {
            data[i] = {id: res.data.types[i].id, name: res.data.types[i].tname, children: [], isParent: true};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        var array1 = Object.keys(modalPropsObj.props);
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                createCheckBox(data, $('#POPUP_BOXLabel'), index);
            }
        }
        showTrees(data,obj.url_b)
    });
}
function choosePages(e) {
    e = e || window.event;
    var num=getModalDataIndex(modalPropsObj,modalData);
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var obj=modalData[num].propertyInfos[index].propertyValuesUrl;
    getPages(obj.url_a);

}

//生成模块的属性对象
function getSideBarObj(array, obj2) {
    var myflow = $.myflow;
    var i;
    for (i = 0; i < array.length; i++) {
        obj2[i] = {};
        obj2[i].props = {};
        obj2[i].type = i;
        obj2[i].id= '';
        obj2[i].time= '-1';
        obj2[i].category = "1";
        obj2[i].name = {text: '<<task>>'};
        obj2[i].text = {text: array[i].bussCaption};
        obj2[i].img = {src: getIcon(array[i].showIcon, iconType), width: 25, height: 25};
        obj2[i].attr = {};
        array[i].propertyInfos.forEach(function (item, index) {
            var param = 'param' + index;
            obj2[i].props[param] = {};
            obj2[i].props[param].label = item.propertyCaption;
            //根据后台数据，给出相应的编辑控件
            switch (item.propertyValueType){
                case "INPUT":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.inputEditor();
                    };
                    break;
                case "RADIO":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.radioEditor();
                    };
                    break;
                case "RADIO_TEXT":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.radioTextEditor();
                    };
                    break;
                case "CHECKBOX":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.checkBoxEditor();
                    };
                    break;
                case "CTRL_CHECKBOX":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.ctrlCheckBoxEditor();
                    };
                    break;
                case "AJAX_CHECKBOX":
                    obj2[i].props[param].value=[];
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.ajaxCheckBoxEditor();
                    };
                    break;
                case "NUM":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.numEditor();
                    };
                    break;
                case "TEXTAREA":
                    obj2[i].props[param].value="";
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.textareaEditor();
                    };
                    break;
                case "SELECT_INPUT":
                    obj2[i].props[param].value=[];
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.selectInputEditor();
                    };
                    break;
                case "AJAX_TREE":
                    obj2[i].props[param].value=[];
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.ajaxTreeEditor();
                    };
                    break;
                case "AJAX_PAGE":
                    obj2[i].props[param].value=[];
                    obj2[i].props[param].editor = function () {
                        return new propsEditor.ajaxPageEditor();
                    };
                    break;
            }
        })
    }
    return obj2
}

//根据属性对象，生成dom
function dblclick(e) {
    eventTarget = e;
    if (e.target.nodeName == 'svg' || e.target.nodeName == 'DIV') {
        return false
    }
    var myflow = $.myflow;
    var array = {};
    array.to = [];
    $('#myflow_save')
        .trigger('save');
    //判断是否显示属性窗口，获取被点击元素属性
    if (clickState == 1) {
        clickState = 2
    }
    //判断被点击元素,显示相应属性
    //初始化属性暂存容器
    modalPropsObj = modalsObj;
    //激活模态框的显示
    $(documentObj).trigger('showprops', [modalPropsObj.props, src_, eventTarget]);

    if (modalPropsObj.type == "start" || modalPropsObj.type == "end" || modalPropsObj.type == "fork") {
        clickState = 0;
        return false
    }
    //根据属性中的编辑器生成dom
    propsName=createId(modalPropsObj.type);//生成dom的id
    var propArray=Object.keys(modalPropsObj.props);
    var warp=$('<div id='+propsName+'></div>');
    for(var k in propArray){
        var row=modalPropsObj.props[propArray[k]].editor(modalData.propertyInfos[k]);
        $(warp).append(row)
    }
    clickState = 0;
}

//保存属性框的值
function saveProps() {
    var myflow = $.myflow;
    modalsObj.id = propsName;//模态框唯一id
    //调用插件方法，保存模块名称
    $(documentObj).trigger('textchange', [modalPropsObj.text.text, src_]);

    //调用插件的方法，存储模态框的属性值
    for (var k in modalPropsObj.props) {
        if (modalPropsObj.props[k].editor)
            modalPropsObj.props[k].editor().init(modalPropsObj.props, k, 'p' + k, src_, documentObj);
    }
}

//获取当前模块数据在modalData中的index
function getModalDataIndex(obj1,array){
    for(var k in array){
        if(obj1.type==array[k].type){
            return k
        }
    }
}

//分页操作
function getPages(url) {
    var parent = $('#page-list');
    var ul = $('#page-ul');
    $.get(
        url + '?pageIndex=' + pages.currentPage + '&pageSize=' + pages.size + '&KWD=' + pages.pointno + '&PointName=' + pages.pointname,
        function (res) {
            //处理数据
            parent.empty();
            ul.empty();
            if (!res.data.list) {
                res.data.list = [];
            }
            var data = res.data.list;
            var array = [];
            for (var z = 0; z < data.length; z++) {
                array[z] = {value: data[z].etypename, name: data[z].pointno, type: 'equip'};
            }
            //渲染页面
            //for (var i=0;i<data.length;i++){
            //    $('<div class="checkbox-modal col-xs-3">' +
            //        '<label><input type="checkbox" value="' +
            //        array[i].value + '" name="checkBoxProp" etype="' + array[i].name + '" ' +
            //        'type1="' + array[i].type + '">' + array[i].value + '</label></div>').appendTo(parent)
            //}
            createCheckBox(array, parent, 'param3');
            //处理分页
            //获取页码
            pages.num = [];
            pages.total = res.data.pageNumber;
            for (var k = 1; k <= res.data.pageNumber; k++) {
                pages.num.push(k)
            }
            pages.num.splice(0, 0, "首页", "上一页");
            pages.num.splice(pages.num.length, 0, "下一页", "末页");
            pages.currentPage = res.data.pageIndex;
            var page = pages.currentPage + 1;
            for (var p = 0; p < pages.num.length; p++) {
                if (pages.num[p] == page) {
                    $(ul).append('<li class="active"><a onclick="turnPages(event)">' + pages.num[p] + '</a></li>');
                } else {
                    $(ul).append('<li onclick="turnPages(event)"><a>' + pages.num[p] + '</a></li>');
                }
            }
            $('#page_operation').empty();
            $('#page_operation').append('<span>共</span>' + pages.total + '<span>页</span>');
            //每页显示多少条
            $('#page_size').val(pages.size)
        }
    )
}