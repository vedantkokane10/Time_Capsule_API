import express from "express";
import authenticationRoutes from './routes/authenticationRoutes.js'
import sequelize from './config/databaseConnection.js';
import expiresCapsule from "./cronJobs/capsuleExpiry.js";
import capsuleRoutes from './routes/capsuleRoutes.js';



const PORT = 8000
const app = express()

app.use(express.json())

sequelize.sync()
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });


const greet = (req,res) =>{
    res.json({"message":"Welcome to capsule time api"})
}


// Every hour (60 x 60 x 1000)
setInterval(expiresCapsule, 60000);

app.get('/',greet);
app.use('/auth', authenticationRoutes)
app.use('/capsules', capsuleRoutes);



app.listen(PORT,()=>{
    console.log("Listing to port ",{PORT})
})

export default app;