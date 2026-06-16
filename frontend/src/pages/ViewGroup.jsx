import axios from "axios";
import {useParams,useLoaderData} from "react-router-dom";


export function ShowGroupDetails(){
    const {groupId} = useParams();
    const groupDetails = useLoaderData();
    return(
        <>
            <h1>Group Details: </h1>
            <h2>
                Group Name: {groupDetails.groupName} <br />
                Invite Code : {groupDetails.inviteCode}<br />
                Created By : {groupDetails.createdBy.firstName}<br />
                Members : {groupDetails.members.map(value=>value.firstName+", ")}<br />
                Created On :  {groupDetails.createdAt}
            </h2>

            <button>Home</button>
        </>
    );
}

