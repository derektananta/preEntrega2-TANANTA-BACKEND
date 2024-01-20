import { Router } from "express"
import { cartsCreateController, cartsIdController, cartsAddProductController, cartsListController, cartsDeleteController, cartsProductsDeleteController, cartsUpdateController, cartsUpdateProductController, cartsAllProductsDeleteController } from "../controllers/carts.controller.js"
export const router = Router()

router.get("/api/carts", cartsListController)
router.get("/api/carts/:cid", async (req, res) => {
    const cartData = await cartsIdController(req, res);
    res.json(cartData)
})

router.put("/api/carts/:cid", cartsUpdateController)
router.put("/api/carts/:cid/products/:pid", cartsUpdateProductController)

router.post("/api/carts", cartsCreateController)
router.post("/api/carts/:cid/products/:pid", cartsAddProductController)

router.delete("/api/delete/carts/:cid", cartsDeleteController)
router.delete("/api/carts/:cid/products/:pid", cartsProductsDeleteController)
router.delete("/api/carts/:cid", cartsAllProductsDeleteController)