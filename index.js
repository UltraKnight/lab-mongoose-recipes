const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
//const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
  })
  .then(() => {
    /* Iteration 2 - INSERTING ONE RECIPE */
    Recipe.create({title: 'Rice', level: 'Easy Peasy', ingredients: ['rice', 'water'], cuisine: 'casual', dishType: 'main_course', duration: 1, creator: 'someone'})
    .then((createdRecipe) => {
      console.log(`You created the fantastic recipe of ${createdRecipe.title}`);

        /* Iteration 3 - INSERTING RECIPES FROM DATA.JSON*/
        /* after doing this I saw the data variable ¬¬ */
        const fs = require('fs');
        let content = JSON.parse(fs.readFileSync('data.json'));
        Recipe.insertMany(content)
        .then(() => {
          console.log(`Recipes inserted`);

          const updateDeleteAndClose = async () => {
            try {
              /*Iteration 4 - UPDATING A RECIPE*/
              await Recipe.findOneAndUpdate({title: 'Rigatoni alla Genovese'}, {duration: 100});
              console.log('Recipe Updated!');

              /*Iteration 5 - REMOVING A RECIPE*/
              await Recipe.deleteOne({title: 'Carrot Cake'});
              console.log('Recipe deleted');

              /*Iteration 6 - CLOSING THE CONNECTION*/
              mongoose.connection.close();
            } catch (error) {
              console.log(error);
            }
          };
          updateDeleteAndClose();
        });
    });
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });