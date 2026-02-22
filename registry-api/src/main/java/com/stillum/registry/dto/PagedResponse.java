package com.stillum.registry.dto;

import java.util.List;

public class PagedResponse<T> {
    
    public List<T> content;

    public int page;

    public int size;

    public long totalElements;

    public int totalPages;

    public PagedResponse() {
    }

    public PagedResponse(List<T> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = size > 0 ? (int) ((totalElements + size - 1) / size) : 0;
    }
}
