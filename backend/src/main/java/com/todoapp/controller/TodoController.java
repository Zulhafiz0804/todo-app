package com.todoapp.controller;

import com.todoapp.model.Todo;
import com.todoapp.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {
    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody Map<String, Object> request) {
        try {
            Todo todo = todoService.createTodo(
                    ((Number) request.get("userId")).longValue(),
                    (String) request.get("title"),
                    (String) request.get("description")
            );
            return ResponseEntity.ok(todo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Todo>> getUserTodos(@PathVariable Long userId) {
        return ResponseEntity.ok(todoService.getUserTodos(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Todo todo = todoService.updateTodo(
                    id,
                    (String) request.get("title"),
                    (String) request.get("description"),
                    (Boolean) request.get("completed")
            );
            return ResponseEntity.ok(todo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok(Map.of("message", "Todo deleted successfully"));
    }

    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<Todo>> getCompletedTodos(@PathVariable Long userId) {
        return ResponseEntity.ok(todoService.getCompletedTodos(userId));
    }

    @GetMapping("/user/{userId}/pending")
    public ResponseEntity<List<Todo>> getPendingTodos(@PathVariable Long userId) {
        return ResponseEntity.ok(todoService.getPendingTodos(userId));
    }
}