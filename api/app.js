const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors())

const members = {"subscriptionPeriodIdFilter":null,"members":[{"subscriptions":[],"id":"P00000085","firstName":"Daniel","lastNameOrCompanyName":"Jaun","address":"Freiburgstrasse 8, 3150 Schwarzenburg"},{"subscriptions":[{"subscriptionPeriodId":"1","subscriptionTypeId":"1","id":"318c9d74-ad6a-4345-8de6-a687501a030e","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2018 / Normalmitgliedschaft 2018"},{"subscriptionPeriodId":"2","subscriptionTypeId":"4","id":"2a764b21-8a78-4a81-9c88-c3a1317958eb","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2019 / Doppelgönnermitgliedschaft 2019"},{"subscriptionPeriodId":"3","subscriptionTypeId":"4","id":"ab7a45cc-44dc-2a1a-e0ca-a859579ab2c5","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2020 / Doppelgönnermitgliedschaft 2020"}],"id":"P00000986","firstName":"Oliver","lastNameOrCompanyName":"Jaun","address":"Monbijoustrasse 71, 3007 Bern"},{"subscriptions":[{"subscriptionPeriodId":"1","subscriptionTypeId":"1","id":"6315895c-8a5d-44de-8d5e-d162c3a58047","memberId":"P00002986","subscriptionDisplayInfo":"Vereinsjahr 2018 / Normalmitgliedschaft 2018"}],"id":"P00002986","firstName":"Elizabeth","lastNameOrCompanyName":"Jaun","address":"Monbijoustrasse 71, 3007 Bern"}]}

app.get("/members", (req, res) => {
    res.send(members);
});

const subscriptionPeriods = {"subscriptionPeriods":[{"startDate":"2020-01-01","endDate":"2020-12-31","name":"Vereinsjahr 2020","description":"","id":"3","subscriptionTypes":[{"membershipTypeId":"0","name":"Ehrenmitgliedschaft 2020","amount":0.0,"currency":"CHF","maxSubscribers":1,"id":"0","subscriptionPeriodId":"3"},{"membershipTypeId":"1","name":"Normalmitgliedschaft 2020","amount":60.0,"currency":"CHF","maxSubscribers":1,"id":"1","subscriptionPeriodId":"3"},{"membershipTypeId":"2","name":"Einzelgönnermitgliedschaft 2020","amount":200.0,"currency":"CHF","maxSubscribers":1,"id":"2","subscriptionPeriodId":"3"},{"membershipTypeId":"2","name":"Doppelgönnermitgliedschaft 2020","amount":300.0,"currency":"CHF","maxSubscribers":1,"id":"4","subscriptionPeriodId":"3"}]},{"startDate":"2018-01-01","endDate":"2018-12-31","name":"Vereinsjahr 2018","description":"","id":"1","subscriptionTypes":[{"membershipTypeId":"0","name":"Ehrenmitgliedschaft 2018","amount":0.0,"currency":"CHF","maxSubscribers":1,"id":"0","subscriptionPeriodId":"1"},{"membershipTypeId":"1","name":"Normalmitgliedschaft 2018","amount":90.0,"currency":"CHF","maxSubscribers":1,"id":"1","subscriptionPeriodId":"1"},{"membershipTypeId":"2","name":"Gönnermitgliedschaft 2018","amount":250.0,"currency":"CHF","maxSubscribers":1,"id":"2","subscriptionPeriodId":"1"},{"membershipTypeId":"3","name":"Passivmitgliedschaft 2018","amount":20.0,"currency":"CHF","maxSubscribers":1,"id":"3","subscriptionPeriodId":"1"}]},{"startDate":"2019-01-01","endDate":"2019-12-31","name":"Vereinsjahr 2019","description":"","id":"2","subscriptionTypes":[{"membershipTypeId":"0","name":"Ehrenmitgliedschaft 2019","amount":0.0,"currency":"CHF","maxSubscribers":1,"id":"0","subscriptionPeriodId":"2"},{"membershipTypeId":"1","name":"Normalmitgliedschaft 2019","amount":60.0,"currency":"CHF","maxSubscribers":1,"id":"1","subscriptionPeriodId":"2"},{"membershipTypeId":"2","name":"Einzelgönnermitgliedschaft 2019","amount":200.0,"currency":"CHF","maxSubscribers":1,"id":"2","subscriptionPeriodId":"2"},{"membershipTypeId":"3","name":"Passivmitgliedschaft 2019","amount":20.0,"currency":"CHF","maxSubscribers":1,"id":"3","subscriptionPeriodId":"2"},{"membershipTypeId":"2","name":"Doppelgönnermitgliedschaft 2019","amount":300.0,"currency":"CHF","maxSubscribers":1,"id":"4","subscriptionPeriodId":"2"}]}]};

app.get("/subscription-periods", (req, res) => {
    res.send(subscriptionPeriods);
});

const member = {"subscriptions":[{"subscriptionPeriodId":"1","subscriptionTypeId":"1","id":"318c9d74-ad6a-4345-8de6-a687501a030e","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2018 / Normalmitgliedschaft 2018"},{"subscriptionPeriodId":"2","subscriptionTypeId":"4","id":"2a764b21-8a78-4a81-9c88-c3a1317958eb","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2019 / Doppelgönnermitgliedschaft 2019"},{"subscriptionPeriodId":"3","subscriptionTypeId":"4","id":"ab7a45cc-44dc-2a1a-e0ca-a859579ab2c5","memberId":"P00000986","subscriptionDisplayInfo":"Vereinsjahr 2020 / Doppelgönnermitgliedschaft 2020"}],"id":"P00000986","firstName":"Oliver","lastNameOrCompanyName":"Jaun","address":"Monbijoustrasse 71, 3007 Bern"}

app.get("/members/P*", (req, res) => {
    res.send(member);
});

app.listen(8081, () => {
    console.log("App's running on port 8081");
});