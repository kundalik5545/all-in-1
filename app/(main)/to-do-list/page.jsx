// app/todo/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar1, Delete, Edit, Trash } from "lucide-react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editIndex, setEditIndex] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!task) return;
    const newTodo = {
      task,
      date: selectedDate,
      completed: false,
      status: "Proposed",
    };
    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex] = newTodo;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, newTodo]);
    }
    setTask("");
    setSelectedDate(new Date());
  };

  const handleDelete = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  const handleEdit = (index) => {
    const todo = todos[index];
    setTask(todo.task);
    setSelectedDate(new Date(todo.date));
    setEditIndex(index);
  };

  const handleComplete = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    updated[index].status = updated[index].completed
      ? "Completed"
      : "In Progress";
    setTodos(updated);
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...todos];
    updated[index].status = newStatus;
    if (newStatus !== "Completed") updated[index].completed = false;
    setTodos(updated);
  };

  const renderColumn = (statusLabel) => (
    <div className="w-full md:w-1/3 space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">{statusLabel}</h2>
      {todos
        .filter((todo) => todo.status === statusLabel)
        .map((todo, index) => (
          <Card
            key={index}
            className={cn("p-4 shadow-md", todo.completed && "bg-green-100")}
          >
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleComplete(index)}
                />
                <p
                  className={cn(
                    "text-lg font-medium",
                    todo.completed && "line-through text-gray-500"
                  )}
                >
                  {todo.task}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Calendar1 size={20} /> {format(new Date(todo.date), "PPP")}
                <div className="flex ">
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit color="green" />
                  </Button>
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash color="red" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">📝 My Todo List</h1>
        <Card className="p-4 shadow-xl">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-1/2"
              />
              <div className="flex w-1/2 gap-1 relative">
                <Input
                  readOnly
                  value={format(selectedDate, "PPP")}
                  onClick={() => setCalendarOpen((prev) => !prev)}
                  className="cursor-pointer w-1/2"
                />
                {calendarOpen && (
                  <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setCalendarOpen(false);
                      }}
                      className="rounded-md border"
                    />
                  </div>
                )}
                <Button onClick={handleAddTodo} className="w-1/2">
                  {editIndex !== null ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Columns */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {renderColumn("Proposed")}
          {renderColumn("In Progress")}
          {renderColumn("Completed")}
        </div>
      </div>
    </div>
  );
}
