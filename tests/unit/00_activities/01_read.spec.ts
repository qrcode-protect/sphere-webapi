import { test }          from "@japa/runner"
import { activityModel } from "App/Common/model";
import Activity          from "QRCP/Sphere/Activity/Activity";

test.group("Activities read", () => {
    test("Read activities", async ({ assert }) => {

        const activities = await activityModel().all();

        assert.isNotNull(activities);
        assert.isArray(activities)

        activities.map((activity) => assert.instanceOf(activity, Activity));

    });

})
