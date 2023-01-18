import express from "express";
const router = express.Router();
import productosEnEmpresa from "../dao/filesystem/manangers/productMananger.js";
const productMananger=productosEnEmpresa
export let data = await productMananger.getProducts();


router.get(`/`, async (req, res) => {
  res.render(`home`, {
    data,
    style:"inicio.css"
  });
});

router.get(`/products`, async (req, res) => {
  res.render(`products`, {
    data,
    style:"listasDeProductos.css"
  });
});

router.get(`/realtimeproducts`, async (req, res) => {
  res.render(`realtimeProducts`, {
    style:"listasDeProductos.css"
  });
});
router.get(`/chat`, async (req, res) => {
  res.render(`chat`, {
    style:"chat.css"
  });
});
export default router;
