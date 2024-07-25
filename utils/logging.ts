import * as dotenv from 'dotenv';
import * as process from 'process'; 

dotenv.config();

export const log = (text: string) => {
    if(process.env.LOGGING === "true") {
        console.log(text);
    }
}