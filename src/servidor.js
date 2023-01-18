//* Dependencias
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
//* Rutas
import _dirname from "./utils.js";
import productsRouter from "./routes/productRoutes.js";
import cartsRouter from "./routes/cartRoutes.js";
import homeHandlebar from "./routes/viewRoutes.js";
import dotenv from "dotenv";
//* Models
import { productsModel } from "./dao/models/productsModel.js";
import { messagesModel } from "./dao/models/messagesModel.js";
dotenv.config();

// import productosEnEmpresa from "./dao/filesystem/manangers/productMananger.js";
// const productMananger = productosEnEmpresa;
// let data = await productMananger.getProducts();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(_dirname + `/public`));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a Mongo Atlas"))
  .catch((err) =>
    console.error("A ocurrido un erro conectandose a mongo atlas")
  );

const httpServer = app.listen(port, () => {
  console.log(`servidor escuchando en el puerto 8080`);
});
const io = new Server(httpServer);

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, "src/views");
app.set(`view engine`, `handlebars`);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", homeHandlebar);

io.on(`connection`, async (socket) => {
  console.log(`Nuevo cliente conectado`);
  socket.emit(`datos`, await productsModel.find());
  socket.emit("messages", await messagesModel.find());
  socket.on("newMessage",async (data)=>{
    await messagesModel.insertMany([data])
    io.emit("messages", await messagesModel.find())
  })
});
