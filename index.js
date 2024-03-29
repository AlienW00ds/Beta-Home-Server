require ("dotenv").config();
const express = require("express")
const app = express()
const PORT = process.env.PORT || 4000
const cors = require("cors")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary").v2
const profileRouter = require("./routers/profileRouter")
const inspectionRouter = require('./routers/inspectionRouter')
const propertyRouter = require("./routers/propertyRouter")

// cloudinary config
cloudinary.config({cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_API_KEY, api_secret: process.env.CLOUD_API_SECRET})

// middlewares
app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => {
    res.status(200).send("BETA HOME SERVER")
});
app.use("/api/v1", profileRouter);  
app.use("/api/v1", inspectionRouter); 
app.use("/api/v1/property", propertyRouter);

// error route
app.use((req, res) => {
    res.status(404).send("resource not found");
})


// db connection
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: "BetaHomeServer" });
        app.listen(PORT, () => {
            console.log(`server running at ${PORT}`);
        });
    }  catch (error) {
        console.log(error);
    }
};

startServer();