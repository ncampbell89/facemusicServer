var express = require('express');
var router = express.Router();
var userController = require('./controllers/userController');
// var registerInput = require('./utils/validation/register');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  userController.signup(req.body)
  .then(user => {
    console.log(user)
    res.json(user)
  })
  .catch(error => {
    console.log(error)
    res.status(400).json(error)
  })
});

router.post('/signin', (req, res) => {
  userController.signin(req.body)
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

module.exports = router;
