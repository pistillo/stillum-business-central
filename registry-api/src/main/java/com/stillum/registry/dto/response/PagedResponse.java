package com.stillum.registry.dto.response;

import java.util.List;

public record PagedResponse<T>(
        List<T> items,
        int page,
        int pageSize,
        long total
) {

    public static <T> PagedResponse<T> of(List<T> items, int page, int pageSize, long total) {
        return new PagedResponse<>(items, page, pageSize, total);
    }
}
