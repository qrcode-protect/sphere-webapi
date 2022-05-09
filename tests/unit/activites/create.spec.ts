import { test }           from "@japa/runner"
import { activityModel }  from "App/Common/model";
import Activity           from "QRCP/Sphere/Activity/Activity";
import ActivityAttributes from "QRCP/Sphere/Activity/ActivityAttributes";

test.group("Activites create", () => {

    test("Store activity", async ({ assert }) => {

        const attributes: ActivityAttributes = {
            label: "Activité de test"
        }

        const activity = await activityModel().store(new Activity(attributes))

        assert.isNotNull(activity);
        assert.instanceOf(activity, Activity);
    });

})
