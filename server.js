var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var mongoose = require("mongoose");


var app = express();

var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapeDB", { useNewUrlParser: true });

app.get("/data", function(req, res) {
   axios.get("http://www.fox5atlanta.com/").then(function(response) {
       var $ = cheerio.load(response.data);

       $("").each(function(j, element) {
           var result = {};

           result.title = $(this).children("a").text();
           result.link = $(this).childrne("a").attr("href");

           db.Data.create(result).then(function(dbData) {
               console.log(dbData);
           }).catch(function(err) {
               console.log(err);
           });
       });

       res.send("Scrape Complete");
   });
});

app.get("/news", function(req, res) {
   db.Data.find({}, function(err, data) {
       res.json(data);
   });
});

app.get("/news/:id", function(req, res) {
   db.Data.find({_id: mongojs.ObjectId(req.params.id)}).populate("note").then(function(dbData){
       res.json(dbData);
   }).catch(function(err){{
       res.json(err);
   }});
});

app.post("/news/:id", function(req, res){
   db.Note.create(req.body).then(function(dbNote){
       return db.Data.findOneAndUpdate({_id: req.params.id }, {new: true});
   }).then(function(dbData){
       res.json(dbData);
   }).catch(function(err){
       res.json(err);
   });
});

app.listen(PORT, function(){
   console.log("App running on port " + PORT + "!");
});