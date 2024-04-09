const randomString = require('randomstring')
const mongoose = require('mongoose')
const Usuario = require('../../models/Usuario')
const Request = require('../../models/Request')
const RequestFriend = require('../../models/RequestFriend')
const Ban = require('../../models/Ban')
const sendEmail = require('../../config/nodemailer')
const Post = require('../../models/Post')

const delete_data = async(param)=>{
    await Request.deleteMany({userId:param})
    await RequestFriend.deleteMany({$or:[
        {fromUser:param},
         {toUser:param}
    ]})
    await Post.deleteMany({user:param})
}

// USER MODERATION

const get_all_users = async(req, res)=>{
    const users = await Usuario.find({})
    res.json(users)
}

const ban_profile = async(req, res)=>{ //post
    const {userId} = req.params
    const {name, cause} = req.body
    try{
        const user = await Usuario.findByIdAndDelete(userId)
        if(!user){
            res.status(404).json({state:"User not found"})
        }else{
            const ban = new Ban({
                userId:userId,
                name:name,
                cause:cause
            })
            const banOnDB = await ban.save()
            delete_data(userId)
            res.status(200).json({state:"User banned", bannedUser:user, ban:banOnDB})
        }
    }catch(err){
        res.json("Error", err)
    }
}

// REQUESTS

const get_requests = async(req,res)=>{
    const reqs = await Request.find({})
    res.json(reqs)
}

const get_request = async(req,res)=>{
    const {userId} = req.params
    const requested = await Request.findOne({userId:userId})
    if(requested){
        res.json(requested)
    }else{
        res.json("Error")
    }
}

const sent_request = async(req, res)=>{
    try{
        const {id, mail, body} = req.body
        await Request.create({mail:mail, userId:id, body:body})
        res.json("done")
    }catch(err){
        console.log(err)
    }
}

const acceptRequest = async (req,res)=>{
    const {userId} = req.body
    try{
        const user = await Usuario.findById(userId)
        const codeConfirmation = randomString.generate(7)
        await sendEmail(user,codeConfirmation)
        res.json({success : true})
    } catch(e){
        console.log('error when generate code',e)
    }
}

const verify_code = async (req, res)=>{
    const { code } = req.body
    const { userId } = req.params
    try{
        const user = Usuario.findById(userId)
        if(!user){
            res.status(404).json({ success: false, message:'error when searching user'})
        }
        const codeCorrect = await user.verifyAndSetRole(code)
        if(codeCorrect){
            return res.json({ success:true, message:'Code verified correctly. The user is now a Mod.'})
        }else{
            return res.status(400).json({ success: false, message: 'Incorrect code'})
        }
    }catch(e){
        console.log('error when comparing codes',e)
    }
}

const rejectRequest = async(req,res)=>{
    const {userId} = req.params
    //const userObjectId = new mongoose.Types.ObjectId(userId)
    //console.log("USER OBJECT ID USER OBJECT ID USER OBJECT ID USER OBJECT ID USER OBJECT ID", userObjectId)
    try{
        await Request.findOneAndDelete({userId:userId})
        res.json("del")
    }catch(err){
        console.log(err)
        res.json(err)
    }
}

module.exports = {
    get_all_users,
    ban_profile,
    get_requests,
    get_request,
    sent_request, 
    acceptRequest,
    rejectRequest,
    verify_code
}