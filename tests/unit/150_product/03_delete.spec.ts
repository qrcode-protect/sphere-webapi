import { test }                                           from "@japa/runner"
import { productModel }                           from "App/Common/model";
import Product                                    from "QRCP/Sphere/Product/Product";
import { productAttributes, testProduct } from "./utils";

test.group("Product categories 02 delete", () => {
    test("Delete product model", async ({ assert }) => {

        const product: Product | null = await productModel().store(productAttributes)
        assert.isTrue(testProduct(product, { assert }))

        assert.isTrue((await productModel().delete(product.id)))
    }).tags([ "product-unit" ]);

    /*test("Delete product service", async ({ assert }) => {

        const product: Product | null = await productModel().store(productAttributes)
        assert.isTrue(testProduct(product, { assert }))

        try {
            const productServiceResult = await productDeleteService(product?.id)
            const productDelete = productServiceResult.data
            assert.isTrue(testProductService(productServiceResult, productDelete, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-unit" ]);*/
})
