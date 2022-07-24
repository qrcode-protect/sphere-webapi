import { test }                                                                                from "@japa/runner"
import { productCategoryModel }                                                                from "App/Common/model";
import ProductCategory
                                                                                                                   from "QRCP/Sphere/ProductCategory/ProductCategory";
import { productCategoryAttributes, productCategoryStoreService, testProductCategory, testProductCategoryService } from "./utils";


test.group("ProductCategories 00 create", () => {


    test("Init productCategory test", async () => {

        test("Store productCategory", async ({ assert }) => {

            const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)

            assert.isTrue(testProductCategory(productCategory, { assert }))
        }).tags([ "product-category-unit" ]);

        test("Store productCategory service", async ({ assert }) => {

            const productCategoryServiceResult = await productCategoryStoreService()
            const productCategory = productCategoryServiceResult.data
            assert.isTrue(testProductCategoryService(productCategoryServiceResult, productCategory, { assert }))

        }).tags([ "product-category-unit" ]);

    }).tags([ "product-category-unit" ]);


})
