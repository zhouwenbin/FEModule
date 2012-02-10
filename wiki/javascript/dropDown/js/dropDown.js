/*
 *add by f2er 11-09-09
 *to:dropDown
*/

/*Inherited*/	
var Inherited=(function(){
		function inheritedObject(o){
			function F(){}
			F.prototype = o;
			return new F();
		}
		function inheritPrototype(subC, superC){
			var _prototype =inheritedObject(superC.prototype);
			_prototype.constructor = subC;
			subC.prototype = _prototype;
		}
		return {
			inherite:inheritPrototype
		}
	})();
	
/*extend*/
Object.extend = function(destination, source){
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
};

	
/*Globalgroup*/
function Globalgroup(ctg){
	this.showFlag=false,//是否打开
	this.parentFlag=null,//父容器
	this._ctg=ctg;
}
Globalgroup.prototype={

	//隐藏子内容
	doHide:function(){
		var that=this;
		if(that.showFlag){
			that.Get$(that._ctg._dropBox).style.display="none";
			that.Get$(that._ctg._dropTarget).className=that._ctg._closeClass;	
		}
	},
	Get$:function(id){
		return typeof id=="string" ? document.getElementById(id):id;
	},
	//获取父容器
	doParent:function(ele){
		var parent=ele.parentNode;
		return parent && parent.nodeType != 11 ? parent : null;
	},
	//判断包含关系:容器p包含容器c
	doContainer:function(p,c){
		if(document.documentElement.contains){//ie支持
				return p!==c && ( p.contains ? p.contains(c) : true  )
			}else if(document.documentElement.compareDocumentPosition){//ff支持
				return !!( p.compareDocumentPosition(c) & 16);
			}else {
				return false;
			}	
	},
	//阻止冒泡
	stopPropagation:function(ev){
		if( ev && ev.stopPropation){
			ev.stopPropagation();
		}else{
			ev.cancelBubble=true;//IE	
		};
	},
	preventDefault:function(ev){
		if( ev && ev.preventDefault ){
			ev.preventDefault();
		}else{
			ev.returnValue=false;
		}
	},
	attachEvent:function(o,otype,fn){
		if(o.addEventListener){
			o.addEventListener(otype,fn,false);
		}else if(o.attachEvent){
			o.attachEvent('on'+otype,fn);
		}else{
			o["on"+otype]=fn;
		}
	},
	/*
	 * Control
	*/
	//具体业务
	doEvent:function(){
	
	},
	//调用接口
	init:function(){
		var that=this;
		that.doEvent();
	}
	
}

/*快速导航*/
function GroupNav(option){
	this.dgCtg={
			_dropBox:"m_lbd",
			_dropTarget:"m_link",
			_openClass:"m_open",/*关闭*/
			_closeClass:"m_close"/*关闭*/
		};
	this.Ctg=Object.extend( this.dgCtg,option);
	Globalgroup.call(this,this.Ctg);
}

Inherited.inherite(GroupNav,Globalgroup);

GroupNav.prototype.doEvent=function(){
	var that=this;
	var obj=that.Get$(that.Ctg._dropBox);
	that.Get$(that.Ctg._dropTarget).onmouseover=function(e){
		var self=this;
		var ev=e || window.event,
			_target=ev.srcElement || ev.target;
		if(that.showFlag==false){
			var _spanTarget= self.getElementsByTagName('span')[0];
			_spanTarget.className=that.Ctg._openClass;	
			obj.style.display="block";
			that.showFlag=true;
			that.parentFlag=that.doParent(this);
			that.stopPropagation(ev);
		}
	}
	that.Get$(that.Ctg._dropTarget).onmouseout=function(e){
		var self=this;
		if(that.showFlag==true){
			var _spanTarget= self.getElementsByTagName('span')[0];
				_spanTarget.className=that.Ctg._closeClass;		
			obj.style.display="none";
			that.showFlag=false;
		}
	}
}

/*群组分类*/
function Grouptype(option){
	this.typeCtg={
		_dropBox:"m_tlist",
		_dropTarget:"m_tvalue",
		_openClass:"m_tvalue",/*开启*/
		_closeClass:"m_tvalue",/*关闭*/
		_inputValue:"fieldid",
		_activeClass:"active"
	};
	this.Ctg=Object.extend( this.typeCtg,option);
	Globalgroup.call(this,this.Ctg);
}

Inherited.inherite(Grouptype,Globalgroup);
Grouptype.prototype.doEvent=function(){
	var that=this;
	var obj=that.Get$(that.Ctg._dropBox);
	that.Get$(that.Ctg._dropTarget).onclick=function(e){
		var e=e || window.event;
		if(that.showFlag==false){	
			obj.style.display="block";
			that.showFlag=true;
			that.parentFlag=that.doParent(this);
			that.doValue();
			that.stopPropagation(e);	
		}else{
			obj.style.display="none";
			that.showFlag=false;	
		}	
		
	};
	that.attachEvent(document,'click',function(e){
		var e=e || window.event;
		var _target=e.target || e.srcElement;
		if(that.parentFlag){//父容器存在
			if(!that.doContainer(that.parentFlag,_target) || !that.parentFlag==_target){
				that.doHide();
				that.showFlag=false;
			}
		}		
	});
}

Grouptype.prototype.doValue=function(){
	var that=this,
		_dropBox=that.Get$(that.Ctg._dropBox),
		_dropTarget=that.Get$(that.Ctg._dropTarget),
		_inputValue=that.Get$(that.Ctg._inputValue);
	_dropBox.onclick=function(e){
		var e=e || window.event;
		var _target=e.target || e.srcElement;
		if(_target.nodeName.toLowerCase()!="a"){
			return;
		}
		var _value=_target.getAttribute('value'),
			_html=_target.innerHTML,
			_otargert=_target.parentNode;
			_li=this.getElementsByTagName(_otargert.nodeName);
			for( var i=0,_len=_li.length;i<_len;i++){
				_li[i].className=" ";
			}
			_otargert.className=that.Ctg._activeClass;
		_inputValue.setAttribute('value',_value);
		_dropTarget.innerHTML=_html;
		that.doHide();
		that.showFlag=false;
		that.stopPropagation(e);
		that.preventDefault(e);
	}
}
