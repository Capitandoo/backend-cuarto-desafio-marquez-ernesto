import express from "express";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import { errorHandler } from './middlewares/errorHandler.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js'
import ProductManager from './manager/ProductManager.js';

const app = express();
const port = 9000;
const httpServer = app.listen(port, () => {
  console.log(`Server iniciado en el puerto ${port}`);
});
const socketServer = new Server(httpServer);
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler);
app.engine ('handlebars', handlebars.engine ());
app.set ('view engine', 'handlebars');
app.set ('views', __dirname + '/views');

app.use ('/products', productsRouter);
app.use ('/cart', cartRouter);
app.use ('/', viewsRouter);

socketServer.on ('connection', (socket) => {
  console.log ("Usuario conectado", socket.id);
  socket.on ('disconnect', () => {
    console.log ("Usuario desconectado");
  })
  socket.on ('newProduct', async (obj) => {
    await productManager.addProduct (obj);
    socketServer.emit ('arrayProductsAdd', await productManager.getProducts ());
  })
  socket.on ('erase', async (id) => {
    await productManager.deleteProduct (id);
    socketServer.emit ('arrayProductsErase', await productManager.getProducts ());
  })

  socket.on ('mostrar', async () => {
    const listado = await productManager.getProducts ();
    socketServer.emit ('mostrar', listado);
  })
});

