{
    resources_for_anc_visit_event(ds, tei, event) ::
    local VISIT_ID = "GX0z9IXFaso";
    local ATTR_PHN     = "IrUmPkFMDU5";

    if (event.programStage default null) != VISIT_ID then [] else

    local getAttrById(attr) = ds.filter(tei.enrollments[0].attributes, function(v, i) v.attribute == attr)[0].value default null;
    local phnValue = getAttrById(ATTR_PHN);
    local subjectReference = "Patient?identifier=http://fhir.health.gov.lk/ips/identifier/phn|" + (phnValue default "");
    local eventId = event.event default null;

    local encounterReference = "Encounter?identifier=urn:dhis2:eventId|" + eventId;
    local effectiveDateTime = (event.completedAt default event.occurredAt);
    local dataValues = event.dataValues default [];
    local getDeById(id) = ds.filter(dataValues, function(v, i) v.dataElement == id)[0].value default null;
    local observationId(dataElementId) = "observation:" + eventId + "-" + dataElementId;

    local stringToBool(s) =
        if s == "true" then true
        else if s == "false" then false
        else error "invalid boolean: " + std.manifestJson(s);

    local asInt(value) = if value == null then null else std.parseInt(value);
    local asFloat(value) = if value == null then null else std.parseJson(value);
    local asBoolean(value) = if value == null then null else stringToBool(value);

    ds.filter([
        // POA (weeks) (INTEGER_POSITIVE)
        if getDeById("gu4sr8eOZcT") != null then {
            fullUrl: "urn:uuid:" + observationId("gu4sr8eOZcT"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier:  [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "gu4sr8eOZcT"
                    }
                ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam" 
                        } ],
                    }
                ],
                code: {
                    coding: [ {
                        system: "urn:dhis2:dataElement",
                        code: "gu4sr8eOZcT",
                        display: "POA (weeks)"
                        }
                    ],
                    text: "POA (weeks)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueInteger: asInt(getDeById("gu4sr8eOZcT"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|gu4sr8eOZcT"
            }
        } else null,

        // Pallor - BOOLEAN
        if getDeById("Sx8XEKmdhFf") != null then {
            fullUrl: "urn:uuid:" + observationId("Sx8XEKmdhFf"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                system: "urn:dhis2:dataelement:uid",
                value: "Sx8XEKmdhFf"
                } ],
                category: [ {
                coding: [ {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "exam",
                    display: "Exam"
                } ]
                } ],
                code: {
                coding: [ {
                    system: "http://snomed.info/sct",
                    code: "1209208002",
                    display: "Pallor of skin of face (finding)"
                } ],
                text: "Pallor"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("Sx8XEKmdhFf"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|Sx8XEKmdhFf"
            }
        } else null,

        // Ankle Oedema - BOOLEAN
        if getDeById("k7K4aO0RXew") != null then {
            fullUrl: "urn:uuid:" + observationId("k7K4aO0RXew"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "k7K4aO0RXew"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "26237000",
                        display: "Ankle edema (finding)"
                    } ],
                    text: "Ankle Oedema"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("k7K4aO0RXew"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|k7K4aO0RXew"
            }
        } else null,

        // Facial Oedema - BOOLEAN
        if getDeById("mLZ4hxy2pGQ") != null then {
            fullUrl: "urn:uuid:" + observationId("mLZ4hxy2pGQ"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "mLZ4hxy2pGQ"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "445088006",
                        display: "Edema of face (finding)"
                    } ],
                    text: "Facial Oedema"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("mLZ4hxy2pGQ"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|mLZ4hxy2pGQ"
            }
        } else null,

         // Systolic Blood Pressure (mmHg) - INTEGER_POSITIVE
        if getDeById("Y3xF4qecAVw") != null then {
            fullUrl: "urn:uuid:" + observationId("Y3xF4qecAVw"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "Y3xF4qecAVw"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "vital-signs",
                        display: "Vital Signs"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "271649006",
                        display: "Systolic blood pressure (observable entity)"
                    } ],
                    text: "Systolic Blood Pressure (mmHg)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueInteger: asInt(getDeById("Y3xF4qecAVw"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|Y3xF4qecAVw"
            }
        } else null,

        // Diastolic Blood Pressure (mmHg) - INTEGER_POSITIVE
        if getDeById("QMCuOLLRHHD") != null then {
            fullUrl: "urn:uuid:" + observationId("QMCuOLLRHHD"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "QMCuOLLRHHD"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "vital-signs",
                        display: "Vital Signs"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "271650006",
                        display: "Diastolic blood pressure (observable entity)"
                    } ],
                    text: "Diastolic Blood Pressure (mmHg)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueInteger: asInt(getDeById("QMCuOLLRHHD"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|QMCuOLLRHHD"
            }
        } else null,

        // Fundal Height (cm) - INTEGER_POSITIVE
        if getDeById("aDaoKP0DB1c") != null then {
            fullUrl: "urn:uuid:" + observationId("aDaoKP0DB1c"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "aDaoKP0DB1c"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "364253002",
                        display: "Fundal height of uterus (observable entity)"
                    } ],
                    text: "Fundal Height (cm)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueInteger: asInt(getDeById("aDaoKP0DB1c"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|aDaoKP0DB1c"
            }
        } else null,

        // Foetal Movements - TRUE_ONLY (need to be present if recorded in DHIS2)
        if getDeById("Ei55u2kvdzm") != null then {
            fullUrl: "urn:uuid:" + observationId("Ei55u2kvdzm"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "Ei55u2kvdzm"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "268470003",
                        display: "Fetal movements felt (finding)"
                    } ],
                    text: "Foetal Movements"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: true
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|Ei55u2kvdzm"
            }
        } else null,

        // Foetal Heart Sounds (FHS) - TRUE_ONLY
        if getDeById("xTsKEMPT2so") != null then {
            fullUrl: "urn:uuid:" + observationId("xTsKEMPT2so"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "xTsKEMPT2so"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "249045009",
                        display: "Fetal heart sounds present (finding)"
                    } ],
                    text: "Foetal Heart Sounds (FHS)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: true
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|xTsKEMPT2so"
            }
        } else null,

        // Urine Sugar - BOOLEAN
        if getDeById("yQk0w6KiXHJ") != null then {
            fullUrl: "urn:uuid:" + observationId("yQk0w6KiXHJ"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "yQk0w6KiXHJ"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "laboratory",
                        display: "Laboratory"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "167262009",
                        display: "Urine glucose test = trace (finding)"
                    } ],
                    text: "Urine Sugar"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("yQk0w6KiXHJ"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|yQk0w6KiXHJ"
            }
        } else null,

        // Urine Albumin - BOOLEAN
        if getDeById("VlLlBQbxmE5") != null then {
            fullUrl: "urn:uuid:" + observationId("VlLlBQbxmE5"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "VlLlBQbxmE5"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "laboratory",
                        display: "Laboratory"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "271000000",
                        display: "Urine albumin measurement (procedure)"
                    } ],
                    text: "Urine Albumin"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("VlLlBQbxmE5"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|VlLlBQbxmE5"
            }
        } else null,

        // Blood Sugar (mg/dl) - INTEGER_POSITIVE
        if getDeById("CbZCIisQAzv") != null then {
            fullUrl: "urn:uuid:" + observationId("CbZCIisQAzv"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "CbZCIisQAzv"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "laboratory",
                        display: "Laboratory"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "33747003",
                        display: "Glucose measurement, blood (procedure)"
                    } ],
                    text: "Blood Sugar (mg/dl)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueInteger: asInt(getDeById("CbZCIisQAzv"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|CbZCIisQAzv"
            }
        } else null,

        // Hb (g/dl) - NUMBER
        if getDeById("cw35l7X4hnV") != null then {
            fullUrl: "urn:uuid:" + observationId("cw35l7X4hnV"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "cw35l7X4hnV"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "laboratory",
                        display: "Laboratory"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "104718002",
                        display: "Hemoglobin, free measurement (procedure)"
                    } ],
                    text: "Hb (g/dl)"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueDecimal: asFloat(getDeById("cw35l7X4hnV"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|cw35l7X4hnV"
            }
        } else null,

        // Iron Folate - TRUE_ONLY -> include medicationStatement if DHIS2 data element is true
        if getDeById("p7yWXAO6ag7") != null then {
            fullUrl: "urn:uuid:" + observationId("p7yWXAO6ag7"),
            resource: {
                resourceType: "MedicationStatement",
                status: "active",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "p7yWXAO6ag7"
                } ],
                medicationCodeableConcept: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "418558000",
                        display: "Product containing ferrous sulfate and folic acid (medicinal product)"
                    } ],
                    text: "Iron Folate"
                },
                subject: { reference: subjectReference },
                context: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime
            },
            request: {
                method: "PUT",
                url: "MedicationStatement?identifier=urn:dhis2:dataelement:uid|p7yWXAO6ag7"
            }
        } else null,

        // Vitamin C - TRUE_ONLY -> MedicationStatement (present)
        if getDeById("GCHralHLuAB") != null then {
            fullUrl: "urn:uuid:" + observationId("GCHralHLuAB"),
            resource: {
                resourceType: "MedicationStatement",
                status: "active",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "GCHralHLuAB"
                } ],
                medicationCodeableConcept: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "43706004",
                        display: "Ascorbic acid (substance)"
                    } ],
                    text: "Vitamin C"
                },
                subject: { reference: subjectReference },
                context: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime
            },
            request: {
                method: "PUT",
                url: "MedicationStatement?identifier=urn:dhis2:dataelement:uid|GCHralHLuAB"
            }
        } else null,

        // Calcium - TRUE_ONLY -> MedicationStatement (present)
        if getDeById("Kh4Xr0VkC8w") != null then {
            fullUrl: "urn:uuid:" + observationId("Kh4Xr0VkC8w"),
            resource: {
                resourceType: "MedicationStatement",
                status: "active",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "Kh4Xr0VkC8w"
                } ],
                medicationCodeableConcept: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "5540006",
                        display: "Calcium (substance)"
                    } ],
                    text: "Calcium"
                },
                subject: { reference: subjectReference },
                context: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime
            },
            request: {
                method: "PUT",
                url: "MedicationStatement?identifier=urn:dhis2:dataelement:uid|Kh4Xr0VkC8w"
            }
        } else null,

        // Special findings - LONG_TEXT
        if getDeById("XMMTan4EEsB") != null then {
            fullUrl: "urn:uuid:" + observationId("XMMTan4EEsB"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "XMMTan4EEsB"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "urn:dhis2:dataElement",
                        code: "XMMTan4EEsB",
                        display: "Special findings"
                    } ],
                    text: "Special findings"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueString: getDeById("XMMTan4EEsB")
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|XMMTan4EEsB"
            }
        } else null,

        // Need Referral - BOOLEAN
        if getDeById("la93qSXMNCI") != null then {
            fullUrl: "urn:uuid:" + observationId("la93qSXMNCI"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "la93qSXMNCI"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "exam",
                        display: "Exam"
                    } ]
                } ],
                code: {
                    coding: [ {
                        system: "http://snomed.info/sct",
                        code: "183924009",
                        display: "Referral needed"
                    } ],
                    text: "Need Referral"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueBoolean: asBoolean(getDeById("la93qSXMNCI"))
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|la93qSXMNCI"
            }
        } else null,

        // Reason for Referral - TEXT
        if getDeById("kLAB3XIylS8") != null then {
            fullUrl: "urn:uuid:" + observationId("kLAB3XIylS8"),
            resource: {
                resourceType: "Observation",
                status: "final",
                identifier: [ {
                    system: "urn:dhis2:dataelement:uid",
                    value: "kLAB3XIylS8"
                } ],
                category: [ {
                    coding: [ {
                        system: "http://terminology.hl7.org/CodeSystem/observation-category",
                        code: "survey",
                        display: "Survey"
                    } ]
                } ],
                code: {
                coding: [ {
                    system: "http://snomed.info/sct",
                    code: "716101000000104",
                    display: "Reason for referral (record artifact)"
                } ],
                text: "Reason for Referral"
                },
                subject: { reference: subjectReference },
                encounter: { reference: encounterReference },
                effectiveDateTime: effectiveDateTime,
                valueString: getDeById("kLAB3XIylS8")
            },
            request: {
                method: "PUT",
                url: "Observation?identifier=urn:dhis2:dataelement:uid|kLAB3XIylS8"
            }
        } else null
    ], function(x) x != null)
}
