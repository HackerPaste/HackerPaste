require(TEST_HELPER)
var fs = require('fs');
var db = require(__server + '/lib/db');
var Pastie = require(__server + '/models/pastie');

var emptyTables = TestHelper.emptyTables;
var files = TestHelper.fixtures;

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

describe('Pastie Model', function () {

  beforeEach_(emptyTables);

  //
  // Begin Pastie.find
  //
  describe('Pastie.find', function () {
    beforeEach_(emptyTables);

    it_('should reject with a Pastie.NotFound error for nonexistent pasties', function * () {
      var err = yield Pastie.find(1, 'user_alice', ['g1', 'g2'])
        .catch(err => err); // ensure error is caught

      expect(err).to.be.an.instanceof(Pastie.NotFound);
    });

    it_('should find existing pasties', function * () {
      var pastie = yield Pastie.create(pasties[0])
        .then(newPastie => Pastie.find(newPastie.id, 'user_alice', ['g1', 'g2']))

      expect(pastie).to.be.an('object');
      expect(pastie.id).to.be.a('number');
      expect(pastie.title).to.equal(pasties[0].title);
      expect(pastie.contents).to.equal(pasties[0].contents);
      expect(pastie.file_type).to.equal(pasties[0].file_type);
      expect(pastie.tags).to.deep.equal(pasties[0].tags);
    });

    describe('Permissions', function() {
      // pastie access:
      // each user has access to pasties shared with them specifically
      //  - ie `{ subject_type: 'User', subject_uid: 'user_alice' }`
      // Each user also has access to pasties shared with them via a Group
      // that they belong to
      //  - Alice and Bob should be able to access pasties shared with g1:
      //  - ie `{ subject_type: 'Group', subject_uid: 'g1' }`

      // 'user_alice': g1, g2
      // 'user_bob': g1, g3

      beforeEach_(emptyTables);

      it_('should reject with an error for users without permission', function * () {
        var error, pastie_id;

        pastie_id = yield Pastie.create(pasties[1])
          .then(newPastie => newPastie.id);

        error = yield Pastie.find(pastie_id, 'user_bob', ['g1', 'g3'])
          .catch(err => err); // ensure error is caught

        expect(error).to.be.an.instanceof(Pastie.PermissionDenied);

        error = yield Pastie.find(pastie_id)
          .catch(err => err) // ensure error is caught

        expect(error).to.be.an.instanceof(Pastie.PermissionDenied);
      });

      it_('should return the pastie for the user who created it', function * () {
        var pastie_id, pastie;

        pastie_id = yield Pastie.create(pasties[1])
          .then(newPastie => newPastie.id);

        pastie = yield Pastie.find(pastie_id, 'user_alice', ['g1', 'g2'])

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[1].title);
        expect(pastie.public).to.be.false;
      });

      it_('should return the pastie for users it is shared with', function * () {
        var pastie_id, pastie;

        pastie_id = yield Pastie.create(pasties[1])
          .then(newPastie => newPastie.id);

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

        pastie_id = yield Pastie.create(pasties[1])
          .then(newPastie => newPastie.id);

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

        pastie_id = yield Pastie.create(pasties[2])
          .then(newPastie => newPastie.id);

        // notice no user or groups are given
        pastie = yield Pastie.find(pastie_id);

        expect(pastie.id).to.equal(pastie_id);
        expect(pastie.title).to.equal(pasties[2].title);
        expect(pastie.public).to.be.true;
      });
    });
  }); // end Pastie.find

  //
  // Begin Pastie.create
  //
  describe('Pastie.create', function () {
    beforeEach_(emptyTables);

    it('should be a function', function () {
      expect(Pastie.create).to.be.a('function');
    });

    it_('should throw an error for invalid requests', function * () {
      var test_pastie, error, oldInfo;
      var requiredKeys = ['title', 'contents'];

      // test_pastie is undefined
      error = yield Pastie.create(test_pastie)
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.InvalidFormat);

      test_pastie = {};
      // test_pastie is missing required parameters
      error = yield Pastie.create(test_pastie)
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.InvalidFormat);

      test_pastie = {
        title: 'Plaintext Test',
        contents: files[0],
        public: true,
        file_type: 'txt',
        user_uid: 'user_alice',
        tags: ['test', 'text', 'dummy'],
      };

      // loops through the required keys
      for (var i = 0; i < requiredKeys.length; i++) {
        // delete the required key from the test
        oldInfo = test_pastie[requiredKeys[i]];
        delete test_pastie[requiredKeys[i]];

        // try to create the pastie with the missing info
        error = yield Pastie.create(test_pastie)
          .then(err => err);
        expect(error).to.be.an.instanceof(Pastie.InvalidFormat);

        // restore the deleted key
        test_pastie[requiredKeys[i]] = oldInfo;
      }
    });

    it_('should return the created pastie', function * () {
      var test_pastie = pasties[0];
      var pastie = yield Pastie.create(test_pastie, 'user_bob');

      expect(pastie.id).to.be.a('number');
      expect(pastie.title).to.equal(test_pastie.title)
      expect(pastie.contents).to.equal(test_pastie.contents);
      expect(pastie.public).to.equal(test_pastie.public);
      expect(pastie.file_type).to.equal(test_pastie.file_type);
      expect(pastie.tags).to.deep.equal(test_pastie.tags);
      expect(pastie.user_uid).to.be.a('string')
    });

    it_('should provide default values for optional fields', function * () {
      var test_pastie = {
        title: 'Plaintext Test',
        contents: files[0]
      };
      var defaults = {
        public: true,
        file_type: 'txt',
        tags: [],
      };

      var pastie = yield Pastie.create(test_pastie)
      Object.keys(defaults).forEach(key => {
        if (typeof defaults[key] === 'object') {
          expect(pastie[key]).to.deep.equal(defaults[key]);
        } else {
          expect(pastie[key]).to.equal(defaults[key]);
        }
      });
    });

    it_('should force anonymous pasties to be public', function * () {
      var test_pastie = {
        title: 'Plaintext Test',
        contents: files[0],
        public: false
      };

      var pastie = yield Pastie.create(test_pastie);
      expect(pastie.public).to.be.true;
    });

    it_('should ignore the user_uid property on the provided object', function * () {
      var test_pastie = {
        title: 'Plaintext Test',
        contents: files[0],
        public: false,
        user_uid: 'user_alice'
      };

      var pastie = yield Pastie.create(test_pastie)
      expect(pastie.user_uid).to.be.null;
    });

    it_('should create the pastie for the passed in user', function * () {
      var test_pastie = pasties[0];
      var pastie = yield Pastie.create(test_pastie, 'user_bob');
      expect(pastie.user_uid).to.equal('user_bob');

      pastie = yield Pastie.create(test_pastie, 'user_carly');
      expect(pastie.user_uid).to.equal('user_carly');
    });
  }); // end Pastie.create

  //
  // Begin Pastie.feedForUser
  //
  describe('Pastie.feedForUser', function () {
    var pastie_ids;
    var pasties = [
      {
        title: 'Plaintext Test',
        contents: files[0],
        public: false,
        file_type: 'txt',
        tags: ['test', 'text', 'dummy'],
      },
      {
        title: 'Javascript Test',
        contents: files[1],
        public: false,
        file_type: 'js',
        tags: ['test', 'javascript', 'dummy'],
      },
      {
        title: 'Markdown Test',
        contents: files[2],
        public: true,
        file_type: 'md',
        tags: ['test', 'markdown', 'dummy'],
      }
    ];

    var usersGroups = {
      'user_alice': ['g1', 'g2'],
      'user_bob': ['g1', 'g3'],
      'user_carly': []
    };

    before_(function * () {
      // Alice's feed is 0
      // Bob's feed is 0, 1
      // Carly's feed is 0
      pastie_ids = [];
      pastie_ids.push(yield Pastie.create(pasties[0], 'user_alice')
        .then(pastie => pastie.id));
      pastie_ids.push(yield Pastie.create(pasties[1], 'user_bob')
        .then(pastie => pastie.id));
      pastie_ids.push(yield Pastie.create(pasties[2], 'user_alice')
        .then(pastie => pastie.id));
      pastie_ids.push(yield Pastie.create(pasties[2])
        .then(pastie => pastie.id));

      var shares = [
        {
          pastie_id: pastie_ids[0],
          subject_type: 'Group',
          subject_uid: 'g1'
        },
        {
          pastie_id: pastie_ids[1],
          subject_type: 'Group',
          subject_uid: 'g3'
        },
        {
          pastie_id: pastie_ids[0],
          subject_type: 'User',
          subject_uid: 'user_carly'
        }
      ];

      yield Promise.all(shares.map(
        share => db('pasties_subjects').insert(share)
          .then(res => res) // ensure the inserts happen because knex.
      ))
    });

    it('should be a function', function () {
      expect(Pastie.feedForUser).to.be.a('function');
    });

    it_('should throw an error for unauthenticated users', function * () {
      var error = yield Pastie.feedForUser(undefined, undefined)
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.PermissionDenied);

      error = yield Pastie.feedForUser(undefined, ['g1', 'g2', 'g3'])
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.PermissionDenied);
    })

    it_('should resolve to an array', function * () {
      var feed = yield Pastie.feedForUser('user_alice', usersGroups['user_alice']);
      expect(Array.isArray(feed)).to.be.true;
    });

    describe('Public Pasties', function () {
      it_('should not be visible in the feed', function * () {
        var feed = yield Pastie.feedForUser('user_alice', usersGroups['user_alice']);
        // filter the result to only include pasties with `public: true`
        // HINT: this should be empty.
        expect(feed.filter(pastie => pastie.public).length).to.equal(0);

        feed = yield Pastie.feedForUser('user_bob', usersGroups['user_bob']);
        expect(feed.filter(pastie => pastie.public).length).to.equal(0);

        feed = yield Pastie.feedForUser('user_carly', usersGroups['user_carly']);
        expect(feed.filter(pastie => pastie.public).length).to.equal(0);
      });

      it_('should be visible only when they are shared', function * () {
        yield db('pasties_subjects').insert([
          {
            pastie_id: pastie_ids[2],
            subject_type: 'User',
            subject_uid: 'user_carly'
          },
          {
            pastie_id: pastie_ids[3],
            subject_type: 'Group',
            subject_uid: 'g1'
          }
        ]);

        var feed = yield Pastie.feedForUser('user_carly', usersGroups['user_carly']);
        // filtering on the shared pastie's id should give us an array with a length of 1
        expect(feed.filter(pastie => pastie.id === pastie_ids[2]).length).to.equal(1);

        feed = yield Pastie.feedForUser('user_alice', usersGroups['user_alice']);
        expect(feed.filter(pastie => pastie.id === pastie_ids[3]).length).to.equal(1)

        // delete the inserted row afterward
        yield db('pasties_subjects')
        .where({
          pastie_id: pastie_ids[2],
          subject_uid: 'user_carly'
        })
        .orWhere({
          pastie_id: pastie_ids[3]
        })
        .delete();
      });
    }); // end Public Pasties

    describe('Private Pasties', function () {
      it_('should only be visible to those they are shared with', function * () {
        var feed = yield Pastie.feedForUser('user_bob', usersGroups['user_bob']);
        var feed_ids = feed.map(pastie => pastie.id);

        // Bob's feed is 0, 1
        expect(feed.length).to.equal(2);
        expect(feed_ids.indexOf(pastie_ids[0])).to.not.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[1])).to.not.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[2])).to.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[3])).to.equal(-1);


        feed = yield Pastie.feedForUser('user_alice', usersGroups['user_alice']);
        feed_ids = feed.map(pastie => pastie.id);

        // Alice's feed is 0
        expect(feed.length).to.equal(1);
        expect(feed_ids.indexOf(pastie_ids[0])).to.not.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[1])).to.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[2])).to.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[3])).to.equal(-1);


        feed = yield Pastie.feedForUser('user_carly', usersGroups['user_carly']);
        feed_ids = feed.map(pastie => pastie.id);

        // Carly's feed is 0
        expect(feed.length).to.equal(1);
        expect(feed_ids.indexOf(pastie_ids[0])).to.not.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[1])).to.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[2])).to.equal(-1);
        expect(feed_ids.indexOf(pastie_ids[3])).to.equal(-1);
      });
    }); // end Private Pasties

    it_('should return pasties in reverse chronological order by the date shared', function * () {
      yield db('pasties_subjects').insert({
        pastie_id: pastie_ids[1],
        subject_type: 'User',
        subject_uid: 'user_carly'
      });

      var feed = yield Pastie.feedForUser('user_carly', usersGroups['user_carly']);
      var feed_ids = feed.map(pastie => pastie.id);

      expect(feed_ids[0]).to.equal(pastie_ids[1]);
      expect(feed_ids[1]).to.equal(pastie_ids[0]);
    });

    it_('should be empty for users with no shared pasties', function * () {
      var feed = yield Pastie.feedForUser('user_dan', []);

      expect(Array.isArray(feed)).to.be.true;
      expect(feed.length).to.equal(0);
    });

    xit('should only return xx pasties', function * () {
      // TODO
    });

    xit('should allow fetching a specific "page" of results', function * () {
      // TODO
    });

    xit('should allow searching', function () {
      // TODO
    });
  }); // end Pastie.feedForUser

  //
  // Begin Pastie.getPublic
  //
  describe('Pastie.getPublic', function () {
    before_(function * () {
      yield db('pasties').insert(pasties)
    });

    it('should be a function', function () {
      expect(Pastie.getPublic).to.be.a('function');
    });

    it_('should return an array', function * () {
      var public = yield Pastie.getPublic();
      expect(Array.isArray(public)).to.be.true;
    });

    it_('should only contain public pasties', function * () {
      var public = yield Pastie.getPublic();
      expect(public.filter(pastie => !pastie.public).length).to.equal(0);
    });

    it_('should include newly created public pasties', function * () {
      var new_id = yield db('pasties').insert(pasties[0], 'id')
        .then(id => id[0]);
      var public = yield Pastie.getPublic();

      expect(public.filter(pastie => pastie.id === new_id).length).to.equal(1);

      yield db('pasties').where('id', new_id).delete();
    });

    it_('should return pasties in reverse chronological order', function * () {
      var public = yield Pastie.getPublic();
      var new_id = yield db('pasties').insert(pasties[0], 'id')
        .then(id => id[0]);
      var newPublic = yield Pastie.getPublic();

      expect(newPublic[0].id).to.equal(new_id);
      expect(newPublic[1].id).to.equal(public[0].id);
    });

    xit('should only return xx pasties', function * () {
      // TODO
    });

    xit('should allow fetching a specific "page" of results', function * () {
      // TODO
    });

    xit('should allow searching', function () {
      // TODO
    });
  }); // end Pastie.getPublic

  //
  // Begin Pastie.ownedByUser
  //
  describe('Pastie.ownedByUser', function () {
    var pasties = [
      {
        title: 'Plaintext Test',
        contents: files[0],
        public: false,
        file_type: 'txt',
        tags: ['test', 'text', 'dummy'],
      },
      {
        title: 'Javascript Test',
        contents: files[1],
        public: false,
        file_type: 'js',
        tags: ['test', 'javascript', 'dummy'],
      },
      {
        title: 'Markdown Test',
        contents: files[2],
        public: true,
        file_type: 'md',
        tags: ['test', 'markdown', 'dummy'],
      }
    ];
    var alice_ids = [];
    var bob_ids = [];
    var carly_ids = []

    before_(function * () {
      pasties[0].user_uid = 'user_alice';
      pasties[1].user_uid = 'user_alice';
      alice_ids.push(yield db('pasties').insert(pasties[0]))
      alice_ids.push(yield db('pasties').insert(pasties[1]))

      pasties[1].user_uid = 'user_bob';
      pasties[2].user_uid = 'user_bob';
      bob_ids.push(yield db('pasties').insert(pasties[1]))
      bob_ids.push(yield db('pasties').insert(pasties[2]))

      pasties[0].user_uid = 'user_carly'
      pasties[2].user_uid = 'user_carly';
      carly_ids.push(yield db('pasties').insert(pasties[0]))
      carly_ids.push(yield db('pasties').insert(pasties[2]))

      delete pasties[0].user_uid;
      delete pasties[1].user_uid;
      delete pasties[2].user_uid;
    });

    it('should be a function', function () {
      expect(Pastie.ownedByUser).to.be.a('function');
    });

    it_('should throw an error for anonymous users', function * () {
      var error = yield Pastie.ownedByUser(undefined)
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.PermissionDenied);
    });

    it_('should return an array for logged in users', function * () {
      var owned = yield Pastie.ownedByUser('user_alice');
      expect(Array.isArray(owned)).to.be.true;
    });

    it_('should return an empty array for users who haven\'t created pasties', function * () {
      var owned = yield Pastie.ownedByUser('user_dan');
      expect(Array.isArray(owned)).to.be.true;
      expect(owned.length).to.equal(0);
    });

    it_('should only include pasties created by the user', function * () {
      var owned;
      owned = yield Pastie.ownedByUser('user_alice');
      expect(owned.filter(pastie => pastie.user_uid !== 'user_alice').length).to.equal(0);

      owned = yield Pastie.ownedByUser('user_bob');
      expect(owned.filter(pastie => pastie.user_uid !== 'user_bob').length).to.equal(0);

      owned = yield Pastie.ownedByUser('user_carly');
      expect(owned.filter(pastie => pastie.user_uid !== 'user_carly').length).to.equal(0);
    });

    it_('should include public and private pasties from the user', function * () {
      var owned;
      owned = yield Pastie.ownedByUser('user_alice');
      // should be the same length as the amount inserted
      expect(owned.length).to.equal(alice_ids.length);
      // should only include pasties with IDs that match the ones we inserted
      expect(owned.filter(pastie => ~alice_ids.indexOf(pastie.id)).length)
        .to.equal(alice_ids.length);

      owned = yield Pastie.ownedByUser('user_bob');
      expect(owned.length).to.equal(bob_ids.length);
      expect(owned.filter(pastie => ~bob_ids.indexOf(pastie.id)).length)
        .to.equal(bob_ids.length);

      owned = yield Pastie.ownedByUser('user_carly');
      expect(owned.length).to.equal(carly_ids.length);
      expect(owned.filter(pastie => ~carly_ids.indexOf(pastie.id)).length)
        .to.equal(carly_ids.length);
    });

    xit('should only return xx pasties', function * () {
      // TODO
    });

    xit('should allow fetching a specific "page" of results', function * () {
      // TODO
    });

    xit('should allow searching', function () {
      // TODO
    });
  }); // end Pastie.ownedByUser

  //
  // Begin Pastie.favoritedByUser
  //
  describe('Pastie.favoritedByUser', function () {
    var pastie_ids;
    var pasties = [
      {
        title: 'Plaintext Test',
        contents: files[0],
        public: false,
        file_type: 'txt',
        user_uid: 'user_alice',
        tags: ['test', 'text', 'dummy'],
      },
      {
        title: 'Plaintext Test 2',
        contents: files[0],
        public: false,
        file_type: 'txt',
        user_uid: 'user_alice',
        tags: ['test', 'text', 'dummy'],
      },
      {
        title: 'Javascript Test',
        contents: files[1],
        public: true,
        file_type: 'js',
        user_uid: 'user_alice',
        tags: ['test', 'javascript', 'dummy'],
      },
      {
        title: 'Markdown Test',
        contents: files[2],
        public: true,
        file_type: 'md',
        user_uid: 'user_alice',
        tags: ['test', 'markdown', 'dummy'],
      }
    ];
    before_(function * () {
      pastie_ids = [];
      pastie_ids.push(yield db('pasties').insert(pasties[0], 'id')
        .then(id => id[0]));
      pastie_ids.push(yield db('pasties').insert(pasties[1], 'id')
        .then(id => id[0]));
      pastie_ids.push(yield db('pasties').insert(pasties[2], 'id')
        .then(id => id[0]));
      pastie_ids.push(yield db('pasties').insert(pasties[3], 'id')
        .then(id => id[0]));

      var shares = [
        {
          pastie_id: pastie_ids[0],
          subject_type: 'User',
          subject_uid: 'user_carly',
        },
        {
          pastie_id: pastie_ids[1],
          subject_type: 'Group',
          subject_uid: 'g3'
        }
      ];
      yield db('pasties_subjects').insert(shares);

      var favorites = [
        {
          pastie_id: pastie_ids[0],
          user_uid: 'user_carly',
        },
        {
          pastie_id: pastie_ids[1],
          user_uid: 'user_bob'
        },
        {
          pastie_id: pastie_ids[2],
          user_uid: 'user_bob'
        }
      ];
      yield db('favorites').insert(favorites);
    });

    it('should be a function', function () {
      expect(Pastie.favoritedByUser).to.be.a('function');
    });

    it_('should throw an error for anonymous users', function * () {
      var error = yield Pastie.favoritedByUser(undefined, undefined)
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.PermissionDenied);

      var error = yield Pastie.favoritedByUser(undefined, ['g1', 'g2', 'g3'])
        .catch(err => err);
      expect(error).to.be.an.instanceof(Pastie.PermissionDenied);
    });

    it_('should return an array for logged in users', function * () {
      var favorites = yield Pastie.favoritedByUser('user_alice', ['g1', 'g2']);
      expect(Array.isArray(favorites)).to.be.true;
    });

    it_('should return an empty array for users with no favorites', function * () {
      var favorites = yield Pastie.favoritedByUser('user_dan', ['g1', 'g2', 'g3']);
      expect(Array.isArray(favorites)).to.be.true;
      expect(favorites.length).to.equal(0);
    });

    it_('should return the favorites for a user', function * () {
      var favorites, pasties, favorite_ids;
      favorites = yield Pastie.favoritedByUser('user_carly', []);
      expect(favorites.length).to.equal(1);
      pastie = favorites[0];
      expect(pastie.id).to.equal(pastie_ids[0].id);
      expect(pastie.title).to.equal(pasties[0].title);
      expect(pastie.contents).to.equal(pasties[0].contents);
      expect(pastie.file_type).to.equal(pasties[0].file_type);
      expect(pastie.tags).to.deep.equal(pasties[0].tags);
      expect(pastie.public).to.equal(pasties[0].public);

      favorites = yield Pastie.favoritedByUser('user_bob', ['g1', 'g3']);
      favorite_ids = favorites.map(pastie => pastie.id);
      expect(favorites.length).to.equal(2);
      expect(favorite_ids.indexOf(pastie_ids[1])).to.not.equal(-1);
      expect(favorite_ids.indexOf(pastie_ids[2])).to.not.equal(-1);
    });

    describe('Private Pasties', function () {
      it_('should not be returned if they have not been shared with the user', function * () {
        yield db('favorites')
          .insert({ pastie_id: pastie_ids[0], user_uid: 'user_bob' });

        var favorites = yield Pastie.favoritedByUser('user_bob', ['g1', 'g3']);
        var favorite_ids = favorites.map(pastie => pastie.id);
        expect(favorite_ids.indexOf(pastie_ids[0])).to.equal(-1);

        yield db('favorites')
          .insert({ pastie_id: pastie_ids[1], user_uid: 'user_carly' });
        favorites = yield Pastie.favoritedByUser('user_carly', []);
        favorite_ids = favorites.map(pastie => pastie.id);
        expect(favorite_ids.indexOf(pastie_ids[1])).to.equal(-1);

        yield db('favorites')
          .where({ pastie_id: pastie_ids[0], user_uid: 'user_bob' })
          .orWhere({ pastie_id: pastie_ids[1], user_uid: 'user_carly' })
          .delete();
      });

      it_('should be returned if they have been shared with the user', function * () {
        var favorites = yield Pastie.favoritedByUser('user_bob', ['g1', 'g3']);
        var favorite_ids = favorites.map(pastie => pastie.id);
        expect(favorite_ids.indexOf(pastie_ids[1])).to.not.equal(-1);

        favorites = yield Pastie.favoritedByUser('user_carly', []);
        favorite_ids = favorites.map(pastie => pastie.id);
        expect(favorite_ids.indexOf(pastie_ids[0])).to.not.equal(-1);
      });
    }); // end Private Pasties

    it_('should only include public pasties that have been favorited', function * () {
      var favorites = yield Pastie.favoritedByUser('user_bob', ['g1', 'g3']);
      var favorite_ids = favorites.map(pastie => pastie.id);
      expect(favorite_ids.indexOf(pastie_ids[2])).to.not.equal(-1);

      favorites = yield Pastie.favoritedByUser('user_carly', []);
      favorite_ids = favorites.map(pastie => pastie.id);
      expect(favorite_ids.indexOf(pastie_ids[2])).to.equal(-1);
    });
  });

  //
  // Begin Pastie.update
  //
  describe('Pastie.update', function () {
    xit('should be a function', function () {
      expect(Pastie.update).to.be.a('function');
    });
  }); // end Pastie.update
});
