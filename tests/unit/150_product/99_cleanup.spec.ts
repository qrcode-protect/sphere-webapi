import { test }                 from "@japa/runner"
import Product          from "QRCP/Sphere/Product/Product";
import { productModel } from "App/Common/model";
import Env                      from "@ioc:Adonis/Core/Env";
import Drive                    from "@ioc:Adonis/Core/Drive";
import moment                   from "moment";

test.group("ProductCategories 99 cleanup", () => {
    test("Cleanup product", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const productCategories: Product[] = await productModel().all()

            if (productCategories.length > 0) {

                await Drive.put(`backup/productCategories/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(productCategories))

                for (const product of productCategories) {
                    assert.isTrue(await productModel().delete(product.id));
                }
            }
        }
    });
})
