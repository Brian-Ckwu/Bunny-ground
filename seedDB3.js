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
    },
    {
        title: 'The fourth post',
        image: 'https://images.unsplash.com/photo-1496943388386-e569e2b970a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Et aute id dolore laboris et minim officia Lorem est duis dolore nisi ipsum est. Labore exercitation labore nostrud labore dolore sint duis ullamco elit culpa voluptate magna. Magna voluptate eu nisi nulla in ex irure quis non irure incididunt pariatur ipsum irure. Pariatur ea enim ea eu ea enim.'
    },
    {
        title: 'The fifth post',
        image: 'https://images.unsplash.com/photo-1586619031147-0f48d66c10f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
        text: 'Consequat est labore sint tempor aute deserunt culpa. Adipisicing dolor proident sit velit exercitation occaecat dolor incididunt labore. Sunt ea pariatur elit fugiat amet sunt deserunt eiusmod minim nisi Lorem et dolore. Lorem duis magna in enim Lorem reprehenderit. Esse laboris ex officia nulla officia aute sint anim non tempor. Ex eiusmod sit dolor reprehenderit cillum aliqua do quis ut exercitation. Non magna aliquip id nulla nulla ea deserunt cillum laboris commodo officia aliqua voluptate.'
    },
    {
        title: 'The sixth post',
        image: 'https://images.unsplash.com/photo-1547836291-f794e30d524a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Et mollit aute officia esse irure ipsum proident voluptate in. Aliqua sunt sunt quis consequat sint amet magna irure. Dolore voluptate voluptate consectetur non pariatur anim nulla pariatur aute in voluptate do Lorem dolore. Ea veniam anim est ut officia eiusmod id culpa cupidatat enim voluptate fugiat do. Id aliquip consectetur duis Lorem fugiat veniam quis adipisicing magna dolor et adipisicing. Esse aliqua quis aliqua fugiat id aute excepteur cupidatat ea officia irure.'
    },
    {
        title: 'The seventh post',
        image: 'https://images.unsplash.com/photo-1496942370798-457183cb0684?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Adipisicing in occaecat aliquip excepteur irure ipsum in anim qui cillum sit. Excepteur aute mollit enim ad et pariatur dolore. Mollit pariatur dolor irure id aliqua pariatur duis enim aliquip officia cupidatat elit excepteur. Excepteur laboris voluptate occaecat ipsum. Do incididunt ea reprehenderit anim. Eiusmod Lorem sit nostrud adipisicing.'
    },
    {
        title: 'The eighth post',
        image: 'https://images.unsplash.com/photo-1599169713100-120531cef331?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Nisi consectetur magna ut dolore est. Laboris sunt deserunt quis laborum nisi elit voluptate enim proident nostrud cillum nisi. Ex eu quis qui adipisicing reprehenderit magna dolore tempor sit. Ipsum eu voluptate sint ex incididunt ipsum. Velit nisi deserunt ut ut cillum. Esse commodo incididunt culpa aliquip sint excepteur nisi. Occaecat minim minim irure sunt irure anim.'
    },
    {
        title: 'The nineth post',
        image: 'https://images.unsplash.com/photo-1598761543953-427c4344a587?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Ea pariatur Lorem deserunt culpa cillum. Ullamco amet elit ullamco ad eu nisi mollit. Nisi nisi duis laboris duis Lorem sunt deserunt qui aliquip dolor nostrud id mollit nulla. Veniam tempor excepteur ipsum veniam do et laboris exercitation labore irure adipisicing consectetur. Dolore quis enim labore fugiat culpa ea.'
    },
    {
        title: 'The tenth post',
        image: 'https://images.unsplash.com/photo-1578830589140-be672a11f5df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Et aliquip qui deserunt consectetur non labore eiusmod proident culpa anim fugiat ullamco exercitation laboris. In velit dolor amet amet. Minim ex cillum irure eiusmod laboris id enim laboris nulla. Consequat aute velit reprehenderit velit non tempor nisi qui eiusmod ad laborum ipsum. Ea commodo mollit culpa sint eiusmod pariatur occaecat Lorem cupidatat reprehenderit qui elit voluptate dolor.'
    },
    {
        title: 'The eleventh post',
        image: 'https://images.unsplash.com/photo-1597306599196-bf148477596b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Velit anim sit ipsum voluptate in magna ullamco tempor anim commodo enim. Anim elit fugiat id duis est aliqua. Reprehenderit pariatur ullamco et minim mollit eu anim qui dolor qui adipisicing deserunt. Sunt culpa veniam cillum proident quis labore sit aute officia sint aliquip adipisicing nostrud. Deserunt tempor ullamco adipisicing deserunt ad.'
    },
    {
        title: 'The twelveth post',
        image: 'https://images.unsplash.com/photo-1569865121166-770b4ed4035a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Amet eiusmod qui incididunt excepteur sint incididunt nostrud consectetur elit non ipsum sunt enim. Eu consectetur veniam ullamco id. Laboris magna est fugiat et commodo. Consequat aute aliquip adipisicing culpa qui. Aliqua ad et aute quis ad ex nostrud reprehenderit laboris.'
    },
    {
        title: 'The thirteenth post',
        image: 'https://images.unsplash.com/photo-1585574838433-b8a8a249140e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjg2ODQyfQ&auto=format&fit=crop&w=600&q=60',
        text: 'Id ex proident mollit reprehenderit. Id ad sint magna irure et eiusmod. Dolor veniam enim mollit nulla consectetur. Enim ex incididunt officia sit quis consectetur consequat commodo exercitation proident pariatur.'
    },
    {
        title: 'The fourteenth post',
        image: 'https://images.unsplash.com/photo-1535241556859-780cb9f395f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Dolore minim fugiat irure excepteur id nostrud cillum ex occaecat tempor. Cupidatat eu sunt in ut sint laboris mollit proident incididunt do velit. Tempor ullamco eiusmod exercitation excepteur ea excepteur veniam ad mollit magna reprehenderit. Tempor ut id esse dolore cillum laborum quis esse proident qui exercitation consequat ex. Reprehenderit elit irure voluptate anim ut consequat voluptate nulla. Ipsum irure culpa excepteur adipisicing. Sit quis ipsum fugiat aliqua ex sint adipisicing ut.'
    },
    {
        title: 'The fifteenth post',
        image: 'https://images.unsplash.com/photo-1598761632170-3931f53b0dee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
        text: 'Aliqua laboris est reprehenderit magna consequat occaecat ullamco anim nisi fugiat. Anim est voluptate mollit est anim veniam amet est nostrud sint reprehenderit eu cupidatat aliquip. Enim aliqua veniam qui exercitation incididunt nostrud eu. Culpa qui irure aliqua reprehenderit est magna quis anim ad adipisicing.'
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

    // Insert the posts
    const insertedPosts = await Post.insertMany(posts);
    console.log(`Inserted posts: ${insertedPosts.length}`);

    // Associate the bunnies with the users and the posts
    const bunnyArray = [];
    insertedBunnies.forEach((bunny, index) => {
        const bunnyOwner = insertedUsers[index];
        const bunnyPosts = [insertedPosts[3 * index + 0], insertedPosts[3 * index + 1], insertedPosts[3 * index + 2]];
        bunnyArray.push(Bunny.findOneAndUpdate({_id: bunny._id}, {owner: bunnyOwner, posts: bunnyPosts}, {new: true}));
    })
    const updatedBunnies = await Promise.all(bunnyArray);
    console.log(`Updated bunnies: ${updatedBunnies.length}`);

    console.log('Seeding completed');
}

// seedDB();

module.exports = seedDB