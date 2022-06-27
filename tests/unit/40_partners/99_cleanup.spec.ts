import { test }          from "@japa/runner"
import Partner          from "QRCP/Sphere/Partner/Partner";
import { partnerModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Partners 99 cleanup", () => {
    test("Cleanup partner", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const partners: Partner[] = await partnerModel().all()

            if (partners.length > 0) {

                await Drive.put(`backup/partners/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(partners))

                for (const partner of partners) {
                    assert.isTrue(await partnerModel().delete(partner.id));
                }
            }
        }
    });
})
