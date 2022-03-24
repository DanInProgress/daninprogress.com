import * as React from "react"
import { Link } from "gatsby"
import ToggleTheme from "./theme-manager"
import TopNav from "./top-nav"

import "../normalize.css"
import "../prism.css"
import "../fonts.css"
import "../style.css"
import "../colors.css"
import "../layout.css"
import "../layout-mobile.css"

const Layout = ({ location, title, children }:{location: URL, title: string, children: React.ReactNode }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div id="layout-wrapper" data-is-root-path={isRootPath}>
      <header>
        <h1 className="site-title">
          <Link to="/">{title}</Link>
        </h1>
        <TopNav>
          <Link to="/blog">Blog</Link>
          <Link to="/projects">Projects</Link>
        </TopNav>
        <ToggleTheme />
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} Dan
      </footer>
    </div>
  )
}

export default Layout
