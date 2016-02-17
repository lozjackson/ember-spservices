/**
  @module ember-spservices
*/
import Ember from 'ember';

const computed = Ember.computed;

/**
  @class FieldVersionObject
  @namespace Objects
*/
export default Ember.Object.extend({

  /**
    ## Value

    The value of the field.

    @property value
    @type {Any}
  */
  value: null,

  /**
    ## Modified

    When the version was modified.

    This is a string with a timestamp.  ie. `2015-11-13T10:20:02Z`

    @property modified
    @type {String}
  */
  modified: null,

  /**
    ## Editor

    The editor is a string in the following format

    ```
    '11;#Test User,#DOMAIN\testuser,#test.user@example.com,#,#Test User'
    ```

    @property editor
    @type {String}
  */
  editor: null,

  /**
    Computed Property.

    A Date object - When the version was modified

    @property _modified
    @type {Object}
  */
  _modified: computed('modified', function () {
    let modified = this.get('modified');
    return new Date(modified).getTime();
  }),

  /**
    Computed Property.

    The `id` of the version editor.

    @property _editorId
    @type {Integer}
  */
  _editorId: computed('editor', function () {
    let editor = this.get('editor');
    if (editor) {
      let array = editor.split(';#');
      if (array.length) {
        return array[0];
      }
    }
    return;
  })
});
