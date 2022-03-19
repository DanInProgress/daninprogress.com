import React, { ReactChildren, ReactNode } from "react"
import { Children } from "react"


export const TopNav = ({children}:{children:ReactNode}) => {

    return <nav className="site-nav">
        {/* <input type="checkbox" id="menuToggle" />
        <label htmlFor="menuToggle" ><span>&times;</span><span>&#9776;</span></label> */}
        <React.Fragment>{children}</React.Fragment>
    </nav>
}

export default TopNav