import { cartsModel } from "../models/carts.model.js"
import { productsModel } from "../models/products.model.js"

export const cartsIdController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let result = await cartsModel.findById({ _id: cid }).populate('products.product');
        return { status: "success", payload: result };
    } catch (err) {
        return { status: "error", error: "Server error " + err };
    }
};

export const cartsCreateController = async (req, res) => {
    try {
        let result = await cartsModel.create({ products: [] })
        res.send({ status: "success", payload: result })

    }

    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsAddProductController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;

        let cart = await cartsModel.findById({ _id: cid });

        const existingProductIndex = cart.products.findIndex((p) => p.product.equals(pid));

        if (existingProductIndex === -1) {

            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[existingProductIndex].quantity += 1;
        }

        await cart.save();

        let result = await cartsModel.findById({ _id: cid }).populate('products.product');
        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
};

export const cartsListController = async (req, res) => {
    try {
        let result = await cartsModel.find()
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsDeleteController = async (req, res) => {
    try {
        let cid = req.params.cid
        let result = await cartsModel.deleteOne({ _id: cid })
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsProductsDeleteController = async (req, res) => {
    try {
        let pid = req.params.pid;
        let cid = req.params.cid;

        try {
            let product = await productsModel.findById(pid);
            let cart = await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.product': pid },
                { $inc: { 'products.$.quantity': -1 } },
                { new: true }
            );

            if (!cart) {
                return res.status(404).send("Cart not found or product not in cart");
            }

            await cartsModel.findOneAndUpdate(
                { _id: cid, 'products.product': pid, 'products.quantity': { $lte: 0 } },
                { $pull: { 'products': { product: pid } } },
                { new: true }
            );

            res.send({ status: "success", payload: cart });
        } catch (err) {
            res.status(404).send("Cannot update cart because the product or cart doesn't exist " + err);
        }
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
};

export const cartsUpdateController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let productsUpdate = req.body.products;

        let updatedCart = await cartsModel.findByIdAndUpdate(
            cid,
            {
                $set: {
                    'products': productsUpdate,
                },
            }
        );

        if (!updatedCart) {
            return res.status(404).send("Cart not found");
        }

        res.send({ status: "success", payload: updatedCart });
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
};

export const cartsUpdateProductController = async (req, res) => {
    try {
        try {
            let pid = req.params.pid
            let cid = req.params.cid

            let product = await productsModel.findById(pid)
            let cart = await cartsModel.findById(cid)

            let productQuantity = req.body.quantity

            const existingProductIndex = cart.products.findIndex((cartProduct) => cartProduct._id.equals(product._id));


            const existingProduct = cart.products[existingProductIndex];
            await cartsModel.findOneAndUpdate(
                { _id: cid, "products._id": existingProduct._id },
                { $set: { "products.$.quantity": productQuantity } }
            );

            let cartSaved = await cartsModel.findById(cid);

            res.send({ status: "success", payload: cartSaved });
        }
        catch (err) {
            res.status(404).send("Cannot update product quantity, the product or cart doesn´t exist " + err)
        }

    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }

}

export const cartsAllProductsDeleteController = async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await cartsModel.findById(cid);

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        cart.products = [];

        const result = await cart.save();

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server Error: " + err);
    }
};