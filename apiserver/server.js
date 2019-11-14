const app = require('express')()
const cors = require('cors')
const Post = require('./Model/post')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


var db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log("Connected to mongod server")
})

mongoose.connect("mongodb://localhost/reactboard")

app.use(bodyParser.json())

app.get('/list', cors(), (req, res)=>{ //Read Boards
    console.log(req.query)
    Post.find({cate:req.query.cate},(err, posts)=>{
        if(err) return res.status(500).send({error:'database failure'})
        res.json(posts)
    }).sort({id:-1}).skip((req.query.page - 1)*10).limit(10)
})

app.get('/getpost', (req, res) => { //Read Post
    Post.find({cate:req.query.cate, id:req.query.id}, (err, posts) => {
        if(err)return res.status(500).send({error:'database failure'})
        res.json(posts)
    })
})


app.post('/post', cors(), (req, res)=> { //Create Post
    var post = new Post({
        cate: req.body.cate,
        author: req.body.author,
        title: req.body.title,
        body: req.body.body
    })

    post.save((err) => {
        if(err){
            console.error(err)
            res.json({result:0})
            return
        }
        else{
            console.log("데이터베이스에 추가됨!")
            res.json({result:1})
        }})
    })

app.listen(5000, console.log('서버 염'))