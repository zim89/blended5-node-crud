const { isValidObjectId } = require('mongoose');

module.exports = (req, res, next) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    return next();
  } else {
    res.status(400);
    throw new Error(`${id}: this id is not valid`);
  }
};
