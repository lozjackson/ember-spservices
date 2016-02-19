/**
  @module ember-spservices
*/
import Ember from 'ember';
import FieldVersionObject from 'ember-spservices/objects/field-version';

/**
  # SpServices Service

  This is a wrapper around the jQuery.SPServices library.

  https://github.com/sympmarc/SPServices

  Docs for the `jQuery.SPServices` library can be found here: https://spservices.codeplex.com/documentation

  The `jQuery.SPServices` library is available at `Ember.$().SPServices`.  For
  more information and instructions for using the library follow the documentation
  on the SPServices site linked to above.

  ```
  // do something with the SPServices library
  Ember.$().SPServices({
    // ...
  });
  ```

  The `SpServicesService` provides a few shortcuts to methods of the `jQuery.SPServices`
  library.

  For example, get the current user:

  ```
  let currentUser = this.get('spServices').getCurrentUser();
  ```

  used in a component...

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

  ## Methods available

  Methods available on the `SpServicesService`:

  ### getCurrentUser

  ```
  getCurrentUser( fieldNames );
  ```

  Params

  * `fieldNames` {Array}  Optional.  An array of field names.

  An Ember.Object is returned for the current user.

  ```
  let currentUser = this.get('spServices').getCurrentUser(["ID", "Name"]);

  currentUser.get('id') // ID
  currentUser.get('name') // Name
  ```

  ### getVersionCollection

  ```
  spServices.getVersionCollection( listName, itemId, fieldName, results );
  ```

  Params

  * `listName` {String}  Required.  The name of the list.
  * `itemId` {Integer}  Required.  The `Id` of the list item.
  * `fieldName` {String}  Required.  The name of the field.
  * `results` {Array|Function} Required.  Either an array to store the results in, or a callback function.

  The following example will get the version collection for the `Description` field,
  for a list item with `Id` of `1`, from the list called "ExampleList" and store
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

  @class SpServicesService
  @namespace Services
*/
export default Ember.Service.extend({

  /**
    The `SPServices` library.

    @property _SPServices
    @type {Object}
    @private
  */
  _SPServices: Ember.$().SPServices,

  /**
    ## GetCurrentUser

    Get the current user using the `SPServices.SPGetCurrentUser` method.
    An `Ember.Object` is returned with camelized field names as keys.

    You can pass in an array of field names to be collected.

    ```
    let currentUser = spServices.getCurrentUser(["ID", "Name"]);
    currentUser.get('id') // ID
    currentUser.get('name') // Name
    ```

    If you don't pass in an array of field names then the default set will be collected.

    The default set of fields are: `['ID', 'Name', 'Title', 'EMail']`

    @method getCurrentUser
    @param {Array} fieldNames
    @return {Object}
  */
  getCurrentUser(fieldNames) {
    let currentUser;
    let hash = {};
    let _SPServices = this.get('_SPServices');
    if (!_SPServices) { return; }
    currentUser = _SPServices.SPGetCurrentUser({
      fieldNames: fieldNames || ['ID', 'Name', 'Title', 'EMail']
    });
    Object.keys(currentUser).forEach(function (key) {
      hash[ (key === 'ID') ? 'id' : Ember.String.camelize(key) ] = currentUser[key];
    });
    return Ember.Object.create(hash);
  },

  /**
    ## GetGroupCollectionFromUser

    @method getGroupCollectionFromUser
    @param {String} userLoginName
    @param {Array|Function} results
  */
  getGroupCollectionFromUser(userLoginName, results) {
    let fields = {id:'ID', name:'Name', description:'Description', ownerId:'OwnerID', ownerIsUser:'OwnerIsUser'};
    let keys = Object.keys(fields);
    let _SPServices = this.get('_SPServices');
    _SPServices({
      operation: "GetGroupCollectionFromUser",
      userLoginName: userLoginName,
      async: false,
      completefunc: function ( xData, status ) {
        if (typeof results !== 'undefined') {
          if (typeof results === 'function') {
            results.call(this, xData, status);
          } else {
            if (xData.responseXML) {
              Ember.$(xData.responseXML).find( "Group" ).each(function (i, group) {
                let hash = {};
                keys.forEach(function (key) {
                  hash[key] = Ember.$(group).attr(fields[key]);
                });
                results.pushObject(Ember.Object.create(hash));
              });
            }
          }
        }
      }
    });
  },

  /**
    ## GetVersionCollection

    Call the `GetVersionCollection` operation.  You can pass in an array which
    will be populated with `FieldVersionObjects`, or you can pass in a callback
    function.

    An example, passing in an array.

    ```
    // an array to store the version collection in
    let versionCollection = Ember.A();

    spServices.getVersionCollection(listName, itemId, fieldName, versionCollection);
    ```

    The version collection will then be stored in the `versionCollection` property
    and is an array of `FieldVersionObjects` populated with data from the field
    version.

    Alternatively you can pass in a callback function.

    ```
    let callback = function (xData, status) {
      //...
    };

    spServices.getVersionCollection(listName, itemId, fieldName, callback);
    ```

    @method getVersionCollection
    @param {String} strlistID
    @param {String} strlistItemID
    @param {String} strFieldName
    @param {Array|Function} results
  */
  getVersionCollection(strlistID, strlistItemID, strFieldName, results) {
    let _SPServices = this.get('_SPServices');
    if (!_SPServices || !strlistID || !strlistItemID || !strFieldName) { return; }
    _SPServices({
      operation: "GetVersionCollection",
      async: true,
      strlistID: strlistID,
      strlistItemID: strlistItemID,
      strFieldName: strFieldName,
      completefunc: function (xData , status) {
        if (typeof results !== 'undefined') {
          if (typeof results === 'function') {
            results.call(this, xData, status);
          } else {
            Ember.$(xData.responseText).find("Version").each(function(/*i*/) {
              results.pushObject(FieldVersionObject.create({
                value: Ember.$(this).attr(strFieldName),
                modified: Ember.$(this).attr("Modified"),
                editor: Ember.$(this).attr("Editor")
              }));
            });
          }
        }
      }
    });
  }
});
