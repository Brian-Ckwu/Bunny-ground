const mongoose = require('mongoose'),
      User     = require('./models/user'),
      Bunny    = require('./models/bunny'),
      Post     = require('./models/post');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
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

const posts = [
    {
        title: 'The first post',
        image: 'https://images.unsplash.com/photo-1591382386627-349b692688ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Voluptate sit eu aute dolor consequat non dolor. Sit ex id ea ad nulla id labore. Minim qui ea deserunt aliqua ipsum ex id sit non excepteur enim irure magna. Sunt in consequat sunt commodo excepteur amet. Eu eu in id ullamco sunt.'
        // Cannot embed author here because we need the user id to associate data
    },
    {
        title: 'The second post',
        image: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Anim cupidatat quis magna elit minim amet enim. In ea id exercitation exercitation fugiat magna adipisicing sit enim excepteur non labore. Incididunt amet non sit duis.'
    },
    {
        title: 'The third post',
        image: 'https://images.unsplash.com/photo-1469532804526-98aa275b657c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
        text: 'Sint aliquip do cillum in esse. Cupidatat sunt irure nulla dolor Lorem ullamco excepteur minim fugiat laboris mollit do. Velit fugiat Lorem reprehenderit ut exercitation reprehenderit non est ipsum mollit est deserunt in fugiat. Officia non pariatur proident anim ut.'
    }
]

// Refactored seedDB using Promises
async function seedDB() {
    // Delete the bunnies, users, and posts
    const deleteArray = await Promise.all([
        Bunny.deleteMany({}),
        User.deleteMany({}),
        Post.deleteMany({})
    ]);

    console.log(`Deleted bunnies: ${deleteArray[0].deletedCount}`);
    console.log(`Deleted users: ${deleteArray[1].deletedCount}`);
    console.log(`Deleted posts: ${deleteArray[2].deletedCount}`);

    // Insert the bunnies, users, and posts
    // Insert the bunnies
    const insertedBunnies = await Bunny.insertMany(bunnies);
    console.log(`Inserted bunnies: ${insertedBunnies.length}`);
    // Register the users
    const registerArray = [];
    users.forEach((user, index) => {
        // Associate the user with the bunny
        registerArray.push(User.register({username: user.username, bunny: insertedBunnies[index]}, user.password))
    })
    const insertedUsers = await Promise.all(registerArray);
    console.log(`Inserted users: ${insertedUsers.length}`);
    // Associate the bunny with the user
    const bunnyArray = [];
    insertedBunnies.forEach((bunny, index) => {
        const owner = insertedUsers[index];
        // bunnyArray.push(bunny.save());
        // Try using findOneAndUpdate() instead to solve the problem
        bunnyArray.push(Bunny.findOneAndUpdate({_id: bunny._id}, {owner: owner}, {new: true}));
    })
    // Array: inspection iterrupted prematurely. Maximum call stack size exceeded???
    // const ownedBunnies = await Promise.all(bunnyArray);
    // console.log(ownedBunnies);
    const updatedBunnies = await Promise.all(bunnyArray);
    console.log('Seeding completed');
}

seedDB();

module.exports = seedDB