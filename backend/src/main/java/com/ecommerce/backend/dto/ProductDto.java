package com.ecommerce.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

public class ProductDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank
        @Size(max = 255)
        private String name;

        private String description;

        @NotNull
        @DecimalMin("0.0")
        private BigDecimal price;

        @NotNull
        @Min(0)
        private Integer stockQuantity;

        @Size(max = 255)
        private String category;

        @Size(max = 500)
        private String imageUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String category;
        private String imageUrl;
    }
}
