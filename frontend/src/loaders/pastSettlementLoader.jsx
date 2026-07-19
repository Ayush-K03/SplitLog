import axios from 'axios'
export async function getDataForSettlement() {
    try{
        const mySettlements= (await axios.get(`${import.meta.env.BACKEND_URL}api/past_settlements`)).data
        console.log(mySettlements.data);
        return {mySettlements};
    }
    catch(err){
        console.log(err);
    }
}