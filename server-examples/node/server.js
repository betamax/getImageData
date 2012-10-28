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
 *  DESCRIPTION: Node server used to fetch an image and return 
 *  it as a base64 encoded string. Part of jQuery getImageData 
 *  Plugin (http://www.maxnov.com/getimagedata).
 * 
 *  THANKS: To bxjx (http://stackoverflow.com/users/373903) for
 *  his support in getting this working.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  
 *  Copyright 2011, Max Novakovic
 *  Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://www.maxnov.com/getimagedata/#license
 * 
 */

// Include dependencies
var express = require('express'),
request = require('request'),
BufferList = require('bufferlist').BufferList,
gm = require('gm'),
http = require('http'),
fs = require('fs'),
sys = require('sys');

// Create the server
var app = express.createServer(
	express.logger()
);

// When requesting the root
app.get('/', function(req, res){
	
	// If a URL and callback parameters are present 
	if(req.param("url") && req.param("callback")) {
		
		// Get the parameters
		var url = unescape(req.param("url")),
		callback = req.param("callback"),
		
		// Create a BufferList
		bl = new BufferList();
		
		// Couldn't have done this without the help of bxjx (http://stackoverflow.com/users/373903)
		request({ uri:url, responseBodyStream: bl}, function (error, response, body) {
			
			// If the request was OK
			if (!error && response.statusCode == 200) {
				
				// Check if the mimetype says it is an image
				var mimetype = response.headers["content-type"];
				if(mimetype == "image/gif" || mimetype == "image/jpeg" || 
				   mimetype == "image/jpg" || mimetype == "image/png" || 
				   mimetype == "image/tiff") {
					
					// Create the prefix for the data URL
					var type_prefix = "data:" + mimetype + ";base64,",
					
					// Get the image from the response stream as a string and convert it to base64
					image = new Buffer(bl.toString(), 'binary'),
					image_64 = image.toString('base64'); 
					
					// Concat the prefix and the image
					image_64 = type_prefix + image_64;
					
					// Set width and height to 0
					var width = 0, 
					height = 0,
					
					// Get the image filename
					filename = "/tmp/" + url.substring(url.lastIndexOf('/')+1),
					
					// Create a WriteStream for the image
					out = fs.createWriteStream(filename);
					// Save it
					out.write(image);
					out.end();
		
					// Get the image dimensions using GraphicsMagick
					gm(filename).size(function(err, size){
						
						// Delete the tmp image
						fs.unlink(filename);
						
						// Error getting dimensions
						if(err) res.send("Error getting image dimensions", 400);
						else {
							
							width = size.width;
							height = size.height;
					
							// The data to be returned 
							var return_variable = {
								"width": width,
								"height": height,
								"data": image_64
							};
					
							// Stringifiy the return variable and wrap it in the callback for JSONP compatibility
							return_variable = callback + "(" + JSON.stringify(return_variable) + ");";
					
							// Set the headers as OK and JS
							res.writeHead(200, {'Content-Type': 'application/javascript; charset=UTF-8'});
					
							// Return the data
							res.end(return_variable);
						
						}
					
					});
					
				// File type was not a supported image
				} else res.send("This file type is not supported", 400);
				
			// Error getting the image
			} else res.send("Third-party server error", response.statusCode);
			
		});
		
	// Missing parameters	
	} else res.send("No URL or no callback was specified. These are required", 400);
	
});

// Handle 404 and 500 errors
app.get('/404', function(req, res){
	throw new Error('Page not found');
});
app.get('/500', function(req, res){
	throw new Error('Server error');
});

// Run the server on port 3000
app.listen(3000);
