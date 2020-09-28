const mongoose = require('mongoose'),
      User     = require('./models/user'),
      Bunny    = require('./models/bunny');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connect to the MongoDB!'))
    .catch((err) => console.log(`Fail to connect to the MongoDB: ${err.message}`));

// Declare the bunnies
const bunnies = [
    {
        name: 'Bubu',
        sex: 'Male',
        age: 5,
        description: 'This is Bubu from the Facebook',
        image: 'https://images.unsplash.com/photo-1518796745738-41048802f99a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    },
    {
        name: 'Fifi',
        sex: 'Female',
        age: 7,
        description: 'I\'m adorable!',
        image: 'https://images.unsplash.com/photo-1469532804526-98aa275b657c?ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80',
    },
    {
        name: 'Snow White',
        sex: 'Female',
        age: 4,
        description: 'The stain on my nose was an accident...',
        image: 'https://images.unsplash.com/photo-1540776747361-eb6c2c4ce695?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80',
    },
    {
        name: 'Bunny Cluster',
        sex: 'Male',
        age: 6,
        description: 'A cluster of rabbits.',
        image: 'https://images.unsplash.com/photo-1576502733340-710601fc1838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    },
    {
        name: 'Dutch',
        sex: 'Female',
        age: 3,
        description: 'Dutch rabbits are cuddling together.',
        image: 'https://images.unsplash.com/photo-1591884445259-0bfb03d5232d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    }
]

const users = [
    {
        username: 'admin1',
        password: 'admin1'
    },
    {
        username: 'admin2',
        password: 'admin2'
    },
    {
        username: 'admin3',
        password: 'admin3'
    },
    {
        username: 'admin4',
        password: 'admin4'
    },
    {
        username: 'admin5',
        password: 'admin5'
    }
]

function seedDB() {
    // Refactor the callback hell to Promise?
    // Delete the bunnies
    Bunny.deleteMany({}, (err, deletedBunnies) => {
        if (err) {
            console.log(`Error from Bunny.deleteMany(): ${err}`);
        }   else {
            // Drop all the indexes after deletion or there will be E11000 duplicate key error
            Bunny.collection.dropIndexes();
            console.log(`Deleted bunnies: ${deletedBunnies.deletedCount}`);
            // Delete the users
            User.deleteMany({}, (err, deletedUsers) => {
                if (err) {
                    console.log(`Error from User.deleteMany(): ${err}`);
                }   else {
                    // Drop all the indexes after deletion or there will be E11000 duplicate key error
                    User.collection.dropIndexes();
                    console.log(`Deleted users: ${deletedUsers.deletedCount}`);
                    // Insert the bunnies
                    Bunny.insertMany(bunnies, (err, insertedBunnies) => {
                        if (err) {
                            console.log(`Error from Bunny.insertMany(): ${err}`);
                        }   else {
                            console.log(`Inserted bunnies: ${insertedBunnies.length}`);
                            // Register the users
                            users.forEach((user, index) => {
                                const bunny = insertedBunnies[index];
                                User.register({username: user.username, bunny: bunny}, user.password, (err, registeredUser) => {
                                    if (err) {
                                        console.log(`Error from User.register(): ${err}`);
                                    }   else {
                                        bunny.owner = registeredUser;
                                        bunny.save();
                                    }
                                })
                                console.log(`Inserted users: ${index + 1}`);
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = seedDB