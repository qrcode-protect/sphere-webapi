import { test }          from "@japa/runner"
import Activity          from "QRCP/Sphere/Activity/Activity";
import { activityModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Activities 04 cleanup", () => {
    test("Cleanup activity", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const activities: Activity[] = await activityModel().all()

            if (activities.length > 0) {

                await Drive.put(`backup/activities/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(activities))

                for (const activity of activities) {
                    assert.isTrue(await activityModel().delete(activity.id));
                }
            }
        }
    });
})
