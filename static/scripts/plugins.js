/* PAGINATOR  3000 - idea by ecto (ecto.ru) - coded by karaboz (karaboz.ru)*/
function getElementsByClassName(a,b,c){var d=a.getElementsByTagName(b);if(!c){return d}var e=[];for(var f=0;f<d.length;f++){if(matchClass(d[f],c)){e[e.length]=d[f]}}return e}function addClass(a,b){replaceClass(a,b,"")}function removeClass(a,b){replaceClass(a,"",b)}function replaceClass(a,b,c){var d=b;if(c&&c.length){c=c.replace(/\s+(\S)/g,"|$1");if(d.length)d+="|";d+=c}a.className=a.className.replace(new RegExp("(^|\\s+)("+d+")($|\\s+)","g"),"$1");a.className+=(a.className.length?" ":"")+b}function matchClass(a,b){return a&&a.className.length&&a.className.match(new RegExp("(^|\\s+)("+b+")($|\\s+)"))}function addEvent(a,b,c){if(a.addEventListener)a.addEventListener(b,c,false);else if(a.attachEvent)a.attachEvent("on"+b,c)}function removeEvent(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,false);else if(a.detachEvent)a.detachEvent("on"+b,c)}function getPageY(a){var b=a.offsetTop;while(a.offsetParent!=null){a=a.offsetParent;b+=a.offsetTop;if(a.tagName=="BODY")break}return b}function getPageX(a){var b=a.offsetLeft;while(a.offsetParent!=null){a=a.offsetParent;b+=a.offsetLeft;if(a.tagName=="BODY")break}return b}function getMousePosition(a){if(a.pageX||a.pageY){var b=a.pageX;var c=a.pageY}else if(a.clientX||a.clientY){var b=a.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;var c=a.clientY+document.body.scrollTop+document.documentElement.scrollTop}return{x:b,y:c}}var Paginator=function(a,b,c,d,e){if(!document.getElementById(a)||!b||!c)return false;this.inputData={paginatorHolderId:a,pagesTotal:b,pagesSpan:c<b?c:b,pageCurrent:d,baseUrl:e?e:"/pages/"};this.html={holder:null,table:null,trPages:null,trScrollBar:null,tdsPages:null,scrollBar:null,scrollThumb:null,pageCurrentMark:null};this.prepareHtml();this.initScrollThumb();this.initPageCurrentMark();this.initEvents();this.scrollToPageCurrent()};Paginator.prototype.prepareHtml=function(){this.html.holder=document.getElementById(this.inputData.paginatorHolderId);this.html.holder.innerHTML=this.makePagesTableHtml();this.html.table=this.html.holder.getElementsByTagName("table")[0];var a=this.html.table.getElementsByTagName("tr")[0];this.html.tdsPages=a.getElementsByTagName("td");this.html.scrollBar=getElementsByClassName(this.html.table,"div","scroll_bar")[0];this.html.scrollThumb=getElementsByClassName(this.html.table,"div","scroll_thumb")[0];this.html.pageCurrentMark=getElementsByClassName(this.html.table,"div","current_page_mark")[0];if(this.inputData.pagesSpan==this.inputData.pagesTotal){addClass(this.html.holder,"fullsize")}};Paginator.prototype.makePagesTableHtml=function(){var a=100/this.inputData.pagesSpan+"%";var b=""+'<table width="100%">'+"<tr>";for(var c=1;c<=this.inputData.pagesSpan;c++){b+='<td width="'+a+'"></td>'}b+=""+"</tr>"+"<tr>"+'<td colspan="'+this.inputData.pagesSpan+'">'+'<div class="scroll_bar">'+'<div class="scroll_trough"></div>'+'<div class="scroll_thumb">'+'<div class="scroll_knob"></div>'+"</div>"+'<div class="current_page_mark"></div>'+"</div>"+"</td>"+"</tr>"+"</table>";return b};Paginator.prototype.initScrollThumb=function(){this.html.scrollThumb.widthMin="8";this.html.scrollThumb.widthPercent=this.inputData.pagesSpan/this.inputData.pagesTotal*100;this.html.scrollThumb.xPosPageCurrent=(this.inputData.pageCurrent-Math.round(this.inputData.pagesSpan/2))/this.inputData.pagesTotal*this.html.table.offsetWidth;this.html.scrollThumb.xPos=this.html.scrollThumb.xPosPageCurrent;this.html.scrollThumb.xPosMin=0;this.html.scrollThumb.xPosMax;this.html.scrollThumb.widthActual;this.setScrollThumbWidth()};Paginator.prototype.setScrollThumbWidth=function(){this.html.scrollThumb.style.width=this.html.scrollThumb.widthPercent+"%";this.html.scrollThumb.widthActual=this.html.scrollThumb.offsetWidth;if(this.html.scrollThumb.widthActual<this.html.scrollThumb.widthMin){this.html.scrollThumb.style.width=this.html.scrollThumb.widthMin+"px"}this.html.scrollThumb.xPosMax=this.html.table.offsetWidth-this.html.scrollThumb.widthActual};Paginator.prototype.moveScrollThumb=function(){this.html.scrollThumb.style.left=this.html.scrollThumb.xPos+"px"};Paginator.prototype.initPageCurrentMark=function(){this.html.pageCurrentMark.widthMin="3";this.html.pageCurrentMark.widthPercent=100/this.inputData.pagesTotal;this.html.pageCurrentMark.widthActual;this.setPageCurrentPointWidth();this.movePageCurrentPoint()};Paginator.prototype.setPageCurrentPointWidth=function(){this.html.pageCurrentMark.style.width=this.html.pageCurrentMark.widthPercent+"%";this.html.pageCurrentMark.widthActual=this.html.pageCurrentMark.offsetWidth;if(this.html.pageCurrentMark.widthActual<this.html.pageCurrentMark.widthMin){this.html.pageCurrentMark.style.width=this.html.pageCurrentMark.widthMin+"px"}};Paginator.prototype.movePageCurrentPoint=function(){if(this.html.pageCurrentMark.widthActual<this.html.pageCurrentMark.offsetWidth){this.html.pageCurrentMark.style.left=(this.inputData.pageCurrent-1)/this.inputData.pagesTotal*this.html.table.offsetWidth-this.html.pageCurrentMark.offsetWidth/2+"px"}else{this.html.pageCurrentMark.style.left=(this.inputData.pageCurrent-1)/this.inputData.pagesTotal*this.html.table.offsetWidth+"px"}};Paginator.prototype.initEvents=function(){var a=this;this.html.scrollThumb.onmousedown=function(b){if(!b)var b=window.event;b.cancelBubble=true;if(b.stopPropagation)b.stopPropagation();var c=getMousePosition(b).x-this.xPos;document.onmousemove=function(b){if(!b)var b=window.event;a.html.scrollThumb.xPos=getMousePosition(b).x-c;a.moveScrollThumb();a.drawPages()};document.onmouseup=function(){document.onmousemove=null;a.enableSelection()};a.disableSelection()};this.html.scrollBar.onmousedown=function(b){if(!b)var b=window.event;if(matchClass(a.paginatorBox,"fullsize"))return;a.html.scrollThumb.xPos=getMousePosition(b).x-getPageX(a.html.scrollBar)-a.html.scrollThumb.offsetWidth/2;a.moveScrollThumb();a.drawPages()};addEvent(window,"resize",function(){Paginator.resizePaginator(a)})};Paginator.prototype.drawPages=function(){var a=this.html.scrollThumb.xPos/this.html.table.offsetWidth;var b=Math.round(a*this.inputData.pagesTotal);var c="";if(b<1){b=1;this.html.scrollThumb.xPos=0;this.moveScrollThumb()}else if(b>=this.inputData.pagesTotal-this.inputData.pagesSpan){b=this.inputData.pagesTotal-this.inputData.pagesSpan+1;this.html.scrollThumb.xPos=this.html.table.offsetWidth-this.html.scrollThumb.offsetWidth;this.moveScrollThumb()}for(var d=0;d<this.html.tdsPages.length;d++){var e=b+d;if(e==this.inputData.pageCurrent){c="<span>"+"<strong>"+e+"</strong>"+"</span>"}else{c="<span>"+"<a href='"+this.inputData.baseUrl+e+"'>"+e+"</a>"+"</span>"}this.html.tdsPages[d].innerHTML=c}};Paginator.prototype.scrollToPageCurrent=function(){this.html.scrollThumb.xPosPageCurrent=(this.inputData.pageCurrent-Math.round(this.inputData.pagesSpan/2))/this.inputData.pagesTotal*this.html.table.offsetWidth;this.html.scrollThumb.xPos=this.html.scrollThumb.xPosPageCurrent;this.moveScrollThumb();this.drawPages()};Paginator.prototype.disableSelection=function(){document.onselectstart=function(){return false};this.html.scrollThumb.focus()};Paginator.prototype.enableSelection=function(){document.onselectstart=function(){return true}};Paginator.resizePaginator=function(a){a.setPageCurrentPointWidth();a.movePageCurrentPoint();a.setScrollThumbWidth();a.scrollToPageCurrent()};

/* TOOLTIPS   Query Tools v1.2.6 - The missing UI library for the Web */
(function(a){a.tools=a.tools||{version:"v1.2.6"},a.tools.tooltip={conf:{effect:"toggle",fadeOutSpeed:"fast",predelay:0,delay:30,opacity:1,tip:0,fadeIE:!1,position:["top","center"],offset:[0,0],relative:!1,cancelDefault:!0,events:{def:"mouseenter,mouseleave",input:"focus,blur",widget:"focus mouseenter,blur mouseleave",tooltip:"mouseenter,mouseleave"},layout:"<div/>",tipClass:"tooltip"},addEffect:function(a,c,d){b[a]=[c,d]}};var b={toggle:[function(a){var b=this.getConf(),c=this.getTip(),d=b.opacity;d<1&&c.css({opacity:d}),c.show(),a.call()},function(a){this.getTip().hide(),a.call()}],fade:[function(b){var c=this.getConf();!a.browser.msie||c.fadeIE?this.getTip().fadeTo(c.fadeInSpeed,c.opacity,b):(this.getTip().show(),b())},function(b){var c=this.getConf();!a.browser.msie||c.fadeIE?this.getTip().fadeOut(c.fadeOutSpeed,b):(this.getTip().hide(),b())}]};function c(b,c,d){var e=d.relative?b.position().top:b.offset().top,f=d.relative?b.position().left:b.offset().left,g=d.position[0];e-=c.outerHeight()-d.offset[0],f+=b.outerWidth()+d.offset[1],/iPad/i.test(navigator.userAgent)&&(e-=a(window).scrollTop());var h=c.outerHeight()+b.outerHeight();g=="center"&&(e+=h/2),g=="bottom"&&(e+=h),g=d.position[1];var i=c.outerWidth()+b.outerWidth();g=="center"&&(f-=i/2),g=="left"&&(f-=i);return{top:e,left:f}}function d(d,e){var f=this,g=d.add(f),h,i=0,j=0,k=d.attr("title"),l=d.attr("data-tooltip"),m=b[e.effect],n,o=d.is(":input"),p=o&&d.is(":checkbox, :radio, select, :button, :submit"),q=d.attr("type"),r=e.events[q]||e.events[o?p?"widget":"input":"def"];if(!m)throw"Nonexistent effect \""+e.effect+"\"";r=r.split(/,\s*/);if(r.length!=2)throw"Tooltip: bad events configuration for "+q;d.bind(r[0],function(a){clearTimeout(i),e.predelay?j=setTimeout(function(){f.show(a)},e.predelay):f.show(a)}).bind(r[1],function(a){clearTimeout(j),e.delay?i=setTimeout(function(){f.hide(a)},e.delay):f.hide(a)}),k&&e.cancelDefault&&(d.removeAttr("title"),d.data("title",k)),a.extend(f,{show:function(b){if(!h){l?h=a(l):e.tip?h=a(e.tip).eq(0):k?h=a(e.layout).addClass(e.tipClass).appendTo(document.body).hide().append(k):(h=d.next(),h.length||(h=d.parent().next()));if(!h.length)throw"Cannot find tooltip for "+d}if(f.isShown())return f;h.stop(!0,!0);var o=c(d,h,e);e.tip&&h.html(d.data("title")),b=a.Event(),b.type="onBeforeShow",g.trigger(b,[o]);if(b.isDefaultPrevented())return f;o=c(d,h,e),h.css({position:"absolute",top:o.top,left:o.left}),n=!0,m[0].call(f,function(){b.type="onShow",n="full",g.trigger(b)});var p=e.events.tooltip.split(/,\s*/);h.data("__set")||(h.unbind(p[0]).bind(p[0],function(){clearTimeout(i),clearTimeout(j)}),p[1]&&!d.is("input:not(:checkbox, :radio), textarea")&&h.unbind(p[1]).bind(p[1],function(a){a.relatedTarget!=d[0]&&d.trigger(r[1].split(" ")[0])}),e.tip||h.data("__set",!0));return f},hide:function(c){if(!h||!f.isShown())return f;c=a.Event(),c.type="onBeforeHide",g.trigger(c);if(!c.isDefaultPrevented()){n=!1,b[e.effect][1].call(f,function(){c.type="onHide",g.trigger(c)});return f}},isShown:function(a){return a?n=="full":n},getConf:function(){return e},getTip:function(){return h},getTrigger:function(){return d}}),a.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","),function(b,c){a.isFunction(e[c])&&a(f).bind(c,e[c]),f[c]=function(b){b&&a(f).bind(c,b);return f}})}a.fn.tooltip=function(b){var c=this.data("tooltip");if(c)return c;b=a.extend(!0,{},a.tools.tooltip.conf,b),typeof b.position=="string"&&(b.position=b.position.split(/,?\s/)),this.each(function(){c=new d(a(this),b),a(this).data("tooltip",c)});return b.api?c:this}})(jQuery);

/* SISYPHUS     https://github.com/simsalabim/sisyphus * Plugin developed to save html forms data to LocalStorage to restore them after browser crashes, tabs closings and other disasters. @author Alexander Kaupanin <kaupanin@gmail.com> */
(function(a){a.sisyphus=function(){return Sisyphus.getInstance()},a.fn.sisyphus=function(a){var b=Sisyphus.getInstance();return b.setOptions(a),b.protect(this),b};var b={};b.isAvailable=function(){if(typeof a.jStorage=="object")return!0;try{return localStorage.getItem}catch(b){return!1}},b.set=function(b,c){if(typeof a.jStorage=="object")a.jStorage.set(b,c+"");else try{localStorage.setItem(b,c+"")}catch(d){}},b.get=function(b){if(typeof a.jStorage=="object"){var c=a.jStorage.get(b);return c?c.toString():c}return localStorage.getItem(b)},b.remove=function(b){typeof a.jStorage=="object"?a.jStorage.deleteKey(b):localStorage.removeItem(b)},Sisyphus=function(){function d(){return{setInitialOptions:function(c){var d={excludeFields:null,customKeyPrefix:"",timeout:0,autoRelease:!0,name:null,onSave:function(){},onBeforeRestore:function(){},onRestore:function(){},onRelease:function(){}};this.options=this.options||a.extend(d,c),this.browserStorage=b},setOptions:function(b){this.options=this.options||this.setInitialOptions(b),this.options=a.extend(this.options,b)},protect:function(b){b=b||{};var d=this;this.targets=this.targets||[],this.href=this.options.name||location.hostname+location.pathname+location.search+location.hash,this.targets=a.merge(this.targets,b),this.targets=a.unique(this.targets),this.targets=a(this.targets);if(!this.browserStorage.isAvailable())return!1;d.restoreAllData(),this.options.autoRelease&&d.bindReleaseData(),c.started||(d.bindSaveData(),c.started=!0)},bindSaveData:function(){var b=this;b.options.timeout&&b.saveDataByTimeout(),b.targets.each(function(){var c=a(this).attr("id"),d=a(this).find(":input").not(":submit").not(":reset").not(":button").not(":file");d.each(function(){if(a.inArray(this,b.options.excludeFields)!==-1)return!0;var d=a(this),e=b.href+c+d.attr("name")+b.options.customKeyPrefix;d.is(":text")||d.is("textarea")?b.options.timeout||b.bindSaveDataImmediately(d,e):b.bindSaveDataOnChange(d,e)})})},saveAllData:function(){var b=this;b.targets.each(function(){var c=a(this).attr("id"),d=a(this).find(":input").not(":submit").not(":reset").not(":button").not(":file");d.each(function(){var d=a(this);if(a.inArray(this,b.options.excludeFields)!==-1||d.attr("name")===undefined)return!0;var e=b.href+c+d.attr("name")+b.options.customKeyPrefix,f=d.val();d.is(":checkbox")?(d.attr("name").indexOf("[")!==-1?(f=[],a("[name='"+d.attr("name")+"']:checked").each(function(){f.push(a(this).val())})):f=d.is(":checked"),b.saveToBrowserStorage(e,f,!1)):d.is(":radio")?d.is(":checked")&&(f=d.val(),b.saveToBrowserStorage(e,f,!1)):b.saveToBrowserStorage(e,f,!1)})}),a.isFunction(b.options.onSave)&&b.options.onSave.call()},restoreAllData:function(){var b=this,c=!1;a.isFunction(b.options.onBeforeRestore)&&b.options.onBeforeRestore.call(),b.targets.each(function(){var d=a(this),e=d.attr("id"),f=d.find(":input").not(":submit").not(":reset").not(":button").not(":file");f.each(function(){if(a.inArray(this,b.options.excludeFields)!==-1)return!0;var d=a(this),f=b.href+e+d.attr("name")+b.options.customKeyPrefix,g=b.browserStorage.get(f);g&&(b.restoreFieldsData(d,g),c=!0)})}),c&&a.isFunction(b.options.onRestore)&&b.options.onRestore.call()},restoreFieldsData:function(a,b){if(a.attr("name")===undefined)return!1;a.is(":checkbox")&&b!=="false"&&a.attr("name").indexOf("[")===-1?a.attr("checked","checked"):a.is(":radio")?a.val()===b&&a.attr("checked","checked"):a.attr("name").indexOf("[")===-1?a.val(b):(b=b.split(","),a.val(b))},bindSaveDataImmediately:function(b,c){var d=this;a.browser.msie==null?b.get(0).oninput=function(){d.saveToBrowserStorage(c,b.val())}:b.get(0).onpropertychange=function(){d.saveToBrowserStorage(c,b.val())}},saveToBrowserStorage:function(b,c,d){d=d==null?!0:d,this.browserStorage.set(b,c),d&&c!==""&&a.isFunction(this.options.onSave)&&this.options.onSave.call()},bindSaveDataOnChange:function(a,b){var c=this;a.change(function(){c.saveAllData()})},saveDataByTimeout:function(){var a=this,b=a.targets;setTimeout(function(b){function c(){a.saveAllData(),setTimeout(c,a.options.timeout*1e3)}return c}(b),a.options.timeout*1e3)},bindReleaseData:function(){var b=this;b.targets.each(function(c){var d=a(this),e=d.find(":input").not(":submit").not(":reset").not(":button").not(":file"),f=d.attr("id");a(this).bind("submit reset",function(){b.releaseData(f,e)})})},manuallyReleaseData:function(){var b=this;b.targets.each(function(c){var d=a(this),e=d.find(":input").not(":submit").not(":reset").not(":button").not(":file"),f=d.attr("id");b.releaseData(f,e)})},releaseData:function(b,c){var d=!1,e=this;c.each(function(){if(a.inArray(this,e.options.excludeFields)!==-1)return!0;var c=a(this),f=e.href+b+c.attr("name")+e.options.customKeyPrefix;e.browserStorage.remove(f),d=!0}),d&&a.isFunction(e.options.onRelease)&&e.options.onRelease.call()}}}var c={instantiated:null,started:null};return{getInstance:function(){return c.instantiated||(c.instantiated=d(),c.instantiated.setInitialOptions()),c.instantiated},free:function(){return c={},null}}}()})(jQuery);

/*  STICKY  Sticky v1.0 by Daniel Raftery  , http://thrivingkings.com/sticky  ,  http://twitter.com/ThrivingKings */
(function(a){a.sticky=function(b,c,d){return a.fn.sticky(b,c,d)};a.fn.sticky=function(b,c,d){var e="top-right";var f={speed:"fast",duplicates:true,autoclose:12e3};if(!b){b=this.html()}if(c){a.extend(f,c)}var g=true;var h="no";var i=Math.floor(Math.random()*99999);a(".sticky-note").each(function(){if(a(this).html()==b&&a(this).is(":visible")){h="yes";if(!f["duplicates"]){g=false}}if(a(this).attr("id")==i){i=Math.floor(Math.random()*9999999)}});if(!a("body").find(".sticky-queue").html()){a("body").append('<div class="sticky-queue '+e+'"></div>')}if(g){a(".sticky-queue").prepend('<div class="sticky border-'+e+'" id="'+i+'"></div>');a("#"+i).append('<img src="#" class="sticky-close" rel="'+i+'" title="Close" />');a("#"+i).append('<div class="sticky-note" rel="'+i+'">'+b+"</div>");var j=a("#"+i).height();a("#"+i).css("height",j);a("#"+i).slideDown(f["speed"]);g=true}a(".sticky").ready(function(){if(f["autoclose"]){a("#"+i).delay(f["autoclose"]).slideUp(f["speed"])}});a(".sticky-close").click(function(){a("#"+a(this).attr("rel")).dequeue().slideUp(f["speed"])});var k={id:i,duplicate:h,displayed:g,position:e};if(d){d(k)}else{return k}}})(jQuery);

/* TABS  bootstrap-tab.js v2.0.4   * http://twitter.github.com/bootstrap/javascript.html#tabs *  * Copyright 2012 Twitter, Inc. Licensed under the Apache License */
!function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype={constructor:b,show:function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target"),e,f,g;if(!d){d=b.attr("href");d=d&&d.replace(/.*(?=#[^\s]*$)/,"")}if(b.parent("li").hasClass("active"))return;e=c.find(".active a").last()[0];g=a.Event("show",{relatedTarget:e});b.trigger(g);if(g.isDefaultPrevented())return;f=a(d);this.activate(b.parent("li"),c);this.activate(f,f.parent(),function(){b.trigger({type:"shown",relatedTarget:e})})},activate:function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");b.addClass("active");if(f){b[0].offsetWidth;b.addClass("in")}else{b.removeClass("fade")}if(b.parent(".dropdown-menu")){b.closest("li.dropdown").addClass("active")}d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g):g();e.removeClass("in")}};a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("tab");if(!e)d.data("tab",e=new b(this));if(typeof c=="string")e[c]()})};a.fn.tab.Constructor=b;a(function(){a("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault();a(this).tab("show")})})}(window.jQuery);

/* Auto Expanding Text Area (1.2.2) * by Chrys Bader (www.chrysbader.com) * chrysb@gmail.com * Special thanks to: * Jake Chapa - jake@hybridstudio.com * John Resig - jeresig@gmail.com  * Copyright (c) 2008 Chrys Bader (www.chrysbader.com)  * Licensed under the GPL (GPL-LICENSE.txt) license.  */
(function(a){var b=null;a.fn.autogrow=function(b){return this.each(function(){new a.autogrow(this,b)})};a.autogrow=function(b,c){this.options=c||{};this.dummy=null;this.interval=null;this.line_height=this.options.lineHeight||parseInt(a(b).css("line-height"));this.min_height=this.options.minHeight||parseInt(a(b).css("min-height"));this.max_height=this.options.maxHeight||parseInt(a(b).css("max-height"));this.expand_callback=this.options.expandCallback;this.textarea=a(b);if(this.line_height==NaN)this.line_height=0;this.init()};a.autogrow.fn=a.autogrow.prototype={autogrow:"1.2.2"};a.autogrow.fn.extend=a.autogrow.extend=a.extend;a.autogrow.fn.extend({init:function(){var a=this;this.textarea.css({overflow:"hidden",display:"block"});this.textarea.bind("focus",function(){a.startExpand()}).bind("blur",function(){a.stopExpand()});this.checkExpand()},startExpand:function(){var a=this;this.interval=window.setInterval(function(){a.checkExpand()},400)},stopExpand:function(){clearInterval(this.interval)},checkExpand:function(){if(this.dummy==null){this.dummy=a("<div></div>");this.dummy.css({"font-size":this.textarea.css("font-size"),"font-family":this.textarea.css("font-family"),width:this.textarea.css("width"),"padding-top":this.textarea.css("padding-top"),"padding-right":this.textarea.css("padding-right"),"padding-bottom":this.textarea.css("padding-bottom"),"padding-left":this.textarea.css("padding-left"),"line-height":this.line_height+"px","overflow-x":"hidden",position:"absolute",top:0,left:-9999}).appendTo("body")}var b=this.textarea.val().replace(/(<|>)/g,"");if(a.browser.msie){b=b.replace(/\n/g,"<BR>new")}else{b=b.replace(/\n/g,"<br>new")}if(this.dummy.html()!=b){this.dummy.html(b);if(this.max_height>0&&this.dummy.height()+this.line_height>this.max_height){this.textarea.css("overflow-y","auto")}else{this.textarea.css("overflow-y","hidden");if(this.textarea.height()<this.dummy.height()+this.line_height||this.dummy.height()<this.textarea.height()){this.textarea.animate({height:this.dummy.height()+this.line_height+"px"},100)}}}if(this.expand_callback){var c=this;window.setTimeout(function(){c.expand_callback()},500)}}})})(jQuery);

/* Timeago 1.3.0 * http://timeago.yarp.com/ * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org) * @license MIT License - http://www.opensource.org/licenses/mit-license.php */
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function r(){var n=i(this);var r=t.settings;if(!isNaN(n.datetime)){if(r.cutoff==0||o(n.datetime)<r.cutoff){e(this).text(s(n.datetime))}}return this}function i(n){n=e(n);if(!n.data("timeago")){n.data("timeago",{datetime:t.datetime(n)});var r=e.trim(n.text());if(t.settings.localeTitle){n.attr("title",n.data("timeago").datetime.toLocaleString())}else if(r.length>0&&!(t.isTime(n)&&n.attr("title"))){n.attr("title",r)}}return n.data("timeago")}function s(e){return t.inWords(o(e))}function o(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){if(t instanceof Date){return s(t)}else if(typeof t==="string"){return s(e.timeago.parse(t))}else if(typeof t==="number"){return s(new Date(t))}else{return s(e.timeago.datetime(t))}};var t=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowFuture:false,localeTitle:false,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function l(r,i){var s=e.isFunction(r)?r(i,t):r;var o=n.numbers&&n.numbers[i]||i;return s.replace(/%d/i,o)}var n=this.settings.strings;var r=n.prefixAgo;var i=n.suffixAgo;if(this.settings.allowFuture){if(t<0){r=n.prefixFromNow;i=n.suffixFromNow}}var s=Math.abs(t)/1e3;var o=s/60;var u=o/60;var a=u/24;var f=a/365;var c=s<45&&l(n.seconds,Math.round(s))||s<90&&l(n.minute,1)||o<45&&l(n.minutes,Math.round(o))||o<90&&l(n.hour,1)||u<24&&l(n.hours,Math.round(u))||u<42&&l(n.day,1)||a<30&&l(n.days,Math.round(a))||a<45&&l(n.month,1)||a<365&&l(n.months,Math.round(a/30))||f<1.5&&l(n.year,1)||l(n.years,Math.round(f));var h=n.wordSeparator||"";if(n.wordSeparator===undefined){h=" "}return e.trim([r,c,i].join(h))},parse:function(t){var n=e.trim(t);n=n.replace(/\.\d+/,"");n=n.replace(/-/,"/").replace(/-/,"/");n=n.replace(/T/," ").replace(/Z/," UTC");n=n.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");return new Date(n)},datetime:function(n){var r=t.isTime(n)?e(n).attr("datetime"):e(n).attr("title");return t.parse(r)},isTime:function(t){return e(t).get(0).tagName.toLowerCase()==="time"}});var n={init:function(){var n=e.proxy(r,this);n();var i=t.settings;if(i.refreshMillis>0){setInterval(n,i.refreshMillis)}},update:function(n){e(this).data("timeago",{datetime:t.parse(n)});r.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:t.parse(t.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))});r.apply(this)}};e.fn.timeago=function(e,t){var r=e?n[e]:n.init;if(!r){throw new Error("Unknown function name '"+e+"' for timeago")}this.each(function(){r.call(this,t)});return this};document.createElement("abbr");document.createElement("time")});

/* Timeago hebrew strings */
jQuery.timeago.settings.strings={prefixAgo:"לפני",prefixFromNow:"מעכשיו",suffixAgo:"",suffixFromNow:"",seconds:"פחות מדקה",minute:"דקה",minutes:"%d דקות",hour:"שעה",hours:"%d שעות",day:"יום",days:"%d ימים",month:"חודש",months:"%d חודשים",year:"שנה",years:"%d שנים"};

/* Jquery cookies */ /*! * jQuery Cookie Plugin v1.3.1 * https://github.com/carhartl/jquery-cookie * * Copyright 2013 Klaus Hartl * Released under the MIT license */
(function(a,b,c){function e(a){return a}function f(a){return g(decodeURIComponent(a.replace(d," ")))}function g(a){return 0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),a}function h(a){return i.json?JSON.parse(a):a}var d=/\+/g,i=a.cookie=function(d,g,j){if(g!==c){if(j=a.extend({},i.defaults,j),null===g&&(j.expires=-1),"number"==typeof j.expires){var k=j.expires,l=j.expires=new Date;l.setDate(l.getDate()+k)}return g=i.json?JSON.stringify(g):g+"",b.cookie=[encodeURIComponent(d),"=",i.raw?g:encodeURIComponent(g),j.expires?"; expires="+j.expires.toUTCString():"",j.path?"; path="+j.path:"",j.domain?"; domain="+j.domain:"",j.secure?"; secure":""].join("")}for(var m=i.raw?e:f,n=b.cookie.split("; "),o=d?null:{},p=0,q=n.length;q>p;p++){var r=n[p].split("="),s=m(r.shift()),t=m(r.join("="));if(d&&d===s){o=h(t);break}d||(o[s]=h(t))}return o};i.defaults={},a.removeCookie=function(b,c){return null!==a.cookie(b)?(a.cookie(b,null,c),!0):!1}})(jQuery,document);