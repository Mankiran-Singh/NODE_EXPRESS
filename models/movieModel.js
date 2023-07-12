const mongoose=require('mongoose');
const fs=require('fs')
const validator=require('validator')

const moviesSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required field"],
        unique:true,
        maxLength:[100,"Name must not have more than 100 chars"],
        minLength:[4,"Name must have atLeast 4 chars"],
        trim:true,
        validate:[validator.isAlpha,"Name should only contain alphabets"]
    },
    description:{
        type:String,
        required:[true,"Description is required field"],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,"duration is required field"]
    },
    ratings:{
        type:Number,
        validate:{
            validator:function(value){
                return  value>=1 && value<=10; //this.rating>=10 will work in case of creating document because it will point to current document
            },
            message:"Ratings ({VALUE}) should be above one"
        }
       // default:1.0
    },
    totalRatings:{
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true,'Release year is required field!']
    },
    releaseDate:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false //to exclude field in res
    },
    genres:{
        type:[String],
        required:[true,'Genres is required field'],
        enum:{
            values:['Action',"Adventure","Romance"],
            message:"This genre does not exist"
        }
    },
    coverImage:{
        type:String,
        required:[true,'CoverImage is required']
    },
    actors:{
        type:[String],
        require:[true,"actors is required field"]
    },
    price:{
        type:Number,
        require:[true,'Directors is required field']
    },
    createdBy:String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
moviesSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
});

//EXECuted before the document is saved in db
//.save .create
//save event will not happen in case of insertMany,findByIDAndUpdate
moviesSchema.pre('save',function(next){
    //pre hook
    this.createdBy="MANKIRAN"; //updated document just before getting saved
    next();
})

moviesSchema.post('save',function(doc,next){
    const content=`A new movie document with the name ${doc.name} has been created by ${doc.createdBy}\n`
   fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
      console.log(err.message)
   })
   next();
})

// moviesSchema.pre('find',function(next){
//     this.find({releaseDate:{$lte:Date.now()}});
//     next();
// })

moviesSchema.pre(/^find/,function(next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.startTime=Date.now();
    next();
})

moviesSchema.post(/^find/,function(doc,next){
    this.find({releaseDate:{$lte:Date.now()}});
    this.endTime=Date.now();

    const content=`Query took ${this.endTime - this.startTime} milliseconds to fetch the documents`
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err.message)
     })
    next();
})

moviesSchema.pre('aggregate',function(next){
    console.log(this.pipeline().unshift({$match:{releaseDate:{$lte:new DataView()}}}))
    next();
})

const Movie=mongoose.model('Movie',moviesSchema)
module.exports=Movie