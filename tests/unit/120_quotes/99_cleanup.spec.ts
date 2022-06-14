import { test }          from "@japa/runner"
import Quote          from "QRCP/Sphere/Quote/Quote";
import { quoteModel } from "App/Common/model";
import Env               from "@ioc:Adonis/Core/Env";
import Drive             from "@ioc:Adonis/Core/Drive";
import moment            from "moment";

test.group("Quotes 99 cleanup", () => {
    test("Cleanup quote", async ({ assert }) => {

        if (Env.get("NODE_ENV") === "test") {
            const quotes: Quote[] = await quoteModel().all()

            if (quotes.length > 0) {

                await Drive.put(`backup/quotes/${moment().format("YYYYMMDDHHmmss")}.json`, JSON.stringify(quotes))

                for (const quote of quotes) {
                    assert.isTrue(await quoteModel().delete(quote.id));
                }
            }
        }
    });
})
