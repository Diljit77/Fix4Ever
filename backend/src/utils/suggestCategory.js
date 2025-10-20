export const suggestCategory = (text) => {
  const mapping = [
    { keywords: ["ac", "air conditioner", "cooling"], category: "AC Repair" },
    { keywords: ["light", "bulb", "electric", "wire"], category: "Electrical" },
    { keywords: ["pipe", "leak", "plumber", "water"], category: "Plumbing" },
  ];

  text = text.toLowerCase();
  for (const m of mapping) {
    if (m.keywords.some((k) => text.includes(k))) return m.category;
  }
  return "General Repair";
};
