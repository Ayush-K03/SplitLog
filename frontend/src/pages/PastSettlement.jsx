import { useNavigate,useLoaderData } from "react-router-dom"
import {useState,useEffect} from "react"
import axios from 'axios'

export function ShowPastSettlements(){
    const {mySettlements} = useLoaderData();
    const dataToShow = mySettlements.data
    console.log(dataToShow)
    return (
        <>
            <h1>
                Here are your past transactions : 
            </h1>

            {(dataToShow.length===0) ? "Sorry you have not made any settlements" :
            dataToShow.map((value)=> value)
            };

        </>
    );
}