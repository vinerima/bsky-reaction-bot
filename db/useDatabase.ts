import { open } from "sqlite";
import sqlite3 from 'sqlite3';
import { log } from "../utils/logging";

const dbPath = __dirname+"/posts.db";

export const addPost = async (uri: string) => {
    const db = await open({filename: dbPath, driver: sqlite3.Database});
    const success = db.run(`insert into posts values(?, datetime('now'));`, [uri], (err: string) => {
        if(err) {
            console.warn(err);
        }

        log(`post added to DB, uri: ${uri}`);
        return true;
    });

    db.close;
    return success;
};

export const findPost = async (uri: string) => {
    const db = await open({filename: dbPath, driver: sqlite3.Database});
    const row = db.get(`select * from posts where uri = ?;`, [uri], (err: string, row: sqlite3.RunResult) => {
        if(err) {
            log(err);
        }
        return row
    });

    db.close;

    return row;
};

export const clearPosts = async () => {
    const db = await open({filename: dbPath, driver: sqlite3.Database});
    db.exec(`delete from posts where created_at < datetime('now', '-2 days');`);
    db.close;
    log(`DB cleared`);
};