import express from "express";
import adminAuthRoutes from "./admin/admin.routes.js"
import authRoutes from "./auth/routes/auth.routes.js"
import chatsRoutes from "./chat/routes/chat.routes.js"
import groupRoutes from "./group/routes/group.routes.js"
const router = express.Router();
const routes =[
    {
        method :"use",
        url:"/admin/auth",
        handler: adminAuthRoutes,
    },
    {
        method :"use",
        url:"/auth",
        handler: authRoutes
    },
    {
        method :"use",
        url:"/chats",
        handler: chatsRoutes
    },
    {

        method: "use",
        url: "/group",
        handler: groupRoutes
    }
]

router.get("/status", (req, res) => res.send("OK"));
(function () {
    routes.forEach((route) => {
        router[route.method](route.url, route.handler);
    });
})();
export default router;