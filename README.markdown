# Cylon.js For IntelIotAnalytics

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and
physical computing using Node.js

This repository contains the Cylon adaptor for IntelIotAnalytics.

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

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using `make test` and `make lint`.

## Release History

None yet...

## License

Copyright (c) 2014 Your Name Here. See `LICENSE` for more details
