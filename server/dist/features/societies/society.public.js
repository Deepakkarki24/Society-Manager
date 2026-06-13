"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Society_1 = require("../../models/Society");
const router = (0, express_1.Router)();
router.get("/public", async (_req, res) => {
    const societies = await Society_1.Society.find({ isActive: true })
        .select("name city state _id")
        .sort({ name: 1 });
    console.log(societies);
    res.json({ success: true, data: societies });
});
exports.default = router;
//# sourceMappingURL=society.public.js.map