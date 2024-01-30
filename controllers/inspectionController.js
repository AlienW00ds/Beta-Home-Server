const INSPECTION = require('../models/inspection')

// create I
const createInspection = async (req,res) => {
    // const {firstName, lastName, email, phoneNumber, location, inspectionDate, inspectionDateTime} = req.body

    try{
        const inspection = await INSPECTION.create({...req.body})
        res.status(201).json({success: true,inspection})
    }catch (error){
        res.status(500).json(error)
    }
};


// get all inspection
const getAllInspections = async (req,res) => {
    try{
        const inspection = await INSPECTION.find().sort("-createdAt")
        res.status(200).json({success:true, inspection})
    }catch (error){
        res.status(500).json({err: 'Internal Server Error'})
    }
}

module.exports = { createInspection, getAllInspections}