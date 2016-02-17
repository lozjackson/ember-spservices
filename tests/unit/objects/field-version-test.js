import { moduleFor, test } from 'ember-qunit';

moduleFor('object:field-version', {
});

test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});

test('_modified', function(assert) {
  var object = this.subject();
  object.set('modified', '2015-11-13T10:20:02Z');
  assert.equal(object.get('_modified'), new Date('2015-11-13T10:20:02Z').getTime());
});

test('_editorId', function(assert) {
  var object = this.subject();
  object.set('editor', `11;#Test User,#DOMAIN\testuser,#test.user@example.com,#,#Test User`);
  assert.equal(object.get('_editorId'), 11);
});
