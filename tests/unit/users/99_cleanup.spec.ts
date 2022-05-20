import { test }          from "@japa/runner"
import User          from "QRCP/Sphere/User/User";
import { userModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Users 99 cleanup", () => {
    test("Cleanup user", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const users: User[] = await userModel().all()

            if (users.length > 0) {

                await Drive.put(`backup/users/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(users))

                for (const user of users) {
                    assert.isTrue(await userModel().delete(user.id));
                }
            }
        }
    });
})
