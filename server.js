//Defining al modules
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var express = require('express'),
  app = module.exports.app = express();
var server = http.createServer(app);
server.listen(8000);
app.use(express.static('views'))
var io = require('socket.io').listen(server);
let db;
const bodyParser= require('body-parser')
const multer = require('multer');
var fs = require('fs');
const ObjectId = require('mongodb').ObjectID
app.use(bodyParser.urlencoded({extended: true}))



//If app gets / load index.ejs
app.get('/', function(req, res){
    res.render('index.ejs');
})


// SET STORAGE for images
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
var upload = multer({ storage: storage })

//Database link
const myurl = 'mongodb+srv://daanbankers1:Senna4444@cluster0-ybw87.mongodb.net/test?retryWrites=true&w=majority';
 
//Connecting to the right database
MongoClient.connect(myurl, (err, client) => {
  if (err) return console.log(err)
  db = client.db('Images') 
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

//When the user submits the uploadphoto form
app.post('/uploadphoto', upload.single('picture'), (req, res) => {
  //Getting the image
    var img = fs.readFileSync(req.file.path);
    //Encoding the image
 var encode_image = img.toString('base64');
 
  // Define a JSONobject for the image attributes for saving to database
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };

//Inserting the image in the database
db.collection('Pictures').insertOne(finalImg, (err, result) => {
    console.log(result)
 
    if (err) return console.log(err)
 
    console.log('saved to database')
    res.redirect('/')  
  })
})

//If the url gets poster load poster.ejs
app.get('/poster', function(req,res){
    res.render('poster.ejs');
})

//creating listeners
var listener = io.listen(server);

    listener.sockets.on('connection', function(socket){
      
    //What happens when get start from client
        socket.on('start', function(data){
            getPic(); 
            //getting pic out of database
            setInterval(getPic, 1000);     
        });    
 })

 function getPic(){
        //Getting all pics from database
        db.collection('Pictures').find().toArray((err, result) => { 
            if(result == ""){
                console.log('no images');
            } 
            else{  
              //Getting last uploaded image
            let LastImage = result[result.length-1].image.buffer;
           //Make bufferstring
           let bufferString = LastImage.toString("base64");
            io.emit("Buffer", bufferString)
            }
          })

 }

 