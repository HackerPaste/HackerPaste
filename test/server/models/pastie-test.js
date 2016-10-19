require(TEST_HELPER)
var fs = require('fs');
var db = require(__server + '/lib/db');
var Pastie = require(__server + '/models/pastie');

describe('Pastie Model', function () {
  var files = [
    fs.readFileSync(__test + '/fixtures/pastie_contents/loremipsum.txt').toString(),
    fs.readFileSync(__test + '/fixtures/pastie_contents/jquery.js').toString(),
    fs.readFileSync(__test + '/fixtures/pastie_contents/loremipsum.md').toString()
  ];

  var pasties = [
    {
      title: 'Plaintext Test',
      contents: files[0],
      public: true,
      file_type: 'txt',
      user_uid: 'user_alice',
      tags: ['test', 'text', 'dummy'],
    },
    {
      title: 'Javascript Test',
      contents: files[1],
      public: false,
      file_type: 'js',
      user_uid: 'user_alice',
      tags: ['test', 'text', 'dummy'],
    },
    {
      title: 'Markdown Test',
      contents: files[2],
      public: true,
      file_type: 'md',
      tags: ['test', 'text', 'dummy'],
    }
  ];

  describe('Pastie.find', function () {
    beforeEach_(function * () {
      yield db('favorites').delete()
      yield db('pasties_subjects').delete()
      yield db('pasties').delete()
    });

    it_('should reject with a Pastie.NotFound error for nonexistent pasties', function * () {
      var err = yield Pastie.find(1, 'user_alice', ['g1', 'g2'])
        .catch(err => err); // ensure error is caught

      expect(err).to.be.an.instanceof(Pastie.NotFound);
    });

    it_('should find existing pasties', function * () {
      var pastie = yield db('pasties').insert(pasties[0], 'id')
        .then(id => Pastie.find(id[0], 'user_alice', ['g1', 'g2']))

      expect(pastie).to.be.an('object');
      expect(pastie.id).to.be.a('number');
      expect(pastie.title).to.equal(pasties[0].title);
      expect(pastie.contents).to.equal(pasties[0].contents);
      expect(pastie.file_type).to.equal(pasties[0].file_type);
      expect(pastie.tags).to.deep.equal(pasties[0].tags);
    });

    describe('Permissions', function() {
      beforeEach_(function * () {
        yield db('favorites').delete()
        yield db('pasties_subjects').delete()
        yield db('pasties').delete()
      });

      it_('should reject with an error for users without permission', function * () {
        var error, pastie_id;

        pastie_id = yield db('pasties').insert(pasties[1], 'id')
          .then(id => id[0]);

        error = yield Pastie.find(pastie_id, 'user_bob', ['g1', 'g3'])
          .catch(err => err); // ensure error is caught

        expect(error).to.be.an.instanceof(Pastie.PermissionDenied);

        error = yield Pastie.find(pastie_id)
          .catch(err => err) // ensure error is caught

        expect(error).to.be.an.instanceof(Pastie.PermissionDenied);
      });

      it_('should return the pastie for the user who created it', function * () {
        var pastie_id, pastie;

        pastie_id = yield db('pasties').insert(pasties[1], 'id')
        .then(id => id[0]);

        pastie = yield Pastie.find(pastie_id, 'user_alice', ['g1', 'g2'])

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[1].title);
        expect(pastie.public).to.be.false;
      });

      it_('should return the pastie for users it is shared with', function * () {
        var pastie_id, pastie;

        pastie_id = yield db('pasties').insert(pasties[1], 'id')
        .then(id => id[0]);

        var pastiesSubjects = {
          pastie_id: pastie_id,
          subject_type: 'User',
          subject_uid: 'user_bob'
        };

        pastie = yield Pastie.find(pastie_id, 'user_bob', ['g1', 'g3'])

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[1].title);
        expect(pastie.public).to.be.false;
      });

      it_('should return the pastie for members of groups it is shared with', function * () {
        var pastie_id, pastie;

        pastie_id = yield db('pasties').insert(pasties[1], 'id')
        .then(id => id[0]);

        var pastiesSubjects = {
          pastie_id: pastie_id,
          subject_type: 'Group',
          subject_uid: 'g3'
        };

        pastie = yield Pastie.find(pastie_id, 'user_bob', ['g1', 'g3'])

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[1].title);
        expect(pastie.public).to.be.false;
      });

      it_('should always return the pastie if it is public', function * () {
        var pastie_id, pastie;

        pastie_id = yield db('pasties').insert(pasties[2], 'id')
          .then(id => id[0]);

        // notice no user or groups are given
        pastie = yield Pastie.find(pastie_id);

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[2].title);
        expect(pastie.public).to.be.true;
      });
    });
  });
});
