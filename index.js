const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
const PORT = process.env.PORT || 8000;

app.get("/", (res, req) => {
    res.send("Server is running at port 8000");
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("disconnect");
    });
    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });
    socket.on("answercall", (data) => {
        io.to(data.to).emit(data.signal);
    });
});

server.listen(PORT, () => console.log(`server is running at port ${PORT}`));