package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CartDto;
import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto.Response getCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    @Transactional
    public CartDto.Response addItem(String email, CartDto.AddItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                        () -> cart.getItems().add(CartItem.builder()
                                .cart(cart)
                                .product(product)
                                .quantity(request.getQuantity())
                                .build())
                );

        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public CartDto.Response updateItemQuantity(String email, Long itemId, Integer quantity) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                });
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public CartDto.Response removeItem(String email, Long itemId) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartDto.Response toResponse(Cart cart) {
        var items = cart.getItems().stream()
                .map(item -> CartDto.CartItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .unitPrice(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartDto.CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.Response.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
