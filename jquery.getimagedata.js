/*
 *
 *  jQuery $.getImageData Plugin 0.2
 *  http://www.maxnov.com/getimagedata
 *  
 *  Written by Max Novakovic (http://www.maxnov.com/)
 *  Date: Mon Sep 13 2010
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  Includes jQuery JSONP Core Plugin 2.1.2
 *  http://code.google.com/p/jquery-jsonp/
 *  Copyright 2010, Julian Aubourg
 *  Released under the MIT License.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  Copyright 2010, Max Novakovic
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://www.maxnov.com/getimagedata/#license
 * 
 */

// jquery.jsonp 2.1.2 (c)2010 Julian Aubourg | MIT License
// http://code.google.com/p/jquery-jsonp/
(function(e,b){function d(){}function t(C){c=[C]}function m(C){f.insertBefore(C,f.firstChild)}function l(E,C,D){return E&&E.apply(C.context||C,D)}function k(C){return/\?/.test(C)?"&":"?"}var n="async",s="charset",q="",A="error",r="_jqjsp",w="on",o=w+"click",p=w+A,a=w+"load",i=w+"readystatechange",z="removeChild",g="<script/>",v="success",y="timeout",x=e.browser,f=e("head")[0]||document.documentElement,u={},j=0,c,h={callback:r,url:location.href};function B(C){C=e.extend({},h,C);var Q=C.complete,E=C.dataFilter,M=C.callbackParameter,R=C.callback,G=C.cache,J=C.pageCache,I=C.charset,D=C.url,L=C.data,P=C.timeout,O,K=0,H=d;C.abort=function(){!K++&&H()};if(l(C.beforeSend,C,[C])===false||K){return C}D=D||q;L=L?((typeof L)=="string"?L:e.param(L,C.traditional)):q;D+=L?(k(D)+L):q;M&&(D+=k(D)+escape(M)+"=?");!G&&!J&&(D+=k(D)+"_"+(new Date()).getTime()+"=");D=D.replace(/=\?(&|$)/,"="+R+"$1");function N(S){!K++&&b(function(){H();J&&(u[D]={s:[S]});E&&(S=E.apply(C,[S]));l(C.success,C,[S,v]);l(Q,C,[C,v])},0)}function F(S){!K++&&b(function(){H();J&&S!=y&&(u[D]=S);l(C.error,C,[C,S]);l(Q,C,[C,S])},0)}J&&(O=u[D])?(O.s?N(O.s[0]):F(O)):b(function(T,S,U){if(!K){U=P>0&&b(function(){F(y)},P);H=function(){U&&clearTimeout(U);T[i]=T[o]=T[a]=T[p]=null;f[z](T);S&&f[z](S)};window[R]=t;T=e(g)[0];T.id=r+j++;if(I){T[s]=I}function V(W){(T[o]||d)();W=c;c=undefined;W?N(W[0]):F(A)}if(x.msie){T.event=o;T.htmlFor=T.id;T[i]=function(){T.readyState=="loaded"&&V()}}else{T[p]=T[a]=V;x.opera?((S=e(g)[0]).text="jQuery('#"+T.id+"')[0]."+p+"()"):T[n]=n}T.src=D;m(T);S&&m(S)}},0);return C}B.setup=function(C){e.extend(h,C)};e.jsonp=B})(jQuery,setTimeout);

// jQuery getImageData Plugin
jQuery.getImageData = function(args) {
	
	var regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	
	// If a URL has been specified
	if(args.url) {
		
		// Ensure no problems when using http or http
		var is_secure = location.protocol === "https:";
		var server_url = "";
		
		// If url specified and is a url + if server is secure when image or user page is
		if(args.server && regex_url_test.test(args.server) && (args.server.indexOf('https:') && (is_secure || args.url.indexOf('https:')))) {
			server_url = args.server;
		} else {
			server_url = !args.url.indexOf('https:') || is_secure ? "https://img-to-json.appspot" : "http://img-to-json.maxnov";
			server_url += ".com/?callback=?";
		}
		
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
}

