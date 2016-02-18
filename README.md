# Ember-spservices

This ember-cli addon provides a wrapper for the `jQuery.SPServices` library.

https://github.com/sympmarc/SPServices

This addon installs version 2014.01 of the library.

## Documentation

Docs for the `jQuery.SPServices` library can be found here: https://spservices.codeplex.com/documentation

Docs for this addon are in the source code and can be generated using yuidoc.

## Installation

* `ember install ember-spservices`

## Use

Once installed the `jQuery.SPServices` library can be used.  The library is
available at `Ember.$().SPServices`.  For more information and instructions for
use follow the documentation on the SPServices site linked to above.

```
import Ember from 'ember'

export default Ember.Controller.extend({

  doSomething: Ember.computed(function () {

    Ember.$().SPServices({
      // ... do something with the SPServices library
    });

  })
});
```

### SpServices Service

Additionally, the addon provides an `SpServices` Service that makes working with
the library a bit more ember friendly.

```
import Ember from 'ember'

export default Ember.Controller.extend({

  spServices: Ember.inject.service(), // inject the service

  doSomething: Ember.computed(function () {
    let spServices = this.get('spServices');

    // ...do something with the `spServices` service
  })
});
```

The `spServices` service provides a few shortcuts to functions of the `jQuery.SPServices`
library.

For example, get the current user:

```
import Ember from 'ember'

export default Ember.Controller.extend({

  spServices: Ember.inject.service(), // inject the service

  currentUser: Ember.computed(function () {
    return this.get('spServices').getCurrentUser();
  })
});
```

The `spServices` service also gives us direct access to the `jQuery.SPServices`
library on the property `_SPServices`.

```
import Ember from 'ember'

export default Ember.Controller.extend({

  spServices: Ember.inject.service(), // inject the service

  doSomething: Ember.computed(function () {
    let SPServices = this.get('spServices._SPServices');

    // work with the `SPServices` library directly...
    SPServices({
      // ...do your stuff
    });
  })
});
```

# Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
