import express from "express";
const router = express.Router();

router.post("/post", (req, res) => {
  console.log(req.body);
  res.json({ success: true, data: req.body });
});

export default router;