# Cylon.js For Intel Iot Analytics

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things using Node.js

This repository contains the Cylon adaptor for Intel's Iot Analytics platform.

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-intel-iot-analytics.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-intel-iot-analytics) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-intel-iot-analytics/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-intel-iot-analytics) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-intel-iot-analytics/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-intel-iot-analytics)

## Getting Started

Install the module with: `npm install cylon-intel-iot-analytics`

## Examples

## Connecting

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'intel-iot-analytics', adaptor: 'intel-iot-analytics' },
  device: {name: 'intel-iot-analytics', driver: 'intel-iot-analytics'},

  work: function(my) {
    // provide an example of your module here
  }
}).start();
```

Explain how to connect from the computer to the device here...

## Documentation

We're busy adding documentation to [cylonjs.com](http://cylonjs.com). Please check there as we continue to work on Cylon.js.

Thank you!

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

None yet...

## License

Copyright (c) 2015 The Hybrid Group. Licensed under the Apache 2.0 license.
