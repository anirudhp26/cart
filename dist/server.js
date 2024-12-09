"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const PORT = process.env.PORT || 4000;
_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
