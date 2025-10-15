import express from 'express';
const router = express.Router();

const categories = [
  { name: "Legs", imageUrl: "/images/legs.png" },
  { name: "Arms", imageUrl: "/images/arms.png" },
  { name: "Chest", imageUrl: "/images/chest.png" },
  { name: "Back", imageUrl: "/images/back.png" },
  { name: "Core", imageUrl: "/images/core.png" },
  { name: "Shoulder", imageUrl: "/images/shoulder.png" },
];

router.get('/', (req, res) => {
  res.json(categories);
});

export default router;