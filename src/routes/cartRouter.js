import { Router } from "express";
import CartManager from "../manager/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.addCart ();
      res.send(cart);
  } catch (error) {
    res.status(500).send("Error Interno");
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCarts (cartId);
    const productCart = cart.find ((product) => product.id === parseInt(cartId));
    if (productCart) {
      res.send(productCart.products);
    } else {
      res.status(404).send("El Carrito no fue Encontrado");
    }
  } catch (error) {
    res.status(500).send("Error Interno");
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    res.send (await cartManager.addProductToCart(cid, pid));
  } catch (error) {
    console.log(error);
    res.status (500).json ({error: "Error al agregar el producto al carrito"});
  }

});



export default router;
