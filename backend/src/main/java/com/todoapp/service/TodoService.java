package com.todoapp.service;

import com.todoapp.model.Todo;
import com.todoapp.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    public Todo createTodo(Long userId, String title, String description) {
        Todo todo = Todo.builder()
                .userId(userId)
                .title(title)
                .description(description)
                .completed(false)
                .build();
        return todoRepository.save(todo);
    }

    public List<Todo> getUserTodos(Long userId) {
        return todoRepository.findByUserId(userId);
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public Todo updateTodo(Long id, String title, String description, Boolean completed) {
        Optional<Todo> todo = todoRepository.findById(id);
        if (todo.isPresent()) {
            Todo t = todo.get();
            t.setTitle(title);
            t.setDescription(description);
            t.setCompleted(completed);
            t.setUpdatedAt(System.currentTimeMillis());
            return todoRepository.save(t);
        }
        throw new RuntimeException("Todo not found");
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    public List<Todo> getCompletedTodos(Long userId) {
        return todoRepository.findByUserIdAndCompleted(userId, true);
    }

    public List<Todo> getPendingTodos(Long userId) {
        return todoRepository.findByUserIdAndCompleted(userId, false);
    }
}