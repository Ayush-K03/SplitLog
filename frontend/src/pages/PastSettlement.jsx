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
                Here are your past transactions : 
            </h1>
            {(mySettlements.length===0) ? "Sorry you have not made any settlements" :
            mySettlements.map((value)=>
            {return(
                <>
                <div class="past-payment">
                    <div>From : {value.from.firstName} </div>
                    <div>To : {value.to.firstName} </div>
                    <div>Amount : {(value.amount/ 100).toFixed(2)} </div>
                </div>
                </>
            )})
            }

        </>
    );
}