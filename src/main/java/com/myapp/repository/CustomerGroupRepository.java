package com.myapp.repository;

import com.myapp.domain.CustomerGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CustomerGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, Long> {}
