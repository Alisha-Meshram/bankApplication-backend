import mongoose from "mongoose";


export async function ConnectDatabase(){
  
        try {
           await mongoose.connect('mongodb+srv://aalishameshram15_db_user:66x6HTv3gZveCHKy@cluster0.z0oicfq.mongodb.net/')
            console.log('Database connected successfully')
        } catch (error) {
            console.log(error)
        }
   
}
