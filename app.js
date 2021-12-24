const express = require('express');
const fs = require('fs/promises');
var bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const config = require('./config.json');
const cors = require('cors');
const path = require('path');

//Mongo client
const client = new MongoClient(config.finalUrl);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));

//landing page
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '/public/info.html'));
});

//ROUTES FOR MY LIST PAGE
//GET all coins from my list (works)
app.get('/list', async (req,res) => {

  try {
    //connect to db
    await client.connect();

    const colli = client.db('Coinstack').collection('CoinstackMyList');
    const myList = await colli.find({}).toArray();

    //send back file
    res.status(200).send(myList);
  } catch(error){
    console.log(error);
    res.status(500).send({
      error: 'something went wrong',
      value: error
    });
  }finally{
    await client.close();
  }
});

//POST coins to list (works)
app.post('/list', async (req,res) => {
    /** 
  if(!req.body.uuid || !req.body.name || !req.body.iconUrl || !req.body.price || !req.body.marketCap){
    res.status(400).send({
      error: 'something went wrong uWu', req
    })
    return;
  }
  */
console.log(req.body);
  try{
    //connect db
    await client.connect();
    //retrieve data from collection
    const colli = client.db('Coinstack').collection('CoinstackMyList');

    //Check for double
    //const chlng = await colli.findOne({name: req.body});

    //if(chlng){
    //  res.status(400).send('Bad request: coin already exists with name '+ req.body.name);
    //  return;
    //}
    //create new object
    let coin = {
    uuid: req.body.uuid,
    name: req.body.name,
    iconUrl: req.body.iconUrl,
    price: req.body.price,
    marketCap: req.body.marketCap
    }

    //let insertResult2 = await colli.insertOne(req.body)
    
    //insert
    let insertResult = await colli.insertOne(coin);

    //send error or succes msg
    //res.redirect("/web2-frontend-gregoryvettorel2/docs/index.html");
    }catch(error){
      console.log(error);
      res.status(500).send({
        error: 'something went wrong',
        value: error
      });
      //close client
  }finally{
    await client.close()
  }
  
  await client.close()

});

//Delete coin (works)
app.delete('/list/:uuid', async (req,res) => {
  try {

    await client.connect(); 

    const colli = client.db('Coinstack').collection('CoinstackMyList');

    const uuid = req.params.uuid;

    await colli.deleteOne({
      uuid
    })

  }finally{
    console.log("deleted")
    await client.close()
  }
});


//ROUTES FOR PORTFOLIO PAGE
//get portfolio coins (works)
app.get('/portfolio', async (req,res) => {

  try {
    //connect to db
    await client.connect();

    const colli = client.db('Coinstack').collection('CoinstackMyPortfolio');
    const myList = await colli.find({}).toArray();

    //send back file
    res.status(200).send(myList);
  } catch(error){
    console.log(error);
    res.status(500).send({
      error: 'something went wrong',
      value: error
    });
  }finally{
    await client.close();
  }
});

//post new portfolio coin (works)
app.post('/portfolio', async (req,res) => {

  try {
    await client.connect();

    const colli = client.db('Coinstack').collection('CoinstackMyPortfolio');
    
    let coin = {
      name: req.body.name,
      symbol: req.body.symbol,
      quantity: req.body.quantity,
      price: req.body.price
      }

  //insert
  let insertResult = await colli.insertOne(coin);

  //send error or succes msg
  }catch(error){
    console.log(error);
    res.status(500).send({
      error: 'something went wrong',
      value: error
    });
  }finally{
    //res.redirect("");
    await client.close();
  }
});

//delete portfolio coin (works)
app.delete('/portfolio/:symbol', async (req,res) => {
  try {

    await client.connect(); 

    const colli = client.db('Coinstack').collection('CoinstackMyPortfolio');

    const symbol = req.params.symbol;

    await colli.deleteOne({
      symbol
    })

  }finally{
    console.log("deleted")
    await client.close()
  }

});

//to do
app.put('/', async (req,res) => {
  try {
    await client.connect();

    const colli = client.db('Gamification').collection('Challenge');

  //Check if already exists
  /** 
    const chlng = await colli.findOne({name: req.body.name});
      if(chlng.name == req.body.name && chlng.course == req.body.course && chlng.points == req.body.points && chlng.session == req.body.session){
        res.status(400).send('Bad request: no value to update, please enter a different value');
        return;
        }
    */

    const chlng2 = await colli.findOne({name: req.body.name});

    await colli.updateOne({
      name: req.body.name,
      course: req.body.course,
      points: req.body.points,
      session: req.body.session
    })

    console.log("updated")

  }finally{
    await client.close();
  }
});

//APP LISTEN VERIFICATION
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})