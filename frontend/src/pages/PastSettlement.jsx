import { useNavigate,useLoaderData } from "react-router-dom"
import {useState,useEffect} from "react"
import axios from 'axios'
axios.defaults.withCredentials = true;

export function ShowPastSettlements(){
    const {mySettlements} = useLoaderData();
    console.log(mySettlements)
    return (
        <>
            <h1>
                Here are your settlements with other users: 
            </h1>
            {console.log(mySettlements)}
            {(mySettlements.length===0) ? "Sorry you have not made any settlements" :
            mySettlements.map((value)=>
            { return(
                <>
                <div class="past-payment">
                    {/* <div>From : {value.from.firstName} </div> */}
                    <div>To : {value.to.firstName} </div>
                    <div>Settled At : {new Date(value.createdAt).toLocaleString()}</div>
                    <div>Amount : {(value.amount/ 100).toFixed(2)} </div>
                </div>
                </>
            )})
            }

        </>
    );
}