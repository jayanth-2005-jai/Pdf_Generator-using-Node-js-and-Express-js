const { default: mongoose } = require('mongoose');
const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const DB_PATH = "mongodb+srv://root:Jayanth94@hellocoding.wwoug0x.mongodb.net/PG?retryWrites=true&w=majority&appName=hellocoding";
const app = express();
const userschema  = require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit',  async (req, res) => {
  try {
    const { name, course } = req.body;
    const user = new userschema({ name, course });
    await user.save();
    console.log(" User data saved successfully");
    const doc = new PDFDocument();
   const filePath = path.join(__dirname,'generated',`${name}_details.pdf`);
    if(!fs.existsSync(path.join(__dirname,'generated'))){
      fs.mkdirSync(path.join(__dirname,'generated'));
    }
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(28).text('User Details', {align:'center'});
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${name}`);
    doc.text(`Course: ${course}`);
    doc.text(`Date: ${Date}`);
    doc.end();
    stream.on('finish',()=>{
      res.download(filePath,`${name}.details.pdf`);
    })


    
  } catch (err) {
    console.error('Error saving user data:', err);
    res.send('Error saving user data');
  }
});




app.use(userschema);
const port = 3010;
mongoose.connect(DB_PATH).then(() => {
    console.log("DB CONNECTED SUCCESSFULLY");
    app.listen(port,()=>{
      console.log(`Server is ruuning on http://localhost:${port}`);
    })
}).catch((err) => {
    console.log("DB CONNECTION FAILED", err);
});