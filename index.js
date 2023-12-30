import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

let posts = [];


function createpost(body){
  let date = new Date();
  posts.push(
    {
      title: body.title, 
      text: body.text, 
      date: date.toLocaleString()
    }
    );
};
function updatepost(index, post){
  posts[index] = post;
}
function deletepost(index){
  posts.splice(index,1);
}
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res)=>{
  const posts1 = [];
  posts.forEach(post => {
    if(post.text.length>300  && posts.indexOf(post) == posts.length - 1){
      let t = post.text.slice(0,300);
      t = t + '....';
      posts1.push({title: post.title, text: t, date: post.date});
      t = '';
    }
    else if(post.text.length>150  && (posts.indexOf(post) == posts.length - 2 || posts.indexOf(post) == posts.length - 3))
    {
      let t = post.text.slice(0,150);
      t = t + '....';
      posts1.push({title: post.title, text: t, date: post.date});
      t = '';
    }
    else{
      posts1.push(post);
    }
  });
  console.log(posts);
  res.render("index.ejs", {posts: posts1});
})

app.get("/create", (req, res)=>{
  res.render("create.ejs");
})

app.get("/edit/:id", (req, res)=>{
  let i = req.params.id;
  res.render("create.ejs" ,{post: posts[i], index: i});
})

app.post("/createpost", (req, res)=>{
  createpost(req.body);
  res.redirect('/');
})

app.get("/delete/:id", (req, res)=>{
  let i = req.params.id;
  deletepost(i);
  res.redirect('/');
})

app.post("/createpost/:id", (req, res)=>{
  let i = req.params.id;
  let d = new Date();
  let post = {
    title: req.body.title, 
    text: req.body.text, 
    date: d.toLocaleString()
  }
  updatepost(i, post);
  res.redirect('/view/'+i );
})

app.get("/view/:id", (req, res)=>{
  let i = req.params.id;
  res.render("view.ejs", { post: posts[i], index: i} );
})

app.get("/about", (req, res)=>{
  res.render("about.ejs");
})

app.get("/contact", (req, res)=>{
  res.render("contact.ejs");
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
