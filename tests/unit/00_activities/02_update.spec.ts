import { test }           from "@japa/runner"
import { activityModel }  from "App/Common/model";
import Activity           from "QRCP/Sphere/Activity/Activity";
import ActivityAttributes from "QRCP/Sphere/Activity/ActivityAttributes";

test.group("Activities 02 update", () => {
    test("Update activity", async ({ assert }) => {

        const attributes: ActivityAttributes = {
            label: "Activité de test update"
        }

        const activity: Activity = await activityModel().store(new Activity(attributes))

        const updateActivity: Activity = await activityModel().update(activity.id, { name: "test" })

        assert.isNotNull(updateActivity);
        assert.instanceOf(updateActivity, Activity)

        assert.equal(updateActivity.id, activity.id);
        assert.notEqual(updateActivity.name, activity.name);
    });
})
