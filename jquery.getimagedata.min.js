/*
 *
 *  jQuery $.getImageData Plugin 0.3
 *  http://www.maxnov.com/getimagedata
 *
 *  Written by Max Novakovic (http://www.maxnov.com/)
 *  Date: Thu Jan 13 2011
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  Includes jQuery JSONP Core Plugin 2.1.4
 *  http://code.google.com/p/jquery-jsonp/
 *  Copyright 2010, Julian Aubourg
 *  Released under the MIT License.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  Copyright 2011, Max Novakovic
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://www.maxnov.com/getimagedata/#license
 *
 */
(function(e,b){function m(){}function r(a){s=[a]}function c(a,b,e){return a&&a.apply(b.context||b,e)}function k(a){function k(g){!l++&&b(function(){n();h&&(u[d]={s:[g]});y&&(g=y.apply(a,[g]));c(a.success,a,[g,z]);c(A,a,[a,z])},0)}function t(g){!l++&&b(function(){n();h&&g!=B&&(u[d]=g);c(a.error,a,[a,g]);c(A,a,[a,g])},0)}a=e.extend({},C,a);var A=a.complete,y=a.dataFilter,D=a.callbackParameter,E=a.callback,O=a.cache,h=a.pageCache,F=a.charset,d=a.url,f=a.data,G=a.timeout,p,l=0,n=m;a.abort=function(){!l++&&
n()};if(!1===c(a.beforeSend,a,[a])||l)return a;d=d||v;f=f?"string"==typeof f?f:e.param(f,a.traditional):v;d+=f?(/\?/.test(d)?"&":"?")+f:v;D&&(d+=(/\?/.test(d)?"&":"?")+encodeURIComponent(D)+"=?");!O&&!h&&(d+=(/\?/.test(d)?"&":"?")+"_"+(new Date).getTime()+"=");d=d.replace(/=\?(&|$)/,"="+E+"$1");h&&(p=u[d])?p.s?k(p.s[0]):t(p):b(function(a,c,f){if(!l){f=0<G&&b(function(){t(B)},G);n=function(){f&&clearTimeout(f);a[H]=a[w]=a[I]=a[x]=null;j[J](a);c&&j[J](c)};window[E]=r;a=e(K)[0];a.id=L+P++;F&&(a[Q]=F);
var h=function(b){(a[w]||m)();b=s;s=void 0;b?k(b[0]):t(M)};N.msie?(a.event=w,a.htmlFor=a.id,a[H]=function(){/loaded|complete/.test(a.readyState)&&h()}):(a[x]=a[I]=h,N.opera?(c=e(K)[0]).text="jQuery('#"+a.id+"')[0]."+x+"()":a[q]=q);a.src=d;j.insertBefore(a,j.firstChild);c&&j.insertBefore(c,j.firstChild)}},0);return a}var q="async",Q="charset",v="",M="error",L="_jqjsp",w="onclick",x="on"+M,I="onload",H="onreadystatechange",J="removeChild",K="<script/>",z="success",B="timeout",N=e.browser,j=e("head")[0]||
document.documentElement,u={},P=0,s,C={callback:L,url:location.href};k.setup=function(a){e.extend(C,a)};e.jsonp=k})(jQuery,setTimeout);
(function(e){e.getImageData=function(b){var m=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;if(b.url){var r="https:"===location.protocol,c="",c=b.server&&m.test(b.server)&&!(r&&0==b.server.indexOf("http:"))?b.server:"//img-to-json.appspot.com/";e.jsonp({url:c+"?callback=?",data:{url:escape(b.url)},dataType:"jsonp",timeout:1E4,success:function(c){var q=new Image;e(q).load(function(){this.width=c.width;this.height=c.height;typeof b.success==typeof Function&&b.success(this)}).attr("src",
c.data)},error:function(c,e){typeof b.error==typeof Function&&b.error(c,e)}})}else typeof b.error==typeof Function&&b.error(null,"no_url")}})(jQuery);