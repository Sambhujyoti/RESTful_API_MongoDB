const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/WikiDB').then(() => {
    
    const articleSchema = new mongoose.Schema({
        title: String,
        content: String
    });
    
    const Article = mongoose.model('Article', articleSchema);

    //////////////////////////// Request targeting all articles ///////////////////////////

    app.route("/articles")
        .get((req, res) => {
            Article.find().then((foundArticles) => {
                res.send(foundArticles);
            }).catch((err) => {
                console.error(err);
            });
        })
        .post((req, res) => {
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            newArticle.save().then(() => {
                res.send("Successfully added a new article.");
            }).catch((err) => {
                res.send(err);
            });
        })
        .delete((req, res) => {
            Article.deleteMany().then(() => {
                res.send("All articles have been deleted!");
            }).catch((err) => {
                res.send(err);
            });
        });

    //////////////////////////// Request targeting a specific article ///////////////////////////

    app.route("/articles/:articleTitle")
        .get((req, res) => {
            Article.findOne({title: req.params.articleTitle}).then((foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No article found!");
                }
            }).catch((err) => {
                console.error(err);
            });
        })
        .put((req, res) => {
            Article.findOneAndReplace({title: req.params.articleTitle}, {
                title: req.body.title,
                content: req.body.content
            }).then((foundTitle) => {
                if (foundTitle) {
                    res.send("Article found and replaced with new entry.");
                } else {
                    res.send("Article title not found!");
                }
            }).catch((err) => {
                console.error(err);
            });
        })
        .patch((req, res) => {
            Article.findOneAndUpdate({title: req.params.articleTitle}, {
                $set: req.body
            }).then((foundTitle) => {
                if (foundTitle) {
                    res.send("Article found and updated with the new entry.");
                } else {
                    res.send("Article title not found!");
                }
            }).catch((err) => {
                console.error(err);
            });
        })
        .delete((req, res) => {
            Article.findOneAndDelete({title: req.params.articleTitle}).then((foundTitle) => {
                if (foundTitle) {
                    res.send("Article found and deleted.");
                } else {
                    res.send("Article title not found!");
                }
            }).catch((err) => {
                console.error(err);
            });
        });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("Server started on port " + port);
    });
}).catch((err) => {
    console.error(err);
});