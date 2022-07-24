import { test }                                           from "@japa/runner"
import { productCategoryModel }                           from "App/Common/model";
import ProductCategory                                    from "QRCP/Sphere/ProductCategory/ProductCategory";
import { productCategoryAttributes, testProductCategory } from "./utils";

test.group("Product categories 02 delete", () => {
    test("Delete productCategory model", async ({ assert }) => {

        const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)
        assert.isTrue(testProductCategory(productCategory, { assert }))

        assert.isTrue((await productCategoryModel().delete(productCategory.id)))
    }).tags([ "product-category-unit" ]);

    /*test("Delete productCategory service", async ({ assert }) => {

        const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)
        assert.isTrue(testProductCategory(productCategory, { assert }))

        try {
            const productCategoryServiceResult = await productCategoryDeleteService(productCategory?.id)
            const productCategoryDelete = productCategoryServiceResult.data
            assert.isTrue(testProductCategoryService(productCategoryServiceResult, productCategoryDelete, { assert }))
        } catch (e) {
            Log.error(e, true)
        }

    }).tags([ "product-category-unit" ]);*/
})
