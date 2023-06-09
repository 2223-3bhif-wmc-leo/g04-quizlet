import express from "express";
import cors from 'cors';
import {DB} from "./data";
import {userRouter} from "./router/user-router";
import {setElementRouter} from "./router/setElement-router";
import {setRouter} from "./router/set-router";
import {ensureSampleDataInserted, Unit} from "./unit";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use("api/setElement", setElementRouter);
app.use("api/set", setRouter);
app.use("api/user", userRouter);

app.listen(3000, async () => {
    const unit = await Unit.create(true);
    await ensureSampleDataInserted(unit);
    await unit.complete();

    console.log("Server listening on port 3000");
});