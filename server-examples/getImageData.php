<?
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
 *  DESCRIPTION: Simple PHP script to fetch an image and return 
 *  it as a base64 encoded string. Part of jQuery getImageData 
 *  Plugin (http://www.maxnov.com/getimagedata).
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  Copyright 2010, Max Novakovic
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://www.maxnov.com/getimagedata/#license
 * 
 */

try {
	
	// Check if the URL is set
	if(isset($_GET["url"])) {
		
		// Get the URL and decode to remove any %20, etc
		$url = urldecode($_GET["url"]);
		
		// Get the contents of the URL
		$file = file_get_contents($url);
	
		// Check if it is an image
		if(@imagecreatefromstring($file)) {
		
			// Get the image information
			$size = getimagesize($url);
			// Image type
			$type = $size["mime"];
			// Dimensions
			$width = $size[0];
			$height = $size[1];
			
			// Setup the data URL
			$type_prefix = "data:" . $type . ";base64,";

			// Encode the image into base64
			$base64file = base64_encode($file);

			// Combine the prefix and the image
			$data_url = $type_prefix . $base64file;
		
			// Setup the return data
			$return_arr = array(
				'width'=> $width,
				'height'=> $height,
				'data'=> $data_url
			);
													
			// Encode it into JSON
			$return_val = json_encode($return_arr);
		
			// If a callback has been specified
			if(isset($_GET["callback"])) {
			
				// Wrap the callback around the JSON
				$return_val = $_GET["callback"] . '(' . $return_val . ');';
			
				// Set the headers to JSON and so they wont cache or expire
				header('Cache-Control: no-cache, must-revalidate');
				header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
				header('Content-type: application/json');
			
				// Print the JSON
				print $return_val;
			
			// No callback was set
			} else {
				header('HTTP/1.0 400 Bad Request');
				print "No callback specified";
			}
		
		// The requested file is not an image
		} else {
			header('HTTP/1.0 400 Bad Request');
			print "Invalid image specified";
		}
	
	// No URL set so error
	} else {
		header('HTTP/1.0 400 Bad Request');
		echo "No URL was specified";
	}

} catch (Exception $e) {	
	header('HTTP/1.0 500 Internal Server Error');
	echo "Internal Server Error";
}

?>