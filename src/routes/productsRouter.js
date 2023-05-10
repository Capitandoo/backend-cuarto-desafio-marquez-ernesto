import { Router } from "express";
import { uploader } from "../middlewares/multer.js";
import { productValidator } from "../middlewares/productValidator.js";
import ProductManager from '../manager/ProductManager.js';

const router = Router ();
const productManager = new ProductManager ();


router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      const products = await productManager.getProducts ();
      if (!limit) {
        res.send(products);
      } else {
        res.send(products.slice(0, limit));
      }
    } catch (error) {
      res.status(500).send('Error Interno');
    }
});
  
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const products = await productManager.getProducts ();
    const product = products.find ((product) => product.id === parseInt (id));
    if (product) {
      res.send(product);
    } else {
      res.status(404).send('Producto no Encontrado');
    }
  } catch (error) {
    res.status(500).send('Error Interno');
  }
});

router.post('/', productValidator, async (req, res)=>{
  try {
      const product = req.body;
      const newProduct = await productManager.addProduct (product);
      res.json(newProduct);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

router.post('/images', uploader.single ("photo"), async (req, res)=>{
  try {
      const product = req.body;
      product.photo = req.file.path;
      const newProduct = await productManager.addProduct (product);
      res.json(newProduct);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

router.put('/:id', async(req, res) => {
  try {
      const product = req.body;
      const { id } = req.params;
      const productFile = await productManager.getProductById (Number(id));
      if(productFile){
          await productManager.updateProduct (Number(id), product);
          res.send(`Producto Actualizado!`);
      } else {
          res.status(404).send('Producto No Encontrado')
      }
  } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', async(req, res)=>{
  try {
      const { id } = req.params;
      const products = await productManager.getProducts ();
      if(products.length > 0){
          await productManager.deleteProduct(Number(id));
          res.send(`El Producto Con El id: ${id} Fue Borrado`);
      } else {
          res.send(`El Producto Con El id: ${id} No Fue Encontrado`);
      }
  } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

export default router;
