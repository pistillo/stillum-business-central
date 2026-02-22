package com.stillum.publisher.service;

import com.stillum.publisher.dto.ValidationError;
import com.stillum.publisher.dto.ValidationResult;
import jakarta.enterprise.context.ApplicationScoped;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.StringReader;

@ApplicationScoped
public class ValidationService {

    public ValidationResult validateBpmn(String xml) {
        ValidationResult result = new ValidationResult(true);
        
        if (xml == null || xml.isBlank()) {
            result.addError(1, 1, "BPMN XML content is empty", "ERROR");
            return result;
        }

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputSource source = new InputSource(new StringReader(xml));
            Document doc = builder.parse(source);

            // Check for required BPMN elements
            NodeList processes = doc.getElementsByTagNameNS("http://www.omg.org/spec/BPMN/20100524/MODEL", "process");
            if (processes.getLength() == 0) {
                result.addError(1, 1, "No BPMN process found", "ERROR");
                return result;
            }

            // Validate that process has an id
            String processId = processes.item(0).getAttributes().getNamedItem("id").getNodeValue();
            if (processId == null || processId.isBlank()) {
                result.addError(2, 1, "Process must have an id attribute", "ERROR");
            }

        } catch (SAXException e) {
            result.addError(1, 1, "XML parsing error: " + e.getMessage(), "ERROR");
        } catch (ParserConfigurationException e) {
            result.addError(1, 1, "Parser configuration error: " + e.getMessage(), "ERROR");
        } catch (IOException e) {
            result.addError(1, 1, "IO error: " + e.getMessage(), "ERROR");
        } catch (Exception e) {
            result.addError(1, 1, "Validation error: " + e.getMessage(), "ERROR");
        }

        return result;
    }

    public ValidationResult validateDmn(String xml) {
        ValidationResult result = new ValidationResult(true);
        
        if (xml == null || xml.isBlank()) {
            result.addError(1, 1, "DMN XML content is empty", "ERROR");
            return result;
        }

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputSource source = new InputSource(new StringReader(xml));
            Document doc = builder.parse(source);

            // Check for required DMN elements
            NodeList decisions = doc.getElementsByTagNameNS("https://www.omg.org/spec/DMN/20191111/MODEL/", "decision");
            if (decisions.getLength() == 0) {
                result.addError(1, 1, "No DMN decision found", "ERROR");
                return result;
            }

            // Validate that decision has an id
            String decisionId = decisions.item(0).getAttributes().getNamedItem("id").getNodeValue();
            if (decisionId == null || decisionId.isBlank()) {
                result.addError(2, 1, "Decision must have an id attribute", "ERROR");
            }

        } catch (SAXException e) {
            result.addError(1, 1, "XML parsing error: " + e.getMessage(), "ERROR");
        } catch (ParserConfigurationException e) {
            result.addError(1, 1, "Parser configuration error: " + e.getMessage(), "ERROR");
        } catch (IOException e) {
            result.addError(1, 1, "IO error: " + e.getMessage(), "ERROR");
        } catch (Exception e) {
            result.addError(1, 1, "Validation error: " + e.getMessage(), "ERROR");
        }

        return result;
    }

    public ValidationResult validateForm(String json) {
        ValidationResult result = new ValidationResult(true);
        
        if (json == null || json.isBlank()) {
            result.addError(1, 1, "Form JSON is empty", "ERROR");
            return result;
        }

        try {
            // Basic JSON validation
            if (!json.trim().startsWith("{") || !json.trim().endsWith("}")) {
                result.addError(1, 1, "Form must be a valid JSON object", "ERROR");
                return result;
            }

            // Try to parse to ensure it's valid JSON
            new com.fasterxml.jackson.databind.ObjectMapper().readValue(json, Object.class);

        } catch (Exception e) {
            result.addError(1, 1, "JSON parsing error: " + e.getMessage(), "ERROR");
        }

        return result;
    }

    public ValidationResult validateRequest(String json) {
        ValidationResult result = new ValidationResult(true);
        
        if (json == null || json.isBlank()) {
            result.addError(1, 1, "Request JSON is empty", "ERROR");
            return result;
        }

        try {
            // Basic JSON validation
            if (!json.trim().startsWith("{") || !json.trim().endsWith("}")) {
                result.addError(1, 1, "Request must be a valid JSON object", "ERROR");
                return result;
            }

            // Try to parse to ensure it's valid JSON
            new com.fasterxml.jackson.databind.ObjectMapper().readValue(json, Object.class);

        } catch (Exception e) {
            result.addError(1, 1, "JSON parsing error: " + e.getMessage(), "ERROR");
        }

        return result;
    }
}
