# bluesky reaction bot 
This is a starter kit for creating a bluesky bot. It is a simple bot, with minimal configuration, that can search for posts of its followers and react to it with text. Feel free to adapt the code to your needs.

## Installation
In your desired directory clone the repository (directory "bsky-reaction-bot" is created there).
```bash
git clone git@github.com:vinerima/bsky-reaction-bot.git
cd bsky-reaction-bot
npm install
```

Add an `.env`-File with the following content:
```txt
BSKY_USER=your-handle.bsky.social
BSKY_PWD=your-password
BSKY_DID=your-did-plc
LOGGING=false
```
You can find your `did:plc` within the "change handle" menu in the app or by querying the API. 
Enable logging, by setting `LOGGING=true`.

In `bot.ts` set the search parameters:
```ts 
const SEARCH_TERM = "search_term";
const SEARCH_SINCE_NUMBER = 1;
const SEARCH_SINCE_UNIT = "day";
```

`SEARCH_TERM` must be a string for `q` [as described here](https://docs.bsky.app/docs/api/app-bsky-feed-search-posts).
`SEARCH_SINCE_NUMBER` must be an integer and `SEARCH_SINCE_UNIT` must be a string, to work with the [dayjs library](https://day.js.org/docs/en/manipulate/add#list-of-all-available-units).

For the bot to work it querys a sqlite database. **Initialize it before starting the bot!**
```bash
npm run initdb
```

## Run the bot ##
It is up to you how and where you run the bot. 
### Example: ### 
On a server install `node.js` and `npm` [best use nvm](https://github.com/nvm-sh/nvm). 
Install `ts-node` globally, open a new screen and run the `npm run start` script in the background:
```bash
npm install -g ts-node
screen -R bot
cd /path/to/bsky-reaction-bot
nohup npm run start &
```
To exit the screen detach it: 
```bash
screen -d
```
You can then follow the logging (if enabled):
```bash
tail -f /path/to/bsky-reaction-bot/nohup.out
```
