/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route"

import "./routes/api"


Route.get("/", async () => {
    return { version: "1.0.1-beta.6" }
})


Route.group(() => {
    Route.get("/kanrisha", "LogReaderController.listFiles").as("logs")
    Route.post("/clean", "LogReaderController.clean").as("logs.clean")

})
    .namespace("QRCP/Sphere/LogReader")

Route.group(() => {

    /****************************
     ***** PASSWORD ROUTES ******
     ****************************/
    Route.get("/password/reset/:email/:token", "Password/PasswordController.verifyToken").as("password.reset.verify");
})
    .namespace("QRCP/Sphere/Authentication")
    .prefix("/auth");
