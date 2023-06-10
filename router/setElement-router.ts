import express from "express";
import {Unit} from "../unit";
import {StatusCodes} from "http-status-codes";
import {SetElementRepository} from "../repository/setElement-repository";
import {SetElement} from "../model/setElement-model";
import {setelementInsertDb, setelementUpdateDb} from "../model/interfacesDB";

export const setElementRouter = express.Router();

setElementRouter.get('/getSetElementsById/:id', async (req, res) => {
        const unit = await Unit.create(true);
        try {
            const setElementRepository: SetElementRepository = new SetElementRepository(unit);
            const idInput: number = Number(req.params.id);
            if (Number(idInput)) {
                const setElement: SetElement | null = await setElementRepository.getSetElementById(idInput);
                if (setElement !== null) {
                    res.status(StatusCodes.OK).json(setElement).send();
                }
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

setElementRouter.get('/getSetElementsBySetId/:id', async (req, res) => {
    const unit = await Unit.create(true);
    try {
        const setElementRepository: SetElementRepository = new SetElementRepository(unit);
        const idInput: number = Number(req.params.id);
        if (Number(idInput)) {
            const setElement: SetElement[] | null = await setElementRepository.getSetElementsBySetId(idInput);
            if (setElement !== null) {
                res.status(StatusCodes.OK).json(setElement).send();
            }
            res.status(StatusCodes.NOT_FOUND).send();
        }
    } catch
        (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
});

setElementRouter.put('/updateOrInsertSetElement', async (req, res) => {
    const unit: Unit = await Unit.create(false);
    try {
        const setElementRepo = new SetElementRepository(unit);
        let success: boolean = false;
        if (req.body.elementId === undefined) {
            const newSetElement: setelementInsertDb = {
                setId: req.body.setId,
                definition: req.body.definition,
                word: req.body.word
            };
            success = await setElementRepo.insertSetElement(newSetElement);
            if (success) {
                await unit.complete(true);
                res.status(StatusCodes.CREATED).json(newSetElement);
            } else {
                await unit.complete(false);
                res.status(StatusCodes.BAD_REQUEST).send();
            }
        } else {
            const updatedSetElement:setelementUpdateDb = {
                word: req.body.word,
                elementId: req.body.elementId,
                definition: req.body.definition
            }
            success = await setElementRepo.updateSetElement(updatedSetElement);
            if (success) {
                await unit.complete(true);
                res.status(StatusCodes.NO_CONTENT).json(updatedSetElement);
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