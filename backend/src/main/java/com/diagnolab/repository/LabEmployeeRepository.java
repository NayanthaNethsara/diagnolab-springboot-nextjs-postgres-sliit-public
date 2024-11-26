package com.diagnolab.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diagnolab.entity.user.labemployee.LabEmployee;

public interface LabEmployeeRepository extends JpaRepository<LabEmployee, Long> {

}