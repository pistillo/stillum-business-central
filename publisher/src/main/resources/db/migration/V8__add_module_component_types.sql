-- V8: Aggiunta tipi MODULE e COMPONENT alla tabella artifact

ALTER TABLE artifact
    DROP CONSTRAINT artifact_type_check;

ALTER TABLE artifact
    ADD CONSTRAINT artifact_type_check
    CHECK (type IN ('PROCESS', 'RULE', 'FORM', 'REQUEST', 'MODULE', 'COMPONENT'));
