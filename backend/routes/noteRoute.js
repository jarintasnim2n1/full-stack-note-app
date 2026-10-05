import express from "express"
import { permanentdeleteNote,getNotes, getNote, createNote, updateNote, togglePin, restoreNote, trashNote } from "../controller/noteController.js";
import auth from "../middleware/authMiddleware.js"
const router= express.Router();

router.use(auth);

router.delete("/:id/permanent", permanentdeleteNote);
router.patch("/:id/pin", togglePin);
router.patch("/:id/restore", restoreNote);

router.get("/", getNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", trashNote); 

export default router