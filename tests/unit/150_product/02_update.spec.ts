import { test }        from "@japa/runner"
import {
    productModel
}                      from "App/Common/model";
import Product from "QRCP/Sphere/Product/Product";
import {
    productAttributes,
    productUpdateService,
    testProduct,
    testProductService
}                      from "./utils";
import Log             from "QRCP/Sphere/Common/Log";

test.group("Product categories 02 update", () => {
    test("Update product model", async ({ assert }) => {

        const product: Product | null = await productModel().store(productAttributes)
        assert.isTrue(testProduct(product, { assert }))


        try {
            const productUpdated: Product | null = (await productModel().update(product.id, { label: "VISSERIE" }))
            assert.isTrue(testProduct(productUpdated, { assert, label: "VISSERIE", name: "visserie" }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-unit" ]);

    test("Update product service", async ({ assert }) => {

        const product: Product | null = await productModel().store(productAttributes)
        assert.isTrue(testProduct(product, { assert }))

        try {
            const productServiceResult = await productUpdateService(product?.id)
            const productUpdate = productServiceResult.data
            assert.isTrue(testProductService(productServiceResult, productUpdate, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-unit" ]);
})
