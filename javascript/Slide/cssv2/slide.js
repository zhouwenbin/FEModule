/**
 * to: image slide
 * depend: jQuery
 * author: f2er
**/

(function($){

	$.slideImage=function( ctg ){
		var opt= $.extend( {
			data:"burl",
			current:0,//默认第几张
			imgJson:{}
		},ctg || {});
	
		var _i=0,//第几张
			_index=0,//第几组
			_len=0,
			_maxScroll=10;//最大滚动数
			
		/**
		* Module
		**/
		
		var page={
			getWidth:function(){
				var _doc = document,
					_body = _doc.body,
					_html = _doc.documentElement,
					client = _doc.compatMode == 'BackCompat' ? _body : _doc.documentElement;
				return Math.max( _html.scrollWidth , _body.scrollWidth , client.clientWidth ); 
			},
			getHeight:function(){
				var _doc = document,
					_body = _doc.body,
					_html = _doc.documentElement,
					client = _doc.compatMode == 'BackCompat' ? _body : _doc.documentElement;
				return Math.max( _html.scrollHeight , _body.scrollHeight , client.clientHeight ); 
			},
			getViewWidth:function(){
				var _doc=document;
				client= _doc.compatMode == "BackCompat" ? _doc.body : _doc.documentElement;
				return client.clientWidth;
			},
			getViewHeight:function(){
				var _doc = document;
				client = _doc.compatMode == "BackCompat" ? _doc.body : _doc.documentElement;
				return client.clientHeight;
			}
		}
		
		//计算位置
		function pos(_w,o){
			var _win=$(window),
				_left=parseInt( _win.width()/2 )-parseInt( _w/2 ),
				_top=parseInt( _win.height()/2 )-parseInt( o.outerHeight()/2 );
			if( $.browser.msie&&$.browser.version<=6.0 ){
				var _sh = _win.scrollTop();
				o.css({position:"absolute",top:_top+_sh})	
			}else{
				o.css({position:"fixed",top:_top})	
			}
			o.css({left:_left});
		}
		
		//加载大图
		function loadingBigImage(url){
            var _img=new Image();
            loadImg(_img,url,function(){
                var _w=this.width,_h=this.height;
				var _obj=$("#mpop").find('img');
                _obj.attr('src',this.src);
				var _nWH=imgCompress(_w,_h,550,500);
				_obj.css({'width':_nWH._w+"px",'height':_nWH._h+"px"})
            });
		}
		
		//点击小图,大图转换
		function goTo(n){
			var _nimg=$("#part_dynamic img").eq(n),_url="";
			if( _nimg.attr(opt.data) ){
				_url=_nimg.attr(opt.data);
			}else{
				_url=_nimg.attr("src")	
			}
			loadingBigImage(_url);
			$("#part_dynamic li:eq("+n+")").siblings().removeClass('current').end().addClass('current');
		}

        //预加载图片
		function loadImg(obj,url,callback){
            if( $.browser.msie ){
				obj.onreadystatechange=function(){
					if(obj.readyState=="complete" || obj.readyState=="loaded" ){
						callback.call(obj);
					}
					obj.onreadystatechange=null;
				}
			}else{
				obj.onload=function(){
					if(obj.complete == true){
						callback.call(obj);
					}
					obj.onload=null;
				}
			}
			obj.src=url;
        }

        //小图片加载
        function preLoadImg(){
            for ( var i in opt.imgJson ){
				_img = new Image();
                var _sUrl= opt.imgJson[i].surl,_bUrl=opt.imgJson[i].burl;
				_img.index = i;
				_img.burl = _bUrl;
                loadImg( _img,_sUrl,function(){
					var _w=this.width,_h=this.height;
                    var _obj=$("#dynamic_box img").eq(this.index);
					_obj.attr({'src': this.src,'burl':this.burl});
                   if( this.index == opt.current ){
                       triggerInit();
                   }
				   var _nWH=imgCompress(_w,_h,46,46);
				   _obj.css({'width':_nWH._w+"px",'height':_nWH._h+"px"})
                });
            }
        }
		
		//首次触发
        function triggerInit(){
            var _currentLi=$("#dynamic_box li:eq("+ opt.current +")");
				_index=parseInt(opt.current / _maxScroll);
            var _url=_currentLi.find('img').attr('burl');
            _currentLi.siblings().removeClass('current').end().addClass('current');
            loadingBigImage(_url);
			scrollImg( _index );
        }
		
		//删除遮罩
		function deletePop(){
			$("#mask").remove();
			$("#slideShow").remove();
		}
		
		//组滚动
		function scrollImg(n){
			$("#dynamic_box").stop().animate({marginLeft : -60*n*_maxScroll+"px"},300)
		}
		
		//下一张
		function next(){
			if( _i%_maxScroll==0 ){
				$("#dynamic_box").stop().animate({marginLeft:-60*_i},300)	
			}
		}
		
		//上一张
		function prev(){
			if( (_i+1)%_maxScroll==0 ){
				$("#dynamic_box").stop().animate({marginLeft:-60*parseInt(_i/_maxScroll)*_maxScroll},300);
			}
		}
		
		//等比压缩
		function imgCompress(ow,oh,mw,mh){
			var _objWH={ _w:ow,_h:oh },
				rate = Math.max( _objWH._w / mw, _objWH._h / mh);
				_objWH._w = Math.min( _objWH._w / rate, _objWH._w );
				_objWH._h = Math.min( _objWH._h / rate,_objWH._h );
			return _objWH;
		}
		
		/**
		* View
		**/
		//创建弹窗
		function createWin(){
			var _mask='<div class="mask" id="mask"></div>';
			var _pop = '<div class="slideShow" id="slideShow">';
				_pop += '<div id="mbig" class="mbig"><div class="slide_left" id="slide_left"></div><div class="mpop" id="mpop"><div class="img_midcenter"><div class="img_box"><img src="images/loading.gif"/></div></div></div><span class="slide_right" title="下一张" id="slide_right"></span></div><div id="part_dynamic"><span id="left_btn" class="left_btn" title="向左"></span><div class="part_dbox" >';
				_pop += '<ul  class="part_dynamic clearfix" id="dynamic_box">';
				_pop += '</ul></div><span id="right_btn" class="right_btn"></span></div><span class="slide_close" title="关闭" id="slide_close">关闭</span>';
				_pop += '</div>';
				
			$(document.body).append(_mask);
			$(document.body).append( _pop );
			
			var _flagment=document.createDocumentFragment();
			for( var i = 0,len=opt.imgJson.length;i<len;i++){
				var _li=document.createElement('li');
				_li.className="img_midcenter";
				_li.innerHTML='<div class="img_sl"><img src="images/loading.gif"></div>';
				_flagment.appendChild(_li);
			}
			$("#dynamic_box").html(_flagment);
			var A = [ page.getViewWidth() , page.getViewHeight() , page.getWidth() , page.getHeight() ];
			$("#mask").css({ height:A[3],width:A[2] });
			$("#slideShow").css({"height":A[1]});
			
            _len=$("#part_dynamic li").size();
            $("#dynamic_box").css({ width:_len*60});
			preLoadImg();
		}

		
		/**
		* Control
		**/
		
		//小图片操作
		function smallScroll(){
			$("#part_dynamic li").each(function(n){
				$(this).click(function(e){
					_i= n;
					goTo.call( $(this),_i );
					$(this).siblings().removeClass('current').end().addClass('current');
                    var _url=$(this).find('img').attr('burl');
                    loadingBigImage(_url);
					e.stopPropagation();
				});	
			});
		}
		
		//向右
		function rightEvent(){
			$("#right_btn").click(function(e){
				if( _len % _maxScroll ==0 || _index >= parseInt( _len / _maxScroll) || _len <=_maxScroll){
					return;	
				}
				_index++;
				scrollImg(_index);
				e.stopPropagation();
			});
		}
		
		//向左
		function leftEvent(){
			$("#left_btn").click(function(e){
				if( _index<=0 ){ return; }
				_index--;
				scrollImg(_index);
				e.stopPropagation();
			});
		}

		//关闭函数
		function doClose(){
			/*点击关闭*/
			$("#slide_close").click(function(e){
				deletePop();		
				$("#mpop").unbind('click');							   
				e.stopPropagation();
				return false;
			});
        }
		
		//点击弹窗图片切换
        function switchPic(){
			$("#mbig").click(function(e){
				var mouseX=e.pageX;
				if( mouseX > (document.documentElement.clientWidth/2 || document.body.clientWidth/2) ){
					_i++;
					if( _i>=_len ){
						_i=0;	
						$("#dynamic_box").stop().animate({ marginLeft:0 },300)
					}	
					next();
					
				}else{
					_i--;
					if(_i<0){
						_i=_len-1;
						$("#dynamic_box").stop().animate({marginLeft:-60*parseInt(_i/_maxScroll)*_maxScroll},300)	
					}
					prev();
				}
				goTo(_i);
				e.stopPropagation()	
			});	
		}
			
		//初始化
		function Initialize( n ){
			deletePop();
			_i=n;
			createWin();
            smallScroll();
			if( _len <= _maxScroll ){
				$("#left_btn").hide();
				$("#right_btn").hide();
			}else{
				leftEvent();
				rightEvent();
			}
			switchPic();
			doClose();
			$(window).resize(function(){
				if( $("#mask").length>0 ){
					var B=[ page.getViewWidth(),page.getHeight() ];
					$("#mask").css({ height:B[1],width:B[0] });
				}
			})
		}
		Initialize( opt.current );
		
	}
})(jQuery);