import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { SideNav } from "./components/SideNav.jsx";
import New from "./views/New.jsx";
import Note from "./views/Note.jsx";
import Context from "./views/Context.jsx";
import Login from "./views/Login.jsx";
import Empty from "./views/Empty.jsx";
import Layout from "./components/Layout.jsx";


function App() {

  return (
    <main className="main">

      <nav className="bg-gray-100 p-2 hidden">
        <ul className=" flex gap-2">
          <NavLink to="/" className="">
            Home
          </NavLink>
        </ul>
      </nav>

      <section className=" bg-white ">
        <div className="container mx-auto py-8 md:px-0 px-4 ">

          <div className="">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/new" element={<Layout><New /></Layout>} />
              <Route path="/empty" element={<Layout><Empty/></Layout>} />
              <Route path="/context" element={<Layout><Context/></Layout>} />
              <Route path="/notes/:id" element={<Layout><Note/></Layout>} />
            </Routes>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
