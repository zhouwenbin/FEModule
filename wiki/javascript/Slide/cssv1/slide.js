/**
 * to: image slide
 * depend: jQuery
 * author: f2er
**/

(function($){

	$.slideImage=function( ctg ){
		var opt= $.extend( {
			data:"burl",
			current:0,//Ĭ�ϵڼ���
			imgJson:{}
		},ctg || {});
	
		var _i=0,//�ڼ���
			_index=0,//�ڼ���
			_len=0,
			_maxScroll=10;//��������
			
		/**
		* Module
		**/
		
		//��������
		function mask(){
			var _mask='<div class="mask" id="mask"></div>';
			$(document.body).append(_mask);
			var _mh=$(document).height();
			var _mw=$(window).width();
			$("#mask").css({height:_mh+"px",width:_mw+"px"});
		}
		
		//����λ��
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
		
		//���ش�ͼ
		function loadingBigImage(url){
            var _img=new Image();
            loadImg(_img,url,function(){
                var _w=this.width,_h=this.height;
				var _obj=$("#mpop").find('img');
                _obj.attr('src',this.src);
				var rate = Math.max(_w / 550, _h / 500);
				_w = Math.min(_w / rate, _w);
				_h = Math.min(_h / rate,_h);
				_obj.css({'width':_w+"px",'height':_h+"px"})
            });
		}
		
		//���Сͼ,��ͼת��
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

        //Ԥ����ͼƬ
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

        //СͼƬ����
        function preLoadImg(){
            for ( var i in opt.imgJson ){
				_img = new Image();
                var _sUrl= opt.imgJson[i].surl,_bUrl=opt.imgJson[i].burl;
				_img.index = i;
				_img.burl = _bUrl;
                loadImg( _img,_sUrl,function(){
                    var _obj=$("#dynamic_box img").eq(this.index);
					_obj.attr('src', this.src);
					_obj.attr('burl', this.burl);
                   if( this.index == opt.current ){
                       triggerInit();
                   }
					//imgReSize.resize({_id:"dynamic_box",_maxWidth:46,_maxHeight:46});
                });
            }
        }
		
		//�״δ���
        function triggerInit(){
            var _currentLi=$("#dynamic_box li:eq("+ opt.current +")");
            var _url=_currentLi.find('img').attr('burl');
            _currentLi.siblings().removeClass('current').end().addClass('current');
            loadingBigImage(_url);
        }
		
		//ɾ������
		function deletePop(){
			$("#mask").remove();
			$("#slideShow").remove();
		}
		
		//�����
		function scrollImg(n){
			$("#dynamic_box").stop().animate({marginLeft : -60*n*_maxScroll+"px"},300)
		}
		
		//��һ��
		function next(i){
			if( i%_maxScroll==0 ){
				$("#dynamic_box").stop().animate({marginLeft:-60*i},300)	
			}
		}
		
		//��һ��
		function prev(i){
			if( (i+1)%_maxScroll==0 ){
				$("#dynamic_box").stop().animate({marginLeft:-60*parseInt(i/_maxScroll)*_maxScroll},300);
			}
		}
		
		/**
		* View
		**/
		//��������
		function createWin(){
			var _pop = '<div class="slideShow" id="slideShow">';
				_pop += '<div id="mbig" class="mbig"><span class="slide_left" id="slide_left" title="��һ��"></span><div class="mpop" id="mpop"><div class="img_midcenter"><div class="img_box"><img src="http://test.photo.img4399.com:8080/images/album/loading.gif"/></div></div></div><span class="slide_right" title="��һ��" id="slide_right"></span></div><div id="part_dynamic"><span id="left_btn" class="left_btn" title="����"></span><div class="part_dbox" >';
				_pop += '<ul  class="part_dynamic clearfix" id="dynamic_box">';
				_pop+='</ul></div><span id="right_btn" class="right_btn" title="����"></span></div><span class="slide_close" title="�ر�">�ر�</span>';
				_pop+='</div>';
			$(document.body).append( _pop );
			
			var _flagment=document.createDocumentFragment();
			for( var i = 0,len=opt.imgJson.length;i<len;i++){
				var _li=document.createElement('li');
				_li.innerHTML='<div class="img_midcenter"><div class="img_sl"><img src="http://test.photo.img4399.com:8080/images/album/loading.gif"></div></div>';
				_flagment.appendChild(_li);
			}
			$("#dynamic_box").html(_flagment);
			var _docHeight=$(window).height();
			$("#slideShow").css("height",_docHeight+"px");
			preLoadImg();
            _len=$("#part_dynamic li").size();
            $("#dynamic_box").css({ width:_len*60});
		}

		
		/**
		* Control
		**/
		
		//СͼƬ����
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
		

		//����
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
		
		//����
		function leftEvent(){
			$("#left_btn").click(function(e){
				if( _index<=0 ){ return; }
				_index--;
				scrollImg(_index);
				e.stopPropagation();
			});
		}

		//�رպ���
		function doClose(){
			/*����ر�*/
			$("#slideShow").find(".slide_close").click(function(e){
				deletePop();		
				$("#mpop").unbind('click');							   
				e.stopPropagation();
				return false;
			});
        }
		
		//�������ͼƬ�л�
        function switchPic(){
			
            $("#mbig").mousemove(function(e){
                var posX=e.pageX;
                if( posX > document.documentElement.clientWidth/2 ){
                     $("#slideShow .slide_left").css("display",'none');
                     $("#slideShow .slide_right").css("display",'block');
                }else{
                   $("#slideShow .slide_left").css("display",'block');
                   $("#slideShow .slide_right").css("display",'none');
                }
            }).click(function(e){
				var mouseX=e.pageX;
				if( mouseX > (document.documentElement.clientWidth/2 || document.body.clientWidth/2) ){
					_i++;
					if( _i>=_len ){
						_i=0;	
						$("#dynamic_box").stop().animate({ marginLeft:0},300)
					}	
					next(_i);
				}else{
					_i--;
					if(_i<0){
						_i=_len-1;
						$("#dynamic_box").stop().animate({marginLeft:-60*parseInt(_i/_maxScroll)*_maxScroll},300)	
					}
					prev(_i);
				}
				goTo(_i);
				e.stopPropagation()	
				
			});	
		}
			
		//��ʼ��
		function Initialize( n ){
			deletePop();
			mask();
			_i=n;
			createWin();
            smallScroll();
			if( _len < _maxScroll ){
				$("#left_btn").hide();
				$("#right_btn").hide();
			}else{
				leftEvent();
				rightEvent();
			}
			switchPic();
			doClose();
			$(window).resize(function(){
				var _mh=$(document).height();
				var _mw=$(window).width();
				$("#mask").css({height:_mh+"px",width:_mw+"px"});
			})
		}
		
		Initialize( opt.current );
	}
})(jQuery);