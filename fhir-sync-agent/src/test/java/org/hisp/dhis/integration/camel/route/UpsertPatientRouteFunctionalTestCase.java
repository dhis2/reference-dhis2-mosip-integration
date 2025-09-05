/*
 * Copyright (c) 2004-2025, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.hisp.dhis.integration.camel.route;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.builder.AdviceWith;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.test.spring.junit5.UseAdviceWith;
import org.hisp.dhis.api.model.v40_2_2.AttributeInfo;
import org.hisp.dhis.api.model.v40_2_2.EnrollmentInfo;
import org.hisp.dhis.api.model.v40_2_2.EventInfo;
import org.hisp.dhis.api.model.v40_2_2.TrackedEntityInfo;
import org.hisp.dhis.api.model.v40_2_2.TrackerImportReport;
import org.hisp.dhis.integration.camel.AbstractFunctionalTestCase;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Patient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@UseAdviceWith
public class UpsertPatientRouteFunctionalTestCase extends AbstractFunctionalTestCase {
  @Autowired private CamelContext camelContext;

  @Autowired private ObjectMapper objectMapper;

  private CamelContext authorisationServerCamelContext;

  @BeforeEach
  public void beforeEach() throws Exception {
    authorisationServerCamelContext = mockAuthorisationServer();
    authorisationServerCamelContext.start();
  }

  @AfterEach
  public void afterEach() throws Exception {
    authorisationServerCamelContext.close();
  }

  private CamelContext mockAuthorisationServer() throws Exception {
    CamelContext authorisationServerCamelContext = new DefaultCamelContext(false);
    authorisationServerCamelContext.addRoutes(
        new RouteBuilder() {
          @Override
          public void configure() {
            from("jetty:" + authorisationServerUrl)
                .process(
                    exchange -> {
                      assertEquals(
                          "Basic bmVoci1jbGllbnQ6cGFzc3cwcmQ=",
                          exchange.getMessage().getHeader("Authorization"));
                      assertEquals(
                          "grant_type=client_credentials",
                          exchange.getMessage().getBody(String.class));
                    })
                .setBody(
                    (Function<Exchange, Object>)
                        exchange ->
                            Map.of(
                                "access_token",
                                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOGZSMXNmQzlQb0IxTlcyTTRHUnN4d1UzdUZfYmNjUGNseWt2WVU5c2pRIn0.eyJleHAiOjE3MjczNDg0MTMsImlhdCI6MTcyNzM0ODExMywianRpIjoiN2E4OWQxYWQtOWY4OS00ZDVhLWI4MWItNDU1NjRkZDNjMTNjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL2NpdmlsLXJlZ2lzdHJ5IiwiYXVkIjpbImFjY291bnQiLCJjaXZpbC1yZWdpc3RyeS1jbGllbnQiXSwic3ViIjoiY2Y4NmFkY2QtMzIyNi00MWZmLThjY2EtMWJiM2FjNzUyOGM5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2l2aWwtcmVnaXN0cnktY2xpZW50IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1jaXZpbC1yZWdpc3RyeSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTkyLjE2OC45Ni4xIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtY2l2aWwtcmVnaXN0cnktY2xpZW50IiwiY2xpZW50QWRkcmVzcyI6IjE5Mi4xNjguOTYuMSIsImNsaWVudF9pZCI6ImNpdmlsLXJlZ2lzdHJ5LWNsaWVudCJ9.MYcQDPNz7Z4URYcLOH3v60bNxkqJlyWvYPWIBWp_VYKKZrmTXH2nvG3hPkF8aTHT2P-Kom5iQSwrZz519WB16X-qVYCdvqnCQY1poRITnAXOsjF3I1Ymli29vWdKJvkn7aXmEYn54c00VvfyjCfKbjOweKa-UdIXjfcO8hATP7neo-UiNQ6a7-Sj2TEwGDBFc989Sj40JjIVh6G6rH2h5zte8mxZy1RZUhXDp3DppHZB0ddfrk5rkECLITfsAg6pzyHmzaPYOq8kSRis59yzKgWCXurkq4WOw9-Rz7oNIc1CfPan_8YvYtsnYUG35Rh44UU6cWJnyv1sDIgyUHPIZw",
                                "expires_in",
                                300,
                                "refresh_expires_in",
                                0,
                                "token_type",
                                "Bearer",
                                "not-before-policy",
                                0,
                                "scope",
                                "email profile"))
                .marshal()
                .json();
          }
        });

    return authorisationServerCamelContext;
  }

  @Test
  public void testUpsertPatient() throws Exception {
    AdviceWith.adviceWith(camelContext, "upsertPatient", r -> r.weaveAddLast().to("mock:spy"));
    MockEndpoint spyEndpoint = camelContext.getEndpoint("mock:spy", MockEndpoint.class);
    spyEndpoint.setExpectedCount(1);

    camelContext.start();

    String orgUnit = "Tnl7qgZh7zL";
    TrackedEntityInfo trackedEntity = new TrackedEntityInfo()
        .withOrgUnit(orgUnit)
        .withTrackedEntityType("MxdEsVAegt5")
        .withAttributes(List.of(
            new AttributeInfo().withAttribute("VQl0wK3eqiw").withValue("Jane Doe"),
            new AttributeInfo().withAttribute("CSZevH4P5yV").withValue("ANC00000002"),
            new AttributeInfo().withAttribute("M6NNPC3hNrb").withValue("200012345679"),
            new AttributeInfo().withAttribute("p7zizFkC6Lv").withValue("Female"),
            new AttributeInfo().withAttribute("IrUmPkFMDU5").withValue("12345678"),
            new AttributeInfo().withAttribute("u5AESfSOhIG").withValue("28"),
            new AttributeInfo().withAttribute("Yie7mOY913J").withValue("1997-08-01"),
            new AttributeInfo().withAttribute("gGAQeOr1Pgu").withValue("+94712345678"),
            new AttributeInfo().withAttribute("EOMGwaUTMrU").withValue("123 Main Street, 1234 Akurana, Kandy, Central Province, LK")))
        .withEnrollments(
            addEnrollment(
                orgUnit,
                List.of("LWJcStrI6kM", "GX0z9IXFaso")));

    dhis2Client
        .post("tracker")
        .withResource(Map.of("trackedEntities", List.of(trackedEntity)))
        .withParameter("async", "false")
        .transfer()
        .returnAs(TrackerImportReport.class)
        .getBundleReport()
        .get()
        .getTypeReportMap()
        .get()
        .getAdditionalProperties()
        .get("ENROLLMENT")
        .getObjectReports()
        .get()
        .get(0)
        .getUid()
        .get()
        .toString();

    spyEndpoint.assertIsSatisfied(30000);
    Bundle patientBundle = (Bundle) fhirClient.search().forResource(Patient.class).execute();
    List<Bundle.BundleEntryComponent> entries = patientBundle.getEntry();
    assertEquals(1, entries.size());
    Patient patient = (Patient) entries.get(0).getResource();
    assertEquals("12345678", patient.getIdentifier().get(0).getValue());
  }

  public List<EnrollmentInfo> addEnrollment(String orgUnitId, List<String> programStageIds) {
    List<EventInfo> events = new ArrayList<>();

    String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    for (String programStage : programStageIds) {
      events.add(
          new EventInfo()
              .withProgramStage(programStage)
              .withOrgUnit(orgUnitId)
              .withScheduledAt(today)
              .withProgram("eozjj9UivfS")
              .withStatus(EventInfo.StatusRef.SCHEDULE));
    }

    return List.of(
        new EnrollmentInfo()
            .withOrgUnit(orgUnitId)
            .withProgram("eozjj9UivfS")
            .withEnrolledAt(today)
            .withAttributes(
                List.of(
                    new AttributeInfo().withAttribute("p7zizFkC6Lv").withValue("Female"),
                    new AttributeInfo().withAttribute("CSZevH4P5yV").withValue("ANC00000002"),
                    new AttributeInfo().withAttribute("M6NNPC3hNrb").withValue("200012345679"),
                    new AttributeInfo().withAttribute("IrUmPkFMDU5").withValue("12345678"),
                    new AttributeInfo().withAttribute("u5AESfSOhIG").withValue("28"),
                    new AttributeInfo().withAttribute("Yie7mOY913J").withValue("1997-08-01"),
                    new AttributeInfo().withAttribute("gGAQeOr1Pgu").withValue("+94712345678"),
                    new AttributeInfo().withAttribute("VQl0wK3eqiw").withValue("Joe Doe"),
                    new AttributeInfo().withAttribute("EOMGwaUTMrU").withValue("123 Main Street, 1234 Akurana, Kandy, Central Province, LK")))
            .withOccurredAt(today)
            .withStatus(EnrollmentInfo.StatusRef.ACTIVE)
            .withEvents(events));
  }
}
