/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-spservices',

  included: function (app) {
    this._super.included(app);
    app.import('bower_components/sp-services/dist/jquery.SPServices-2014.01.js');
  }
};
