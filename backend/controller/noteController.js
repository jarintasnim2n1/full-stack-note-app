import Note from "../model/Note.js";
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidInput = (title, content) =>
  typeof title === "string" &&
  title.trim().length > 0 &&
  (content === undefined || typeof content === "string");

export const getNotes= async(req, res)=>{
    try {
    const page= Math.max(parseInt(req.query.page) || 1, 1);
    const limit= Math.min(parseInt(req.query.limit)||6, 50);
    const search= String(req.query.search ?? "").trim();
    const trashed= req.query.trashed=== "true";

    const filter={
        user: req.userId,
        deleted: trashed? true :{$ne: true}
    }
    if (search) {
    const regex = new RegExp(escapeRegex(search), "i"); // i = boro/chhoto hater farak nei
    filter.$or = [{ title: regex }, { content: regex }];
  }
    const [notes, total] = await Promise.all([
  Note.find(filter)
    .sort({ pinned: -1, updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit),
  Note.countDocuments(filter),
]);
   
    res.status(200).json({notes, total, page, totalPages: Math.ceil(total/limit)})
} catch (error) {
    console.error("getNotes error:", error);
    res.status(500).json({message:"server error", detail: error.message })
}
}

export const getNote= async(req, res)=>{
    const note= await Note.findOne({_id:req.params.id, user:req.userId});
    if(!note)return res.status(404).json({message:"Note not found"})
        res.json({note})
}

export const createNote= async (req, res)=>{
   try {
     const {title, content}=req.body;
    
   if (!isValidInput(title, content)) {
      return res.status(400).json({ error: "Title is required" });
    }

    const note= await Note.create({title, content:content || "", user:req.userId})
    res.status(201).json({note})
   } catch (error) {
     res.status(500).json({message:"server error"})
   }
}

export const updateNote=async(req, res)=>{
    try {
    const { title, content } = req.body;
     if (!isValidInput(title, content)) {
      return res.status(400).json({ error: "Title is required" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, content },
      { returnDocument: "after", runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(200).json({ note });          
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const permanentdeleteNote= async(req, res)=>{
   try {
     const note= await Note.findOneAndDelete({
        _id:req.params.id, user:req.userId, deleted:true
    })
    if (!note) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted forever" });
   } catch (error) {
        res.status(500).json({ error: err.message });
   }
}

export const togglePin= async(req, res)=>{
    try {
         const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
      deleted: { $ne: true },
    });
    if (!note) return res.status(404).json({ error: "Note not found" });

    note.pinned = !note.pinned;
    await note.save();
    res.json({ note });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}
export const trashNote= async(req, res)=>{
    try {
        const note= await Note.findOneAndUpdate(
            {_id:req.params.id, user:req.userId},
            {deleted:true, deletedAt:new Date(), pinned:false},{returnDocument: "after" }
        );
        if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Moved to trash" });
    } catch (error) {
         res.status(500).json({ error: err.message });
    }
}
export const restoreNote= async(req, res)=>{
    try {
        const note= await Note.findOneAndUpdate(
            {_id:req.params.id, user:req.userId, deleted:true},
            {deleted: false, deletedAt:null},{returnDocument: "after" }
        );
        if (!note) return res.status(404).json({ error: "Note not found in trash" });
    res.json({ note });
    } catch (error) {
         res.status(500).json({ error: err.message });
    }
}

