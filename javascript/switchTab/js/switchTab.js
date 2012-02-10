/**
  * to:tab切换效果
  * author:f2er
  * time:11-12-27
**/
function switchTab(ctg){
		this._option={
				_handle:ctg.handleId,
				_body:ctg.contentId,
				_event:ctg.eventType,
				_tag:ctg.tagName,
				_classname:ctg.classname
			};
		if( !(this instanceof switchTab)){
			return new switchTab(ctg);	
		}
		this.init();	
	}
	switchTab.prototype={
		_$:function(id){
			return typeof id ==="string" ? document.getElementById(id):id;	
		},
		on:function(element,otype,fn){
			if( element.addEventListener){
				element.addEventListener(otype,fn,false);	
			}else if( element.attachEvent){
				element.attachEvent('on'+otype,fn);	
			}else{
				element['on'+otype]=fn;	
			}
		},
		getElementsByClassName:function(tag,classname,root){
			var that=this;
			var _root= root ? that._$( root ) : document;
			var _tag= tag ? tag : "*";
			var _elementArray=[];
			var _ele=_root.getElementsByTagName(_tag);
			for( var i=0,_len=_ele.length; i<_len; i++){
				var _current=_ele[i].className;
				if( _current == classname ){
					_elementArray.push(_ele[i]);
				}
			}
			return _elementArray;
		},
		index:function(target,obj){
			var li=obj.getElementsByTagName('li');
			for( var i=0,len=li.length;i<len;i++){
				if( li[i]==target ){
					return i;	
				}	
			} 	
		},
		init:function(){
			var that=this;
			that.on( that._$(that._option._handle),that._option._event,function(e){
				var _ev=e || window.event,
					_target= _ev.target || _ev.srcElement;
				if( _target.nodeName.toLowerCase() !== "li"){
					return;	
				}
				var _index=that.index( _target,that._$(that._option._handle) );
				var _liObj=that._$(that._option._handle).getElementsByTagName('li'),
					_contentObj=that.getElementsByClassName(that._option._tag,that._option._classname,that._option._body);
				for( var m=0,len=_liObj.length;m<len;m++){
					_liObj[m].className=(m===_index)?"on":"";	
				}
				for( var n=0;n<_contentObj.length;n++){
					_contentObj[n].style.display = ( n ===_index ) ? "block" : "none";
				}
			})
		}	
	}