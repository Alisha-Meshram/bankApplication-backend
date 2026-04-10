import mongoose from "mongoose";


export async function ConnectDatabase(){
  
        try {
           await mongoose.connect(process.env.MONGOOSE_URL)
            console.log('Database connected successfully')
        } catch (error) {
            console.log(error)
        }
   
}
