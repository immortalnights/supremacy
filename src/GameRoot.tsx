import { Provider, useAtomValue } from "jotai"
import { Outlet, useNavigate } from "react-router-dom"
import { sessionAtom, store } from "./Game/store"
import { ReactNode, Suspense, useEffect, useRef } from "react"

function NavigationRoot({ children }: { children: ReactNode }) {
    const { id } = useAtomValue(sessionAtom) ?? {}
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onMouseDown = (ev: MouseEvent) => {
            ev.preventDefault()
        }
        const onMouseUp = (ev: MouseEvent) => {
            ev.preventDefault()
            if (ev.button === 2) {
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

export default function GameRoot() {
    return (
        <Suspense fallback="Loading...">
            <Provider store={store}>
                <NavigationRoot>
                    <Outlet />
                </NavigationRoot>
            </Provider>
        </Suspense>
    )
}
