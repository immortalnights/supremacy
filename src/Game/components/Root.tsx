import { Provider, useAtomValue } from "jotai"
import { Outlet, useNavigate } from "react-router-dom"
import { sessionAtom, store } from "../store"
import { ReactNode, Suspense, useEffect, useRef } from "react"
import Screen from "Game/components/Screen"

function NavigationRoot({ children }: { children: ReactNode }) {
    const { id } = useAtomValue(sessionAtom) ?? {}
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onMouseDown = (_ev: MouseEvent) => {}

        const onMouseUp = (ev: MouseEvent) => {
            if (ev.button === 2) {
                ev.preventDefault()
                navigate(`/Game/${id}/SolarSystem`)
            }
        }

        const onContextMenu = (ev: Event) => {
            ev.preventDefault()
            return false
        }

        const el = ref.current

        el?.addEventListener("contextmenu", onContextMenu)
        el?.addEventListener("mousedown", onMouseDown)
        el?.addEventListener("mouseup", onMouseUp)

        return () => {
            el?.removeEventListener("contextmenu", onContextMenu)
            el?.removeEventListener("mousedown", onMouseDown)
            el?.removeEventListener("mouseup", onMouseUp)
        }
    })

    return (
        <div ref={ref} id="game-root">
            {children}
        </div>
    )
}

function LoadingScreen() {
    console.log("Rending LoadingScreen, this shouldn't happen after then initial load...")
    return (
        <Screen>
            <div style={{ flex: 1, display: "flex", justifyContent: "center", margin: "auto" }}>Loading...</div>
        </Screen>
    )
}

export default function GameRoot() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Provider store={store}>
                <NavigationRoot>
                    <Outlet />
                </NavigationRoot>
            </Provider>
        </Suspense>
    )
}
