import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:sp-services', 'Unit | Service | sp services', {
});

test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

test('getCurrentUser() method', function(assert) {
  assert.expect(10);
  var service = this.subject();
  service.set('_SPServices', {
    SPGetCurrentUser: (obj) => {
      assert.equal(obj.fieldNames.length, 4);
      assert.equal(obj.fieldNames[0], 'ID');
      assert.equal(obj.fieldNames[1], 'Name');
      assert.equal(obj.fieldNames[2], 'Title');
      assert.equal(obj.fieldNames[3], 'EMail');
      return {
        ID: 10,
        Name: `Domain\Test.User`,
        Title: 'Test User',
				EMail: 'test.user@example.com'
			};
    }
  });

  let user = service.getCurrentUser();
  assert.ok(service);
  assert.equal(user.get('id'), 10);
  assert.equal(user.get('name'), `Domain\Test.User`);
  assert.equal(user.get('title'), 'Test User');
  assert.equal(user.get('eMail'), 'test.user@example.com');
});

test('getCurrentUser() method - pass in fieldNames', function(assert) {
  assert.expect(6);
  var service = this.subject();
  service.set('_SPServices', {
    SPGetCurrentUser: (obj) => {
      assert.equal(obj.fieldNames.length, 2);
      assert.equal(obj.fieldNames[0], 'ID');
      assert.equal(obj.fieldNames[1], 'Name');
      return {
        ID: 10,
        Name: 'Test User'
			};
    }
  });

  let user = service.getCurrentUser(["ID", "Name"]);
  assert.ok(service);
  assert.equal(user.get('id'), 10);
  assert.equal(user.get('name'), 'Test User');
});

test('getGroupCollectionFromUser() method - pass in an array', function(assert) {
  assert.expect(16);
  var service = this.subject();
  let groups = Ember.A();
  let userLoginName = `test.user`;
  let xml = `<Groups>
    <Group
      ID="1"
      Name="Administrators"
      Description="Admin Group"
      OwnerID="2"
      OwnerIsUser="False" />
    <Group
      ID="3"
      Name="IT Support Staff"
      Description="Group for IT Support staff"
      OwnerID="4"
      OwnerIsUser="True" />
  </Groups>`;
  service.set('_SPServices', (obj) => {
    // assert.ok(true)
    assert.equal(obj.operation, 'GetGroupCollectionFromUser');
    assert.equal(obj.async, false);
    assert.equal(obj.userLoginName, userLoginName);
    assert.equal(typeof obj.completefunc, 'function');
    obj.completefunc({
      responseXML: Ember.$.parseXML(xml)
    });
  });


  service.getGroupCollectionFromUser(userLoginName, groups);
  assert.ok(service);
  assert.equal(groups.get('length'), 2, `should be 2 groups`);

  assert.equal(groups.objectAt(0).get('id'), 1);
  assert.equal(groups.objectAt(0).get('name'), 'Administrators');
  assert.equal(groups.objectAt(0).get('description'), 'Admin Group');
  assert.equal(groups.objectAt(0).get('ownerId'), 2);
  assert.equal(groups.objectAt(0).get('ownerIsUser'), 'False');

  assert.equal(groups.objectAt(1).get('id'), 3);
  assert.equal(groups.objectAt(1).get('name'), 'IT Support Staff');
  assert.equal(groups.objectAt(1).get('description'), 'Group for IT Support staff');
  assert.equal(groups.objectAt(1).get('ownerId'), 4);
  assert.equal(groups.objectAt(1).get('ownerIsUser'), 'True');
});

test('getGroupCollectionFromUser() method - pass in a callback function', function(assert) {
  assert.expect(7);
  var service = this.subject();
  let callback = (xData, status) => {
    assert.equal(xData.responseXML, true);
    assert.equal(status, 'success');
  };
  let userLoginName = `test.user`;

  service.set('_SPServices', (obj) => {
    assert.equal(obj.operation, 'GetGroupCollectionFromUser');
    assert.equal(obj.async, false);
    assert.equal(obj.userLoginName, userLoginName);
    assert.equal(typeof obj.completefunc, 'function');
    obj.completefunc({
      responseXML: true
    }, 'success');
  });
  service.getGroupCollectionFromUser(userLoginName, callback);
  assert.ok(service);
});

test('getVersionCollection() method - pass in an array', function(assert) {
  assert.expect(8);
  var service = this.subject();
  let listName = 'testList';
  let itemId = 1;
  let fieldName = 'fieldName';
  let versionCollection = Ember.A();
  let xml = `<Version>
    <Comment>Abc</Comment>
    <Modified>2015-11-13T10:21:02Z</Modified>
    <Editor>11;#Test User,#DOMAIN\test.user,#test.user@example.com,#,#Test User</Editor>
  </Version>`;

  service.set('_SPServices', (obj) => {
    assert.equal(obj.operation, 'GetVersionCollection');
    assert.equal(obj.async, true);
    assert.equal(obj.strlistID, listName);
    assert.equal(obj.strlistItemID, itemId);
    assert.equal(obj.strFieldName, fieldName);
    assert.equal(typeof obj.completefunc, 'function');

    obj.completefunc({
      responseText: Ember.$.parseXML(xml)
    });
  });
  service.getVersionCollection(listName, itemId, fieldName, versionCollection);
  assert.ok(service);
  assert.equal(versionCollection.length, 1, `should be 1 version`);
});

test('getVersionCollection() method - pass in a function', function(assert) {
  assert.expect(9);
  var service = this.subject();
  let listName = 'testList';
  let itemId = 1;
  let fieldName = 'fieldName';
  let callback = (xData, status) => {
    assert.equal(xData, 'data');
    assert.equal(status, 'status');
  };

  service.set('_SPServices', (obj) => {
    assert.equal(obj.operation, 'GetVersionCollection');
    assert.equal(obj.async, true);
    assert.equal(obj.strlistID, listName);
    assert.equal(obj.strlistItemID, itemId);
    assert.equal(obj.strFieldName, fieldName);
    assert.equal(typeof obj.completefunc, 'function');

    obj.completefunc('data', 'status');
  });
  service.getVersionCollection(listName, itemId, fieldName, callback);
  assert.ok(service);
});
