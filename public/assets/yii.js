yii=(function($){var pub={reloadableScripts:[],clickableSelector:'a, button, input[type="submit"], input[type="button"], input[type="reset"], input[type="image"]',changeableSelector:'select, input, textarea',getCsrfParam:function(){return $('meta[name=csrf-param]').attr('content');},getCsrfToken:function(){return $('meta[name=csrf-token]').attr('content');},setCsrfToken:function(name,value){$('meta[name=csrf-param]').attr('content',name);$('meta[name=csrf-token]').attr('content',value);},refreshCsrfToken:function(){var token=pub.getCsrfToken();if(token){$('form input[name="'+ pub.getCsrfParam()+'"]').val(token);}},confirm:function(message,ok,cancel){if(confirm(message)){!ok||ok();}else{!cancel||cancel();}},handleAction:function($e,event){var method=$e.data('method'),$form=$e.closest('form'),action=$e.attr('href'),params=$e.data('params'),pjax=$e.data('pjax'),pjaxPushState=!!$e.data('pjax-push-state'),pjaxReplaceState=!!$e.data('pjax-replace-state'),pjaxTimeout=$e.data('pjax-timeout'),pjaxScrollTo=$e.data('pjax-scrollto'),pjaxPushRedirect=$e.data('pjax-push-redirect'),pjaxReplaceRedirect=$e.data('pjax-replace-redirect'),pjaxSkipOuterContainers=$e.data('pjax-skip-outer-containers'),pjaxContainer,pjaxOptions={};if(pjax!==undefined&&$.support.pjax){if($e.data('pjax-container')){pjaxContainer=$e.data('pjax-container');}else{pjaxContainer=$e.closest('[data-pjax-container=""]');}
if(!pjaxContainer.length){pjaxContainer=$('body');}
pjaxOptions={container:pjaxContainer,push:pjaxPushState,replace:pjaxReplaceState,scrollTo:pjaxScrollTo,pushRedirect:pjaxPushRedirect,replaceRedirect:pjaxReplaceRedirect,pjaxSkipOuterContainers:pjaxSkipOuterContainers,timeout:pjaxTimeout,originalEvent:event,originalTarget:$e}}
if(method===undefined){if(action&&action!='#'){if(pjax!==undefined&&$.support.pjax){$.pjax.click(event,pjaxOptions);}else{window.location=action;}}else if($e.is(':submit')&&$form.length){if(pjax!==undefined&&$.support.pjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);})}
$form.trigger('submit');}
return;}
var newForm=!$form.length;if(newForm){if(!action||!action.match(/(^\/|:\/\/)/)){action=window.location.href;}
$form=$('<form/>',{method:method,action:action});var target=$e.attr('target');if(target){$form.attr('target',target);}
if(!method.match(/(get|post)/i)){$form.append($('<input/>',{name:'_method',value:method,type:'hidden'}));method='POST';}
if(!method.match(/(get|head|options)/i)){var csrfParam=pub.getCsrfParam();if(csrfParam){$form.append($('<input/>',{name:csrfParam,value:pub.getCsrfToken(),type:'hidden'}));}}
$form.hide().appendTo('body');}
var activeFormData=$form.data('yiiActiveForm');if(activeFormData){activeFormData.submitObject=$e;}
if(params&&$.isPlainObject(params)){$.each(params,function(idx,obj){$form.append($('<input/>').attr({name:idx,value:obj,type:'hidden'}));});}
var oldMethod=$form.attr('method');$form.attr('method',method);var oldAction=null;if(action&&action!='#'){oldAction=$form.attr('action');$form.attr('action',action);}
if(pjax!==undefined&&$.support.pjax){$form.on('submit',function(e){$.pjax.submit(e,pjaxOptions);})}
$form.trigger('submit');$.when($form.data('yiiSubmitFinalizePromise')).then(function(){if(oldAction!=null){$form.attr('action',oldAction);}
$form.attr('method',oldMethod);if(params&&$.isPlainObject(params)){$.each(params,function(idx,obj){$('input[name="'+ idx+'"]',$form).remove();});}
if(newForm){$form.remove();}});},getQueryParams:function(url){var pos=url.indexOf('?');if(pos<0){return{};}
var pairs=url.substring(pos+ 1).split('&'),params={},pair,i;for(i=0;i<pairs.length;i++){pair=pairs[i].split('=');var name=decodeURIComponent(pair[0]);var value=decodeURIComponent(pair[1]);if(name.length){if(params[name]!==undefined){if(!$.isArray(params[name])){params[name]=[params[name]];}
params[name].push(value||'');}else{params[name]=value||'';}}}
return params;},initModule:function(module){if(module.isActive===undefined||module.isActive){if($.isFunction(module.init)){module.init();}
$.each(module,function(){if($.isPlainObject(this)){pub.initModule(this);}});}},init:function(){initCsrfHandler();initRedirectHandler();initScriptFilter();initDataMethods();}};function initRedirectHandler(){$(document).ajaxComplete(function(event,xhr,settings){var url=xhr.getResponseHeader('X-Redirect');if(url){window.location=url;}});}
function initCsrfHandler(){$.ajaxPrefilter(function(options,originalOptions,xhr){if(!options.crossDomain&&pub.getCsrfParam()){xhr.setRequestHeader('X-CSRF-Token',pub.getCsrfToken());}});pub.refreshCsrfToken();}
function initDataMethods(){var handler=function(event){var $this=$(this),method=$this.data('method'),message=$this.data('confirm');if(method===undefined&&message===undefined){return true;}
if(message!==undefined){$.proxy(pub.confirm,this)(message,function(){pub.handleAction($this,event);});}else{pub.handleAction($this,event);}
event.stopImmediatePropagation();return false;};$(document).on('click.yii',pub.clickableSelector,handler).on('change.yii',pub.changeableSelector,handler);}
function initScriptFilter(){var hostInfo=location.protocol+'//'+ location.host;var loadedScripts=$('script[src]').map(function(){return this.src.charAt(0)==='/'?hostInfo+ this.src:this.src;}).toArray();$.ajaxPrefilter('script',function(options,originalOptions,xhr){if(options.dataType=='jsonp'){return;}
var url=options.url.charAt(0)==='/'?hostInfo+ options.url:options.url;if($.inArray(url,loadedScripts)===-1){loadedScripts.push(url);}else{var isReloadable=$.inArray(url,$.map(pub.reloadableScripts,function(script){return script.charAt(0)==='/'?hostInfo+ script:script;}))!==-1;if(!isReloadable){xhr.abort();}}});$(document).ajaxComplete(function(event,xhr,settings){var styleSheets=[];$('link[rel=stylesheet]').each(function(){if($.inArray(this.href,pub.reloadableScripts)!==-1){return;}
if($.inArray(this.href,styleSheets)==-1){styleSheets.push(this.href)}else{$(this).remove();}})});}
return pub;})(jQuery);jQuery(document).ready(function(){yii.initModule(yii);});