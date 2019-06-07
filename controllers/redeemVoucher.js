module.exports = async (browser, numberToActivate, vouchert) => {
    try {
        const EnterVoucherPage = await browser.newPage();

        await EnterVoucherPage.goto('https://www.three.co.uk/web_top_up', {timeout: 0});

        await EnterVoucherPage.type('#topupmsisdn', numberToActivate);
        await EnterVoucherPage.click('#vouhcerLabel');
        await EnterVoucherPage.click('#button_dotopup');
        await EnterVoucherPage.waitFor('#topupvoucher');
        await EnterVoucherPage.type('#topupvoucher', voucher, {delay: 13});
        await EnterVoucherPage.click('#TopupVoucherFormSubmitButton');
        await EnterVoucherPage.waitFor(() => document.querySelector('#TopupAddonDisplayContainer'));
        await EnterVoucherPage.evaluate(()=>document.querySelector('#addon-000201-0').click());
        await EnterVoucherPage.click('#TopupVoucherAddonFormSubmitButton');
        await EnterVoucherPage.waitFor(() => document.querySelector('.top-upHeaderConverted'));
        return {
            success: true,
            msg: await EnterVoucherPage.$eval('.top-upHeaderConverted', p => p.innerText)
        };

    } catch (e) {
        console.log(e);
        return {
            success: false,
            msg: e.message
        };
    }
};
