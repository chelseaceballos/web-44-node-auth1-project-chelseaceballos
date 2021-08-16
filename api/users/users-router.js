const router = require('express').Router();
const { restricted } = require('../auth/auth-middleware.js');
const Users = require('./users-model');

router.get('/', restricted, async (req, res, next) => {
 try {
  const user = await Users.find()
  res.json(user)
 } catch (err){
  next(err)
 }
});

module.exports = router
/**
  [GET] /api/users
  This endpoint is RESTRICTED: only authenticated clients
  should have access.
  - response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]
  - response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */