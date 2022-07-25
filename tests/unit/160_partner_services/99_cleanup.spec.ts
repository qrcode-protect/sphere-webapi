import { test }                 from "@japa/runner"
import PartnerService          from "QRCP/Sphere/PartnerService/PartnerService";
import { partnerServiceModel } from "App/Common/model";
import Env                      from "@ioc:Adonis/Core/Env";
import Drive                    from "@ioc:Adonis/Core/Drive";
import moment                   from "moment";

test.group("ProductCategories 99 cleanup", () => {
    test("Cleanup partnerService", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const productCategories: PartnerService[] = await partnerServiceModel().all()

            if (productCategories.length > 0) {

                await Drive.put(`backup/productCategories/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(productCategories))

                for (const partnerService of productCategories) {
                    assert.isTrue(await partnerServiceModel().delete(partnerService.id));
                }
            }
        }
    });
})
