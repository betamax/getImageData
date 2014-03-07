$.getImageData: Node.js server
==============

This is an implementation of the Google App Engine server using Node.js. For information about how the server works, please look at the [source code][server_source] because it is well commented.

[server_source]: https://github.com/betamax/getImageData/blob/master/server-examples/node/server.js

Requirements
-----

 * [Node.js][node_link]
 * [GraphicsMagick][graphicsmagick]

Installation
-----

Firstly, you will need node.js which you can get [here][node_install].

As a dependency to the gm module, you will need to install [GraphicsMagick][graphicsmagick] which you can do with the following command (it requires [homebrew][homebrew]) on OS X:

    brew install graphicsmagick

To download the server, you can run this command:

    git clone git://github.com/betamax/getImageData.git

Note: this will download all the files from the project. Alternatively, you can download the project from github using the download button.

To install the dependencies of the project run:

    npm install

That should be all you need to do to get the server running.

[node_install]: http://nodejs.org/download/
[graphicsmagick]: http://www.graphicsmagick.org/
[homebrew]: https://github.com/mxcl/homebrew
[node_link]: http://nodejs.org/
[express_link]: http://github.com/visionmedia/express/tree/master
[bufferlist_link]: http://github.com/substack/node-bufferlist
[gm_link]: http://github.com/aheckmann/gm
[connect_link]: http://registry.npmjs.org/connect/-/connect-0.5.4.tgz

Running the server
-----

To run the server, in a terminal window navigate to the location of the server and then run:

    node server.js

This will run the server on port 3000. The URL of the server will be http://127.0.0.1:3000/ or if you are running the server on a remote server then it will be http://[server_ip]:3000/.

Hooking it up to $.getImageData
-----

Using $.getImageData all you need to do to connect it to the node server is change the server parameter when initialising the plugin like so:

    $.getImageData({
      url: "http://www.google.co.uk/images/logos/ps_logo2.png",
      server: "http://127.0.0.1:3000/"
      success: callback(image){

      }
    });


Changelog
---------

07/03/14

 * Removed node_modules from git and created package.json to handle them instead
 * Updated server code so that it runs with latest dependencies

13/01/11

 * Created the server and this documentation