const {
    expect,
    test
} = require("@playwright/test");

test.beforeEach(async function({
    request
}) {
    expect((await request.delete(
        "http://localhost:8081/fhir/Patient", {
            "params": {
                "identifier": "http://fhir.health.gov.lk/ips/identifier/phn|12345678"
            }
        })).status()).toBe(200);
});

test("should successfully sync tracked entity with EHR",
    async function({
        request
    }) {
        expect((await (await request.get(
            "http://localhost:8081/fhir/Patient?_format=json", {
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        )).json()).total).toBe(0)

        const trackedEntity = {
            "trackedEntities": [{
                "attributes": [{
                    "attribute": "VQl0wK3eqiw",
                    "value": "Jane Doe"
                }, {
                    "attribute": "CSZevH4P5yV",
                    "value": "ANC00000002"
                }, {
                    "attribute": "M6NNPC3hNrb",
                    "value": "200012345679"
                }, {
                    "attribute": "p7zizFkC6Lv",
                    "value": "Female"
                }, {
                    "attribute": "IrUmPkFMDU5",
                    "value": "12345678"
                }, {
                    "attribute": "u5AESfSOhIG",
                    "value": "28"
                }, {
                    "attribute": "Yie7mOY913J",
                    "value": "1997-08-01"
                }, {
                    "attribute": "gGAQeOr1Pgu",
                    "value": "+94712345678"
                }, {
                    "attribute": "EOMGwaUTMrU",
                    "value": "123 Main Street, 1234 Akurana, Kandy, Central Province, LK"
                }],
                "enrollments": [{
                    "attributes": [{
                        "attribute": "p7zizFkC6Lv",
                        "value": "Female"
                    }, {
                        "attribute": "CSZevH4P5yV",
                        "value": "ANC00000002"
                    }, {
                        "attribute": "M6NNPC3hNrb",
                        "value": "200012345679"
                    }, {
                        "attribute": "IrUmPkFMDU5",
                        "value": "12345678"
                    }, {
                        "attribute": "u5AESfSOhIG",
                        "value": "28"
                    }, {
                        "attribute": "Yie7mOY913J",
                        "value": "1997-08-01"
                    }, {
                        "attribute": "gGAQeOr1Pgu",
                        "value": "+94712345678"
                    }, {
                        "attribute": "VQl0wK3eqiw",
                        "value": "Jane Doe"
                    }, {
                        "attribute": "EOMGwaUTMrU",
                        "value": "123 Main Street, 1234 Akurana, Kandy, Central Province, LK"
                    }],
                    "enrolledAt": "2025-09-05",
                    "events": [{
                        "orgUnit": "Tnl7qgZh7zL",
                        "program": "eozjj9UivfS",
                        "programStage": "LWJcStrI6kM",
                        "scheduledAt": "2025-09-05",
                        "status": "SCHEDULE"
                    }, {
                        "orgUnit": "Tnl7qgZh7zL",
                        "program": "eozjj9UivfS",
                        "programStage": "GX0z9IXFaso",
                        "scheduledAt": "2025-09-05",
                        "status": "SCHEDULE",
                    }],
                    "occurredAt": "2025-09-05",
                    "orgUnit": "Tnl7qgZh7zL",
                    "program": "eozjj9UivfS"
                }],
                "orgUnit": "Tnl7qgZh7zL",
                "trackedEntityType": "MxdEsVAegt5"
            }]
        }

        const trackedEntityResponse = await request.post(
            "api/tracker?async=false", {
                data: trackedEntity,
                headers: {
                    "Authorization": "Basic YWRtaW46ZGlzdHJpY3Q=",
                    "Content-Type": "application/json"
                }
            });
        expect(trackedEntityResponse.status()).toBe(200);

        await expect.poll(async function() {
            return (await (await request.get(
                "http://localhost:8081/fhir/Patient?_format=json", {
                    headers: {
                        "Cache-Control": "no-store"
                    }
                }
            )).json()).total
        }).toBe(1);
    });