//动态生成菜单dom
//$('#myflow_tools').before(listDom)
//右键菜单
(function rightBtn() {
    var svg = document.getElementById('myflow');
    document.oncontextmenu = stop;
    function stop() {
        return false;
    }

    $(svg).mousedown(function (e) {
        e = e || window.event;
        var key = e.which; //获取鼠标键位
        if (key == 3)  //(1:代表左键； 2:代表中键； 3:代表右键)
        {
            //获取右键点击坐标
            var x = e.clientX;
            var y = e.clientY;
            $(e.target).trigger('click', [e]);
            clickArray = getClickArray(clickArray, e);


            $(".right-menu").show().css({left: x, top: y});
        } else {
            $(".right-menu").hide();
        }
    });
})();
function showProp(e) {
    //e = e||window.event;
    //if (e.target.tagName=='BUTTON'){
    //    eventTarget=clickArray[0];
    //}else {
    eventTarget = clickArray[clickArray.length - 1];
    //}
    $(".right-menu").hide();
    //暂存前一个点击元素

    dblclick(eventTarget);
}
//切换菜单动作
$('#node').on('show.bs.collapse', function () {
    var toggle = $('#myflow_tools_node').find('span.toggle');
    toggle[0].style.display = 'none';
    toggle[1].style.display = 'inline';
});
$('#node').on('hidden.bs.collapse', function () {
    var toggle = $('#myflow_tools_node').find('span.toggle');
    toggle[1].style.display = 'none';
    toggle[0].style.display = 'inline';
});
$('#act-node').on('show.bs.collapse', function () {
    var toggle = $('#myflow_tools_handle').find('span.toggle');
    toggle[0].style.display = 'none';
    toggle[1].style.display = 'inline';
});
$('#act-node').on('hidden.bs.collapse', function () {
    var toggle = $('#myflow_tools_handle').find('span.toggle');
    toggle[1].style.display = 'none';
    toggle[0].style.display = 'inline';
});
function save() {
    $(".right-menu").hide();
    $('#myflow_save').trigger('click');
}
//获取侧边栏列表
function getSideBarList(modalData) {
    var array = [];
    for (var i = 0; i < modalData.length; i++) {
        array[i] = {};
        array[i].name = modalData[i].bussCaption;
        array[i].type = modalData[i].type;
        array[i].src = getIcon(modalData[i].showIcon, iconType)
    }
    return array;
}
//生成侧边栏对象的属性对象
function getSideBarObj(array, obj2) {
    var myflow = $.myflow;
    var i;
    for (i = 0; i < array.length; i++) {
        obj2[i] = {};
        obj2[i].props = {};
        obj2[i].type = i;
        obj2[i].category = "1";
        obj2[i].name = {text: '<<task>>'};
        obj2[i].text = {text: array[i].bussCaption};
        obj2[i].img = {src: getIcon(array[i].showIcon, iconType), width: 25, height: 25};
        obj2[i].attr = {};
        array[i].propertyInfos.forEach(function (item, index) {
            var param = 'param' + index;
            obj2[i].props[param] = {};
            obj2[i].props[param].label = item.propertyCaption;
            (item.propertyValues) ? obj2[i].props[param].value = item.propertyValues[0] : obj2[i].props[param].value = item.defaultValue;
            (item.propertyValuesUrl) ? item.propertyValues = getOptions(item.propertyValuesUrl) : item.defaultValue = item.defaultValue;
            obj2[i].props[param].time = '';
            obj2[i].props[param].name = param;

            //根据后台数据，给出相应的编辑控件
            if (item.propertyValueType == "TEXT_INPUT") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.inputEditor();
                }
            }
            if (item.propertyValueType == "DROP_DOWN") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.selectEditor(item.propertyValues);
                }
            }
            if (item.propertyValueType == "NUMBER") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.inputNumEditor();
                }
            }
            if (item.propertyValueType == "RADIO_TEXT") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.radioEditor(item.propertyValues);
                }
            }
            if (item.propertyValueType == "POPUP_BOX") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.check_boxEdition(item.propertyValues);
                }
            }
            if (item.propertyValueType == "CHECK_BOX") {
                obj2[i].props[param].editor = function () {
                    return new myflow.editors.check_boxEdition(item.propertyValues);
                }
            }
        })
    }
    return obj2
}
//生成判断条件属性对象
function getPathProps(array, obj2, props, event) {
    var post = 1;
    if (props) {
        obj2 = JSON.stringify(props);
        obj2 = JSON.parse(obj2);
    }
    var myflow = $.myflow;
    var i;
    var a = 1;
    if (!obj2.text) {
        obj2.text = {
            name: 'text',
            label: '条件名称',
            value: '',
            editor: function () {
                return new myflow.editors.textEditor();
            }
        };
    } else {
        obj2.text.editor = function () {
            return new myflow.editors.textEditor();
        }
    }
    if (!obj2.default) {
        obj2.default = {
            name: 'text',
            label: '是否为默认条件',
            value: '是',
            editor: function () {
                return new myflow.editors.selectEditor(['是', '否']);
            }
        };
    } else {
        obj2.default.editor = function () {
            return new myflow.editors.selectEditor(['是', '否']);
        }
    }
    array[array.length - 1] = '手动输入';
    var _obj2 = JSON.stringify(obj2);
    _obj2 = JSON.parse(_obj2);
    delete _obj2.text;
    delete _obj2.btn;
    delete _obj2.default;
    var param = 'param' + a;
    if (event) {
        if (event.target.innerHTML == '增加') {
            if (typeof (obj2[param]) == 'object') {
                obj2[param].editor = function () {
                    return new myflow.editors.operationEditor(array);
                };
                for (var k in _obj2) {
                    a++;
                    param = 'param' + a;
                    if (!obj2[param]) {
                        obj2[param] = {};
                        obj2[param].name = param;
                        obj2[param].label = '判断条件' + a;
                        obj2[param].key = '';
                        for (var z in array) {
                            obj2[param].value = array[z];
                            break
                        }
                        obj2[param].value1 = '';
                        obj2[param].editor = function () {
                            return new myflow.editors.operationEditor(array);
                        };
                    } else {
                        obj2[param].editor = function () {
                            return new myflow.editors.operationEditor(array);
                        }
                    }
                }
            }
        }
    } else if (typeof (obj2[param]) == 'object') {
        obj2[param].editor = function () {
            return new myflow.editors.operationEditor(array);
        };
    }

    if (obj2[param] == 'add') {
        obj2[param] = {};
        obj2[param].name = param;
        obj2[param].label = '判断条件' + a;
        obj2[param].key = '';
        for (var z in array) {
            obj2[param].value = z;
            break
        }
        obj2[param].value1 = '';
        obj2[param].editor = function () {
            return new myflow.editors.operationEditor(array);
        };
    }
    if (obj2.btn) {
        delete obj2.btn;
    }
    obj2.btn = {
        name: 'btn',
        label: '增加条件',
        value: '',
        editor: function () {
            return new myflow.editors.btnEditor(array, obj2);
        }
    };
    return obj2
}
//生成侧边栏
function createSideBarList(sideBarList, testJson) {
    for (var i = 0; i < sideBarList.length; i++) {
        source[i] = document.createElement('div');
        source[i].className = "node state btn btn-default btn-block flow-tools-btn";
        var img = document.createElement('img');
        img.setAttribute('src', sideBarList[i].src);
        var text = document.createTextNode(sideBarList[i].name);
        source[i].appendChild(img);
        source[i].appendChild(text);
        source[i].setAttribute('type', sideBarList[i].type);
        act.appendChild(source[i])
    }
}
//生成侧边栏列表图标
function getIcon(icon, iconType) {
    var src;
    iconType.forEach(function (item) {
        if (icon == item.name) {
            src = item.url
        }
    });
    var name = 'name';
    var iconArray = getObjArray(iconArray, iconType, name);
    if (iconArray.indexOf(icon) == -1) {
        src = 'img/16/fire.png'
    }
    return src;
}
var src = getIcon(icon, iconType);
//生成流程数据
function getFlowData(modalData, svgData, judge, flowData) {
    var firstNode;
    var classConfigObj = {};
    flowData.flowTable = {};
    //获取流程起始模块
    var rects = getObjArray(rects, svgData.states);
    var attribute1 = 'to';
    var pathTo = getObjArray(pathTo, svgData.paths, attribute1);
    var attribute2 = 'from';
    var pathFrom = getObjArray(pathFrom, svgData.paths, attribute2);
    //流程名
    flowData.flowName = svgData.props.props.name.value;
    if(flowKey){
        flowData.flowKey=flowKey;
        flowData.isenable=isEnable;
    }else {
        flowData.flowKey = new Date().getTime();
        flowData.isenable=0;
    }

    var j = 0;
    for (var i in svgData.states) {
        var a = {};
        (i == getFirstNode(i, pathTo)) ? a.startNode = true : a.startNode = false;
        (i == getFirstNode(i, pathFrom)) ? a.endNode = true : a.endNode = false;
        a.nodeKey = i;
        a.bussObject = {};
        a.bussObject.classConfigList = [];
        var q = 0;
        for (var z in svgData.states[i].props) {
            a.bussObject.classConfigList[q] = {};
            for (var b in modalData) {
                if (modalData[b].type == svgData.states[i]['type']) {
                    a.bussObject.classConfigList[q].property = modalData[b].propertyInfos[q].property;
                }
            }
            if(typeof(svgData.states[i].props[z].value)=='object' ){
                a.bussObject.classConfigList[q].value = [];
                for (var ind=0;ind<svgData.states[i].props[z].value.length;ind++){
                    a.bussObject.classConfigList[q].value.push(svgData.states[i].props[z].value[ind].value)
                }
            }else {
                a.bussObject.classConfigList[q].value=svgData.states[i].props[z].value;
            }
            q++
        }
        //a.bussObject.classConfigList[q]={};
        //a.bussObject.classConfigList[q].property='condition';
        //a.bussObject.classConfigList[q].value=svgData.states[i].condition;
        a.resultObject = {};
        for (var k in modalData) {
            if (modalData[k].type == [svgData.states[i]['type']]) {
                a.bussObject.bussClass = modalData[k].bussClass;
                a.resultObject.resultClass = modalData[k].bussClass;
            }
        }
        //a.bussObject.bussClass=modalData[svgData.states[i]['type']].bussClass;

        a.resultObject.needStartSubFlow = "false";
        a.resultObject.startSubFlow = "";

        a.resultObject.defaultNodeKey = i;
        a.resultObject.waitTime = transWatingTime(svgData.states[i]);
        a.resultObject.resultConditions = getConditions(a.resultObject.resultConditions, judge, svgData.paths, i);
        flowData.flowTable[i] = a;
        j++;
    }
    if (a.resultObject.resultConditions.length == 0) {
        a.resultObject.resultClass = '';
    }
    return flowData.flowTable
}
//获取流程是否是首个或末尾
function getFirstNode(rect, array2) {
    for (var z = 0; z < array2.length; z++) {
        if (array2.indexOf(rect) == -1) {
            return rect
        }
    }
    return -1
}
//获取对象下标或属性值的数组
function getObjArray(array, obj, attribute) {
    array = [];
    for (var a in obj) {
        if (!attribute) {
            array.push(a)
        } else {
            array.push(obj[a][attribute])
        }

    }
    return array
}
//渲染属性框
function showprops(props, src, _r, _tb) {
    _tb.empty();
    for (var k in props) {
        _tb.append('<tr><th>' + props[k].label + '</th><td><div id="p'
            + k + '" class="editor"></div></td></tr>');
        if (props[k].editor)
            props[k].editor().init(props, k, 'p' + k, src, _r);
        // $('body').append(props[i].editor+'a');
    }
}
//数组去重
function unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
}
//获取数组元素的下标
function getArrayIndex(array, string) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (string == array[i]) {
            return i
        }
    }
}
//判断默认条件是否单一
function defaultingJude(obj, states, paths, props, from) {
    var rect = getObjArray(rect, obj[paths], from);
    rect = unique(rect);
    for (var a = 0; a < rect.length; a++) {
        var q = 0;
        var obj2 = {};
        for (var z in obj[paths]) {
            if (obj[paths][z].from == rect[a]) {
                obj2[z] = obj[paths][z]
            }
        }
        for (var i in obj2) {
            if (obj2[i].props.default.default == '是') {
                q++
            }
        }
        if (q > 1) {
            jude = 1;
            alert(obj[states][rect[a]].bussCaption + '模块拥有2个或以上的默认跳转条件');
            return false
        }
        if (q < 1) {
            jude = 1;
            alert(obj[states][rect[a]].bussCaption + '模块未配置默认跳转');
            return false
        }
    }
    if (q == 1) {
        return true
    }
}
//定位默认条件所属位置
function getDefaulting(obj) {
    for (var i in obj) {
        if (obj[i].props.default.default == '是') {
            return obj[i].to
        }
    }
}
//转化等待时间
function transWatingTime(obj) {
    var time = parseInt(obj.time);
    return time

}
//获取流程判断条件数组
function getConditions(array, judge, obj, rect) {
    array = [];
    var a = 0;
    for (var i in obj) {
        if (rect == obj[i].from) {
            var obj1 = JSON.stringify(obj[i]);
            obj1 = JSON.parse(obj1);
            delete obj1.props.text;
            delete obj1.props.default;
            array[a] = {};
            array[a].nodeKey = obj[i]['to'];
            array[a].needStartSubFlow = "false";
            array[a].startSubFlow = "";
            array[a].order = a + 1;
            array[a].classConfigs = new Array();
            var j = 0;
            for (var k in obj1.props) {
                if (k == 'expression') {
                    array[a].classConfigs[j] = {};
                    array[a].classConfigs[j].property = "";
                    array[a].classConfigs[j].operaterType = "expression";
                    array[a].classConfigs[j].value = obj1.props[k].expression;
                } else {
                    array[a].classConfigs[j] = {};
                    array[a].classConfigs[j].value = obj1.props[k].value;
                    array[a].classConfigs[j].key = obj1.props[k].key;
                    for (var z in judge) {
                        if (z == obj1.props[k].operation) {
                            obj1.props[k].operation = judge[z]
                        }
                    }
                    obj1.props[k].operation = getJudeItem(obj1.props[k].operation, judeItems);
                    array[a].classConfigs[j].operation = obj1.props[k].operation;
                }
                j++
            }
            a++
        }
    }
    return array
}
//判断条件转化
function getJudeItem(item, judeItems) {
    for (var i in judeItems) {
        if (i == item) {
            item = judeItems[i].key
        }
    }
    return item
}
//动态渲染数组数据
function dataRepeat(array, parent) {
    var source = [];
    $(parent).empty();
    for (var i = 0; i < array.length; i++) {
        source[i] = $('<div class="options">' +
            '<span class="input-group-btn" >' +
            '<button class="btn btn-default options-btn" type="button">' + array[i].name +
            '<button class="btn btn-default options-btn" type="button" onclick="delEvent(event)">' +
            'x ' +
            '</button> ' +
            '</span> ' +
            '</div>');
        $(parent).append(source[i])
    }
    //获取checkBox值存入modalPropsObj
    var index = getArrayIndex($('#' + propsName).children(), parent.parentElement.parentElement);
    var array1 = Object.keys(modalPropsObj.props);
    if (modalPropsObj.type == 'recLinked') {
        var index1 = index - 2;
        modalPropsObj.props.param2.value[index1] = [];
        for (var z in array) {
            modalPropsObj.props.param2.value[index1][z] = array[z].value
        }
    } else {
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                for (var c in array) {
                    modalPropsObj.props[a].value[c] = array[c]
                }
            }
        }
    }


}
//动态生成checkBox
function createCheckBox(array, parent, index) {
    //生成checkBox
    parent.empty();
    for (var i in array) {
        $('<div class="checkbox-modal col-xs-3"><label><input type="checkbox" value="' + array[i].value + '" name="checkBoxProp" etype="' + array[i].name + '" type1="' + array[i].type + '">' + array[i].value + '</label></div>').appendTo(parent)
    }

    var index1 = getArrayIndex($('#' + propsName).children(), propsBox.parentElement.parentElement);
    var ac = document.getElementsByName('checkBoxProp');
    for (var i = 0; i < ac.length; i++) {

        if (modalPropsObj.type == 'recLinked') {
            for (var a in modalPropsObj.props[index].value[index1 - 2]) {
                if ($(ac[i]).attr('etype') == modalPropsObj.props[index].value[index1 - 2][a].value) {
                    ac[i].checked = true
                }
            }
        }
        for (var z in modalPropsObj.props[index].value) {
            if ($(ac[i]).attr('etype') == modalPropsObj.props[index].value[z].value) {
                ac[i].checked = true
            }
        }
    }
}
//获取checkBox值
function getCheckBoxVal() {
    var array = [];
    //接收与解除设备报警 表达式存储
    if (modalPropsObj.expression) {
        var obj1 = modalPropsObj.expression.point;
        var obj2 = modalPropsObj.expression.event;
    }
    //视频联动参数
    if (modalPropsObj.type == 'recLinked') {
        var obj3 = modalPropsObj.props.param2
    }

    var array1 = [];
    var a = 0;
    for (var i = 0; i < $("input[name='checkBoxProp']").length; i++) {
        if ($("input[name='checkBoxProp']")[i].checked) {
            var ac = $("input[name='checkBoxProp']")[i];
            //保存表达式
            if (modalPropsObj.expression) {
                array1.push($(ac).attr('etype'));
                if (($(ac).attr('type1') == 'equip')) {
                    obj1.etype = array1;
                } else {
                    obj2.event = array1;
                }
            }
            array[a] = {};
            array[a].name = $("input[name='checkBoxProp']")[i].value;
            array[a].value = $(ac).attr('etype');
            a++
        }
    }
    dataRepeat(array, (propsBox))
}
//清空checkBox值
function clearCheckBoxVal() {
    var box = document.getElementsByName('checkBoxProp');
    for (var i in box) {
        box[i].checked = false
    }
}
//全选checkBox值
function allCheckBoxVal() {
    var box = document.getElementsByName('checkBoxProp');
    for (var i in box) {
        box[i].checked = true
    }
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

//获取属性框的动态选项
function getOptions(url) {
    var array;
    //$.get(url,function(res){
    //    array=res
    //});
    array = options;
    return options
}

//属性按钮触发模态框
$('#test').bind('click', function (event, e) {
    if (clickState == 1) {
        clickState = 2
    }
    //判断被点击元素,显示相应属性
    //初始化属性暂存容器
    modalPropsObj = modalsObj;
    $(documentObj).trigger('showprops', [modalPropsObj.props, src_, e]);
    if (modalPropsObj.expression) {
        if (!modalPropsObj.expression.point) {
            modalPropsObj.expression.point = {};
        }
        if (!modalPropsObj.expression.point.etype) {
            modalPropsObj.expression.point.etype = [];
        }
        if (!modalPropsObj.expression.event) {
            modalPropsObj.expression.event = {};
            modalPropsObj.expression.event.event = [];
        }
    }
    //显示名称
    $('#prop_name').val(modalPropsObj.text.text).change(function () {
        modalPropsObj.text.text = $(this).val()
    });
    $('#prop_condition').val(modalPropsObj.condition);
    //显示等待时间
    getRadioVal(modalPropsObj);
    //其余属性，通过展示不同的模态框内容来实现。
    var dom = $('#' + modalPropsObj.type);

    if (modalPropsObj.id == '') {
        if (dom.length != 0) {
            //生成DOM
            propsName = createId(modalPropsObj.type);
            var parent = dom.clone(true);
            $(parent).attr('id', propsName);
            dom.after(parent);
            $(parent).removeClass('display-none')
        }
    } else {
        getType(modalPropsObj, dom)
    }
    clickState = 0;
});
//判断id，生成DOM
function getType(modalPropsObj, dom) {
    var parent = dom.clone(true);
    parent = parent[0];
    dom.after(parent);
    var row = $(parent).find('div.props-row-text');
    var array = Object.keys(modalPropsObj.props);
    array.splice(0, 1);
    propsName = createId(modalPropsObj.type);
    $(parent).attr('id',propsName);
    var input = $(parent).find('input[name="radio"]');
    //判断添加按钮是否存在,处理下拉菜单,渲染数据
    var ul = parent.getElementsByClassName('dropdown-menu');
    if (ul) {
        var li = $(ul[0]).find('li');
        var a = $(ul[0]).find('a');
        for (var i = 0; i < array.length; i++) {
            if (modalPropsObj.props[array[i]].value.length != 0) {
                for (var index = 0; index < a.length; index++) {
                    if (row[i].innerText.indexOf(a[index].innerHTML) != -1) {
                        $(a[index]).trigger('click')
                    }
                }
            }
        }
        ////菜单选项空时隐藏按钮
        //if(li.length==0){
        //    $(ul[0]).prev().attr('disabled','disabled')
        //}
    }
    //渲染数据
    for (var z = 0; z < array.length; z++) {

        if (modalPropsObj.type == 'recLinked') {
        //执行方式
        for (var q = 0; q < input.length; q++) {
            if (input[q].value == modalPropsObj.props[array[0]].value) {
                input[q].checked = true
            }
        }
        //渲染命令
        var select = parent.getElementsByClassName('rec-link-select');
        for (var w = 0; w < modalPropsObj.props[array[1]].value.length; w++) {
            var fir = w * 2;
            var sec = fir + 1;
            var btn = parent.getElementsByClassName('glyphicon');
            var inputs = parent.getElementsByClassName('rec-link-input');
            var num = modalPropsObj.props[array[1]].value[w].value.indexOf('、');
            $(btn[0]).trigger('click');
            for (var i = 0; i < inputs.length; i++) {
                $(inputs[i]).removeClass('display-none');
            }
            //截取字符
            if (modalPropsObj.props[array[1]].value[w].value.substring(0, 1) == "S") {
                $(select[w]).get(0).selectedIndex = 1;
                inputs[fir].value = modalPropsObj.props[array[1]].value[w].value.substring(7, num);
                inputs[sec].value = modalPropsObj.props[array[1]].value[w].value.substring(num + 1)
            } else {
                $(select[w]).get(0).selectedIndex = 2;
                inputs[fir].value = modalPropsObj.props[array[1]].value[w].value.substring(4, num);
                inputs[sec].value = modalPropsObj.props[array[1]].value[w].value.substring(num + 1)
            }

        }
    }else {
            if (modalPropsObj.props[array[z]].editorType=="Array"){
                var div = $(row[z]).next().children();
                dataRepeat(modalPropsObj.props[array[z]].value, div[0]);
            }else
            if(modalPropsObj.props[array[z]].editorType=="input"){
                $(row[z]).next().find('.input-textarea').val(modalPropsObj.props[array[z]].value)
            }else
            if((modalPropsObj.props[array[z]].editorType=="Radio")){
                var k=z+1;
                for (var c = 0; c < $('#' + propsName).children().eq(k).find('input[type=radio]').length; c++){
                    if ( $('#' + propsName).children().eq(k).find('input[type=radio]').eq(c).val() == modalPropsObj.props[array[z]].value) {
                        $('#' + propsName).children().eq(k).find('input[type=radio]').eq(c)[0].checked = true
                    }
                }
            }else
            if((modalPropsObj.props[array[z]].editorType=="Checkbox")){
                if ($('#' + propsName).find('input[type=checkbox]').eq(0).val() == modalPropsObj.props[array[z]].value) {
                    $('#' + propsName).find('input[type=checkbox]').eq(0).checked = true
                }
            }
        }
    }
    $(parent).removeClass('display-none');

    //属性编辑框中radio绑定事件
    $('#' + propsName).find('input[type=radio]').bind('click', function (e) {
        e = e || window.event;
        var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement.parentElement);
        var array1 = Object.keys(modalPropsObj.props);
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                modalPropsObj.props[a].value = e.target.value
            }
        }
    });
//属性编辑框中checkBox绑定事件
    $('input:checkbox[name="holeFac"]').bind('click', function (e) {
        e = e || window.event;
        if (e.target.checked) {
            $('#' + propsName + ' button.prop-btn').attr('disabled', 'disabled');
        } else {
            $('#' + propsName + ' button.prop-btn').removeAttr('disabled')
        }
        var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement.parentElement);
        var array1 = Object.keys(modalPropsObj.props);
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                modalPropsObj.props[a].value = e.target.value
            }
        }
    });
}

//存储被点击元素（只存两个）
function getClickArray(array, event) {
    event=event||window.event;
    if (!array) {
        array = [];
    }
    if (array.length < 2) {
        array.push(event)
    } else {
        array.shift();
        array.push(event)
    }
    return array
}
//模态框关闭后执行方法
$('#Props').on('hidden.bs.modal', function () {
    var myflow = $.myflow;
    //重新绑定showprops方法及双击事件
    myflow.props({}, documentObj);
    $(document).bind('dblclick', dblclick);
    //模态框关闭后设置其为不可见
    $('#' + propsName).remove()
});
$('#myModal').on('hidden.bs.modal', function () {
    var myflow = $.myflow;
    //重新绑定showprops方法及双击事件
    myflow.props({}, documentObj);
    $(document).bind('dblclick', dblclick);

});
$('#flow_startCondition').on('hidden.bs.modal', function () {
    var myflow = $.myflow;
    //重新绑定showprops方法及双击事件
    myflow.props({}, documentObj);
    $(document).bind('dblclick', dblclick);
});
//修改流程名
function flowName() {
    var myflow = $.myflow;
    myflow.config.props.props.name.value = $('#flowName').val()
}
function flowDec() {
    var myflow = $.myflow;
    myflow.config.props.props.desc.value = $('#flowDec').val()
}
//双击显示属性,若为条件节点则进行条件节点属性生成
function dblclick(e) {
    eventTarget = e;
    if (e.target.nodeName == 'svg' || e.target.nodeName == 'DIV') {
        return false
    }
    var myflow = $.myflow;
    var array = {};
    array.to = [];
    console.log(myflow.config.rect);
    $('#myflow_save')
        .trigger('save');
    //判断是否为条件节点
    //if(e.target.previousSibling){
    //    if(e.target.previousSibling.x){
    //        if(e.target.previousSibling.x.animVal.value){
    //            if(e.target.x.animVal.value==e.target.previousSibling.x.animVal.value+1){
    //                x=Math.round(e.target.previousSibling.x.animVal.value);
    //                y=Math.round(e.target.previousSibling.y.animVal.value);
    //                //判断条件节点的分支
    //                for(var i in svgData.states){
    //                    if(x==svgData.states[i].attr.x&&y==svgData.states[i].attr.y){
    //                        rect=i;
    //                        array.from=svgData.states[i].text.text
    //                    }
    //                }
    //                for(var a in svgData.paths){
    //                    if(rect==svgData.paths[a].from){
    //                        array.to.push(svgData.states[svgData.paths[a].to].text.text)
    //                    }
    //                }
    //                //生成条件节点属性
    //                pathProps=getPathProps(judge,pathProps,{},array);
    //                window.attribute.fork.props=pathProps;
    //                showProps=pathProps;
    //                clickState=2;
    //                $(documentObj).trigger('showprops',[pathProps,src_]);
    //                $('#myModal').modal();
    //            }
    //        }
    //    }
    //}else {
    //if(e.target.previousSibling){
    //
    //}

    //判断是否显示属性窗口，获取被点击元素属性
    if (clickState == 1) {
        clickState = 2
    }
    //判断被点击元素,显示相应属性
    //初始化属性暂存容器
    modalPropsObj = modalsObj;
    $(documentObj).trigger('showprops', [modalPropsObj.props, src_, eventTarget]);
    if (modalPropsObj.expression) {
        modalPropsObj.expression={};
        if (!modalPropsObj.expression.point) {
            modalPropsObj.expression.point = {};
        }
        if (!modalPropsObj.expression.point.etype) {
            modalPropsObj.expression.point.etype = [];
        }
        if (!modalPropsObj.expression.event) {
            modalPropsObj.expression.event = {};
            modalPropsObj.expression.event.event = [];
        }
    }
    //显示名称
    $('#prop_name').val(modalPropsObj.text.text).change(function () {
        modalPropsObj.text.text = $(this).val()
    });
    if (modalPropsObj.type == "start" || modalPropsObj.type == "end" || modalPropsObj.type == "fork") {
        $('#props_time').hide();
    } else {
        $('#props_time').show();
    }
    $('#prop_condition').val(modalPropsObj.condition);
    //显示等待时间
    getRadioVal(modalPropsObj);
    //其余属性，通过展示不同的模态框内容来实现。
    var dom = $('#' + modalPropsObj.type);
        if (modalPropsObj.type == "start" || modalPropsObj.type == "end" || modalPropsObj.type == "fork") {
            return
        } else {
            getType(modalPropsObj, dom)
        }

    //根据编辑框类型进行数据渲染
    //for(var i=0;i<propsDataArray.length;i++) {
    //    if (child.length == propsDataArray.length) {
    //        if (propsDataArray[i].editor == 'input') {
    //            child[1].child()[1].child()[0].value = propsDataArray[i].value
    //        }
    //        if (propsDataArray[i].editor == 'Array') {
    //            dataRepeat(propsDataArray[i].value,(child[1].child()[1].child()[0]))
    //        }
    //        if (propsDataArray[i].editor == 'Radio') {
    //            child[1].child()[1].child()[0].value = propsDataArray[i].value
    //        }
    //        if (propsDataArray[i].editor == 'Checkbox') {
    //            child[1].child()[1].child()[0].value = propsDataArray[i].value
    //        }
    //    }
    //}
    //激活模态框的显示
    clickState = 0;
}
$(document).bind('dblclick', dblclick);
//判断所点击元素的节点，寻找rect
function getRect(tag, e) {
    if (e.target.x.animVal.value == e.target.previousSibling.x.animVal.value + 1) {
        tag = e.target
    }
    if (e.target.image == 'rect') {
        tag = e.target.previousSibling
    }
    if (e.target.tagName == 'tspan') {
        tag = e.target.parentNode.previousSibling.previousSibling.previousSibling
    }
    return tag
}

//树形结构图
function showTrees(data) {
    var zTreeObj,
        setting = {
            view: {
                selectedMulti: true
            },
            check: {
                enable: true
            },
            async: {
                enable: true,
                type: "get",
                url: Qtype,
                autoParam: ["id=typeid"],
                dataFilter: ajaxDataFilter
            }
        },
        zTreeNodes = [
            {"name": "设备类型", open: true, children: data}
        ];

    function ajaxDataFilter(treeId, parentNode, responseData) {
        if (responseData) {
            var data1 = [];
            for (var i = 0; i < responseData.data.points.length; i++) {
                data1[i] = {pointno: responseData.data.points[i].pointno, name: responseData.data.points[i].etypename}
            }
        }
        responseData = data1;
        return responseData;
    }

    zTreeObj = $.fn.zTree.init($("#tree"), setting, zTreeNodes);
    $("#myTree").modal();
}
//获取选择的树形的值
function sure() {
    var array = [];
    var zTreeObj = $.fn.zTree.getZTreeObj("tree");
    var a=zTreeObj.getCheckedNodes(true);
    var obj=modalPropsObj.expression.point;
    obj.pointno=[];
    var z=0;
    for (var i =0;i< a.length;i++){
        if(!a[i].children) {
            console.log(a);
            obj.pointno.push(a[i].pointno);
            array[z] = {};
            array[z].name = a[i].name;
            array[z].value = a[i].pointno;
            z++
        }
    }
    dataRepeat(array, (propsBox))
}

//测试新属性框
function editProps() {
    $('#Props').modal()
}
//下拉菜单的点击事件
function choseli(e) {
    e = e || window.event;
    var porps = $(e.target).parent().parent().parent().parent();
    var li = $(porps).find('li');
    var props_row = $(porps).find('.props-row');
    //获取选中li的数组下标
    var i = getArrayIndex(li, e.target.parentElement);
    if (e.target.parentElement.tagName == 'LI') {
        var parent = $(e.target).parent().parent();
        $(e.target).parent().addClass('display-none');
        //多出一个修改名称的props-row，所以加一
        $(props_row).eq(i).removeClass('display-none')
    }
    //菜单选项空时隐藏按钮
    if ($(parent).children('li.display-none').length == $(e.target.parentElement.parentElement).children().length) {
        $(parent).prev().attr('disabled', 'disabled')
    }
}
//属性编辑框中添加属性按钮
//$('button.prop-btn').each(function(){
//    $(this).bind('click',function(event,array){
//        $.get(eqtypes,function(res){
//            var data=[];
//            for (var i=0;i<res.data.types.length;i++){
//                data.push(res.data.types[i].tname);
//            }
//            (event.target.previousSibling)?propsBox=event.target.previousElementSibling:propsBox=event.target.parentElement.previousElementSibling;
//            createCheckBox(data,$('#POPUP_BOXLabel'));
//            $('#POPUP_BOX').modal(
//                //{backdrop:false}
//            )
//
//        });
//
//    })
//});

//获取设备类型
function getEquips(e) {
    e = e || window.event;
    $.get(eqtypes, function (res) {
        var data = [];
        for (var i = 0; i < res.data.types.length; i++) {
            data[i] = {value: res.data.types[i].tname, name: res.data.types[i].id, type: 'equip'};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        createCheckBox(data, $('#POPUP_BOXLabel'), 'param1');
    });
    $('#POPUP_BOX').modal(
        //{backdrop:false}
    )
}
//指定设备
function getEquip(e) {
    e = e || window.event;
    $.get(eqtypes, function (res) {
        var data = [];
        for (var i = 0; i < res.data.types.length; i++) {
            data[i] = {id: res.data.types[i].id, name: res.data.types[i].tname, children: [], isParent: true};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        createCheckBox(data, $('#POPUP_BOXLabel'), 'param2');
        showTrees(data)
    });
}
//事件类型
function getEvent(e) {
    e = e || window.event;
    $.get(allEvents, function (res) {
        var data = [];
        for (var i = 0; i < res.data.events.length; i++) {
            data[i] = {name: res.data.events[i].id, value: res.data.events[i].eventname, type: 'events'};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        //var index=getArrayIndex($('#'+propsName).children(),event.target.parentElement.parentElement);
        //var array1=Object.keys(modalPropsObj.props);
        //for (var a in modalPropsObj.props){
        //    if(a==array1[index]) {
        //        createCheckBox(data,$('#POPUP_BOXLabel'),'param3');
        //    }}
        createCheckBox(data, $('#POPUP_BOXLabel'), 'param3');
    });
    $('#POPUP_BOX').modal(
    )
}
//视屏联动命令
function getLinkedOrder(e) {
    e = e || window.event;
    $.get(allEvents, function (res) {
        var data = [];
        for (var i = 0; i < res.data.events.length; i++) {
            data[i] = {name: res.data.events[i].id, value: res.data.events[i].eventname, type: 'events'};
        }
        (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        //var index=getArrayIndex($('#'+propsName).children(),event.target.parentElement.parentElement);
        //var array1=Object.keys(modalPropsObj.props);
        //for (var a in modalPropsObj.props){
        //    if(a==array1[index]) {
        //        createCheckBox(data,$('#POPUP_BOXLabel'),'param3');
        //    }}
        createCheckBox(data, $('#POPUP_BOXLabel'), 'param2');
    });
    $('#POPUP_BOX').modal(
    )
}


//判断生成的id是否重复，并处理
function createId(id) {
    var a = 1;
    if ($('#' + id).length != 0) {
        id = id + a;
        return createId(id);
    }
    else {
        return id;
    }
}
//过滤器
function filter() {
    this.getTypeId = function () {

    }
}
//电话号码输入框的事件处理
function getNum(e) {
    e = e || window.event;
    if ($(e.target).val().length == 12) {
        alert('号码只能为11位');
        e.target.value = e.target.value.substring(0, $(e.target).val().length - 1)
    }
}
function getVal(e) {
    e = e || window.event;
    if (e.target.type == 'number' && e.target.value.length < 11) {
        alert('号码少于11位');
    } else {
        //获取属性值存入modalPropsObj
        if (e.target.type == 'number') {
            (e.target.previousElementSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
        }
        if (e.target.type == 'number') {
            (e.target.previousElementSibling) ? propsBox = e.target.previousElementSibling : propsBox = e.target.parentElement.previousElementSibling;
            var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
        } else {
            index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement.parentElement);
        }
        var array1 = Object.keys(modalPropsObj.props);
        for (var a in modalPropsObj.props) {
            if (a == array1[index]) {
                if (e.target.type == 'number') {
                    modalPropsObj.props[a].value.push({name:e.target.value,value:e.target.value});
                    var array = [];
                    for (var i in modalPropsObj.props[a].value) {
                        array[i] = {};
                        array[i].name = modalPropsObj.props[a].value[i].name;
                        array[i].value = modalPropsObj.props[a].value[i].value
                    }
                    dataRepeat(array, propsBox);
                    e.target.value = '';
                } else {
                    modalPropsObj.props[a].value = e.target.value;
                }
            }
        }

    }
}
//删除动态渲染的值
function delEvent(e) {
    e = e || window.event;
    var children = $(e.target).parent().parent().children();
    var parent = e.target.parentElement.parentElement;
    //获取该值在数组的索引
    var i = getArrayIndex(children, e.target.parentElement);
    //获取该属性再属性对象的索引
    var index = getArrayIndex($('#' + propsName).children(), parent.parentElement.parentElement.parentElement);
    var array1 = Object.keys(modalPropsObj.props);
    for (var a in modalPropsObj.props) {
        if (array1[index] == a) {
            modalPropsObj.props[a].value.splice(i, 1)
        }
    }
    $(e.target.parentElement.parentElement).remove();

}

//发送数据前对数据进行处理
function changeSvgData(svgData) {
    for (var a in svgData.states) {
        //找到开始、分支等无属性的节点,相应处理
        if (svgData.states[a].type == 'start') {
            for (var b in svgData.paths) {
                if (svgData.paths[b].from == a) {
                    delete svgData.paths[b]
                }
            }
            delete svgData.states[a];
            continue
        }
        if (svgData.states[a].type == 'end') {
            for (var c in svgData.paths) {
                if (svgData.paths[c].to == a) {
                    delete svgData.paths[c]
                }
            }
            delete svgData.states[a]
            continue
        }
        if (svgData.states[a].type == 'fork') {
            for (var d in svgData.paths) {
                if (svgData.paths[d].to == a) {
                    var from = svgData.paths[d].from;
                    delete svgData.paths[d];
                }
            }
            for (var e in svgData.paths) {
                if (svgData.paths[e].from == a) {
                    svgData.paths[e].from = from;
                }
            }

            delete svgData.states[a];
        }
    }
    //增加条件表达式至条件对象
    for (var idxS in svgData.states) {
        for (var inxP in svgData.paths) {
            if (idxS == svgData.paths[inxP].from) {
                svgData.paths[inxP].props.expression = {}
                svgData.paths[inxP].props.expression = {expression: svgData.states[idxS].expression}
            }
        }
    }
    return svgData
}
//选择等待时间
function changeTime(e) {
    e = e || window.event;
    var parent = $(e.target).parent().parent();
    var children = $(parent).children();
    if (e.target.checked) {
        if (e.target.value == "1") {
            $(children[3]).removeClass('display-none');
            modalPropsObj.time = e.target.value
        } else {
            $(children[3]).addClass('display-none');
            modalPropsObj.time = e.target.value
        }
    }
    if (parseInt(e.target.value) > 1) {
        modalPropsObj.time = e.target.value
    }
}
function getCondi(e) {
    e = e || window.event;
    modalPropsObj.condition = e.target.value
}

//打开属性框时获取等待时间的值
function getRadioVal(obj) {
    var time = document.getElementsByName('time');
    for (var i in time) {
        if (obj.time == time[i].value) {
            time[i].checked = true;
        }
        if (parseInt(obj.time) > 1) {
            $(time[3]).parent().removeClass('display-none');
            $(time[3]).val(obj.time)
        }
    }
    if (parseInt(obj.time) <= 1) {
        $(time[3]).parent().addClass('display-none');
        time[3].value = "";
    }
}

//判断input是否显示
function judeRecLinkVal(e) {
    e=e||window.event;
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var input = e.target.parentElement.getElementsByClassName('rec-link-input');
    //判断输入框是否显示
    if (e.target.value != '-1') {
        for (var i = 0; i < input.length; i++) {
            $(input[i]).removeClass('display-none');
            modalPropsObj.props.param2.value[index - 2] = e.target.value + ' ' + input[0].value + '、' + input[1].value;
        }
    } else {
        for (var a = 0; a < input.length; a++) {
            $(input[a]).addClass('display-none');
            input[a].value = "";
            modalPropsObj.props.param2.value.splice([index - 2], 1);
        }
    }
    //获取值
}
//获取视频联动的值
function getRecLinkVal(e) {
    e=e||window.event;
    var index = getArrayIndex($('#' + propsName).children(), e.target.parentElement.parentElement);
    var input = document.getElementsByClassName('rec-link-input');
    var length = input.length - 2;
    var fir = length;
    var sec = fir + 1;
    modalPropsObj.props.param2.value[index - 2]={};
    modalPropsObj.props.param2.value[index - 2].name = "0";
    modalPropsObj.props.param2.value[index - 2].value = $(e.target).parent().children().get(0).value + ' ' + input[index - 2].value + '、' + input[index - 1].value;
}
//视屏联动添加功能
function getOrder(e) {
    e=e||window.event;
    var myflow = $.myflow;
    //添加输入框
    ($(e.target).parent().next().parent()).append($('<div class="row props-row">' +
        '<div class="col-xs-3 props-row-text">联动命令:</div> ' +
        '<div  class="col-xs-9"><select class="form-control rec-link-select" onchange="judeRecLinkVal(event)">' +
        '<option value="-1">请选择</option>' +
        '<option value="SWITCH">摄像机</option>' +
        '<option value="PTZ">PTZ控制</option></select>' +
        '<input class="form-control rec-link-input display-none" name="rec-link-1" type="number" onchange="getRecLinkVal(event)" required="required"><input class="form-control rec-link-input display-none"  name="rec-link-2" type="number" onchange="getRecLinkVal(event)" required="required"> ' +
        '</div></div>'));
    //添加原型属性
    //var num= ($(e.target).parent().parent().children()).length;
    //num=num-1;
    //var param='param'+num;
    //myflow.config.tools.states.recLinked.props[param]={name:param, label : '联动命令', value:[],editorType:'Array', editor:function(){return new myflow.editors.textEditor();}}
    //modalData[5].propertyInfos.push(
    //  {"defaultValue":"","nodeType":"TEXT_INPUT","property":"linkageOrder","propertyCaption":"联动命令","propertyDes":"联动命令1","propertyGroup":"a",
    //      "propertyValueType":"TEXT_INPUT","propertyValues":[""]});
    ////myflow.props(window.attribute.recLinked,documentObj);
    //console.log(myflow.config.tools.states);
    //myflow.rect();
    //$.extend(true,myflow.config.tools.states,myflow.config.tools.states);
    //$(eventTarget.target).trigger('click',[eventTarget]);
}

//打开分页模态框
function openPages(e) {
    e = e || window.event;
    getPages();
    (e.target.previousSibling) ? propsBox = e.target.previousElementSibling : propsBox = event.target.parentElement.previousElementSibling;
    //var options={
    //    currentPage: pages.currentPage,
    //    totalPages: pages.total,
    //    pageUrl: function(type, page, current){                return pagesUrl+'?pageIndex='+page;
    //
    //    }
    //};
    //$('#page-ul').bootstrapPaginator(options);
    $('#POPUP_Page').modal(
    )
}
//分页查询请求数据
var pages = {
    size: 12,
    currentPage: "",
    pointno: "",
    pointname: ""
};
function getPages(e) {
    e = e || window.event;
    var parent = $('#page-list');
    var ul = $('#page-ul');
    $.get(
        pagesUrl + '?pageIndex=' + pages.currentPage + '&pageSize=' + pages.size + '&KWD=' + pages.pointno + '&PointName=' + pages.pointname,
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
function turnPages(e) {
    e = e || window.event;
    var num = e.target.text;
    switch (num) {
        case '首页':
            num = 0;
            break;
        case '上一页':
            num = pages.currentPage - 1;
            if (num < 0) {
                return false
            }
            break;
        case '下一页':
            num = pages.currentPage + 1;
            if (num == pages.total) {
                return false
            }
            break;
        case '末页':
            num = pages.total - 1;
            break;
        default:
            num = parseInt(num) - 1;
    }
    pages.currentPage = num;
    getPages()
}

//每页显示多少条，跳转具体页面
function changePageSize(e) {
    e = e || window.event;
    pages.size = e.target.value;
}
function changePage(e) {
    e = e || window.event;
    if (parseInt(e.target.value) > pages.total) {
        e.target.value = pages.total
    }
    pages.currentPage = parseInt(e.target.value) - 1;
}

//关键词搜索
function changepointno(e) {
    e = e || window.event;
    pages.pointno = e.target.value
}
function changepointname(e) {
    e = e || window.event;
    pages.pointname = e.target.value
}
//清空
function clearInput() {
    var input = document.getElementsByName('keywords');
    input[0].value = "";
    input[1].value = "";
    pages = {
        size: 12,
        currentPage: "",
        pointno: "",
        pointname: ""
    };
    getPages()
}

//对齐功能
$('#xAxis').bind('click',function(){
    var myflow = $.myflow;
    if(!click){
        rectBox=[];
        var r=confirm("请单击需要对齐的模块，然后再单击本按钮");
        if(r){
            click=!click;
            return
        }
    }
    if(click){
        if( rectBox.length<1){
            return false
        }
        var y=rectBox[0]._bbox.y;
        for(var i=0;i<rectBox.length;i++){
            $(rectBox[i]._rect).mousedown();
            //获取坐标，更新坐标
            var _bbox=rectBox[i]._bbox;
            _bbox.y=y;
            var _rect=rectBox[i]._rect;
            var _text=rectBox[i]._text;
            var _name=rectBox[i]._name;
            var _img=rectBox[i]._img;
            var _o=rectBox[i]._o;
            var _bdots=rectBox[i]._bdots;
            var _bpath=rectBox[i]._bpath;
            var _bw=rectBox[i]._bw;
            var _this=rectBox[i]._this;
            var _r=rectBox[i]._r;

            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;
            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            _text.attr({
                x: rx + _o.img.width + (rw - _o.img.width) / 2,
                y: ry + (rh - myflow.config.lineHeight) / 2
                + myflow.config.lineHeight
            });
            _name.attr({
                x: rx + _o.img.width + (rw - _o.img.width) / 2,
                y: ry + myflow.config.lineHeight / 2
            });
            _img.attr({
                x: rx + _o.img.width / 2 - 10,
                y: ry + (rh - _o.img.height) / 2
            });
            _bdots['t'].attr({
                x: _bbox.x + _bbox.width / 2 - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 上
            _bdots['lt'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 左上
            _bdots['l'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 左
            _bdots['lb'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 左下
            _bdots['b'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 下
            _bdots['rb'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 右下
            _bdots['r'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 右
            _bdots['rt'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2
            });// 右上
            _bpath.attr({
                path: 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
                + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
                + ' ' + (_bbox.y + _bbox.height) + 'L'
                + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
                + ' ' + _bbox.y
            });
            $(_r).trigger('rectresize', _this);
        }
        rectBox=[];
        click=!click;
    }

});
$('#yAxis').bind('click',function(){
    var myflow = $.myflow;
    if(!click){
        rectBox=[];
        var r=confirm("请单击需要对齐的模块，然后再单击本按钮");
        if(r){
            click=!click;
            return
        }
    }else {
        if( rectBox.length<1){
            return false
        }
        var x=rectBox[0]._bbox.x;

        for(var i=0;i<rectBox.length;i++){
            $(rectBox[i]._rect).mousedown();
            //获取坐标，更新坐标
            var _bbox=rectBox[i]._bbox;
            _bbox.x=x;
            var _rect=rectBox[i]._rect;
            var _text=rectBox[i]._text;
            var _name=rectBox[i]._name;
            var _img=rectBox[i]._img;
            var _o=rectBox[i]._o;
            var _bdots=rectBox[i]._bdots;
            var _bpath=rectBox[i]._bpath;
            var _bw=rectBox[i]._bw;
            var _this=rectBox[i]._this;
            var _r=rectBox[i]._r;

            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;
            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            _text.attr({
                x: rx + _o.img.width + (rw - _o.img.width) / 2,
                y: ry + (rh - myflow.config.lineHeight) / 2
                + myflow.config.lineHeight
            });
            _name.attr({
                x: rx + _o.img.width + (rw - _o.img.width) / 2,
                y: ry + myflow.config.lineHeight / 2
            });
            _img.attr({
                x: rx + _o.img.width / 2 - 10,
                y: ry + (rh - _o.img.height) / 2
            });
            _bdots['t'].attr({
                x: _bbox.x + _bbox.width / 2 - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 上
            _bdots['lt'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 左上
            _bdots['l'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 左
            _bdots['lb'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 左下
            _bdots['b'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 下
            _bdots['rb'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 右下
            _bdots['r'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 右
            _bdots['rt'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2
            });// 右上
            _bpath.attr({
                path: 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
                + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
                + ' ' + (_bbox.y + _bbox.height) + 'L'
                + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
                + ' ' + _bbox.y
            });
            $(_r).trigger('rectresize', _this);
        }
        rectBox=[];
        click=!click;
    }

});
//配置启动条件
$('#myflow_startConditions').bind('click',function(){
    var myflow = $.myflow;
    flowCondition(myflow.config.path.props.text);
    $('#flow_startCondition').modal();
    $(document).unbind('dblclick')
});
function addFlowCon(){
    var a=$('.condition').length;
    var z=a+1;
    $('#startCondition_content').append('<div class="row props-row">' +
      '<div class="col-xs-3 props-row-text">'+"条件"+z+'</div>' +
      '<div class="col-xs-2"><label><input type="text" class="form-control" placeholder="值"></label></div>' +
      '<div class="col-xs-3"><label><select class="form-control condition"></select></label></div>' +
      '<div class="col-xs-2"><label><input type="text" class="form-control" placeholder="范围"></label></div>' +
      '</div>');
    for (var k=0;k<judeItems.length;k++){
        $($('#startCondition_content').find('select.condition').eq(a)).append('<option value='+judeItems[k].key+'>'+judeItems[k].name+'</option>')
    }
}
function saveStartCon(){
    var myflow = $.myflow;
    myflow.config.path.props.text.startCheckClass=$('#startCheckClass').val();
    var row=$('#startCondition_content').find('.props-row');
    for(var i=0;i<$(row).length-1;i++){
        var a=i+1;
        var inputs=$(row).eq(i+1).find('.form-control');
        myflow.config.path.props.text.startConditions.push({"value":$(inputs).eq(0).val(),"operaterType":$(inputs).eq(1).val(),"property":$(inputs).eq(2).val()})
    }
}
