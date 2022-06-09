import { test }           from "@japa/runner"
import ActivityAttributes from "QRCP/Sphere/Activity/ActivityAttributes";
import Activity           from "QRCP/Sphere/Activity/Activity";
import { activityModel }  from "App/Common/model";

test.group("Activities 03 delete", () => {
    test("Delete activity", async ({ assert }) => {

        const attributes: ActivityAttributes = {
            label: "Activité de test delete"
        }

        const activity: Activity = await activityModel().store(new Activity(attributes))

        const updateActivity: boolean = await activityModel().delete(activity.id)

        assert.isNotNull(updateActivity);
        assert.isTrue(updateActivity)
    });
})
