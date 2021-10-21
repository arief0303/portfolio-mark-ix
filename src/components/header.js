import React from "react";

export default function Header() {
  return (
    <header>
      <div className='header-inner'>
        <div className='logo'><img src="../logo192.png" alt="logo" width="20" height="20" /> Arief R. Syauqie</div>
        <nav>
          <ul>
            {/* <li>
              <a href='/'>Home</a>
            </li>
            <li>
              <a href='/'>Art Portfolio</a>
            </li> */}
            {/* <li>
              <a href='/'>discover</a>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
