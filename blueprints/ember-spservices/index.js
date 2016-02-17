module.exports = {
  description: '',

  normalizeEntityName: function() {
  },

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function() {
    return this.addBowerPackageToProject('sp-services', '2014.02');
  }
};
