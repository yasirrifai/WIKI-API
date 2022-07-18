const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const ejs = require('ejs');


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })


  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("article created succesfully");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("All articles deleted succesfully");
      }
    });
  });

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (err) {
        res.send(err);
      } else {
        res.send(article);
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated");
        }
      }
    );

  })
  .patch(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully update article")
        }
      }
    );
  })
  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully deleted")
        }
      }
    );
});

app.listen(3000, function() {
  console.log("Listening from port: 3000");
})
