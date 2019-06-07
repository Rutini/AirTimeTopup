const puppeteer = require('puppeteer');
const redeemVoucher = require('./redeemVoucher');
const loginCashMobile = require('../helpers/loginCashMobile');

module.exports = async (req, res) => {
    try {
        const {phone} = req.query;

        const numberToActivateLocalFormat = phone.slice(1);

        const browser = await puppeteer.launch({});

        const BuyVoucherPage = await browser.newPage();

        await loginCashMobile(BuyVoucherPage);

        const currentUrl = await BuyVoucherPage.url();

        while (currentUrl === process.env.WRONG_LOGIN_URL) {
            await loginCashMobile(BuyVoucherPage);
            await BuyVoucherPage.goto('https://premier.cashonmobile.co.uk/dom_topup.php', {timeout: 0});
        }

        await BuyVoucherPage.goto('https://premier.cashonmobile.co.uk/dom_topup.php', {timeout: 0});
        await BuyVoucherPage.waitFor('#lst_operators');
        await BuyVoucherPage.click('#lst_operators');
        await BuyVoucherPage.select('select#lst_operators', '14');
        await BuyVoucherPage.type('#txt_mobile_number', numberToActivateLocalFormat, {delay: 40});
        await BuyVoucherPage.select('select#lst_denominations', '53');
        await BuyVoucherPage.click('#next');

        await BuyVoucherPage.waitFor(() => document.querySelector('#second').style.display === 'block');

        await BuyVoucherPage.type('#txt_tpin', process.env.ACCOUNT_T_PIN, {delay: 80});
        await BuyVoucherPage.click('.btn.btn-success.ui-wizard-content.ui-formwizard-button');

        await BuyVoucherPage.waitFor(() => document.querySelector('#third').style.display === 'block');

        const printButton = await BuyVoucherPage.$eval('.btn.btn-danger', a => a.href);
        const regExp = /\'([^']+)\'/;
        const [badHrefToVoucher] = regExp.exec(printButton);
        const hrefToVoucher = badHrefToVoucher.replace(/'/g, '');

        const getVoucherNumber = await browser.newPage();

        await getVoucherNumber.goto(`https://premier.cashonmobile.co.uk/${hrefToVoucher}`);
        const voucher = await getVoucherNumber.$eval('div[class=center]', div => {
            const innerText = div.innerText;
            const [, voucherNumber] = innerText.split('\n');
            return voucherNumber;
        });

        const response = await redeemVoucher(browser, phone, voucher);

        res.json(response);
    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            msg: e.message
        });
    }
};
