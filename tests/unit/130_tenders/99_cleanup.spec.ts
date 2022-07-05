import { test }          from "@japa/runner"
import Tender          from "QRCP/Sphere/Tender/Tender";
import { tenderModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Tenders 99 cleanup", () => {
    test("Cleanup tender", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const tenders: Tender[] = await tenderModel().all()

            if (tenders.length > 0) {

                await Drive.put(`backup/tenders/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(tenders))

                for (const tender of tenders) {
                    assert.isTrue(await tenderModel().delete(tender.id));
                }
            }
        }
    });
})
