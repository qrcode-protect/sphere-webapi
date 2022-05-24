import { test }       from "@japa/runner"
import UserAttributes from "QRCP/Sphere/User/UserAttributes";
import UserService    from "QRCP/Sphere/User/UserService";
import User           from "QRCP/Sphere/User/User";

test.group("Users enable / disable", () => {
    test("Enable user service", async ({ assert }) => {

        const attributes: UserAttributes = {
            firstname: "sOfi-àne",
            lastname : "ak-bly",
            email    : "sofiane.AkblY.enable@gmail.com",
            phone    : "+331.23.456.78/9",
        }

        const userService = new UserService()
        const user: User = (await userService.store(new User(attributes))).data

        assert.instanceOf(user, User)

        const updateUser: User = (await userService.enable(user.id)).data

        assert.isNotNull(updateUser);
        assert.instanceOf(updateUser, User)

        assert.equal(updateUser.id, user.id);
        assert.isTrue(updateUser.active);
    });
})
