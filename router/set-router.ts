import express from "express";
import {Unit} from "../unit";
import {StatusCodes} from "http-status-codes";
import {SetRepository} from "../repository/set-repository";
import {Set} from "../model/set-model"
import {setDb, setInsertDb} from "../model/interfacesDB";

export const setRouter = express.Router();

setRouter.get('/getSetById/:id', async (req, res) => {
    const unit = await Unit.create(true);
    try {
        const setRepository: SetRepository = new SetRepository(unit);
        const idInput: number = Number(req.params.id);
        if (Number(idInput)) {
            const set: Set | null = await setRepository.getSetById(idInput);
            if (set !== null) {
                res.status(StatusCodes.OK).json(set).send();
            }
            res.status(StatusCodes.NOT_FOUND).send();
        } else {
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})

setRouter.get('/getSetByUser/:email', async (req, res) => {
    const unit = await Unit.create(true);
    try {
        const setRepository: SetRepository = new SetRepository(unit);
        const idInput = req.params.email.trim();
        if (idInput !== "") {
            const set: Set[] | null = await setRepository.getSetsByUserId(idInput);
            if (set !== null) {
                res.status(StatusCodes.OK).json(set).send();
            }
            res.status(StatusCodes.NOT_FOUND).send();
        } else {
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})

setRouter.get('/getSetByTitle/:title', async (req, res) => {
    const unit = await Unit.create(true);
    try {
        const setRepository: SetRepository = new SetRepository(unit);
        const idInput = req.params.title.trim();
        if (idInput !== "") {
            const set: Set[] | null = await setRepository.getSetsByTitle(idInput);
            if (set !== null) {
                res.status(StatusCodes.OK).json(set).send();
            }
            res.status(StatusCodes.NOT_FOUND).send();
        } else {
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})

setRouter.get('/getPublicSets', async (req, res) => {
        const unit = await Unit.create(true);
        try {
            const setRepository: SetRepository = new SetRepository(unit);
            const set: Set[] | null = await setRepository.getPublicSets();
            if (set !== null) {
                res.status(StatusCodes.OK).json(set).send();
            } else {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        } catch
            (e) {
            console.log(e);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        } finally {
            await unit.complete();
        }
    }
)

setRouter.delete('/deleteSetById/:id', async (req, res) => {
    const unit = await Unit.create(false);
    try {
        const setRepository: SetRepository = new SetRepository(unit);
        const idInput: number = Number(req.params.id);
        let checkBool: boolean = false;
        if (Number(idInput)) {
            const set: Set | null = await setRepository.getSetById(idInput);
            if (set !== null) {
                checkBool = await setRepository.deleteSet(idInput);
            }
            if (checkBool) {
                await unit.complete(true);
                res.status(StatusCodes.OK).send();
            } else {
                await unit.complete(false);
                res.status(StatusCodes.NOT_FOUND).send();
            }
        } else {
            await unit.complete(false);
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
});

setRouter.put('/updateOrInsertSet', async (req, res) => {
    const unit: Unit = await Unit.create(false);
    try {
        const setRepository = new SetRepository(unit);
        let success: boolean = false;
        if (req.body.setId === undefined) {
            const newSet: setInsertDb = {
                title: req.body.title,
                description: req.body.description,
                isPublic: req.body.isPublic,
                userEmail: req.body.userEmail
            };
            success = await setRepository.insertSet(newSet);
            if (success) {
                await unit.complete(true);
                res.status(StatusCodes.CREATED).json(newSet);
            } else {
                await unit.complete(false);
                res.status(StatusCodes.BAD_REQUEST).send();
            }
        } else {
            const newSet: Set = new Set(req.body.setId, req.body.userEmail, req.body.title, req.body.description, req.body.isPublic, []);
            success = await setRepository.updateSet(newSet);
            if (success) {
                await unit.complete(true);
                res.status(StatusCodes.NO_CONTENT).json(newSet);
            } else {
                await unit.complete(false);
                res.status(StatusCodes.BAD_REQUEST).send();
            }
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
});