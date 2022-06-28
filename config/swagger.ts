import { SwaggerConfig } from "@ioc:Adonis/Addons/Swagger"

export default {
    uiEnabled  : true, //disable or enable swaggerUi route
    uiUrl      : "docs", // url path to swaggerUI
    specEnabled: true, //disable or enable swagger.json route
    specUrl    : "/swagger.json",

    middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

    options: {
        definition: {
            swagger : "2.0",
            info    : {
                title         : "Application with swagger docs",
                version       : "1.0.1-beta.5+1",
                description   : "My application with swagger docs",
                contact       : {
                    email: "sofiane.akbly@qrcode-protect.com",
                },
                termsOfService: "http://swagger.io/terms/",

            },
            host    : "localhost:7000",
            basePath: "/api/v1",
            schemes : [ "http" ],
        },

        apis: [
            // "src/**/*.ts",
            "docs/swagger/routes/api/chat.yaml",
            // "start/routes.ts"
        ],
    },

    mode        : process.env.NODE_ENV === "production" ? "PRODUCTION" : "RUNTIME",
    specFilePath: "docs/swagger.json"
} as SwaggerConfig
