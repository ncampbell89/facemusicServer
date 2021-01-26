var express = require('express');
var router = express.Router();

var genreController = require('./controllers/genreController');

/* GET home page. */
router.get('/allgenres/:id', (req, res) => {
  genreController.getAllGenres(req.params.id)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
});

router.post('/creategenre', (req, res) => {
  genreController.createGenre(req.body)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    console.log(error)
    res.status(400).json(error)
  })
});

router.delete('/deletegenre/:id', (req, res) => {
  
  genreController.deleteGenre(req.params.id, req.query.genre)
  .then(result => {
    res.json(result)
  })
  .catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router;
