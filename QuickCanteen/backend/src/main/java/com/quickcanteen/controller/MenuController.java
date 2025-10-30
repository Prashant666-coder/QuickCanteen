package com.quickcanteen.controller;

import com.quickcanteen.model.MenuItem;
import com.quickcanteen.repo.InMemoryStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenu() {
        return ResponseEntity.ok(InMemoryStore.getAllMenu());
    }
}
