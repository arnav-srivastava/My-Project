const express =require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const dotenv= require("dotenv").config()




const app=express()
app.use(cors())
app.use(express.json({limit:"10mb"}))

const port = process.env.PORT || 8080

//mongodb connection
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("db connected successfully"))
  .catch(error => console.log(error));

// schema
const userSchema = mongoose.Schema({
  firstName: String,
    lastName: String,
    email: {
      type : String,
      unique : true,
    },
    password: String,
    confirmpassword: String,
    image: String,
})

const userModel =mongoose.model("user",userSchema)

// api
app.get('/', (req, res) => {
    res.send('Server is running')
  })


// signup section
app.post('/signup', async(req, res) => {
    console.log(req.body)
    const {email}= req.body;

    const emailfound=await userModel.findOne({email:email});
      if(emailfound){
        res.send({message: "Email id is already registered",alert : false})
      }
      else{
        const data =userModel(req.body)
        const save= data.save()
        res.send({message : "Successfully sign up",alert : true})
      }
    })


  // api login
  app.post('/login',async(req,res)=>{
    console.log(req.body)
    const {email}= req.body;

    const result=await userModel.findOne({email:email});
      if(result){
        const dataSend= {
          id:result._id,
          firstName:result.firstName,
          lastName:result.lastName,
          email:result.email,
          image:result.image,
        };
        console.log(dataSend)
        res.send({message: "Login Successfully",alert : true, data:dataSend})
      }
      else{
        res.send({message: "Email or Password mismatch",alert : false})

      }
      
  })

  // product section

  const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String
  });

  const productModel =mongoose.model("product",schemaProduct);


  // save product in data
  // api

  app.post("/uploadProduct",async(req,res)=>{
      console.log(req.body);
      const data =await productModel(req.body);
      const datasave = await data.save()

      res.send({message : "Upload Sucessfully"})
  })


  app.listen(port, () => {
    console.log(`Server app listening on port ${port}`)
  })