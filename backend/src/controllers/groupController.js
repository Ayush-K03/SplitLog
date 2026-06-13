import mongoose from 'mongoose';
import { Groups } from "../models/Group.js";
import { User } from "../models/User.js";
import crypto from 'crypto'



export async function handleGroupCreation(req,res) {
    try{
        if (req.body.groupName.length===0){
            console.log("User gave a invalid username");
            return res.status(404).send("Enter a valid group name !")
        }
        
        const group = await Groups.create({
            groupName:req.body.groupName,
            createdBy:req.user.userId,
            members:[req.user.userId],
            inviteCode: crypto.randomBytes(4).toString('hex')
        })
        
        res.status(201).json(group);
        console.log("Group was created ");
    }
    catch (err){
        console.log("error occured creating group ....");
        console.log(err);
        res.status(500).send("Error in group creation!")
    }
}


export async function showUserGroup(req,res) {
    
    const gId = req.params.groupId;
    const group = await Groups.findById(gId);

    if (!mongoose.Types.ObjectId.isValid(gId) || !group){
        console.log("No such group exsists");
        return res.status(401).send("no such group exsist please create one !");
    }
    
    res.status(200).json(group);
    console.log("User found their group !");
}


export async function joinGroup(req,res){
    try{
        const group = await Groups.findOne({inviteCode : req.params.inviteCode});
        if (!group){
            console.log("No such invite code found");
            return res.status(404).send("Invalid Invite Code");
        }
        
        if (group.members.includes(req.user.userId)){
            console.log("already a member opened invite link....");
            return res.status(200).json(group);
        }
        
        const groupOwner = await User.findById(group.createdBy);
        if (!groupOwner) res.send("This group was deleted or owner left the App !")
        const ownerName = groupOwner.firstName;
        group.members.push(req.user.userId);
        await group.save();
        console.log("added user successfully!");
        res.status(200).send(`Welcome to the group (${group.groupName})  createdBy : ${ownerName}`);

    }
    catch(err){
        console.log("error in joining group");
        console.log(err);
        res.status(400).send("err...");
    }
}

export async function showMyGroups(req,res){
    try{
        const groups= await Groups.find({members: req.user.userId});
        if (!groups){
            console.log("User does not belong to any group !");
            return res.status(401).send("You are not part of any group");
        }
        console.log("User specific groups were shown !")
        res.status(200).json(groups.map((value)=>value.groupName));

    }

    catch(err){
        console.log("error occured while show user groups");
        console.log(err);
        res.status(501).send("An error 4 occured !");
    }
}