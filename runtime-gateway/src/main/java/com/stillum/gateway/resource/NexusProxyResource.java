package com.stillum.gateway.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Proxy verso Nexus per evitare CORS: il frontend chiama il gateway, il gateway inoltra a Nexus.
 */
@Path("/nexus")
public class NexusProxyResource {

    @ConfigProperty(name = "nexus.base-url")
    String nexusBaseUrl;

    private final HttpClient httpClient =
            HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    @GET
    @Path("/search")
    public Response search(@QueryParam("text") String text, @QueryParam("size") Integer size) {
        if (text == null || text.isBlank()) {
            return Response.status(400).entity("text required").build();
        }
        String path =
                "/repository/npm-group/-/v1/search?text=" + URLEncoder.encode(text.trim(), StandardCharsets.UTF_8);
        if (size != null && size > 0) {
            path += "&size=" + size;
        }
        return forwardGet(path);
    }

    @GET
    @Path("/package/{name}")
    public Response packageByName(@PathParam("name") String name) {
        if (name == null || name.isBlank()) {
            return Response.status(400).entity("name required").build();
        }
        String encoded = URLEncoder.encode(name.trim(), StandardCharsets.UTF_8).replace("+", "%20");
        return forwardGet("/repository/npmjs-proxy/" + encoded);
    }

    private Response forwardGet(String path) {
        String base = nexusBaseUrl.endsWith("/") ? nexusBaseUrl.substring(0, nexusBaseUrl.length() - 1) : nexusBaseUrl;
        URI target = URI.create(base + path);
        try {
            HttpRequest request = HttpRequest.newBuilder(target).GET().timeout(Duration.ofSeconds(15)).build();
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String contentType = response.headers().firstValue("Content-Type").orElse("application/json");
            return Response.status(response.statusCode())
                    .entity(response.body())
                    .type(contentType)
                    .build();
        } catch (Exception e) {
            return Response.serverError().entity(e.getMessage()).build();
        }
    }
}
