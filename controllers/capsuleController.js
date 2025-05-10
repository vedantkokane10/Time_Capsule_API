import Capsule from "../models/capsule.js";
import {randomBytes} from 'crypto'
import asyncHandler from "express-async-handler"

// @description Creating capsule
// @route post capsule/
// @access public
const createCapsule = asyncHandler(async(req,res) =>{
    const messageText = req.body.message;
    const unlockTime = req.body.unlock_at;
    console.log(unlockTime)
    if(!messageText || !unlockTime){
        res.status(401).json({"message":"message and unlock_at is not provided"})
    }

    
    const unlockCode = randomBytes(6).toString('hex')
    const userEmail = req.user.email;
    const capsule = await Capsule.create({message:messageText, unlock_at:unlockTime, unlock_code:unlockCode,email:userEmail})
    res.status(201).json({"id":capsule.id, "unlock_code":capsule.unlock_code});
})


// @description fetching a single capsule
// @route get capsule/id:?code=
// @access public
const getCapsule = asyncHandler(async (req, res) => {
    const capsuleId = req.params.id;
    const userEmail = req.user.email;
    const givenUnlockCode = req.query.code;

    console.log('Query code:', givenUnlockCode); 

    const capsule = await Capsule.findOne({ where: { id: capsuleId }, raw: false });

    if (!capsule) {
        return res.status(404).json({ message: 'Invalid id' });
    }

    const unlockTime = new Date(capsule.unlock_at);
    const currentDate = new Date();
    const actualUnlockCode = capsule.unlock_code;

    const thirtyDaysLater = new Date(capsule.unlock_at).getTime() + (30 * 24 * 60 * 60 * 1000);

    if (currentDate < unlockTime) {
        return res.status(403).json({ message: 'Wait unlock time is yet to come' });
    }

    if (!givenUnlockCode || givenUnlockCode !== actualUnlockCode) {
        return res.status(401).json({ message: 'Wrong unlock code or unlock code not provided' });
    }

    if (capsule.expired || currentDate.getTime() > thirtyDaysLater) {
        capsule.expired = true;
        await capsule.save();
        return res.status(410).json({ message: 'Capsule expired 30 days after unlock!' });
    }

    return res.json(capsule);
});



// @description Creating capsule
// @route get capsule/?page=&limit=
// @access public
const listAllCapsules = (async(req,res) => {
    console.log("page - " + req.query.page)
    console.log("limit - " + req.query.limit)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page-1) * limit
    console.log(req.body)
    const {rows, toalCount} = await Capsule.findAndCountAll({where:{email:req.user.email}, offset, limit})



    const data = rows.map(row =>({
        id: row.id,
        unlock_at: row.unlock_at,
        expired: row.expired,
        message: new Date(row.unlock_at) <= new Date() ? row.message : undefined
    }))

    res.json({total:toalCount, page, capsules:data})
})

// @description updating a  capsule
// @route put capsule/id:?code=
// @access public
const updateCapsule = (async(req,res) =>{
    const capsuleId = req.params.id;
    const code = req.query.code;
    const newMessage = req.body.message;
    const newUnlockTime = req.body.unlock_at;

    const capsule = await Capsule.findOne({where:{id:capsuleId}, raw:false})
    //console.log(capsule)
    if(!capsule){
        res.status(404).json({"message" : "Capsule with the given id not found"})
        return
    }

    const currentDate = new Date()
    const unlockDate = new Date(capsule.unlock_at);

    if(currentDate >= unlockDate){
        res.status(403).json({"message" : "Capsule cannot be updated as unlock time reached"})
        return
    }

    if(code !== capsule.unlock_code){
        console.log(req.query.code)
        console.log(capsule.unlock_code)
        res.status(401).json({"message":"Wrong unlock code"})
        return
    }

    capsule.message = newMessage;
    capsule.unlock_at = newUnlockTime;
    await capsule.save()

    res.status(200).json({ updated: true, message:"Updated capsule" });
    return
})


// @description deleting a  capsule
// @route delete capsule/id:?code=
// @access public
const deleteCapsule = (async(req,res) =>{
    const capsuleId = req.params.id;
    const code = req.query.code
    
    const capsule = await Capsule.findOne({where:{id:capsuleId}, raw: false})
    if(!capsule){
        res.status(404).json({"message" : "Capsule with the given id not found"})
    }

    const currentDate = new Date()
    const unlockDate = new Date(capsule.unlock_at);

    if(currentDate >= unlockDate){
        res.status(403).json({"message" : "Capsule cannot be deleted as unlock time reached"})
    }

    if(code !== capsule.unlock_code){
        res.status(401).json({"message":"Wrong unlock code"})
    }

    await capsule.destroy();
    res.status(204).json({"message":"Succesfully deleted capsule with given id"})
})

export {createCapsule, getCapsule, listAllCapsules, updateCapsule, deleteCapsule};