import mongoose from 'mongoose';
import { Groups } from "../models/Group.js";
import { User } from "../models/User.js";
import crypto from 'crypto'


//done
export async function handleGroupCreation(req,res) {
    try{
        console.log(req.body.groupName)
        if (req.body.groupName.length<=3){
            console.log("User gave a invalid username");
            return res.status(400).json({msg: "Enter a valid group name !"});
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
        res.status(500).json({msg: "Error in group creation!"});
    }
}


export async function showUserGroup(req,res) {
    try{
        const gId = req.params.groupId;
        const group = await Groups.findById(gId).populate('createdBy members','firstName');
        
        if (group === null){
            console.log("User tried to access a group that does not exist !");
            return res.status(200).json(null);
        }
        res.status(200).json(group);
        console.log("User found their group !");
    }
    catch (err) {
        console.log("error fetching group");
        console.log(err);
        res.status(500).json({msg: "Could not load this group, please try again."});
    }
}

//done
export async function joinGroup(req,res){
    try{
        const group = await Groups.findOne({inviteCode : req.params.inviteCode});
        if (!group){
            console.log("No such invite code found");
            return res.status(400).json({msg: "Invalid Invite Code"});
        }
        
        if (group.members.includes(req.user.userId)){
            console.log("already a member opened invite link....");
            return res.status(403).json({msg: "You are already a member of this group!"});
        }
        
        const groupOwner = await User.findById(group.createdBy);
        if (!groupOwner){
            return res.status(404).json({msg: "This group was deleted or owner left the App !"});
            console.log(groupOwner);
        }
        const ownerName = groupOwner.firstName;
        group.members.push(req.user.userId);
        await group.save();
        console.log("added user successfully!");
        res.status(200).json({groupId: group._id, groupName: group.groupName, ownerName: ownerName});

    }
    catch(err){
        console.log("error in joining group");
        console.log(err);
        res.status(500).json({msg: "Error in joining group!"});
    }
}

export async function showMyGroups(req,res){
    try{
        const groups= await Groups.find({members: req.user.userId});
        if (!groups){
            console.log("User does not belong to any group !");
            return res.status(200).json([]);
        }
        console.log("User specific groups were shown !");
        res.status(200).json(groups.map((value)=>({groupName: value.groupName,gId:value._id,memberCount:value.members.length})));

    }

    catch(err){
        console.log("error occured while show user groups");
        console.log(err);
        res.status(500).send("An error occured while fetching your groups!");
    }
}