/*
 * To:Ajax Object
 * Time:2012-02-01
 * authro :f2er 
* */
var Ajax=Ajax || {};

Ajax={
	// IE7以上、Firefox、Chrome、Opera、Safari支持本地Javascript对象。
	createXHR:function(){
		if( typeof XMLHttpRequest !="undefined" ){
			return new XMLHttpRequest();
		}else if( typeof ActiveXObject != "undefined"){       
			if( typeof arguments.callee.activeXString != "string" ){
				var versions=[ "MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp" ];
				for( var i=0,len=versions.length;i<len;i++ ){
					try{
						var xhr= new ActiveXObject( versions[i] );
						arguments.callee.activeXString = versions[i];
						return xhr;
					}catch(ex){}
				}
			}
			  return new ActiveXObject( arguments.callee.activeXString );
			}else{
			   throw new Error( "No xhr object available.")
			}
		},
	responseType:function( request ){
		var _responseType = request.getResponseHeader("Content-Type");
        switch( _responseType ){
            case "text/xml" :
                return request.responseXML;
            case "text/json" :
            case "text/javascript":
            case "application/javascript":
            case "application/x-javascript":
                 return eval("(" + request.responseText + ")");
            default:
                return request.responseText;
        }
	},
	encodeFormData:function( data ){
		var _pairs = [];
        var _regexp = /%20/g;
        for( var name in data){
            var _value = data[ name ].toString();
            var _pair = encodeURIComponent( name ).replace(_regexp,"+") + "=" + encodeURIComponent( _value ).replace(_regexp,"+");
            _pairs.push(_pair);
        }
        return _pairs.join("&");
	},
	/*
    * method: GET 、 POST
    * url: 请求的地址
    * asyn : 请求方式( false:同步、true: 异步 )
    * value : POST 请求附带的参数
    * callback :请求成功回调函数
    * errorHandle :请求失败回调函数
    * */
	doAjax:function( method,url,asyn,value,callback,errorHandle ){
		var _xhr = Ajax.createXHR();
        _xhr.onreadystatechange=function(){
            if( _xhr.readyState == 4 ){
                if( _xhr.status >= 200 && _xhr.status < 300 || _xhr.status == 304 ){
                    callback( Ajax.responseType( _xhr ) );
                }else{
                    if( errorHandle ){
                        errorHandle( _xhr.status,_xhr.statusText );
                    }else{
                        callback( null );
                    }
                }
            }
        };
       _xhr.open(method,url,asyn);
        if( method == "GET" ){
            _xhr.send( null );
        }else if( method=="POST" ){
            _xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            _xhr.send( Ajax.encodeFormData(value) );
        }
	}
}

    

/*
 * to: 模块基础JS
 * author: f2er
 * time: 2011-12-19
 * update: 2012-02-05
*/

var mod_f2er=mod_f2er || {};

mod_f2er={
		_$:function( id ){
			return typeof id =="string" ? document.getElementById( id ): id;		
		},
		//清除空白节点
		clearBlank:function( element ){
			for(var i=0;i<element.childNodes.length;i++){  
           		 var node=element.childNodes[i]  
           	 	 if(node.nodeType==3 && !/\s/.test(node.nodeValue)){  
              	  	node.parentNode.removeChild(node);   
			 	}
        	}  
			return element;
		},
		//公共头部
		topBar:function( modName,id,index ){
			if ( !this._$(id)){
				return;	
			}
			 var _tpl='<div class="wrapper"><div class="site"><a href="http://www.ux265.net" title="web前端导航站">web前端导航站</a>';
			     _tpl+=( index == true ) ? '':'<a href="/wiki/" title="返回首页">返回首页</a>';
				 _tpl+='</div><div class="title">'+modName+'</div></div>';

            this._$(id).innerHTML=_tpl;
		},
		bottomBar:function( id ){
		   if( ! this._$(id) ){
				return;   
			}
			var _tpl='&copy;copyRight 2012';
			this._$(id).innerHTML=_tpl;
		},
		blind:function( id ){
			var that=this;
			var _list=that.clearBlank( that._$(id) );
			var _title=_list.getElementsByTagName('h2'),
				_content=_list.getElementsByTagName('ul');
			for( var i=0,len=_title.length;i<len;i++ ){
				_title[i].onclick=function(i){	
					return function(){
						for( var m=0,_len=_title.length;m<_len;m++){
							if( m==i ){
								_title[m].className = "current";
								_content[m].style.display = "block";
							}else{
								_title[m].className = "";
								_content[m].style.display = "none";
							}
						}
					}
				}(i)
			}	
		},
		//修改title
		setTitle:function(title){
			document.title=title;
		},
		loadPage:function( id ){
			var _pid = this._$( id ),
				_wrapper =  document.getElementsByClassName('wiki_content')[0];
			var	_arrowHtml=document.createElement('span');
				_arrowHtml.className="m_arrow",
				_arrowHtml.innerHTML="<em>◆</em><span>◆</span>";
			_pid.onclick = function( evt ){
				var _evt = evt || window.event,
					_target = _evt.target || _evt.srcElement,
					_srcElementA = _pid.getElementsByTagName('a');
				if( _target.nodeName.toLowerCase()!='a' ){
					return;
				}
				for( var i=0,len=_srcElementA.length; i< len; i++ ){
					_srcElementA[i].className="";
				}
				var _flag=_target.getAttribute('flag');
				if( _flag==undefined ){
					_target.appendChild(_arrowHtml);
					_target.setAttribute('flag','true');
				}
				_target.className="on";
				var _dataSource=_target.getAttribute('data-source');
				Ajax.doAjax("GET",_dataSource,true,"",function(txt){
					_wrapper.innerHTML = txt;
				},"")
				window.location.href="#/"+_dataSource;
			}
		}
	};
