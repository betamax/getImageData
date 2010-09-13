'''
 '
 '  jQuery $.getImageData Plugin 0.2
 '  http://www.maxnov.com/getimagedata
 '
 '  Written by Max Novakovic (http://www.maxnov.com/)
 '  Date: Mon Sep 13 2010
 '
 ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 '
 '  DESCRIPTION: Simple python HTTP server to fetch an image and 
 '  return it as a base64 encoded string. Part of jQuery  
 '  getImageData Plugin (http://www.maxnov.com/getimagedata).
 '
 ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 '
 '  NOTES: This requires simplejson to work. Please visit:
 '  http://pypi.python.org/pypi/simplejson/ for more information
 '  or alternatively, google 'install simplejson python'.
 '
 ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 '
 '  Copyright 2010, Max Novakovic
 '  Dual licensed under the MIT or GPL Version 2 licenses.
 '  http://www.maxnov.com/getimagedata/#license
 '
'''

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import Image, base64, urllib2, cStringIO, simplejson
from urlparse import urlparse, parse_qs

class GetImageDataServer(BaseHTTPRequestHandler):

	# This is called if a get request
	def do_GET(self):
		
		# Surround everything in a try/except
		try:
			
			# Get the parameters from the URL
			query = parse_qs(urlparse(self.path).query)
			
			# If the user has specified a URL
			if 'url' in query:
				
				url = query['url'][0]
				
				try:
					
					# Get the image
					f = urllib2.urlopen(urllib2.unquote(url))
					
					# If server with the image responds with 200
					if f.code == 200:
						
						# Create holder for the image
						im = cStringIO.StringIO(f.read())
						
						# Open the image with PIL
						image = Image.open(im)
						
						# Get its width and height
						width, height = image.size
						
						# Create the structure for the data URL
						type_prefix = "data:image/" + image.format.lower() + ";base64,"
						
						# Convert the image to base64
						return_image = base64.b64encode(im.getvalue())
						
						# Construct the response
						data = simplejson.dumps({
							"width": width,
							"height": height,
							"data": type_prefix + return_image
						})
						
						# If a callback has been specified
						if 'callback' in query:
							callback = query['callback'][0]
							
							# Add the callback to the end for cross-domain JSON
							data = callback + '(' + data + ');'
							
							# Return the JSON
							self.send_response(200)
							self.send_header('Content-type',	'application/json')
							self.end_headers()
							self.wfile.write(data)
							return
						
						# If no callback was specified
						else: 
							self.send_error(400,'No callback specified')
					
					# If server with the image responded with something other than 200
					else:
						status_code = f.code
						self.send_error(status_code,'Third-party server error')
				
				# If urllib errors
				except urllib2.HTTPError, e:
					if e.code == 404:
						self.send_error(404, e)
					else:
						self.send_error(500, e)
				except urllib2.URLError, e:
					print "URLError",e
				
			# If the URL was not specified in the request
			else:
				self.send_error(400,'No URL sepcified')
		
		# Catch any other error
		except:
			self.send_error(500,'Server error')

# Starting the server
def main():
	try:
		# Start the server on http://127.0.0.1:8800/ 
		# NB: This can be changed if running on a remote server
		server = HTTPServer(('127.0.0.1', 8800), GetImageDataServer)
		print 'Started $.getImageData server...'
		server.serve_forever()
	except KeyboardInterrupt:
		print 'Shutting down server...'
		server.socket.close()

if __name__ == '__main__':
	main()

