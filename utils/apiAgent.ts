import { BskyAgent } from '@atproto/api';
import { PostView } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import dayjs from 'dayjs';

export const apiAgent = new BskyAgent({
    service: "https://api.bsky.app"
});

export const getFollowers = async (actor: string) => {
    return (await apiAgent.getFollowers({actor})).data.followers;
}

export const getFollowerPosts = async (q: string, author: string, since?: string) => {
    return (await apiAgent.api.app.bsky.feed.searchPosts({ q, author, since, limit: 99 })).data.posts;
}

export const getAllPosts = async (actor: string, q: string, since?: string) => {
    let posts: PostView[] = [];
    const followers = await getFollowers(actor);

    // Mapping followers to an array of promises
    const postsPromises = followers.map(async (follower) => {
        const followerPosts = await getFollowerPosts(q, follower.did, since);
        return followerPosts;
    });

    // Waiting for all promises to resolve
    const results = await Promise.all(postsPromises);

    // Flattening the results and pushing into posts array
    results.forEach(followerPosts => {
        posts.push(...followerPosts);
    });

    return posts;
}