import express from "express";
import cors from 'cors';
import {DB, Unit} from "./data";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(3000, async () => {
    console.log("Server listening on port 3000");
    const db = await DB.createDBConnection();
    await db.close();
});