import { test }                from "@japa/runner"
import { userModel }           from "App/Common/model";
import User                    from "QRCP/Sphere/User/User";
import UserAttributes          from "QRCP/Sphere/User/UserAttributes";
import DuplicateEntryException from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import UserService             from "QRCP/Sphere/User/UserService";
import { Success }             from "@sofiakb/adonis-response";

test.group("Users 00 create", () => {
    test("Store user", async ({ assert }) => {

        const attributes: UserAttributes = {
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY@gmail.com",
            phone      : "+331.23.456.78/9",
        }

        const user = await userModel().store(new User(attributes))

        assert.isNotNull(user);
        assert.instanceOf(user, User);
        assert.equal(user.firstname, "sofi-àne")
        assert.equal(user.lastname, "ak-bly")
        assert.equal(user.email, "sofiane.akbly@gmail.com")
        assert.equal(user.username, "sakbly")
        assert.equal(user.phone, "0123456789")
    });

    test("Store duplicate user", async ({ assert }) => {

        const attributes: UserAttributes = {
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY@gmail.com",
            phone      : "+331.23.456.78/9",
        }

        try {
            await userModel().store(new User(attributes));
            assert.isTrue(false);
        } catch (e) {
            assert.instanceOf(e, DuplicateEntryException);
        }

    });

    test("Store user service", async ({ assert }) => {

        const attributes: UserAttributes = {
            firstname  : "sOfi-àne",
            lastname   : "ak-bly",
            email      : "sofiane.AkblY.userservice2@gmail.com",
            phone      : "+332.23.456.78/9",
        }

        const userService = new UserService()
        const userServiceResult = await userService.store(new User(attributes))

        const user = userServiceResult.data

        assert.isNotNull(userServiceResult);
        assert.instanceOf(userServiceResult, Success);
        assert.instanceOf(user, User)
        assert.equal(user.firstname, "sofi-àne")
        assert.equal(user.lastname, "ak-bly")
        assert.equal(user.email, "sofiane.akbly.userservice2@gmail.com")
        assert.equal(user.username, "sakbly")
        assert.equal(user.phone, "0223456789")
        assert.equal(user.id, user.uid)
    });
})
