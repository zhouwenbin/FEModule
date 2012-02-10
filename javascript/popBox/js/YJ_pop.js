/*
 * time:11-07-25
 * to:����
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
			title:"����",
			boxStyle:1,//1:���,0:�޿��	
			content:"����",
			mask:true,//true:������,false:������
			setPositon:"middle",//middle:����,����:����Ŀ�����λ��
			width:"auto",//���
			height:"auto",//�߶�
			setOffset:{ofx:0,ofy:0},//ƫ����
			timer:0,//��ʱ��
			doClose:function(){},
			doOk:function(){},
			container:window
		},ctg ||{});
		return this.each(function(){
			$.fn.YJ_popbox.pbox.call(this,_opt).init();
		});
	};
	//�رղ���
	$.fn.YJ_popbox.Close=function(){
		//�ر�
		function setClose(callback){
			if($("#loadingMask").length > 0){
				$("#loadingMask").remove();	
			}
			$("#YJ_pop").remove();
			//�رյ���
			if(typeof callback=="function"){
				callback();
			}
			unbindDo();	
		}
		//�����
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
	
	//ȷ������
	$.fn.YJ_popbox.OK=function(){
		//ȷ���ص�
		function setOk(callback){
			if(Object.prototype.toString.call(callback)=="[object Function]"){
				callback();
			}
		}
		return {
			dook:setOk
		}
	};

    

	//��ʼ������
	$.fn.YJ_popbox.pbox=function(_opt){
		
		//�ж�IE�汾
		function fuckIE(){
			return ($.browser.msie && $.browser.version==6) ? true :false;
		}
		
		//����
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
		//ģ��
		function tpl(){
			var _tpl;
			if(_opt.mask){
				mask();
			}
			_tpl='<div class="popupmenu_popup" id="YJ_pop" style="width:'+_opt.width+';height:'+_opt.height+'">';
			_tpl+='<div class="pop_shadow"><div class="pop_content"><div class="pop_inner"><div class="popupmenu_option clearfix">';
			if(_opt.boxStyle){
				_tpl+='<div class="pop_tbox"><div class="hd">'+_opt.title+'<a href="javascript:void(0)" title="�ر�" class="YJ_CLOSE">�ر�</a></div>';
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
		
		//��ȡ����
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
		//��ȡ�ַ���
		function doData(str){
			$("#YJ_con").html(str);	
		}
		//��ȡ��������
		function getObject(callback){
			var _x="";
			if(typeof callback == "function"){
				_x=callback(doData);
			}	
		}
		//λ��
		function setPostion(obj){
			var _position=Object.prototype.toString.call(_opt.setPositon);
			var _obj=(obj instanceof Object) ? obj : $(obj);
			var _w=_obj.outerWidth(),_h=_obj.outerHeight();
			var screenwidth = $(window).width(),
				screenheight = $(window).height(),
				scrTop=$(document).scrollTop(),
				_top=(screenheight-_h)/2,
				_left=(screenwidth-_w)/2;
				
				//λ��:���С����½�
				if(_position=="[object String]"){
					switch(_opt.setPositon){
						//����
						case "middle":
							if(fuckIE()){
								_obj.css({"position":"absolute","top":_top+scrTop,"left":_left});	
							}else{
								_obj.css({"position":"fixed","top":_top,"left":_left});	
							}
							break;
						//���½�
						case "rightBottom":
							if(fuckIE()){
								_obj.css({"position":"absolute","top":scrTop+(screenheight-_h),"left":screenwidth-_w});	
							}else{
								_obj.css({"position":"fixed","bottom":0,"right":0});
							}	
						}
				}else if(_position=="[object Object]"){
					_obj.css({"position":"absolute"});
					//�����ұ߽�
					var _cw=$(_opt.container).width(),_ch=$(_opt.container).height(),_bw=$("body").width(),_bh=$("body").height();
					var _offsetLeft=_opt.setPositon.offset().left,_offsetTop=_opt.setPositon.offset().top;
					var _scrollTop=$(document).scrollTop();
					var _marginLeft=(_bw-_cw)/2;
					//�����ұ߽�
					if(_offsetLeft-_marginLeft+_w>_cw){
						_obj.css({"left":_cw-_w+_marginLeft+_opt.setOffset.ofx+$(document).scrollLeft()});		
					}else{
						_obj.css({"left":_offsetLeft+_opt.setOffset.ofx});	
					}
					_obj.css({'top':_offsetTop-_h+_opt.setOffset.ofy});
				}
			}
		//��ʼ��
		function init(){
			$.fn.YJ_popbox.Close().unbind();
			if( $("#YJ_pop").html()==null ){
				tpl();//���ģ��
			}else{
				$("#YJ_pop").remove();
				tpl();
			}	
			//���YJ_CLOSE�ر�
			$(".YJ_CLOSE").click(function(e){
				$.fn.YJ_popbox.Close().unClose(_opt.doClose);
				e.stopPropagation();
			});
			
			//���ȷ����ť�ر�
			if( $(".YJ_OK").length > 0 ){
				$(".YJ_OK").click(function(){
					$.fn.YJ_popbox.OK().dook(_opt.doOk);
				})
			}
			
			//��ʱ�ر�
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