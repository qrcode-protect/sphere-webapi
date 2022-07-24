import { test }                 from "@japa/runner"
import ProductCategory          from "QRCP/Sphere/ProductCategory/ProductCategory";
import { productCategoryModel } from "App/Common/model";
import Env                      from "@ioc:Adonis/Core/Env";
import Drive                    from "@ioc:Adonis/Core/Drive";
import moment                   from "moment";

test.group("ProductCategories 99 cleanup", () => {
    test("Cleanup productCategory", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const productCategories: ProductCategory[] = await productCategoryModel().all()

            if (productCategories.length > 0) {

                await Drive.put(`backup/productCategories/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(productCategories))

                for (const productCategory of productCategories) {
                    assert.isTrue(await productCategoryModel().delete(productCategory.id));
                }
            }
        }
    });
})
