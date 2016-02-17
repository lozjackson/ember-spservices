/**
  @module ember-spservices
*/
import Ember from 'ember';
import FieldVersionObject from 'ember-spservices/objects/field-version';

/**
  ## SpServices Service

  This is a wrapper around the jQuery.SPServices library.

  https://github.com/sympmarc/SPServices

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

    The version collection will then be stored in the `versionCollection` property.

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
