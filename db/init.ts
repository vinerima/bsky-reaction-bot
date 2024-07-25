import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import { log } from '../utils/logging';

async function createDatabase() {
    log('Create Database');
    await open({
        filename: 'db/posts.db', 
        driver: sqlite3.Database
    }).then((db) => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS posts(
                uri STRING PRIMARY KEY,
                created_at TEXT NOT NULL
            );
        `);
    });
}

createDatabase();