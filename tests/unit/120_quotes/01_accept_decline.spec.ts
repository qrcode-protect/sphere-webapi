import { test }       from "@japa/runner"
import QuoteAttributes from "QRCP/Sphere/Quote/QuoteAttributes";
import QuoteService    from "QRCP/Sphere/Quote/QuoteService";
import Quote           from "QRCP/Sphere/Quote/Quote";

test.group("Quotes accept / decline", () => {
    test("Accept quote service", async ({ assert }) => {

        const attributes: QuoteAttributes = {
            accepted      : "false",
            declined      : false,
            amount        : "123",
            conversationId: "test",
            customer      : "ttotototo",
            file          : "test",
            messageId     : "toto",
            transmitter   : "user-id-test"
        }

        const quoteService = new QuoteService()
        const quote: Quote = (await quoteService.store(new Quote(attributes), null, "user-id-test")).data

        assert.instanceOf(quote, Quote)

        const updateQuote: Quote = (await quoteService.accept(quote.id, "ttotototo")).data

        assert.isNotNull(updateQuote);
        assert.instanceOf(updateQuote, Quote)

        assert.equal(updateQuote.id, quote.id);
        assert.isTrue(updateQuote.accepted);
        assert.isFalse(updateQuote.declined);
        assert.isNotNull(updateQuote.acceptedAt);
        assert.isNull(updateQuote.declinedAt);
    });

    test("Decline quote service", async ({ assert }) => {

        const attributes: QuoteAttributes = {
            accepted      : "false",
            declined      : false,
            amount        : "123",
            conversationId: "test",
            customer      : "ttotototo",
            file          : "test",
            messageId     : "toto",
            transmitter   : "user-id-test"
        }

        const quoteService = new QuoteService()
        const quote: Quote = (await quoteService.store(new Quote(attributes), null, "user-id-test")).data

        assert.instanceOf(quote, Quote)

        const updateQuote: Quote = (await quoteService.decline(quote.id, "ttotototo")).data

        assert.isNotNull(updateQuote);
        assert.instanceOf(updateQuote, Quote)

        assert.equal(updateQuote.id, quote.id);
        assert.isFalse(updateQuote.accepted);
        assert.isTrue(updateQuote.declined);
        assert.isNull(updateQuote.acceptedAt);
        assert.isNotNull(updateQuote.declinedAt);
    });
})
