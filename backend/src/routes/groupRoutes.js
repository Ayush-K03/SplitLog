import express from 'express';
import { handleGroupCreation,showUserGroup,joinGroup,showMyGroups } from "../controllers/groupController.js";
export const groupRouter = express.Router();
groupRouter.route("/create")
    .post(handleGroupCreation)
groupRouter.route("/my-groups")
    .get(showMyGroups);
groupRouter.route("/show/:groupId")
    .get(showUserGroup);
groupRouter.route("/join/:inviteCode")
    .get(joinGroup);
