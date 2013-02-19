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

// jQuery JSONP
(function(d,l){function w(){}function Q(a){p=[a]}function g(a,h,i){return a&&a.apply(h.context||h,i)}function x(a){function h(b){!j++&&l(function(){m();n&&(q[c]={s:[b]});y&&(b=y.apply(a,[b]));g(a.success,a,[b,z]);g(A,a,[a,z])},0)}function i(b){!j++&&l(function(){m();n&&b!=B&&(q[c]=b);g(a.error,a,[a,b]);g(A,a,[a,b])},0)}a=d.extend({},C,a);var A=a.complete,y=a.dataFilter,D=a.callbackParameter,E=a.callback,R=a.cache,n=a.pageCache,F=a.charset,c=a.url,e=a.data,G=a.timeout,o,j=0,m=w;a.abort=function(){!j++&&
m()};if(g(a.beforeSend,a,[a])===false||j)return a;c=c||r;e=e?typeof e=="string"?e:d.param(e,a.traditional):r;c+=e?(/\?/.test(c)?"&":"?")+e:r;D&&(c+=(/\?/.test(c)?"&":"?")+encodeURIComponent(D)+"=?");!R&&!n&&(c+=(/\?/.test(c)?"&":"?")+"_"+(new Date).getTime()+"=");c=c.replace(/=\?(&|$)/,"="+E+"$1");n&&(o=q[c])?o.s?h(o.s[0]):i(o):l(function(b,k,s){if(!j){s=G>0&&l(function(){i(B)},G);m=function(){s&&clearTimeout(s);b[H]=b[t]=b[I]=b[u]=null;f[J](b);k&&f[J](k)};window[E]=Q;b=d(K)[0];b.id=L+S++;if(F)b[T]=
F;var N=function(v){(b[t]||w)();v=p;p=undefined;v?h(v[0]):i(M)};if(O.msie){b.event=t;b.htmlFor=b.id;b[H]=function(){/loaded|complete/.test(b.readyState)&&N()}}else{b[u]=b[I]=N;O.opera?(k=d(K)[0]).text="jQuery('#"+b.id+"')[0]."+u+"()":b[P]=P}b.src=c;f.insertBefore(b,f.firstChild);k&&f.insertBefore(k,f.firstChild)}},0);return a}var P="async",T="charset",r="",M="error",L="_jqjsp",t="onclick",u="on"+M,I="onload",H="onreadystatechange",J="removeChild",K="<script/>",z="success",B="timeout",O=d.browser,
f=d("head")[0]||document.documentElement,q={},S=0,p,C={callback:L,url:location.href};x.setup=function(a){d.extend(C,a)};d.jsonp=x})(jQuery,setTimeout);

(function( $ ){

	// jQuery getImageData Plugin
	$.getImageData = function(args) {
	
		var regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	
		// If a URL has been specified
		if(args.url) {
		
			// Ensure no problems when using http or http
			var is_secure = location.protocol === "https:";
			var server_url = "";
		
			// If url specified and is a url + if server is secure when image or user page is
			if(args.server && regex_url_test.test(args.server) && !(is_secure && args.server.indexOf('http:') == 0)) {
				server_url = args.server;
			} else server_url = "//img-to-json.appspot.com/";
		
			server_url += "?callback=?";
		
			// Using jquery-jsonp (http://code.google.com/p/jquery-jsonp/) for the request
			// so that errors can be handled
			$.jsonp({	
				url: server_url,
				data: { url: escape(args.url) },
				dataType: 'jsonp',
				timeout: 10000,
				// It worked!
				success: function(data, status) {
			
					// Create new, empty image
					var return_image = new Image();
				
					// When the image has loaded
					$(return_image).load(function(){
					
						// Set image dimensions
						this.width = data.width;
						this.height = data.height;
					
						// Return the image
						if(typeof(args.success) == typeof(Function)) {
							args.success(this);
						}
					
					// Put the base64 encoded image into the src to start the load
					}).attr('src', data.data);
				
			  },
				// Something went wrong.. 
				error: function(xhr, text_status){
					// Return the error(s)
					if(typeof(args.error) == typeof(Function)) {
						args.error(xhr, text_status);
					}
				}
			});
		
		// No URL specified so error
		} else {
			if(typeof(args.error) == typeof(Function)) {
				args.error(null, "no_url");
			}
		}
	};

})(jQuery);
