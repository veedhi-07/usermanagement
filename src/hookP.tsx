// // const {value , increment, decrement, reset} = useCounter(10);

import { useState, useEffect } from "react";

// export default function useCounter(initialValue = 0) {
//   const [value, setValue] = useState(initialValue);

//   const increment = () => {
//     setValue((prev) => prev + 1);
//   };

//   const decrement = () => {
//     setValue((prev) => prev - 1);
//   };

//   const reset = () => {
//     setValue(initialValue);
//   };
//   return {
//     value,
//     increment,
//     decrement,
//     reset,
//   };
// }

// function App() {
//   const [items, setItems] = useState([""]);

//   const addItem = () => {
//     items.push("Apple");
//     setItems((prev) =>[...prev, "apple"]);
//   };

//   return (
//     <>
//       <button onClick={addItem}>Add</button>
//       {items.map((item) => (
//         <h1>{item}</h1>
//       ))}
//     </>
//   );
// }

// function App() {
//   const [count, setCount] = useState(0);

//   const handleClick = () => {
//     setCount((prev) => prev + 1);

//     console.log(count);
//   };
//   return <button onClick={handleClick}>Click</button>;
// }

// useEffect(() => {
//   fetchData();
// }, []);

function App() {
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    console.log(search);
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);
}
