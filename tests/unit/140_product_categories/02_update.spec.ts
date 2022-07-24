import { test }        from "@japa/runner"
import {
    productCategoryModel
}                      from "App/Common/model";
import ProductCategory from "QRCP/Sphere/ProductCategory/ProductCategory";
import {
    productCategoryAttributes,
    productCategoryUpdateService,
    testProductCategory,
    testProductCategoryService
}                      from "./utils";
import Log             from "QRCP/Sphere/Common/Log";

test.group("Product categories 02 update", () => {
    test("Update productCategory model", async ({ assert }) => {

        const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)
        assert.isTrue(testProductCategory(productCategory, { assert }))


        try {
            const productCategoryUpdated: ProductCategory | null = (await productCategoryModel().update(productCategory.id, { label: "VISSERIE" }))
            assert.isTrue(testProductCategory(productCategoryUpdated, { assert, label: "VISSERIE", name: "visserie" }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-category-unit" ]);

    test("Update productCategory service", async ({ assert }) => {

        const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)
        assert.isTrue(testProductCategory(productCategory, { assert }))

        try {
            const productCategoryServiceResult = await productCategoryUpdateService(productCategory?.id)
            const productCategoryUpdate = productCategoryServiceResult.data
            assert.isTrue(testProductCategoryService(productCategoryServiceResult, productCategoryUpdate, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-category-unit" ]);
})
