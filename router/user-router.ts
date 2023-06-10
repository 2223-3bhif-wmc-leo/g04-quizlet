import express from "express";
import {Unit} from "../unit";
import {UserRepository} from "../repository/user-repository";
import {User} from "../model/user-model";
import {StatusCodes} from "http-status-codes";

export const userRouter = express.Router();
userRouter.get(`/:email`, async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const userRepository = new UserRepository(unit);
        const result: User | null = await userRepository.getUserByEmail(req.params.email);
        if (result === null) {
            res.status(StatusCodes.NOT_FOUND).send();
        } else {
            res.status(StatusCodes.OK).json(result);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})
