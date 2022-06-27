import { test }        from "@japa/runner"
import { quoteModel }  from "App/Common/model";
import Quote           from "QRCP/Sphere/Quote/Quote";
import QuoteAttributes from "QRCP/Sphere/Quote/QuoteAttributes";

const conversationId = "ttotototo--user-id-test"

test.group("Quotes 00 create", () => {
    test("Store quote", async ({ assert }) => {

        const attributes: QuoteAttributes = {
            accepted      : "false",
            declined      : false,
            amount        : "123",
            conversationId: conversationId,
            customer      : "ttotototo",
            file          : "test",
            messageId     : "toto",
            transmitter   : "user-id-test"

        }

        const quote: Quote | null = await quoteModel().store(attributes)

        assert.isNotNull(quote);
        assert.instanceOf(quote, Quote);
        assert.isFalse(quote?.accepted);
        assert.equal(quote?.amount, 123);
    });


})
