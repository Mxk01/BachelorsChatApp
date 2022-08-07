let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();
let port = process.env.PORT || 5000;
let mysql = require('mysql');
let fileUpload = require('express-fileupload')
const bcrypt = require('bcrypt');
app.use(express.static("files"));


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'ChatApplication'
})
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload())

db.connect(err=> { 
    if(err) throw err  
   console.log('DB connection was made to the server')
});

app.get('/get-user/:email',(req,res)=>{
    console.log('Email is ' + req.params.email)
    let query = `SELECT * FROM users WHERE email='${req.params.email}'`;
    db.query(query,(err,result)=>{
        if(err) console.log(err.message);
       return res.json({message:result});
    })

})
app.post("/create-database/",(req,res)=>{
    let databaseName = req.query.databaseName;
    let query = `CREATE DATABASE ${databaseName}`;
    db.query(query,(err,result)=>{
        if(err) console.log(err.message);
       console.log("DB created succesfully!")
    })

})
app.post("/login-user/",(req,res)=>{
    // console.log(req.body);
    let {email,password} = req.body;
      let findUser = `SELECT * FROM users WHERE email='${email}'`;

      db.query(findUser,(err,result)=>{
        if(err) console.log(err.message) 
         if(result.length>0){
         return res.json({message:"Succesfully logged in!"})
        }
        else {
         res.json({message:"User could not be found in the database"})
        }
      })
   

})


app.post("/register-user/",(req,res)=>{
     let {username,email,password,followers,friends,fileUrl} = req.body;
    password = bcrypt.hashSync(password,12);
   
    let userExists = false; 
    let findUser = `SELECT * FROM  users where email ='${email}'`;
      // We'll handle the image upload here
    //   console.log(req.files);
    //   // path we'll be saving our files on 
    //   let filePath = __dirname + '/files/'
    //   let currentFile = req.files.file;
    //   if (!req.files) {
    //     res.send("File was not found");
    //     return;
    //   }
    //   console.log(req.files)
    //   console.log(currentFile)
    //   let currentFileName = currentFile.name;
      
    //   /* moving file to our /file folder  under it's name (e.g)
    //     '/file/test.png'
    //     */
    //     currentFile.mv(`${filePath}${currentFileName}`,(err)=>{
    //       if(err) {
    //         return res.json({message:"Failed to upload the file!"})
    //       } 
    //       else {
             
    //           return res.json({message:"File was succesfully uploaded!"})
    //       }
    //   })
  
   
    db.query(findUser,(err,result)=> {
         if(err) console.log(err.message) 
        if(result.length>0) { 
           
                return res.json({message:"An username with this email already exists!"})
                  
          
         
        }
        else {
            let query = `INSERT INTO users (Name,Email,Password,ImagePath) 
            VALUES ('${username}','${email}','${password}','${fileUrl}')`;
             db.query(query,(err,result)=>{
                if(err) console.log(err.message);
                return  res.json({message:"User added to the db!"})
    
            })
        }
 
    })
    

})
// app.post('/upload/:email', (req, res) => {
  
// });

app.post('/create-table',(req,res)=> {
    // let tableName = req.query.tableName;
    let query = `CREATE TABLE Users(

        ID int AUTO_INCREMENT,
        Name VARCHAR(255),
        EMAIL VARCHAR(255),
        PASSWORD VARCHAR(350),
        FOLLOWERS INT,
        FRIENDS INT,
        FOREIGN KEY(FOLLOWERS) REFERENCES FOLLOWERS(FOLLOWERID),
        FOREIGN KEY(FRIENDS) REFERENCES FRIENDS(FRIENDSID),
        PRIMARY KEY(ID)
        
        )`;
     db.query(query,(err,result)=>{
        if(err) console.log(`a` + err.message)
            console.log('Table succesfully created!!')
     })

})

app.listen(port,()=>{console.log(`Listening to the server at port ${port}`)})