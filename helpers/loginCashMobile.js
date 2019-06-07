module.exports = async BuyVoucherPage => {
    await BuyVoucherPage.goto('https://premier.cashonmobile.co.uk/login.php?compid=902', {timeout: 0});
    await BuyVoucherPage.click('.selected-dial-code');
    await BuyVoucherPage.click('.dial-code');
    await BuyVoucherPage.type('#txt_username', process.env.ACCOUNT_NUMBER);
    await BuyVoucherPage.type('#txt_password', process.env.ACCOUNT_M_PIN);
    await BuyVoucherPage.click('.inputwrapper.animate3.bounceIn');
};
