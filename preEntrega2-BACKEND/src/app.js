import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"

import { router as producstRouter } from "./routes/products.router.js"
import { router as cartsRouter } from "./routes/carts.router.js"
import { router as viewsRouter } from "./routes/views.router.js"

const app = express()
app.listen(8080, () => console.log("Server is running in port 8080"))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static( process.cwd() + "/public"))

app.engine("handlebars", handlebars.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
  },
}))
app.set("views", process.cwd() + "/src/views")
app.set("view engine", "handlebars")

app.use(producstRouter)
app.use(cartsRouter)
app.use(viewsRouter)

mongoose.connect('mongodb+srv://Benjamin:1234@firstcluster.0frk82c.mongodb.net/Ecommerce-Backend-Coder?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
    process.exit(1);
  });

  app.get("/", (req, res) => {
    res.send("Hola")
  })