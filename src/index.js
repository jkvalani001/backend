import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app} from './app.js';

dotenv.config({
    path:'./.env'
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT ,()=>{
        console.log(`Server is running on port ${process.env.PORT }`);
    })
})
.catch((err)=>{
    console.log("Error connecting to the database:", err);
    process.exit(1); // Exit process with failure
});

















/*    const app = express()
    // EFFE +trycatch+async-await
    (async ()=>{
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error",()=>{
                console.log("Error",error)
                throw error
            })

            app.listen(process.env.PORT,()=>{
                console.log(`Server is running on port ${process.env.PORT}`)
            })
        } catch (error) {
            console.error("Error",error);
            throw err
        }
    })()*/