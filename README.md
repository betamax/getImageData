$.getImageData
==============

$.getImageData allows anyone to get an image from another domain and have pixel level access to it using the getImageData() method. It works by sending a request with the URL of the image to google's servers via the Google App Engine. The server then converts the image into base64 encoded data URL and sends the image back as a JSON object. This means that the image can be locally included on the website and therefore it can be edited by the canvas tag.

For detailed usage instructions and examples please see: [http://www.maxnov.com/getimagedata/][project_url]

[project_url]: http://www.maxnov.com/getimagedata/

To Do
-----

 * Add more server examples - the more the better!
 * Add fallback servers so if the Google App Engine is down for whatever reason (quota exceeded) then it can fallback to one of them - **Please let me know if you can host one**.
 * More demos that show of a bit more what is possible *(Idea: 3D cube with images from Flickr on it)*.

Changelog
---------

Version 0.2 - 13/09/10

 * Added two example servers, written in PHP and Python - **Please contribute by adding your own!!**
 * Added ability to specify the server URL using the `server` parameter

Version 0.1 - 3/09/10

 * Created script and Google App Engine Back-end