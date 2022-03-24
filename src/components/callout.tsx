 import * as React from "react"


import "../callout.css"

const types: {[t:string]: any} = {
     construction: {
         icon: "\uf807"
     }
 }


 const Callout = ({type, children}:{type: string, children: React.ReactNode}) => {

    const conf = types[type]; 
    return (
        <div className={`callout ${conf.cssClass || type}`}>
            <i className="fa icon">{conf.icon}</i>
            <span className="text">{children}</span>
        </div>
    )
 }
 
 export default Callout
 