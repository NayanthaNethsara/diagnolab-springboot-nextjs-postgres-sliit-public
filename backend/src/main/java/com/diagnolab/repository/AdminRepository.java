package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.user.admin.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

}
