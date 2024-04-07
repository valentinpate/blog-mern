const mongoose = require("mongoose")
const Usuario = require("../../models/Usuario")
const Post = require("../../models/Post")
const RequestFriend = require("../../models/RequestFriend")


const get_requests_friend = async (req,res) =>{
    try{
        const requestFriend = RequestFriend.find({})
        res.json(requestFriend)
    } catch(e){
        console.log("error when searching request of friends",e)
    }
}

const get_sent_requests = async (req, res) => {
    const {userId} = req.params
    try{
        const reqs = await RequestFriend.find({fromUser: userId})
        res.json(reqs)
    }catch(err){
        console.log(err)
    }
}

const get_received_requests = async (req, res) => {
    const {userId} = req.params
    try{
        const reqs = await RequestFriend.find({toUser: userId})
        res.json(reqs)
    }catch(err){
        console.log(err)
    }
}

const get_friend_info = async(req,res)=>{
    try{
        const userId = req.params.userId
        const user = await Usuario.findOne({_id:userId})
        if(user){
            res.json(user)
        }else{
            res.json("no hay usuario")
        }
    }catch(err){
        console.log(err)
    }
}

const get_friend_posts = async(req,res)=>{
    try{
        const userId = req.params.userId
        const posts = await Post.find({user:userId})
        if(posts){
            res.json(posts)
        }else{
            res.json("no hay posts")
        }
    }catch(err){
        console.log(err)
    }
}

const create_request_friend = async (req,res) =>{
    const { userId } = req.params
    const { request,userFront } = req.body
    try{
        const newRequest = new RequestFriend({
            fromUser: userFront,
            toUser : userId,
            request : request
        })

        await newRequest.save()

        return res.status(201).json({ message: "friend request sent successfully"})
    } catch (e){
        console.log("error when sent friend request",e)
    }
}

const accept_request_friend = async (req,res) =>{
    const { requestId , userFront} = req.body
    const { userId } = req.params
    console.log('from accept request', requestId)
    try {
        const request = await RequestFriend.findById(requestId)
        if(!request){
            return res.status(404).json({ message:"friend request not found" })
        }
        const user = await Usuario.findById(request.toUser)
        if(!user){
            return res.status(404).json({ message:"user not found" })
        }
        user.skipPreSave = true
        const friend = await Usuario.findById(request.fromUser)
        user.friends.push(friend)
        await user.save()
        await RequestFriend.findOneAndDelete({id:request._id})
        return res.status(200).json({ message: "friend request accept successfully"})
    } catch(e){
        console.log("error when accepting request",e)
    }
}

const reject_request_friend = async (req,res) => {
    const {requestId} = req.body
    try{
        const request = await RequestFriend.findById(requestId)
        if(!request){
            return res.status(404).json({message:"Request not found"})
        }else{
            return res.status(200).json({message:"Request rejected"})
        }
    }catch(err){
        console.log("Error", err)
    }
}

const cancel_request_friend = async (req,res) => { //lo mismo que reject?

}

const get_my_friends = async (req,res) => {
    const userId = req.params.userId
    console.log("come from FRONT, i am user who wants my friends list",userId)
    try {
        const user = await Usuario.findById({ _id : userId })
        if (!user){
            res.status(404).json({ message:"not found friends" })
        } else {
            console.log("i have my list", user.friends)
            res.json(user.friends)
        }
    } catch (e) {
        console.log("error when founding friends of user",e)
    }
}

// const add_friend = async(req,res)=>{
//     const { userId } = req.params
//     const { userFront } = req.body
//     console.log('from BACK, i am USER', userFront)
//     console.log('from BACK, i am FRIEND', userId)
//     try{
//         const user = await Usuario.findById(userFront)
//         if(!user){
//             return res.status(404).json({ message: "user not found"})
//         }

//         const friend = await Usuario.findById(userId)
//         if(!friend){
//             return res.status(404).json({ message: "friend not found" })
//         }

//         // if(user.friends.includes(friendId){   check if they are already friends
//         //     res.status(404).json({message:"Already friends"})
//         // })

//         user.friends.push(userId)  // add friend to list
//         await user.save()    
//     } catch (e){
//         console.log("error when adding friend")
//     }
// }

const pull_friend_from_list = async(req,res)=>{ //pull en array friends de usuario. Necesito userId

}

module.exports = {
    get_friend_info,
    get_friend_posts,
    pull_friend_from_list,
    get_requests_friend,
    get_sent_requests,
    get_received_requests,
    get_my_friends,
    create_request_friend,
    accept_request_friend,
    reject_request_friend
}