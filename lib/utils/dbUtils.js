
// check and make sure the db is an alanDB
module.exports.checkIsAlanDB = (data) => {
  if (data && data.data && data.createdAt) {
    // it is.. for now a valid alanDB
    return true;
  } else {
    return false;
  }
}