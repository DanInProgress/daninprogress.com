import * as React from "react"
import { Link } from "gatsby"
import ToggleDark from "./toggle-dark"

const Layout = ({ location, title, children }:any) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="site-title">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="site-title" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div id="layout-wrapper" data-is-root-path={isRootPath}>
      <header>
        <h1 className="site-title">
          <Link to="/">{title}</Link>
        </h1>
        <nav>

        </nav>
        <ToggleDark />
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} Dan
      </footer>
    </div>
  )
}

export default Layout
