import { test }                  from "@japa/runner"
import { productCategoryModel }  from "App/Common/model";
import { Success }               from "@sofiakb/adonis-response";
import ProductCategoryAttributes from "QRCP/Sphere/ProductCategory/ProductCategoryAttributes";
import ProductCategoryService    from "QRCP/Sphere/ProductCategory/ProductCategoryService";
import ProductCategory           from "QRCP/Sphere/ProductCategory/ProductCategory";
import Log                       from "QRCP/Sphere/Common/Log";

const productCategoryService = new ProductCategoryService()

const productCategoryAttributes: ProductCategoryAttributes = {
    id         : "test-id",
    label      : "Visseries & chose23",
    avatar     : "test",
    description: "description",
    partnerId: "test-partner-id"
}

const productCategoryStoreService = async () => await productCategoryService.store(productCategoryAttributes, "test-partner-id")


const testStoreService = (productCategoryServiceResult, productCategory, { assert }): boolean => {

    try {
        assert.isNotNull(productCategoryServiceResult);
        assert.instanceOf(productCategoryServiceResult, Success);
        testStore(productCategory, { assert })
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}

const testStore = (productCategory, { assert }): boolean => {

    try {
        assert.isNotNull(productCategory);
        assert.instanceOf(productCategory, ProductCategory);
        assert.equal(productCategory?.id, "test-id");
        assert.equal(productCategory?.label, "visseries & chose23");
        assert.equal(productCategory?.description, "description");
        assert.equal(productCategory?.name, "visseries-chose23-test-partner-id");
        assert.equal(productCategory?.partnerId, "test-partner-id");
        return true
    } catch (e) {
        Log.error(e, true)
        return false
    }
}


test.group("ProductCategories 00 create", () => {


    test("Init productCategory test", async () => {

        test("Store productCategory", async ({ assert }) => {

            const productCategory: ProductCategory | null = await productCategoryModel().store(productCategoryAttributes)

            assert.isTrue(testStore(productCategory, { assert }))
        }).tags([ "product-category-unit" ]);

        test("Store productCategory service", async ({ assert }) => {

            const productCategoryServiceResult = await productCategoryStoreService()
            const productCategory = productCategoryServiceResult.data
            assert.isTrue(testStoreService(productCategoryServiceResult, productCategory, { assert }))

        }).tags([ "product-category-unit" ]);

    }).tags([ "product-category-unit" ]);


})
