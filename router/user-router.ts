import express from "express";
import {Unit} from "../unit";
import {UserRepository} from "../repository/user-repository";
import {User} from "../model/user-model";
import {StatusCodes} from "http-status-codes";

export const userRouter = express.Router();
userRouter.get(`/user/:email`, async (req, res) => {
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
});
userRouter.get(`/allUser`, async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const userRepository = new UserRepository(unit);
        const result: User[] | null = await userRepository.getAllUsers();
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
userRouter.put(`/user`, async (req, res) => {
    const unit: Unit = await Unit.create(false);
    try {
        const userRepository = new UserRepository(unit);
        const userExists: boolean = await userRepository.getUserByEmail(req.body.email) !== null;
        const newUser: User = new User(req.body.email, req.body.password, []);
        const success: boolean = userExists ? await userRepository.updateUser(newUser) : await userRepository.insertUser(newUser);
        if (success) {
            await unit.complete(true);
            res.status(userExists ? StatusCodes.NO_CONTENT : StatusCodes.CREATED).json(newUser);
        } else {
            await unit.complete(false);
            res.status(StatusCodes.BAD_REQUEST).send();
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
});
userRouter.delete(`/user/:email`, async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try {
        const userRepository = new UserRepository(unit);
        const getUser = await userRepository.getUserByEmail(req.params.email);
        if (getUser === null) {
            res.status(StatusCodes.BAD_REQUEST).send();
        } else {
            const result: boolean = await userRepository.deleteUser(getUser);
            if (result) {
                await unit.complete(true);
                res.status(StatusCodes.OK).send();
            } else {
                await unit.complete(false);
                res.status(StatusCodes.NOT_FOUND).send();
            }
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
});