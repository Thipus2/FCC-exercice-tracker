const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser=require('body-parser')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({extented : false}));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
//beg

var allUsers=[];
var allExercises=[];
var count=1;

app.post("/api/users",function(req,res,next){
  //var regexCheck=/[^_]*$/
  //const idToInclude=req.body.username.match(regexCheck)[0];
  //const userNameToInclude=req.body.username.match(/.*_/)[0].slice(0,-1);
  //console.log(userNameToInclude,idToInclude);
  const userNameToInclude=req.body.username;
  if (!allUsers.find(({username}) => username===req.body.username)){
  idToInclude=count.toString();
  count++;
  allUsers.push({"username":userNameToInclude,"_id":idToInclude,"log":[],"count":0});
  res.send({username:userNameToInclude,_id:idToInclude});
  } else {
    res.send({username:userNameToInclude,_id:allUsers.find(({username}) => username==userNameToInclude)._id})
  }
});

app.get("/api/users",function(req,res,next){
  res.send(JSON.stringify(allUsers));
  next();
})

app.post("/api/users/:_id/exercises",function(req,res,next){
  const idUser=req.params._id;
  const descriptionToAdd=req.body.description;
  const durationToAdd=parseInt(req.body.duration);
  var today=new Date(Date.now());
  var dateToAdd=today.toDateString();
  if(req.body.date!==undefined){
    dateToAdd=new Date(req.body.date);
    dateToAdd=dateToAdd.toDateString();
  }
   const usernameToAdd=allUsers.find(({_id}) => _id==idUser).username;
   allUsers.find(({_id}) => _id==idUser).log.push({description:descriptionToAdd,duration:durationToAdd,date:dateToAdd});
   allUsers.find(({_id}) => _id==idUser).count=count+1;
  res.send({_id:idUser,username:usernameToAdd,date:dateToAdd,duration:durationToAdd,description:descriptionToAdd});
  next();
});

app.get("/api/users/:_id/logs",function(req,res,next){
  const idUser=req.params._id;
  const fromDate=req.query.from
  const toDate=req.query.to;
  const limitCount=req.query.limit;
  userToLog=allUsers.find(({_id}) => _id==idUser);
  const usernameToLog=userToLog.username;
  const countToLog=userToLog.count;
  var logToLog=userToLog.log;

  console.log(fromDate,toDate,limitCount);

  if(fromDate!==undefined){
    logToLog.filter(({date})=>{return Date(date)>=Date(fromDate)})
  };
  if(toDate!==undefined){
    logToLog.filter(({date})=>{return Date(date)<=Date(fromDate)})
  };
  if(limitCount!==undefined){
    if(logToLog.length>limitCount){
      logToLog.splice(logToLog.length-limitCount,limitCount);
    }
  }

  res.send({username:usernameToLog,count:countToLog,_id:idUser,log:logToLog});
  next();
})

