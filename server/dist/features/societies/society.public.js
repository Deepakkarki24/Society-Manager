"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../../models");
const router = (0, express_1.Router)();
router.get("/public", async (_req, res) => {
    const societies = await models_1.Society.find({ isActive: true })
        .select("name city state _id")
        .sort({ name: 1 });
    res.json({ success: true, data: societies });
});
exports.default = router;
//# sourceMappingURL=society.public.js.map