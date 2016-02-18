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
// do something with the SPServices library
Ember.$().SPServices({
  // ...
});
```

Used in a component...

```
import Ember from 'ember'

export default Ember.Component.extend({

  doSomething() {

    // do something with the `jQuery.SPServices` library
    Ember.$().SPServices({
      // ...
    });

  }
});
```

### SpServicesService

Additionally, the addon provides an `Ember.Service` that makes working with
the library a bit more ember friendly.

```
import Ember from 'ember'

export default Ember.Component.extend({

  spServices: Ember.inject.service(), // inject the service

  doSomething: Ember.computed(function () {
    let spServices = this.get('spServices');

    // ...do something with the `spServices` service
  })
});
```

The `SpServicesService` provides a few shortcuts to functions of the `jQuery.SPServices`
library.

For example, get the current user:

```
let currentUser = this.get('spServices').getCurrentUser();
```

```
import Ember from 'ember'

export default Ember.Component.extend({

  spServices: Ember.inject.service(), // inject the service

  currentUser: Ember.computed(function () {
    return this.get('spServices').getCurrentUser();
  })
});
```

The `SpServicesService` also gives us direct access to the `jQuery.SPServices`
library on the property `_SPServices`.

```
import Ember from 'ember'

export default Ember.Component.extend({

  spServices: Ember.inject.service(), // inject the service

  doSomething: Ember.computed(function () {
    let SPServices = this.get('spServices._SPServices');

    // work with the `jQuery.SPServices` library directly...
    SPServices({
      // ...do your stuff
    });
  })
});
```

### Methods available

Methods available on the `SpServicesService`:

* getCurrentUser

  ```
  getCurrentUser( fieldNames );
  ```

  - fieldNames {Array}  Optional.  An array of field names.


  ```
  let currentUser = this.get('spServices').getCurrentUser(["ID", "Name"]);

  currentUser.get('id') // ID
  currentUser.get('name') // Name
  ```

* getVersionCollection

  ```
  spServices.getVersionCollection( listName, itemId, fieldName, results );
  ```

  - listName {String}  The name of the list.
  - itemId {Integer}  The `Id` of the list item.
  - fieldName {String}  The name of the field.
  - results {Array|Function} Either an array to store the results in, or a callback function.

  The following example will get the version collection for the `Description` field,
  for a list item with `Id` of `1`, from the list called `ExampleList` and store
  the results in the `versionCollection` array.

  ```
  let versionCollection = Ember.A(); // an array to store the version collection in

  spServices.getVersionCollection("ExampleList", 1, "Description", versionCollection);
  ```

  Alternatively you can pass in a callback function.

  ```
  let callback = function (xData, status) {
    //... do something with `xData`
  };

  spServices.getVersionCollection(listName, itemId, fieldName, callback);
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
