import Note from "../model/Note.js";
import User from "../model/User.js";

export const getStats = async (req, res) => {
 try {
   const notTrashed = { deleted: { $ne: true } };
   const [totalNotes, totalUsers, myNotes] = await Promise.all([
    Note.countDocuments(),                 // shob user er note
    User.countDocuments(),                 // shob user
    Note.countDocuments({ user:req.userId, ...notTrashed }), // amar note
  ]);

  res.json({ totalNotes, totalUsers, myNotes });

 } catch (error) {
  res.status(500).json({message:"server error"})
 }
};