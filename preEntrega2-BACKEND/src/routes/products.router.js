import { Router } from "express"
import { productsFiltersController, productsIdController, productsAddController, productsUpdateController, productsDeleteController } from "../controllers/products.controller.js"
export const router = Router()

router.get("/api/products", async (req, res) => {
    const productsData = await productsFiltersController(req, res);
    res.json(productsData);
});

router.get("/api/products/:pid", productsIdController);

router.post("/api/products", productsAddController);

router.put("/api/products/:pid", productsUpdateController)

router.delete("/api/products/:pid", productsDeleteController)