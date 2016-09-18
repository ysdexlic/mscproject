### Getting started

Install **node.js**. Then **gulp** and **bower**.

    $ npm -g install gulp bower

Install bower and npm dependencies, and run the application in development mode.

    $ npm install
    $ bower install
    $ gulp serve

You are now ready to go, your application is available at **http://127.0.0.1:3000**.

**Every file you add, edit or delete into the `/client` folder will be handled by the build system**.

When you are ready to build a production release there is a task for that:

    $ gulp serve:dist


Available tasks:

* **gulp serve** - When this task runs, the build will take care of watching files. Every time you change a file in the `client/` folder, the build recompiles every file, and your browser will reload automagically showing you the changes.
You just need to add new JavaScript and css files in the `client/index.html` file.
* **gulp serve:dist** - This task will run jshint and unit tests under the `client/test/unit` folder (thanks to `karma runner`), and create a fully-optimized version of your application under the `build/dist/` folder. The optimization consists of concatenate, minify and compress js and css files, optimize images, and put every template into a js file loaded by the application.
A code coverage report will be available inside the `client/test/unit-results`.
**Note to change browser-sync's server port, change the 'port' and 'uiIPort' settings in build/build.config.js.**
* **gulp serve:tdd** - Just like `gulp serve` but in continuous unit testing environment.
* **gulp test:unit** - For running unit tests one time then exit.
* **gulp test:e2e** - Run end-to-end tests inside the `client/test/e2e` folder with `protractor`. If a test fails, you should find a screenshot of the page inside the `client/test/screenshots` folder.
**Note that you need to have the application running in order to run e2e tests. You can launch this task from another terminal instance.**
