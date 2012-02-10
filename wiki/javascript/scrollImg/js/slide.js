/**
 * to: image slide
 * depend: jQuery
 * author: f2er
**/

(function($){
	$.slideImage=function( ctg ){
		var opt= $.extend( {
			current:0,//默认第几张
			doHandle:"#js_dynamic_box",
			doItem:"li",
			maxScrollNum:5, //最多一次几张
			delay:300
		},ctg || {});
	
		var _i=0,//第几张
			_index=0,//第几组
			_len=0;
			
        function triggerInit(){
			var _item=$(opt.doHandle).find(opt.doItem),
		     	_currentLi=_item.eq(opt.current);
			_index=parseInt(opt.current / opt.maxScrollNum);
			_len=_item.size();
            $(opt.doHandle).css({ width:_len*90});
			scrollImg( _index );
        }
		
		//组滚动
		function scrollImg(n){
			$(opt.doHandle).stop().animate({marginLeft : -90*n*opt.maxScrollNum+"px"},opt.delay)
		}
		
		//向右
		function doRightEvent(){
			//最后一页
			$("#last_btn").click(function(e){
				if( _len >= opt.maxScrollNum ){
					_index=parseInt( _len / opt.maxScrollNum);
					$(opt.doHandle).stop().animate({marginLeft : -90*_index*opt.maxScrollNum+"px"},opt.delay);
				}
			});
			//后一页
			$("#next_btn").click(function(e){
				if( _len % opt.maxScrollNum ==0 || _index >= parseInt( _len / opt.maxScrollNum) || _len <=opt.maxScrollNum){
					return;	
				}
				_index++;
				scrollImg(_index);
				e.stopPropagation();
			});
		}
		
		//向左
		function doLeftEvent(){
			//前一页
			$("#pre_btn").click(function(e){
				if( _index<=0 ){ return; }
				_index--;
				scrollImg(_index);
				e.stopPropagation();
			});
			//第一页
			$("#first_btn").click(function(e){
				$(opt.doHandle).stop().animate({marginLeft : 0},opt.delay);
				_index=0;
			});
		}
			
		//初始化
		function Initialize( n ){
			_i=n;
			triggerInit();
			doLeftEvent();
			doRightEvent();
		}
		Initialize( opt.current );
	}
})(jQuery);
