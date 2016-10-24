var db = require('../lib/db');

var Share = module.exports;



Share.create = function(pastie_id, subjects){
	var shares = subjects.map(function(sub){
	  return {
	    pastie_id: pastie_id,
	    subject_type: sub.subject_type,
	    subject_uid: sub.subject_uid
	  };
	});

  return db('pasties').where('id', pastie_id)
    .then(rows => {
      if (!rows.length) {
        throw new Pastie.NotFound(pastie_id);
      }
      return db('pasties_subjects').insert(shares)
    	.then(result => result);
    })

}



Share.delete = function (pastie_id, subjects) {
  var shares = subjects.map(subject => ({
    pastie_id: pastie_id,
    subject_type: subject.subject_type,
    subject_uid: subject.subject_uid
  }));
  ///  this creates an SQL query that delets all subjects passed in
  ///   delete from pastie_subjects where pastie_id = 123 and (...)
  return db('pasties_subjects').where('pastie_id', pastie_id).andWhere(function() {
    /// this loops through all of the shares adding an 'orWhere' clause
    ///  (subject_type = 'User' and subject_id = 'user_alice')
    /// or (subject_type = 'Group' and subject_id = 'group_1')
    shares.forEach((share) => {
      this.orWhere({
        subject_type: share.subject_type,
        subject_uid: share.subject_uid
      });
    });
  }).del()
  .then((result) => result);
}
