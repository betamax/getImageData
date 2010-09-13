<?php
/**
 * Groups configuration for default Minify implementation
 * @package Minify
 */

/** 
 * You may wish to use the Minify URI Builder app to suggest
 * changes. http://yourdomain/min/builder/
 *
 * See http://code.google.com/p/minify/wiki/CustomSource for other ideas
 **/

return array(
    'js' => array(
							'//js/jquery.scrollto.js', 
							'//js/scripts.js',
							'//js/shCore.js',
							'//js/shBrushJScript.js',
							'//js/shBrushXml.js'
						),
    'css' => array(
							 '//css/style.css', 
							 '//css/shCore.css'
						 ),
		'theme' => array(
					 '//css/shThemeDefault.css'
				 ),
		'theme-dark' => array(
					 '//css/shThemeRDark.css'
				 ),
   'css-example' => array(
							 '//css/style-demo.css'
						 ),
);