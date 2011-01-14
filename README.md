$.getImageData
==============
*Version: 0.3*

This project is aimed at developers who don't have the ability, don't want to or don't have time to create a proxy script on their server to get images from different domains or origins. It enables pixel level access to images from different origins. It works by sending a JSONP request with the URL of the image to Google's servers via the Google App Engine. The server then converts the image into base64 encoded data URL and sends the image back as a JSON object. This means that the image can be locally included on the website and therefore it can be edited by the canvas tag.

For detailed usage instructions and examples please see: [http://www.maxnov.com/getimagedata/][project_url]

[project_url]: http://www.maxnov.com/getimagedata/

To Do
-----

 * Add more server examples - the more the better!
 * Add fallback servers so if the Google App Engine is down for whatever reason (quota exceeded) then it can fallback to one of them - **Please let me know if you can host one**.
 * More demos that show of a bit more what is possible *(Idea: <del>3D cube with images from Flickr on it</del> - Tried this out in three.js and it's possible to add image textures from another domain without the work-around.)*.

Changelog
---------

Version 0.3 - 13/01/11

 * Created a node.js server. Read more about it here
 * Removed the reliance on my domain maxnov.com - Only uses GAE servers now in case my server goes down *again* 

Version 0.2 - 13/09/10

 * Added two example servers, written in PHP and Python - **Please contribute by adding your own!!**
 * Added ability to specify the server URL using the `server` parameter

Version 0.1 - 3/09/10

 * Created script and Google App Engine Back-end