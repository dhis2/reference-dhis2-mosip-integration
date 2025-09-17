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
package org.hisp.dhis.integration.camel;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.camel.CamelContext;
import org.apache.camel.builder.ValueBuilder;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.model.language.DatasonnetExpression;
import org.apache.camel.support.DefaultExchange;
import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.util.StreamUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FhirBundleDataSonnetTestCase {

  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  private DefaultExchange exchange;
  private DatasonnetExpression dsExpression;

  @BeforeEach
  public void beforeEach() throws IOException {
    String dataSonnetExpression =
        StringEscapeUtils.unescapeJson(
            IOUtils.toString(
                new File("../config/dhis2/trackedEntityMap.json").toURI(),
                Charset.defaultCharset()));
    dsExpression =
        new DatasonnetExpression(
            dataSonnetExpression.substring(1, dataSonnetExpression.length() - 1));
    dsExpression.setResultType(Map.class);
    dsExpression.setBodyMediaType("application/x-java-object");
    dsExpression.setOutputMediaType("application/x-java-object");

    CamelContext camelContext = new DefaultCamelContext();

    exchange = new DefaultExchange(camelContext);
  }

  @Test
  public void testEvaluate() throws IOException {
    Map<String, Object> trackedEntity =
        OBJECT_MAPPER.readValue(
            StreamUtils.copyToString(
                    Thread.currentThread()
                        .getContextClassLoader()
                        .getResourceAsStream("trackedEntity.json"),
                    Charset.defaultCharset())
                .replace("<ANC.A.DE9>", "true"),
            Map.class);

    exchange.getMessage().setBody(trackedEntity);

    Map<String, Object> fhirBundle = new ValueBuilder(dsExpression).evaluate(exchange, Map.class);
    Map<String, Object> expectedFhirBundle =
        OBJECT_MAPPER.readValue(
            StreamUtils.copyToString(
                Thread.currentThread()
                    .getContextClassLoader()
                    .getResourceAsStream("expectedFhirBundle.json"),
                Charset.defaultCharset()),
            Map.class);

    assertEquals(expectedFhirBundle, fhirBundle);
  }

  @Test
  public void testEvaluateWhenWomanDoesNotWantToReceiveRemindersDuringPregnancy()
      throws IOException {
    Map<String, Object> trackedEntity =
        OBJECT_MAPPER.readValue(
            StreamUtils.copyToString(
                    Thread.currentThread()
                        .getContextClassLoader()
                        .getResourceAsStream("trackedEntity.json"),
                    Charset.defaultCharset())
                .replace("<ANC.A.DE9>", "false"),
            Map.class);

    exchange.getMessage().setBody(trackedEntity);

    Map<String, Object> fhirBundle = new ValueBuilder(dsExpression).evaluate(exchange, Map.class);

    assertEquals(2, ((List) fhirBundle.get("entry")).size());
    assertEquals(
        "DELETE",
        ((Map) ((Map) ((List) fhirBundle.get("entry")).get(1)).get("request")).get("method"));
  }
}
