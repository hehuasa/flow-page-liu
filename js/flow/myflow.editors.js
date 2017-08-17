var judge=["大于","小于"];
	var sideBarList=getSideBarList(modalData);
	createSideBarList(sideBarList,modalData);
	(function($){
		var myflow = $.myflow;

		$.extend(true, myflow.editors, {
			btnEditor : function(){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					$('<button class="btn btn-primary">增加</button>')
						.appendTo('#'+_div);
					$('<button class="btn btn-primary">删除</button>')
						.appendTo('#'+_div);
					//添加点击事件
					$('#'+_div+'>*').bind('click',function(event){
						var _tb=$('#'+_div).parent().parent().parent();
						if(event.target.innerHTML=='增加'){
							if(!props.param1){
								props.param1='add';
							}
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props,event);
							showprops(propsObj[props.text.value],_src,_r,_tb);
							//myflow.config.path.attr.path["stroke-width"]=8
						}else {
							var arr=Object.keys(propsObj[props.text.value]);
							if(arr.length>3){
								for (var i in propsObj[props.text.value]){
									if(i==arr[arr.length-2]){
										delete propsObj[props.text.value][i]
									}
								}
							}
							showprops(propsObj[props.text.value],_src,_r,_tb)
						}

					});
					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				}
			},
			inputEditor : function(){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					$('<input style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);

					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				}
			},
			inputNumEditor : function(){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					$('<input type="number" style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
					}).appendTo('#'+_div);

					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				}
			},
			radioEditor : function(arg){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					var sle = $('<select  style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						if(getArrayIndex(arg,props[_k].value)==2){
							$('<input type="number" id="time" style="width: 100%;margin-top: 5px">').val(props[_k].time).change(function(){
								props[_k].time = $(this).val();
							}).appendTo('#'+_div);
						}else {
							$('#'+_div+' input').remove()
						}
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);
					if(typeof arg === 'string'){
						//静态环境，暂时不需要访问后台
						// $.ajax({
						// type: "GET",
						// url: arg,
						// success: function(data){
						// var opts = eval(data);
						// if(opts && opts.length){
						// for(var idx=0; idx<opts.length; idx++){
						// sle.append('<option value="'+opts[idx].value+'">'+opts[idx].name+'</option>');
						// }
						// sle.val(_props[_k].value);
						// }
						// }
						// });

					}	for(var idx=0; idx<arg.length; idx++){
						sle.append('<option>'+arg[idx]+'</option>');
					}
					sle.val(_props[_k].value);

					$('#'+_div).data('editor', this);
					if(getArrayIndex(arg,props[_k].value)==2){
						$('<input type="number" style="width: 100%;margin-top: 5px">').val(props[_k].time).change(function(){
							props[_k].time = $(this).val();
						}).appendTo('#'+_div);
					}
				};
				this.destroy = function(){
					$('#'+_div+' select').each(function(){
						_props[_k].value = $(this).val();
					});
				};
			},
			operationEditor : function(arg){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					var sle = $('<select  style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						if ($(this).val()=='手动输入'){
							$('#'+_div).empty();
							props[_k].value='';
							var sle = $('<input  style="width:100%;" placeholder="请手动输入"/>').val(props[_k].value).change(function(){
								props[_k].value = $(this).val();
								if(props.text){
									propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
								}
							}).appendTo('#'+_div);
							$('<input type="test"  style="width: 100%;margin-top: 5px" placeholder="值">').val(props[_k].key).change(function(){
								props[_k].key = $(this).val();
								if(props.text){
									propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
								}
							}).prependTo('#'+_div);
							$('<input type="test"  style="width: 100%;margin-top: 5px"  placeholder="范围">').val(props[_k].value1).change(function(){
								props[_k].value1 = $(this).val();
								if(props.text){
									propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
								}
							}).appendTo('#'+_div);

						}
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);
					$('<input type="test"  style="width: 100%;margin-top: 5px" placeholder="值">').val(props[_k].key).change(function(){
						props[_k].key = $(this).val();
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).prependTo('#'+_div);
					$('<input type="test"  style="width: 100%;margin-top: 5px"  placeholder="范围">').val(props[_k].value1).change(function(){
						props[_k].value1 = $(this).val();
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);
					if(typeof arg === 'string'){
						//静态环境，暂时不需要访问后台
						// $.ajax({
						// type: "GET",
						// url: arg,
						// success: function(data){
						// var opts = eval(data);
						// if(opts && opts.length){
						// for(var idx=0; idx<opts.length; idx++){
						// sle.append('<option value="'+opts[idx].value+'">'+opts[idx].name+'</option>');
						// }
						// sle.val(_props[_k].value);
						// }
						// }
						// });

					}

					//for(var idx=0; idx<arg.length; idx++){
					//	sle.append('<option>'+arg[idx]+'</option>');
					//}
					if(sle){
						for(var idx in arg){
							sle.append('<option>'+arg[idx]+'</option>');
						}
						sle.val(_props[_k].value);
					}


					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' select').each(function(){
						_props[_k].value = $(this).val();
					});
				};
			},
			textAreaEditor : function(){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;

					$('<textarea rows="3" cols="20" style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);

					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				}
			},
			selectEditor : function(arg){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					var sle = $('<select  style="width:100%;"/>').val(props[_k].value).change(function(){
						props[_k].value = $(this).val();
						if(props.text){
							propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
						}
					}).appendTo('#'+_div);

					if(typeof arg === 'string'){
						//静态环境，暂时不需要访问后台
						// $.ajax({
						// type: "GET",
						// url: arg,
						// success: function(data){
						// var opts = eval(data);
						// if(opts && opts.length){
						// for(var idx=0; idx<opts.length; idx++){
						// sle.append('<option value="'+opts[idx].value+'">'+opts[idx].name+'</option>');
						// }
						// sle.val(_props[_k].value);
						// }
						// }
						// });
					}
					for(var idx=0; idx<arg.length; idx++){
						sle.append('<option>'+arg[idx]+'</option>');
					}
					sle.val(_props[_k].value);
					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				};
			},
			check_boxEdition: function(arg){
				var _props,_k,_div,_src,_r;
				this.init = function(props, k, div, src, r){
					_props=props; _k=k; _div=div; _src=src; _r=r;
					//$('<div style="width:100%;"/>').val(props[_k].value).change(function(){
					//	props[_k].value = $(this).val();
					//	if(props.text){
					//		propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
					//	}
					//}).appendTo('#'+_div);
					//添加模态框及编辑按钮
					$('<button class="btn btn-primary" data-toggle="modal" data-target="#POPUP_BOX">编辑</button>').appendTo('#'+_div);
					$('#'+_div+'>button').bind('click',function(event){
						propsBoxId=event.target.nextSibling;
                        createCheckBox(arg,$('#POPUP_BOXLabel'));
						$('#POPUP_BOX').modal(
							{backdrop:false}
						)
					});


                    //渲染选中数据的div
                    $('<div id="box'+_div+'" style="display: block"></div>').appendTo('#'+_div);
					$('#'+_div).data('editor', this);
				};
				this.destroy = function(){
					$('#'+_div+' input').each(function(){
						_props[_k].value = $(this).val();
					});
				}
			},
		    treesDataEditor:function(arg){
			  var _props,_k,_div,_src,_r;
			  this.init = function(props, k, div, src, r){
				_props=props; _k=k; _div=div; _src=src; _r=r;
				//$('<div style="width:100%;"/>').val(props[_k].value).change(function(){
				//	props[_k].value = $(this).val();
				//	if(props.text){
				//		propsObj[props.text.value]=getPathProps(judge,propsObj[props.text.value],props);
				//	}
				//}).appendTo('#'+_div);
				//添加模态框及编辑按钮
				$('<button class="btn btn-primary" data-toggle="modal" data-target="#POPUP_BOX">编辑</button>').appendTo('#'+_div);
				$('#'+_div+'>button').bind('click',function(event){
				  propsBoxId=event.target.nextSibling;
				  createCheckBox(arg,$('#POPUP_BOXLabel'));
				  $('#POPUP_BOX').modal(
					{backdrop:false}
				  )
				});


				//渲染选中数据的div
				$('<div id="box'+_div+'" style="display: block"></div>').appendTo('#'+_div);
				$('#'+_div).data('editor', this);
			  };
			  this.destroy = function(){
				$('#'+_div+' input').each(function(){
				  _props[_k].value = $(this).val();
				});
			  }
			},
		});

	})(jQuery);
	pathProps=getPathProps(judge,pathProps);
	(function($){
		var myflow = $.myflow;
		for(var i in myflow.config.path){
			$(myflow.config.path[i]).bind('click',function(){
				alert(123)
			});
		}

		$.extend(true,myflow.config.rect,{
			attr : {
				r : 8,
				fill : '#F6F7FF',
				stroke : '#03689A',
				"stroke-width" : 1
			}
		});
		$.extend(true,myflow.config.props.props,{
			name : {name:'name', label:'名称', value:'新建流程', editor:function(){return new myflow.editors.inputEditor();}},
			//key : {name:'key', label:'标识', value:'', editor : function(){return new myflow.editors.inputEditor();}},
			//level : {name:'level', label:'级别', value:'1', editor: function(){return new myflow.editors.selectEditor('flowLevel');}},
			desc : {name:'desc', label:'描述', value:'', editor:function(){return new myflow.editors.inputEditor();}}
		});

		$.extend(true,myflow.config.tools.states,
			attribute
		);
	})(jQuery);
	$(function() {
		$('#myflow').myflow({
			basePath : "",
			<!--<%&#45;&#45;restore : eval(${sourceJson }),&#45;&#45;%>-->
			restore : restoreData,
			// restore : eval(
			//
			//	 {
			//		 states: {
			//			 rect1:{type:'0',category:0,text:{text:'开始'}, attr:{ x:428, y:10, width:64, height:37}, props:{text:{value:'开始'},param1:{value:''},param2:{value:'1'}}},
			//			 rect2:{type:'0',category:0,text:{text:'结束'}, attr:{ x:725, y:369, width:60, height:44}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:'1'}}},
			//			 rect3:{type:'0',category:1,text:{text:'火灾报警'}, attr:{ x:239, y:272, width:100, height:50}, props:{text:{value:'火灾报警'},param1:{value:'0'},param2:{value:'0'},param3:{value:'0'},isauto:{value:'1'}}},
			//			 rect4:{type:'0',category:0,text:{text:'报警类型判断'}, attr:{ x:410, y:163, width:98, height:40}, props:{text:{value:'报警类型判断'},param1:{value:''}}},
			//			 rect5:{type:'0',category:1,text:{text:'接收设备报警'}, attr:{ x:408, y:78, width:100, height:50}, props:{text:{value:'接收设备报警'},param1:{value:'0'},param2:{value:'0'},param3:{value:'0'},isauto:{value:'1'}}},
			//			 rect6:{type:'0',category:1,text:{text:'有毒气体报警'}, attr:{ x:407, y:277, width:100, height:50}, props:{text:{value:'有毒气体报警'},param1:{value:'0'},param2:{value:'0'},param3:{value:'0'},isauto:{value:'1'}}},
			//			 rect7:{type:'0',category:1,text:{text:'周界报警'}, attr:{ x:574, y:272, width:100, height:50}, props:{text:{value:'周界报警'},param1:{value:'0'},param2:{value:'0'},param3:{value:'0'},isauto:{value:'1'}}},
			//			 rect8:{type:'0',category:1,text:{text:'应急广播'}, attr:{ x:402, y:531, width:100, height:50}, props:{text:{value:'应急广播'},param1:{value:'0'},param2:{value:''},param3:{value:''},isauto:{value:'1'}}},
			//			 rect9:{type:'0',category:1,text:{text:'打开逃生门'}, attr:{ x:565, y:529, width:100, height:50}, props:{text:{value:'打开逃生门'},param1:{value:'0'},param2:{value:''},param3:{value:''},isauto:{value:'1'}}},
			//			 rect10:{type:'0',category:1,text:{text:'视频联动'}, attr:{ x:405, y:366, width:100, height:50}, props:{text:{value:'视频联动'},param1:{value:'0'},param2:{value:''},param3:{value:''},isauto:{value:'1'}}},
			//			 rect11:{type:'0',category:1,text:{text:'视频联动'}, attr:{ x:572, y:364, width:100, height:50}, props:{text:{value:'视频联动'},param1:{value:'0'},param2:{value:''},param3:{value:''},isauto:{value:'1'}}},
			//			 rect12:{type:'0',category:1,text:{text:'发送短信'}, attr:{ x:404, y:449, width:100, height:50}, props:{text:{value:'发送短信'}}},
			//			 rect13:{type:'0',category:0,text:{text:'结束'}, attr:{ x:721, y:532, width:63, height:43}, props:{text:{value:'结束'},temp1:{value:''},temp2:{value:'1'}}}},
			//		 paths:{path14:{from:'rect3',to:'rect10', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path15:{from:'rect6',to:'rect10', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path16:{from:'rect10',to:'rect12', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path17:{from:'rect7',to:'rect11', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path18:{from:'rect1',to:'rect5', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path19:{from:'rect5',to:'rect4', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path20:{from:'rect4',to:'rect6', dots:[],text:{text:'是有毒气体报警'},textPos:{x:0,y:2}, props:{text:{value:'是有毒气体报警'}}},path21:{from:'rect4',to:'rect3', dots:[],text:{text:'是火灾报警'},textPos:{x:-11,y:5}, props:{text:{value:'是火灾报警'}}},path22:{from:'rect12',to:'rect8', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path23:{from:'rect8',to:'rect9', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path24:{from:'rect11',to:'rect2', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path25:{from:'rect9',to:'rect13', dots:[],text:{text:''},textPos:{x:0,y:-10}, props:{text:{value:''}}},path26:{from:'rect4',to:'rect7', dots:[],text:{text:'是周界报警'},textPos:{x:15,y:5}, props:{text:{value:'是周界报警'}}}},props:{props:{name:{value:'新建流程'},key:{value:''},level:{value:'1'},desc:{value:''}}}}),
			tools : {
				save : {
					onclick : function(data) {
						if($('#flowName').val()==''){
							alert('请定义流程名');
							return false
						}
						svgData=data;
						svgData=eval("("+svgData+")");
						console.log(svgData);
						var svgData1=JSON.stringify(svgData);
						svgData1=JSON.parse(svgData1);
						svgData1=changeSvgData(svgData1);
						//var states='states';
						//var paths='paths';
						//var props='props';
						//var from='from';
						//if(defaultingJude(svgData,states,paths,props,from)){
								var	flowTable=getFlowData(modalData,svgData1,judge,flowData);
								console.log(flowData);
								var newData={};
								newData.svgData=svgData;
								newData.flowData=flowData;
								console.log(newData);
								newData=JSON.stringify(newData);
						if(localStorage.data==""){
							$.post(saveUrl1,newData,function(res,a){
								if (res.status.success=="OK"){
									alert("保存成功");
									window.location.href='index.html'
								}else {
									alert(res.status.errorMsg);
								}
							});
						}else {
							$.post(updateFlowUrl,newData,function(res,a){
								if (res.status.success=="OK"){
									alert("修改成功");
									window.location.href='index.html'
								}else {
									alert(res.status.errorMsg);
								}
							});
						}

						//}
					}
				}
			}
		});
	});

