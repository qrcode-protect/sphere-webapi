import { test }          from "@japa/runner"
import Member          from "QRCP/Sphere/Member/Member";
import { memberModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Members 99 cleanup", () => {
    test("Cleanup member", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const members: Member[] = await memberModel().all()

            if (members.length > 0) {

                await Drive.put(`backup/members/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(members))

                for (const member of members) {
                    assert.isTrue(await memberModel().delete(member.id));
                }
            }
        }
    });
})
