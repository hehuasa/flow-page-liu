/**
 * Created by Administrator on 2017/7/14.
 */

(function ($) {
    var myflow = {};
    myflow.config = {
        editable: true,
        lineHeight: 15,
        basePath: '',
        rect: {// 状态
            attr: {
                x: 10,
                y: 10,
                width: 120,
                height: 50,
                r: 5,
                fill: '90-#fff-#C0C0C0',
                stroke: '#000',
                "stroke-width": 1
            },
            showType: 'image&text',// image,text,image&text
            type: 'state',
            name: {
                text: 'state',
                'font-style': 'italic'
            },
            text: {
                text: '状态',
                'font-size': 13
            },
            margin: 5,
            props: [],
            img: {}
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#61B7CF',
                    fill: "none",
                    radius: 1,
                    "stroke-width": 2,
                    cursor: 'pointer',
                    click: function (e) {
                        e = e || window.event;
                        if (e.target.tagName == 'rect') {
                            $('#Props').modal()
                        }
                        if (e.target.tagName == 'image') {
                            if (e.target.previousSibling.tagName == 'rect') {
                                $('#Props').modal()
                            }
                        }
                        if (e.target.tagName == 'tspan') {
                            if (e.target.parentNode.previousSibling.previousSibling.previousSibling.previousSibling.tagName == 'path') {
                                $('#myModal').modal()
                            } else {
                                $('#Props').modal()
                            }
                        }
                        if (e.target.tagName == 'path') {
                            $('#myModal').modal()
                        }
                        $(documentObj).unbind('showprops');
                        $(document).unbind('dblclick')
                    }
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#61B7CF',
                    fill: "#61B7CF",
                    "stroke-width": 2,
                    radius: 4
                },
                fromDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                toDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                bigDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                smallDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    cursor: "move",
                    'background': '#000'
                }
            },
            text: {
                patten: 'From {from} To{to}',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                text: {
                    name: 'text',
                    label: '显示',
                    value: '',
                    startCheckClass: '',
                    startConditions: [],
                    editor: function () {
                        return new myflow.editors.textEditor();
                    }
                }
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {

                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 10,
                right: 30
            },
            props: {}
        },
        restore: '',
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        }
    };

    myflow.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        nextId: (function () {
            var uid = 0;
            return function () {
                return ++uid;
            };
        })(),

        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1, yFlag = start.x < end.x ? -1
              : 1, arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        // 计算线条路径上

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        }
    };

    myflow.rect = function (o, r, id) {
        var _this = this, _uid = myflow.util.nextId(), _o = $.extend(true, {},
          myflow.config.rect, o), _id = 'rect' + _uid, _r = r, // Raphael画笔
          _rect, _img, // 图标
          _name, // 状态名称
          _text, // 显示文本
          _ox, _oy; // 拖动时，保存起点位置;
        _o.text.text = id;
        _o.name.text = "";

        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
          _o.attr.r).hide().attr(_o.attr);

        _img = _r.image(myflow.config.basePath + _o.img.src,
          _o.attr.x + _o.img.width / 2,
          _o.attr.y + (_o.attr.height - _o.img.height) / 2, _o.img.width,
          _o.img.height).hide();
        _name = _r.text(
          _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
          _o.attr.y + myflow.config.lineHeight / 2, _o.name.text).hide()
          .attr(_o.name);
        _text = _r.text(
          _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
          _o.attr.y + (_o.attr.height - myflow.config.lineHeight) / 2
          + myflow.config.lineHeight, _o.text.text).hide().attr(
          _o.text);// 文本

        // 拖动处理----------------------------------------
        _img.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _name.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _text.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _rect.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });

        var dragMove = function (dx, dy) {// 拖动中
            if (!myflow.config.editable)
                return;

            var x = (_ox + dx);// -((_ox+dx)%10);
            var y = (_oy + dy);// -((_oy+dy)%10);

            _bbox.x = x - _o.margin;
            _bbox.y = y - _o.margin;
            resize();
        };

        var dragStart = function () {// 开始拖动
            _ox = _rect.attr("x");
            _oy = _rect.attr("y");
            _rect.attr({
                opacity: 0.5
            });
            _img.attr({
                opacity: 0.5
            });
            _text.attr({
                opacity: 0.5
            });
        };

        var dragUp = function () {// 拖动结束

            _img.attr({
                opacity: 1
            });
            _text.attr({
                opacity: 1
            });
            _rect.attr({
                opacity: 1
            });
        };

        // 改变大小的边框
        var _bpath, _bdots = {}, _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        _bpath = _r.path('M0 0L1 1').hide();
        _bdots['t'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 't');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 't');
          }, function () {
          });// 上
        _bdots['lt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'nw-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'lt');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'lt');
          }, function () {
          });// 左上
        _bdots['l'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'l');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'l');
          }, function () {
          });// 左
        _bdots['lb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'sw-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'lb');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'lb');
          }, function () {
          });// 左下
        _bdots['b'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'b');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'b');
          }, function () {
          });// 下
        _bdots['rb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'se-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'rb');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'rb');
          }, function () {
          });// 右下
        _bdots['r'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide().drag(function (dx, dy) {
            bdragMove(dx, dy, 'r');
        }, function () {
            bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw / 2, 'r')
        }, function () {
        });// 右
        _bdots['rt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'ne-resize'
        }).hide().drag(
          function (dx, dy) {
              bdragMove(dx, dy, 'rt');
          },
          function () {
              bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
                / 2, 'rt')
          }, function () {
          });// 右上
        $(
          [_bdots['t'].node, _bdots['lt'].node, _bdots['l'].node,
              _bdots['lb'].node, _bdots['b'].node, _bdots['rb'].node,
              _bdots['r'].node, _bdots['rt'].node]).click(
          function () {
              return false;
          });

        var bdragMove = function (dx, dy, t) {
            if (!myflow.config.editable)
                return;
            var x = _bx + dx, y = _by + dy;
            switch (t) {
                case 't':
                    _bbox.height += _bbox.y - y;
                    _bbox.y = y;
                    break;
                case 'lt':
                    _bbox.width += _bbox.x - x;
                    _bbox.height += _bbox.y - y;
                    _bbox.x = x;
                    _bbox.y = y;
                    break;
                case 'l':
                    _bbox.width += _bbox.x - x;
                    _bbox.x = x;
                    break;
                case 'lb':
                    _bbox.height = y - _bbox.y;
                    _bbox.width += _bbox.x - x;
                    _bbox.x = x;
                    break;
                case 'b':
                    _bbox.height = y - _bbox.y;
                    break;
                case 'rb':
                    _bbox.height = y - _bbox.y;
                    _bbox.width = x - _bbox.x;
                    break;
                case 'r':
                    _bbox.width = x - _bbox.x;
                    break;
                case 'rt':
                    _bbox.width = x - _bbox.x;
                    _bbox.height += _bbox.y - y;
                    _bbox.y = y;
                    break;
            }
            resize();
            // $('body').append(t);
        };
        var bdragStart = function (ox, oy, t) {
            _bx = ox;
            _by = oy;
        };

        // 事件处理--------------------------------
        $([_rect.node, _text.node, _name.node, _img.node]).bind(
          'click',
          function (event) {
              event = event || window.event;
              clickArray = getClickArray(clickArray, event);
              var box = {
                  _bbox: _bbox,
                  _rect: _rect,
                  _name: _name,
                  _text: _text,
                  _img: _img,
                  _o: _o,
                  _bdots: _bdots,
                  _bpath: _bpath,
                  _bw: _bw,
                  _this: _this,
                  _r: _r
              };
              rectBox.push(box);
              if (!myflow.config.editable)
                  return;
              showBox();
              var mod = $(_r).data('mod');
              switch (mod) {
                  case 'pointer':
                      break;
                  case 'path':
                      var pre = $(_r).data('currNode');
                      if (pre && pre.getId() != _id
                        && pre.getId().substring(0, 4) == 'rect') {

                          $(_r).trigger('addpath', [pre, _this]);
                          //生成一条连线后 自动从连线模式转换到指针模式
                          $('.selected').removeClass('selected');
                          //$(_r).data('mod', 'point');
                      }
                      break;
                  //default:var pre = $(_r).data('currNode');
                  //    if (pre && pre.getId() != _id
                  //        && pre.getId().substring(0, 4) == 'rect') {
                  //        $(_r).trigger('addpath', [pre, _this]);
                  //        //生成一条连线后 自动从连线模式转换到指针模式
                  //        $('.selected').removeClass('selected');
                  //        $(_r).data('mod', 'point');
                  //    }


              }
              $(_r).trigger('click', _this);
              $(_r).data('currNode', _this);
              return false;
          });

        var clickHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src.getId() == _id) {
                //实时保存每一步动作
                //$('#myflow_save')
                //	.trigger('click');
                documentObj = _r;
                modalsObj = _o;
                src_ = src;
                //myflow.click(e);
                clickState = 1;
                //$(_r).trigger('showprops', [ _o.props, src ]);
            } else {
                hideBox();
            }
        };
        $(_r).bind('click', clickHandler);

        var textchangeHandler = function (e, text, src) {
            if (src.getId() == _id) {
                _text.attr({
                    text: text
                });
            }
        };
        $(_r).bind('textchange', textchangeHandler);

        // 私有函数-----------------------
        // 边框路径
        function getBoxPathString() {
            return 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
              + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
              + ' ' + (_bbox.y + _bbox.height) + 'L'
              + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
              + ' ' + _bbox.y;
        }

        // 显示边框
        function showBox() {
            _bpath.show();
            for (var k in _bdots) {
                _bdots[k].show();
            }
        }

        // 隐藏
        function hideBox() {
            _bpath.hide();
            for (var k in _bdots) {
                _bdots[k].hide();
            }
        }

        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
              - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image':
                    _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'text':
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,
                        y: ry + rh / 2
                    }).show();// 文本
                    break;
                case 'image&text':
                    _rect.show();
                    _name.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + myflow.config.lineHeight / 2
                    }).show();
                    _text.attr(
                      {
                          x: rx + _o.img.width + (rw - _o.img.width) / 2,
                          y: ry + (rh - myflow.config.lineHeight) / 2
                          + myflow.config.lineHeight
                      }).show();// 文本
                    _img.attr({
                        x: rx + _o.img.width / 2 - 10,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }

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
                path: getBoxPathString()
            });

            $(_r).trigger('rectresize', _this);
        }
        ;

        // 函数----------------
        // 转化json字串
        this.toJson = function () {
            var data = "{type:'" + _o.type + "'," + "time:'" + _o.time + "'" + ",expression:'{";
            for (var exIndex in _o.expression) {
                if (exIndex == 'point') {
                    for (var exIndex1 in _o.expression[exIndex]) {
                        if (exIndex1 == 'etype') {
                            for (var exIndex2 in _o.expression[exIndex][exIndex1]) {
                                if (_o.expression[exIndex][exIndex1].length < 1 || exIndex2 == _o.expression[exIndex][exIndex1].length || exIndex2 == 0) {
                                    data = data + 'Alarm.point.etype==' + _o.expression[exIndex][exIndex1]
                                }
                                if (_o.expression[exIndex][exIndex1].length > 1 && exIndex2 < _o.expression[exIndex][exIndex1].length && exIndex2 > 0) {
                                    data = data + '||Alarm.point.etype==' + _o.expression[exIndex][exIndex1]
                                }
                            }
                        } else {
                            for (var exIndex3 in _o.expression[exIndex][exIndex1]) {
                                if (_o.expression[exIndex][exIndex1].length < 1 || exIndex3 == _o.expression[exIndex][exIndex1].length || exIndex3 == 0) {
                                    data = data + '||Alarm.point.pointno==' + _o.expression[exIndex][exIndex1]
                                }
                                if (_o.expression[exIndex][exIndex1].length > 1 && exIndex3 < _o.expression[exIndex][exIndex1].length && exIndex2 > 0) {
                                    data = data + '"||Alarm.point.pointno==' + _o.expression[exIndex][exIndex1]
                                }
                            }
                        }

                    }
                }
                else {
                    for (var exIndex1 in _o.expression[exIndex]) {
                        for (var exIndex4 in _o.expression[exIndex][exIndex1]) {
                            if (_o.expression[exIndex][exIndex1].length < 1 || exIndex4 == _o.expression[exIndex][exIndex1].length || exIndex4 == 0) {
                                data = data + '||Alarm.event.id==' + _o.expression[exIndex][exIndex1]
                            }
                            if (_o.expression[exIndex][exIndex1].length > 1 && exIndex4 < _o.expression[exIndex][exIndex1].length && exIndex2 > 0) {
                                data = data + '"||Alarm.event.id==' + _o.expression[exIndex][exIndex1]
                            }
                        }
                    }
                }
            }
            data = data + "}',category:" + _o.category
              + ",text:{text:'" + _text.attr('text') + "'}, attr:{ x:"
              + Math.round(_rect.attr('x')) + ", y:"
              + Math.round(_rect.attr('y')) + ", width:"
              + Math.round(_rect.attr('width')) + ", height:"
              + Math.round(_rect.attr('height')) + "}, props:{";
            for (var k in _o.props) {
                if (_o.props[k].time) {
                    data += k + ":{value:'" + _o.props[k].value + "'" + ",time:'" + _o.props[k].time + "'},";
                } else if (typeof (_o.props[k]).value == 'object') {
                    var data1 = [];
                    for (var z in _o.props[k].value) {
                        if (typeof(_o.props[k].value[z]) == 'object') {
                            data1.push('{name:' + '"' + _o.props[k].value[z].name + '",value:' + '"' + _o.props[k].value[z].value + '' +
                              '",value1:' + '"' + _o.props[k].value[z].value1 + '",value2:' + '"' + _o.props[k].value[z].value2 + '"}');
                            data += k + ":{value:[" + data1 + "]},"
                        } else {
                            data += k + ":{value:'" + _o.props[k].value + "'},";
                            break
                        }
                    }
                } else {
                    data += k + ":{value:'" + _o.props[k].value + "'},";
                }

            }
            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += "}}";
            return data;
        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);

            _o = $.extend(true, _o, data);

            _text.attr({
                text: obj.text.text
            });
            resize();
        };

        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.remove = function () {
            _rect.remove();
            _text.remove();
            _name.remove();
            _img.remove();
            _bpath.remove();
            for (var k in _bdots) {
                _bdots[k].remove();
            }
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };

        resize();// 初始化位置
    };

    myflow.path = function (o, r, from, to) {
        var _this = this, _r = r, _o = $.extend(true, {}, myflow.config.path), _path, _arrow, _text, _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = 'path'
          + myflow.util.nextId(), _dotList, _autoText = true;
        // 点
        function dot(type, pos, left, right) {
            var _this = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
              _pos = pos;// 缓存位置信息{x,y}, 注意：这是计算出中心点

            switch (_t) {
                case 'from':
                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                      pos.y - _o.attr.fromDot.height / 2,
                      _o.attr.fromDot.width, _o.attr.fromDot.height).attr(
                      _o.attr.fromDot);
                    break;
                case 'big':
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                      pos.y - _o.attr.bigDot.height / 2,
                      _o.attr.bigDot.width, _o.attr.bigDot.height).attr(
                      _o.attr.bigDot);
                    break;
                case 'small':
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                      pos.y - _o.attr.smallDot.height / 2,
                      _o.attr.smallDot.width, _o.attr.smallDot.height).attr(
                      _o.attr.smallDot);
                    break;
                case 'to':
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                      pos.y - _o.attr.toDot.height / 2, _o.attr.toDot.width,
                      _o.attr.toDot.height).attr(_o.attr.toDot);

                    break;
            }
            if (_n && (_t == 'big' || _t == 'small')) {
                _n.drag(function (dx, dy) {
                    dragMove(dx, dy);
                }, function () {
                    dragStart()
                }, function () {
                    dragUp();
                });// 初始化拖动
                var dragMove = function (dx, dy) {// 拖动中
                    var x = (_ox + dx), y = (_oy + dy);
                    _this.moveTo(x, y);
                };

                var dragStart = function () {// 开始拖动
                    if (_t == 'big') {
                        _ox = _n.attr("x") + _o.attr.bigDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.bigDot.height / 2;
                    }
                    if (_t == 'small') {
                        _ox = _n.attr("x") + _o.attr.smallDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.smallDot.height / 2;
                    }
                };

                var dragUp = function () {// 拖动结束

                };
            }
            $(_n.node).click(function () {
                return false;
            });

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {
                if (pos) {
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from':
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(
                              myflow.util.connPoint(_to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt.pos(myflow.util.center(_pos, _rt.right().pos()));
                        }
                        break;
                    case 'big':

                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(
                              myflow.util.connPoint(_to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(
                              myflow.util.connPoint(_from.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt.pos(myflow.util.center(_pos, _rt.right().pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (myflow.util.isLine(_lt.left().pos(), pos, _rt.right()
                            .pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small':// 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !myflow.util.isLine(_lt.pos(), {
                              x: _pos.x,
                              y: _pos.y
                          }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', myflow.util.center(_lt.pos(),
                              _pos), _lt, _lt.right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', myflow.util.center(_rt.pos(),
                              _pos), _rt.left(), _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to':
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(
                              myflow.util.connPoint(_from.getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }

                refreshpath();
            };
        }

        // 计算出 两个矩形的 位置关系
        function calLocation(fromBox, toBox) {
            // 能够进行左右链接
            return Math.abs(fromBox.y - toBox.y) > fromBox.height ? 'leftOrRight'
              : 'topOrBottom';
        }

        // 根据两个矩形的中心点计算出 垂直位置 不与矩形相交的折线 的两个折点（+50）
        function calVerticalLine(fromBox, toBox) {
            var ltx = 0, rtx = 0, miny = 0, maxy = 0, _fromBox = fromBox
              .getBBox(), _toBox = toBox.getBBox();
            // 计算出 两个矩形的 最左ltx 和 rtx
            ltx = _fromBox.x < _toBox.x ? _fromBox.x : _toBox.x;
            rtx = _fromBox.x + _fromBox.width < _toBox.x + _toBox.width ? _fromBox.x
            + _fromBox.width
              : _toBox.x + _toBox.width;
            if (_fromBox.y > _toBox.y) {
                miny = _toBox.y;
                maxy = _fromBox.y + _fromBox.height;
            } else {
                maxy = _toBox.y + _toBox.height;
                miny = _fromBox.y;
            }
            var templtx = ltx, temprtx = rtx;
            var tempBox;
            // 在两个矩形之间的矩形 找出最值X坐标
            for (var k in allStates) {
                if (null == allStates[k]) continue;// 已经删除
                tempBox = allStates[k].getBBox();
                if (tempBox.y + tempBox.height < miny || tempBox.y > maxy) continue;
                // 获的左侧最小X坐标
                if (tempBox.x < templtx)    templtx = tempBox.x;

                // 获的右侧最大X坐标
                if (tempBox.x + tempBox.width > temprtx)    temprtx = tempBox.x + tempBox.width;
            }
            var leftRes = [{
                x: temprtx + 50,
                y: _fromBox.y + _fromBox.height / 2
            }, {
                x: temprtx + 50,
                y: _toBox.y + _fromBox.height / 2
            }];
            var rightRes = [{
                x: templtx - 50,
                y: _fromBox.y + _fromBox.height / 2
            }, {
                x: templtx - 50,
                y: _toBox.y + _fromBox.height / 2
            }];
            //计算是否有线条交叉 (首要满足条件 不能有线条交叉和重叠)
            //右侧最优
            if (Math.abs(ltx - templtx) - Math.abs(rtx - temprtx) > 0) {
                if (lineCheckLinesIntersect(rightRes[0], rightRes[1]) == false)    return rightRes;
                else if (lineCheckLinesIntersect(leftRes[0], leftRes[1]) == false) return leftRes;
                return rightRes;
            } else {
                if (lineCheckLinesIntersect(leftRes[0], leftRes[1]) == false)    return leftRes;
                else if (lineCheckLinesIntersect(rightRes[0], rightRes[1]) == false) return rightRes;
                return leftRes;
            }
        }

        // 根据两个矩形的中心点计算出 水平位置 不与矩形相交的折线 的两个折点（+50）
        function calHorizontalLine(fromBox, toBox) {
            var minx = 0, maxx = 0, miny = 0, maxy = 0, _fromBox = fromBox
              .getBBox(), _toBox = toBox.getBBox();
            var res;
            if (_fromBox.y > _toBox.y) {
                miny = _toBox.y;
                maxy = _fromBox.y + _fromBox.height;
            } else {
                maxy = _toBox.y + _toBox.height;
                miny = _fromBox.y;
            }
            if (_fromBox.x > _toBox.x) {
                minx = _toBox.x;
                maxx = _fromBox.x + _fromBox.width;
            } else {
                maxx = _toBox.x + _toBox.width;
                minx = _fromBox.x;
            }
            var tempBox, p1 = 0, p2 = 0;
            // 先从下找出最优点 如果没有 再从上找最优点
            for (var step = 30; step < 120; step += 10) {
                // 循环找出与矩形不冲突的线段
                p1 = step;
                res = [{
                    x: _fromBox.x + _fromBox.width / 2,
                    y: maxy + p1
                }, {
                    x: _toBox.x + _toBox.width / 2,
                    y: maxy + p1
                }];
                if (recCheckLinesIntersect(res[0], res[1]) === true) {
                    p1 = 0;
                    break;
                }
                if (p1 != 0) {
                    // 如果找到满足条件的step 检查是否有线条的交叉
                    if (lineCheckLinesIntersect(res[0], res[1]) === false) {
                        return res;
                    }

                }
            }

            // 先从下找出最优点 如果没有 再从上找最优点
            for (var step = 30; step < 120; step += 10) {
                // 循环找出与矩形不冲突的线段
                p2 = step;
                res = [{
                    x: _fromBox.x + _fromBox.width / 2,
                    y: miny - p2
                }, {
                    x: _toBox.x + _toBox.width / 2,
                    y: miny - p2
                }];
                if (recCheckLinesIntersect(res[0], res[1]) === true) {
                    p2 = 0;
                    break;
                }
                if (p2 != 0) {
                    // 如果找到满足条件的step 检查是否有线条的交叉
                    if (lineCheckLinesIntersect(res[0], res[1]) == false) {
                        return res;
                    }
                }
            }
            // 如果找不到满足的点 返回两个矩形中心点的连接点
            return [myflow.util.connPoint(_fromBox, getMidPoint(toBox)),
                myflow.util.connPoint(_toBox, getMidPoint(fromBox))];
        }

        // 画折线 根据from ，to绘制线条 返回_fromDot,_toDot
        function drawPointLine(fromRec, toRec) {
            var _fromDot, _toDot, _fromBB = fromRec.getBBox(), _toBB = toRec
              .getBBox(), _fromPos, _toPos, tempPoints;

            if (calLocation(_fromBB, _toBB) === 'leftOrRight') {
                // 左或者右链接
                tempPoints = calVerticalLine(fromRec, toRec);
            } else {
                // 上或者下链接
                tempPoints = calHorizontalLine(fromRec, toRec);
            }

            _fromPos = myflow.util.connPoint(_fromBB, tempPoints[0]);
            _toPos = myflow.util.connPoint(_toBB, tempPoints[1]);
            var _smDot1 = new dot('small', myflow.util.center(_fromPos, tempPoints[0]));
            _fromDot = new dot('from', _fromPos, null, _smDot1);
            _smDot1.left(_fromDot);
            var _smDot2 = new dot('small', myflow.util.center(tempPoints[0], tempPoints[1]));
            var _midDot1 = new dot('big', tempPoints[0], _smDot1, _smDot2);
            _smDot1.right(_midDot1);
            _smDot2.left(_midDot1);
            var _smDot3 = new dot('small', myflow.util.center(tempPoints[1], _toPos));
            var _midDot2 = new dot('big', tempPoints[1], _smDot2, _smDot3);
            _smDot2.right(_midDot2);
            _smDot3.left(_midDot2);
            _toDot = new dot('to', _toPos, _smDot3, null);
            _smDot3.right(_toDot);

            return [_fromDot, _toDot];
        }

        // 画直线
        function drawStraightLine(_from, _to) {
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
              .getBBox(), _fromPos, _toPos;

            _fromPos = myflow.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = myflow.util.connPoint(_toBB, _fromPos);

            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);
            return [_fromDot, _toDot];
        }

        function linesIntersect4Point(p1, p2, p3, p4) {
            return linesIntersect(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x,
              p4.y);
        }

        // 计算是否相交
        // return 相交返回 true 不相交 false
        function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
            return ((relativeCCW(x1, y1, x2, y2, x3, y3)
            * relativeCCW(x1, y1, x2, y2, x4, y4) <= 0) && (relativeCCW(
              x3, y3, x4, y4, x1, y1)
            * relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
        }

        function relativeCCW(x1, y1, x2, y2, px, py) {
            x2 -= x1;
            y2 -= y1;
            px -= x1;
            py -= y1;
            return px * y2 - py * x2;
        }

        function getAllPots4Path(path) {
            var index = 0, dots = new Array();
            // 还有折线的情况
            var d = path.dotList().fromDot();
            while (d) {
                if (d.type() == 'big' || d.type() == 'from' || d.type() == 'to')
                    dots[index++] = {
                        x: d.pos().x,
                        y: d.pos().y
                    };
                d = d.right();
            }
            return dots;
        }

        // 根据当前环境中 给出的线段是否与当前环境中的线段有交叉点
        // true 有交叉 false 没有交叉
        function lineCheckLinesIntersect(point1, point2) {

            for (var k in allPaths) {
                if (allPaths[k] == null) continue;
                var allPots = getAllPots4Path(allPaths[k]);
                // 获取路径的坐标检查是否有交叉线
                for (var i = 1; i < allPots.length; i++) {
                    if (linesIntersect4Point(point1, point2, allPots[i - 1],
                        allPots[i]))
                        return true;
                }
            }
            return false;
        }

        // 获取矩形坐标
        // 矩形抽象为两条对角线 线段
        // return 相交返回 true 不相交 false
        function recCheckLinesIntersect(point1, point2) {
            var point3, point4, point5, point6, tempBox;

            for (var k in allStates) {
                if (null == allStates[k])
                    continue;// 已经删除
                tempBox = allStates[k].getBBox();
                // 计算出未被过滤矩形是否相交
                point3 = {
                    x: tempBox.x,
                    y: tempBox.y
                };
                point4 = {
                    x: tempBox.x + tempBox.width,
                    y: tempBox.y + tempBox.height
                };
                point5 = {
                    x: tempBox.x,
                    y: tempBox.y + tempBox.height
                };
                point6 = {
                    x: tempBox.x + tempBox.width,
                    y: tempBox.y
                };
                if (linesIntersect4Point(point1, point2, point3, point4)
                  || linesIntersect4Point(point1, point2, point5, point6))
                    return true;
            }
            return false;
        }

        // 获取矩形中心点
        function getMidPoint(rec) {
            var recBox = rec.getBBox();
            return {
                x: recBox.x + recBox.width / 2,
                y: recBox.y + recBox.height / 2
            }
        }

        // 判断两个矩形之间是否已经有线段相连/或者相交(只判断是够有 有得情况默认都为直线 目前不考虑有曲线的情况)
        // 有返回true 没有 返回falses
        function hasLine(_from, _to) {
            var pathFrom, pathTo;
            for (var k in allPaths) {
                var temp = allPaths[k];
                if (temp == null) continue;
                pathFrom = temp.from();
                pathTo = temp.to();
                // 检查是否有(直线)共线
                if (((pathFrom.getId() === _from.getId() && pathTo.getId() === _to.getId())
                  || (pathFrom.getId() === _to.getId() && pathTo.getId() === _from.getId()))
                  && temp.dotList().toJson() === "[]") {
                    return true;
                }
            }
            return false;
        }

        // 根据当前环境中 给出的线段是否与当前环境中的线段有交叉点
        // true 有交叉 false 没有交叉
        function lineCheckLinesIntersect4Rec(_from, _to) {
            var point1 = getMidPoint(_from);
            var point2 = getMidPoint(_to);
            for (var k in allPaths) {
                if (allPaths[k] == null) continue;
                var allPots = getAllPots4Path(allPaths[k]);
                // 获取路径的坐标检查是否有交叉线
                for (var i = 1; i < allPots.length; i++) {
                    if (linesIntersect4Point(point1, point2, allPots[i - 1],
                        allPots[i]))
                        return true;
                }
                return false;
            }
        }

        // 获取矩形坐标
        // 矩形抽象为两条对角线 线段
        // return 相交返回 true 不相交 false
        function recCheckLinesIntersect4Rec(_from, _to) {

            var point1, point2, point3, point4, point5, point6, tempBox, _fromBox = _from
              .getBBox(), _toBox = _to.getBBox(), miny, maxy, minx, maxx;
            if (_fromBox.y > _toBox.y) {
                miny = _toBox.y;
                maxy = _fromBox.y + _fromBox.height;
            } else {
                maxy = _toBox.y + _toBox.height;
                miny = _fromBox.y;
            }
            if (_fromBox.x > _toBox.x) {
                minx = _toBox.x;
                maxx = _fromBox.x + _fromBox.width;
            } else {
                maxx = _toBox.x + _toBox.width;
                minx = _fromBox.x;
            }
            return recCheckLinesIntersect(myflow.util.connPoint(_fromBox,
              getMidPoint(_to)), myflow.util.connPoint(_toBox,
              getMidPoint(_from)));
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, draw;
            // 如果两个矩形之间没有线条 那么使用直线 如果有 使用折线
            //TODO 还应该检查是否有完全重合的折线
            //根据 以下代码来进行判断 xy是否重合
            /*while (d) {
             if (d.type() == 'big' || d.type() == 'from' || d.type() == 'to')
             dots[index++] = {
             x : d.pos().x,
             y : d.pos().y
             };
             d = d.right();
             }*/
            if (hasLine(_from, _to) || recCheckLinesIntersect4Rec(_from, _to)
              || lineCheckLinesIntersect4Rec(_from, _to)) {
                draw = drawPointLine(_from, _to);// 折线
            } else {
                draw = drawStraightLine(_from, _to);// 直线
            }
            _fromDot = draw[0];
            _toDot = draw[1];

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = 'M' + d.pos().x + ' ' + d.pos().y, arr = '';
                // 线的路径
                while (d.right()) {
                    d = d.right();
                    p += 'L' + d.pos().x + ' ' + d.pos().y;
                }
                // 箭头路径
                var arrPos = myflow.util.arrow(d.left().pos(), d.pos(),
                  _o.attr.arrow.radius);
                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                  + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                  + arrPos[2].y + 'z';
                return [p, arr];
            };
            this.toJson = function () {
                var data = "[", d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data += "{x:" + Math.round(d.pos().x) + ",y:"
                          + Math.round(d.pos().y) + "},";
                    d = d.right();
                }
                if (data.substring(data.length - 1, data.length) == ',')
                    data = data.substring(0, data.length - 1);
                data += "]";
                return data;
            };
            this.restore = function (data) {
                var obj = data, d = _fromDot.right();

                for (var i = 0; i < obj.length; i++) {
                    d.moveTo(obj[i].x, obj[i].y);
                    d.moveTo(obj[i].x, obj[i].y);
                    d = d.right();
                }

                this.hide();
            };

            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
        }

        // 初始化操作
        _o = $.extend(true, _o, o);
        _path = _r.path(_o.attr.path.path).attr(_o.attr.path);
        _arrow = _r.path(_o.attr.arrow.path).attr(_o.attr.arrow);

        // 添加路径转折点
        _dotList = new dotList();
        _dotList.hide();

        _text = _r.text(
          0,
          0,
            _o.text.text
            || _o.text.patten.replace('{from}', _from.text())
              .replace('{to}', _to.text()))
          .attr(_o.attr.text);
        _text.drag(function (dx, dy) {
            if (!myflow.config.editable)
                return;
            _text.attr({
                x: _ox + dx,
                y: _oy + dy
            });
        }, function () {
            _ox = _text.attr('x');
            _oy = _text.attr('y');
        }, function () {
            var mid = _dotList.midDot().pos();
            _textPos = {
                x: _text.attr('x') - mid.x,
                y: _text.attr('y') - mid.y
            };
        });

        refreshpath();// 初始化路径

        // 事件处理--------------------
        $([_path.node, _arrow.node, _text.node]).bind('click', function () {
            if (!myflow.config.editable)
                return;
            $(_r).trigger('click', _this);
            $(_r).data('currNode', _this);
            return false;
        });

        // 处理点击事件，线或矩形
        var clickHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src && src.getId() == _id) {
                _dotList.show();
                documentObj = _r;
                modalsObj = _o;
                src_ = src;
                //myflow.click(e);
                clickState = 1;
                //实时保存每一步动作
                //$('#myflow_save')
                //	.trigger('click');
                //$(_r).trigger('showprops', [ _o.props, _this ]);
            } else {
                _dotList.hide();
            }

            var mod = $(_r).data('mod');
            switch (mod) {
                case 'pointer':

                    break;
                case 'path':

                    break;
            }

        };
        $(_r).bind('click', clickHandler);

        // 删除事件处理
        var removerectHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src
              && (src.getId() == _from.getId() || src.getId() == _to
                .getId())) {
                // _this.remove();
                $(_r).trigger('removepath', _this);
            }
        };
        $(_r).bind('removerect', removerectHandler);

        // 矩形移动时间处理
        var rectresizeHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (_from && _from.getId() == src.getId()) {
                var rp;
                if (_dotList.fromDot().right().right().type() == 'to') {
                    rp = {
                        x: _to.getBBox().x + _to.getBBox().width / 2,
                        y: _to.getBBox().y + _to.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.fromDot().right().right().pos();
                }
                var p = myflow.util.connPoint(_from.getBBox(), rp);
                _dotList.fromDot().moveTo(p.x, p.y);
                refreshpath();
            }
            if (_to && _to.getId() == src.getId()) {
                var rp;
                if (_dotList.toDot().left().left().type() == 'from') {
                    rp = {
                        x: _from.getBBox().x + _from.getBBox().width / 2,
                        y: _from.getBBox().y + _from.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.toDot().left().left().pos();
                }
                var p = myflow.util.connPoint(_to.getBBox(), rp);
                _dotList.toDot().moveTo(p.x, p.y);
                refreshpath();
            }
        };
        $(_r).bind('rectresize', rectresizeHandler);

        var textchangeHandler = function (e, v, src) {
            if (src.getId() == _id) {// 改变自身文本
                _text.attr({
                    text: v
                });
                _autoText = false;
            }
            // $('body').append('['+_autoText+','+_text.attr('text')+','+src.getId()+','+_to.getId()+']');
            if (_autoText) {
                if (_to.getId() == src.getId()) {
                    // $('body').append('change!!!');
                    _text.attr({
                        text: _o.text.patten.replace('{from}', _from.text())
                          .replace('{to}', v)
                    });
                } else if (_from.getId() == src.getId()) {
                    // $('body').append('change!!!');
                    _text.attr({
                        text: _o.text.patten.replace('{from}', v).replace(
                          '{to}', _to.text())
                    });
                }
            }
        };
        $(_r).bind('textchange', textchangeHandler);

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        this.dotList = function () {
            return _dotList;
        };
        // 转化json数据
        this.toJson = function () {
            var data = "{from:'" + _from.getId() + "',to:'" + _to.getId()
              + "', dots:" + _dotList.toJson() + ",text:{text:'"
              + _text.attr('text') + "',textPos:{x:"
              + Math.round(_textPos.x) + ",y:" + Math.round(_textPos.y)
              + "}}, props:{";
            //if(typeof (_o.props.btn)=="object"){
            //_o.props=propsObj
            //}
            //for (var z in propsObj){
            //	_o.props=propsObj[z];
            for (var i in propsObj) {
                if (i == _o.props.text.value) {
                    _o.props = propsObj[i]
                }
            }
            for (var k in _o.props) {
                if (_o.props[k].key == "" || _o.props[k].key) {
                    data += k + ":{value:'" + _o.props[k].value1 + "',key:'" + _o.props[k].key + "',operation:'" + _o.props[k].value + "'},";
                }
                if (k == 'text') {
                    data += k + ":{name:'" + _o.props[k].name + "'},";
                }
                if (k == 'default') {
                    data += k + ":{default:'" + _o.props[k].value + "'},";
                }
            }
            //}

            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += '}}';
            return data;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;

            _o = $.extend(true, _o, data);
            // $('body').append('['+_text.attr('text')+','+_o.text.text+']');
            if (_text.attr('text') != _o.text.text) {
                // $('body').append('['+_text.attr('text')+','+_o.text.text+']');
                _text.attr({
                    text: _o.text.text
                });
                _autoText = false;
            }

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
            _dotList.remove();
            _path.remove();
            _arrow.remove();
            _text.remove();
            try {
                $(_r).unbind('click', clickHandler);
            } catch (e) {
            }
            try {
                $(_r).unbind('removerect', removerectHandler);
            } catch (e) {
            }
            try {
                $(_r).unbind('rectresize', rectresizeHandler);
                ;
            } catch (e) {
            }
            try {
                $(_r).unbind('textchange', textchangeHandler);
            } catch (e) {
            }
        };
        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            _path.attr({
                path: p[0]
            });
            _arrow.attr({
                path: p[1]
            });
            _text.attr({
                x: mid.x + _textPos.x,
                y: mid.y + _textPos.y
            });
            // $('body').append('refresh.');
        }

        myflow.res = refreshpath;

        this.getId = function () {
            return _id;
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };

    };

    myflow.props = function (o, r) {
        var _this = this, _pdiv = $('#myflow_props').hide().draggable({
            handle: '#myflow_props_handle'
        }).resizable().css(myflow.config.props.attr).bind('click', function () {
            return false;
        }), _tb = _pdiv.find('table'), _r = r, _src;

        var showpropsHandler = function (e, props, src, Tevent) {
            if (clickState == 2) {
                myflow.config.path.attr.path.click(Tevent);
                //if(event){
                //
                //}
                if (_src && _src.getId() == src.getId()) {// 连续点击不刷新
                    return;
                }
                _src = src;
                //$(_tb).find('.editor').each(function() {
                //	var e = $(this).data('editor');
                //	if (e)
                //		e.destroy();
                //});
                _tb.empty();
                _pdiv.show();
                //if (props.btn && propsObj[props.text.value] != undefined) {
                //    props = propsObj[props.text.value]
                //}
                //for (var k in props) {
                //    _tb.append('<tr><th>' + props[k].label + '</th><td><div id="p'
                //        + k + '" class="editor"></div></td></tr>');
                //    if (props[k].editor)
                //        props[k].editor().init(props, k, 'p' + k, src, _r);
                //    //$('body').append(props[i].editor+'a');
                //}
            }

        };
        $(_r).bind('showprops', showpropsHandler);

    };


    // 属性编辑器
    myflow.editors = {
        textEditor: function () {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;
                var title = $('<input  style="width:100%;" autofocus="autofocus" required="required" />');
                title[0].value = src.text();
                if (props.text) {
                    props.text.value = title[0].value;
                }
                title.bind('input propertychange',
                  function () {
                      var text = 'text';
                      var value = 'value';
                      var textArray = getObjArray(textArray, propsObj, text);
                      var valueArray = getObjArray(valueArray, textArray, value);
                      if (valueArray.indexOf($(this).val()) != -1) {
                          alert('条件名不得有重复，请重写输入');
                          $(this).val($(this).val().substring(0, $(this).val().length - 1));
                          return false
                      }
                  }).appendTo('#' + _div);
                // $('body').append('aaaa');
                $(title).bind('change', function () {
                    props[_k].value = $(this).val();
                    $(_r).trigger('textchange',
                      [$(this).val(), _src]);
                    propsObj[props.text.value] = getPathProps(judge, propsObj[props.text.value], props);
                });
                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                    $(_r).trigger('textchange', [$(this).val(), _src]);
                });
                // $('body').append('destroy.');
            };
        }
    };
    // 所有矩形
    var allStates = {};
    // 所有路径
    var allPaths = {};
    // 初始化流程
    myflow.init = function (c, o) {
        var _w = $(window).width(), _h = $(window).height(), _r = Raphael(c,
          _w * 1.5, _h * 1.5), _states = {}, _paths = {};
        allStates = _states;
        allPaths = _paths;
        $.extend(true, myflow.config, o);

        /**
         * 删除： 删除状态时，触发removerect事件，连接在这个状态上当路径监听到这个事件，触发removepath删除自身；
         * 删除路径时，触发removepath事件
         */
        $(document).keydown(function (arg) {
            if (!myflow.config.editable)
                return;
            if (arg.keyCode == 46) {
                var c = $(_r).data('currNode');
                if (c) {
                    if (c.getId().substring(0, 4) == 'rect') {
                        $(_r).trigger('removerect', c);
                    } else if (c.getId().substring(0, 4) == 'path') {
                        $(_r).trigger('removepath', c);
                    }

                    $(_r).removeData('currNode');
                }
            }
            // alert(arg.keyCode);
        });

        $(document).click(function () {

            $(_r).data('currNode', null);
            $(_r).trigger('click', {
                getId: function () {
                    return '00000000';
                }
            });
            $(_r).trigger('showprops', [myflow.config.props.props, {
                getId: function () {
                    return '00000000';
                }
            }]);
        });

        // 删除事件
        var removeHandler = function (e, src) {
            if (!myflow.config.editable)
                return;
            if (src.getId().substring(0, 4) == 'rect') {
                _states[src.getId()] = null;
                src.remove();
            } else if (src.getId().substring(0, 4) == 'path') {
                delete allPaths[src.getId()];
                //_paths[src.getId()] = null;
                src.remove();
            }
        };
        $(_r).bind('removepath', removeHandler);
        $(_r).bind('removerect', removeHandler);

        // 添加状态
        $(_r).bind(
          'addrect',
          function (e, type, o, id) {
              // $('body').append(type+', ');r
              var rect = new myflow.rect($.extend(true, {},
                myflow.config.tools.states[type], o), _r, id)
              _states[rect.getId()] = rect;
          });
        // 添加路径
        var addpathHandler = function (e, from, to) {
            //判断连线，不能形成循环，又不能重复连线
            (function judgePath(allPaths,from,to){
                var judge=0;

                //禁止重复连线
                for (var ind in allPaths){
                    if(allPaths[ind].from().getId()==to.getId()){
                        if(allPaths[ind].to().getId()==from.getId()){
                            return false
                        }
                    }
                    if (allPaths[ind].to().getId()==to.getId()){
                        if(allPaths[ind].from().getId()==from.getId()){
                            return false
                        }
                    }
                }
                //禁止循环

                var pathTo=to.getId();
                var fromTo=from.getId();
                //利用递归，逐个获取连线节点的上级节点
                function bindLoops(allPaths,pathTo,fromTo){
                    var array=[];
                    for (var k in allPaths){
                        //每条path的from与to
                        var rectFrom=allPaths[k].from().getId();
                        var rectTo=allPaths[k].to().getId();
                        if (fromTo==rectTo) {
                            array.push(allPaths[k]);
                        }
                    }
                            for(var c in array){
                                if(array[c].from().getId()==pathTo){
                                    judge=1;
                                    return false
                                }else {
                                    fromTo=array[c].from().getId();
                                    bindLoops(allPaths,pathTo,fromTo)
                                }
                            }
                }
                bindLoops(allPaths,pathTo,fromTo);
                if(judge==0){
                    var path = new myflow.path({}, _r, from, to);
                    _paths[path.getId()] = path;
                }
            })(allPaths,from,to);



        };
        $(_r).bind('addpath', addpathHandler);

        // 模式
        $(_r).data('mod', 'point');
        if (myflow.config.editable) {
            // 工具栏
            $("#myflow_tools").draggable({
                handle: '#myflow_tools_handle'
            }).css(myflow.config.tools.attr);

            $('#myflow_tools .node').hover(function () {
                $(this).addClass('mover');
            }, function () {
                $(this).removeClass('mover');
            });
            //切换 指针和连线模式
            $('#myflow_tools .selectable').click(function () {
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                if ($(_r).data('mod') == this.id) {
                    $(_r).data('mod', 'pointer');
                    this.innerText = "开始连线"
                } else {
                    $(_r).data('mod', this.id);
                    this.innerText = "停止连线"
                }
                //( $(_r).data('mod')==this.id)?$(_r).data('mod','pointer'):$(_r).data('mod', this.id)
            });

            $('#myflow_tools .state').each(function () {
                $(this).draggable({
                    helper: 'clone'
                });
            });

            $(c).droppable(
              {
                  accept: '.state',
                  drop: function (event, ui) {
                      // console.log(ui.helper.context);
                      var id = ui.helper.context.innerText.trim();
                      $(_r).trigger('addrect',
                        [ui.helper.attr('type'), {
                            attr: {
                                x: ui.helper.offset().left,
                                y: ui.helper.offset().top
                            }
                        }, id]);
                      // $('body').append($(ui).attr('type')+'drop.');
                  }
              });

            $('#myflow_save')
              .click(
                function () {// 保存
                    var data = '{states:{';
                    for (var k in _states) {
                        if (_states[k]) {
                            data += _states[k].getId() + ':'
                              + _states[k].toJson() + ',';
                        }
                    }
                    if (data
                        .substring(data.length - 1, data.length) == ',')
                        data = data.substring(0, data.length - 1);
                    data += '},paths:{';
                    for (var k in _paths) {
                        if (_paths[k]) {
                            data += _paths[k].getId() + ':'
                              + _paths[k].toJson() + ',';
                        }
                    }
                    if (data
                        .substring(data.length - 1, data.length) == ',')
                        data = data.substring(0, data.length - 1);
                    data += '},props:{props:{';
                    for (var c in myflow.config.props.props) {
                        data += c + ":{value:'" + myflow.config.props.props[c].value + "'},"
                    }
                    if (data.substring(data.length - 1, data.length) == ",") {
                        data = data.substring(0, data.length - 1)
                    }
                    data += '}}}';

                    myflow.config.tools.save.onclick(data);
                    // alert(data);
                });
            $('#myflow_save').bind('save', function () {
                {// 保存
                    var data = '{states:{';
                    for (var k in _states) {
                        if (_states[k]) {
                            data += _states[k].getId() + ':'
                              + _states[k].toJson() + ',';
                        }
                    }
                    if (data
                        .substring(data.length - 1, data.length) == ',')
                        data = data.substring(0, data.length - 1);
                    data += '},paths:{';
                    for (var k in _paths) {
                        if (_paths[k]) {
                            data += _paths[k].getId() + ':'
                              + _paths[k].toJson() + ',';
                        }
                    }
                    if (data
                        .substring(data.length - 1, data.length) == ',')
                        data = data.substring(0, data.length - 1);
                    data += '},props:{props:{';
                    for (var c in myflow.config.props.props) {
                        data += c + ":{value:'" + myflow.config.props.props[c].value + "'},"
                    }
                    if (data.substring(data.length - 1, data.length) == ",") {
                        data = data.substring(0, data.length - 1)
                    }
                    data += '}}}';

                    svgData = data;
                    svgData = eval("(" + svgData + ")");
                    svgData.startCheckClass = myflow.config.path.props.text.startCheckClass;
                    svgData.startConditions = myflow.config.path.props.text.startConditions;
                    console.log(svgData);
                    var svgData1 = JSON.stringify(svgData);
                    svgData1 = JSON.parse(svgData1);
                    svgData1 = changeSvgData(svgData1);
                    var flowTable = getFlowData(modalData, svgData1, judge, flowData);
                    console.log(flowData);
                    var newData = {};
                    newData.svgData = svgData;
                    newData.flowData = flowData;
                    console.log(newData);
                    newData = JSON.stringify(newData);
                }
            });

            // 属性框
            new myflow.props({}, _r);
        }
        // 恢复
        if (o.restore) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = o.restore;
            var rmap = {};
            if (data.states) {
                for (var k in data.states) {
                    var rect = new myflow.rect($.extend(true, {},
                      myflow.config.tools.states[data.states[k].type],
                      data.states[k]), _r);
                    rect.restore(data.states[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                }
            }
            if (data.paths) {
                for (var k in data.paths) {
                    var p = new myflow.path($.extend(true, {},
                      myflow.config.tools.path, data.paths[k]), _r,
                      rmap[data.paths[k].from], rmap[data.paths[k].to]);
                    p.restore(data.paths[k]);
                    _paths[p.getId()] = p;
                }
            }
        }
        // 历史状态
        var hr = myflow.config.historyRects, ar = myflow.config.activeRects;
        if (hr.rects.length || ar.rects.length) {
            var pmap = {}, rmap = {};
            for (var pid in _paths) {// 先组织MAP
                if (!rmap[_paths[pid].from().text()]) {
                    rmap[_paths[pid].from().text()] = {
                        rect: _paths[pid].from(),
                        paths: {}
                    };
                }
                rmap[_paths[pid].from().text()].paths[_paths[pid].text()] = _paths[pid];
                if (!rmap[_paths[pid].to().text()]) {
                    rmap[_paths[pid].to().text()] = {
                        rect: _paths[pid].to(),
                        paths: {}
                    };
                }
            }
            for (var i = 0; i < hr.rects.length; i++) {
                if (rmap[hr.rects[i].name]) {
                    rmap[hr.rects[i].name].rect.attr(hr.rectAttr);
                }
                for (var j = 0; j < hr.rects[i].paths.length; j++) {
                    if (rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]) {
                        rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]
                          .attr(hr.pathAttr);
                    }
                }
            }
            for (var i = 0; i < ar.rects.length; i++) {
                if (rmap[ar.rects[i].name]) {
                    rmap[ar.rects[i].name].rect.attr(ar.rectAttr);
                }
                for (var j = 0; j < ar.rects[i].paths.length; j++) {
                    if (rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]) {
                        rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]
                          .attr(ar.pathAttr);
                    }
                }
            }
        }
    };

    // 添加jquery方法
    $.fn.myflow = function (o) {
        return this.each(function () {
            myflow.init(this, o);
        });
    };

    $.myflow = myflow;
})(jQuery);
if (localStorage.data) {
    $.myflow.config.path.props.text.startCheckClass = restoreData.startCheckClass;
    $.myflow.config.path.props.text.startConditions = restoreData.startConditions;}
