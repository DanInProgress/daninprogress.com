import React, { useEffect, useState } from 'react';
// import '../styles/toggle.css';

type PassiveStatusCheck = (w: Window) => {
    readonly matches: boolean;
    addEventListener<K extends keyof MediaQueryListEventMap>(type: K, listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaQueryListEventMap>(type: K, listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
}



type Theme = {
    name: string
    overrideclass: string
    icon: string
    preferQuery: MediaQueryList
}

// type ThemeStatus = {
//     active: boolean
//     pinned: boolean
//     preferred: boolean
// }

// class StructuredTheme implements Theme {
//     name: string;
//     overrideclass: string;
//     icon: string;
//     constructor(name) {
//         this.name = name
//         this.overrideclass = ""
//     }
//     forceEnable(){

//     }
//     isEnabled(): ThemeStatus {

//     }

// }


class ThemeManager {
    set: Map<string,Theme> = new Map<string, Theme>()
    preferred: Map<string, boolean> = new Map<string, boolean>()
    pinned: string | null = null
    handlers: Array<(this: ThemeManager, ev: any) => void> = []
    add(theme:Theme) {
        const that = this
        this.set.set(theme.name, theme)
        this.preferred.set(theme.name, theme.preferQuery.matches)

        theme.preferQuery.addEventListener("change",(ev)=>{
            const pref = this.preferred.get(theme.name)
            if(pref !== undefined){
                if(pref === ev.matches){
                    return
                }
            }
            this.emitChange()
            this.preferred.set(theme.name, ev.matches)
            this.reset()
        })
    }
    reset() {
        if(this.pinned === null){
            return
        }
        localStorage.removeItem('pinnedTheme')
        const ocs = Array.from(this.set.values())
            .map((t)=>t.overrideclass)
        const dEl = document.documentElement
        dEl.classList.remove(...ocs)
        this.pinned = null
        this.emitChange()

    }
    load() {
        if(this.pinned !== null){
            return
        }
        const data = localStorage.getItem('pinnedTheme');
        if(data === null){
            return
        }
        const [pinnedTheme, prefStr] = data.split(":",2)
        const prefs = new Map(
            prefStr.split(",").map((v)=>
                [ v.slice(1), v.startsWith("+")]
        ))
        const allThemes = [...Object.keys({
            ...Object.fromEntries(prefs.entries()),
            ...Object.fromEntries(this.preferred.entries())
        })]
        const prefsChanged = allThemes.find((v)=>
            this.preferred.get(v) !== prefs.get(v) && 
            prefs.get(v) !== undefined
        )

        // nothing's changed, proceed
        if(prefsChanged === undefined) {
            this.pinTheme(this.set.get(pinnedTheme))
        } else {
            this.reset()
        }
    }
    pinTheme(pinnedTheme: Theme | undefined) {
        if(pinnedTheme === undefined){
            return
        }
        const ocs = Array.from(this.set.values())
            .map((t)=>t.overrideclass)
            .filter((t)=>t !== pinnedTheme.overrideclass)
        const dEl = document.documentElement
        dEl.classList.add(pinnedTheme.overrideclass)
        dEl.classList.remove(...ocs)
        this.pinned = pinnedTheme.name
        this.save()
        this.emitChange()

    }
    save() {
        const prefs: Array<string> = []
        for(const v of this.set.values()){
            const want = this.preferred.get(v.name)
            prefs.push(`${want?"+":"-"}${v.name}`)
        }
        localStorage.setItem('pinnedTheme', 
        `${this.pinned}:${prefs.join(",")}` );
    }
    getPreferredTheme(): Theme | undefined {
        if(this.pinned !== null) {
            return this.set.get(this.pinned)
        }
        for(const v of this.set.values()){
            if(this.preferred.get(v.name)){
                return v
            }
        }
    }
    getThemes(): Array<Theme> {
        return [...this.set.values()]
    }
    on(event:"change", handler: (this: ThemeManager, ev: any) => void) {
        this.handlers.push(handler)
    }
    emitChange(){
        for(const h of this.handlers ){
            h.call(this,{})
        }
    }
}


const themeList = [
    "forcelight",
    "forcedark",
]

function setTheme(themeName: string) {
    const dEl = document.documentElement
    dEl.classList.add(themeName)
    Object.keys(themeList)
        .filter((v)=>v !== themeName)
        .forEach((v)=> dEl.classList.remove(v))
}

const themeManager = new ThemeManager();
themeManager.add({
    name: "light",
    overrideclass: "forcelight",
    preferQuery: window.matchMedia('(prefers-color-scheme: light)'),
    icon: "sun"
})
themeManager.add({
    name: "dark",
    overrideclass: "forcedark",
    preferQuery: window.matchMedia('(prefers-color-scheme: dark)'),
    icon: "moon"
})
themeManager.load()

function ToggleDarkOld() {

    const [togClass, setTogClass] = useState("");

    const dEl = document.documentElement

    const theme = Object.keys(themeList)
        .find((v)=>dEl.classList.contains(v)) || (
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ?
        "forcedark" : "forcelight"
    )

    const handleOnClick = () => {
        if (togClass === "forcelight") {
            setTheme('forcedark')
            setTogClass('forcedark')
        } else {
            setTheme('forcelight')
            setTogClass('forcelight')
        }
    }

    useEffect(() => {
        setTogClass(theme)
    }, [theme])

    return (
        <div className="container--toggle">
            {
                togClass === "forcelight" ?
                <input type="checkbox" id="toggle" className="toggle--checkbox" onClick={handleOnClick} checked />
                :
                <input type="checkbox" id="toggle" className="toggle--checkbox" onClick={handleOnClick} />
            }
            <label htmlFor="toggle" className="toggle--label">
                <span className="toggle--label-background"></span>
            </label>
        </div>
    )
}

function ToggleDark() {
    
    const [togClass, setTogClass] = useState(themeManager.getPreferredTheme()?.name);

    const dEl = document.documentElement

    const themeList = themeManager.getThemes()
    const currentThemeIdx = themeList.findIndex((v)=>v.name === togClass)
    const nextTheme = themeList.at((currentThemeIdx + 1) % themeList.length)

    const handleOnClick = () => {
        themeManager.pinTheme(nextTheme)
    }

    useEffect(() => {
        themeManager.on("change",function(ev){
            setTogClass(this.getPreferredTheme()?.name)
        })
    }, [0])

    return (
        <div className="theme-toggle">
            <i className={`fa-${nextTheme?.icon}`} onClick={handleOnClick} >{nextTheme?.name}</i>
        </div>
    )
}

export default ToggleDark;
