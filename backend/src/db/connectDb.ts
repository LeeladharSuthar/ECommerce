import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(`${process.env.DBURL}/${process.env.DBName}`)
        .then((db) => {
            console.log(`DB Connected: ${db.connection.host}`)
        })
        .catch((e) => {
            console.log(`MONGODB CONNECTION ERROR: ${e}`)
            process.exit(1)
        })

}


export { connectDB }