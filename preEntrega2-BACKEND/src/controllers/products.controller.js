import { productsModel } from "../models/products.model.js"
import { getNextLink, getPrevLink } from "../helpers/linkPrevNext.js"

export const productsFiltersController = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1
        let limit = req.query.limit ? parseInt(req.query.limit) : 10
        let sort = 0
        let query = {}

        if (req.query.sort) {
            const sortOption = req.query.sort.toLowerCase()
            if (sortOption === "asc") {
                sort = 1
            } else {
                sortOption === "desc"
                sort = -1
            }
        }

        if (req.query.query) {
            query = { category: { $regex: req.query.query, $options: "i" } }
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort !== 0 ? { price: sort } : null
        }

        let result = await productsModel.paginate(query, options)
        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;


        return {
            status: "success",
            payload: result,
            prevLink: result.hasPrevPage ? getPrevLink(baseUrl, result) : null,
            nextLink: result.hasNextPage ? getNextLink(baseUrl, result) : null
        };
    }

    catch (err) {
        return {
            status: "error",
            error: "Server error: " + err
        };
    }
}

export const productsIdController = async (req, res) => {
    try {
        let pid = req.params.pid
        try {
            let result = await productsModel.findById(pid)
            res.send({ status: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("Cannot get products with this id: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const productsAddController = async (req, res) => {
    try {
        let { title, description, price, thumbnail, code, stock, category } = req.body
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) return res.status(400).send({ status: "error", error: "Incomplete values" })

        let result = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        })

        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const productsUpdateController = async (req, res) => {

    try {
        try {
            let pid = req.params.pid
            let productReplace = req.body
            if (!productReplace.title || !productReplace.description || !productReplace.price || !productReplace.thumbnail || !productReplace.code || !productReplace.stock || !productReplace.category) return res.status(400).send({ status: "error", error: "Incomplete values" })
            let result = await productsModel.updateOne({ _id: pid }, productReplace)
            res.send({ status: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("The product with this Id cannot be updated because it does not exist: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }

}

export const productsDeleteController = async (req, res) => {

    try {
        try {
            let pid = req.params.pid
            let result = await productsModel.deleteOne({ _id: pid })
            res.send({ status: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("The product with this Id cannot be deleted because it does not exist: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}