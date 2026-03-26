package com.example.serviceplatform.service;

import com.example.serviceplatform.dto.AuthResponse;
import com.example.serviceplatform.dto.LoginRequest;
import com.example.serviceplatform.dto.RegisterRequest;
import com.example.serviceplatform.dto.UserDto;
import com.example.serviceplatform.entity.User;
import com.example.serviceplatform.exception.ApiException;
import com.example.serviceplatform.repository.UserRepository;
import com.example.serviceplatform.security.CustomUserDetails;
import com.example.serviceplatform.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email is already registered", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(true)
                .build();

        userRepository.save(user);

        emailService.sendEmail(
            user.getEmail(),
            "Welcome to LocalService Platform, " + user.getName() + "!",
            "Your account has been successfully created. We are excited to have you on board."
        );

        String jwtToken = jwtUtils.generateToken(new CustomUserDetails(user));

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (!user.getStatus()) {
            throw new ApiException("User account is blocked", HttpStatus.FORBIDDEN);
        }

        String jwtToken = jwtUtils.generateToken(new CustomUserDetails(user));

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImageUrl(user.getProfileImageUrl())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }
}
