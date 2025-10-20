import { suggestCategory } from "../utils/suggestCategory.js";

export const getCategorySuggestion = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const category = suggestCategory(text);
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
