import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function getTodos() {
      setIsLoading(true);
      try {
        const response = await fetch(import.meta.env.VITE_API_URL);
        if (!response.ok) throw new Error("todos not found");
        const data = await response.json();
        setTodos(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
        setTodos(null);
      } finally {
        setIsLoading(false);
      }
    }
    getTodos();
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    if (input.trim() === "") return;
    try {
      const respons = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ todo: input }),
      });
      const data = await respons.json();

      setTodos((prevTodos) => [...prevTodos, data]);
      setInput("");

      window.location.replace("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlerDelete(id) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + id, {
        method: "DELETE",
      });
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlerComplited(id, item) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo: item.todo,
          completed: !item.completed,
        }),
      });
      const data = await response.json();

      setTodos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="bg-white py-9 px-7 rounded-lg mx-auto max-w-85">
      <h1 className="uppercase text-xs font-medium">My Task</h1>
      <h2 className="text-3xl mb-2">What's on today?</h2>
      <form onSubmit={submitHandler} className="flex gap-4">
        <input
          type="text"
          className="border rounded border-gray-200 px-4 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-gray-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text"
        />
        <button
          type="submit"
          className=" py-1 px-4 text-blue-800 rounded hover:bg-blue-300 cursor-pointer bg-blue-200"
        >
          add
        </button>
      </form>
      {isLoading ? (
        <p>Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        todos &&
        todos.map((item) => (
          <div
            key={item._id}
            className="flex justify-between align-middle gap-5 border-b py-3"
          >
            <div className="flex gap-3">
              <input
                type="checkbox"
                checked={item.complited}
                onChange={() => handlerComplited(item._id, item)}
              />
              <p className={item.complited ? "line-through" : "" + "truncate"}>
                {item.todo}
              </p>
            </div>
            <button onClick={() => handlerDelete(item._id)}>X</button>
          </div>
        ))
      )}
      {todos && (
        <p className="text-center mt-4">
          {todos.filter((item) => item.complited).length} of {todos.length}{" "}
          tasks complete
        </p>
      )}
    </div>
  );
}
