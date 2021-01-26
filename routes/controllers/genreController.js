const User = require('./models/User');
const Genres = require('./models/Genres');

module.exports = {
    getAllGenres: (id) => {
        return new Promise((resolve, reject) => {
            // Find the user id then find that user's genres
            // populate the inner genres database of the user
            // execute the error or success
            User.findById({_id: id}, 'genres')
            .populate('genres', '-user_id -__v')
            .exec((err, user) => {
                err ? reject(err) : resolve(user)
            })
        })
    },

    createGenre: (params) => {
        return new Promise((resolve, reject) => {
            User.findById(params.id)
            .then(user => {
                let newGenres = new Genres({
                    genre: params.genre,
                    user_id: params.id
                })
    
                newGenres.save()
                .then(savedGenre => {
                    user.genres.push(savedGenre);
                    
                    user.save()
                    .then(() => {
                        resolve(savedGenre)
                    })
                    .catch(error => {
                        reject(error)
                    })

                })
                .catch(err => {
                    reject(err)
                })
            })
            .catch(error => {
                reject(error)
            })
        })
    },

    deleteGenre: (userID, genreID) => {
    
        return new Promise((resolve, reject) => {
            // find the user id first that way the server can be able to detect the todoID

            // to get the genreID you have to display it in the then block to check it
            User.findById(userID)
            .then(user => {
                // Always use a return, otherwise filtered will be blank
                let filtered = user.genres.filter(genre => {
                    return genre != genreID
                })

                user.genres = filtered;
            
                user.save()
                .then(() => {
                    // find the id in the genre model and delete
                    Genres.findByIdAndDelete(genreID)
                    .then(result => {
                        // result shows the deleted genre
                        //console.log(result)
                     
                        // then populate the rest of the items in the database
                        // User.findById({_id: userID}, 'Genres')
                        //     .populate('Genres', '-__v')
                        //     .exec((err, foundUser) => {
                        //         console.log('-----')
                        //         console.log(foundUser)
                        //         err ? reject(err) : resolve(foundUser)

                        // User.findById({_id: id from the user model}, 'user.genres')
                        // .populate('user.genres', '-__v -user_id from the User model)
                        User.findById({_id: userID}, 'genres')
                            .populate('genres', '-__v -user_id')
                            .exec((err, data) => {
                              
                                if (err) {
                                    console.log(err)
                                    reject(err);
                                } else {
                                    console.log(data)
                                    resolve(data)
                                }

                            })

                     
                    })
                    .catch(err => {
                        console.log('ERROR')
                        console.log(err)
                        reject(err)
                    })
                })
                .catch(err => {
                    console.log('ERROR')
                    console.log(err)
                    reject(err)
                })

            })
            .catch(error => {
                console.log('ERROR')
                console.log(error)
                reject(error)
            })
        })
    }
}