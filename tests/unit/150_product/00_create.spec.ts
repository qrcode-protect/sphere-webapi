import { test }                                                                                from "@japa/runner"
import { productModel }                                                                from "App/Common/model";
import Product
                                                                                                                   from "QRCP/Sphere/Product/Product";
import { productAttributes, productStoreService, testProduct, testProductService } from "./utils";


test.group("Products 00 create", () => {


    test("Init product test", async () => {

        test("Store product", async ({ assert }) => {

            const product: Product | null = await productModel().store(productAttributes)

            assert.isTrue(testProduct(product, { assert }))
        }).tags([ "product-unit" ]);

        test("Store product service", async ({ assert }) => {

            const productServiceResult = await productStoreService()
            const product = productServiceResult.data
            assert.isTrue(testProductService(productServiceResult, product, { assert }))

        }).tags([ "product-unit" ]);

    }).tags([ "product-unit" ]);


})
