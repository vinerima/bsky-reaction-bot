import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { log } from './logging';

dotenv.config();

export const useUserAgent = async () => {
    const userAgent = new BskyAgent({
        service: 'https://bsky.social'
    });

    await userAgent.login({
        identifier: process.env.BSKY_USER!,
        password: process.env.BSKY_PWD!
    }).then((response) => {
        if (response.success) {
            log(`${process.env.BSKY_USER} logged in!`);
        }
    }).catch((e) => {
        log(`an error occured: ${e}`);
    });
    
    return userAgent;
}