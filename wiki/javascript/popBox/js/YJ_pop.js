/*
 * time:11-07-25
 * to:弹窗
 * version:V1
 * author:f2er
*/
(function($){
	var _timer=null,
		_t=null,
		_opt=null;
	//$.fn.YJ_popbox
	$.fn.YJ_popbox=function(ctg){
		_opt=$.extend({
			title:"标题",
			boxStyle:1,//1:框架,0:无框架	
			content:"内容",
			mask:true,//true:有遮罩,false:无遮罩
			setPositon:"middle",//middle:居中,对象:跟随目标对象位置
			width:"auto",//宽度
			height:"auto",//高度
			setOffset:{ofx:0,ofy:0},//偏移量
			timer:0,//定时器
			doClose:function(){},
			doOk:function(){},
			container:window
		},ctg ||{});
		return this.each(function(){
			$.fn.YJ_popbox.pbox.call(this,_opt).init();
		});
	};
	//关闭操作
	$.fn.YJ_popbox.Close=function(){
		//关闭
		function setClose(callback){
			if($("#loadingMask").length > 0){
				$("#loadingMask").remove();	
			}
			$("#YJ_pop").remove();
			//关闭弹窗
			if(typeof callback=="function"){
				callback();
			}
			unbindDo();	
		}
		//解除绑定
		function unbindDo(){
			$(window).unbind('scroll resize');
			clearTimeout(_timer);
			clearTimeout(_t);
		}
		return {
			unClose:setClose,
			unbind:unbindDo
		}	
	};
	
	//确定操作
	$.fn.YJ_popbox.OK=function(){
		//确定回调
		function setOk(callback){
			if(Object.prototype.toString.call(callback)=="[object Function]"){
				callback();
			}
		}
		return {
			dook:setOk
		}
	};

    

	//初始化弹窗
	$.fn.YJ_popbox.pbox=function(_opt){
		
		//判断IE版本
		function fuckIE(){
			return ($.browser.msie && $.browser.version==6) ? true :false;
		}
		
		//遮罩
		function mask(){
			var wnd=$(window),doc=$(document);
			var _maskH=0;
			if(wnd.height()>doc.height()){
				_maskH = wnd.height();  	
			}else{
				_maskH = doc.height(); 	
			}
			$("<div class='loadingMask' id='loadingMask'></div>").appendTo("body");
			$("#loadingMask").css({width:wnd.width(),height:_maskH});	
		}
		//模板
		function tpl(){
			var _tpl;
			if(_opt.mask){
				mask();
			}
			_tpl='<div class="popupmenu_popup" id="YJ_pop" style="width:'+_opt.width+';height:'+_opt.height+'">';
			_tpl+='<div class="pop_shadow"><div class="pop_content"><div class="pop_inner"><div class="popupmenu_option clearfix">';
			if(_opt.boxStyle){
				_tpl+='<div class="pop_tbox"><div class="hd">'+_opt.title+'<a href="javascript:void(0)" title="关闭" class="YJ_CLOSE">关闭</a></div>';
				_tpl+='<div class="bd" id="YJ_con"></div>';
				_tpl+='</div>';
			}else{
				_tpl+='<div class="bd" id="YJ_con"></div>';	
			}
			_tpl+='</div></div></div></div></div>';	
			$(_tpl).appendTo("body");
			getData(_opt.content);
			setPostion("#YJ_pop");		
		}
		
		//获取数据
		function getData(){
			var _result=Object.prototype.toString.call(_opt.content);
			switch(_result){
				case "[object Function]":
					getObject(_opt.content);	
					break;
				case "[object String]":
					var _string=_opt.content;
					$("#YJ_con").html(_string);
					break;
			}	
		}
		//获取字符串
		function doData(str){
			$("#YJ_con").html(str);	
		}
		//获取对象数据
		function getObject(callback){
			var _x="";
			if(typeof callback == "function"){
				_x=callback(doData);
			}	
		}
		//位置
		function setPostion(obj){
			var _position=Object.prototype.toString.call(_opt.setPositon);
			var _obj=(obj instanceof Object) ? obj : $(obj);
			var _w=_obj.outerWidth(),_h=_obj.outerHeight();
			var screenwidth = $(window).width(),
				screenheight = $(window).height(),
				scrTop=$(document).scrollTop(),
				_top=(screenheight-_h)/2,
				_left=(screenwidth-_w)/2;
				
				//位置:居中、右下角
				if(_position=="[object String]"){
					switch(_opt.setPositon){
						//居中
						case "middle":
							if(fuckIE()){
								_obj.css({"position":"absolute","top":_top+scrTop,"left":_left});	
							}else{
								_obj.css({"position":"fixed","top":_top,"left":_left});	
							}
							break;
						//右下角
						case "rightBottom":
							if(fuckIE()){
								_obj.css({"position":"absolute","top":scrTop+(screenheight-_h),"left":screenwidth-_w});	
							}else{
								_obj.css({"position":"fixed","bottom":0,"right":0});
							}	
						}
				}else if(_position=="[object Object]"){
					_obj.css({"position":"absolute"});
					//超出右边界
					var _cw=$(_opt.container).width(),_ch=$(_opt.container).height(),_bw=$("body").width(),_bh=$("body").height();
					var _offsetLeft=_opt.setPositon.offset().left,_offsetTop=_opt.setPositon.offset().top;
					var _scrollTop=$(document).scrollTop();
					var _marginLeft=(_bw-_cw)/2;
					//超出右边界
					if(_offsetLeft-_marginLeft+_w>_cw){
						_obj.css({"left":_cw-_w+_marginLeft+_opt.setOffset.ofx+$(document).scrollLeft()});		
					}else{
						_obj.css({"left":_offsetLeft+_opt.setOffset.ofx});	
					}
					_obj.css({'top':_offsetTop-_h+_opt.setOffset.ofy});
				}
			}
		//初始化
		function init(){
			$.fn.YJ_popbox.Close().unbind();
			if( $("#YJ_pop").html()==null ){
				tpl();//添加模板
			}else{
				$("#YJ_pop").remove();
				tpl();
			}	
			//点击YJ_CLOSE关闭
			$(".YJ_CLOSE").click(function(e){
				$.fn.YJ_popbox.Close().unClose(_opt.doClose);
				e.stopPropagation();
			});
			
			//点击确定按钮关闭
			if( $(".YJ_OK").length > 0 ){
				$(".YJ_OK").click(function(){
					$.fn.YJ_popbox.OK().dook(_opt.doOk);
				})
			}
			
			//定时关闭
			if(_opt.timer!=0){
				_timer=setTimeout(function(){
					$.fn.YJ_popbox.OK().dook(_opt.doOk);
				},_opt.timer);			
			}
			
			$(window).bind('resize scroll',function(){
				_t=setTimeout(function(){
					setPostion("#YJ_pop");
				},50)
			})
			
			
		}
		return {
			init:init	
		}			
	}
})(jQuery);