
import * as dotenv from 'dotenv';
import * as process from 'process';
import dayjs from 'dayjs';
import { getAllPosts } from './utils/apiAgent';
import { useUserAgent } from './utils/userAgent';
import { addPost, findPost, clearPosts } from './db/useDatabase';
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { CronJob } from 'cron';
import { log } from './utils/logging';

dotenv.config();

const userAgent = useUserAgent();

const SEARCH_TERM = "search";
const SEARCH_SINCE_NUMBER = 1;
const SEARCH_SINCE_UNIT = "day";

const buildReplyFromPost = (post: PostView) => {
    const uri = post.uri;
    const cid = post.cid;
    const record: any = post.record;
    const root = record.reply?.root ?? {uri, cid};
    const parent = {uri, cid};
    
    return {
        "$type": "app.bsky.feed.post",
        text: "🚫 💿 🐴",
        createdAt: dayjs().toISOString(),
        reply: {
            "root": root,
            "parent": parent
        }
    }
}

async function replyToNewPosts(){
    log(`${dayjs().toString()}: reply to new posts`)
    const posts = await getAllPosts(
        process.env.BSKY_DID!, 
        SEARCH_TERM,
        dayjs().subtract(SEARCH_SINCE_NUMBER, SEARCH_SINCE_UNIT).toISOString()
    );

    posts.forEach((post) => {
        const uri = post.uri;
        findPost(uri).then((row) => {
            if(!row) {
                log(`${uri} ---> new post from ${post.author.displayName}`);
                const reply = buildReplyFromPost(post);
                
                userAgent.then((agent) => {
                    agent.post(reply);
                    addPost(uri);
                });
            }
        });
    });
}

replyToNewPosts();

const timing = '* * * * *'; // run once every minute
const job = new CronJob(timing, replyToNewPosts);
job.start()

const clearJobTiming = '0 0 * * *'; // run once every day at midnight
const clearJob = new CronJob(clearJobTiming, clearPosts);
clearJob.start();