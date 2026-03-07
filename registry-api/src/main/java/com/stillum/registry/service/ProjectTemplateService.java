package com.stillum.registry.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Carica i template di progetto dal classpath e li risolve con gli input forniti,
 * producendo una mappa di file (path → contenuto) da salvare in MinIO.
 */
@ApplicationScoped
public class ProjectTemplateService {

    private static final String TEMPLATE_BASE = "templates/module-project/files/";

    private static final List<String> TEMPLATE_FILES = List.of(
            "package.json",
            "tsconfig.json",
            "tsconfig.webpack.json",
            "webpack.config.js",
            "public/index.html",
            ".gitignore",
            "src/index.tsx",
            "src/App.tsx",
            "src/components/index.ts",
            "src/components/droplets/index.ts",
            "src/components/pools/index.ts",
            "src/components/triggers/index.ts",
            "src/components/types/index.ts"
    );

    /**
     * Genera la mappa di file del progetto risolvendo i template con gli input forniti.
     *
     * @param name        nome del modulo (es: "my-awesome-components")
     * @param description descrizione del modulo
     * @param port        porta per il dev server (default "5002")
     * @param keywords    keywords separate da virgola
     * @return mappa file (path relativo → contenuto risolto)
     */
    public Map<String, String> generateProjectFiles(String name, String description,
            String port, String keywords) {
        if (description == null || description.isBlank()) {
            description = name;
        }
        if (port == null || port.isBlank()) {
            port = "5002";
        }
        if (keywords == null) {
            keywords = "";
        }

        String kebabName = toKebabCase(name);
        String snakeName = toSnakeCase(name);
        String keywordsJson = Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(k -> !k.isEmpty())
                .map(k -> "\"" + k + "\"")
                .collect(Collectors.joining(", "));

        Map<String, String> vars = new LinkedHashMap<>();
        vars.put("{{name}}", name);
        vars.put("{{kebabName}}", kebabName);
        vars.put("{{snakeName}}", snakeName);
        vars.put("{{description}}", description);
        vars.put("{{port}}", port);
        vars.put("{{keywords}}", keywords);
        vars.put("{{keywordsJson}}", keywordsJson);

        Map<String, String> resolvedFiles = new LinkedHashMap<>();
        for (String fileName : TEMPLATE_FILES) {
            String templateContent = loadTemplate(fileName);
            String resolved = applyVariables(templateContent, vars);
            resolvedFiles.put(fileName, resolved);
        }

        return resolvedFiles;
    }

    private String loadTemplate(String fileName) {
        String resourcePath = TEMPLATE_BASE + fileName + ".tpl";
        try (InputStream is = Thread.currentThread().getContextClassLoader()
                .getResourceAsStream(resourcePath)) {
            if (is == null) {
                throw new IllegalStateException(
                        "Template non trovato nel classpath: " + resourcePath);
            }
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Errore nel caricamento del template: " + resourcePath, e);
        }
    }

    private String applyVariables(String content, Map<String, String> vars) {
        String result = content;
        for (Map.Entry<String, String> entry : vars.entrySet()) {
            result = result.replace(entry.getKey(), entry.getValue());
        }
        return result;
    }

    // --- Utilità di conversione nomi ---

    static String toKebabCase(String str) {
        return str.replaceAll("([a-z0-9])([A-Z])", "$1-$2")
                  .replace('_', '-')
                  .toLowerCase();
    }

    static String toSnakeCase(String str) {
        return str.replaceAll("-", "_")
                  .replaceAll("([a-z0-9])([A-Z])", "$1_$2")
                  .toLowerCase();
    }
}
