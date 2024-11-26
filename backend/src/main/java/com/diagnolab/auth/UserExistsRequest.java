package com.diagnolab.auth;


import com.diagnolab.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserExistsRequest {

        private Long id;
        private String username;
        private User.Role role;

}
