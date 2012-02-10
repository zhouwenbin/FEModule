/**
  * to:内容延迟加载
  * author:f2er
  * time:11-11-28
**/
function LazyFilling(ctg){
	
	//填充
	this._filling=0;
	
	//配置
	this.setting={
		_id:ctg.id ||" ",
		_cid:ctg.cid || " " ,
		_callback:ctg.callback
	}
	
	if( !(this instanceof LazyFilling) ){
		return new LazyFilling(ctg);  
	}	
	
	this.init();   
}

LazyFilling.prototype={
	
	GetId:function(id){
		return typeof id =="string" ? document.getElementById(id) : id; 
	},
	GetPosTop:function(){
		var that=this,
			_obj=that.GetId(that.setting._id),
			_top=0;
		while( _obj ){
			_top += _obj.offsetTop;
			_obj = _obj.offsetParent;
		}
		return _top;
	},
	getStyle:function(ele,pro){
		var _ele = ele;
		var _style = ele.currentStyle || document.defaultView.getComputedStyle(ele,null);
		var _value = _style[pro];
		return _value;
	},
	lazyContent:function(callback){
		var that=this,
			_clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
			_scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			_offsetTop = that.GetPosTop( that.setting._id ),
			_obj = that.GetId( that.setting._id );
			var _height = that.getStyle( _obj,'height');
			var _v = _offsetTop-_scrollTop;
			
			if( that._filling==1){
				return;	
			}
			if( that._filling==0){
				if(  _v >=0 && _v< _clientHeight ){
				
					var _cid = ( that.setting._cid === " " ) ? that.GetId( that.setting._id ) : that.GetId( that.setting._cid );
					var _textarea=_cid.getElementsByTagName('textarea')[0].value;
					var _dv=document.createElement('div');
					_dv.innerHTML=_textarea;
					_cid.appendChild(_dv);
					that._filling=1;
				}
			}
			if( Object.prototype.toString.call(callback)=='[ object Function]'){
				callback();
			}
		},
		addEvent:function(target,type,handle){
			if(target.addEventListener){
				target.addEventListener(type,handle,false);
			}else if( target.attachEvent){
				target.attachEvent('on'+type,handle);	
			}else{
				target["on"+type]=handle;	
			}
		},
		init:function(){
			var that=this;
			that.lazyContent(that.setting._callback);
			if( that._filling==0 ){
				that.addEvent(window,'scroll',function(){	
					that.lazyContent(that.setting._callback);	
				})
			}
		}	  
  }