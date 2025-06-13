package com.tatva.ims.notification;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class SampleResourceTest {
    @Test
    void testHelloEndpoint() {
        given()
          .when().get("/test")
          .then()
             .statusCode(200)
             .body(is("Hello RESTEasy"));
    }

}