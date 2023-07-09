//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Anyone can connect with their audience through blogging and enjoy the myriad benefits that blogging provides: organic traffic from search engines, promotional content for social media, and recognition from a new audience you haven't tapped into yet.If you've heard about blogging but are a beginner and don't know where to start, the time for excuses is over. Not only can you create an SEO-friendly blog, but we'll cover how to write and manage your business's blog as well as provide helpful templates to simplify your blogging efforts.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// Database stuff
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema)

// Home Section
app.get("/", function (req, res) {
  Post.find({}).then((posts) => { res.render("home", { homeStartContent: homeStartingContent, postList: posts }); });

  // console.log(Posts);
});


//Compose section
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  post.save();
  res.redirect("/");
})

// Custom posts section

var customPosts = [];

// app.get("/posts/:customName",function(req,res)
// {
//   Post.find({title:req.body.customName}).then((posts)=>{res.render("post",{postList:posts}); console.log(posts);});
// });

app.get("/posts/:customName", function (req, res) {

  const requestedPostId = req.params.customName;

  Post.findOne({ title: requestedPostId }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get(3000, function (req, res) {
  console.log("Listening to port 3000");
});




const itemSchema = {
  name: String
};

var Item = mongoose.model("Item", itemSchema);

var item1 = new Item({ name: "task 1" });
var item2 = new Item({ name: "task 2" });
var item3 = new Item({ name: "task 3" });

const listItems = [item1, item2, item3];
// to do list section
app.get("/todolist", function (req, res) {
  Item.find({ name: { $ne: null } }).then((foundItems) => {
    if (foundItems.length === 0) {
      res.render("list", { newListItems: [], listTitle: "Today" });
    }
    else {
      res.render("list", { newListItems: foundItems, listTitle: "Today" });
    }
  })
});

app.post("/todolist", function (req, res) {
  const itemName = req.body.newItem;
  const listListName = req.body.list;
  console.log(itemName);
  const item = new Item({ name: itemName });
  if (listListName === "Today") {
    if (itemName === "") {
      res.redirect("/");
    }
    else{
      item.save();
    res.redirect("/todolist");
    }
    
  }
});

// delete post

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId).then((err) => { if (!err) { res.render("/todolist"); } else { res.redirect("/todolist"); } });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});

app.post("/posts/delete",function(req,res)
{
  console.log(req.body.checkbox);
  Post.findByIdAndRemove(req.body.checkbox).then((err)=>{
    if(!err)
    {
      res.redirect("/");
    }
    else
    {
      res.redirect("/");
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
